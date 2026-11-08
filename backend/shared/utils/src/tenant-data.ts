/**
 * Copying a tenant's setup into a new tenant, and removing a tenant's data.
 * Used for sandbox tenants (docs/ADR/ADR-0017-sandbox-tenants.md). Each
 * service runs these against its own database; foundation orchestrates.
 *
 * Copy: rows are copied with new primary keys derived from the target tenant
 * and the old key (sandboxRowId), so every reference to a copied row, in this
 * database or another, maps to the same new key without a lookup table. Any
 * uuid (or uuid[]) column whose value is the key of a copied row is
 * remapped; other values (global catalogue rows, the creating user) are kept.
 * `externalIds` are keys copied by other services (for example foundation
 * facilities and staff referenced from clinical), so they are remapped too.
 *
 * Purge: deletes every row with the tenant's tenant_id from every table that
 * has one, retrying tables blocked by foreign keys; child tables without a
 * tenant_id go through ON DELETE CASCADE.
 */

import { createHash } from 'crypto';

/** The raw-SQL slice of a Prisma client (or transaction client) this module uses. */
export interface RawSqlClient {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
}

export interface TransactionalSqlClient extends RawSqlClient {
  $transaction<R>(fn: (tx: RawSqlClient) => Promise<R>, options?: { maxWait?: number; timeout?: number }): Promise<R>;
}

export interface CopyTableSpec {
  /** Table name, optionally schema-qualified (`plugin_oncology.chemo_protocols`). */
  table: string;
  /**
   * Rows are selected by this column pointing at an already selected row
   * (for child tables without tenant_id, such as departments.facility_id).
   * Omit to select by tenant_id = source tenant.
   */
  parentColumn?: string;
  /** Skip silently when the table does not exist (optional plugin schemas). */
  optional?: boolean;
}

export interface CopyTenantSetupInput {
  sourceTenantId: string;
  targetTenantId: string;
  /** In dependency order: a table comes after the tables its foreign keys point to. */
  tables: readonly CopyTableSpec[];
  /** Keys of rows copied by other services that this database references. */
  externalIds?: readonly string[];
}

export interface TableCount {
  table: string;
  rows: number;
}

export interface CopyTenantSetupResult {
  copied: TableCount[];
  /** Source keys of every row copied here, to pass on as externalIds. */
  sourceIds: string[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TX_OPTIONS = { maxWait: 10_000, timeout: 300_000 };

/** New key of a copied row. Same formula as the SQL: md5(target || ':' || old)::uuid. */
export function sandboxRowId(targetTenantId: string, oldId: string): string {
  const hex = createHash('md5').update(`${targetTenantId}:${oldId}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function assertUuid(value: string, name: string): void {
  if (!UUID.test(value)) throw new Error(`${name} must be a uuid`);
}

function quoteIdent(name: string): string {
  if (!/^[a-z_][a-z0-9_]*$/i.test(name)) throw new Error(`Unsafe identifier: ${name}`);
  return `"${name}"`;
}

function splitTable(table: string): { schema: string; name: string; sql: string } {
  const [first, second] = table.split('.');
  const schema = second ? first! : 'public';
  const name = second ?? first!;
  return { schema, name, sql: `${quoteIdent(schema)}.${quoteIdent(name)}` };
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  udt_name: string;
  is_generated: string;
  is_identity: string;
}

async function tableExists(db: RawSqlClient, table: string): Promise<boolean> {
  const rows = await db.$queryRawUnsafe<Array<{ exists: string | null }>>('SELECT to_regclass($1)::text AS exists', table);
  return !!rows[0]?.exists;
}

async function columnsOf(db: RawSqlClient, schema: string, name: string): Promise<ColumnInfo[]> {
  return db.$queryRawUnsafe<ColumnInfo[]>(
    `SELECT column_name, data_type, udt_name, is_generated, is_identity
       FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position`,
    schema,
    name,
  );
}

const MAPPED = (value: string) =>
  `CASE WHEN ${value} IS NOT NULL AND EXISTS (SELECT 1 FROM sandbox_id_map m WHERE m.old = ${value})` +
  ` THEN md5($1 || ':' || ${value}::text)::uuid ELSE ${value} END`;

function selectExpression(column: ColumnInfo): string {
  const ref = `t.${quoteIdent(column.column_name)}`;
  if (column.column_name === 'tenant_id') return '$1::uuid';
  if (column.udt_name === 'uuid') return MAPPED(ref);
  if (column.udt_name === '_uuid') {
    return `CASE WHEN ${ref} IS NULL THEN NULL ELSE ARRAY(SELECT ${MAPPED('x')} FROM unnest(${ref}) AS x) END`;
  }
  return ref;
}

/** Copies the listed tables' rows of the source tenant into the target tenant, in one transaction. */
export async function copyTenantSetup(
  db: TransactionalSqlClient,
  input: CopyTenantSetupInput,
): Promise<CopyTenantSetupResult> {
  assertUuid(input.sourceTenantId, 'sourceTenantId');
  assertUuid(input.targetTenantId, 'targetTenantId');
  if (input.sourceTenantId === input.targetTenantId) throw new Error('Source and target tenant are the same');
  const externalIds = (input.externalIds ?? []).filter((id) => UUID.test(id));

  return db.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('CREATE TEMP TABLE sandbox_id_map (old uuid PRIMARY KEY) ON COMMIT DROP');
    await tx.$executeRawUnsafe('CREATE TEMP TABLE sandbox_source_ids (old uuid PRIMARY KEY) ON COMMIT DROP');
    if (externalIds.length > 0) {
      await tx.$executeRawUnsafe(
        'INSERT INTO sandbox_id_map (old) SELECT DISTINCT unnest($1::uuid[]) ON CONFLICT DO NOTHING',
        externalIds,
      );
    }

    // Pass 1: collect the keys of every row to copy, so references in any direction are remapped.
    const present: Array<CopyTableSpec & { schema: string; name: string; sql: string }> = [];
    for (const spec of input.tables) {
      const parts = splitTable(spec.table);
      if (!(await tableExists(tx, `${parts.schema}.${parts.name}`))) {
        if (spec.optional) continue;
        throw new Error(`Table ${spec.table} does not exist`);
      }
      const where = spec.parentColumn
        ? `t.${quoteIdent(spec.parentColumn)} IN (SELECT old FROM sandbox_source_ids)`
        : 't.tenant_id = $1::uuid';
      const collect = `INSERT INTO sandbox_source_ids (old) SELECT t.id FROM ${parts.sql} t WHERE ${where} ON CONFLICT DO NOTHING`;
      if (spec.parentColumn) await tx.$executeRawUnsafe(collect);
      else await tx.$executeRawUnsafe(collect, input.sourceTenantId);
      present.push({ ...spec, ...parts });
    }
    await tx.$executeRawUnsafe('INSERT INTO sandbox_id_map (old) SELECT old FROM sandbox_source_ids ON CONFLICT DO NOTHING');

    // Pass 2: copy, in the given (dependency) order. $1 is the target tenant.
    const copied: TableCount[] = [];
    for (const spec of present) {
      const columns = (await columnsOf(tx, spec.schema, spec.name)).filter(
        (c) => c.is_generated !== 'ALWAYS' && c.is_identity !== 'YES',
      );
      const names = columns.map((c) => quoteIdent(c.column_name)).join(', ');
      const values = columns.map(selectExpression).join(', ');
      const rows = await tx.$executeRawUnsafe(
        `INSERT INTO ${spec.sql} (${names}) SELECT ${values} FROM ${spec.sql} t
          WHERE t.id IN (SELECT old FROM sandbox_source_ids)
          ON CONFLICT DO NOTHING`,
        input.targetTenantId,
      );
      copied.push({ table: spec.table, rows });
    }

    const ids = await tx.$queryRawUnsafe<Array<{ old: string }>>('SELECT old::text AS old FROM sandbox_source_ids');
    return { copied, sourceIds: ids.map((row) => row.old) };
  }, TX_OPTIONS);
}

/**
 * Deletes every row of the tenant from every table with a tenant_id column,
 * in one transaction. Tables blocked by a foreign key are retried after the
 * others. `exclude` lists tables to leave alone (schema-qualified or bare).
 */
export async function purgeTenantData(
  db: TransactionalSqlClient,
  tenantId: string,
  options: { exclude?: readonly string[] } = {},
): Promise<TableCount[]> {
  assertUuid(tenantId, 'tenantId');
  const exclude = new Set(options.exclude ?? []);

  return db.$transaction(async (tx) => {
    const tables = await tx.$queryRawUnsafe<Array<{ table_schema: string; table_name: string }>>(
      `SELECT c.table_schema, c.table_name
         FROM information_schema.columns c
         JOIN information_schema.tables t
           ON t.table_schema = c.table_schema AND t.table_name = c.table_name AND t.table_type = 'BASE TABLE'
        WHERE c.column_name = 'tenant_id'
          AND c.table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY c.table_schema, c.table_name`,
    );
    let remaining = tables.filter(
      (t) => !exclude.has(t.table_name) && !exclude.has(`${t.table_schema}.${t.table_name}`),
    );
    const deleted: TableCount[] = [];
    let lastError: unknown = null;

    for (let pass = 0; pass < 15 && remaining.length > 0; pass++) {
      const blocked: typeof remaining = [];
      for (const table of remaining) {
        const sql = `${quoteIdent(table.table_schema)}.${quoteIdent(table.table_name)}`;
        await tx.$executeRawUnsafe('SAVEPOINT sandbox_purge');
        try {
          const rows = await tx.$executeRawUnsafe(`DELETE FROM ${sql} WHERE tenant_id = $1::uuid`, tenantId);
          await tx.$executeRawUnsafe('RELEASE SAVEPOINT sandbox_purge');
          if (rows > 0) deleted.push({ table: `${table.table_schema}.${table.table_name}`, rows });
        } catch (error) {
          await tx.$executeRawUnsafe('ROLLBACK TO SAVEPOINT sandbox_purge');
          lastError = error;
          blocked.push(table);
        }
      }
      if (blocked.length === remaining.length) break;
      remaining = blocked;
    }

    if (remaining.length > 0) {
      const names = remaining.map((t) => `${t.table_schema}.${t.table_name}`).join(', ');
      const reason = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`Could not delete tenant data from ${names}: ${reason}`);
    }
    return deleted;
  }, TX_OPTIONS);
}

export class TenantSetupRequestError extends Error {}

/** The tenant sandboxes are copied from: SANDBOX_TEMPLATE_TENANT_ID, else PUBLIC_DEMO_TENANT_ID. */
export function sandboxTemplateTenantId(env: NodeJS.ProcessEnv = process.env): string | null {
  return env.SANDBOX_TEMPLATE_TENANT_ID?.trim() || env.PUBLIC_DEMO_TENANT_ID?.trim() || null;
}

/**
 * Refuses copy/purge unless sandboxes are enabled, and never targets the
 * template or public demo tenant. Every service checks this independently of
 * foundation (defence in depth for the internal endpoints).
 */
export function assertSandboxTarget(targetTenantId: unknown, env: NodeJS.ProcessEnv = process.env): string {
  if (env.SANDBOX_ENABLED !== 'true') throw new TenantSetupRequestError('Sandboxes are not enabled');
  if (typeof targetTenantId !== 'string' || !UUID.test(targetTenantId)) {
    throw new TenantSetupRequestError('targetTenantId must be a uuid');
  }
  const protectedIds = [env.PUBLIC_DEMO_TENANT_ID?.trim(), sandboxTemplateTenantId(env)].filter(Boolean);
  if (protectedIds.includes(targetTenantId)) {
    throw new TenantSetupRequestError('The demo tenant cannot be a sandbox target');
  }
  return targetTenantId;
}

/** Validates an internal copy request body: { targetTenantId, externalIds? }. The source is always the template tenant. */
export function parseTenantSetupCopyRequest(
  body: unknown,
  env: NodeJS.ProcessEnv = process.env,
): { sourceTenantId: string; targetTenantId: string; externalIds: string[] } {
  const input = (body ?? {}) as { targetTenantId?: unknown; externalIds?: unknown };
  const targetTenantId = assertSandboxTarget(input.targetTenantId, env);
  const sourceTenantId = sandboxTemplateTenantId(env);
  if (!sourceTenantId || !UUID.test(sourceTenantId)) {
    throw new TenantSetupRequestError('SANDBOX_TEMPLATE_TENANT_ID / PUBLIC_DEMO_TENANT_ID is not set');
  }
  const externalIds = Array.isArray(input.externalIds)
    ? input.externalIds.filter((id): id is string => typeof id === 'string' && UUID.test(id))
    : [];
  if (externalIds.length > 50_000) throw new TenantSetupRequestError('Too many externalIds');
  return { sourceTenantId, targetTenantId, externalIds };
}

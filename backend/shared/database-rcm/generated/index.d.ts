
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Payer
 * 
 */
export type Payer = $Result.DefaultSelection<Prisma.$PayerPayload>
/**
 * Model Policy
 * 
 */
export type Policy = $Result.DefaultSelection<Prisma.$PolicyPayload>
/**
 * Model Claim
 * 
 */
export type Claim = $Result.DefaultSelection<Prisma.$ClaimPayload>
/**
 * Model EncounterCoverage
 * 
 */
export type EncounterCoverage = $Result.DefaultSelection<Prisma.$EncounterCoveragePayload>
/**
 * Model BillingItem
 * 
 */
export type BillingItem = $Result.DefaultSelection<Prisma.$BillingItemPayload>
/**
 * Model Charge
 * 
 */
export type Charge = $Result.DefaultSelection<Prisma.$ChargePayload>
/**
 * Model Invoice
 * 
 */
export type Invoice = $Result.DefaultSelection<Prisma.$InvoicePayload>
/**
 * Model InvoiceLine
 * 
 */
export type InvoiceLine = $Result.DefaultSelection<Prisma.$InvoiceLinePayload>
/**
 * Model Receipt
 * 
 */
export type Receipt = $Result.DefaultSelection<Prisma.$ReceiptPayload>
/**
 * Model ReceiptAllocation
 * 
 */
export type ReceiptAllocation = $Result.DefaultSelection<Prisma.$ReceiptAllocationPayload>
/**
 * Model ChargePostingRule
 * 
 */
export type ChargePostingRule = $Result.DefaultSelection<Prisma.$ChargePostingRulePayload>
/**
 * Model ChargePostingEvent
 * 
 */
export type ChargePostingEvent = $Result.DefaultSelection<Prisma.$ChargePostingEventPayload>
/**
 * Model ChargePostingAudit
 * 
 */
export type ChargePostingAudit = $Result.DefaultSelection<Prisma.$ChargePostingAuditPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Payers
 * const payers = await prisma.payer.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Payers
   * const payers = await prisma.payer.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.payer`: Exposes CRUD operations for the **Payer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payers
    * const payers = await prisma.payer.findMany()
    * ```
    */
  get payer(): Prisma.PayerDelegate<ExtArgs>;

  /**
   * `prisma.policy`: Exposes CRUD operations for the **Policy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Policies
    * const policies = await prisma.policy.findMany()
    * ```
    */
  get policy(): Prisma.PolicyDelegate<ExtArgs>;

  /**
   * `prisma.claim`: Exposes CRUD operations for the **Claim** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Claims
    * const claims = await prisma.claim.findMany()
    * ```
    */
  get claim(): Prisma.ClaimDelegate<ExtArgs>;

  /**
   * `prisma.encounterCoverage`: Exposes CRUD operations for the **EncounterCoverage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EncounterCoverages
    * const encounterCoverages = await prisma.encounterCoverage.findMany()
    * ```
    */
  get encounterCoverage(): Prisma.EncounterCoverageDelegate<ExtArgs>;

  /**
   * `prisma.billingItem`: Exposes CRUD operations for the **BillingItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingItems
    * const billingItems = await prisma.billingItem.findMany()
    * ```
    */
  get billingItem(): Prisma.BillingItemDelegate<ExtArgs>;

  /**
   * `prisma.charge`: Exposes CRUD operations for the **Charge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Charges
    * const charges = await prisma.charge.findMany()
    * ```
    */
  get charge(): Prisma.ChargeDelegate<ExtArgs>;

  /**
   * `prisma.invoice`: Exposes CRUD operations for the **Invoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invoices
    * const invoices = await prisma.invoice.findMany()
    * ```
    */
  get invoice(): Prisma.InvoiceDelegate<ExtArgs>;

  /**
   * `prisma.invoiceLine`: Exposes CRUD operations for the **InvoiceLine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InvoiceLines
    * const invoiceLines = await prisma.invoiceLine.findMany()
    * ```
    */
  get invoiceLine(): Prisma.InvoiceLineDelegate<ExtArgs>;

  /**
   * `prisma.receipt`: Exposes CRUD operations for the **Receipt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Receipts
    * const receipts = await prisma.receipt.findMany()
    * ```
    */
  get receipt(): Prisma.ReceiptDelegate<ExtArgs>;

  /**
   * `prisma.receiptAllocation`: Exposes CRUD operations for the **ReceiptAllocation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReceiptAllocations
    * const receiptAllocations = await prisma.receiptAllocation.findMany()
    * ```
    */
  get receiptAllocation(): Prisma.ReceiptAllocationDelegate<ExtArgs>;

  /**
   * `prisma.chargePostingRule`: Exposes CRUD operations for the **ChargePostingRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChargePostingRules
    * const chargePostingRules = await prisma.chargePostingRule.findMany()
    * ```
    */
  get chargePostingRule(): Prisma.ChargePostingRuleDelegate<ExtArgs>;

  /**
   * `prisma.chargePostingEvent`: Exposes CRUD operations for the **ChargePostingEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChargePostingEvents
    * const chargePostingEvents = await prisma.chargePostingEvent.findMany()
    * ```
    */
  get chargePostingEvent(): Prisma.ChargePostingEventDelegate<ExtArgs>;

  /**
   * `prisma.chargePostingAudit`: Exposes CRUD operations for the **ChargePostingAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChargePostingAudits
    * const chargePostingAudits = await prisma.chargePostingAudit.findMany()
    * ```
    */
  get chargePostingAudit(): Prisma.ChargePostingAuditDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Payer: 'Payer',
    Policy: 'Policy',
    Claim: 'Claim',
    EncounterCoverage: 'EncounterCoverage',
    BillingItem: 'BillingItem',
    Charge: 'Charge',
    Invoice: 'Invoice',
    InvoiceLine: 'InvoiceLine',
    Receipt: 'Receipt',
    ReceiptAllocation: 'ReceiptAllocation',
    ChargePostingRule: 'ChargePostingRule',
    ChargePostingEvent: 'ChargePostingEvent',
    ChargePostingAudit: 'ChargePostingAudit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "payer" | "policy" | "claim" | "encounterCoverage" | "billingItem" | "charge" | "invoice" | "invoiceLine" | "receipt" | "receiptAllocation" | "chargePostingRule" | "chargePostingEvent" | "chargePostingAudit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Payer: {
        payload: Prisma.$PayerPayload<ExtArgs>
        fields: Prisma.PayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          findFirst: {
            args: Prisma.PayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          findMany: {
            args: Prisma.PayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>[]
          }
          create: {
            args: Prisma.PayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          createMany: {
            args: Prisma.PayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>[]
          }
          delete: {
            args: Prisma.PayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          update: {
            args: Prisma.PayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          deleteMany: {
            args: Prisma.PayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PayerPayload>
          }
          aggregate: {
            args: Prisma.PayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayer>
          }
          groupBy: {
            args: Prisma.PayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PayerCountArgs<ExtArgs>
            result: $Utils.Optional<PayerCountAggregateOutputType> | number
          }
        }
      }
      Policy: {
        payload: Prisma.$PolicyPayload<ExtArgs>
        fields: Prisma.PolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          findFirst: {
            args: Prisma.PolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          findMany: {
            args: Prisma.PolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>[]
          }
          create: {
            args: Prisma.PolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          createMany: {
            args: Prisma.PolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PolicyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>[]
          }
          delete: {
            args: Prisma.PolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          update: {
            args: Prisma.PolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          deleteMany: {
            args: Prisma.PolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          aggregate: {
            args: Prisma.PolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePolicy>
          }
          groupBy: {
            args: Prisma.PolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PolicyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PolicyCountArgs<ExtArgs>
            result: $Utils.Optional<PolicyCountAggregateOutputType> | number
          }
        }
      }
      Claim: {
        payload: Prisma.$ClaimPayload<ExtArgs>
        fields: Prisma.ClaimFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClaimFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClaimFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          findFirst: {
            args: Prisma.ClaimFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClaimFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          findMany: {
            args: Prisma.ClaimFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>[]
          }
          create: {
            args: Prisma.ClaimCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          createMany: {
            args: Prisma.ClaimCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClaimCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>[]
          }
          delete: {
            args: Prisma.ClaimDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          update: {
            args: Prisma.ClaimUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          deleteMany: {
            args: Prisma.ClaimDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClaimUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClaimUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClaimPayload>
          }
          aggregate: {
            args: Prisma.ClaimAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClaim>
          }
          groupBy: {
            args: Prisma.ClaimGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClaimGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClaimCountArgs<ExtArgs>
            result: $Utils.Optional<ClaimCountAggregateOutputType> | number
          }
        }
      }
      EncounterCoverage: {
        payload: Prisma.$EncounterCoveragePayload<ExtArgs>
        fields: Prisma.EncounterCoverageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterCoverageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterCoverageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          findFirst: {
            args: Prisma.EncounterCoverageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterCoverageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          findMany: {
            args: Prisma.EncounterCoverageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>[]
          }
          create: {
            args: Prisma.EncounterCoverageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          createMany: {
            args: Prisma.EncounterCoverageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EncounterCoverageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>[]
          }
          delete: {
            args: Prisma.EncounterCoverageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          update: {
            args: Prisma.EncounterCoverageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          deleteMany: {
            args: Prisma.EncounterCoverageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterCoverageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EncounterCoverageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterCoveragePayload>
          }
          aggregate: {
            args: Prisma.EncounterCoverageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounterCoverage>
          }
          groupBy: {
            args: Prisma.EncounterCoverageGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterCoverageGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCoverageCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCoverageCountAggregateOutputType> | number
          }
        }
      }
      BillingItem: {
        payload: Prisma.$BillingItemPayload<ExtArgs>
        fields: Prisma.BillingItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          findFirst: {
            args: Prisma.BillingItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          findMany: {
            args: Prisma.BillingItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>[]
          }
          create: {
            args: Prisma.BillingItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          createMany: {
            args: Prisma.BillingItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>[]
          }
          delete: {
            args: Prisma.BillingItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          update: {
            args: Prisma.BillingItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          deleteMany: {
            args: Prisma.BillingItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingItemPayload>
          }
          aggregate: {
            args: Prisma.BillingItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingItem>
          }
          groupBy: {
            args: Prisma.BillingItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingItemCountArgs<ExtArgs>
            result: $Utils.Optional<BillingItemCountAggregateOutputType> | number
          }
        }
      }
      Charge: {
        payload: Prisma.$ChargePayload<ExtArgs>
        fields: Prisma.ChargeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChargeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChargeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          findFirst: {
            args: Prisma.ChargeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChargeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          findMany: {
            args: Prisma.ChargeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>[]
          }
          create: {
            args: Prisma.ChargeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          createMany: {
            args: Prisma.ChargeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChargeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>[]
          }
          delete: {
            args: Prisma.ChargeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          update: {
            args: Prisma.ChargeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          deleteMany: {
            args: Prisma.ChargeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChargeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChargeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePayload>
          }
          aggregate: {
            args: Prisma.ChargeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCharge>
          }
          groupBy: {
            args: Prisma.ChargeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChargeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChargeCountArgs<ExtArgs>
            result: $Utils.Optional<ChargeCountAggregateOutputType> | number
          }
        }
      }
      Invoice: {
        payload: Prisma.$InvoicePayload<ExtArgs>
        fields: Prisma.InvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findFirst: {
            args: Prisma.InvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          findMany: {
            args: Prisma.InvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          create: {
            args: Prisma.InvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          createMany: {
            args: Prisma.InvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>[]
          }
          delete: {
            args: Prisma.InvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          update: {
            args: Prisma.InvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoicePayload>
          }
          aggregate: {
            args: Prisma.InvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoice>
          }
          groupBy: {
            args: Prisma.InvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceCountAggregateOutputType> | number
          }
        }
      }
      InvoiceLine: {
        payload: Prisma.$InvoiceLinePayload<ExtArgs>
        fields: Prisma.InvoiceLineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvoiceLineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvoiceLineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          findFirst: {
            args: Prisma.InvoiceLineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvoiceLineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          findMany: {
            args: Prisma.InvoiceLineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>[]
          }
          create: {
            args: Prisma.InvoiceLineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          createMany: {
            args: Prisma.InvoiceLineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvoiceLineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>[]
          }
          delete: {
            args: Prisma.InvoiceLineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          update: {
            args: Prisma.InvoiceLineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          deleteMany: {
            args: Prisma.InvoiceLineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvoiceLineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InvoiceLineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvoiceLinePayload>
          }
          aggregate: {
            args: Prisma.InvoiceLineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvoiceLine>
          }
          groupBy: {
            args: Prisma.InvoiceLineGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvoiceLineCountArgs<ExtArgs>
            result: $Utils.Optional<InvoiceLineCountAggregateOutputType> | number
          }
        }
      }
      Receipt: {
        payload: Prisma.$ReceiptPayload<ExtArgs>
        fields: Prisma.ReceiptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReceiptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReceiptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          findFirst: {
            args: Prisma.ReceiptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReceiptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          findMany: {
            args: Prisma.ReceiptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>[]
          }
          create: {
            args: Prisma.ReceiptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          createMany: {
            args: Prisma.ReceiptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReceiptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>[]
          }
          delete: {
            args: Prisma.ReceiptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          update: {
            args: Prisma.ReceiptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          deleteMany: {
            args: Prisma.ReceiptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReceiptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReceiptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptPayload>
          }
          aggregate: {
            args: Prisma.ReceiptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReceipt>
          }
          groupBy: {
            args: Prisma.ReceiptGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReceiptGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReceiptCountArgs<ExtArgs>
            result: $Utils.Optional<ReceiptCountAggregateOutputType> | number
          }
        }
      }
      ReceiptAllocation: {
        payload: Prisma.$ReceiptAllocationPayload<ExtArgs>
        fields: Prisma.ReceiptAllocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReceiptAllocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReceiptAllocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          findFirst: {
            args: Prisma.ReceiptAllocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReceiptAllocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          findMany: {
            args: Prisma.ReceiptAllocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>[]
          }
          create: {
            args: Prisma.ReceiptAllocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          createMany: {
            args: Prisma.ReceiptAllocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReceiptAllocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>[]
          }
          delete: {
            args: Prisma.ReceiptAllocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          update: {
            args: Prisma.ReceiptAllocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          deleteMany: {
            args: Prisma.ReceiptAllocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReceiptAllocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReceiptAllocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReceiptAllocationPayload>
          }
          aggregate: {
            args: Prisma.ReceiptAllocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReceiptAllocation>
          }
          groupBy: {
            args: Prisma.ReceiptAllocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReceiptAllocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReceiptAllocationCountArgs<ExtArgs>
            result: $Utils.Optional<ReceiptAllocationCountAggregateOutputType> | number
          }
        }
      }
      ChargePostingRule: {
        payload: Prisma.$ChargePostingRulePayload<ExtArgs>
        fields: Prisma.ChargePostingRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChargePostingRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChargePostingRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          findFirst: {
            args: Prisma.ChargePostingRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChargePostingRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          findMany: {
            args: Prisma.ChargePostingRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>[]
          }
          create: {
            args: Prisma.ChargePostingRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          createMany: {
            args: Prisma.ChargePostingRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChargePostingRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>[]
          }
          delete: {
            args: Prisma.ChargePostingRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          update: {
            args: Prisma.ChargePostingRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          deleteMany: {
            args: Prisma.ChargePostingRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChargePostingRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChargePostingRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingRulePayload>
          }
          aggregate: {
            args: Prisma.ChargePostingRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChargePostingRule>
          }
          groupBy: {
            args: Prisma.ChargePostingRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChargePostingRuleCountArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingRuleCountAggregateOutputType> | number
          }
        }
      }
      ChargePostingEvent: {
        payload: Prisma.$ChargePostingEventPayload<ExtArgs>
        fields: Prisma.ChargePostingEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChargePostingEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChargePostingEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          findFirst: {
            args: Prisma.ChargePostingEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChargePostingEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          findMany: {
            args: Prisma.ChargePostingEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>[]
          }
          create: {
            args: Prisma.ChargePostingEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          createMany: {
            args: Prisma.ChargePostingEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChargePostingEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>[]
          }
          delete: {
            args: Prisma.ChargePostingEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          update: {
            args: Prisma.ChargePostingEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          deleteMany: {
            args: Prisma.ChargePostingEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChargePostingEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChargePostingEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingEventPayload>
          }
          aggregate: {
            args: Prisma.ChargePostingEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChargePostingEvent>
          }
          groupBy: {
            args: Prisma.ChargePostingEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChargePostingEventCountArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingEventCountAggregateOutputType> | number
          }
        }
      }
      ChargePostingAudit: {
        payload: Prisma.$ChargePostingAuditPayload<ExtArgs>
        fields: Prisma.ChargePostingAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChargePostingAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChargePostingAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          findFirst: {
            args: Prisma.ChargePostingAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChargePostingAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          findMany: {
            args: Prisma.ChargePostingAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>[]
          }
          create: {
            args: Prisma.ChargePostingAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          createMany: {
            args: Prisma.ChargePostingAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChargePostingAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>[]
          }
          delete: {
            args: Prisma.ChargePostingAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          update: {
            args: Prisma.ChargePostingAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          deleteMany: {
            args: Prisma.ChargePostingAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChargePostingAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChargePostingAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChargePostingAuditPayload>
          }
          aggregate: {
            args: Prisma.ChargePostingAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChargePostingAudit>
          }
          groupBy: {
            args: Prisma.ChargePostingAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChargePostingAuditCountArgs<ExtArgs>
            result: $Utils.Optional<ChargePostingAuditCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PayerCountOutputType
   */

  export type PayerCountOutputType = {
    policies: number
    claims: number
    encounterCoverages: number
  }

  export type PayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policies?: boolean | PayerCountOutputTypeCountPoliciesArgs
    claims?: boolean | PayerCountOutputTypeCountClaimsArgs
    encounterCoverages?: boolean | PayerCountOutputTypeCountEncounterCoveragesArgs
  }

  // Custom InputTypes
  /**
   * PayerCountOutputType without action
   */
  export type PayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PayerCountOutputType
     */
    select?: PayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PayerCountOutputType without action
   */
  export type PayerCountOutputTypeCountPoliciesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PolicyWhereInput
  }

  /**
   * PayerCountOutputType without action
   */
  export type PayerCountOutputTypeCountClaimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
  }

  /**
   * PayerCountOutputType without action
   */
  export type PayerCountOutputTypeCountEncounterCoveragesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterCoverageWhereInput
  }


  /**
   * Count Type PolicyCountOutputType
   */

  export type PolicyCountOutputType = {
    encounterCoverages: number
  }

  export type PolicyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounterCoverages?: boolean | PolicyCountOutputTypeCountEncounterCoveragesArgs
  }

  // Custom InputTypes
  /**
   * PolicyCountOutputType without action
   */
  export type PolicyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PolicyCountOutputType
     */
    select?: PolicyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PolicyCountOutputType without action
   */
  export type PolicyCountOutputTypeCountEncounterCoveragesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterCoverageWhereInput
  }


  /**
   * Count Type BillingItemCountOutputType
   */

  export type BillingItemCountOutputType = {
    charges: number
  }

  export type BillingItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    charges?: boolean | BillingItemCountOutputTypeCountChargesArgs
  }

  // Custom InputTypes
  /**
   * BillingItemCountOutputType without action
   */
  export type BillingItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItemCountOutputType
     */
    select?: BillingItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BillingItemCountOutputType without action
   */
  export type BillingItemCountOutputTypeCountChargesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargeWhereInput
  }


  /**
   * Count Type ChargeCountOutputType
   */

  export type ChargeCountOutputType = {
    invoiceLines: number
  }

  export type ChargeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | ChargeCountOutputTypeCountInvoiceLinesArgs
  }

  // Custom InputTypes
  /**
   * ChargeCountOutputType without action
   */
  export type ChargeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargeCountOutputType
     */
    select?: ChargeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChargeCountOutputType without action
   */
  export type ChargeCountOutputTypeCountInvoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
  }


  /**
   * Count Type InvoiceCountOutputType
   */

  export type InvoiceCountOutputType = {
    invoiceLines: number
    receiptAllocations: number
  }

  export type InvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | InvoiceCountOutputTypeCountInvoiceLinesArgs
    receiptAllocations?: boolean | InvoiceCountOutputTypeCountReceiptAllocationsArgs
  }

  // Custom InputTypes
  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceCountOutputType
     */
    select?: InvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountInvoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
  }

  /**
   * InvoiceCountOutputType without action
   */
  export type InvoiceCountOutputTypeCountReceiptAllocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceiptAllocationWhereInput
  }


  /**
   * Count Type ReceiptCountOutputType
   */

  export type ReceiptCountOutputType = {
    allocations: number
  }

  export type ReceiptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    allocations?: boolean | ReceiptCountOutputTypeCountAllocationsArgs
  }

  // Custom InputTypes
  /**
   * ReceiptCountOutputType without action
   */
  export type ReceiptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptCountOutputType
     */
    select?: ReceiptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ReceiptCountOutputType without action
   */
  export type ReceiptCountOutputTypeCountAllocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceiptAllocationWhereInput
  }


  /**
   * Count Type ChargePostingRuleCountOutputType
   */

  export type ChargePostingRuleCountOutputType = {
    auditRecords: number
  }

  export type ChargePostingRuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRecords?: boolean | ChargePostingRuleCountOutputTypeCountAuditRecordsArgs
  }

  // Custom InputTypes
  /**
   * ChargePostingRuleCountOutputType without action
   */
  export type ChargePostingRuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRuleCountOutputType
     */
    select?: ChargePostingRuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChargePostingRuleCountOutputType without action
   */
  export type ChargePostingRuleCountOutputTypeCountAuditRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargePostingAuditWhereInput
  }


  /**
   * Count Type ChargePostingEventCountOutputType
   */

  export type ChargePostingEventCountOutputType = {
    auditRecords: number
  }

  export type ChargePostingEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRecords?: boolean | ChargePostingEventCountOutputTypeCountAuditRecordsArgs
  }

  // Custom InputTypes
  /**
   * ChargePostingEventCountOutputType without action
   */
  export type ChargePostingEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEventCountOutputType
     */
    select?: ChargePostingEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChargePostingEventCountOutputType without action
   */
  export type ChargePostingEventCountOutputTypeCountAuditRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargePostingAuditWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Payer
   */

  export type AggregatePayer = {
    _count: PayerCountAggregateOutputType | null
    _min: PayerMinAggregateOutputType | null
    _max: PayerMaxAggregateOutputType | null
  }

  export type PayerMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    payerName: string | null
    payerId: string | null
    payerType: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayerMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    payerName: string | null
    payerId: string | null
    payerType: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PayerCountAggregateOutputType = {
    id: number
    tenantId: number
    payerName: number
    payerId: number
    payerType: number
    contactInfo: number
    configuration: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PayerMinAggregateInputType = {
    id?: true
    tenantId?: true
    payerName?: true
    payerId?: true
    payerType?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayerMaxAggregateInputType = {
    id?: true
    tenantId?: true
    payerName?: true
    payerId?: true
    payerType?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PayerCountAggregateInputType = {
    id?: true
    tenantId?: true
    payerName?: true
    payerId?: true
    payerType?: true
    contactInfo?: true
    configuration?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payer to aggregate.
     */
    where?: PayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payers to fetch.
     */
    orderBy?: PayerOrderByWithRelationInput | PayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payers
    **/
    _count?: true | PayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PayerMaxAggregateInputType
  }

  export type GetPayerAggregateType<T extends PayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayer[P]>
      : GetScalarType<T[P], AggregatePayer[P]>
  }




  export type PayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PayerWhereInput
    orderBy?: PayerOrderByWithAggregationInput | PayerOrderByWithAggregationInput[]
    by: PayerScalarFieldEnum[] | PayerScalarFieldEnum
    having?: PayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PayerCountAggregateInputType | true
    _min?: PayerMinAggregateInputType
    _max?: PayerMaxAggregateInputType
  }

  export type PayerGroupByOutputType = {
    id: string
    tenantId: string
    payerName: string
    payerId: string | null
    payerType: string | null
    contactInfo: JsonValue
    configuration: JsonValue
    status: string
    createdAt: Date
    updatedAt: Date
    _count: PayerCountAggregateOutputType | null
    _min: PayerMinAggregateOutputType | null
    _max: PayerMaxAggregateOutputType | null
  }

  type GetPayerGroupByPayload<T extends PayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PayerGroupByOutputType[P]>
            : GetScalarType<T[P], PayerGroupByOutputType[P]>
        }
      >
    >


  export type PayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    payerName?: boolean
    payerId?: boolean
    payerType?: boolean
    contactInfo?: boolean
    configuration?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    policies?: boolean | Payer$policiesArgs<ExtArgs>
    claims?: boolean | Payer$claimsArgs<ExtArgs>
    encounterCoverages?: boolean | Payer$encounterCoveragesArgs<ExtArgs>
    _count?: boolean | PayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payer"]>

  export type PayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    payerName?: boolean
    payerId?: boolean
    payerType?: boolean
    contactInfo?: boolean
    configuration?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["payer"]>

  export type PayerSelectScalar = {
    id?: boolean
    tenantId?: boolean
    payerName?: boolean
    payerId?: boolean
    payerType?: boolean
    contactInfo?: boolean
    configuration?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policies?: boolean | Payer$policiesArgs<ExtArgs>
    claims?: boolean | Payer$claimsArgs<ExtArgs>
    encounterCoverages?: boolean | Payer$encounterCoveragesArgs<ExtArgs>
    _count?: boolean | PayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payer"
    objects: {
      policies: Prisma.$PolicyPayload<ExtArgs>[]
      claims: Prisma.$ClaimPayload<ExtArgs>[]
      encounterCoverages: Prisma.$EncounterCoveragePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      payerName: string
      payerId: string | null
      payerType: string | null
      contactInfo: Prisma.JsonValue
      configuration: Prisma.JsonValue
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["payer"]>
    composites: {}
  }

  type PayerGetPayload<S extends boolean | null | undefined | PayerDefaultArgs> = $Result.GetResult<Prisma.$PayerPayload, S>

  type PayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PayerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PayerCountAggregateInputType | true
    }

  export interface PayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payer'], meta: { name: 'Payer' } }
    /**
     * Find zero or one Payer that matches the filter.
     * @param {PayerFindUniqueArgs} args - Arguments to find a Payer
     * @example
     * // Get one Payer
     * const payer = await prisma.payer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PayerFindUniqueArgs>(args: SelectSubset<T, PayerFindUniqueArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PayerFindUniqueOrThrowArgs} args - Arguments to find a Payer
     * @example
     * // Get one Payer
     * const payer = await prisma.payer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerFindFirstArgs} args - Arguments to find a Payer
     * @example
     * // Get one Payer
     * const payer = await prisma.payer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PayerFindFirstArgs>(args?: SelectSubset<T, PayerFindFirstArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerFindFirstOrThrowArgs} args - Arguments to find a Payer
     * @example
     * // Get one Payer
     * const payer = await prisma.payer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payers
     * const payers = await prisma.payer.findMany()
     * 
     * // Get first 10 Payers
     * const payers = await prisma.payer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const payerWithIdOnly = await prisma.payer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PayerFindManyArgs>(args?: SelectSubset<T, PayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payer.
     * @param {PayerCreateArgs} args - Arguments to create a Payer.
     * @example
     * // Create one Payer
     * const Payer = await prisma.payer.create({
     *   data: {
     *     // ... data to create a Payer
     *   }
     * })
     * 
     */
    create<T extends PayerCreateArgs>(args: SelectSubset<T, PayerCreateArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payers.
     * @param {PayerCreateManyArgs} args - Arguments to create many Payers.
     * @example
     * // Create many Payers
     * const payer = await prisma.payer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PayerCreateManyArgs>(args?: SelectSubset<T, PayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payers and returns the data saved in the database.
     * @param {PayerCreateManyAndReturnArgs} args - Arguments to create many Payers.
     * @example
     * // Create many Payers
     * const payer = await prisma.payer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payers and only return the `id`
     * const payerWithIdOnly = await prisma.payer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payer.
     * @param {PayerDeleteArgs} args - Arguments to delete one Payer.
     * @example
     * // Delete one Payer
     * const Payer = await prisma.payer.delete({
     *   where: {
     *     // ... filter to delete one Payer
     *   }
     * })
     * 
     */
    delete<T extends PayerDeleteArgs>(args: SelectSubset<T, PayerDeleteArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payer.
     * @param {PayerUpdateArgs} args - Arguments to update one Payer.
     * @example
     * // Update one Payer
     * const payer = await prisma.payer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PayerUpdateArgs>(args: SelectSubset<T, PayerUpdateArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payers.
     * @param {PayerDeleteManyArgs} args - Arguments to filter Payers to delete.
     * @example
     * // Delete a few Payers
     * const { count } = await prisma.payer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PayerDeleteManyArgs>(args?: SelectSubset<T, PayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payers
     * const payer = await prisma.payer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PayerUpdateManyArgs>(args: SelectSubset<T, PayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payer.
     * @param {PayerUpsertArgs} args - Arguments to update or create a Payer.
     * @example
     * // Update or create a Payer
     * const payer = await prisma.payer.upsert({
     *   create: {
     *     // ... data to create a Payer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payer we want to update
     *   }
     * })
     */
    upsert<T extends PayerUpsertArgs>(args: SelectSubset<T, PayerUpsertArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerCountArgs} args - Arguments to filter Payers to count.
     * @example
     * // Count the number of Payers
     * const count = await prisma.payer.count({
     *   where: {
     *     // ... the filter for the Payers we want to count
     *   }
     * })
    **/
    count<T extends PayerCountArgs>(
      args?: Subset<T, PayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PayerAggregateArgs>(args: Subset<T, PayerAggregateArgs>): Prisma.PrismaPromise<GetPayerAggregateType<T>>

    /**
     * Group by Payer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PayerGroupByArgs['orderBy'] }
        : { orderBy?: PayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payer model
   */
  readonly fields: PayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    policies<T extends Payer$policiesArgs<ExtArgs> = {}>(args?: Subset<T, Payer$policiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findMany"> | Null>
    claims<T extends Payer$claimsArgs<ExtArgs> = {}>(args?: Subset<T, Payer$claimsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany"> | Null>
    encounterCoverages<T extends Payer$encounterCoveragesArgs<ExtArgs> = {}>(args?: Subset<T, Payer$encounterCoveragesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payer model
   */ 
  interface PayerFieldRefs {
    readonly id: FieldRef<"Payer", 'String'>
    readonly tenantId: FieldRef<"Payer", 'String'>
    readonly payerName: FieldRef<"Payer", 'String'>
    readonly payerId: FieldRef<"Payer", 'String'>
    readonly payerType: FieldRef<"Payer", 'String'>
    readonly contactInfo: FieldRef<"Payer", 'Json'>
    readonly configuration: FieldRef<"Payer", 'Json'>
    readonly status: FieldRef<"Payer", 'String'>
    readonly createdAt: FieldRef<"Payer", 'DateTime'>
    readonly updatedAt: FieldRef<"Payer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payer findUnique
   */
  export type PayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter, which Payer to fetch.
     */
    where: PayerWhereUniqueInput
  }

  /**
   * Payer findUniqueOrThrow
   */
  export type PayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter, which Payer to fetch.
     */
    where: PayerWhereUniqueInput
  }

  /**
   * Payer findFirst
   */
  export type PayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter, which Payer to fetch.
     */
    where?: PayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payers to fetch.
     */
    orderBy?: PayerOrderByWithRelationInput | PayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payers.
     */
    cursor?: PayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payers.
     */
    distinct?: PayerScalarFieldEnum | PayerScalarFieldEnum[]
  }

  /**
   * Payer findFirstOrThrow
   */
  export type PayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter, which Payer to fetch.
     */
    where?: PayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payers to fetch.
     */
    orderBy?: PayerOrderByWithRelationInput | PayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payers.
     */
    cursor?: PayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payers.
     */
    distinct?: PayerScalarFieldEnum | PayerScalarFieldEnum[]
  }

  /**
   * Payer findMany
   */
  export type PayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter, which Payers to fetch.
     */
    where?: PayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payers to fetch.
     */
    orderBy?: PayerOrderByWithRelationInput | PayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payers.
     */
    cursor?: PayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payers.
     */
    skip?: number
    distinct?: PayerScalarFieldEnum | PayerScalarFieldEnum[]
  }

  /**
   * Payer create
   */
  export type PayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Payer.
     */
    data: XOR<PayerCreateInput, PayerUncheckedCreateInput>
  }

  /**
   * Payer createMany
   */
  export type PayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payers.
     */
    data: PayerCreateManyInput | PayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payer createManyAndReturn
   */
  export type PayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payers.
     */
    data: PayerCreateManyInput | PayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payer update
   */
  export type PayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Payer.
     */
    data: XOR<PayerUpdateInput, PayerUncheckedUpdateInput>
    /**
     * Choose, which Payer to update.
     */
    where: PayerWhereUniqueInput
  }

  /**
   * Payer updateMany
   */
  export type PayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payers.
     */
    data: XOR<PayerUpdateManyMutationInput, PayerUncheckedUpdateManyInput>
    /**
     * Filter which Payers to update
     */
    where?: PayerWhereInput
  }

  /**
   * Payer upsert
   */
  export type PayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Payer to update in case it exists.
     */
    where: PayerWhereUniqueInput
    /**
     * In case the Payer found by the `where` argument doesn't exist, create a new Payer with this data.
     */
    create: XOR<PayerCreateInput, PayerUncheckedCreateInput>
    /**
     * In case the Payer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PayerUpdateInput, PayerUncheckedUpdateInput>
  }

  /**
   * Payer delete
   */
  export type PayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    /**
     * Filter which Payer to delete.
     */
    where: PayerWhereUniqueInput
  }

  /**
   * Payer deleteMany
   */
  export type PayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payers to delete
     */
    where?: PayerWhereInput
  }

  /**
   * Payer.policies
   */
  export type Payer$policiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    where?: PolicyWhereInput
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    cursor?: PolicyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Payer.claims
   */
  export type Payer$claimsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    cursor?: ClaimWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Payer.encounterCoverages
   */
  export type Payer$encounterCoveragesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    where?: EncounterCoverageWhereInput
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    cursor?: EncounterCoverageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterCoverageScalarFieldEnum | EncounterCoverageScalarFieldEnum[]
  }

  /**
   * Payer without action
   */
  export type PayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
  }


  /**
   * Model Policy
   */

  export type AggregatePolicy = {
    _count: PolicyCountAggregateOutputType | null
    _min: PolicyMinAggregateOutputType | null
    _max: PolicyMaxAggregateOutputType | null
  }

  export type PolicyMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    policyNumber: string | null
    groupNumber: string | null
    payerName: string | null
    payerId: string | null
    relationship: string | null
    effectiveDate: Date | null
    expirationDate: Date | null
    isPrimary: boolean | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PolicyMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    policyNumber: string | null
    groupNumber: string | null
    payerName: string | null
    payerId: string | null
    relationship: string | null
    effectiveDate: Date | null
    expirationDate: Date | null
    isPrimary: boolean | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PolicyCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    policyNumber: number
    groupNumber: number
    payerName: number
    payerId: number
    relationship: number
    effectiveDate: number
    expirationDate: number
    benefits: number
    isPrimary: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PolicyMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    policyNumber?: true
    groupNumber?: true
    payerName?: true
    payerId?: true
    relationship?: true
    effectiveDate?: true
    expirationDate?: true
    isPrimary?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PolicyMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    policyNumber?: true
    groupNumber?: true
    payerName?: true
    payerId?: true
    relationship?: true
    effectiveDate?: true
    expirationDate?: true
    isPrimary?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PolicyCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    policyNumber?: true
    groupNumber?: true
    payerName?: true
    payerId?: true
    relationship?: true
    effectiveDate?: true
    expirationDate?: true
    benefits?: true
    isPrimary?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Policy to aggregate.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Policies
    **/
    _count?: true | PolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PolicyMaxAggregateInputType
  }

  export type GetPolicyAggregateType<T extends PolicyAggregateArgs> = {
        [P in keyof T & keyof AggregatePolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePolicy[P]>
      : GetScalarType<T[P], AggregatePolicy[P]>
  }




  export type PolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PolicyWhereInput
    orderBy?: PolicyOrderByWithAggregationInput | PolicyOrderByWithAggregationInput[]
    by: PolicyScalarFieldEnum[] | PolicyScalarFieldEnum
    having?: PolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PolicyCountAggregateInputType | true
    _min?: PolicyMinAggregateInputType
    _max?: PolicyMaxAggregateInputType
  }

  export type PolicyGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber: string | null
    payerName: string
    payerId: string
    relationship: string | null
    effectiveDate: Date | null
    expirationDate: Date | null
    benefits: JsonValue
    isPrimary: boolean
    status: string
    createdAt: Date
    updatedAt: Date
    _count: PolicyCountAggregateOutputType | null
    _min: PolicyMinAggregateOutputType | null
    _max: PolicyMaxAggregateOutputType | null
  }

  type GetPolicyGroupByPayload<T extends PolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PolicyGroupByOutputType[P]>
            : GetScalarType<T[P], PolicyGroupByOutputType[P]>
        }
      >
    >


  export type PolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    policyNumber?: boolean
    groupNumber?: boolean
    payerName?: boolean
    payerId?: boolean
    relationship?: boolean
    effectiveDate?: boolean
    expirationDate?: boolean
    benefits?: boolean
    isPrimary?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payer?: boolean | PayerDefaultArgs<ExtArgs>
    encounterCoverages?: boolean | Policy$encounterCoveragesArgs<ExtArgs>
    _count?: boolean | PolicyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["policy"]>

  export type PolicySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    policyNumber?: boolean
    groupNumber?: boolean
    payerName?: boolean
    payerId?: boolean
    relationship?: boolean
    effectiveDate?: boolean
    expirationDate?: boolean
    benefits?: boolean
    isPrimary?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payer?: boolean | PayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["policy"]>

  export type PolicySelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    policyNumber?: boolean
    groupNumber?: boolean
    payerName?: boolean
    payerId?: boolean
    relationship?: boolean
    effectiveDate?: boolean
    expirationDate?: boolean
    benefits?: boolean
    isPrimary?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PolicyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payer?: boolean | PayerDefaultArgs<ExtArgs>
    encounterCoverages?: boolean | Policy$encounterCoveragesArgs<ExtArgs>
    _count?: boolean | PolicyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PolicyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payer?: boolean | PayerDefaultArgs<ExtArgs>
  }

  export type $PolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Policy"
    objects: {
      payer: Prisma.$PayerPayload<ExtArgs>
      encounterCoverages: Prisma.$EncounterCoveragePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      policyNumber: string
      groupNumber: string | null
      payerName: string
      payerId: string
      relationship: string | null
      effectiveDate: Date | null
      expirationDate: Date | null
      benefits: Prisma.JsonValue
      isPrimary: boolean
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["policy"]>
    composites: {}
  }

  type PolicyGetPayload<S extends boolean | null | undefined | PolicyDefaultArgs> = $Result.GetResult<Prisma.$PolicyPayload, S>

  type PolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PolicyFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PolicyCountAggregateInputType | true
    }

  export interface PolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Policy'], meta: { name: 'Policy' } }
    /**
     * Find zero or one Policy that matches the filter.
     * @param {PolicyFindUniqueArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PolicyFindUniqueArgs>(args: SelectSubset<T, PolicyFindUniqueArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Policy that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PolicyFindUniqueOrThrowArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, PolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Policy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindFirstArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PolicyFindFirstArgs>(args?: SelectSubset<T, PolicyFindFirstArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Policy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindFirstOrThrowArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, PolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Policies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Policies
     * const policies = await prisma.policy.findMany()
     * 
     * // Get first 10 Policies
     * const policies = await prisma.policy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const policyWithIdOnly = await prisma.policy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PolicyFindManyArgs>(args?: SelectSubset<T, PolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Policy.
     * @param {PolicyCreateArgs} args - Arguments to create a Policy.
     * @example
     * // Create one Policy
     * const Policy = await prisma.policy.create({
     *   data: {
     *     // ... data to create a Policy
     *   }
     * })
     * 
     */
    create<T extends PolicyCreateArgs>(args: SelectSubset<T, PolicyCreateArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Policies.
     * @param {PolicyCreateManyArgs} args - Arguments to create many Policies.
     * @example
     * // Create many Policies
     * const policy = await prisma.policy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PolicyCreateManyArgs>(args?: SelectSubset<T, PolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Policies and returns the data saved in the database.
     * @param {PolicyCreateManyAndReturnArgs} args - Arguments to create many Policies.
     * @example
     * // Create many Policies
     * const policy = await prisma.policy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Policies and only return the `id`
     * const policyWithIdOnly = await prisma.policy.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PolicyCreateManyAndReturnArgs>(args?: SelectSubset<T, PolicyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Policy.
     * @param {PolicyDeleteArgs} args - Arguments to delete one Policy.
     * @example
     * // Delete one Policy
     * const Policy = await prisma.policy.delete({
     *   where: {
     *     // ... filter to delete one Policy
     *   }
     * })
     * 
     */
    delete<T extends PolicyDeleteArgs>(args: SelectSubset<T, PolicyDeleteArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Policy.
     * @param {PolicyUpdateArgs} args - Arguments to update one Policy.
     * @example
     * // Update one Policy
     * const policy = await prisma.policy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PolicyUpdateArgs>(args: SelectSubset<T, PolicyUpdateArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Policies.
     * @param {PolicyDeleteManyArgs} args - Arguments to filter Policies to delete.
     * @example
     * // Delete a few Policies
     * const { count } = await prisma.policy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PolicyDeleteManyArgs>(args?: SelectSubset<T, PolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Policies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Policies
     * const policy = await prisma.policy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PolicyUpdateManyArgs>(args: SelectSubset<T, PolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Policy.
     * @param {PolicyUpsertArgs} args - Arguments to update or create a Policy.
     * @example
     * // Update or create a Policy
     * const policy = await prisma.policy.upsert({
     *   create: {
     *     // ... data to create a Policy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Policy we want to update
     *   }
     * })
     */
    upsert<T extends PolicyUpsertArgs>(args: SelectSubset<T, PolicyUpsertArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Policies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyCountArgs} args - Arguments to filter Policies to count.
     * @example
     * // Count the number of Policies
     * const count = await prisma.policy.count({
     *   where: {
     *     // ... the filter for the Policies we want to count
     *   }
     * })
    **/
    count<T extends PolicyCountArgs>(
      args?: Subset<T, PolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Policy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PolicyAggregateArgs>(args: Subset<T, PolicyAggregateArgs>): Prisma.PrismaPromise<GetPolicyAggregateType<T>>

    /**
     * Group by Policy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PolicyGroupByArgs['orderBy'] }
        : { orderBy?: PolicyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Policy model
   */
  readonly fields: PolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Policy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payer<T extends PayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PayerDefaultArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounterCoverages<T extends Policy$encounterCoveragesArgs<ExtArgs> = {}>(args?: Subset<T, Policy$encounterCoveragesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Policy model
   */ 
  interface PolicyFieldRefs {
    readonly id: FieldRef<"Policy", 'String'>
    readonly tenantId: FieldRef<"Policy", 'String'>
    readonly patientId: FieldRef<"Policy", 'String'>
    readonly policyNumber: FieldRef<"Policy", 'String'>
    readonly groupNumber: FieldRef<"Policy", 'String'>
    readonly payerName: FieldRef<"Policy", 'String'>
    readonly payerId: FieldRef<"Policy", 'String'>
    readonly relationship: FieldRef<"Policy", 'String'>
    readonly effectiveDate: FieldRef<"Policy", 'DateTime'>
    readonly expirationDate: FieldRef<"Policy", 'DateTime'>
    readonly benefits: FieldRef<"Policy", 'Json'>
    readonly isPrimary: FieldRef<"Policy", 'Boolean'>
    readonly status: FieldRef<"Policy", 'String'>
    readonly createdAt: FieldRef<"Policy", 'DateTime'>
    readonly updatedAt: FieldRef<"Policy", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Policy findUnique
   */
  export type PolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy findUniqueOrThrow
   */
  export type PolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy findFirst
   */
  export type PolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Policies.
     */
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy findFirstOrThrow
   */
  export type PolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Policies.
     */
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy findMany
   */
  export type PolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policies to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy create
   */
  export type PolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The data needed to create a Policy.
     */
    data: XOR<PolicyCreateInput, PolicyUncheckedCreateInput>
  }

  /**
   * Policy createMany
   */
  export type PolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Policies.
     */
    data: PolicyCreateManyInput | PolicyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Policy createManyAndReturn
   */
  export type PolicyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Policies.
     */
    data: PolicyCreateManyInput | PolicyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Policy update
   */
  export type PolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The data needed to update a Policy.
     */
    data: XOR<PolicyUpdateInput, PolicyUncheckedUpdateInput>
    /**
     * Choose, which Policy to update.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy updateMany
   */
  export type PolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Policies.
     */
    data: XOR<PolicyUpdateManyMutationInput, PolicyUncheckedUpdateManyInput>
    /**
     * Filter which Policies to update
     */
    where?: PolicyWhereInput
  }

  /**
   * Policy upsert
   */
  export type PolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The filter to search for the Policy to update in case it exists.
     */
    where: PolicyWhereUniqueInput
    /**
     * In case the Policy found by the `where` argument doesn't exist, create a new Policy with this data.
     */
    create: XOR<PolicyCreateInput, PolicyUncheckedCreateInput>
    /**
     * In case the Policy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PolicyUpdateInput, PolicyUncheckedUpdateInput>
  }

  /**
   * Policy delete
   */
  export type PolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter which Policy to delete.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy deleteMany
   */
  export type PolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Policies to delete
     */
    where?: PolicyWhereInput
  }

  /**
   * Policy.encounterCoverages
   */
  export type Policy$encounterCoveragesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    where?: EncounterCoverageWhereInput
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    cursor?: EncounterCoverageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterCoverageScalarFieldEnum | EncounterCoverageScalarFieldEnum[]
  }

  /**
   * Policy without action
   */
  export type PolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
  }


  /**
   * Model Claim
   */

  export type AggregateClaim = {
    _count: ClaimCountAggregateOutputType | null
    _avg: ClaimAvgAggregateOutputType | null
    _sum: ClaimSumAggregateOutputType | null
    _min: ClaimMinAggregateOutputType | null
    _max: ClaimMaxAggregateOutputType | null
  }

  export type ClaimAvgAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type ClaimSumAggregateOutputType = {
    totalAmount: Decimal | null
  }

  export type ClaimMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    claimNumber: string | null
    status: string | null
    payerId: string | null
    patientId: string | null
    encounterId: string | null
    totalAmount: Decimal | null
    currency: string | null
    serviceDate: Date | null
    submittedAt: Date | null
    adjudicatedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClaimMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    claimNumber: string | null
    status: string | null
    payerId: string | null
    patientId: string | null
    encounterId: string | null
    totalAmount: Decimal | null
    currency: string | null
    serviceDate: Date | null
    submittedAt: Date | null
    adjudicatedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClaimCountAggregateOutputType = {
    id: number
    tenantId: number
    claimNumber: number
    status: number
    payerId: number
    patientId: number
    encounterId: number
    totalAmount: number
    currency: number
    serviceDate: number
    submittedAt: number
    adjudicatedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClaimAvgAggregateInputType = {
    totalAmount?: true
  }

  export type ClaimSumAggregateInputType = {
    totalAmount?: true
  }

  export type ClaimMinAggregateInputType = {
    id?: true
    tenantId?: true
    claimNumber?: true
    status?: true
    payerId?: true
    patientId?: true
    encounterId?: true
    totalAmount?: true
    currency?: true
    serviceDate?: true
    submittedAt?: true
    adjudicatedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClaimMaxAggregateInputType = {
    id?: true
    tenantId?: true
    claimNumber?: true
    status?: true
    payerId?: true
    patientId?: true
    encounterId?: true
    totalAmount?: true
    currency?: true
    serviceDate?: true
    submittedAt?: true
    adjudicatedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClaimCountAggregateInputType = {
    id?: true
    tenantId?: true
    claimNumber?: true
    status?: true
    payerId?: true
    patientId?: true
    encounterId?: true
    totalAmount?: true
    currency?: true
    serviceDate?: true
    submittedAt?: true
    adjudicatedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClaimAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Claim to aggregate.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Claims
    **/
    _count?: true | ClaimCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClaimAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClaimSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClaimMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClaimMaxAggregateInputType
  }

  export type GetClaimAggregateType<T extends ClaimAggregateArgs> = {
        [P in keyof T & keyof AggregateClaim]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClaim[P]>
      : GetScalarType<T[P], AggregateClaim[P]>
  }




  export type ClaimGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClaimWhereInput
    orderBy?: ClaimOrderByWithAggregationInput | ClaimOrderByWithAggregationInput[]
    by: ClaimScalarFieldEnum[] | ClaimScalarFieldEnum
    having?: ClaimScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClaimCountAggregateInputType | true
    _avg?: ClaimAvgAggregateInputType
    _sum?: ClaimSumAggregateInputType
    _min?: ClaimMinAggregateInputType
    _max?: ClaimMaxAggregateInputType
  }

  export type ClaimGroupByOutputType = {
    id: string
    tenantId: string
    claimNumber: string
    status: string
    payerId: string | null
    patientId: string
    encounterId: string | null
    totalAmount: Decimal
    currency: string
    serviceDate: Date
    submittedAt: Date | null
    adjudicatedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ClaimCountAggregateOutputType | null
    _avg: ClaimAvgAggregateOutputType | null
    _sum: ClaimSumAggregateOutputType | null
    _min: ClaimMinAggregateOutputType | null
    _max: ClaimMaxAggregateOutputType | null
  }

  type GetClaimGroupByPayload<T extends ClaimGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClaimGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClaimGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClaimGroupByOutputType[P]>
            : GetScalarType<T[P], ClaimGroupByOutputType[P]>
        }
      >
    >


  export type ClaimSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    claimNumber?: boolean
    status?: boolean
    payerId?: boolean
    patientId?: boolean
    encounterId?: boolean
    totalAmount?: boolean
    currency?: boolean
    serviceDate?: boolean
    submittedAt?: boolean
    adjudicatedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payer?: boolean | Claim$payerArgs<ExtArgs>
  }, ExtArgs["result"]["claim"]>

  export type ClaimSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    claimNumber?: boolean
    status?: boolean
    payerId?: boolean
    patientId?: boolean
    encounterId?: boolean
    totalAmount?: boolean
    currency?: boolean
    serviceDate?: boolean
    submittedAt?: boolean
    adjudicatedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payer?: boolean | Claim$payerArgs<ExtArgs>
  }, ExtArgs["result"]["claim"]>

  export type ClaimSelectScalar = {
    id?: boolean
    tenantId?: boolean
    claimNumber?: boolean
    status?: boolean
    payerId?: boolean
    patientId?: boolean
    encounterId?: boolean
    totalAmount?: boolean
    currency?: boolean
    serviceDate?: boolean
    submittedAt?: boolean
    adjudicatedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClaimInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payer?: boolean | Claim$payerArgs<ExtArgs>
  }
  export type ClaimIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payer?: boolean | Claim$payerArgs<ExtArgs>
  }

  export type $ClaimPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Claim"
    objects: {
      payer: Prisma.$PayerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      claimNumber: string
      status: string
      payerId: string | null
      patientId: string
      encounterId: string | null
      totalAmount: Prisma.Decimal
      currency: string
      serviceDate: Date
      submittedAt: Date | null
      adjudicatedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["claim"]>
    composites: {}
  }

  type ClaimGetPayload<S extends boolean | null | undefined | ClaimDefaultArgs> = $Result.GetResult<Prisma.$ClaimPayload, S>

  type ClaimCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClaimFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClaimCountAggregateInputType | true
    }

  export interface ClaimDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Claim'], meta: { name: 'Claim' } }
    /**
     * Find zero or one Claim that matches the filter.
     * @param {ClaimFindUniqueArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClaimFindUniqueArgs>(args: SelectSubset<T, ClaimFindUniqueArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Claim that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClaimFindUniqueOrThrowArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClaimFindUniqueOrThrowArgs>(args: SelectSubset<T, ClaimFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Claim that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindFirstArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClaimFindFirstArgs>(args?: SelectSubset<T, ClaimFindFirstArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Claim that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindFirstOrThrowArgs} args - Arguments to find a Claim
     * @example
     * // Get one Claim
     * const claim = await prisma.claim.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClaimFindFirstOrThrowArgs>(args?: SelectSubset<T, ClaimFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Claims that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Claims
     * const claims = await prisma.claim.findMany()
     * 
     * // Get first 10 Claims
     * const claims = await prisma.claim.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const claimWithIdOnly = await prisma.claim.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClaimFindManyArgs>(args?: SelectSubset<T, ClaimFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Claim.
     * @param {ClaimCreateArgs} args - Arguments to create a Claim.
     * @example
     * // Create one Claim
     * const Claim = await prisma.claim.create({
     *   data: {
     *     // ... data to create a Claim
     *   }
     * })
     * 
     */
    create<T extends ClaimCreateArgs>(args: SelectSubset<T, ClaimCreateArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Claims.
     * @param {ClaimCreateManyArgs} args - Arguments to create many Claims.
     * @example
     * // Create many Claims
     * const claim = await prisma.claim.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClaimCreateManyArgs>(args?: SelectSubset<T, ClaimCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Claims and returns the data saved in the database.
     * @param {ClaimCreateManyAndReturnArgs} args - Arguments to create many Claims.
     * @example
     * // Create many Claims
     * const claim = await prisma.claim.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Claims and only return the `id`
     * const claimWithIdOnly = await prisma.claim.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClaimCreateManyAndReturnArgs>(args?: SelectSubset<T, ClaimCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Claim.
     * @param {ClaimDeleteArgs} args - Arguments to delete one Claim.
     * @example
     * // Delete one Claim
     * const Claim = await prisma.claim.delete({
     *   where: {
     *     // ... filter to delete one Claim
     *   }
     * })
     * 
     */
    delete<T extends ClaimDeleteArgs>(args: SelectSubset<T, ClaimDeleteArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Claim.
     * @param {ClaimUpdateArgs} args - Arguments to update one Claim.
     * @example
     * // Update one Claim
     * const claim = await prisma.claim.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClaimUpdateArgs>(args: SelectSubset<T, ClaimUpdateArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Claims.
     * @param {ClaimDeleteManyArgs} args - Arguments to filter Claims to delete.
     * @example
     * // Delete a few Claims
     * const { count } = await prisma.claim.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClaimDeleteManyArgs>(args?: SelectSubset<T, ClaimDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Claims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Claims
     * const claim = await prisma.claim.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClaimUpdateManyArgs>(args: SelectSubset<T, ClaimUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Claim.
     * @param {ClaimUpsertArgs} args - Arguments to update or create a Claim.
     * @example
     * // Update or create a Claim
     * const claim = await prisma.claim.upsert({
     *   create: {
     *     // ... data to create a Claim
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Claim we want to update
     *   }
     * })
     */
    upsert<T extends ClaimUpsertArgs>(args: SelectSubset<T, ClaimUpsertArgs<ExtArgs>>): Prisma__ClaimClient<$Result.GetResult<Prisma.$ClaimPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Claims.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimCountArgs} args - Arguments to filter Claims to count.
     * @example
     * // Count the number of Claims
     * const count = await prisma.claim.count({
     *   where: {
     *     // ... the filter for the Claims we want to count
     *   }
     * })
    **/
    count<T extends ClaimCountArgs>(
      args?: Subset<T, ClaimCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClaimCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Claim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClaimAggregateArgs>(args: Subset<T, ClaimAggregateArgs>): Prisma.PrismaPromise<GetClaimAggregateType<T>>

    /**
     * Group by Claim.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClaimGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClaimGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClaimGroupByArgs['orderBy'] }
        : { orderBy?: ClaimGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClaimGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClaimGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Claim model
   */
  readonly fields: ClaimFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Claim.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClaimClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payer<T extends Claim$payerArgs<ExtArgs> = {}>(args?: Subset<T, Claim$payerArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Claim model
   */ 
  interface ClaimFieldRefs {
    readonly id: FieldRef<"Claim", 'String'>
    readonly tenantId: FieldRef<"Claim", 'String'>
    readonly claimNumber: FieldRef<"Claim", 'String'>
    readonly status: FieldRef<"Claim", 'String'>
    readonly payerId: FieldRef<"Claim", 'String'>
    readonly patientId: FieldRef<"Claim", 'String'>
    readonly encounterId: FieldRef<"Claim", 'String'>
    readonly totalAmount: FieldRef<"Claim", 'Decimal'>
    readonly currency: FieldRef<"Claim", 'String'>
    readonly serviceDate: FieldRef<"Claim", 'DateTime'>
    readonly submittedAt: FieldRef<"Claim", 'DateTime'>
    readonly adjudicatedAt: FieldRef<"Claim", 'DateTime'>
    readonly createdAt: FieldRef<"Claim", 'DateTime'>
    readonly updatedAt: FieldRef<"Claim", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Claim findUnique
   */
  export type ClaimFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim findUniqueOrThrow
   */
  export type ClaimFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim findFirst
   */
  export type ClaimFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Claims.
     */
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim findFirstOrThrow
   */
  export type ClaimFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claim to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Claims.
     */
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim findMany
   */
  export type ClaimFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter, which Claims to fetch.
     */
    where?: ClaimWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Claims to fetch.
     */
    orderBy?: ClaimOrderByWithRelationInput | ClaimOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Claims.
     */
    cursor?: ClaimWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Claims from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Claims.
     */
    skip?: number
    distinct?: ClaimScalarFieldEnum | ClaimScalarFieldEnum[]
  }

  /**
   * Claim create
   */
  export type ClaimCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The data needed to create a Claim.
     */
    data: XOR<ClaimCreateInput, ClaimUncheckedCreateInput>
  }

  /**
   * Claim createMany
   */
  export type ClaimCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Claims.
     */
    data: ClaimCreateManyInput | ClaimCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Claim createManyAndReturn
   */
  export type ClaimCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Claims.
     */
    data: ClaimCreateManyInput | ClaimCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Claim update
   */
  export type ClaimUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The data needed to update a Claim.
     */
    data: XOR<ClaimUpdateInput, ClaimUncheckedUpdateInput>
    /**
     * Choose, which Claim to update.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim updateMany
   */
  export type ClaimUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Claims.
     */
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyInput>
    /**
     * Filter which Claims to update
     */
    where?: ClaimWhereInput
  }

  /**
   * Claim upsert
   */
  export type ClaimUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * The filter to search for the Claim to update in case it exists.
     */
    where: ClaimWhereUniqueInput
    /**
     * In case the Claim found by the `where` argument doesn't exist, create a new Claim with this data.
     */
    create: XOR<ClaimCreateInput, ClaimUncheckedCreateInput>
    /**
     * In case the Claim was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClaimUpdateInput, ClaimUncheckedUpdateInput>
  }

  /**
   * Claim delete
   */
  export type ClaimDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
    /**
     * Filter which Claim to delete.
     */
    where: ClaimWhereUniqueInput
  }

  /**
   * Claim deleteMany
   */
  export type ClaimDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Claims to delete
     */
    where?: ClaimWhereInput
  }

  /**
   * Claim.payer
   */
  export type Claim$payerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    where?: PayerWhereInput
  }

  /**
   * Claim without action
   */
  export type ClaimDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Claim
     */
    select?: ClaimSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClaimInclude<ExtArgs> | null
  }


  /**
   * Model EncounterCoverage
   */

  export type AggregateEncounterCoverage = {
    _count: EncounterCoverageCountAggregateOutputType | null
    _avg: EncounterCoverageAvgAggregateOutputType | null
    _sum: EncounterCoverageSumAggregateOutputType | null
    _min: EncounterCoverageMinAggregateOutputType | null
    _max: EncounterCoverageMaxAggregateOutputType | null
  }

  export type EncounterCoverageAvgAggregateOutputType = {
    copayAmount: Decimal | null
    coinsurancePct: Decimal | null
  }

  export type EncounterCoverageSumAggregateOutputType = {
    copayAmount: Decimal | null
    coinsurancePct: Decimal | null
  }

  export type EncounterCoverageMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    encounterId: string | null
    patientId: string | null
    policyId: string | null
    payerId: string | null
    financialClass: string | null
    coverageLevel: string | null
    planName: string | null
    memberId: string | null
    memberName: string | null
    networkName: string | null
    copayAmount: Decimal | null
    coinsurancePct: Decimal | null
    eligibilityRequestId: string | null
    preauthRequestId: string | null
    costEstimateId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterCoverageMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    encounterId: string | null
    patientId: string | null
    policyId: string | null
    payerId: string | null
    financialClass: string | null
    coverageLevel: string | null
    planName: string | null
    memberId: string | null
    memberName: string | null
    networkName: string | null
    copayAmount: Decimal | null
    coinsurancePct: Decimal | null
    eligibilityRequestId: string | null
    preauthRequestId: string | null
    costEstimateId: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterCoverageCountAggregateOutputType = {
    id: number
    tenantId: number
    encounterId: number
    patientId: number
    policyId: number
    payerId: number
    financialClass: number
    coverageLevel: number
    planName: number
    memberId: number
    memberName: number
    networkName: number
    copayAmount: number
    coinsurancePct: number
    deductibleSnapshot: number
    benefitsSnapshot: number
    eligibilityRequestId: number
    preauthRequestId: number
    costEstimateId: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EncounterCoverageAvgAggregateInputType = {
    copayAmount?: true
    coinsurancePct?: true
  }

  export type EncounterCoverageSumAggregateInputType = {
    copayAmount?: true
    coinsurancePct?: true
  }

  export type EncounterCoverageMinAggregateInputType = {
    id?: true
    tenantId?: true
    encounterId?: true
    patientId?: true
    policyId?: true
    payerId?: true
    financialClass?: true
    coverageLevel?: true
    planName?: true
    memberId?: true
    memberName?: true
    networkName?: true
    copayAmount?: true
    coinsurancePct?: true
    eligibilityRequestId?: true
    preauthRequestId?: true
    costEstimateId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterCoverageMaxAggregateInputType = {
    id?: true
    tenantId?: true
    encounterId?: true
    patientId?: true
    policyId?: true
    payerId?: true
    financialClass?: true
    coverageLevel?: true
    planName?: true
    memberId?: true
    memberName?: true
    networkName?: true
    copayAmount?: true
    coinsurancePct?: true
    eligibilityRequestId?: true
    preauthRequestId?: true
    costEstimateId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterCoverageCountAggregateInputType = {
    id?: true
    tenantId?: true
    encounterId?: true
    patientId?: true
    policyId?: true
    payerId?: true
    financialClass?: true
    coverageLevel?: true
    planName?: true
    memberId?: true
    memberName?: true
    networkName?: true
    copayAmount?: true
    coinsurancePct?: true
    deductibleSnapshot?: true
    benefitsSnapshot?: true
    eligibilityRequestId?: true
    preauthRequestId?: true
    costEstimateId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EncounterCoverageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EncounterCoverage to aggregate.
     */
    where?: EncounterCoverageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EncounterCoverages to fetch.
     */
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterCoverageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EncounterCoverages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EncounterCoverages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EncounterCoverages
    **/
    _count?: true | EncounterCoverageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EncounterCoverageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EncounterCoverageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterCoverageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterCoverageMaxAggregateInputType
  }

  export type GetEncounterCoverageAggregateType<T extends EncounterCoverageAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounterCoverage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounterCoverage[P]>
      : GetScalarType<T[P], AggregateEncounterCoverage[P]>
  }




  export type EncounterCoverageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterCoverageWhereInput
    orderBy?: EncounterCoverageOrderByWithAggregationInput | EncounterCoverageOrderByWithAggregationInput[]
    by: EncounterCoverageScalarFieldEnum[] | EncounterCoverageScalarFieldEnum
    having?: EncounterCoverageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCoverageCountAggregateInputType | true
    _avg?: EncounterCoverageAvgAggregateInputType
    _sum?: EncounterCoverageSumAggregateInputType
    _min?: EncounterCoverageMinAggregateInputType
    _max?: EncounterCoverageMaxAggregateInputType
  }

  export type EncounterCoverageGroupByOutputType = {
    id: string
    tenantId: string
    encounterId: string
    patientId: string
    policyId: string | null
    payerId: string | null
    financialClass: string
    coverageLevel: string
    planName: string | null
    memberId: string | null
    memberName: string | null
    networkName: string | null
    copayAmount: Decimal | null
    coinsurancePct: Decimal | null
    deductibleSnapshot: JsonValue | null
    benefitsSnapshot: JsonValue | null
    eligibilityRequestId: string | null
    preauthRequestId: string | null
    costEstimateId: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: EncounterCoverageCountAggregateOutputType | null
    _avg: EncounterCoverageAvgAggregateOutputType | null
    _sum: EncounterCoverageSumAggregateOutputType | null
    _min: EncounterCoverageMinAggregateOutputType | null
    _max: EncounterCoverageMaxAggregateOutputType | null
  }

  type GetEncounterCoverageGroupByPayload<T extends EncounterCoverageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterCoverageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterCoverageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterCoverageGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterCoverageGroupByOutputType[P]>
        }
      >
    >


  export type EncounterCoverageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    encounterId?: boolean
    patientId?: boolean
    policyId?: boolean
    payerId?: boolean
    financialClass?: boolean
    coverageLevel?: boolean
    planName?: boolean
    memberId?: boolean
    memberName?: boolean
    networkName?: boolean
    copayAmount?: boolean
    coinsurancePct?: boolean
    deductibleSnapshot?: boolean
    benefitsSnapshot?: boolean
    eligibilityRequestId?: boolean
    preauthRequestId?: boolean
    costEstimateId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    policy?: boolean | EncounterCoverage$policyArgs<ExtArgs>
    payer?: boolean | EncounterCoverage$payerArgs<ExtArgs>
  }, ExtArgs["result"]["encounterCoverage"]>

  export type EncounterCoverageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    encounterId?: boolean
    patientId?: boolean
    policyId?: boolean
    payerId?: boolean
    financialClass?: boolean
    coverageLevel?: boolean
    planName?: boolean
    memberId?: boolean
    memberName?: boolean
    networkName?: boolean
    copayAmount?: boolean
    coinsurancePct?: boolean
    deductibleSnapshot?: boolean
    benefitsSnapshot?: boolean
    eligibilityRequestId?: boolean
    preauthRequestId?: boolean
    costEstimateId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    policy?: boolean | EncounterCoverage$policyArgs<ExtArgs>
    payer?: boolean | EncounterCoverage$payerArgs<ExtArgs>
  }, ExtArgs["result"]["encounterCoverage"]>

  export type EncounterCoverageSelectScalar = {
    id?: boolean
    tenantId?: boolean
    encounterId?: boolean
    patientId?: boolean
    policyId?: boolean
    payerId?: boolean
    financialClass?: boolean
    coverageLevel?: boolean
    planName?: boolean
    memberId?: boolean
    memberName?: boolean
    networkName?: boolean
    copayAmount?: boolean
    coinsurancePct?: boolean
    deductibleSnapshot?: boolean
    benefitsSnapshot?: boolean
    eligibilityRequestId?: boolean
    preauthRequestId?: boolean
    costEstimateId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EncounterCoverageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policy?: boolean | EncounterCoverage$policyArgs<ExtArgs>
    payer?: boolean | EncounterCoverage$payerArgs<ExtArgs>
  }
  export type EncounterCoverageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    policy?: boolean | EncounterCoverage$policyArgs<ExtArgs>
    payer?: boolean | EncounterCoverage$payerArgs<ExtArgs>
  }

  export type $EncounterCoveragePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EncounterCoverage"
    objects: {
      policy: Prisma.$PolicyPayload<ExtArgs> | null
      payer: Prisma.$PayerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      encounterId: string
      patientId: string
      policyId: string | null
      payerId: string | null
      financialClass: string
      coverageLevel: string
      planName: string | null
      memberId: string | null
      memberName: string | null
      networkName: string | null
      copayAmount: Prisma.Decimal | null
      coinsurancePct: Prisma.Decimal | null
      deductibleSnapshot: Prisma.JsonValue | null
      benefitsSnapshot: Prisma.JsonValue | null
      eligibilityRequestId: string | null
      preauthRequestId: string | null
      costEstimateId: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["encounterCoverage"]>
    composites: {}
  }

  type EncounterCoverageGetPayload<S extends boolean | null | undefined | EncounterCoverageDefaultArgs> = $Result.GetResult<Prisma.$EncounterCoveragePayload, S>

  type EncounterCoverageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EncounterCoverageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EncounterCoverageCountAggregateInputType | true
    }

  export interface EncounterCoverageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EncounterCoverage'], meta: { name: 'EncounterCoverage' } }
    /**
     * Find zero or one EncounterCoverage that matches the filter.
     * @param {EncounterCoverageFindUniqueArgs} args - Arguments to find a EncounterCoverage
     * @example
     * // Get one EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterCoverageFindUniqueArgs>(args: SelectSubset<T, EncounterCoverageFindUniqueArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EncounterCoverage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EncounterCoverageFindUniqueOrThrowArgs} args - Arguments to find a EncounterCoverage
     * @example
     * // Get one EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterCoverageFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterCoverageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EncounterCoverage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageFindFirstArgs} args - Arguments to find a EncounterCoverage
     * @example
     * // Get one EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterCoverageFindFirstArgs>(args?: SelectSubset<T, EncounterCoverageFindFirstArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EncounterCoverage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageFindFirstOrThrowArgs} args - Arguments to find a EncounterCoverage
     * @example
     * // Get one EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterCoverageFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterCoverageFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EncounterCoverages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EncounterCoverages
     * const encounterCoverages = await prisma.encounterCoverage.findMany()
     * 
     * // Get first 10 EncounterCoverages
     * const encounterCoverages = await prisma.encounterCoverage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterCoverageWithIdOnly = await prisma.encounterCoverage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterCoverageFindManyArgs>(args?: SelectSubset<T, EncounterCoverageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EncounterCoverage.
     * @param {EncounterCoverageCreateArgs} args - Arguments to create a EncounterCoverage.
     * @example
     * // Create one EncounterCoverage
     * const EncounterCoverage = await prisma.encounterCoverage.create({
     *   data: {
     *     // ... data to create a EncounterCoverage
     *   }
     * })
     * 
     */
    create<T extends EncounterCoverageCreateArgs>(args: SelectSubset<T, EncounterCoverageCreateArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EncounterCoverages.
     * @param {EncounterCoverageCreateManyArgs} args - Arguments to create many EncounterCoverages.
     * @example
     * // Create many EncounterCoverages
     * const encounterCoverage = await prisma.encounterCoverage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCoverageCreateManyArgs>(args?: SelectSubset<T, EncounterCoverageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EncounterCoverages and returns the data saved in the database.
     * @param {EncounterCoverageCreateManyAndReturnArgs} args - Arguments to create many EncounterCoverages.
     * @example
     * // Create many EncounterCoverages
     * const encounterCoverage = await prisma.encounterCoverage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EncounterCoverages and only return the `id`
     * const encounterCoverageWithIdOnly = await prisma.encounterCoverage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EncounterCoverageCreateManyAndReturnArgs>(args?: SelectSubset<T, EncounterCoverageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EncounterCoverage.
     * @param {EncounterCoverageDeleteArgs} args - Arguments to delete one EncounterCoverage.
     * @example
     * // Delete one EncounterCoverage
     * const EncounterCoverage = await prisma.encounterCoverage.delete({
     *   where: {
     *     // ... filter to delete one EncounterCoverage
     *   }
     * })
     * 
     */
    delete<T extends EncounterCoverageDeleteArgs>(args: SelectSubset<T, EncounterCoverageDeleteArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EncounterCoverage.
     * @param {EncounterCoverageUpdateArgs} args - Arguments to update one EncounterCoverage.
     * @example
     * // Update one EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterCoverageUpdateArgs>(args: SelectSubset<T, EncounterCoverageUpdateArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EncounterCoverages.
     * @param {EncounterCoverageDeleteManyArgs} args - Arguments to filter EncounterCoverages to delete.
     * @example
     * // Delete a few EncounterCoverages
     * const { count } = await prisma.encounterCoverage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterCoverageDeleteManyArgs>(args?: SelectSubset<T, EncounterCoverageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EncounterCoverages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EncounterCoverages
     * const encounterCoverage = await prisma.encounterCoverage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterCoverageUpdateManyArgs>(args: SelectSubset<T, EncounterCoverageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EncounterCoverage.
     * @param {EncounterCoverageUpsertArgs} args - Arguments to update or create a EncounterCoverage.
     * @example
     * // Update or create a EncounterCoverage
     * const encounterCoverage = await prisma.encounterCoverage.upsert({
     *   create: {
     *     // ... data to create a EncounterCoverage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EncounterCoverage we want to update
     *   }
     * })
     */
    upsert<T extends EncounterCoverageUpsertArgs>(args: SelectSubset<T, EncounterCoverageUpsertArgs<ExtArgs>>): Prisma__EncounterCoverageClient<$Result.GetResult<Prisma.$EncounterCoveragePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EncounterCoverages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageCountArgs} args - Arguments to filter EncounterCoverages to count.
     * @example
     * // Count the number of EncounterCoverages
     * const count = await prisma.encounterCoverage.count({
     *   where: {
     *     // ... the filter for the EncounterCoverages we want to count
     *   }
     * })
    **/
    count<T extends EncounterCoverageCountArgs>(
      args?: Subset<T, EncounterCoverageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCoverageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EncounterCoverage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EncounterCoverageAggregateArgs>(args: Subset<T, EncounterCoverageAggregateArgs>): Prisma.PrismaPromise<GetEncounterCoverageAggregateType<T>>

    /**
     * Group by EncounterCoverage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCoverageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EncounterCoverageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterCoverageGroupByArgs['orderBy'] }
        : { orderBy?: EncounterCoverageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EncounterCoverageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterCoverageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EncounterCoverage model
   */
  readonly fields: EncounterCoverageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EncounterCoverage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterCoverageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    policy<T extends EncounterCoverage$policyArgs<ExtArgs> = {}>(args?: Subset<T, EncounterCoverage$policyArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    payer<T extends EncounterCoverage$payerArgs<ExtArgs> = {}>(args?: Subset<T, EncounterCoverage$payerArgs<ExtArgs>>): Prisma__PayerClient<$Result.GetResult<Prisma.$PayerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EncounterCoverage model
   */ 
  interface EncounterCoverageFieldRefs {
    readonly id: FieldRef<"EncounterCoverage", 'String'>
    readonly tenantId: FieldRef<"EncounterCoverage", 'String'>
    readonly encounterId: FieldRef<"EncounterCoverage", 'String'>
    readonly patientId: FieldRef<"EncounterCoverage", 'String'>
    readonly policyId: FieldRef<"EncounterCoverage", 'String'>
    readonly payerId: FieldRef<"EncounterCoverage", 'String'>
    readonly financialClass: FieldRef<"EncounterCoverage", 'String'>
    readonly coverageLevel: FieldRef<"EncounterCoverage", 'String'>
    readonly planName: FieldRef<"EncounterCoverage", 'String'>
    readonly memberId: FieldRef<"EncounterCoverage", 'String'>
    readonly memberName: FieldRef<"EncounterCoverage", 'String'>
    readonly networkName: FieldRef<"EncounterCoverage", 'String'>
    readonly copayAmount: FieldRef<"EncounterCoverage", 'Decimal'>
    readonly coinsurancePct: FieldRef<"EncounterCoverage", 'Decimal'>
    readonly deductibleSnapshot: FieldRef<"EncounterCoverage", 'Json'>
    readonly benefitsSnapshot: FieldRef<"EncounterCoverage", 'Json'>
    readonly eligibilityRequestId: FieldRef<"EncounterCoverage", 'String'>
    readonly preauthRequestId: FieldRef<"EncounterCoverage", 'String'>
    readonly costEstimateId: FieldRef<"EncounterCoverage", 'String'>
    readonly isActive: FieldRef<"EncounterCoverage", 'Boolean'>
    readonly createdAt: FieldRef<"EncounterCoverage", 'DateTime'>
    readonly updatedAt: FieldRef<"EncounterCoverage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EncounterCoverage findUnique
   */
  export type EncounterCoverageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter, which EncounterCoverage to fetch.
     */
    where: EncounterCoverageWhereUniqueInput
  }

  /**
   * EncounterCoverage findUniqueOrThrow
   */
  export type EncounterCoverageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter, which EncounterCoverage to fetch.
     */
    where: EncounterCoverageWhereUniqueInput
  }

  /**
   * EncounterCoverage findFirst
   */
  export type EncounterCoverageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter, which EncounterCoverage to fetch.
     */
    where?: EncounterCoverageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EncounterCoverages to fetch.
     */
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EncounterCoverages.
     */
    cursor?: EncounterCoverageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EncounterCoverages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EncounterCoverages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EncounterCoverages.
     */
    distinct?: EncounterCoverageScalarFieldEnum | EncounterCoverageScalarFieldEnum[]
  }

  /**
   * EncounterCoverage findFirstOrThrow
   */
  export type EncounterCoverageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter, which EncounterCoverage to fetch.
     */
    where?: EncounterCoverageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EncounterCoverages to fetch.
     */
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EncounterCoverages.
     */
    cursor?: EncounterCoverageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EncounterCoverages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EncounterCoverages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EncounterCoverages.
     */
    distinct?: EncounterCoverageScalarFieldEnum | EncounterCoverageScalarFieldEnum[]
  }

  /**
   * EncounterCoverage findMany
   */
  export type EncounterCoverageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter, which EncounterCoverages to fetch.
     */
    where?: EncounterCoverageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EncounterCoverages to fetch.
     */
    orderBy?: EncounterCoverageOrderByWithRelationInput | EncounterCoverageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EncounterCoverages.
     */
    cursor?: EncounterCoverageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EncounterCoverages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EncounterCoverages.
     */
    skip?: number
    distinct?: EncounterCoverageScalarFieldEnum | EncounterCoverageScalarFieldEnum[]
  }

  /**
   * EncounterCoverage create
   */
  export type EncounterCoverageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * The data needed to create a EncounterCoverage.
     */
    data: XOR<EncounterCoverageCreateInput, EncounterCoverageUncheckedCreateInput>
  }

  /**
   * EncounterCoverage createMany
   */
  export type EncounterCoverageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EncounterCoverages.
     */
    data: EncounterCoverageCreateManyInput | EncounterCoverageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EncounterCoverage createManyAndReturn
   */
  export type EncounterCoverageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EncounterCoverages.
     */
    data: EncounterCoverageCreateManyInput | EncounterCoverageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EncounterCoverage update
   */
  export type EncounterCoverageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * The data needed to update a EncounterCoverage.
     */
    data: XOR<EncounterCoverageUpdateInput, EncounterCoverageUncheckedUpdateInput>
    /**
     * Choose, which EncounterCoverage to update.
     */
    where: EncounterCoverageWhereUniqueInput
  }

  /**
   * EncounterCoverage updateMany
   */
  export type EncounterCoverageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EncounterCoverages.
     */
    data: XOR<EncounterCoverageUpdateManyMutationInput, EncounterCoverageUncheckedUpdateManyInput>
    /**
     * Filter which EncounterCoverages to update
     */
    where?: EncounterCoverageWhereInput
  }

  /**
   * EncounterCoverage upsert
   */
  export type EncounterCoverageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * The filter to search for the EncounterCoverage to update in case it exists.
     */
    where: EncounterCoverageWhereUniqueInput
    /**
     * In case the EncounterCoverage found by the `where` argument doesn't exist, create a new EncounterCoverage with this data.
     */
    create: XOR<EncounterCoverageCreateInput, EncounterCoverageUncheckedCreateInput>
    /**
     * In case the EncounterCoverage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterCoverageUpdateInput, EncounterCoverageUncheckedUpdateInput>
  }

  /**
   * EncounterCoverage delete
   */
  export type EncounterCoverageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
    /**
     * Filter which EncounterCoverage to delete.
     */
    where: EncounterCoverageWhereUniqueInput
  }

  /**
   * EncounterCoverage deleteMany
   */
  export type EncounterCoverageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EncounterCoverages to delete
     */
    where?: EncounterCoverageWhereInput
  }

  /**
   * EncounterCoverage.policy
   */
  export type EncounterCoverage$policyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    where?: PolicyWhereInput
  }

  /**
   * EncounterCoverage.payer
   */
  export type EncounterCoverage$payerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payer
     */
    select?: PayerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PayerInclude<ExtArgs> | null
    where?: PayerWhereInput
  }

  /**
   * EncounterCoverage without action
   */
  export type EncounterCoverageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EncounterCoverage
     */
    select?: EncounterCoverageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterCoverageInclude<ExtArgs> | null
  }


  /**
   * Model BillingItem
   */

  export type AggregateBillingItem = {
    _count: BillingItemCountAggregateOutputType | null
    _avg: BillingItemAvgAggregateOutputType | null
    _sum: BillingItemSumAggregateOutputType | null
    _min: BillingItemMinAggregateOutputType | null
    _max: BillingItemMaxAggregateOutputType | null
  }

  export type BillingItemAvgAggregateOutputType = {
    listPrice: Decimal | null
  }

  export type BillingItemSumAggregateOutputType = {
    listPrice: Decimal | null
  }

  export type BillingItemMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    itemType: string | null
    clinicalRefId: string | null
    billingCode: string | null
    billingCodeType: string | null
    billingDescription: string | null
    chargeType: string | null
    defaultUnit: string | null
    listPrice: Decimal | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingItemMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    itemType: string | null
    clinicalRefId: string | null
    billingCode: string | null
    billingCodeType: string | null
    billingDescription: string | null
    chargeType: string | null
    defaultUnit: string | null
    listPrice: Decimal | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BillingItemCountAggregateOutputType = {
    id: number
    tenantId: number
    itemType: number
    clinicalRefId: number
    billingCode: number
    billingCodeType: number
    billingDescription: number
    chargeType: number
    defaultUnit: number
    listPrice: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BillingItemAvgAggregateInputType = {
    listPrice?: true
  }

  export type BillingItemSumAggregateInputType = {
    listPrice?: true
  }

  export type BillingItemMinAggregateInputType = {
    id?: true
    tenantId?: true
    itemType?: true
    clinicalRefId?: true
    billingCode?: true
    billingCodeType?: true
    billingDescription?: true
    chargeType?: true
    defaultUnit?: true
    listPrice?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingItemMaxAggregateInputType = {
    id?: true
    tenantId?: true
    itemType?: true
    clinicalRefId?: true
    billingCode?: true
    billingCodeType?: true
    billingDescription?: true
    chargeType?: true
    defaultUnit?: true
    listPrice?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BillingItemCountAggregateInputType = {
    id?: true
    tenantId?: true
    itemType?: true
    clinicalRefId?: true
    billingCode?: true
    billingCodeType?: true
    billingDescription?: true
    chargeType?: true
    defaultUnit?: true
    listPrice?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BillingItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingItem to aggregate.
     */
    where?: BillingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingItems to fetch.
     */
    orderBy?: BillingItemOrderByWithRelationInput | BillingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingItems
    **/
    _count?: true | BillingItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingItemMaxAggregateInputType
  }

  export type GetBillingItemAggregateType<T extends BillingItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingItem[P]>
      : GetScalarType<T[P], AggregateBillingItem[P]>
  }




  export type BillingItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingItemWhereInput
    orderBy?: BillingItemOrderByWithAggregationInput | BillingItemOrderByWithAggregationInput[]
    by: BillingItemScalarFieldEnum[] | BillingItemScalarFieldEnum
    having?: BillingItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingItemCountAggregateInputType | true
    _avg?: BillingItemAvgAggregateInputType
    _sum?: BillingItemSumAggregateInputType
    _min?: BillingItemMinAggregateInputType
    _max?: BillingItemMaxAggregateInputType
  }

  export type BillingItemGroupByOutputType = {
    id: string
    tenantId: string | null
    itemType: string
    clinicalRefId: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit: string
    listPrice: Decimal | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: BillingItemCountAggregateOutputType | null
    _avg: BillingItemAvgAggregateOutputType | null
    _sum: BillingItemSumAggregateOutputType | null
    _min: BillingItemMinAggregateOutputType | null
    _max: BillingItemMaxAggregateOutputType | null
  }

  type GetBillingItemGroupByPayload<T extends BillingItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingItemGroupByOutputType[P]>
            : GetScalarType<T[P], BillingItemGroupByOutputType[P]>
        }
      >
    >


  export type BillingItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    itemType?: boolean
    clinicalRefId?: boolean
    billingCode?: boolean
    billingCodeType?: boolean
    billingDescription?: boolean
    chargeType?: boolean
    defaultUnit?: boolean
    listPrice?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    charges?: boolean | BillingItem$chargesArgs<ExtArgs>
    _count?: boolean | BillingItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["billingItem"]>

  export type BillingItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    itemType?: boolean
    clinicalRefId?: boolean
    billingCode?: boolean
    billingCodeType?: boolean
    billingDescription?: boolean
    chargeType?: boolean
    defaultUnit?: boolean
    listPrice?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["billingItem"]>

  export type BillingItemSelectScalar = {
    id?: boolean
    tenantId?: boolean
    itemType?: boolean
    clinicalRefId?: boolean
    billingCode?: boolean
    billingCodeType?: boolean
    billingDescription?: boolean
    chargeType?: boolean
    defaultUnit?: boolean
    listPrice?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BillingItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    charges?: boolean | BillingItem$chargesArgs<ExtArgs>
    _count?: boolean | BillingItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BillingItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BillingItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingItem"
    objects: {
      charges: Prisma.$ChargePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      itemType: string
      clinicalRefId: string | null
      billingCode: string
      billingCodeType: string
      billingDescription: string
      chargeType: string
      defaultUnit: string
      listPrice: Prisma.Decimal | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["billingItem"]>
    composites: {}
  }

  type BillingItemGetPayload<S extends boolean | null | undefined | BillingItemDefaultArgs> = $Result.GetResult<Prisma.$BillingItemPayload, S>

  type BillingItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingItemCountAggregateInputType | true
    }

  export interface BillingItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingItem'], meta: { name: 'BillingItem' } }
    /**
     * Find zero or one BillingItem that matches the filter.
     * @param {BillingItemFindUniqueArgs} args - Arguments to find a BillingItem
     * @example
     * // Get one BillingItem
     * const billingItem = await prisma.billingItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingItemFindUniqueArgs>(args: SelectSubset<T, BillingItemFindUniqueArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BillingItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingItemFindUniqueOrThrowArgs} args - Arguments to find a BillingItem
     * @example
     * // Get one BillingItem
     * const billingItem = await prisma.billingItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BillingItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemFindFirstArgs} args - Arguments to find a BillingItem
     * @example
     * // Get one BillingItem
     * const billingItem = await prisma.billingItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingItemFindFirstArgs>(args?: SelectSubset<T, BillingItemFindFirstArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BillingItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemFindFirstOrThrowArgs} args - Arguments to find a BillingItem
     * @example
     * // Get one BillingItem
     * const billingItem = await prisma.billingItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BillingItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingItems
     * const billingItems = await prisma.billingItem.findMany()
     * 
     * // Get first 10 BillingItems
     * const billingItems = await prisma.billingItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingItemWithIdOnly = await prisma.billingItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingItemFindManyArgs>(args?: SelectSubset<T, BillingItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BillingItem.
     * @param {BillingItemCreateArgs} args - Arguments to create a BillingItem.
     * @example
     * // Create one BillingItem
     * const BillingItem = await prisma.billingItem.create({
     *   data: {
     *     // ... data to create a BillingItem
     *   }
     * })
     * 
     */
    create<T extends BillingItemCreateArgs>(args: SelectSubset<T, BillingItemCreateArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BillingItems.
     * @param {BillingItemCreateManyArgs} args - Arguments to create many BillingItems.
     * @example
     * // Create many BillingItems
     * const billingItem = await prisma.billingItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingItemCreateManyArgs>(args?: SelectSubset<T, BillingItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BillingItems and returns the data saved in the database.
     * @param {BillingItemCreateManyAndReturnArgs} args - Arguments to create many BillingItems.
     * @example
     * // Create many BillingItems
     * const billingItem = await prisma.billingItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BillingItems and only return the `id`
     * const billingItemWithIdOnly = await prisma.billingItem.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingItemCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BillingItem.
     * @param {BillingItemDeleteArgs} args - Arguments to delete one BillingItem.
     * @example
     * // Delete one BillingItem
     * const BillingItem = await prisma.billingItem.delete({
     *   where: {
     *     // ... filter to delete one BillingItem
     *   }
     * })
     * 
     */
    delete<T extends BillingItemDeleteArgs>(args: SelectSubset<T, BillingItemDeleteArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BillingItem.
     * @param {BillingItemUpdateArgs} args - Arguments to update one BillingItem.
     * @example
     * // Update one BillingItem
     * const billingItem = await prisma.billingItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingItemUpdateArgs>(args: SelectSubset<T, BillingItemUpdateArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BillingItems.
     * @param {BillingItemDeleteManyArgs} args - Arguments to filter BillingItems to delete.
     * @example
     * // Delete a few BillingItems
     * const { count } = await prisma.billingItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingItemDeleteManyArgs>(args?: SelectSubset<T, BillingItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingItems
     * const billingItem = await prisma.billingItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingItemUpdateManyArgs>(args: SelectSubset<T, BillingItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingItem.
     * @param {BillingItemUpsertArgs} args - Arguments to update or create a BillingItem.
     * @example
     * // Update or create a BillingItem
     * const billingItem = await prisma.billingItem.upsert({
     *   create: {
     *     // ... data to create a BillingItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingItem we want to update
     *   }
     * })
     */
    upsert<T extends BillingItemUpsertArgs>(args: SelectSubset<T, BillingItemUpsertArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BillingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemCountArgs} args - Arguments to filter BillingItems to count.
     * @example
     * // Count the number of BillingItems
     * const count = await prisma.billingItem.count({
     *   where: {
     *     // ... the filter for the BillingItems we want to count
     *   }
     * })
    **/
    count<T extends BillingItemCountArgs>(
      args?: Subset<T, BillingItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingItemAggregateArgs>(args: Subset<T, BillingItemAggregateArgs>): Prisma.PrismaPromise<GetBillingItemAggregateType<T>>

    /**
     * Group by BillingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingItemGroupByArgs['orderBy'] }
        : { orderBy?: BillingItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingItem model
   */
  readonly fields: BillingItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    charges<T extends BillingItem$chargesArgs<ExtArgs> = {}>(args?: Subset<T, BillingItem$chargesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingItem model
   */ 
  interface BillingItemFieldRefs {
    readonly id: FieldRef<"BillingItem", 'String'>
    readonly tenantId: FieldRef<"BillingItem", 'String'>
    readonly itemType: FieldRef<"BillingItem", 'String'>
    readonly clinicalRefId: FieldRef<"BillingItem", 'String'>
    readonly billingCode: FieldRef<"BillingItem", 'String'>
    readonly billingCodeType: FieldRef<"BillingItem", 'String'>
    readonly billingDescription: FieldRef<"BillingItem", 'String'>
    readonly chargeType: FieldRef<"BillingItem", 'String'>
    readonly defaultUnit: FieldRef<"BillingItem", 'String'>
    readonly listPrice: FieldRef<"BillingItem", 'Decimal'>
    readonly isActive: FieldRef<"BillingItem", 'Boolean'>
    readonly createdAt: FieldRef<"BillingItem", 'DateTime'>
    readonly updatedAt: FieldRef<"BillingItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BillingItem findUnique
   */
  export type BillingItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter, which BillingItem to fetch.
     */
    where: BillingItemWhereUniqueInput
  }

  /**
   * BillingItem findUniqueOrThrow
   */
  export type BillingItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter, which BillingItem to fetch.
     */
    where: BillingItemWhereUniqueInput
  }

  /**
   * BillingItem findFirst
   */
  export type BillingItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter, which BillingItem to fetch.
     */
    where?: BillingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingItems to fetch.
     */
    orderBy?: BillingItemOrderByWithRelationInput | BillingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingItems.
     */
    cursor?: BillingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingItems.
     */
    distinct?: BillingItemScalarFieldEnum | BillingItemScalarFieldEnum[]
  }

  /**
   * BillingItem findFirstOrThrow
   */
  export type BillingItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter, which BillingItem to fetch.
     */
    where?: BillingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingItems to fetch.
     */
    orderBy?: BillingItemOrderByWithRelationInput | BillingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingItems.
     */
    cursor?: BillingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingItems.
     */
    distinct?: BillingItemScalarFieldEnum | BillingItemScalarFieldEnum[]
  }

  /**
   * BillingItem findMany
   */
  export type BillingItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter, which BillingItems to fetch.
     */
    where?: BillingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingItems to fetch.
     */
    orderBy?: BillingItemOrderByWithRelationInput | BillingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingItems.
     */
    cursor?: BillingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingItems.
     */
    skip?: number
    distinct?: BillingItemScalarFieldEnum | BillingItemScalarFieldEnum[]
  }

  /**
   * BillingItem create
   */
  export type BillingItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingItem.
     */
    data: XOR<BillingItemCreateInput, BillingItemUncheckedCreateInput>
  }

  /**
   * BillingItem createMany
   */
  export type BillingItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingItems.
     */
    data: BillingItemCreateManyInput | BillingItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingItem createManyAndReturn
   */
  export type BillingItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BillingItems.
     */
    data: BillingItemCreateManyInput | BillingItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingItem update
   */
  export type BillingItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingItem.
     */
    data: XOR<BillingItemUpdateInput, BillingItemUncheckedUpdateInput>
    /**
     * Choose, which BillingItem to update.
     */
    where: BillingItemWhereUniqueInput
  }

  /**
   * BillingItem updateMany
   */
  export type BillingItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingItems.
     */
    data: XOR<BillingItemUpdateManyMutationInput, BillingItemUncheckedUpdateManyInput>
    /**
     * Filter which BillingItems to update
     */
    where?: BillingItemWhereInput
  }

  /**
   * BillingItem upsert
   */
  export type BillingItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingItem to update in case it exists.
     */
    where: BillingItemWhereUniqueInput
    /**
     * In case the BillingItem found by the `where` argument doesn't exist, create a new BillingItem with this data.
     */
    create: XOR<BillingItemCreateInput, BillingItemUncheckedCreateInput>
    /**
     * In case the BillingItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingItemUpdateInput, BillingItemUncheckedUpdateInput>
  }

  /**
   * BillingItem delete
   */
  export type BillingItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
    /**
     * Filter which BillingItem to delete.
     */
    where: BillingItemWhereUniqueInput
  }

  /**
   * BillingItem deleteMany
   */
  export type BillingItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingItems to delete
     */
    where?: BillingItemWhereInput
  }

  /**
   * BillingItem.charges
   */
  export type BillingItem$chargesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    where?: ChargeWhereInput
    orderBy?: ChargeOrderByWithRelationInput | ChargeOrderByWithRelationInput[]
    cursor?: ChargeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChargeScalarFieldEnum | ChargeScalarFieldEnum[]
  }

  /**
   * BillingItem without action
   */
  export type BillingItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingItem
     */
    select?: BillingItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingItemInclude<ExtArgs> | null
  }


  /**
   * Model Charge
   */

  export type AggregateCharge = {
    _count: ChargeCountAggregateOutputType | null
    _avg: ChargeAvgAggregateOutputType | null
    _sum: ChargeSumAggregateOutputType | null
    _min: ChargeMinAggregateOutputType | null
    _max: ChargeMaxAggregateOutputType | null
  }

  export type ChargeAvgAggregateOutputType = {
    quantity: Decimal | null
    unitPrice: Decimal | null
    grossAmount: Decimal | null
    patientResponsibility: Decimal | null
    payerResponsibility: Decimal | null
  }

  export type ChargeSumAggregateOutputType = {
    quantity: Decimal | null
    unitPrice: Decimal | null
    grossAmount: Decimal | null
    patientResponsibility: Decimal | null
    payerResponsibility: Decimal | null
  }

  export type ChargeMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    billingItemId: string | null
    chargeDate: Date | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    grossAmount: Decimal | null
    patientResponsibility: Decimal | null
    payerResponsibility: Decimal | null
    status: string | null
    sourceType: string | null
    sourceId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChargeMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    billingItemId: string | null
    chargeDate: Date | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    grossAmount: Decimal | null
    patientResponsibility: Decimal | null
    payerResponsibility: Decimal | null
    status: string | null
    sourceType: string | null
    sourceId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChargeCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    encounterId: number
    billingItemId: number
    chargeDate: number
    quantity: number
    unitPrice: number
    grossAmount: number
    patientResponsibility: number
    payerResponsibility: number
    status: number
    sourceType: number
    sourceId: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChargeAvgAggregateInputType = {
    quantity?: true
    unitPrice?: true
    grossAmount?: true
    patientResponsibility?: true
    payerResponsibility?: true
  }

  export type ChargeSumAggregateInputType = {
    quantity?: true
    unitPrice?: true
    grossAmount?: true
    patientResponsibility?: true
    payerResponsibility?: true
  }

  export type ChargeMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    billingItemId?: true
    chargeDate?: true
    quantity?: true
    unitPrice?: true
    grossAmount?: true
    patientResponsibility?: true
    payerResponsibility?: true
    status?: true
    sourceType?: true
    sourceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChargeMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    billingItemId?: true
    chargeDate?: true
    quantity?: true
    unitPrice?: true
    grossAmount?: true
    patientResponsibility?: true
    payerResponsibility?: true
    status?: true
    sourceType?: true
    sourceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChargeCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    billingItemId?: true
    chargeDate?: true
    quantity?: true
    unitPrice?: true
    grossAmount?: true
    patientResponsibility?: true
    payerResponsibility?: true
    status?: true
    sourceType?: true
    sourceId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChargeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Charge to aggregate.
     */
    where?: ChargeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Charges to fetch.
     */
    orderBy?: ChargeOrderByWithRelationInput | ChargeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChargeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Charges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Charges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Charges
    **/
    _count?: true | ChargeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChargeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChargeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChargeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChargeMaxAggregateInputType
  }

  export type GetChargeAggregateType<T extends ChargeAggregateArgs> = {
        [P in keyof T & keyof AggregateCharge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCharge[P]>
      : GetScalarType<T[P], AggregateCharge[P]>
  }




  export type ChargeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargeWhereInput
    orderBy?: ChargeOrderByWithAggregationInput | ChargeOrderByWithAggregationInput[]
    by: ChargeScalarFieldEnum[] | ChargeScalarFieldEnum
    having?: ChargeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChargeCountAggregateInputType | true
    _avg?: ChargeAvgAggregateInputType
    _sum?: ChargeSumAggregateInputType
    _min?: ChargeMinAggregateInputType
    _max?: ChargeMaxAggregateInputType
  }

  export type ChargeGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    encounterId: string | null
    billingItemId: string
    chargeDate: Date
    quantity: Decimal
    unitPrice: Decimal
    grossAmount: Decimal
    patientResponsibility: Decimal | null
    payerResponsibility: Decimal | null
    status: string
    sourceType: string | null
    sourceId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChargeCountAggregateOutputType | null
    _avg: ChargeAvgAggregateOutputType | null
    _sum: ChargeSumAggregateOutputType | null
    _min: ChargeMinAggregateOutputType | null
    _max: ChargeMaxAggregateOutputType | null
  }

  type GetChargeGroupByPayload<T extends ChargeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChargeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChargeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChargeGroupByOutputType[P]>
            : GetScalarType<T[P], ChargeGroupByOutputType[P]>
        }
      >
    >


  export type ChargeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    billingItemId?: boolean
    chargeDate?: boolean
    quantity?: boolean
    unitPrice?: boolean
    grossAmount?: boolean
    patientResponsibility?: boolean
    payerResponsibility?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingItem?: boolean | BillingItemDefaultArgs<ExtArgs>
    invoiceLines?: boolean | Charge$invoiceLinesArgs<ExtArgs>
    _count?: boolean | ChargeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["charge"]>

  export type ChargeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    billingItemId?: boolean
    chargeDate?: boolean
    quantity?: boolean
    unitPrice?: boolean
    grossAmount?: boolean
    patientResponsibility?: boolean
    payerResponsibility?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    billingItem?: boolean | BillingItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["charge"]>

  export type ChargeSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    billingItemId?: boolean
    chargeDate?: boolean
    quantity?: boolean
    unitPrice?: boolean
    grossAmount?: boolean
    patientResponsibility?: boolean
    payerResponsibility?: boolean
    status?: boolean
    sourceType?: boolean
    sourceId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChargeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingItem?: boolean | BillingItemDefaultArgs<ExtArgs>
    invoiceLines?: boolean | Charge$invoiceLinesArgs<ExtArgs>
    _count?: boolean | ChargeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChargeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingItem?: boolean | BillingItemDefaultArgs<ExtArgs>
  }

  export type $ChargePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Charge"
    objects: {
      billingItem: Prisma.$BillingItemPayload<ExtArgs>
      invoiceLines: Prisma.$InvoiceLinePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      encounterId: string | null
      billingItemId: string
      chargeDate: Date
      quantity: Prisma.Decimal
      unitPrice: Prisma.Decimal
      grossAmount: Prisma.Decimal
      patientResponsibility: Prisma.Decimal | null
      payerResponsibility: Prisma.Decimal | null
      status: string
      sourceType: string | null
      sourceId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["charge"]>
    composites: {}
  }

  type ChargeGetPayload<S extends boolean | null | undefined | ChargeDefaultArgs> = $Result.GetResult<Prisma.$ChargePayload, S>

  type ChargeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChargeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChargeCountAggregateInputType | true
    }

  export interface ChargeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Charge'], meta: { name: 'Charge' } }
    /**
     * Find zero or one Charge that matches the filter.
     * @param {ChargeFindUniqueArgs} args - Arguments to find a Charge
     * @example
     * // Get one Charge
     * const charge = await prisma.charge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChargeFindUniqueArgs>(args: SelectSubset<T, ChargeFindUniqueArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Charge that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChargeFindUniqueOrThrowArgs} args - Arguments to find a Charge
     * @example
     * // Get one Charge
     * const charge = await prisma.charge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChargeFindUniqueOrThrowArgs>(args: SelectSubset<T, ChargeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Charge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeFindFirstArgs} args - Arguments to find a Charge
     * @example
     * // Get one Charge
     * const charge = await prisma.charge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChargeFindFirstArgs>(args?: SelectSubset<T, ChargeFindFirstArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Charge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeFindFirstOrThrowArgs} args - Arguments to find a Charge
     * @example
     * // Get one Charge
     * const charge = await prisma.charge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChargeFindFirstOrThrowArgs>(args?: SelectSubset<T, ChargeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Charges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Charges
     * const charges = await prisma.charge.findMany()
     * 
     * // Get first 10 Charges
     * const charges = await prisma.charge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chargeWithIdOnly = await prisma.charge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChargeFindManyArgs>(args?: SelectSubset<T, ChargeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Charge.
     * @param {ChargeCreateArgs} args - Arguments to create a Charge.
     * @example
     * // Create one Charge
     * const Charge = await prisma.charge.create({
     *   data: {
     *     // ... data to create a Charge
     *   }
     * })
     * 
     */
    create<T extends ChargeCreateArgs>(args: SelectSubset<T, ChargeCreateArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Charges.
     * @param {ChargeCreateManyArgs} args - Arguments to create many Charges.
     * @example
     * // Create many Charges
     * const charge = await prisma.charge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChargeCreateManyArgs>(args?: SelectSubset<T, ChargeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Charges and returns the data saved in the database.
     * @param {ChargeCreateManyAndReturnArgs} args - Arguments to create many Charges.
     * @example
     * // Create many Charges
     * const charge = await prisma.charge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Charges and only return the `id`
     * const chargeWithIdOnly = await prisma.charge.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChargeCreateManyAndReturnArgs>(args?: SelectSubset<T, ChargeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Charge.
     * @param {ChargeDeleteArgs} args - Arguments to delete one Charge.
     * @example
     * // Delete one Charge
     * const Charge = await prisma.charge.delete({
     *   where: {
     *     // ... filter to delete one Charge
     *   }
     * })
     * 
     */
    delete<T extends ChargeDeleteArgs>(args: SelectSubset<T, ChargeDeleteArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Charge.
     * @param {ChargeUpdateArgs} args - Arguments to update one Charge.
     * @example
     * // Update one Charge
     * const charge = await prisma.charge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChargeUpdateArgs>(args: SelectSubset<T, ChargeUpdateArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Charges.
     * @param {ChargeDeleteManyArgs} args - Arguments to filter Charges to delete.
     * @example
     * // Delete a few Charges
     * const { count } = await prisma.charge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChargeDeleteManyArgs>(args?: SelectSubset<T, ChargeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Charges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Charges
     * const charge = await prisma.charge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChargeUpdateManyArgs>(args: SelectSubset<T, ChargeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Charge.
     * @param {ChargeUpsertArgs} args - Arguments to update or create a Charge.
     * @example
     * // Update or create a Charge
     * const charge = await prisma.charge.upsert({
     *   create: {
     *     // ... data to create a Charge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Charge we want to update
     *   }
     * })
     */
    upsert<T extends ChargeUpsertArgs>(args: SelectSubset<T, ChargeUpsertArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Charges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeCountArgs} args - Arguments to filter Charges to count.
     * @example
     * // Count the number of Charges
     * const count = await prisma.charge.count({
     *   where: {
     *     // ... the filter for the Charges we want to count
     *   }
     * })
    **/
    count<T extends ChargeCountArgs>(
      args?: Subset<T, ChargeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChargeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Charge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChargeAggregateArgs>(args: Subset<T, ChargeAggregateArgs>): Prisma.PrismaPromise<GetChargeAggregateType<T>>

    /**
     * Group by Charge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChargeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChargeGroupByArgs['orderBy'] }
        : { orderBy?: ChargeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChargeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChargeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Charge model
   */
  readonly fields: ChargeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Charge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChargeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    billingItem<T extends BillingItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BillingItemDefaultArgs<ExtArgs>>): Prisma__BillingItemClient<$Result.GetResult<Prisma.$BillingItemPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    invoiceLines<T extends Charge$invoiceLinesArgs<ExtArgs> = {}>(args?: Subset<T, Charge$invoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Charge model
   */ 
  interface ChargeFieldRefs {
    readonly id: FieldRef<"Charge", 'String'>
    readonly tenantId: FieldRef<"Charge", 'String'>
    readonly patientId: FieldRef<"Charge", 'String'>
    readonly encounterId: FieldRef<"Charge", 'String'>
    readonly billingItemId: FieldRef<"Charge", 'String'>
    readonly chargeDate: FieldRef<"Charge", 'DateTime'>
    readonly quantity: FieldRef<"Charge", 'Decimal'>
    readonly unitPrice: FieldRef<"Charge", 'Decimal'>
    readonly grossAmount: FieldRef<"Charge", 'Decimal'>
    readonly patientResponsibility: FieldRef<"Charge", 'Decimal'>
    readonly payerResponsibility: FieldRef<"Charge", 'Decimal'>
    readonly status: FieldRef<"Charge", 'String'>
    readonly sourceType: FieldRef<"Charge", 'String'>
    readonly sourceId: FieldRef<"Charge", 'String'>
    readonly notes: FieldRef<"Charge", 'String'>
    readonly createdAt: FieldRef<"Charge", 'DateTime'>
    readonly updatedAt: FieldRef<"Charge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Charge findUnique
   */
  export type ChargeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter, which Charge to fetch.
     */
    where: ChargeWhereUniqueInput
  }

  /**
   * Charge findUniqueOrThrow
   */
  export type ChargeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter, which Charge to fetch.
     */
    where: ChargeWhereUniqueInput
  }

  /**
   * Charge findFirst
   */
  export type ChargeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter, which Charge to fetch.
     */
    where?: ChargeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Charges to fetch.
     */
    orderBy?: ChargeOrderByWithRelationInput | ChargeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Charges.
     */
    cursor?: ChargeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Charges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Charges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Charges.
     */
    distinct?: ChargeScalarFieldEnum | ChargeScalarFieldEnum[]
  }

  /**
   * Charge findFirstOrThrow
   */
  export type ChargeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter, which Charge to fetch.
     */
    where?: ChargeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Charges to fetch.
     */
    orderBy?: ChargeOrderByWithRelationInput | ChargeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Charges.
     */
    cursor?: ChargeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Charges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Charges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Charges.
     */
    distinct?: ChargeScalarFieldEnum | ChargeScalarFieldEnum[]
  }

  /**
   * Charge findMany
   */
  export type ChargeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter, which Charges to fetch.
     */
    where?: ChargeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Charges to fetch.
     */
    orderBy?: ChargeOrderByWithRelationInput | ChargeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Charges.
     */
    cursor?: ChargeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Charges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Charges.
     */
    skip?: number
    distinct?: ChargeScalarFieldEnum | ChargeScalarFieldEnum[]
  }

  /**
   * Charge create
   */
  export type ChargeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * The data needed to create a Charge.
     */
    data: XOR<ChargeCreateInput, ChargeUncheckedCreateInput>
  }

  /**
   * Charge createMany
   */
  export type ChargeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Charges.
     */
    data: ChargeCreateManyInput | ChargeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Charge createManyAndReturn
   */
  export type ChargeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Charges.
     */
    data: ChargeCreateManyInput | ChargeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Charge update
   */
  export type ChargeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * The data needed to update a Charge.
     */
    data: XOR<ChargeUpdateInput, ChargeUncheckedUpdateInput>
    /**
     * Choose, which Charge to update.
     */
    where: ChargeWhereUniqueInput
  }

  /**
   * Charge updateMany
   */
  export type ChargeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Charges.
     */
    data: XOR<ChargeUpdateManyMutationInput, ChargeUncheckedUpdateManyInput>
    /**
     * Filter which Charges to update
     */
    where?: ChargeWhereInput
  }

  /**
   * Charge upsert
   */
  export type ChargeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * The filter to search for the Charge to update in case it exists.
     */
    where: ChargeWhereUniqueInput
    /**
     * In case the Charge found by the `where` argument doesn't exist, create a new Charge with this data.
     */
    create: XOR<ChargeCreateInput, ChargeUncheckedCreateInput>
    /**
     * In case the Charge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChargeUpdateInput, ChargeUncheckedUpdateInput>
  }

  /**
   * Charge delete
   */
  export type ChargeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
    /**
     * Filter which Charge to delete.
     */
    where: ChargeWhereUniqueInput
  }

  /**
   * Charge deleteMany
   */
  export type ChargeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Charges to delete
     */
    where?: ChargeWhereInput
  }

  /**
   * Charge.invoiceLines
   */
  export type Charge$invoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    cursor?: InvoiceLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * Charge without action
   */
  export type ChargeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Charge
     */
    select?: ChargeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargeInclude<ExtArgs> | null
  }


  /**
   * Model Invoice
   */

  export type AggregateInvoice = {
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  export type InvoiceAvgAggregateOutputType = {
    grossAmount: Decimal | null
    totalDiscounts: Decimal | null
    netAmount: Decimal | null
    amountPaid: Decimal | null
    balanceDue: Decimal | null
  }

  export type InvoiceSumAggregateOutputType = {
    grossAmount: Decimal | null
    totalDiscounts: Decimal | null
    netAmount: Decimal | null
    amountPaid: Decimal | null
    balanceDue: Decimal | null
  }

  export type InvoiceMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    mrn: string | null
    patientDisplayName: string | null
    invoiceNumber: string | null
    invoiceDate: Date | null
    dueDate: Date | null
    grossAmount: Decimal | null
    totalDiscounts: Decimal | null
    netAmount: Decimal | null
    amountPaid: Decimal | null
    balanceDue: Decimal | null
    status: string | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    mrn: string | null
    patientDisplayName: string | null
    invoiceNumber: string | null
    invoiceDate: Date | null
    dueDate: Date | null
    grossAmount: Decimal | null
    totalDiscounts: Decimal | null
    netAmount: Decimal | null
    amountPaid: Decimal | null
    balanceDue: Decimal | null
    status: string | null
    currency: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    encounterId: number
    mrn: number
    patientDisplayName: number
    invoiceNumber: number
    invoiceDate: number
    dueDate: number
    grossAmount: number
    totalDiscounts: number
    netAmount: number
    amountPaid: number
    balanceDue: number
    status: number
    currency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceAvgAggregateInputType = {
    grossAmount?: true
    totalDiscounts?: true
    netAmount?: true
    amountPaid?: true
    balanceDue?: true
  }

  export type InvoiceSumAggregateInputType = {
    grossAmount?: true
    totalDiscounts?: true
    netAmount?: true
    amountPaid?: true
    balanceDue?: true
  }

  export type InvoiceMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    mrn?: true
    patientDisplayName?: true
    invoiceNumber?: true
    invoiceDate?: true
    dueDate?: true
    grossAmount?: true
    totalDiscounts?: true
    netAmount?: true
    amountPaid?: true
    balanceDue?: true
    status?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    mrn?: true
    patientDisplayName?: true
    invoiceNumber?: true
    invoiceDate?: true
    dueDate?: true
    grossAmount?: true
    totalDiscounts?: true
    netAmount?: true
    amountPaid?: true
    balanceDue?: true
    status?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    mrn?: true
    patientDisplayName?: true
    invoiceNumber?: true
    invoiceDate?: true
    dueDate?: true
    grossAmount?: true
    totalDiscounts?: true
    netAmount?: true
    amountPaid?: true
    balanceDue?: true
    status?: true
    currency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoice to aggregate.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invoices
    **/
    _count?: true | InvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceMaxAggregateInputType
  }

  export type GetInvoiceAggregateType<T extends InvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoice[P]>
      : GetScalarType<T[P], AggregateInvoice[P]>
  }




  export type InvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceWhereInput
    orderBy?: InvoiceOrderByWithAggregationInput | InvoiceOrderByWithAggregationInput[]
    by: InvoiceScalarFieldEnum[] | InvoiceScalarFieldEnum
    having?: InvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceCountAggregateInputType | true
    _avg?: InvoiceAvgAggregateInputType
    _sum?: InvoiceSumAggregateInputType
    _min?: InvoiceMinAggregateInputType
    _max?: InvoiceMaxAggregateInputType
  }

  export type InvoiceGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    encounterId: string | null
    mrn: string | null
    patientDisplayName: string | null
    invoiceNumber: string
    invoiceDate: Date
    dueDate: Date | null
    grossAmount: Decimal
    totalDiscounts: Decimal
    netAmount: Decimal
    amountPaid: Decimal
    balanceDue: Decimal
    status: string
    currency: string
    createdAt: Date
    updatedAt: Date
    _count: InvoiceCountAggregateOutputType | null
    _avg: InvoiceAvgAggregateOutputType | null
    _sum: InvoiceSumAggregateOutputType | null
    _min: InvoiceMinAggregateOutputType | null
    _max: InvoiceMaxAggregateOutputType | null
  }

  type GetInvoiceGroupByPayload<T extends InvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    invoiceNumber?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    grossAmount?: boolean
    totalDiscounts?: boolean
    netAmount?: boolean
    amountPaid?: boolean
    balanceDue?: boolean
    status?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoiceLines?: boolean | Invoice$invoiceLinesArgs<ExtArgs>
    receiptAllocations?: boolean | Invoice$receiptAllocationsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    invoiceNumber?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    grossAmount?: boolean
    totalDiscounts?: boolean
    netAmount?: boolean
    amountPaid?: boolean
    balanceDue?: boolean
    status?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["invoice"]>

  export type InvoiceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    invoiceNumber?: boolean
    invoiceDate?: boolean
    dueDate?: boolean
    grossAmount?: boolean
    totalDiscounts?: boolean
    netAmount?: boolean
    amountPaid?: boolean
    balanceDue?: boolean
    status?: boolean
    currency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoiceLines?: boolean | Invoice$invoiceLinesArgs<ExtArgs>
    receiptAllocations?: boolean | Invoice$receiptAllocationsArgs<ExtArgs>
    _count?: boolean | InvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $InvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invoice"
    objects: {
      invoiceLines: Prisma.$InvoiceLinePayload<ExtArgs>[]
      receiptAllocations: Prisma.$ReceiptAllocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      encounterId: string | null
      mrn: string | null
      patientDisplayName: string | null
      invoiceNumber: string
      invoiceDate: Date
      dueDate: Date | null
      grossAmount: Prisma.Decimal
      totalDiscounts: Prisma.Decimal
      netAmount: Prisma.Decimal
      amountPaid: Prisma.Decimal
      balanceDue: Prisma.Decimal
      status: string
      currency: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoice"]>
    composites: {}
  }

  type InvoiceGetPayload<S extends boolean | null | undefined | InvoiceDefaultArgs> = $Result.GetResult<Prisma.$InvoicePayload, S>

  type InvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceCountAggregateInputType | true
    }

  export interface InvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invoice'], meta: { name: 'Invoice' } }
    /**
     * Find zero or one Invoice that matches the filter.
     * @param {InvoiceFindUniqueArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceFindUniqueArgs>(args: SelectSubset<T, InvoiceFindUniqueArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Invoice that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceFindUniqueOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Invoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceFindFirstArgs>(args?: SelectSubset<T, InvoiceFindFirstArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Invoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindFirstOrThrowArgs} args - Arguments to find a Invoice
     * @example
     * // Get one Invoice
     * const invoice = await prisma.invoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Invoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invoices
     * const invoices = await prisma.invoice.findMany()
     * 
     * // Get first 10 Invoices
     * const invoices = await prisma.invoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceWithIdOnly = await prisma.invoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceFindManyArgs>(args?: SelectSubset<T, InvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Invoice.
     * @param {InvoiceCreateArgs} args - Arguments to create a Invoice.
     * @example
     * // Create one Invoice
     * const Invoice = await prisma.invoice.create({
     *   data: {
     *     // ... data to create a Invoice
     *   }
     * })
     * 
     */
    create<T extends InvoiceCreateArgs>(args: SelectSubset<T, InvoiceCreateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Invoices.
     * @param {InvoiceCreateManyArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceCreateManyArgs>(args?: SelectSubset<T, InvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invoices and returns the data saved in the database.
     * @param {InvoiceCreateManyAndReturnArgs} args - Arguments to create many Invoices.
     * @example
     * // Create many Invoices
     * const invoice = await prisma.invoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invoices and only return the `id`
     * const invoiceWithIdOnly = await prisma.invoice.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Invoice.
     * @param {InvoiceDeleteArgs} args - Arguments to delete one Invoice.
     * @example
     * // Delete one Invoice
     * const Invoice = await prisma.invoice.delete({
     *   where: {
     *     // ... filter to delete one Invoice
     *   }
     * })
     * 
     */
    delete<T extends InvoiceDeleteArgs>(args: SelectSubset<T, InvoiceDeleteArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Invoice.
     * @param {InvoiceUpdateArgs} args - Arguments to update one Invoice.
     * @example
     * // Update one Invoice
     * const invoice = await prisma.invoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceUpdateArgs>(args: SelectSubset<T, InvoiceUpdateArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Invoices.
     * @param {InvoiceDeleteManyArgs} args - Arguments to filter Invoices to delete.
     * @example
     * // Delete a few Invoices
     * const { count } = await prisma.invoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceDeleteManyArgs>(args?: SelectSubset<T, InvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invoices
     * const invoice = await prisma.invoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceUpdateManyArgs>(args: SelectSubset<T, InvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Invoice.
     * @param {InvoiceUpsertArgs} args - Arguments to update or create a Invoice.
     * @example
     * // Update or create a Invoice
     * const invoice = await prisma.invoice.upsert({
     *   create: {
     *     // ... data to create a Invoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invoice we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceUpsertArgs>(args: SelectSubset<T, InvoiceUpsertArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Invoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceCountArgs} args - Arguments to filter Invoices to count.
     * @example
     * // Count the number of Invoices
     * const count = await prisma.invoice.count({
     *   where: {
     *     // ... the filter for the Invoices we want to count
     *   }
     * })
    **/
    count<T extends InvoiceCountArgs>(
      args?: Subset<T, InvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceAggregateArgs>(args: Subset<T, InvoiceAggregateArgs>): Prisma.PrismaPromise<GetInvoiceAggregateType<T>>

    /**
     * Group by Invoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invoice model
   */
  readonly fields: InvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoiceLines<T extends Invoice$invoiceLinesArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$invoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany"> | Null>
    receiptAllocations<T extends Invoice$receiptAllocationsArgs<ExtArgs> = {}>(args?: Subset<T, Invoice$receiptAllocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invoice model
   */ 
  interface InvoiceFieldRefs {
    readonly id: FieldRef<"Invoice", 'String'>
    readonly tenantId: FieldRef<"Invoice", 'String'>
    readonly patientId: FieldRef<"Invoice", 'String'>
    readonly encounterId: FieldRef<"Invoice", 'String'>
    readonly mrn: FieldRef<"Invoice", 'String'>
    readonly patientDisplayName: FieldRef<"Invoice", 'String'>
    readonly invoiceNumber: FieldRef<"Invoice", 'String'>
    readonly invoiceDate: FieldRef<"Invoice", 'DateTime'>
    readonly dueDate: FieldRef<"Invoice", 'DateTime'>
    readonly grossAmount: FieldRef<"Invoice", 'Decimal'>
    readonly totalDiscounts: FieldRef<"Invoice", 'Decimal'>
    readonly netAmount: FieldRef<"Invoice", 'Decimal'>
    readonly amountPaid: FieldRef<"Invoice", 'Decimal'>
    readonly balanceDue: FieldRef<"Invoice", 'Decimal'>
    readonly status: FieldRef<"Invoice", 'String'>
    readonly currency: FieldRef<"Invoice", 'String'>
    readonly createdAt: FieldRef<"Invoice", 'DateTime'>
    readonly updatedAt: FieldRef<"Invoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Invoice findUnique
   */
  export type InvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findUniqueOrThrow
   */
  export type InvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice findFirst
   */
  export type InvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findFirstOrThrow
   */
  export type InvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoice to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invoices.
     */
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice findMany
   */
  export type InvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter, which Invoices to fetch.
     */
    where?: InvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invoices to fetch.
     */
    orderBy?: InvoiceOrderByWithRelationInput | InvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invoices.
     */
    cursor?: InvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invoices.
     */
    skip?: number
    distinct?: InvoiceScalarFieldEnum | InvoiceScalarFieldEnum[]
  }

  /**
   * Invoice create
   */
  export type InvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Invoice.
     */
    data: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
  }

  /**
   * Invoice createMany
   */
  export type InvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice createManyAndReturn
   */
  export type InvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Invoices.
     */
    data: InvoiceCreateManyInput | InvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invoice update
   */
  export type InvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Invoice.
     */
    data: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
    /**
     * Choose, which Invoice to update.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice updateMany
   */
  export type InvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invoices.
     */
    data: XOR<InvoiceUpdateManyMutationInput, InvoiceUncheckedUpdateManyInput>
    /**
     * Filter which Invoices to update
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice upsert
   */
  export type InvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Invoice to update in case it exists.
     */
    where: InvoiceWhereUniqueInput
    /**
     * In case the Invoice found by the `where` argument doesn't exist, create a new Invoice with this data.
     */
    create: XOR<InvoiceCreateInput, InvoiceUncheckedCreateInput>
    /**
     * In case the Invoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceUpdateInput, InvoiceUncheckedUpdateInput>
  }

  /**
   * Invoice delete
   */
  export type InvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
    /**
     * Filter which Invoice to delete.
     */
    where: InvoiceWhereUniqueInput
  }

  /**
   * Invoice deleteMany
   */
  export type InvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invoices to delete
     */
    where?: InvoiceWhereInput
  }

  /**
   * Invoice.invoiceLines
   */
  export type Invoice$invoiceLinesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    cursor?: InvoiceLineWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * Invoice.receiptAllocations
   */
  export type Invoice$receiptAllocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    where?: ReceiptAllocationWhereInput
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    cursor?: ReceiptAllocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReceiptAllocationScalarFieldEnum | ReceiptAllocationScalarFieldEnum[]
  }

  /**
   * Invoice without action
   */
  export type InvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invoice
     */
    select?: InvoiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceInclude<ExtArgs> | null
  }


  /**
   * Model InvoiceLine
   */

  export type AggregateInvoiceLine = {
    _count: InvoiceLineCountAggregateOutputType | null
    _avg: InvoiceLineAvgAggregateOutputType | null
    _sum: InvoiceLineSumAggregateOutputType | null
    _min: InvoiceLineMinAggregateOutputType | null
    _max: InvoiceLineMaxAggregateOutputType | null
  }

  export type InvoiceLineAvgAggregateOutputType = {
    lineNumber: number | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    lineAmount: Decimal | null
    lineDiscount: Decimal | null
  }

  export type InvoiceLineSumAggregateOutputType = {
    lineNumber: number | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    lineAmount: Decimal | null
    lineDiscount: Decimal | null
  }

  export type InvoiceLineMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    chargeId: string | null
    lineNumber: number | null
    description: string | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    lineAmount: Decimal | null
    lineDiscount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceLineMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    chargeId: string | null
    lineNumber: number | null
    description: string | null
    quantity: Decimal | null
    unitPrice: Decimal | null
    lineAmount: Decimal | null
    lineDiscount: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InvoiceLineCountAggregateOutputType = {
    id: number
    invoiceId: number
    chargeId: number
    lineNumber: number
    description: number
    quantity: number
    unitPrice: number
    lineAmount: number
    lineDiscount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InvoiceLineAvgAggregateInputType = {
    lineNumber?: true
    quantity?: true
    unitPrice?: true
    lineAmount?: true
    lineDiscount?: true
  }

  export type InvoiceLineSumAggregateInputType = {
    lineNumber?: true
    quantity?: true
    unitPrice?: true
    lineAmount?: true
    lineDiscount?: true
  }

  export type InvoiceLineMinAggregateInputType = {
    id?: true
    invoiceId?: true
    chargeId?: true
    lineNumber?: true
    description?: true
    quantity?: true
    unitPrice?: true
    lineAmount?: true
    lineDiscount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceLineMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    chargeId?: true
    lineNumber?: true
    description?: true
    quantity?: true
    unitPrice?: true
    lineAmount?: true
    lineDiscount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InvoiceLineCountAggregateInputType = {
    id?: true
    invoiceId?: true
    chargeId?: true
    lineNumber?: true
    description?: true
    quantity?: true
    unitPrice?: true
    lineAmount?: true
    lineDiscount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InvoiceLineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLine to aggregate.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InvoiceLines
    **/
    _count?: true | InvoiceLineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InvoiceLineAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InvoiceLineSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvoiceLineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvoiceLineMaxAggregateInputType
  }

  export type GetInvoiceLineAggregateType<T extends InvoiceLineAggregateArgs> = {
        [P in keyof T & keyof AggregateInvoiceLine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvoiceLine[P]>
      : GetScalarType<T[P], AggregateInvoiceLine[P]>
  }




  export type InvoiceLineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvoiceLineWhereInput
    orderBy?: InvoiceLineOrderByWithAggregationInput | InvoiceLineOrderByWithAggregationInput[]
    by: InvoiceLineScalarFieldEnum[] | InvoiceLineScalarFieldEnum
    having?: InvoiceLineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvoiceLineCountAggregateInputType | true
    _avg?: InvoiceLineAvgAggregateInputType
    _sum?: InvoiceLineSumAggregateInputType
    _min?: InvoiceLineMinAggregateInputType
    _max?: InvoiceLineMaxAggregateInputType
  }

  export type InvoiceLineGroupByOutputType = {
    id: string
    invoiceId: string
    chargeId: string
    lineNumber: number
    description: string | null
    quantity: Decimal
    unitPrice: Decimal
    lineAmount: Decimal
    lineDiscount: Decimal
    createdAt: Date
    updatedAt: Date
    _count: InvoiceLineCountAggregateOutputType | null
    _avg: InvoiceLineAvgAggregateOutputType | null
    _sum: InvoiceLineSumAggregateOutputType | null
    _min: InvoiceLineMinAggregateOutputType | null
    _max: InvoiceLineMaxAggregateOutputType | null
  }

  type GetInvoiceLineGroupByPayload<T extends InvoiceLineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvoiceLineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvoiceLineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvoiceLineGroupByOutputType[P]>
            : GetScalarType<T[P], InvoiceLineGroupByOutputType[P]>
        }
      >
    >


  export type InvoiceLineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    chargeId?: boolean
    lineNumber?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    lineDiscount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    charge?: boolean | ChargeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLine"]>

  export type InvoiceLineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    chargeId?: boolean
    lineNumber?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    lineDiscount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    charge?: boolean | ChargeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["invoiceLine"]>

  export type InvoiceLineSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    chargeId?: boolean
    lineNumber?: boolean
    description?: boolean
    quantity?: boolean
    unitPrice?: boolean
    lineAmount?: boolean
    lineDiscount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InvoiceLineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    charge?: boolean | ChargeDefaultArgs<ExtArgs>
  }
  export type InvoiceLineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
    charge?: boolean | ChargeDefaultArgs<ExtArgs>
  }

  export type $InvoiceLinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InvoiceLine"
    objects: {
      invoice: Prisma.$InvoicePayload<ExtArgs>
      charge: Prisma.$ChargePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      chargeId: string
      lineNumber: number
      description: string | null
      quantity: Prisma.Decimal
      unitPrice: Prisma.Decimal
      lineAmount: Prisma.Decimal
      lineDiscount: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["invoiceLine"]>
    composites: {}
  }

  type InvoiceLineGetPayload<S extends boolean | null | undefined | InvoiceLineDefaultArgs> = $Result.GetResult<Prisma.$InvoiceLinePayload, S>

  type InvoiceLineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InvoiceLineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InvoiceLineCountAggregateInputType | true
    }

  export interface InvoiceLineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InvoiceLine'], meta: { name: 'InvoiceLine' } }
    /**
     * Find zero or one InvoiceLine that matches the filter.
     * @param {InvoiceLineFindUniqueArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvoiceLineFindUniqueArgs>(args: SelectSubset<T, InvoiceLineFindUniqueArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InvoiceLine that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InvoiceLineFindUniqueOrThrowArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvoiceLineFindUniqueOrThrowArgs>(args: SelectSubset<T, InvoiceLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InvoiceLine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindFirstArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvoiceLineFindFirstArgs>(args?: SelectSubset<T, InvoiceLineFindFirstArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InvoiceLine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindFirstOrThrowArgs} args - Arguments to find a InvoiceLine
     * @example
     * // Get one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvoiceLineFindFirstOrThrowArgs>(args?: SelectSubset<T, InvoiceLineFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InvoiceLines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InvoiceLines
     * const invoiceLines = await prisma.invoiceLine.findMany()
     * 
     * // Get first 10 InvoiceLines
     * const invoiceLines = await prisma.invoiceLine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invoiceLineWithIdOnly = await prisma.invoiceLine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvoiceLineFindManyArgs>(args?: SelectSubset<T, InvoiceLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InvoiceLine.
     * @param {InvoiceLineCreateArgs} args - Arguments to create a InvoiceLine.
     * @example
     * // Create one InvoiceLine
     * const InvoiceLine = await prisma.invoiceLine.create({
     *   data: {
     *     // ... data to create a InvoiceLine
     *   }
     * })
     * 
     */
    create<T extends InvoiceLineCreateArgs>(args: SelectSubset<T, InvoiceLineCreateArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InvoiceLines.
     * @param {InvoiceLineCreateManyArgs} args - Arguments to create many InvoiceLines.
     * @example
     * // Create many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvoiceLineCreateManyArgs>(args?: SelectSubset<T, InvoiceLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InvoiceLines and returns the data saved in the database.
     * @param {InvoiceLineCreateManyAndReturnArgs} args - Arguments to create many InvoiceLines.
     * @example
     * // Create many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InvoiceLines and only return the `id`
     * const invoiceLineWithIdOnly = await prisma.invoiceLine.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvoiceLineCreateManyAndReturnArgs>(args?: SelectSubset<T, InvoiceLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InvoiceLine.
     * @param {InvoiceLineDeleteArgs} args - Arguments to delete one InvoiceLine.
     * @example
     * // Delete one InvoiceLine
     * const InvoiceLine = await prisma.invoiceLine.delete({
     *   where: {
     *     // ... filter to delete one InvoiceLine
     *   }
     * })
     * 
     */
    delete<T extends InvoiceLineDeleteArgs>(args: SelectSubset<T, InvoiceLineDeleteArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InvoiceLine.
     * @param {InvoiceLineUpdateArgs} args - Arguments to update one InvoiceLine.
     * @example
     * // Update one InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvoiceLineUpdateArgs>(args: SelectSubset<T, InvoiceLineUpdateArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InvoiceLines.
     * @param {InvoiceLineDeleteManyArgs} args - Arguments to filter InvoiceLines to delete.
     * @example
     * // Delete a few InvoiceLines
     * const { count } = await prisma.invoiceLine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvoiceLineDeleteManyArgs>(args?: SelectSubset<T, InvoiceLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InvoiceLines
     * const invoiceLine = await prisma.invoiceLine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvoiceLineUpdateManyArgs>(args: SelectSubset<T, InvoiceLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InvoiceLine.
     * @param {InvoiceLineUpsertArgs} args - Arguments to update or create a InvoiceLine.
     * @example
     * // Update or create a InvoiceLine
     * const invoiceLine = await prisma.invoiceLine.upsert({
     *   create: {
     *     // ... data to create a InvoiceLine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InvoiceLine we want to update
     *   }
     * })
     */
    upsert<T extends InvoiceLineUpsertArgs>(args: SelectSubset<T, InvoiceLineUpsertArgs<ExtArgs>>): Prisma__InvoiceLineClient<$Result.GetResult<Prisma.$InvoiceLinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InvoiceLines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineCountArgs} args - Arguments to filter InvoiceLines to count.
     * @example
     * // Count the number of InvoiceLines
     * const count = await prisma.invoiceLine.count({
     *   where: {
     *     // ... the filter for the InvoiceLines we want to count
     *   }
     * })
    **/
    count<T extends InvoiceLineCountArgs>(
      args?: Subset<T, InvoiceLineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvoiceLineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvoiceLineAggregateArgs>(args: Subset<T, InvoiceLineAggregateArgs>): Prisma.PrismaPromise<GetInvoiceLineAggregateType<T>>

    /**
     * Group by InvoiceLine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvoiceLineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvoiceLineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvoiceLineGroupByArgs['orderBy'] }
        : { orderBy?: InvoiceLineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvoiceLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvoiceLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InvoiceLine model
   */
  readonly fields: InvoiceLineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InvoiceLine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvoiceLineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    charge<T extends ChargeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChargeDefaultArgs<ExtArgs>>): Prisma__ChargeClient<$Result.GetResult<Prisma.$ChargePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InvoiceLine model
   */ 
  interface InvoiceLineFieldRefs {
    readonly id: FieldRef<"InvoiceLine", 'String'>
    readonly invoiceId: FieldRef<"InvoiceLine", 'String'>
    readonly chargeId: FieldRef<"InvoiceLine", 'String'>
    readonly lineNumber: FieldRef<"InvoiceLine", 'Int'>
    readonly description: FieldRef<"InvoiceLine", 'String'>
    readonly quantity: FieldRef<"InvoiceLine", 'Decimal'>
    readonly unitPrice: FieldRef<"InvoiceLine", 'Decimal'>
    readonly lineAmount: FieldRef<"InvoiceLine", 'Decimal'>
    readonly lineDiscount: FieldRef<"InvoiceLine", 'Decimal'>
    readonly createdAt: FieldRef<"InvoiceLine", 'DateTime'>
    readonly updatedAt: FieldRef<"InvoiceLine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InvoiceLine findUnique
   */
  export type InvoiceLineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine findUniqueOrThrow
   */
  export type InvoiceLineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine findFirst
   */
  export type InvoiceLineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLines.
     */
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine findFirstOrThrow
   */
  export type InvoiceLineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLine to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InvoiceLines.
     */
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine findMany
   */
  export type InvoiceLineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter, which InvoiceLines to fetch.
     */
    where?: InvoiceLineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InvoiceLines to fetch.
     */
    orderBy?: InvoiceLineOrderByWithRelationInput | InvoiceLineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InvoiceLines.
     */
    cursor?: InvoiceLineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InvoiceLines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InvoiceLines.
     */
    skip?: number
    distinct?: InvoiceLineScalarFieldEnum | InvoiceLineScalarFieldEnum[]
  }

  /**
   * InvoiceLine create
   */
  export type InvoiceLineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to create a InvoiceLine.
     */
    data: XOR<InvoiceLineCreateInput, InvoiceLineUncheckedCreateInput>
  }

  /**
   * InvoiceLine createMany
   */
  export type InvoiceLineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InvoiceLines.
     */
    data: InvoiceLineCreateManyInput | InvoiceLineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InvoiceLine createManyAndReturn
   */
  export type InvoiceLineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InvoiceLines.
     */
    data: InvoiceLineCreateManyInput | InvoiceLineCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InvoiceLine update
   */
  export type InvoiceLineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The data needed to update a InvoiceLine.
     */
    data: XOR<InvoiceLineUpdateInput, InvoiceLineUncheckedUpdateInput>
    /**
     * Choose, which InvoiceLine to update.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine updateMany
   */
  export type InvoiceLineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InvoiceLines.
     */
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyInput>
    /**
     * Filter which InvoiceLines to update
     */
    where?: InvoiceLineWhereInput
  }

  /**
   * InvoiceLine upsert
   */
  export type InvoiceLineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * The filter to search for the InvoiceLine to update in case it exists.
     */
    where: InvoiceLineWhereUniqueInput
    /**
     * In case the InvoiceLine found by the `where` argument doesn't exist, create a new InvoiceLine with this data.
     */
    create: XOR<InvoiceLineCreateInput, InvoiceLineUncheckedCreateInput>
    /**
     * In case the InvoiceLine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvoiceLineUpdateInput, InvoiceLineUncheckedUpdateInput>
  }

  /**
   * InvoiceLine delete
   */
  export type InvoiceLineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
    /**
     * Filter which InvoiceLine to delete.
     */
    where: InvoiceLineWhereUniqueInput
  }

  /**
   * InvoiceLine deleteMany
   */
  export type InvoiceLineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InvoiceLines to delete
     */
    where?: InvoiceLineWhereInput
  }

  /**
   * InvoiceLine without action
   */
  export type InvoiceLineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InvoiceLine
     */
    select?: InvoiceLineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InvoiceLineInclude<ExtArgs> | null
  }


  /**
   * Model Receipt
   */

  export type AggregateReceipt = {
    _count: ReceiptCountAggregateOutputType | null
    _avg: ReceiptAvgAggregateOutputType | null
    _sum: ReceiptSumAggregateOutputType | null
    _min: ReceiptMinAggregateOutputType | null
    _max: ReceiptMaxAggregateOutputType | null
  }

  export type ReceiptAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type ReceiptSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type ReceiptMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    invoiceId: string | null
    mrn: string | null
    patientDisplayName: string | null
    receiptNumber: string | null
    receiptDate: Date | null
    amount: Decimal | null
    currency: string | null
    paymentMethod: string | null
    txnReference: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReceiptMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    invoiceId: string | null
    mrn: string | null
    patientDisplayName: string | null
    receiptNumber: string | null
    receiptDate: Date | null
    amount: Decimal | null
    currency: string | null
    paymentMethod: string | null
    txnReference: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReceiptCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    invoiceId: number
    mrn: number
    patientDisplayName: number
    receiptNumber: number
    receiptDate: number
    amount: number
    currency: number
    paymentMethod: number
    txnReference: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReceiptAvgAggregateInputType = {
    amount?: true
  }

  export type ReceiptSumAggregateInputType = {
    amount?: true
  }

  export type ReceiptMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    invoiceId?: true
    mrn?: true
    patientDisplayName?: true
    receiptNumber?: true
    receiptDate?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    txnReference?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReceiptMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    invoiceId?: true
    mrn?: true
    patientDisplayName?: true
    receiptNumber?: true
    receiptDate?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    txnReference?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReceiptCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    invoiceId?: true
    mrn?: true
    patientDisplayName?: true
    receiptNumber?: true
    receiptDate?: true
    amount?: true
    currency?: true
    paymentMethod?: true
    txnReference?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReceiptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Receipt to aggregate.
     */
    where?: ReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Receipts to fetch.
     */
    orderBy?: ReceiptOrderByWithRelationInput | ReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Receipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Receipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Receipts
    **/
    _count?: true | ReceiptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReceiptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReceiptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReceiptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReceiptMaxAggregateInputType
  }

  export type GetReceiptAggregateType<T extends ReceiptAggregateArgs> = {
        [P in keyof T & keyof AggregateReceipt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceipt[P]>
      : GetScalarType<T[P], AggregateReceipt[P]>
  }




  export type ReceiptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceiptWhereInput
    orderBy?: ReceiptOrderByWithAggregationInput | ReceiptOrderByWithAggregationInput[]
    by: ReceiptScalarFieldEnum[] | ReceiptScalarFieldEnum
    having?: ReceiptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReceiptCountAggregateInputType | true
    _avg?: ReceiptAvgAggregateInputType
    _sum?: ReceiptSumAggregateInputType
    _min?: ReceiptMinAggregateInputType
    _max?: ReceiptMaxAggregateInputType
  }

  export type ReceiptGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    invoiceId: string | null
    mrn: string | null
    patientDisplayName: string | null
    receiptNumber: string
    receiptDate: Date
    amount: Decimal
    currency: string
    paymentMethod: string
    txnReference: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ReceiptCountAggregateOutputType | null
    _avg: ReceiptAvgAggregateOutputType | null
    _sum: ReceiptSumAggregateOutputType | null
    _min: ReceiptMinAggregateOutputType | null
    _max: ReceiptMaxAggregateOutputType | null
  }

  type GetReceiptGroupByPayload<T extends ReceiptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReceiptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReceiptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReceiptGroupByOutputType[P]>
            : GetScalarType<T[P], ReceiptGroupByOutputType[P]>
        }
      >
    >


  export type ReceiptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    invoiceId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    receiptNumber?: boolean
    receiptDate?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    txnReference?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    allocations?: boolean | Receipt$allocationsArgs<ExtArgs>
    _count?: boolean | ReceiptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receipt"]>

  export type ReceiptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    invoiceId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    receiptNumber?: boolean
    receiptDate?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    txnReference?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["receipt"]>

  export type ReceiptSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    invoiceId?: boolean
    mrn?: boolean
    patientDisplayName?: boolean
    receiptNumber?: boolean
    receiptDate?: boolean
    amount?: boolean
    currency?: boolean
    paymentMethod?: boolean
    txnReference?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReceiptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    allocations?: boolean | Receipt$allocationsArgs<ExtArgs>
    _count?: boolean | ReceiptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ReceiptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ReceiptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Receipt"
    objects: {
      allocations: Prisma.$ReceiptAllocationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      invoiceId: string | null
      mrn: string | null
      patientDisplayName: string | null
      receiptNumber: string
      receiptDate: Date
      amount: Prisma.Decimal
      currency: string
      paymentMethod: string
      txnReference: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["receipt"]>
    composites: {}
  }

  type ReceiptGetPayload<S extends boolean | null | undefined | ReceiptDefaultArgs> = $Result.GetResult<Prisma.$ReceiptPayload, S>

  type ReceiptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReceiptFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReceiptCountAggregateInputType | true
    }

  export interface ReceiptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Receipt'], meta: { name: 'Receipt' } }
    /**
     * Find zero or one Receipt that matches the filter.
     * @param {ReceiptFindUniqueArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReceiptFindUniqueArgs>(args: SelectSubset<T, ReceiptFindUniqueArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Receipt that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReceiptFindUniqueOrThrowArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReceiptFindUniqueOrThrowArgs>(args: SelectSubset<T, ReceiptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Receipt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptFindFirstArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReceiptFindFirstArgs>(args?: SelectSubset<T, ReceiptFindFirstArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Receipt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptFindFirstOrThrowArgs} args - Arguments to find a Receipt
     * @example
     * // Get one Receipt
     * const receipt = await prisma.receipt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReceiptFindFirstOrThrowArgs>(args?: SelectSubset<T, ReceiptFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Receipts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Receipts
     * const receipts = await prisma.receipt.findMany()
     * 
     * // Get first 10 Receipts
     * const receipts = await prisma.receipt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const receiptWithIdOnly = await prisma.receipt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReceiptFindManyArgs>(args?: SelectSubset<T, ReceiptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Receipt.
     * @param {ReceiptCreateArgs} args - Arguments to create a Receipt.
     * @example
     * // Create one Receipt
     * const Receipt = await prisma.receipt.create({
     *   data: {
     *     // ... data to create a Receipt
     *   }
     * })
     * 
     */
    create<T extends ReceiptCreateArgs>(args: SelectSubset<T, ReceiptCreateArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Receipts.
     * @param {ReceiptCreateManyArgs} args - Arguments to create many Receipts.
     * @example
     * // Create many Receipts
     * const receipt = await prisma.receipt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReceiptCreateManyArgs>(args?: SelectSubset<T, ReceiptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Receipts and returns the data saved in the database.
     * @param {ReceiptCreateManyAndReturnArgs} args - Arguments to create many Receipts.
     * @example
     * // Create many Receipts
     * const receipt = await prisma.receipt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Receipts and only return the `id`
     * const receiptWithIdOnly = await prisma.receipt.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReceiptCreateManyAndReturnArgs>(args?: SelectSubset<T, ReceiptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Receipt.
     * @param {ReceiptDeleteArgs} args - Arguments to delete one Receipt.
     * @example
     * // Delete one Receipt
     * const Receipt = await prisma.receipt.delete({
     *   where: {
     *     // ... filter to delete one Receipt
     *   }
     * })
     * 
     */
    delete<T extends ReceiptDeleteArgs>(args: SelectSubset<T, ReceiptDeleteArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Receipt.
     * @param {ReceiptUpdateArgs} args - Arguments to update one Receipt.
     * @example
     * // Update one Receipt
     * const receipt = await prisma.receipt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReceiptUpdateArgs>(args: SelectSubset<T, ReceiptUpdateArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Receipts.
     * @param {ReceiptDeleteManyArgs} args - Arguments to filter Receipts to delete.
     * @example
     * // Delete a few Receipts
     * const { count } = await prisma.receipt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReceiptDeleteManyArgs>(args?: SelectSubset<T, ReceiptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Receipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Receipts
     * const receipt = await prisma.receipt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReceiptUpdateManyArgs>(args: SelectSubset<T, ReceiptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Receipt.
     * @param {ReceiptUpsertArgs} args - Arguments to update or create a Receipt.
     * @example
     * // Update or create a Receipt
     * const receipt = await prisma.receipt.upsert({
     *   create: {
     *     // ... data to create a Receipt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Receipt we want to update
     *   }
     * })
     */
    upsert<T extends ReceiptUpsertArgs>(args: SelectSubset<T, ReceiptUpsertArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Receipts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptCountArgs} args - Arguments to filter Receipts to count.
     * @example
     * // Count the number of Receipts
     * const count = await prisma.receipt.count({
     *   where: {
     *     // ... the filter for the Receipts we want to count
     *   }
     * })
    **/
    count<T extends ReceiptCountArgs>(
      args?: Subset<T, ReceiptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReceiptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Receipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReceiptAggregateArgs>(args: Subset<T, ReceiptAggregateArgs>): Prisma.PrismaPromise<GetReceiptAggregateType<T>>

    /**
     * Group by Receipt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReceiptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReceiptGroupByArgs['orderBy'] }
        : { orderBy?: ReceiptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReceiptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceiptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Receipt model
   */
  readonly fields: ReceiptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Receipt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReceiptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    allocations<T extends Receipt$allocationsArgs<ExtArgs> = {}>(args?: Subset<T, Receipt$allocationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Receipt model
   */ 
  interface ReceiptFieldRefs {
    readonly id: FieldRef<"Receipt", 'String'>
    readonly tenantId: FieldRef<"Receipt", 'String'>
    readonly patientId: FieldRef<"Receipt", 'String'>
    readonly invoiceId: FieldRef<"Receipt", 'String'>
    readonly mrn: FieldRef<"Receipt", 'String'>
    readonly patientDisplayName: FieldRef<"Receipt", 'String'>
    readonly receiptNumber: FieldRef<"Receipt", 'String'>
    readonly receiptDate: FieldRef<"Receipt", 'DateTime'>
    readonly amount: FieldRef<"Receipt", 'Decimal'>
    readonly currency: FieldRef<"Receipt", 'String'>
    readonly paymentMethod: FieldRef<"Receipt", 'String'>
    readonly txnReference: FieldRef<"Receipt", 'String'>
    readonly notes: FieldRef<"Receipt", 'String'>
    readonly createdAt: FieldRef<"Receipt", 'DateTime'>
    readonly updatedAt: FieldRef<"Receipt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Receipt findUnique
   */
  export type ReceiptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter, which Receipt to fetch.
     */
    where: ReceiptWhereUniqueInput
  }

  /**
   * Receipt findUniqueOrThrow
   */
  export type ReceiptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter, which Receipt to fetch.
     */
    where: ReceiptWhereUniqueInput
  }

  /**
   * Receipt findFirst
   */
  export type ReceiptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter, which Receipt to fetch.
     */
    where?: ReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Receipts to fetch.
     */
    orderBy?: ReceiptOrderByWithRelationInput | ReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Receipts.
     */
    cursor?: ReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Receipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Receipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Receipts.
     */
    distinct?: ReceiptScalarFieldEnum | ReceiptScalarFieldEnum[]
  }

  /**
   * Receipt findFirstOrThrow
   */
  export type ReceiptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter, which Receipt to fetch.
     */
    where?: ReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Receipts to fetch.
     */
    orderBy?: ReceiptOrderByWithRelationInput | ReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Receipts.
     */
    cursor?: ReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Receipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Receipts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Receipts.
     */
    distinct?: ReceiptScalarFieldEnum | ReceiptScalarFieldEnum[]
  }

  /**
   * Receipt findMany
   */
  export type ReceiptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter, which Receipts to fetch.
     */
    where?: ReceiptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Receipts to fetch.
     */
    orderBy?: ReceiptOrderByWithRelationInput | ReceiptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Receipts.
     */
    cursor?: ReceiptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Receipts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Receipts.
     */
    skip?: number
    distinct?: ReceiptScalarFieldEnum | ReceiptScalarFieldEnum[]
  }

  /**
   * Receipt create
   */
  export type ReceiptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * The data needed to create a Receipt.
     */
    data: XOR<ReceiptCreateInput, ReceiptUncheckedCreateInput>
  }

  /**
   * Receipt createMany
   */
  export type ReceiptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Receipts.
     */
    data: ReceiptCreateManyInput | ReceiptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Receipt createManyAndReturn
   */
  export type ReceiptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Receipts.
     */
    data: ReceiptCreateManyInput | ReceiptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Receipt update
   */
  export type ReceiptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * The data needed to update a Receipt.
     */
    data: XOR<ReceiptUpdateInput, ReceiptUncheckedUpdateInput>
    /**
     * Choose, which Receipt to update.
     */
    where: ReceiptWhereUniqueInput
  }

  /**
   * Receipt updateMany
   */
  export type ReceiptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Receipts.
     */
    data: XOR<ReceiptUpdateManyMutationInput, ReceiptUncheckedUpdateManyInput>
    /**
     * Filter which Receipts to update
     */
    where?: ReceiptWhereInput
  }

  /**
   * Receipt upsert
   */
  export type ReceiptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * The filter to search for the Receipt to update in case it exists.
     */
    where: ReceiptWhereUniqueInput
    /**
     * In case the Receipt found by the `where` argument doesn't exist, create a new Receipt with this data.
     */
    create: XOR<ReceiptCreateInput, ReceiptUncheckedCreateInput>
    /**
     * In case the Receipt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReceiptUpdateInput, ReceiptUncheckedUpdateInput>
  }

  /**
   * Receipt delete
   */
  export type ReceiptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
    /**
     * Filter which Receipt to delete.
     */
    where: ReceiptWhereUniqueInput
  }

  /**
   * Receipt deleteMany
   */
  export type ReceiptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Receipts to delete
     */
    where?: ReceiptWhereInput
  }

  /**
   * Receipt.allocations
   */
  export type Receipt$allocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    where?: ReceiptAllocationWhereInput
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    cursor?: ReceiptAllocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReceiptAllocationScalarFieldEnum | ReceiptAllocationScalarFieldEnum[]
  }

  /**
   * Receipt without action
   */
  export type ReceiptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Receipt
     */
    select?: ReceiptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptInclude<ExtArgs> | null
  }


  /**
   * Model ReceiptAllocation
   */

  export type AggregateReceiptAllocation = {
    _count: ReceiptAllocationCountAggregateOutputType | null
    _avg: ReceiptAllocationAvgAggregateOutputType | null
    _sum: ReceiptAllocationSumAggregateOutputType | null
    _min: ReceiptAllocationMinAggregateOutputType | null
    _max: ReceiptAllocationMaxAggregateOutputType | null
  }

  export type ReceiptAllocationAvgAggregateOutputType = {
    allocatedAmount: Decimal | null
  }

  export type ReceiptAllocationSumAggregateOutputType = {
    allocatedAmount: Decimal | null
  }

  export type ReceiptAllocationMinAggregateOutputType = {
    id: string | null
    receiptId: string | null
    invoiceId: string | null
    allocatedAmount: Decimal | null
    createdAt: Date | null
  }

  export type ReceiptAllocationMaxAggregateOutputType = {
    id: string | null
    receiptId: string | null
    invoiceId: string | null
    allocatedAmount: Decimal | null
    createdAt: Date | null
  }

  export type ReceiptAllocationCountAggregateOutputType = {
    id: number
    receiptId: number
    invoiceId: number
    allocatedAmount: number
    createdAt: number
    _all: number
  }


  export type ReceiptAllocationAvgAggregateInputType = {
    allocatedAmount?: true
  }

  export type ReceiptAllocationSumAggregateInputType = {
    allocatedAmount?: true
  }

  export type ReceiptAllocationMinAggregateInputType = {
    id?: true
    receiptId?: true
    invoiceId?: true
    allocatedAmount?: true
    createdAt?: true
  }

  export type ReceiptAllocationMaxAggregateInputType = {
    id?: true
    receiptId?: true
    invoiceId?: true
    allocatedAmount?: true
    createdAt?: true
  }

  export type ReceiptAllocationCountAggregateInputType = {
    id?: true
    receiptId?: true
    invoiceId?: true
    allocatedAmount?: true
    createdAt?: true
    _all?: true
  }

  export type ReceiptAllocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceiptAllocation to aggregate.
     */
    where?: ReceiptAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceiptAllocations to fetch.
     */
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReceiptAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceiptAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceiptAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReceiptAllocations
    **/
    _count?: true | ReceiptAllocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReceiptAllocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReceiptAllocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReceiptAllocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReceiptAllocationMaxAggregateInputType
  }

  export type GetReceiptAllocationAggregateType<T extends ReceiptAllocationAggregateArgs> = {
        [P in keyof T & keyof AggregateReceiptAllocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceiptAllocation[P]>
      : GetScalarType<T[P], AggregateReceiptAllocation[P]>
  }




  export type ReceiptAllocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReceiptAllocationWhereInput
    orderBy?: ReceiptAllocationOrderByWithAggregationInput | ReceiptAllocationOrderByWithAggregationInput[]
    by: ReceiptAllocationScalarFieldEnum[] | ReceiptAllocationScalarFieldEnum
    having?: ReceiptAllocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReceiptAllocationCountAggregateInputType | true
    _avg?: ReceiptAllocationAvgAggregateInputType
    _sum?: ReceiptAllocationSumAggregateInputType
    _min?: ReceiptAllocationMinAggregateInputType
    _max?: ReceiptAllocationMaxAggregateInputType
  }

  export type ReceiptAllocationGroupByOutputType = {
    id: string
    receiptId: string
    invoiceId: string
    allocatedAmount: Decimal
    createdAt: Date
    _count: ReceiptAllocationCountAggregateOutputType | null
    _avg: ReceiptAllocationAvgAggregateOutputType | null
    _sum: ReceiptAllocationSumAggregateOutputType | null
    _min: ReceiptAllocationMinAggregateOutputType | null
    _max: ReceiptAllocationMaxAggregateOutputType | null
  }

  type GetReceiptAllocationGroupByPayload<T extends ReceiptAllocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReceiptAllocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReceiptAllocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReceiptAllocationGroupByOutputType[P]>
            : GetScalarType<T[P], ReceiptAllocationGroupByOutputType[P]>
        }
      >
    >


  export type ReceiptAllocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    invoiceId?: boolean
    allocatedAmount?: boolean
    createdAt?: boolean
    receipt?: boolean | ReceiptDefaultArgs<ExtArgs>
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receiptAllocation"]>

  export type ReceiptAllocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    receiptId?: boolean
    invoiceId?: boolean
    allocatedAmount?: boolean
    createdAt?: boolean
    receipt?: boolean | ReceiptDefaultArgs<ExtArgs>
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["receiptAllocation"]>

  export type ReceiptAllocationSelectScalar = {
    id?: boolean
    receiptId?: boolean
    invoiceId?: boolean
    allocatedAmount?: boolean
    createdAt?: boolean
  }

  export type ReceiptAllocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | ReceiptDefaultArgs<ExtArgs>
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }
  export type ReceiptAllocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    receipt?: boolean | ReceiptDefaultArgs<ExtArgs>
    invoice?: boolean | InvoiceDefaultArgs<ExtArgs>
  }

  export type $ReceiptAllocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReceiptAllocation"
    objects: {
      receipt: Prisma.$ReceiptPayload<ExtArgs>
      invoice: Prisma.$InvoicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      receiptId: string
      invoiceId: string
      allocatedAmount: Prisma.Decimal
      createdAt: Date
    }, ExtArgs["result"]["receiptAllocation"]>
    composites: {}
  }

  type ReceiptAllocationGetPayload<S extends boolean | null | undefined | ReceiptAllocationDefaultArgs> = $Result.GetResult<Prisma.$ReceiptAllocationPayload, S>

  type ReceiptAllocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReceiptAllocationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReceiptAllocationCountAggregateInputType | true
    }

  export interface ReceiptAllocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReceiptAllocation'], meta: { name: 'ReceiptAllocation' } }
    /**
     * Find zero or one ReceiptAllocation that matches the filter.
     * @param {ReceiptAllocationFindUniqueArgs} args - Arguments to find a ReceiptAllocation
     * @example
     * // Get one ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReceiptAllocationFindUniqueArgs>(args: SelectSubset<T, ReceiptAllocationFindUniqueArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ReceiptAllocation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReceiptAllocationFindUniqueOrThrowArgs} args - Arguments to find a ReceiptAllocation
     * @example
     * // Get one ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReceiptAllocationFindUniqueOrThrowArgs>(args: SelectSubset<T, ReceiptAllocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ReceiptAllocation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationFindFirstArgs} args - Arguments to find a ReceiptAllocation
     * @example
     * // Get one ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReceiptAllocationFindFirstArgs>(args?: SelectSubset<T, ReceiptAllocationFindFirstArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ReceiptAllocation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationFindFirstOrThrowArgs} args - Arguments to find a ReceiptAllocation
     * @example
     * // Get one ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReceiptAllocationFindFirstOrThrowArgs>(args?: SelectSubset<T, ReceiptAllocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ReceiptAllocations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReceiptAllocations
     * const receiptAllocations = await prisma.receiptAllocation.findMany()
     * 
     * // Get first 10 ReceiptAllocations
     * const receiptAllocations = await prisma.receiptAllocation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const receiptAllocationWithIdOnly = await prisma.receiptAllocation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReceiptAllocationFindManyArgs>(args?: SelectSubset<T, ReceiptAllocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ReceiptAllocation.
     * @param {ReceiptAllocationCreateArgs} args - Arguments to create a ReceiptAllocation.
     * @example
     * // Create one ReceiptAllocation
     * const ReceiptAllocation = await prisma.receiptAllocation.create({
     *   data: {
     *     // ... data to create a ReceiptAllocation
     *   }
     * })
     * 
     */
    create<T extends ReceiptAllocationCreateArgs>(args: SelectSubset<T, ReceiptAllocationCreateArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ReceiptAllocations.
     * @param {ReceiptAllocationCreateManyArgs} args - Arguments to create many ReceiptAllocations.
     * @example
     * // Create many ReceiptAllocations
     * const receiptAllocation = await prisma.receiptAllocation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReceiptAllocationCreateManyArgs>(args?: SelectSubset<T, ReceiptAllocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReceiptAllocations and returns the data saved in the database.
     * @param {ReceiptAllocationCreateManyAndReturnArgs} args - Arguments to create many ReceiptAllocations.
     * @example
     * // Create many ReceiptAllocations
     * const receiptAllocation = await prisma.receiptAllocation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReceiptAllocations and only return the `id`
     * const receiptAllocationWithIdOnly = await prisma.receiptAllocation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReceiptAllocationCreateManyAndReturnArgs>(args?: SelectSubset<T, ReceiptAllocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ReceiptAllocation.
     * @param {ReceiptAllocationDeleteArgs} args - Arguments to delete one ReceiptAllocation.
     * @example
     * // Delete one ReceiptAllocation
     * const ReceiptAllocation = await prisma.receiptAllocation.delete({
     *   where: {
     *     // ... filter to delete one ReceiptAllocation
     *   }
     * })
     * 
     */
    delete<T extends ReceiptAllocationDeleteArgs>(args: SelectSubset<T, ReceiptAllocationDeleteArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ReceiptAllocation.
     * @param {ReceiptAllocationUpdateArgs} args - Arguments to update one ReceiptAllocation.
     * @example
     * // Update one ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReceiptAllocationUpdateArgs>(args: SelectSubset<T, ReceiptAllocationUpdateArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ReceiptAllocations.
     * @param {ReceiptAllocationDeleteManyArgs} args - Arguments to filter ReceiptAllocations to delete.
     * @example
     * // Delete a few ReceiptAllocations
     * const { count } = await prisma.receiptAllocation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReceiptAllocationDeleteManyArgs>(args?: SelectSubset<T, ReceiptAllocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReceiptAllocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReceiptAllocations
     * const receiptAllocation = await prisma.receiptAllocation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReceiptAllocationUpdateManyArgs>(args: SelectSubset<T, ReceiptAllocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ReceiptAllocation.
     * @param {ReceiptAllocationUpsertArgs} args - Arguments to update or create a ReceiptAllocation.
     * @example
     * // Update or create a ReceiptAllocation
     * const receiptAllocation = await prisma.receiptAllocation.upsert({
     *   create: {
     *     // ... data to create a ReceiptAllocation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReceiptAllocation we want to update
     *   }
     * })
     */
    upsert<T extends ReceiptAllocationUpsertArgs>(args: SelectSubset<T, ReceiptAllocationUpsertArgs<ExtArgs>>): Prisma__ReceiptAllocationClient<$Result.GetResult<Prisma.$ReceiptAllocationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ReceiptAllocations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationCountArgs} args - Arguments to filter ReceiptAllocations to count.
     * @example
     * // Count the number of ReceiptAllocations
     * const count = await prisma.receiptAllocation.count({
     *   where: {
     *     // ... the filter for the ReceiptAllocations we want to count
     *   }
     * })
    **/
    count<T extends ReceiptAllocationCountArgs>(
      args?: Subset<T, ReceiptAllocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReceiptAllocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReceiptAllocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReceiptAllocationAggregateArgs>(args: Subset<T, ReceiptAllocationAggregateArgs>): Prisma.PrismaPromise<GetReceiptAllocationAggregateType<T>>

    /**
     * Group by ReceiptAllocation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReceiptAllocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReceiptAllocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReceiptAllocationGroupByArgs['orderBy'] }
        : { orderBy?: ReceiptAllocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReceiptAllocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReceiptAllocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReceiptAllocation model
   */
  readonly fields: ReceiptAllocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReceiptAllocation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReceiptAllocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    receipt<T extends ReceiptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ReceiptDefaultArgs<ExtArgs>>): Prisma__ReceiptClient<$Result.GetResult<Prisma.$ReceiptPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    invoice<T extends InvoiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InvoiceDefaultArgs<ExtArgs>>): Prisma__InvoiceClient<$Result.GetResult<Prisma.$InvoicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReceiptAllocation model
   */ 
  interface ReceiptAllocationFieldRefs {
    readonly id: FieldRef<"ReceiptAllocation", 'String'>
    readonly receiptId: FieldRef<"ReceiptAllocation", 'String'>
    readonly invoiceId: FieldRef<"ReceiptAllocation", 'String'>
    readonly allocatedAmount: FieldRef<"ReceiptAllocation", 'Decimal'>
    readonly createdAt: FieldRef<"ReceiptAllocation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReceiptAllocation findUnique
   */
  export type ReceiptAllocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter, which ReceiptAllocation to fetch.
     */
    where: ReceiptAllocationWhereUniqueInput
  }

  /**
   * ReceiptAllocation findUniqueOrThrow
   */
  export type ReceiptAllocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter, which ReceiptAllocation to fetch.
     */
    where: ReceiptAllocationWhereUniqueInput
  }

  /**
   * ReceiptAllocation findFirst
   */
  export type ReceiptAllocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter, which ReceiptAllocation to fetch.
     */
    where?: ReceiptAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceiptAllocations to fetch.
     */
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceiptAllocations.
     */
    cursor?: ReceiptAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceiptAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceiptAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceiptAllocations.
     */
    distinct?: ReceiptAllocationScalarFieldEnum | ReceiptAllocationScalarFieldEnum[]
  }

  /**
   * ReceiptAllocation findFirstOrThrow
   */
  export type ReceiptAllocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter, which ReceiptAllocation to fetch.
     */
    where?: ReceiptAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceiptAllocations to fetch.
     */
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReceiptAllocations.
     */
    cursor?: ReceiptAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceiptAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceiptAllocations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReceiptAllocations.
     */
    distinct?: ReceiptAllocationScalarFieldEnum | ReceiptAllocationScalarFieldEnum[]
  }

  /**
   * ReceiptAllocation findMany
   */
  export type ReceiptAllocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter, which ReceiptAllocations to fetch.
     */
    where?: ReceiptAllocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReceiptAllocations to fetch.
     */
    orderBy?: ReceiptAllocationOrderByWithRelationInput | ReceiptAllocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReceiptAllocations.
     */
    cursor?: ReceiptAllocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReceiptAllocations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReceiptAllocations.
     */
    skip?: number
    distinct?: ReceiptAllocationScalarFieldEnum | ReceiptAllocationScalarFieldEnum[]
  }

  /**
   * ReceiptAllocation create
   */
  export type ReceiptAllocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * The data needed to create a ReceiptAllocation.
     */
    data: XOR<ReceiptAllocationCreateInput, ReceiptAllocationUncheckedCreateInput>
  }

  /**
   * ReceiptAllocation createMany
   */
  export type ReceiptAllocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReceiptAllocations.
     */
    data: ReceiptAllocationCreateManyInput | ReceiptAllocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReceiptAllocation createManyAndReturn
   */
  export type ReceiptAllocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ReceiptAllocations.
     */
    data: ReceiptAllocationCreateManyInput | ReceiptAllocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReceiptAllocation update
   */
  export type ReceiptAllocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * The data needed to update a ReceiptAllocation.
     */
    data: XOR<ReceiptAllocationUpdateInput, ReceiptAllocationUncheckedUpdateInput>
    /**
     * Choose, which ReceiptAllocation to update.
     */
    where: ReceiptAllocationWhereUniqueInput
  }

  /**
   * ReceiptAllocation updateMany
   */
  export type ReceiptAllocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReceiptAllocations.
     */
    data: XOR<ReceiptAllocationUpdateManyMutationInput, ReceiptAllocationUncheckedUpdateManyInput>
    /**
     * Filter which ReceiptAllocations to update
     */
    where?: ReceiptAllocationWhereInput
  }

  /**
   * ReceiptAllocation upsert
   */
  export type ReceiptAllocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * The filter to search for the ReceiptAllocation to update in case it exists.
     */
    where: ReceiptAllocationWhereUniqueInput
    /**
     * In case the ReceiptAllocation found by the `where` argument doesn't exist, create a new ReceiptAllocation with this data.
     */
    create: XOR<ReceiptAllocationCreateInput, ReceiptAllocationUncheckedCreateInput>
    /**
     * In case the ReceiptAllocation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReceiptAllocationUpdateInput, ReceiptAllocationUncheckedUpdateInput>
  }

  /**
   * ReceiptAllocation delete
   */
  export type ReceiptAllocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
    /**
     * Filter which ReceiptAllocation to delete.
     */
    where: ReceiptAllocationWhereUniqueInput
  }

  /**
   * ReceiptAllocation deleteMany
   */
  export type ReceiptAllocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReceiptAllocations to delete
     */
    where?: ReceiptAllocationWhereInput
  }

  /**
   * ReceiptAllocation without action
   */
  export type ReceiptAllocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReceiptAllocation
     */
    select?: ReceiptAllocationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReceiptAllocationInclude<ExtArgs> | null
  }


  /**
   * Model ChargePostingRule
   */

  export type AggregateChargePostingRule = {
    _count: ChargePostingRuleCountAggregateOutputType | null
    _avg: ChargePostingRuleAvgAggregateOutputType | null
    _sum: ChargePostingRuleSumAggregateOutputType | null
    _min: ChargePostingRuleMinAggregateOutputType | null
    _max: ChargePostingRuleMaxAggregateOutputType | null
  }

  export type ChargePostingRuleAvgAggregateOutputType = {
    basePrice: Decimal | null
    discountPercentage: Decimal | null
    taxPercentage: Decimal | null
    priority: number | null
  }

  export type ChargePostingRuleSumAggregateOutputType = {
    basePrice: Decimal | null
    discountPercentage: Decimal | null
    taxPercentage: Decimal | null
    priority: number | null
  }

  export type ChargePostingRuleMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ruleName: string | null
    eventType: string | null
    eventSource: string | null
    billingItemType: string | null
    billingItemId: string | null
    chargeCalculationMethod: string | null
    basePrice: Decimal | null
    priceSource: string | null
    quantitySource: string | null
    discountPercentage: Decimal | null
    taxPercentage: Decimal | null
    isActive: boolean | null
    priority: number | null
    autoApprove: boolean | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: string | null
    updatedBy: string | null
  }

  export type ChargePostingRuleMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ruleName: string | null
    eventType: string | null
    eventSource: string | null
    billingItemType: string | null
    billingItemId: string | null
    chargeCalculationMethod: string | null
    basePrice: Decimal | null
    priceSource: string | null
    quantitySource: string | null
    discountPercentage: Decimal | null
    taxPercentage: Decimal | null
    isActive: boolean | null
    priority: number | null
    autoApprove: boolean | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: string | null
    updatedBy: string | null
  }

  export type ChargePostingRuleCountAggregateOutputType = {
    id: number
    tenantId: number
    ruleName: number
    eventType: number
    eventSource: number
    billingItemType: number
    billingItemId: number
    conditions: number
    chargeCalculationMethod: number
    basePrice: number
    priceSource: number
    quantitySource: number
    discountPercentage: number
    taxPercentage: number
    isActive: number
    priority: number
    autoApprove: number
    description: number
    configuration: number
    createdAt: number
    updatedAt: number
    createdBy: number
    updatedBy: number
    _all: number
  }


  export type ChargePostingRuleAvgAggregateInputType = {
    basePrice?: true
    discountPercentage?: true
    taxPercentage?: true
    priority?: true
  }

  export type ChargePostingRuleSumAggregateInputType = {
    basePrice?: true
    discountPercentage?: true
    taxPercentage?: true
    priority?: true
  }

  export type ChargePostingRuleMinAggregateInputType = {
    id?: true
    tenantId?: true
    ruleName?: true
    eventType?: true
    eventSource?: true
    billingItemType?: true
    billingItemId?: true
    chargeCalculationMethod?: true
    basePrice?: true
    priceSource?: true
    quantitySource?: true
    discountPercentage?: true
    taxPercentage?: true
    isActive?: true
    priority?: true
    autoApprove?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
  }

  export type ChargePostingRuleMaxAggregateInputType = {
    id?: true
    tenantId?: true
    ruleName?: true
    eventType?: true
    eventSource?: true
    billingItemType?: true
    billingItemId?: true
    chargeCalculationMethod?: true
    basePrice?: true
    priceSource?: true
    quantitySource?: true
    discountPercentage?: true
    taxPercentage?: true
    isActive?: true
    priority?: true
    autoApprove?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
  }

  export type ChargePostingRuleCountAggregateInputType = {
    id?: true
    tenantId?: true
    ruleName?: true
    eventType?: true
    eventSource?: true
    billingItemType?: true
    billingItemId?: true
    conditions?: true
    chargeCalculationMethod?: true
    basePrice?: true
    priceSource?: true
    quantitySource?: true
    discountPercentage?: true
    taxPercentage?: true
    isActive?: true
    priority?: true
    autoApprove?: true
    description?: true
    configuration?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
    _all?: true
  }

  export type ChargePostingRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingRule to aggregate.
     */
    where?: ChargePostingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingRules to fetch.
     */
    orderBy?: ChargePostingRuleOrderByWithRelationInput | ChargePostingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChargePostingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChargePostingRules
    **/
    _count?: true | ChargePostingRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChargePostingRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChargePostingRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChargePostingRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChargePostingRuleMaxAggregateInputType
  }

  export type GetChargePostingRuleAggregateType<T extends ChargePostingRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateChargePostingRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChargePostingRule[P]>
      : GetScalarType<T[P], AggregateChargePostingRule[P]>
  }




  export type ChargePostingRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargePostingRuleWhereInput
    orderBy?: ChargePostingRuleOrderByWithAggregationInput | ChargePostingRuleOrderByWithAggregationInput[]
    by: ChargePostingRuleScalarFieldEnum[] | ChargePostingRuleScalarFieldEnum
    having?: ChargePostingRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChargePostingRuleCountAggregateInputType | true
    _avg?: ChargePostingRuleAvgAggregateInputType
    _sum?: ChargePostingRuleSumAggregateInputType
    _min?: ChargePostingRuleMinAggregateInputType
    _max?: ChargePostingRuleMaxAggregateInputType
  }

  export type ChargePostingRuleGroupByOutputType = {
    id: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId: string | null
    conditions: JsonValue | null
    chargeCalculationMethod: string
    basePrice: Decimal | null
    priceSource: string
    quantitySource: string
    discountPercentage: Decimal | null
    taxPercentage: Decimal | null
    isActive: boolean
    priority: number
    autoApprove: boolean
    description: string | null
    configuration: JsonValue | null
    createdAt: Date
    updatedAt: Date
    createdBy: string | null
    updatedBy: string | null
    _count: ChargePostingRuleCountAggregateOutputType | null
    _avg: ChargePostingRuleAvgAggregateOutputType | null
    _sum: ChargePostingRuleSumAggregateOutputType | null
    _min: ChargePostingRuleMinAggregateOutputType | null
    _max: ChargePostingRuleMaxAggregateOutputType | null
  }

  type GetChargePostingRuleGroupByPayload<T extends ChargePostingRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChargePostingRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChargePostingRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChargePostingRuleGroupByOutputType[P]>
            : GetScalarType<T[P], ChargePostingRuleGroupByOutputType[P]>
        }
      >
    >


  export type ChargePostingRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ruleName?: boolean
    eventType?: boolean
    eventSource?: boolean
    billingItemType?: boolean
    billingItemId?: boolean
    conditions?: boolean
    chargeCalculationMethod?: boolean
    basePrice?: boolean
    priceSource?: boolean
    quantitySource?: boolean
    discountPercentage?: boolean
    taxPercentage?: boolean
    isActive?: boolean
    priority?: boolean
    autoApprove?: boolean
    description?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    auditRecords?: boolean | ChargePostingRule$auditRecordsArgs<ExtArgs>
    _count?: boolean | ChargePostingRuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chargePostingRule"]>

  export type ChargePostingRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ruleName?: boolean
    eventType?: boolean
    eventSource?: boolean
    billingItemType?: boolean
    billingItemId?: boolean
    conditions?: boolean
    chargeCalculationMethod?: boolean
    basePrice?: boolean
    priceSource?: boolean
    quantitySource?: boolean
    discountPercentage?: boolean
    taxPercentage?: boolean
    isActive?: boolean
    priority?: boolean
    autoApprove?: boolean
    description?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["chargePostingRule"]>

  export type ChargePostingRuleSelectScalar = {
    id?: boolean
    tenantId?: boolean
    ruleName?: boolean
    eventType?: boolean
    eventSource?: boolean
    billingItemType?: boolean
    billingItemId?: boolean
    conditions?: boolean
    chargeCalculationMethod?: boolean
    basePrice?: boolean
    priceSource?: boolean
    quantitySource?: boolean
    discountPercentage?: boolean
    taxPercentage?: boolean
    isActive?: boolean
    priority?: boolean
    autoApprove?: boolean
    description?: boolean
    configuration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
  }

  export type ChargePostingRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRecords?: boolean | ChargePostingRule$auditRecordsArgs<ExtArgs>
    _count?: boolean | ChargePostingRuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChargePostingRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChargePostingRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChargePostingRule"
    objects: {
      auditRecords: Prisma.$ChargePostingAuditPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      ruleName: string
      eventType: string
      eventSource: string
      billingItemType: string
      billingItemId: string | null
      conditions: Prisma.JsonValue | null
      chargeCalculationMethod: string
      basePrice: Prisma.Decimal | null
      priceSource: string
      quantitySource: string
      discountPercentage: Prisma.Decimal | null
      taxPercentage: Prisma.Decimal | null
      isActive: boolean
      priority: number
      autoApprove: boolean
      description: string | null
      configuration: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      createdBy: string | null
      updatedBy: string | null
    }, ExtArgs["result"]["chargePostingRule"]>
    composites: {}
  }

  type ChargePostingRuleGetPayload<S extends boolean | null | undefined | ChargePostingRuleDefaultArgs> = $Result.GetResult<Prisma.$ChargePostingRulePayload, S>

  type ChargePostingRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChargePostingRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChargePostingRuleCountAggregateInputType | true
    }

  export interface ChargePostingRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChargePostingRule'], meta: { name: 'ChargePostingRule' } }
    /**
     * Find zero or one ChargePostingRule that matches the filter.
     * @param {ChargePostingRuleFindUniqueArgs} args - Arguments to find a ChargePostingRule
     * @example
     * // Get one ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChargePostingRuleFindUniqueArgs>(args: SelectSubset<T, ChargePostingRuleFindUniqueArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChargePostingRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChargePostingRuleFindUniqueOrThrowArgs} args - Arguments to find a ChargePostingRule
     * @example
     * // Get one ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChargePostingRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, ChargePostingRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChargePostingRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleFindFirstArgs} args - Arguments to find a ChargePostingRule
     * @example
     * // Get one ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChargePostingRuleFindFirstArgs>(args?: SelectSubset<T, ChargePostingRuleFindFirstArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChargePostingRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleFindFirstOrThrowArgs} args - Arguments to find a ChargePostingRule
     * @example
     * // Get one ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChargePostingRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, ChargePostingRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChargePostingRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChargePostingRules
     * const chargePostingRules = await prisma.chargePostingRule.findMany()
     * 
     * // Get first 10 ChargePostingRules
     * const chargePostingRules = await prisma.chargePostingRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chargePostingRuleWithIdOnly = await prisma.chargePostingRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChargePostingRuleFindManyArgs>(args?: SelectSubset<T, ChargePostingRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChargePostingRule.
     * @param {ChargePostingRuleCreateArgs} args - Arguments to create a ChargePostingRule.
     * @example
     * // Create one ChargePostingRule
     * const ChargePostingRule = await prisma.chargePostingRule.create({
     *   data: {
     *     // ... data to create a ChargePostingRule
     *   }
     * })
     * 
     */
    create<T extends ChargePostingRuleCreateArgs>(args: SelectSubset<T, ChargePostingRuleCreateArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChargePostingRules.
     * @param {ChargePostingRuleCreateManyArgs} args - Arguments to create many ChargePostingRules.
     * @example
     * // Create many ChargePostingRules
     * const chargePostingRule = await prisma.chargePostingRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChargePostingRuleCreateManyArgs>(args?: SelectSubset<T, ChargePostingRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChargePostingRules and returns the data saved in the database.
     * @param {ChargePostingRuleCreateManyAndReturnArgs} args - Arguments to create many ChargePostingRules.
     * @example
     * // Create many ChargePostingRules
     * const chargePostingRule = await prisma.chargePostingRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChargePostingRules and only return the `id`
     * const chargePostingRuleWithIdOnly = await prisma.chargePostingRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChargePostingRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, ChargePostingRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChargePostingRule.
     * @param {ChargePostingRuleDeleteArgs} args - Arguments to delete one ChargePostingRule.
     * @example
     * // Delete one ChargePostingRule
     * const ChargePostingRule = await prisma.chargePostingRule.delete({
     *   where: {
     *     // ... filter to delete one ChargePostingRule
     *   }
     * })
     * 
     */
    delete<T extends ChargePostingRuleDeleteArgs>(args: SelectSubset<T, ChargePostingRuleDeleteArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChargePostingRule.
     * @param {ChargePostingRuleUpdateArgs} args - Arguments to update one ChargePostingRule.
     * @example
     * // Update one ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChargePostingRuleUpdateArgs>(args: SelectSubset<T, ChargePostingRuleUpdateArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChargePostingRules.
     * @param {ChargePostingRuleDeleteManyArgs} args - Arguments to filter ChargePostingRules to delete.
     * @example
     * // Delete a few ChargePostingRules
     * const { count } = await prisma.chargePostingRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChargePostingRuleDeleteManyArgs>(args?: SelectSubset<T, ChargePostingRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChargePostingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChargePostingRules
     * const chargePostingRule = await prisma.chargePostingRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChargePostingRuleUpdateManyArgs>(args: SelectSubset<T, ChargePostingRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChargePostingRule.
     * @param {ChargePostingRuleUpsertArgs} args - Arguments to update or create a ChargePostingRule.
     * @example
     * // Update or create a ChargePostingRule
     * const chargePostingRule = await prisma.chargePostingRule.upsert({
     *   create: {
     *     // ... data to create a ChargePostingRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChargePostingRule we want to update
     *   }
     * })
     */
    upsert<T extends ChargePostingRuleUpsertArgs>(args: SelectSubset<T, ChargePostingRuleUpsertArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChargePostingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleCountArgs} args - Arguments to filter ChargePostingRules to count.
     * @example
     * // Count the number of ChargePostingRules
     * const count = await prisma.chargePostingRule.count({
     *   where: {
     *     // ... the filter for the ChargePostingRules we want to count
     *   }
     * })
    **/
    count<T extends ChargePostingRuleCountArgs>(
      args?: Subset<T, ChargePostingRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChargePostingRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChargePostingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChargePostingRuleAggregateArgs>(args: Subset<T, ChargePostingRuleAggregateArgs>): Prisma.PrismaPromise<GetChargePostingRuleAggregateType<T>>

    /**
     * Group by ChargePostingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChargePostingRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChargePostingRuleGroupByArgs['orderBy'] }
        : { orderBy?: ChargePostingRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChargePostingRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChargePostingRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChargePostingRule model
   */
  readonly fields: ChargePostingRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChargePostingRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChargePostingRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditRecords<T extends ChargePostingRule$auditRecordsArgs<ExtArgs> = {}>(args?: Subset<T, ChargePostingRule$auditRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChargePostingRule model
   */ 
  interface ChargePostingRuleFieldRefs {
    readonly id: FieldRef<"ChargePostingRule", 'String'>
    readonly tenantId: FieldRef<"ChargePostingRule", 'String'>
    readonly ruleName: FieldRef<"ChargePostingRule", 'String'>
    readonly eventType: FieldRef<"ChargePostingRule", 'String'>
    readonly eventSource: FieldRef<"ChargePostingRule", 'String'>
    readonly billingItemType: FieldRef<"ChargePostingRule", 'String'>
    readonly billingItemId: FieldRef<"ChargePostingRule", 'String'>
    readonly conditions: FieldRef<"ChargePostingRule", 'Json'>
    readonly chargeCalculationMethod: FieldRef<"ChargePostingRule", 'String'>
    readonly basePrice: FieldRef<"ChargePostingRule", 'Decimal'>
    readonly priceSource: FieldRef<"ChargePostingRule", 'String'>
    readonly quantitySource: FieldRef<"ChargePostingRule", 'String'>
    readonly discountPercentage: FieldRef<"ChargePostingRule", 'Decimal'>
    readonly taxPercentage: FieldRef<"ChargePostingRule", 'Decimal'>
    readonly isActive: FieldRef<"ChargePostingRule", 'Boolean'>
    readonly priority: FieldRef<"ChargePostingRule", 'Int'>
    readonly autoApprove: FieldRef<"ChargePostingRule", 'Boolean'>
    readonly description: FieldRef<"ChargePostingRule", 'String'>
    readonly configuration: FieldRef<"ChargePostingRule", 'Json'>
    readonly createdAt: FieldRef<"ChargePostingRule", 'DateTime'>
    readonly updatedAt: FieldRef<"ChargePostingRule", 'DateTime'>
    readonly createdBy: FieldRef<"ChargePostingRule", 'String'>
    readonly updatedBy: FieldRef<"ChargePostingRule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChargePostingRule findUnique
   */
  export type ChargePostingRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingRule to fetch.
     */
    where: ChargePostingRuleWhereUniqueInput
  }

  /**
   * ChargePostingRule findUniqueOrThrow
   */
  export type ChargePostingRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingRule to fetch.
     */
    where: ChargePostingRuleWhereUniqueInput
  }

  /**
   * ChargePostingRule findFirst
   */
  export type ChargePostingRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingRule to fetch.
     */
    where?: ChargePostingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingRules to fetch.
     */
    orderBy?: ChargePostingRuleOrderByWithRelationInput | ChargePostingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingRules.
     */
    cursor?: ChargePostingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingRules.
     */
    distinct?: ChargePostingRuleScalarFieldEnum | ChargePostingRuleScalarFieldEnum[]
  }

  /**
   * ChargePostingRule findFirstOrThrow
   */
  export type ChargePostingRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingRule to fetch.
     */
    where?: ChargePostingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingRules to fetch.
     */
    orderBy?: ChargePostingRuleOrderByWithRelationInput | ChargePostingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingRules.
     */
    cursor?: ChargePostingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingRules.
     */
    distinct?: ChargePostingRuleScalarFieldEnum | ChargePostingRuleScalarFieldEnum[]
  }

  /**
   * ChargePostingRule findMany
   */
  export type ChargePostingRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingRules to fetch.
     */
    where?: ChargePostingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingRules to fetch.
     */
    orderBy?: ChargePostingRuleOrderByWithRelationInput | ChargePostingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChargePostingRules.
     */
    cursor?: ChargePostingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingRules.
     */
    skip?: number
    distinct?: ChargePostingRuleScalarFieldEnum | ChargePostingRuleScalarFieldEnum[]
  }

  /**
   * ChargePostingRule create
   */
  export type ChargePostingRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a ChargePostingRule.
     */
    data: XOR<ChargePostingRuleCreateInput, ChargePostingRuleUncheckedCreateInput>
  }

  /**
   * ChargePostingRule createMany
   */
  export type ChargePostingRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChargePostingRules.
     */
    data: ChargePostingRuleCreateManyInput | ChargePostingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChargePostingRule createManyAndReturn
   */
  export type ChargePostingRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChargePostingRules.
     */
    data: ChargePostingRuleCreateManyInput | ChargePostingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChargePostingRule update
   */
  export type ChargePostingRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a ChargePostingRule.
     */
    data: XOR<ChargePostingRuleUpdateInput, ChargePostingRuleUncheckedUpdateInput>
    /**
     * Choose, which ChargePostingRule to update.
     */
    where: ChargePostingRuleWhereUniqueInput
  }

  /**
   * ChargePostingRule updateMany
   */
  export type ChargePostingRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChargePostingRules.
     */
    data: XOR<ChargePostingRuleUpdateManyMutationInput, ChargePostingRuleUncheckedUpdateManyInput>
    /**
     * Filter which ChargePostingRules to update
     */
    where?: ChargePostingRuleWhereInput
  }

  /**
   * ChargePostingRule upsert
   */
  export type ChargePostingRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the ChargePostingRule to update in case it exists.
     */
    where: ChargePostingRuleWhereUniqueInput
    /**
     * In case the ChargePostingRule found by the `where` argument doesn't exist, create a new ChargePostingRule with this data.
     */
    create: XOR<ChargePostingRuleCreateInput, ChargePostingRuleUncheckedCreateInput>
    /**
     * In case the ChargePostingRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChargePostingRuleUpdateInput, ChargePostingRuleUncheckedUpdateInput>
  }

  /**
   * ChargePostingRule delete
   */
  export type ChargePostingRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
    /**
     * Filter which ChargePostingRule to delete.
     */
    where: ChargePostingRuleWhereUniqueInput
  }

  /**
   * ChargePostingRule deleteMany
   */
  export type ChargePostingRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingRules to delete
     */
    where?: ChargePostingRuleWhereInput
  }

  /**
   * ChargePostingRule.auditRecords
   */
  export type ChargePostingRule$auditRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    where?: ChargePostingAuditWhereInput
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    cursor?: ChargePostingAuditWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChargePostingAuditScalarFieldEnum | ChargePostingAuditScalarFieldEnum[]
  }

  /**
   * ChargePostingRule without action
   */
  export type ChargePostingRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingRule
     */
    select?: ChargePostingRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingRuleInclude<ExtArgs> | null
  }


  /**
   * Model ChargePostingEvent
   */

  export type AggregateChargePostingEvent = {
    _count: ChargePostingEventCountAggregateOutputType | null
    _avg: ChargePostingEventAvgAggregateOutputType | null
    _sum: ChargePostingEventSumAggregateOutputType | null
    _min: ChargePostingEventMinAggregateOutputType | null
    _max: ChargePostingEventMaxAggregateOutputType | null
  }

  export type ChargePostingEventAvgAggregateOutputType = {
    rulesMatched: number | null
    chargesCreated: number | null
  }

  export type ChargePostingEventSumAggregateOutputType = {
    rulesMatched: number | null
    chargesCreated: number | null
  }

  export type ChargePostingEventMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    eventType: string | null
    eventSource: string | null
    eventId: string | null
    patientId: string | null
    encounterId: string | null
    processed: boolean | null
    processedAt: Date | null
    rulesMatched: number | null
    chargesCreated: number | null
    error: string | null
    createdAt: Date | null
  }

  export type ChargePostingEventMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    eventType: string | null
    eventSource: string | null
    eventId: string | null
    patientId: string | null
    encounterId: string | null
    processed: boolean | null
    processedAt: Date | null
    rulesMatched: number | null
    chargesCreated: number | null
    error: string | null
    createdAt: Date | null
  }

  export type ChargePostingEventCountAggregateOutputType = {
    id: number
    tenantId: number
    eventType: number
    eventSource: number
    eventId: number
    eventData: number
    patientId: number
    encounterId: number
    processed: number
    processedAt: number
    rulesMatched: number
    chargesCreated: number
    error: number
    createdAt: number
    _all: number
  }


  export type ChargePostingEventAvgAggregateInputType = {
    rulesMatched?: true
    chargesCreated?: true
  }

  export type ChargePostingEventSumAggregateInputType = {
    rulesMatched?: true
    chargesCreated?: true
  }

  export type ChargePostingEventMinAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    eventSource?: true
    eventId?: true
    patientId?: true
    encounterId?: true
    processed?: true
    processedAt?: true
    rulesMatched?: true
    chargesCreated?: true
    error?: true
    createdAt?: true
  }

  export type ChargePostingEventMaxAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    eventSource?: true
    eventId?: true
    patientId?: true
    encounterId?: true
    processed?: true
    processedAt?: true
    rulesMatched?: true
    chargesCreated?: true
    error?: true
    createdAt?: true
  }

  export type ChargePostingEventCountAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    eventSource?: true
    eventId?: true
    eventData?: true
    patientId?: true
    encounterId?: true
    processed?: true
    processedAt?: true
    rulesMatched?: true
    chargesCreated?: true
    error?: true
    createdAt?: true
    _all?: true
  }

  export type ChargePostingEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingEvent to aggregate.
     */
    where?: ChargePostingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingEvents to fetch.
     */
    orderBy?: ChargePostingEventOrderByWithRelationInput | ChargePostingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChargePostingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChargePostingEvents
    **/
    _count?: true | ChargePostingEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChargePostingEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChargePostingEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChargePostingEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChargePostingEventMaxAggregateInputType
  }

  export type GetChargePostingEventAggregateType<T extends ChargePostingEventAggregateArgs> = {
        [P in keyof T & keyof AggregateChargePostingEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChargePostingEvent[P]>
      : GetScalarType<T[P], AggregateChargePostingEvent[P]>
  }




  export type ChargePostingEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargePostingEventWhereInput
    orderBy?: ChargePostingEventOrderByWithAggregationInput | ChargePostingEventOrderByWithAggregationInput[]
    by: ChargePostingEventScalarFieldEnum[] | ChargePostingEventScalarFieldEnum
    having?: ChargePostingEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChargePostingEventCountAggregateInputType | true
    _avg?: ChargePostingEventAvgAggregateInputType
    _sum?: ChargePostingEventSumAggregateInputType
    _min?: ChargePostingEventMinAggregateInputType
    _max?: ChargePostingEventMaxAggregateInputType
  }

  export type ChargePostingEventGroupByOutputType = {
    id: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonValue
    patientId: string
    encounterId: string | null
    processed: boolean
    processedAt: Date | null
    rulesMatched: number
    chargesCreated: number
    error: string | null
    createdAt: Date
    _count: ChargePostingEventCountAggregateOutputType | null
    _avg: ChargePostingEventAvgAggregateOutputType | null
    _sum: ChargePostingEventSumAggregateOutputType | null
    _min: ChargePostingEventMinAggregateOutputType | null
    _max: ChargePostingEventMaxAggregateOutputType | null
  }

  type GetChargePostingEventGroupByPayload<T extends ChargePostingEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChargePostingEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChargePostingEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChargePostingEventGroupByOutputType[P]>
            : GetScalarType<T[P], ChargePostingEventGroupByOutputType[P]>
        }
      >
    >


  export type ChargePostingEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    eventSource?: boolean
    eventId?: boolean
    eventData?: boolean
    patientId?: boolean
    encounterId?: boolean
    processed?: boolean
    processedAt?: boolean
    rulesMatched?: boolean
    chargesCreated?: boolean
    error?: boolean
    createdAt?: boolean
    auditRecords?: boolean | ChargePostingEvent$auditRecordsArgs<ExtArgs>
    _count?: boolean | ChargePostingEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chargePostingEvent"]>

  export type ChargePostingEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    eventSource?: boolean
    eventId?: boolean
    eventData?: boolean
    patientId?: boolean
    encounterId?: boolean
    processed?: boolean
    processedAt?: boolean
    rulesMatched?: boolean
    chargesCreated?: boolean
    error?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["chargePostingEvent"]>

  export type ChargePostingEventSelectScalar = {
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    eventSource?: boolean
    eventId?: boolean
    eventData?: boolean
    patientId?: boolean
    encounterId?: boolean
    processed?: boolean
    processedAt?: boolean
    rulesMatched?: boolean
    chargesCreated?: boolean
    error?: boolean
    createdAt?: boolean
  }

  export type ChargePostingEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditRecords?: boolean | ChargePostingEvent$auditRecordsArgs<ExtArgs>
    _count?: boolean | ChargePostingEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChargePostingEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChargePostingEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChargePostingEvent"
    objects: {
      auditRecords: Prisma.$ChargePostingAuditPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      eventType: string
      eventSource: string
      eventId: string
      eventData: Prisma.JsonValue
      patientId: string
      encounterId: string | null
      processed: boolean
      processedAt: Date | null
      rulesMatched: number
      chargesCreated: number
      error: string | null
      createdAt: Date
    }, ExtArgs["result"]["chargePostingEvent"]>
    composites: {}
  }

  type ChargePostingEventGetPayload<S extends boolean | null | undefined | ChargePostingEventDefaultArgs> = $Result.GetResult<Prisma.$ChargePostingEventPayload, S>

  type ChargePostingEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChargePostingEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChargePostingEventCountAggregateInputType | true
    }

  export interface ChargePostingEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChargePostingEvent'], meta: { name: 'ChargePostingEvent' } }
    /**
     * Find zero or one ChargePostingEvent that matches the filter.
     * @param {ChargePostingEventFindUniqueArgs} args - Arguments to find a ChargePostingEvent
     * @example
     * // Get one ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChargePostingEventFindUniqueArgs>(args: SelectSubset<T, ChargePostingEventFindUniqueArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChargePostingEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChargePostingEventFindUniqueOrThrowArgs} args - Arguments to find a ChargePostingEvent
     * @example
     * // Get one ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChargePostingEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ChargePostingEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChargePostingEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventFindFirstArgs} args - Arguments to find a ChargePostingEvent
     * @example
     * // Get one ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChargePostingEventFindFirstArgs>(args?: SelectSubset<T, ChargePostingEventFindFirstArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChargePostingEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventFindFirstOrThrowArgs} args - Arguments to find a ChargePostingEvent
     * @example
     * // Get one ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChargePostingEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ChargePostingEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChargePostingEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChargePostingEvents
     * const chargePostingEvents = await prisma.chargePostingEvent.findMany()
     * 
     * // Get first 10 ChargePostingEvents
     * const chargePostingEvents = await prisma.chargePostingEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chargePostingEventWithIdOnly = await prisma.chargePostingEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChargePostingEventFindManyArgs>(args?: SelectSubset<T, ChargePostingEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChargePostingEvent.
     * @param {ChargePostingEventCreateArgs} args - Arguments to create a ChargePostingEvent.
     * @example
     * // Create one ChargePostingEvent
     * const ChargePostingEvent = await prisma.chargePostingEvent.create({
     *   data: {
     *     // ... data to create a ChargePostingEvent
     *   }
     * })
     * 
     */
    create<T extends ChargePostingEventCreateArgs>(args: SelectSubset<T, ChargePostingEventCreateArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChargePostingEvents.
     * @param {ChargePostingEventCreateManyArgs} args - Arguments to create many ChargePostingEvents.
     * @example
     * // Create many ChargePostingEvents
     * const chargePostingEvent = await prisma.chargePostingEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChargePostingEventCreateManyArgs>(args?: SelectSubset<T, ChargePostingEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChargePostingEvents and returns the data saved in the database.
     * @param {ChargePostingEventCreateManyAndReturnArgs} args - Arguments to create many ChargePostingEvents.
     * @example
     * // Create many ChargePostingEvents
     * const chargePostingEvent = await prisma.chargePostingEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChargePostingEvents and only return the `id`
     * const chargePostingEventWithIdOnly = await prisma.chargePostingEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChargePostingEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ChargePostingEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChargePostingEvent.
     * @param {ChargePostingEventDeleteArgs} args - Arguments to delete one ChargePostingEvent.
     * @example
     * // Delete one ChargePostingEvent
     * const ChargePostingEvent = await prisma.chargePostingEvent.delete({
     *   where: {
     *     // ... filter to delete one ChargePostingEvent
     *   }
     * })
     * 
     */
    delete<T extends ChargePostingEventDeleteArgs>(args: SelectSubset<T, ChargePostingEventDeleteArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChargePostingEvent.
     * @param {ChargePostingEventUpdateArgs} args - Arguments to update one ChargePostingEvent.
     * @example
     * // Update one ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChargePostingEventUpdateArgs>(args: SelectSubset<T, ChargePostingEventUpdateArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChargePostingEvents.
     * @param {ChargePostingEventDeleteManyArgs} args - Arguments to filter ChargePostingEvents to delete.
     * @example
     * // Delete a few ChargePostingEvents
     * const { count } = await prisma.chargePostingEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChargePostingEventDeleteManyArgs>(args?: SelectSubset<T, ChargePostingEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChargePostingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChargePostingEvents
     * const chargePostingEvent = await prisma.chargePostingEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChargePostingEventUpdateManyArgs>(args: SelectSubset<T, ChargePostingEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChargePostingEvent.
     * @param {ChargePostingEventUpsertArgs} args - Arguments to update or create a ChargePostingEvent.
     * @example
     * // Update or create a ChargePostingEvent
     * const chargePostingEvent = await prisma.chargePostingEvent.upsert({
     *   create: {
     *     // ... data to create a ChargePostingEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChargePostingEvent we want to update
     *   }
     * })
     */
    upsert<T extends ChargePostingEventUpsertArgs>(args: SelectSubset<T, ChargePostingEventUpsertArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChargePostingEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventCountArgs} args - Arguments to filter ChargePostingEvents to count.
     * @example
     * // Count the number of ChargePostingEvents
     * const count = await prisma.chargePostingEvent.count({
     *   where: {
     *     // ... the filter for the ChargePostingEvents we want to count
     *   }
     * })
    **/
    count<T extends ChargePostingEventCountArgs>(
      args?: Subset<T, ChargePostingEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChargePostingEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChargePostingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChargePostingEventAggregateArgs>(args: Subset<T, ChargePostingEventAggregateArgs>): Prisma.PrismaPromise<GetChargePostingEventAggregateType<T>>

    /**
     * Group by ChargePostingEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChargePostingEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChargePostingEventGroupByArgs['orderBy'] }
        : { orderBy?: ChargePostingEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChargePostingEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChargePostingEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChargePostingEvent model
   */
  readonly fields: ChargePostingEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChargePostingEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChargePostingEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditRecords<T extends ChargePostingEvent$auditRecordsArgs<ExtArgs> = {}>(args?: Subset<T, ChargePostingEvent$auditRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChargePostingEvent model
   */ 
  interface ChargePostingEventFieldRefs {
    readonly id: FieldRef<"ChargePostingEvent", 'String'>
    readonly tenantId: FieldRef<"ChargePostingEvent", 'String'>
    readonly eventType: FieldRef<"ChargePostingEvent", 'String'>
    readonly eventSource: FieldRef<"ChargePostingEvent", 'String'>
    readonly eventId: FieldRef<"ChargePostingEvent", 'String'>
    readonly eventData: FieldRef<"ChargePostingEvent", 'Json'>
    readonly patientId: FieldRef<"ChargePostingEvent", 'String'>
    readonly encounterId: FieldRef<"ChargePostingEvent", 'String'>
    readonly processed: FieldRef<"ChargePostingEvent", 'Boolean'>
    readonly processedAt: FieldRef<"ChargePostingEvent", 'DateTime'>
    readonly rulesMatched: FieldRef<"ChargePostingEvent", 'Int'>
    readonly chargesCreated: FieldRef<"ChargePostingEvent", 'Int'>
    readonly error: FieldRef<"ChargePostingEvent", 'String'>
    readonly createdAt: FieldRef<"ChargePostingEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChargePostingEvent findUnique
   */
  export type ChargePostingEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingEvent to fetch.
     */
    where: ChargePostingEventWhereUniqueInput
  }

  /**
   * ChargePostingEvent findUniqueOrThrow
   */
  export type ChargePostingEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingEvent to fetch.
     */
    where: ChargePostingEventWhereUniqueInput
  }

  /**
   * ChargePostingEvent findFirst
   */
  export type ChargePostingEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingEvent to fetch.
     */
    where?: ChargePostingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingEvents to fetch.
     */
    orderBy?: ChargePostingEventOrderByWithRelationInput | ChargePostingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingEvents.
     */
    cursor?: ChargePostingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingEvents.
     */
    distinct?: ChargePostingEventScalarFieldEnum | ChargePostingEventScalarFieldEnum[]
  }

  /**
   * ChargePostingEvent findFirstOrThrow
   */
  export type ChargePostingEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingEvent to fetch.
     */
    where?: ChargePostingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingEvents to fetch.
     */
    orderBy?: ChargePostingEventOrderByWithRelationInput | ChargePostingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingEvents.
     */
    cursor?: ChargePostingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingEvents.
     */
    distinct?: ChargePostingEventScalarFieldEnum | ChargePostingEventScalarFieldEnum[]
  }

  /**
   * ChargePostingEvent findMany
   */
  export type ChargePostingEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingEvents to fetch.
     */
    where?: ChargePostingEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingEvents to fetch.
     */
    orderBy?: ChargePostingEventOrderByWithRelationInput | ChargePostingEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChargePostingEvents.
     */
    cursor?: ChargePostingEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingEvents.
     */
    skip?: number
    distinct?: ChargePostingEventScalarFieldEnum | ChargePostingEventScalarFieldEnum[]
  }

  /**
   * ChargePostingEvent create
   */
  export type ChargePostingEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * The data needed to create a ChargePostingEvent.
     */
    data: XOR<ChargePostingEventCreateInput, ChargePostingEventUncheckedCreateInput>
  }

  /**
   * ChargePostingEvent createMany
   */
  export type ChargePostingEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChargePostingEvents.
     */
    data: ChargePostingEventCreateManyInput | ChargePostingEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChargePostingEvent createManyAndReturn
   */
  export type ChargePostingEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChargePostingEvents.
     */
    data: ChargePostingEventCreateManyInput | ChargePostingEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChargePostingEvent update
   */
  export type ChargePostingEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * The data needed to update a ChargePostingEvent.
     */
    data: XOR<ChargePostingEventUpdateInput, ChargePostingEventUncheckedUpdateInput>
    /**
     * Choose, which ChargePostingEvent to update.
     */
    where: ChargePostingEventWhereUniqueInput
  }

  /**
   * ChargePostingEvent updateMany
   */
  export type ChargePostingEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChargePostingEvents.
     */
    data: XOR<ChargePostingEventUpdateManyMutationInput, ChargePostingEventUncheckedUpdateManyInput>
    /**
     * Filter which ChargePostingEvents to update
     */
    where?: ChargePostingEventWhereInput
  }

  /**
   * ChargePostingEvent upsert
   */
  export type ChargePostingEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * The filter to search for the ChargePostingEvent to update in case it exists.
     */
    where: ChargePostingEventWhereUniqueInput
    /**
     * In case the ChargePostingEvent found by the `where` argument doesn't exist, create a new ChargePostingEvent with this data.
     */
    create: XOR<ChargePostingEventCreateInput, ChargePostingEventUncheckedCreateInput>
    /**
     * In case the ChargePostingEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChargePostingEventUpdateInput, ChargePostingEventUncheckedUpdateInput>
  }

  /**
   * ChargePostingEvent delete
   */
  export type ChargePostingEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
    /**
     * Filter which ChargePostingEvent to delete.
     */
    where: ChargePostingEventWhereUniqueInput
  }

  /**
   * ChargePostingEvent deleteMany
   */
  export type ChargePostingEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingEvents to delete
     */
    where?: ChargePostingEventWhereInput
  }

  /**
   * ChargePostingEvent.auditRecords
   */
  export type ChargePostingEvent$auditRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    where?: ChargePostingAuditWhereInput
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    cursor?: ChargePostingAuditWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChargePostingAuditScalarFieldEnum | ChargePostingAuditScalarFieldEnum[]
  }

  /**
   * ChargePostingEvent without action
   */
  export type ChargePostingEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingEvent
     */
    select?: ChargePostingEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingEventInclude<ExtArgs> | null
  }


  /**
   * Model ChargePostingAudit
   */

  export type AggregateChargePostingAudit = {
    _count: ChargePostingAuditCountAggregateOutputType | null
    _min: ChargePostingAuditMinAggregateOutputType | null
    _max: ChargePostingAuditMaxAggregateOutputType | null
  }

  export type ChargePostingAuditMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    chargeId: string | null
    eventId: string | null
    ruleId: string | null
    createdAt: Date | null
  }

  export type ChargePostingAuditMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    chargeId: string | null
    eventId: string | null
    ruleId: string | null
    createdAt: Date | null
  }

  export type ChargePostingAuditCountAggregateOutputType = {
    id: number
    tenantId: number
    chargeId: number
    eventId: number
    ruleId: number
    conditionsMet: number
    calculationDetails: number
    createdAt: number
    _all: number
  }


  export type ChargePostingAuditMinAggregateInputType = {
    id?: true
    tenantId?: true
    chargeId?: true
    eventId?: true
    ruleId?: true
    createdAt?: true
  }

  export type ChargePostingAuditMaxAggregateInputType = {
    id?: true
    tenantId?: true
    chargeId?: true
    eventId?: true
    ruleId?: true
    createdAt?: true
  }

  export type ChargePostingAuditCountAggregateInputType = {
    id?: true
    tenantId?: true
    chargeId?: true
    eventId?: true
    ruleId?: true
    conditionsMet?: true
    calculationDetails?: true
    createdAt?: true
    _all?: true
  }

  export type ChargePostingAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingAudit to aggregate.
     */
    where?: ChargePostingAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingAudits to fetch.
     */
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChargePostingAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChargePostingAudits
    **/
    _count?: true | ChargePostingAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChargePostingAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChargePostingAuditMaxAggregateInputType
  }

  export type GetChargePostingAuditAggregateType<T extends ChargePostingAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateChargePostingAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChargePostingAudit[P]>
      : GetScalarType<T[P], AggregateChargePostingAudit[P]>
  }




  export type ChargePostingAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChargePostingAuditWhereInput
    orderBy?: ChargePostingAuditOrderByWithAggregationInput | ChargePostingAuditOrderByWithAggregationInput[]
    by: ChargePostingAuditScalarFieldEnum[] | ChargePostingAuditScalarFieldEnum
    having?: ChargePostingAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChargePostingAuditCountAggregateInputType | true
    _min?: ChargePostingAuditMinAggregateInputType
    _max?: ChargePostingAuditMaxAggregateInputType
  }

  export type ChargePostingAuditGroupByOutputType = {
    id: string
    tenantId: string
    chargeId: string
    eventId: string
    ruleId: string
    conditionsMet: JsonValue | null
    calculationDetails: JsonValue | null
    createdAt: Date
    _count: ChargePostingAuditCountAggregateOutputType | null
    _min: ChargePostingAuditMinAggregateOutputType | null
    _max: ChargePostingAuditMaxAggregateOutputType | null
  }

  type GetChargePostingAuditGroupByPayload<T extends ChargePostingAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChargePostingAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChargePostingAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChargePostingAuditGroupByOutputType[P]>
            : GetScalarType<T[P], ChargePostingAuditGroupByOutputType[P]>
        }
      >
    >


  export type ChargePostingAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    chargeId?: boolean
    eventId?: boolean
    ruleId?: boolean
    conditionsMet?: boolean
    calculationDetails?: boolean
    createdAt?: boolean
    event?: boolean | ChargePostingEventDefaultArgs<ExtArgs>
    rule?: boolean | ChargePostingRuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chargePostingAudit"]>

  export type ChargePostingAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    chargeId?: boolean
    eventId?: boolean
    ruleId?: boolean
    conditionsMet?: boolean
    calculationDetails?: boolean
    createdAt?: boolean
    event?: boolean | ChargePostingEventDefaultArgs<ExtArgs>
    rule?: boolean | ChargePostingRuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chargePostingAudit"]>

  export type ChargePostingAuditSelectScalar = {
    id?: boolean
    tenantId?: boolean
    chargeId?: boolean
    eventId?: boolean
    ruleId?: boolean
    conditionsMet?: boolean
    calculationDetails?: boolean
    createdAt?: boolean
  }

  export type ChargePostingAuditInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | ChargePostingEventDefaultArgs<ExtArgs>
    rule?: boolean | ChargePostingRuleDefaultArgs<ExtArgs>
  }
  export type ChargePostingAuditIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    event?: boolean | ChargePostingEventDefaultArgs<ExtArgs>
    rule?: boolean | ChargePostingRuleDefaultArgs<ExtArgs>
  }

  export type $ChargePostingAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChargePostingAudit"
    objects: {
      event: Prisma.$ChargePostingEventPayload<ExtArgs>
      rule: Prisma.$ChargePostingRulePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      chargeId: string
      eventId: string
      ruleId: string
      conditionsMet: Prisma.JsonValue | null
      calculationDetails: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["chargePostingAudit"]>
    composites: {}
  }

  type ChargePostingAuditGetPayload<S extends boolean | null | undefined | ChargePostingAuditDefaultArgs> = $Result.GetResult<Prisma.$ChargePostingAuditPayload, S>

  type ChargePostingAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChargePostingAuditFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChargePostingAuditCountAggregateInputType | true
    }

  export interface ChargePostingAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChargePostingAudit'], meta: { name: 'ChargePostingAudit' } }
    /**
     * Find zero or one ChargePostingAudit that matches the filter.
     * @param {ChargePostingAuditFindUniqueArgs} args - Arguments to find a ChargePostingAudit
     * @example
     * // Get one ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChargePostingAuditFindUniqueArgs>(args: SelectSubset<T, ChargePostingAuditFindUniqueArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChargePostingAudit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChargePostingAuditFindUniqueOrThrowArgs} args - Arguments to find a ChargePostingAudit
     * @example
     * // Get one ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChargePostingAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, ChargePostingAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChargePostingAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditFindFirstArgs} args - Arguments to find a ChargePostingAudit
     * @example
     * // Get one ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChargePostingAuditFindFirstArgs>(args?: SelectSubset<T, ChargePostingAuditFindFirstArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChargePostingAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditFindFirstOrThrowArgs} args - Arguments to find a ChargePostingAudit
     * @example
     * // Get one ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChargePostingAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, ChargePostingAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChargePostingAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChargePostingAudits
     * const chargePostingAudits = await prisma.chargePostingAudit.findMany()
     * 
     * // Get first 10 ChargePostingAudits
     * const chargePostingAudits = await prisma.chargePostingAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chargePostingAuditWithIdOnly = await prisma.chargePostingAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChargePostingAuditFindManyArgs>(args?: SelectSubset<T, ChargePostingAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChargePostingAudit.
     * @param {ChargePostingAuditCreateArgs} args - Arguments to create a ChargePostingAudit.
     * @example
     * // Create one ChargePostingAudit
     * const ChargePostingAudit = await prisma.chargePostingAudit.create({
     *   data: {
     *     // ... data to create a ChargePostingAudit
     *   }
     * })
     * 
     */
    create<T extends ChargePostingAuditCreateArgs>(args: SelectSubset<T, ChargePostingAuditCreateArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChargePostingAudits.
     * @param {ChargePostingAuditCreateManyArgs} args - Arguments to create many ChargePostingAudits.
     * @example
     * // Create many ChargePostingAudits
     * const chargePostingAudit = await prisma.chargePostingAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChargePostingAuditCreateManyArgs>(args?: SelectSubset<T, ChargePostingAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChargePostingAudits and returns the data saved in the database.
     * @param {ChargePostingAuditCreateManyAndReturnArgs} args - Arguments to create many ChargePostingAudits.
     * @example
     * // Create many ChargePostingAudits
     * const chargePostingAudit = await prisma.chargePostingAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChargePostingAudits and only return the `id`
     * const chargePostingAuditWithIdOnly = await prisma.chargePostingAudit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChargePostingAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, ChargePostingAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ChargePostingAudit.
     * @param {ChargePostingAuditDeleteArgs} args - Arguments to delete one ChargePostingAudit.
     * @example
     * // Delete one ChargePostingAudit
     * const ChargePostingAudit = await prisma.chargePostingAudit.delete({
     *   where: {
     *     // ... filter to delete one ChargePostingAudit
     *   }
     * })
     * 
     */
    delete<T extends ChargePostingAuditDeleteArgs>(args: SelectSubset<T, ChargePostingAuditDeleteArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChargePostingAudit.
     * @param {ChargePostingAuditUpdateArgs} args - Arguments to update one ChargePostingAudit.
     * @example
     * // Update one ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChargePostingAuditUpdateArgs>(args: SelectSubset<T, ChargePostingAuditUpdateArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChargePostingAudits.
     * @param {ChargePostingAuditDeleteManyArgs} args - Arguments to filter ChargePostingAudits to delete.
     * @example
     * // Delete a few ChargePostingAudits
     * const { count } = await prisma.chargePostingAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChargePostingAuditDeleteManyArgs>(args?: SelectSubset<T, ChargePostingAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChargePostingAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChargePostingAudits
     * const chargePostingAudit = await prisma.chargePostingAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChargePostingAuditUpdateManyArgs>(args: SelectSubset<T, ChargePostingAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChargePostingAudit.
     * @param {ChargePostingAuditUpsertArgs} args - Arguments to update or create a ChargePostingAudit.
     * @example
     * // Update or create a ChargePostingAudit
     * const chargePostingAudit = await prisma.chargePostingAudit.upsert({
     *   create: {
     *     // ... data to create a ChargePostingAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChargePostingAudit we want to update
     *   }
     * })
     */
    upsert<T extends ChargePostingAuditUpsertArgs>(args: SelectSubset<T, ChargePostingAuditUpsertArgs<ExtArgs>>): Prisma__ChargePostingAuditClient<$Result.GetResult<Prisma.$ChargePostingAuditPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ChargePostingAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditCountArgs} args - Arguments to filter ChargePostingAudits to count.
     * @example
     * // Count the number of ChargePostingAudits
     * const count = await prisma.chargePostingAudit.count({
     *   where: {
     *     // ... the filter for the ChargePostingAudits we want to count
     *   }
     * })
    **/
    count<T extends ChargePostingAuditCountArgs>(
      args?: Subset<T, ChargePostingAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChargePostingAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChargePostingAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChargePostingAuditAggregateArgs>(args: Subset<T, ChargePostingAuditAggregateArgs>): Prisma.PrismaPromise<GetChargePostingAuditAggregateType<T>>

    /**
     * Group by ChargePostingAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChargePostingAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChargePostingAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChargePostingAuditGroupByArgs['orderBy'] }
        : { orderBy?: ChargePostingAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChargePostingAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChargePostingAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChargePostingAudit model
   */
  readonly fields: ChargePostingAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChargePostingAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChargePostingAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    event<T extends ChargePostingEventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChargePostingEventDefaultArgs<ExtArgs>>): Prisma__ChargePostingEventClient<$Result.GetResult<Prisma.$ChargePostingEventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    rule<T extends ChargePostingRuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChargePostingRuleDefaultArgs<ExtArgs>>): Prisma__ChargePostingRuleClient<$Result.GetResult<Prisma.$ChargePostingRulePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChargePostingAudit model
   */ 
  interface ChargePostingAuditFieldRefs {
    readonly id: FieldRef<"ChargePostingAudit", 'String'>
    readonly tenantId: FieldRef<"ChargePostingAudit", 'String'>
    readonly chargeId: FieldRef<"ChargePostingAudit", 'String'>
    readonly eventId: FieldRef<"ChargePostingAudit", 'String'>
    readonly ruleId: FieldRef<"ChargePostingAudit", 'String'>
    readonly conditionsMet: FieldRef<"ChargePostingAudit", 'Json'>
    readonly calculationDetails: FieldRef<"ChargePostingAudit", 'Json'>
    readonly createdAt: FieldRef<"ChargePostingAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChargePostingAudit findUnique
   */
  export type ChargePostingAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingAudit to fetch.
     */
    where: ChargePostingAuditWhereUniqueInput
  }

  /**
   * ChargePostingAudit findUniqueOrThrow
   */
  export type ChargePostingAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingAudit to fetch.
     */
    where: ChargePostingAuditWhereUniqueInput
  }

  /**
   * ChargePostingAudit findFirst
   */
  export type ChargePostingAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingAudit to fetch.
     */
    where?: ChargePostingAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingAudits to fetch.
     */
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingAudits.
     */
    cursor?: ChargePostingAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingAudits.
     */
    distinct?: ChargePostingAuditScalarFieldEnum | ChargePostingAuditScalarFieldEnum[]
  }

  /**
   * ChargePostingAudit findFirstOrThrow
   */
  export type ChargePostingAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingAudit to fetch.
     */
    where?: ChargePostingAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingAudits to fetch.
     */
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChargePostingAudits.
     */
    cursor?: ChargePostingAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChargePostingAudits.
     */
    distinct?: ChargePostingAuditScalarFieldEnum | ChargePostingAuditScalarFieldEnum[]
  }

  /**
   * ChargePostingAudit findMany
   */
  export type ChargePostingAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter, which ChargePostingAudits to fetch.
     */
    where?: ChargePostingAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChargePostingAudits to fetch.
     */
    orderBy?: ChargePostingAuditOrderByWithRelationInput | ChargePostingAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChargePostingAudits.
     */
    cursor?: ChargePostingAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChargePostingAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChargePostingAudits.
     */
    skip?: number
    distinct?: ChargePostingAuditScalarFieldEnum | ChargePostingAuditScalarFieldEnum[]
  }

  /**
   * ChargePostingAudit create
   */
  export type ChargePostingAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * The data needed to create a ChargePostingAudit.
     */
    data: XOR<ChargePostingAuditCreateInput, ChargePostingAuditUncheckedCreateInput>
  }

  /**
   * ChargePostingAudit createMany
   */
  export type ChargePostingAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChargePostingAudits.
     */
    data: ChargePostingAuditCreateManyInput | ChargePostingAuditCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChargePostingAudit createManyAndReturn
   */
  export type ChargePostingAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ChargePostingAudits.
     */
    data: ChargePostingAuditCreateManyInput | ChargePostingAuditCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChargePostingAudit update
   */
  export type ChargePostingAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * The data needed to update a ChargePostingAudit.
     */
    data: XOR<ChargePostingAuditUpdateInput, ChargePostingAuditUncheckedUpdateInput>
    /**
     * Choose, which ChargePostingAudit to update.
     */
    where: ChargePostingAuditWhereUniqueInput
  }

  /**
   * ChargePostingAudit updateMany
   */
  export type ChargePostingAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChargePostingAudits.
     */
    data: XOR<ChargePostingAuditUpdateManyMutationInput, ChargePostingAuditUncheckedUpdateManyInput>
    /**
     * Filter which ChargePostingAudits to update
     */
    where?: ChargePostingAuditWhereInput
  }

  /**
   * ChargePostingAudit upsert
   */
  export type ChargePostingAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * The filter to search for the ChargePostingAudit to update in case it exists.
     */
    where: ChargePostingAuditWhereUniqueInput
    /**
     * In case the ChargePostingAudit found by the `where` argument doesn't exist, create a new ChargePostingAudit with this data.
     */
    create: XOR<ChargePostingAuditCreateInput, ChargePostingAuditUncheckedCreateInput>
    /**
     * In case the ChargePostingAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChargePostingAuditUpdateInput, ChargePostingAuditUncheckedUpdateInput>
  }

  /**
   * ChargePostingAudit delete
   */
  export type ChargePostingAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
    /**
     * Filter which ChargePostingAudit to delete.
     */
    where: ChargePostingAuditWhereUniqueInput
  }

  /**
   * ChargePostingAudit deleteMany
   */
  export type ChargePostingAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChargePostingAudits to delete
     */
    where?: ChargePostingAuditWhereInput
  }

  /**
   * ChargePostingAudit without action
   */
  export type ChargePostingAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChargePostingAudit
     */
    select?: ChargePostingAuditSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChargePostingAuditInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PayerScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    payerName: 'payerName',
    payerId: 'payerId',
    payerType: 'payerType',
    contactInfo: 'contactInfo',
    configuration: 'configuration',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PayerScalarFieldEnum = (typeof PayerScalarFieldEnum)[keyof typeof PayerScalarFieldEnum]


  export const PolicyScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    policyNumber: 'policyNumber',
    groupNumber: 'groupNumber',
    payerName: 'payerName',
    payerId: 'payerId',
    relationship: 'relationship',
    effectiveDate: 'effectiveDate',
    expirationDate: 'expirationDate',
    benefits: 'benefits',
    isPrimary: 'isPrimary',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PolicyScalarFieldEnum = (typeof PolicyScalarFieldEnum)[keyof typeof PolicyScalarFieldEnum]


  export const ClaimScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    claimNumber: 'claimNumber',
    status: 'status',
    payerId: 'payerId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    totalAmount: 'totalAmount',
    currency: 'currency',
    serviceDate: 'serviceDate',
    submittedAt: 'submittedAt',
    adjudicatedAt: 'adjudicatedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClaimScalarFieldEnum = (typeof ClaimScalarFieldEnum)[keyof typeof ClaimScalarFieldEnum]


  export const EncounterCoverageScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    encounterId: 'encounterId',
    patientId: 'patientId',
    policyId: 'policyId',
    payerId: 'payerId',
    financialClass: 'financialClass',
    coverageLevel: 'coverageLevel',
    planName: 'planName',
    memberId: 'memberId',
    memberName: 'memberName',
    networkName: 'networkName',
    copayAmount: 'copayAmount',
    coinsurancePct: 'coinsurancePct',
    deductibleSnapshot: 'deductibleSnapshot',
    benefitsSnapshot: 'benefitsSnapshot',
    eligibilityRequestId: 'eligibilityRequestId',
    preauthRequestId: 'preauthRequestId',
    costEstimateId: 'costEstimateId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EncounterCoverageScalarFieldEnum = (typeof EncounterCoverageScalarFieldEnum)[keyof typeof EncounterCoverageScalarFieldEnum]


  export const BillingItemScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    itemType: 'itemType',
    clinicalRefId: 'clinicalRefId',
    billingCode: 'billingCode',
    billingCodeType: 'billingCodeType',
    billingDescription: 'billingDescription',
    chargeType: 'chargeType',
    defaultUnit: 'defaultUnit',
    listPrice: 'listPrice',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BillingItemScalarFieldEnum = (typeof BillingItemScalarFieldEnum)[keyof typeof BillingItemScalarFieldEnum]


  export const ChargeScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    billingItemId: 'billingItemId',
    chargeDate: 'chargeDate',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    grossAmount: 'grossAmount',
    patientResponsibility: 'patientResponsibility',
    payerResponsibility: 'payerResponsibility',
    status: 'status',
    sourceType: 'sourceType',
    sourceId: 'sourceId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChargeScalarFieldEnum = (typeof ChargeScalarFieldEnum)[keyof typeof ChargeScalarFieldEnum]


  export const InvoiceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    mrn: 'mrn',
    patientDisplayName: 'patientDisplayName',
    invoiceNumber: 'invoiceNumber',
    invoiceDate: 'invoiceDate',
    dueDate: 'dueDate',
    grossAmount: 'grossAmount',
    totalDiscounts: 'totalDiscounts',
    netAmount: 'netAmount',
    amountPaid: 'amountPaid',
    balanceDue: 'balanceDue',
    status: 'status',
    currency: 'currency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvoiceScalarFieldEnum = (typeof InvoiceScalarFieldEnum)[keyof typeof InvoiceScalarFieldEnum]


  export const InvoiceLineScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    chargeId: 'chargeId',
    lineNumber: 'lineNumber',
    description: 'description',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    lineAmount: 'lineAmount',
    lineDiscount: 'lineDiscount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InvoiceLineScalarFieldEnum = (typeof InvoiceLineScalarFieldEnum)[keyof typeof InvoiceLineScalarFieldEnum]


  export const ReceiptScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    invoiceId: 'invoiceId',
    mrn: 'mrn',
    patientDisplayName: 'patientDisplayName',
    receiptNumber: 'receiptNumber',
    receiptDate: 'receiptDate',
    amount: 'amount',
    currency: 'currency',
    paymentMethod: 'paymentMethod',
    txnReference: 'txnReference',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReceiptScalarFieldEnum = (typeof ReceiptScalarFieldEnum)[keyof typeof ReceiptScalarFieldEnum]


  export const ReceiptAllocationScalarFieldEnum: {
    id: 'id',
    receiptId: 'receiptId',
    invoiceId: 'invoiceId',
    allocatedAmount: 'allocatedAmount',
    createdAt: 'createdAt'
  };

  export type ReceiptAllocationScalarFieldEnum = (typeof ReceiptAllocationScalarFieldEnum)[keyof typeof ReceiptAllocationScalarFieldEnum]


  export const ChargePostingRuleScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    ruleName: 'ruleName',
    eventType: 'eventType',
    eventSource: 'eventSource',
    billingItemType: 'billingItemType',
    billingItemId: 'billingItemId',
    conditions: 'conditions',
    chargeCalculationMethod: 'chargeCalculationMethod',
    basePrice: 'basePrice',
    priceSource: 'priceSource',
    quantitySource: 'quantitySource',
    discountPercentage: 'discountPercentage',
    taxPercentage: 'taxPercentage',
    isActive: 'isActive',
    priority: 'priority',
    autoApprove: 'autoApprove',
    description: 'description',
    configuration: 'configuration',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy'
  };

  export type ChargePostingRuleScalarFieldEnum = (typeof ChargePostingRuleScalarFieldEnum)[keyof typeof ChargePostingRuleScalarFieldEnum]


  export const ChargePostingEventScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    eventType: 'eventType',
    eventSource: 'eventSource',
    eventId: 'eventId',
    eventData: 'eventData',
    patientId: 'patientId',
    encounterId: 'encounterId',
    processed: 'processed',
    processedAt: 'processedAt',
    rulesMatched: 'rulesMatched',
    chargesCreated: 'chargesCreated',
    error: 'error',
    createdAt: 'createdAt'
  };

  export type ChargePostingEventScalarFieldEnum = (typeof ChargePostingEventScalarFieldEnum)[keyof typeof ChargePostingEventScalarFieldEnum]


  export const ChargePostingAuditScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    chargeId: 'chargeId',
    eventId: 'eventId',
    ruleId: 'ruleId',
    conditionsMet: 'conditionsMet',
    calculationDetails: 'calculationDetails',
    createdAt: 'createdAt'
  };

  export type ChargePostingAuditScalarFieldEnum = (typeof ChargePostingAuditScalarFieldEnum)[keyof typeof ChargePostingAuditScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PayerWhereInput = {
    AND?: PayerWhereInput | PayerWhereInput[]
    OR?: PayerWhereInput[]
    NOT?: PayerWhereInput | PayerWhereInput[]
    id?: UuidFilter<"Payer"> | string
    tenantId?: UuidFilter<"Payer"> | string
    payerName?: StringFilter<"Payer"> | string
    payerId?: StringNullableFilter<"Payer"> | string | null
    payerType?: StringNullableFilter<"Payer"> | string | null
    contactInfo?: JsonFilter<"Payer">
    configuration?: JsonFilter<"Payer">
    status?: StringFilter<"Payer"> | string
    createdAt?: DateTimeFilter<"Payer"> | Date | string
    updatedAt?: DateTimeFilter<"Payer"> | Date | string
    policies?: PolicyListRelationFilter
    claims?: ClaimListRelationFilter
    encounterCoverages?: EncounterCoverageListRelationFilter
  }

  export type PayerOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrderInput | SortOrder
    payerType?: SortOrderInput | SortOrder
    contactInfo?: SortOrder
    configuration?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    policies?: PolicyOrderByRelationAggregateInput
    claims?: ClaimOrderByRelationAggregateInput
    encounterCoverages?: EncounterCoverageOrderByRelationAggregateInput
  }

  export type PayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PayerWhereInput | PayerWhereInput[]
    OR?: PayerWhereInput[]
    NOT?: PayerWhereInput | PayerWhereInput[]
    tenantId?: UuidFilter<"Payer"> | string
    payerName?: StringFilter<"Payer"> | string
    payerId?: StringNullableFilter<"Payer"> | string | null
    payerType?: StringNullableFilter<"Payer"> | string | null
    contactInfo?: JsonFilter<"Payer">
    configuration?: JsonFilter<"Payer">
    status?: StringFilter<"Payer"> | string
    createdAt?: DateTimeFilter<"Payer"> | Date | string
    updatedAt?: DateTimeFilter<"Payer"> | Date | string
    policies?: PolicyListRelationFilter
    claims?: ClaimListRelationFilter
    encounterCoverages?: EncounterCoverageListRelationFilter
  }, "id">

  export type PayerOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrderInput | SortOrder
    payerType?: SortOrderInput | SortOrder
    contactInfo?: SortOrder
    configuration?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PayerCountOrderByAggregateInput
    _max?: PayerMaxOrderByAggregateInput
    _min?: PayerMinOrderByAggregateInput
  }

  export type PayerScalarWhereWithAggregatesInput = {
    AND?: PayerScalarWhereWithAggregatesInput | PayerScalarWhereWithAggregatesInput[]
    OR?: PayerScalarWhereWithAggregatesInput[]
    NOT?: PayerScalarWhereWithAggregatesInput | PayerScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Payer"> | string
    tenantId?: UuidWithAggregatesFilter<"Payer"> | string
    payerName?: StringWithAggregatesFilter<"Payer"> | string
    payerId?: StringNullableWithAggregatesFilter<"Payer"> | string | null
    payerType?: StringNullableWithAggregatesFilter<"Payer"> | string | null
    contactInfo?: JsonWithAggregatesFilter<"Payer">
    configuration?: JsonWithAggregatesFilter<"Payer">
    status?: StringWithAggregatesFilter<"Payer"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Payer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payer"> | Date | string
  }

  export type PolicyWhereInput = {
    AND?: PolicyWhereInput | PolicyWhereInput[]
    OR?: PolicyWhereInput[]
    NOT?: PolicyWhereInput | PolicyWhereInput[]
    id?: UuidFilter<"Policy"> | string
    tenantId?: UuidFilter<"Policy"> | string
    patientId?: UuidFilter<"Policy"> | string
    policyNumber?: StringFilter<"Policy"> | string
    groupNumber?: StringNullableFilter<"Policy"> | string | null
    payerName?: StringFilter<"Policy"> | string
    payerId?: UuidFilter<"Policy"> | string
    relationship?: StringNullableFilter<"Policy"> | string | null
    effectiveDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    expirationDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    benefits?: JsonFilter<"Policy">
    isPrimary?: BoolFilter<"Policy"> | boolean
    status?: StringFilter<"Policy"> | string
    createdAt?: DateTimeFilter<"Policy"> | Date | string
    updatedAt?: DateTimeFilter<"Policy"> | Date | string
    payer?: XOR<PayerRelationFilter, PayerWhereInput>
    encounterCoverages?: EncounterCoverageListRelationFilter
  }

  export type PolicyOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    policyNumber?: SortOrder
    groupNumber?: SortOrderInput | SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    relationship?: SortOrderInput | SortOrder
    effectiveDate?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    benefits?: SortOrder
    isPrimary?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    payer?: PayerOrderByWithRelationInput
    encounterCoverages?: EncounterCoverageOrderByRelationAggregateInput
  }

  export type PolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PolicyWhereInput | PolicyWhereInput[]
    OR?: PolicyWhereInput[]
    NOT?: PolicyWhereInput | PolicyWhereInput[]
    tenantId?: UuidFilter<"Policy"> | string
    patientId?: UuidFilter<"Policy"> | string
    policyNumber?: StringFilter<"Policy"> | string
    groupNumber?: StringNullableFilter<"Policy"> | string | null
    payerName?: StringFilter<"Policy"> | string
    payerId?: UuidFilter<"Policy"> | string
    relationship?: StringNullableFilter<"Policy"> | string | null
    effectiveDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    expirationDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    benefits?: JsonFilter<"Policy">
    isPrimary?: BoolFilter<"Policy"> | boolean
    status?: StringFilter<"Policy"> | string
    createdAt?: DateTimeFilter<"Policy"> | Date | string
    updatedAt?: DateTimeFilter<"Policy"> | Date | string
    payer?: XOR<PayerRelationFilter, PayerWhereInput>
    encounterCoverages?: EncounterCoverageListRelationFilter
  }, "id">

  export type PolicyOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    policyNumber?: SortOrder
    groupNumber?: SortOrderInput | SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    relationship?: SortOrderInput | SortOrder
    effectiveDate?: SortOrderInput | SortOrder
    expirationDate?: SortOrderInput | SortOrder
    benefits?: SortOrder
    isPrimary?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PolicyCountOrderByAggregateInput
    _max?: PolicyMaxOrderByAggregateInput
    _min?: PolicyMinOrderByAggregateInput
  }

  export type PolicyScalarWhereWithAggregatesInput = {
    AND?: PolicyScalarWhereWithAggregatesInput | PolicyScalarWhereWithAggregatesInput[]
    OR?: PolicyScalarWhereWithAggregatesInput[]
    NOT?: PolicyScalarWhereWithAggregatesInput | PolicyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Policy"> | string
    tenantId?: UuidWithAggregatesFilter<"Policy"> | string
    patientId?: UuidWithAggregatesFilter<"Policy"> | string
    policyNumber?: StringWithAggregatesFilter<"Policy"> | string
    groupNumber?: StringNullableWithAggregatesFilter<"Policy"> | string | null
    payerName?: StringWithAggregatesFilter<"Policy"> | string
    payerId?: UuidWithAggregatesFilter<"Policy"> | string
    relationship?: StringNullableWithAggregatesFilter<"Policy"> | string | null
    effectiveDate?: DateTimeNullableWithAggregatesFilter<"Policy"> | Date | string | null
    expirationDate?: DateTimeNullableWithAggregatesFilter<"Policy"> | Date | string | null
    benefits?: JsonWithAggregatesFilter<"Policy">
    isPrimary?: BoolWithAggregatesFilter<"Policy"> | boolean
    status?: StringWithAggregatesFilter<"Policy"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Policy"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Policy"> | Date | string
  }

  export type ClaimWhereInput = {
    AND?: ClaimWhereInput | ClaimWhereInput[]
    OR?: ClaimWhereInput[]
    NOT?: ClaimWhereInput | ClaimWhereInput[]
    id?: UuidFilter<"Claim"> | string
    tenantId?: UuidFilter<"Claim"> | string
    claimNumber?: StringFilter<"Claim"> | string
    status?: StringFilter<"Claim"> | string
    payerId?: UuidNullableFilter<"Claim"> | string | null
    patientId?: UuidFilter<"Claim"> | string
    encounterId?: UuidNullableFilter<"Claim"> | string | null
    totalAmount?: DecimalFilter<"Claim"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Claim"> | string
    serviceDate?: DateTimeFilter<"Claim"> | Date | string
    submittedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    adjudicatedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    createdAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
    payer?: XOR<PayerNullableRelationFilter, PayerWhereInput> | null
  }

  export type ClaimOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    claimNumber?: SortOrder
    status?: SortOrder
    payerId?: SortOrderInput | SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    serviceDate?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    adjudicatedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    payer?: PayerOrderByWithRelationInput
  }

  export type ClaimWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_claimNumber?: ClaimTenantIdClaimNumberCompoundUniqueInput
    AND?: ClaimWhereInput | ClaimWhereInput[]
    OR?: ClaimWhereInput[]
    NOT?: ClaimWhereInput | ClaimWhereInput[]
    tenantId?: UuidFilter<"Claim"> | string
    claimNumber?: StringFilter<"Claim"> | string
    status?: StringFilter<"Claim"> | string
    payerId?: UuidNullableFilter<"Claim"> | string | null
    patientId?: UuidFilter<"Claim"> | string
    encounterId?: UuidNullableFilter<"Claim"> | string | null
    totalAmount?: DecimalFilter<"Claim"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Claim"> | string
    serviceDate?: DateTimeFilter<"Claim"> | Date | string
    submittedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    adjudicatedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    createdAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
    payer?: XOR<PayerNullableRelationFilter, PayerWhereInput> | null
  }, "id" | "tenantId_claimNumber">

  export type ClaimOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    claimNumber?: SortOrder
    status?: SortOrder
    payerId?: SortOrderInput | SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    serviceDate?: SortOrder
    submittedAt?: SortOrderInput | SortOrder
    adjudicatedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClaimCountOrderByAggregateInput
    _avg?: ClaimAvgOrderByAggregateInput
    _max?: ClaimMaxOrderByAggregateInput
    _min?: ClaimMinOrderByAggregateInput
    _sum?: ClaimSumOrderByAggregateInput
  }

  export type ClaimScalarWhereWithAggregatesInput = {
    AND?: ClaimScalarWhereWithAggregatesInput | ClaimScalarWhereWithAggregatesInput[]
    OR?: ClaimScalarWhereWithAggregatesInput[]
    NOT?: ClaimScalarWhereWithAggregatesInput | ClaimScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Claim"> | string
    tenantId?: UuidWithAggregatesFilter<"Claim"> | string
    claimNumber?: StringWithAggregatesFilter<"Claim"> | string
    status?: StringWithAggregatesFilter<"Claim"> | string
    payerId?: UuidNullableWithAggregatesFilter<"Claim"> | string | null
    patientId?: UuidWithAggregatesFilter<"Claim"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"Claim"> | string | null
    totalAmount?: DecimalWithAggregatesFilter<"Claim"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Claim"> | string
    serviceDate?: DateTimeWithAggregatesFilter<"Claim"> | Date | string
    submittedAt?: DateTimeNullableWithAggregatesFilter<"Claim"> | Date | string | null
    adjudicatedAt?: DateTimeNullableWithAggregatesFilter<"Claim"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Claim"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Claim"> | Date | string
  }

  export type EncounterCoverageWhereInput = {
    AND?: EncounterCoverageWhereInput | EncounterCoverageWhereInput[]
    OR?: EncounterCoverageWhereInput[]
    NOT?: EncounterCoverageWhereInput | EncounterCoverageWhereInput[]
    id?: UuidFilter<"EncounterCoverage"> | string
    tenantId?: UuidFilter<"EncounterCoverage"> | string
    encounterId?: UuidFilter<"EncounterCoverage"> | string
    patientId?: UuidFilter<"EncounterCoverage"> | string
    policyId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    payerId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    financialClass?: StringFilter<"EncounterCoverage"> | string
    coverageLevel?: StringFilter<"EncounterCoverage"> | string
    planName?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberId?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberName?: StringNullableFilter<"EncounterCoverage"> | string | null
    networkName?: StringNullableFilter<"EncounterCoverage"> | string | null
    copayAmount?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: JsonNullableFilter<"EncounterCoverage">
    benefitsSnapshot?: JsonNullableFilter<"EncounterCoverage">
    eligibilityRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    preauthRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    costEstimateId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    isActive?: BoolFilter<"EncounterCoverage"> | boolean
    createdAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
    updatedAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
    policy?: XOR<PolicyNullableRelationFilter, PolicyWhereInput> | null
    payer?: XOR<PayerNullableRelationFilter, PayerWhereInput> | null
  }

  export type EncounterCoverageOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    encounterId?: SortOrder
    patientId?: SortOrder
    policyId?: SortOrderInput | SortOrder
    payerId?: SortOrderInput | SortOrder
    financialClass?: SortOrder
    coverageLevel?: SortOrder
    planName?: SortOrderInput | SortOrder
    memberId?: SortOrderInput | SortOrder
    memberName?: SortOrderInput | SortOrder
    networkName?: SortOrderInput | SortOrder
    copayAmount?: SortOrderInput | SortOrder
    coinsurancePct?: SortOrderInput | SortOrder
    deductibleSnapshot?: SortOrderInput | SortOrder
    benefitsSnapshot?: SortOrderInput | SortOrder
    eligibilityRequestId?: SortOrderInput | SortOrder
    preauthRequestId?: SortOrderInput | SortOrder
    costEstimateId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    policy?: PolicyOrderByWithRelationInput
    payer?: PayerOrderByWithRelationInput
  }

  export type EncounterCoverageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EncounterCoverageWhereInput | EncounterCoverageWhereInput[]
    OR?: EncounterCoverageWhereInput[]
    NOT?: EncounterCoverageWhereInput | EncounterCoverageWhereInput[]
    tenantId?: UuidFilter<"EncounterCoverage"> | string
    encounterId?: UuidFilter<"EncounterCoverage"> | string
    patientId?: UuidFilter<"EncounterCoverage"> | string
    policyId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    payerId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    financialClass?: StringFilter<"EncounterCoverage"> | string
    coverageLevel?: StringFilter<"EncounterCoverage"> | string
    planName?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberId?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberName?: StringNullableFilter<"EncounterCoverage"> | string | null
    networkName?: StringNullableFilter<"EncounterCoverage"> | string | null
    copayAmount?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: JsonNullableFilter<"EncounterCoverage">
    benefitsSnapshot?: JsonNullableFilter<"EncounterCoverage">
    eligibilityRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    preauthRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    costEstimateId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    isActive?: BoolFilter<"EncounterCoverage"> | boolean
    createdAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
    updatedAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
    policy?: XOR<PolicyNullableRelationFilter, PolicyWhereInput> | null
    payer?: XOR<PayerNullableRelationFilter, PayerWhereInput> | null
  }, "id">

  export type EncounterCoverageOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    encounterId?: SortOrder
    patientId?: SortOrder
    policyId?: SortOrderInput | SortOrder
    payerId?: SortOrderInput | SortOrder
    financialClass?: SortOrder
    coverageLevel?: SortOrder
    planName?: SortOrderInput | SortOrder
    memberId?: SortOrderInput | SortOrder
    memberName?: SortOrderInput | SortOrder
    networkName?: SortOrderInput | SortOrder
    copayAmount?: SortOrderInput | SortOrder
    coinsurancePct?: SortOrderInput | SortOrder
    deductibleSnapshot?: SortOrderInput | SortOrder
    benefitsSnapshot?: SortOrderInput | SortOrder
    eligibilityRequestId?: SortOrderInput | SortOrder
    preauthRequestId?: SortOrderInput | SortOrder
    costEstimateId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EncounterCoverageCountOrderByAggregateInput
    _avg?: EncounterCoverageAvgOrderByAggregateInput
    _max?: EncounterCoverageMaxOrderByAggregateInput
    _min?: EncounterCoverageMinOrderByAggregateInput
    _sum?: EncounterCoverageSumOrderByAggregateInput
  }

  export type EncounterCoverageScalarWhereWithAggregatesInput = {
    AND?: EncounterCoverageScalarWhereWithAggregatesInput | EncounterCoverageScalarWhereWithAggregatesInput[]
    OR?: EncounterCoverageScalarWhereWithAggregatesInput[]
    NOT?: EncounterCoverageScalarWhereWithAggregatesInput | EncounterCoverageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EncounterCoverage"> | string
    tenantId?: UuidWithAggregatesFilter<"EncounterCoverage"> | string
    encounterId?: UuidWithAggregatesFilter<"EncounterCoverage"> | string
    patientId?: UuidWithAggregatesFilter<"EncounterCoverage"> | string
    policyId?: UuidNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    payerId?: UuidNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    financialClass?: StringWithAggregatesFilter<"EncounterCoverage"> | string
    coverageLevel?: StringWithAggregatesFilter<"EncounterCoverage"> | string
    planName?: StringNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    memberId?: StringNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    memberName?: StringNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    networkName?: StringNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    copayAmount?: DecimalNullableWithAggregatesFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: DecimalNullableWithAggregatesFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: JsonNullableWithAggregatesFilter<"EncounterCoverage">
    benefitsSnapshot?: JsonNullableWithAggregatesFilter<"EncounterCoverage">
    eligibilityRequestId?: UuidNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    preauthRequestId?: UuidNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    costEstimateId?: UuidNullableWithAggregatesFilter<"EncounterCoverage"> | string | null
    isActive?: BoolWithAggregatesFilter<"EncounterCoverage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"EncounterCoverage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EncounterCoverage"> | Date | string
  }

  export type BillingItemWhereInput = {
    AND?: BillingItemWhereInput | BillingItemWhereInput[]
    OR?: BillingItemWhereInput[]
    NOT?: BillingItemWhereInput | BillingItemWhereInput[]
    id?: UuidFilter<"BillingItem"> | string
    tenantId?: UuidNullableFilter<"BillingItem"> | string | null
    itemType?: StringFilter<"BillingItem"> | string
    clinicalRefId?: UuidNullableFilter<"BillingItem"> | string | null
    billingCode?: StringFilter<"BillingItem"> | string
    billingCodeType?: StringFilter<"BillingItem"> | string
    billingDescription?: StringFilter<"BillingItem"> | string
    chargeType?: StringFilter<"BillingItem"> | string
    defaultUnit?: StringFilter<"BillingItem"> | string
    listPrice?: DecimalNullableFilter<"BillingItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"BillingItem"> | boolean
    createdAt?: DateTimeFilter<"BillingItem"> | Date | string
    updatedAt?: DateTimeFilter<"BillingItem"> | Date | string
    charges?: ChargeListRelationFilter
  }

  export type BillingItemOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    itemType?: SortOrder
    clinicalRefId?: SortOrderInput | SortOrder
    billingCode?: SortOrder
    billingCodeType?: SortOrder
    billingDescription?: SortOrder
    chargeType?: SortOrder
    defaultUnit?: SortOrder
    listPrice?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    charges?: ChargeOrderByRelationAggregateInput
  }

  export type BillingItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_billingCodeType_billingCode?: BillingItemTenantIdBillingCodeTypeBillingCodeCompoundUniqueInput
    AND?: BillingItemWhereInput | BillingItemWhereInput[]
    OR?: BillingItemWhereInput[]
    NOT?: BillingItemWhereInput | BillingItemWhereInput[]
    tenantId?: UuidNullableFilter<"BillingItem"> | string | null
    itemType?: StringFilter<"BillingItem"> | string
    clinicalRefId?: UuidNullableFilter<"BillingItem"> | string | null
    billingCode?: StringFilter<"BillingItem"> | string
    billingCodeType?: StringFilter<"BillingItem"> | string
    billingDescription?: StringFilter<"BillingItem"> | string
    chargeType?: StringFilter<"BillingItem"> | string
    defaultUnit?: StringFilter<"BillingItem"> | string
    listPrice?: DecimalNullableFilter<"BillingItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"BillingItem"> | boolean
    createdAt?: DateTimeFilter<"BillingItem"> | Date | string
    updatedAt?: DateTimeFilter<"BillingItem"> | Date | string
    charges?: ChargeListRelationFilter
  }, "id" | "tenantId_billingCodeType_billingCode">

  export type BillingItemOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    itemType?: SortOrder
    clinicalRefId?: SortOrderInput | SortOrder
    billingCode?: SortOrder
    billingCodeType?: SortOrder
    billingDescription?: SortOrder
    chargeType?: SortOrder
    defaultUnit?: SortOrder
    listPrice?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BillingItemCountOrderByAggregateInput
    _avg?: BillingItemAvgOrderByAggregateInput
    _max?: BillingItemMaxOrderByAggregateInput
    _min?: BillingItemMinOrderByAggregateInput
    _sum?: BillingItemSumOrderByAggregateInput
  }

  export type BillingItemScalarWhereWithAggregatesInput = {
    AND?: BillingItemScalarWhereWithAggregatesInput | BillingItemScalarWhereWithAggregatesInput[]
    OR?: BillingItemScalarWhereWithAggregatesInput[]
    NOT?: BillingItemScalarWhereWithAggregatesInput | BillingItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"BillingItem"> | string
    tenantId?: UuidNullableWithAggregatesFilter<"BillingItem"> | string | null
    itemType?: StringWithAggregatesFilter<"BillingItem"> | string
    clinicalRefId?: UuidNullableWithAggregatesFilter<"BillingItem"> | string | null
    billingCode?: StringWithAggregatesFilter<"BillingItem"> | string
    billingCodeType?: StringWithAggregatesFilter<"BillingItem"> | string
    billingDescription?: StringWithAggregatesFilter<"BillingItem"> | string
    chargeType?: StringWithAggregatesFilter<"BillingItem"> | string
    defaultUnit?: StringWithAggregatesFilter<"BillingItem"> | string
    listPrice?: DecimalNullableWithAggregatesFilter<"BillingItem"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolWithAggregatesFilter<"BillingItem"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"BillingItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BillingItem"> | Date | string
  }

  export type ChargeWhereInput = {
    AND?: ChargeWhereInput | ChargeWhereInput[]
    OR?: ChargeWhereInput[]
    NOT?: ChargeWhereInput | ChargeWhereInput[]
    id?: UuidFilter<"Charge"> | string
    tenantId?: UuidFilter<"Charge"> | string
    patientId?: UuidFilter<"Charge"> | string
    encounterId?: UuidNullableFilter<"Charge"> | string | null
    billingItemId?: UuidFilter<"Charge"> | string
    chargeDate?: DateTimeFilter<"Charge"> | Date | string
    quantity?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    patientResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Charge"> | string
    sourceType?: StringNullableFilter<"Charge"> | string | null
    sourceId?: UuidNullableFilter<"Charge"> | string | null
    notes?: StringNullableFilter<"Charge"> | string | null
    createdAt?: DateTimeFilter<"Charge"> | Date | string
    updatedAt?: DateTimeFilter<"Charge"> | Date | string
    billingItem?: XOR<BillingItemRelationFilter, BillingItemWhereInput>
    invoiceLines?: InvoiceLineListRelationFilter
  }

  export type ChargeOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    billingItemId?: SortOrder
    chargeDate?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrderInput | SortOrder
    payerResponsibility?: SortOrderInput | SortOrder
    status?: SortOrder
    sourceType?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    billingItem?: BillingItemOrderByWithRelationInput
    invoiceLines?: InvoiceLineOrderByRelationAggregateInput
  }

  export type ChargeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChargeWhereInput | ChargeWhereInput[]
    OR?: ChargeWhereInput[]
    NOT?: ChargeWhereInput | ChargeWhereInput[]
    tenantId?: UuidFilter<"Charge"> | string
    patientId?: UuidFilter<"Charge"> | string
    encounterId?: UuidNullableFilter<"Charge"> | string | null
    billingItemId?: UuidFilter<"Charge"> | string
    chargeDate?: DateTimeFilter<"Charge"> | Date | string
    quantity?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    patientResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Charge"> | string
    sourceType?: StringNullableFilter<"Charge"> | string | null
    sourceId?: UuidNullableFilter<"Charge"> | string | null
    notes?: StringNullableFilter<"Charge"> | string | null
    createdAt?: DateTimeFilter<"Charge"> | Date | string
    updatedAt?: DateTimeFilter<"Charge"> | Date | string
    billingItem?: XOR<BillingItemRelationFilter, BillingItemWhereInput>
    invoiceLines?: InvoiceLineListRelationFilter
  }, "id">

  export type ChargeOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    billingItemId?: SortOrder
    chargeDate?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrderInput | SortOrder
    payerResponsibility?: SortOrderInput | SortOrder
    status?: SortOrder
    sourceType?: SortOrderInput | SortOrder
    sourceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChargeCountOrderByAggregateInput
    _avg?: ChargeAvgOrderByAggregateInput
    _max?: ChargeMaxOrderByAggregateInput
    _min?: ChargeMinOrderByAggregateInput
    _sum?: ChargeSumOrderByAggregateInput
  }

  export type ChargeScalarWhereWithAggregatesInput = {
    AND?: ChargeScalarWhereWithAggregatesInput | ChargeScalarWhereWithAggregatesInput[]
    OR?: ChargeScalarWhereWithAggregatesInput[]
    NOT?: ChargeScalarWhereWithAggregatesInput | ChargeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Charge"> | string
    tenantId?: UuidWithAggregatesFilter<"Charge"> | string
    patientId?: UuidWithAggregatesFilter<"Charge"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"Charge"> | string | null
    billingItemId?: UuidWithAggregatesFilter<"Charge"> | string
    chargeDate?: DateTimeWithAggregatesFilter<"Charge"> | Date | string
    quantity?: DecimalWithAggregatesFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalWithAggregatesFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalWithAggregatesFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    patientResponsibility?: DecimalNullableWithAggregatesFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: DecimalNullableWithAggregatesFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    status?: StringWithAggregatesFilter<"Charge"> | string
    sourceType?: StringNullableWithAggregatesFilter<"Charge"> | string | null
    sourceId?: UuidNullableWithAggregatesFilter<"Charge"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Charge"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Charge"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Charge"> | Date | string
  }

  export type InvoiceWhereInput = {
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    id?: UuidFilter<"Invoice"> | string
    tenantId?: UuidFilter<"Invoice"> | string
    patientId?: UuidFilter<"Invoice"> | string
    encounterId?: UuidNullableFilter<"Invoice"> | string | null
    mrn?: StringNullableFilter<"Invoice"> | string | null
    patientDisplayName?: StringNullableFilter<"Invoice"> | string | null
    invoiceNumber?: StringFilter<"Invoice"> | string
    invoiceDate?: DateTimeFilter<"Invoice"> | Date | string
    dueDate?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    grossAmount?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Invoice"> | string
    currency?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    invoiceLines?: InvoiceLineListRelationFilter
    receiptAllocations?: ReceiptAllocationListRelationFilter
  }

  export type InvoiceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    mrn?: SortOrderInput | SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
    status?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoiceLines?: InvoiceLineOrderByRelationAggregateInput
    receiptAllocations?: ReceiptAllocationOrderByRelationAggregateInput
  }

  export type InvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_invoiceNumber?: InvoiceTenantIdInvoiceNumberCompoundUniqueInput
    AND?: InvoiceWhereInput | InvoiceWhereInput[]
    OR?: InvoiceWhereInput[]
    NOT?: InvoiceWhereInput | InvoiceWhereInput[]
    tenantId?: UuidFilter<"Invoice"> | string
    patientId?: UuidFilter<"Invoice"> | string
    encounterId?: UuidNullableFilter<"Invoice"> | string | null
    mrn?: StringNullableFilter<"Invoice"> | string | null
    patientDisplayName?: StringNullableFilter<"Invoice"> | string | null
    invoiceNumber?: StringFilter<"Invoice"> | string
    invoiceDate?: DateTimeFilter<"Invoice"> | Date | string
    dueDate?: DateTimeNullableFilter<"Invoice"> | Date | string | null
    grossAmount?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"Invoice"> | string
    currency?: StringFilter<"Invoice"> | string
    createdAt?: DateTimeFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeFilter<"Invoice"> | Date | string
    invoiceLines?: InvoiceLineListRelationFilter
    receiptAllocations?: ReceiptAllocationListRelationFilter
  }, "id" | "tenantId_invoiceNumber">

  export type InvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    mrn?: SortOrderInput | SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    invoiceNumber?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
    status?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceCountOrderByAggregateInput
    _avg?: InvoiceAvgOrderByAggregateInput
    _max?: InvoiceMaxOrderByAggregateInput
    _min?: InvoiceMinOrderByAggregateInput
    _sum?: InvoiceSumOrderByAggregateInput
  }

  export type InvoiceScalarWhereWithAggregatesInput = {
    AND?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    OR?: InvoiceScalarWhereWithAggregatesInput[]
    NOT?: InvoiceScalarWhereWithAggregatesInput | InvoiceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Invoice"> | string
    tenantId?: UuidWithAggregatesFilter<"Invoice"> | string
    patientId?: UuidWithAggregatesFilter<"Invoice"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"Invoice"> | string | null
    mrn?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    patientDisplayName?: StringNullableWithAggregatesFilter<"Invoice"> | string | null
    invoiceNumber?: StringWithAggregatesFilter<"Invoice"> | string
    invoiceDate?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"Invoice"> | Date | string | null
    grossAmount?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalWithAggregatesFilter<"Invoice"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"Invoice"> | string
    currency?: StringWithAggregatesFilter<"Invoice"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Invoice"> | Date | string
  }

  export type InvoiceLineWhereInput = {
    AND?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    OR?: InvoiceLineWhereInput[]
    NOT?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    id?: UuidFilter<"InvoiceLine"> | string
    invoiceId?: UuidFilter<"InvoiceLine"> | string
    chargeId?: UuidFilter<"InvoiceLine"> | string
    lineNumber?: IntFilter<"InvoiceLine"> | number
    description?: StringNullableFilter<"InvoiceLine"> | string | null
    quantity?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"InvoiceLine"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceLine"> | Date | string
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
    charge?: XOR<ChargeRelationFilter, ChargeWhereInput>
  }

  export type InvoiceLineOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    chargeId?: SortOrder
    lineNumber?: SortOrder
    description?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoice?: InvoiceOrderByWithRelationInput
    charge?: ChargeOrderByWithRelationInput
  }

  export type InvoiceLineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceId_lineNumber?: InvoiceLineInvoiceIdLineNumberCompoundUniqueInput
    AND?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    OR?: InvoiceLineWhereInput[]
    NOT?: InvoiceLineWhereInput | InvoiceLineWhereInput[]
    invoiceId?: UuidFilter<"InvoiceLine"> | string
    chargeId?: UuidFilter<"InvoiceLine"> | string
    lineNumber?: IntFilter<"InvoiceLine"> | number
    description?: StringNullableFilter<"InvoiceLine"> | string | null
    quantity?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"InvoiceLine"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceLine"> | Date | string
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
    charge?: XOR<ChargeRelationFilter, ChargeWhereInput>
  }, "id" | "invoiceId_lineNumber">

  export type InvoiceLineOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    chargeId?: SortOrder
    lineNumber?: SortOrder
    description?: SortOrderInput | SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InvoiceLineCountOrderByAggregateInput
    _avg?: InvoiceLineAvgOrderByAggregateInput
    _max?: InvoiceLineMaxOrderByAggregateInput
    _min?: InvoiceLineMinOrderByAggregateInput
    _sum?: InvoiceLineSumOrderByAggregateInput
  }

  export type InvoiceLineScalarWhereWithAggregatesInput = {
    AND?: InvoiceLineScalarWhereWithAggregatesInput | InvoiceLineScalarWhereWithAggregatesInput[]
    OR?: InvoiceLineScalarWhereWithAggregatesInput[]
    NOT?: InvoiceLineScalarWhereWithAggregatesInput | InvoiceLineScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"InvoiceLine"> | string
    invoiceId?: UuidWithAggregatesFilter<"InvoiceLine"> | string
    chargeId?: UuidWithAggregatesFilter<"InvoiceLine"> | string
    lineNumber?: IntWithAggregatesFilter<"InvoiceLine"> | number
    description?: StringNullableWithAggregatesFilter<"InvoiceLine"> | string | null
    quantity?: DecimalWithAggregatesFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalWithAggregatesFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalWithAggregatesFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalWithAggregatesFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"InvoiceLine"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InvoiceLine"> | Date | string
  }

  export type ReceiptWhereInput = {
    AND?: ReceiptWhereInput | ReceiptWhereInput[]
    OR?: ReceiptWhereInput[]
    NOT?: ReceiptWhereInput | ReceiptWhereInput[]
    id?: UuidFilter<"Receipt"> | string
    tenantId?: UuidFilter<"Receipt"> | string
    patientId?: UuidFilter<"Receipt"> | string
    invoiceId?: UuidNullableFilter<"Receipt"> | string | null
    mrn?: StringNullableFilter<"Receipt"> | string | null
    patientDisplayName?: StringNullableFilter<"Receipt"> | string | null
    receiptNumber?: StringFilter<"Receipt"> | string
    receiptDate?: DateTimeFilter<"Receipt"> | Date | string
    amount?: DecimalFilter<"Receipt"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Receipt"> | string
    paymentMethod?: StringFilter<"Receipt"> | string
    txnReference?: StringNullableFilter<"Receipt"> | string | null
    notes?: StringNullableFilter<"Receipt"> | string | null
    createdAt?: DateTimeFilter<"Receipt"> | Date | string
    updatedAt?: DateTimeFilter<"Receipt"> | Date | string
    allocations?: ReceiptAllocationListRelationFilter
  }

  export type ReceiptOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    mrn?: SortOrderInput | SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    receiptNumber?: SortOrder
    receiptDate?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    txnReference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    allocations?: ReceiptAllocationOrderByRelationAggregateInput
  }

  export type ReceiptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_receiptNumber?: ReceiptTenantIdReceiptNumberCompoundUniqueInput
    AND?: ReceiptWhereInput | ReceiptWhereInput[]
    OR?: ReceiptWhereInput[]
    NOT?: ReceiptWhereInput | ReceiptWhereInput[]
    tenantId?: UuidFilter<"Receipt"> | string
    patientId?: UuidFilter<"Receipt"> | string
    invoiceId?: UuidNullableFilter<"Receipt"> | string | null
    mrn?: StringNullableFilter<"Receipt"> | string | null
    patientDisplayName?: StringNullableFilter<"Receipt"> | string | null
    receiptNumber?: StringFilter<"Receipt"> | string
    receiptDate?: DateTimeFilter<"Receipt"> | Date | string
    amount?: DecimalFilter<"Receipt"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Receipt"> | string
    paymentMethod?: StringFilter<"Receipt"> | string
    txnReference?: StringNullableFilter<"Receipt"> | string | null
    notes?: StringNullableFilter<"Receipt"> | string | null
    createdAt?: DateTimeFilter<"Receipt"> | Date | string
    updatedAt?: DateTimeFilter<"Receipt"> | Date | string
    allocations?: ReceiptAllocationListRelationFilter
  }, "id" | "tenantId_receiptNumber">

  export type ReceiptOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    mrn?: SortOrderInput | SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    receiptNumber?: SortOrder
    receiptDate?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    txnReference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReceiptCountOrderByAggregateInput
    _avg?: ReceiptAvgOrderByAggregateInput
    _max?: ReceiptMaxOrderByAggregateInput
    _min?: ReceiptMinOrderByAggregateInput
    _sum?: ReceiptSumOrderByAggregateInput
  }

  export type ReceiptScalarWhereWithAggregatesInput = {
    AND?: ReceiptScalarWhereWithAggregatesInput | ReceiptScalarWhereWithAggregatesInput[]
    OR?: ReceiptScalarWhereWithAggregatesInput[]
    NOT?: ReceiptScalarWhereWithAggregatesInput | ReceiptScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Receipt"> | string
    tenantId?: UuidWithAggregatesFilter<"Receipt"> | string
    patientId?: UuidWithAggregatesFilter<"Receipt"> | string
    invoiceId?: UuidNullableWithAggregatesFilter<"Receipt"> | string | null
    mrn?: StringNullableWithAggregatesFilter<"Receipt"> | string | null
    patientDisplayName?: StringNullableWithAggregatesFilter<"Receipt"> | string | null
    receiptNumber?: StringWithAggregatesFilter<"Receipt"> | string
    receiptDate?: DateTimeWithAggregatesFilter<"Receipt"> | Date | string
    amount?: DecimalWithAggregatesFilter<"Receipt"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Receipt"> | string
    paymentMethod?: StringWithAggregatesFilter<"Receipt"> | string
    txnReference?: StringNullableWithAggregatesFilter<"Receipt"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Receipt"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Receipt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Receipt"> | Date | string
  }

  export type ReceiptAllocationWhereInput = {
    AND?: ReceiptAllocationWhereInput | ReceiptAllocationWhereInput[]
    OR?: ReceiptAllocationWhereInput[]
    NOT?: ReceiptAllocationWhereInput | ReceiptAllocationWhereInput[]
    id?: UuidFilter<"ReceiptAllocation"> | string
    receiptId?: UuidFilter<"ReceiptAllocation"> | string
    invoiceId?: UuidFilter<"ReceiptAllocation"> | string
    allocatedAmount?: DecimalFilter<"ReceiptAllocation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReceiptAllocation"> | Date | string
    receipt?: XOR<ReceiptRelationFilter, ReceiptWhereInput>
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
  }

  export type ReceiptAllocationOrderByWithRelationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    invoiceId?: SortOrder
    allocatedAmount?: SortOrder
    createdAt?: SortOrder
    receipt?: ReceiptOrderByWithRelationInput
    invoice?: InvoiceOrderByWithRelationInput
  }

  export type ReceiptAllocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptId_invoiceId?: ReceiptAllocationReceiptIdInvoiceIdCompoundUniqueInput
    AND?: ReceiptAllocationWhereInput | ReceiptAllocationWhereInput[]
    OR?: ReceiptAllocationWhereInput[]
    NOT?: ReceiptAllocationWhereInput | ReceiptAllocationWhereInput[]
    receiptId?: UuidFilter<"ReceiptAllocation"> | string
    invoiceId?: UuidFilter<"ReceiptAllocation"> | string
    allocatedAmount?: DecimalFilter<"ReceiptAllocation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReceiptAllocation"> | Date | string
    receipt?: XOR<ReceiptRelationFilter, ReceiptWhereInput>
    invoice?: XOR<InvoiceRelationFilter, InvoiceWhereInput>
  }, "id" | "receiptId_invoiceId">

  export type ReceiptAllocationOrderByWithAggregationInput = {
    id?: SortOrder
    receiptId?: SortOrder
    invoiceId?: SortOrder
    allocatedAmount?: SortOrder
    createdAt?: SortOrder
    _count?: ReceiptAllocationCountOrderByAggregateInput
    _avg?: ReceiptAllocationAvgOrderByAggregateInput
    _max?: ReceiptAllocationMaxOrderByAggregateInput
    _min?: ReceiptAllocationMinOrderByAggregateInput
    _sum?: ReceiptAllocationSumOrderByAggregateInput
  }

  export type ReceiptAllocationScalarWhereWithAggregatesInput = {
    AND?: ReceiptAllocationScalarWhereWithAggregatesInput | ReceiptAllocationScalarWhereWithAggregatesInput[]
    OR?: ReceiptAllocationScalarWhereWithAggregatesInput[]
    NOT?: ReceiptAllocationScalarWhereWithAggregatesInput | ReceiptAllocationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ReceiptAllocation"> | string
    receiptId?: UuidWithAggregatesFilter<"ReceiptAllocation"> | string
    invoiceId?: UuidWithAggregatesFilter<"ReceiptAllocation"> | string
    allocatedAmount?: DecimalWithAggregatesFilter<"ReceiptAllocation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"ReceiptAllocation"> | Date | string
  }

  export type ChargePostingRuleWhereInput = {
    AND?: ChargePostingRuleWhereInput | ChargePostingRuleWhereInput[]
    OR?: ChargePostingRuleWhereInput[]
    NOT?: ChargePostingRuleWhereInput | ChargePostingRuleWhereInput[]
    id?: UuidFilter<"ChargePostingRule"> | string
    tenantId?: UuidFilter<"ChargePostingRule"> | string
    ruleName?: StringFilter<"ChargePostingRule"> | string
    eventType?: StringFilter<"ChargePostingRule"> | string
    eventSource?: StringFilter<"ChargePostingRule"> | string
    billingItemType?: StringFilter<"ChargePostingRule"> | string
    billingItemId?: UuidNullableFilter<"ChargePostingRule"> | string | null
    conditions?: JsonNullableFilter<"ChargePostingRule">
    chargeCalculationMethod?: StringFilter<"ChargePostingRule"> | string
    basePrice?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFilter<"ChargePostingRule"> | string
    quantitySource?: StringFilter<"ChargePostingRule"> | string
    discountPercentage?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"ChargePostingRule"> | boolean
    priority?: IntFilter<"ChargePostingRule"> | number
    autoApprove?: BoolFilter<"ChargePostingRule"> | boolean
    description?: StringNullableFilter<"ChargePostingRule"> | string | null
    configuration?: JsonNullableFilter<"ChargePostingRule">
    createdAt?: DateTimeFilter<"ChargePostingRule"> | Date | string
    updatedAt?: DateTimeFilter<"ChargePostingRule"> | Date | string
    createdBy?: UuidNullableFilter<"ChargePostingRule"> | string | null
    updatedBy?: UuidNullableFilter<"ChargePostingRule"> | string | null
    auditRecords?: ChargePostingAuditListRelationFilter
  }

  export type ChargePostingRuleOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleName?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    billingItemType?: SortOrder
    billingItemId?: SortOrderInput | SortOrder
    conditions?: SortOrderInput | SortOrder
    chargeCalculationMethod?: SortOrder
    basePrice?: SortOrderInput | SortOrder
    priceSource?: SortOrder
    quantitySource?: SortOrder
    discountPercentage?: SortOrderInput | SortOrder
    taxPercentage?: SortOrderInput | SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    autoApprove?: SortOrder
    description?: SortOrderInput | SortOrder
    configuration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    auditRecords?: ChargePostingAuditOrderByRelationAggregateInput
  }

  export type ChargePostingRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChargePostingRuleWhereInput | ChargePostingRuleWhereInput[]
    OR?: ChargePostingRuleWhereInput[]
    NOT?: ChargePostingRuleWhereInput | ChargePostingRuleWhereInput[]
    tenantId?: UuidFilter<"ChargePostingRule"> | string
    ruleName?: StringFilter<"ChargePostingRule"> | string
    eventType?: StringFilter<"ChargePostingRule"> | string
    eventSource?: StringFilter<"ChargePostingRule"> | string
    billingItemType?: StringFilter<"ChargePostingRule"> | string
    billingItemId?: UuidNullableFilter<"ChargePostingRule"> | string | null
    conditions?: JsonNullableFilter<"ChargePostingRule">
    chargeCalculationMethod?: StringFilter<"ChargePostingRule"> | string
    basePrice?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFilter<"ChargePostingRule"> | string
    quantitySource?: StringFilter<"ChargePostingRule"> | string
    discountPercentage?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: DecimalNullableFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFilter<"ChargePostingRule"> | boolean
    priority?: IntFilter<"ChargePostingRule"> | number
    autoApprove?: BoolFilter<"ChargePostingRule"> | boolean
    description?: StringNullableFilter<"ChargePostingRule"> | string | null
    configuration?: JsonNullableFilter<"ChargePostingRule">
    createdAt?: DateTimeFilter<"ChargePostingRule"> | Date | string
    updatedAt?: DateTimeFilter<"ChargePostingRule"> | Date | string
    createdBy?: UuidNullableFilter<"ChargePostingRule"> | string | null
    updatedBy?: UuidNullableFilter<"ChargePostingRule"> | string | null
    auditRecords?: ChargePostingAuditListRelationFilter
  }, "id">

  export type ChargePostingRuleOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleName?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    billingItemType?: SortOrder
    billingItemId?: SortOrderInput | SortOrder
    conditions?: SortOrderInput | SortOrder
    chargeCalculationMethod?: SortOrder
    basePrice?: SortOrderInput | SortOrder
    priceSource?: SortOrder
    quantitySource?: SortOrder
    discountPercentage?: SortOrderInput | SortOrder
    taxPercentage?: SortOrderInput | SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    autoApprove?: SortOrder
    description?: SortOrderInput | SortOrder
    configuration?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: ChargePostingRuleCountOrderByAggregateInput
    _avg?: ChargePostingRuleAvgOrderByAggregateInput
    _max?: ChargePostingRuleMaxOrderByAggregateInput
    _min?: ChargePostingRuleMinOrderByAggregateInput
    _sum?: ChargePostingRuleSumOrderByAggregateInput
  }

  export type ChargePostingRuleScalarWhereWithAggregatesInput = {
    AND?: ChargePostingRuleScalarWhereWithAggregatesInput | ChargePostingRuleScalarWhereWithAggregatesInput[]
    OR?: ChargePostingRuleScalarWhereWithAggregatesInput[]
    NOT?: ChargePostingRuleScalarWhereWithAggregatesInput | ChargePostingRuleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChargePostingRule"> | string
    tenantId?: UuidWithAggregatesFilter<"ChargePostingRule"> | string
    ruleName?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    eventType?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    eventSource?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    billingItemType?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    billingItemId?: UuidNullableWithAggregatesFilter<"ChargePostingRule"> | string | null
    conditions?: JsonNullableWithAggregatesFilter<"ChargePostingRule">
    chargeCalculationMethod?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    basePrice?: DecimalNullableWithAggregatesFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    quantitySource?: StringWithAggregatesFilter<"ChargePostingRule"> | string
    discountPercentage?: DecimalNullableWithAggregatesFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: DecimalNullableWithAggregatesFilter<"ChargePostingRule"> | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolWithAggregatesFilter<"ChargePostingRule"> | boolean
    priority?: IntWithAggregatesFilter<"ChargePostingRule"> | number
    autoApprove?: BoolWithAggregatesFilter<"ChargePostingRule"> | boolean
    description?: StringNullableWithAggregatesFilter<"ChargePostingRule"> | string | null
    configuration?: JsonNullableWithAggregatesFilter<"ChargePostingRule">
    createdAt?: DateTimeWithAggregatesFilter<"ChargePostingRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChargePostingRule"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"ChargePostingRule"> | string | null
    updatedBy?: UuidNullableWithAggregatesFilter<"ChargePostingRule"> | string | null
  }

  export type ChargePostingEventWhereInput = {
    AND?: ChargePostingEventWhereInput | ChargePostingEventWhereInput[]
    OR?: ChargePostingEventWhereInput[]
    NOT?: ChargePostingEventWhereInput | ChargePostingEventWhereInput[]
    id?: UuidFilter<"ChargePostingEvent"> | string
    tenantId?: UuidFilter<"ChargePostingEvent"> | string
    eventType?: StringFilter<"ChargePostingEvent"> | string
    eventSource?: StringFilter<"ChargePostingEvent"> | string
    eventId?: UuidFilter<"ChargePostingEvent"> | string
    eventData?: JsonFilter<"ChargePostingEvent">
    patientId?: UuidFilter<"ChargePostingEvent"> | string
    encounterId?: UuidNullableFilter<"ChargePostingEvent"> | string | null
    processed?: BoolFilter<"ChargePostingEvent"> | boolean
    processedAt?: DateTimeNullableFilter<"ChargePostingEvent"> | Date | string | null
    rulesMatched?: IntFilter<"ChargePostingEvent"> | number
    chargesCreated?: IntFilter<"ChargePostingEvent"> | number
    error?: StringNullableFilter<"ChargePostingEvent"> | string | null
    createdAt?: DateTimeFilter<"ChargePostingEvent"> | Date | string
    auditRecords?: ChargePostingAuditListRelationFilter
  }

  export type ChargePostingEventOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    eventId?: SortOrder
    eventData?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    auditRecords?: ChargePostingAuditOrderByRelationAggregateInput
  }

  export type ChargePostingEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChargePostingEventWhereInput | ChargePostingEventWhereInput[]
    OR?: ChargePostingEventWhereInput[]
    NOT?: ChargePostingEventWhereInput | ChargePostingEventWhereInput[]
    tenantId?: UuidFilter<"ChargePostingEvent"> | string
    eventType?: StringFilter<"ChargePostingEvent"> | string
    eventSource?: StringFilter<"ChargePostingEvent"> | string
    eventId?: UuidFilter<"ChargePostingEvent"> | string
    eventData?: JsonFilter<"ChargePostingEvent">
    patientId?: UuidFilter<"ChargePostingEvent"> | string
    encounterId?: UuidNullableFilter<"ChargePostingEvent"> | string | null
    processed?: BoolFilter<"ChargePostingEvent"> | boolean
    processedAt?: DateTimeNullableFilter<"ChargePostingEvent"> | Date | string | null
    rulesMatched?: IntFilter<"ChargePostingEvent"> | number
    chargesCreated?: IntFilter<"ChargePostingEvent"> | number
    error?: StringNullableFilter<"ChargePostingEvent"> | string | null
    createdAt?: DateTimeFilter<"ChargePostingEvent"> | Date | string
    auditRecords?: ChargePostingAuditListRelationFilter
  }, "id">

  export type ChargePostingEventOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    eventId?: SortOrder
    eventData?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChargePostingEventCountOrderByAggregateInput
    _avg?: ChargePostingEventAvgOrderByAggregateInput
    _max?: ChargePostingEventMaxOrderByAggregateInput
    _min?: ChargePostingEventMinOrderByAggregateInput
    _sum?: ChargePostingEventSumOrderByAggregateInput
  }

  export type ChargePostingEventScalarWhereWithAggregatesInput = {
    AND?: ChargePostingEventScalarWhereWithAggregatesInput | ChargePostingEventScalarWhereWithAggregatesInput[]
    OR?: ChargePostingEventScalarWhereWithAggregatesInput[]
    NOT?: ChargePostingEventScalarWhereWithAggregatesInput | ChargePostingEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChargePostingEvent"> | string
    tenantId?: UuidWithAggregatesFilter<"ChargePostingEvent"> | string
    eventType?: StringWithAggregatesFilter<"ChargePostingEvent"> | string
    eventSource?: StringWithAggregatesFilter<"ChargePostingEvent"> | string
    eventId?: UuidWithAggregatesFilter<"ChargePostingEvent"> | string
    eventData?: JsonWithAggregatesFilter<"ChargePostingEvent">
    patientId?: UuidWithAggregatesFilter<"ChargePostingEvent"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"ChargePostingEvent"> | string | null
    processed?: BoolWithAggregatesFilter<"ChargePostingEvent"> | boolean
    processedAt?: DateTimeNullableWithAggregatesFilter<"ChargePostingEvent"> | Date | string | null
    rulesMatched?: IntWithAggregatesFilter<"ChargePostingEvent"> | number
    chargesCreated?: IntWithAggregatesFilter<"ChargePostingEvent"> | number
    error?: StringNullableWithAggregatesFilter<"ChargePostingEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChargePostingEvent"> | Date | string
  }

  export type ChargePostingAuditWhereInput = {
    AND?: ChargePostingAuditWhereInput | ChargePostingAuditWhereInput[]
    OR?: ChargePostingAuditWhereInput[]
    NOT?: ChargePostingAuditWhereInput | ChargePostingAuditWhereInput[]
    id?: UuidFilter<"ChargePostingAudit"> | string
    tenantId?: UuidFilter<"ChargePostingAudit"> | string
    chargeId?: UuidFilter<"ChargePostingAudit"> | string
    eventId?: UuidFilter<"ChargePostingAudit"> | string
    ruleId?: UuidFilter<"ChargePostingAudit"> | string
    conditionsMet?: JsonNullableFilter<"ChargePostingAudit">
    calculationDetails?: JsonNullableFilter<"ChargePostingAudit">
    createdAt?: DateTimeFilter<"ChargePostingAudit"> | Date | string
    event?: XOR<ChargePostingEventRelationFilter, ChargePostingEventWhereInput>
    rule?: XOR<ChargePostingRuleRelationFilter, ChargePostingRuleWhereInput>
  }

  export type ChargePostingAuditOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    chargeId?: SortOrder
    eventId?: SortOrder
    ruleId?: SortOrder
    conditionsMet?: SortOrderInput | SortOrder
    calculationDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    event?: ChargePostingEventOrderByWithRelationInput
    rule?: ChargePostingRuleOrderByWithRelationInput
  }

  export type ChargePostingAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChargePostingAuditWhereInput | ChargePostingAuditWhereInput[]
    OR?: ChargePostingAuditWhereInput[]
    NOT?: ChargePostingAuditWhereInput | ChargePostingAuditWhereInput[]
    tenantId?: UuidFilter<"ChargePostingAudit"> | string
    chargeId?: UuidFilter<"ChargePostingAudit"> | string
    eventId?: UuidFilter<"ChargePostingAudit"> | string
    ruleId?: UuidFilter<"ChargePostingAudit"> | string
    conditionsMet?: JsonNullableFilter<"ChargePostingAudit">
    calculationDetails?: JsonNullableFilter<"ChargePostingAudit">
    createdAt?: DateTimeFilter<"ChargePostingAudit"> | Date | string
    event?: XOR<ChargePostingEventRelationFilter, ChargePostingEventWhereInput>
    rule?: XOR<ChargePostingRuleRelationFilter, ChargePostingRuleWhereInput>
  }, "id">

  export type ChargePostingAuditOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    chargeId?: SortOrder
    eventId?: SortOrder
    ruleId?: SortOrder
    conditionsMet?: SortOrderInput | SortOrder
    calculationDetails?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChargePostingAuditCountOrderByAggregateInput
    _max?: ChargePostingAuditMaxOrderByAggregateInput
    _min?: ChargePostingAuditMinOrderByAggregateInput
  }

  export type ChargePostingAuditScalarWhereWithAggregatesInput = {
    AND?: ChargePostingAuditScalarWhereWithAggregatesInput | ChargePostingAuditScalarWhereWithAggregatesInput[]
    OR?: ChargePostingAuditScalarWhereWithAggregatesInput[]
    NOT?: ChargePostingAuditScalarWhereWithAggregatesInput | ChargePostingAuditScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChargePostingAudit"> | string
    tenantId?: UuidWithAggregatesFilter<"ChargePostingAudit"> | string
    chargeId?: UuidWithAggregatesFilter<"ChargePostingAudit"> | string
    eventId?: UuidWithAggregatesFilter<"ChargePostingAudit"> | string
    ruleId?: UuidWithAggregatesFilter<"ChargePostingAudit"> | string
    conditionsMet?: JsonNullableWithAggregatesFilter<"ChargePostingAudit">
    calculationDetails?: JsonNullableWithAggregatesFilter<"ChargePostingAudit">
    createdAt?: DateTimeWithAggregatesFilter<"ChargePostingAudit"> | Date | string
  }

  export type PayerCreateInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyCreateNestedManyWithoutPayerInput
    claims?: ClaimCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageCreateNestedManyWithoutPayerInput
  }

  export type PayerUncheckedCreateInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyUncheckedCreateNestedManyWithoutPayerInput
    claims?: ClaimUncheckedCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageUncheckedCreateNestedManyWithoutPayerInput
  }

  export type PayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUpdateManyWithoutPayerNestedInput
    claims?: ClaimUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUpdateManyWithoutPayerNestedInput
  }

  export type PayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUncheckedUpdateManyWithoutPayerNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUncheckedUpdateManyWithoutPayerNestedInput
  }

  export type PayerCreateManyInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PolicyCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    payer: PayerCreateNestedOneWithoutPoliciesInput
    encounterCoverages?: EncounterCoverageCreateNestedManyWithoutPolicyInput
  }

  export type PolicyUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    payerId: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    encounterCoverages?: EncounterCoverageUncheckedCreateNestedManyWithoutPolicyInput
  }

  export type PolicyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payer?: PayerUpdateOneRequiredWithoutPoliciesNestedInput
    encounterCoverages?: EncounterCoverageUpdateManyWithoutPolicyNestedInput
  }

  export type PolicyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounterCoverages?: EncounterCoverageUncheckedUpdateManyWithoutPolicyNestedInput
  }

  export type PolicyCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    payerId: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PolicyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PolicyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimCreateInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payer?: PayerCreateNestedOneWithoutClaimsInput
  }

  export type ClaimUncheckedCreateInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    payerId?: string | null
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payer?: PayerUpdateOneWithoutClaimsNestedInput
  }

  export type ClaimUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimCreateManyInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    payerId?: string | null
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageCreateInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    policy?: PolicyCreateNestedOneWithoutEncounterCoveragesInput
    payer?: PayerCreateNestedOneWithoutEncounterCoveragesInput
  }

  export type EncounterCoverageUncheckedCreateInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    policyId?: string | null
    payerId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policy?: PolicyUpdateOneWithoutEncounterCoveragesNestedInput
    payer?: PayerUpdateOneWithoutEncounterCoveragesNestedInput
  }

  export type EncounterCoverageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyId?: NullableStringFieldUpdateOperationsInput | string | null
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageCreateManyInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    policyId?: string | null
    payerId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyId?: NullableStringFieldUpdateOperationsInput | string | null
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingItemCreateInput = {
    id?: string
    tenantId?: string | null
    itemType: string
    clinicalRefId?: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit?: string
    listPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    charges?: ChargeCreateNestedManyWithoutBillingItemInput
  }

  export type BillingItemUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    itemType: string
    clinicalRefId?: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit?: string
    listPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    charges?: ChargeUncheckedCreateNestedManyWithoutBillingItemInput
  }

  export type BillingItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    charges?: ChargeUpdateManyWithoutBillingItemNestedInput
  }

  export type BillingItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    charges?: ChargeUncheckedUpdateManyWithoutBillingItemNestedInput
  }

  export type BillingItemCreateManyInput = {
    id?: string
    tenantId?: string | null
    itemType: string
    clinicalRefId?: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit?: string
    listPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargeCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingItem: BillingItemCreateNestedOneWithoutChargesInput
    invoiceLines?: InvoiceLineCreateNestedManyWithoutChargeInput
  }

  export type ChargeUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    billingItemId: string
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutChargeInput
  }

  export type ChargeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingItem?: BillingItemUpdateOneRequiredWithoutChargesNestedInput
    invoiceLines?: InvoiceLineUpdateManyWithoutChargeNestedInput
  }

  export type ChargeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    billingItemId?: StringFieldUpdateOperationsInput | string
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutChargeNestedInput
  }

  export type ChargeCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    billingItemId: string
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChargeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    billingItemId?: StringFieldUpdateOperationsInput | string
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineCreateNestedManyWithoutInvoiceInput
    receiptAllocations?: ReceiptAllocationCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
    receiptAllocations?: ReceiptAllocationUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUpdateManyWithoutInvoiceNestedInput
    receiptAllocations?: ReceiptAllocationUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
    receiptAllocations?: ReceiptAllocationUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateInput = {
    id?: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice: InvoiceCreateNestedOneWithoutInvoiceLinesInput
    charge: ChargeCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineUncheckedCreateInput = {
    id?: string
    invoiceId: string
    chargeId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: InvoiceUpdateOneRequiredWithoutInvoiceLinesNestedInput
    charge?: ChargeUpdateOneRequiredWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateManyInput = {
    id?: string
    invoiceId: string
    chargeId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    invoiceId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    receiptNumber: string
    receiptDate?: Date | string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    paymentMethod: string
    txnReference?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    allocations?: ReceiptAllocationCreateNestedManyWithoutReceiptInput
  }

  export type ReceiptUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    invoiceId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    receiptNumber: string
    receiptDate?: Date | string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    paymentMethod: string
    txnReference?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    allocations?: ReceiptAllocationUncheckedCreateNestedManyWithoutReceiptInput
  }

  export type ReceiptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    allocations?: ReceiptAllocationUpdateManyWithoutReceiptNestedInput
  }

  export type ReceiptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    allocations?: ReceiptAllocationUncheckedUpdateManyWithoutReceiptNestedInput
  }

  export type ReceiptCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    invoiceId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    receiptNumber: string
    receiptDate?: Date | string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    paymentMethod: string
    txnReference?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReceiptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationCreateInput = {
    id?: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    receipt: ReceiptCreateNestedOneWithoutAllocationsInput
    invoice: InvoiceCreateNestedOneWithoutReceiptAllocationsInput
  }

  export type ReceiptAllocationUncheckedCreateInput = {
    id?: string
    receiptId: string
    invoiceId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReceiptAllocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receipt?: ReceiptUpdateOneRequiredWithoutAllocationsNestedInput
    invoice?: InvoiceUpdateOneRequiredWithoutReceiptAllocationsNestedInput
  }

  export type ReceiptAllocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationCreateManyInput = {
    id?: string
    receiptId: string
    invoiceId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReceiptAllocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingRuleCreateInput = {
    id?: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId?: string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: string
    basePrice?: Decimal | DecimalJsLike | number | string | null
    priceSource?: string
    quantitySource?: string
    discountPercentage?: Decimal | DecimalJsLike | number | string | null
    taxPercentage?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    priority?: number
    autoApprove?: boolean
    description?: string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
    auditRecords?: ChargePostingAuditCreateNestedManyWithoutRuleInput
  }

  export type ChargePostingRuleUncheckedCreateInput = {
    id?: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId?: string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: string
    basePrice?: Decimal | DecimalJsLike | number | string | null
    priceSource?: string
    quantitySource?: string
    discountPercentage?: Decimal | DecimalJsLike | number | string | null
    taxPercentage?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    priority?: number
    autoApprove?: boolean
    description?: string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
    auditRecords?: ChargePostingAuditUncheckedCreateNestedManyWithoutRuleInput
  }

  export type ChargePostingRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditRecords?: ChargePostingAuditUpdateManyWithoutRuleNestedInput
  }

  export type ChargePostingRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    auditRecords?: ChargePostingAuditUncheckedUpdateManyWithoutRuleNestedInput
  }

  export type ChargePostingRuleCreateManyInput = {
    id?: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId?: string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: string
    basePrice?: Decimal | DecimalJsLike | number | string | null
    priceSource?: string
    quantitySource?: string
    discountPercentage?: Decimal | DecimalJsLike | number | string | null
    taxPercentage?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    priority?: number
    autoApprove?: boolean
    description?: string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
  }

  export type ChargePostingRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChargePostingRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChargePostingEventCreateInput = {
    id?: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonNullValueInput | InputJsonValue
    patientId: string
    encounterId?: string | null
    processed?: boolean
    processedAt?: Date | string | null
    rulesMatched?: number
    chargesCreated?: number
    error?: string | null
    createdAt?: Date | string
    auditRecords?: ChargePostingAuditCreateNestedManyWithoutEventInput
  }

  export type ChargePostingEventUncheckedCreateInput = {
    id?: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonNullValueInput | InputJsonValue
    patientId: string
    encounterId?: string | null
    processed?: boolean
    processedAt?: Date | string | null
    rulesMatched?: number
    chargesCreated?: number
    error?: string | null
    createdAt?: Date | string
    auditRecords?: ChargePostingAuditUncheckedCreateNestedManyWithoutEventInput
  }

  export type ChargePostingEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditRecords?: ChargePostingAuditUpdateManyWithoutEventNestedInput
  }

  export type ChargePostingEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditRecords?: ChargePostingAuditUncheckedUpdateManyWithoutEventNestedInput
  }

  export type ChargePostingEventCreateManyInput = {
    id?: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonNullValueInput | InputJsonValue
    patientId: string
    encounterId?: string | null
    processed?: boolean
    processedAt?: Date | string | null
    rulesMatched?: number
    chargesCreated?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type ChargePostingEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditCreateInput = {
    id?: string
    tenantId: string
    chargeId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    event: ChargePostingEventCreateNestedOneWithoutAuditRecordsInput
    rule: ChargePostingRuleCreateNestedOneWithoutAuditRecordsInput
  }

  export type ChargePostingAuditUncheckedCreateInput = {
    id?: string
    tenantId: string
    chargeId: string
    eventId: string
    ruleId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: ChargePostingEventUpdateOneRequiredWithoutAuditRecordsNestedInput
    rule?: ChargePostingRuleUpdateOneRequiredWithoutAuditRecordsNestedInput
  }

  export type ChargePostingAuditUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditCreateManyInput = {
    id?: string
    tenantId: string
    chargeId: string
    eventId: string
    ruleId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PolicyListRelationFilter = {
    every?: PolicyWhereInput
    some?: PolicyWhereInput
    none?: PolicyWhereInput
  }

  export type ClaimListRelationFilter = {
    every?: ClaimWhereInput
    some?: ClaimWhereInput
    none?: ClaimWhereInput
  }

  export type EncounterCoverageListRelationFilter = {
    every?: EncounterCoverageWhereInput
    some?: EncounterCoverageWhereInput
    none?: EncounterCoverageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PolicyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClaimOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EncounterCoverageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PayerCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    payerType?: SortOrder
    contactInfo?: SortOrder
    configuration?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    payerType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PayerMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    payerType?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PayerRelationFilter = {
    is?: PayerWhereInput
    isNot?: PayerWhereInput
  }

  export type PolicyCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    policyNumber?: SortOrder
    groupNumber?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    relationship?: SortOrder
    effectiveDate?: SortOrder
    expirationDate?: SortOrder
    benefits?: SortOrder
    isPrimary?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    policyNumber?: SortOrder
    groupNumber?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    relationship?: SortOrder
    effectiveDate?: SortOrder
    expirationDate?: SortOrder
    isPrimary?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PolicyMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    policyNumber?: SortOrder
    groupNumber?: SortOrder
    payerName?: SortOrder
    payerId?: SortOrder
    relationship?: SortOrder
    effectiveDate?: SortOrder
    expirationDate?: SortOrder
    isPrimary?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type PayerNullableRelationFilter = {
    is?: PayerWhereInput | null
    isNot?: PayerWhereInput | null
  }

  export type ClaimTenantIdClaimNumberCompoundUniqueInput = {
    tenantId: string
    claimNumber: string
  }

  export type ClaimCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    claimNumber?: SortOrder
    status?: SortOrder
    payerId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    serviceDate?: SortOrder
    submittedAt?: SortOrder
    adjudicatedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type ClaimMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    claimNumber?: SortOrder
    status?: SortOrder
    payerId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    serviceDate?: SortOrder
    submittedAt?: SortOrder
    adjudicatedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    claimNumber?: SortOrder
    status?: SortOrder
    payerId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    totalAmount?: SortOrder
    currency?: SortOrder
    serviceDate?: SortOrder
    submittedAt?: SortOrder
    adjudicatedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClaimSumOrderByAggregateInput = {
    totalAmount?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PolicyNullableRelationFilter = {
    is?: PolicyWhereInput | null
    isNot?: PolicyWhereInput | null
  }

  export type EncounterCoverageCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    encounterId?: SortOrder
    patientId?: SortOrder
    policyId?: SortOrder
    payerId?: SortOrder
    financialClass?: SortOrder
    coverageLevel?: SortOrder
    planName?: SortOrder
    memberId?: SortOrder
    memberName?: SortOrder
    networkName?: SortOrder
    copayAmount?: SortOrder
    coinsurancePct?: SortOrder
    deductibleSnapshot?: SortOrder
    benefitsSnapshot?: SortOrder
    eligibilityRequestId?: SortOrder
    preauthRequestId?: SortOrder
    costEstimateId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterCoverageAvgOrderByAggregateInput = {
    copayAmount?: SortOrder
    coinsurancePct?: SortOrder
  }

  export type EncounterCoverageMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    encounterId?: SortOrder
    patientId?: SortOrder
    policyId?: SortOrder
    payerId?: SortOrder
    financialClass?: SortOrder
    coverageLevel?: SortOrder
    planName?: SortOrder
    memberId?: SortOrder
    memberName?: SortOrder
    networkName?: SortOrder
    copayAmount?: SortOrder
    coinsurancePct?: SortOrder
    eligibilityRequestId?: SortOrder
    preauthRequestId?: SortOrder
    costEstimateId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterCoverageMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    encounterId?: SortOrder
    patientId?: SortOrder
    policyId?: SortOrder
    payerId?: SortOrder
    financialClass?: SortOrder
    coverageLevel?: SortOrder
    planName?: SortOrder
    memberId?: SortOrder
    memberName?: SortOrder
    networkName?: SortOrder
    copayAmount?: SortOrder
    coinsurancePct?: SortOrder
    eligibilityRequestId?: SortOrder
    preauthRequestId?: SortOrder
    costEstimateId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterCoverageSumOrderByAggregateInput = {
    copayAmount?: SortOrder
    coinsurancePct?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ChargeListRelationFilter = {
    every?: ChargeWhereInput
    some?: ChargeWhereInput
    none?: ChargeWhereInput
  }

  export type ChargeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingItemTenantIdBillingCodeTypeBillingCodeCompoundUniqueInput = {
    tenantId: string
    billingCodeType: string
    billingCode: string
  }

  export type BillingItemCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    itemType?: SortOrder
    clinicalRefId?: SortOrder
    billingCode?: SortOrder
    billingCodeType?: SortOrder
    billingDescription?: SortOrder
    chargeType?: SortOrder
    defaultUnit?: SortOrder
    listPrice?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingItemAvgOrderByAggregateInput = {
    listPrice?: SortOrder
  }

  export type BillingItemMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    itemType?: SortOrder
    clinicalRefId?: SortOrder
    billingCode?: SortOrder
    billingCodeType?: SortOrder
    billingDescription?: SortOrder
    chargeType?: SortOrder
    defaultUnit?: SortOrder
    listPrice?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingItemMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    itemType?: SortOrder
    clinicalRefId?: SortOrder
    billingCode?: SortOrder
    billingCodeType?: SortOrder
    billingDescription?: SortOrder
    chargeType?: SortOrder
    defaultUnit?: SortOrder
    listPrice?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BillingItemSumOrderByAggregateInput = {
    listPrice?: SortOrder
  }

  export type BillingItemRelationFilter = {
    is?: BillingItemWhereInput
    isNot?: BillingItemWhereInput
  }

  export type InvoiceLineListRelationFilter = {
    every?: InvoiceLineWhereInput
    some?: InvoiceLineWhereInput
    none?: InvoiceLineWhereInput
  }

  export type InvoiceLineOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChargeCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    billingItemId?: SortOrder
    chargeDate?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrder
    payerResponsibility?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChargeAvgOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrder
    payerResponsibility?: SortOrder
  }

  export type ChargeMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    billingItemId?: SortOrder
    chargeDate?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrder
    payerResponsibility?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChargeMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    billingItemId?: SortOrder
    chargeDate?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrder
    payerResponsibility?: SortOrder
    status?: SortOrder
    sourceType?: SortOrder
    sourceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChargeSumOrderByAggregateInput = {
    quantity?: SortOrder
    unitPrice?: SortOrder
    grossAmount?: SortOrder
    patientResponsibility?: SortOrder
    payerResponsibility?: SortOrder
  }

  export type ReceiptAllocationListRelationFilter = {
    every?: ReceiptAllocationWhereInput
    some?: ReceiptAllocationWhereInput
    none?: ReceiptAllocationWhereInput
  }

  export type ReceiptAllocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InvoiceTenantIdInvoiceNumberCompoundUniqueInput = {
    tenantId: string
    invoiceNumber: string
  }

  export type InvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    invoiceNumber?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
    status?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceAvgOrderByAggregateInput = {
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
  }

  export type InvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    invoiceNumber?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
    status?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    invoiceNumber?: SortOrder
    invoiceDate?: SortOrder
    dueDate?: SortOrder
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
    status?: SortOrder
    currency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceSumOrderByAggregateInput = {
    grossAmount?: SortOrder
    totalDiscounts?: SortOrder
    netAmount?: SortOrder
    amountPaid?: SortOrder
    balanceDue?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type InvoiceRelationFilter = {
    is?: InvoiceWhereInput
    isNot?: InvoiceWhereInput
  }

  export type ChargeRelationFilter = {
    is?: ChargeWhereInput
    isNot?: ChargeWhereInput
  }

  export type InvoiceLineInvoiceIdLineNumberCompoundUniqueInput = {
    invoiceId: string
    lineNumber: number
  }

  export type InvoiceLineCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    chargeId?: SortOrder
    lineNumber?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceLineAvgOrderByAggregateInput = {
    lineNumber?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
  }

  export type InvoiceLineMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    chargeId?: SortOrder
    lineNumber?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceLineMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    chargeId?: SortOrder
    lineNumber?: SortOrder
    description?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InvoiceLineSumOrderByAggregateInput = {
    lineNumber?: SortOrder
    quantity?: SortOrder
    unitPrice?: SortOrder
    lineAmount?: SortOrder
    lineDiscount?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ReceiptTenantIdReceiptNumberCompoundUniqueInput = {
    tenantId: string
    receiptNumber: string
  }

  export type ReceiptCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    invoiceId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    receiptNumber?: SortOrder
    receiptDate?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    txnReference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReceiptAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ReceiptMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    invoiceId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    receiptNumber?: SortOrder
    receiptDate?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    txnReference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReceiptMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    invoiceId?: SortOrder
    mrn?: SortOrder
    patientDisplayName?: SortOrder
    receiptNumber?: SortOrder
    receiptDate?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    paymentMethod?: SortOrder
    txnReference?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReceiptSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ReceiptRelationFilter = {
    is?: ReceiptWhereInput
    isNot?: ReceiptWhereInput
  }

  export type ReceiptAllocationReceiptIdInvoiceIdCompoundUniqueInput = {
    receiptId: string
    invoiceId: string
  }

  export type ReceiptAllocationCountOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    invoiceId?: SortOrder
    allocatedAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReceiptAllocationAvgOrderByAggregateInput = {
    allocatedAmount?: SortOrder
  }

  export type ReceiptAllocationMaxOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    invoiceId?: SortOrder
    allocatedAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReceiptAllocationMinOrderByAggregateInput = {
    id?: SortOrder
    receiptId?: SortOrder
    invoiceId?: SortOrder
    allocatedAmount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReceiptAllocationSumOrderByAggregateInput = {
    allocatedAmount?: SortOrder
  }

  export type ChargePostingAuditListRelationFilter = {
    every?: ChargePostingAuditWhereInput
    some?: ChargePostingAuditWhereInput
    none?: ChargePostingAuditWhereInput
  }

  export type ChargePostingAuditOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChargePostingRuleCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleName?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    billingItemType?: SortOrder
    billingItemId?: SortOrder
    conditions?: SortOrder
    chargeCalculationMethod?: SortOrder
    basePrice?: SortOrder
    priceSource?: SortOrder
    quantitySource?: SortOrder
    discountPercentage?: SortOrder
    taxPercentage?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    autoApprove?: SortOrder
    description?: SortOrder
    configuration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type ChargePostingRuleAvgOrderByAggregateInput = {
    basePrice?: SortOrder
    discountPercentage?: SortOrder
    taxPercentage?: SortOrder
    priority?: SortOrder
  }

  export type ChargePostingRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleName?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    billingItemType?: SortOrder
    billingItemId?: SortOrder
    chargeCalculationMethod?: SortOrder
    basePrice?: SortOrder
    priceSource?: SortOrder
    quantitySource?: SortOrder
    discountPercentage?: SortOrder
    taxPercentage?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    autoApprove?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type ChargePostingRuleMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleName?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    billingItemType?: SortOrder
    billingItemId?: SortOrder
    chargeCalculationMethod?: SortOrder
    basePrice?: SortOrder
    priceSource?: SortOrder
    quantitySource?: SortOrder
    discountPercentage?: SortOrder
    taxPercentage?: SortOrder
    isActive?: SortOrder
    priority?: SortOrder
    autoApprove?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type ChargePostingRuleSumOrderByAggregateInput = {
    basePrice?: SortOrder
    discountPercentage?: SortOrder
    taxPercentage?: SortOrder
    priority?: SortOrder
  }

  export type ChargePostingEventCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    eventId?: SortOrder
    eventData?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type ChargePostingEventAvgOrderByAggregateInput = {
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
  }

  export type ChargePostingEventMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    eventId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type ChargePostingEventMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    eventSource?: SortOrder
    eventId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
  }

  export type ChargePostingEventSumOrderByAggregateInput = {
    rulesMatched?: SortOrder
    chargesCreated?: SortOrder
  }

  export type ChargePostingEventRelationFilter = {
    is?: ChargePostingEventWhereInput
    isNot?: ChargePostingEventWhereInput
  }

  export type ChargePostingRuleRelationFilter = {
    is?: ChargePostingRuleWhereInput
    isNot?: ChargePostingRuleWhereInput
  }

  export type ChargePostingAuditCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    chargeId?: SortOrder
    eventId?: SortOrder
    ruleId?: SortOrder
    conditionsMet?: SortOrder
    calculationDetails?: SortOrder
    createdAt?: SortOrder
  }

  export type ChargePostingAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    chargeId?: SortOrder
    eventId?: SortOrder
    ruleId?: SortOrder
    createdAt?: SortOrder
  }

  export type ChargePostingAuditMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    chargeId?: SortOrder
    eventId?: SortOrder
    ruleId?: SortOrder
    createdAt?: SortOrder
  }

  export type PolicyCreateNestedManyWithoutPayerInput = {
    create?: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput> | PolicyCreateWithoutPayerInput[] | PolicyUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: PolicyCreateOrConnectWithoutPayerInput | PolicyCreateOrConnectWithoutPayerInput[]
    createMany?: PolicyCreateManyPayerInputEnvelope
    connect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
  }

  export type ClaimCreateNestedManyWithoutPayerInput = {
    create?: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput> | ClaimCreateWithoutPayerInput[] | ClaimUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutPayerInput | ClaimCreateOrConnectWithoutPayerInput[]
    createMany?: ClaimCreateManyPayerInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type EncounterCoverageCreateNestedManyWithoutPayerInput = {
    create?: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput> | EncounterCoverageCreateWithoutPayerInput[] | EncounterCoverageUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPayerInput | EncounterCoverageCreateOrConnectWithoutPayerInput[]
    createMany?: EncounterCoverageCreateManyPayerInputEnvelope
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
  }

  export type PolicyUncheckedCreateNestedManyWithoutPayerInput = {
    create?: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput> | PolicyCreateWithoutPayerInput[] | PolicyUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: PolicyCreateOrConnectWithoutPayerInput | PolicyCreateOrConnectWithoutPayerInput[]
    createMany?: PolicyCreateManyPayerInputEnvelope
    connect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
  }

  export type ClaimUncheckedCreateNestedManyWithoutPayerInput = {
    create?: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput> | ClaimCreateWithoutPayerInput[] | ClaimUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutPayerInput | ClaimCreateOrConnectWithoutPayerInput[]
    createMany?: ClaimCreateManyPayerInputEnvelope
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
  }

  export type EncounterCoverageUncheckedCreateNestedManyWithoutPayerInput = {
    create?: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput> | EncounterCoverageCreateWithoutPayerInput[] | EncounterCoverageUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPayerInput | EncounterCoverageCreateOrConnectWithoutPayerInput[]
    createMany?: EncounterCoverageCreateManyPayerInputEnvelope
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PolicyUpdateManyWithoutPayerNestedInput = {
    create?: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput> | PolicyCreateWithoutPayerInput[] | PolicyUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: PolicyCreateOrConnectWithoutPayerInput | PolicyCreateOrConnectWithoutPayerInput[]
    upsert?: PolicyUpsertWithWhereUniqueWithoutPayerInput | PolicyUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: PolicyCreateManyPayerInputEnvelope
    set?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    disconnect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    delete?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    connect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    update?: PolicyUpdateWithWhereUniqueWithoutPayerInput | PolicyUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: PolicyUpdateManyWithWhereWithoutPayerInput | PolicyUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: PolicyScalarWhereInput | PolicyScalarWhereInput[]
  }

  export type ClaimUpdateManyWithoutPayerNestedInput = {
    create?: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput> | ClaimCreateWithoutPayerInput[] | ClaimUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutPayerInput | ClaimCreateOrConnectWithoutPayerInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutPayerInput | ClaimUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: ClaimCreateManyPayerInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutPayerInput | ClaimUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutPayerInput | ClaimUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type EncounterCoverageUpdateManyWithoutPayerNestedInput = {
    create?: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput> | EncounterCoverageCreateWithoutPayerInput[] | EncounterCoverageUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPayerInput | EncounterCoverageCreateOrConnectWithoutPayerInput[]
    upsert?: EncounterCoverageUpsertWithWhereUniqueWithoutPayerInput | EncounterCoverageUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: EncounterCoverageCreateManyPayerInputEnvelope
    set?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    disconnect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    delete?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    update?: EncounterCoverageUpdateWithWhereUniqueWithoutPayerInput | EncounterCoverageUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: EncounterCoverageUpdateManyWithWhereWithoutPayerInput | EncounterCoverageUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
  }

  export type PolicyUncheckedUpdateManyWithoutPayerNestedInput = {
    create?: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput> | PolicyCreateWithoutPayerInput[] | PolicyUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: PolicyCreateOrConnectWithoutPayerInput | PolicyCreateOrConnectWithoutPayerInput[]
    upsert?: PolicyUpsertWithWhereUniqueWithoutPayerInput | PolicyUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: PolicyCreateManyPayerInputEnvelope
    set?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    disconnect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    delete?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    connect?: PolicyWhereUniqueInput | PolicyWhereUniqueInput[]
    update?: PolicyUpdateWithWhereUniqueWithoutPayerInput | PolicyUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: PolicyUpdateManyWithWhereWithoutPayerInput | PolicyUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: PolicyScalarWhereInput | PolicyScalarWhereInput[]
  }

  export type ClaimUncheckedUpdateManyWithoutPayerNestedInput = {
    create?: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput> | ClaimCreateWithoutPayerInput[] | ClaimUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: ClaimCreateOrConnectWithoutPayerInput | ClaimCreateOrConnectWithoutPayerInput[]
    upsert?: ClaimUpsertWithWhereUniqueWithoutPayerInput | ClaimUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: ClaimCreateManyPayerInputEnvelope
    set?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    disconnect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    delete?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    connect?: ClaimWhereUniqueInput | ClaimWhereUniqueInput[]
    update?: ClaimUpdateWithWhereUniqueWithoutPayerInput | ClaimUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: ClaimUpdateManyWithWhereWithoutPayerInput | ClaimUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
  }

  export type EncounterCoverageUncheckedUpdateManyWithoutPayerNestedInput = {
    create?: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput> | EncounterCoverageCreateWithoutPayerInput[] | EncounterCoverageUncheckedCreateWithoutPayerInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPayerInput | EncounterCoverageCreateOrConnectWithoutPayerInput[]
    upsert?: EncounterCoverageUpsertWithWhereUniqueWithoutPayerInput | EncounterCoverageUpsertWithWhereUniqueWithoutPayerInput[]
    createMany?: EncounterCoverageCreateManyPayerInputEnvelope
    set?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    disconnect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    delete?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    update?: EncounterCoverageUpdateWithWhereUniqueWithoutPayerInput | EncounterCoverageUpdateWithWhereUniqueWithoutPayerInput[]
    updateMany?: EncounterCoverageUpdateManyWithWhereWithoutPayerInput | EncounterCoverageUpdateManyWithWhereWithoutPayerInput[]
    deleteMany?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
  }

  export type PayerCreateNestedOneWithoutPoliciesInput = {
    create?: XOR<PayerCreateWithoutPoliciesInput, PayerUncheckedCreateWithoutPoliciesInput>
    connectOrCreate?: PayerCreateOrConnectWithoutPoliciesInput
    connect?: PayerWhereUniqueInput
  }

  export type EncounterCoverageCreateNestedManyWithoutPolicyInput = {
    create?: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput> | EncounterCoverageCreateWithoutPolicyInput[] | EncounterCoverageUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPolicyInput | EncounterCoverageCreateOrConnectWithoutPolicyInput[]
    createMany?: EncounterCoverageCreateManyPolicyInputEnvelope
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
  }

  export type EncounterCoverageUncheckedCreateNestedManyWithoutPolicyInput = {
    create?: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput> | EncounterCoverageCreateWithoutPolicyInput[] | EncounterCoverageUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPolicyInput | EncounterCoverageCreateOrConnectWithoutPolicyInput[]
    createMany?: EncounterCoverageCreateManyPolicyInputEnvelope
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PayerUpdateOneRequiredWithoutPoliciesNestedInput = {
    create?: XOR<PayerCreateWithoutPoliciesInput, PayerUncheckedCreateWithoutPoliciesInput>
    connectOrCreate?: PayerCreateOrConnectWithoutPoliciesInput
    upsert?: PayerUpsertWithoutPoliciesInput
    connect?: PayerWhereUniqueInput
    update?: XOR<XOR<PayerUpdateToOneWithWhereWithoutPoliciesInput, PayerUpdateWithoutPoliciesInput>, PayerUncheckedUpdateWithoutPoliciesInput>
  }

  export type EncounterCoverageUpdateManyWithoutPolicyNestedInput = {
    create?: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput> | EncounterCoverageCreateWithoutPolicyInput[] | EncounterCoverageUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPolicyInput | EncounterCoverageCreateOrConnectWithoutPolicyInput[]
    upsert?: EncounterCoverageUpsertWithWhereUniqueWithoutPolicyInput | EncounterCoverageUpsertWithWhereUniqueWithoutPolicyInput[]
    createMany?: EncounterCoverageCreateManyPolicyInputEnvelope
    set?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    disconnect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    delete?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    update?: EncounterCoverageUpdateWithWhereUniqueWithoutPolicyInput | EncounterCoverageUpdateWithWhereUniqueWithoutPolicyInput[]
    updateMany?: EncounterCoverageUpdateManyWithWhereWithoutPolicyInput | EncounterCoverageUpdateManyWithWhereWithoutPolicyInput[]
    deleteMany?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
  }

  export type EncounterCoverageUncheckedUpdateManyWithoutPolicyNestedInput = {
    create?: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput> | EncounterCoverageCreateWithoutPolicyInput[] | EncounterCoverageUncheckedCreateWithoutPolicyInput[]
    connectOrCreate?: EncounterCoverageCreateOrConnectWithoutPolicyInput | EncounterCoverageCreateOrConnectWithoutPolicyInput[]
    upsert?: EncounterCoverageUpsertWithWhereUniqueWithoutPolicyInput | EncounterCoverageUpsertWithWhereUniqueWithoutPolicyInput[]
    createMany?: EncounterCoverageCreateManyPolicyInputEnvelope
    set?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    disconnect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    delete?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    connect?: EncounterCoverageWhereUniqueInput | EncounterCoverageWhereUniqueInput[]
    update?: EncounterCoverageUpdateWithWhereUniqueWithoutPolicyInput | EncounterCoverageUpdateWithWhereUniqueWithoutPolicyInput[]
    updateMany?: EncounterCoverageUpdateManyWithWhereWithoutPolicyInput | EncounterCoverageUpdateManyWithWhereWithoutPolicyInput[]
    deleteMany?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
  }

  export type PayerCreateNestedOneWithoutClaimsInput = {
    create?: XOR<PayerCreateWithoutClaimsInput, PayerUncheckedCreateWithoutClaimsInput>
    connectOrCreate?: PayerCreateOrConnectWithoutClaimsInput
    connect?: PayerWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type PayerUpdateOneWithoutClaimsNestedInput = {
    create?: XOR<PayerCreateWithoutClaimsInput, PayerUncheckedCreateWithoutClaimsInput>
    connectOrCreate?: PayerCreateOrConnectWithoutClaimsInput
    upsert?: PayerUpsertWithoutClaimsInput
    disconnect?: PayerWhereInput | boolean
    delete?: PayerWhereInput | boolean
    connect?: PayerWhereUniqueInput
    update?: XOR<XOR<PayerUpdateToOneWithWhereWithoutClaimsInput, PayerUpdateWithoutClaimsInput>, PayerUncheckedUpdateWithoutClaimsInput>
  }

  export type PolicyCreateNestedOneWithoutEncounterCoveragesInput = {
    create?: XOR<PolicyCreateWithoutEncounterCoveragesInput, PolicyUncheckedCreateWithoutEncounterCoveragesInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutEncounterCoveragesInput
    connect?: PolicyWhereUniqueInput
  }

  export type PayerCreateNestedOneWithoutEncounterCoveragesInput = {
    create?: XOR<PayerCreateWithoutEncounterCoveragesInput, PayerUncheckedCreateWithoutEncounterCoveragesInput>
    connectOrCreate?: PayerCreateOrConnectWithoutEncounterCoveragesInput
    connect?: PayerWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type PolicyUpdateOneWithoutEncounterCoveragesNestedInput = {
    create?: XOR<PolicyCreateWithoutEncounterCoveragesInput, PolicyUncheckedCreateWithoutEncounterCoveragesInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutEncounterCoveragesInput
    upsert?: PolicyUpsertWithoutEncounterCoveragesInput
    disconnect?: PolicyWhereInput | boolean
    delete?: PolicyWhereInput | boolean
    connect?: PolicyWhereUniqueInput
    update?: XOR<XOR<PolicyUpdateToOneWithWhereWithoutEncounterCoveragesInput, PolicyUpdateWithoutEncounterCoveragesInput>, PolicyUncheckedUpdateWithoutEncounterCoveragesInput>
  }

  export type PayerUpdateOneWithoutEncounterCoveragesNestedInput = {
    create?: XOR<PayerCreateWithoutEncounterCoveragesInput, PayerUncheckedCreateWithoutEncounterCoveragesInput>
    connectOrCreate?: PayerCreateOrConnectWithoutEncounterCoveragesInput
    upsert?: PayerUpsertWithoutEncounterCoveragesInput
    disconnect?: PayerWhereInput | boolean
    delete?: PayerWhereInput | boolean
    connect?: PayerWhereUniqueInput
    update?: XOR<XOR<PayerUpdateToOneWithWhereWithoutEncounterCoveragesInput, PayerUpdateWithoutEncounterCoveragesInput>, PayerUncheckedUpdateWithoutEncounterCoveragesInput>
  }

  export type ChargeCreateNestedManyWithoutBillingItemInput = {
    create?: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput> | ChargeCreateWithoutBillingItemInput[] | ChargeUncheckedCreateWithoutBillingItemInput[]
    connectOrCreate?: ChargeCreateOrConnectWithoutBillingItemInput | ChargeCreateOrConnectWithoutBillingItemInput[]
    createMany?: ChargeCreateManyBillingItemInputEnvelope
    connect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
  }

  export type ChargeUncheckedCreateNestedManyWithoutBillingItemInput = {
    create?: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput> | ChargeCreateWithoutBillingItemInput[] | ChargeUncheckedCreateWithoutBillingItemInput[]
    connectOrCreate?: ChargeCreateOrConnectWithoutBillingItemInput | ChargeCreateOrConnectWithoutBillingItemInput[]
    createMany?: ChargeCreateManyBillingItemInputEnvelope
    connect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
  }

  export type ChargeUpdateManyWithoutBillingItemNestedInput = {
    create?: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput> | ChargeCreateWithoutBillingItemInput[] | ChargeUncheckedCreateWithoutBillingItemInput[]
    connectOrCreate?: ChargeCreateOrConnectWithoutBillingItemInput | ChargeCreateOrConnectWithoutBillingItemInput[]
    upsert?: ChargeUpsertWithWhereUniqueWithoutBillingItemInput | ChargeUpsertWithWhereUniqueWithoutBillingItemInput[]
    createMany?: ChargeCreateManyBillingItemInputEnvelope
    set?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    disconnect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    delete?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    connect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    update?: ChargeUpdateWithWhereUniqueWithoutBillingItemInput | ChargeUpdateWithWhereUniqueWithoutBillingItemInput[]
    updateMany?: ChargeUpdateManyWithWhereWithoutBillingItemInput | ChargeUpdateManyWithWhereWithoutBillingItemInput[]
    deleteMany?: ChargeScalarWhereInput | ChargeScalarWhereInput[]
  }

  export type ChargeUncheckedUpdateManyWithoutBillingItemNestedInput = {
    create?: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput> | ChargeCreateWithoutBillingItemInput[] | ChargeUncheckedCreateWithoutBillingItemInput[]
    connectOrCreate?: ChargeCreateOrConnectWithoutBillingItemInput | ChargeCreateOrConnectWithoutBillingItemInput[]
    upsert?: ChargeUpsertWithWhereUniqueWithoutBillingItemInput | ChargeUpsertWithWhereUniqueWithoutBillingItemInput[]
    createMany?: ChargeCreateManyBillingItemInputEnvelope
    set?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    disconnect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    delete?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    connect?: ChargeWhereUniqueInput | ChargeWhereUniqueInput[]
    update?: ChargeUpdateWithWhereUniqueWithoutBillingItemInput | ChargeUpdateWithWhereUniqueWithoutBillingItemInput[]
    updateMany?: ChargeUpdateManyWithWhereWithoutBillingItemInput | ChargeUpdateManyWithWhereWithoutBillingItemInput[]
    deleteMany?: ChargeScalarWhereInput | ChargeScalarWhereInput[]
  }

  export type BillingItemCreateNestedOneWithoutChargesInput = {
    create?: XOR<BillingItemCreateWithoutChargesInput, BillingItemUncheckedCreateWithoutChargesInput>
    connectOrCreate?: BillingItemCreateOrConnectWithoutChargesInput
    connect?: BillingItemWhereUniqueInput
  }

  export type InvoiceLineCreateNestedManyWithoutChargeInput = {
    create?: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput> | InvoiceLineCreateWithoutChargeInput[] | InvoiceLineUncheckedCreateWithoutChargeInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutChargeInput | InvoiceLineCreateOrConnectWithoutChargeInput[]
    createMany?: InvoiceLineCreateManyChargeInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type InvoiceLineUncheckedCreateNestedManyWithoutChargeInput = {
    create?: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput> | InvoiceLineCreateWithoutChargeInput[] | InvoiceLineUncheckedCreateWithoutChargeInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutChargeInput | InvoiceLineCreateOrConnectWithoutChargeInput[]
    createMany?: InvoiceLineCreateManyChargeInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type BillingItemUpdateOneRequiredWithoutChargesNestedInput = {
    create?: XOR<BillingItemCreateWithoutChargesInput, BillingItemUncheckedCreateWithoutChargesInput>
    connectOrCreate?: BillingItemCreateOrConnectWithoutChargesInput
    upsert?: BillingItemUpsertWithoutChargesInput
    connect?: BillingItemWhereUniqueInput
    update?: XOR<XOR<BillingItemUpdateToOneWithWhereWithoutChargesInput, BillingItemUpdateWithoutChargesInput>, BillingItemUncheckedUpdateWithoutChargesInput>
  }

  export type InvoiceLineUpdateManyWithoutChargeNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput> | InvoiceLineCreateWithoutChargeInput[] | InvoiceLineUncheckedCreateWithoutChargeInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutChargeInput | InvoiceLineCreateOrConnectWithoutChargeInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutChargeInput | InvoiceLineUpsertWithWhereUniqueWithoutChargeInput[]
    createMany?: InvoiceLineCreateManyChargeInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutChargeInput | InvoiceLineUpdateWithWhereUniqueWithoutChargeInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutChargeInput | InvoiceLineUpdateManyWithWhereWithoutChargeInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type InvoiceLineUncheckedUpdateManyWithoutChargeNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput> | InvoiceLineCreateWithoutChargeInput[] | InvoiceLineUncheckedCreateWithoutChargeInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutChargeInput | InvoiceLineCreateOrConnectWithoutChargeInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutChargeInput | InvoiceLineUpsertWithWhereUniqueWithoutChargeInput[]
    createMany?: InvoiceLineCreateManyChargeInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutChargeInput | InvoiceLineUpdateWithWhereUniqueWithoutChargeInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutChargeInput | InvoiceLineUpdateManyWithWhereWithoutChargeInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type InvoiceLineCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type ReceiptAllocationCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput> | ReceiptAllocationCreateWithoutInvoiceInput[] | ReceiptAllocationUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutInvoiceInput | ReceiptAllocationCreateOrConnectWithoutInvoiceInput[]
    createMany?: ReceiptAllocationCreateManyInvoiceInputEnvelope
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
  }

  export type InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
  }

  export type ReceiptAllocationUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput> | ReceiptAllocationCreateWithoutInvoiceInput[] | ReceiptAllocationUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutInvoiceInput | ReceiptAllocationCreateOrConnectWithoutInvoiceInput[]
    createMany?: ReceiptAllocationCreateManyInvoiceInputEnvelope
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
  }

  export type InvoiceLineUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type ReceiptAllocationUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput> | ReceiptAllocationCreateWithoutInvoiceInput[] | ReceiptAllocationUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutInvoiceInput | ReceiptAllocationCreateOrConnectWithoutInvoiceInput[]
    upsert?: ReceiptAllocationUpsertWithWhereUniqueWithoutInvoiceInput | ReceiptAllocationUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: ReceiptAllocationCreateManyInvoiceInputEnvelope
    set?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    disconnect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    delete?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    update?: ReceiptAllocationUpdateWithWhereUniqueWithoutInvoiceInput | ReceiptAllocationUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: ReceiptAllocationUpdateManyWithWhereWithoutInvoiceInput | ReceiptAllocationUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
  }

  export type InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput> | InvoiceLineCreateWithoutInvoiceInput[] | InvoiceLineUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: InvoiceLineCreateOrConnectWithoutInvoiceInput | InvoiceLineCreateOrConnectWithoutInvoiceInput[]
    upsert?: InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: InvoiceLineCreateManyInvoiceInputEnvelope
    set?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    disconnect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    delete?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    connect?: InvoiceLineWhereUniqueInput | InvoiceLineWhereUniqueInput[]
    update?: InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput | InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: InvoiceLineUpdateManyWithWhereWithoutInvoiceInput | InvoiceLineUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
  }

  export type ReceiptAllocationUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput> | ReceiptAllocationCreateWithoutInvoiceInput[] | ReceiptAllocationUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutInvoiceInput | ReceiptAllocationCreateOrConnectWithoutInvoiceInput[]
    upsert?: ReceiptAllocationUpsertWithWhereUniqueWithoutInvoiceInput | ReceiptAllocationUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: ReceiptAllocationCreateManyInvoiceInputEnvelope
    set?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    disconnect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    delete?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    update?: ReceiptAllocationUpdateWithWhereUniqueWithoutInvoiceInput | ReceiptAllocationUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: ReceiptAllocationUpdateManyWithWhereWithoutInvoiceInput | ReceiptAllocationUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
  }

  export type InvoiceCreateNestedOneWithoutInvoiceLinesInput = {
    create?: XOR<InvoiceCreateWithoutInvoiceLinesInput, InvoiceUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutInvoiceLinesInput
    connect?: InvoiceWhereUniqueInput
  }

  export type ChargeCreateNestedOneWithoutInvoiceLinesInput = {
    create?: XOR<ChargeCreateWithoutInvoiceLinesInput, ChargeUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ChargeCreateOrConnectWithoutInvoiceLinesInput
    connect?: ChargeWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InvoiceUpdateOneRequiredWithoutInvoiceLinesNestedInput = {
    create?: XOR<InvoiceCreateWithoutInvoiceLinesInput, InvoiceUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutInvoiceLinesInput
    upsert?: InvoiceUpsertWithoutInvoiceLinesInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutInvoiceLinesInput, InvoiceUpdateWithoutInvoiceLinesInput>, InvoiceUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type ChargeUpdateOneRequiredWithoutInvoiceLinesNestedInput = {
    create?: XOR<ChargeCreateWithoutInvoiceLinesInput, ChargeUncheckedCreateWithoutInvoiceLinesInput>
    connectOrCreate?: ChargeCreateOrConnectWithoutInvoiceLinesInput
    upsert?: ChargeUpsertWithoutInvoiceLinesInput
    connect?: ChargeWhereUniqueInput
    update?: XOR<XOR<ChargeUpdateToOneWithWhereWithoutInvoiceLinesInput, ChargeUpdateWithoutInvoiceLinesInput>, ChargeUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type ReceiptAllocationCreateNestedManyWithoutReceiptInput = {
    create?: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput> | ReceiptAllocationCreateWithoutReceiptInput[] | ReceiptAllocationUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutReceiptInput | ReceiptAllocationCreateOrConnectWithoutReceiptInput[]
    createMany?: ReceiptAllocationCreateManyReceiptInputEnvelope
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
  }

  export type ReceiptAllocationUncheckedCreateNestedManyWithoutReceiptInput = {
    create?: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput> | ReceiptAllocationCreateWithoutReceiptInput[] | ReceiptAllocationUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutReceiptInput | ReceiptAllocationCreateOrConnectWithoutReceiptInput[]
    createMany?: ReceiptAllocationCreateManyReceiptInputEnvelope
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
  }

  export type ReceiptAllocationUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput> | ReceiptAllocationCreateWithoutReceiptInput[] | ReceiptAllocationUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutReceiptInput | ReceiptAllocationCreateOrConnectWithoutReceiptInput[]
    upsert?: ReceiptAllocationUpsertWithWhereUniqueWithoutReceiptInput | ReceiptAllocationUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: ReceiptAllocationCreateManyReceiptInputEnvelope
    set?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    disconnect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    delete?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    update?: ReceiptAllocationUpdateWithWhereUniqueWithoutReceiptInput | ReceiptAllocationUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: ReceiptAllocationUpdateManyWithWhereWithoutReceiptInput | ReceiptAllocationUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
  }

  export type ReceiptAllocationUncheckedUpdateManyWithoutReceiptNestedInput = {
    create?: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput> | ReceiptAllocationCreateWithoutReceiptInput[] | ReceiptAllocationUncheckedCreateWithoutReceiptInput[]
    connectOrCreate?: ReceiptAllocationCreateOrConnectWithoutReceiptInput | ReceiptAllocationCreateOrConnectWithoutReceiptInput[]
    upsert?: ReceiptAllocationUpsertWithWhereUniqueWithoutReceiptInput | ReceiptAllocationUpsertWithWhereUniqueWithoutReceiptInput[]
    createMany?: ReceiptAllocationCreateManyReceiptInputEnvelope
    set?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    disconnect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    delete?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    connect?: ReceiptAllocationWhereUniqueInput | ReceiptAllocationWhereUniqueInput[]
    update?: ReceiptAllocationUpdateWithWhereUniqueWithoutReceiptInput | ReceiptAllocationUpdateWithWhereUniqueWithoutReceiptInput[]
    updateMany?: ReceiptAllocationUpdateManyWithWhereWithoutReceiptInput | ReceiptAllocationUpdateManyWithWhereWithoutReceiptInput[]
    deleteMany?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
  }

  export type ReceiptCreateNestedOneWithoutAllocationsInput = {
    create?: XOR<ReceiptCreateWithoutAllocationsInput, ReceiptUncheckedCreateWithoutAllocationsInput>
    connectOrCreate?: ReceiptCreateOrConnectWithoutAllocationsInput
    connect?: ReceiptWhereUniqueInput
  }

  export type InvoiceCreateNestedOneWithoutReceiptAllocationsInput = {
    create?: XOR<InvoiceCreateWithoutReceiptAllocationsInput, InvoiceUncheckedCreateWithoutReceiptAllocationsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutReceiptAllocationsInput
    connect?: InvoiceWhereUniqueInput
  }

  export type ReceiptUpdateOneRequiredWithoutAllocationsNestedInput = {
    create?: XOR<ReceiptCreateWithoutAllocationsInput, ReceiptUncheckedCreateWithoutAllocationsInput>
    connectOrCreate?: ReceiptCreateOrConnectWithoutAllocationsInput
    upsert?: ReceiptUpsertWithoutAllocationsInput
    connect?: ReceiptWhereUniqueInput
    update?: XOR<XOR<ReceiptUpdateToOneWithWhereWithoutAllocationsInput, ReceiptUpdateWithoutAllocationsInput>, ReceiptUncheckedUpdateWithoutAllocationsInput>
  }

  export type InvoiceUpdateOneRequiredWithoutReceiptAllocationsNestedInput = {
    create?: XOR<InvoiceCreateWithoutReceiptAllocationsInput, InvoiceUncheckedCreateWithoutReceiptAllocationsInput>
    connectOrCreate?: InvoiceCreateOrConnectWithoutReceiptAllocationsInput
    upsert?: InvoiceUpsertWithoutReceiptAllocationsInput
    connect?: InvoiceWhereUniqueInput
    update?: XOR<XOR<InvoiceUpdateToOneWithWhereWithoutReceiptAllocationsInput, InvoiceUpdateWithoutReceiptAllocationsInput>, InvoiceUncheckedUpdateWithoutReceiptAllocationsInput>
  }

  export type ChargePostingAuditCreateNestedManyWithoutRuleInput = {
    create?: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput> | ChargePostingAuditCreateWithoutRuleInput[] | ChargePostingAuditUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutRuleInput | ChargePostingAuditCreateOrConnectWithoutRuleInput[]
    createMany?: ChargePostingAuditCreateManyRuleInputEnvelope
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
  }

  export type ChargePostingAuditUncheckedCreateNestedManyWithoutRuleInput = {
    create?: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput> | ChargePostingAuditCreateWithoutRuleInput[] | ChargePostingAuditUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutRuleInput | ChargePostingAuditCreateOrConnectWithoutRuleInput[]
    createMany?: ChargePostingAuditCreateManyRuleInputEnvelope
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
  }

  export type ChargePostingAuditUpdateManyWithoutRuleNestedInput = {
    create?: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput> | ChargePostingAuditCreateWithoutRuleInput[] | ChargePostingAuditUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutRuleInput | ChargePostingAuditCreateOrConnectWithoutRuleInput[]
    upsert?: ChargePostingAuditUpsertWithWhereUniqueWithoutRuleInput | ChargePostingAuditUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: ChargePostingAuditCreateManyRuleInputEnvelope
    set?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    disconnect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    delete?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    update?: ChargePostingAuditUpdateWithWhereUniqueWithoutRuleInput | ChargePostingAuditUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: ChargePostingAuditUpdateManyWithWhereWithoutRuleInput | ChargePostingAuditUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
  }

  export type ChargePostingAuditUncheckedUpdateManyWithoutRuleNestedInput = {
    create?: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput> | ChargePostingAuditCreateWithoutRuleInput[] | ChargePostingAuditUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutRuleInput | ChargePostingAuditCreateOrConnectWithoutRuleInput[]
    upsert?: ChargePostingAuditUpsertWithWhereUniqueWithoutRuleInput | ChargePostingAuditUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: ChargePostingAuditCreateManyRuleInputEnvelope
    set?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    disconnect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    delete?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    update?: ChargePostingAuditUpdateWithWhereUniqueWithoutRuleInput | ChargePostingAuditUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: ChargePostingAuditUpdateManyWithWhereWithoutRuleInput | ChargePostingAuditUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
  }

  export type ChargePostingAuditCreateNestedManyWithoutEventInput = {
    create?: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput> | ChargePostingAuditCreateWithoutEventInput[] | ChargePostingAuditUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutEventInput | ChargePostingAuditCreateOrConnectWithoutEventInput[]
    createMany?: ChargePostingAuditCreateManyEventInputEnvelope
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
  }

  export type ChargePostingAuditUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput> | ChargePostingAuditCreateWithoutEventInput[] | ChargePostingAuditUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutEventInput | ChargePostingAuditCreateOrConnectWithoutEventInput[]
    createMany?: ChargePostingAuditCreateManyEventInputEnvelope
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
  }

  export type ChargePostingAuditUpdateManyWithoutEventNestedInput = {
    create?: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput> | ChargePostingAuditCreateWithoutEventInput[] | ChargePostingAuditUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutEventInput | ChargePostingAuditCreateOrConnectWithoutEventInput[]
    upsert?: ChargePostingAuditUpsertWithWhereUniqueWithoutEventInput | ChargePostingAuditUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ChargePostingAuditCreateManyEventInputEnvelope
    set?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    disconnect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    delete?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    update?: ChargePostingAuditUpdateWithWhereUniqueWithoutEventInput | ChargePostingAuditUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ChargePostingAuditUpdateManyWithWhereWithoutEventInput | ChargePostingAuditUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
  }

  export type ChargePostingAuditUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput> | ChargePostingAuditCreateWithoutEventInput[] | ChargePostingAuditUncheckedCreateWithoutEventInput[]
    connectOrCreate?: ChargePostingAuditCreateOrConnectWithoutEventInput | ChargePostingAuditCreateOrConnectWithoutEventInput[]
    upsert?: ChargePostingAuditUpsertWithWhereUniqueWithoutEventInput | ChargePostingAuditUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: ChargePostingAuditCreateManyEventInputEnvelope
    set?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    disconnect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    delete?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    connect?: ChargePostingAuditWhereUniqueInput | ChargePostingAuditWhereUniqueInput[]
    update?: ChargePostingAuditUpdateWithWhereUniqueWithoutEventInput | ChargePostingAuditUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: ChargePostingAuditUpdateManyWithWhereWithoutEventInput | ChargePostingAuditUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
  }

  export type ChargePostingEventCreateNestedOneWithoutAuditRecordsInput = {
    create?: XOR<ChargePostingEventCreateWithoutAuditRecordsInput, ChargePostingEventUncheckedCreateWithoutAuditRecordsInput>
    connectOrCreate?: ChargePostingEventCreateOrConnectWithoutAuditRecordsInput
    connect?: ChargePostingEventWhereUniqueInput
  }

  export type ChargePostingRuleCreateNestedOneWithoutAuditRecordsInput = {
    create?: XOR<ChargePostingRuleCreateWithoutAuditRecordsInput, ChargePostingRuleUncheckedCreateWithoutAuditRecordsInput>
    connectOrCreate?: ChargePostingRuleCreateOrConnectWithoutAuditRecordsInput
    connect?: ChargePostingRuleWhereUniqueInput
  }

  export type ChargePostingEventUpdateOneRequiredWithoutAuditRecordsNestedInput = {
    create?: XOR<ChargePostingEventCreateWithoutAuditRecordsInput, ChargePostingEventUncheckedCreateWithoutAuditRecordsInput>
    connectOrCreate?: ChargePostingEventCreateOrConnectWithoutAuditRecordsInput
    upsert?: ChargePostingEventUpsertWithoutAuditRecordsInput
    connect?: ChargePostingEventWhereUniqueInput
    update?: XOR<XOR<ChargePostingEventUpdateToOneWithWhereWithoutAuditRecordsInput, ChargePostingEventUpdateWithoutAuditRecordsInput>, ChargePostingEventUncheckedUpdateWithoutAuditRecordsInput>
  }

  export type ChargePostingRuleUpdateOneRequiredWithoutAuditRecordsNestedInput = {
    create?: XOR<ChargePostingRuleCreateWithoutAuditRecordsInput, ChargePostingRuleUncheckedCreateWithoutAuditRecordsInput>
    connectOrCreate?: ChargePostingRuleCreateOrConnectWithoutAuditRecordsInput
    upsert?: ChargePostingRuleUpsertWithoutAuditRecordsInput
    connect?: ChargePostingRuleWhereUniqueInput
    update?: XOR<XOR<ChargePostingRuleUpdateToOneWithWhereWithoutAuditRecordsInput, ChargePostingRuleUpdateWithoutAuditRecordsInput>, ChargePostingRuleUncheckedUpdateWithoutAuditRecordsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PolicyCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    encounterCoverages?: EncounterCoverageCreateNestedManyWithoutPolicyInput
  }

  export type PolicyUncheckedCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    encounterCoverages?: EncounterCoverageUncheckedCreateNestedManyWithoutPolicyInput
  }

  export type PolicyCreateOrConnectWithoutPayerInput = {
    where: PolicyWhereUniqueInput
    create: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput>
  }

  export type PolicyCreateManyPayerInputEnvelope = {
    data: PolicyCreateManyPayerInput | PolicyCreateManyPayerInput[]
    skipDuplicates?: boolean
  }

  export type ClaimCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimUncheckedCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimCreateOrConnectWithoutPayerInput = {
    where: ClaimWhereUniqueInput
    create: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput>
  }

  export type ClaimCreateManyPayerInputEnvelope = {
    data: ClaimCreateManyPayerInput | ClaimCreateManyPayerInput[]
    skipDuplicates?: boolean
  }

  export type EncounterCoverageCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    policy?: PolicyCreateNestedOneWithoutEncounterCoveragesInput
  }

  export type EncounterCoverageUncheckedCreateWithoutPayerInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    policyId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageCreateOrConnectWithoutPayerInput = {
    where: EncounterCoverageWhereUniqueInput
    create: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput>
  }

  export type EncounterCoverageCreateManyPayerInputEnvelope = {
    data: EncounterCoverageCreateManyPayerInput | EncounterCoverageCreateManyPayerInput[]
    skipDuplicates?: boolean
  }

  export type PolicyUpsertWithWhereUniqueWithoutPayerInput = {
    where: PolicyWhereUniqueInput
    update: XOR<PolicyUpdateWithoutPayerInput, PolicyUncheckedUpdateWithoutPayerInput>
    create: XOR<PolicyCreateWithoutPayerInput, PolicyUncheckedCreateWithoutPayerInput>
  }

  export type PolicyUpdateWithWhereUniqueWithoutPayerInput = {
    where: PolicyWhereUniqueInput
    data: XOR<PolicyUpdateWithoutPayerInput, PolicyUncheckedUpdateWithoutPayerInput>
  }

  export type PolicyUpdateManyWithWhereWithoutPayerInput = {
    where: PolicyScalarWhereInput
    data: XOR<PolicyUpdateManyMutationInput, PolicyUncheckedUpdateManyWithoutPayerInput>
  }

  export type PolicyScalarWhereInput = {
    AND?: PolicyScalarWhereInput | PolicyScalarWhereInput[]
    OR?: PolicyScalarWhereInput[]
    NOT?: PolicyScalarWhereInput | PolicyScalarWhereInput[]
    id?: UuidFilter<"Policy"> | string
    tenantId?: UuidFilter<"Policy"> | string
    patientId?: UuidFilter<"Policy"> | string
    policyNumber?: StringFilter<"Policy"> | string
    groupNumber?: StringNullableFilter<"Policy"> | string | null
    payerName?: StringFilter<"Policy"> | string
    payerId?: UuidFilter<"Policy"> | string
    relationship?: StringNullableFilter<"Policy"> | string | null
    effectiveDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    expirationDate?: DateTimeNullableFilter<"Policy"> | Date | string | null
    benefits?: JsonFilter<"Policy">
    isPrimary?: BoolFilter<"Policy"> | boolean
    status?: StringFilter<"Policy"> | string
    createdAt?: DateTimeFilter<"Policy"> | Date | string
    updatedAt?: DateTimeFilter<"Policy"> | Date | string
  }

  export type ClaimUpsertWithWhereUniqueWithoutPayerInput = {
    where: ClaimWhereUniqueInput
    update: XOR<ClaimUpdateWithoutPayerInput, ClaimUncheckedUpdateWithoutPayerInput>
    create: XOR<ClaimCreateWithoutPayerInput, ClaimUncheckedCreateWithoutPayerInput>
  }

  export type ClaimUpdateWithWhereUniqueWithoutPayerInput = {
    where: ClaimWhereUniqueInput
    data: XOR<ClaimUpdateWithoutPayerInput, ClaimUncheckedUpdateWithoutPayerInput>
  }

  export type ClaimUpdateManyWithWhereWithoutPayerInput = {
    where: ClaimScalarWhereInput
    data: XOR<ClaimUpdateManyMutationInput, ClaimUncheckedUpdateManyWithoutPayerInput>
  }

  export type ClaimScalarWhereInput = {
    AND?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
    OR?: ClaimScalarWhereInput[]
    NOT?: ClaimScalarWhereInput | ClaimScalarWhereInput[]
    id?: UuidFilter<"Claim"> | string
    tenantId?: UuidFilter<"Claim"> | string
    claimNumber?: StringFilter<"Claim"> | string
    status?: StringFilter<"Claim"> | string
    payerId?: UuidNullableFilter<"Claim"> | string | null
    patientId?: UuidFilter<"Claim"> | string
    encounterId?: UuidNullableFilter<"Claim"> | string | null
    totalAmount?: DecimalFilter<"Claim"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Claim"> | string
    serviceDate?: DateTimeFilter<"Claim"> | Date | string
    submittedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    adjudicatedAt?: DateTimeNullableFilter<"Claim"> | Date | string | null
    createdAt?: DateTimeFilter<"Claim"> | Date | string
    updatedAt?: DateTimeFilter<"Claim"> | Date | string
  }

  export type EncounterCoverageUpsertWithWhereUniqueWithoutPayerInput = {
    where: EncounterCoverageWhereUniqueInput
    update: XOR<EncounterCoverageUpdateWithoutPayerInput, EncounterCoverageUncheckedUpdateWithoutPayerInput>
    create: XOR<EncounterCoverageCreateWithoutPayerInput, EncounterCoverageUncheckedCreateWithoutPayerInput>
  }

  export type EncounterCoverageUpdateWithWhereUniqueWithoutPayerInput = {
    where: EncounterCoverageWhereUniqueInput
    data: XOR<EncounterCoverageUpdateWithoutPayerInput, EncounterCoverageUncheckedUpdateWithoutPayerInput>
  }

  export type EncounterCoverageUpdateManyWithWhereWithoutPayerInput = {
    where: EncounterCoverageScalarWhereInput
    data: XOR<EncounterCoverageUpdateManyMutationInput, EncounterCoverageUncheckedUpdateManyWithoutPayerInput>
  }

  export type EncounterCoverageScalarWhereInput = {
    AND?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
    OR?: EncounterCoverageScalarWhereInput[]
    NOT?: EncounterCoverageScalarWhereInput | EncounterCoverageScalarWhereInput[]
    id?: UuidFilter<"EncounterCoverage"> | string
    tenantId?: UuidFilter<"EncounterCoverage"> | string
    encounterId?: UuidFilter<"EncounterCoverage"> | string
    patientId?: UuidFilter<"EncounterCoverage"> | string
    policyId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    payerId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    financialClass?: StringFilter<"EncounterCoverage"> | string
    coverageLevel?: StringFilter<"EncounterCoverage"> | string
    planName?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberId?: StringNullableFilter<"EncounterCoverage"> | string | null
    memberName?: StringNullableFilter<"EncounterCoverage"> | string | null
    networkName?: StringNullableFilter<"EncounterCoverage"> | string | null
    copayAmount?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: DecimalNullableFilter<"EncounterCoverage"> | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: JsonNullableFilter<"EncounterCoverage">
    benefitsSnapshot?: JsonNullableFilter<"EncounterCoverage">
    eligibilityRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    preauthRequestId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    costEstimateId?: UuidNullableFilter<"EncounterCoverage"> | string | null
    isActive?: BoolFilter<"EncounterCoverage"> | boolean
    createdAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
    updatedAt?: DateTimeFilter<"EncounterCoverage"> | Date | string
  }

  export type PayerCreateWithoutPoliciesInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    claims?: ClaimCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageCreateNestedManyWithoutPayerInput
  }

  export type PayerUncheckedCreateWithoutPoliciesInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    claims?: ClaimUncheckedCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageUncheckedCreateNestedManyWithoutPayerInput
  }

  export type PayerCreateOrConnectWithoutPoliciesInput = {
    where: PayerWhereUniqueInput
    create: XOR<PayerCreateWithoutPoliciesInput, PayerUncheckedCreateWithoutPoliciesInput>
  }

  export type EncounterCoverageCreateWithoutPolicyInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    payer?: PayerCreateNestedOneWithoutEncounterCoveragesInput
  }

  export type EncounterCoverageUncheckedCreateWithoutPolicyInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    payerId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageCreateOrConnectWithoutPolicyInput = {
    where: EncounterCoverageWhereUniqueInput
    create: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput>
  }

  export type EncounterCoverageCreateManyPolicyInputEnvelope = {
    data: EncounterCoverageCreateManyPolicyInput | EncounterCoverageCreateManyPolicyInput[]
    skipDuplicates?: boolean
  }

  export type PayerUpsertWithoutPoliciesInput = {
    update: XOR<PayerUpdateWithoutPoliciesInput, PayerUncheckedUpdateWithoutPoliciesInput>
    create: XOR<PayerCreateWithoutPoliciesInput, PayerUncheckedCreateWithoutPoliciesInput>
    where?: PayerWhereInput
  }

  export type PayerUpdateToOneWithWhereWithoutPoliciesInput = {
    where?: PayerWhereInput
    data: XOR<PayerUpdateWithoutPoliciesInput, PayerUncheckedUpdateWithoutPoliciesInput>
  }

  export type PayerUpdateWithoutPoliciesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claims?: ClaimUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUpdateManyWithoutPayerNestedInput
  }

  export type PayerUncheckedUpdateWithoutPoliciesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claims?: ClaimUncheckedUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUncheckedUpdateManyWithoutPayerNestedInput
  }

  export type EncounterCoverageUpsertWithWhereUniqueWithoutPolicyInput = {
    where: EncounterCoverageWhereUniqueInput
    update: XOR<EncounterCoverageUpdateWithoutPolicyInput, EncounterCoverageUncheckedUpdateWithoutPolicyInput>
    create: XOR<EncounterCoverageCreateWithoutPolicyInput, EncounterCoverageUncheckedCreateWithoutPolicyInput>
  }

  export type EncounterCoverageUpdateWithWhereUniqueWithoutPolicyInput = {
    where: EncounterCoverageWhereUniqueInput
    data: XOR<EncounterCoverageUpdateWithoutPolicyInput, EncounterCoverageUncheckedUpdateWithoutPolicyInput>
  }

  export type EncounterCoverageUpdateManyWithWhereWithoutPolicyInput = {
    where: EncounterCoverageScalarWhereInput
    data: XOR<EncounterCoverageUpdateManyMutationInput, EncounterCoverageUncheckedUpdateManyWithoutPolicyInput>
  }

  export type PayerCreateWithoutClaimsInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageCreateNestedManyWithoutPayerInput
  }

  export type PayerUncheckedCreateWithoutClaimsInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyUncheckedCreateNestedManyWithoutPayerInput
    encounterCoverages?: EncounterCoverageUncheckedCreateNestedManyWithoutPayerInput
  }

  export type PayerCreateOrConnectWithoutClaimsInput = {
    where: PayerWhereUniqueInput
    create: XOR<PayerCreateWithoutClaimsInput, PayerUncheckedCreateWithoutClaimsInput>
  }

  export type PayerUpsertWithoutClaimsInput = {
    update: XOR<PayerUpdateWithoutClaimsInput, PayerUncheckedUpdateWithoutClaimsInput>
    create: XOR<PayerCreateWithoutClaimsInput, PayerUncheckedCreateWithoutClaimsInput>
    where?: PayerWhereInput
  }

  export type PayerUpdateToOneWithWhereWithoutClaimsInput = {
    where?: PayerWhereInput
    data: XOR<PayerUpdateWithoutClaimsInput, PayerUncheckedUpdateWithoutClaimsInput>
  }

  export type PayerUpdateWithoutClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUpdateManyWithoutPayerNestedInput
  }

  export type PayerUncheckedUpdateWithoutClaimsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUncheckedUpdateManyWithoutPayerNestedInput
    encounterCoverages?: EncounterCoverageUncheckedUpdateManyWithoutPayerNestedInput
  }

  export type PolicyCreateWithoutEncounterCoveragesInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    payer: PayerCreateNestedOneWithoutPoliciesInput
  }

  export type PolicyUncheckedCreateWithoutEncounterCoveragesInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    payerId: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PolicyCreateOrConnectWithoutEncounterCoveragesInput = {
    where: PolicyWhereUniqueInput
    create: XOR<PolicyCreateWithoutEncounterCoveragesInput, PolicyUncheckedCreateWithoutEncounterCoveragesInput>
  }

  export type PayerCreateWithoutEncounterCoveragesInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyCreateNestedManyWithoutPayerInput
    claims?: ClaimCreateNestedManyWithoutPayerInput
  }

  export type PayerUncheckedCreateWithoutEncounterCoveragesInput = {
    id?: string
    tenantId: string
    payerName: string
    payerId?: string | null
    payerType?: string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    policies?: PolicyUncheckedCreateNestedManyWithoutPayerInput
    claims?: ClaimUncheckedCreateNestedManyWithoutPayerInput
  }

  export type PayerCreateOrConnectWithoutEncounterCoveragesInput = {
    where: PayerWhereUniqueInput
    create: XOR<PayerCreateWithoutEncounterCoveragesInput, PayerUncheckedCreateWithoutEncounterCoveragesInput>
  }

  export type PolicyUpsertWithoutEncounterCoveragesInput = {
    update: XOR<PolicyUpdateWithoutEncounterCoveragesInput, PolicyUncheckedUpdateWithoutEncounterCoveragesInput>
    create: XOR<PolicyCreateWithoutEncounterCoveragesInput, PolicyUncheckedCreateWithoutEncounterCoveragesInput>
    where?: PolicyWhereInput
  }

  export type PolicyUpdateToOneWithWhereWithoutEncounterCoveragesInput = {
    where?: PolicyWhereInput
    data: XOR<PolicyUpdateWithoutEncounterCoveragesInput, PolicyUncheckedUpdateWithoutEncounterCoveragesInput>
  }

  export type PolicyUpdateWithoutEncounterCoveragesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payer?: PayerUpdateOneRequiredWithoutPoliciesNestedInput
  }

  export type PolicyUncheckedUpdateWithoutEncounterCoveragesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PayerUpsertWithoutEncounterCoveragesInput = {
    update: XOR<PayerUpdateWithoutEncounterCoveragesInput, PayerUncheckedUpdateWithoutEncounterCoveragesInput>
    create: XOR<PayerCreateWithoutEncounterCoveragesInput, PayerUncheckedCreateWithoutEncounterCoveragesInput>
    where?: PayerWhereInput
  }

  export type PayerUpdateToOneWithWhereWithoutEncounterCoveragesInput = {
    where?: PayerWhereInput
    data: XOR<PayerUpdateWithoutEncounterCoveragesInput, PayerUncheckedUpdateWithoutEncounterCoveragesInput>
  }

  export type PayerUpdateWithoutEncounterCoveragesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUpdateManyWithoutPayerNestedInput
    claims?: ClaimUpdateManyWithoutPayerNestedInput
  }

  export type PayerUncheckedUpdateWithoutEncounterCoveragesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    payerName?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    payerType?: NullableStringFieldUpdateOperationsInput | string | null
    contactInfo?: JsonNullValueInput | InputJsonValue
    configuration?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policies?: PolicyUncheckedUpdateManyWithoutPayerNestedInput
    claims?: ClaimUncheckedUpdateManyWithoutPayerNestedInput
  }

  export type ChargeCreateWithoutBillingItemInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineCreateNestedManyWithoutChargeInput
  }

  export type ChargeUncheckedCreateWithoutBillingItemInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutChargeInput
  }

  export type ChargeCreateOrConnectWithoutBillingItemInput = {
    where: ChargeWhereUniqueInput
    create: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput>
  }

  export type ChargeCreateManyBillingItemInputEnvelope = {
    data: ChargeCreateManyBillingItemInput | ChargeCreateManyBillingItemInput[]
    skipDuplicates?: boolean
  }

  export type ChargeUpsertWithWhereUniqueWithoutBillingItemInput = {
    where: ChargeWhereUniqueInput
    update: XOR<ChargeUpdateWithoutBillingItemInput, ChargeUncheckedUpdateWithoutBillingItemInput>
    create: XOR<ChargeCreateWithoutBillingItemInput, ChargeUncheckedCreateWithoutBillingItemInput>
  }

  export type ChargeUpdateWithWhereUniqueWithoutBillingItemInput = {
    where: ChargeWhereUniqueInput
    data: XOR<ChargeUpdateWithoutBillingItemInput, ChargeUncheckedUpdateWithoutBillingItemInput>
  }

  export type ChargeUpdateManyWithWhereWithoutBillingItemInput = {
    where: ChargeScalarWhereInput
    data: XOR<ChargeUpdateManyMutationInput, ChargeUncheckedUpdateManyWithoutBillingItemInput>
  }

  export type ChargeScalarWhereInput = {
    AND?: ChargeScalarWhereInput | ChargeScalarWhereInput[]
    OR?: ChargeScalarWhereInput[]
    NOT?: ChargeScalarWhereInput | ChargeScalarWhereInput[]
    id?: UuidFilter<"Charge"> | string
    tenantId?: UuidFilter<"Charge"> | string
    patientId?: UuidFilter<"Charge"> | string
    encounterId?: UuidNullableFilter<"Charge"> | string | null
    billingItemId?: UuidFilter<"Charge"> | string
    chargeDate?: DateTimeFilter<"Charge"> | Date | string
    quantity?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFilter<"Charge"> | Decimal | DecimalJsLike | number | string
    patientResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: DecimalNullableFilter<"Charge"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Charge"> | string
    sourceType?: StringNullableFilter<"Charge"> | string | null
    sourceId?: UuidNullableFilter<"Charge"> | string | null
    notes?: StringNullableFilter<"Charge"> | string | null
    createdAt?: DateTimeFilter<"Charge"> | Date | string
    updatedAt?: DateTimeFilter<"Charge"> | Date | string
  }

  export type BillingItemCreateWithoutChargesInput = {
    id?: string
    tenantId?: string | null
    itemType: string
    clinicalRefId?: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit?: string
    listPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingItemUncheckedCreateWithoutChargesInput = {
    id?: string
    tenantId?: string | null
    itemType: string
    clinicalRefId?: string | null
    billingCode: string
    billingCodeType: string
    billingDescription: string
    chargeType: string
    defaultUnit?: string
    listPrice?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BillingItemCreateOrConnectWithoutChargesInput = {
    where: BillingItemWhereUniqueInput
    create: XOR<BillingItemCreateWithoutChargesInput, BillingItemUncheckedCreateWithoutChargesInput>
  }

  export type InvoiceLineCreateWithoutChargeInput = {
    id?: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice: InvoiceCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineUncheckedCreateWithoutChargeInput = {
    id?: string
    invoiceId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineCreateOrConnectWithoutChargeInput = {
    where: InvoiceLineWhereUniqueInput
    create: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput>
  }

  export type InvoiceLineCreateManyChargeInputEnvelope = {
    data: InvoiceLineCreateManyChargeInput | InvoiceLineCreateManyChargeInput[]
    skipDuplicates?: boolean
  }

  export type BillingItemUpsertWithoutChargesInput = {
    update: XOR<BillingItemUpdateWithoutChargesInput, BillingItemUncheckedUpdateWithoutChargesInput>
    create: XOR<BillingItemCreateWithoutChargesInput, BillingItemUncheckedCreateWithoutChargesInput>
    where?: BillingItemWhereInput
  }

  export type BillingItemUpdateToOneWithWhereWithoutChargesInput = {
    where?: BillingItemWhereInput
    data: XOR<BillingItemUpdateWithoutChargesInput, BillingItemUncheckedUpdateWithoutChargesInput>
  }

  export type BillingItemUpdateWithoutChargesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingItemUncheckedUpdateWithoutChargesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    itemType?: StringFieldUpdateOperationsInput | string
    clinicalRefId?: NullableStringFieldUpdateOperationsInput | string | null
    billingCode?: StringFieldUpdateOperationsInput | string
    billingCodeType?: StringFieldUpdateOperationsInput | string
    billingDescription?: StringFieldUpdateOperationsInput | string
    chargeType?: StringFieldUpdateOperationsInput | string
    defaultUnit?: StringFieldUpdateOperationsInput | string
    listPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUpsertWithWhereUniqueWithoutChargeInput = {
    where: InvoiceLineWhereUniqueInput
    update: XOR<InvoiceLineUpdateWithoutChargeInput, InvoiceLineUncheckedUpdateWithoutChargeInput>
    create: XOR<InvoiceLineCreateWithoutChargeInput, InvoiceLineUncheckedCreateWithoutChargeInput>
  }

  export type InvoiceLineUpdateWithWhereUniqueWithoutChargeInput = {
    where: InvoiceLineWhereUniqueInput
    data: XOR<InvoiceLineUpdateWithoutChargeInput, InvoiceLineUncheckedUpdateWithoutChargeInput>
  }

  export type InvoiceLineUpdateManyWithWhereWithoutChargeInput = {
    where: InvoiceLineScalarWhereInput
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyWithoutChargeInput>
  }

  export type InvoiceLineScalarWhereInput = {
    AND?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
    OR?: InvoiceLineScalarWhereInput[]
    NOT?: InvoiceLineScalarWhereInput | InvoiceLineScalarWhereInput[]
    id?: UuidFilter<"InvoiceLine"> | string
    invoiceId?: UuidFilter<"InvoiceLine"> | string
    chargeId?: UuidFilter<"InvoiceLine"> | string
    lineNumber?: IntFilter<"InvoiceLine"> | number
    description?: StringNullableFilter<"InvoiceLine"> | string | null
    quantity?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFilter<"InvoiceLine"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"InvoiceLine"> | Date | string
    updatedAt?: DateTimeFilter<"InvoiceLine"> | Date | string
  }

  export type InvoiceLineCreateWithoutInvoiceInput = {
    id?: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    charge: ChargeCreateNestedOneWithoutInvoiceLinesInput
  }

  export type InvoiceLineUncheckedCreateWithoutInvoiceInput = {
    id?: string
    chargeId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineCreateOrConnectWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    create: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineCreateManyInvoiceInputEnvelope = {
    data: InvoiceLineCreateManyInvoiceInput | InvoiceLineCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type ReceiptAllocationCreateWithoutInvoiceInput = {
    id?: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    receipt: ReceiptCreateNestedOneWithoutAllocationsInput
  }

  export type ReceiptAllocationUncheckedCreateWithoutInvoiceInput = {
    id?: string
    receiptId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReceiptAllocationCreateOrConnectWithoutInvoiceInput = {
    where: ReceiptAllocationWhereUniqueInput
    create: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput>
  }

  export type ReceiptAllocationCreateManyInvoiceInputEnvelope = {
    data: ReceiptAllocationCreateManyInvoiceInput | ReceiptAllocationCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type InvoiceLineUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    update: XOR<InvoiceLineUpdateWithoutInvoiceInput, InvoiceLineUncheckedUpdateWithoutInvoiceInput>
    create: XOR<InvoiceLineCreateWithoutInvoiceInput, InvoiceLineUncheckedCreateWithoutInvoiceInput>
  }

  export type InvoiceLineUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: InvoiceLineWhereUniqueInput
    data: XOR<InvoiceLineUpdateWithoutInvoiceInput, InvoiceLineUncheckedUpdateWithoutInvoiceInput>
  }

  export type InvoiceLineUpdateManyWithWhereWithoutInvoiceInput = {
    where: InvoiceLineScalarWhereInput
    data: XOR<InvoiceLineUpdateManyMutationInput, InvoiceLineUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type ReceiptAllocationUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: ReceiptAllocationWhereUniqueInput
    update: XOR<ReceiptAllocationUpdateWithoutInvoiceInput, ReceiptAllocationUncheckedUpdateWithoutInvoiceInput>
    create: XOR<ReceiptAllocationCreateWithoutInvoiceInput, ReceiptAllocationUncheckedCreateWithoutInvoiceInput>
  }

  export type ReceiptAllocationUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: ReceiptAllocationWhereUniqueInput
    data: XOR<ReceiptAllocationUpdateWithoutInvoiceInput, ReceiptAllocationUncheckedUpdateWithoutInvoiceInput>
  }

  export type ReceiptAllocationUpdateManyWithWhereWithoutInvoiceInput = {
    where: ReceiptAllocationScalarWhereInput
    data: XOR<ReceiptAllocationUpdateManyMutationInput, ReceiptAllocationUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type ReceiptAllocationScalarWhereInput = {
    AND?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
    OR?: ReceiptAllocationScalarWhereInput[]
    NOT?: ReceiptAllocationScalarWhereInput | ReceiptAllocationScalarWhereInput[]
    id?: UuidFilter<"ReceiptAllocation"> | string
    receiptId?: UuidFilter<"ReceiptAllocation"> | string
    invoiceId?: UuidFilter<"ReceiptAllocation"> | string
    allocatedAmount?: DecimalFilter<"ReceiptAllocation"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReceiptAllocation"> | Date | string
  }

  export type InvoiceCreateWithoutInvoiceLinesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    receiptAllocations?: ReceiptAllocationCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutInvoiceLinesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    receiptAllocations?: ReceiptAllocationUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutInvoiceLinesInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutInvoiceLinesInput, InvoiceUncheckedCreateWithoutInvoiceLinesInput>
  }

  export type ChargeCreateWithoutInvoiceLinesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    billingItem: BillingItemCreateNestedOneWithoutChargesInput
  }

  export type ChargeUncheckedCreateWithoutInvoiceLinesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    billingItemId: string
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChargeCreateOrConnectWithoutInvoiceLinesInput = {
    where: ChargeWhereUniqueInput
    create: XOR<ChargeCreateWithoutInvoiceLinesInput, ChargeUncheckedCreateWithoutInvoiceLinesInput>
  }

  export type InvoiceUpsertWithoutInvoiceLinesInput = {
    update: XOR<InvoiceUpdateWithoutInvoiceLinesInput, InvoiceUncheckedUpdateWithoutInvoiceLinesInput>
    create: XOR<InvoiceCreateWithoutInvoiceLinesInput, InvoiceUncheckedCreateWithoutInvoiceLinesInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutInvoiceLinesInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutInvoiceLinesInput, InvoiceUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type InvoiceUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiptAllocations?: ReceiptAllocationUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiptAllocations?: ReceiptAllocationUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type ChargeUpsertWithoutInvoiceLinesInput = {
    update: XOR<ChargeUpdateWithoutInvoiceLinesInput, ChargeUncheckedUpdateWithoutInvoiceLinesInput>
    create: XOR<ChargeCreateWithoutInvoiceLinesInput, ChargeUncheckedCreateWithoutInvoiceLinesInput>
    where?: ChargeWhereInput
  }

  export type ChargeUpdateToOneWithWhereWithoutInvoiceLinesInput = {
    where?: ChargeWhereInput
    data: XOR<ChargeUpdateWithoutInvoiceLinesInput, ChargeUncheckedUpdateWithoutInvoiceLinesInput>
  }

  export type ChargeUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billingItem?: BillingItemUpdateOneRequiredWithoutChargesNestedInput
  }

  export type ChargeUncheckedUpdateWithoutInvoiceLinesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    billingItemId?: StringFieldUpdateOperationsInput | string
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationCreateWithoutReceiptInput = {
    id?: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    invoice: InvoiceCreateNestedOneWithoutReceiptAllocationsInput
  }

  export type ReceiptAllocationUncheckedCreateWithoutReceiptInput = {
    id?: string
    invoiceId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReceiptAllocationCreateOrConnectWithoutReceiptInput = {
    where: ReceiptAllocationWhereUniqueInput
    create: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput>
  }

  export type ReceiptAllocationCreateManyReceiptInputEnvelope = {
    data: ReceiptAllocationCreateManyReceiptInput | ReceiptAllocationCreateManyReceiptInput[]
    skipDuplicates?: boolean
  }

  export type ReceiptAllocationUpsertWithWhereUniqueWithoutReceiptInput = {
    where: ReceiptAllocationWhereUniqueInput
    update: XOR<ReceiptAllocationUpdateWithoutReceiptInput, ReceiptAllocationUncheckedUpdateWithoutReceiptInput>
    create: XOR<ReceiptAllocationCreateWithoutReceiptInput, ReceiptAllocationUncheckedCreateWithoutReceiptInput>
  }

  export type ReceiptAllocationUpdateWithWhereUniqueWithoutReceiptInput = {
    where: ReceiptAllocationWhereUniqueInput
    data: XOR<ReceiptAllocationUpdateWithoutReceiptInput, ReceiptAllocationUncheckedUpdateWithoutReceiptInput>
  }

  export type ReceiptAllocationUpdateManyWithWhereWithoutReceiptInput = {
    where: ReceiptAllocationScalarWhereInput
    data: XOR<ReceiptAllocationUpdateManyMutationInput, ReceiptAllocationUncheckedUpdateManyWithoutReceiptInput>
  }

  export type ReceiptCreateWithoutAllocationsInput = {
    id?: string
    tenantId: string
    patientId: string
    invoiceId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    receiptNumber: string
    receiptDate?: Date | string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    paymentMethod: string
    txnReference?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReceiptUncheckedCreateWithoutAllocationsInput = {
    id?: string
    tenantId: string
    patientId: string
    invoiceId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    receiptNumber: string
    receiptDate?: Date | string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    paymentMethod: string
    txnReference?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReceiptCreateOrConnectWithoutAllocationsInput = {
    where: ReceiptWhereUniqueInput
    create: XOR<ReceiptCreateWithoutAllocationsInput, ReceiptUncheckedCreateWithoutAllocationsInput>
  }

  export type InvoiceCreateWithoutReceiptAllocationsInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceUncheckedCreateWithoutReceiptAllocationsInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    mrn?: string | null
    patientDisplayName?: string | null
    invoiceNumber: string
    invoiceDate?: Date | string
    dueDate?: Date | string | null
    grossAmount: Decimal | DecimalJsLike | number | string
    totalDiscounts?: Decimal | DecimalJsLike | number | string
    netAmount: Decimal | DecimalJsLike | number | string
    amountPaid?: Decimal | DecimalJsLike | number | string
    balanceDue: Decimal | DecimalJsLike | number | string
    status?: string
    currency?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    invoiceLines?: InvoiceLineUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type InvoiceCreateOrConnectWithoutReceiptAllocationsInput = {
    where: InvoiceWhereUniqueInput
    create: XOR<InvoiceCreateWithoutReceiptAllocationsInput, InvoiceUncheckedCreateWithoutReceiptAllocationsInput>
  }

  export type ReceiptUpsertWithoutAllocationsInput = {
    update: XOR<ReceiptUpdateWithoutAllocationsInput, ReceiptUncheckedUpdateWithoutAllocationsInput>
    create: XOR<ReceiptCreateWithoutAllocationsInput, ReceiptUncheckedCreateWithoutAllocationsInput>
    where?: ReceiptWhereInput
  }

  export type ReceiptUpdateToOneWithWhereWithoutAllocationsInput = {
    where?: ReceiptWhereInput
    data: XOR<ReceiptUpdateWithoutAllocationsInput, ReceiptUncheckedUpdateWithoutAllocationsInput>
  }

  export type ReceiptUpdateWithoutAllocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptUncheckedUpdateWithoutAllocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: StringFieldUpdateOperationsInput | string
    receiptDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    txnReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceUpsertWithoutReceiptAllocationsInput = {
    update: XOR<InvoiceUpdateWithoutReceiptAllocationsInput, InvoiceUncheckedUpdateWithoutReceiptAllocationsInput>
    create: XOR<InvoiceCreateWithoutReceiptAllocationsInput, InvoiceUncheckedCreateWithoutReceiptAllocationsInput>
    where?: InvoiceWhereInput
  }

  export type InvoiceUpdateToOneWithWhereWithoutReceiptAllocationsInput = {
    where?: InvoiceWhereInput
    data: XOR<InvoiceUpdateWithoutReceiptAllocationsInput, InvoiceUncheckedUpdateWithoutReceiptAllocationsInput>
  }

  export type InvoiceUpdateWithoutReceiptAllocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUpdateManyWithoutInvoiceNestedInput
  }

  export type InvoiceUncheckedUpdateWithoutReceiptAllocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    mrn?: NullableStringFieldUpdateOperationsInput | string | null
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDiscounts?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    netAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    balanceDue?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type ChargePostingAuditCreateWithoutRuleInput = {
    id?: string
    tenantId: string
    chargeId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    event: ChargePostingEventCreateNestedOneWithoutAuditRecordsInput
  }

  export type ChargePostingAuditUncheckedCreateWithoutRuleInput = {
    id?: string
    tenantId: string
    chargeId: string
    eventId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditCreateOrConnectWithoutRuleInput = {
    where: ChargePostingAuditWhereUniqueInput
    create: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput>
  }

  export type ChargePostingAuditCreateManyRuleInputEnvelope = {
    data: ChargePostingAuditCreateManyRuleInput | ChargePostingAuditCreateManyRuleInput[]
    skipDuplicates?: boolean
  }

  export type ChargePostingAuditUpsertWithWhereUniqueWithoutRuleInput = {
    where: ChargePostingAuditWhereUniqueInput
    update: XOR<ChargePostingAuditUpdateWithoutRuleInput, ChargePostingAuditUncheckedUpdateWithoutRuleInput>
    create: XOR<ChargePostingAuditCreateWithoutRuleInput, ChargePostingAuditUncheckedCreateWithoutRuleInput>
  }

  export type ChargePostingAuditUpdateWithWhereUniqueWithoutRuleInput = {
    where: ChargePostingAuditWhereUniqueInput
    data: XOR<ChargePostingAuditUpdateWithoutRuleInput, ChargePostingAuditUncheckedUpdateWithoutRuleInput>
  }

  export type ChargePostingAuditUpdateManyWithWhereWithoutRuleInput = {
    where: ChargePostingAuditScalarWhereInput
    data: XOR<ChargePostingAuditUpdateManyMutationInput, ChargePostingAuditUncheckedUpdateManyWithoutRuleInput>
  }

  export type ChargePostingAuditScalarWhereInput = {
    AND?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
    OR?: ChargePostingAuditScalarWhereInput[]
    NOT?: ChargePostingAuditScalarWhereInput | ChargePostingAuditScalarWhereInput[]
    id?: UuidFilter<"ChargePostingAudit"> | string
    tenantId?: UuidFilter<"ChargePostingAudit"> | string
    chargeId?: UuidFilter<"ChargePostingAudit"> | string
    eventId?: UuidFilter<"ChargePostingAudit"> | string
    ruleId?: UuidFilter<"ChargePostingAudit"> | string
    conditionsMet?: JsonNullableFilter<"ChargePostingAudit">
    calculationDetails?: JsonNullableFilter<"ChargePostingAudit">
    createdAt?: DateTimeFilter<"ChargePostingAudit"> | Date | string
  }

  export type ChargePostingAuditCreateWithoutEventInput = {
    id?: string
    tenantId: string
    chargeId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    rule: ChargePostingRuleCreateNestedOneWithoutAuditRecordsInput
  }

  export type ChargePostingAuditUncheckedCreateWithoutEventInput = {
    id?: string
    tenantId: string
    chargeId: string
    ruleId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditCreateOrConnectWithoutEventInput = {
    where: ChargePostingAuditWhereUniqueInput
    create: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput>
  }

  export type ChargePostingAuditCreateManyEventInputEnvelope = {
    data: ChargePostingAuditCreateManyEventInput | ChargePostingAuditCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type ChargePostingAuditUpsertWithWhereUniqueWithoutEventInput = {
    where: ChargePostingAuditWhereUniqueInput
    update: XOR<ChargePostingAuditUpdateWithoutEventInput, ChargePostingAuditUncheckedUpdateWithoutEventInput>
    create: XOR<ChargePostingAuditCreateWithoutEventInput, ChargePostingAuditUncheckedCreateWithoutEventInput>
  }

  export type ChargePostingAuditUpdateWithWhereUniqueWithoutEventInput = {
    where: ChargePostingAuditWhereUniqueInput
    data: XOR<ChargePostingAuditUpdateWithoutEventInput, ChargePostingAuditUncheckedUpdateWithoutEventInput>
  }

  export type ChargePostingAuditUpdateManyWithWhereWithoutEventInput = {
    where: ChargePostingAuditScalarWhereInput
    data: XOR<ChargePostingAuditUpdateManyMutationInput, ChargePostingAuditUncheckedUpdateManyWithoutEventInput>
  }

  export type ChargePostingEventCreateWithoutAuditRecordsInput = {
    id?: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonNullValueInput | InputJsonValue
    patientId: string
    encounterId?: string | null
    processed?: boolean
    processedAt?: Date | string | null
    rulesMatched?: number
    chargesCreated?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type ChargePostingEventUncheckedCreateWithoutAuditRecordsInput = {
    id?: string
    tenantId: string
    eventType: string
    eventSource: string
    eventId: string
    eventData: JsonNullValueInput | InputJsonValue
    patientId: string
    encounterId?: string | null
    processed?: boolean
    processedAt?: Date | string | null
    rulesMatched?: number
    chargesCreated?: number
    error?: string | null
    createdAt?: Date | string
  }

  export type ChargePostingEventCreateOrConnectWithoutAuditRecordsInput = {
    where: ChargePostingEventWhereUniqueInput
    create: XOR<ChargePostingEventCreateWithoutAuditRecordsInput, ChargePostingEventUncheckedCreateWithoutAuditRecordsInput>
  }

  export type ChargePostingRuleCreateWithoutAuditRecordsInput = {
    id?: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId?: string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: string
    basePrice?: Decimal | DecimalJsLike | number | string | null
    priceSource?: string
    quantitySource?: string
    discountPercentage?: Decimal | DecimalJsLike | number | string | null
    taxPercentage?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    priority?: number
    autoApprove?: boolean
    description?: string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
  }

  export type ChargePostingRuleUncheckedCreateWithoutAuditRecordsInput = {
    id?: string
    tenantId: string
    ruleName: string
    eventType: string
    eventSource: string
    billingItemType: string
    billingItemId?: string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: string
    basePrice?: Decimal | DecimalJsLike | number | string | null
    priceSource?: string
    quantitySource?: string
    discountPercentage?: Decimal | DecimalJsLike | number | string | null
    taxPercentage?: Decimal | DecimalJsLike | number | string | null
    isActive?: boolean
    priority?: number
    autoApprove?: boolean
    description?: string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    updatedBy?: string | null
  }

  export type ChargePostingRuleCreateOrConnectWithoutAuditRecordsInput = {
    where: ChargePostingRuleWhereUniqueInput
    create: XOR<ChargePostingRuleCreateWithoutAuditRecordsInput, ChargePostingRuleUncheckedCreateWithoutAuditRecordsInput>
  }

  export type ChargePostingEventUpsertWithoutAuditRecordsInput = {
    update: XOR<ChargePostingEventUpdateWithoutAuditRecordsInput, ChargePostingEventUncheckedUpdateWithoutAuditRecordsInput>
    create: XOR<ChargePostingEventCreateWithoutAuditRecordsInput, ChargePostingEventUncheckedCreateWithoutAuditRecordsInput>
    where?: ChargePostingEventWhereInput
  }

  export type ChargePostingEventUpdateToOneWithWhereWithoutAuditRecordsInput = {
    where?: ChargePostingEventWhereInput
    data: XOR<ChargePostingEventUpdateWithoutAuditRecordsInput, ChargePostingEventUncheckedUpdateWithoutAuditRecordsInput>
  }

  export type ChargePostingEventUpdateWithoutAuditRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingEventUncheckedUpdateWithoutAuditRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    eventData?: JsonNullValueInput | InputJsonValue
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rulesMatched?: IntFieldUpdateOperationsInput | number
    chargesCreated?: IntFieldUpdateOperationsInput | number
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingRuleUpsertWithoutAuditRecordsInput = {
    update: XOR<ChargePostingRuleUpdateWithoutAuditRecordsInput, ChargePostingRuleUncheckedUpdateWithoutAuditRecordsInput>
    create: XOR<ChargePostingRuleCreateWithoutAuditRecordsInput, ChargePostingRuleUncheckedCreateWithoutAuditRecordsInput>
    where?: ChargePostingRuleWhereInput
  }

  export type ChargePostingRuleUpdateToOneWithWhereWithoutAuditRecordsInput = {
    where?: ChargePostingRuleWhereInput
    data: XOR<ChargePostingRuleUpdateWithoutAuditRecordsInput, ChargePostingRuleUncheckedUpdateWithoutAuditRecordsInput>
  }

  export type ChargePostingRuleUpdateWithoutAuditRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChargePostingRuleUncheckedUpdateWithoutAuditRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleName?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSource?: StringFieldUpdateOperationsInput | string
    billingItemType?: StringFieldUpdateOperationsInput | string
    billingItemId?: NullableStringFieldUpdateOperationsInput | string | null
    conditions?: NullableJsonNullValueInput | InputJsonValue
    chargeCalculationMethod?: StringFieldUpdateOperationsInput | string
    basePrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceSource?: StringFieldUpdateOperationsInput | string
    quantitySource?: StringFieldUpdateOperationsInput | string
    discountPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    taxPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    priority?: IntFieldUpdateOperationsInput | number
    autoApprove?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    configuration?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PolicyCreateManyPayerInput = {
    id?: string
    tenantId: string
    patientId: string
    policyNumber: string
    groupNumber?: string | null
    payerName: string
    relationship?: string | null
    effectiveDate?: Date | string | null
    expirationDate?: Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: boolean
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClaimCreateManyPayerInput = {
    id?: string
    tenantId: string
    claimNumber: string
    status?: string
    patientId: string
    encounterId?: string | null
    totalAmount?: Decimal | DecimalJsLike | number | string
    currency?: string
    serviceDate: Date | string
    submittedAt?: Date | string | null
    adjudicatedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageCreateManyPayerInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    policyId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PolicyUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounterCoverages?: EncounterCoverageUpdateManyWithoutPolicyNestedInput
  }

  export type PolicyUncheckedUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounterCoverages?: EncounterCoverageUncheckedUpdateManyWithoutPolicyNestedInput
  }

  export type PolicyUncheckedUpdateManyWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyNumber?: StringFieldUpdateOperationsInput | string
    groupNumber?: NullableStringFieldUpdateOperationsInput | string | null
    payerName?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expirationDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    benefits?: JsonNullValueInput | InputJsonValue
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimUncheckedUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClaimUncheckedUpdateManyWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    claimNumber?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    totalAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    serviceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    adjudicatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    policy?: PolicyUpdateOneWithoutEncounterCoveragesNestedInput
  }

  export type EncounterCoverageUncheckedUpdateWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageUncheckedUpdateManyWithoutPayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    policyId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageCreateManyPolicyInput = {
    id?: string
    tenantId: string
    encounterId: string
    patientId: string
    payerId?: string | null
    financialClass: string
    coverageLevel?: string
    planName?: string | null
    memberId?: string | null
    memberName?: string | null
    networkName?: string | null
    copayAmount?: Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: string | null
    preauthRequestId?: string | null
    costEstimateId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCoverageUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payer?: PayerUpdateOneWithoutEncounterCoveragesNestedInput
  }

  export type EncounterCoverageUncheckedUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCoverageUncheckedUpdateManyWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    encounterId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    payerId?: NullableStringFieldUpdateOperationsInput | string | null
    financialClass?: StringFieldUpdateOperationsInput | string
    coverageLevel?: StringFieldUpdateOperationsInput | string
    planName?: NullableStringFieldUpdateOperationsInput | string | null
    memberId?: NullableStringFieldUpdateOperationsInput | string | null
    memberName?: NullableStringFieldUpdateOperationsInput | string | null
    networkName?: NullableStringFieldUpdateOperationsInput | string | null
    copayAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    coinsurancePct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    deductibleSnapshot?: NullableJsonNullValueInput | InputJsonValue
    benefitsSnapshot?: NullableJsonNullValueInput | InputJsonValue
    eligibilityRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    preauthRequestId?: NullableStringFieldUpdateOperationsInput | string | null
    costEstimateId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargeCreateManyBillingItemInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    chargeDate?: Date | string
    quantity?: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    grossAmount: Decimal | DecimalJsLike | number | string
    patientResponsibility?: Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: Decimal | DecimalJsLike | number | string | null
    status?: string
    sourceType?: string | null
    sourceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChargeUpdateWithoutBillingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUpdateManyWithoutChargeNestedInput
  }

  export type ChargeUncheckedUpdateWithoutBillingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoiceLines?: InvoiceLineUncheckedUpdateManyWithoutChargeNestedInput
  }

  export type ChargeUncheckedUpdateManyWithoutBillingItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    chargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    grossAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    patientResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payerResponsibility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    sourceType?: NullableStringFieldUpdateOperationsInput | string | null
    sourceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateManyChargeInput = {
    id?: string
    invoiceId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InvoiceLineUpdateWithoutChargeInput = {
    id?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: InvoiceUpdateOneRequiredWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateWithoutChargeInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUncheckedUpdateManyWithoutChargeInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineCreateManyInvoiceInput = {
    id?: string
    chargeId: string
    lineNumber: number
    description?: string | null
    quantity: Decimal | DecimalJsLike | number | string
    unitPrice: Decimal | DecimalJsLike | number | string
    lineAmount: Decimal | DecimalJsLike | number | string
    lineDiscount?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReceiptAllocationCreateManyInvoiceInput = {
    id?: string
    receiptId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type InvoiceLineUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    charge?: ChargeUpdateOneRequiredWithoutInvoiceLinesNestedInput
  }

  export type InvoiceLineUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvoiceLineUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    lineNumber?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unitPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lineDiscount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receipt?: ReceiptUpdateOneRequiredWithoutAllocationsNestedInput
  }

  export type ReceiptAllocationUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiptId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationCreateManyReceiptInput = {
    id?: string
    invoiceId: string
    allocatedAmount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReceiptAllocationUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: InvoiceUpdateOneRequiredWithoutReceiptAllocationsNestedInput
  }

  export type ReceiptAllocationUncheckedUpdateWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReceiptAllocationUncheckedUpdateManyWithoutReceiptInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    allocatedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditCreateManyRuleInput = {
    id?: string
    tenantId: string
    chargeId: string
    eventId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: ChargePostingEventUpdateOneRequiredWithoutAuditRecordsNestedInput
  }

  export type ChargePostingAuditUncheckedUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditUncheckedUpdateManyWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditCreateManyEventInput = {
    id?: string
    tenantId: string
    chargeId: string
    ruleId: string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChargePostingAuditUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rule?: ChargePostingRuleUpdateOneRequiredWithoutAuditRecordsNestedInput
  }

  export type ChargePostingAuditUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChargePostingAuditUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    chargeId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    conditionsMet?: NullableJsonNullValueInput | InputJsonValue
    calculationDetails?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PayerCountOutputTypeDefaultArgs instead
     */
    export type PayerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PolicyCountOutputTypeDefaultArgs instead
     */
    export type PolicyCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PolicyCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingItemCountOutputTypeDefaultArgs instead
     */
    export type BillingItemCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingItemCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargeCountOutputTypeDefaultArgs instead
     */
    export type ChargeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceCountOutputTypeDefaultArgs instead
     */
    export type InvoiceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReceiptCountOutputTypeDefaultArgs instead
     */
    export type ReceiptCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReceiptCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargePostingRuleCountOutputTypeDefaultArgs instead
     */
    export type ChargePostingRuleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargePostingRuleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargePostingEventCountOutputTypeDefaultArgs instead
     */
    export type ChargePostingEventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargePostingEventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PayerDefaultArgs instead
     */
    export type PayerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PayerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PolicyDefaultArgs instead
     */
    export type PolicyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PolicyDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClaimDefaultArgs instead
     */
    export type ClaimArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClaimDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EncounterCoverageDefaultArgs instead
     */
    export type EncounterCoverageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EncounterCoverageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingItemDefaultArgs instead
     */
    export type BillingItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargeDefaultArgs instead
     */
    export type ChargeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceDefaultArgs instead
     */
    export type InvoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InvoiceLineDefaultArgs instead
     */
    export type InvoiceLineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InvoiceLineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReceiptDefaultArgs instead
     */
    export type ReceiptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReceiptDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReceiptAllocationDefaultArgs instead
     */
    export type ReceiptAllocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReceiptAllocationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargePostingRuleDefaultArgs instead
     */
    export type ChargePostingRuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargePostingRuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargePostingEventDefaultArgs instead
     */
    export type ChargePostingEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargePostingEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChargePostingAuditDefaultArgs instead
     */
    export type ChargePostingAuditArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChargePostingAuditDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
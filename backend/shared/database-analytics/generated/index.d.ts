
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
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model UsageEvent
 * 
 */
export type UsageEvent = $Result.DefaultSelection<Prisma.$UsageEventPayload>
/**
 * Model AiQueryLog
 * AI Query Logs - Audit trail for all AI-powered operations
 */
export type AiQueryLog = $Result.DefaultSelection<Prisma.$AiQueryLogPayload>
/**
 * Model AiUsageMetric
 * AI Usage Metrics - Aggregated usage statistics per tenant
 */
export type AiUsageMetric = $Result.DefaultSelection<Prisma.$AiUsageMetricPayload>
/**
 * Model SemanticMetric
 * Semantic Metrics - What can be measured in reports
 */
export type SemanticMetric = $Result.DefaultSelection<Prisma.$SemanticMetricPayload>
/**
 * Model SemanticDimension
 * Semantic Dimensions - What can be grouped/filtered by
 */
export type SemanticDimension = $Result.DefaultSelection<Prisma.$SemanticDimensionPayload>
/**
 * Model SemanticJoinPath
 * Semantic Join Paths - How tables connect for cross-table queries
 */
export type SemanticJoinPath = $Result.DefaultSelection<Prisma.$SemanticJoinPathPayload>
/**
 * Model SavedReport
 * Saved Reports - Persisted report definitions for quick access
 */
export type SavedReport = $Result.DefaultSelection<Prisma.$SavedReportPayload>
/**
 * Model ClinicalObservationDaily
 * Daily aggregated clinical observations - refreshed by scheduled job
 */
export type ClinicalObservationDaily = $Result.DefaultSelection<Prisma.$ClinicalObservationDailyPayload>
/**
 * Model DiagnosisDailyAggregate
 * Daily aggregated diagnosis counts - refreshed by scheduled job
 */
export type DiagnosisDailyAggregate = $Result.DefaultSelection<Prisma.$DiagnosisDailyAggregatePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuditLogs
 * const auditLogs = await prisma.auditLog.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more AuditLogs
   * const auditLogs = await prisma.auditLog.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usageEvent`: Exposes CRUD operations for the **UsageEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageEvents
    * const usageEvents = await prisma.usageEvent.findMany()
    * ```
    */
  get usageEvent(): Prisma.UsageEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiQueryLog`: Exposes CRUD operations for the **AiQueryLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiQueryLogs
    * const aiQueryLogs = await prisma.aiQueryLog.findMany()
    * ```
    */
  get aiQueryLog(): Prisma.AiQueryLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiUsageMetric`: Exposes CRUD operations for the **AiUsageMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiUsageMetrics
    * const aiUsageMetrics = await prisma.aiUsageMetric.findMany()
    * ```
    */
  get aiUsageMetric(): Prisma.AiUsageMetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.semanticMetric`: Exposes CRUD operations for the **SemanticMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SemanticMetrics
    * const semanticMetrics = await prisma.semanticMetric.findMany()
    * ```
    */
  get semanticMetric(): Prisma.SemanticMetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.semanticDimension`: Exposes CRUD operations for the **SemanticDimension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SemanticDimensions
    * const semanticDimensions = await prisma.semanticDimension.findMany()
    * ```
    */
  get semanticDimension(): Prisma.SemanticDimensionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.semanticJoinPath`: Exposes CRUD operations for the **SemanticJoinPath** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SemanticJoinPaths
    * const semanticJoinPaths = await prisma.semanticJoinPath.findMany()
    * ```
    */
  get semanticJoinPath(): Prisma.SemanticJoinPathDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.savedReport`: Exposes CRUD operations for the **SavedReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SavedReports
    * const savedReports = await prisma.savedReport.findMany()
    * ```
    */
  get savedReport(): Prisma.SavedReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clinicalObservationDaily`: Exposes CRUD operations for the **ClinicalObservationDaily** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClinicalObservationDailies
    * const clinicalObservationDailies = await prisma.clinicalObservationDaily.findMany()
    * ```
    */
  get clinicalObservationDaily(): Prisma.ClinicalObservationDailyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.diagnosisDailyAggregate`: Exposes CRUD operations for the **DiagnosisDailyAggregate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiagnosisDailyAggregates
    * const diagnosisDailyAggregates = await prisma.diagnosisDailyAggregate.findMany()
    * ```
    */
  get diagnosisDailyAggregate(): Prisma.DiagnosisDailyAggregateDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    AuditLog: 'AuditLog',
    UsageEvent: 'UsageEvent',
    AiQueryLog: 'AiQueryLog',
    AiUsageMetric: 'AiUsageMetric',
    SemanticMetric: 'SemanticMetric',
    SemanticDimension: 'SemanticDimension',
    SemanticJoinPath: 'SemanticJoinPath',
    SavedReport: 'SavedReport',
    ClinicalObservationDaily: 'ClinicalObservationDaily',
    DiagnosisDailyAggregate: 'DiagnosisDailyAggregate'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "auditLog" | "usageEvent" | "aiQueryLog" | "aiUsageMetric" | "semanticMetric" | "semanticDimension" | "semanticJoinPath" | "savedReport" | "clinicalObservationDaily" | "diagnosisDailyAggregate"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      UsageEvent: {
        payload: Prisma.$UsageEventPayload<ExtArgs>
        fields: Prisma.UsageEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          findFirst: {
            args: Prisma.UsageEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          findMany: {
            args: Prisma.UsageEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>[]
          }
          create: {
            args: Prisma.UsageEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          createMany: {
            args: Prisma.UsageEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>[]
          }
          delete: {
            args: Prisma.UsageEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          update: {
            args: Prisma.UsageEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          deleteMany: {
            args: Prisma.UsageEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsageEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UsageEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>[]
          }
          upsert: {
            args: Prisma.UsageEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsageEventPayload>
          }
          aggregate: {
            args: Prisma.UsageEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsageEvent>
          }
          groupBy: {
            args: Prisma.UsageEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsageEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageEventCountArgs<ExtArgs>
            result: $Utils.Optional<UsageEventCountAggregateOutputType> | number
          }
        }
      }
      AiQueryLog: {
        payload: Prisma.$AiQueryLogPayload<ExtArgs>
        fields: Prisma.AiQueryLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiQueryLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiQueryLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          findFirst: {
            args: Prisma.AiQueryLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiQueryLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          findMany: {
            args: Prisma.AiQueryLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>[]
          }
          create: {
            args: Prisma.AiQueryLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          createMany: {
            args: Prisma.AiQueryLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiQueryLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>[]
          }
          delete: {
            args: Prisma.AiQueryLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          update: {
            args: Prisma.AiQueryLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          deleteMany: {
            args: Prisma.AiQueryLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiQueryLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiQueryLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>[]
          }
          upsert: {
            args: Prisma.AiQueryLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiQueryLogPayload>
          }
          aggregate: {
            args: Prisma.AiQueryLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiQueryLog>
          }
          groupBy: {
            args: Prisma.AiQueryLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiQueryLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiQueryLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiQueryLogCountAggregateOutputType> | number
          }
        }
      }
      AiUsageMetric: {
        payload: Prisma.$AiUsageMetricPayload<ExtArgs>
        fields: Prisma.AiUsageMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiUsageMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiUsageMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          findFirst: {
            args: Prisma.AiUsageMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiUsageMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          findMany: {
            args: Prisma.AiUsageMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[]
          }
          create: {
            args: Prisma.AiUsageMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          createMany: {
            args: Prisma.AiUsageMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiUsageMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[]
          }
          delete: {
            args: Prisma.AiUsageMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          update: {
            args: Prisma.AiUsageMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          deleteMany: {
            args: Prisma.AiUsageMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiUsageMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiUsageMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>[]
          }
          upsert: {
            args: Prisma.AiUsageMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageMetricPayload>
          }
          aggregate: {
            args: Prisma.AiUsageMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiUsageMetric>
          }
          groupBy: {
            args: Prisma.AiUsageMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiUsageMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiUsageMetricCountArgs<ExtArgs>
            result: $Utils.Optional<AiUsageMetricCountAggregateOutputType> | number
          }
        }
      }
      SemanticMetric: {
        payload: Prisma.$SemanticMetricPayload<ExtArgs>
        fields: Prisma.SemanticMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SemanticMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SemanticMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          findFirst: {
            args: Prisma.SemanticMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SemanticMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          findMany: {
            args: Prisma.SemanticMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>[]
          }
          create: {
            args: Prisma.SemanticMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          createMany: {
            args: Prisma.SemanticMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SemanticMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>[]
          }
          delete: {
            args: Prisma.SemanticMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          update: {
            args: Prisma.SemanticMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          deleteMany: {
            args: Prisma.SemanticMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SemanticMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SemanticMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>[]
          }
          upsert: {
            args: Prisma.SemanticMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticMetricPayload>
          }
          aggregate: {
            args: Prisma.SemanticMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSemanticMetric>
          }
          groupBy: {
            args: Prisma.SemanticMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<SemanticMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.SemanticMetricCountArgs<ExtArgs>
            result: $Utils.Optional<SemanticMetricCountAggregateOutputType> | number
          }
        }
      }
      SemanticDimension: {
        payload: Prisma.$SemanticDimensionPayload<ExtArgs>
        fields: Prisma.SemanticDimensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SemanticDimensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SemanticDimensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          findFirst: {
            args: Prisma.SemanticDimensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SemanticDimensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          findMany: {
            args: Prisma.SemanticDimensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>[]
          }
          create: {
            args: Prisma.SemanticDimensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          createMany: {
            args: Prisma.SemanticDimensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SemanticDimensionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>[]
          }
          delete: {
            args: Prisma.SemanticDimensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          update: {
            args: Prisma.SemanticDimensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          deleteMany: {
            args: Prisma.SemanticDimensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SemanticDimensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SemanticDimensionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>[]
          }
          upsert: {
            args: Prisma.SemanticDimensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticDimensionPayload>
          }
          aggregate: {
            args: Prisma.SemanticDimensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSemanticDimension>
          }
          groupBy: {
            args: Prisma.SemanticDimensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SemanticDimensionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SemanticDimensionCountArgs<ExtArgs>
            result: $Utils.Optional<SemanticDimensionCountAggregateOutputType> | number
          }
        }
      }
      SemanticJoinPath: {
        payload: Prisma.$SemanticJoinPathPayload<ExtArgs>
        fields: Prisma.SemanticJoinPathFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SemanticJoinPathFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SemanticJoinPathFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          findFirst: {
            args: Prisma.SemanticJoinPathFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SemanticJoinPathFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          findMany: {
            args: Prisma.SemanticJoinPathFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>[]
          }
          create: {
            args: Prisma.SemanticJoinPathCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          createMany: {
            args: Prisma.SemanticJoinPathCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SemanticJoinPathCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>[]
          }
          delete: {
            args: Prisma.SemanticJoinPathDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          update: {
            args: Prisma.SemanticJoinPathUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          deleteMany: {
            args: Prisma.SemanticJoinPathDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SemanticJoinPathUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SemanticJoinPathUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>[]
          }
          upsert: {
            args: Prisma.SemanticJoinPathUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SemanticJoinPathPayload>
          }
          aggregate: {
            args: Prisma.SemanticJoinPathAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSemanticJoinPath>
          }
          groupBy: {
            args: Prisma.SemanticJoinPathGroupByArgs<ExtArgs>
            result: $Utils.Optional<SemanticJoinPathGroupByOutputType>[]
          }
          count: {
            args: Prisma.SemanticJoinPathCountArgs<ExtArgs>
            result: $Utils.Optional<SemanticJoinPathCountAggregateOutputType> | number
          }
        }
      }
      SavedReport: {
        payload: Prisma.$SavedReportPayload<ExtArgs>
        fields: Prisma.SavedReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SavedReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SavedReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          findFirst: {
            args: Prisma.SavedReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SavedReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          findMany: {
            args: Prisma.SavedReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>[]
          }
          create: {
            args: Prisma.SavedReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          createMany: {
            args: Prisma.SavedReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SavedReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>[]
          }
          delete: {
            args: Prisma.SavedReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          update: {
            args: Prisma.SavedReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          deleteMany: {
            args: Prisma.SavedReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SavedReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SavedReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>[]
          }
          upsert: {
            args: Prisma.SavedReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SavedReportPayload>
          }
          aggregate: {
            args: Prisma.SavedReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSavedReport>
          }
          groupBy: {
            args: Prisma.SavedReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<SavedReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.SavedReportCountArgs<ExtArgs>
            result: $Utils.Optional<SavedReportCountAggregateOutputType> | number
          }
        }
      }
      ClinicalObservationDaily: {
        payload: Prisma.$ClinicalObservationDailyPayload<ExtArgs>
        fields: Prisma.ClinicalObservationDailyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClinicalObservationDailyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClinicalObservationDailyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          findFirst: {
            args: Prisma.ClinicalObservationDailyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClinicalObservationDailyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          findMany: {
            args: Prisma.ClinicalObservationDailyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>[]
          }
          create: {
            args: Prisma.ClinicalObservationDailyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          createMany: {
            args: Prisma.ClinicalObservationDailyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClinicalObservationDailyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>[]
          }
          delete: {
            args: Prisma.ClinicalObservationDailyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          update: {
            args: Prisma.ClinicalObservationDailyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          deleteMany: {
            args: Prisma.ClinicalObservationDailyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClinicalObservationDailyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClinicalObservationDailyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>[]
          }
          upsert: {
            args: Prisma.ClinicalObservationDailyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalObservationDailyPayload>
          }
          aggregate: {
            args: Prisma.ClinicalObservationDailyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClinicalObservationDaily>
          }
          groupBy: {
            args: Prisma.ClinicalObservationDailyGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClinicalObservationDailyGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClinicalObservationDailyCountArgs<ExtArgs>
            result: $Utils.Optional<ClinicalObservationDailyCountAggregateOutputType> | number
          }
        }
      }
      DiagnosisDailyAggregate: {
        payload: Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>
        fields: Prisma.DiagnosisDailyAggregateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiagnosisDailyAggregateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiagnosisDailyAggregateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          findFirst: {
            args: Prisma.DiagnosisDailyAggregateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiagnosisDailyAggregateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          findMany: {
            args: Prisma.DiagnosisDailyAggregateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>[]
          }
          create: {
            args: Prisma.DiagnosisDailyAggregateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          createMany: {
            args: Prisma.DiagnosisDailyAggregateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiagnosisDailyAggregateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>[]
          }
          delete: {
            args: Prisma.DiagnosisDailyAggregateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          update: {
            args: Prisma.DiagnosisDailyAggregateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          deleteMany: {
            args: Prisma.DiagnosisDailyAggregateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiagnosisDailyAggregateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DiagnosisDailyAggregateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>[]
          }
          upsert: {
            args: Prisma.DiagnosisDailyAggregateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiagnosisDailyAggregatePayload>
          }
          aggregate: {
            args: Prisma.DiagnosisDailyAggregateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiagnosisDailyAggregate>
          }
          groupBy: {
            args: Prisma.DiagnosisDailyAggregateGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisDailyAggregateGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiagnosisDailyAggregateCountArgs<ExtArgs>
            result: $Utils.Optional<DiagnosisDailyAggregateCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    auditLog?: AuditLogOmit
    usageEvent?: UsageEventOmit
    aiQueryLog?: AiQueryLogOmit
    aiUsageMetric?: AiUsageMetricOmit
    semanticMetric?: SemanticMetricOmit
    semanticDimension?: SemanticDimensionOmit
    semanticJoinPath?: SemanticJoinPathOmit
    savedReport?: SavedReportOmit
    clinicalObservationDaily?: ClinicalObservationDailyOmit
    diagnosisDailyAggregate?: DiagnosisDailyAggregateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Models
   */

  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    actorId: string | null
    action: string | null
    resource: string | null
    occurredAt: Date | null
    receivedAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    actorId: string | null
    action: string | null
    resource: string | null
    occurredAt: Date | null
    receivedAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tenantId: number
    actorId: number
    action: number
    resource: number
    metadata: number
    occurredAt: number
    receivedAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    actorId?: true
    action?: true
    resource?: true
    occurredAt?: true
    receivedAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    actorId?: true
    action?: true
    resource?: true
    occurredAt?: true
    receivedAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    actorId?: true
    action?: true
    resource?: true
    metadata?: true
    occurredAt?: true
    receivedAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    tenantId: string
    actorId: string | null
    action: string
    resource: string
    metadata: JsonValue
    occurredAt: Date
    receivedAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorId?: boolean
    action?: boolean
    resource?: boolean
    metadata?: boolean
    occurredAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorId?: boolean
    action?: boolean
    resource?: boolean
    metadata?: boolean
    occurredAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    actorId?: boolean
    action?: boolean
    resource?: boolean
    metadata?: boolean
    occurredAt?: boolean
    receivedAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    actorId?: boolean
    action?: boolean
    resource?: boolean
    metadata?: boolean
    occurredAt?: boolean
    receivedAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "actorId" | "action" | "resource" | "metadata" | "occurredAt" | "receivedAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      actorId: string | null
      action: string
      resource: string
      metadata: Prisma.JsonValue
      occurredAt: Date
      receivedAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly tenantId: FieldRef<"AuditLog", 'String'>
    readonly actorId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly resource: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly occurredAt: FieldRef<"AuditLog", 'DateTime'>
    readonly receivedAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model UsageEvent
   */

  export type AggregateUsageEvent = {
    _count: UsageEventCountAggregateOutputType | null
    _min: UsageEventMinAggregateOutputType | null
    _max: UsageEventMaxAggregateOutputType | null
  }

  export type UsageEventMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    eventType: string | null
    occurredAt: Date | null
  }

  export type UsageEventMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    eventType: string | null
    occurredAt: Date | null
  }

  export type UsageEventCountAggregateOutputType = {
    id: number
    tenantId: number
    eventType: number
    payload: number
    occurredAt: number
    _all: number
  }


  export type UsageEventMinAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    occurredAt?: true
  }

  export type UsageEventMaxAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    occurredAt?: true
  }

  export type UsageEventCountAggregateInputType = {
    id?: true
    tenantId?: true
    eventType?: true
    payload?: true
    occurredAt?: true
    _all?: true
  }

  export type UsageEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageEvent to aggregate.
     */
    where?: UsageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageEvents to fetch.
     */
    orderBy?: UsageEventOrderByWithRelationInput | UsageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageEvents
    **/
    _count?: true | UsageEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageEventMaxAggregateInputType
  }

  export type GetUsageEventAggregateType<T extends UsageEventAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageEvent[P]>
      : GetScalarType<T[P], AggregateUsageEvent[P]>
  }




  export type UsageEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageEventWhereInput
    orderBy?: UsageEventOrderByWithAggregationInput | UsageEventOrderByWithAggregationInput[]
    by: UsageEventScalarFieldEnum[] | UsageEventScalarFieldEnum
    having?: UsageEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageEventCountAggregateInputType | true
    _min?: UsageEventMinAggregateInputType
    _max?: UsageEventMaxAggregateInputType
  }

  export type UsageEventGroupByOutputType = {
    id: string
    tenantId: string
    eventType: string
    payload: JsonValue
    occurredAt: Date
    _count: UsageEventCountAggregateOutputType | null
    _min: UsageEventMinAggregateOutputType | null
    _max: UsageEventMaxAggregateOutputType | null
  }

  type GetUsageEventGroupByPayload<T extends UsageEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageEventGroupByOutputType[P]>
            : GetScalarType<T[P], UsageEventGroupByOutputType[P]>
        }
      >
    >


  export type UsageEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    payload?: boolean
    occurredAt?: boolean
  }, ExtArgs["result"]["usageEvent"]>

  export type UsageEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    payload?: boolean
    occurredAt?: boolean
  }, ExtArgs["result"]["usageEvent"]>

  export type UsageEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    payload?: boolean
    occurredAt?: boolean
  }, ExtArgs["result"]["usageEvent"]>

  export type UsageEventSelectScalar = {
    id?: boolean
    tenantId?: boolean
    eventType?: boolean
    payload?: boolean
    occurredAt?: boolean
  }

  export type UsageEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "eventType" | "payload" | "occurredAt", ExtArgs["result"]["usageEvent"]>

  export type $UsageEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      eventType: string
      payload: Prisma.JsonValue
      occurredAt: Date
    }, ExtArgs["result"]["usageEvent"]>
    composites: {}
  }

  type UsageEventGetPayload<S extends boolean | null | undefined | UsageEventDefaultArgs> = $Result.GetResult<Prisma.$UsageEventPayload, S>

  type UsageEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsageEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsageEventCountAggregateInputType | true
    }

  export interface UsageEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageEvent'], meta: { name: 'UsageEvent' } }
    /**
     * Find zero or one UsageEvent that matches the filter.
     * @param {UsageEventFindUniqueArgs} args - Arguments to find a UsageEvent
     * @example
     * // Get one UsageEvent
     * const usageEvent = await prisma.usageEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsageEventFindUniqueArgs>(args: SelectSubset<T, UsageEventFindUniqueArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UsageEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsageEventFindUniqueOrThrowArgs} args - Arguments to find a UsageEvent
     * @example
     * // Get one UsageEvent
     * const usageEvent = await prisma.usageEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsageEventFindUniqueOrThrowArgs>(args: SelectSubset<T, UsageEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventFindFirstArgs} args - Arguments to find a UsageEvent
     * @example
     * // Get one UsageEvent
     * const usageEvent = await prisma.usageEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsageEventFindFirstArgs>(args?: SelectSubset<T, UsageEventFindFirstArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UsageEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventFindFirstOrThrowArgs} args - Arguments to find a UsageEvent
     * @example
     * // Get one UsageEvent
     * const usageEvent = await prisma.usageEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsageEventFindFirstOrThrowArgs>(args?: SelectSubset<T, UsageEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UsageEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageEvents
     * const usageEvents = await prisma.usageEvent.findMany()
     * 
     * // Get first 10 UsageEvents
     * const usageEvents = await prisma.usageEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageEventWithIdOnly = await prisma.usageEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsageEventFindManyArgs>(args?: SelectSubset<T, UsageEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UsageEvent.
     * @param {UsageEventCreateArgs} args - Arguments to create a UsageEvent.
     * @example
     * // Create one UsageEvent
     * const UsageEvent = await prisma.usageEvent.create({
     *   data: {
     *     // ... data to create a UsageEvent
     *   }
     * })
     * 
     */
    create<T extends UsageEventCreateArgs>(args: SelectSubset<T, UsageEventCreateArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UsageEvents.
     * @param {UsageEventCreateManyArgs} args - Arguments to create many UsageEvents.
     * @example
     * // Create many UsageEvents
     * const usageEvent = await prisma.usageEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsageEventCreateManyArgs>(args?: SelectSubset<T, UsageEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageEvents and returns the data saved in the database.
     * @param {UsageEventCreateManyAndReturnArgs} args - Arguments to create many UsageEvents.
     * @example
     * // Create many UsageEvents
     * const usageEvent = await prisma.usageEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageEvents and only return the `id`
     * const usageEventWithIdOnly = await prisma.usageEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UsageEventCreateManyAndReturnArgs>(args?: SelectSubset<T, UsageEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UsageEvent.
     * @param {UsageEventDeleteArgs} args - Arguments to delete one UsageEvent.
     * @example
     * // Delete one UsageEvent
     * const UsageEvent = await prisma.usageEvent.delete({
     *   where: {
     *     // ... filter to delete one UsageEvent
     *   }
     * })
     * 
     */
    delete<T extends UsageEventDeleteArgs>(args: SelectSubset<T, UsageEventDeleteArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UsageEvent.
     * @param {UsageEventUpdateArgs} args - Arguments to update one UsageEvent.
     * @example
     * // Update one UsageEvent
     * const usageEvent = await prisma.usageEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsageEventUpdateArgs>(args: SelectSubset<T, UsageEventUpdateArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UsageEvents.
     * @param {UsageEventDeleteManyArgs} args - Arguments to filter UsageEvents to delete.
     * @example
     * // Delete a few UsageEvents
     * const { count } = await prisma.usageEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsageEventDeleteManyArgs>(args?: SelectSubset<T, UsageEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageEvents
     * const usageEvent = await prisma.usageEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsageEventUpdateManyArgs>(args: SelectSubset<T, UsageEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageEvents and returns the data updated in the database.
     * @param {UsageEventUpdateManyAndReturnArgs} args - Arguments to update many UsageEvents.
     * @example
     * // Update many UsageEvents
     * const usageEvent = await prisma.usageEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UsageEvents and only return the `id`
     * const usageEventWithIdOnly = await prisma.usageEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UsageEventUpdateManyAndReturnArgs>(args: SelectSubset<T, UsageEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UsageEvent.
     * @param {UsageEventUpsertArgs} args - Arguments to update or create a UsageEvent.
     * @example
     * // Update or create a UsageEvent
     * const usageEvent = await prisma.usageEvent.upsert({
     *   create: {
     *     // ... data to create a UsageEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageEvent we want to update
     *   }
     * })
     */
    upsert<T extends UsageEventUpsertArgs>(args: SelectSubset<T, UsageEventUpsertArgs<ExtArgs>>): Prisma__UsageEventClient<$Result.GetResult<Prisma.$UsageEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UsageEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventCountArgs} args - Arguments to filter UsageEvents to count.
     * @example
     * // Count the number of UsageEvents
     * const count = await prisma.usageEvent.count({
     *   where: {
     *     // ... the filter for the UsageEvents we want to count
     *   }
     * })
    **/
    count<T extends UsageEventCountArgs>(
      args?: Subset<T, UsageEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UsageEventAggregateArgs>(args: Subset<T, UsageEventAggregateArgs>): Prisma.PrismaPromise<GetUsageEventAggregateType<T>>

    /**
     * Group by UsageEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageEventGroupByArgs} args - Group by arguments.
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
      T extends UsageEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageEventGroupByArgs['orderBy'] }
        : { orderBy?: UsageEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UsageEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageEvent model
   */
  readonly fields: UsageEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the UsageEvent model
   */
  interface UsageEventFieldRefs {
    readonly id: FieldRef<"UsageEvent", 'String'>
    readonly tenantId: FieldRef<"UsageEvent", 'String'>
    readonly eventType: FieldRef<"UsageEvent", 'String'>
    readonly payload: FieldRef<"UsageEvent", 'Json'>
    readonly occurredAt: FieldRef<"UsageEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageEvent findUnique
   */
  export type UsageEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter, which UsageEvent to fetch.
     */
    where: UsageEventWhereUniqueInput
  }

  /**
   * UsageEvent findUniqueOrThrow
   */
  export type UsageEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter, which UsageEvent to fetch.
     */
    where: UsageEventWhereUniqueInput
  }

  /**
   * UsageEvent findFirst
   */
  export type UsageEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter, which UsageEvent to fetch.
     */
    where?: UsageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageEvents to fetch.
     */
    orderBy?: UsageEventOrderByWithRelationInput | UsageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageEvents.
     */
    cursor?: UsageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageEvents.
     */
    distinct?: UsageEventScalarFieldEnum | UsageEventScalarFieldEnum[]
  }

  /**
   * UsageEvent findFirstOrThrow
   */
  export type UsageEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter, which UsageEvent to fetch.
     */
    where?: UsageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageEvents to fetch.
     */
    orderBy?: UsageEventOrderByWithRelationInput | UsageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageEvents.
     */
    cursor?: UsageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageEvents.
     */
    distinct?: UsageEventScalarFieldEnum | UsageEventScalarFieldEnum[]
  }

  /**
   * UsageEvent findMany
   */
  export type UsageEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter, which UsageEvents to fetch.
     */
    where?: UsageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageEvents to fetch.
     */
    orderBy?: UsageEventOrderByWithRelationInput | UsageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageEvents.
     */
    cursor?: UsageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageEvents.
     */
    skip?: number
    distinct?: UsageEventScalarFieldEnum | UsageEventScalarFieldEnum[]
  }

  /**
   * UsageEvent create
   */
  export type UsageEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * The data needed to create a UsageEvent.
     */
    data: XOR<UsageEventCreateInput, UsageEventUncheckedCreateInput>
  }

  /**
   * UsageEvent createMany
   */
  export type UsageEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageEvents.
     */
    data: UsageEventCreateManyInput | UsageEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageEvent createManyAndReturn
   */
  export type UsageEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * The data used to create many UsageEvents.
     */
    data: UsageEventCreateManyInput | UsageEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageEvent update
   */
  export type UsageEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * The data needed to update a UsageEvent.
     */
    data: XOR<UsageEventUpdateInput, UsageEventUncheckedUpdateInput>
    /**
     * Choose, which UsageEvent to update.
     */
    where: UsageEventWhereUniqueInput
  }

  /**
   * UsageEvent updateMany
   */
  export type UsageEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageEvents.
     */
    data: XOR<UsageEventUpdateManyMutationInput, UsageEventUncheckedUpdateManyInput>
    /**
     * Filter which UsageEvents to update
     */
    where?: UsageEventWhereInput
    /**
     * Limit how many UsageEvents to update.
     */
    limit?: number
  }

  /**
   * UsageEvent updateManyAndReturn
   */
  export type UsageEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * The data used to update UsageEvents.
     */
    data: XOR<UsageEventUpdateManyMutationInput, UsageEventUncheckedUpdateManyInput>
    /**
     * Filter which UsageEvents to update
     */
    where?: UsageEventWhereInput
    /**
     * Limit how many UsageEvents to update.
     */
    limit?: number
  }

  /**
   * UsageEvent upsert
   */
  export type UsageEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * The filter to search for the UsageEvent to update in case it exists.
     */
    where: UsageEventWhereUniqueInput
    /**
     * In case the UsageEvent found by the `where` argument doesn't exist, create a new UsageEvent with this data.
     */
    create: XOR<UsageEventCreateInput, UsageEventUncheckedCreateInput>
    /**
     * In case the UsageEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageEventUpdateInput, UsageEventUncheckedUpdateInput>
  }

  /**
   * UsageEvent delete
   */
  export type UsageEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
    /**
     * Filter which UsageEvent to delete.
     */
    where: UsageEventWhereUniqueInput
  }

  /**
   * UsageEvent deleteMany
   */
  export type UsageEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageEvents to delete
     */
    where?: UsageEventWhereInput
    /**
     * Limit how many UsageEvents to delete.
     */
    limit?: number
  }

  /**
   * UsageEvent without action
   */
  export type UsageEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageEvent
     */
    select?: UsageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UsageEvent
     */
    omit?: UsageEventOmit<ExtArgs> | null
  }


  /**
   * Model AiQueryLog
   */

  export type AggregateAiQueryLog = {
    _count: AiQueryLogCountAggregateOutputType | null
    _avg: AiQueryLogAvgAggregateOutputType | null
    _sum: AiQueryLogSumAggregateOutputType | null
    _min: AiQueryLogMinAggregateOutputType | null
    _max: AiQueryLogMaxAggregateOutputType | null
  }

  export type AiQueryLogAvgAggregateOutputType = {
    resultCount: number | null
    executionTimeMs: number | null
    inputTokens: number | null
    outputTokens: number | null
  }

  export type AiQueryLogSumAggregateOutputType = {
    resultCount: number | null
    executionTimeMs: number | null
    inputTokens: number | null
    outputTokens: number | null
  }

  export type AiQueryLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    facilityId: string | null
    feature: string | null
    queryText: string | null
    compiledSql: string | null
    resultCount: number | null
    executionTimeMs: number | null
    modelUsed: string | null
    inputTokens: number | null
    outputTokens: number | null
    status: string | null
    errorMessage: string | null
    userAgent: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AiQueryLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    userId: string | null
    facilityId: string | null
    feature: string | null
    queryText: string | null
    compiledSql: string | null
    resultCount: number | null
    executionTimeMs: number | null
    modelUsed: string | null
    inputTokens: number | null
    outputTokens: number | null
    status: string | null
    errorMessage: string | null
    userAgent: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type AiQueryLogCountAggregateOutputType = {
    id: number
    tenantId: number
    userId: number
    facilityId: number
    feature: number
    queryText: number
    queryPlan: number
    compiledSql: number
    resultCount: number
    executionTimeMs: number
    modelUsed: number
    inputTokens: number
    outputTokens: number
    status: number
    errorMessage: number
    userAgent: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type AiQueryLogAvgAggregateInputType = {
    resultCount?: true
    executionTimeMs?: true
    inputTokens?: true
    outputTokens?: true
  }

  export type AiQueryLogSumAggregateInputType = {
    resultCount?: true
    executionTimeMs?: true
    inputTokens?: true
    outputTokens?: true
  }

  export type AiQueryLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    facilityId?: true
    feature?: true
    queryText?: true
    compiledSql?: true
    resultCount?: true
    executionTimeMs?: true
    modelUsed?: true
    inputTokens?: true
    outputTokens?: true
    status?: true
    errorMessage?: true
    userAgent?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AiQueryLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    facilityId?: true
    feature?: true
    queryText?: true
    compiledSql?: true
    resultCount?: true
    executionTimeMs?: true
    modelUsed?: true
    inputTokens?: true
    outputTokens?: true
    status?: true
    errorMessage?: true
    userAgent?: true
    ipAddress?: true
    createdAt?: true
  }

  export type AiQueryLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    userId?: true
    facilityId?: true
    feature?: true
    queryText?: true
    queryPlan?: true
    compiledSql?: true
    resultCount?: true
    executionTimeMs?: true
    modelUsed?: true
    inputTokens?: true
    outputTokens?: true
    status?: true
    errorMessage?: true
    userAgent?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type AiQueryLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiQueryLog to aggregate.
     */
    where?: AiQueryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiQueryLogs to fetch.
     */
    orderBy?: AiQueryLogOrderByWithRelationInput | AiQueryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiQueryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiQueryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiQueryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiQueryLogs
    **/
    _count?: true | AiQueryLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiQueryLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiQueryLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiQueryLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiQueryLogMaxAggregateInputType
  }

  export type GetAiQueryLogAggregateType<T extends AiQueryLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiQueryLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiQueryLog[P]>
      : GetScalarType<T[P], AggregateAiQueryLog[P]>
  }




  export type AiQueryLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiQueryLogWhereInput
    orderBy?: AiQueryLogOrderByWithAggregationInput | AiQueryLogOrderByWithAggregationInput[]
    by: AiQueryLogScalarFieldEnum[] | AiQueryLogScalarFieldEnum
    having?: AiQueryLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiQueryLogCountAggregateInputType | true
    _avg?: AiQueryLogAvgAggregateInputType
    _sum?: AiQueryLogSumAggregateInputType
    _min?: AiQueryLogMinAggregateInputType
    _max?: AiQueryLogMaxAggregateInputType
  }

  export type AiQueryLogGroupByOutputType = {
    id: string
    tenantId: string
    userId: string
    facilityId: string | null
    feature: string
    queryText: string
    queryPlan: JsonValue | null
    compiledSql: string | null
    resultCount: number | null
    executionTimeMs: number | null
    modelUsed: string | null
    inputTokens: number | null
    outputTokens: number | null
    status: string
    errorMessage: string | null
    userAgent: string | null
    ipAddress: string | null
    createdAt: Date
    _count: AiQueryLogCountAggregateOutputType | null
    _avg: AiQueryLogAvgAggregateOutputType | null
    _sum: AiQueryLogSumAggregateOutputType | null
    _min: AiQueryLogMinAggregateOutputType | null
    _max: AiQueryLogMaxAggregateOutputType | null
  }

  type GetAiQueryLogGroupByPayload<T extends AiQueryLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiQueryLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiQueryLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiQueryLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiQueryLogGroupByOutputType[P]>
        }
      >
    >


  export type AiQueryLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    facilityId?: boolean
    feature?: boolean
    queryText?: boolean
    queryPlan?: boolean
    compiledSql?: boolean
    resultCount?: boolean
    executionTimeMs?: boolean
    modelUsed?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiQueryLog"]>

  export type AiQueryLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    facilityId?: boolean
    feature?: boolean
    queryText?: boolean
    queryPlan?: boolean
    compiledSql?: boolean
    resultCount?: boolean
    executionTimeMs?: boolean
    modelUsed?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiQueryLog"]>

  export type AiQueryLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    facilityId?: boolean
    feature?: boolean
    queryText?: boolean
    queryPlan?: boolean
    compiledSql?: boolean
    resultCount?: boolean
    executionTimeMs?: boolean
    modelUsed?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiQueryLog"]>

  export type AiQueryLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    userId?: boolean
    facilityId?: boolean
    feature?: boolean
    queryText?: boolean
    queryPlan?: boolean
    compiledSql?: boolean
    resultCount?: boolean
    executionTimeMs?: boolean
    modelUsed?: boolean
    inputTokens?: boolean
    outputTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type AiQueryLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "userId" | "facilityId" | "feature" | "queryText" | "queryPlan" | "compiledSql" | "resultCount" | "executionTimeMs" | "modelUsed" | "inputTokens" | "outputTokens" | "status" | "errorMessage" | "userAgent" | "ipAddress" | "createdAt", ExtArgs["result"]["aiQueryLog"]>

  export type $AiQueryLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiQueryLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      userId: string
      facilityId: string | null
      feature: string
      queryText: string
      queryPlan: Prisma.JsonValue | null
      compiledSql: string | null
      resultCount: number | null
      executionTimeMs: number | null
      modelUsed: string | null
      inputTokens: number | null
      outputTokens: number | null
      status: string
      errorMessage: string | null
      userAgent: string | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiQueryLog"]>
    composites: {}
  }

  type AiQueryLogGetPayload<S extends boolean | null | undefined | AiQueryLogDefaultArgs> = $Result.GetResult<Prisma.$AiQueryLogPayload, S>

  type AiQueryLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiQueryLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiQueryLogCountAggregateInputType | true
    }

  export interface AiQueryLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiQueryLog'], meta: { name: 'AiQueryLog' } }
    /**
     * Find zero or one AiQueryLog that matches the filter.
     * @param {AiQueryLogFindUniqueArgs} args - Arguments to find a AiQueryLog
     * @example
     * // Get one AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiQueryLogFindUniqueArgs>(args: SelectSubset<T, AiQueryLogFindUniqueArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiQueryLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiQueryLogFindUniqueOrThrowArgs} args - Arguments to find a AiQueryLog
     * @example
     * // Get one AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiQueryLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiQueryLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiQueryLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogFindFirstArgs} args - Arguments to find a AiQueryLog
     * @example
     * // Get one AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiQueryLogFindFirstArgs>(args?: SelectSubset<T, AiQueryLogFindFirstArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiQueryLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogFindFirstOrThrowArgs} args - Arguments to find a AiQueryLog
     * @example
     * // Get one AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiQueryLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiQueryLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiQueryLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiQueryLogs
     * const aiQueryLogs = await prisma.aiQueryLog.findMany()
     * 
     * // Get first 10 AiQueryLogs
     * const aiQueryLogs = await prisma.aiQueryLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiQueryLogWithIdOnly = await prisma.aiQueryLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiQueryLogFindManyArgs>(args?: SelectSubset<T, AiQueryLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiQueryLog.
     * @param {AiQueryLogCreateArgs} args - Arguments to create a AiQueryLog.
     * @example
     * // Create one AiQueryLog
     * const AiQueryLog = await prisma.aiQueryLog.create({
     *   data: {
     *     // ... data to create a AiQueryLog
     *   }
     * })
     * 
     */
    create<T extends AiQueryLogCreateArgs>(args: SelectSubset<T, AiQueryLogCreateArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiQueryLogs.
     * @param {AiQueryLogCreateManyArgs} args - Arguments to create many AiQueryLogs.
     * @example
     * // Create many AiQueryLogs
     * const aiQueryLog = await prisma.aiQueryLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiQueryLogCreateManyArgs>(args?: SelectSubset<T, AiQueryLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiQueryLogs and returns the data saved in the database.
     * @param {AiQueryLogCreateManyAndReturnArgs} args - Arguments to create many AiQueryLogs.
     * @example
     * // Create many AiQueryLogs
     * const aiQueryLog = await prisma.aiQueryLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiQueryLogs and only return the `id`
     * const aiQueryLogWithIdOnly = await prisma.aiQueryLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiQueryLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiQueryLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiQueryLog.
     * @param {AiQueryLogDeleteArgs} args - Arguments to delete one AiQueryLog.
     * @example
     * // Delete one AiQueryLog
     * const AiQueryLog = await prisma.aiQueryLog.delete({
     *   where: {
     *     // ... filter to delete one AiQueryLog
     *   }
     * })
     * 
     */
    delete<T extends AiQueryLogDeleteArgs>(args: SelectSubset<T, AiQueryLogDeleteArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiQueryLog.
     * @param {AiQueryLogUpdateArgs} args - Arguments to update one AiQueryLog.
     * @example
     * // Update one AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiQueryLogUpdateArgs>(args: SelectSubset<T, AiQueryLogUpdateArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiQueryLogs.
     * @param {AiQueryLogDeleteManyArgs} args - Arguments to filter AiQueryLogs to delete.
     * @example
     * // Delete a few AiQueryLogs
     * const { count } = await prisma.aiQueryLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiQueryLogDeleteManyArgs>(args?: SelectSubset<T, AiQueryLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiQueryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiQueryLogs
     * const aiQueryLog = await prisma.aiQueryLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiQueryLogUpdateManyArgs>(args: SelectSubset<T, AiQueryLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiQueryLogs and returns the data updated in the database.
     * @param {AiQueryLogUpdateManyAndReturnArgs} args - Arguments to update many AiQueryLogs.
     * @example
     * // Update many AiQueryLogs
     * const aiQueryLog = await prisma.aiQueryLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiQueryLogs and only return the `id`
     * const aiQueryLogWithIdOnly = await prisma.aiQueryLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiQueryLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AiQueryLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiQueryLog.
     * @param {AiQueryLogUpsertArgs} args - Arguments to update or create a AiQueryLog.
     * @example
     * // Update or create a AiQueryLog
     * const aiQueryLog = await prisma.aiQueryLog.upsert({
     *   create: {
     *     // ... data to create a AiQueryLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiQueryLog we want to update
     *   }
     * })
     */
    upsert<T extends AiQueryLogUpsertArgs>(args: SelectSubset<T, AiQueryLogUpsertArgs<ExtArgs>>): Prisma__AiQueryLogClient<$Result.GetResult<Prisma.$AiQueryLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiQueryLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogCountArgs} args - Arguments to filter AiQueryLogs to count.
     * @example
     * // Count the number of AiQueryLogs
     * const count = await prisma.aiQueryLog.count({
     *   where: {
     *     // ... the filter for the AiQueryLogs we want to count
     *   }
     * })
    **/
    count<T extends AiQueryLogCountArgs>(
      args?: Subset<T, AiQueryLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiQueryLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiQueryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiQueryLogAggregateArgs>(args: Subset<T, AiQueryLogAggregateArgs>): Prisma.PrismaPromise<GetAiQueryLogAggregateType<T>>

    /**
     * Group by AiQueryLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiQueryLogGroupByArgs} args - Group by arguments.
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
      T extends AiQueryLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiQueryLogGroupByArgs['orderBy'] }
        : { orderBy?: AiQueryLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiQueryLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiQueryLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiQueryLog model
   */
  readonly fields: AiQueryLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiQueryLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiQueryLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AiQueryLog model
   */
  interface AiQueryLogFieldRefs {
    readonly id: FieldRef<"AiQueryLog", 'String'>
    readonly tenantId: FieldRef<"AiQueryLog", 'String'>
    readonly userId: FieldRef<"AiQueryLog", 'String'>
    readonly facilityId: FieldRef<"AiQueryLog", 'String'>
    readonly feature: FieldRef<"AiQueryLog", 'String'>
    readonly queryText: FieldRef<"AiQueryLog", 'String'>
    readonly queryPlan: FieldRef<"AiQueryLog", 'Json'>
    readonly compiledSql: FieldRef<"AiQueryLog", 'String'>
    readonly resultCount: FieldRef<"AiQueryLog", 'Int'>
    readonly executionTimeMs: FieldRef<"AiQueryLog", 'Int'>
    readonly modelUsed: FieldRef<"AiQueryLog", 'String'>
    readonly inputTokens: FieldRef<"AiQueryLog", 'Int'>
    readonly outputTokens: FieldRef<"AiQueryLog", 'Int'>
    readonly status: FieldRef<"AiQueryLog", 'String'>
    readonly errorMessage: FieldRef<"AiQueryLog", 'String'>
    readonly userAgent: FieldRef<"AiQueryLog", 'String'>
    readonly ipAddress: FieldRef<"AiQueryLog", 'String'>
    readonly createdAt: FieldRef<"AiQueryLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiQueryLog findUnique
   */
  export type AiQueryLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter, which AiQueryLog to fetch.
     */
    where: AiQueryLogWhereUniqueInput
  }

  /**
   * AiQueryLog findUniqueOrThrow
   */
  export type AiQueryLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter, which AiQueryLog to fetch.
     */
    where: AiQueryLogWhereUniqueInput
  }

  /**
   * AiQueryLog findFirst
   */
  export type AiQueryLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter, which AiQueryLog to fetch.
     */
    where?: AiQueryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiQueryLogs to fetch.
     */
    orderBy?: AiQueryLogOrderByWithRelationInput | AiQueryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiQueryLogs.
     */
    cursor?: AiQueryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiQueryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiQueryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiQueryLogs.
     */
    distinct?: AiQueryLogScalarFieldEnum | AiQueryLogScalarFieldEnum[]
  }

  /**
   * AiQueryLog findFirstOrThrow
   */
  export type AiQueryLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter, which AiQueryLog to fetch.
     */
    where?: AiQueryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiQueryLogs to fetch.
     */
    orderBy?: AiQueryLogOrderByWithRelationInput | AiQueryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiQueryLogs.
     */
    cursor?: AiQueryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiQueryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiQueryLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiQueryLogs.
     */
    distinct?: AiQueryLogScalarFieldEnum | AiQueryLogScalarFieldEnum[]
  }

  /**
   * AiQueryLog findMany
   */
  export type AiQueryLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter, which AiQueryLogs to fetch.
     */
    where?: AiQueryLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiQueryLogs to fetch.
     */
    orderBy?: AiQueryLogOrderByWithRelationInput | AiQueryLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiQueryLogs.
     */
    cursor?: AiQueryLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiQueryLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiQueryLogs.
     */
    skip?: number
    distinct?: AiQueryLogScalarFieldEnum | AiQueryLogScalarFieldEnum[]
  }

  /**
   * AiQueryLog create
   */
  export type AiQueryLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AiQueryLog.
     */
    data: XOR<AiQueryLogCreateInput, AiQueryLogUncheckedCreateInput>
  }

  /**
   * AiQueryLog createMany
   */
  export type AiQueryLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiQueryLogs.
     */
    data: AiQueryLogCreateManyInput | AiQueryLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiQueryLog createManyAndReturn
   */
  export type AiQueryLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * The data used to create many AiQueryLogs.
     */
    data: AiQueryLogCreateManyInput | AiQueryLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiQueryLog update
   */
  export type AiQueryLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AiQueryLog.
     */
    data: XOR<AiQueryLogUpdateInput, AiQueryLogUncheckedUpdateInput>
    /**
     * Choose, which AiQueryLog to update.
     */
    where: AiQueryLogWhereUniqueInput
  }

  /**
   * AiQueryLog updateMany
   */
  export type AiQueryLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiQueryLogs.
     */
    data: XOR<AiQueryLogUpdateManyMutationInput, AiQueryLogUncheckedUpdateManyInput>
    /**
     * Filter which AiQueryLogs to update
     */
    where?: AiQueryLogWhereInput
    /**
     * Limit how many AiQueryLogs to update.
     */
    limit?: number
  }

  /**
   * AiQueryLog updateManyAndReturn
   */
  export type AiQueryLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * The data used to update AiQueryLogs.
     */
    data: XOR<AiQueryLogUpdateManyMutationInput, AiQueryLogUncheckedUpdateManyInput>
    /**
     * Filter which AiQueryLogs to update
     */
    where?: AiQueryLogWhereInput
    /**
     * Limit how many AiQueryLogs to update.
     */
    limit?: number
  }

  /**
   * AiQueryLog upsert
   */
  export type AiQueryLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AiQueryLog to update in case it exists.
     */
    where: AiQueryLogWhereUniqueInput
    /**
     * In case the AiQueryLog found by the `where` argument doesn't exist, create a new AiQueryLog with this data.
     */
    create: XOR<AiQueryLogCreateInput, AiQueryLogUncheckedCreateInput>
    /**
     * In case the AiQueryLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiQueryLogUpdateInput, AiQueryLogUncheckedUpdateInput>
  }

  /**
   * AiQueryLog delete
   */
  export type AiQueryLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
    /**
     * Filter which AiQueryLog to delete.
     */
    where: AiQueryLogWhereUniqueInput
  }

  /**
   * AiQueryLog deleteMany
   */
  export type AiQueryLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiQueryLogs to delete
     */
    where?: AiQueryLogWhereInput
    /**
     * Limit how many AiQueryLogs to delete.
     */
    limit?: number
  }

  /**
   * AiQueryLog without action
   */
  export type AiQueryLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiQueryLog
     */
    select?: AiQueryLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiQueryLog
     */
    omit?: AiQueryLogOmit<ExtArgs> | null
  }


  /**
   * Model AiUsageMetric
   */

  export type AggregateAiUsageMetric = {
    _count: AiUsageMetricCountAggregateOutputType | null
    _avg: AiUsageMetricAvgAggregateOutputType | null
    _sum: AiUsageMetricSumAggregateOutputType | null
    _min: AiUsageMetricMinAggregateOutputType | null
    _max: AiUsageMetricMaxAggregateOutputType | null
  }

  export type AiUsageMetricAvgAggregateOutputType = {
    queryCount: number | null
    successCount: number | null
    errorCount: number | null
    uniqueUsers: number | null
    totalInputTokens: number | null
    totalOutputTokens: number | null
    avgExecutionTimeMs: Decimal | null
    p95ExecutionTimeMs: Decimal | null
  }

  export type AiUsageMetricSumAggregateOutputType = {
    queryCount: number | null
    successCount: number | null
    errorCount: number | null
    uniqueUsers: number | null
    totalInputTokens: number | null
    totalOutputTokens: number | null
    avgExecutionTimeMs: Decimal | null
    p95ExecutionTimeMs: Decimal | null
  }

  export type AiUsageMetricMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    feature: string | null
    periodType: string | null
    periodStart: Date | null
    queryCount: number | null
    successCount: number | null
    errorCount: number | null
    uniqueUsers: number | null
    totalInputTokens: number | null
    totalOutputTokens: number | null
    avgExecutionTimeMs: Decimal | null
    p95ExecutionTimeMs: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiUsageMetricMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    feature: string | null
    periodType: string | null
    periodStart: Date | null
    queryCount: number | null
    successCount: number | null
    errorCount: number | null
    uniqueUsers: number | null
    totalInputTokens: number | null
    totalOutputTokens: number | null
    avgExecutionTimeMs: Decimal | null
    p95ExecutionTimeMs: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiUsageMetricCountAggregateOutputType = {
    id: number
    tenantId: number
    feature: number
    periodType: number
    periodStart: number
    queryCount: number
    successCount: number
    errorCount: number
    uniqueUsers: number
    totalInputTokens: number
    totalOutputTokens: number
    avgExecutionTimeMs: number
    p95ExecutionTimeMs: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiUsageMetricAvgAggregateInputType = {
    queryCount?: true
    successCount?: true
    errorCount?: true
    uniqueUsers?: true
    totalInputTokens?: true
    totalOutputTokens?: true
    avgExecutionTimeMs?: true
    p95ExecutionTimeMs?: true
  }

  export type AiUsageMetricSumAggregateInputType = {
    queryCount?: true
    successCount?: true
    errorCount?: true
    uniqueUsers?: true
    totalInputTokens?: true
    totalOutputTokens?: true
    avgExecutionTimeMs?: true
    p95ExecutionTimeMs?: true
  }

  export type AiUsageMetricMinAggregateInputType = {
    id?: true
    tenantId?: true
    feature?: true
    periodType?: true
    periodStart?: true
    queryCount?: true
    successCount?: true
    errorCount?: true
    uniqueUsers?: true
    totalInputTokens?: true
    totalOutputTokens?: true
    avgExecutionTimeMs?: true
    p95ExecutionTimeMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiUsageMetricMaxAggregateInputType = {
    id?: true
    tenantId?: true
    feature?: true
    periodType?: true
    periodStart?: true
    queryCount?: true
    successCount?: true
    errorCount?: true
    uniqueUsers?: true
    totalInputTokens?: true
    totalOutputTokens?: true
    avgExecutionTimeMs?: true
    p95ExecutionTimeMs?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiUsageMetricCountAggregateInputType = {
    id?: true
    tenantId?: true
    feature?: true
    periodType?: true
    periodStart?: true
    queryCount?: true
    successCount?: true
    errorCount?: true
    uniqueUsers?: true
    totalInputTokens?: true
    totalOutputTokens?: true
    avgExecutionTimeMs?: true
    p95ExecutionTimeMs?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiUsageMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageMetric to aggregate.
     */
    where?: AiUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiUsageMetrics
    **/
    _count?: true | AiUsageMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiUsageMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiUsageMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiUsageMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiUsageMetricMaxAggregateInputType
  }

  export type GetAiUsageMetricAggregateType<T extends AiUsageMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateAiUsageMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiUsageMetric[P]>
      : GetScalarType<T[P], AggregateAiUsageMetric[P]>
  }




  export type AiUsageMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiUsageMetricWhereInput
    orderBy?: AiUsageMetricOrderByWithAggregationInput | AiUsageMetricOrderByWithAggregationInput[]
    by: AiUsageMetricScalarFieldEnum[] | AiUsageMetricScalarFieldEnum
    having?: AiUsageMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiUsageMetricCountAggregateInputType | true
    _avg?: AiUsageMetricAvgAggregateInputType
    _sum?: AiUsageMetricSumAggregateInputType
    _min?: AiUsageMetricMinAggregateInputType
    _max?: AiUsageMetricMaxAggregateInputType
  }

  export type AiUsageMetricGroupByOutputType = {
    id: string
    tenantId: string
    feature: string
    periodType: string
    periodStart: Date
    queryCount: number
    successCount: number
    errorCount: number
    uniqueUsers: number
    totalInputTokens: number
    totalOutputTokens: number
    avgExecutionTimeMs: Decimal | null
    p95ExecutionTimeMs: Decimal | null
    createdAt: Date
    updatedAt: Date
    _count: AiUsageMetricCountAggregateOutputType | null
    _avg: AiUsageMetricAvgAggregateOutputType | null
    _sum: AiUsageMetricSumAggregateOutputType | null
    _min: AiUsageMetricMinAggregateOutputType | null
    _max: AiUsageMetricMaxAggregateOutputType | null
  }

  type GetAiUsageMetricGroupByPayload<T extends AiUsageMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiUsageMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiUsageMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiUsageMetricGroupByOutputType[P]>
            : GetScalarType<T[P], AiUsageMetricGroupByOutputType[P]>
        }
      >
    >


  export type AiUsageMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    feature?: boolean
    periodType?: boolean
    periodStart?: boolean
    queryCount?: boolean
    successCount?: boolean
    errorCount?: boolean
    uniqueUsers?: boolean
    totalInputTokens?: boolean
    totalOutputTokens?: boolean
    avgExecutionTimeMs?: boolean
    p95ExecutionTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiUsageMetric"]>

  export type AiUsageMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    feature?: boolean
    periodType?: boolean
    periodStart?: boolean
    queryCount?: boolean
    successCount?: boolean
    errorCount?: boolean
    uniqueUsers?: boolean
    totalInputTokens?: boolean
    totalOutputTokens?: boolean
    avgExecutionTimeMs?: boolean
    p95ExecutionTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiUsageMetric"]>

  export type AiUsageMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    feature?: boolean
    periodType?: boolean
    periodStart?: boolean
    queryCount?: boolean
    successCount?: boolean
    errorCount?: boolean
    uniqueUsers?: boolean
    totalInputTokens?: boolean
    totalOutputTokens?: boolean
    avgExecutionTimeMs?: boolean
    p95ExecutionTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiUsageMetric"]>

  export type AiUsageMetricSelectScalar = {
    id?: boolean
    tenantId?: boolean
    feature?: boolean
    periodType?: boolean
    periodStart?: boolean
    queryCount?: boolean
    successCount?: boolean
    errorCount?: boolean
    uniqueUsers?: boolean
    totalInputTokens?: boolean
    totalOutputTokens?: boolean
    avgExecutionTimeMs?: boolean
    p95ExecutionTimeMs?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiUsageMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "feature" | "periodType" | "periodStart" | "queryCount" | "successCount" | "errorCount" | "uniqueUsers" | "totalInputTokens" | "totalOutputTokens" | "avgExecutionTimeMs" | "p95ExecutionTimeMs" | "createdAt" | "updatedAt", ExtArgs["result"]["aiUsageMetric"]>

  export type $AiUsageMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiUsageMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      feature: string
      periodType: string
      periodStart: Date
      queryCount: number
      successCount: number
      errorCount: number
      uniqueUsers: number
      totalInputTokens: number
      totalOutputTokens: number
      avgExecutionTimeMs: Prisma.Decimal | null
      p95ExecutionTimeMs: Prisma.Decimal | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiUsageMetric"]>
    composites: {}
  }

  type AiUsageMetricGetPayload<S extends boolean | null | undefined | AiUsageMetricDefaultArgs> = $Result.GetResult<Prisma.$AiUsageMetricPayload, S>

  type AiUsageMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiUsageMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiUsageMetricCountAggregateInputType | true
    }

  export interface AiUsageMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiUsageMetric'], meta: { name: 'AiUsageMetric' } }
    /**
     * Find zero or one AiUsageMetric that matches the filter.
     * @param {AiUsageMetricFindUniqueArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiUsageMetricFindUniqueArgs>(args: SelectSubset<T, AiUsageMetricFindUniqueArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiUsageMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiUsageMetricFindUniqueOrThrowArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiUsageMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, AiUsageMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindFirstArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiUsageMetricFindFirstArgs>(args?: SelectSubset<T, AiUsageMetricFindFirstArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindFirstOrThrowArgs} args - Arguments to find a AiUsageMetric
     * @example
     * // Get one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiUsageMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, AiUsageMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiUsageMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiUsageMetrics
     * const aiUsageMetrics = await prisma.aiUsageMetric.findMany()
     * 
     * // Get first 10 AiUsageMetrics
     * const aiUsageMetrics = await prisma.aiUsageMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiUsageMetricFindManyArgs>(args?: SelectSubset<T, AiUsageMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiUsageMetric.
     * @param {AiUsageMetricCreateArgs} args - Arguments to create a AiUsageMetric.
     * @example
     * // Create one AiUsageMetric
     * const AiUsageMetric = await prisma.aiUsageMetric.create({
     *   data: {
     *     // ... data to create a AiUsageMetric
     *   }
     * })
     * 
     */
    create<T extends AiUsageMetricCreateArgs>(args: SelectSubset<T, AiUsageMetricCreateArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiUsageMetrics.
     * @param {AiUsageMetricCreateManyArgs} args - Arguments to create many AiUsageMetrics.
     * @example
     * // Create many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiUsageMetricCreateManyArgs>(args?: SelectSubset<T, AiUsageMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiUsageMetrics and returns the data saved in the database.
     * @param {AiUsageMetricCreateManyAndReturnArgs} args - Arguments to create many AiUsageMetrics.
     * @example
     * // Create many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiUsageMetrics and only return the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiUsageMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, AiUsageMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiUsageMetric.
     * @param {AiUsageMetricDeleteArgs} args - Arguments to delete one AiUsageMetric.
     * @example
     * // Delete one AiUsageMetric
     * const AiUsageMetric = await prisma.aiUsageMetric.delete({
     *   where: {
     *     // ... filter to delete one AiUsageMetric
     *   }
     * })
     * 
     */
    delete<T extends AiUsageMetricDeleteArgs>(args: SelectSubset<T, AiUsageMetricDeleteArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiUsageMetric.
     * @param {AiUsageMetricUpdateArgs} args - Arguments to update one AiUsageMetric.
     * @example
     * // Update one AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiUsageMetricUpdateArgs>(args: SelectSubset<T, AiUsageMetricUpdateArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiUsageMetrics.
     * @param {AiUsageMetricDeleteManyArgs} args - Arguments to filter AiUsageMetrics to delete.
     * @example
     * // Delete a few AiUsageMetrics
     * const { count } = await prisma.aiUsageMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiUsageMetricDeleteManyArgs>(args?: SelectSubset<T, AiUsageMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiUsageMetricUpdateManyArgs>(args: SelectSubset<T, AiUsageMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageMetrics and returns the data updated in the database.
     * @param {AiUsageMetricUpdateManyAndReturnArgs} args - Arguments to update many AiUsageMetrics.
     * @example
     * // Update many AiUsageMetrics
     * const aiUsageMetric = await prisma.aiUsageMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiUsageMetrics and only return the `id`
     * const aiUsageMetricWithIdOnly = await prisma.aiUsageMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiUsageMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, AiUsageMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiUsageMetric.
     * @param {AiUsageMetricUpsertArgs} args - Arguments to update or create a AiUsageMetric.
     * @example
     * // Update or create a AiUsageMetric
     * const aiUsageMetric = await prisma.aiUsageMetric.upsert({
     *   create: {
     *     // ... data to create a AiUsageMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiUsageMetric we want to update
     *   }
     * })
     */
    upsert<T extends AiUsageMetricUpsertArgs>(args: SelectSubset<T, AiUsageMetricUpsertArgs<ExtArgs>>): Prisma__AiUsageMetricClient<$Result.GetResult<Prisma.$AiUsageMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricCountArgs} args - Arguments to filter AiUsageMetrics to count.
     * @example
     * // Count the number of AiUsageMetrics
     * const count = await prisma.aiUsageMetric.count({
     *   where: {
     *     // ... the filter for the AiUsageMetrics we want to count
     *   }
     * })
    **/
    count<T extends AiUsageMetricCountArgs>(
      args?: Subset<T, AiUsageMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiUsageMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AiUsageMetricAggregateArgs>(args: Subset<T, AiUsageMetricAggregateArgs>): Prisma.PrismaPromise<GetAiUsageMetricAggregateType<T>>

    /**
     * Group by AiUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageMetricGroupByArgs} args - Group by arguments.
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
      T extends AiUsageMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiUsageMetricGroupByArgs['orderBy'] }
        : { orderBy?: AiUsageMetricGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AiUsageMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiUsageMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiUsageMetric model
   */
  readonly fields: AiUsageMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiUsageMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiUsageMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AiUsageMetric model
   */
  interface AiUsageMetricFieldRefs {
    readonly id: FieldRef<"AiUsageMetric", 'String'>
    readonly tenantId: FieldRef<"AiUsageMetric", 'String'>
    readonly feature: FieldRef<"AiUsageMetric", 'String'>
    readonly periodType: FieldRef<"AiUsageMetric", 'String'>
    readonly periodStart: FieldRef<"AiUsageMetric", 'DateTime'>
    readonly queryCount: FieldRef<"AiUsageMetric", 'Int'>
    readonly successCount: FieldRef<"AiUsageMetric", 'Int'>
    readonly errorCount: FieldRef<"AiUsageMetric", 'Int'>
    readonly uniqueUsers: FieldRef<"AiUsageMetric", 'Int'>
    readonly totalInputTokens: FieldRef<"AiUsageMetric", 'Int'>
    readonly totalOutputTokens: FieldRef<"AiUsageMetric", 'Int'>
    readonly avgExecutionTimeMs: FieldRef<"AiUsageMetric", 'Decimal'>
    readonly p95ExecutionTimeMs: FieldRef<"AiUsageMetric", 'Decimal'>
    readonly createdAt: FieldRef<"AiUsageMetric", 'DateTime'>
    readonly updatedAt: FieldRef<"AiUsageMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiUsageMetric findUnique
   */
  export type AiUsageMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where: AiUsageMetricWhereUniqueInput
  }

  /**
   * AiUsageMetric findUniqueOrThrow
   */
  export type AiUsageMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where: AiUsageMetricWhereUniqueInput
  }

  /**
   * AiUsageMetric findFirst
   */
  export type AiUsageMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where?: AiUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageMetrics.
     */
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[]
  }

  /**
   * AiUsageMetric findFirstOrThrow
   */
  export type AiUsageMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageMetric to fetch.
     */
    where?: AiUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageMetrics.
     */
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[]
  }

  /**
   * AiUsageMetric findMany
   */
  export type AiUsageMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageMetrics to fetch.
     */
    where?: AiUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageMetrics to fetch.
     */
    orderBy?: AiUsageMetricOrderByWithRelationInput | AiUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiUsageMetrics.
     */
    cursor?: AiUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageMetrics.
     */
    skip?: number
    distinct?: AiUsageMetricScalarFieldEnum | AiUsageMetricScalarFieldEnum[]
  }

  /**
   * AiUsageMetric create
   */
  export type AiUsageMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * The data needed to create a AiUsageMetric.
     */
    data: XOR<AiUsageMetricCreateInput, AiUsageMetricUncheckedCreateInput>
  }

  /**
   * AiUsageMetric createMany
   */
  export type AiUsageMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiUsageMetrics.
     */
    data: AiUsageMetricCreateManyInput | AiUsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiUsageMetric createManyAndReturn
   */
  export type AiUsageMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * The data used to create many AiUsageMetrics.
     */
    data: AiUsageMetricCreateManyInput | AiUsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiUsageMetric update
   */
  export type AiUsageMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * The data needed to update a AiUsageMetric.
     */
    data: XOR<AiUsageMetricUpdateInput, AiUsageMetricUncheckedUpdateInput>
    /**
     * Choose, which AiUsageMetric to update.
     */
    where: AiUsageMetricWhereUniqueInput
  }

  /**
   * AiUsageMetric updateMany
   */
  export type AiUsageMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiUsageMetrics.
     */
    data: XOR<AiUsageMetricUpdateManyMutationInput, AiUsageMetricUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageMetrics to update
     */
    where?: AiUsageMetricWhereInput
    /**
     * Limit how many AiUsageMetrics to update.
     */
    limit?: number
  }

  /**
   * AiUsageMetric updateManyAndReturn
   */
  export type AiUsageMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * The data used to update AiUsageMetrics.
     */
    data: XOR<AiUsageMetricUpdateManyMutationInput, AiUsageMetricUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageMetrics to update
     */
    where?: AiUsageMetricWhereInput
    /**
     * Limit how many AiUsageMetrics to update.
     */
    limit?: number
  }

  /**
   * AiUsageMetric upsert
   */
  export type AiUsageMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * The filter to search for the AiUsageMetric to update in case it exists.
     */
    where: AiUsageMetricWhereUniqueInput
    /**
     * In case the AiUsageMetric found by the `where` argument doesn't exist, create a new AiUsageMetric with this data.
     */
    create: XOR<AiUsageMetricCreateInput, AiUsageMetricUncheckedCreateInput>
    /**
     * In case the AiUsageMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiUsageMetricUpdateInput, AiUsageMetricUncheckedUpdateInput>
  }

  /**
   * AiUsageMetric delete
   */
  export type AiUsageMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
    /**
     * Filter which AiUsageMetric to delete.
     */
    where: AiUsageMetricWhereUniqueInput
  }

  /**
   * AiUsageMetric deleteMany
   */
  export type AiUsageMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageMetrics to delete
     */
    where?: AiUsageMetricWhereInput
    /**
     * Limit how many AiUsageMetrics to delete.
     */
    limit?: number
  }

  /**
   * AiUsageMetric without action
   */
  export type AiUsageMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageMetric
     */
    select?: AiUsageMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageMetric
     */
    omit?: AiUsageMetricOmit<ExtArgs> | null
  }


  /**
   * Model SemanticMetric
   */

  export type AggregateSemanticMetric = {
    _count: SemanticMetricCountAggregateOutputType | null
    _avg: SemanticMetricAvgAggregateOutputType | null
    _sum: SemanticMetricSumAggregateOutputType | null
    _min: SemanticMetricMinAggregateOutputType | null
    _max: SemanticMetricMaxAggregateOutputType | null
  }

  export type SemanticMetricAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type SemanticMetricSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type SemanticMetricMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    displayName: string | null
    displayNameAr: string | null
    description: string | null
    expression: string | null
    database: string | null
    baseTable: string | null
    dataType: string | null
    defaultAggregation: string | null
    format: string | null
    requiredPermission: string | null
    category: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticMetricMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    displayName: string | null
    displayNameAr: string | null
    description: string | null
    expression: string | null
    database: string | null
    baseTable: string | null
    dataType: string | null
    defaultAggregation: string | null
    format: string | null
    requiredPermission: string | null
    category: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticMetricCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    displayName: number
    displayNameAr: number
    description: number
    expression: number
    database: number
    baseTable: number
    dataType: number
    defaultAggregation: number
    format: number
    requiredPermission: number
    category: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SemanticMetricAvgAggregateInputType = {
    sortOrder?: true
  }

  export type SemanticMetricSumAggregateInputType = {
    sortOrder?: true
  }

  export type SemanticMetricMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    expression?: true
    database?: true
    baseTable?: true
    dataType?: true
    defaultAggregation?: true
    format?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticMetricMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    expression?: true
    database?: true
    baseTable?: true
    dataType?: true
    defaultAggregation?: true
    format?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticMetricCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    expression?: true
    database?: true
    baseTable?: true
    dataType?: true
    defaultAggregation?: true
    format?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SemanticMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticMetric to aggregate.
     */
    where?: SemanticMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticMetrics to fetch.
     */
    orderBy?: SemanticMetricOrderByWithRelationInput | SemanticMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SemanticMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SemanticMetrics
    **/
    _count?: true | SemanticMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SemanticMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SemanticMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SemanticMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SemanticMetricMaxAggregateInputType
  }

  export type GetSemanticMetricAggregateType<T extends SemanticMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateSemanticMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSemanticMetric[P]>
      : GetScalarType<T[P], AggregateSemanticMetric[P]>
  }




  export type SemanticMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SemanticMetricWhereInput
    orderBy?: SemanticMetricOrderByWithAggregationInput | SemanticMetricOrderByWithAggregationInput[]
    by: SemanticMetricScalarFieldEnum[] | SemanticMetricScalarFieldEnum
    having?: SemanticMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SemanticMetricCountAggregateInputType | true
    _avg?: SemanticMetricAvgAggregateInputType
    _sum?: SemanticMetricSumAggregateInputType
    _min?: SemanticMetricMinAggregateInputType
    _max?: SemanticMetricMaxAggregateInputType
  }

  export type SemanticMetricGroupByOutputType = {
    id: string
    tenantId: string | null
    name: string
    displayName: string
    displayNameAr: string | null
    description: string | null
    expression: string
    database: string
    baseTable: string
    dataType: string | null
    defaultAggregation: string | null
    format: string | null
    requiredPermission: string | null
    category: string | null
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SemanticMetricCountAggregateOutputType | null
    _avg: SemanticMetricAvgAggregateOutputType | null
    _sum: SemanticMetricSumAggregateOutputType | null
    _min: SemanticMetricMinAggregateOutputType | null
    _max: SemanticMetricMaxAggregateOutputType | null
  }

  type GetSemanticMetricGroupByPayload<T extends SemanticMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SemanticMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SemanticMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SemanticMetricGroupByOutputType[P]>
            : GetScalarType<T[P], SemanticMetricGroupByOutputType[P]>
        }
      >
    >


  export type SemanticMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    expression?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    defaultAggregation?: boolean
    format?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticMetric"]>

  export type SemanticMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    expression?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    defaultAggregation?: boolean
    format?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticMetric"]>

  export type SemanticMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    expression?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    defaultAggregation?: boolean
    format?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticMetric"]>

  export type SemanticMetricSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    expression?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    defaultAggregation?: boolean
    format?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SemanticMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "displayName" | "displayNameAr" | "description" | "expression" | "database" | "baseTable" | "dataType" | "defaultAggregation" | "format" | "requiredPermission" | "category" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["semanticMetric"]>

  export type $SemanticMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SemanticMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      name: string
      displayName: string
      displayNameAr: string | null
      description: string | null
      expression: string
      database: string
      baseTable: string
      dataType: string | null
      defaultAggregation: string | null
      format: string | null
      requiredPermission: string | null
      category: string | null
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["semanticMetric"]>
    composites: {}
  }

  type SemanticMetricGetPayload<S extends boolean | null | undefined | SemanticMetricDefaultArgs> = $Result.GetResult<Prisma.$SemanticMetricPayload, S>

  type SemanticMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SemanticMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SemanticMetricCountAggregateInputType | true
    }

  export interface SemanticMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SemanticMetric'], meta: { name: 'SemanticMetric' } }
    /**
     * Find zero or one SemanticMetric that matches the filter.
     * @param {SemanticMetricFindUniqueArgs} args - Arguments to find a SemanticMetric
     * @example
     * // Get one SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SemanticMetricFindUniqueArgs>(args: SelectSubset<T, SemanticMetricFindUniqueArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SemanticMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SemanticMetricFindUniqueOrThrowArgs} args - Arguments to find a SemanticMetric
     * @example
     * // Get one SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SemanticMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, SemanticMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricFindFirstArgs} args - Arguments to find a SemanticMetric
     * @example
     * // Get one SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SemanticMetricFindFirstArgs>(args?: SelectSubset<T, SemanticMetricFindFirstArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricFindFirstOrThrowArgs} args - Arguments to find a SemanticMetric
     * @example
     * // Get one SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SemanticMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, SemanticMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SemanticMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SemanticMetrics
     * const semanticMetrics = await prisma.semanticMetric.findMany()
     * 
     * // Get first 10 SemanticMetrics
     * const semanticMetrics = await prisma.semanticMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const semanticMetricWithIdOnly = await prisma.semanticMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SemanticMetricFindManyArgs>(args?: SelectSubset<T, SemanticMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SemanticMetric.
     * @param {SemanticMetricCreateArgs} args - Arguments to create a SemanticMetric.
     * @example
     * // Create one SemanticMetric
     * const SemanticMetric = await prisma.semanticMetric.create({
     *   data: {
     *     // ... data to create a SemanticMetric
     *   }
     * })
     * 
     */
    create<T extends SemanticMetricCreateArgs>(args: SelectSubset<T, SemanticMetricCreateArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SemanticMetrics.
     * @param {SemanticMetricCreateManyArgs} args - Arguments to create many SemanticMetrics.
     * @example
     * // Create many SemanticMetrics
     * const semanticMetric = await prisma.semanticMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SemanticMetricCreateManyArgs>(args?: SelectSubset<T, SemanticMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SemanticMetrics and returns the data saved in the database.
     * @param {SemanticMetricCreateManyAndReturnArgs} args - Arguments to create many SemanticMetrics.
     * @example
     * // Create many SemanticMetrics
     * const semanticMetric = await prisma.semanticMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SemanticMetrics and only return the `id`
     * const semanticMetricWithIdOnly = await prisma.semanticMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SemanticMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, SemanticMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SemanticMetric.
     * @param {SemanticMetricDeleteArgs} args - Arguments to delete one SemanticMetric.
     * @example
     * // Delete one SemanticMetric
     * const SemanticMetric = await prisma.semanticMetric.delete({
     *   where: {
     *     // ... filter to delete one SemanticMetric
     *   }
     * })
     * 
     */
    delete<T extends SemanticMetricDeleteArgs>(args: SelectSubset<T, SemanticMetricDeleteArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SemanticMetric.
     * @param {SemanticMetricUpdateArgs} args - Arguments to update one SemanticMetric.
     * @example
     * // Update one SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SemanticMetricUpdateArgs>(args: SelectSubset<T, SemanticMetricUpdateArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SemanticMetrics.
     * @param {SemanticMetricDeleteManyArgs} args - Arguments to filter SemanticMetrics to delete.
     * @example
     * // Delete a few SemanticMetrics
     * const { count } = await prisma.semanticMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SemanticMetricDeleteManyArgs>(args?: SelectSubset<T, SemanticMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SemanticMetrics
     * const semanticMetric = await prisma.semanticMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SemanticMetricUpdateManyArgs>(args: SelectSubset<T, SemanticMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticMetrics and returns the data updated in the database.
     * @param {SemanticMetricUpdateManyAndReturnArgs} args - Arguments to update many SemanticMetrics.
     * @example
     * // Update many SemanticMetrics
     * const semanticMetric = await prisma.semanticMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SemanticMetrics and only return the `id`
     * const semanticMetricWithIdOnly = await prisma.semanticMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SemanticMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, SemanticMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SemanticMetric.
     * @param {SemanticMetricUpsertArgs} args - Arguments to update or create a SemanticMetric.
     * @example
     * // Update or create a SemanticMetric
     * const semanticMetric = await prisma.semanticMetric.upsert({
     *   create: {
     *     // ... data to create a SemanticMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SemanticMetric we want to update
     *   }
     * })
     */
    upsert<T extends SemanticMetricUpsertArgs>(args: SelectSubset<T, SemanticMetricUpsertArgs<ExtArgs>>): Prisma__SemanticMetricClient<$Result.GetResult<Prisma.$SemanticMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SemanticMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricCountArgs} args - Arguments to filter SemanticMetrics to count.
     * @example
     * // Count the number of SemanticMetrics
     * const count = await prisma.semanticMetric.count({
     *   where: {
     *     // ... the filter for the SemanticMetrics we want to count
     *   }
     * })
    **/
    count<T extends SemanticMetricCountArgs>(
      args?: Subset<T, SemanticMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SemanticMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SemanticMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SemanticMetricAggregateArgs>(args: Subset<T, SemanticMetricAggregateArgs>): Prisma.PrismaPromise<GetSemanticMetricAggregateType<T>>

    /**
     * Group by SemanticMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticMetricGroupByArgs} args - Group by arguments.
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
      T extends SemanticMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SemanticMetricGroupByArgs['orderBy'] }
        : { orderBy?: SemanticMetricGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SemanticMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSemanticMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SemanticMetric model
   */
  readonly fields: SemanticMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SemanticMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SemanticMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SemanticMetric model
   */
  interface SemanticMetricFieldRefs {
    readonly id: FieldRef<"SemanticMetric", 'String'>
    readonly tenantId: FieldRef<"SemanticMetric", 'String'>
    readonly name: FieldRef<"SemanticMetric", 'String'>
    readonly displayName: FieldRef<"SemanticMetric", 'String'>
    readonly displayNameAr: FieldRef<"SemanticMetric", 'String'>
    readonly description: FieldRef<"SemanticMetric", 'String'>
    readonly expression: FieldRef<"SemanticMetric", 'String'>
    readonly database: FieldRef<"SemanticMetric", 'String'>
    readonly baseTable: FieldRef<"SemanticMetric", 'String'>
    readonly dataType: FieldRef<"SemanticMetric", 'String'>
    readonly defaultAggregation: FieldRef<"SemanticMetric", 'String'>
    readonly format: FieldRef<"SemanticMetric", 'String'>
    readonly requiredPermission: FieldRef<"SemanticMetric", 'String'>
    readonly category: FieldRef<"SemanticMetric", 'String'>
    readonly sortOrder: FieldRef<"SemanticMetric", 'Int'>
    readonly isActive: FieldRef<"SemanticMetric", 'Boolean'>
    readonly createdAt: FieldRef<"SemanticMetric", 'DateTime'>
    readonly updatedAt: FieldRef<"SemanticMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SemanticMetric findUnique
   */
  export type SemanticMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter, which SemanticMetric to fetch.
     */
    where: SemanticMetricWhereUniqueInput
  }

  /**
   * SemanticMetric findUniqueOrThrow
   */
  export type SemanticMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter, which SemanticMetric to fetch.
     */
    where: SemanticMetricWhereUniqueInput
  }

  /**
   * SemanticMetric findFirst
   */
  export type SemanticMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter, which SemanticMetric to fetch.
     */
    where?: SemanticMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticMetrics to fetch.
     */
    orderBy?: SemanticMetricOrderByWithRelationInput | SemanticMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticMetrics.
     */
    cursor?: SemanticMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticMetrics.
     */
    distinct?: SemanticMetricScalarFieldEnum | SemanticMetricScalarFieldEnum[]
  }

  /**
   * SemanticMetric findFirstOrThrow
   */
  export type SemanticMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter, which SemanticMetric to fetch.
     */
    where?: SemanticMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticMetrics to fetch.
     */
    orderBy?: SemanticMetricOrderByWithRelationInput | SemanticMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticMetrics.
     */
    cursor?: SemanticMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticMetrics.
     */
    distinct?: SemanticMetricScalarFieldEnum | SemanticMetricScalarFieldEnum[]
  }

  /**
   * SemanticMetric findMany
   */
  export type SemanticMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter, which SemanticMetrics to fetch.
     */
    where?: SemanticMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticMetrics to fetch.
     */
    orderBy?: SemanticMetricOrderByWithRelationInput | SemanticMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SemanticMetrics.
     */
    cursor?: SemanticMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticMetrics.
     */
    skip?: number
    distinct?: SemanticMetricScalarFieldEnum | SemanticMetricScalarFieldEnum[]
  }

  /**
   * SemanticMetric create
   */
  export type SemanticMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * The data needed to create a SemanticMetric.
     */
    data: XOR<SemanticMetricCreateInput, SemanticMetricUncheckedCreateInput>
  }

  /**
   * SemanticMetric createMany
   */
  export type SemanticMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SemanticMetrics.
     */
    data: SemanticMetricCreateManyInput | SemanticMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticMetric createManyAndReturn
   */
  export type SemanticMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * The data used to create many SemanticMetrics.
     */
    data: SemanticMetricCreateManyInput | SemanticMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticMetric update
   */
  export type SemanticMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * The data needed to update a SemanticMetric.
     */
    data: XOR<SemanticMetricUpdateInput, SemanticMetricUncheckedUpdateInput>
    /**
     * Choose, which SemanticMetric to update.
     */
    where: SemanticMetricWhereUniqueInput
  }

  /**
   * SemanticMetric updateMany
   */
  export type SemanticMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SemanticMetrics.
     */
    data: XOR<SemanticMetricUpdateManyMutationInput, SemanticMetricUncheckedUpdateManyInput>
    /**
     * Filter which SemanticMetrics to update
     */
    where?: SemanticMetricWhereInput
    /**
     * Limit how many SemanticMetrics to update.
     */
    limit?: number
  }

  /**
   * SemanticMetric updateManyAndReturn
   */
  export type SemanticMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * The data used to update SemanticMetrics.
     */
    data: XOR<SemanticMetricUpdateManyMutationInput, SemanticMetricUncheckedUpdateManyInput>
    /**
     * Filter which SemanticMetrics to update
     */
    where?: SemanticMetricWhereInput
    /**
     * Limit how many SemanticMetrics to update.
     */
    limit?: number
  }

  /**
   * SemanticMetric upsert
   */
  export type SemanticMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * The filter to search for the SemanticMetric to update in case it exists.
     */
    where: SemanticMetricWhereUniqueInput
    /**
     * In case the SemanticMetric found by the `where` argument doesn't exist, create a new SemanticMetric with this data.
     */
    create: XOR<SemanticMetricCreateInput, SemanticMetricUncheckedCreateInput>
    /**
     * In case the SemanticMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SemanticMetricUpdateInput, SemanticMetricUncheckedUpdateInput>
  }

  /**
   * SemanticMetric delete
   */
  export type SemanticMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
    /**
     * Filter which SemanticMetric to delete.
     */
    where: SemanticMetricWhereUniqueInput
  }

  /**
   * SemanticMetric deleteMany
   */
  export type SemanticMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticMetrics to delete
     */
    where?: SemanticMetricWhereInput
    /**
     * Limit how many SemanticMetrics to delete.
     */
    limit?: number
  }

  /**
   * SemanticMetric without action
   */
  export type SemanticMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticMetric
     */
    select?: SemanticMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticMetric
     */
    omit?: SemanticMetricOmit<ExtArgs> | null
  }


  /**
   * Model SemanticDimension
   */

  export type AggregateSemanticDimension = {
    _count: SemanticDimensionCountAggregateOutputType | null
    _avg: SemanticDimensionAvgAggregateOutputType | null
    _sum: SemanticDimensionSumAggregateOutputType | null
    _min: SemanticDimensionMinAggregateOutputType | null
    _max: SemanticDimensionMaxAggregateOutputType | null
  }

  export type SemanticDimensionAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type SemanticDimensionSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type SemanticDimensionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    displayName: string | null
    displayNameAr: string | null
    description: string | null
    columnRef: string | null
    database: string | null
    baseTable: string | null
    dataType: string | null
    isLookup: boolean | null
    requiredPermission: string | null
    category: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticDimensionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    displayName: string | null
    displayNameAr: string | null
    description: string | null
    columnRef: string | null
    database: string | null
    baseTable: string | null
    dataType: string | null
    isLookup: boolean | null
    requiredPermission: string | null
    category: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticDimensionCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    displayName: number
    displayNameAr: number
    description: number
    columnRef: number
    database: number
    baseTable: number
    dataType: number
    allowedOperators: number
    isLookup: number
    lookupValues: number
    requiredPermission: number
    category: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SemanticDimensionAvgAggregateInputType = {
    sortOrder?: true
  }

  export type SemanticDimensionSumAggregateInputType = {
    sortOrder?: true
  }

  export type SemanticDimensionMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    columnRef?: true
    database?: true
    baseTable?: true
    dataType?: true
    isLookup?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticDimensionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    columnRef?: true
    database?: true
    baseTable?: true
    dataType?: true
    isLookup?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticDimensionCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    displayName?: true
    displayNameAr?: true
    description?: true
    columnRef?: true
    database?: true
    baseTable?: true
    dataType?: true
    allowedOperators?: true
    isLookup?: true
    lookupValues?: true
    requiredPermission?: true
    category?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SemanticDimensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticDimension to aggregate.
     */
    where?: SemanticDimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticDimensions to fetch.
     */
    orderBy?: SemanticDimensionOrderByWithRelationInput | SemanticDimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SemanticDimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticDimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticDimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SemanticDimensions
    **/
    _count?: true | SemanticDimensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SemanticDimensionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SemanticDimensionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SemanticDimensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SemanticDimensionMaxAggregateInputType
  }

  export type GetSemanticDimensionAggregateType<T extends SemanticDimensionAggregateArgs> = {
        [P in keyof T & keyof AggregateSemanticDimension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSemanticDimension[P]>
      : GetScalarType<T[P], AggregateSemanticDimension[P]>
  }




  export type SemanticDimensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SemanticDimensionWhereInput
    orderBy?: SemanticDimensionOrderByWithAggregationInput | SemanticDimensionOrderByWithAggregationInput[]
    by: SemanticDimensionScalarFieldEnum[] | SemanticDimensionScalarFieldEnum
    having?: SemanticDimensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SemanticDimensionCountAggregateInputType | true
    _avg?: SemanticDimensionAvgAggregateInputType
    _sum?: SemanticDimensionSumAggregateInputType
    _min?: SemanticDimensionMinAggregateInputType
    _max?: SemanticDimensionMaxAggregateInputType
  }

  export type SemanticDimensionGroupByOutputType = {
    id: string
    tenantId: string | null
    name: string
    displayName: string
    displayNameAr: string | null
    description: string | null
    columnRef: string
    database: string
    baseTable: string
    dataType: string | null
    allowedOperators: string[]
    isLookup: boolean
    lookupValues: string[]
    requiredPermission: string | null
    category: string | null
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SemanticDimensionCountAggregateOutputType | null
    _avg: SemanticDimensionAvgAggregateOutputType | null
    _sum: SemanticDimensionSumAggregateOutputType | null
    _min: SemanticDimensionMinAggregateOutputType | null
    _max: SemanticDimensionMaxAggregateOutputType | null
  }

  type GetSemanticDimensionGroupByPayload<T extends SemanticDimensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SemanticDimensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SemanticDimensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SemanticDimensionGroupByOutputType[P]>
            : GetScalarType<T[P], SemanticDimensionGroupByOutputType[P]>
        }
      >
    >


  export type SemanticDimensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    columnRef?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    allowedOperators?: boolean
    isLookup?: boolean
    lookupValues?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticDimension"]>

  export type SemanticDimensionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    columnRef?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    allowedOperators?: boolean
    isLookup?: boolean
    lookupValues?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticDimension"]>

  export type SemanticDimensionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    columnRef?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    allowedOperators?: boolean
    isLookup?: boolean
    lookupValues?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticDimension"]>

  export type SemanticDimensionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    displayName?: boolean
    displayNameAr?: boolean
    description?: boolean
    columnRef?: boolean
    database?: boolean
    baseTable?: boolean
    dataType?: boolean
    allowedOperators?: boolean
    isLookup?: boolean
    lookupValues?: boolean
    requiredPermission?: boolean
    category?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SemanticDimensionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "displayName" | "displayNameAr" | "description" | "columnRef" | "database" | "baseTable" | "dataType" | "allowedOperators" | "isLookup" | "lookupValues" | "requiredPermission" | "category" | "sortOrder" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["semanticDimension"]>

  export type $SemanticDimensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SemanticDimension"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      name: string
      displayName: string
      displayNameAr: string | null
      description: string | null
      columnRef: string
      database: string
      baseTable: string
      dataType: string | null
      allowedOperators: string[]
      isLookup: boolean
      lookupValues: string[]
      requiredPermission: string | null
      category: string | null
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["semanticDimension"]>
    composites: {}
  }

  type SemanticDimensionGetPayload<S extends boolean | null | undefined | SemanticDimensionDefaultArgs> = $Result.GetResult<Prisma.$SemanticDimensionPayload, S>

  type SemanticDimensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SemanticDimensionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SemanticDimensionCountAggregateInputType | true
    }

  export interface SemanticDimensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SemanticDimension'], meta: { name: 'SemanticDimension' } }
    /**
     * Find zero or one SemanticDimension that matches the filter.
     * @param {SemanticDimensionFindUniqueArgs} args - Arguments to find a SemanticDimension
     * @example
     * // Get one SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SemanticDimensionFindUniqueArgs>(args: SelectSubset<T, SemanticDimensionFindUniqueArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SemanticDimension that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SemanticDimensionFindUniqueOrThrowArgs} args - Arguments to find a SemanticDimension
     * @example
     * // Get one SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SemanticDimensionFindUniqueOrThrowArgs>(args: SelectSubset<T, SemanticDimensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticDimension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionFindFirstArgs} args - Arguments to find a SemanticDimension
     * @example
     * // Get one SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SemanticDimensionFindFirstArgs>(args?: SelectSubset<T, SemanticDimensionFindFirstArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticDimension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionFindFirstOrThrowArgs} args - Arguments to find a SemanticDimension
     * @example
     * // Get one SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SemanticDimensionFindFirstOrThrowArgs>(args?: SelectSubset<T, SemanticDimensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SemanticDimensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SemanticDimensions
     * const semanticDimensions = await prisma.semanticDimension.findMany()
     * 
     * // Get first 10 SemanticDimensions
     * const semanticDimensions = await prisma.semanticDimension.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const semanticDimensionWithIdOnly = await prisma.semanticDimension.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SemanticDimensionFindManyArgs>(args?: SelectSubset<T, SemanticDimensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SemanticDimension.
     * @param {SemanticDimensionCreateArgs} args - Arguments to create a SemanticDimension.
     * @example
     * // Create one SemanticDimension
     * const SemanticDimension = await prisma.semanticDimension.create({
     *   data: {
     *     // ... data to create a SemanticDimension
     *   }
     * })
     * 
     */
    create<T extends SemanticDimensionCreateArgs>(args: SelectSubset<T, SemanticDimensionCreateArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SemanticDimensions.
     * @param {SemanticDimensionCreateManyArgs} args - Arguments to create many SemanticDimensions.
     * @example
     * // Create many SemanticDimensions
     * const semanticDimension = await prisma.semanticDimension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SemanticDimensionCreateManyArgs>(args?: SelectSubset<T, SemanticDimensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SemanticDimensions and returns the data saved in the database.
     * @param {SemanticDimensionCreateManyAndReturnArgs} args - Arguments to create many SemanticDimensions.
     * @example
     * // Create many SemanticDimensions
     * const semanticDimension = await prisma.semanticDimension.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SemanticDimensions and only return the `id`
     * const semanticDimensionWithIdOnly = await prisma.semanticDimension.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SemanticDimensionCreateManyAndReturnArgs>(args?: SelectSubset<T, SemanticDimensionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SemanticDimension.
     * @param {SemanticDimensionDeleteArgs} args - Arguments to delete one SemanticDimension.
     * @example
     * // Delete one SemanticDimension
     * const SemanticDimension = await prisma.semanticDimension.delete({
     *   where: {
     *     // ... filter to delete one SemanticDimension
     *   }
     * })
     * 
     */
    delete<T extends SemanticDimensionDeleteArgs>(args: SelectSubset<T, SemanticDimensionDeleteArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SemanticDimension.
     * @param {SemanticDimensionUpdateArgs} args - Arguments to update one SemanticDimension.
     * @example
     * // Update one SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SemanticDimensionUpdateArgs>(args: SelectSubset<T, SemanticDimensionUpdateArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SemanticDimensions.
     * @param {SemanticDimensionDeleteManyArgs} args - Arguments to filter SemanticDimensions to delete.
     * @example
     * // Delete a few SemanticDimensions
     * const { count } = await prisma.semanticDimension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SemanticDimensionDeleteManyArgs>(args?: SelectSubset<T, SemanticDimensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticDimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SemanticDimensions
     * const semanticDimension = await prisma.semanticDimension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SemanticDimensionUpdateManyArgs>(args: SelectSubset<T, SemanticDimensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticDimensions and returns the data updated in the database.
     * @param {SemanticDimensionUpdateManyAndReturnArgs} args - Arguments to update many SemanticDimensions.
     * @example
     * // Update many SemanticDimensions
     * const semanticDimension = await prisma.semanticDimension.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SemanticDimensions and only return the `id`
     * const semanticDimensionWithIdOnly = await prisma.semanticDimension.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SemanticDimensionUpdateManyAndReturnArgs>(args: SelectSubset<T, SemanticDimensionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SemanticDimension.
     * @param {SemanticDimensionUpsertArgs} args - Arguments to update or create a SemanticDimension.
     * @example
     * // Update or create a SemanticDimension
     * const semanticDimension = await prisma.semanticDimension.upsert({
     *   create: {
     *     // ... data to create a SemanticDimension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SemanticDimension we want to update
     *   }
     * })
     */
    upsert<T extends SemanticDimensionUpsertArgs>(args: SelectSubset<T, SemanticDimensionUpsertArgs<ExtArgs>>): Prisma__SemanticDimensionClient<$Result.GetResult<Prisma.$SemanticDimensionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SemanticDimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionCountArgs} args - Arguments to filter SemanticDimensions to count.
     * @example
     * // Count the number of SemanticDimensions
     * const count = await prisma.semanticDimension.count({
     *   where: {
     *     // ... the filter for the SemanticDimensions we want to count
     *   }
     * })
    **/
    count<T extends SemanticDimensionCountArgs>(
      args?: Subset<T, SemanticDimensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SemanticDimensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SemanticDimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SemanticDimensionAggregateArgs>(args: Subset<T, SemanticDimensionAggregateArgs>): Prisma.PrismaPromise<GetSemanticDimensionAggregateType<T>>

    /**
     * Group by SemanticDimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticDimensionGroupByArgs} args - Group by arguments.
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
      T extends SemanticDimensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SemanticDimensionGroupByArgs['orderBy'] }
        : { orderBy?: SemanticDimensionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SemanticDimensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSemanticDimensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SemanticDimension model
   */
  readonly fields: SemanticDimensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SemanticDimension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SemanticDimensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SemanticDimension model
   */
  interface SemanticDimensionFieldRefs {
    readonly id: FieldRef<"SemanticDimension", 'String'>
    readonly tenantId: FieldRef<"SemanticDimension", 'String'>
    readonly name: FieldRef<"SemanticDimension", 'String'>
    readonly displayName: FieldRef<"SemanticDimension", 'String'>
    readonly displayNameAr: FieldRef<"SemanticDimension", 'String'>
    readonly description: FieldRef<"SemanticDimension", 'String'>
    readonly columnRef: FieldRef<"SemanticDimension", 'String'>
    readonly database: FieldRef<"SemanticDimension", 'String'>
    readonly baseTable: FieldRef<"SemanticDimension", 'String'>
    readonly dataType: FieldRef<"SemanticDimension", 'String'>
    readonly allowedOperators: FieldRef<"SemanticDimension", 'String[]'>
    readonly isLookup: FieldRef<"SemanticDimension", 'Boolean'>
    readonly lookupValues: FieldRef<"SemanticDimension", 'String[]'>
    readonly requiredPermission: FieldRef<"SemanticDimension", 'String'>
    readonly category: FieldRef<"SemanticDimension", 'String'>
    readonly sortOrder: FieldRef<"SemanticDimension", 'Int'>
    readonly isActive: FieldRef<"SemanticDimension", 'Boolean'>
    readonly createdAt: FieldRef<"SemanticDimension", 'DateTime'>
    readonly updatedAt: FieldRef<"SemanticDimension", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SemanticDimension findUnique
   */
  export type SemanticDimensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter, which SemanticDimension to fetch.
     */
    where: SemanticDimensionWhereUniqueInput
  }

  /**
   * SemanticDimension findUniqueOrThrow
   */
  export type SemanticDimensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter, which SemanticDimension to fetch.
     */
    where: SemanticDimensionWhereUniqueInput
  }

  /**
   * SemanticDimension findFirst
   */
  export type SemanticDimensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter, which SemanticDimension to fetch.
     */
    where?: SemanticDimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticDimensions to fetch.
     */
    orderBy?: SemanticDimensionOrderByWithRelationInput | SemanticDimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticDimensions.
     */
    cursor?: SemanticDimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticDimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticDimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticDimensions.
     */
    distinct?: SemanticDimensionScalarFieldEnum | SemanticDimensionScalarFieldEnum[]
  }

  /**
   * SemanticDimension findFirstOrThrow
   */
  export type SemanticDimensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter, which SemanticDimension to fetch.
     */
    where?: SemanticDimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticDimensions to fetch.
     */
    orderBy?: SemanticDimensionOrderByWithRelationInput | SemanticDimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticDimensions.
     */
    cursor?: SemanticDimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticDimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticDimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticDimensions.
     */
    distinct?: SemanticDimensionScalarFieldEnum | SemanticDimensionScalarFieldEnum[]
  }

  /**
   * SemanticDimension findMany
   */
  export type SemanticDimensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter, which SemanticDimensions to fetch.
     */
    where?: SemanticDimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticDimensions to fetch.
     */
    orderBy?: SemanticDimensionOrderByWithRelationInput | SemanticDimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SemanticDimensions.
     */
    cursor?: SemanticDimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticDimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticDimensions.
     */
    skip?: number
    distinct?: SemanticDimensionScalarFieldEnum | SemanticDimensionScalarFieldEnum[]
  }

  /**
   * SemanticDimension create
   */
  export type SemanticDimensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * The data needed to create a SemanticDimension.
     */
    data: XOR<SemanticDimensionCreateInput, SemanticDimensionUncheckedCreateInput>
  }

  /**
   * SemanticDimension createMany
   */
  export type SemanticDimensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SemanticDimensions.
     */
    data: SemanticDimensionCreateManyInput | SemanticDimensionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticDimension createManyAndReturn
   */
  export type SemanticDimensionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * The data used to create many SemanticDimensions.
     */
    data: SemanticDimensionCreateManyInput | SemanticDimensionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticDimension update
   */
  export type SemanticDimensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * The data needed to update a SemanticDimension.
     */
    data: XOR<SemanticDimensionUpdateInput, SemanticDimensionUncheckedUpdateInput>
    /**
     * Choose, which SemanticDimension to update.
     */
    where: SemanticDimensionWhereUniqueInput
  }

  /**
   * SemanticDimension updateMany
   */
  export type SemanticDimensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SemanticDimensions.
     */
    data: XOR<SemanticDimensionUpdateManyMutationInput, SemanticDimensionUncheckedUpdateManyInput>
    /**
     * Filter which SemanticDimensions to update
     */
    where?: SemanticDimensionWhereInput
    /**
     * Limit how many SemanticDimensions to update.
     */
    limit?: number
  }

  /**
   * SemanticDimension updateManyAndReturn
   */
  export type SemanticDimensionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * The data used to update SemanticDimensions.
     */
    data: XOR<SemanticDimensionUpdateManyMutationInput, SemanticDimensionUncheckedUpdateManyInput>
    /**
     * Filter which SemanticDimensions to update
     */
    where?: SemanticDimensionWhereInput
    /**
     * Limit how many SemanticDimensions to update.
     */
    limit?: number
  }

  /**
   * SemanticDimension upsert
   */
  export type SemanticDimensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * The filter to search for the SemanticDimension to update in case it exists.
     */
    where: SemanticDimensionWhereUniqueInput
    /**
     * In case the SemanticDimension found by the `where` argument doesn't exist, create a new SemanticDimension with this data.
     */
    create: XOR<SemanticDimensionCreateInput, SemanticDimensionUncheckedCreateInput>
    /**
     * In case the SemanticDimension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SemanticDimensionUpdateInput, SemanticDimensionUncheckedUpdateInput>
  }

  /**
   * SemanticDimension delete
   */
  export type SemanticDimensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
    /**
     * Filter which SemanticDimension to delete.
     */
    where: SemanticDimensionWhereUniqueInput
  }

  /**
   * SemanticDimension deleteMany
   */
  export type SemanticDimensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticDimensions to delete
     */
    where?: SemanticDimensionWhereInput
    /**
     * Limit how many SemanticDimensions to delete.
     */
    limit?: number
  }

  /**
   * SemanticDimension without action
   */
  export type SemanticDimensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticDimension
     */
    select?: SemanticDimensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticDimension
     */
    omit?: SemanticDimensionOmit<ExtArgs> | null
  }


  /**
   * Model SemanticJoinPath
   */

  export type AggregateSemanticJoinPath = {
    _count: SemanticJoinPathCountAggregateOutputType | null
    _min: SemanticJoinPathMinAggregateOutputType | null
    _max: SemanticJoinPathMaxAggregateOutputType | null
  }

  export type SemanticJoinPathMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    fromTable: string | null
    fromDatabase: string | null
    toTable: string | null
    toDatabase: string | null
    joinType: string | null
    joinCondition: string | null
    cardinality: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticJoinPathMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    name: string | null
    fromTable: string | null
    fromDatabase: string | null
    toTable: string | null
    toDatabase: string | null
    joinType: string | null
    joinCondition: string | null
    cardinality: string | null
    description: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SemanticJoinPathCountAggregateOutputType = {
    id: number
    tenantId: number
    name: number
    fromTable: number
    fromDatabase: number
    toTable: number
    toDatabase: number
    joinType: number
    joinCondition: number
    cardinality: number
    description: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SemanticJoinPathMinAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    fromTable?: true
    fromDatabase?: true
    toTable?: true
    toDatabase?: true
    joinType?: true
    joinCondition?: true
    cardinality?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticJoinPathMaxAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    fromTable?: true
    fromDatabase?: true
    toTable?: true
    toDatabase?: true
    joinType?: true
    joinCondition?: true
    cardinality?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SemanticJoinPathCountAggregateInputType = {
    id?: true
    tenantId?: true
    name?: true
    fromTable?: true
    fromDatabase?: true
    toTable?: true
    toDatabase?: true
    joinType?: true
    joinCondition?: true
    cardinality?: true
    description?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SemanticJoinPathAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticJoinPath to aggregate.
     */
    where?: SemanticJoinPathWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticJoinPaths to fetch.
     */
    orderBy?: SemanticJoinPathOrderByWithRelationInput | SemanticJoinPathOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SemanticJoinPathWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticJoinPaths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticJoinPaths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SemanticJoinPaths
    **/
    _count?: true | SemanticJoinPathCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SemanticJoinPathMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SemanticJoinPathMaxAggregateInputType
  }

  export type GetSemanticJoinPathAggregateType<T extends SemanticJoinPathAggregateArgs> = {
        [P in keyof T & keyof AggregateSemanticJoinPath]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSemanticJoinPath[P]>
      : GetScalarType<T[P], AggregateSemanticJoinPath[P]>
  }




  export type SemanticJoinPathGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SemanticJoinPathWhereInput
    orderBy?: SemanticJoinPathOrderByWithAggregationInput | SemanticJoinPathOrderByWithAggregationInput[]
    by: SemanticJoinPathScalarFieldEnum[] | SemanticJoinPathScalarFieldEnum
    having?: SemanticJoinPathScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SemanticJoinPathCountAggregateInputType | true
    _min?: SemanticJoinPathMinAggregateInputType
    _max?: SemanticJoinPathMaxAggregateInputType
  }

  export type SemanticJoinPathGroupByOutputType = {
    id: string
    tenantId: string | null
    name: string
    fromTable: string
    fromDatabase: string
    toTable: string
    toDatabase: string
    joinType: string
    joinCondition: string
    cardinality: string | null
    description: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: SemanticJoinPathCountAggregateOutputType | null
    _min: SemanticJoinPathMinAggregateOutputType | null
    _max: SemanticJoinPathMaxAggregateOutputType | null
  }

  type GetSemanticJoinPathGroupByPayload<T extends SemanticJoinPathGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SemanticJoinPathGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SemanticJoinPathGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SemanticJoinPathGroupByOutputType[P]>
            : GetScalarType<T[P], SemanticJoinPathGroupByOutputType[P]>
        }
      >
    >


  export type SemanticJoinPathSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    fromTable?: boolean
    fromDatabase?: boolean
    toTable?: boolean
    toDatabase?: boolean
    joinType?: boolean
    joinCondition?: boolean
    cardinality?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticJoinPath"]>

  export type SemanticJoinPathSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    fromTable?: boolean
    fromDatabase?: boolean
    toTable?: boolean
    toDatabase?: boolean
    joinType?: boolean
    joinCondition?: boolean
    cardinality?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticJoinPath"]>

  export type SemanticJoinPathSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    name?: boolean
    fromTable?: boolean
    fromDatabase?: boolean
    toTable?: boolean
    toDatabase?: boolean
    joinType?: boolean
    joinCondition?: boolean
    cardinality?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["semanticJoinPath"]>

  export type SemanticJoinPathSelectScalar = {
    id?: boolean
    tenantId?: boolean
    name?: boolean
    fromTable?: boolean
    fromDatabase?: boolean
    toTable?: boolean
    toDatabase?: boolean
    joinType?: boolean
    joinCondition?: boolean
    cardinality?: boolean
    description?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SemanticJoinPathOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "name" | "fromTable" | "fromDatabase" | "toTable" | "toDatabase" | "joinType" | "joinCondition" | "cardinality" | "description" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["semanticJoinPath"]>

  export type $SemanticJoinPathPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SemanticJoinPath"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string | null
      name: string
      fromTable: string
      fromDatabase: string
      toTable: string
      toDatabase: string
      joinType: string
      joinCondition: string
      cardinality: string | null
      description: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["semanticJoinPath"]>
    composites: {}
  }

  type SemanticJoinPathGetPayload<S extends boolean | null | undefined | SemanticJoinPathDefaultArgs> = $Result.GetResult<Prisma.$SemanticJoinPathPayload, S>

  type SemanticJoinPathCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SemanticJoinPathFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SemanticJoinPathCountAggregateInputType | true
    }

  export interface SemanticJoinPathDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SemanticJoinPath'], meta: { name: 'SemanticJoinPath' } }
    /**
     * Find zero or one SemanticJoinPath that matches the filter.
     * @param {SemanticJoinPathFindUniqueArgs} args - Arguments to find a SemanticJoinPath
     * @example
     * // Get one SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SemanticJoinPathFindUniqueArgs>(args: SelectSubset<T, SemanticJoinPathFindUniqueArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SemanticJoinPath that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SemanticJoinPathFindUniqueOrThrowArgs} args - Arguments to find a SemanticJoinPath
     * @example
     * // Get one SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SemanticJoinPathFindUniqueOrThrowArgs>(args: SelectSubset<T, SemanticJoinPathFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticJoinPath that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathFindFirstArgs} args - Arguments to find a SemanticJoinPath
     * @example
     * // Get one SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SemanticJoinPathFindFirstArgs>(args?: SelectSubset<T, SemanticJoinPathFindFirstArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SemanticJoinPath that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathFindFirstOrThrowArgs} args - Arguments to find a SemanticJoinPath
     * @example
     * // Get one SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SemanticJoinPathFindFirstOrThrowArgs>(args?: SelectSubset<T, SemanticJoinPathFindFirstOrThrowArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SemanticJoinPaths that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SemanticJoinPaths
     * const semanticJoinPaths = await prisma.semanticJoinPath.findMany()
     * 
     * // Get first 10 SemanticJoinPaths
     * const semanticJoinPaths = await prisma.semanticJoinPath.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const semanticJoinPathWithIdOnly = await prisma.semanticJoinPath.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SemanticJoinPathFindManyArgs>(args?: SelectSubset<T, SemanticJoinPathFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SemanticJoinPath.
     * @param {SemanticJoinPathCreateArgs} args - Arguments to create a SemanticJoinPath.
     * @example
     * // Create one SemanticJoinPath
     * const SemanticJoinPath = await prisma.semanticJoinPath.create({
     *   data: {
     *     // ... data to create a SemanticJoinPath
     *   }
     * })
     * 
     */
    create<T extends SemanticJoinPathCreateArgs>(args: SelectSubset<T, SemanticJoinPathCreateArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SemanticJoinPaths.
     * @param {SemanticJoinPathCreateManyArgs} args - Arguments to create many SemanticJoinPaths.
     * @example
     * // Create many SemanticJoinPaths
     * const semanticJoinPath = await prisma.semanticJoinPath.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SemanticJoinPathCreateManyArgs>(args?: SelectSubset<T, SemanticJoinPathCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SemanticJoinPaths and returns the data saved in the database.
     * @param {SemanticJoinPathCreateManyAndReturnArgs} args - Arguments to create many SemanticJoinPaths.
     * @example
     * // Create many SemanticJoinPaths
     * const semanticJoinPath = await prisma.semanticJoinPath.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SemanticJoinPaths and only return the `id`
     * const semanticJoinPathWithIdOnly = await prisma.semanticJoinPath.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SemanticJoinPathCreateManyAndReturnArgs>(args?: SelectSubset<T, SemanticJoinPathCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SemanticJoinPath.
     * @param {SemanticJoinPathDeleteArgs} args - Arguments to delete one SemanticJoinPath.
     * @example
     * // Delete one SemanticJoinPath
     * const SemanticJoinPath = await prisma.semanticJoinPath.delete({
     *   where: {
     *     // ... filter to delete one SemanticJoinPath
     *   }
     * })
     * 
     */
    delete<T extends SemanticJoinPathDeleteArgs>(args: SelectSubset<T, SemanticJoinPathDeleteArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SemanticJoinPath.
     * @param {SemanticJoinPathUpdateArgs} args - Arguments to update one SemanticJoinPath.
     * @example
     * // Update one SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SemanticJoinPathUpdateArgs>(args: SelectSubset<T, SemanticJoinPathUpdateArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SemanticJoinPaths.
     * @param {SemanticJoinPathDeleteManyArgs} args - Arguments to filter SemanticJoinPaths to delete.
     * @example
     * // Delete a few SemanticJoinPaths
     * const { count } = await prisma.semanticJoinPath.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SemanticJoinPathDeleteManyArgs>(args?: SelectSubset<T, SemanticJoinPathDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticJoinPaths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SemanticJoinPaths
     * const semanticJoinPath = await prisma.semanticJoinPath.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SemanticJoinPathUpdateManyArgs>(args: SelectSubset<T, SemanticJoinPathUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SemanticJoinPaths and returns the data updated in the database.
     * @param {SemanticJoinPathUpdateManyAndReturnArgs} args - Arguments to update many SemanticJoinPaths.
     * @example
     * // Update many SemanticJoinPaths
     * const semanticJoinPath = await prisma.semanticJoinPath.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SemanticJoinPaths and only return the `id`
     * const semanticJoinPathWithIdOnly = await prisma.semanticJoinPath.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SemanticJoinPathUpdateManyAndReturnArgs>(args: SelectSubset<T, SemanticJoinPathUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SemanticJoinPath.
     * @param {SemanticJoinPathUpsertArgs} args - Arguments to update or create a SemanticJoinPath.
     * @example
     * // Update or create a SemanticJoinPath
     * const semanticJoinPath = await prisma.semanticJoinPath.upsert({
     *   create: {
     *     // ... data to create a SemanticJoinPath
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SemanticJoinPath we want to update
     *   }
     * })
     */
    upsert<T extends SemanticJoinPathUpsertArgs>(args: SelectSubset<T, SemanticJoinPathUpsertArgs<ExtArgs>>): Prisma__SemanticJoinPathClient<$Result.GetResult<Prisma.$SemanticJoinPathPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SemanticJoinPaths.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathCountArgs} args - Arguments to filter SemanticJoinPaths to count.
     * @example
     * // Count the number of SemanticJoinPaths
     * const count = await prisma.semanticJoinPath.count({
     *   where: {
     *     // ... the filter for the SemanticJoinPaths we want to count
     *   }
     * })
    **/
    count<T extends SemanticJoinPathCountArgs>(
      args?: Subset<T, SemanticJoinPathCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SemanticJoinPathCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SemanticJoinPath.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SemanticJoinPathAggregateArgs>(args: Subset<T, SemanticJoinPathAggregateArgs>): Prisma.PrismaPromise<GetSemanticJoinPathAggregateType<T>>

    /**
     * Group by SemanticJoinPath.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SemanticJoinPathGroupByArgs} args - Group by arguments.
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
      T extends SemanticJoinPathGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SemanticJoinPathGroupByArgs['orderBy'] }
        : { orderBy?: SemanticJoinPathGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SemanticJoinPathGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSemanticJoinPathGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SemanticJoinPath model
   */
  readonly fields: SemanticJoinPathFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SemanticJoinPath.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SemanticJoinPathClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SemanticJoinPath model
   */
  interface SemanticJoinPathFieldRefs {
    readonly id: FieldRef<"SemanticJoinPath", 'String'>
    readonly tenantId: FieldRef<"SemanticJoinPath", 'String'>
    readonly name: FieldRef<"SemanticJoinPath", 'String'>
    readonly fromTable: FieldRef<"SemanticJoinPath", 'String'>
    readonly fromDatabase: FieldRef<"SemanticJoinPath", 'String'>
    readonly toTable: FieldRef<"SemanticJoinPath", 'String'>
    readonly toDatabase: FieldRef<"SemanticJoinPath", 'String'>
    readonly joinType: FieldRef<"SemanticJoinPath", 'String'>
    readonly joinCondition: FieldRef<"SemanticJoinPath", 'String'>
    readonly cardinality: FieldRef<"SemanticJoinPath", 'String'>
    readonly description: FieldRef<"SemanticJoinPath", 'String'>
    readonly isActive: FieldRef<"SemanticJoinPath", 'Boolean'>
    readonly createdAt: FieldRef<"SemanticJoinPath", 'DateTime'>
    readonly updatedAt: FieldRef<"SemanticJoinPath", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SemanticJoinPath findUnique
   */
  export type SemanticJoinPathFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter, which SemanticJoinPath to fetch.
     */
    where: SemanticJoinPathWhereUniqueInput
  }

  /**
   * SemanticJoinPath findUniqueOrThrow
   */
  export type SemanticJoinPathFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter, which SemanticJoinPath to fetch.
     */
    where: SemanticJoinPathWhereUniqueInput
  }

  /**
   * SemanticJoinPath findFirst
   */
  export type SemanticJoinPathFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter, which SemanticJoinPath to fetch.
     */
    where?: SemanticJoinPathWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticJoinPaths to fetch.
     */
    orderBy?: SemanticJoinPathOrderByWithRelationInput | SemanticJoinPathOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticJoinPaths.
     */
    cursor?: SemanticJoinPathWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticJoinPaths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticJoinPaths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticJoinPaths.
     */
    distinct?: SemanticJoinPathScalarFieldEnum | SemanticJoinPathScalarFieldEnum[]
  }

  /**
   * SemanticJoinPath findFirstOrThrow
   */
  export type SemanticJoinPathFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter, which SemanticJoinPath to fetch.
     */
    where?: SemanticJoinPathWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticJoinPaths to fetch.
     */
    orderBy?: SemanticJoinPathOrderByWithRelationInput | SemanticJoinPathOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SemanticJoinPaths.
     */
    cursor?: SemanticJoinPathWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticJoinPaths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticJoinPaths.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SemanticJoinPaths.
     */
    distinct?: SemanticJoinPathScalarFieldEnum | SemanticJoinPathScalarFieldEnum[]
  }

  /**
   * SemanticJoinPath findMany
   */
  export type SemanticJoinPathFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter, which SemanticJoinPaths to fetch.
     */
    where?: SemanticJoinPathWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SemanticJoinPaths to fetch.
     */
    orderBy?: SemanticJoinPathOrderByWithRelationInput | SemanticJoinPathOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SemanticJoinPaths.
     */
    cursor?: SemanticJoinPathWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SemanticJoinPaths from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SemanticJoinPaths.
     */
    skip?: number
    distinct?: SemanticJoinPathScalarFieldEnum | SemanticJoinPathScalarFieldEnum[]
  }

  /**
   * SemanticJoinPath create
   */
  export type SemanticJoinPathCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * The data needed to create a SemanticJoinPath.
     */
    data: XOR<SemanticJoinPathCreateInput, SemanticJoinPathUncheckedCreateInput>
  }

  /**
   * SemanticJoinPath createMany
   */
  export type SemanticJoinPathCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SemanticJoinPaths.
     */
    data: SemanticJoinPathCreateManyInput | SemanticJoinPathCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticJoinPath createManyAndReturn
   */
  export type SemanticJoinPathCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * The data used to create many SemanticJoinPaths.
     */
    data: SemanticJoinPathCreateManyInput | SemanticJoinPathCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SemanticJoinPath update
   */
  export type SemanticJoinPathUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * The data needed to update a SemanticJoinPath.
     */
    data: XOR<SemanticJoinPathUpdateInput, SemanticJoinPathUncheckedUpdateInput>
    /**
     * Choose, which SemanticJoinPath to update.
     */
    where: SemanticJoinPathWhereUniqueInput
  }

  /**
   * SemanticJoinPath updateMany
   */
  export type SemanticJoinPathUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SemanticJoinPaths.
     */
    data: XOR<SemanticJoinPathUpdateManyMutationInput, SemanticJoinPathUncheckedUpdateManyInput>
    /**
     * Filter which SemanticJoinPaths to update
     */
    where?: SemanticJoinPathWhereInput
    /**
     * Limit how many SemanticJoinPaths to update.
     */
    limit?: number
  }

  /**
   * SemanticJoinPath updateManyAndReturn
   */
  export type SemanticJoinPathUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * The data used to update SemanticJoinPaths.
     */
    data: XOR<SemanticJoinPathUpdateManyMutationInput, SemanticJoinPathUncheckedUpdateManyInput>
    /**
     * Filter which SemanticJoinPaths to update
     */
    where?: SemanticJoinPathWhereInput
    /**
     * Limit how many SemanticJoinPaths to update.
     */
    limit?: number
  }

  /**
   * SemanticJoinPath upsert
   */
  export type SemanticJoinPathUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * The filter to search for the SemanticJoinPath to update in case it exists.
     */
    where: SemanticJoinPathWhereUniqueInput
    /**
     * In case the SemanticJoinPath found by the `where` argument doesn't exist, create a new SemanticJoinPath with this data.
     */
    create: XOR<SemanticJoinPathCreateInput, SemanticJoinPathUncheckedCreateInput>
    /**
     * In case the SemanticJoinPath was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SemanticJoinPathUpdateInput, SemanticJoinPathUncheckedUpdateInput>
  }

  /**
   * SemanticJoinPath delete
   */
  export type SemanticJoinPathDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
    /**
     * Filter which SemanticJoinPath to delete.
     */
    where: SemanticJoinPathWhereUniqueInput
  }

  /**
   * SemanticJoinPath deleteMany
   */
  export type SemanticJoinPathDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SemanticJoinPaths to delete
     */
    where?: SemanticJoinPathWhereInput
    /**
     * Limit how many SemanticJoinPaths to delete.
     */
    limit?: number
  }

  /**
   * SemanticJoinPath without action
   */
  export type SemanticJoinPathDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SemanticJoinPath
     */
    select?: SemanticJoinPathSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SemanticJoinPath
     */
    omit?: SemanticJoinPathOmit<ExtArgs> | null
  }


  /**
   * Model SavedReport
   */

  export type AggregateSavedReport = {
    _count: SavedReportCountAggregateOutputType | null
    _avg: SavedReportAvgAggregateOutputType | null
    _sum: SavedReportSumAggregateOutputType | null
    _min: SavedReportMinAggregateOutputType | null
    _max: SavedReportMaxAggregateOutputType | null
  }

  export type SavedReportAvgAggregateOutputType = {
    executionCount: number | null
  }

  export type SavedReportSumAggregateOutputType = {
    executionCount: number | null
  }

  export type SavedReportMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    createdById: string | null
    name: string | null
    description: string | null
    query: string | null
    isPublic: boolean | null
    isFavorite: boolean | null
    executionCount: number | null
    lastExecutedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SavedReportMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    createdById: string | null
    name: string | null
    description: string | null
    query: string | null
    isPublic: boolean | null
    isFavorite: boolean | null
    executionCount: number | null
    lastExecutedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SavedReportCountAggregateOutputType = {
    id: number
    tenantId: number
    createdById: number
    name: number
    description: number
    query: number
    queryPlan: number
    isPublic: number
    isFavorite: number
    executionCount: number
    lastExecutedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SavedReportAvgAggregateInputType = {
    executionCount?: true
  }

  export type SavedReportSumAggregateInputType = {
    executionCount?: true
  }

  export type SavedReportMinAggregateInputType = {
    id?: true
    tenantId?: true
    createdById?: true
    name?: true
    description?: true
    query?: true
    isPublic?: true
    isFavorite?: true
    executionCount?: true
    lastExecutedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SavedReportMaxAggregateInputType = {
    id?: true
    tenantId?: true
    createdById?: true
    name?: true
    description?: true
    query?: true
    isPublic?: true
    isFavorite?: true
    executionCount?: true
    lastExecutedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SavedReportCountAggregateInputType = {
    id?: true
    tenantId?: true
    createdById?: true
    name?: true
    description?: true
    query?: true
    queryPlan?: true
    isPublic?: true
    isFavorite?: true
    executionCount?: true
    lastExecutedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SavedReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedReport to aggregate.
     */
    where?: SavedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedReports to fetch.
     */
    orderBy?: SavedReportOrderByWithRelationInput | SavedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SavedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SavedReports
    **/
    _count?: true | SavedReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SavedReportAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SavedReportSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SavedReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SavedReportMaxAggregateInputType
  }

  export type GetSavedReportAggregateType<T extends SavedReportAggregateArgs> = {
        [P in keyof T & keyof AggregateSavedReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSavedReport[P]>
      : GetScalarType<T[P], AggregateSavedReport[P]>
  }




  export type SavedReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SavedReportWhereInput
    orderBy?: SavedReportOrderByWithAggregationInput | SavedReportOrderByWithAggregationInput[]
    by: SavedReportScalarFieldEnum[] | SavedReportScalarFieldEnum
    having?: SavedReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SavedReportCountAggregateInputType | true
    _avg?: SavedReportAvgAggregateInputType
    _sum?: SavedReportSumAggregateInputType
    _min?: SavedReportMinAggregateInputType
    _max?: SavedReportMaxAggregateInputType
  }

  export type SavedReportGroupByOutputType = {
    id: string
    tenantId: string
    createdById: string
    name: string
    description: string | null
    query: string
    queryPlan: JsonValue | null
    isPublic: boolean
    isFavorite: boolean
    executionCount: number
    lastExecutedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SavedReportCountAggregateOutputType | null
    _avg: SavedReportAvgAggregateOutputType | null
    _sum: SavedReportSumAggregateOutputType | null
    _min: SavedReportMinAggregateOutputType | null
    _max: SavedReportMaxAggregateOutputType | null
  }

  type GetSavedReportGroupByPayload<T extends SavedReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SavedReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SavedReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SavedReportGroupByOutputType[P]>
            : GetScalarType<T[P], SavedReportGroupByOutputType[P]>
        }
      >
    >


  export type SavedReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    createdById?: boolean
    name?: boolean
    description?: boolean
    query?: boolean
    queryPlan?: boolean
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: boolean
    lastExecutedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["savedReport"]>

  export type SavedReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    createdById?: boolean
    name?: boolean
    description?: boolean
    query?: boolean
    queryPlan?: boolean
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: boolean
    lastExecutedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["savedReport"]>

  export type SavedReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    createdById?: boolean
    name?: boolean
    description?: boolean
    query?: boolean
    queryPlan?: boolean
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: boolean
    lastExecutedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["savedReport"]>

  export type SavedReportSelectScalar = {
    id?: boolean
    tenantId?: boolean
    createdById?: boolean
    name?: boolean
    description?: boolean
    query?: boolean
    queryPlan?: boolean
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: boolean
    lastExecutedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SavedReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "createdById" | "name" | "description" | "query" | "queryPlan" | "isPublic" | "isFavorite" | "executionCount" | "lastExecutedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["savedReport"]>

  export type $SavedReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SavedReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      createdById: string
      name: string
      description: string | null
      query: string
      queryPlan: Prisma.JsonValue | null
      isPublic: boolean
      isFavorite: boolean
      executionCount: number
      lastExecutedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["savedReport"]>
    composites: {}
  }

  type SavedReportGetPayload<S extends boolean | null | undefined | SavedReportDefaultArgs> = $Result.GetResult<Prisma.$SavedReportPayload, S>

  type SavedReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SavedReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SavedReportCountAggregateInputType | true
    }

  export interface SavedReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SavedReport'], meta: { name: 'SavedReport' } }
    /**
     * Find zero or one SavedReport that matches the filter.
     * @param {SavedReportFindUniqueArgs} args - Arguments to find a SavedReport
     * @example
     * // Get one SavedReport
     * const savedReport = await prisma.savedReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SavedReportFindUniqueArgs>(args: SelectSubset<T, SavedReportFindUniqueArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SavedReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SavedReportFindUniqueOrThrowArgs} args - Arguments to find a SavedReport
     * @example
     * // Get one SavedReport
     * const savedReport = await prisma.savedReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SavedReportFindUniqueOrThrowArgs>(args: SelectSubset<T, SavedReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportFindFirstArgs} args - Arguments to find a SavedReport
     * @example
     * // Get one SavedReport
     * const savedReport = await prisma.savedReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SavedReportFindFirstArgs>(args?: SelectSubset<T, SavedReportFindFirstArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SavedReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportFindFirstOrThrowArgs} args - Arguments to find a SavedReport
     * @example
     * // Get one SavedReport
     * const savedReport = await prisma.savedReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SavedReportFindFirstOrThrowArgs>(args?: SelectSubset<T, SavedReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SavedReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SavedReports
     * const savedReports = await prisma.savedReport.findMany()
     * 
     * // Get first 10 SavedReports
     * const savedReports = await prisma.savedReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const savedReportWithIdOnly = await prisma.savedReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SavedReportFindManyArgs>(args?: SelectSubset<T, SavedReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SavedReport.
     * @param {SavedReportCreateArgs} args - Arguments to create a SavedReport.
     * @example
     * // Create one SavedReport
     * const SavedReport = await prisma.savedReport.create({
     *   data: {
     *     // ... data to create a SavedReport
     *   }
     * })
     * 
     */
    create<T extends SavedReportCreateArgs>(args: SelectSubset<T, SavedReportCreateArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SavedReports.
     * @param {SavedReportCreateManyArgs} args - Arguments to create many SavedReports.
     * @example
     * // Create many SavedReports
     * const savedReport = await prisma.savedReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SavedReportCreateManyArgs>(args?: SelectSubset<T, SavedReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SavedReports and returns the data saved in the database.
     * @param {SavedReportCreateManyAndReturnArgs} args - Arguments to create many SavedReports.
     * @example
     * // Create many SavedReports
     * const savedReport = await prisma.savedReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SavedReports and only return the `id`
     * const savedReportWithIdOnly = await prisma.savedReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SavedReportCreateManyAndReturnArgs>(args?: SelectSubset<T, SavedReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SavedReport.
     * @param {SavedReportDeleteArgs} args - Arguments to delete one SavedReport.
     * @example
     * // Delete one SavedReport
     * const SavedReport = await prisma.savedReport.delete({
     *   where: {
     *     // ... filter to delete one SavedReport
     *   }
     * })
     * 
     */
    delete<T extends SavedReportDeleteArgs>(args: SelectSubset<T, SavedReportDeleteArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SavedReport.
     * @param {SavedReportUpdateArgs} args - Arguments to update one SavedReport.
     * @example
     * // Update one SavedReport
     * const savedReport = await prisma.savedReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SavedReportUpdateArgs>(args: SelectSubset<T, SavedReportUpdateArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SavedReports.
     * @param {SavedReportDeleteManyArgs} args - Arguments to filter SavedReports to delete.
     * @example
     * // Delete a few SavedReports
     * const { count } = await prisma.savedReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SavedReportDeleteManyArgs>(args?: SelectSubset<T, SavedReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SavedReports
     * const savedReport = await prisma.savedReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SavedReportUpdateManyArgs>(args: SelectSubset<T, SavedReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SavedReports and returns the data updated in the database.
     * @param {SavedReportUpdateManyAndReturnArgs} args - Arguments to update many SavedReports.
     * @example
     * // Update many SavedReports
     * const savedReport = await prisma.savedReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SavedReports and only return the `id`
     * const savedReportWithIdOnly = await prisma.savedReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SavedReportUpdateManyAndReturnArgs>(args: SelectSubset<T, SavedReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SavedReport.
     * @param {SavedReportUpsertArgs} args - Arguments to update or create a SavedReport.
     * @example
     * // Update or create a SavedReport
     * const savedReport = await prisma.savedReport.upsert({
     *   create: {
     *     // ... data to create a SavedReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SavedReport we want to update
     *   }
     * })
     */
    upsert<T extends SavedReportUpsertArgs>(args: SelectSubset<T, SavedReportUpsertArgs<ExtArgs>>): Prisma__SavedReportClient<$Result.GetResult<Prisma.$SavedReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SavedReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportCountArgs} args - Arguments to filter SavedReports to count.
     * @example
     * // Count the number of SavedReports
     * const count = await prisma.savedReport.count({
     *   where: {
     *     // ... the filter for the SavedReports we want to count
     *   }
     * })
    **/
    count<T extends SavedReportCountArgs>(
      args?: Subset<T, SavedReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SavedReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SavedReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SavedReportAggregateArgs>(args: Subset<T, SavedReportAggregateArgs>): Prisma.PrismaPromise<GetSavedReportAggregateType<T>>

    /**
     * Group by SavedReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SavedReportGroupByArgs} args - Group by arguments.
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
      T extends SavedReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SavedReportGroupByArgs['orderBy'] }
        : { orderBy?: SavedReportGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SavedReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavedReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SavedReport model
   */
  readonly fields: SavedReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SavedReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SavedReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the SavedReport model
   */
  interface SavedReportFieldRefs {
    readonly id: FieldRef<"SavedReport", 'String'>
    readonly tenantId: FieldRef<"SavedReport", 'String'>
    readonly createdById: FieldRef<"SavedReport", 'String'>
    readonly name: FieldRef<"SavedReport", 'String'>
    readonly description: FieldRef<"SavedReport", 'String'>
    readonly query: FieldRef<"SavedReport", 'String'>
    readonly queryPlan: FieldRef<"SavedReport", 'Json'>
    readonly isPublic: FieldRef<"SavedReport", 'Boolean'>
    readonly isFavorite: FieldRef<"SavedReport", 'Boolean'>
    readonly executionCount: FieldRef<"SavedReport", 'Int'>
    readonly lastExecutedAt: FieldRef<"SavedReport", 'DateTime'>
    readonly createdAt: FieldRef<"SavedReport", 'DateTime'>
    readonly updatedAt: FieldRef<"SavedReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SavedReport findUnique
   */
  export type SavedReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter, which SavedReport to fetch.
     */
    where: SavedReportWhereUniqueInput
  }

  /**
   * SavedReport findUniqueOrThrow
   */
  export type SavedReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter, which SavedReport to fetch.
     */
    where: SavedReportWhereUniqueInput
  }

  /**
   * SavedReport findFirst
   */
  export type SavedReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter, which SavedReport to fetch.
     */
    where?: SavedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedReports to fetch.
     */
    orderBy?: SavedReportOrderByWithRelationInput | SavedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedReports.
     */
    cursor?: SavedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedReports.
     */
    distinct?: SavedReportScalarFieldEnum | SavedReportScalarFieldEnum[]
  }

  /**
   * SavedReport findFirstOrThrow
   */
  export type SavedReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter, which SavedReport to fetch.
     */
    where?: SavedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedReports to fetch.
     */
    orderBy?: SavedReportOrderByWithRelationInput | SavedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SavedReports.
     */
    cursor?: SavedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SavedReports.
     */
    distinct?: SavedReportScalarFieldEnum | SavedReportScalarFieldEnum[]
  }

  /**
   * SavedReport findMany
   */
  export type SavedReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter, which SavedReports to fetch.
     */
    where?: SavedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SavedReports to fetch.
     */
    orderBy?: SavedReportOrderByWithRelationInput | SavedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SavedReports.
     */
    cursor?: SavedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SavedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SavedReports.
     */
    skip?: number
    distinct?: SavedReportScalarFieldEnum | SavedReportScalarFieldEnum[]
  }

  /**
   * SavedReport create
   */
  export type SavedReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * The data needed to create a SavedReport.
     */
    data: XOR<SavedReportCreateInput, SavedReportUncheckedCreateInput>
  }

  /**
   * SavedReport createMany
   */
  export type SavedReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SavedReports.
     */
    data: SavedReportCreateManyInput | SavedReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedReport createManyAndReturn
   */
  export type SavedReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * The data used to create many SavedReports.
     */
    data: SavedReportCreateManyInput | SavedReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SavedReport update
   */
  export type SavedReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * The data needed to update a SavedReport.
     */
    data: XOR<SavedReportUpdateInput, SavedReportUncheckedUpdateInput>
    /**
     * Choose, which SavedReport to update.
     */
    where: SavedReportWhereUniqueInput
  }

  /**
   * SavedReport updateMany
   */
  export type SavedReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SavedReports.
     */
    data: XOR<SavedReportUpdateManyMutationInput, SavedReportUncheckedUpdateManyInput>
    /**
     * Filter which SavedReports to update
     */
    where?: SavedReportWhereInput
    /**
     * Limit how many SavedReports to update.
     */
    limit?: number
  }

  /**
   * SavedReport updateManyAndReturn
   */
  export type SavedReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * The data used to update SavedReports.
     */
    data: XOR<SavedReportUpdateManyMutationInput, SavedReportUncheckedUpdateManyInput>
    /**
     * Filter which SavedReports to update
     */
    where?: SavedReportWhereInput
    /**
     * Limit how many SavedReports to update.
     */
    limit?: number
  }

  /**
   * SavedReport upsert
   */
  export type SavedReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * The filter to search for the SavedReport to update in case it exists.
     */
    where: SavedReportWhereUniqueInput
    /**
     * In case the SavedReport found by the `where` argument doesn't exist, create a new SavedReport with this data.
     */
    create: XOR<SavedReportCreateInput, SavedReportUncheckedCreateInput>
    /**
     * In case the SavedReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SavedReportUpdateInput, SavedReportUncheckedUpdateInput>
  }

  /**
   * SavedReport delete
   */
  export type SavedReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
    /**
     * Filter which SavedReport to delete.
     */
    where: SavedReportWhereUniqueInput
  }

  /**
   * SavedReport deleteMany
   */
  export type SavedReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SavedReports to delete
     */
    where?: SavedReportWhereInput
    /**
     * Limit how many SavedReports to delete.
     */
    limit?: number
  }

  /**
   * SavedReport without action
   */
  export type SavedReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SavedReport
     */
    select?: SavedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SavedReport
     */
    omit?: SavedReportOmit<ExtArgs> | null
  }


  /**
   * Model ClinicalObservationDaily
   */

  export type AggregateClinicalObservationDaily = {
    _count: ClinicalObservationDailyCountAggregateOutputType | null
    _avg: ClinicalObservationDailyAvgAggregateOutputType | null
    _sum: ClinicalObservationDailySumAggregateOutputType | null
    _min: ClinicalObservationDailyMinAggregateOutputType | null
    _max: ClinicalObservationDailyMaxAggregateOutputType | null
  }

  export type ClinicalObservationDailyAvgAggregateOutputType = {
    recordCount: number | null
    avgValue: Decimal | null
    minValue: Decimal | null
    maxValue: Decimal | null
    p50Value: Decimal | null
    p95Value: Decimal | null
    normalCount: number | null
    abnormalHighCount: number | null
    abnormalLowCount: number | null
    criticalCount: number | null
    uniquePatients: number | null
  }

  export type ClinicalObservationDailySumAggregateOutputType = {
    recordCount: number | null
    avgValue: Decimal | null
    minValue: Decimal | null
    maxValue: Decimal | null
    p50Value: Decimal | null
    p95Value: Decimal | null
    normalCount: number | null
    abnormalHighCount: number | null
    abnormalLowCount: number | null
    criticalCount: number | null
    uniquePatients: number | null
  }

  export type ClinicalObservationDailyMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    facilityId: string | null
    departmentId: string | null
    observationDate: Date | null
    code: string | null
    codeSystem: string | null
    category: string | null
    recordCount: number | null
    avgValue: Decimal | null
    minValue: Decimal | null
    maxValue: Decimal | null
    p50Value: Decimal | null
    p95Value: Decimal | null
    normalCount: number | null
    abnormalHighCount: number | null
    abnormalLowCount: number | null
    criticalCount: number | null
    uniquePatients: number | null
    createdAt: Date | null
  }

  export type ClinicalObservationDailyMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    facilityId: string | null
    departmentId: string | null
    observationDate: Date | null
    code: string | null
    codeSystem: string | null
    category: string | null
    recordCount: number | null
    avgValue: Decimal | null
    minValue: Decimal | null
    maxValue: Decimal | null
    p50Value: Decimal | null
    p95Value: Decimal | null
    normalCount: number | null
    abnormalHighCount: number | null
    abnormalLowCount: number | null
    criticalCount: number | null
    uniquePatients: number | null
    createdAt: Date | null
  }

  export type ClinicalObservationDailyCountAggregateOutputType = {
    id: number
    tenantId: number
    facilityId: number
    departmentId: number
    observationDate: number
    code: number
    codeSystem: number
    category: number
    recordCount: number
    avgValue: number
    minValue: number
    maxValue: number
    p50Value: number
    p95Value: number
    normalCount: number
    abnormalHighCount: number
    abnormalLowCount: number
    criticalCount: number
    uniquePatients: number
    createdAt: number
    _all: number
  }


  export type ClinicalObservationDailyAvgAggregateInputType = {
    recordCount?: true
    avgValue?: true
    minValue?: true
    maxValue?: true
    p50Value?: true
    p95Value?: true
    normalCount?: true
    abnormalHighCount?: true
    abnormalLowCount?: true
    criticalCount?: true
    uniquePatients?: true
  }

  export type ClinicalObservationDailySumAggregateInputType = {
    recordCount?: true
    avgValue?: true
    minValue?: true
    maxValue?: true
    p50Value?: true
    p95Value?: true
    normalCount?: true
    abnormalHighCount?: true
    abnormalLowCount?: true
    criticalCount?: true
    uniquePatients?: true
  }

  export type ClinicalObservationDailyMinAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    observationDate?: true
    code?: true
    codeSystem?: true
    category?: true
    recordCount?: true
    avgValue?: true
    minValue?: true
    maxValue?: true
    p50Value?: true
    p95Value?: true
    normalCount?: true
    abnormalHighCount?: true
    abnormalLowCount?: true
    criticalCount?: true
    uniquePatients?: true
    createdAt?: true
  }

  export type ClinicalObservationDailyMaxAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    observationDate?: true
    code?: true
    codeSystem?: true
    category?: true
    recordCount?: true
    avgValue?: true
    minValue?: true
    maxValue?: true
    p50Value?: true
    p95Value?: true
    normalCount?: true
    abnormalHighCount?: true
    abnormalLowCount?: true
    criticalCount?: true
    uniquePatients?: true
    createdAt?: true
  }

  export type ClinicalObservationDailyCountAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    observationDate?: true
    code?: true
    codeSystem?: true
    category?: true
    recordCount?: true
    avgValue?: true
    minValue?: true
    maxValue?: true
    p50Value?: true
    p95Value?: true
    normalCount?: true
    abnormalHighCount?: true
    abnormalLowCount?: true
    criticalCount?: true
    uniquePatients?: true
    createdAt?: true
    _all?: true
  }

  export type ClinicalObservationDailyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalObservationDaily to aggregate.
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalObservationDailies to fetch.
     */
    orderBy?: ClinicalObservationDailyOrderByWithRelationInput | ClinicalObservationDailyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClinicalObservationDailyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalObservationDailies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalObservationDailies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClinicalObservationDailies
    **/
    _count?: true | ClinicalObservationDailyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClinicalObservationDailyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClinicalObservationDailySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClinicalObservationDailyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClinicalObservationDailyMaxAggregateInputType
  }

  export type GetClinicalObservationDailyAggregateType<T extends ClinicalObservationDailyAggregateArgs> = {
        [P in keyof T & keyof AggregateClinicalObservationDaily]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClinicalObservationDaily[P]>
      : GetScalarType<T[P], AggregateClinicalObservationDaily[P]>
  }




  export type ClinicalObservationDailyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalObservationDailyWhereInput
    orderBy?: ClinicalObservationDailyOrderByWithAggregationInput | ClinicalObservationDailyOrderByWithAggregationInput[]
    by: ClinicalObservationDailyScalarFieldEnum[] | ClinicalObservationDailyScalarFieldEnum
    having?: ClinicalObservationDailyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClinicalObservationDailyCountAggregateInputType | true
    _avg?: ClinicalObservationDailyAvgAggregateInputType
    _sum?: ClinicalObservationDailySumAggregateInputType
    _min?: ClinicalObservationDailyMinAggregateInputType
    _max?: ClinicalObservationDailyMaxAggregateInputType
  }

  export type ClinicalObservationDailyGroupByOutputType = {
    id: string
    tenantId: string
    facilityId: string | null
    departmentId: string | null
    observationDate: Date
    code: string
    codeSystem: string
    category: string
    recordCount: number
    avgValue: Decimal | null
    minValue: Decimal | null
    maxValue: Decimal | null
    p50Value: Decimal | null
    p95Value: Decimal | null
    normalCount: number
    abnormalHighCount: number
    abnormalLowCount: number
    criticalCount: number
    uniquePatients: number
    createdAt: Date
    _count: ClinicalObservationDailyCountAggregateOutputType | null
    _avg: ClinicalObservationDailyAvgAggregateOutputType | null
    _sum: ClinicalObservationDailySumAggregateOutputType | null
    _min: ClinicalObservationDailyMinAggregateOutputType | null
    _max: ClinicalObservationDailyMaxAggregateOutputType | null
  }

  type GetClinicalObservationDailyGroupByPayload<T extends ClinicalObservationDailyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClinicalObservationDailyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClinicalObservationDailyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClinicalObservationDailyGroupByOutputType[P]>
            : GetScalarType<T[P], ClinicalObservationDailyGroupByOutputType[P]>
        }
      >
    >


  export type ClinicalObservationDailySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    observationDate?: boolean
    code?: boolean
    codeSystem?: boolean
    category?: boolean
    recordCount?: boolean
    avgValue?: boolean
    minValue?: boolean
    maxValue?: boolean
    p50Value?: boolean
    p95Value?: boolean
    normalCount?: boolean
    abnormalHighCount?: boolean
    abnormalLowCount?: boolean
    criticalCount?: boolean
    uniquePatients?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["clinicalObservationDaily"]>

  export type ClinicalObservationDailySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    observationDate?: boolean
    code?: boolean
    codeSystem?: boolean
    category?: boolean
    recordCount?: boolean
    avgValue?: boolean
    minValue?: boolean
    maxValue?: boolean
    p50Value?: boolean
    p95Value?: boolean
    normalCount?: boolean
    abnormalHighCount?: boolean
    abnormalLowCount?: boolean
    criticalCount?: boolean
    uniquePatients?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["clinicalObservationDaily"]>

  export type ClinicalObservationDailySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    observationDate?: boolean
    code?: boolean
    codeSystem?: boolean
    category?: boolean
    recordCount?: boolean
    avgValue?: boolean
    minValue?: boolean
    maxValue?: boolean
    p50Value?: boolean
    p95Value?: boolean
    normalCount?: boolean
    abnormalHighCount?: boolean
    abnormalLowCount?: boolean
    criticalCount?: boolean
    uniquePatients?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["clinicalObservationDaily"]>

  export type ClinicalObservationDailySelectScalar = {
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    observationDate?: boolean
    code?: boolean
    codeSystem?: boolean
    category?: boolean
    recordCount?: boolean
    avgValue?: boolean
    minValue?: boolean
    maxValue?: boolean
    p50Value?: boolean
    p95Value?: boolean
    normalCount?: boolean
    abnormalHighCount?: boolean
    abnormalLowCount?: boolean
    criticalCount?: boolean
    uniquePatients?: boolean
    createdAt?: boolean
  }

  export type ClinicalObservationDailyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "facilityId" | "departmentId" | "observationDate" | "code" | "codeSystem" | "category" | "recordCount" | "avgValue" | "minValue" | "maxValue" | "p50Value" | "p95Value" | "normalCount" | "abnormalHighCount" | "abnormalLowCount" | "criticalCount" | "uniquePatients" | "createdAt", ExtArgs["result"]["clinicalObservationDaily"]>

  export type $ClinicalObservationDailyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClinicalObservationDaily"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      facilityId: string | null
      departmentId: string | null
      observationDate: Date
      code: string
      codeSystem: string
      category: string
      recordCount: number
      avgValue: Prisma.Decimal | null
      minValue: Prisma.Decimal | null
      maxValue: Prisma.Decimal | null
      p50Value: Prisma.Decimal | null
      p95Value: Prisma.Decimal | null
      normalCount: number
      abnormalHighCount: number
      abnormalLowCount: number
      criticalCount: number
      uniquePatients: number
      createdAt: Date
    }, ExtArgs["result"]["clinicalObservationDaily"]>
    composites: {}
  }

  type ClinicalObservationDailyGetPayload<S extends boolean | null | undefined | ClinicalObservationDailyDefaultArgs> = $Result.GetResult<Prisma.$ClinicalObservationDailyPayload, S>

  type ClinicalObservationDailyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClinicalObservationDailyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClinicalObservationDailyCountAggregateInputType | true
    }

  export interface ClinicalObservationDailyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClinicalObservationDaily'], meta: { name: 'ClinicalObservationDaily' } }
    /**
     * Find zero or one ClinicalObservationDaily that matches the filter.
     * @param {ClinicalObservationDailyFindUniqueArgs} args - Arguments to find a ClinicalObservationDaily
     * @example
     * // Get one ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClinicalObservationDailyFindUniqueArgs>(args: SelectSubset<T, ClinicalObservationDailyFindUniqueArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClinicalObservationDaily that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClinicalObservationDailyFindUniqueOrThrowArgs} args - Arguments to find a ClinicalObservationDaily
     * @example
     * // Get one ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClinicalObservationDailyFindUniqueOrThrowArgs>(args: SelectSubset<T, ClinicalObservationDailyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClinicalObservationDaily that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyFindFirstArgs} args - Arguments to find a ClinicalObservationDaily
     * @example
     * // Get one ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClinicalObservationDailyFindFirstArgs>(args?: SelectSubset<T, ClinicalObservationDailyFindFirstArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClinicalObservationDaily that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyFindFirstOrThrowArgs} args - Arguments to find a ClinicalObservationDaily
     * @example
     * // Get one ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClinicalObservationDailyFindFirstOrThrowArgs>(args?: SelectSubset<T, ClinicalObservationDailyFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClinicalObservationDailies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClinicalObservationDailies
     * const clinicalObservationDailies = await prisma.clinicalObservationDaily.findMany()
     * 
     * // Get first 10 ClinicalObservationDailies
     * const clinicalObservationDailies = await prisma.clinicalObservationDaily.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clinicalObservationDailyWithIdOnly = await prisma.clinicalObservationDaily.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClinicalObservationDailyFindManyArgs>(args?: SelectSubset<T, ClinicalObservationDailyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClinicalObservationDaily.
     * @param {ClinicalObservationDailyCreateArgs} args - Arguments to create a ClinicalObservationDaily.
     * @example
     * // Create one ClinicalObservationDaily
     * const ClinicalObservationDaily = await prisma.clinicalObservationDaily.create({
     *   data: {
     *     // ... data to create a ClinicalObservationDaily
     *   }
     * })
     * 
     */
    create<T extends ClinicalObservationDailyCreateArgs>(args: SelectSubset<T, ClinicalObservationDailyCreateArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClinicalObservationDailies.
     * @param {ClinicalObservationDailyCreateManyArgs} args - Arguments to create many ClinicalObservationDailies.
     * @example
     * // Create many ClinicalObservationDailies
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClinicalObservationDailyCreateManyArgs>(args?: SelectSubset<T, ClinicalObservationDailyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClinicalObservationDailies and returns the data saved in the database.
     * @param {ClinicalObservationDailyCreateManyAndReturnArgs} args - Arguments to create many ClinicalObservationDailies.
     * @example
     * // Create many ClinicalObservationDailies
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClinicalObservationDailies and only return the `id`
     * const clinicalObservationDailyWithIdOnly = await prisma.clinicalObservationDaily.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClinicalObservationDailyCreateManyAndReturnArgs>(args?: SelectSubset<T, ClinicalObservationDailyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClinicalObservationDaily.
     * @param {ClinicalObservationDailyDeleteArgs} args - Arguments to delete one ClinicalObservationDaily.
     * @example
     * // Delete one ClinicalObservationDaily
     * const ClinicalObservationDaily = await prisma.clinicalObservationDaily.delete({
     *   where: {
     *     // ... filter to delete one ClinicalObservationDaily
     *   }
     * })
     * 
     */
    delete<T extends ClinicalObservationDailyDeleteArgs>(args: SelectSubset<T, ClinicalObservationDailyDeleteArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClinicalObservationDaily.
     * @param {ClinicalObservationDailyUpdateArgs} args - Arguments to update one ClinicalObservationDaily.
     * @example
     * // Update one ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClinicalObservationDailyUpdateArgs>(args: SelectSubset<T, ClinicalObservationDailyUpdateArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClinicalObservationDailies.
     * @param {ClinicalObservationDailyDeleteManyArgs} args - Arguments to filter ClinicalObservationDailies to delete.
     * @example
     * // Delete a few ClinicalObservationDailies
     * const { count } = await prisma.clinicalObservationDaily.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClinicalObservationDailyDeleteManyArgs>(args?: SelectSubset<T, ClinicalObservationDailyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalObservationDailies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClinicalObservationDailies
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClinicalObservationDailyUpdateManyArgs>(args: SelectSubset<T, ClinicalObservationDailyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalObservationDailies and returns the data updated in the database.
     * @param {ClinicalObservationDailyUpdateManyAndReturnArgs} args - Arguments to update many ClinicalObservationDailies.
     * @example
     * // Update many ClinicalObservationDailies
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClinicalObservationDailies and only return the `id`
     * const clinicalObservationDailyWithIdOnly = await prisma.clinicalObservationDaily.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClinicalObservationDailyUpdateManyAndReturnArgs>(args: SelectSubset<T, ClinicalObservationDailyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClinicalObservationDaily.
     * @param {ClinicalObservationDailyUpsertArgs} args - Arguments to update or create a ClinicalObservationDaily.
     * @example
     * // Update or create a ClinicalObservationDaily
     * const clinicalObservationDaily = await prisma.clinicalObservationDaily.upsert({
     *   create: {
     *     // ... data to create a ClinicalObservationDaily
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClinicalObservationDaily we want to update
     *   }
     * })
     */
    upsert<T extends ClinicalObservationDailyUpsertArgs>(args: SelectSubset<T, ClinicalObservationDailyUpsertArgs<ExtArgs>>): Prisma__ClinicalObservationDailyClient<$Result.GetResult<Prisma.$ClinicalObservationDailyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClinicalObservationDailies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyCountArgs} args - Arguments to filter ClinicalObservationDailies to count.
     * @example
     * // Count the number of ClinicalObservationDailies
     * const count = await prisma.clinicalObservationDaily.count({
     *   where: {
     *     // ... the filter for the ClinicalObservationDailies we want to count
     *   }
     * })
    **/
    count<T extends ClinicalObservationDailyCountArgs>(
      args?: Subset<T, ClinicalObservationDailyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClinicalObservationDailyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClinicalObservationDaily.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClinicalObservationDailyAggregateArgs>(args: Subset<T, ClinicalObservationDailyAggregateArgs>): Prisma.PrismaPromise<GetClinicalObservationDailyAggregateType<T>>

    /**
     * Group by ClinicalObservationDaily.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalObservationDailyGroupByArgs} args - Group by arguments.
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
      T extends ClinicalObservationDailyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClinicalObservationDailyGroupByArgs['orderBy'] }
        : { orderBy?: ClinicalObservationDailyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClinicalObservationDailyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClinicalObservationDailyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClinicalObservationDaily model
   */
  readonly fields: ClinicalObservationDailyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClinicalObservationDaily.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClinicalObservationDailyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the ClinicalObservationDaily model
   */
  interface ClinicalObservationDailyFieldRefs {
    readonly id: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly tenantId: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly facilityId: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly departmentId: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly observationDate: FieldRef<"ClinicalObservationDaily", 'DateTime'>
    readonly code: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly codeSystem: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly category: FieldRef<"ClinicalObservationDaily", 'String'>
    readonly recordCount: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly avgValue: FieldRef<"ClinicalObservationDaily", 'Decimal'>
    readonly minValue: FieldRef<"ClinicalObservationDaily", 'Decimal'>
    readonly maxValue: FieldRef<"ClinicalObservationDaily", 'Decimal'>
    readonly p50Value: FieldRef<"ClinicalObservationDaily", 'Decimal'>
    readonly p95Value: FieldRef<"ClinicalObservationDaily", 'Decimal'>
    readonly normalCount: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly abnormalHighCount: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly abnormalLowCount: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly criticalCount: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly uniquePatients: FieldRef<"ClinicalObservationDaily", 'Int'>
    readonly createdAt: FieldRef<"ClinicalObservationDaily", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClinicalObservationDaily findUnique
   */
  export type ClinicalObservationDailyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter, which ClinicalObservationDaily to fetch.
     */
    where: ClinicalObservationDailyWhereUniqueInput
  }

  /**
   * ClinicalObservationDaily findUniqueOrThrow
   */
  export type ClinicalObservationDailyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter, which ClinicalObservationDaily to fetch.
     */
    where: ClinicalObservationDailyWhereUniqueInput
  }

  /**
   * ClinicalObservationDaily findFirst
   */
  export type ClinicalObservationDailyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter, which ClinicalObservationDaily to fetch.
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalObservationDailies to fetch.
     */
    orderBy?: ClinicalObservationDailyOrderByWithRelationInput | ClinicalObservationDailyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalObservationDailies.
     */
    cursor?: ClinicalObservationDailyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalObservationDailies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalObservationDailies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalObservationDailies.
     */
    distinct?: ClinicalObservationDailyScalarFieldEnum | ClinicalObservationDailyScalarFieldEnum[]
  }

  /**
   * ClinicalObservationDaily findFirstOrThrow
   */
  export type ClinicalObservationDailyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter, which ClinicalObservationDaily to fetch.
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalObservationDailies to fetch.
     */
    orderBy?: ClinicalObservationDailyOrderByWithRelationInput | ClinicalObservationDailyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalObservationDailies.
     */
    cursor?: ClinicalObservationDailyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalObservationDailies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalObservationDailies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalObservationDailies.
     */
    distinct?: ClinicalObservationDailyScalarFieldEnum | ClinicalObservationDailyScalarFieldEnum[]
  }

  /**
   * ClinicalObservationDaily findMany
   */
  export type ClinicalObservationDailyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter, which ClinicalObservationDailies to fetch.
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalObservationDailies to fetch.
     */
    orderBy?: ClinicalObservationDailyOrderByWithRelationInput | ClinicalObservationDailyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClinicalObservationDailies.
     */
    cursor?: ClinicalObservationDailyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalObservationDailies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalObservationDailies.
     */
    skip?: number
    distinct?: ClinicalObservationDailyScalarFieldEnum | ClinicalObservationDailyScalarFieldEnum[]
  }

  /**
   * ClinicalObservationDaily create
   */
  export type ClinicalObservationDailyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * The data needed to create a ClinicalObservationDaily.
     */
    data: XOR<ClinicalObservationDailyCreateInput, ClinicalObservationDailyUncheckedCreateInput>
  }

  /**
   * ClinicalObservationDaily createMany
   */
  export type ClinicalObservationDailyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClinicalObservationDailies.
     */
    data: ClinicalObservationDailyCreateManyInput | ClinicalObservationDailyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalObservationDaily createManyAndReturn
   */
  export type ClinicalObservationDailyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * The data used to create many ClinicalObservationDailies.
     */
    data: ClinicalObservationDailyCreateManyInput | ClinicalObservationDailyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalObservationDaily update
   */
  export type ClinicalObservationDailyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * The data needed to update a ClinicalObservationDaily.
     */
    data: XOR<ClinicalObservationDailyUpdateInput, ClinicalObservationDailyUncheckedUpdateInput>
    /**
     * Choose, which ClinicalObservationDaily to update.
     */
    where: ClinicalObservationDailyWhereUniqueInput
  }

  /**
   * ClinicalObservationDaily updateMany
   */
  export type ClinicalObservationDailyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClinicalObservationDailies.
     */
    data: XOR<ClinicalObservationDailyUpdateManyMutationInput, ClinicalObservationDailyUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalObservationDailies to update
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * Limit how many ClinicalObservationDailies to update.
     */
    limit?: number
  }

  /**
   * ClinicalObservationDaily updateManyAndReturn
   */
  export type ClinicalObservationDailyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * The data used to update ClinicalObservationDailies.
     */
    data: XOR<ClinicalObservationDailyUpdateManyMutationInput, ClinicalObservationDailyUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalObservationDailies to update
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * Limit how many ClinicalObservationDailies to update.
     */
    limit?: number
  }

  /**
   * ClinicalObservationDaily upsert
   */
  export type ClinicalObservationDailyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * The filter to search for the ClinicalObservationDaily to update in case it exists.
     */
    where: ClinicalObservationDailyWhereUniqueInput
    /**
     * In case the ClinicalObservationDaily found by the `where` argument doesn't exist, create a new ClinicalObservationDaily with this data.
     */
    create: XOR<ClinicalObservationDailyCreateInput, ClinicalObservationDailyUncheckedCreateInput>
    /**
     * In case the ClinicalObservationDaily was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClinicalObservationDailyUpdateInput, ClinicalObservationDailyUncheckedUpdateInput>
  }

  /**
   * ClinicalObservationDaily delete
   */
  export type ClinicalObservationDailyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
    /**
     * Filter which ClinicalObservationDaily to delete.
     */
    where: ClinicalObservationDailyWhereUniqueInput
  }

  /**
   * ClinicalObservationDaily deleteMany
   */
  export type ClinicalObservationDailyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalObservationDailies to delete
     */
    where?: ClinicalObservationDailyWhereInput
    /**
     * Limit how many ClinicalObservationDailies to delete.
     */
    limit?: number
  }

  /**
   * ClinicalObservationDaily without action
   */
  export type ClinicalObservationDailyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalObservationDaily
     */
    select?: ClinicalObservationDailySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalObservationDaily
     */
    omit?: ClinicalObservationDailyOmit<ExtArgs> | null
  }


  /**
   * Model DiagnosisDailyAggregate
   */

  export type AggregateDiagnosisDailyAggregate = {
    _count: DiagnosisDailyAggregateCountAggregateOutputType | null
    _avg: DiagnosisDailyAggregateAvgAggregateOutputType | null
    _sum: DiagnosisDailyAggregateSumAggregateOutputType | null
    _min: DiagnosisDailyAggregateMinAggregateOutputType | null
    _max: DiagnosisDailyAggregateMaxAggregateOutputType | null
  }

  export type DiagnosisDailyAggregateAvgAggregateOutputType = {
    encounterCount: number | null
    uniquePatients: number | null
    primaryCount: number | null
    chronicCount: number | null
  }

  export type DiagnosisDailyAggregateSumAggregateOutputType = {
    encounterCount: number | null
    uniquePatients: number | null
    primaryCount: number | null
    chronicCount: number | null
  }

  export type DiagnosisDailyAggregateMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    facilityId: string | null
    departmentId: string | null
    diagnosisDate: Date | null
    icdCode: string | null
    icdBlock: string | null
    diagnosisName: string | null
    diagnosisType: string | null
    encounterCount: number | null
    uniquePatients: number | null
    primaryCount: number | null
    chronicCount: number | null
    createdAt: Date | null
  }

  export type DiagnosisDailyAggregateMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    facilityId: string | null
    departmentId: string | null
    diagnosisDate: Date | null
    icdCode: string | null
    icdBlock: string | null
    diagnosisName: string | null
    diagnosisType: string | null
    encounterCount: number | null
    uniquePatients: number | null
    primaryCount: number | null
    chronicCount: number | null
    createdAt: Date | null
  }

  export type DiagnosisDailyAggregateCountAggregateOutputType = {
    id: number
    tenantId: number
    facilityId: number
    departmentId: number
    diagnosisDate: number
    icdCode: number
    icdBlock: number
    diagnosisName: number
    diagnosisType: number
    encounterCount: number
    uniquePatients: number
    primaryCount: number
    chronicCount: number
    createdAt: number
    _all: number
  }


  export type DiagnosisDailyAggregateAvgAggregateInputType = {
    encounterCount?: true
    uniquePatients?: true
    primaryCount?: true
    chronicCount?: true
  }

  export type DiagnosisDailyAggregateSumAggregateInputType = {
    encounterCount?: true
    uniquePatients?: true
    primaryCount?: true
    chronicCount?: true
  }

  export type DiagnosisDailyAggregateMinAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    diagnosisDate?: true
    icdCode?: true
    icdBlock?: true
    diagnosisName?: true
    diagnosisType?: true
    encounterCount?: true
    uniquePatients?: true
    primaryCount?: true
    chronicCount?: true
    createdAt?: true
  }

  export type DiagnosisDailyAggregateMaxAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    diagnosisDate?: true
    icdCode?: true
    icdBlock?: true
    diagnosisName?: true
    diagnosisType?: true
    encounterCount?: true
    uniquePatients?: true
    primaryCount?: true
    chronicCount?: true
    createdAt?: true
  }

  export type DiagnosisDailyAggregateCountAggregateInputType = {
    id?: true
    tenantId?: true
    facilityId?: true
    departmentId?: true
    diagnosisDate?: true
    icdCode?: true
    icdBlock?: true
    diagnosisName?: true
    diagnosisType?: true
    encounterCount?: true
    uniquePatients?: true
    primaryCount?: true
    chronicCount?: true
    createdAt?: true
    _all?: true
  }

  export type DiagnosisDailyAggregateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosisDailyAggregate to aggregate.
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosisDailyAggregates to fetch.
     */
    orderBy?: DiagnosisDailyAggregateOrderByWithRelationInput | DiagnosisDailyAggregateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiagnosisDailyAggregateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosisDailyAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosisDailyAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiagnosisDailyAggregates
    **/
    _count?: true | DiagnosisDailyAggregateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DiagnosisDailyAggregateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DiagnosisDailyAggregateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiagnosisDailyAggregateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiagnosisDailyAggregateMaxAggregateInputType
  }

  export type GetDiagnosisDailyAggregateAggregateType<T extends DiagnosisDailyAggregateAggregateArgs> = {
        [P in keyof T & keyof AggregateDiagnosisDailyAggregate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiagnosisDailyAggregate[P]>
      : GetScalarType<T[P], AggregateDiagnosisDailyAggregate[P]>
  }




  export type DiagnosisDailyAggregateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiagnosisDailyAggregateWhereInput
    orderBy?: DiagnosisDailyAggregateOrderByWithAggregationInput | DiagnosisDailyAggregateOrderByWithAggregationInput[]
    by: DiagnosisDailyAggregateScalarFieldEnum[] | DiagnosisDailyAggregateScalarFieldEnum
    having?: DiagnosisDailyAggregateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiagnosisDailyAggregateCountAggregateInputType | true
    _avg?: DiagnosisDailyAggregateAvgAggregateInputType
    _sum?: DiagnosisDailyAggregateSumAggregateInputType
    _min?: DiagnosisDailyAggregateMinAggregateInputType
    _max?: DiagnosisDailyAggregateMaxAggregateInputType
  }

  export type DiagnosisDailyAggregateGroupByOutputType = {
    id: string
    tenantId: string
    facilityId: string | null
    departmentId: string | null
    diagnosisDate: Date
    icdCode: string
    icdBlock: string | null
    diagnosisName: string
    diagnosisType: string
    encounterCount: number
    uniquePatients: number
    primaryCount: number
    chronicCount: number
    createdAt: Date
    _count: DiagnosisDailyAggregateCountAggregateOutputType | null
    _avg: DiagnosisDailyAggregateAvgAggregateOutputType | null
    _sum: DiagnosisDailyAggregateSumAggregateOutputType | null
    _min: DiagnosisDailyAggregateMinAggregateOutputType | null
    _max: DiagnosisDailyAggregateMaxAggregateOutputType | null
  }

  type GetDiagnosisDailyAggregateGroupByPayload<T extends DiagnosisDailyAggregateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiagnosisDailyAggregateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiagnosisDailyAggregateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiagnosisDailyAggregateGroupByOutputType[P]>
            : GetScalarType<T[P], DiagnosisDailyAggregateGroupByOutputType[P]>
        }
      >
    >


  export type DiagnosisDailyAggregateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    diagnosisDate?: boolean
    icdCode?: boolean
    icdBlock?: boolean
    diagnosisName?: boolean
    diagnosisType?: boolean
    encounterCount?: boolean
    uniquePatients?: boolean
    primaryCount?: boolean
    chronicCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diagnosisDailyAggregate"]>

  export type DiagnosisDailyAggregateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    diagnosisDate?: boolean
    icdCode?: boolean
    icdBlock?: boolean
    diagnosisName?: boolean
    diagnosisType?: boolean
    encounterCount?: boolean
    uniquePatients?: boolean
    primaryCount?: boolean
    chronicCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diagnosisDailyAggregate"]>

  export type DiagnosisDailyAggregateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    diagnosisDate?: boolean
    icdCode?: boolean
    icdBlock?: boolean
    diagnosisName?: boolean
    diagnosisType?: boolean
    encounterCount?: boolean
    uniquePatients?: boolean
    primaryCount?: boolean
    chronicCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["diagnosisDailyAggregate"]>

  export type DiagnosisDailyAggregateSelectScalar = {
    id?: boolean
    tenantId?: boolean
    facilityId?: boolean
    departmentId?: boolean
    diagnosisDate?: boolean
    icdCode?: boolean
    icdBlock?: boolean
    diagnosisName?: boolean
    diagnosisType?: boolean
    encounterCount?: boolean
    uniquePatients?: boolean
    primaryCount?: boolean
    chronicCount?: boolean
    createdAt?: boolean
  }

  export type DiagnosisDailyAggregateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "facilityId" | "departmentId" | "diagnosisDate" | "icdCode" | "icdBlock" | "diagnosisName" | "diagnosisType" | "encounterCount" | "uniquePatients" | "primaryCount" | "chronicCount" | "createdAt", ExtArgs["result"]["diagnosisDailyAggregate"]>

  export type $DiagnosisDailyAggregatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiagnosisDailyAggregate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      facilityId: string | null
      departmentId: string | null
      diagnosisDate: Date
      icdCode: string
      icdBlock: string | null
      diagnosisName: string
      diagnosisType: string
      encounterCount: number
      uniquePatients: number
      primaryCount: number
      chronicCount: number
      createdAt: Date
    }, ExtArgs["result"]["diagnosisDailyAggregate"]>
    composites: {}
  }

  type DiagnosisDailyAggregateGetPayload<S extends boolean | null | undefined | DiagnosisDailyAggregateDefaultArgs> = $Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload, S>

  type DiagnosisDailyAggregateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DiagnosisDailyAggregateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DiagnosisDailyAggregateCountAggregateInputType | true
    }

  export interface DiagnosisDailyAggregateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiagnosisDailyAggregate'], meta: { name: 'DiagnosisDailyAggregate' } }
    /**
     * Find zero or one DiagnosisDailyAggregate that matches the filter.
     * @param {DiagnosisDailyAggregateFindUniqueArgs} args - Arguments to find a DiagnosisDailyAggregate
     * @example
     * // Get one DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiagnosisDailyAggregateFindUniqueArgs>(args: SelectSubset<T, DiagnosisDailyAggregateFindUniqueArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DiagnosisDailyAggregate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DiagnosisDailyAggregateFindUniqueOrThrowArgs} args - Arguments to find a DiagnosisDailyAggregate
     * @example
     * // Get one DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiagnosisDailyAggregateFindUniqueOrThrowArgs>(args: SelectSubset<T, DiagnosisDailyAggregateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiagnosisDailyAggregate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateFindFirstArgs} args - Arguments to find a DiagnosisDailyAggregate
     * @example
     * // Get one DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiagnosisDailyAggregateFindFirstArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateFindFirstArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DiagnosisDailyAggregate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateFindFirstOrThrowArgs} args - Arguments to find a DiagnosisDailyAggregate
     * @example
     * // Get one DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiagnosisDailyAggregateFindFirstOrThrowArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DiagnosisDailyAggregates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiagnosisDailyAggregates
     * const diagnosisDailyAggregates = await prisma.diagnosisDailyAggregate.findMany()
     * 
     * // Get first 10 DiagnosisDailyAggregates
     * const diagnosisDailyAggregates = await prisma.diagnosisDailyAggregate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const diagnosisDailyAggregateWithIdOnly = await prisma.diagnosisDailyAggregate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiagnosisDailyAggregateFindManyArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DiagnosisDailyAggregate.
     * @param {DiagnosisDailyAggregateCreateArgs} args - Arguments to create a DiagnosisDailyAggregate.
     * @example
     * // Create one DiagnosisDailyAggregate
     * const DiagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.create({
     *   data: {
     *     // ... data to create a DiagnosisDailyAggregate
     *   }
     * })
     * 
     */
    create<T extends DiagnosisDailyAggregateCreateArgs>(args: SelectSubset<T, DiagnosisDailyAggregateCreateArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DiagnosisDailyAggregates.
     * @param {DiagnosisDailyAggregateCreateManyArgs} args - Arguments to create many DiagnosisDailyAggregates.
     * @example
     * // Create many DiagnosisDailyAggregates
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiagnosisDailyAggregateCreateManyArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiagnosisDailyAggregates and returns the data saved in the database.
     * @param {DiagnosisDailyAggregateCreateManyAndReturnArgs} args - Arguments to create many DiagnosisDailyAggregates.
     * @example
     * // Create many DiagnosisDailyAggregates
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiagnosisDailyAggregates and only return the `id`
     * const diagnosisDailyAggregateWithIdOnly = await prisma.diagnosisDailyAggregate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiagnosisDailyAggregateCreateManyAndReturnArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DiagnosisDailyAggregate.
     * @param {DiagnosisDailyAggregateDeleteArgs} args - Arguments to delete one DiagnosisDailyAggregate.
     * @example
     * // Delete one DiagnosisDailyAggregate
     * const DiagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.delete({
     *   where: {
     *     // ... filter to delete one DiagnosisDailyAggregate
     *   }
     * })
     * 
     */
    delete<T extends DiagnosisDailyAggregateDeleteArgs>(args: SelectSubset<T, DiagnosisDailyAggregateDeleteArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DiagnosisDailyAggregate.
     * @param {DiagnosisDailyAggregateUpdateArgs} args - Arguments to update one DiagnosisDailyAggregate.
     * @example
     * // Update one DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiagnosisDailyAggregateUpdateArgs>(args: SelectSubset<T, DiagnosisDailyAggregateUpdateArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DiagnosisDailyAggregates.
     * @param {DiagnosisDailyAggregateDeleteManyArgs} args - Arguments to filter DiagnosisDailyAggregates to delete.
     * @example
     * // Delete a few DiagnosisDailyAggregates
     * const { count } = await prisma.diagnosisDailyAggregate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiagnosisDailyAggregateDeleteManyArgs>(args?: SelectSubset<T, DiagnosisDailyAggregateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiagnosisDailyAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiagnosisDailyAggregates
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiagnosisDailyAggregateUpdateManyArgs>(args: SelectSubset<T, DiagnosisDailyAggregateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiagnosisDailyAggregates and returns the data updated in the database.
     * @param {DiagnosisDailyAggregateUpdateManyAndReturnArgs} args - Arguments to update many DiagnosisDailyAggregates.
     * @example
     * // Update many DiagnosisDailyAggregates
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DiagnosisDailyAggregates and only return the `id`
     * const diagnosisDailyAggregateWithIdOnly = await prisma.diagnosisDailyAggregate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DiagnosisDailyAggregateUpdateManyAndReturnArgs>(args: SelectSubset<T, DiagnosisDailyAggregateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DiagnosisDailyAggregate.
     * @param {DiagnosisDailyAggregateUpsertArgs} args - Arguments to update or create a DiagnosisDailyAggregate.
     * @example
     * // Update or create a DiagnosisDailyAggregate
     * const diagnosisDailyAggregate = await prisma.diagnosisDailyAggregate.upsert({
     *   create: {
     *     // ... data to create a DiagnosisDailyAggregate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiagnosisDailyAggregate we want to update
     *   }
     * })
     */
    upsert<T extends DiagnosisDailyAggregateUpsertArgs>(args: SelectSubset<T, DiagnosisDailyAggregateUpsertArgs<ExtArgs>>): Prisma__DiagnosisDailyAggregateClient<$Result.GetResult<Prisma.$DiagnosisDailyAggregatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DiagnosisDailyAggregates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateCountArgs} args - Arguments to filter DiagnosisDailyAggregates to count.
     * @example
     * // Count the number of DiagnosisDailyAggregates
     * const count = await prisma.diagnosisDailyAggregate.count({
     *   where: {
     *     // ... the filter for the DiagnosisDailyAggregates we want to count
     *   }
     * })
    **/
    count<T extends DiagnosisDailyAggregateCountArgs>(
      args?: Subset<T, DiagnosisDailyAggregateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiagnosisDailyAggregateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiagnosisDailyAggregate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DiagnosisDailyAggregateAggregateArgs>(args: Subset<T, DiagnosisDailyAggregateAggregateArgs>): Prisma.PrismaPromise<GetDiagnosisDailyAggregateAggregateType<T>>

    /**
     * Group by DiagnosisDailyAggregate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiagnosisDailyAggregateGroupByArgs} args - Group by arguments.
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
      T extends DiagnosisDailyAggregateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiagnosisDailyAggregateGroupByArgs['orderBy'] }
        : { orderBy?: DiagnosisDailyAggregateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DiagnosisDailyAggregateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiagnosisDailyAggregateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiagnosisDailyAggregate model
   */
  readonly fields: DiagnosisDailyAggregateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiagnosisDailyAggregate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiagnosisDailyAggregateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the DiagnosisDailyAggregate model
   */
  interface DiagnosisDailyAggregateFieldRefs {
    readonly id: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly tenantId: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly facilityId: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly departmentId: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly diagnosisDate: FieldRef<"DiagnosisDailyAggregate", 'DateTime'>
    readonly icdCode: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly icdBlock: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly diagnosisName: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly diagnosisType: FieldRef<"DiagnosisDailyAggregate", 'String'>
    readonly encounterCount: FieldRef<"DiagnosisDailyAggregate", 'Int'>
    readonly uniquePatients: FieldRef<"DiagnosisDailyAggregate", 'Int'>
    readonly primaryCount: FieldRef<"DiagnosisDailyAggregate", 'Int'>
    readonly chronicCount: FieldRef<"DiagnosisDailyAggregate", 'Int'>
    readonly createdAt: FieldRef<"DiagnosisDailyAggregate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiagnosisDailyAggregate findUnique
   */
  export type DiagnosisDailyAggregateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter, which DiagnosisDailyAggregate to fetch.
     */
    where: DiagnosisDailyAggregateWhereUniqueInput
  }

  /**
   * DiagnosisDailyAggregate findUniqueOrThrow
   */
  export type DiagnosisDailyAggregateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter, which DiagnosisDailyAggregate to fetch.
     */
    where: DiagnosisDailyAggregateWhereUniqueInput
  }

  /**
   * DiagnosisDailyAggregate findFirst
   */
  export type DiagnosisDailyAggregateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter, which DiagnosisDailyAggregate to fetch.
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosisDailyAggregates to fetch.
     */
    orderBy?: DiagnosisDailyAggregateOrderByWithRelationInput | DiagnosisDailyAggregateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosisDailyAggregates.
     */
    cursor?: DiagnosisDailyAggregateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosisDailyAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosisDailyAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosisDailyAggregates.
     */
    distinct?: DiagnosisDailyAggregateScalarFieldEnum | DiagnosisDailyAggregateScalarFieldEnum[]
  }

  /**
   * DiagnosisDailyAggregate findFirstOrThrow
   */
  export type DiagnosisDailyAggregateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter, which DiagnosisDailyAggregate to fetch.
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosisDailyAggregates to fetch.
     */
    orderBy?: DiagnosisDailyAggregateOrderByWithRelationInput | DiagnosisDailyAggregateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiagnosisDailyAggregates.
     */
    cursor?: DiagnosisDailyAggregateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosisDailyAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosisDailyAggregates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiagnosisDailyAggregates.
     */
    distinct?: DiagnosisDailyAggregateScalarFieldEnum | DiagnosisDailyAggregateScalarFieldEnum[]
  }

  /**
   * DiagnosisDailyAggregate findMany
   */
  export type DiagnosisDailyAggregateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter, which DiagnosisDailyAggregates to fetch.
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiagnosisDailyAggregates to fetch.
     */
    orderBy?: DiagnosisDailyAggregateOrderByWithRelationInput | DiagnosisDailyAggregateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiagnosisDailyAggregates.
     */
    cursor?: DiagnosisDailyAggregateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiagnosisDailyAggregates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiagnosisDailyAggregates.
     */
    skip?: number
    distinct?: DiagnosisDailyAggregateScalarFieldEnum | DiagnosisDailyAggregateScalarFieldEnum[]
  }

  /**
   * DiagnosisDailyAggregate create
   */
  export type DiagnosisDailyAggregateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * The data needed to create a DiagnosisDailyAggregate.
     */
    data: XOR<DiagnosisDailyAggregateCreateInput, DiagnosisDailyAggregateUncheckedCreateInput>
  }

  /**
   * DiagnosisDailyAggregate createMany
   */
  export type DiagnosisDailyAggregateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiagnosisDailyAggregates.
     */
    data: DiagnosisDailyAggregateCreateManyInput | DiagnosisDailyAggregateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiagnosisDailyAggregate createManyAndReturn
   */
  export type DiagnosisDailyAggregateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * The data used to create many DiagnosisDailyAggregates.
     */
    data: DiagnosisDailyAggregateCreateManyInput | DiagnosisDailyAggregateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiagnosisDailyAggregate update
   */
  export type DiagnosisDailyAggregateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * The data needed to update a DiagnosisDailyAggregate.
     */
    data: XOR<DiagnosisDailyAggregateUpdateInput, DiagnosisDailyAggregateUncheckedUpdateInput>
    /**
     * Choose, which DiagnosisDailyAggregate to update.
     */
    where: DiagnosisDailyAggregateWhereUniqueInput
  }

  /**
   * DiagnosisDailyAggregate updateMany
   */
  export type DiagnosisDailyAggregateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiagnosisDailyAggregates.
     */
    data: XOR<DiagnosisDailyAggregateUpdateManyMutationInput, DiagnosisDailyAggregateUncheckedUpdateManyInput>
    /**
     * Filter which DiagnosisDailyAggregates to update
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * Limit how many DiagnosisDailyAggregates to update.
     */
    limit?: number
  }

  /**
   * DiagnosisDailyAggregate updateManyAndReturn
   */
  export type DiagnosisDailyAggregateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * The data used to update DiagnosisDailyAggregates.
     */
    data: XOR<DiagnosisDailyAggregateUpdateManyMutationInput, DiagnosisDailyAggregateUncheckedUpdateManyInput>
    /**
     * Filter which DiagnosisDailyAggregates to update
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * Limit how many DiagnosisDailyAggregates to update.
     */
    limit?: number
  }

  /**
   * DiagnosisDailyAggregate upsert
   */
  export type DiagnosisDailyAggregateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * The filter to search for the DiagnosisDailyAggregate to update in case it exists.
     */
    where: DiagnosisDailyAggregateWhereUniqueInput
    /**
     * In case the DiagnosisDailyAggregate found by the `where` argument doesn't exist, create a new DiagnosisDailyAggregate with this data.
     */
    create: XOR<DiagnosisDailyAggregateCreateInput, DiagnosisDailyAggregateUncheckedCreateInput>
    /**
     * In case the DiagnosisDailyAggregate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiagnosisDailyAggregateUpdateInput, DiagnosisDailyAggregateUncheckedUpdateInput>
  }

  /**
   * DiagnosisDailyAggregate delete
   */
  export type DiagnosisDailyAggregateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
    /**
     * Filter which DiagnosisDailyAggregate to delete.
     */
    where: DiagnosisDailyAggregateWhereUniqueInput
  }

  /**
   * DiagnosisDailyAggregate deleteMany
   */
  export type DiagnosisDailyAggregateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiagnosisDailyAggregates to delete
     */
    where?: DiagnosisDailyAggregateWhereInput
    /**
     * Limit how many DiagnosisDailyAggregates to delete.
     */
    limit?: number
  }

  /**
   * DiagnosisDailyAggregate without action
   */
  export type DiagnosisDailyAggregateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiagnosisDailyAggregate
     */
    select?: DiagnosisDailyAggregateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DiagnosisDailyAggregate
     */
    omit?: DiagnosisDailyAggregateOmit<ExtArgs> | null
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


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    actorId: 'actorId',
    action: 'action',
    resource: 'resource',
    metadata: 'metadata',
    occurredAt: 'occurredAt',
    receivedAt: 'receivedAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const UsageEventScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    eventType: 'eventType',
    payload: 'payload',
    occurredAt: 'occurredAt'
  };

  export type UsageEventScalarFieldEnum = (typeof UsageEventScalarFieldEnum)[keyof typeof UsageEventScalarFieldEnum]


  export const AiQueryLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    userId: 'userId',
    facilityId: 'facilityId',
    feature: 'feature',
    queryText: 'queryText',
    queryPlan: 'queryPlan',
    compiledSql: 'compiledSql',
    resultCount: 'resultCount',
    executionTimeMs: 'executionTimeMs',
    modelUsed: 'modelUsed',
    inputTokens: 'inputTokens',
    outputTokens: 'outputTokens',
    status: 'status',
    errorMessage: 'errorMessage',
    userAgent: 'userAgent',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type AiQueryLogScalarFieldEnum = (typeof AiQueryLogScalarFieldEnum)[keyof typeof AiQueryLogScalarFieldEnum]


  export const AiUsageMetricScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    feature: 'feature',
    periodType: 'periodType',
    periodStart: 'periodStart',
    queryCount: 'queryCount',
    successCount: 'successCount',
    errorCount: 'errorCount',
    uniqueUsers: 'uniqueUsers',
    totalInputTokens: 'totalInputTokens',
    totalOutputTokens: 'totalOutputTokens',
    avgExecutionTimeMs: 'avgExecutionTimeMs',
    p95ExecutionTimeMs: 'p95ExecutionTimeMs',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiUsageMetricScalarFieldEnum = (typeof AiUsageMetricScalarFieldEnum)[keyof typeof AiUsageMetricScalarFieldEnum]


  export const SemanticMetricScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    displayName: 'displayName',
    displayNameAr: 'displayNameAr',
    description: 'description',
    expression: 'expression',
    database: 'database',
    baseTable: 'baseTable',
    dataType: 'dataType',
    defaultAggregation: 'defaultAggregation',
    format: 'format',
    requiredPermission: 'requiredPermission',
    category: 'category',
    sortOrder: 'sortOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SemanticMetricScalarFieldEnum = (typeof SemanticMetricScalarFieldEnum)[keyof typeof SemanticMetricScalarFieldEnum]


  export const SemanticDimensionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    displayName: 'displayName',
    displayNameAr: 'displayNameAr',
    description: 'description',
    columnRef: 'columnRef',
    database: 'database',
    baseTable: 'baseTable',
    dataType: 'dataType',
    allowedOperators: 'allowedOperators',
    isLookup: 'isLookup',
    lookupValues: 'lookupValues',
    requiredPermission: 'requiredPermission',
    category: 'category',
    sortOrder: 'sortOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SemanticDimensionScalarFieldEnum = (typeof SemanticDimensionScalarFieldEnum)[keyof typeof SemanticDimensionScalarFieldEnum]


  export const SemanticJoinPathScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    name: 'name',
    fromTable: 'fromTable',
    fromDatabase: 'fromDatabase',
    toTable: 'toTable',
    toDatabase: 'toDatabase',
    joinType: 'joinType',
    joinCondition: 'joinCondition',
    cardinality: 'cardinality',
    description: 'description',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SemanticJoinPathScalarFieldEnum = (typeof SemanticJoinPathScalarFieldEnum)[keyof typeof SemanticJoinPathScalarFieldEnum]


  export const SavedReportScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    createdById: 'createdById',
    name: 'name',
    description: 'description',
    query: 'query',
    queryPlan: 'queryPlan',
    isPublic: 'isPublic',
    isFavorite: 'isFavorite',
    executionCount: 'executionCount',
    lastExecutedAt: 'lastExecutedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SavedReportScalarFieldEnum = (typeof SavedReportScalarFieldEnum)[keyof typeof SavedReportScalarFieldEnum]


  export const ClinicalObservationDailyScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    facilityId: 'facilityId',
    departmentId: 'departmentId',
    observationDate: 'observationDate',
    code: 'code',
    codeSystem: 'codeSystem',
    category: 'category',
    recordCount: 'recordCount',
    avgValue: 'avgValue',
    minValue: 'minValue',
    maxValue: 'maxValue',
    p50Value: 'p50Value',
    p95Value: 'p95Value',
    normalCount: 'normalCount',
    abnormalHighCount: 'abnormalHighCount',
    abnormalLowCount: 'abnormalLowCount',
    criticalCount: 'criticalCount',
    uniquePatients: 'uniquePatients',
    createdAt: 'createdAt'
  };

  export type ClinicalObservationDailyScalarFieldEnum = (typeof ClinicalObservationDailyScalarFieldEnum)[keyof typeof ClinicalObservationDailyScalarFieldEnum]


  export const DiagnosisDailyAggregateScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    facilityId: 'facilityId',
    departmentId: 'departmentId',
    diagnosisDate: 'diagnosisDate',
    icdCode: 'icdCode',
    icdBlock: 'icdBlock',
    diagnosisName: 'diagnosisName',
    diagnosisType: 'diagnosisType',
    encounterCount: 'encounterCount',
    uniquePatients: 'uniquePatients',
    primaryCount: 'primaryCount',
    chronicCount: 'chronicCount',
    createdAt: 'createdAt'
  };

  export type DiagnosisDailyAggregateScalarFieldEnum = (typeof DiagnosisDailyAggregateScalarFieldEnum)[keyof typeof DiagnosisDailyAggregateScalarFieldEnum]


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
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


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


  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: UuidFilter<"AuditLog"> | string
    tenantId?: UuidFilter<"AuditLog"> | string
    actorId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    resource?: StringFilter<"AuditLog"> | string
    metadata?: JsonFilter<"AuditLog">
    occurredAt?: DateTimeFilter<"AuditLog"> | Date | string
    receivedAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorId?: SortOrderInput | SortOrder
    action?: SortOrder
    resource?: SortOrder
    metadata?: SortOrder
    occurredAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    tenantId?: UuidFilter<"AuditLog"> | string
    actorId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    resource?: StringFilter<"AuditLog"> | string
    metadata?: JsonFilter<"AuditLog">
    occurredAt?: DateTimeFilter<"AuditLog"> | Date | string
    receivedAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorId?: SortOrderInput | SortOrder
    action?: SortOrder
    resource?: SortOrder
    metadata?: SortOrder
    occurredAt?: SortOrder
    receivedAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AuditLog"> | string
    tenantId?: UuidWithAggregatesFilter<"AuditLog"> | string
    actorId?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    resource?: StringWithAggregatesFilter<"AuditLog"> | string
    metadata?: JsonWithAggregatesFilter<"AuditLog">
    occurredAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    receivedAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UsageEventWhereInput = {
    AND?: UsageEventWhereInput | UsageEventWhereInput[]
    OR?: UsageEventWhereInput[]
    NOT?: UsageEventWhereInput | UsageEventWhereInput[]
    id?: UuidFilter<"UsageEvent"> | string
    tenantId?: UuidFilter<"UsageEvent"> | string
    eventType?: StringFilter<"UsageEvent"> | string
    payload?: JsonFilter<"UsageEvent">
    occurredAt?: DateTimeFilter<"UsageEvent"> | Date | string
  }

  export type UsageEventOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    occurredAt?: SortOrder
  }

  export type UsageEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsageEventWhereInput | UsageEventWhereInput[]
    OR?: UsageEventWhereInput[]
    NOT?: UsageEventWhereInput | UsageEventWhereInput[]
    tenantId?: UuidFilter<"UsageEvent"> | string
    eventType?: StringFilter<"UsageEvent"> | string
    payload?: JsonFilter<"UsageEvent">
    occurredAt?: DateTimeFilter<"UsageEvent"> | Date | string
  }, "id">

  export type UsageEventOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    occurredAt?: SortOrder
    _count?: UsageEventCountOrderByAggregateInput
    _max?: UsageEventMaxOrderByAggregateInput
    _min?: UsageEventMinOrderByAggregateInput
  }

  export type UsageEventScalarWhereWithAggregatesInput = {
    AND?: UsageEventScalarWhereWithAggregatesInput | UsageEventScalarWhereWithAggregatesInput[]
    OR?: UsageEventScalarWhereWithAggregatesInput[]
    NOT?: UsageEventScalarWhereWithAggregatesInput | UsageEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UsageEvent"> | string
    tenantId?: UuidWithAggregatesFilter<"UsageEvent"> | string
    eventType?: StringWithAggregatesFilter<"UsageEvent"> | string
    payload?: JsonWithAggregatesFilter<"UsageEvent">
    occurredAt?: DateTimeWithAggregatesFilter<"UsageEvent"> | Date | string
  }

  export type AiQueryLogWhereInput = {
    AND?: AiQueryLogWhereInput | AiQueryLogWhereInput[]
    OR?: AiQueryLogWhereInput[]
    NOT?: AiQueryLogWhereInput | AiQueryLogWhereInput[]
    id?: UuidFilter<"AiQueryLog"> | string
    tenantId?: UuidFilter<"AiQueryLog"> | string
    userId?: UuidFilter<"AiQueryLog"> | string
    facilityId?: UuidNullableFilter<"AiQueryLog"> | string | null
    feature?: StringFilter<"AiQueryLog"> | string
    queryText?: StringFilter<"AiQueryLog"> | string
    queryPlan?: JsonNullableFilter<"AiQueryLog">
    compiledSql?: StringNullableFilter<"AiQueryLog"> | string | null
    resultCount?: IntNullableFilter<"AiQueryLog"> | number | null
    executionTimeMs?: IntNullableFilter<"AiQueryLog"> | number | null
    modelUsed?: StringNullableFilter<"AiQueryLog"> | string | null
    inputTokens?: IntNullableFilter<"AiQueryLog"> | number | null
    outputTokens?: IntNullableFilter<"AiQueryLog"> | number | null
    status?: StringFilter<"AiQueryLog"> | string
    errorMessage?: StringNullableFilter<"AiQueryLog"> | string | null
    userAgent?: StringNullableFilter<"AiQueryLog"> | string | null
    ipAddress?: StringNullableFilter<"AiQueryLog"> | string | null
    createdAt?: DateTimeFilter<"AiQueryLog"> | Date | string
  }

  export type AiQueryLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    feature?: SortOrder
    queryText?: SortOrder
    queryPlan?: SortOrderInput | SortOrder
    compiledSql?: SortOrderInput | SortOrder
    resultCount?: SortOrderInput | SortOrder
    executionTimeMs?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiQueryLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiQueryLogWhereInput | AiQueryLogWhereInput[]
    OR?: AiQueryLogWhereInput[]
    NOT?: AiQueryLogWhereInput | AiQueryLogWhereInput[]
    tenantId?: UuidFilter<"AiQueryLog"> | string
    userId?: UuidFilter<"AiQueryLog"> | string
    facilityId?: UuidNullableFilter<"AiQueryLog"> | string | null
    feature?: StringFilter<"AiQueryLog"> | string
    queryText?: StringFilter<"AiQueryLog"> | string
    queryPlan?: JsonNullableFilter<"AiQueryLog">
    compiledSql?: StringNullableFilter<"AiQueryLog"> | string | null
    resultCount?: IntNullableFilter<"AiQueryLog"> | number | null
    executionTimeMs?: IntNullableFilter<"AiQueryLog"> | number | null
    modelUsed?: StringNullableFilter<"AiQueryLog"> | string | null
    inputTokens?: IntNullableFilter<"AiQueryLog"> | number | null
    outputTokens?: IntNullableFilter<"AiQueryLog"> | number | null
    status?: StringFilter<"AiQueryLog"> | string
    errorMessage?: StringNullableFilter<"AiQueryLog"> | string | null
    userAgent?: StringNullableFilter<"AiQueryLog"> | string | null
    ipAddress?: StringNullableFilter<"AiQueryLog"> | string | null
    createdAt?: DateTimeFilter<"AiQueryLog"> | Date | string
  }, "id">

  export type AiQueryLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    feature?: SortOrder
    queryText?: SortOrder
    queryPlan?: SortOrderInput | SortOrder
    compiledSql?: SortOrderInput | SortOrder
    resultCount?: SortOrderInput | SortOrder
    executionTimeMs?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    inputTokens?: SortOrderInput | SortOrder
    outputTokens?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiQueryLogCountOrderByAggregateInput
    _avg?: AiQueryLogAvgOrderByAggregateInput
    _max?: AiQueryLogMaxOrderByAggregateInput
    _min?: AiQueryLogMinOrderByAggregateInput
    _sum?: AiQueryLogSumOrderByAggregateInput
  }

  export type AiQueryLogScalarWhereWithAggregatesInput = {
    AND?: AiQueryLogScalarWhereWithAggregatesInput | AiQueryLogScalarWhereWithAggregatesInput[]
    OR?: AiQueryLogScalarWhereWithAggregatesInput[]
    NOT?: AiQueryLogScalarWhereWithAggregatesInput | AiQueryLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AiQueryLog"> | string
    tenantId?: UuidWithAggregatesFilter<"AiQueryLog"> | string
    userId?: UuidWithAggregatesFilter<"AiQueryLog"> | string
    facilityId?: UuidNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    feature?: StringWithAggregatesFilter<"AiQueryLog"> | string
    queryText?: StringWithAggregatesFilter<"AiQueryLog"> | string
    queryPlan?: JsonNullableWithAggregatesFilter<"AiQueryLog">
    compiledSql?: StringNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    resultCount?: IntNullableWithAggregatesFilter<"AiQueryLog"> | number | null
    executionTimeMs?: IntNullableWithAggregatesFilter<"AiQueryLog"> | number | null
    modelUsed?: StringNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    inputTokens?: IntNullableWithAggregatesFilter<"AiQueryLog"> | number | null
    outputTokens?: IntNullableWithAggregatesFilter<"AiQueryLog"> | number | null
    status?: StringWithAggregatesFilter<"AiQueryLog"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AiQueryLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiQueryLog"> | Date | string
  }

  export type AiUsageMetricWhereInput = {
    AND?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[]
    OR?: AiUsageMetricWhereInput[]
    NOT?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[]
    id?: UuidFilter<"AiUsageMetric"> | string
    tenantId?: UuidFilter<"AiUsageMetric"> | string
    feature?: StringFilter<"AiUsageMetric"> | string
    periodType?: StringFilter<"AiUsageMetric"> | string
    periodStart?: DateTimeFilter<"AiUsageMetric"> | Date | string
    queryCount?: IntFilter<"AiUsageMetric"> | number
    successCount?: IntFilter<"AiUsageMetric"> | number
    errorCount?: IntFilter<"AiUsageMetric"> | number
    uniqueUsers?: IntFilter<"AiUsageMetric"> | number
    totalInputTokens?: IntFilter<"AiUsageMetric"> | number
    totalOutputTokens?: IntFilter<"AiUsageMetric"> | number
    avgExecutionTimeMs?: DecimalNullableFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: DecimalNullableFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"AiUsageMetric"> | Date | string
    updatedAt?: DateTimeFilter<"AiUsageMetric"> | Date | string
  }

  export type AiUsageMetricOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    feature?: SortOrder
    periodType?: SortOrder
    periodStart?: SortOrder
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrderInput | SortOrder
    p95ExecutionTimeMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiUsageMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_feature_periodType_periodStart?: AiUsageMetricTenantIdFeaturePeriodTypePeriodStartCompoundUniqueInput
    AND?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[]
    OR?: AiUsageMetricWhereInput[]
    NOT?: AiUsageMetricWhereInput | AiUsageMetricWhereInput[]
    tenantId?: UuidFilter<"AiUsageMetric"> | string
    feature?: StringFilter<"AiUsageMetric"> | string
    periodType?: StringFilter<"AiUsageMetric"> | string
    periodStart?: DateTimeFilter<"AiUsageMetric"> | Date | string
    queryCount?: IntFilter<"AiUsageMetric"> | number
    successCount?: IntFilter<"AiUsageMetric"> | number
    errorCount?: IntFilter<"AiUsageMetric"> | number
    uniqueUsers?: IntFilter<"AiUsageMetric"> | number
    totalInputTokens?: IntFilter<"AiUsageMetric"> | number
    totalOutputTokens?: IntFilter<"AiUsageMetric"> | number
    avgExecutionTimeMs?: DecimalNullableFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: DecimalNullableFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFilter<"AiUsageMetric"> | Date | string
    updatedAt?: DateTimeFilter<"AiUsageMetric"> | Date | string
  }, "id" | "tenantId_feature_periodType_periodStart">

  export type AiUsageMetricOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    feature?: SortOrder
    periodType?: SortOrder
    periodStart?: SortOrder
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrderInput | SortOrder
    p95ExecutionTimeMs?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiUsageMetricCountOrderByAggregateInput
    _avg?: AiUsageMetricAvgOrderByAggregateInput
    _max?: AiUsageMetricMaxOrderByAggregateInput
    _min?: AiUsageMetricMinOrderByAggregateInput
    _sum?: AiUsageMetricSumOrderByAggregateInput
  }

  export type AiUsageMetricScalarWhereWithAggregatesInput = {
    AND?: AiUsageMetricScalarWhereWithAggregatesInput | AiUsageMetricScalarWhereWithAggregatesInput[]
    OR?: AiUsageMetricScalarWhereWithAggregatesInput[]
    NOT?: AiUsageMetricScalarWhereWithAggregatesInput | AiUsageMetricScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AiUsageMetric"> | string
    tenantId?: UuidWithAggregatesFilter<"AiUsageMetric"> | string
    feature?: StringWithAggregatesFilter<"AiUsageMetric"> | string
    periodType?: StringWithAggregatesFilter<"AiUsageMetric"> | string
    periodStart?: DateTimeWithAggregatesFilter<"AiUsageMetric"> | Date | string
    queryCount?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    successCount?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    errorCount?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    uniqueUsers?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    totalInputTokens?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    totalOutputTokens?: IntWithAggregatesFilter<"AiUsageMetric"> | number
    avgExecutionTimeMs?: DecimalNullableWithAggregatesFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: DecimalNullableWithAggregatesFilter<"AiUsageMetric"> | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiUsageMetric"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiUsageMetric"> | Date | string
  }

  export type SemanticMetricWhereInput = {
    AND?: SemanticMetricWhereInput | SemanticMetricWhereInput[]
    OR?: SemanticMetricWhereInput[]
    NOT?: SemanticMetricWhereInput | SemanticMetricWhereInput[]
    id?: UuidFilter<"SemanticMetric"> | string
    tenantId?: UuidNullableFilter<"SemanticMetric"> | string | null
    name?: StringFilter<"SemanticMetric"> | string
    displayName?: StringFilter<"SemanticMetric"> | string
    displayNameAr?: StringNullableFilter<"SemanticMetric"> | string | null
    description?: StringNullableFilter<"SemanticMetric"> | string | null
    expression?: StringFilter<"SemanticMetric"> | string
    database?: StringFilter<"SemanticMetric"> | string
    baseTable?: StringFilter<"SemanticMetric"> | string
    dataType?: StringNullableFilter<"SemanticMetric"> | string | null
    defaultAggregation?: StringNullableFilter<"SemanticMetric"> | string | null
    format?: StringNullableFilter<"SemanticMetric"> | string | null
    requiredPermission?: StringNullableFilter<"SemanticMetric"> | string | null
    category?: StringNullableFilter<"SemanticMetric"> | string | null
    sortOrder?: IntFilter<"SemanticMetric"> | number
    isActive?: BoolFilter<"SemanticMetric"> | boolean
    createdAt?: DateTimeFilter<"SemanticMetric"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticMetric"> | Date | string
  }

  export type SemanticMetricOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    expression?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrderInput | SortOrder
    defaultAggregation?: SortOrderInput | SortOrder
    format?: SortOrderInput | SortOrder
    requiredPermission?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_name?: SemanticMetricTenantIdNameCompoundUniqueInput
    AND?: SemanticMetricWhereInput | SemanticMetricWhereInput[]
    OR?: SemanticMetricWhereInput[]
    NOT?: SemanticMetricWhereInput | SemanticMetricWhereInput[]
    tenantId?: UuidNullableFilter<"SemanticMetric"> | string | null
    name?: StringFilter<"SemanticMetric"> | string
    displayName?: StringFilter<"SemanticMetric"> | string
    displayNameAr?: StringNullableFilter<"SemanticMetric"> | string | null
    description?: StringNullableFilter<"SemanticMetric"> | string | null
    expression?: StringFilter<"SemanticMetric"> | string
    database?: StringFilter<"SemanticMetric"> | string
    baseTable?: StringFilter<"SemanticMetric"> | string
    dataType?: StringNullableFilter<"SemanticMetric"> | string | null
    defaultAggregation?: StringNullableFilter<"SemanticMetric"> | string | null
    format?: StringNullableFilter<"SemanticMetric"> | string | null
    requiredPermission?: StringNullableFilter<"SemanticMetric"> | string | null
    category?: StringNullableFilter<"SemanticMetric"> | string | null
    sortOrder?: IntFilter<"SemanticMetric"> | number
    isActive?: BoolFilter<"SemanticMetric"> | boolean
    createdAt?: DateTimeFilter<"SemanticMetric"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticMetric"> | Date | string
  }, "id" | "tenantId_name">

  export type SemanticMetricOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    expression?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrderInput | SortOrder
    defaultAggregation?: SortOrderInput | SortOrder
    format?: SortOrderInput | SortOrder
    requiredPermission?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SemanticMetricCountOrderByAggregateInput
    _avg?: SemanticMetricAvgOrderByAggregateInput
    _max?: SemanticMetricMaxOrderByAggregateInput
    _min?: SemanticMetricMinOrderByAggregateInput
    _sum?: SemanticMetricSumOrderByAggregateInput
  }

  export type SemanticMetricScalarWhereWithAggregatesInput = {
    AND?: SemanticMetricScalarWhereWithAggregatesInput | SemanticMetricScalarWhereWithAggregatesInput[]
    OR?: SemanticMetricScalarWhereWithAggregatesInput[]
    NOT?: SemanticMetricScalarWhereWithAggregatesInput | SemanticMetricScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SemanticMetric"> | string
    tenantId?: UuidNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    name?: StringWithAggregatesFilter<"SemanticMetric"> | string
    displayName?: StringWithAggregatesFilter<"SemanticMetric"> | string
    displayNameAr?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    description?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    expression?: StringWithAggregatesFilter<"SemanticMetric"> | string
    database?: StringWithAggregatesFilter<"SemanticMetric"> | string
    baseTable?: StringWithAggregatesFilter<"SemanticMetric"> | string
    dataType?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    defaultAggregation?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    format?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    requiredPermission?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    category?: StringNullableWithAggregatesFilter<"SemanticMetric"> | string | null
    sortOrder?: IntWithAggregatesFilter<"SemanticMetric"> | number
    isActive?: BoolWithAggregatesFilter<"SemanticMetric"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SemanticMetric"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SemanticMetric"> | Date | string
  }

  export type SemanticDimensionWhereInput = {
    AND?: SemanticDimensionWhereInput | SemanticDimensionWhereInput[]
    OR?: SemanticDimensionWhereInput[]
    NOT?: SemanticDimensionWhereInput | SemanticDimensionWhereInput[]
    id?: UuidFilter<"SemanticDimension"> | string
    tenantId?: UuidNullableFilter<"SemanticDimension"> | string | null
    name?: StringFilter<"SemanticDimension"> | string
    displayName?: StringFilter<"SemanticDimension"> | string
    displayNameAr?: StringNullableFilter<"SemanticDimension"> | string | null
    description?: StringNullableFilter<"SemanticDimension"> | string | null
    columnRef?: StringFilter<"SemanticDimension"> | string
    database?: StringFilter<"SemanticDimension"> | string
    baseTable?: StringFilter<"SemanticDimension"> | string
    dataType?: StringNullableFilter<"SemanticDimension"> | string | null
    allowedOperators?: StringNullableListFilter<"SemanticDimension">
    isLookup?: BoolFilter<"SemanticDimension"> | boolean
    lookupValues?: StringNullableListFilter<"SemanticDimension">
    requiredPermission?: StringNullableFilter<"SemanticDimension"> | string | null
    category?: StringNullableFilter<"SemanticDimension"> | string | null
    sortOrder?: IntFilter<"SemanticDimension"> | number
    isActive?: BoolFilter<"SemanticDimension"> | boolean
    createdAt?: DateTimeFilter<"SemanticDimension"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticDimension"> | Date | string
  }

  export type SemanticDimensionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    columnRef?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrderInput | SortOrder
    allowedOperators?: SortOrder
    isLookup?: SortOrder
    lookupValues?: SortOrder
    requiredPermission?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticDimensionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_name?: SemanticDimensionTenantIdNameCompoundUniqueInput
    AND?: SemanticDimensionWhereInput | SemanticDimensionWhereInput[]
    OR?: SemanticDimensionWhereInput[]
    NOT?: SemanticDimensionWhereInput | SemanticDimensionWhereInput[]
    tenantId?: UuidNullableFilter<"SemanticDimension"> | string | null
    name?: StringFilter<"SemanticDimension"> | string
    displayName?: StringFilter<"SemanticDimension"> | string
    displayNameAr?: StringNullableFilter<"SemanticDimension"> | string | null
    description?: StringNullableFilter<"SemanticDimension"> | string | null
    columnRef?: StringFilter<"SemanticDimension"> | string
    database?: StringFilter<"SemanticDimension"> | string
    baseTable?: StringFilter<"SemanticDimension"> | string
    dataType?: StringNullableFilter<"SemanticDimension"> | string | null
    allowedOperators?: StringNullableListFilter<"SemanticDimension">
    isLookup?: BoolFilter<"SemanticDimension"> | boolean
    lookupValues?: StringNullableListFilter<"SemanticDimension">
    requiredPermission?: StringNullableFilter<"SemanticDimension"> | string | null
    category?: StringNullableFilter<"SemanticDimension"> | string | null
    sortOrder?: IntFilter<"SemanticDimension"> | number
    isActive?: BoolFilter<"SemanticDimension"> | boolean
    createdAt?: DateTimeFilter<"SemanticDimension"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticDimension"> | Date | string
  }, "id" | "tenantId_name">

  export type SemanticDimensionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    columnRef?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrderInput | SortOrder
    allowedOperators?: SortOrder
    isLookup?: SortOrder
    lookupValues?: SortOrder
    requiredPermission?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SemanticDimensionCountOrderByAggregateInput
    _avg?: SemanticDimensionAvgOrderByAggregateInput
    _max?: SemanticDimensionMaxOrderByAggregateInput
    _min?: SemanticDimensionMinOrderByAggregateInput
    _sum?: SemanticDimensionSumOrderByAggregateInput
  }

  export type SemanticDimensionScalarWhereWithAggregatesInput = {
    AND?: SemanticDimensionScalarWhereWithAggregatesInput | SemanticDimensionScalarWhereWithAggregatesInput[]
    OR?: SemanticDimensionScalarWhereWithAggregatesInput[]
    NOT?: SemanticDimensionScalarWhereWithAggregatesInput | SemanticDimensionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SemanticDimension"> | string
    tenantId?: UuidNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    name?: StringWithAggregatesFilter<"SemanticDimension"> | string
    displayName?: StringWithAggregatesFilter<"SemanticDimension"> | string
    displayNameAr?: StringNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    description?: StringNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    columnRef?: StringWithAggregatesFilter<"SemanticDimension"> | string
    database?: StringWithAggregatesFilter<"SemanticDimension"> | string
    baseTable?: StringWithAggregatesFilter<"SemanticDimension"> | string
    dataType?: StringNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    allowedOperators?: StringNullableListFilter<"SemanticDimension">
    isLookup?: BoolWithAggregatesFilter<"SemanticDimension"> | boolean
    lookupValues?: StringNullableListFilter<"SemanticDimension">
    requiredPermission?: StringNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    category?: StringNullableWithAggregatesFilter<"SemanticDimension"> | string | null
    sortOrder?: IntWithAggregatesFilter<"SemanticDimension"> | number
    isActive?: BoolWithAggregatesFilter<"SemanticDimension"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SemanticDimension"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SemanticDimension"> | Date | string
  }

  export type SemanticJoinPathWhereInput = {
    AND?: SemanticJoinPathWhereInput | SemanticJoinPathWhereInput[]
    OR?: SemanticJoinPathWhereInput[]
    NOT?: SemanticJoinPathWhereInput | SemanticJoinPathWhereInput[]
    id?: UuidFilter<"SemanticJoinPath"> | string
    tenantId?: UuidNullableFilter<"SemanticJoinPath"> | string | null
    name?: StringFilter<"SemanticJoinPath"> | string
    fromTable?: StringFilter<"SemanticJoinPath"> | string
    fromDatabase?: StringFilter<"SemanticJoinPath"> | string
    toTable?: StringFilter<"SemanticJoinPath"> | string
    toDatabase?: StringFilter<"SemanticJoinPath"> | string
    joinType?: StringFilter<"SemanticJoinPath"> | string
    joinCondition?: StringFilter<"SemanticJoinPath"> | string
    cardinality?: StringNullableFilter<"SemanticJoinPath"> | string | null
    description?: StringNullableFilter<"SemanticJoinPath"> | string | null
    isActive?: BoolFilter<"SemanticJoinPath"> | boolean
    createdAt?: DateTimeFilter<"SemanticJoinPath"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticJoinPath"> | Date | string
  }

  export type SemanticJoinPathOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    fromTable?: SortOrder
    fromDatabase?: SortOrder
    toTable?: SortOrder
    toDatabase?: SortOrder
    joinType?: SortOrder
    joinCondition?: SortOrder
    cardinality?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticJoinPathWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_name?: SemanticJoinPathTenantIdNameCompoundUniqueInput
    AND?: SemanticJoinPathWhereInput | SemanticJoinPathWhereInput[]
    OR?: SemanticJoinPathWhereInput[]
    NOT?: SemanticJoinPathWhereInput | SemanticJoinPathWhereInput[]
    tenantId?: UuidNullableFilter<"SemanticJoinPath"> | string | null
    name?: StringFilter<"SemanticJoinPath"> | string
    fromTable?: StringFilter<"SemanticJoinPath"> | string
    fromDatabase?: StringFilter<"SemanticJoinPath"> | string
    toTable?: StringFilter<"SemanticJoinPath"> | string
    toDatabase?: StringFilter<"SemanticJoinPath"> | string
    joinType?: StringFilter<"SemanticJoinPath"> | string
    joinCondition?: StringFilter<"SemanticJoinPath"> | string
    cardinality?: StringNullableFilter<"SemanticJoinPath"> | string | null
    description?: StringNullableFilter<"SemanticJoinPath"> | string | null
    isActive?: BoolFilter<"SemanticJoinPath"> | boolean
    createdAt?: DateTimeFilter<"SemanticJoinPath"> | Date | string
    updatedAt?: DateTimeFilter<"SemanticJoinPath"> | Date | string
  }, "id" | "tenantId_name">

  export type SemanticJoinPathOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrderInput | SortOrder
    name?: SortOrder
    fromTable?: SortOrder
    fromDatabase?: SortOrder
    toTable?: SortOrder
    toDatabase?: SortOrder
    joinType?: SortOrder
    joinCondition?: SortOrder
    cardinality?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SemanticJoinPathCountOrderByAggregateInput
    _max?: SemanticJoinPathMaxOrderByAggregateInput
    _min?: SemanticJoinPathMinOrderByAggregateInput
  }

  export type SemanticJoinPathScalarWhereWithAggregatesInput = {
    AND?: SemanticJoinPathScalarWhereWithAggregatesInput | SemanticJoinPathScalarWhereWithAggregatesInput[]
    OR?: SemanticJoinPathScalarWhereWithAggregatesInput[]
    NOT?: SemanticJoinPathScalarWhereWithAggregatesInput | SemanticJoinPathScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SemanticJoinPath"> | string
    tenantId?: UuidNullableWithAggregatesFilter<"SemanticJoinPath"> | string | null
    name?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    fromTable?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    fromDatabase?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    toTable?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    toDatabase?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    joinType?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    joinCondition?: StringWithAggregatesFilter<"SemanticJoinPath"> | string
    cardinality?: StringNullableWithAggregatesFilter<"SemanticJoinPath"> | string | null
    description?: StringNullableWithAggregatesFilter<"SemanticJoinPath"> | string | null
    isActive?: BoolWithAggregatesFilter<"SemanticJoinPath"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SemanticJoinPath"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SemanticJoinPath"> | Date | string
  }

  export type SavedReportWhereInput = {
    AND?: SavedReportWhereInput | SavedReportWhereInput[]
    OR?: SavedReportWhereInput[]
    NOT?: SavedReportWhereInput | SavedReportWhereInput[]
    id?: UuidFilter<"SavedReport"> | string
    tenantId?: UuidFilter<"SavedReport"> | string
    createdById?: UuidFilter<"SavedReport"> | string
    name?: StringFilter<"SavedReport"> | string
    description?: StringNullableFilter<"SavedReport"> | string | null
    query?: StringFilter<"SavedReport"> | string
    queryPlan?: JsonNullableFilter<"SavedReport">
    isPublic?: BoolFilter<"SavedReport"> | boolean
    isFavorite?: BoolFilter<"SavedReport"> | boolean
    executionCount?: IntFilter<"SavedReport"> | number
    lastExecutedAt?: DateTimeNullableFilter<"SavedReport"> | Date | string | null
    createdAt?: DateTimeFilter<"SavedReport"> | Date | string
    updatedAt?: DateTimeFilter<"SavedReport"> | Date | string
  }

  export type SavedReportOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    createdById?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    query?: SortOrder
    queryPlan?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    isFavorite?: SortOrder
    executionCount?: SortOrder
    lastExecutedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SavedReportWhereInput | SavedReportWhereInput[]
    OR?: SavedReportWhereInput[]
    NOT?: SavedReportWhereInput | SavedReportWhereInput[]
    tenantId?: UuidFilter<"SavedReport"> | string
    createdById?: UuidFilter<"SavedReport"> | string
    name?: StringFilter<"SavedReport"> | string
    description?: StringNullableFilter<"SavedReport"> | string | null
    query?: StringFilter<"SavedReport"> | string
    queryPlan?: JsonNullableFilter<"SavedReport">
    isPublic?: BoolFilter<"SavedReport"> | boolean
    isFavorite?: BoolFilter<"SavedReport"> | boolean
    executionCount?: IntFilter<"SavedReport"> | number
    lastExecutedAt?: DateTimeNullableFilter<"SavedReport"> | Date | string | null
    createdAt?: DateTimeFilter<"SavedReport"> | Date | string
    updatedAt?: DateTimeFilter<"SavedReport"> | Date | string
  }, "id">

  export type SavedReportOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    createdById?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    query?: SortOrder
    queryPlan?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    isFavorite?: SortOrder
    executionCount?: SortOrder
    lastExecutedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SavedReportCountOrderByAggregateInput
    _avg?: SavedReportAvgOrderByAggregateInput
    _max?: SavedReportMaxOrderByAggregateInput
    _min?: SavedReportMinOrderByAggregateInput
    _sum?: SavedReportSumOrderByAggregateInput
  }

  export type SavedReportScalarWhereWithAggregatesInput = {
    AND?: SavedReportScalarWhereWithAggregatesInput | SavedReportScalarWhereWithAggregatesInput[]
    OR?: SavedReportScalarWhereWithAggregatesInput[]
    NOT?: SavedReportScalarWhereWithAggregatesInput | SavedReportScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SavedReport"> | string
    tenantId?: UuidWithAggregatesFilter<"SavedReport"> | string
    createdById?: UuidWithAggregatesFilter<"SavedReport"> | string
    name?: StringWithAggregatesFilter<"SavedReport"> | string
    description?: StringNullableWithAggregatesFilter<"SavedReport"> | string | null
    query?: StringWithAggregatesFilter<"SavedReport"> | string
    queryPlan?: JsonNullableWithAggregatesFilter<"SavedReport">
    isPublic?: BoolWithAggregatesFilter<"SavedReport"> | boolean
    isFavorite?: BoolWithAggregatesFilter<"SavedReport"> | boolean
    executionCount?: IntWithAggregatesFilter<"SavedReport"> | number
    lastExecutedAt?: DateTimeNullableWithAggregatesFilter<"SavedReport"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SavedReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SavedReport"> | Date | string
  }

  export type ClinicalObservationDailyWhereInput = {
    AND?: ClinicalObservationDailyWhereInput | ClinicalObservationDailyWhereInput[]
    OR?: ClinicalObservationDailyWhereInput[]
    NOT?: ClinicalObservationDailyWhereInput | ClinicalObservationDailyWhereInput[]
    id?: UuidFilter<"ClinicalObservationDaily"> | string
    tenantId?: UuidFilter<"ClinicalObservationDaily"> | string
    facilityId?: UuidNullableFilter<"ClinicalObservationDaily"> | string | null
    departmentId?: UuidNullableFilter<"ClinicalObservationDaily"> | string | null
    observationDate?: DateTimeFilter<"ClinicalObservationDaily"> | Date | string
    code?: StringFilter<"ClinicalObservationDaily"> | string
    codeSystem?: StringFilter<"ClinicalObservationDaily"> | string
    category?: StringFilter<"ClinicalObservationDaily"> | string
    recordCount?: IntFilter<"ClinicalObservationDaily"> | number
    avgValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    minValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    maxValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p50Value?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p95Value?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFilter<"ClinicalObservationDaily"> | number
    abnormalHighCount?: IntFilter<"ClinicalObservationDaily"> | number
    abnormalLowCount?: IntFilter<"ClinicalObservationDaily"> | number
    criticalCount?: IntFilter<"ClinicalObservationDaily"> | number
    uniquePatients?: IntFilter<"ClinicalObservationDaily"> | number
    createdAt?: DateTimeFilter<"ClinicalObservationDaily"> | Date | string
  }

  export type ClinicalObservationDailyOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    observationDate?: SortOrder
    code?: SortOrder
    codeSystem?: SortOrder
    category?: SortOrder
    recordCount?: SortOrder
    avgValue?: SortOrderInput | SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    p50Value?: SortOrderInput | SortOrder
    p95Value?: SortOrderInput | SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
    createdAt?: SortOrder
  }

  export type ClinicalObservationDailyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_facilityId_departmentId_observationDate_code?: ClinicalObservationDailyTenantIdFacilityIdDepartmentIdObservationDateCodeCompoundUniqueInput
    AND?: ClinicalObservationDailyWhereInput | ClinicalObservationDailyWhereInput[]
    OR?: ClinicalObservationDailyWhereInput[]
    NOT?: ClinicalObservationDailyWhereInput | ClinicalObservationDailyWhereInput[]
    tenantId?: UuidFilter<"ClinicalObservationDaily"> | string
    facilityId?: UuidNullableFilter<"ClinicalObservationDaily"> | string | null
    departmentId?: UuidNullableFilter<"ClinicalObservationDaily"> | string | null
    observationDate?: DateTimeFilter<"ClinicalObservationDaily"> | Date | string
    code?: StringFilter<"ClinicalObservationDaily"> | string
    codeSystem?: StringFilter<"ClinicalObservationDaily"> | string
    category?: StringFilter<"ClinicalObservationDaily"> | string
    recordCount?: IntFilter<"ClinicalObservationDaily"> | number
    avgValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    minValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    maxValue?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p50Value?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p95Value?: DecimalNullableFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFilter<"ClinicalObservationDaily"> | number
    abnormalHighCount?: IntFilter<"ClinicalObservationDaily"> | number
    abnormalLowCount?: IntFilter<"ClinicalObservationDaily"> | number
    criticalCount?: IntFilter<"ClinicalObservationDaily"> | number
    uniquePatients?: IntFilter<"ClinicalObservationDaily"> | number
    createdAt?: DateTimeFilter<"ClinicalObservationDaily"> | Date | string
  }, "id" | "tenantId_facilityId_departmentId_observationDate_code">

  export type ClinicalObservationDailyOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    observationDate?: SortOrder
    code?: SortOrder
    codeSystem?: SortOrder
    category?: SortOrder
    recordCount?: SortOrder
    avgValue?: SortOrderInput | SortOrder
    minValue?: SortOrderInput | SortOrder
    maxValue?: SortOrderInput | SortOrder
    p50Value?: SortOrderInput | SortOrder
    p95Value?: SortOrderInput | SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
    createdAt?: SortOrder
    _count?: ClinicalObservationDailyCountOrderByAggregateInput
    _avg?: ClinicalObservationDailyAvgOrderByAggregateInput
    _max?: ClinicalObservationDailyMaxOrderByAggregateInput
    _min?: ClinicalObservationDailyMinOrderByAggregateInput
    _sum?: ClinicalObservationDailySumOrderByAggregateInput
  }

  export type ClinicalObservationDailyScalarWhereWithAggregatesInput = {
    AND?: ClinicalObservationDailyScalarWhereWithAggregatesInput | ClinicalObservationDailyScalarWhereWithAggregatesInput[]
    OR?: ClinicalObservationDailyScalarWhereWithAggregatesInput[]
    NOT?: ClinicalObservationDailyScalarWhereWithAggregatesInput | ClinicalObservationDailyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ClinicalObservationDaily"> | string
    tenantId?: UuidWithAggregatesFilter<"ClinicalObservationDaily"> | string
    facilityId?: UuidNullableWithAggregatesFilter<"ClinicalObservationDaily"> | string | null
    departmentId?: UuidNullableWithAggregatesFilter<"ClinicalObservationDaily"> | string | null
    observationDate?: DateTimeWithAggregatesFilter<"ClinicalObservationDaily"> | Date | string
    code?: StringWithAggregatesFilter<"ClinicalObservationDaily"> | string
    codeSystem?: StringWithAggregatesFilter<"ClinicalObservationDaily"> | string
    category?: StringWithAggregatesFilter<"ClinicalObservationDaily"> | string
    recordCount?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    avgValue?: DecimalNullableWithAggregatesFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    minValue?: DecimalNullableWithAggregatesFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    maxValue?: DecimalNullableWithAggregatesFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p50Value?: DecimalNullableWithAggregatesFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    p95Value?: DecimalNullableWithAggregatesFilter<"ClinicalObservationDaily"> | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    abnormalHighCount?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    abnormalLowCount?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    criticalCount?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    uniquePatients?: IntWithAggregatesFilter<"ClinicalObservationDaily"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ClinicalObservationDaily"> | Date | string
  }

  export type DiagnosisDailyAggregateWhereInput = {
    AND?: DiagnosisDailyAggregateWhereInput | DiagnosisDailyAggregateWhereInput[]
    OR?: DiagnosisDailyAggregateWhereInput[]
    NOT?: DiagnosisDailyAggregateWhereInput | DiagnosisDailyAggregateWhereInput[]
    id?: UuidFilter<"DiagnosisDailyAggregate"> | string
    tenantId?: UuidFilter<"DiagnosisDailyAggregate"> | string
    facilityId?: UuidNullableFilter<"DiagnosisDailyAggregate"> | string | null
    departmentId?: UuidNullableFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisDate?: DateTimeFilter<"DiagnosisDailyAggregate"> | Date | string
    icdCode?: StringFilter<"DiagnosisDailyAggregate"> | string
    icdBlock?: StringNullableFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisName?: StringFilter<"DiagnosisDailyAggregate"> | string
    diagnosisType?: StringFilter<"DiagnosisDailyAggregate"> | string
    encounterCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    uniquePatients?: IntFilter<"DiagnosisDailyAggregate"> | number
    primaryCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    chronicCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    createdAt?: DateTimeFilter<"DiagnosisDailyAggregate"> | Date | string
  }

  export type DiagnosisDailyAggregateOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    diagnosisDate?: SortOrder
    icdCode?: SortOrder
    icdBlock?: SortOrderInput | SortOrder
    diagnosisName?: SortOrder
    diagnosisType?: SortOrder
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DiagnosisDailyAggregateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_facilityId_departmentId_diagnosisDate_icdCode_diagnosisType?: DiagnosisDailyAggregateTenantIdFacilityIdDepartmentIdDiagnosisDateIcdCodeDiagnosisTypeCompoundUniqueInput
    AND?: DiagnosisDailyAggregateWhereInput | DiagnosisDailyAggregateWhereInput[]
    OR?: DiagnosisDailyAggregateWhereInput[]
    NOT?: DiagnosisDailyAggregateWhereInput | DiagnosisDailyAggregateWhereInput[]
    tenantId?: UuidFilter<"DiagnosisDailyAggregate"> | string
    facilityId?: UuidNullableFilter<"DiagnosisDailyAggregate"> | string | null
    departmentId?: UuidNullableFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisDate?: DateTimeFilter<"DiagnosisDailyAggregate"> | Date | string
    icdCode?: StringFilter<"DiagnosisDailyAggregate"> | string
    icdBlock?: StringNullableFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisName?: StringFilter<"DiagnosisDailyAggregate"> | string
    diagnosisType?: StringFilter<"DiagnosisDailyAggregate"> | string
    encounterCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    uniquePatients?: IntFilter<"DiagnosisDailyAggregate"> | number
    primaryCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    chronicCount?: IntFilter<"DiagnosisDailyAggregate"> | number
    createdAt?: DateTimeFilter<"DiagnosisDailyAggregate"> | Date | string
  }, "id" | "tenantId_facilityId_departmentId_diagnosisDate_icdCode_diagnosisType">

  export type DiagnosisDailyAggregateOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrderInput | SortOrder
    departmentId?: SortOrderInput | SortOrder
    diagnosisDate?: SortOrder
    icdCode?: SortOrder
    icdBlock?: SortOrderInput | SortOrder
    diagnosisName?: SortOrder
    diagnosisType?: SortOrder
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
    createdAt?: SortOrder
    _count?: DiagnosisDailyAggregateCountOrderByAggregateInput
    _avg?: DiagnosisDailyAggregateAvgOrderByAggregateInput
    _max?: DiagnosisDailyAggregateMaxOrderByAggregateInput
    _min?: DiagnosisDailyAggregateMinOrderByAggregateInput
    _sum?: DiagnosisDailyAggregateSumOrderByAggregateInput
  }

  export type DiagnosisDailyAggregateScalarWhereWithAggregatesInput = {
    AND?: DiagnosisDailyAggregateScalarWhereWithAggregatesInput | DiagnosisDailyAggregateScalarWhereWithAggregatesInput[]
    OR?: DiagnosisDailyAggregateScalarWhereWithAggregatesInput[]
    NOT?: DiagnosisDailyAggregateScalarWhereWithAggregatesInput | DiagnosisDailyAggregateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DiagnosisDailyAggregate"> | string
    tenantId?: UuidWithAggregatesFilter<"DiagnosisDailyAggregate"> | string
    facilityId?: UuidNullableWithAggregatesFilter<"DiagnosisDailyAggregate"> | string | null
    departmentId?: UuidNullableWithAggregatesFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisDate?: DateTimeWithAggregatesFilter<"DiagnosisDailyAggregate"> | Date | string
    icdCode?: StringWithAggregatesFilter<"DiagnosisDailyAggregate"> | string
    icdBlock?: StringNullableWithAggregatesFilter<"DiagnosisDailyAggregate"> | string | null
    diagnosisName?: StringWithAggregatesFilter<"DiagnosisDailyAggregate"> | string
    diagnosisType?: StringWithAggregatesFilter<"DiagnosisDailyAggregate"> | string
    encounterCount?: IntWithAggregatesFilter<"DiagnosisDailyAggregate"> | number
    uniquePatients?: IntWithAggregatesFilter<"DiagnosisDailyAggregate"> | number
    primaryCount?: IntWithAggregatesFilter<"DiagnosisDailyAggregate"> | number
    chronicCount?: IntWithAggregatesFilter<"DiagnosisDailyAggregate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DiagnosisDailyAggregate"> | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    tenantId: string
    actorId?: string | null
    action: string
    resource: string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
    receivedAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    actorId?: string | null
    action: string
    resource: string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
    receivedAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    tenantId: string
    actorId?: string | null
    action: string
    resource: string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
    receivedAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageEventCreateInput = {
    id?: string
    tenantId: string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type UsageEventUncheckedCreateInput = {
    id?: string
    tenantId: string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type UsageEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageEventCreateManyInput = {
    id?: string
    tenantId: string
    eventType: string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: Date | string
  }

  export type UsageEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiQueryLogCreateInput = {
    id?: string
    tenantId: string
    userId: string
    facilityId?: string | null
    feature: string
    queryText: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: string | null
    resultCount?: number | null
    executionTimeMs?: number | null
    modelUsed?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    status?: string
    errorMessage?: string | null
    userAgent?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AiQueryLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    userId: string
    facilityId?: string | null
    feature: string
    queryText: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: string | null
    resultCount?: number | null
    executionTimeMs?: number | null
    modelUsed?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    status?: string
    errorMessage?: string | null
    userAgent?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AiQueryLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    feature?: StringFieldUpdateOperationsInput | string
    queryText?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: NullableStringFieldUpdateOperationsInput | string | null
    resultCount?: NullableIntFieldUpdateOperationsInput | number | null
    executionTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiQueryLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    feature?: StringFieldUpdateOperationsInput | string
    queryText?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: NullableStringFieldUpdateOperationsInput | string | null
    resultCount?: NullableIntFieldUpdateOperationsInput | number | null
    executionTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiQueryLogCreateManyInput = {
    id?: string
    tenantId: string
    userId: string
    facilityId?: string | null
    feature: string
    queryText: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: string | null
    resultCount?: number | null
    executionTimeMs?: number | null
    modelUsed?: string | null
    inputTokens?: number | null
    outputTokens?: number | null
    status?: string
    errorMessage?: string | null
    userAgent?: string | null
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type AiQueryLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    feature?: StringFieldUpdateOperationsInput | string
    queryText?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: NullableStringFieldUpdateOperationsInput | string | null
    resultCount?: NullableIntFieldUpdateOperationsInput | number | null
    executionTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiQueryLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    feature?: StringFieldUpdateOperationsInput | string
    queryText?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    compiledSql?: NullableStringFieldUpdateOperationsInput | string | null
    resultCount?: NullableIntFieldUpdateOperationsInput | number | null
    executionTimeMs?: NullableIntFieldUpdateOperationsInput | number | null
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    inputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    outputTokens?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageMetricCreateInput = {
    id?: string
    tenantId: string
    feature: string
    periodType: string
    periodStart: Date | string
    queryCount?: number
    successCount?: number
    errorCount?: number
    uniqueUsers?: number
    totalInputTokens?: number
    totalOutputTokens?: number
    avgExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiUsageMetricUncheckedCreateInput = {
    id?: string
    tenantId: string
    feature: string
    periodType: string
    periodStart: Date | string
    queryCount?: number
    successCount?: number
    errorCount?: number
    uniqueUsers?: number
    totalInputTokens?: number
    totalOutputTokens?: number
    avgExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiUsageMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    feature?: StringFieldUpdateOperationsInput | string
    periodType?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    queryCount?: IntFieldUpdateOperationsInput | number
    successCount?: IntFieldUpdateOperationsInput | number
    errorCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    totalInputTokens?: IntFieldUpdateOperationsInput | number
    totalOutputTokens?: IntFieldUpdateOperationsInput | number
    avgExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    feature?: StringFieldUpdateOperationsInput | string
    periodType?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    queryCount?: IntFieldUpdateOperationsInput | number
    successCount?: IntFieldUpdateOperationsInput | number
    errorCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    totalInputTokens?: IntFieldUpdateOperationsInput | number
    totalOutputTokens?: IntFieldUpdateOperationsInput | number
    avgExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageMetricCreateManyInput = {
    id?: string
    tenantId: string
    feature: string
    periodType: string
    periodStart: Date | string
    queryCount?: number
    successCount?: number
    errorCount?: number
    uniqueUsers?: number
    totalInputTokens?: number
    totalOutputTokens?: number
    avgExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: Decimal | DecimalJsLike | number | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiUsageMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    feature?: StringFieldUpdateOperationsInput | string
    periodType?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    queryCount?: IntFieldUpdateOperationsInput | number
    successCount?: IntFieldUpdateOperationsInput | number
    errorCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    totalInputTokens?: IntFieldUpdateOperationsInput | number
    totalOutputTokens?: IntFieldUpdateOperationsInput | number
    avgExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    feature?: StringFieldUpdateOperationsInput | string
    periodType?: StringFieldUpdateOperationsInput | string
    periodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    queryCount?: IntFieldUpdateOperationsInput | number
    successCount?: IntFieldUpdateOperationsInput | number
    errorCount?: IntFieldUpdateOperationsInput | number
    uniqueUsers?: IntFieldUpdateOperationsInput | number
    totalInputTokens?: IntFieldUpdateOperationsInput | number
    totalOutputTokens?: IntFieldUpdateOperationsInput | number
    avgExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95ExecutionTimeMs?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticMetricCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    expression: string
    database: string
    baseTable: string
    dataType?: string | null
    defaultAggregation?: string | null
    format?: string | null
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticMetricUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    expression: string
    database: string
    baseTable: string
    dataType?: string | null
    defaultAggregation?: string | null
    format?: string | null
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    expression?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    defaultAggregation?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    expression?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    defaultAggregation?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticMetricCreateManyInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    expression: string
    database: string
    baseTable: string
    dataType?: string | null
    defaultAggregation?: string | null
    format?: string | null
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    expression?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    defaultAggregation?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    expression?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    defaultAggregation?: NullableStringFieldUpdateOperationsInput | string | null
    format?: NullableStringFieldUpdateOperationsInput | string | null
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticDimensionCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    columnRef: string
    database: string
    baseTable: string
    dataType?: string | null
    allowedOperators?: SemanticDimensionCreateallowedOperatorsInput | string[]
    isLookup?: boolean
    lookupValues?: SemanticDimensionCreatelookupValuesInput | string[]
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticDimensionUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    columnRef: string
    database: string
    baseTable: string
    dataType?: string | null
    allowedOperators?: SemanticDimensionCreateallowedOperatorsInput | string[]
    isLookup?: boolean
    lookupValues?: SemanticDimensionCreatelookupValuesInput | string[]
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticDimensionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    columnRef?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    allowedOperators?: SemanticDimensionUpdateallowedOperatorsInput | string[]
    isLookup?: BoolFieldUpdateOperationsInput | boolean
    lookupValues?: SemanticDimensionUpdatelookupValuesInput | string[]
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticDimensionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    columnRef?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    allowedOperators?: SemanticDimensionUpdateallowedOperatorsInput | string[]
    isLookup?: BoolFieldUpdateOperationsInput | boolean
    lookupValues?: SemanticDimensionUpdatelookupValuesInput | string[]
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticDimensionCreateManyInput = {
    id?: string
    tenantId?: string | null
    name: string
    displayName: string
    displayNameAr?: string | null
    description?: string | null
    columnRef: string
    database: string
    baseTable: string
    dataType?: string | null
    allowedOperators?: SemanticDimensionCreateallowedOperatorsInput | string[]
    isLookup?: boolean
    lookupValues?: SemanticDimensionCreatelookupValuesInput | string[]
    requiredPermission?: string | null
    category?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticDimensionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    columnRef?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    allowedOperators?: SemanticDimensionUpdateallowedOperatorsInput | string[]
    isLookup?: BoolFieldUpdateOperationsInput | boolean
    lookupValues?: SemanticDimensionUpdatelookupValuesInput | string[]
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticDimensionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    displayNameAr?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    columnRef?: StringFieldUpdateOperationsInput | string
    database?: StringFieldUpdateOperationsInput | string
    baseTable?: StringFieldUpdateOperationsInput | string
    dataType?: NullableStringFieldUpdateOperationsInput | string | null
    allowedOperators?: SemanticDimensionUpdateallowedOperatorsInput | string[]
    isLookup?: BoolFieldUpdateOperationsInput | boolean
    lookupValues?: SemanticDimensionUpdatelookupValuesInput | string[]
    requiredPermission?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticJoinPathCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    fromTable: string
    fromDatabase: string
    toTable: string
    toDatabase: string
    joinType?: string
    joinCondition: string
    cardinality?: string | null
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticJoinPathUncheckedCreateInput = {
    id?: string
    tenantId?: string | null
    name: string
    fromTable: string
    fromDatabase: string
    toTable: string
    toDatabase: string
    joinType?: string
    joinCondition: string
    cardinality?: string | null
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticJoinPathUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    fromTable?: StringFieldUpdateOperationsInput | string
    fromDatabase?: StringFieldUpdateOperationsInput | string
    toTable?: StringFieldUpdateOperationsInput | string
    toDatabase?: StringFieldUpdateOperationsInput | string
    joinType?: StringFieldUpdateOperationsInput | string
    joinCondition?: StringFieldUpdateOperationsInput | string
    cardinality?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticJoinPathUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    fromTable?: StringFieldUpdateOperationsInput | string
    fromDatabase?: StringFieldUpdateOperationsInput | string
    toTable?: StringFieldUpdateOperationsInput | string
    toDatabase?: StringFieldUpdateOperationsInput | string
    joinType?: StringFieldUpdateOperationsInput | string
    joinCondition?: StringFieldUpdateOperationsInput | string
    cardinality?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticJoinPathCreateManyInput = {
    id?: string
    tenantId?: string | null
    name: string
    fromTable: string
    fromDatabase: string
    toTable: string
    toDatabase: string
    joinType?: string
    joinCondition: string
    cardinality?: string | null
    description?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SemanticJoinPathUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    fromTable?: StringFieldUpdateOperationsInput | string
    fromDatabase?: StringFieldUpdateOperationsInput | string
    toTable?: StringFieldUpdateOperationsInput | string
    toDatabase?: StringFieldUpdateOperationsInput | string
    joinType?: StringFieldUpdateOperationsInput | string
    joinCondition?: StringFieldUpdateOperationsInput | string
    cardinality?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SemanticJoinPathUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    fromTable?: StringFieldUpdateOperationsInput | string
    fromDatabase?: StringFieldUpdateOperationsInput | string
    toTable?: StringFieldUpdateOperationsInput | string
    toDatabase?: StringFieldUpdateOperationsInput | string
    joinType?: StringFieldUpdateOperationsInput | string
    joinCondition?: StringFieldUpdateOperationsInput | string
    cardinality?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedReportCreateInput = {
    id?: string
    tenantId: string
    createdById: string
    name: string
    description?: string | null
    query: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: number
    lastExecutedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedReportUncheckedCreateInput = {
    id?: string
    tenantId: string
    createdById: string
    name: string
    description?: string | null
    query: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: number
    lastExecutedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    query?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    executionCount?: IntFieldUpdateOperationsInput | number
    lastExecutedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    query?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    executionCount?: IntFieldUpdateOperationsInput | number
    lastExecutedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedReportCreateManyInput = {
    id?: string
    tenantId: string
    createdById: string
    name: string
    description?: string | null
    query: string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: boolean
    isFavorite?: boolean
    executionCount?: number
    lastExecutedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SavedReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    query?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    executionCount?: IntFieldUpdateOperationsInput | number
    lastExecutedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SavedReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    query?: StringFieldUpdateOperationsInput | string
    queryPlan?: NullableJsonNullValueInput | InputJsonValue
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    isFavorite?: BoolFieldUpdateOperationsInput | boolean
    executionCount?: IntFieldUpdateOperationsInput | number
    lastExecutedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalObservationDailyCreateInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    observationDate: Date | string
    code: string
    codeSystem: string
    category: string
    recordCount: number
    avgValue?: Decimal | DecimalJsLike | number | string | null
    minValue?: Decimal | DecimalJsLike | number | string | null
    maxValue?: Decimal | DecimalJsLike | number | string | null
    p50Value?: Decimal | DecimalJsLike | number | string | null
    p95Value?: Decimal | DecimalJsLike | number | string | null
    normalCount?: number
    abnormalHighCount?: number
    abnormalLowCount?: number
    criticalCount?: number
    uniquePatients?: number
    createdAt?: Date | string
  }

  export type ClinicalObservationDailyUncheckedCreateInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    observationDate: Date | string
    code: string
    codeSystem: string
    category: string
    recordCount: number
    avgValue?: Decimal | DecimalJsLike | number | string | null
    minValue?: Decimal | DecimalJsLike | number | string | null
    maxValue?: Decimal | DecimalJsLike | number | string | null
    p50Value?: Decimal | DecimalJsLike | number | string | null
    p95Value?: Decimal | DecimalJsLike | number | string | null
    normalCount?: number
    abnormalHighCount?: number
    abnormalLowCount?: number
    criticalCount?: number
    uniquePatients?: number
    createdAt?: Date | string
  }

  export type ClinicalObservationDailyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    observationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    codeSystem?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    recordCount?: IntFieldUpdateOperationsInput | number
    avgValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p50Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFieldUpdateOperationsInput | number
    abnormalHighCount?: IntFieldUpdateOperationsInput | number
    abnormalLowCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalObservationDailyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    observationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    codeSystem?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    recordCount?: IntFieldUpdateOperationsInput | number
    avgValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p50Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFieldUpdateOperationsInput | number
    abnormalHighCount?: IntFieldUpdateOperationsInput | number
    abnormalLowCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalObservationDailyCreateManyInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    observationDate: Date | string
    code: string
    codeSystem: string
    category: string
    recordCount: number
    avgValue?: Decimal | DecimalJsLike | number | string | null
    minValue?: Decimal | DecimalJsLike | number | string | null
    maxValue?: Decimal | DecimalJsLike | number | string | null
    p50Value?: Decimal | DecimalJsLike | number | string | null
    p95Value?: Decimal | DecimalJsLike | number | string | null
    normalCount?: number
    abnormalHighCount?: number
    abnormalLowCount?: number
    criticalCount?: number
    uniquePatients?: number
    createdAt?: Date | string
  }

  export type ClinicalObservationDailyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    observationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    codeSystem?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    recordCount?: IntFieldUpdateOperationsInput | number
    avgValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p50Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFieldUpdateOperationsInput | number
    abnormalHighCount?: IntFieldUpdateOperationsInput | number
    abnormalLowCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalObservationDailyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    observationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    code?: StringFieldUpdateOperationsInput | string
    codeSystem?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    recordCount?: IntFieldUpdateOperationsInput | number
    avgValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    minValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p50Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    p95Value?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    normalCount?: IntFieldUpdateOperationsInput | number
    abnormalHighCount?: IntFieldUpdateOperationsInput | number
    abnormalLowCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisDailyAggregateCreateInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    diagnosisDate: Date | string
    icdCode: string
    icdBlock?: string | null
    diagnosisName: string
    diagnosisType: string
    encounterCount: number
    uniquePatients: number
    primaryCount?: number
    chronicCount?: number
    createdAt?: Date | string
  }

  export type DiagnosisDailyAggregateUncheckedCreateInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    diagnosisDate: Date | string
    icdCode: string
    icdBlock?: string | null
    diagnosisName: string
    diagnosisType: string
    encounterCount: number
    uniquePatients: number
    primaryCount?: number
    chronicCount?: number
    createdAt?: Date | string
  }

  export type DiagnosisDailyAggregateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    icdCode?: StringFieldUpdateOperationsInput | string
    icdBlock?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisName?: StringFieldUpdateOperationsInput | string
    diagnosisType?: StringFieldUpdateOperationsInput | string
    encounterCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    primaryCount?: IntFieldUpdateOperationsInput | number
    chronicCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisDailyAggregateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    icdCode?: StringFieldUpdateOperationsInput | string
    icdBlock?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisName?: StringFieldUpdateOperationsInput | string
    diagnosisType?: StringFieldUpdateOperationsInput | string
    encounterCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    primaryCount?: IntFieldUpdateOperationsInput | number
    chronicCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisDailyAggregateCreateManyInput = {
    id?: string
    tenantId: string
    facilityId?: string | null
    departmentId?: string | null
    diagnosisDate: Date | string
    icdCode: string
    icdBlock?: string | null
    diagnosisName: string
    diagnosisType: string
    encounterCount: number
    uniquePatients: number
    primaryCount?: number
    chronicCount?: number
    createdAt?: Date | string
  }

  export type DiagnosisDailyAggregateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    icdCode?: StringFieldUpdateOperationsInput | string
    icdBlock?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisName?: StringFieldUpdateOperationsInput | string
    diagnosisType?: StringFieldUpdateOperationsInput | string
    encounterCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    primaryCount?: IntFieldUpdateOperationsInput | number
    chronicCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiagnosisDailyAggregateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: NullableStringFieldUpdateOperationsInput | string | null
    departmentId?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    icdCode?: StringFieldUpdateOperationsInput | string
    icdBlock?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisName?: StringFieldUpdateOperationsInput | string
    diagnosisType?: StringFieldUpdateOperationsInput | string
    encounterCount?: IntFieldUpdateOperationsInput | number
    uniquePatients?: IntFieldUpdateOperationsInput | number
    primaryCount?: IntFieldUpdateOperationsInput | number
    chronicCount?: IntFieldUpdateOperationsInput | number
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    metadata?: SortOrder
    occurredAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    occurredAt?: SortOrder
    receivedAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    actorId?: SortOrder
    action?: SortOrder
    resource?: SortOrder
    occurredAt?: SortOrder
    receivedAt?: SortOrder
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
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
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

  export type UsageEventCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    occurredAt?: SortOrder
  }

  export type UsageEventMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    occurredAt?: SortOrder
  }

  export type UsageEventMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    eventType?: SortOrder
    occurredAt?: SortOrder
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
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type AiQueryLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    facilityId?: SortOrder
    feature?: SortOrder
    queryText?: SortOrder
    queryPlan?: SortOrder
    compiledSql?: SortOrder
    resultCount?: SortOrder
    executionTimeMs?: SortOrder
    modelUsed?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AiQueryLogAvgOrderByAggregateInput = {
    resultCount?: SortOrder
    executionTimeMs?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
  }

  export type AiQueryLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    facilityId?: SortOrder
    feature?: SortOrder
    queryText?: SortOrder
    compiledSql?: SortOrder
    resultCount?: SortOrder
    executionTimeMs?: SortOrder
    modelUsed?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AiQueryLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    facilityId?: SortOrder
    feature?: SortOrder
    queryText?: SortOrder
    compiledSql?: SortOrder
    resultCount?: SortOrder
    executionTimeMs?: SortOrder
    modelUsed?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type AiQueryLogSumOrderByAggregateInput = {
    resultCount?: SortOrder
    executionTimeMs?: SortOrder
    inputTokens?: SortOrder
    outputTokens?: SortOrder
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
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type AiUsageMetricTenantIdFeaturePeriodTypePeriodStartCompoundUniqueInput = {
    tenantId: string
    feature: string
    periodType: string
    periodStart: Date | string
  }

  export type AiUsageMetricCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    feature?: SortOrder
    periodType?: SortOrder
    periodStart?: SortOrder
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrder
    p95ExecutionTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiUsageMetricAvgOrderByAggregateInput = {
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrder
    p95ExecutionTimeMs?: SortOrder
  }

  export type AiUsageMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    feature?: SortOrder
    periodType?: SortOrder
    periodStart?: SortOrder
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrder
    p95ExecutionTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiUsageMetricMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    feature?: SortOrder
    periodType?: SortOrder
    periodStart?: SortOrder
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrder
    p95ExecutionTimeMs?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiUsageMetricSumOrderByAggregateInput = {
    queryCount?: SortOrder
    successCount?: SortOrder
    errorCount?: SortOrder
    uniqueUsers?: SortOrder
    totalInputTokens?: SortOrder
    totalOutputTokens?: SortOrder
    avgExecutionTimeMs?: SortOrder
    p95ExecutionTimeMs?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SemanticMetricTenantIdNameCompoundUniqueInput = {
    tenantId: string
    name: string
  }

  export type SemanticMetricCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    expression?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    defaultAggregation?: SortOrder
    format?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticMetricAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SemanticMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    expression?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    defaultAggregation?: SortOrder
    format?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticMetricMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    expression?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    defaultAggregation?: SortOrder
    format?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticMetricSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SemanticDimensionTenantIdNameCompoundUniqueInput = {
    tenantId: string
    name: string
  }

  export type SemanticDimensionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    columnRef?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    allowedOperators?: SortOrder
    isLookup?: SortOrder
    lookupValues?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticDimensionAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SemanticDimensionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    columnRef?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    isLookup?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticDimensionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    displayNameAr?: SortOrder
    description?: SortOrder
    columnRef?: SortOrder
    database?: SortOrder
    baseTable?: SortOrder
    dataType?: SortOrder
    isLookup?: SortOrder
    requiredPermission?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticDimensionSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SemanticJoinPathTenantIdNameCompoundUniqueInput = {
    tenantId: string
    name: string
  }

  export type SemanticJoinPathCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    fromTable?: SortOrder
    fromDatabase?: SortOrder
    toTable?: SortOrder
    toDatabase?: SortOrder
    joinType?: SortOrder
    joinCondition?: SortOrder
    cardinality?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticJoinPathMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    fromTable?: SortOrder
    fromDatabase?: SortOrder
    toTable?: SortOrder
    toDatabase?: SortOrder
    joinType?: SortOrder
    joinCondition?: SortOrder
    cardinality?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SemanticJoinPathMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    name?: SortOrder
    fromTable?: SortOrder
    fromDatabase?: SortOrder
    toTable?: SortOrder
    toDatabase?: SortOrder
    joinType?: SortOrder
    joinCondition?: SortOrder
    cardinality?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type SavedReportCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    createdById?: SortOrder
    name?: SortOrder
    description?: SortOrder
    query?: SortOrder
    queryPlan?: SortOrder
    isPublic?: SortOrder
    isFavorite?: SortOrder
    executionCount?: SortOrder
    lastExecutedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedReportAvgOrderByAggregateInput = {
    executionCount?: SortOrder
  }

  export type SavedReportMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    createdById?: SortOrder
    name?: SortOrder
    description?: SortOrder
    query?: SortOrder
    isPublic?: SortOrder
    isFavorite?: SortOrder
    executionCount?: SortOrder
    lastExecutedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedReportMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    createdById?: SortOrder
    name?: SortOrder
    description?: SortOrder
    query?: SortOrder
    isPublic?: SortOrder
    isFavorite?: SortOrder
    executionCount?: SortOrder
    lastExecutedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SavedReportSumOrderByAggregateInput = {
    executionCount?: SortOrder
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

  export type ClinicalObservationDailyTenantIdFacilityIdDepartmentIdObservationDateCodeCompoundUniqueInput = {
    tenantId: string
    facilityId: string
    departmentId: string
    observationDate: Date | string
    code: string
  }

  export type ClinicalObservationDailyCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    observationDate?: SortOrder
    code?: SortOrder
    codeSystem?: SortOrder
    category?: SortOrder
    recordCount?: SortOrder
    avgValue?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    p50Value?: SortOrder
    p95Value?: SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
    createdAt?: SortOrder
  }

  export type ClinicalObservationDailyAvgOrderByAggregateInput = {
    recordCount?: SortOrder
    avgValue?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    p50Value?: SortOrder
    p95Value?: SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
  }

  export type ClinicalObservationDailyMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    observationDate?: SortOrder
    code?: SortOrder
    codeSystem?: SortOrder
    category?: SortOrder
    recordCount?: SortOrder
    avgValue?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    p50Value?: SortOrder
    p95Value?: SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
    createdAt?: SortOrder
  }

  export type ClinicalObservationDailyMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    observationDate?: SortOrder
    code?: SortOrder
    codeSystem?: SortOrder
    category?: SortOrder
    recordCount?: SortOrder
    avgValue?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    p50Value?: SortOrder
    p95Value?: SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
    createdAt?: SortOrder
  }

  export type ClinicalObservationDailySumOrderByAggregateInput = {
    recordCount?: SortOrder
    avgValue?: SortOrder
    minValue?: SortOrder
    maxValue?: SortOrder
    p50Value?: SortOrder
    p95Value?: SortOrder
    normalCount?: SortOrder
    abnormalHighCount?: SortOrder
    abnormalLowCount?: SortOrder
    criticalCount?: SortOrder
    uniquePatients?: SortOrder
  }

  export type DiagnosisDailyAggregateTenantIdFacilityIdDepartmentIdDiagnosisDateIcdCodeDiagnosisTypeCompoundUniqueInput = {
    tenantId: string
    facilityId: string
    departmentId: string
    diagnosisDate: Date | string
    icdCode: string
    diagnosisType: string
  }

  export type DiagnosisDailyAggregateCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    diagnosisDate?: SortOrder
    icdCode?: SortOrder
    icdBlock?: SortOrder
    diagnosisName?: SortOrder
    diagnosisType?: SortOrder
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DiagnosisDailyAggregateAvgOrderByAggregateInput = {
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
  }

  export type DiagnosisDailyAggregateMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    diagnosisDate?: SortOrder
    icdCode?: SortOrder
    icdBlock?: SortOrder
    diagnosisName?: SortOrder
    diagnosisType?: SortOrder
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DiagnosisDailyAggregateMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    facilityId?: SortOrder
    departmentId?: SortOrder
    diagnosisDate?: SortOrder
    icdCode?: SortOrder
    icdBlock?: SortOrder
    diagnosisName?: SortOrder
    diagnosisType?: SortOrder
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DiagnosisDailyAggregateSumOrderByAggregateInput = {
    encounterCount?: SortOrder
    uniquePatients?: SortOrder
    primaryCount?: SortOrder
    chronicCount?: SortOrder
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

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SemanticDimensionCreateallowedOperatorsInput = {
    set: string[]
  }

  export type SemanticDimensionCreatelookupValuesInput = {
    set: string[]
  }

  export type SemanticDimensionUpdateallowedOperatorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type SemanticDimensionUpdatelookupValuesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
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
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
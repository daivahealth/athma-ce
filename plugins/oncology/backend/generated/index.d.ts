
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
 * Model CancerDiagnosis
 * 
 */
export type CancerDiagnosis = $Result.DefaultSelection<Prisma.$CancerDiagnosisPayload>
/**
 * Model TumorStaging
 * 
 */
export type TumorStaging = $Result.DefaultSelection<Prisma.$TumorStagingPayload>
/**
 * Model ChemoProtocol
 * 
 */
export type ChemoProtocol = $Result.DefaultSelection<Prisma.$ChemoProtocolPayload>
/**
 * Model ChemoOrder
 * 
 */
export type ChemoOrder = $Result.DefaultSelection<Prisma.$ChemoOrderPayload>
/**
 * Model TumorBoardCase
 * 
 */
export type TumorBoardCase = $Result.DefaultSelection<Prisma.$TumorBoardCasePayload>
/**
 * Model OncologyCancerTypeMaster
 * 
 */
export type OncologyCancerTypeMaster = $Result.DefaultSelection<Prisma.$OncologyCancerTypeMasterPayload>
/**
 * Model OncologyPrimarySiteMaster
 * 
 */
export type OncologyPrimarySiteMaster = $Result.DefaultSelection<Prisma.$OncologyPrimarySiteMasterPayload>
/**
 * Model OncologyCancerTypeSiteMapping
 * 
 */
export type OncologyCancerTypeSiteMapping = $Result.DefaultSelection<Prisma.$OncologyCancerTypeSiteMappingPayload>
/**
 * Model OncologyHistologyMaster
 * 
 */
export type OncologyHistologyMaster = $Result.DefaultSelection<Prisma.$OncologyHistologyMasterPayload>
/**
 * Model OncologyCarePlan
 * 
 */
export type OncologyCarePlan = $Result.DefaultSelection<Prisma.$OncologyCarePlanPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CancerDiagnoses
 * const cancerDiagnoses = await prisma.cancerDiagnosis.findMany()
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
   * // Fetch zero or more CancerDiagnoses
   * const cancerDiagnoses = await prisma.cancerDiagnosis.findMany()
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
   * `prisma.cancerDiagnosis`: Exposes CRUD operations for the **CancerDiagnosis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CancerDiagnoses
    * const cancerDiagnoses = await prisma.cancerDiagnosis.findMany()
    * ```
    */
  get cancerDiagnosis(): Prisma.CancerDiagnosisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tumorStaging`: Exposes CRUD operations for the **TumorStaging** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumorStagings
    * const tumorStagings = await prisma.tumorStaging.findMany()
    * ```
    */
  get tumorStaging(): Prisma.TumorStagingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chemoProtocol`: Exposes CRUD operations for the **ChemoProtocol** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChemoProtocols
    * const chemoProtocols = await prisma.chemoProtocol.findMany()
    * ```
    */
  get chemoProtocol(): Prisma.ChemoProtocolDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chemoOrder`: Exposes CRUD operations for the **ChemoOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChemoOrders
    * const chemoOrders = await prisma.chemoOrder.findMany()
    * ```
    */
  get chemoOrder(): Prisma.ChemoOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tumorBoardCase`: Exposes CRUD operations for the **TumorBoardCase** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TumorBoardCases
    * const tumorBoardCases = await prisma.tumorBoardCase.findMany()
    * ```
    */
  get tumorBoardCase(): Prisma.TumorBoardCaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oncologyCancerTypeMaster`: Exposes CRUD operations for the **OncologyCancerTypeMaster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OncologyCancerTypeMasters
    * const oncologyCancerTypeMasters = await prisma.oncologyCancerTypeMaster.findMany()
    * ```
    */
  get oncologyCancerTypeMaster(): Prisma.OncologyCancerTypeMasterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oncologyPrimarySiteMaster`: Exposes CRUD operations for the **OncologyPrimarySiteMaster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OncologyPrimarySiteMasters
    * const oncologyPrimarySiteMasters = await prisma.oncologyPrimarySiteMaster.findMany()
    * ```
    */
  get oncologyPrimarySiteMaster(): Prisma.OncologyPrimarySiteMasterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oncologyCancerTypeSiteMapping`: Exposes CRUD operations for the **OncologyCancerTypeSiteMapping** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OncologyCancerTypeSiteMappings
    * const oncologyCancerTypeSiteMappings = await prisma.oncologyCancerTypeSiteMapping.findMany()
    * ```
    */
  get oncologyCancerTypeSiteMapping(): Prisma.OncologyCancerTypeSiteMappingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oncologyHistologyMaster`: Exposes CRUD operations for the **OncologyHistologyMaster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OncologyHistologyMasters
    * const oncologyHistologyMasters = await prisma.oncologyHistologyMaster.findMany()
    * ```
    */
  get oncologyHistologyMaster(): Prisma.OncologyHistologyMasterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oncologyCarePlan`: Exposes CRUD operations for the **OncologyCarePlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OncologyCarePlans
    * const oncologyCarePlans = await prisma.oncologyCarePlan.findMany()
    * ```
    */
  get oncologyCarePlan(): Prisma.OncologyCarePlanDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.3
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
    CancerDiagnosis: 'CancerDiagnosis',
    TumorStaging: 'TumorStaging',
    ChemoProtocol: 'ChemoProtocol',
    ChemoOrder: 'ChemoOrder',
    TumorBoardCase: 'TumorBoardCase',
    OncologyCancerTypeMaster: 'OncologyCancerTypeMaster',
    OncologyPrimarySiteMaster: 'OncologyPrimarySiteMaster',
    OncologyCancerTypeSiteMapping: 'OncologyCancerTypeSiteMapping',
    OncologyHistologyMaster: 'OncologyHistologyMaster',
    OncologyCarePlan: 'OncologyCarePlan'
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
      modelProps: "cancerDiagnosis" | "tumorStaging" | "chemoProtocol" | "chemoOrder" | "tumorBoardCase" | "oncologyCancerTypeMaster" | "oncologyPrimarySiteMaster" | "oncologyCancerTypeSiteMapping" | "oncologyHistologyMaster" | "oncologyCarePlan"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CancerDiagnosis: {
        payload: Prisma.$CancerDiagnosisPayload<ExtArgs>
        fields: Prisma.CancerDiagnosisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CancerDiagnosisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CancerDiagnosisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          findFirst: {
            args: Prisma.CancerDiagnosisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CancerDiagnosisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          findMany: {
            args: Prisma.CancerDiagnosisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>[]
          }
          create: {
            args: Prisma.CancerDiagnosisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          createMany: {
            args: Prisma.CancerDiagnosisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CancerDiagnosisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>[]
          }
          delete: {
            args: Prisma.CancerDiagnosisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          update: {
            args: Prisma.CancerDiagnosisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          deleteMany: {
            args: Prisma.CancerDiagnosisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CancerDiagnosisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CancerDiagnosisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>[]
          }
          upsert: {
            args: Prisma.CancerDiagnosisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CancerDiagnosisPayload>
          }
          aggregate: {
            args: Prisma.CancerDiagnosisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCancerDiagnosis>
          }
          groupBy: {
            args: Prisma.CancerDiagnosisGroupByArgs<ExtArgs>
            result: $Utils.Optional<CancerDiagnosisGroupByOutputType>[]
          }
          count: {
            args: Prisma.CancerDiagnosisCountArgs<ExtArgs>
            result: $Utils.Optional<CancerDiagnosisCountAggregateOutputType> | number
          }
        }
      }
      TumorStaging: {
        payload: Prisma.$TumorStagingPayload<ExtArgs>
        fields: Prisma.TumorStagingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TumorStagingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TumorStagingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          findFirst: {
            args: Prisma.TumorStagingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TumorStagingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          findMany: {
            args: Prisma.TumorStagingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>[]
          }
          create: {
            args: Prisma.TumorStagingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          createMany: {
            args: Prisma.TumorStagingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TumorStagingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>[]
          }
          delete: {
            args: Prisma.TumorStagingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          update: {
            args: Prisma.TumorStagingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          deleteMany: {
            args: Prisma.TumorStagingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TumorStagingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TumorStagingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>[]
          }
          upsert: {
            args: Prisma.TumorStagingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorStagingPayload>
          }
          aggregate: {
            args: Prisma.TumorStagingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTumorStaging>
          }
          groupBy: {
            args: Prisma.TumorStagingGroupByArgs<ExtArgs>
            result: $Utils.Optional<TumorStagingGroupByOutputType>[]
          }
          count: {
            args: Prisma.TumorStagingCountArgs<ExtArgs>
            result: $Utils.Optional<TumorStagingCountAggregateOutputType> | number
          }
        }
      }
      ChemoProtocol: {
        payload: Prisma.$ChemoProtocolPayload<ExtArgs>
        fields: Prisma.ChemoProtocolFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChemoProtocolFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChemoProtocolFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          findFirst: {
            args: Prisma.ChemoProtocolFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChemoProtocolFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          findMany: {
            args: Prisma.ChemoProtocolFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>[]
          }
          create: {
            args: Prisma.ChemoProtocolCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          createMany: {
            args: Prisma.ChemoProtocolCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChemoProtocolCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>[]
          }
          delete: {
            args: Prisma.ChemoProtocolDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          update: {
            args: Prisma.ChemoProtocolUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          deleteMany: {
            args: Prisma.ChemoProtocolDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChemoProtocolUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChemoProtocolUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>[]
          }
          upsert: {
            args: Prisma.ChemoProtocolUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoProtocolPayload>
          }
          aggregate: {
            args: Prisma.ChemoProtocolAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChemoProtocol>
          }
          groupBy: {
            args: Prisma.ChemoProtocolGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChemoProtocolGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChemoProtocolCountArgs<ExtArgs>
            result: $Utils.Optional<ChemoProtocolCountAggregateOutputType> | number
          }
        }
      }
      ChemoOrder: {
        payload: Prisma.$ChemoOrderPayload<ExtArgs>
        fields: Prisma.ChemoOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChemoOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChemoOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          findFirst: {
            args: Prisma.ChemoOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChemoOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          findMany: {
            args: Prisma.ChemoOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>[]
          }
          create: {
            args: Prisma.ChemoOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          createMany: {
            args: Prisma.ChemoOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChemoOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>[]
          }
          delete: {
            args: Prisma.ChemoOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          update: {
            args: Prisma.ChemoOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          deleteMany: {
            args: Prisma.ChemoOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChemoOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChemoOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>[]
          }
          upsert: {
            args: Prisma.ChemoOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChemoOrderPayload>
          }
          aggregate: {
            args: Prisma.ChemoOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChemoOrder>
          }
          groupBy: {
            args: Prisma.ChemoOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChemoOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChemoOrderCountArgs<ExtArgs>
            result: $Utils.Optional<ChemoOrderCountAggregateOutputType> | number
          }
        }
      }
      TumorBoardCase: {
        payload: Prisma.$TumorBoardCasePayload<ExtArgs>
        fields: Prisma.TumorBoardCaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TumorBoardCaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TumorBoardCaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          findFirst: {
            args: Prisma.TumorBoardCaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TumorBoardCaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          findMany: {
            args: Prisma.TumorBoardCaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>[]
          }
          create: {
            args: Prisma.TumorBoardCaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          createMany: {
            args: Prisma.TumorBoardCaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TumorBoardCaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>[]
          }
          delete: {
            args: Prisma.TumorBoardCaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          update: {
            args: Prisma.TumorBoardCaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          deleteMany: {
            args: Prisma.TumorBoardCaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TumorBoardCaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TumorBoardCaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>[]
          }
          upsert: {
            args: Prisma.TumorBoardCaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TumorBoardCasePayload>
          }
          aggregate: {
            args: Prisma.TumorBoardCaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTumorBoardCase>
          }
          groupBy: {
            args: Prisma.TumorBoardCaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<TumorBoardCaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.TumorBoardCaseCountArgs<ExtArgs>
            result: $Utils.Optional<TumorBoardCaseCountAggregateOutputType> | number
          }
        }
      }
      OncologyCancerTypeMaster: {
        payload: Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>
        fields: Prisma.OncologyCancerTypeMasterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OncologyCancerTypeMasterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OncologyCancerTypeMasterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          findFirst: {
            args: Prisma.OncologyCancerTypeMasterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OncologyCancerTypeMasterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          findMany: {
            args: Prisma.OncologyCancerTypeMasterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>[]
          }
          create: {
            args: Prisma.OncologyCancerTypeMasterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          createMany: {
            args: Prisma.OncologyCancerTypeMasterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OncologyCancerTypeMasterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>[]
          }
          delete: {
            args: Prisma.OncologyCancerTypeMasterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          update: {
            args: Prisma.OncologyCancerTypeMasterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          deleteMany: {
            args: Prisma.OncologyCancerTypeMasterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OncologyCancerTypeMasterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OncologyCancerTypeMasterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>[]
          }
          upsert: {
            args: Prisma.OncologyCancerTypeMasterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeMasterPayload>
          }
          aggregate: {
            args: Prisma.OncologyCancerTypeMasterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOncologyCancerTypeMaster>
          }
          groupBy: {
            args: Prisma.OncologyCancerTypeMasterGroupByArgs<ExtArgs>
            result: $Utils.Optional<OncologyCancerTypeMasterGroupByOutputType>[]
          }
          count: {
            args: Prisma.OncologyCancerTypeMasterCountArgs<ExtArgs>
            result: $Utils.Optional<OncologyCancerTypeMasterCountAggregateOutputType> | number
          }
        }
      }
      OncologyPrimarySiteMaster: {
        payload: Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>
        fields: Prisma.OncologyPrimarySiteMasterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OncologyPrimarySiteMasterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OncologyPrimarySiteMasterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          findFirst: {
            args: Prisma.OncologyPrimarySiteMasterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OncologyPrimarySiteMasterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          findMany: {
            args: Prisma.OncologyPrimarySiteMasterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>[]
          }
          create: {
            args: Prisma.OncologyPrimarySiteMasterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          createMany: {
            args: Prisma.OncologyPrimarySiteMasterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OncologyPrimarySiteMasterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>[]
          }
          delete: {
            args: Prisma.OncologyPrimarySiteMasterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          update: {
            args: Prisma.OncologyPrimarySiteMasterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          deleteMany: {
            args: Prisma.OncologyPrimarySiteMasterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OncologyPrimarySiteMasterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OncologyPrimarySiteMasterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>[]
          }
          upsert: {
            args: Prisma.OncologyPrimarySiteMasterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyPrimarySiteMasterPayload>
          }
          aggregate: {
            args: Prisma.OncologyPrimarySiteMasterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOncologyPrimarySiteMaster>
          }
          groupBy: {
            args: Prisma.OncologyPrimarySiteMasterGroupByArgs<ExtArgs>
            result: $Utils.Optional<OncologyPrimarySiteMasterGroupByOutputType>[]
          }
          count: {
            args: Prisma.OncologyPrimarySiteMasterCountArgs<ExtArgs>
            result: $Utils.Optional<OncologyPrimarySiteMasterCountAggregateOutputType> | number
          }
        }
      }
      OncologyCancerTypeSiteMapping: {
        payload: Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>
        fields: Prisma.OncologyCancerTypeSiteMappingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OncologyCancerTypeSiteMappingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OncologyCancerTypeSiteMappingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          findFirst: {
            args: Prisma.OncologyCancerTypeSiteMappingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OncologyCancerTypeSiteMappingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          findMany: {
            args: Prisma.OncologyCancerTypeSiteMappingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>[]
          }
          create: {
            args: Prisma.OncologyCancerTypeSiteMappingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          createMany: {
            args: Prisma.OncologyCancerTypeSiteMappingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OncologyCancerTypeSiteMappingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>[]
          }
          delete: {
            args: Prisma.OncologyCancerTypeSiteMappingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          update: {
            args: Prisma.OncologyCancerTypeSiteMappingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          deleteMany: {
            args: Prisma.OncologyCancerTypeSiteMappingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OncologyCancerTypeSiteMappingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OncologyCancerTypeSiteMappingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>[]
          }
          upsert: {
            args: Prisma.OncologyCancerTypeSiteMappingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCancerTypeSiteMappingPayload>
          }
          aggregate: {
            args: Prisma.OncologyCancerTypeSiteMappingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOncologyCancerTypeSiteMapping>
          }
          groupBy: {
            args: Prisma.OncologyCancerTypeSiteMappingGroupByArgs<ExtArgs>
            result: $Utils.Optional<OncologyCancerTypeSiteMappingGroupByOutputType>[]
          }
          count: {
            args: Prisma.OncologyCancerTypeSiteMappingCountArgs<ExtArgs>
            result: $Utils.Optional<OncologyCancerTypeSiteMappingCountAggregateOutputType> | number
          }
        }
      }
      OncologyHistologyMaster: {
        payload: Prisma.$OncologyHistologyMasterPayload<ExtArgs>
        fields: Prisma.OncologyHistologyMasterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OncologyHistologyMasterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OncologyHistologyMasterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          findFirst: {
            args: Prisma.OncologyHistologyMasterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OncologyHistologyMasterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          findMany: {
            args: Prisma.OncologyHistologyMasterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>[]
          }
          create: {
            args: Prisma.OncologyHistologyMasterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          createMany: {
            args: Prisma.OncologyHistologyMasterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OncologyHistologyMasterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>[]
          }
          delete: {
            args: Prisma.OncologyHistologyMasterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          update: {
            args: Prisma.OncologyHistologyMasterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          deleteMany: {
            args: Prisma.OncologyHistologyMasterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OncologyHistologyMasterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OncologyHistologyMasterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>[]
          }
          upsert: {
            args: Prisma.OncologyHistologyMasterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyHistologyMasterPayload>
          }
          aggregate: {
            args: Prisma.OncologyHistologyMasterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOncologyHistologyMaster>
          }
          groupBy: {
            args: Prisma.OncologyHistologyMasterGroupByArgs<ExtArgs>
            result: $Utils.Optional<OncologyHistologyMasterGroupByOutputType>[]
          }
          count: {
            args: Prisma.OncologyHistologyMasterCountArgs<ExtArgs>
            result: $Utils.Optional<OncologyHistologyMasterCountAggregateOutputType> | number
          }
        }
      }
      OncologyCarePlan: {
        payload: Prisma.$OncologyCarePlanPayload<ExtArgs>
        fields: Prisma.OncologyCarePlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OncologyCarePlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OncologyCarePlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          findFirst: {
            args: Prisma.OncologyCarePlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OncologyCarePlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          findMany: {
            args: Prisma.OncologyCarePlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>[]
          }
          create: {
            args: Prisma.OncologyCarePlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          createMany: {
            args: Prisma.OncologyCarePlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OncologyCarePlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>[]
          }
          delete: {
            args: Prisma.OncologyCarePlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          update: {
            args: Prisma.OncologyCarePlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          deleteMany: {
            args: Prisma.OncologyCarePlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OncologyCarePlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OncologyCarePlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>[]
          }
          upsert: {
            args: Prisma.OncologyCarePlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OncologyCarePlanPayload>
          }
          aggregate: {
            args: Prisma.OncologyCarePlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOncologyCarePlan>
          }
          groupBy: {
            args: Prisma.OncologyCarePlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<OncologyCarePlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.OncologyCarePlanCountArgs<ExtArgs>
            result: $Utils.Optional<OncologyCarePlanCountAggregateOutputType> | number
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
    cancerDiagnosis?: CancerDiagnosisOmit
    tumorStaging?: TumorStagingOmit
    chemoProtocol?: ChemoProtocolOmit
    chemoOrder?: ChemoOrderOmit
    tumorBoardCase?: TumorBoardCaseOmit
    oncologyCancerTypeMaster?: OncologyCancerTypeMasterOmit
    oncologyPrimarySiteMaster?: OncologyPrimarySiteMasterOmit
    oncologyCancerTypeSiteMapping?: OncologyCancerTypeSiteMappingOmit
    oncologyHistologyMaster?: OncologyHistologyMasterOmit
    oncologyCarePlan?: OncologyCarePlanOmit
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
   * Count Type CancerDiagnosisCountOutputType
   */

  export type CancerDiagnosisCountOutputType = {
    stagings: number
    tumorBoardCases: number
    carePlans: number
  }

  export type CancerDiagnosisCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stagings?: boolean | CancerDiagnosisCountOutputTypeCountStagingsArgs
    tumorBoardCases?: boolean | CancerDiagnosisCountOutputTypeCountTumorBoardCasesArgs
    carePlans?: boolean | CancerDiagnosisCountOutputTypeCountCarePlansArgs
  }

  // Custom InputTypes
  /**
   * CancerDiagnosisCountOutputType without action
   */
  export type CancerDiagnosisCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosisCountOutputType
     */
    select?: CancerDiagnosisCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CancerDiagnosisCountOutputType without action
   */
  export type CancerDiagnosisCountOutputTypeCountStagingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumorStagingWhereInput
  }

  /**
   * CancerDiagnosisCountOutputType without action
   */
  export type CancerDiagnosisCountOutputTypeCountTumorBoardCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumorBoardCaseWhereInput
  }

  /**
   * CancerDiagnosisCountOutputType without action
   */
  export type CancerDiagnosisCountOutputTypeCountCarePlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCarePlanWhereInput
  }


  /**
   * Count Type ChemoProtocolCountOutputType
   */

  export type ChemoProtocolCountOutputType = {
    orders: number
  }

  export type ChemoProtocolCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | ChemoProtocolCountOutputTypeCountOrdersArgs
  }

  // Custom InputTypes
  /**
   * ChemoProtocolCountOutputType without action
   */
  export type ChemoProtocolCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocolCountOutputType
     */
    select?: ChemoProtocolCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChemoProtocolCountOutputType without action
   */
  export type ChemoProtocolCountOutputTypeCountOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChemoOrderWhereInput
  }


  /**
   * Count Type OncologyCancerTypeMasterCountOutputType
   */

  export type OncologyCancerTypeMasterCountOutputType = {
    siteMappings: number
  }

  export type OncologyCancerTypeMasterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteMappings?: boolean | OncologyCancerTypeMasterCountOutputTypeCountSiteMappingsArgs
  }

  // Custom InputTypes
  /**
   * OncologyCancerTypeMasterCountOutputType without action
   */
  export type OncologyCancerTypeMasterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMasterCountOutputType
     */
    select?: OncologyCancerTypeMasterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OncologyCancerTypeMasterCountOutputType without action
   */
  export type OncologyCancerTypeMasterCountOutputTypeCountSiteMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCancerTypeSiteMappingWhereInput
  }


  /**
   * Count Type OncologyPrimarySiteMasterCountOutputType
   */

  export type OncologyPrimarySiteMasterCountOutputType = {
    siteMappings: number
  }

  export type OncologyPrimarySiteMasterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteMappings?: boolean | OncologyPrimarySiteMasterCountOutputTypeCountSiteMappingsArgs
  }

  // Custom InputTypes
  /**
   * OncologyPrimarySiteMasterCountOutputType without action
   */
  export type OncologyPrimarySiteMasterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMasterCountOutputType
     */
    select?: OncologyPrimarySiteMasterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OncologyPrimarySiteMasterCountOutputType without action
   */
  export type OncologyPrimarySiteMasterCountOutputTypeCountSiteMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCancerTypeSiteMappingWhereInput
  }


  /**
   * Models
   */

  /**
   * Model CancerDiagnosis
   */

  export type AggregateCancerDiagnosis = {
    _count: CancerDiagnosisCountAggregateOutputType | null
    _avg: CancerDiagnosisAvgAggregateOutputType | null
    _sum: CancerDiagnosisSumAggregateOutputType | null
    _min: CancerDiagnosisMinAggregateOutputType | null
    _max: CancerDiagnosisMaxAggregateOutputType | null
  }

  export type CancerDiagnosisAvgAggregateOutputType = {
    ecogAtDiagnosis: number | null
  }

  export type CancerDiagnosisSumAggregateOutputType = {
    ecogAtDiagnosis: number | null
  }

  export type CancerDiagnosisMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    encounterDiagnosisId: string | null
    cancerType: string | null
    primarySite: string | null
    primarySiteCode: string | null
    laterality: string | null
    histologyMorphology: string | null
    morphologyCode: string | null
    icdCode: string | null
    snomedCode: string | null
    diagnosisDate: Date | null
    clinicalStatus: string | null
    verificationStatus: string | null
    grade: string | null
    metastaticStatus: string | null
    isRecurrence: boolean | null
    ecogAtDiagnosis: number | null
    diagnosedBy: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CancerDiagnosisMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    encounterDiagnosisId: string | null
    cancerType: string | null
    primarySite: string | null
    primarySiteCode: string | null
    laterality: string | null
    histologyMorphology: string | null
    morphologyCode: string | null
    icdCode: string | null
    snomedCode: string | null
    diagnosisDate: Date | null
    clinicalStatus: string | null
    verificationStatus: string | null
    grade: string | null
    metastaticStatus: string | null
    isRecurrence: boolean | null
    ecogAtDiagnosis: number | null
    diagnosedBy: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CancerDiagnosisCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    encounterId: number
    encounterDiagnosisId: number
    cancerType: number
    primarySite: number
    primarySiteCode: number
    laterality: number
    histologyMorphology: number
    morphologyCode: number
    icdCode: number
    snomedCode: number
    diagnosisDate: number
    clinicalStatus: number
    verificationStatus: number
    grade: number
    metastaticStatus: number
    isRecurrence: number
    biomarkers: number
    ecogAtDiagnosis: number
    diagnosedBy: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CancerDiagnosisAvgAggregateInputType = {
    ecogAtDiagnosis?: true
  }

  export type CancerDiagnosisSumAggregateInputType = {
    ecogAtDiagnosis?: true
  }

  export type CancerDiagnosisMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    encounterDiagnosisId?: true
    cancerType?: true
    primarySite?: true
    primarySiteCode?: true
    laterality?: true
    histologyMorphology?: true
    morphologyCode?: true
    icdCode?: true
    snomedCode?: true
    diagnosisDate?: true
    clinicalStatus?: true
    verificationStatus?: true
    grade?: true
    metastaticStatus?: true
    isRecurrence?: true
    ecogAtDiagnosis?: true
    diagnosedBy?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CancerDiagnosisMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    encounterDiagnosisId?: true
    cancerType?: true
    primarySite?: true
    primarySiteCode?: true
    laterality?: true
    histologyMorphology?: true
    morphologyCode?: true
    icdCode?: true
    snomedCode?: true
    diagnosisDate?: true
    clinicalStatus?: true
    verificationStatus?: true
    grade?: true
    metastaticStatus?: true
    isRecurrence?: true
    ecogAtDiagnosis?: true
    diagnosedBy?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CancerDiagnosisCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    encounterDiagnosisId?: true
    cancerType?: true
    primarySite?: true
    primarySiteCode?: true
    laterality?: true
    histologyMorphology?: true
    morphologyCode?: true
    icdCode?: true
    snomedCode?: true
    diagnosisDate?: true
    clinicalStatus?: true
    verificationStatus?: true
    grade?: true
    metastaticStatus?: true
    isRecurrence?: true
    biomarkers?: true
    ecogAtDiagnosis?: true
    diagnosedBy?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CancerDiagnosisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CancerDiagnosis to aggregate.
     */
    where?: CancerDiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancerDiagnoses to fetch.
     */
    orderBy?: CancerDiagnosisOrderByWithRelationInput | CancerDiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CancerDiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancerDiagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancerDiagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CancerDiagnoses
    **/
    _count?: true | CancerDiagnosisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CancerDiagnosisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CancerDiagnosisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CancerDiagnosisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CancerDiagnosisMaxAggregateInputType
  }

  export type GetCancerDiagnosisAggregateType<T extends CancerDiagnosisAggregateArgs> = {
        [P in keyof T & keyof AggregateCancerDiagnosis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCancerDiagnosis[P]>
      : GetScalarType<T[P], AggregateCancerDiagnosis[P]>
  }




  export type CancerDiagnosisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CancerDiagnosisWhereInput
    orderBy?: CancerDiagnosisOrderByWithAggregationInput | CancerDiagnosisOrderByWithAggregationInput[]
    by: CancerDiagnosisScalarFieldEnum[] | CancerDiagnosisScalarFieldEnum
    having?: CancerDiagnosisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CancerDiagnosisCountAggregateInputType | true
    _avg?: CancerDiagnosisAvgAggregateInputType
    _sum?: CancerDiagnosisSumAggregateInputType
    _min?: CancerDiagnosisMinAggregateInputType
    _max?: CancerDiagnosisMaxAggregateInputType
  }

  export type CancerDiagnosisGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    encounterId: string | null
    encounterDiagnosisId: string | null
    cancerType: string
    primarySite: string
    primarySiteCode: string | null
    laterality: string | null
    histologyMorphology: string | null
    morphologyCode: string | null
    icdCode: string | null
    snomedCode: string | null
    diagnosisDate: Date
    clinicalStatus: string
    verificationStatus: string
    grade: string | null
    metastaticStatus: string
    isRecurrence: boolean
    biomarkers: JsonValue
    ecogAtDiagnosis: number | null
    diagnosedBy: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: CancerDiagnosisCountAggregateOutputType | null
    _avg: CancerDiagnosisAvgAggregateOutputType | null
    _sum: CancerDiagnosisSumAggregateOutputType | null
    _min: CancerDiagnosisMinAggregateOutputType | null
    _max: CancerDiagnosisMaxAggregateOutputType | null
  }

  type GetCancerDiagnosisGroupByPayload<T extends CancerDiagnosisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CancerDiagnosisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CancerDiagnosisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CancerDiagnosisGroupByOutputType[P]>
            : GetScalarType<T[P], CancerDiagnosisGroupByOutputType[P]>
        }
      >
    >


  export type CancerDiagnosisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    encounterDiagnosisId?: boolean
    cancerType?: boolean
    primarySite?: boolean
    primarySiteCode?: boolean
    laterality?: boolean
    histologyMorphology?: boolean
    morphologyCode?: boolean
    icdCode?: boolean
    snomedCode?: boolean
    diagnosisDate?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    grade?: boolean
    metastaticStatus?: boolean
    isRecurrence?: boolean
    biomarkers?: boolean
    ecogAtDiagnosis?: boolean
    diagnosedBy?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    stagings?: boolean | CancerDiagnosis$stagingsArgs<ExtArgs>
    tumorBoardCases?: boolean | CancerDiagnosis$tumorBoardCasesArgs<ExtArgs>
    carePlans?: boolean | CancerDiagnosis$carePlansArgs<ExtArgs>
    _count?: boolean | CancerDiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cancerDiagnosis"]>

  export type CancerDiagnosisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    encounterDiagnosisId?: boolean
    cancerType?: boolean
    primarySite?: boolean
    primarySiteCode?: boolean
    laterality?: boolean
    histologyMorphology?: boolean
    morphologyCode?: boolean
    icdCode?: boolean
    snomedCode?: boolean
    diagnosisDate?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    grade?: boolean
    metastaticStatus?: boolean
    isRecurrence?: boolean
    biomarkers?: boolean
    ecogAtDiagnosis?: boolean
    diagnosedBy?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cancerDiagnosis"]>

  export type CancerDiagnosisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    encounterDiagnosisId?: boolean
    cancerType?: boolean
    primarySite?: boolean
    primarySiteCode?: boolean
    laterality?: boolean
    histologyMorphology?: boolean
    morphologyCode?: boolean
    icdCode?: boolean
    snomedCode?: boolean
    diagnosisDate?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    grade?: boolean
    metastaticStatus?: boolean
    isRecurrence?: boolean
    biomarkers?: boolean
    ecogAtDiagnosis?: boolean
    diagnosedBy?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cancerDiagnosis"]>

  export type CancerDiagnosisSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    encounterDiagnosisId?: boolean
    cancerType?: boolean
    primarySite?: boolean
    primarySiteCode?: boolean
    laterality?: boolean
    histologyMorphology?: boolean
    morphologyCode?: boolean
    icdCode?: boolean
    snomedCode?: boolean
    diagnosisDate?: boolean
    clinicalStatus?: boolean
    verificationStatus?: boolean
    grade?: boolean
    metastaticStatus?: boolean
    isRecurrence?: boolean
    biomarkers?: boolean
    ecogAtDiagnosis?: boolean
    diagnosedBy?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CancerDiagnosisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "patientId" | "encounterId" | "encounterDiagnosisId" | "cancerType" | "primarySite" | "primarySiteCode" | "laterality" | "histologyMorphology" | "morphologyCode" | "icdCode" | "snomedCode" | "diagnosisDate" | "clinicalStatus" | "verificationStatus" | "grade" | "metastaticStatus" | "isRecurrence" | "biomarkers" | "ecogAtDiagnosis" | "diagnosedBy" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["cancerDiagnosis"]>
  export type CancerDiagnosisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stagings?: boolean | CancerDiagnosis$stagingsArgs<ExtArgs>
    tumorBoardCases?: boolean | CancerDiagnosis$tumorBoardCasesArgs<ExtArgs>
    carePlans?: boolean | CancerDiagnosis$carePlansArgs<ExtArgs>
    _count?: boolean | CancerDiagnosisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CancerDiagnosisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CancerDiagnosisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CancerDiagnosisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CancerDiagnosis"
    objects: {
      stagings: Prisma.$TumorStagingPayload<ExtArgs>[]
      tumorBoardCases: Prisma.$TumorBoardCasePayload<ExtArgs>[]
      carePlans: Prisma.$OncologyCarePlanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      encounterId: string | null
      encounterDiagnosisId: string | null
      cancerType: string
      primarySite: string
      primarySiteCode: string | null
      laterality: string | null
      histologyMorphology: string | null
      morphologyCode: string | null
      icdCode: string | null
      snomedCode: string | null
      diagnosisDate: Date
      clinicalStatus: string
      verificationStatus: string
      grade: string | null
      metastaticStatus: string
      isRecurrence: boolean
      biomarkers: Prisma.JsonValue
      ecogAtDiagnosis: number | null
      diagnosedBy: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cancerDiagnosis"]>
    composites: {}
  }

  type CancerDiagnosisGetPayload<S extends boolean | null | undefined | CancerDiagnosisDefaultArgs> = $Result.GetResult<Prisma.$CancerDiagnosisPayload, S>

  type CancerDiagnosisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CancerDiagnosisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CancerDiagnosisCountAggregateInputType | true
    }

  export interface CancerDiagnosisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CancerDiagnosis'], meta: { name: 'CancerDiagnosis' } }
    /**
     * Find zero or one CancerDiagnosis that matches the filter.
     * @param {CancerDiagnosisFindUniqueArgs} args - Arguments to find a CancerDiagnosis
     * @example
     * // Get one CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CancerDiagnosisFindUniqueArgs>(args: SelectSubset<T, CancerDiagnosisFindUniqueArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CancerDiagnosis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CancerDiagnosisFindUniqueOrThrowArgs} args - Arguments to find a CancerDiagnosis
     * @example
     * // Get one CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CancerDiagnosisFindUniqueOrThrowArgs>(args: SelectSubset<T, CancerDiagnosisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CancerDiagnosis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisFindFirstArgs} args - Arguments to find a CancerDiagnosis
     * @example
     * // Get one CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CancerDiagnosisFindFirstArgs>(args?: SelectSubset<T, CancerDiagnosisFindFirstArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CancerDiagnosis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisFindFirstOrThrowArgs} args - Arguments to find a CancerDiagnosis
     * @example
     * // Get one CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CancerDiagnosisFindFirstOrThrowArgs>(args?: SelectSubset<T, CancerDiagnosisFindFirstOrThrowArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CancerDiagnoses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CancerDiagnoses
     * const cancerDiagnoses = await prisma.cancerDiagnosis.findMany()
     * 
     * // Get first 10 CancerDiagnoses
     * const cancerDiagnoses = await prisma.cancerDiagnosis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cancerDiagnosisWithIdOnly = await prisma.cancerDiagnosis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CancerDiagnosisFindManyArgs>(args?: SelectSubset<T, CancerDiagnosisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CancerDiagnosis.
     * @param {CancerDiagnosisCreateArgs} args - Arguments to create a CancerDiagnosis.
     * @example
     * // Create one CancerDiagnosis
     * const CancerDiagnosis = await prisma.cancerDiagnosis.create({
     *   data: {
     *     // ... data to create a CancerDiagnosis
     *   }
     * })
     * 
     */
    create<T extends CancerDiagnosisCreateArgs>(args: SelectSubset<T, CancerDiagnosisCreateArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CancerDiagnoses.
     * @param {CancerDiagnosisCreateManyArgs} args - Arguments to create many CancerDiagnoses.
     * @example
     * // Create many CancerDiagnoses
     * const cancerDiagnosis = await prisma.cancerDiagnosis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CancerDiagnosisCreateManyArgs>(args?: SelectSubset<T, CancerDiagnosisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CancerDiagnoses and returns the data saved in the database.
     * @param {CancerDiagnosisCreateManyAndReturnArgs} args - Arguments to create many CancerDiagnoses.
     * @example
     * // Create many CancerDiagnoses
     * const cancerDiagnosis = await prisma.cancerDiagnosis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CancerDiagnoses and only return the `id`
     * const cancerDiagnosisWithIdOnly = await prisma.cancerDiagnosis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CancerDiagnosisCreateManyAndReturnArgs>(args?: SelectSubset<T, CancerDiagnosisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CancerDiagnosis.
     * @param {CancerDiagnosisDeleteArgs} args - Arguments to delete one CancerDiagnosis.
     * @example
     * // Delete one CancerDiagnosis
     * const CancerDiagnosis = await prisma.cancerDiagnosis.delete({
     *   where: {
     *     // ... filter to delete one CancerDiagnosis
     *   }
     * })
     * 
     */
    delete<T extends CancerDiagnosisDeleteArgs>(args: SelectSubset<T, CancerDiagnosisDeleteArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CancerDiagnosis.
     * @param {CancerDiagnosisUpdateArgs} args - Arguments to update one CancerDiagnosis.
     * @example
     * // Update one CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CancerDiagnosisUpdateArgs>(args: SelectSubset<T, CancerDiagnosisUpdateArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CancerDiagnoses.
     * @param {CancerDiagnosisDeleteManyArgs} args - Arguments to filter CancerDiagnoses to delete.
     * @example
     * // Delete a few CancerDiagnoses
     * const { count } = await prisma.cancerDiagnosis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CancerDiagnosisDeleteManyArgs>(args?: SelectSubset<T, CancerDiagnosisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CancerDiagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CancerDiagnoses
     * const cancerDiagnosis = await prisma.cancerDiagnosis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CancerDiagnosisUpdateManyArgs>(args: SelectSubset<T, CancerDiagnosisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CancerDiagnoses and returns the data updated in the database.
     * @param {CancerDiagnosisUpdateManyAndReturnArgs} args - Arguments to update many CancerDiagnoses.
     * @example
     * // Update many CancerDiagnoses
     * const cancerDiagnosis = await prisma.cancerDiagnosis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CancerDiagnoses and only return the `id`
     * const cancerDiagnosisWithIdOnly = await prisma.cancerDiagnosis.updateManyAndReturn({
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
    updateManyAndReturn<T extends CancerDiagnosisUpdateManyAndReturnArgs>(args: SelectSubset<T, CancerDiagnosisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CancerDiagnosis.
     * @param {CancerDiagnosisUpsertArgs} args - Arguments to update or create a CancerDiagnosis.
     * @example
     * // Update or create a CancerDiagnosis
     * const cancerDiagnosis = await prisma.cancerDiagnosis.upsert({
     *   create: {
     *     // ... data to create a CancerDiagnosis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CancerDiagnosis we want to update
     *   }
     * })
     */
    upsert<T extends CancerDiagnosisUpsertArgs>(args: SelectSubset<T, CancerDiagnosisUpsertArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CancerDiagnoses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisCountArgs} args - Arguments to filter CancerDiagnoses to count.
     * @example
     * // Count the number of CancerDiagnoses
     * const count = await prisma.cancerDiagnosis.count({
     *   where: {
     *     // ... the filter for the CancerDiagnoses we want to count
     *   }
     * })
    **/
    count<T extends CancerDiagnosisCountArgs>(
      args?: Subset<T, CancerDiagnosisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CancerDiagnosisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CancerDiagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CancerDiagnosisAggregateArgs>(args: Subset<T, CancerDiagnosisAggregateArgs>): Prisma.PrismaPromise<GetCancerDiagnosisAggregateType<T>>

    /**
     * Group by CancerDiagnosis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CancerDiagnosisGroupByArgs} args - Group by arguments.
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
      T extends CancerDiagnosisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CancerDiagnosisGroupByArgs['orderBy'] }
        : { orderBy?: CancerDiagnosisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CancerDiagnosisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCancerDiagnosisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CancerDiagnosis model
   */
  readonly fields: CancerDiagnosisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CancerDiagnosis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CancerDiagnosisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    stagings<T extends CancerDiagnosis$stagingsArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosis$stagingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tumorBoardCases<T extends CancerDiagnosis$tumorBoardCasesArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosis$tumorBoardCasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    carePlans<T extends CancerDiagnosis$carePlansArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosis$carePlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CancerDiagnosis model
   */
  interface CancerDiagnosisFieldRefs {
    readonly id: FieldRef<"CancerDiagnosis", 'String'>
    readonly tenantId: FieldRef<"CancerDiagnosis", 'String'>
    readonly patientId: FieldRef<"CancerDiagnosis", 'String'>
    readonly encounterId: FieldRef<"CancerDiagnosis", 'String'>
    readonly encounterDiagnosisId: FieldRef<"CancerDiagnosis", 'String'>
    readonly cancerType: FieldRef<"CancerDiagnosis", 'String'>
    readonly primarySite: FieldRef<"CancerDiagnosis", 'String'>
    readonly primarySiteCode: FieldRef<"CancerDiagnosis", 'String'>
    readonly laterality: FieldRef<"CancerDiagnosis", 'String'>
    readonly histologyMorphology: FieldRef<"CancerDiagnosis", 'String'>
    readonly morphologyCode: FieldRef<"CancerDiagnosis", 'String'>
    readonly icdCode: FieldRef<"CancerDiagnosis", 'String'>
    readonly snomedCode: FieldRef<"CancerDiagnosis", 'String'>
    readonly diagnosisDate: FieldRef<"CancerDiagnosis", 'DateTime'>
    readonly clinicalStatus: FieldRef<"CancerDiagnosis", 'String'>
    readonly verificationStatus: FieldRef<"CancerDiagnosis", 'String'>
    readonly grade: FieldRef<"CancerDiagnosis", 'String'>
    readonly metastaticStatus: FieldRef<"CancerDiagnosis", 'String'>
    readonly isRecurrence: FieldRef<"CancerDiagnosis", 'Boolean'>
    readonly biomarkers: FieldRef<"CancerDiagnosis", 'Json'>
    readonly ecogAtDiagnosis: FieldRef<"CancerDiagnosis", 'Int'>
    readonly diagnosedBy: FieldRef<"CancerDiagnosis", 'String'>
    readonly notes: FieldRef<"CancerDiagnosis", 'String'>
    readonly createdAt: FieldRef<"CancerDiagnosis", 'DateTime'>
    readonly updatedAt: FieldRef<"CancerDiagnosis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CancerDiagnosis findUnique
   */
  export type CancerDiagnosisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which CancerDiagnosis to fetch.
     */
    where: CancerDiagnosisWhereUniqueInput
  }

  /**
   * CancerDiagnosis findUniqueOrThrow
   */
  export type CancerDiagnosisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which CancerDiagnosis to fetch.
     */
    where: CancerDiagnosisWhereUniqueInput
  }

  /**
   * CancerDiagnosis findFirst
   */
  export type CancerDiagnosisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which CancerDiagnosis to fetch.
     */
    where?: CancerDiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancerDiagnoses to fetch.
     */
    orderBy?: CancerDiagnosisOrderByWithRelationInput | CancerDiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CancerDiagnoses.
     */
    cursor?: CancerDiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancerDiagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancerDiagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CancerDiagnoses.
     */
    distinct?: CancerDiagnosisScalarFieldEnum | CancerDiagnosisScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis findFirstOrThrow
   */
  export type CancerDiagnosisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which CancerDiagnosis to fetch.
     */
    where?: CancerDiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancerDiagnoses to fetch.
     */
    orderBy?: CancerDiagnosisOrderByWithRelationInput | CancerDiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CancerDiagnoses.
     */
    cursor?: CancerDiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancerDiagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancerDiagnoses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CancerDiagnoses.
     */
    distinct?: CancerDiagnosisScalarFieldEnum | CancerDiagnosisScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis findMany
   */
  export type CancerDiagnosisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter, which CancerDiagnoses to fetch.
     */
    where?: CancerDiagnosisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CancerDiagnoses to fetch.
     */
    orderBy?: CancerDiagnosisOrderByWithRelationInput | CancerDiagnosisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CancerDiagnoses.
     */
    cursor?: CancerDiagnosisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CancerDiagnoses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CancerDiagnoses.
     */
    skip?: number
    distinct?: CancerDiagnosisScalarFieldEnum | CancerDiagnosisScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis create
   */
  export type CancerDiagnosisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to create a CancerDiagnosis.
     */
    data: XOR<CancerDiagnosisCreateInput, CancerDiagnosisUncheckedCreateInput>
  }

  /**
   * CancerDiagnosis createMany
   */
  export type CancerDiagnosisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CancerDiagnoses.
     */
    data: CancerDiagnosisCreateManyInput | CancerDiagnosisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CancerDiagnosis createManyAndReturn
   */
  export type CancerDiagnosisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * The data used to create many CancerDiagnoses.
     */
    data: CancerDiagnosisCreateManyInput | CancerDiagnosisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CancerDiagnosis update
   */
  export type CancerDiagnosisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * The data needed to update a CancerDiagnosis.
     */
    data: XOR<CancerDiagnosisUpdateInput, CancerDiagnosisUncheckedUpdateInput>
    /**
     * Choose, which CancerDiagnosis to update.
     */
    where: CancerDiagnosisWhereUniqueInput
  }

  /**
   * CancerDiagnosis updateMany
   */
  export type CancerDiagnosisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CancerDiagnoses.
     */
    data: XOR<CancerDiagnosisUpdateManyMutationInput, CancerDiagnosisUncheckedUpdateManyInput>
    /**
     * Filter which CancerDiagnoses to update
     */
    where?: CancerDiagnosisWhereInput
    /**
     * Limit how many CancerDiagnoses to update.
     */
    limit?: number
  }

  /**
   * CancerDiagnosis updateManyAndReturn
   */
  export type CancerDiagnosisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * The data used to update CancerDiagnoses.
     */
    data: XOR<CancerDiagnosisUpdateManyMutationInput, CancerDiagnosisUncheckedUpdateManyInput>
    /**
     * Filter which CancerDiagnoses to update
     */
    where?: CancerDiagnosisWhereInput
    /**
     * Limit how many CancerDiagnoses to update.
     */
    limit?: number
  }

  /**
   * CancerDiagnosis upsert
   */
  export type CancerDiagnosisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * The filter to search for the CancerDiagnosis to update in case it exists.
     */
    where: CancerDiagnosisWhereUniqueInput
    /**
     * In case the CancerDiagnosis found by the `where` argument doesn't exist, create a new CancerDiagnosis with this data.
     */
    create: XOR<CancerDiagnosisCreateInput, CancerDiagnosisUncheckedCreateInput>
    /**
     * In case the CancerDiagnosis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CancerDiagnosisUpdateInput, CancerDiagnosisUncheckedUpdateInput>
  }

  /**
   * CancerDiagnosis delete
   */
  export type CancerDiagnosisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
    /**
     * Filter which CancerDiagnosis to delete.
     */
    where: CancerDiagnosisWhereUniqueInput
  }

  /**
   * CancerDiagnosis deleteMany
   */
  export type CancerDiagnosisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CancerDiagnoses to delete
     */
    where?: CancerDiagnosisWhereInput
    /**
     * Limit how many CancerDiagnoses to delete.
     */
    limit?: number
  }

  /**
   * CancerDiagnosis.stagings
   */
  export type CancerDiagnosis$stagingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    where?: TumorStagingWhereInput
    orderBy?: TumorStagingOrderByWithRelationInput | TumorStagingOrderByWithRelationInput[]
    cursor?: TumorStagingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TumorStagingScalarFieldEnum | TumorStagingScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis.tumorBoardCases
   */
  export type CancerDiagnosis$tumorBoardCasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    where?: TumorBoardCaseWhereInput
    orderBy?: TumorBoardCaseOrderByWithRelationInput | TumorBoardCaseOrderByWithRelationInput[]
    cursor?: TumorBoardCaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TumorBoardCaseScalarFieldEnum | TumorBoardCaseScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis.carePlans
   */
  export type CancerDiagnosis$carePlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    where?: OncologyCarePlanWhereInput
    orderBy?: OncologyCarePlanOrderByWithRelationInput | OncologyCarePlanOrderByWithRelationInput[]
    cursor?: OncologyCarePlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OncologyCarePlanScalarFieldEnum | OncologyCarePlanScalarFieldEnum[]
  }

  /**
   * CancerDiagnosis without action
   */
  export type CancerDiagnosisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CancerDiagnosis
     */
    select?: CancerDiagnosisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CancerDiagnosis
     */
    omit?: CancerDiagnosisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CancerDiagnosisInclude<ExtArgs> | null
  }


  /**
   * Model TumorStaging
   */

  export type AggregateTumorStaging = {
    _count: TumorStagingCountAggregateOutputType | null
    _min: TumorStagingMinAggregateOutputType | null
    _max: TumorStagingMaxAggregateOutputType | null
  }

  export type TumorStagingMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    cancerDiagnosisId: string | null
    patientId: string | null
    encounterId: string | null
    providerId: string | null
    stagingSystem: string | null
    stagingEdition: string | null
    stagingType: string | null
    stageGroup: string | null
    tCategory: string | null
    nCategory: string | null
    mCategory: string | null
    bodySite: string | null
    grade: string | null
    histology: string | null
    stagingDate: Date | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumorStagingMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    cancerDiagnosisId: string | null
    patientId: string | null
    encounterId: string | null
    providerId: string | null
    stagingSystem: string | null
    stagingEdition: string | null
    stagingType: string | null
    stageGroup: string | null
    tCategory: string | null
    nCategory: string | null
    mCategory: string | null
    bodySite: string | null
    grade: string | null
    histology: string | null
    stagingDate: Date | null
    status: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumorStagingCountAggregateOutputType = {
    id: number
    tenantId: number
    cancerDiagnosisId: number
    patientId: number
    encounterId: number
    providerId: number
    stagingSystem: number
    stagingEdition: number
    stagingType: number
    stageGroup: number
    tCategory: number
    nCategory: number
    mCategory: number
    bodySite: number
    grade: number
    histology: number
    stagingDate: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TumorStagingMinAggregateInputType = {
    id?: true
    tenantId?: true
    cancerDiagnosisId?: true
    patientId?: true
    encounterId?: true
    providerId?: true
    stagingSystem?: true
    stagingEdition?: true
    stagingType?: true
    stageGroup?: true
    tCategory?: true
    nCategory?: true
    mCategory?: true
    bodySite?: true
    grade?: true
    histology?: true
    stagingDate?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumorStagingMaxAggregateInputType = {
    id?: true
    tenantId?: true
    cancerDiagnosisId?: true
    patientId?: true
    encounterId?: true
    providerId?: true
    stagingSystem?: true
    stagingEdition?: true
    stagingType?: true
    stageGroup?: true
    tCategory?: true
    nCategory?: true
    mCategory?: true
    bodySite?: true
    grade?: true
    histology?: true
    stagingDate?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumorStagingCountAggregateInputType = {
    id?: true
    tenantId?: true
    cancerDiagnosisId?: true
    patientId?: true
    encounterId?: true
    providerId?: true
    stagingSystem?: true
    stagingEdition?: true
    stagingType?: true
    stageGroup?: true
    tCategory?: true
    nCategory?: true
    mCategory?: true
    bodySite?: true
    grade?: true
    histology?: true
    stagingDate?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TumorStagingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumorStaging to aggregate.
     */
    where?: TumorStagingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorStagings to fetch.
     */
    orderBy?: TumorStagingOrderByWithRelationInput | TumorStagingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TumorStagingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorStagings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorStagings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TumorStagings
    **/
    _count?: true | TumorStagingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TumorStagingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TumorStagingMaxAggregateInputType
  }

  export type GetTumorStagingAggregateType<T extends TumorStagingAggregateArgs> = {
        [P in keyof T & keyof AggregateTumorStaging]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumorStaging[P]>
      : GetScalarType<T[P], AggregateTumorStaging[P]>
  }




  export type TumorStagingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumorStagingWhereInput
    orderBy?: TumorStagingOrderByWithAggregationInput | TumorStagingOrderByWithAggregationInput[]
    by: TumorStagingScalarFieldEnum[] | TumorStagingScalarFieldEnum
    having?: TumorStagingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TumorStagingCountAggregateInputType | true
    _min?: TumorStagingMinAggregateInputType
    _max?: TumorStagingMaxAggregateInputType
  }

  export type TumorStagingGroupByOutputType = {
    id: string
    tenantId: string
    cancerDiagnosisId: string
    patientId: string
    encounterId: string | null
    providerId: string | null
    stagingSystem: string
    stagingEdition: string | null
    stagingType: string
    stageGroup: string | null
    tCategory: string | null
    nCategory: string | null
    mCategory: string | null
    bodySite: string | null
    grade: string | null
    histology: string | null
    stagingDate: Date
    status: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: TumorStagingCountAggregateOutputType | null
    _min: TumorStagingMinAggregateOutputType | null
    _max: TumorStagingMaxAggregateOutputType | null
  }

  type GetTumorStagingGroupByPayload<T extends TumorStagingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TumorStagingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TumorStagingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumorStagingGroupByOutputType[P]>
            : GetScalarType<T[P], TumorStagingGroupByOutputType[P]>
        }
      >
    >


  export type TumorStagingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerDiagnosisId?: boolean
    patientId?: boolean
    encounterId?: boolean
    providerId?: boolean
    stagingSystem?: boolean
    stagingEdition?: boolean
    stagingType?: boolean
    stageGroup?: boolean
    tCategory?: boolean
    nCategory?: boolean
    mCategory?: boolean
    bodySite?: boolean
    grade?: boolean
    histology?: boolean
    stagingDate?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorStaging"]>

  export type TumorStagingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerDiagnosisId?: boolean
    patientId?: boolean
    encounterId?: boolean
    providerId?: boolean
    stagingSystem?: boolean
    stagingEdition?: boolean
    stagingType?: boolean
    stageGroup?: boolean
    tCategory?: boolean
    nCategory?: boolean
    mCategory?: boolean
    bodySite?: boolean
    grade?: boolean
    histology?: boolean
    stagingDate?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorStaging"]>

  export type TumorStagingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerDiagnosisId?: boolean
    patientId?: boolean
    encounterId?: boolean
    providerId?: boolean
    stagingSystem?: boolean
    stagingEdition?: boolean
    stagingType?: boolean
    stageGroup?: boolean
    tCategory?: boolean
    nCategory?: boolean
    mCategory?: boolean
    bodySite?: boolean
    grade?: boolean
    histology?: boolean
    stagingDate?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorStaging"]>

  export type TumorStagingSelectScalar = {
    id?: boolean
    tenantId?: boolean
    cancerDiagnosisId?: boolean
    patientId?: boolean
    encounterId?: boolean
    providerId?: boolean
    stagingSystem?: boolean
    stagingEdition?: boolean
    stagingType?: boolean
    stageGroup?: boolean
    tCategory?: boolean
    nCategory?: boolean
    mCategory?: boolean
    bodySite?: boolean
    grade?: boolean
    histology?: boolean
    stagingDate?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TumorStagingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "cancerDiagnosisId" | "patientId" | "encounterId" | "providerId" | "stagingSystem" | "stagingEdition" | "stagingType" | "stageGroup" | "tCategory" | "nCategory" | "mCategory" | "bodySite" | "grade" | "histology" | "stagingDate" | "status" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["tumorStaging"]>
  export type TumorStagingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type TumorStagingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type TumorStagingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }

  export type $TumorStagingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TumorStaging"
    objects: {
      cancerDiagnosis: Prisma.$CancerDiagnosisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      cancerDiagnosisId: string
      patientId: string
      encounterId: string | null
      providerId: string | null
      stagingSystem: string
      stagingEdition: string | null
      stagingType: string
      stageGroup: string | null
      tCategory: string | null
      nCategory: string | null
      mCategory: string | null
      bodySite: string | null
      grade: string | null
      histology: string | null
      stagingDate: Date
      status: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tumorStaging"]>
    composites: {}
  }

  type TumorStagingGetPayload<S extends boolean | null | undefined | TumorStagingDefaultArgs> = $Result.GetResult<Prisma.$TumorStagingPayload, S>

  type TumorStagingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TumorStagingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TumorStagingCountAggregateInputType | true
    }

  export interface TumorStagingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TumorStaging'], meta: { name: 'TumorStaging' } }
    /**
     * Find zero or one TumorStaging that matches the filter.
     * @param {TumorStagingFindUniqueArgs} args - Arguments to find a TumorStaging
     * @example
     * // Get one TumorStaging
     * const tumorStaging = await prisma.tumorStaging.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TumorStagingFindUniqueArgs>(args: SelectSubset<T, TumorStagingFindUniqueArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TumorStaging that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TumorStagingFindUniqueOrThrowArgs} args - Arguments to find a TumorStaging
     * @example
     * // Get one TumorStaging
     * const tumorStaging = await prisma.tumorStaging.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TumorStagingFindUniqueOrThrowArgs>(args: SelectSubset<T, TumorStagingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumorStaging that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingFindFirstArgs} args - Arguments to find a TumorStaging
     * @example
     * // Get one TumorStaging
     * const tumorStaging = await prisma.tumorStaging.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TumorStagingFindFirstArgs>(args?: SelectSubset<T, TumorStagingFindFirstArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumorStaging that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingFindFirstOrThrowArgs} args - Arguments to find a TumorStaging
     * @example
     * // Get one TumorStaging
     * const tumorStaging = await prisma.tumorStaging.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TumorStagingFindFirstOrThrowArgs>(args?: SelectSubset<T, TumorStagingFindFirstOrThrowArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TumorStagings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumorStagings
     * const tumorStagings = await prisma.tumorStaging.findMany()
     * 
     * // Get first 10 TumorStagings
     * const tumorStagings = await prisma.tumorStaging.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tumorStagingWithIdOnly = await prisma.tumorStaging.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TumorStagingFindManyArgs>(args?: SelectSubset<T, TumorStagingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TumorStaging.
     * @param {TumorStagingCreateArgs} args - Arguments to create a TumorStaging.
     * @example
     * // Create one TumorStaging
     * const TumorStaging = await prisma.tumorStaging.create({
     *   data: {
     *     // ... data to create a TumorStaging
     *   }
     * })
     * 
     */
    create<T extends TumorStagingCreateArgs>(args: SelectSubset<T, TumorStagingCreateArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TumorStagings.
     * @param {TumorStagingCreateManyArgs} args - Arguments to create many TumorStagings.
     * @example
     * // Create many TumorStagings
     * const tumorStaging = await prisma.tumorStaging.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TumorStagingCreateManyArgs>(args?: SelectSubset<T, TumorStagingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TumorStagings and returns the data saved in the database.
     * @param {TumorStagingCreateManyAndReturnArgs} args - Arguments to create many TumorStagings.
     * @example
     * // Create many TumorStagings
     * const tumorStaging = await prisma.tumorStaging.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TumorStagings and only return the `id`
     * const tumorStagingWithIdOnly = await prisma.tumorStaging.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TumorStagingCreateManyAndReturnArgs>(args?: SelectSubset<T, TumorStagingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TumorStaging.
     * @param {TumorStagingDeleteArgs} args - Arguments to delete one TumorStaging.
     * @example
     * // Delete one TumorStaging
     * const TumorStaging = await prisma.tumorStaging.delete({
     *   where: {
     *     // ... filter to delete one TumorStaging
     *   }
     * })
     * 
     */
    delete<T extends TumorStagingDeleteArgs>(args: SelectSubset<T, TumorStagingDeleteArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TumorStaging.
     * @param {TumorStagingUpdateArgs} args - Arguments to update one TumorStaging.
     * @example
     * // Update one TumorStaging
     * const tumorStaging = await prisma.tumorStaging.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TumorStagingUpdateArgs>(args: SelectSubset<T, TumorStagingUpdateArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TumorStagings.
     * @param {TumorStagingDeleteManyArgs} args - Arguments to filter TumorStagings to delete.
     * @example
     * // Delete a few TumorStagings
     * const { count } = await prisma.tumorStaging.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TumorStagingDeleteManyArgs>(args?: SelectSubset<T, TumorStagingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumorStagings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumorStagings
     * const tumorStaging = await prisma.tumorStaging.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TumorStagingUpdateManyArgs>(args: SelectSubset<T, TumorStagingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumorStagings and returns the data updated in the database.
     * @param {TumorStagingUpdateManyAndReturnArgs} args - Arguments to update many TumorStagings.
     * @example
     * // Update many TumorStagings
     * const tumorStaging = await prisma.tumorStaging.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TumorStagings and only return the `id`
     * const tumorStagingWithIdOnly = await prisma.tumorStaging.updateManyAndReturn({
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
    updateManyAndReturn<T extends TumorStagingUpdateManyAndReturnArgs>(args: SelectSubset<T, TumorStagingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TumorStaging.
     * @param {TumorStagingUpsertArgs} args - Arguments to update or create a TumorStaging.
     * @example
     * // Update or create a TumorStaging
     * const tumorStaging = await prisma.tumorStaging.upsert({
     *   create: {
     *     // ... data to create a TumorStaging
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumorStaging we want to update
     *   }
     * })
     */
    upsert<T extends TumorStagingUpsertArgs>(args: SelectSubset<T, TumorStagingUpsertArgs<ExtArgs>>): Prisma__TumorStagingClient<$Result.GetResult<Prisma.$TumorStagingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TumorStagings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingCountArgs} args - Arguments to filter TumorStagings to count.
     * @example
     * // Count the number of TumorStagings
     * const count = await prisma.tumorStaging.count({
     *   where: {
     *     // ... the filter for the TumorStagings we want to count
     *   }
     * })
    **/
    count<T extends TumorStagingCountArgs>(
      args?: Subset<T, TumorStagingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumorStagingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TumorStaging.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TumorStagingAggregateArgs>(args: Subset<T, TumorStagingAggregateArgs>): Prisma.PrismaPromise<GetTumorStagingAggregateType<T>>

    /**
     * Group by TumorStaging.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorStagingGroupByArgs} args - Group by arguments.
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
      T extends TumorStagingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumorStagingGroupByArgs['orderBy'] }
        : { orderBy?: TumorStagingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TumorStagingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTumorStagingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TumorStaging model
   */
  readonly fields: TumorStagingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumorStaging.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TumorStagingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cancerDiagnosis<T extends CancerDiagnosisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosisDefaultArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TumorStaging model
   */
  interface TumorStagingFieldRefs {
    readonly id: FieldRef<"TumorStaging", 'String'>
    readonly tenantId: FieldRef<"TumorStaging", 'String'>
    readonly cancerDiagnosisId: FieldRef<"TumorStaging", 'String'>
    readonly patientId: FieldRef<"TumorStaging", 'String'>
    readonly encounterId: FieldRef<"TumorStaging", 'String'>
    readonly providerId: FieldRef<"TumorStaging", 'String'>
    readonly stagingSystem: FieldRef<"TumorStaging", 'String'>
    readonly stagingEdition: FieldRef<"TumorStaging", 'String'>
    readonly stagingType: FieldRef<"TumorStaging", 'String'>
    readonly stageGroup: FieldRef<"TumorStaging", 'String'>
    readonly tCategory: FieldRef<"TumorStaging", 'String'>
    readonly nCategory: FieldRef<"TumorStaging", 'String'>
    readonly mCategory: FieldRef<"TumorStaging", 'String'>
    readonly bodySite: FieldRef<"TumorStaging", 'String'>
    readonly grade: FieldRef<"TumorStaging", 'String'>
    readonly histology: FieldRef<"TumorStaging", 'String'>
    readonly stagingDate: FieldRef<"TumorStaging", 'DateTime'>
    readonly status: FieldRef<"TumorStaging", 'String'>
    readonly notes: FieldRef<"TumorStaging", 'String'>
    readonly createdAt: FieldRef<"TumorStaging", 'DateTime'>
    readonly updatedAt: FieldRef<"TumorStaging", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TumorStaging findUnique
   */
  export type TumorStagingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter, which TumorStaging to fetch.
     */
    where: TumorStagingWhereUniqueInput
  }

  /**
   * TumorStaging findUniqueOrThrow
   */
  export type TumorStagingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter, which TumorStaging to fetch.
     */
    where: TumorStagingWhereUniqueInput
  }

  /**
   * TumorStaging findFirst
   */
  export type TumorStagingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter, which TumorStaging to fetch.
     */
    where?: TumorStagingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorStagings to fetch.
     */
    orderBy?: TumorStagingOrderByWithRelationInput | TumorStagingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumorStagings.
     */
    cursor?: TumorStagingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorStagings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorStagings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumorStagings.
     */
    distinct?: TumorStagingScalarFieldEnum | TumorStagingScalarFieldEnum[]
  }

  /**
   * TumorStaging findFirstOrThrow
   */
  export type TumorStagingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter, which TumorStaging to fetch.
     */
    where?: TumorStagingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorStagings to fetch.
     */
    orderBy?: TumorStagingOrderByWithRelationInput | TumorStagingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumorStagings.
     */
    cursor?: TumorStagingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorStagings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorStagings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumorStagings.
     */
    distinct?: TumorStagingScalarFieldEnum | TumorStagingScalarFieldEnum[]
  }

  /**
   * TumorStaging findMany
   */
  export type TumorStagingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter, which TumorStagings to fetch.
     */
    where?: TumorStagingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorStagings to fetch.
     */
    orderBy?: TumorStagingOrderByWithRelationInput | TumorStagingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TumorStagings.
     */
    cursor?: TumorStagingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorStagings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorStagings.
     */
    skip?: number
    distinct?: TumorStagingScalarFieldEnum | TumorStagingScalarFieldEnum[]
  }

  /**
   * TumorStaging create
   */
  export type TumorStagingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * The data needed to create a TumorStaging.
     */
    data: XOR<TumorStagingCreateInput, TumorStagingUncheckedCreateInput>
  }

  /**
   * TumorStaging createMany
   */
  export type TumorStagingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TumorStagings.
     */
    data: TumorStagingCreateManyInput | TumorStagingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TumorStaging createManyAndReturn
   */
  export type TumorStagingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * The data used to create many TumorStagings.
     */
    data: TumorStagingCreateManyInput | TumorStagingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TumorStaging update
   */
  export type TumorStagingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * The data needed to update a TumorStaging.
     */
    data: XOR<TumorStagingUpdateInput, TumorStagingUncheckedUpdateInput>
    /**
     * Choose, which TumorStaging to update.
     */
    where: TumorStagingWhereUniqueInput
  }

  /**
   * TumorStaging updateMany
   */
  export type TumorStagingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TumorStagings.
     */
    data: XOR<TumorStagingUpdateManyMutationInput, TumorStagingUncheckedUpdateManyInput>
    /**
     * Filter which TumorStagings to update
     */
    where?: TumorStagingWhereInput
    /**
     * Limit how many TumorStagings to update.
     */
    limit?: number
  }

  /**
   * TumorStaging updateManyAndReturn
   */
  export type TumorStagingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * The data used to update TumorStagings.
     */
    data: XOR<TumorStagingUpdateManyMutationInput, TumorStagingUncheckedUpdateManyInput>
    /**
     * Filter which TumorStagings to update
     */
    where?: TumorStagingWhereInput
    /**
     * Limit how many TumorStagings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TumorStaging upsert
   */
  export type TumorStagingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * The filter to search for the TumorStaging to update in case it exists.
     */
    where: TumorStagingWhereUniqueInput
    /**
     * In case the TumorStaging found by the `where` argument doesn't exist, create a new TumorStaging with this data.
     */
    create: XOR<TumorStagingCreateInput, TumorStagingUncheckedCreateInput>
    /**
     * In case the TumorStaging was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TumorStagingUpdateInput, TumorStagingUncheckedUpdateInput>
  }

  /**
   * TumorStaging delete
   */
  export type TumorStagingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
    /**
     * Filter which TumorStaging to delete.
     */
    where: TumorStagingWhereUniqueInput
  }

  /**
   * TumorStaging deleteMany
   */
  export type TumorStagingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumorStagings to delete
     */
    where?: TumorStagingWhereInput
    /**
     * Limit how many TumorStagings to delete.
     */
    limit?: number
  }

  /**
   * TumorStaging without action
   */
  export type TumorStagingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorStaging
     */
    select?: TumorStagingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorStaging
     */
    omit?: TumorStagingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorStagingInclude<ExtArgs> | null
  }


  /**
   * Model ChemoProtocol
   */

  export type AggregateChemoProtocol = {
    _count: ChemoProtocolCountAggregateOutputType | null
    _avg: ChemoProtocolAvgAggregateOutputType | null
    _sum: ChemoProtocolSumAggregateOutputType | null
    _min: ChemoProtocolMinAggregateOutputType | null
    _max: ChemoProtocolMaxAggregateOutputType | null
  }

  export type ChemoProtocolAvgAggregateOutputType = {
    totalCycles: number | null
    cycleDurationDays: number | null
  }

  export type ChemoProtocolSumAggregateOutputType = {
    totalCycles: number | null
    cycleDurationDays: number | null
  }

  export type ChemoProtocolMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    cancerType: string | null
    intent: string | null
    totalCycles: number | null
    cycleDurationDays: number | null
    emetogenicRisk: string | null
    doseFormula: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: string | null
  }

  export type ChemoProtocolMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    cancerType: string | null
    intent: string | null
    totalCycles: number | null
    cycleDurationDays: number | null
    emetogenicRisk: string | null
    doseFormula: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: string | null
  }

  export type ChemoProtocolCountAggregateOutputType = {
    id: number
    tenantId: number
    code: number
    name: number
    description: number
    cancerType: number
    intent: number
    regimen: number
    totalCycles: number
    cycleDurationDays: number
    premedications: number
    supportiveCare: number
    emetogenicRisk: number
    doseFormula: number
    labPrerequisites: number
    hydration: number
    isActive: number
    createdAt: number
    updatedAt: number
    createdBy: number
    _all: number
  }


  export type ChemoProtocolAvgAggregateInputType = {
    totalCycles?: true
    cycleDurationDays?: true
  }

  export type ChemoProtocolSumAggregateInputType = {
    totalCycles?: true
    cycleDurationDays?: true
  }

  export type ChemoProtocolMinAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    cancerType?: true
    intent?: true
    totalCycles?: true
    cycleDurationDays?: true
    emetogenicRisk?: true
    doseFormula?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
  }

  export type ChemoProtocolMaxAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    cancerType?: true
    intent?: true
    totalCycles?: true
    cycleDurationDays?: true
    emetogenicRisk?: true
    doseFormula?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
  }

  export type ChemoProtocolCountAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    cancerType?: true
    intent?: true
    regimen?: true
    totalCycles?: true
    cycleDurationDays?: true
    premedications?: true
    supportiveCare?: true
    emetogenicRisk?: true
    doseFormula?: true
    labPrerequisites?: true
    hydration?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    _all?: true
  }

  export type ChemoProtocolAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChemoProtocol to aggregate.
     */
    where?: ChemoProtocolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoProtocols to fetch.
     */
    orderBy?: ChemoProtocolOrderByWithRelationInput | ChemoProtocolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChemoProtocolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoProtocols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoProtocols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChemoProtocols
    **/
    _count?: true | ChemoProtocolCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChemoProtocolAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChemoProtocolSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChemoProtocolMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChemoProtocolMaxAggregateInputType
  }

  export type GetChemoProtocolAggregateType<T extends ChemoProtocolAggregateArgs> = {
        [P in keyof T & keyof AggregateChemoProtocol]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChemoProtocol[P]>
      : GetScalarType<T[P], AggregateChemoProtocol[P]>
  }




  export type ChemoProtocolGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChemoProtocolWhereInput
    orderBy?: ChemoProtocolOrderByWithAggregationInput | ChemoProtocolOrderByWithAggregationInput[]
    by: ChemoProtocolScalarFieldEnum[] | ChemoProtocolScalarFieldEnum
    having?: ChemoProtocolScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChemoProtocolCountAggregateInputType | true
    _avg?: ChemoProtocolAvgAggregateInputType
    _sum?: ChemoProtocolSumAggregateInputType
    _min?: ChemoProtocolMinAggregateInputType
    _max?: ChemoProtocolMaxAggregateInputType
  }

  export type ChemoProtocolGroupByOutputType = {
    id: string
    tenantId: string
    code: string
    name: string
    description: string | null
    cancerType: string
    intent: string
    regimen: JsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications: JsonValue
    supportiveCare: JsonValue
    emetogenicRisk: string | null
    doseFormula: string
    labPrerequisites: JsonValue
    hydration: JsonValue
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    createdBy: string | null
    _count: ChemoProtocolCountAggregateOutputType | null
    _avg: ChemoProtocolAvgAggregateOutputType | null
    _sum: ChemoProtocolSumAggregateOutputType | null
    _min: ChemoProtocolMinAggregateOutputType | null
    _max: ChemoProtocolMaxAggregateOutputType | null
  }

  type GetChemoProtocolGroupByPayload<T extends ChemoProtocolGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChemoProtocolGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChemoProtocolGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChemoProtocolGroupByOutputType[P]>
            : GetScalarType<T[P], ChemoProtocolGroupByOutputType[P]>
        }
      >
    >


  export type ChemoProtocolSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    cancerType?: boolean
    intent?: boolean
    regimen?: boolean
    totalCycles?: boolean
    cycleDurationDays?: boolean
    premedications?: boolean
    supportiveCare?: boolean
    emetogenicRisk?: boolean
    doseFormula?: boolean
    labPrerequisites?: boolean
    hydration?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    orders?: boolean | ChemoProtocol$ordersArgs<ExtArgs>
    _count?: boolean | ChemoProtocolCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chemoProtocol"]>

  export type ChemoProtocolSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    cancerType?: boolean
    intent?: boolean
    regimen?: boolean
    totalCycles?: boolean
    cycleDurationDays?: boolean
    premedications?: boolean
    supportiveCare?: boolean
    emetogenicRisk?: boolean
    doseFormula?: boolean
    labPrerequisites?: boolean
    hydration?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
  }, ExtArgs["result"]["chemoProtocol"]>

  export type ChemoProtocolSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    cancerType?: boolean
    intent?: boolean
    regimen?: boolean
    totalCycles?: boolean
    cycleDurationDays?: boolean
    premedications?: boolean
    supportiveCare?: boolean
    emetogenicRisk?: boolean
    doseFormula?: boolean
    labPrerequisites?: boolean
    hydration?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
  }, ExtArgs["result"]["chemoProtocol"]>

  export type ChemoProtocolSelectScalar = {
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    cancerType?: boolean
    intent?: boolean
    regimen?: boolean
    totalCycles?: boolean
    cycleDurationDays?: boolean
    premedications?: boolean
    supportiveCare?: boolean
    emetogenicRisk?: boolean
    doseFormula?: boolean
    labPrerequisites?: boolean
    hydration?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
  }

  export type ChemoProtocolOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "code" | "name" | "description" | "cancerType" | "intent" | "regimen" | "totalCycles" | "cycleDurationDays" | "premedications" | "supportiveCare" | "emetogenicRisk" | "doseFormula" | "labPrerequisites" | "hydration" | "isActive" | "createdAt" | "updatedAt" | "createdBy", ExtArgs["result"]["chemoProtocol"]>
  export type ChemoProtocolInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    orders?: boolean | ChemoProtocol$ordersArgs<ExtArgs>
    _count?: boolean | ChemoProtocolCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChemoProtocolIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ChemoProtocolIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ChemoProtocolPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChemoProtocol"
    objects: {
      orders: Prisma.$ChemoOrderPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      code: string
      name: string
      description: string | null
      cancerType: string
      intent: string
      regimen: Prisma.JsonValue
      totalCycles: number
      cycleDurationDays: number
      premedications: Prisma.JsonValue
      supportiveCare: Prisma.JsonValue
      emetogenicRisk: string | null
      doseFormula: string
      labPrerequisites: Prisma.JsonValue
      hydration: Prisma.JsonValue
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      createdBy: string | null
    }, ExtArgs["result"]["chemoProtocol"]>
    composites: {}
  }

  type ChemoProtocolGetPayload<S extends boolean | null | undefined | ChemoProtocolDefaultArgs> = $Result.GetResult<Prisma.$ChemoProtocolPayload, S>

  type ChemoProtocolCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChemoProtocolFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChemoProtocolCountAggregateInputType | true
    }

  export interface ChemoProtocolDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChemoProtocol'], meta: { name: 'ChemoProtocol' } }
    /**
     * Find zero or one ChemoProtocol that matches the filter.
     * @param {ChemoProtocolFindUniqueArgs} args - Arguments to find a ChemoProtocol
     * @example
     * // Get one ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChemoProtocolFindUniqueArgs>(args: SelectSubset<T, ChemoProtocolFindUniqueArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChemoProtocol that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChemoProtocolFindUniqueOrThrowArgs} args - Arguments to find a ChemoProtocol
     * @example
     * // Get one ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChemoProtocolFindUniqueOrThrowArgs>(args: SelectSubset<T, ChemoProtocolFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChemoProtocol that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolFindFirstArgs} args - Arguments to find a ChemoProtocol
     * @example
     * // Get one ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChemoProtocolFindFirstArgs>(args?: SelectSubset<T, ChemoProtocolFindFirstArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChemoProtocol that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolFindFirstOrThrowArgs} args - Arguments to find a ChemoProtocol
     * @example
     * // Get one ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChemoProtocolFindFirstOrThrowArgs>(args?: SelectSubset<T, ChemoProtocolFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChemoProtocols that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChemoProtocols
     * const chemoProtocols = await prisma.chemoProtocol.findMany()
     * 
     * // Get first 10 ChemoProtocols
     * const chemoProtocols = await prisma.chemoProtocol.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chemoProtocolWithIdOnly = await prisma.chemoProtocol.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChemoProtocolFindManyArgs>(args?: SelectSubset<T, ChemoProtocolFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChemoProtocol.
     * @param {ChemoProtocolCreateArgs} args - Arguments to create a ChemoProtocol.
     * @example
     * // Create one ChemoProtocol
     * const ChemoProtocol = await prisma.chemoProtocol.create({
     *   data: {
     *     // ... data to create a ChemoProtocol
     *   }
     * })
     * 
     */
    create<T extends ChemoProtocolCreateArgs>(args: SelectSubset<T, ChemoProtocolCreateArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChemoProtocols.
     * @param {ChemoProtocolCreateManyArgs} args - Arguments to create many ChemoProtocols.
     * @example
     * // Create many ChemoProtocols
     * const chemoProtocol = await prisma.chemoProtocol.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChemoProtocolCreateManyArgs>(args?: SelectSubset<T, ChemoProtocolCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChemoProtocols and returns the data saved in the database.
     * @param {ChemoProtocolCreateManyAndReturnArgs} args - Arguments to create many ChemoProtocols.
     * @example
     * // Create many ChemoProtocols
     * const chemoProtocol = await prisma.chemoProtocol.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChemoProtocols and only return the `id`
     * const chemoProtocolWithIdOnly = await prisma.chemoProtocol.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChemoProtocolCreateManyAndReturnArgs>(args?: SelectSubset<T, ChemoProtocolCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChemoProtocol.
     * @param {ChemoProtocolDeleteArgs} args - Arguments to delete one ChemoProtocol.
     * @example
     * // Delete one ChemoProtocol
     * const ChemoProtocol = await prisma.chemoProtocol.delete({
     *   where: {
     *     // ... filter to delete one ChemoProtocol
     *   }
     * })
     * 
     */
    delete<T extends ChemoProtocolDeleteArgs>(args: SelectSubset<T, ChemoProtocolDeleteArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChemoProtocol.
     * @param {ChemoProtocolUpdateArgs} args - Arguments to update one ChemoProtocol.
     * @example
     * // Update one ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChemoProtocolUpdateArgs>(args: SelectSubset<T, ChemoProtocolUpdateArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChemoProtocols.
     * @param {ChemoProtocolDeleteManyArgs} args - Arguments to filter ChemoProtocols to delete.
     * @example
     * // Delete a few ChemoProtocols
     * const { count } = await prisma.chemoProtocol.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChemoProtocolDeleteManyArgs>(args?: SelectSubset<T, ChemoProtocolDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChemoProtocols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChemoProtocols
     * const chemoProtocol = await prisma.chemoProtocol.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChemoProtocolUpdateManyArgs>(args: SelectSubset<T, ChemoProtocolUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChemoProtocols and returns the data updated in the database.
     * @param {ChemoProtocolUpdateManyAndReturnArgs} args - Arguments to update many ChemoProtocols.
     * @example
     * // Update many ChemoProtocols
     * const chemoProtocol = await prisma.chemoProtocol.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChemoProtocols and only return the `id`
     * const chemoProtocolWithIdOnly = await prisma.chemoProtocol.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChemoProtocolUpdateManyAndReturnArgs>(args: SelectSubset<T, ChemoProtocolUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChemoProtocol.
     * @param {ChemoProtocolUpsertArgs} args - Arguments to update or create a ChemoProtocol.
     * @example
     * // Update or create a ChemoProtocol
     * const chemoProtocol = await prisma.chemoProtocol.upsert({
     *   create: {
     *     // ... data to create a ChemoProtocol
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChemoProtocol we want to update
     *   }
     * })
     */
    upsert<T extends ChemoProtocolUpsertArgs>(args: SelectSubset<T, ChemoProtocolUpsertArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChemoProtocols.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolCountArgs} args - Arguments to filter ChemoProtocols to count.
     * @example
     * // Count the number of ChemoProtocols
     * const count = await prisma.chemoProtocol.count({
     *   where: {
     *     // ... the filter for the ChemoProtocols we want to count
     *   }
     * })
    **/
    count<T extends ChemoProtocolCountArgs>(
      args?: Subset<T, ChemoProtocolCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChemoProtocolCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChemoProtocol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChemoProtocolAggregateArgs>(args: Subset<T, ChemoProtocolAggregateArgs>): Prisma.PrismaPromise<GetChemoProtocolAggregateType<T>>

    /**
     * Group by ChemoProtocol.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoProtocolGroupByArgs} args - Group by arguments.
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
      T extends ChemoProtocolGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChemoProtocolGroupByArgs['orderBy'] }
        : { orderBy?: ChemoProtocolGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChemoProtocolGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChemoProtocolGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChemoProtocol model
   */
  readonly fields: ChemoProtocolFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChemoProtocol.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChemoProtocolClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    orders<T extends ChemoProtocol$ordersArgs<ExtArgs> = {}>(args?: Subset<T, ChemoProtocol$ordersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ChemoProtocol model
   */
  interface ChemoProtocolFieldRefs {
    readonly id: FieldRef<"ChemoProtocol", 'String'>
    readonly tenantId: FieldRef<"ChemoProtocol", 'String'>
    readonly code: FieldRef<"ChemoProtocol", 'String'>
    readonly name: FieldRef<"ChemoProtocol", 'String'>
    readonly description: FieldRef<"ChemoProtocol", 'String'>
    readonly cancerType: FieldRef<"ChemoProtocol", 'String'>
    readonly intent: FieldRef<"ChemoProtocol", 'String'>
    readonly regimen: FieldRef<"ChemoProtocol", 'Json'>
    readonly totalCycles: FieldRef<"ChemoProtocol", 'Int'>
    readonly cycleDurationDays: FieldRef<"ChemoProtocol", 'Int'>
    readonly premedications: FieldRef<"ChemoProtocol", 'Json'>
    readonly supportiveCare: FieldRef<"ChemoProtocol", 'Json'>
    readonly emetogenicRisk: FieldRef<"ChemoProtocol", 'String'>
    readonly doseFormula: FieldRef<"ChemoProtocol", 'String'>
    readonly labPrerequisites: FieldRef<"ChemoProtocol", 'Json'>
    readonly hydration: FieldRef<"ChemoProtocol", 'Json'>
    readonly isActive: FieldRef<"ChemoProtocol", 'Boolean'>
    readonly createdAt: FieldRef<"ChemoProtocol", 'DateTime'>
    readonly updatedAt: FieldRef<"ChemoProtocol", 'DateTime'>
    readonly createdBy: FieldRef<"ChemoProtocol", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChemoProtocol findUnique
   */
  export type ChemoProtocolFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter, which ChemoProtocol to fetch.
     */
    where: ChemoProtocolWhereUniqueInput
  }

  /**
   * ChemoProtocol findUniqueOrThrow
   */
  export type ChemoProtocolFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter, which ChemoProtocol to fetch.
     */
    where: ChemoProtocolWhereUniqueInput
  }

  /**
   * ChemoProtocol findFirst
   */
  export type ChemoProtocolFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter, which ChemoProtocol to fetch.
     */
    where?: ChemoProtocolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoProtocols to fetch.
     */
    orderBy?: ChemoProtocolOrderByWithRelationInput | ChemoProtocolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChemoProtocols.
     */
    cursor?: ChemoProtocolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoProtocols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoProtocols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChemoProtocols.
     */
    distinct?: ChemoProtocolScalarFieldEnum | ChemoProtocolScalarFieldEnum[]
  }

  /**
   * ChemoProtocol findFirstOrThrow
   */
  export type ChemoProtocolFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter, which ChemoProtocol to fetch.
     */
    where?: ChemoProtocolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoProtocols to fetch.
     */
    orderBy?: ChemoProtocolOrderByWithRelationInput | ChemoProtocolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChemoProtocols.
     */
    cursor?: ChemoProtocolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoProtocols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoProtocols.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChemoProtocols.
     */
    distinct?: ChemoProtocolScalarFieldEnum | ChemoProtocolScalarFieldEnum[]
  }

  /**
   * ChemoProtocol findMany
   */
  export type ChemoProtocolFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter, which ChemoProtocols to fetch.
     */
    where?: ChemoProtocolWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoProtocols to fetch.
     */
    orderBy?: ChemoProtocolOrderByWithRelationInput | ChemoProtocolOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChemoProtocols.
     */
    cursor?: ChemoProtocolWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoProtocols from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoProtocols.
     */
    skip?: number
    distinct?: ChemoProtocolScalarFieldEnum | ChemoProtocolScalarFieldEnum[]
  }

  /**
   * ChemoProtocol create
   */
  export type ChemoProtocolCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * The data needed to create a ChemoProtocol.
     */
    data: XOR<ChemoProtocolCreateInput, ChemoProtocolUncheckedCreateInput>
  }

  /**
   * ChemoProtocol createMany
   */
  export type ChemoProtocolCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChemoProtocols.
     */
    data: ChemoProtocolCreateManyInput | ChemoProtocolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChemoProtocol createManyAndReturn
   */
  export type ChemoProtocolCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * The data used to create many ChemoProtocols.
     */
    data: ChemoProtocolCreateManyInput | ChemoProtocolCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChemoProtocol update
   */
  export type ChemoProtocolUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * The data needed to update a ChemoProtocol.
     */
    data: XOR<ChemoProtocolUpdateInput, ChemoProtocolUncheckedUpdateInput>
    /**
     * Choose, which ChemoProtocol to update.
     */
    where: ChemoProtocolWhereUniqueInput
  }

  /**
   * ChemoProtocol updateMany
   */
  export type ChemoProtocolUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChemoProtocols.
     */
    data: XOR<ChemoProtocolUpdateManyMutationInput, ChemoProtocolUncheckedUpdateManyInput>
    /**
     * Filter which ChemoProtocols to update
     */
    where?: ChemoProtocolWhereInput
    /**
     * Limit how many ChemoProtocols to update.
     */
    limit?: number
  }

  /**
   * ChemoProtocol updateManyAndReturn
   */
  export type ChemoProtocolUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * The data used to update ChemoProtocols.
     */
    data: XOR<ChemoProtocolUpdateManyMutationInput, ChemoProtocolUncheckedUpdateManyInput>
    /**
     * Filter which ChemoProtocols to update
     */
    where?: ChemoProtocolWhereInput
    /**
     * Limit how many ChemoProtocols to update.
     */
    limit?: number
  }

  /**
   * ChemoProtocol upsert
   */
  export type ChemoProtocolUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * The filter to search for the ChemoProtocol to update in case it exists.
     */
    where: ChemoProtocolWhereUniqueInput
    /**
     * In case the ChemoProtocol found by the `where` argument doesn't exist, create a new ChemoProtocol with this data.
     */
    create: XOR<ChemoProtocolCreateInput, ChemoProtocolUncheckedCreateInput>
    /**
     * In case the ChemoProtocol was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChemoProtocolUpdateInput, ChemoProtocolUncheckedUpdateInput>
  }

  /**
   * ChemoProtocol delete
   */
  export type ChemoProtocolDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
    /**
     * Filter which ChemoProtocol to delete.
     */
    where: ChemoProtocolWhereUniqueInput
  }

  /**
   * ChemoProtocol deleteMany
   */
  export type ChemoProtocolDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChemoProtocols to delete
     */
    where?: ChemoProtocolWhereInput
    /**
     * Limit how many ChemoProtocols to delete.
     */
    limit?: number
  }

  /**
   * ChemoProtocol.orders
   */
  export type ChemoProtocol$ordersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    where?: ChemoOrderWhereInput
    orderBy?: ChemoOrderOrderByWithRelationInput | ChemoOrderOrderByWithRelationInput[]
    cursor?: ChemoOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChemoOrderScalarFieldEnum | ChemoOrderScalarFieldEnum[]
  }

  /**
   * ChemoProtocol without action
   */
  export type ChemoProtocolDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoProtocol
     */
    select?: ChemoProtocolSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoProtocol
     */
    omit?: ChemoProtocolOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoProtocolInclude<ExtArgs> | null
  }


  /**
   * Model ChemoOrder
   */

  export type AggregateChemoOrder = {
    _count: ChemoOrderCountAggregateOutputType | null
    _avg: ChemoOrderAvgAggregateOutputType | null
    _sum: ChemoOrderSumAggregateOutputType | null
    _min: ChemoOrderMinAggregateOutputType | null
    _max: ChemoOrderMaxAggregateOutputType | null
  }

  export type ChemoOrderAvgAggregateOutputType = {
    cycleNumber: number | null
    dayNumber: number | null
    bsa: Decimal | null
    weight: Decimal | null
    height: Decimal | null
    creatinineClearance: Decimal | null
  }

  export type ChemoOrderSumAggregateOutputType = {
    cycleNumber: number | null
    dayNumber: number | null
    bsa: Decimal | null
    weight: Decimal | null
    height: Decimal | null
    creatinineClearance: Decimal | null
  }

  export type ChemoOrderMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    protocolId: string | null
    orderingProvider: string | null
    cycleNumber: number | null
    dayNumber: number | null
    scheduledDate: Date | null
    administeredAt: Date | null
    bsa: Decimal | null
    weight: Decimal | null
    height: Decimal | null
    creatinineClearance: Decimal | null
    cancerDiagnosisId: string | null
    oncologyCarePlanId: string | null
    hepaticAdjustmentGrade: string | null
    renalAdjustmentGrade: string | null
    status: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    secondVerifiedBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    administeredBy: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChemoOrderMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    encounterId: string | null
    protocolId: string | null
    orderingProvider: string | null
    cycleNumber: number | null
    dayNumber: number | null
    scheduledDate: Date | null
    administeredAt: Date | null
    bsa: Decimal | null
    weight: Decimal | null
    height: Decimal | null
    creatinineClearance: Decimal | null
    cancerDiagnosisId: string | null
    oncologyCarePlanId: string | null
    hepaticAdjustmentGrade: string | null
    renalAdjustmentGrade: string | null
    status: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    secondVerifiedBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    administeredBy: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChemoOrderCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    encounterId: number
    protocolId: number
    orderingProvider: number
    cycleNumber: number
    dayNumber: number
    scheduledDate: number
    administeredAt: number
    bsa: number
    weight: number
    height: number
    creatinineClearance: number
    cancerDiagnosisId: number
    oncologyCarePlanId: number
    hepaticAdjustmentGrade: number
    renalAdjustmentGrade: number
    doseAdjustments: number
    preChemoChecklist: number
    status: number
    verifiedBy: number
    verifiedAt: number
    secondVerifiedBy: number
    approvedBy: number
    approvedAt: number
    administeredBy: number
    adverseReactions: number
    administrationDetails: number
    drugPreparationDetails: number
    nurseVerificationChecklist: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChemoOrderAvgAggregateInputType = {
    cycleNumber?: true
    dayNumber?: true
    bsa?: true
    weight?: true
    height?: true
    creatinineClearance?: true
  }

  export type ChemoOrderSumAggregateInputType = {
    cycleNumber?: true
    dayNumber?: true
    bsa?: true
    weight?: true
    height?: true
    creatinineClearance?: true
  }

  export type ChemoOrderMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    protocolId?: true
    orderingProvider?: true
    cycleNumber?: true
    dayNumber?: true
    scheduledDate?: true
    administeredAt?: true
    bsa?: true
    weight?: true
    height?: true
    creatinineClearance?: true
    cancerDiagnosisId?: true
    oncologyCarePlanId?: true
    hepaticAdjustmentGrade?: true
    renalAdjustmentGrade?: true
    status?: true
    verifiedBy?: true
    verifiedAt?: true
    secondVerifiedBy?: true
    approvedBy?: true
    approvedAt?: true
    administeredBy?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChemoOrderMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    protocolId?: true
    orderingProvider?: true
    cycleNumber?: true
    dayNumber?: true
    scheduledDate?: true
    administeredAt?: true
    bsa?: true
    weight?: true
    height?: true
    creatinineClearance?: true
    cancerDiagnosisId?: true
    oncologyCarePlanId?: true
    hepaticAdjustmentGrade?: true
    renalAdjustmentGrade?: true
    status?: true
    verifiedBy?: true
    verifiedAt?: true
    secondVerifiedBy?: true
    approvedBy?: true
    approvedAt?: true
    administeredBy?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChemoOrderCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    encounterId?: true
    protocolId?: true
    orderingProvider?: true
    cycleNumber?: true
    dayNumber?: true
    scheduledDate?: true
    administeredAt?: true
    bsa?: true
    weight?: true
    height?: true
    creatinineClearance?: true
    cancerDiagnosisId?: true
    oncologyCarePlanId?: true
    hepaticAdjustmentGrade?: true
    renalAdjustmentGrade?: true
    doseAdjustments?: true
    preChemoChecklist?: true
    status?: true
    verifiedBy?: true
    verifiedAt?: true
    secondVerifiedBy?: true
    approvedBy?: true
    approvedAt?: true
    administeredBy?: true
    adverseReactions?: true
    administrationDetails?: true
    drugPreparationDetails?: true
    nurseVerificationChecklist?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChemoOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChemoOrder to aggregate.
     */
    where?: ChemoOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoOrders to fetch.
     */
    orderBy?: ChemoOrderOrderByWithRelationInput | ChemoOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChemoOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChemoOrders
    **/
    _count?: true | ChemoOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChemoOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChemoOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChemoOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChemoOrderMaxAggregateInputType
  }

  export type GetChemoOrderAggregateType<T extends ChemoOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateChemoOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChemoOrder[P]>
      : GetScalarType<T[P], AggregateChemoOrder[P]>
  }




  export type ChemoOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChemoOrderWhereInput
    orderBy?: ChemoOrderOrderByWithAggregationInput | ChemoOrderOrderByWithAggregationInput[]
    by: ChemoOrderScalarFieldEnum[] | ChemoOrderScalarFieldEnum
    having?: ChemoOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChemoOrderCountAggregateInputType | true
    _avg?: ChemoOrderAvgAggregateInputType
    _sum?: ChemoOrderSumAggregateInputType
    _min?: ChemoOrderMinAggregateInputType
    _max?: ChemoOrderMaxAggregateInputType
  }

  export type ChemoOrderGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    encounterId: string | null
    protocolId: string
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date
    administeredAt: Date | null
    bsa: Decimal | null
    weight: Decimal | null
    height: Decimal | null
    creatinineClearance: Decimal | null
    cancerDiagnosisId: string | null
    oncologyCarePlanId: string | null
    hepaticAdjustmentGrade: string | null
    renalAdjustmentGrade: string | null
    doseAdjustments: JsonValue
    preChemoChecklist: JsonValue
    status: string
    verifiedBy: string | null
    verifiedAt: Date | null
    secondVerifiedBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    administeredBy: string | null
    adverseReactions: JsonValue
    administrationDetails: JsonValue
    drugPreparationDetails: JsonValue
    nurseVerificationChecklist: JsonValue
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChemoOrderCountAggregateOutputType | null
    _avg: ChemoOrderAvgAggregateOutputType | null
    _sum: ChemoOrderSumAggregateOutputType | null
    _min: ChemoOrderMinAggregateOutputType | null
    _max: ChemoOrderMaxAggregateOutputType | null
  }

  type GetChemoOrderGroupByPayload<T extends ChemoOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChemoOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChemoOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChemoOrderGroupByOutputType[P]>
            : GetScalarType<T[P], ChemoOrderGroupByOutputType[P]>
        }
      >
    >


  export type ChemoOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    protocolId?: boolean
    orderingProvider?: boolean
    cycleNumber?: boolean
    dayNumber?: boolean
    scheduledDate?: boolean
    administeredAt?: boolean
    bsa?: boolean
    weight?: boolean
    height?: boolean
    creatinineClearance?: boolean
    cancerDiagnosisId?: boolean
    oncologyCarePlanId?: boolean
    hepaticAdjustmentGrade?: boolean
    renalAdjustmentGrade?: boolean
    doseAdjustments?: boolean
    preChemoChecklist?: boolean
    status?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    secondVerifiedBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    administeredBy?: boolean
    adverseReactions?: boolean
    administrationDetails?: boolean
    drugPreparationDetails?: boolean
    nurseVerificationChecklist?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chemoOrder"]>

  export type ChemoOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    protocolId?: boolean
    orderingProvider?: boolean
    cycleNumber?: boolean
    dayNumber?: boolean
    scheduledDate?: boolean
    administeredAt?: boolean
    bsa?: boolean
    weight?: boolean
    height?: boolean
    creatinineClearance?: boolean
    cancerDiagnosisId?: boolean
    oncologyCarePlanId?: boolean
    hepaticAdjustmentGrade?: boolean
    renalAdjustmentGrade?: boolean
    doseAdjustments?: boolean
    preChemoChecklist?: boolean
    status?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    secondVerifiedBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    administeredBy?: boolean
    adverseReactions?: boolean
    administrationDetails?: boolean
    drugPreparationDetails?: boolean
    nurseVerificationChecklist?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chemoOrder"]>

  export type ChemoOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    protocolId?: boolean
    orderingProvider?: boolean
    cycleNumber?: boolean
    dayNumber?: boolean
    scheduledDate?: boolean
    administeredAt?: boolean
    bsa?: boolean
    weight?: boolean
    height?: boolean
    creatinineClearance?: boolean
    cancerDiagnosisId?: boolean
    oncologyCarePlanId?: boolean
    hepaticAdjustmentGrade?: boolean
    renalAdjustmentGrade?: boolean
    doseAdjustments?: boolean
    preChemoChecklist?: boolean
    status?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    secondVerifiedBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    administeredBy?: boolean
    adverseReactions?: boolean
    administrationDetails?: boolean
    drugPreparationDetails?: boolean
    nurseVerificationChecklist?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chemoOrder"]>

  export type ChemoOrderSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    encounterId?: boolean
    protocolId?: boolean
    orderingProvider?: boolean
    cycleNumber?: boolean
    dayNumber?: boolean
    scheduledDate?: boolean
    administeredAt?: boolean
    bsa?: boolean
    weight?: boolean
    height?: boolean
    creatinineClearance?: boolean
    cancerDiagnosisId?: boolean
    oncologyCarePlanId?: boolean
    hepaticAdjustmentGrade?: boolean
    renalAdjustmentGrade?: boolean
    doseAdjustments?: boolean
    preChemoChecklist?: boolean
    status?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    secondVerifiedBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    administeredBy?: boolean
    adverseReactions?: boolean
    administrationDetails?: boolean
    drugPreparationDetails?: boolean
    nurseVerificationChecklist?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChemoOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "patientId" | "encounterId" | "protocolId" | "orderingProvider" | "cycleNumber" | "dayNumber" | "scheduledDate" | "administeredAt" | "bsa" | "weight" | "height" | "creatinineClearance" | "cancerDiagnosisId" | "oncologyCarePlanId" | "hepaticAdjustmentGrade" | "renalAdjustmentGrade" | "doseAdjustments" | "preChemoChecklist" | "status" | "verifiedBy" | "verifiedAt" | "secondVerifiedBy" | "approvedBy" | "approvedAt" | "administeredBy" | "adverseReactions" | "administrationDetails" | "drugPreparationDetails" | "nurseVerificationChecklist" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["chemoOrder"]>
  export type ChemoOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }
  export type ChemoOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }
  export type ChemoOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    protocol?: boolean | ChemoProtocolDefaultArgs<ExtArgs>
  }

  export type $ChemoOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChemoOrder"
    objects: {
      protocol: Prisma.$ChemoProtocolPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      encounterId: string | null
      protocolId: string
      orderingProvider: string
      cycleNumber: number
      dayNumber: number
      scheduledDate: Date
      administeredAt: Date | null
      bsa: Prisma.Decimal | null
      weight: Prisma.Decimal | null
      height: Prisma.Decimal | null
      creatinineClearance: Prisma.Decimal | null
      cancerDiagnosisId: string | null
      oncologyCarePlanId: string | null
      hepaticAdjustmentGrade: string | null
      renalAdjustmentGrade: string | null
      doseAdjustments: Prisma.JsonValue
      preChemoChecklist: Prisma.JsonValue
      status: string
      verifiedBy: string | null
      verifiedAt: Date | null
      secondVerifiedBy: string | null
      approvedBy: string | null
      approvedAt: Date | null
      administeredBy: string | null
      adverseReactions: Prisma.JsonValue
      administrationDetails: Prisma.JsonValue
      drugPreparationDetails: Prisma.JsonValue
      nurseVerificationChecklist: Prisma.JsonValue
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chemoOrder"]>
    composites: {}
  }

  type ChemoOrderGetPayload<S extends boolean | null | undefined | ChemoOrderDefaultArgs> = $Result.GetResult<Prisma.$ChemoOrderPayload, S>

  type ChemoOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChemoOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChemoOrderCountAggregateInputType | true
    }

  export interface ChemoOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChemoOrder'], meta: { name: 'ChemoOrder' } }
    /**
     * Find zero or one ChemoOrder that matches the filter.
     * @param {ChemoOrderFindUniqueArgs} args - Arguments to find a ChemoOrder
     * @example
     * // Get one ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChemoOrderFindUniqueArgs>(args: SelectSubset<T, ChemoOrderFindUniqueArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChemoOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChemoOrderFindUniqueOrThrowArgs} args - Arguments to find a ChemoOrder
     * @example
     * // Get one ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChemoOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, ChemoOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChemoOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderFindFirstArgs} args - Arguments to find a ChemoOrder
     * @example
     * // Get one ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChemoOrderFindFirstArgs>(args?: SelectSubset<T, ChemoOrderFindFirstArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChemoOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderFindFirstOrThrowArgs} args - Arguments to find a ChemoOrder
     * @example
     * // Get one ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChemoOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, ChemoOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChemoOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChemoOrders
     * const chemoOrders = await prisma.chemoOrder.findMany()
     * 
     * // Get first 10 ChemoOrders
     * const chemoOrders = await prisma.chemoOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chemoOrderWithIdOnly = await prisma.chemoOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChemoOrderFindManyArgs>(args?: SelectSubset<T, ChemoOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChemoOrder.
     * @param {ChemoOrderCreateArgs} args - Arguments to create a ChemoOrder.
     * @example
     * // Create one ChemoOrder
     * const ChemoOrder = await prisma.chemoOrder.create({
     *   data: {
     *     // ... data to create a ChemoOrder
     *   }
     * })
     * 
     */
    create<T extends ChemoOrderCreateArgs>(args: SelectSubset<T, ChemoOrderCreateArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChemoOrders.
     * @param {ChemoOrderCreateManyArgs} args - Arguments to create many ChemoOrders.
     * @example
     * // Create many ChemoOrders
     * const chemoOrder = await prisma.chemoOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChemoOrderCreateManyArgs>(args?: SelectSubset<T, ChemoOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChemoOrders and returns the data saved in the database.
     * @param {ChemoOrderCreateManyAndReturnArgs} args - Arguments to create many ChemoOrders.
     * @example
     * // Create many ChemoOrders
     * const chemoOrder = await prisma.chemoOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChemoOrders and only return the `id`
     * const chemoOrderWithIdOnly = await prisma.chemoOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChemoOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, ChemoOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChemoOrder.
     * @param {ChemoOrderDeleteArgs} args - Arguments to delete one ChemoOrder.
     * @example
     * // Delete one ChemoOrder
     * const ChemoOrder = await prisma.chemoOrder.delete({
     *   where: {
     *     // ... filter to delete one ChemoOrder
     *   }
     * })
     * 
     */
    delete<T extends ChemoOrderDeleteArgs>(args: SelectSubset<T, ChemoOrderDeleteArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChemoOrder.
     * @param {ChemoOrderUpdateArgs} args - Arguments to update one ChemoOrder.
     * @example
     * // Update one ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChemoOrderUpdateArgs>(args: SelectSubset<T, ChemoOrderUpdateArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChemoOrders.
     * @param {ChemoOrderDeleteManyArgs} args - Arguments to filter ChemoOrders to delete.
     * @example
     * // Delete a few ChemoOrders
     * const { count } = await prisma.chemoOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChemoOrderDeleteManyArgs>(args?: SelectSubset<T, ChemoOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChemoOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChemoOrders
     * const chemoOrder = await prisma.chemoOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChemoOrderUpdateManyArgs>(args: SelectSubset<T, ChemoOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChemoOrders and returns the data updated in the database.
     * @param {ChemoOrderUpdateManyAndReturnArgs} args - Arguments to update many ChemoOrders.
     * @example
     * // Update many ChemoOrders
     * const chemoOrder = await prisma.chemoOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChemoOrders and only return the `id`
     * const chemoOrderWithIdOnly = await prisma.chemoOrder.updateManyAndReturn({
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
    updateManyAndReturn<T extends ChemoOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, ChemoOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChemoOrder.
     * @param {ChemoOrderUpsertArgs} args - Arguments to update or create a ChemoOrder.
     * @example
     * // Update or create a ChemoOrder
     * const chemoOrder = await prisma.chemoOrder.upsert({
     *   create: {
     *     // ... data to create a ChemoOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChemoOrder we want to update
     *   }
     * })
     */
    upsert<T extends ChemoOrderUpsertArgs>(args: SelectSubset<T, ChemoOrderUpsertArgs<ExtArgs>>): Prisma__ChemoOrderClient<$Result.GetResult<Prisma.$ChemoOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChemoOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderCountArgs} args - Arguments to filter ChemoOrders to count.
     * @example
     * // Count the number of ChemoOrders
     * const count = await prisma.chemoOrder.count({
     *   where: {
     *     // ... the filter for the ChemoOrders we want to count
     *   }
     * })
    **/
    count<T extends ChemoOrderCountArgs>(
      args?: Subset<T, ChemoOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChemoOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChemoOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ChemoOrderAggregateArgs>(args: Subset<T, ChemoOrderAggregateArgs>): Prisma.PrismaPromise<GetChemoOrderAggregateType<T>>

    /**
     * Group by ChemoOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChemoOrderGroupByArgs} args - Group by arguments.
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
      T extends ChemoOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChemoOrderGroupByArgs['orderBy'] }
        : { orderBy?: ChemoOrderGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ChemoOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChemoOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChemoOrder model
   */
  readonly fields: ChemoOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChemoOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChemoOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    protocol<T extends ChemoProtocolDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChemoProtocolDefaultArgs<ExtArgs>>): Prisma__ChemoProtocolClient<$Result.GetResult<Prisma.$ChemoProtocolPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ChemoOrder model
   */
  interface ChemoOrderFieldRefs {
    readonly id: FieldRef<"ChemoOrder", 'String'>
    readonly tenantId: FieldRef<"ChemoOrder", 'String'>
    readonly patientId: FieldRef<"ChemoOrder", 'String'>
    readonly encounterId: FieldRef<"ChemoOrder", 'String'>
    readonly protocolId: FieldRef<"ChemoOrder", 'String'>
    readonly orderingProvider: FieldRef<"ChemoOrder", 'String'>
    readonly cycleNumber: FieldRef<"ChemoOrder", 'Int'>
    readonly dayNumber: FieldRef<"ChemoOrder", 'Int'>
    readonly scheduledDate: FieldRef<"ChemoOrder", 'DateTime'>
    readonly administeredAt: FieldRef<"ChemoOrder", 'DateTime'>
    readonly bsa: FieldRef<"ChemoOrder", 'Decimal'>
    readonly weight: FieldRef<"ChemoOrder", 'Decimal'>
    readonly height: FieldRef<"ChemoOrder", 'Decimal'>
    readonly creatinineClearance: FieldRef<"ChemoOrder", 'Decimal'>
    readonly cancerDiagnosisId: FieldRef<"ChemoOrder", 'String'>
    readonly oncologyCarePlanId: FieldRef<"ChemoOrder", 'String'>
    readonly hepaticAdjustmentGrade: FieldRef<"ChemoOrder", 'String'>
    readonly renalAdjustmentGrade: FieldRef<"ChemoOrder", 'String'>
    readonly doseAdjustments: FieldRef<"ChemoOrder", 'Json'>
    readonly preChemoChecklist: FieldRef<"ChemoOrder", 'Json'>
    readonly status: FieldRef<"ChemoOrder", 'String'>
    readonly verifiedBy: FieldRef<"ChemoOrder", 'String'>
    readonly verifiedAt: FieldRef<"ChemoOrder", 'DateTime'>
    readonly secondVerifiedBy: FieldRef<"ChemoOrder", 'String'>
    readonly approvedBy: FieldRef<"ChemoOrder", 'String'>
    readonly approvedAt: FieldRef<"ChemoOrder", 'DateTime'>
    readonly administeredBy: FieldRef<"ChemoOrder", 'String'>
    readonly adverseReactions: FieldRef<"ChemoOrder", 'Json'>
    readonly administrationDetails: FieldRef<"ChemoOrder", 'Json'>
    readonly drugPreparationDetails: FieldRef<"ChemoOrder", 'Json'>
    readonly nurseVerificationChecklist: FieldRef<"ChemoOrder", 'Json'>
    readonly notes: FieldRef<"ChemoOrder", 'String'>
    readonly createdAt: FieldRef<"ChemoOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"ChemoOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChemoOrder findUnique
   */
  export type ChemoOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter, which ChemoOrder to fetch.
     */
    where: ChemoOrderWhereUniqueInput
  }

  /**
   * ChemoOrder findUniqueOrThrow
   */
  export type ChemoOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter, which ChemoOrder to fetch.
     */
    where: ChemoOrderWhereUniqueInput
  }

  /**
   * ChemoOrder findFirst
   */
  export type ChemoOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter, which ChemoOrder to fetch.
     */
    where?: ChemoOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoOrders to fetch.
     */
    orderBy?: ChemoOrderOrderByWithRelationInput | ChemoOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChemoOrders.
     */
    cursor?: ChemoOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChemoOrders.
     */
    distinct?: ChemoOrderScalarFieldEnum | ChemoOrderScalarFieldEnum[]
  }

  /**
   * ChemoOrder findFirstOrThrow
   */
  export type ChemoOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter, which ChemoOrder to fetch.
     */
    where?: ChemoOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoOrders to fetch.
     */
    orderBy?: ChemoOrderOrderByWithRelationInput | ChemoOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChemoOrders.
     */
    cursor?: ChemoOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChemoOrders.
     */
    distinct?: ChemoOrderScalarFieldEnum | ChemoOrderScalarFieldEnum[]
  }

  /**
   * ChemoOrder findMany
   */
  export type ChemoOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter, which ChemoOrders to fetch.
     */
    where?: ChemoOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChemoOrders to fetch.
     */
    orderBy?: ChemoOrderOrderByWithRelationInput | ChemoOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChemoOrders.
     */
    cursor?: ChemoOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChemoOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChemoOrders.
     */
    skip?: number
    distinct?: ChemoOrderScalarFieldEnum | ChemoOrderScalarFieldEnum[]
  }

  /**
   * ChemoOrder create
   */
  export type ChemoOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a ChemoOrder.
     */
    data: XOR<ChemoOrderCreateInput, ChemoOrderUncheckedCreateInput>
  }

  /**
   * ChemoOrder createMany
   */
  export type ChemoOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChemoOrders.
     */
    data: ChemoOrderCreateManyInput | ChemoOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChemoOrder createManyAndReturn
   */
  export type ChemoOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * The data used to create many ChemoOrders.
     */
    data: ChemoOrderCreateManyInput | ChemoOrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChemoOrder update
   */
  export type ChemoOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a ChemoOrder.
     */
    data: XOR<ChemoOrderUpdateInput, ChemoOrderUncheckedUpdateInput>
    /**
     * Choose, which ChemoOrder to update.
     */
    where: ChemoOrderWhereUniqueInput
  }

  /**
   * ChemoOrder updateMany
   */
  export type ChemoOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChemoOrders.
     */
    data: XOR<ChemoOrderUpdateManyMutationInput, ChemoOrderUncheckedUpdateManyInput>
    /**
     * Filter which ChemoOrders to update
     */
    where?: ChemoOrderWhereInput
    /**
     * Limit how many ChemoOrders to update.
     */
    limit?: number
  }

  /**
   * ChemoOrder updateManyAndReturn
   */
  export type ChemoOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * The data used to update ChemoOrders.
     */
    data: XOR<ChemoOrderUpdateManyMutationInput, ChemoOrderUncheckedUpdateManyInput>
    /**
     * Filter which ChemoOrders to update
     */
    where?: ChemoOrderWhereInput
    /**
     * Limit how many ChemoOrders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChemoOrder upsert
   */
  export type ChemoOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the ChemoOrder to update in case it exists.
     */
    where: ChemoOrderWhereUniqueInput
    /**
     * In case the ChemoOrder found by the `where` argument doesn't exist, create a new ChemoOrder with this data.
     */
    create: XOR<ChemoOrderCreateInput, ChemoOrderUncheckedCreateInput>
    /**
     * In case the ChemoOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChemoOrderUpdateInput, ChemoOrderUncheckedUpdateInput>
  }

  /**
   * ChemoOrder delete
   */
  export type ChemoOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
    /**
     * Filter which ChemoOrder to delete.
     */
    where: ChemoOrderWhereUniqueInput
  }

  /**
   * ChemoOrder deleteMany
   */
  export type ChemoOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChemoOrders to delete
     */
    where?: ChemoOrderWhereInput
    /**
     * Limit how many ChemoOrders to delete.
     */
    limit?: number
  }

  /**
   * ChemoOrder without action
   */
  export type ChemoOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChemoOrder
     */
    select?: ChemoOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChemoOrder
     */
    omit?: ChemoOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChemoOrderInclude<ExtArgs> | null
  }


  /**
   * Model TumorBoardCase
   */

  export type AggregateTumorBoardCase = {
    _count: TumorBoardCaseCountAggregateOutputType | null
    _min: TumorBoardCaseMinAggregateOutputType | null
    _max: TumorBoardCaseMaxAggregateOutputType | null
  }

  export type TumorBoardCaseMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    cancerDiagnosisId: string | null
    stagingId: string | null
    meetingDate: Date | null
    presentedBy: string | null
    clinicalSummary: string | null
    imagingFindings: string | null
    pathologyReport: string | null
    molecularProfile: string | null
    mdtRecommendation: string | null
    treatmentIntent: string | null
    decision: string | null
    reviewOutcome: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumorBoardCaseMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    cancerDiagnosisId: string | null
    stagingId: string | null
    meetingDate: Date | null
    presentedBy: string | null
    clinicalSummary: string | null
    imagingFindings: string | null
    pathologyReport: string | null
    molecularProfile: string | null
    mdtRecommendation: string | null
    treatmentIntent: string | null
    decision: string | null
    reviewOutcome: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TumorBoardCaseCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    cancerDiagnosisId: number
    stagingId: number
    meetingDate: number
    presentedBy: number
    attendees: number
    clinicalSummary: number
    imagingFindings: number
    pathologyReport: number
    molecularProfile: number
    mdtRecommendation: number
    treatmentIntent: number
    recommendedPathway: number
    treatmentPlan: number
    decision: number
    reviewOutcome: number
    followUpActions: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TumorBoardCaseMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    stagingId?: true
    meetingDate?: true
    presentedBy?: true
    clinicalSummary?: true
    imagingFindings?: true
    pathologyReport?: true
    molecularProfile?: true
    mdtRecommendation?: true
    treatmentIntent?: true
    decision?: true
    reviewOutcome?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumorBoardCaseMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    stagingId?: true
    meetingDate?: true
    presentedBy?: true
    clinicalSummary?: true
    imagingFindings?: true
    pathologyReport?: true
    molecularProfile?: true
    mdtRecommendation?: true
    treatmentIntent?: true
    decision?: true
    reviewOutcome?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TumorBoardCaseCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    stagingId?: true
    meetingDate?: true
    presentedBy?: true
    attendees?: true
    clinicalSummary?: true
    imagingFindings?: true
    pathologyReport?: true
    molecularProfile?: true
    mdtRecommendation?: true
    treatmentIntent?: true
    recommendedPathway?: true
    treatmentPlan?: true
    decision?: true
    reviewOutcome?: true
    followUpActions?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TumorBoardCaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumorBoardCase to aggregate.
     */
    where?: TumorBoardCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorBoardCases to fetch.
     */
    orderBy?: TumorBoardCaseOrderByWithRelationInput | TumorBoardCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TumorBoardCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorBoardCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorBoardCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TumorBoardCases
    **/
    _count?: true | TumorBoardCaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TumorBoardCaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TumorBoardCaseMaxAggregateInputType
  }

  export type GetTumorBoardCaseAggregateType<T extends TumorBoardCaseAggregateArgs> = {
        [P in keyof T & keyof AggregateTumorBoardCase]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTumorBoardCase[P]>
      : GetScalarType<T[P], AggregateTumorBoardCase[P]>
  }




  export type TumorBoardCaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TumorBoardCaseWhereInput
    orderBy?: TumorBoardCaseOrderByWithAggregationInput | TumorBoardCaseOrderByWithAggregationInput[]
    by: TumorBoardCaseScalarFieldEnum[] | TumorBoardCaseScalarFieldEnum
    having?: TumorBoardCaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TumorBoardCaseCountAggregateInputType | true
    _min?: TumorBoardCaseMinAggregateInputType
    _max?: TumorBoardCaseMaxAggregateInputType
  }

  export type TumorBoardCaseGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    stagingId: string | null
    meetingDate: Date
    presentedBy: string
    attendees: JsonValue
    clinicalSummary: string | null
    imagingFindings: string | null
    pathologyReport: string | null
    molecularProfile: string | null
    mdtRecommendation: string | null
    treatmentIntent: string | null
    recommendedPathway: JsonValue
    treatmentPlan: JsonValue
    decision: string | null
    reviewOutcome: string | null
    followUpActions: JsonValue
    status: string
    createdAt: Date
    updatedAt: Date
    _count: TumorBoardCaseCountAggregateOutputType | null
    _min: TumorBoardCaseMinAggregateOutputType | null
    _max: TumorBoardCaseMaxAggregateOutputType | null
  }

  type GetTumorBoardCaseGroupByPayload<T extends TumorBoardCaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TumorBoardCaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TumorBoardCaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TumorBoardCaseGroupByOutputType[P]>
            : GetScalarType<T[P], TumorBoardCaseGroupByOutputType[P]>
        }
      >
    >


  export type TumorBoardCaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    stagingId?: boolean
    meetingDate?: boolean
    presentedBy?: boolean
    attendees?: boolean
    clinicalSummary?: boolean
    imagingFindings?: boolean
    pathologyReport?: boolean
    molecularProfile?: boolean
    mdtRecommendation?: boolean
    treatmentIntent?: boolean
    recommendedPathway?: boolean
    treatmentPlan?: boolean
    decision?: boolean
    reviewOutcome?: boolean
    followUpActions?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorBoardCase"]>

  export type TumorBoardCaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    stagingId?: boolean
    meetingDate?: boolean
    presentedBy?: boolean
    attendees?: boolean
    clinicalSummary?: boolean
    imagingFindings?: boolean
    pathologyReport?: boolean
    molecularProfile?: boolean
    mdtRecommendation?: boolean
    treatmentIntent?: boolean
    recommendedPathway?: boolean
    treatmentPlan?: boolean
    decision?: boolean
    reviewOutcome?: boolean
    followUpActions?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorBoardCase"]>

  export type TumorBoardCaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    stagingId?: boolean
    meetingDate?: boolean
    presentedBy?: boolean
    attendees?: boolean
    clinicalSummary?: boolean
    imagingFindings?: boolean
    pathologyReport?: boolean
    molecularProfile?: boolean
    mdtRecommendation?: boolean
    treatmentIntent?: boolean
    recommendedPathway?: boolean
    treatmentPlan?: boolean
    decision?: boolean
    reviewOutcome?: boolean
    followUpActions?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tumorBoardCase"]>

  export type TumorBoardCaseSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    stagingId?: boolean
    meetingDate?: boolean
    presentedBy?: boolean
    attendees?: boolean
    clinicalSummary?: boolean
    imagingFindings?: boolean
    pathologyReport?: boolean
    molecularProfile?: boolean
    mdtRecommendation?: boolean
    treatmentIntent?: boolean
    recommendedPathway?: boolean
    treatmentPlan?: boolean
    decision?: boolean
    reviewOutcome?: boolean
    followUpActions?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TumorBoardCaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "patientId" | "cancerDiagnosisId" | "stagingId" | "meetingDate" | "presentedBy" | "attendees" | "clinicalSummary" | "imagingFindings" | "pathologyReport" | "molecularProfile" | "mdtRecommendation" | "treatmentIntent" | "recommendedPathway" | "treatmentPlan" | "decision" | "reviewOutcome" | "followUpActions" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["tumorBoardCase"]>
  export type TumorBoardCaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type TumorBoardCaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type TumorBoardCaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }

  export type $TumorBoardCasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TumorBoardCase"
    objects: {
      cancerDiagnosis: Prisma.$CancerDiagnosisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      cancerDiagnosisId: string
      stagingId: string | null
      meetingDate: Date
      presentedBy: string
      attendees: Prisma.JsonValue
      clinicalSummary: string | null
      imagingFindings: string | null
      pathologyReport: string | null
      molecularProfile: string | null
      mdtRecommendation: string | null
      treatmentIntent: string | null
      recommendedPathway: Prisma.JsonValue
      treatmentPlan: Prisma.JsonValue
      decision: string | null
      reviewOutcome: string | null
      followUpActions: Prisma.JsonValue
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tumorBoardCase"]>
    composites: {}
  }

  type TumorBoardCaseGetPayload<S extends boolean | null | undefined | TumorBoardCaseDefaultArgs> = $Result.GetResult<Prisma.$TumorBoardCasePayload, S>

  type TumorBoardCaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TumorBoardCaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TumorBoardCaseCountAggregateInputType | true
    }

  export interface TumorBoardCaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TumorBoardCase'], meta: { name: 'TumorBoardCase' } }
    /**
     * Find zero or one TumorBoardCase that matches the filter.
     * @param {TumorBoardCaseFindUniqueArgs} args - Arguments to find a TumorBoardCase
     * @example
     * // Get one TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TumorBoardCaseFindUniqueArgs>(args: SelectSubset<T, TumorBoardCaseFindUniqueArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TumorBoardCase that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TumorBoardCaseFindUniqueOrThrowArgs} args - Arguments to find a TumorBoardCase
     * @example
     * // Get one TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TumorBoardCaseFindUniqueOrThrowArgs>(args: SelectSubset<T, TumorBoardCaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumorBoardCase that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseFindFirstArgs} args - Arguments to find a TumorBoardCase
     * @example
     * // Get one TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TumorBoardCaseFindFirstArgs>(args?: SelectSubset<T, TumorBoardCaseFindFirstArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TumorBoardCase that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseFindFirstOrThrowArgs} args - Arguments to find a TumorBoardCase
     * @example
     * // Get one TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TumorBoardCaseFindFirstOrThrowArgs>(args?: SelectSubset<T, TumorBoardCaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TumorBoardCases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TumorBoardCases
     * const tumorBoardCases = await prisma.tumorBoardCase.findMany()
     * 
     * // Get first 10 TumorBoardCases
     * const tumorBoardCases = await prisma.tumorBoardCase.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tumorBoardCaseWithIdOnly = await prisma.tumorBoardCase.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TumorBoardCaseFindManyArgs>(args?: SelectSubset<T, TumorBoardCaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TumorBoardCase.
     * @param {TumorBoardCaseCreateArgs} args - Arguments to create a TumorBoardCase.
     * @example
     * // Create one TumorBoardCase
     * const TumorBoardCase = await prisma.tumorBoardCase.create({
     *   data: {
     *     // ... data to create a TumorBoardCase
     *   }
     * })
     * 
     */
    create<T extends TumorBoardCaseCreateArgs>(args: SelectSubset<T, TumorBoardCaseCreateArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TumorBoardCases.
     * @param {TumorBoardCaseCreateManyArgs} args - Arguments to create many TumorBoardCases.
     * @example
     * // Create many TumorBoardCases
     * const tumorBoardCase = await prisma.tumorBoardCase.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TumorBoardCaseCreateManyArgs>(args?: SelectSubset<T, TumorBoardCaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TumorBoardCases and returns the data saved in the database.
     * @param {TumorBoardCaseCreateManyAndReturnArgs} args - Arguments to create many TumorBoardCases.
     * @example
     * // Create many TumorBoardCases
     * const tumorBoardCase = await prisma.tumorBoardCase.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TumorBoardCases and only return the `id`
     * const tumorBoardCaseWithIdOnly = await prisma.tumorBoardCase.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TumorBoardCaseCreateManyAndReturnArgs>(args?: SelectSubset<T, TumorBoardCaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TumorBoardCase.
     * @param {TumorBoardCaseDeleteArgs} args - Arguments to delete one TumorBoardCase.
     * @example
     * // Delete one TumorBoardCase
     * const TumorBoardCase = await prisma.tumorBoardCase.delete({
     *   where: {
     *     // ... filter to delete one TumorBoardCase
     *   }
     * })
     * 
     */
    delete<T extends TumorBoardCaseDeleteArgs>(args: SelectSubset<T, TumorBoardCaseDeleteArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TumorBoardCase.
     * @param {TumorBoardCaseUpdateArgs} args - Arguments to update one TumorBoardCase.
     * @example
     * // Update one TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TumorBoardCaseUpdateArgs>(args: SelectSubset<T, TumorBoardCaseUpdateArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TumorBoardCases.
     * @param {TumorBoardCaseDeleteManyArgs} args - Arguments to filter TumorBoardCases to delete.
     * @example
     * // Delete a few TumorBoardCases
     * const { count } = await prisma.tumorBoardCase.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TumorBoardCaseDeleteManyArgs>(args?: SelectSubset<T, TumorBoardCaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumorBoardCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TumorBoardCases
     * const tumorBoardCase = await prisma.tumorBoardCase.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TumorBoardCaseUpdateManyArgs>(args: SelectSubset<T, TumorBoardCaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TumorBoardCases and returns the data updated in the database.
     * @param {TumorBoardCaseUpdateManyAndReturnArgs} args - Arguments to update many TumorBoardCases.
     * @example
     * // Update many TumorBoardCases
     * const tumorBoardCase = await prisma.tumorBoardCase.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TumorBoardCases and only return the `id`
     * const tumorBoardCaseWithIdOnly = await prisma.tumorBoardCase.updateManyAndReturn({
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
    updateManyAndReturn<T extends TumorBoardCaseUpdateManyAndReturnArgs>(args: SelectSubset<T, TumorBoardCaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TumorBoardCase.
     * @param {TumorBoardCaseUpsertArgs} args - Arguments to update or create a TumorBoardCase.
     * @example
     * // Update or create a TumorBoardCase
     * const tumorBoardCase = await prisma.tumorBoardCase.upsert({
     *   create: {
     *     // ... data to create a TumorBoardCase
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TumorBoardCase we want to update
     *   }
     * })
     */
    upsert<T extends TumorBoardCaseUpsertArgs>(args: SelectSubset<T, TumorBoardCaseUpsertArgs<ExtArgs>>): Prisma__TumorBoardCaseClient<$Result.GetResult<Prisma.$TumorBoardCasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TumorBoardCases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseCountArgs} args - Arguments to filter TumorBoardCases to count.
     * @example
     * // Count the number of TumorBoardCases
     * const count = await prisma.tumorBoardCase.count({
     *   where: {
     *     // ... the filter for the TumorBoardCases we want to count
     *   }
     * })
    **/
    count<T extends TumorBoardCaseCountArgs>(
      args?: Subset<T, TumorBoardCaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TumorBoardCaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TumorBoardCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TumorBoardCaseAggregateArgs>(args: Subset<T, TumorBoardCaseAggregateArgs>): Prisma.PrismaPromise<GetTumorBoardCaseAggregateType<T>>

    /**
     * Group by TumorBoardCase.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TumorBoardCaseGroupByArgs} args - Group by arguments.
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
      T extends TumorBoardCaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TumorBoardCaseGroupByArgs['orderBy'] }
        : { orderBy?: TumorBoardCaseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TumorBoardCaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTumorBoardCaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TumorBoardCase model
   */
  readonly fields: TumorBoardCaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TumorBoardCase.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TumorBoardCaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cancerDiagnosis<T extends CancerDiagnosisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosisDefaultArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TumorBoardCase model
   */
  interface TumorBoardCaseFieldRefs {
    readonly id: FieldRef<"TumorBoardCase", 'String'>
    readonly tenantId: FieldRef<"TumorBoardCase", 'String'>
    readonly patientId: FieldRef<"TumorBoardCase", 'String'>
    readonly cancerDiagnosisId: FieldRef<"TumorBoardCase", 'String'>
    readonly stagingId: FieldRef<"TumorBoardCase", 'String'>
    readonly meetingDate: FieldRef<"TumorBoardCase", 'DateTime'>
    readonly presentedBy: FieldRef<"TumorBoardCase", 'String'>
    readonly attendees: FieldRef<"TumorBoardCase", 'Json'>
    readonly clinicalSummary: FieldRef<"TumorBoardCase", 'String'>
    readonly imagingFindings: FieldRef<"TumorBoardCase", 'String'>
    readonly pathologyReport: FieldRef<"TumorBoardCase", 'String'>
    readonly molecularProfile: FieldRef<"TumorBoardCase", 'String'>
    readonly mdtRecommendation: FieldRef<"TumorBoardCase", 'String'>
    readonly treatmentIntent: FieldRef<"TumorBoardCase", 'String'>
    readonly recommendedPathway: FieldRef<"TumorBoardCase", 'Json'>
    readonly treatmentPlan: FieldRef<"TumorBoardCase", 'Json'>
    readonly decision: FieldRef<"TumorBoardCase", 'String'>
    readonly reviewOutcome: FieldRef<"TumorBoardCase", 'String'>
    readonly followUpActions: FieldRef<"TumorBoardCase", 'Json'>
    readonly status: FieldRef<"TumorBoardCase", 'String'>
    readonly createdAt: FieldRef<"TumorBoardCase", 'DateTime'>
    readonly updatedAt: FieldRef<"TumorBoardCase", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TumorBoardCase findUnique
   */
  export type TumorBoardCaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter, which TumorBoardCase to fetch.
     */
    where: TumorBoardCaseWhereUniqueInput
  }

  /**
   * TumorBoardCase findUniqueOrThrow
   */
  export type TumorBoardCaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter, which TumorBoardCase to fetch.
     */
    where: TumorBoardCaseWhereUniqueInput
  }

  /**
   * TumorBoardCase findFirst
   */
  export type TumorBoardCaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter, which TumorBoardCase to fetch.
     */
    where?: TumorBoardCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorBoardCases to fetch.
     */
    orderBy?: TumorBoardCaseOrderByWithRelationInput | TumorBoardCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumorBoardCases.
     */
    cursor?: TumorBoardCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorBoardCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorBoardCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumorBoardCases.
     */
    distinct?: TumorBoardCaseScalarFieldEnum | TumorBoardCaseScalarFieldEnum[]
  }

  /**
   * TumorBoardCase findFirstOrThrow
   */
  export type TumorBoardCaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter, which TumorBoardCase to fetch.
     */
    where?: TumorBoardCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorBoardCases to fetch.
     */
    orderBy?: TumorBoardCaseOrderByWithRelationInput | TumorBoardCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TumorBoardCases.
     */
    cursor?: TumorBoardCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorBoardCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorBoardCases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TumorBoardCases.
     */
    distinct?: TumorBoardCaseScalarFieldEnum | TumorBoardCaseScalarFieldEnum[]
  }

  /**
   * TumorBoardCase findMany
   */
  export type TumorBoardCaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter, which TumorBoardCases to fetch.
     */
    where?: TumorBoardCaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TumorBoardCases to fetch.
     */
    orderBy?: TumorBoardCaseOrderByWithRelationInput | TumorBoardCaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TumorBoardCases.
     */
    cursor?: TumorBoardCaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TumorBoardCases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TumorBoardCases.
     */
    skip?: number
    distinct?: TumorBoardCaseScalarFieldEnum | TumorBoardCaseScalarFieldEnum[]
  }

  /**
   * TumorBoardCase create
   */
  export type TumorBoardCaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * The data needed to create a TumorBoardCase.
     */
    data: XOR<TumorBoardCaseCreateInput, TumorBoardCaseUncheckedCreateInput>
  }

  /**
   * TumorBoardCase createMany
   */
  export type TumorBoardCaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TumorBoardCases.
     */
    data: TumorBoardCaseCreateManyInput | TumorBoardCaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TumorBoardCase createManyAndReturn
   */
  export type TumorBoardCaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * The data used to create many TumorBoardCases.
     */
    data: TumorBoardCaseCreateManyInput | TumorBoardCaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TumorBoardCase update
   */
  export type TumorBoardCaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * The data needed to update a TumorBoardCase.
     */
    data: XOR<TumorBoardCaseUpdateInput, TumorBoardCaseUncheckedUpdateInput>
    /**
     * Choose, which TumorBoardCase to update.
     */
    where: TumorBoardCaseWhereUniqueInput
  }

  /**
   * TumorBoardCase updateMany
   */
  export type TumorBoardCaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TumorBoardCases.
     */
    data: XOR<TumorBoardCaseUpdateManyMutationInput, TumorBoardCaseUncheckedUpdateManyInput>
    /**
     * Filter which TumorBoardCases to update
     */
    where?: TumorBoardCaseWhereInput
    /**
     * Limit how many TumorBoardCases to update.
     */
    limit?: number
  }

  /**
   * TumorBoardCase updateManyAndReturn
   */
  export type TumorBoardCaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * The data used to update TumorBoardCases.
     */
    data: XOR<TumorBoardCaseUpdateManyMutationInput, TumorBoardCaseUncheckedUpdateManyInput>
    /**
     * Filter which TumorBoardCases to update
     */
    where?: TumorBoardCaseWhereInput
    /**
     * Limit how many TumorBoardCases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TumorBoardCase upsert
   */
  export type TumorBoardCaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * The filter to search for the TumorBoardCase to update in case it exists.
     */
    where: TumorBoardCaseWhereUniqueInput
    /**
     * In case the TumorBoardCase found by the `where` argument doesn't exist, create a new TumorBoardCase with this data.
     */
    create: XOR<TumorBoardCaseCreateInput, TumorBoardCaseUncheckedCreateInput>
    /**
     * In case the TumorBoardCase was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TumorBoardCaseUpdateInput, TumorBoardCaseUncheckedUpdateInput>
  }

  /**
   * TumorBoardCase delete
   */
  export type TumorBoardCaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
    /**
     * Filter which TumorBoardCase to delete.
     */
    where: TumorBoardCaseWhereUniqueInput
  }

  /**
   * TumorBoardCase deleteMany
   */
  export type TumorBoardCaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TumorBoardCases to delete
     */
    where?: TumorBoardCaseWhereInput
    /**
     * Limit how many TumorBoardCases to delete.
     */
    limit?: number
  }

  /**
   * TumorBoardCase without action
   */
  export type TumorBoardCaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TumorBoardCase
     */
    select?: TumorBoardCaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TumorBoardCase
     */
    omit?: TumorBoardCaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TumorBoardCaseInclude<ExtArgs> | null
  }


  /**
   * Model OncologyCancerTypeMaster
   */

  export type AggregateOncologyCancerTypeMaster = {
    _count: OncologyCancerTypeMasterCountAggregateOutputType | null
    _min: OncologyCancerTypeMasterMinAggregateOutputType | null
    _max: OncologyCancerTypeMasterMaxAggregateOutputType | null
  }

  export type OncologyCancerTypeMasterMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    category: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCancerTypeMasterMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    category: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCancerTypeMasterCountAggregateOutputType = {
    id: number
    tenantId: number
    code: number
    name: number
    category: number
    description: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OncologyCancerTypeMasterMinAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    category?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCancerTypeMasterMaxAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    category?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCancerTypeMasterCountAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    category?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OncologyCancerTypeMasterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCancerTypeMaster to aggregate.
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeMasters to fetch.
     */
    orderBy?: OncologyCancerTypeMasterOrderByWithRelationInput | OncologyCancerTypeMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OncologyCancerTypeMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OncologyCancerTypeMasters
    **/
    _count?: true | OncologyCancerTypeMasterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OncologyCancerTypeMasterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OncologyCancerTypeMasterMaxAggregateInputType
  }

  export type GetOncologyCancerTypeMasterAggregateType<T extends OncologyCancerTypeMasterAggregateArgs> = {
        [P in keyof T & keyof AggregateOncologyCancerTypeMaster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOncologyCancerTypeMaster[P]>
      : GetScalarType<T[P], AggregateOncologyCancerTypeMaster[P]>
  }




  export type OncologyCancerTypeMasterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCancerTypeMasterWhereInput
    orderBy?: OncologyCancerTypeMasterOrderByWithAggregationInput | OncologyCancerTypeMasterOrderByWithAggregationInput[]
    by: OncologyCancerTypeMasterScalarFieldEnum[] | OncologyCancerTypeMasterScalarFieldEnum
    having?: OncologyCancerTypeMasterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OncologyCancerTypeMasterCountAggregateInputType | true
    _min?: OncologyCancerTypeMasterMinAggregateInputType
    _max?: OncologyCancerTypeMasterMaxAggregateInputType
  }

  export type OncologyCancerTypeMasterGroupByOutputType = {
    id: string
    tenantId: string
    code: string
    name: string
    category: string | null
    description: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: OncologyCancerTypeMasterCountAggregateOutputType | null
    _min: OncologyCancerTypeMasterMinAggregateOutputType | null
    _max: OncologyCancerTypeMasterMaxAggregateOutputType | null
  }

  type GetOncologyCancerTypeMasterGroupByPayload<T extends OncologyCancerTypeMasterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OncologyCancerTypeMasterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OncologyCancerTypeMasterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OncologyCancerTypeMasterGroupByOutputType[P]>
            : GetScalarType<T[P], OncologyCancerTypeMasterGroupByOutputType[P]>
        }
      >
    >


  export type OncologyCancerTypeMasterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    siteMappings?: boolean | OncologyCancerTypeMaster$siteMappingsArgs<ExtArgs>
    _count?: boolean | OncologyCancerTypeMasterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCancerTypeMaster"]>

  export type OncologyCancerTypeMasterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyCancerTypeMaster"]>

  export type OncologyCancerTypeMasterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyCancerTypeMaster"]>

  export type OncologyCancerTypeMasterSelectScalar = {
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    category?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OncologyCancerTypeMasterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "code" | "name" | "category" | "description" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["oncologyCancerTypeMaster"]>
  export type OncologyCancerTypeMasterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteMappings?: boolean | OncologyCancerTypeMaster$siteMappingsArgs<ExtArgs>
    _count?: boolean | OncologyCancerTypeMasterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OncologyCancerTypeMasterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OncologyCancerTypeMasterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OncologyCancerTypeMasterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OncologyCancerTypeMaster"
    objects: {
      siteMappings: Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      code: string
      name: string
      category: string | null
      description: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oncologyCancerTypeMaster"]>
    composites: {}
  }

  type OncologyCancerTypeMasterGetPayload<S extends boolean | null | undefined | OncologyCancerTypeMasterDefaultArgs> = $Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload, S>

  type OncologyCancerTypeMasterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OncologyCancerTypeMasterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OncologyCancerTypeMasterCountAggregateInputType | true
    }

  export interface OncologyCancerTypeMasterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OncologyCancerTypeMaster'], meta: { name: 'OncologyCancerTypeMaster' } }
    /**
     * Find zero or one OncologyCancerTypeMaster that matches the filter.
     * @param {OncologyCancerTypeMasterFindUniqueArgs} args - Arguments to find a OncologyCancerTypeMaster
     * @example
     * // Get one OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OncologyCancerTypeMasterFindUniqueArgs>(args: SelectSubset<T, OncologyCancerTypeMasterFindUniqueArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OncologyCancerTypeMaster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OncologyCancerTypeMasterFindUniqueOrThrowArgs} args - Arguments to find a OncologyCancerTypeMaster
     * @example
     * // Get one OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OncologyCancerTypeMasterFindUniqueOrThrowArgs>(args: SelectSubset<T, OncologyCancerTypeMasterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCancerTypeMaster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterFindFirstArgs} args - Arguments to find a OncologyCancerTypeMaster
     * @example
     * // Get one OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OncologyCancerTypeMasterFindFirstArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterFindFirstArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCancerTypeMaster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterFindFirstOrThrowArgs} args - Arguments to find a OncologyCancerTypeMaster
     * @example
     * // Get one OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OncologyCancerTypeMasterFindFirstOrThrowArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterFindFirstOrThrowArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OncologyCancerTypeMasters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OncologyCancerTypeMasters
     * const oncologyCancerTypeMasters = await prisma.oncologyCancerTypeMaster.findMany()
     * 
     * // Get first 10 OncologyCancerTypeMasters
     * const oncologyCancerTypeMasters = await prisma.oncologyCancerTypeMaster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oncologyCancerTypeMasterWithIdOnly = await prisma.oncologyCancerTypeMaster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OncologyCancerTypeMasterFindManyArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OncologyCancerTypeMaster.
     * @param {OncologyCancerTypeMasterCreateArgs} args - Arguments to create a OncologyCancerTypeMaster.
     * @example
     * // Create one OncologyCancerTypeMaster
     * const OncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.create({
     *   data: {
     *     // ... data to create a OncologyCancerTypeMaster
     *   }
     * })
     * 
     */
    create<T extends OncologyCancerTypeMasterCreateArgs>(args: SelectSubset<T, OncologyCancerTypeMasterCreateArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OncologyCancerTypeMasters.
     * @param {OncologyCancerTypeMasterCreateManyArgs} args - Arguments to create many OncologyCancerTypeMasters.
     * @example
     * // Create many OncologyCancerTypeMasters
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OncologyCancerTypeMasterCreateManyArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OncologyCancerTypeMasters and returns the data saved in the database.
     * @param {OncologyCancerTypeMasterCreateManyAndReturnArgs} args - Arguments to create many OncologyCancerTypeMasters.
     * @example
     * // Create many OncologyCancerTypeMasters
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OncologyCancerTypeMasters and only return the `id`
     * const oncologyCancerTypeMasterWithIdOnly = await prisma.oncologyCancerTypeMaster.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OncologyCancerTypeMasterCreateManyAndReturnArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OncologyCancerTypeMaster.
     * @param {OncologyCancerTypeMasterDeleteArgs} args - Arguments to delete one OncologyCancerTypeMaster.
     * @example
     * // Delete one OncologyCancerTypeMaster
     * const OncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.delete({
     *   where: {
     *     // ... filter to delete one OncologyCancerTypeMaster
     *   }
     * })
     * 
     */
    delete<T extends OncologyCancerTypeMasterDeleteArgs>(args: SelectSubset<T, OncologyCancerTypeMasterDeleteArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OncologyCancerTypeMaster.
     * @param {OncologyCancerTypeMasterUpdateArgs} args - Arguments to update one OncologyCancerTypeMaster.
     * @example
     * // Update one OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OncologyCancerTypeMasterUpdateArgs>(args: SelectSubset<T, OncologyCancerTypeMasterUpdateArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OncologyCancerTypeMasters.
     * @param {OncologyCancerTypeMasterDeleteManyArgs} args - Arguments to filter OncologyCancerTypeMasters to delete.
     * @example
     * // Delete a few OncologyCancerTypeMasters
     * const { count } = await prisma.oncologyCancerTypeMaster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OncologyCancerTypeMasterDeleteManyArgs>(args?: SelectSubset<T, OncologyCancerTypeMasterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCancerTypeMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OncologyCancerTypeMasters
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OncologyCancerTypeMasterUpdateManyArgs>(args: SelectSubset<T, OncologyCancerTypeMasterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCancerTypeMasters and returns the data updated in the database.
     * @param {OncologyCancerTypeMasterUpdateManyAndReturnArgs} args - Arguments to update many OncologyCancerTypeMasters.
     * @example
     * // Update many OncologyCancerTypeMasters
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OncologyCancerTypeMasters and only return the `id`
     * const oncologyCancerTypeMasterWithIdOnly = await prisma.oncologyCancerTypeMaster.updateManyAndReturn({
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
    updateManyAndReturn<T extends OncologyCancerTypeMasterUpdateManyAndReturnArgs>(args: SelectSubset<T, OncologyCancerTypeMasterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OncologyCancerTypeMaster.
     * @param {OncologyCancerTypeMasterUpsertArgs} args - Arguments to update or create a OncologyCancerTypeMaster.
     * @example
     * // Update or create a OncologyCancerTypeMaster
     * const oncologyCancerTypeMaster = await prisma.oncologyCancerTypeMaster.upsert({
     *   create: {
     *     // ... data to create a OncologyCancerTypeMaster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OncologyCancerTypeMaster we want to update
     *   }
     * })
     */
    upsert<T extends OncologyCancerTypeMasterUpsertArgs>(args: SelectSubset<T, OncologyCancerTypeMasterUpsertArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OncologyCancerTypeMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterCountArgs} args - Arguments to filter OncologyCancerTypeMasters to count.
     * @example
     * // Count the number of OncologyCancerTypeMasters
     * const count = await prisma.oncologyCancerTypeMaster.count({
     *   where: {
     *     // ... the filter for the OncologyCancerTypeMasters we want to count
     *   }
     * })
    **/
    count<T extends OncologyCancerTypeMasterCountArgs>(
      args?: Subset<T, OncologyCancerTypeMasterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OncologyCancerTypeMasterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OncologyCancerTypeMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OncologyCancerTypeMasterAggregateArgs>(args: Subset<T, OncologyCancerTypeMasterAggregateArgs>): Prisma.PrismaPromise<GetOncologyCancerTypeMasterAggregateType<T>>

    /**
     * Group by OncologyCancerTypeMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeMasterGroupByArgs} args - Group by arguments.
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
      T extends OncologyCancerTypeMasterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OncologyCancerTypeMasterGroupByArgs['orderBy'] }
        : { orderBy?: OncologyCancerTypeMasterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OncologyCancerTypeMasterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOncologyCancerTypeMasterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OncologyCancerTypeMaster model
   */
  readonly fields: OncologyCancerTypeMasterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OncologyCancerTypeMaster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OncologyCancerTypeMasterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    siteMappings<T extends OncologyCancerTypeMaster$siteMappingsArgs<ExtArgs> = {}>(args?: Subset<T, OncologyCancerTypeMaster$siteMappingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the OncologyCancerTypeMaster model
   */
  interface OncologyCancerTypeMasterFieldRefs {
    readonly id: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly tenantId: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly code: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly name: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly category: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly description: FieldRef<"OncologyCancerTypeMaster", 'String'>
    readonly active: FieldRef<"OncologyCancerTypeMaster", 'Boolean'>
    readonly createdAt: FieldRef<"OncologyCancerTypeMaster", 'DateTime'>
    readonly updatedAt: FieldRef<"OncologyCancerTypeMaster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OncologyCancerTypeMaster findUnique
   */
  export type OncologyCancerTypeMasterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeMaster to fetch.
     */
    where: OncologyCancerTypeMasterWhereUniqueInput
  }

  /**
   * OncologyCancerTypeMaster findUniqueOrThrow
   */
  export type OncologyCancerTypeMasterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeMaster to fetch.
     */
    where: OncologyCancerTypeMasterWhereUniqueInput
  }

  /**
   * OncologyCancerTypeMaster findFirst
   */
  export type OncologyCancerTypeMasterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeMaster to fetch.
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeMasters to fetch.
     */
    orderBy?: OncologyCancerTypeMasterOrderByWithRelationInput | OncologyCancerTypeMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCancerTypeMasters.
     */
    cursor?: OncologyCancerTypeMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCancerTypeMasters.
     */
    distinct?: OncologyCancerTypeMasterScalarFieldEnum | OncologyCancerTypeMasterScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeMaster findFirstOrThrow
   */
  export type OncologyCancerTypeMasterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeMaster to fetch.
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeMasters to fetch.
     */
    orderBy?: OncologyCancerTypeMasterOrderByWithRelationInput | OncologyCancerTypeMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCancerTypeMasters.
     */
    cursor?: OncologyCancerTypeMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCancerTypeMasters.
     */
    distinct?: OncologyCancerTypeMasterScalarFieldEnum | OncologyCancerTypeMasterScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeMaster findMany
   */
  export type OncologyCancerTypeMasterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeMasters to fetch.
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeMasters to fetch.
     */
    orderBy?: OncologyCancerTypeMasterOrderByWithRelationInput | OncologyCancerTypeMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OncologyCancerTypeMasters.
     */
    cursor?: OncologyCancerTypeMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeMasters.
     */
    skip?: number
    distinct?: OncologyCancerTypeMasterScalarFieldEnum | OncologyCancerTypeMasterScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeMaster create
   */
  export type OncologyCancerTypeMasterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * The data needed to create a OncologyCancerTypeMaster.
     */
    data: XOR<OncologyCancerTypeMasterCreateInput, OncologyCancerTypeMasterUncheckedCreateInput>
  }

  /**
   * OncologyCancerTypeMaster createMany
   */
  export type OncologyCancerTypeMasterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OncologyCancerTypeMasters.
     */
    data: OncologyCancerTypeMasterCreateManyInput | OncologyCancerTypeMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyCancerTypeMaster createManyAndReturn
   */
  export type OncologyCancerTypeMasterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * The data used to create many OncologyCancerTypeMasters.
     */
    data: OncologyCancerTypeMasterCreateManyInput | OncologyCancerTypeMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyCancerTypeMaster update
   */
  export type OncologyCancerTypeMasterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * The data needed to update a OncologyCancerTypeMaster.
     */
    data: XOR<OncologyCancerTypeMasterUpdateInput, OncologyCancerTypeMasterUncheckedUpdateInput>
    /**
     * Choose, which OncologyCancerTypeMaster to update.
     */
    where: OncologyCancerTypeMasterWhereUniqueInput
  }

  /**
   * OncologyCancerTypeMaster updateMany
   */
  export type OncologyCancerTypeMasterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OncologyCancerTypeMasters.
     */
    data: XOR<OncologyCancerTypeMasterUpdateManyMutationInput, OncologyCancerTypeMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCancerTypeMasters to update
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * Limit how many OncologyCancerTypeMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyCancerTypeMaster updateManyAndReturn
   */
  export type OncologyCancerTypeMasterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * The data used to update OncologyCancerTypeMasters.
     */
    data: XOR<OncologyCancerTypeMasterUpdateManyMutationInput, OncologyCancerTypeMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCancerTypeMasters to update
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * Limit how many OncologyCancerTypeMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyCancerTypeMaster upsert
   */
  export type OncologyCancerTypeMasterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * The filter to search for the OncologyCancerTypeMaster to update in case it exists.
     */
    where: OncologyCancerTypeMasterWhereUniqueInput
    /**
     * In case the OncologyCancerTypeMaster found by the `where` argument doesn't exist, create a new OncologyCancerTypeMaster with this data.
     */
    create: XOR<OncologyCancerTypeMasterCreateInput, OncologyCancerTypeMasterUncheckedCreateInput>
    /**
     * In case the OncologyCancerTypeMaster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OncologyCancerTypeMasterUpdateInput, OncologyCancerTypeMasterUncheckedUpdateInput>
  }

  /**
   * OncologyCancerTypeMaster delete
   */
  export type OncologyCancerTypeMasterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
    /**
     * Filter which OncologyCancerTypeMaster to delete.
     */
    where: OncologyCancerTypeMasterWhereUniqueInput
  }

  /**
   * OncologyCancerTypeMaster deleteMany
   */
  export type OncologyCancerTypeMasterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCancerTypeMasters to delete
     */
    where?: OncologyCancerTypeMasterWhereInput
    /**
     * Limit how many OncologyCancerTypeMasters to delete.
     */
    limit?: number
  }

  /**
   * OncologyCancerTypeMaster.siteMappings
   */
  export type OncologyCancerTypeMaster$siteMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    where?: OncologyCancerTypeSiteMappingWhereInput
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OncologyCancerTypeSiteMappingScalarFieldEnum | OncologyCancerTypeSiteMappingScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeMaster without action
   */
  export type OncologyCancerTypeMasterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeMaster
     */
    select?: OncologyCancerTypeMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeMaster
     */
    omit?: OncologyCancerTypeMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeMasterInclude<ExtArgs> | null
  }


  /**
   * Model OncologyPrimarySiteMaster
   */

  export type AggregateOncologyPrimarySiteMaster = {
    _count: OncologyPrimarySiteMasterCountAggregateOutputType | null
    _min: OncologyPrimarySiteMasterMinAggregateOutputType | null
    _max: OncologyPrimarySiteMasterMaxAggregateOutputType | null
  }

  export type OncologyPrimarySiteMasterMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    icdoSiteCode: string | null
    icdoSiteName: string | null
    bodySystem: string | null
    lateralityApplicable: boolean | null
    mappingType: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyPrimarySiteMasterMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    icdoSiteCode: string | null
    icdoSiteName: string | null
    bodySystem: string | null
    lateralityApplicable: boolean | null
    mappingType: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyPrimarySiteMasterCountAggregateOutputType = {
    id: number
    tenantId: number
    icdoSiteCode: number
    icdoSiteName: number
    bodySystem: number
    lateralityApplicable: number
    mappingType: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OncologyPrimarySiteMasterMinAggregateInputType = {
    id?: true
    tenantId?: true
    icdoSiteCode?: true
    icdoSiteName?: true
    bodySystem?: true
    lateralityApplicable?: true
    mappingType?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyPrimarySiteMasterMaxAggregateInputType = {
    id?: true
    tenantId?: true
    icdoSiteCode?: true
    icdoSiteName?: true
    bodySystem?: true
    lateralityApplicable?: true
    mappingType?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyPrimarySiteMasterCountAggregateInputType = {
    id?: true
    tenantId?: true
    icdoSiteCode?: true
    icdoSiteName?: true
    bodySystem?: true
    lateralityApplicable?: true
    mappingType?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OncologyPrimarySiteMasterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyPrimarySiteMaster to aggregate.
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyPrimarySiteMasters to fetch.
     */
    orderBy?: OncologyPrimarySiteMasterOrderByWithRelationInput | OncologyPrimarySiteMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OncologyPrimarySiteMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyPrimarySiteMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyPrimarySiteMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OncologyPrimarySiteMasters
    **/
    _count?: true | OncologyPrimarySiteMasterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OncologyPrimarySiteMasterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OncologyPrimarySiteMasterMaxAggregateInputType
  }

  export type GetOncologyPrimarySiteMasterAggregateType<T extends OncologyPrimarySiteMasterAggregateArgs> = {
        [P in keyof T & keyof AggregateOncologyPrimarySiteMaster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOncologyPrimarySiteMaster[P]>
      : GetScalarType<T[P], AggregateOncologyPrimarySiteMaster[P]>
  }




  export type OncologyPrimarySiteMasterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyPrimarySiteMasterWhereInput
    orderBy?: OncologyPrimarySiteMasterOrderByWithAggregationInput | OncologyPrimarySiteMasterOrderByWithAggregationInput[]
    by: OncologyPrimarySiteMasterScalarFieldEnum[] | OncologyPrimarySiteMasterScalarFieldEnum
    having?: OncologyPrimarySiteMasterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OncologyPrimarySiteMasterCountAggregateInputType | true
    _min?: OncologyPrimarySiteMasterMinAggregateInputType
    _max?: OncologyPrimarySiteMasterMaxAggregateInputType
  }

  export type OncologyPrimarySiteMasterGroupByOutputType = {
    id: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem: string | null
    lateralityApplicable: boolean
    mappingType: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: OncologyPrimarySiteMasterCountAggregateOutputType | null
    _min: OncologyPrimarySiteMasterMinAggregateOutputType | null
    _max: OncologyPrimarySiteMasterMaxAggregateOutputType | null
  }

  type GetOncologyPrimarySiteMasterGroupByPayload<T extends OncologyPrimarySiteMasterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OncologyPrimarySiteMasterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OncologyPrimarySiteMasterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OncologyPrimarySiteMasterGroupByOutputType[P]>
            : GetScalarType<T[P], OncologyPrimarySiteMasterGroupByOutputType[P]>
        }
      >
    >


  export type OncologyPrimarySiteMasterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    icdoSiteCode?: boolean
    icdoSiteName?: boolean
    bodySystem?: boolean
    lateralityApplicable?: boolean
    mappingType?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    siteMappings?: boolean | OncologyPrimarySiteMaster$siteMappingsArgs<ExtArgs>
    _count?: boolean | OncologyPrimarySiteMasterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyPrimarySiteMaster"]>

  export type OncologyPrimarySiteMasterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    icdoSiteCode?: boolean
    icdoSiteName?: boolean
    bodySystem?: boolean
    lateralityApplicable?: boolean
    mappingType?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyPrimarySiteMaster"]>

  export type OncologyPrimarySiteMasterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    icdoSiteCode?: boolean
    icdoSiteName?: boolean
    bodySystem?: boolean
    lateralityApplicable?: boolean
    mappingType?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyPrimarySiteMaster"]>

  export type OncologyPrimarySiteMasterSelectScalar = {
    id?: boolean
    tenantId?: boolean
    icdoSiteCode?: boolean
    icdoSiteName?: boolean
    bodySystem?: boolean
    lateralityApplicable?: boolean
    mappingType?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OncologyPrimarySiteMasterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "icdoSiteCode" | "icdoSiteName" | "bodySystem" | "lateralityApplicable" | "mappingType" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["oncologyPrimarySiteMaster"]>
  export type OncologyPrimarySiteMasterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    siteMappings?: boolean | OncologyPrimarySiteMaster$siteMappingsArgs<ExtArgs>
    _count?: boolean | OncologyPrimarySiteMasterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OncologyPrimarySiteMasterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OncologyPrimarySiteMasterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OncologyPrimarySiteMasterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OncologyPrimarySiteMaster"
    objects: {
      siteMappings: Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      icdoSiteCode: string
      icdoSiteName: string
      bodySystem: string | null
      lateralityApplicable: boolean
      mappingType: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oncologyPrimarySiteMaster"]>
    composites: {}
  }

  type OncologyPrimarySiteMasterGetPayload<S extends boolean | null | undefined | OncologyPrimarySiteMasterDefaultArgs> = $Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload, S>

  type OncologyPrimarySiteMasterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OncologyPrimarySiteMasterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OncologyPrimarySiteMasterCountAggregateInputType | true
    }

  export interface OncologyPrimarySiteMasterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OncologyPrimarySiteMaster'], meta: { name: 'OncologyPrimarySiteMaster' } }
    /**
     * Find zero or one OncologyPrimarySiteMaster that matches the filter.
     * @param {OncologyPrimarySiteMasterFindUniqueArgs} args - Arguments to find a OncologyPrimarySiteMaster
     * @example
     * // Get one OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OncologyPrimarySiteMasterFindUniqueArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterFindUniqueArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OncologyPrimarySiteMaster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OncologyPrimarySiteMasterFindUniqueOrThrowArgs} args - Arguments to find a OncologyPrimarySiteMaster
     * @example
     * // Get one OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OncologyPrimarySiteMasterFindUniqueOrThrowArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyPrimarySiteMaster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterFindFirstArgs} args - Arguments to find a OncologyPrimarySiteMaster
     * @example
     * // Get one OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OncologyPrimarySiteMasterFindFirstArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterFindFirstArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyPrimarySiteMaster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterFindFirstOrThrowArgs} args - Arguments to find a OncologyPrimarySiteMaster
     * @example
     * // Get one OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OncologyPrimarySiteMasterFindFirstOrThrowArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterFindFirstOrThrowArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OncologyPrimarySiteMasters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMasters = await prisma.oncologyPrimarySiteMaster.findMany()
     * 
     * // Get first 10 OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMasters = await prisma.oncologyPrimarySiteMaster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oncologyPrimarySiteMasterWithIdOnly = await prisma.oncologyPrimarySiteMaster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OncologyPrimarySiteMasterFindManyArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OncologyPrimarySiteMaster.
     * @param {OncologyPrimarySiteMasterCreateArgs} args - Arguments to create a OncologyPrimarySiteMaster.
     * @example
     * // Create one OncologyPrimarySiteMaster
     * const OncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.create({
     *   data: {
     *     // ... data to create a OncologyPrimarySiteMaster
     *   }
     * })
     * 
     */
    create<T extends OncologyPrimarySiteMasterCreateArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterCreateArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OncologyPrimarySiteMasters.
     * @param {OncologyPrimarySiteMasterCreateManyArgs} args - Arguments to create many OncologyPrimarySiteMasters.
     * @example
     * // Create many OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OncologyPrimarySiteMasterCreateManyArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OncologyPrimarySiteMasters and returns the data saved in the database.
     * @param {OncologyPrimarySiteMasterCreateManyAndReturnArgs} args - Arguments to create many OncologyPrimarySiteMasters.
     * @example
     * // Create many OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OncologyPrimarySiteMasters and only return the `id`
     * const oncologyPrimarySiteMasterWithIdOnly = await prisma.oncologyPrimarySiteMaster.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OncologyPrimarySiteMasterCreateManyAndReturnArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OncologyPrimarySiteMaster.
     * @param {OncologyPrimarySiteMasterDeleteArgs} args - Arguments to delete one OncologyPrimarySiteMaster.
     * @example
     * // Delete one OncologyPrimarySiteMaster
     * const OncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.delete({
     *   where: {
     *     // ... filter to delete one OncologyPrimarySiteMaster
     *   }
     * })
     * 
     */
    delete<T extends OncologyPrimarySiteMasterDeleteArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterDeleteArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OncologyPrimarySiteMaster.
     * @param {OncologyPrimarySiteMasterUpdateArgs} args - Arguments to update one OncologyPrimarySiteMaster.
     * @example
     * // Update one OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OncologyPrimarySiteMasterUpdateArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterUpdateArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OncologyPrimarySiteMasters.
     * @param {OncologyPrimarySiteMasterDeleteManyArgs} args - Arguments to filter OncologyPrimarySiteMasters to delete.
     * @example
     * // Delete a few OncologyPrimarySiteMasters
     * const { count } = await prisma.oncologyPrimarySiteMaster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OncologyPrimarySiteMasterDeleteManyArgs>(args?: SelectSubset<T, OncologyPrimarySiteMasterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyPrimarySiteMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OncologyPrimarySiteMasterUpdateManyArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyPrimarySiteMasters and returns the data updated in the database.
     * @param {OncologyPrimarySiteMasterUpdateManyAndReturnArgs} args - Arguments to update many OncologyPrimarySiteMasters.
     * @example
     * // Update many OncologyPrimarySiteMasters
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OncologyPrimarySiteMasters and only return the `id`
     * const oncologyPrimarySiteMasterWithIdOnly = await prisma.oncologyPrimarySiteMaster.updateManyAndReturn({
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
    updateManyAndReturn<T extends OncologyPrimarySiteMasterUpdateManyAndReturnArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OncologyPrimarySiteMaster.
     * @param {OncologyPrimarySiteMasterUpsertArgs} args - Arguments to update or create a OncologyPrimarySiteMaster.
     * @example
     * // Update or create a OncologyPrimarySiteMaster
     * const oncologyPrimarySiteMaster = await prisma.oncologyPrimarySiteMaster.upsert({
     *   create: {
     *     // ... data to create a OncologyPrimarySiteMaster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OncologyPrimarySiteMaster we want to update
     *   }
     * })
     */
    upsert<T extends OncologyPrimarySiteMasterUpsertArgs>(args: SelectSubset<T, OncologyPrimarySiteMasterUpsertArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OncologyPrimarySiteMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterCountArgs} args - Arguments to filter OncologyPrimarySiteMasters to count.
     * @example
     * // Count the number of OncologyPrimarySiteMasters
     * const count = await prisma.oncologyPrimarySiteMaster.count({
     *   where: {
     *     // ... the filter for the OncologyPrimarySiteMasters we want to count
     *   }
     * })
    **/
    count<T extends OncologyPrimarySiteMasterCountArgs>(
      args?: Subset<T, OncologyPrimarySiteMasterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OncologyPrimarySiteMasterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OncologyPrimarySiteMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OncologyPrimarySiteMasterAggregateArgs>(args: Subset<T, OncologyPrimarySiteMasterAggregateArgs>): Prisma.PrismaPromise<GetOncologyPrimarySiteMasterAggregateType<T>>

    /**
     * Group by OncologyPrimarySiteMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyPrimarySiteMasterGroupByArgs} args - Group by arguments.
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
      T extends OncologyPrimarySiteMasterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OncologyPrimarySiteMasterGroupByArgs['orderBy'] }
        : { orderBy?: OncologyPrimarySiteMasterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OncologyPrimarySiteMasterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOncologyPrimarySiteMasterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OncologyPrimarySiteMaster model
   */
  readonly fields: OncologyPrimarySiteMasterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OncologyPrimarySiteMaster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OncologyPrimarySiteMasterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    siteMappings<T extends OncologyPrimarySiteMaster$siteMappingsArgs<ExtArgs> = {}>(args?: Subset<T, OncologyPrimarySiteMaster$siteMappingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the OncologyPrimarySiteMaster model
   */
  interface OncologyPrimarySiteMasterFieldRefs {
    readonly id: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly tenantId: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly icdoSiteCode: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly icdoSiteName: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly bodySystem: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly lateralityApplicable: FieldRef<"OncologyPrimarySiteMaster", 'Boolean'>
    readonly mappingType: FieldRef<"OncologyPrimarySiteMaster", 'String'>
    readonly active: FieldRef<"OncologyPrimarySiteMaster", 'Boolean'>
    readonly createdAt: FieldRef<"OncologyPrimarySiteMaster", 'DateTime'>
    readonly updatedAt: FieldRef<"OncologyPrimarySiteMaster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OncologyPrimarySiteMaster findUnique
   */
  export type OncologyPrimarySiteMasterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyPrimarySiteMaster to fetch.
     */
    where: OncologyPrimarySiteMasterWhereUniqueInput
  }

  /**
   * OncologyPrimarySiteMaster findUniqueOrThrow
   */
  export type OncologyPrimarySiteMasterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyPrimarySiteMaster to fetch.
     */
    where: OncologyPrimarySiteMasterWhereUniqueInput
  }

  /**
   * OncologyPrimarySiteMaster findFirst
   */
  export type OncologyPrimarySiteMasterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyPrimarySiteMaster to fetch.
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyPrimarySiteMasters to fetch.
     */
    orderBy?: OncologyPrimarySiteMasterOrderByWithRelationInput | OncologyPrimarySiteMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyPrimarySiteMasters.
     */
    cursor?: OncologyPrimarySiteMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyPrimarySiteMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyPrimarySiteMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyPrimarySiteMasters.
     */
    distinct?: OncologyPrimarySiteMasterScalarFieldEnum | OncologyPrimarySiteMasterScalarFieldEnum[]
  }

  /**
   * OncologyPrimarySiteMaster findFirstOrThrow
   */
  export type OncologyPrimarySiteMasterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyPrimarySiteMaster to fetch.
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyPrimarySiteMasters to fetch.
     */
    orderBy?: OncologyPrimarySiteMasterOrderByWithRelationInput | OncologyPrimarySiteMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyPrimarySiteMasters.
     */
    cursor?: OncologyPrimarySiteMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyPrimarySiteMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyPrimarySiteMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyPrimarySiteMasters.
     */
    distinct?: OncologyPrimarySiteMasterScalarFieldEnum | OncologyPrimarySiteMasterScalarFieldEnum[]
  }

  /**
   * OncologyPrimarySiteMaster findMany
   */
  export type OncologyPrimarySiteMasterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter, which OncologyPrimarySiteMasters to fetch.
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyPrimarySiteMasters to fetch.
     */
    orderBy?: OncologyPrimarySiteMasterOrderByWithRelationInput | OncologyPrimarySiteMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OncologyPrimarySiteMasters.
     */
    cursor?: OncologyPrimarySiteMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyPrimarySiteMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyPrimarySiteMasters.
     */
    skip?: number
    distinct?: OncologyPrimarySiteMasterScalarFieldEnum | OncologyPrimarySiteMasterScalarFieldEnum[]
  }

  /**
   * OncologyPrimarySiteMaster create
   */
  export type OncologyPrimarySiteMasterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * The data needed to create a OncologyPrimarySiteMaster.
     */
    data: XOR<OncologyPrimarySiteMasterCreateInput, OncologyPrimarySiteMasterUncheckedCreateInput>
  }

  /**
   * OncologyPrimarySiteMaster createMany
   */
  export type OncologyPrimarySiteMasterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OncologyPrimarySiteMasters.
     */
    data: OncologyPrimarySiteMasterCreateManyInput | OncologyPrimarySiteMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyPrimarySiteMaster createManyAndReturn
   */
  export type OncologyPrimarySiteMasterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * The data used to create many OncologyPrimarySiteMasters.
     */
    data: OncologyPrimarySiteMasterCreateManyInput | OncologyPrimarySiteMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyPrimarySiteMaster update
   */
  export type OncologyPrimarySiteMasterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * The data needed to update a OncologyPrimarySiteMaster.
     */
    data: XOR<OncologyPrimarySiteMasterUpdateInput, OncologyPrimarySiteMasterUncheckedUpdateInput>
    /**
     * Choose, which OncologyPrimarySiteMaster to update.
     */
    where: OncologyPrimarySiteMasterWhereUniqueInput
  }

  /**
   * OncologyPrimarySiteMaster updateMany
   */
  export type OncologyPrimarySiteMasterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OncologyPrimarySiteMasters.
     */
    data: XOR<OncologyPrimarySiteMasterUpdateManyMutationInput, OncologyPrimarySiteMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyPrimarySiteMasters to update
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * Limit how many OncologyPrimarySiteMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyPrimarySiteMaster updateManyAndReturn
   */
  export type OncologyPrimarySiteMasterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * The data used to update OncologyPrimarySiteMasters.
     */
    data: XOR<OncologyPrimarySiteMasterUpdateManyMutationInput, OncologyPrimarySiteMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyPrimarySiteMasters to update
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * Limit how many OncologyPrimarySiteMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyPrimarySiteMaster upsert
   */
  export type OncologyPrimarySiteMasterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * The filter to search for the OncologyPrimarySiteMaster to update in case it exists.
     */
    where: OncologyPrimarySiteMasterWhereUniqueInput
    /**
     * In case the OncologyPrimarySiteMaster found by the `where` argument doesn't exist, create a new OncologyPrimarySiteMaster with this data.
     */
    create: XOR<OncologyPrimarySiteMasterCreateInput, OncologyPrimarySiteMasterUncheckedCreateInput>
    /**
     * In case the OncologyPrimarySiteMaster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OncologyPrimarySiteMasterUpdateInput, OncologyPrimarySiteMasterUncheckedUpdateInput>
  }

  /**
   * OncologyPrimarySiteMaster delete
   */
  export type OncologyPrimarySiteMasterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
    /**
     * Filter which OncologyPrimarySiteMaster to delete.
     */
    where: OncologyPrimarySiteMasterWhereUniqueInput
  }

  /**
   * OncologyPrimarySiteMaster deleteMany
   */
  export type OncologyPrimarySiteMasterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyPrimarySiteMasters to delete
     */
    where?: OncologyPrimarySiteMasterWhereInput
    /**
     * Limit how many OncologyPrimarySiteMasters to delete.
     */
    limit?: number
  }

  /**
   * OncologyPrimarySiteMaster.siteMappings
   */
  export type OncologyPrimarySiteMaster$siteMappingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    where?: OncologyCancerTypeSiteMappingWhereInput
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OncologyCancerTypeSiteMappingScalarFieldEnum | OncologyCancerTypeSiteMappingScalarFieldEnum[]
  }

  /**
   * OncologyPrimarySiteMaster without action
   */
  export type OncologyPrimarySiteMasterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyPrimarySiteMaster
     */
    select?: OncologyPrimarySiteMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyPrimarySiteMaster
     */
    omit?: OncologyPrimarySiteMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyPrimarySiteMasterInclude<ExtArgs> | null
  }


  /**
   * Model OncologyCancerTypeSiteMapping
   */

  export type AggregateOncologyCancerTypeSiteMapping = {
    _count: OncologyCancerTypeSiteMappingCountAggregateOutputType | null
    _min: OncologyCancerTypeSiteMappingMinAggregateOutputType | null
    _max: OncologyCancerTypeSiteMappingMaxAggregateOutputType | null
  }

  export type OncologyCancerTypeSiteMappingMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    cancerTypeId: string | null
    primarySiteId: string | null
    isDefault: boolean | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCancerTypeSiteMappingMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    cancerTypeId: string | null
    primarySiteId: string | null
    isDefault: boolean | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCancerTypeSiteMappingCountAggregateOutputType = {
    id: number
    tenantId: number
    cancerTypeId: number
    primarySiteId: number
    isDefault: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OncologyCancerTypeSiteMappingMinAggregateInputType = {
    id?: true
    tenantId?: true
    cancerTypeId?: true
    primarySiteId?: true
    isDefault?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCancerTypeSiteMappingMaxAggregateInputType = {
    id?: true
    tenantId?: true
    cancerTypeId?: true
    primarySiteId?: true
    isDefault?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCancerTypeSiteMappingCountAggregateInputType = {
    id?: true
    tenantId?: true
    cancerTypeId?: true
    primarySiteId?: true
    isDefault?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OncologyCancerTypeSiteMappingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCancerTypeSiteMapping to aggregate.
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeSiteMappings to fetch.
     */
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeSiteMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeSiteMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OncologyCancerTypeSiteMappings
    **/
    _count?: true | OncologyCancerTypeSiteMappingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OncologyCancerTypeSiteMappingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OncologyCancerTypeSiteMappingMaxAggregateInputType
  }

  export type GetOncologyCancerTypeSiteMappingAggregateType<T extends OncologyCancerTypeSiteMappingAggregateArgs> = {
        [P in keyof T & keyof AggregateOncologyCancerTypeSiteMapping]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOncologyCancerTypeSiteMapping[P]>
      : GetScalarType<T[P], AggregateOncologyCancerTypeSiteMapping[P]>
  }




  export type OncologyCancerTypeSiteMappingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCancerTypeSiteMappingWhereInput
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithAggregationInput | OncologyCancerTypeSiteMappingOrderByWithAggregationInput[]
    by: OncologyCancerTypeSiteMappingScalarFieldEnum[] | OncologyCancerTypeSiteMappingScalarFieldEnum
    having?: OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OncologyCancerTypeSiteMappingCountAggregateInputType | true
    _min?: OncologyCancerTypeSiteMappingMinAggregateInputType
    _max?: OncologyCancerTypeSiteMappingMaxAggregateInputType
  }

  export type OncologyCancerTypeSiteMappingGroupByOutputType = {
    id: string
    tenantId: string
    cancerTypeId: string
    primarySiteId: string
    isDefault: boolean
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: OncologyCancerTypeSiteMappingCountAggregateOutputType | null
    _min: OncologyCancerTypeSiteMappingMinAggregateOutputType | null
    _max: OncologyCancerTypeSiteMappingMaxAggregateOutputType | null
  }

  type GetOncologyCancerTypeSiteMappingGroupByPayload<T extends OncologyCancerTypeSiteMappingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OncologyCancerTypeSiteMappingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OncologyCancerTypeSiteMappingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OncologyCancerTypeSiteMappingGroupByOutputType[P]>
            : GetScalarType<T[P], OncologyCancerTypeSiteMappingGroupByOutputType[P]>
        }
      >
    >


  export type OncologyCancerTypeSiteMappingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerTypeId?: boolean
    primarySiteId?: boolean
    isDefault?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCancerTypeSiteMapping"]>

  export type OncologyCancerTypeSiteMappingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerTypeId?: boolean
    primarySiteId?: boolean
    isDefault?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCancerTypeSiteMapping"]>

  export type OncologyCancerTypeSiteMappingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    cancerTypeId?: boolean
    primarySiteId?: boolean
    isDefault?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCancerTypeSiteMapping"]>

  export type OncologyCancerTypeSiteMappingSelectScalar = {
    id?: boolean
    tenantId?: boolean
    cancerTypeId?: boolean
    primarySiteId?: boolean
    isDefault?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OncologyCancerTypeSiteMappingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "cancerTypeId" | "primarySiteId" | "isDefault" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["oncologyCancerTypeSiteMapping"]>
  export type OncologyCancerTypeSiteMappingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }
  export type OncologyCancerTypeSiteMappingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }
  export type OncologyCancerTypeSiteMappingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerType?: boolean | OncologyCancerTypeMasterDefaultArgs<ExtArgs>
    primarySite?: boolean | OncologyPrimarySiteMasterDefaultArgs<ExtArgs>
  }

  export type $OncologyCancerTypeSiteMappingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OncologyCancerTypeSiteMapping"
    objects: {
      cancerType: Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>
      primarySite: Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      cancerTypeId: string
      primarySiteId: string
      isDefault: boolean
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oncologyCancerTypeSiteMapping"]>
    composites: {}
  }

  type OncologyCancerTypeSiteMappingGetPayload<S extends boolean | null | undefined | OncologyCancerTypeSiteMappingDefaultArgs> = $Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload, S>

  type OncologyCancerTypeSiteMappingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OncologyCancerTypeSiteMappingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OncologyCancerTypeSiteMappingCountAggregateInputType | true
    }

  export interface OncologyCancerTypeSiteMappingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OncologyCancerTypeSiteMapping'], meta: { name: 'OncologyCancerTypeSiteMapping' } }
    /**
     * Find zero or one OncologyCancerTypeSiteMapping that matches the filter.
     * @param {OncologyCancerTypeSiteMappingFindUniqueArgs} args - Arguments to find a OncologyCancerTypeSiteMapping
     * @example
     * // Get one OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OncologyCancerTypeSiteMappingFindUniqueArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingFindUniqueArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OncologyCancerTypeSiteMapping that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OncologyCancerTypeSiteMappingFindUniqueOrThrowArgs} args - Arguments to find a OncologyCancerTypeSiteMapping
     * @example
     * // Get one OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OncologyCancerTypeSiteMappingFindUniqueOrThrowArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCancerTypeSiteMapping that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingFindFirstArgs} args - Arguments to find a OncologyCancerTypeSiteMapping
     * @example
     * // Get one OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OncologyCancerTypeSiteMappingFindFirstArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingFindFirstArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCancerTypeSiteMapping that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingFindFirstOrThrowArgs} args - Arguments to find a OncologyCancerTypeSiteMapping
     * @example
     * // Get one OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OncologyCancerTypeSiteMappingFindFirstOrThrowArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingFindFirstOrThrowArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OncologyCancerTypeSiteMappings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMappings = await prisma.oncologyCancerTypeSiteMapping.findMany()
     * 
     * // Get first 10 OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMappings = await prisma.oncologyCancerTypeSiteMapping.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oncologyCancerTypeSiteMappingWithIdOnly = await prisma.oncologyCancerTypeSiteMapping.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OncologyCancerTypeSiteMappingFindManyArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OncologyCancerTypeSiteMapping.
     * @param {OncologyCancerTypeSiteMappingCreateArgs} args - Arguments to create a OncologyCancerTypeSiteMapping.
     * @example
     * // Create one OncologyCancerTypeSiteMapping
     * const OncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.create({
     *   data: {
     *     // ... data to create a OncologyCancerTypeSiteMapping
     *   }
     * })
     * 
     */
    create<T extends OncologyCancerTypeSiteMappingCreateArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingCreateArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OncologyCancerTypeSiteMappings.
     * @param {OncologyCancerTypeSiteMappingCreateManyArgs} args - Arguments to create many OncologyCancerTypeSiteMappings.
     * @example
     * // Create many OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OncologyCancerTypeSiteMappingCreateManyArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OncologyCancerTypeSiteMappings and returns the data saved in the database.
     * @param {OncologyCancerTypeSiteMappingCreateManyAndReturnArgs} args - Arguments to create many OncologyCancerTypeSiteMappings.
     * @example
     * // Create many OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OncologyCancerTypeSiteMappings and only return the `id`
     * const oncologyCancerTypeSiteMappingWithIdOnly = await prisma.oncologyCancerTypeSiteMapping.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OncologyCancerTypeSiteMappingCreateManyAndReturnArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OncologyCancerTypeSiteMapping.
     * @param {OncologyCancerTypeSiteMappingDeleteArgs} args - Arguments to delete one OncologyCancerTypeSiteMapping.
     * @example
     * // Delete one OncologyCancerTypeSiteMapping
     * const OncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.delete({
     *   where: {
     *     // ... filter to delete one OncologyCancerTypeSiteMapping
     *   }
     * })
     * 
     */
    delete<T extends OncologyCancerTypeSiteMappingDeleteArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingDeleteArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OncologyCancerTypeSiteMapping.
     * @param {OncologyCancerTypeSiteMappingUpdateArgs} args - Arguments to update one OncologyCancerTypeSiteMapping.
     * @example
     * // Update one OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OncologyCancerTypeSiteMappingUpdateArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingUpdateArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OncologyCancerTypeSiteMappings.
     * @param {OncologyCancerTypeSiteMappingDeleteManyArgs} args - Arguments to filter OncologyCancerTypeSiteMappings to delete.
     * @example
     * // Delete a few OncologyCancerTypeSiteMappings
     * const { count } = await prisma.oncologyCancerTypeSiteMapping.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OncologyCancerTypeSiteMappingDeleteManyArgs>(args?: SelectSubset<T, OncologyCancerTypeSiteMappingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCancerTypeSiteMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OncologyCancerTypeSiteMappingUpdateManyArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCancerTypeSiteMappings and returns the data updated in the database.
     * @param {OncologyCancerTypeSiteMappingUpdateManyAndReturnArgs} args - Arguments to update many OncologyCancerTypeSiteMappings.
     * @example
     * // Update many OncologyCancerTypeSiteMappings
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OncologyCancerTypeSiteMappings and only return the `id`
     * const oncologyCancerTypeSiteMappingWithIdOnly = await prisma.oncologyCancerTypeSiteMapping.updateManyAndReturn({
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
    updateManyAndReturn<T extends OncologyCancerTypeSiteMappingUpdateManyAndReturnArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OncologyCancerTypeSiteMapping.
     * @param {OncologyCancerTypeSiteMappingUpsertArgs} args - Arguments to update or create a OncologyCancerTypeSiteMapping.
     * @example
     * // Update or create a OncologyCancerTypeSiteMapping
     * const oncologyCancerTypeSiteMapping = await prisma.oncologyCancerTypeSiteMapping.upsert({
     *   create: {
     *     // ... data to create a OncologyCancerTypeSiteMapping
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OncologyCancerTypeSiteMapping we want to update
     *   }
     * })
     */
    upsert<T extends OncologyCancerTypeSiteMappingUpsertArgs>(args: SelectSubset<T, OncologyCancerTypeSiteMappingUpsertArgs<ExtArgs>>): Prisma__OncologyCancerTypeSiteMappingClient<$Result.GetResult<Prisma.$OncologyCancerTypeSiteMappingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OncologyCancerTypeSiteMappings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingCountArgs} args - Arguments to filter OncologyCancerTypeSiteMappings to count.
     * @example
     * // Count the number of OncologyCancerTypeSiteMappings
     * const count = await prisma.oncologyCancerTypeSiteMapping.count({
     *   where: {
     *     // ... the filter for the OncologyCancerTypeSiteMappings we want to count
     *   }
     * })
    **/
    count<T extends OncologyCancerTypeSiteMappingCountArgs>(
      args?: Subset<T, OncologyCancerTypeSiteMappingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OncologyCancerTypeSiteMappingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OncologyCancerTypeSiteMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OncologyCancerTypeSiteMappingAggregateArgs>(args: Subset<T, OncologyCancerTypeSiteMappingAggregateArgs>): Prisma.PrismaPromise<GetOncologyCancerTypeSiteMappingAggregateType<T>>

    /**
     * Group by OncologyCancerTypeSiteMapping.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCancerTypeSiteMappingGroupByArgs} args - Group by arguments.
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
      T extends OncologyCancerTypeSiteMappingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OncologyCancerTypeSiteMappingGroupByArgs['orderBy'] }
        : { orderBy?: OncologyCancerTypeSiteMappingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OncologyCancerTypeSiteMappingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOncologyCancerTypeSiteMappingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OncologyCancerTypeSiteMapping model
   */
  readonly fields: OncologyCancerTypeSiteMappingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OncologyCancerTypeSiteMapping.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OncologyCancerTypeSiteMappingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cancerType<T extends OncologyCancerTypeMasterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OncologyCancerTypeMasterDefaultArgs<ExtArgs>>): Prisma__OncologyCancerTypeMasterClient<$Result.GetResult<Prisma.$OncologyCancerTypeMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    primarySite<T extends OncologyPrimarySiteMasterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OncologyPrimarySiteMasterDefaultArgs<ExtArgs>>): Prisma__OncologyPrimarySiteMasterClient<$Result.GetResult<Prisma.$OncologyPrimarySiteMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the OncologyCancerTypeSiteMapping model
   */
  interface OncologyCancerTypeSiteMappingFieldRefs {
    readonly id: FieldRef<"OncologyCancerTypeSiteMapping", 'String'>
    readonly tenantId: FieldRef<"OncologyCancerTypeSiteMapping", 'String'>
    readonly cancerTypeId: FieldRef<"OncologyCancerTypeSiteMapping", 'String'>
    readonly primarySiteId: FieldRef<"OncologyCancerTypeSiteMapping", 'String'>
    readonly isDefault: FieldRef<"OncologyCancerTypeSiteMapping", 'Boolean'>
    readonly active: FieldRef<"OncologyCancerTypeSiteMapping", 'Boolean'>
    readonly createdAt: FieldRef<"OncologyCancerTypeSiteMapping", 'DateTime'>
    readonly updatedAt: FieldRef<"OncologyCancerTypeSiteMapping", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OncologyCancerTypeSiteMapping findUnique
   */
  export type OncologyCancerTypeSiteMappingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeSiteMapping to fetch.
     */
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
  }

  /**
   * OncologyCancerTypeSiteMapping findUniqueOrThrow
   */
  export type OncologyCancerTypeSiteMappingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeSiteMapping to fetch.
     */
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
  }

  /**
   * OncologyCancerTypeSiteMapping findFirst
   */
  export type OncologyCancerTypeSiteMappingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeSiteMapping to fetch.
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeSiteMappings to fetch.
     */
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCancerTypeSiteMappings.
     */
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeSiteMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeSiteMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCancerTypeSiteMappings.
     */
    distinct?: OncologyCancerTypeSiteMappingScalarFieldEnum | OncologyCancerTypeSiteMappingScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeSiteMapping findFirstOrThrow
   */
  export type OncologyCancerTypeSiteMappingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeSiteMapping to fetch.
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeSiteMappings to fetch.
     */
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCancerTypeSiteMappings.
     */
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeSiteMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeSiteMappings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCancerTypeSiteMappings.
     */
    distinct?: OncologyCancerTypeSiteMappingScalarFieldEnum | OncologyCancerTypeSiteMappingScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeSiteMapping findMany
   */
  export type OncologyCancerTypeSiteMappingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCancerTypeSiteMappings to fetch.
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCancerTypeSiteMappings to fetch.
     */
    orderBy?: OncologyCancerTypeSiteMappingOrderByWithRelationInput | OncologyCancerTypeSiteMappingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OncologyCancerTypeSiteMappings.
     */
    cursor?: OncologyCancerTypeSiteMappingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCancerTypeSiteMappings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCancerTypeSiteMappings.
     */
    skip?: number
    distinct?: OncologyCancerTypeSiteMappingScalarFieldEnum | OncologyCancerTypeSiteMappingScalarFieldEnum[]
  }

  /**
   * OncologyCancerTypeSiteMapping create
   */
  export type OncologyCancerTypeSiteMappingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * The data needed to create a OncologyCancerTypeSiteMapping.
     */
    data: XOR<OncologyCancerTypeSiteMappingCreateInput, OncologyCancerTypeSiteMappingUncheckedCreateInput>
  }

  /**
   * OncologyCancerTypeSiteMapping createMany
   */
  export type OncologyCancerTypeSiteMappingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OncologyCancerTypeSiteMappings.
     */
    data: OncologyCancerTypeSiteMappingCreateManyInput | OncologyCancerTypeSiteMappingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyCancerTypeSiteMapping createManyAndReturn
   */
  export type OncologyCancerTypeSiteMappingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * The data used to create many OncologyCancerTypeSiteMappings.
     */
    data: OncologyCancerTypeSiteMappingCreateManyInput | OncologyCancerTypeSiteMappingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OncologyCancerTypeSiteMapping update
   */
  export type OncologyCancerTypeSiteMappingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * The data needed to update a OncologyCancerTypeSiteMapping.
     */
    data: XOR<OncologyCancerTypeSiteMappingUpdateInput, OncologyCancerTypeSiteMappingUncheckedUpdateInput>
    /**
     * Choose, which OncologyCancerTypeSiteMapping to update.
     */
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
  }

  /**
   * OncologyCancerTypeSiteMapping updateMany
   */
  export type OncologyCancerTypeSiteMappingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OncologyCancerTypeSiteMappings.
     */
    data: XOR<OncologyCancerTypeSiteMappingUpdateManyMutationInput, OncologyCancerTypeSiteMappingUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCancerTypeSiteMappings to update
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * Limit how many OncologyCancerTypeSiteMappings to update.
     */
    limit?: number
  }

  /**
   * OncologyCancerTypeSiteMapping updateManyAndReturn
   */
  export type OncologyCancerTypeSiteMappingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * The data used to update OncologyCancerTypeSiteMappings.
     */
    data: XOR<OncologyCancerTypeSiteMappingUpdateManyMutationInput, OncologyCancerTypeSiteMappingUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCancerTypeSiteMappings to update
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * Limit how many OncologyCancerTypeSiteMappings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OncologyCancerTypeSiteMapping upsert
   */
  export type OncologyCancerTypeSiteMappingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * The filter to search for the OncologyCancerTypeSiteMapping to update in case it exists.
     */
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    /**
     * In case the OncologyCancerTypeSiteMapping found by the `where` argument doesn't exist, create a new OncologyCancerTypeSiteMapping with this data.
     */
    create: XOR<OncologyCancerTypeSiteMappingCreateInput, OncologyCancerTypeSiteMappingUncheckedCreateInput>
    /**
     * In case the OncologyCancerTypeSiteMapping was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OncologyCancerTypeSiteMappingUpdateInput, OncologyCancerTypeSiteMappingUncheckedUpdateInput>
  }

  /**
   * OncologyCancerTypeSiteMapping delete
   */
  export type OncologyCancerTypeSiteMappingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
    /**
     * Filter which OncologyCancerTypeSiteMapping to delete.
     */
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
  }

  /**
   * OncologyCancerTypeSiteMapping deleteMany
   */
  export type OncologyCancerTypeSiteMappingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCancerTypeSiteMappings to delete
     */
    where?: OncologyCancerTypeSiteMappingWhereInput
    /**
     * Limit how many OncologyCancerTypeSiteMappings to delete.
     */
    limit?: number
  }

  /**
   * OncologyCancerTypeSiteMapping without action
   */
  export type OncologyCancerTypeSiteMappingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCancerTypeSiteMapping
     */
    select?: OncologyCancerTypeSiteMappingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCancerTypeSiteMapping
     */
    omit?: OncologyCancerTypeSiteMappingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCancerTypeSiteMappingInclude<ExtArgs> | null
  }


  /**
   * Model OncologyHistologyMaster
   */

  export type AggregateOncologyHistologyMaster = {
    _count: OncologyHistologyMasterCountAggregateOutputType | null
    _min: OncologyHistologyMasterMinAggregateOutputType | null
    _max: OncologyHistologyMasterMaxAggregateOutputType | null
  }

  export type OncologyHistologyMasterMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    morphologyCode: string | null
    morphologyName: string | null
    behaviorCode: string | null
    behaviorName: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyHistologyMasterMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    morphologyCode: string | null
    morphologyName: string | null
    behaviorCode: string | null
    behaviorName: string | null
    description: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyHistologyMasterCountAggregateOutputType = {
    id: number
    tenantId: number
    morphologyCode: number
    morphologyName: number
    behaviorCode: number
    behaviorName: number
    description: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OncologyHistologyMasterMinAggregateInputType = {
    id?: true
    tenantId?: true
    morphologyCode?: true
    morphologyName?: true
    behaviorCode?: true
    behaviorName?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyHistologyMasterMaxAggregateInputType = {
    id?: true
    tenantId?: true
    morphologyCode?: true
    morphologyName?: true
    behaviorCode?: true
    behaviorName?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyHistologyMasterCountAggregateInputType = {
    id?: true
    tenantId?: true
    morphologyCode?: true
    morphologyName?: true
    behaviorCode?: true
    behaviorName?: true
    description?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OncologyHistologyMasterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyHistologyMaster to aggregate.
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyHistologyMasters to fetch.
     */
    orderBy?: OncologyHistologyMasterOrderByWithRelationInput | OncologyHistologyMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OncologyHistologyMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyHistologyMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyHistologyMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OncologyHistologyMasters
    **/
    _count?: true | OncologyHistologyMasterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OncologyHistologyMasterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OncologyHistologyMasterMaxAggregateInputType
  }

  export type GetOncologyHistologyMasterAggregateType<T extends OncologyHistologyMasterAggregateArgs> = {
        [P in keyof T & keyof AggregateOncologyHistologyMaster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOncologyHistologyMaster[P]>
      : GetScalarType<T[P], AggregateOncologyHistologyMaster[P]>
  }




  export type OncologyHistologyMasterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyHistologyMasterWhereInput
    orderBy?: OncologyHistologyMasterOrderByWithAggregationInput | OncologyHistologyMasterOrderByWithAggregationInput[]
    by: OncologyHistologyMasterScalarFieldEnum[] | OncologyHistologyMasterScalarFieldEnum
    having?: OncologyHistologyMasterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OncologyHistologyMasterCountAggregateInputType | true
    _min?: OncologyHistologyMasterMinAggregateInputType
    _max?: OncologyHistologyMasterMaxAggregateInputType
  }

  export type OncologyHistologyMasterGroupByOutputType = {
    id: string
    tenantId: string
    morphologyCode: string
    morphologyName: string
    behaviorCode: string | null
    behaviorName: string | null
    description: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: OncologyHistologyMasterCountAggregateOutputType | null
    _min: OncologyHistologyMasterMinAggregateOutputType | null
    _max: OncologyHistologyMasterMaxAggregateOutputType | null
  }

  type GetOncologyHistologyMasterGroupByPayload<T extends OncologyHistologyMasterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OncologyHistologyMasterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OncologyHistologyMasterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OncologyHistologyMasterGroupByOutputType[P]>
            : GetScalarType<T[P], OncologyHistologyMasterGroupByOutputType[P]>
        }
      >
    >


  export type OncologyHistologyMasterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    morphologyCode?: boolean
    morphologyName?: boolean
    behaviorCode?: boolean
    behaviorName?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyHistologyMaster"]>

  export type OncologyHistologyMasterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    morphologyCode?: boolean
    morphologyName?: boolean
    behaviorCode?: boolean
    behaviorName?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyHistologyMaster"]>

  export type OncologyHistologyMasterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    morphologyCode?: boolean
    morphologyName?: boolean
    behaviorCode?: boolean
    behaviorName?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["oncologyHistologyMaster"]>

  export type OncologyHistologyMasterSelectScalar = {
    id?: boolean
    tenantId?: boolean
    morphologyCode?: boolean
    morphologyName?: boolean
    behaviorCode?: boolean
    behaviorName?: boolean
    description?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OncologyHistologyMasterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "morphologyCode" | "morphologyName" | "behaviorCode" | "behaviorName" | "description" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["oncologyHistologyMaster"]>

  export type $OncologyHistologyMasterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OncologyHistologyMaster"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      morphologyCode: string
      morphologyName: string
      behaviorCode: string | null
      behaviorName: string | null
      description: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oncologyHistologyMaster"]>
    composites: {}
  }

  type OncologyHistologyMasterGetPayload<S extends boolean | null | undefined | OncologyHistologyMasterDefaultArgs> = $Result.GetResult<Prisma.$OncologyHistologyMasterPayload, S>

  type OncologyHistologyMasterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OncologyHistologyMasterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OncologyHistologyMasterCountAggregateInputType | true
    }

  export interface OncologyHistologyMasterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OncologyHistologyMaster'], meta: { name: 'OncologyHistologyMaster' } }
    /**
     * Find zero or one OncologyHistologyMaster that matches the filter.
     * @param {OncologyHistologyMasterFindUniqueArgs} args - Arguments to find a OncologyHistologyMaster
     * @example
     * // Get one OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OncologyHistologyMasterFindUniqueArgs>(args: SelectSubset<T, OncologyHistologyMasterFindUniqueArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OncologyHistologyMaster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OncologyHistologyMasterFindUniqueOrThrowArgs} args - Arguments to find a OncologyHistologyMaster
     * @example
     * // Get one OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OncologyHistologyMasterFindUniqueOrThrowArgs>(args: SelectSubset<T, OncologyHistologyMasterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyHistologyMaster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterFindFirstArgs} args - Arguments to find a OncologyHistologyMaster
     * @example
     * // Get one OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OncologyHistologyMasterFindFirstArgs>(args?: SelectSubset<T, OncologyHistologyMasterFindFirstArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyHistologyMaster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterFindFirstOrThrowArgs} args - Arguments to find a OncologyHistologyMaster
     * @example
     * // Get one OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OncologyHistologyMasterFindFirstOrThrowArgs>(args?: SelectSubset<T, OncologyHistologyMasterFindFirstOrThrowArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OncologyHistologyMasters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OncologyHistologyMasters
     * const oncologyHistologyMasters = await prisma.oncologyHistologyMaster.findMany()
     * 
     * // Get first 10 OncologyHistologyMasters
     * const oncologyHistologyMasters = await prisma.oncologyHistologyMaster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oncologyHistologyMasterWithIdOnly = await prisma.oncologyHistologyMaster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OncologyHistologyMasterFindManyArgs>(args?: SelectSubset<T, OncologyHistologyMasterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OncologyHistologyMaster.
     * @param {OncologyHistologyMasterCreateArgs} args - Arguments to create a OncologyHistologyMaster.
     * @example
     * // Create one OncologyHistologyMaster
     * const OncologyHistologyMaster = await prisma.oncologyHistologyMaster.create({
     *   data: {
     *     // ... data to create a OncologyHistologyMaster
     *   }
     * })
     * 
     */
    create<T extends OncologyHistologyMasterCreateArgs>(args: SelectSubset<T, OncologyHistologyMasterCreateArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OncologyHistologyMasters.
     * @param {OncologyHistologyMasterCreateManyArgs} args - Arguments to create many OncologyHistologyMasters.
     * @example
     * // Create many OncologyHistologyMasters
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OncologyHistologyMasterCreateManyArgs>(args?: SelectSubset<T, OncologyHistologyMasterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OncologyHistologyMasters and returns the data saved in the database.
     * @param {OncologyHistologyMasterCreateManyAndReturnArgs} args - Arguments to create many OncologyHistologyMasters.
     * @example
     * // Create many OncologyHistologyMasters
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OncologyHistologyMasters and only return the `id`
     * const oncologyHistologyMasterWithIdOnly = await prisma.oncologyHistologyMaster.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OncologyHistologyMasterCreateManyAndReturnArgs>(args?: SelectSubset<T, OncologyHistologyMasterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OncologyHistologyMaster.
     * @param {OncologyHistologyMasterDeleteArgs} args - Arguments to delete one OncologyHistologyMaster.
     * @example
     * // Delete one OncologyHistologyMaster
     * const OncologyHistologyMaster = await prisma.oncologyHistologyMaster.delete({
     *   where: {
     *     // ... filter to delete one OncologyHistologyMaster
     *   }
     * })
     * 
     */
    delete<T extends OncologyHistologyMasterDeleteArgs>(args: SelectSubset<T, OncologyHistologyMasterDeleteArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OncologyHistologyMaster.
     * @param {OncologyHistologyMasterUpdateArgs} args - Arguments to update one OncologyHistologyMaster.
     * @example
     * // Update one OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OncologyHistologyMasterUpdateArgs>(args: SelectSubset<T, OncologyHistologyMasterUpdateArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OncologyHistologyMasters.
     * @param {OncologyHistologyMasterDeleteManyArgs} args - Arguments to filter OncologyHistologyMasters to delete.
     * @example
     * // Delete a few OncologyHistologyMasters
     * const { count } = await prisma.oncologyHistologyMaster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OncologyHistologyMasterDeleteManyArgs>(args?: SelectSubset<T, OncologyHistologyMasterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyHistologyMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OncologyHistologyMasters
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OncologyHistologyMasterUpdateManyArgs>(args: SelectSubset<T, OncologyHistologyMasterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyHistologyMasters and returns the data updated in the database.
     * @param {OncologyHistologyMasterUpdateManyAndReturnArgs} args - Arguments to update many OncologyHistologyMasters.
     * @example
     * // Update many OncologyHistologyMasters
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OncologyHistologyMasters and only return the `id`
     * const oncologyHistologyMasterWithIdOnly = await prisma.oncologyHistologyMaster.updateManyAndReturn({
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
    updateManyAndReturn<T extends OncologyHistologyMasterUpdateManyAndReturnArgs>(args: SelectSubset<T, OncologyHistologyMasterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OncologyHistologyMaster.
     * @param {OncologyHistologyMasterUpsertArgs} args - Arguments to update or create a OncologyHistologyMaster.
     * @example
     * // Update or create a OncologyHistologyMaster
     * const oncologyHistologyMaster = await prisma.oncologyHistologyMaster.upsert({
     *   create: {
     *     // ... data to create a OncologyHistologyMaster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OncologyHistologyMaster we want to update
     *   }
     * })
     */
    upsert<T extends OncologyHistologyMasterUpsertArgs>(args: SelectSubset<T, OncologyHistologyMasterUpsertArgs<ExtArgs>>): Prisma__OncologyHistologyMasterClient<$Result.GetResult<Prisma.$OncologyHistologyMasterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OncologyHistologyMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterCountArgs} args - Arguments to filter OncologyHistologyMasters to count.
     * @example
     * // Count the number of OncologyHistologyMasters
     * const count = await prisma.oncologyHistologyMaster.count({
     *   where: {
     *     // ... the filter for the OncologyHistologyMasters we want to count
     *   }
     * })
    **/
    count<T extends OncologyHistologyMasterCountArgs>(
      args?: Subset<T, OncologyHistologyMasterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OncologyHistologyMasterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OncologyHistologyMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OncologyHistologyMasterAggregateArgs>(args: Subset<T, OncologyHistologyMasterAggregateArgs>): Prisma.PrismaPromise<GetOncologyHistologyMasterAggregateType<T>>

    /**
     * Group by OncologyHistologyMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyHistologyMasterGroupByArgs} args - Group by arguments.
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
      T extends OncologyHistologyMasterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OncologyHistologyMasterGroupByArgs['orderBy'] }
        : { orderBy?: OncologyHistologyMasterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OncologyHistologyMasterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOncologyHistologyMasterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OncologyHistologyMaster model
   */
  readonly fields: OncologyHistologyMasterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OncologyHistologyMaster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OncologyHistologyMasterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the OncologyHistologyMaster model
   */
  interface OncologyHistologyMasterFieldRefs {
    readonly id: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly tenantId: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly morphologyCode: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly morphologyName: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly behaviorCode: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly behaviorName: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly description: FieldRef<"OncologyHistologyMaster", 'String'>
    readonly active: FieldRef<"OncologyHistologyMaster", 'Boolean'>
    readonly createdAt: FieldRef<"OncologyHistologyMaster", 'DateTime'>
    readonly updatedAt: FieldRef<"OncologyHistologyMaster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OncologyHistologyMaster findUnique
   */
  export type OncologyHistologyMasterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter, which OncologyHistologyMaster to fetch.
     */
    where: OncologyHistologyMasterWhereUniqueInput
  }

  /**
   * OncologyHistologyMaster findUniqueOrThrow
   */
  export type OncologyHistologyMasterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter, which OncologyHistologyMaster to fetch.
     */
    where: OncologyHistologyMasterWhereUniqueInput
  }

  /**
   * OncologyHistologyMaster findFirst
   */
  export type OncologyHistologyMasterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter, which OncologyHistologyMaster to fetch.
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyHistologyMasters to fetch.
     */
    orderBy?: OncologyHistologyMasterOrderByWithRelationInput | OncologyHistologyMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyHistologyMasters.
     */
    cursor?: OncologyHistologyMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyHistologyMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyHistologyMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyHistologyMasters.
     */
    distinct?: OncologyHistologyMasterScalarFieldEnum | OncologyHistologyMasterScalarFieldEnum[]
  }

  /**
   * OncologyHistologyMaster findFirstOrThrow
   */
  export type OncologyHistologyMasterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter, which OncologyHistologyMaster to fetch.
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyHistologyMasters to fetch.
     */
    orderBy?: OncologyHistologyMasterOrderByWithRelationInput | OncologyHistologyMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyHistologyMasters.
     */
    cursor?: OncologyHistologyMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyHistologyMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyHistologyMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyHistologyMasters.
     */
    distinct?: OncologyHistologyMasterScalarFieldEnum | OncologyHistologyMasterScalarFieldEnum[]
  }

  /**
   * OncologyHistologyMaster findMany
   */
  export type OncologyHistologyMasterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter, which OncologyHistologyMasters to fetch.
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyHistologyMasters to fetch.
     */
    orderBy?: OncologyHistologyMasterOrderByWithRelationInput | OncologyHistologyMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OncologyHistologyMasters.
     */
    cursor?: OncologyHistologyMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyHistologyMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyHistologyMasters.
     */
    skip?: number
    distinct?: OncologyHistologyMasterScalarFieldEnum | OncologyHistologyMasterScalarFieldEnum[]
  }

  /**
   * OncologyHistologyMaster create
   */
  export type OncologyHistologyMasterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * The data needed to create a OncologyHistologyMaster.
     */
    data: XOR<OncologyHistologyMasterCreateInput, OncologyHistologyMasterUncheckedCreateInput>
  }

  /**
   * OncologyHistologyMaster createMany
   */
  export type OncologyHistologyMasterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OncologyHistologyMasters.
     */
    data: OncologyHistologyMasterCreateManyInput | OncologyHistologyMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyHistologyMaster createManyAndReturn
   */
  export type OncologyHistologyMasterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * The data used to create many OncologyHistologyMasters.
     */
    data: OncologyHistologyMasterCreateManyInput | OncologyHistologyMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyHistologyMaster update
   */
  export type OncologyHistologyMasterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * The data needed to update a OncologyHistologyMaster.
     */
    data: XOR<OncologyHistologyMasterUpdateInput, OncologyHistologyMasterUncheckedUpdateInput>
    /**
     * Choose, which OncologyHistologyMaster to update.
     */
    where: OncologyHistologyMasterWhereUniqueInput
  }

  /**
   * OncologyHistologyMaster updateMany
   */
  export type OncologyHistologyMasterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OncologyHistologyMasters.
     */
    data: XOR<OncologyHistologyMasterUpdateManyMutationInput, OncologyHistologyMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyHistologyMasters to update
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * Limit how many OncologyHistologyMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyHistologyMaster updateManyAndReturn
   */
  export type OncologyHistologyMasterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * The data used to update OncologyHistologyMasters.
     */
    data: XOR<OncologyHistologyMasterUpdateManyMutationInput, OncologyHistologyMasterUncheckedUpdateManyInput>
    /**
     * Filter which OncologyHistologyMasters to update
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * Limit how many OncologyHistologyMasters to update.
     */
    limit?: number
  }

  /**
   * OncologyHistologyMaster upsert
   */
  export type OncologyHistologyMasterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * The filter to search for the OncologyHistologyMaster to update in case it exists.
     */
    where: OncologyHistologyMasterWhereUniqueInput
    /**
     * In case the OncologyHistologyMaster found by the `where` argument doesn't exist, create a new OncologyHistologyMaster with this data.
     */
    create: XOR<OncologyHistologyMasterCreateInput, OncologyHistologyMasterUncheckedCreateInput>
    /**
     * In case the OncologyHistologyMaster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OncologyHistologyMasterUpdateInput, OncologyHistologyMasterUncheckedUpdateInput>
  }

  /**
   * OncologyHistologyMaster delete
   */
  export type OncologyHistologyMasterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
    /**
     * Filter which OncologyHistologyMaster to delete.
     */
    where: OncologyHistologyMasterWhereUniqueInput
  }

  /**
   * OncologyHistologyMaster deleteMany
   */
  export type OncologyHistologyMasterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyHistologyMasters to delete
     */
    where?: OncologyHistologyMasterWhereInput
    /**
     * Limit how many OncologyHistologyMasters to delete.
     */
    limit?: number
  }

  /**
   * OncologyHistologyMaster without action
   */
  export type OncologyHistologyMasterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyHistologyMaster
     */
    select?: OncologyHistologyMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyHistologyMaster
     */
    omit?: OncologyHistologyMasterOmit<ExtArgs> | null
  }


  /**
   * Model OncologyCarePlan
   */

  export type AggregateOncologyCarePlan = {
    _count: OncologyCarePlanCountAggregateOutputType | null
    _avg: OncologyCarePlanAvgAggregateOutputType | null
    _sum: OncologyCarePlanSumAggregateOutputType | null
    _min: OncologyCarePlanMinAggregateOutputType | null
    _max: OncologyCarePlanMaxAggregateOutputType | null
  }

  export type OncologyCarePlanAvgAggregateOutputType = {
    version: number | null
    plannedCycles: number | null
    cycleDurationDays: number | null
  }

  export type OncologyCarePlanSumAggregateOutputType = {
    version: number | null
    plannedCycles: number | null
    cycleDurationDays: number | null
  }

  export type OncologyCarePlanMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    cancerDiagnosisId: string | null
    tumorBoardCaseId: string | null
    planNumber: string | null
    version: number | null
    parentPlanId: string | null
    treatmentIntent: string | null
    oncologySubspecialty: string | null
    plannedCycles: number | null
    cycleDurationDays: number | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCarePlanMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    cancerDiagnosisId: string | null
    tumorBoardCaseId: string | null
    planNumber: string | null
    version: number | null
    parentPlanId: string | null
    treatmentIntent: string | null
    oncologySubspecialty: string | null
    plannedCycles: number | null
    cycleDurationDays: number | null
    status: string | null
    startDate: Date | null
    endDate: Date | null
    createdBy: string | null
    approvedBy: string | null
    approvedAt: Date | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OncologyCarePlanCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    cancerDiagnosisId: number
    tumorBoardCaseId: number
    planNumber: number
    version: number
    parentPlanId: number
    treatmentIntent: number
    oncologySubspecialty: number
    plannedModalities: number
    plannedCycles: number
    cycleDurationDays: number
    milestones: number
    followUpSchedule: number
    status: number
    startDate: number
    endDate: number
    createdBy: number
    approvedBy: number
    approvedAt: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OncologyCarePlanAvgAggregateInputType = {
    version?: true
    plannedCycles?: true
    cycleDurationDays?: true
  }

  export type OncologyCarePlanSumAggregateInputType = {
    version?: true
    plannedCycles?: true
    cycleDurationDays?: true
  }

  export type OncologyCarePlanMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    tumorBoardCaseId?: true
    planNumber?: true
    version?: true
    parentPlanId?: true
    treatmentIntent?: true
    oncologySubspecialty?: true
    plannedCycles?: true
    cycleDurationDays?: true
    status?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCarePlanMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    tumorBoardCaseId?: true
    planNumber?: true
    version?: true
    parentPlanId?: true
    treatmentIntent?: true
    oncologySubspecialty?: true
    plannedCycles?: true
    cycleDurationDays?: true
    status?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OncologyCarePlanCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    cancerDiagnosisId?: true
    tumorBoardCaseId?: true
    planNumber?: true
    version?: true
    parentPlanId?: true
    treatmentIntent?: true
    oncologySubspecialty?: true
    plannedModalities?: true
    plannedCycles?: true
    cycleDurationDays?: true
    milestones?: true
    followUpSchedule?: true
    status?: true
    startDate?: true
    endDate?: true
    createdBy?: true
    approvedBy?: true
    approvedAt?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OncologyCarePlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCarePlan to aggregate.
     */
    where?: OncologyCarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCarePlans to fetch.
     */
    orderBy?: OncologyCarePlanOrderByWithRelationInput | OncologyCarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OncologyCarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OncologyCarePlans
    **/
    _count?: true | OncologyCarePlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OncologyCarePlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OncologyCarePlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OncologyCarePlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OncologyCarePlanMaxAggregateInputType
  }

  export type GetOncologyCarePlanAggregateType<T extends OncologyCarePlanAggregateArgs> = {
        [P in keyof T & keyof AggregateOncologyCarePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOncologyCarePlan[P]>
      : GetScalarType<T[P], AggregateOncologyCarePlan[P]>
  }




  export type OncologyCarePlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OncologyCarePlanWhereInput
    orderBy?: OncologyCarePlanOrderByWithAggregationInput | OncologyCarePlanOrderByWithAggregationInput[]
    by: OncologyCarePlanScalarFieldEnum[] | OncologyCarePlanScalarFieldEnum
    having?: OncologyCarePlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OncologyCarePlanCountAggregateInputType | true
    _avg?: OncologyCarePlanAvgAggregateInputType
    _sum?: OncologyCarePlanSumAggregateInputType
    _min?: OncologyCarePlanMinAggregateInputType
    _max?: OncologyCarePlanMaxAggregateInputType
  }

  export type OncologyCarePlanGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    tumorBoardCaseId: string | null
    planNumber: string
    version: number
    parentPlanId: string | null
    treatmentIntent: string
    oncologySubspecialty: string | null
    plannedModalities: JsonValue
    plannedCycles: number | null
    cycleDurationDays: number | null
    milestones: JsonValue
    followUpSchedule: JsonValue
    status: string
    startDate: Date | null
    endDate: Date | null
    createdBy: string
    approvedBy: string | null
    approvedAt: Date | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: OncologyCarePlanCountAggregateOutputType | null
    _avg: OncologyCarePlanAvgAggregateOutputType | null
    _sum: OncologyCarePlanSumAggregateOutputType | null
    _min: OncologyCarePlanMinAggregateOutputType | null
    _max: OncologyCarePlanMaxAggregateOutputType | null
  }

  type GetOncologyCarePlanGroupByPayload<T extends OncologyCarePlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OncologyCarePlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OncologyCarePlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OncologyCarePlanGroupByOutputType[P]>
            : GetScalarType<T[P], OncologyCarePlanGroupByOutputType[P]>
        }
      >
    >


  export type OncologyCarePlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    tumorBoardCaseId?: boolean
    planNumber?: boolean
    version?: boolean
    parentPlanId?: boolean
    treatmentIntent?: boolean
    oncologySubspecialty?: boolean
    plannedModalities?: boolean
    plannedCycles?: boolean
    cycleDurationDays?: boolean
    milestones?: boolean
    followUpSchedule?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCarePlan"]>

  export type OncologyCarePlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    tumorBoardCaseId?: boolean
    planNumber?: boolean
    version?: boolean
    parentPlanId?: boolean
    treatmentIntent?: boolean
    oncologySubspecialty?: boolean
    plannedModalities?: boolean
    plannedCycles?: boolean
    cycleDurationDays?: boolean
    milestones?: boolean
    followUpSchedule?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCarePlan"]>

  export type OncologyCarePlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    tumorBoardCaseId?: boolean
    planNumber?: boolean
    version?: boolean
    parentPlanId?: boolean
    treatmentIntent?: boolean
    oncologySubspecialty?: boolean
    plannedModalities?: boolean
    plannedCycles?: boolean
    cycleDurationDays?: boolean
    milestones?: boolean
    followUpSchedule?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oncologyCarePlan"]>

  export type OncologyCarePlanSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    cancerDiagnosisId?: boolean
    tumorBoardCaseId?: boolean
    planNumber?: boolean
    version?: boolean
    parentPlanId?: boolean
    treatmentIntent?: boolean
    oncologySubspecialty?: boolean
    plannedModalities?: boolean
    plannedCycles?: boolean
    cycleDurationDays?: boolean
    milestones?: boolean
    followUpSchedule?: boolean
    status?: boolean
    startDate?: boolean
    endDate?: boolean
    createdBy?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OncologyCarePlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "patientId" | "cancerDiagnosisId" | "tumorBoardCaseId" | "planNumber" | "version" | "parentPlanId" | "treatmentIntent" | "oncologySubspecialty" | "plannedModalities" | "plannedCycles" | "cycleDurationDays" | "milestones" | "followUpSchedule" | "status" | "startDate" | "endDate" | "createdBy" | "approvedBy" | "approvedAt" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["oncologyCarePlan"]>
  export type OncologyCarePlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type OncologyCarePlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }
  export type OncologyCarePlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cancerDiagnosis?: boolean | CancerDiagnosisDefaultArgs<ExtArgs>
  }

  export type $OncologyCarePlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OncologyCarePlan"
    objects: {
      cancerDiagnosis: Prisma.$CancerDiagnosisPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      cancerDiagnosisId: string
      tumorBoardCaseId: string | null
      planNumber: string
      version: number
      parentPlanId: string | null
      treatmentIntent: string
      oncologySubspecialty: string | null
      plannedModalities: Prisma.JsonValue
      plannedCycles: number | null
      cycleDurationDays: number | null
      milestones: Prisma.JsonValue
      followUpSchedule: Prisma.JsonValue
      status: string
      startDate: Date | null
      endDate: Date | null
      createdBy: string
      approvedBy: string | null
      approvedAt: Date | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oncologyCarePlan"]>
    composites: {}
  }

  type OncologyCarePlanGetPayload<S extends boolean | null | undefined | OncologyCarePlanDefaultArgs> = $Result.GetResult<Prisma.$OncologyCarePlanPayload, S>

  type OncologyCarePlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OncologyCarePlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OncologyCarePlanCountAggregateInputType | true
    }

  export interface OncologyCarePlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OncologyCarePlan'], meta: { name: 'OncologyCarePlan' } }
    /**
     * Find zero or one OncologyCarePlan that matches the filter.
     * @param {OncologyCarePlanFindUniqueArgs} args - Arguments to find a OncologyCarePlan
     * @example
     * // Get one OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OncologyCarePlanFindUniqueArgs>(args: SelectSubset<T, OncologyCarePlanFindUniqueArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OncologyCarePlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OncologyCarePlanFindUniqueOrThrowArgs} args - Arguments to find a OncologyCarePlan
     * @example
     * // Get one OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OncologyCarePlanFindUniqueOrThrowArgs>(args: SelectSubset<T, OncologyCarePlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCarePlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanFindFirstArgs} args - Arguments to find a OncologyCarePlan
     * @example
     * // Get one OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OncologyCarePlanFindFirstArgs>(args?: SelectSubset<T, OncologyCarePlanFindFirstArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OncologyCarePlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanFindFirstOrThrowArgs} args - Arguments to find a OncologyCarePlan
     * @example
     * // Get one OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OncologyCarePlanFindFirstOrThrowArgs>(args?: SelectSubset<T, OncologyCarePlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OncologyCarePlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OncologyCarePlans
     * const oncologyCarePlans = await prisma.oncologyCarePlan.findMany()
     * 
     * // Get first 10 OncologyCarePlans
     * const oncologyCarePlans = await prisma.oncologyCarePlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oncologyCarePlanWithIdOnly = await prisma.oncologyCarePlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OncologyCarePlanFindManyArgs>(args?: SelectSubset<T, OncologyCarePlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OncologyCarePlan.
     * @param {OncologyCarePlanCreateArgs} args - Arguments to create a OncologyCarePlan.
     * @example
     * // Create one OncologyCarePlan
     * const OncologyCarePlan = await prisma.oncologyCarePlan.create({
     *   data: {
     *     // ... data to create a OncologyCarePlan
     *   }
     * })
     * 
     */
    create<T extends OncologyCarePlanCreateArgs>(args: SelectSubset<T, OncologyCarePlanCreateArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OncologyCarePlans.
     * @param {OncologyCarePlanCreateManyArgs} args - Arguments to create many OncologyCarePlans.
     * @example
     * // Create many OncologyCarePlans
     * const oncologyCarePlan = await prisma.oncologyCarePlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OncologyCarePlanCreateManyArgs>(args?: SelectSubset<T, OncologyCarePlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OncologyCarePlans and returns the data saved in the database.
     * @param {OncologyCarePlanCreateManyAndReturnArgs} args - Arguments to create many OncologyCarePlans.
     * @example
     * // Create many OncologyCarePlans
     * const oncologyCarePlan = await prisma.oncologyCarePlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OncologyCarePlans and only return the `id`
     * const oncologyCarePlanWithIdOnly = await prisma.oncologyCarePlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OncologyCarePlanCreateManyAndReturnArgs>(args?: SelectSubset<T, OncologyCarePlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OncologyCarePlan.
     * @param {OncologyCarePlanDeleteArgs} args - Arguments to delete one OncologyCarePlan.
     * @example
     * // Delete one OncologyCarePlan
     * const OncologyCarePlan = await prisma.oncologyCarePlan.delete({
     *   where: {
     *     // ... filter to delete one OncologyCarePlan
     *   }
     * })
     * 
     */
    delete<T extends OncologyCarePlanDeleteArgs>(args: SelectSubset<T, OncologyCarePlanDeleteArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OncologyCarePlan.
     * @param {OncologyCarePlanUpdateArgs} args - Arguments to update one OncologyCarePlan.
     * @example
     * // Update one OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OncologyCarePlanUpdateArgs>(args: SelectSubset<T, OncologyCarePlanUpdateArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OncologyCarePlans.
     * @param {OncologyCarePlanDeleteManyArgs} args - Arguments to filter OncologyCarePlans to delete.
     * @example
     * // Delete a few OncologyCarePlans
     * const { count } = await prisma.oncologyCarePlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OncologyCarePlanDeleteManyArgs>(args?: SelectSubset<T, OncologyCarePlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCarePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OncologyCarePlans
     * const oncologyCarePlan = await prisma.oncologyCarePlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OncologyCarePlanUpdateManyArgs>(args: SelectSubset<T, OncologyCarePlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OncologyCarePlans and returns the data updated in the database.
     * @param {OncologyCarePlanUpdateManyAndReturnArgs} args - Arguments to update many OncologyCarePlans.
     * @example
     * // Update many OncologyCarePlans
     * const oncologyCarePlan = await prisma.oncologyCarePlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OncologyCarePlans and only return the `id`
     * const oncologyCarePlanWithIdOnly = await prisma.oncologyCarePlan.updateManyAndReturn({
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
    updateManyAndReturn<T extends OncologyCarePlanUpdateManyAndReturnArgs>(args: SelectSubset<T, OncologyCarePlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OncologyCarePlan.
     * @param {OncologyCarePlanUpsertArgs} args - Arguments to update or create a OncologyCarePlan.
     * @example
     * // Update or create a OncologyCarePlan
     * const oncologyCarePlan = await prisma.oncologyCarePlan.upsert({
     *   create: {
     *     // ... data to create a OncologyCarePlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OncologyCarePlan we want to update
     *   }
     * })
     */
    upsert<T extends OncologyCarePlanUpsertArgs>(args: SelectSubset<T, OncologyCarePlanUpsertArgs<ExtArgs>>): Prisma__OncologyCarePlanClient<$Result.GetResult<Prisma.$OncologyCarePlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OncologyCarePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanCountArgs} args - Arguments to filter OncologyCarePlans to count.
     * @example
     * // Count the number of OncologyCarePlans
     * const count = await prisma.oncologyCarePlan.count({
     *   where: {
     *     // ... the filter for the OncologyCarePlans we want to count
     *   }
     * })
    **/
    count<T extends OncologyCarePlanCountArgs>(
      args?: Subset<T, OncologyCarePlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OncologyCarePlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OncologyCarePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OncologyCarePlanAggregateArgs>(args: Subset<T, OncologyCarePlanAggregateArgs>): Prisma.PrismaPromise<GetOncologyCarePlanAggregateType<T>>

    /**
     * Group by OncologyCarePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OncologyCarePlanGroupByArgs} args - Group by arguments.
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
      T extends OncologyCarePlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OncologyCarePlanGroupByArgs['orderBy'] }
        : { orderBy?: OncologyCarePlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OncologyCarePlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOncologyCarePlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OncologyCarePlan model
   */
  readonly fields: OncologyCarePlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OncologyCarePlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OncologyCarePlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cancerDiagnosis<T extends CancerDiagnosisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CancerDiagnosisDefaultArgs<ExtArgs>>): Prisma__CancerDiagnosisClient<$Result.GetResult<Prisma.$CancerDiagnosisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the OncologyCarePlan model
   */
  interface OncologyCarePlanFieldRefs {
    readonly id: FieldRef<"OncologyCarePlan", 'String'>
    readonly tenantId: FieldRef<"OncologyCarePlan", 'String'>
    readonly patientId: FieldRef<"OncologyCarePlan", 'String'>
    readonly cancerDiagnosisId: FieldRef<"OncologyCarePlan", 'String'>
    readonly tumorBoardCaseId: FieldRef<"OncologyCarePlan", 'String'>
    readonly planNumber: FieldRef<"OncologyCarePlan", 'String'>
    readonly version: FieldRef<"OncologyCarePlan", 'Int'>
    readonly parentPlanId: FieldRef<"OncologyCarePlan", 'String'>
    readonly treatmentIntent: FieldRef<"OncologyCarePlan", 'String'>
    readonly oncologySubspecialty: FieldRef<"OncologyCarePlan", 'String'>
    readonly plannedModalities: FieldRef<"OncologyCarePlan", 'Json'>
    readonly plannedCycles: FieldRef<"OncologyCarePlan", 'Int'>
    readonly cycleDurationDays: FieldRef<"OncologyCarePlan", 'Int'>
    readonly milestones: FieldRef<"OncologyCarePlan", 'Json'>
    readonly followUpSchedule: FieldRef<"OncologyCarePlan", 'Json'>
    readonly status: FieldRef<"OncologyCarePlan", 'String'>
    readonly startDate: FieldRef<"OncologyCarePlan", 'DateTime'>
    readonly endDate: FieldRef<"OncologyCarePlan", 'DateTime'>
    readonly createdBy: FieldRef<"OncologyCarePlan", 'String'>
    readonly approvedBy: FieldRef<"OncologyCarePlan", 'String'>
    readonly approvedAt: FieldRef<"OncologyCarePlan", 'DateTime'>
    readonly notes: FieldRef<"OncologyCarePlan", 'String'>
    readonly createdAt: FieldRef<"OncologyCarePlan", 'DateTime'>
    readonly updatedAt: FieldRef<"OncologyCarePlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OncologyCarePlan findUnique
   */
  export type OncologyCarePlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCarePlan to fetch.
     */
    where: OncologyCarePlanWhereUniqueInput
  }

  /**
   * OncologyCarePlan findUniqueOrThrow
   */
  export type OncologyCarePlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCarePlan to fetch.
     */
    where: OncologyCarePlanWhereUniqueInput
  }

  /**
   * OncologyCarePlan findFirst
   */
  export type OncologyCarePlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCarePlan to fetch.
     */
    where?: OncologyCarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCarePlans to fetch.
     */
    orderBy?: OncologyCarePlanOrderByWithRelationInput | OncologyCarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCarePlans.
     */
    cursor?: OncologyCarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCarePlans.
     */
    distinct?: OncologyCarePlanScalarFieldEnum | OncologyCarePlanScalarFieldEnum[]
  }

  /**
   * OncologyCarePlan findFirstOrThrow
   */
  export type OncologyCarePlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCarePlan to fetch.
     */
    where?: OncologyCarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCarePlans to fetch.
     */
    orderBy?: OncologyCarePlanOrderByWithRelationInput | OncologyCarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OncologyCarePlans.
     */
    cursor?: OncologyCarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCarePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OncologyCarePlans.
     */
    distinct?: OncologyCarePlanScalarFieldEnum | OncologyCarePlanScalarFieldEnum[]
  }

  /**
   * OncologyCarePlan findMany
   */
  export type OncologyCarePlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter, which OncologyCarePlans to fetch.
     */
    where?: OncologyCarePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OncologyCarePlans to fetch.
     */
    orderBy?: OncologyCarePlanOrderByWithRelationInput | OncologyCarePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OncologyCarePlans.
     */
    cursor?: OncologyCarePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OncologyCarePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OncologyCarePlans.
     */
    skip?: number
    distinct?: OncologyCarePlanScalarFieldEnum | OncologyCarePlanScalarFieldEnum[]
  }

  /**
   * OncologyCarePlan create
   */
  export type OncologyCarePlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * The data needed to create a OncologyCarePlan.
     */
    data: XOR<OncologyCarePlanCreateInput, OncologyCarePlanUncheckedCreateInput>
  }

  /**
   * OncologyCarePlan createMany
   */
  export type OncologyCarePlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OncologyCarePlans.
     */
    data: OncologyCarePlanCreateManyInput | OncologyCarePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OncologyCarePlan createManyAndReturn
   */
  export type OncologyCarePlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * The data used to create many OncologyCarePlans.
     */
    data: OncologyCarePlanCreateManyInput | OncologyCarePlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OncologyCarePlan update
   */
  export type OncologyCarePlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * The data needed to update a OncologyCarePlan.
     */
    data: XOR<OncologyCarePlanUpdateInput, OncologyCarePlanUncheckedUpdateInput>
    /**
     * Choose, which OncologyCarePlan to update.
     */
    where: OncologyCarePlanWhereUniqueInput
  }

  /**
   * OncologyCarePlan updateMany
   */
  export type OncologyCarePlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OncologyCarePlans.
     */
    data: XOR<OncologyCarePlanUpdateManyMutationInput, OncologyCarePlanUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCarePlans to update
     */
    where?: OncologyCarePlanWhereInput
    /**
     * Limit how many OncologyCarePlans to update.
     */
    limit?: number
  }

  /**
   * OncologyCarePlan updateManyAndReturn
   */
  export type OncologyCarePlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * The data used to update OncologyCarePlans.
     */
    data: XOR<OncologyCarePlanUpdateManyMutationInput, OncologyCarePlanUncheckedUpdateManyInput>
    /**
     * Filter which OncologyCarePlans to update
     */
    where?: OncologyCarePlanWhereInput
    /**
     * Limit how many OncologyCarePlans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OncologyCarePlan upsert
   */
  export type OncologyCarePlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * The filter to search for the OncologyCarePlan to update in case it exists.
     */
    where: OncologyCarePlanWhereUniqueInput
    /**
     * In case the OncologyCarePlan found by the `where` argument doesn't exist, create a new OncologyCarePlan with this data.
     */
    create: XOR<OncologyCarePlanCreateInput, OncologyCarePlanUncheckedCreateInput>
    /**
     * In case the OncologyCarePlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OncologyCarePlanUpdateInput, OncologyCarePlanUncheckedUpdateInput>
  }

  /**
   * OncologyCarePlan delete
   */
  export type OncologyCarePlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
    /**
     * Filter which OncologyCarePlan to delete.
     */
    where: OncologyCarePlanWhereUniqueInput
  }

  /**
   * OncologyCarePlan deleteMany
   */
  export type OncologyCarePlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OncologyCarePlans to delete
     */
    where?: OncologyCarePlanWhereInput
    /**
     * Limit how many OncologyCarePlans to delete.
     */
    limit?: number
  }

  /**
   * OncologyCarePlan without action
   */
  export type OncologyCarePlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OncologyCarePlan
     */
    select?: OncologyCarePlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OncologyCarePlan
     */
    omit?: OncologyCarePlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OncologyCarePlanInclude<ExtArgs> | null
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


  export const CancerDiagnosisScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    encounterDiagnosisId: 'encounterDiagnosisId',
    cancerType: 'cancerType',
    primarySite: 'primarySite',
    primarySiteCode: 'primarySiteCode',
    laterality: 'laterality',
    histologyMorphology: 'histologyMorphology',
    morphologyCode: 'morphologyCode',
    icdCode: 'icdCode',
    snomedCode: 'snomedCode',
    diagnosisDate: 'diagnosisDate',
    clinicalStatus: 'clinicalStatus',
    verificationStatus: 'verificationStatus',
    grade: 'grade',
    metastaticStatus: 'metastaticStatus',
    isRecurrence: 'isRecurrence',
    biomarkers: 'biomarkers',
    ecogAtDiagnosis: 'ecogAtDiagnosis',
    diagnosedBy: 'diagnosedBy',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CancerDiagnosisScalarFieldEnum = (typeof CancerDiagnosisScalarFieldEnum)[keyof typeof CancerDiagnosisScalarFieldEnum]


  export const TumorStagingScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    cancerDiagnosisId: 'cancerDiagnosisId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    providerId: 'providerId',
    stagingSystem: 'stagingSystem',
    stagingEdition: 'stagingEdition',
    stagingType: 'stagingType',
    stageGroup: 'stageGroup',
    tCategory: 'tCategory',
    nCategory: 'nCategory',
    mCategory: 'mCategory',
    bodySite: 'bodySite',
    grade: 'grade',
    histology: 'histology',
    stagingDate: 'stagingDate',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TumorStagingScalarFieldEnum = (typeof TumorStagingScalarFieldEnum)[keyof typeof TumorStagingScalarFieldEnum]


  export const ChemoProtocolScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    code: 'code',
    name: 'name',
    description: 'description',
    cancerType: 'cancerType',
    intent: 'intent',
    regimen: 'regimen',
    totalCycles: 'totalCycles',
    cycleDurationDays: 'cycleDurationDays',
    premedications: 'premedications',
    supportiveCare: 'supportiveCare',
    emetogenicRisk: 'emetogenicRisk',
    doseFormula: 'doseFormula',
    labPrerequisites: 'labPrerequisites',
    hydration: 'hydration',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdBy: 'createdBy'
  };

  export type ChemoProtocolScalarFieldEnum = (typeof ChemoProtocolScalarFieldEnum)[keyof typeof ChemoProtocolScalarFieldEnum]


  export const ChemoOrderScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    encounterId: 'encounterId',
    protocolId: 'protocolId',
    orderingProvider: 'orderingProvider',
    cycleNumber: 'cycleNumber',
    dayNumber: 'dayNumber',
    scheduledDate: 'scheduledDate',
    administeredAt: 'administeredAt',
    bsa: 'bsa',
    weight: 'weight',
    height: 'height',
    creatinineClearance: 'creatinineClearance',
    cancerDiagnosisId: 'cancerDiagnosisId',
    oncologyCarePlanId: 'oncologyCarePlanId',
    hepaticAdjustmentGrade: 'hepaticAdjustmentGrade',
    renalAdjustmentGrade: 'renalAdjustmentGrade',
    doseAdjustments: 'doseAdjustments',
    preChemoChecklist: 'preChemoChecklist',
    status: 'status',
    verifiedBy: 'verifiedBy',
    verifiedAt: 'verifiedAt',
    secondVerifiedBy: 'secondVerifiedBy',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt',
    administeredBy: 'administeredBy',
    adverseReactions: 'adverseReactions',
    administrationDetails: 'administrationDetails',
    drugPreparationDetails: 'drugPreparationDetails',
    nurseVerificationChecklist: 'nurseVerificationChecklist',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChemoOrderScalarFieldEnum = (typeof ChemoOrderScalarFieldEnum)[keyof typeof ChemoOrderScalarFieldEnum]


  export const TumorBoardCaseScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    cancerDiagnosisId: 'cancerDiagnosisId',
    stagingId: 'stagingId',
    meetingDate: 'meetingDate',
    presentedBy: 'presentedBy',
    attendees: 'attendees',
    clinicalSummary: 'clinicalSummary',
    imagingFindings: 'imagingFindings',
    pathologyReport: 'pathologyReport',
    molecularProfile: 'molecularProfile',
    mdtRecommendation: 'mdtRecommendation',
    treatmentIntent: 'treatmentIntent',
    recommendedPathway: 'recommendedPathway',
    treatmentPlan: 'treatmentPlan',
    decision: 'decision',
    reviewOutcome: 'reviewOutcome',
    followUpActions: 'followUpActions',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TumorBoardCaseScalarFieldEnum = (typeof TumorBoardCaseScalarFieldEnum)[keyof typeof TumorBoardCaseScalarFieldEnum]


  export const OncologyCancerTypeMasterScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    code: 'code',
    name: 'name',
    category: 'category',
    description: 'description',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OncologyCancerTypeMasterScalarFieldEnum = (typeof OncologyCancerTypeMasterScalarFieldEnum)[keyof typeof OncologyCancerTypeMasterScalarFieldEnum]


  export const OncologyPrimarySiteMasterScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    icdoSiteCode: 'icdoSiteCode',
    icdoSiteName: 'icdoSiteName',
    bodySystem: 'bodySystem',
    lateralityApplicable: 'lateralityApplicable',
    mappingType: 'mappingType',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OncologyPrimarySiteMasterScalarFieldEnum = (typeof OncologyPrimarySiteMasterScalarFieldEnum)[keyof typeof OncologyPrimarySiteMasterScalarFieldEnum]


  export const OncologyCancerTypeSiteMappingScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    cancerTypeId: 'cancerTypeId',
    primarySiteId: 'primarySiteId',
    isDefault: 'isDefault',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OncologyCancerTypeSiteMappingScalarFieldEnum = (typeof OncologyCancerTypeSiteMappingScalarFieldEnum)[keyof typeof OncologyCancerTypeSiteMappingScalarFieldEnum]


  export const OncologyHistologyMasterScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    morphologyCode: 'morphologyCode',
    morphologyName: 'morphologyName',
    behaviorCode: 'behaviorCode',
    behaviorName: 'behaviorName',
    description: 'description',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OncologyHistologyMasterScalarFieldEnum = (typeof OncologyHistologyMasterScalarFieldEnum)[keyof typeof OncologyHistologyMasterScalarFieldEnum]


  export const OncologyCarePlanScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    cancerDiagnosisId: 'cancerDiagnosisId',
    tumorBoardCaseId: 'tumorBoardCaseId',
    planNumber: 'planNumber',
    version: 'version',
    parentPlanId: 'parentPlanId',
    treatmentIntent: 'treatmentIntent',
    oncologySubspecialty: 'oncologySubspecialty',
    plannedModalities: 'plannedModalities',
    plannedCycles: 'plannedCycles',
    cycleDurationDays: 'cycleDurationDays',
    milestones: 'milestones',
    followUpSchedule: 'followUpSchedule',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
    createdBy: 'createdBy',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OncologyCarePlanScalarFieldEnum = (typeof OncologyCarePlanScalarFieldEnum)[keyof typeof OncologyCarePlanScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


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


  export type CancerDiagnosisWhereInput = {
    AND?: CancerDiagnosisWhereInput | CancerDiagnosisWhereInput[]
    OR?: CancerDiagnosisWhereInput[]
    NOT?: CancerDiagnosisWhereInput | CancerDiagnosisWhereInput[]
    id?: UuidFilter<"CancerDiagnosis"> | string
    tenantId?: UuidFilter<"CancerDiagnosis"> | string
    patientId?: UuidFilter<"CancerDiagnosis"> | string
    encounterId?: UuidNullableFilter<"CancerDiagnosis"> | string | null
    encounterDiagnosisId?: UuidNullableFilter<"CancerDiagnosis"> | string | null
    cancerType?: StringFilter<"CancerDiagnosis"> | string
    primarySite?: StringFilter<"CancerDiagnosis"> | string
    primarySiteCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    laterality?: StringNullableFilter<"CancerDiagnosis"> | string | null
    histologyMorphology?: StringNullableFilter<"CancerDiagnosis"> | string | null
    morphologyCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    icdCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    snomedCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    diagnosisDate?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    clinicalStatus?: StringFilter<"CancerDiagnosis"> | string
    verificationStatus?: StringFilter<"CancerDiagnosis"> | string
    grade?: StringNullableFilter<"CancerDiagnosis"> | string | null
    metastaticStatus?: StringFilter<"CancerDiagnosis"> | string
    isRecurrence?: BoolFilter<"CancerDiagnosis"> | boolean
    biomarkers?: JsonFilter<"CancerDiagnosis">
    ecogAtDiagnosis?: IntNullableFilter<"CancerDiagnosis"> | number | null
    diagnosedBy?: UuidFilter<"CancerDiagnosis"> | string
    notes?: StringNullableFilter<"CancerDiagnosis"> | string | null
    createdAt?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    updatedAt?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    stagings?: TumorStagingListRelationFilter
    tumorBoardCases?: TumorBoardCaseListRelationFilter
    carePlans?: OncologyCarePlanListRelationFilter
  }

  export type CancerDiagnosisOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    encounterDiagnosisId?: SortOrderInput | SortOrder
    cancerType?: SortOrder
    primarySite?: SortOrder
    primarySiteCode?: SortOrderInput | SortOrder
    laterality?: SortOrderInput | SortOrder
    histologyMorphology?: SortOrderInput | SortOrder
    morphologyCode?: SortOrderInput | SortOrder
    icdCode?: SortOrderInput | SortOrder
    snomedCode?: SortOrderInput | SortOrder
    diagnosisDate?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    grade?: SortOrderInput | SortOrder
    metastaticStatus?: SortOrder
    isRecurrence?: SortOrder
    biomarkers?: SortOrder
    ecogAtDiagnosis?: SortOrderInput | SortOrder
    diagnosedBy?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    stagings?: TumorStagingOrderByRelationAggregateInput
    tumorBoardCases?: TumorBoardCaseOrderByRelationAggregateInput
    carePlans?: OncologyCarePlanOrderByRelationAggregateInput
  }

  export type CancerDiagnosisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CancerDiagnosisWhereInput | CancerDiagnosisWhereInput[]
    OR?: CancerDiagnosisWhereInput[]
    NOT?: CancerDiagnosisWhereInput | CancerDiagnosisWhereInput[]
    tenantId?: UuidFilter<"CancerDiagnosis"> | string
    patientId?: UuidFilter<"CancerDiagnosis"> | string
    encounterId?: UuidNullableFilter<"CancerDiagnosis"> | string | null
    encounterDiagnosisId?: UuidNullableFilter<"CancerDiagnosis"> | string | null
    cancerType?: StringFilter<"CancerDiagnosis"> | string
    primarySite?: StringFilter<"CancerDiagnosis"> | string
    primarySiteCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    laterality?: StringNullableFilter<"CancerDiagnosis"> | string | null
    histologyMorphology?: StringNullableFilter<"CancerDiagnosis"> | string | null
    morphologyCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    icdCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    snomedCode?: StringNullableFilter<"CancerDiagnosis"> | string | null
    diagnosisDate?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    clinicalStatus?: StringFilter<"CancerDiagnosis"> | string
    verificationStatus?: StringFilter<"CancerDiagnosis"> | string
    grade?: StringNullableFilter<"CancerDiagnosis"> | string | null
    metastaticStatus?: StringFilter<"CancerDiagnosis"> | string
    isRecurrence?: BoolFilter<"CancerDiagnosis"> | boolean
    biomarkers?: JsonFilter<"CancerDiagnosis">
    ecogAtDiagnosis?: IntNullableFilter<"CancerDiagnosis"> | number | null
    diagnosedBy?: UuidFilter<"CancerDiagnosis"> | string
    notes?: StringNullableFilter<"CancerDiagnosis"> | string | null
    createdAt?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    updatedAt?: DateTimeFilter<"CancerDiagnosis"> | Date | string
    stagings?: TumorStagingListRelationFilter
    tumorBoardCases?: TumorBoardCaseListRelationFilter
    carePlans?: OncologyCarePlanListRelationFilter
  }, "id">

  export type CancerDiagnosisOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    encounterDiagnosisId?: SortOrderInput | SortOrder
    cancerType?: SortOrder
    primarySite?: SortOrder
    primarySiteCode?: SortOrderInput | SortOrder
    laterality?: SortOrderInput | SortOrder
    histologyMorphology?: SortOrderInput | SortOrder
    morphologyCode?: SortOrderInput | SortOrder
    icdCode?: SortOrderInput | SortOrder
    snomedCode?: SortOrderInput | SortOrder
    diagnosisDate?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    grade?: SortOrderInput | SortOrder
    metastaticStatus?: SortOrder
    isRecurrence?: SortOrder
    biomarkers?: SortOrder
    ecogAtDiagnosis?: SortOrderInput | SortOrder
    diagnosedBy?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CancerDiagnosisCountOrderByAggregateInput
    _avg?: CancerDiagnosisAvgOrderByAggregateInput
    _max?: CancerDiagnosisMaxOrderByAggregateInput
    _min?: CancerDiagnosisMinOrderByAggregateInput
    _sum?: CancerDiagnosisSumOrderByAggregateInput
  }

  export type CancerDiagnosisScalarWhereWithAggregatesInput = {
    AND?: CancerDiagnosisScalarWhereWithAggregatesInput | CancerDiagnosisScalarWhereWithAggregatesInput[]
    OR?: CancerDiagnosisScalarWhereWithAggregatesInput[]
    NOT?: CancerDiagnosisScalarWhereWithAggregatesInput | CancerDiagnosisScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CancerDiagnosis"> | string
    tenantId?: UuidWithAggregatesFilter<"CancerDiagnosis"> | string
    patientId?: UuidWithAggregatesFilter<"CancerDiagnosis"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    encounterDiagnosisId?: UuidNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    cancerType?: StringWithAggregatesFilter<"CancerDiagnosis"> | string
    primarySite?: StringWithAggregatesFilter<"CancerDiagnosis"> | string
    primarySiteCode?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    laterality?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    histologyMorphology?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    morphologyCode?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    icdCode?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    snomedCode?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    diagnosisDate?: DateTimeWithAggregatesFilter<"CancerDiagnosis"> | Date | string
    clinicalStatus?: StringWithAggregatesFilter<"CancerDiagnosis"> | string
    verificationStatus?: StringWithAggregatesFilter<"CancerDiagnosis"> | string
    grade?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    metastaticStatus?: StringWithAggregatesFilter<"CancerDiagnosis"> | string
    isRecurrence?: BoolWithAggregatesFilter<"CancerDiagnosis"> | boolean
    biomarkers?: JsonWithAggregatesFilter<"CancerDiagnosis">
    ecogAtDiagnosis?: IntNullableWithAggregatesFilter<"CancerDiagnosis"> | number | null
    diagnosedBy?: UuidWithAggregatesFilter<"CancerDiagnosis"> | string
    notes?: StringNullableWithAggregatesFilter<"CancerDiagnosis"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CancerDiagnosis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CancerDiagnosis"> | Date | string
  }

  export type TumorStagingWhereInput = {
    AND?: TumorStagingWhereInput | TumorStagingWhereInput[]
    OR?: TumorStagingWhereInput[]
    NOT?: TumorStagingWhereInput | TumorStagingWhereInput[]
    id?: UuidFilter<"TumorStaging"> | string
    tenantId?: UuidFilter<"TumorStaging"> | string
    cancerDiagnosisId?: UuidFilter<"TumorStaging"> | string
    patientId?: UuidFilter<"TumorStaging"> | string
    encounterId?: UuidNullableFilter<"TumorStaging"> | string | null
    providerId?: UuidNullableFilter<"TumorStaging"> | string | null
    stagingSystem?: StringFilter<"TumorStaging"> | string
    stagingEdition?: StringNullableFilter<"TumorStaging"> | string | null
    stagingType?: StringFilter<"TumorStaging"> | string
    stageGroup?: StringNullableFilter<"TumorStaging"> | string | null
    tCategory?: StringNullableFilter<"TumorStaging"> | string | null
    nCategory?: StringNullableFilter<"TumorStaging"> | string | null
    mCategory?: StringNullableFilter<"TumorStaging"> | string | null
    bodySite?: StringNullableFilter<"TumorStaging"> | string | null
    grade?: StringNullableFilter<"TumorStaging"> | string | null
    histology?: StringNullableFilter<"TumorStaging"> | string | null
    stagingDate?: DateTimeFilter<"TumorStaging"> | Date | string
    status?: StringFilter<"TumorStaging"> | string
    notes?: StringNullableFilter<"TumorStaging"> | string | null
    createdAt?: DateTimeFilter<"TumorStaging"> | Date | string
    updatedAt?: DateTimeFilter<"TumorStaging"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }

  export type TumorStagingOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerDiagnosisId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    providerId?: SortOrderInput | SortOrder
    stagingSystem?: SortOrder
    stagingEdition?: SortOrderInput | SortOrder
    stagingType?: SortOrder
    stageGroup?: SortOrderInput | SortOrder
    tCategory?: SortOrderInput | SortOrder
    nCategory?: SortOrderInput | SortOrder
    mCategory?: SortOrderInput | SortOrder
    bodySite?: SortOrderInput | SortOrder
    grade?: SortOrderInput | SortOrder
    histology?: SortOrderInput | SortOrder
    stagingDate?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cancerDiagnosis?: CancerDiagnosisOrderByWithRelationInput
  }

  export type TumorStagingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TumorStagingWhereInput | TumorStagingWhereInput[]
    OR?: TumorStagingWhereInput[]
    NOT?: TumorStagingWhereInput | TumorStagingWhereInput[]
    tenantId?: UuidFilter<"TumorStaging"> | string
    cancerDiagnosisId?: UuidFilter<"TumorStaging"> | string
    patientId?: UuidFilter<"TumorStaging"> | string
    encounterId?: UuidNullableFilter<"TumorStaging"> | string | null
    providerId?: UuidNullableFilter<"TumorStaging"> | string | null
    stagingSystem?: StringFilter<"TumorStaging"> | string
    stagingEdition?: StringNullableFilter<"TumorStaging"> | string | null
    stagingType?: StringFilter<"TumorStaging"> | string
    stageGroup?: StringNullableFilter<"TumorStaging"> | string | null
    tCategory?: StringNullableFilter<"TumorStaging"> | string | null
    nCategory?: StringNullableFilter<"TumorStaging"> | string | null
    mCategory?: StringNullableFilter<"TumorStaging"> | string | null
    bodySite?: StringNullableFilter<"TumorStaging"> | string | null
    grade?: StringNullableFilter<"TumorStaging"> | string | null
    histology?: StringNullableFilter<"TumorStaging"> | string | null
    stagingDate?: DateTimeFilter<"TumorStaging"> | Date | string
    status?: StringFilter<"TumorStaging"> | string
    notes?: StringNullableFilter<"TumorStaging"> | string | null
    createdAt?: DateTimeFilter<"TumorStaging"> | Date | string
    updatedAt?: DateTimeFilter<"TumorStaging"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }, "id">

  export type TumorStagingOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerDiagnosisId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    providerId?: SortOrderInput | SortOrder
    stagingSystem?: SortOrder
    stagingEdition?: SortOrderInput | SortOrder
    stagingType?: SortOrder
    stageGroup?: SortOrderInput | SortOrder
    tCategory?: SortOrderInput | SortOrder
    nCategory?: SortOrderInput | SortOrder
    mCategory?: SortOrderInput | SortOrder
    bodySite?: SortOrderInput | SortOrder
    grade?: SortOrderInput | SortOrder
    histology?: SortOrderInput | SortOrder
    stagingDate?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TumorStagingCountOrderByAggregateInput
    _max?: TumorStagingMaxOrderByAggregateInput
    _min?: TumorStagingMinOrderByAggregateInput
  }

  export type TumorStagingScalarWhereWithAggregatesInput = {
    AND?: TumorStagingScalarWhereWithAggregatesInput | TumorStagingScalarWhereWithAggregatesInput[]
    OR?: TumorStagingScalarWhereWithAggregatesInput[]
    NOT?: TumorStagingScalarWhereWithAggregatesInput | TumorStagingScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TumorStaging"> | string
    tenantId?: UuidWithAggregatesFilter<"TumorStaging"> | string
    cancerDiagnosisId?: UuidWithAggregatesFilter<"TumorStaging"> | string
    patientId?: UuidWithAggregatesFilter<"TumorStaging"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"TumorStaging"> | string | null
    providerId?: UuidNullableWithAggregatesFilter<"TumorStaging"> | string | null
    stagingSystem?: StringWithAggregatesFilter<"TumorStaging"> | string
    stagingEdition?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    stagingType?: StringWithAggregatesFilter<"TumorStaging"> | string
    stageGroup?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    tCategory?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    nCategory?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    mCategory?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    bodySite?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    grade?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    histology?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    stagingDate?: DateTimeWithAggregatesFilter<"TumorStaging"> | Date | string
    status?: StringWithAggregatesFilter<"TumorStaging"> | string
    notes?: StringNullableWithAggregatesFilter<"TumorStaging"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TumorStaging"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TumorStaging"> | Date | string
  }

  export type ChemoProtocolWhereInput = {
    AND?: ChemoProtocolWhereInput | ChemoProtocolWhereInput[]
    OR?: ChemoProtocolWhereInput[]
    NOT?: ChemoProtocolWhereInput | ChemoProtocolWhereInput[]
    id?: UuidFilter<"ChemoProtocol"> | string
    tenantId?: UuidFilter<"ChemoProtocol"> | string
    code?: StringFilter<"ChemoProtocol"> | string
    name?: StringFilter<"ChemoProtocol"> | string
    description?: StringNullableFilter<"ChemoProtocol"> | string | null
    cancerType?: StringFilter<"ChemoProtocol"> | string
    intent?: StringFilter<"ChemoProtocol"> | string
    regimen?: JsonFilter<"ChemoProtocol">
    totalCycles?: IntFilter<"ChemoProtocol"> | number
    cycleDurationDays?: IntFilter<"ChemoProtocol"> | number
    premedications?: JsonFilter<"ChemoProtocol">
    supportiveCare?: JsonFilter<"ChemoProtocol">
    emetogenicRisk?: StringNullableFilter<"ChemoProtocol"> | string | null
    doseFormula?: StringFilter<"ChemoProtocol"> | string
    labPrerequisites?: JsonFilter<"ChemoProtocol">
    hydration?: JsonFilter<"ChemoProtocol">
    isActive?: BoolFilter<"ChemoProtocol"> | boolean
    createdAt?: DateTimeFilter<"ChemoProtocol"> | Date | string
    updatedAt?: DateTimeFilter<"ChemoProtocol"> | Date | string
    createdBy?: UuidNullableFilter<"ChemoProtocol"> | string | null
    orders?: ChemoOrderListRelationFilter
  }

  export type ChemoProtocolOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    cancerType?: SortOrder
    intent?: SortOrder
    regimen?: SortOrder
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
    premedications?: SortOrder
    supportiveCare?: SortOrder
    emetogenicRisk?: SortOrderInput | SortOrder
    doseFormula?: SortOrder
    labPrerequisites?: SortOrder
    hydration?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    orders?: ChemoOrderOrderByRelationAggregateInput
  }

  export type ChemoProtocolWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_code?: ChemoProtocolTenantIdCodeCompoundUniqueInput
    AND?: ChemoProtocolWhereInput | ChemoProtocolWhereInput[]
    OR?: ChemoProtocolWhereInput[]
    NOT?: ChemoProtocolWhereInput | ChemoProtocolWhereInput[]
    tenantId?: UuidFilter<"ChemoProtocol"> | string
    code?: StringFilter<"ChemoProtocol"> | string
    name?: StringFilter<"ChemoProtocol"> | string
    description?: StringNullableFilter<"ChemoProtocol"> | string | null
    cancerType?: StringFilter<"ChemoProtocol"> | string
    intent?: StringFilter<"ChemoProtocol"> | string
    regimen?: JsonFilter<"ChemoProtocol">
    totalCycles?: IntFilter<"ChemoProtocol"> | number
    cycleDurationDays?: IntFilter<"ChemoProtocol"> | number
    premedications?: JsonFilter<"ChemoProtocol">
    supportiveCare?: JsonFilter<"ChemoProtocol">
    emetogenicRisk?: StringNullableFilter<"ChemoProtocol"> | string | null
    doseFormula?: StringFilter<"ChemoProtocol"> | string
    labPrerequisites?: JsonFilter<"ChemoProtocol">
    hydration?: JsonFilter<"ChemoProtocol">
    isActive?: BoolFilter<"ChemoProtocol"> | boolean
    createdAt?: DateTimeFilter<"ChemoProtocol"> | Date | string
    updatedAt?: DateTimeFilter<"ChemoProtocol"> | Date | string
    createdBy?: UuidNullableFilter<"ChemoProtocol"> | string | null
    orders?: ChemoOrderListRelationFilter
  }, "id" | "tenantId_code">

  export type ChemoProtocolOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    cancerType?: SortOrder
    intent?: SortOrder
    regimen?: SortOrder
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
    premedications?: SortOrder
    supportiveCare?: SortOrder
    emetogenicRisk?: SortOrderInput | SortOrder
    doseFormula?: SortOrder
    labPrerequisites?: SortOrder
    hydration?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    _count?: ChemoProtocolCountOrderByAggregateInput
    _avg?: ChemoProtocolAvgOrderByAggregateInput
    _max?: ChemoProtocolMaxOrderByAggregateInput
    _min?: ChemoProtocolMinOrderByAggregateInput
    _sum?: ChemoProtocolSumOrderByAggregateInput
  }

  export type ChemoProtocolScalarWhereWithAggregatesInput = {
    AND?: ChemoProtocolScalarWhereWithAggregatesInput | ChemoProtocolScalarWhereWithAggregatesInput[]
    OR?: ChemoProtocolScalarWhereWithAggregatesInput[]
    NOT?: ChemoProtocolScalarWhereWithAggregatesInput | ChemoProtocolScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChemoProtocol"> | string
    tenantId?: UuidWithAggregatesFilter<"ChemoProtocol"> | string
    code?: StringWithAggregatesFilter<"ChemoProtocol"> | string
    name?: StringWithAggregatesFilter<"ChemoProtocol"> | string
    description?: StringNullableWithAggregatesFilter<"ChemoProtocol"> | string | null
    cancerType?: StringWithAggregatesFilter<"ChemoProtocol"> | string
    intent?: StringWithAggregatesFilter<"ChemoProtocol"> | string
    regimen?: JsonWithAggregatesFilter<"ChemoProtocol">
    totalCycles?: IntWithAggregatesFilter<"ChemoProtocol"> | number
    cycleDurationDays?: IntWithAggregatesFilter<"ChemoProtocol"> | number
    premedications?: JsonWithAggregatesFilter<"ChemoProtocol">
    supportiveCare?: JsonWithAggregatesFilter<"ChemoProtocol">
    emetogenicRisk?: StringNullableWithAggregatesFilter<"ChemoProtocol"> | string | null
    doseFormula?: StringWithAggregatesFilter<"ChemoProtocol"> | string
    labPrerequisites?: JsonWithAggregatesFilter<"ChemoProtocol">
    hydration?: JsonWithAggregatesFilter<"ChemoProtocol">
    isActive?: BoolWithAggregatesFilter<"ChemoProtocol"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ChemoProtocol"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChemoProtocol"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"ChemoProtocol"> | string | null
  }

  export type ChemoOrderWhereInput = {
    AND?: ChemoOrderWhereInput | ChemoOrderWhereInput[]
    OR?: ChemoOrderWhereInput[]
    NOT?: ChemoOrderWhereInput | ChemoOrderWhereInput[]
    id?: UuidFilter<"ChemoOrder"> | string
    tenantId?: UuidFilter<"ChemoOrder"> | string
    patientId?: UuidFilter<"ChemoOrder"> | string
    encounterId?: UuidNullableFilter<"ChemoOrder"> | string | null
    protocolId?: UuidFilter<"ChemoOrder"> | string
    orderingProvider?: UuidFilter<"ChemoOrder"> | string
    cycleNumber?: IntFilter<"ChemoOrder"> | number
    dayNumber?: IntFilter<"ChemoOrder"> | number
    scheduledDate?: DateTimeFilter<"ChemoOrder"> | Date | string
    administeredAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    bsa?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    weight?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    height?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: UuidNullableFilter<"ChemoOrder"> | string | null
    oncologyCarePlanId?: UuidNullableFilter<"ChemoOrder"> | string | null
    hepaticAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    renalAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    doseAdjustments?: JsonFilter<"ChemoOrder">
    preChemoChecklist?: JsonFilter<"ChemoOrder">
    status?: StringFilter<"ChemoOrder"> | string
    verifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    verifiedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    secondVerifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    administeredBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    adverseReactions?: JsonFilter<"ChemoOrder">
    administrationDetails?: JsonFilter<"ChemoOrder">
    drugPreparationDetails?: JsonFilter<"ChemoOrder">
    nurseVerificationChecklist?: JsonFilter<"ChemoOrder">
    notes?: StringNullableFilter<"ChemoOrder"> | string | null
    createdAt?: DateTimeFilter<"ChemoOrder"> | Date | string
    updatedAt?: DateTimeFilter<"ChemoOrder"> | Date | string
    protocol?: XOR<ChemoProtocolScalarRelationFilter, ChemoProtocolWhereInput>
  }

  export type ChemoOrderOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    protocolId?: SortOrder
    orderingProvider?: SortOrder
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    scheduledDate?: SortOrder
    administeredAt?: SortOrderInput | SortOrder
    bsa?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    creatinineClearance?: SortOrderInput | SortOrder
    cancerDiagnosisId?: SortOrderInput | SortOrder
    oncologyCarePlanId?: SortOrderInput | SortOrder
    hepaticAdjustmentGrade?: SortOrderInput | SortOrder
    renalAdjustmentGrade?: SortOrderInput | SortOrder
    doseAdjustments?: SortOrder
    preChemoChecklist?: SortOrder
    status?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    secondVerifiedBy?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    administeredBy?: SortOrderInput | SortOrder
    adverseReactions?: SortOrder
    administrationDetails?: SortOrder
    drugPreparationDetails?: SortOrder
    nurseVerificationChecklist?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    protocol?: ChemoProtocolOrderByWithRelationInput
  }

  export type ChemoOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChemoOrderWhereInput | ChemoOrderWhereInput[]
    OR?: ChemoOrderWhereInput[]
    NOT?: ChemoOrderWhereInput | ChemoOrderWhereInput[]
    tenantId?: UuidFilter<"ChemoOrder"> | string
    patientId?: UuidFilter<"ChemoOrder"> | string
    encounterId?: UuidNullableFilter<"ChemoOrder"> | string | null
    protocolId?: UuidFilter<"ChemoOrder"> | string
    orderingProvider?: UuidFilter<"ChemoOrder"> | string
    cycleNumber?: IntFilter<"ChemoOrder"> | number
    dayNumber?: IntFilter<"ChemoOrder"> | number
    scheduledDate?: DateTimeFilter<"ChemoOrder"> | Date | string
    administeredAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    bsa?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    weight?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    height?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: UuidNullableFilter<"ChemoOrder"> | string | null
    oncologyCarePlanId?: UuidNullableFilter<"ChemoOrder"> | string | null
    hepaticAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    renalAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    doseAdjustments?: JsonFilter<"ChemoOrder">
    preChemoChecklist?: JsonFilter<"ChemoOrder">
    status?: StringFilter<"ChemoOrder"> | string
    verifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    verifiedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    secondVerifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    administeredBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    adverseReactions?: JsonFilter<"ChemoOrder">
    administrationDetails?: JsonFilter<"ChemoOrder">
    drugPreparationDetails?: JsonFilter<"ChemoOrder">
    nurseVerificationChecklist?: JsonFilter<"ChemoOrder">
    notes?: StringNullableFilter<"ChemoOrder"> | string | null
    createdAt?: DateTimeFilter<"ChemoOrder"> | Date | string
    updatedAt?: DateTimeFilter<"ChemoOrder"> | Date | string
    protocol?: XOR<ChemoProtocolScalarRelationFilter, ChemoProtocolWhereInput>
  }, "id">

  export type ChemoOrderOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrderInput | SortOrder
    protocolId?: SortOrder
    orderingProvider?: SortOrder
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    scheduledDate?: SortOrder
    administeredAt?: SortOrderInput | SortOrder
    bsa?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    creatinineClearance?: SortOrderInput | SortOrder
    cancerDiagnosisId?: SortOrderInput | SortOrder
    oncologyCarePlanId?: SortOrderInput | SortOrder
    hepaticAdjustmentGrade?: SortOrderInput | SortOrder
    renalAdjustmentGrade?: SortOrderInput | SortOrder
    doseAdjustments?: SortOrder
    preChemoChecklist?: SortOrder
    status?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    secondVerifiedBy?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    administeredBy?: SortOrderInput | SortOrder
    adverseReactions?: SortOrder
    administrationDetails?: SortOrder
    drugPreparationDetails?: SortOrder
    nurseVerificationChecklist?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChemoOrderCountOrderByAggregateInput
    _avg?: ChemoOrderAvgOrderByAggregateInput
    _max?: ChemoOrderMaxOrderByAggregateInput
    _min?: ChemoOrderMinOrderByAggregateInput
    _sum?: ChemoOrderSumOrderByAggregateInput
  }

  export type ChemoOrderScalarWhereWithAggregatesInput = {
    AND?: ChemoOrderScalarWhereWithAggregatesInput | ChemoOrderScalarWhereWithAggregatesInput[]
    OR?: ChemoOrderScalarWhereWithAggregatesInput[]
    NOT?: ChemoOrderScalarWhereWithAggregatesInput | ChemoOrderScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ChemoOrder"> | string
    tenantId?: UuidWithAggregatesFilter<"ChemoOrder"> | string
    patientId?: UuidWithAggregatesFilter<"ChemoOrder"> | string
    encounterId?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    protocolId?: UuidWithAggregatesFilter<"ChemoOrder"> | string
    orderingProvider?: UuidWithAggregatesFilter<"ChemoOrder"> | string
    cycleNumber?: IntWithAggregatesFilter<"ChemoOrder"> | number
    dayNumber?: IntWithAggregatesFilter<"ChemoOrder"> | number
    scheduledDate?: DateTimeWithAggregatesFilter<"ChemoOrder"> | Date | string
    administeredAt?: DateTimeNullableWithAggregatesFilter<"ChemoOrder"> | Date | string | null
    bsa?: DecimalNullableWithAggregatesFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    weight?: DecimalNullableWithAggregatesFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    height?: DecimalNullableWithAggregatesFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: DecimalNullableWithAggregatesFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    oncologyCarePlanId?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    hepaticAdjustmentGrade?: StringNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    renalAdjustmentGrade?: StringNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    doseAdjustments?: JsonWithAggregatesFilter<"ChemoOrder">
    preChemoChecklist?: JsonWithAggregatesFilter<"ChemoOrder">
    status?: StringWithAggregatesFilter<"ChemoOrder"> | string
    verifiedBy?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"ChemoOrder"> | Date | string | null
    secondVerifiedBy?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    approvedBy?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"ChemoOrder"> | Date | string | null
    administeredBy?: UuidNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    adverseReactions?: JsonWithAggregatesFilter<"ChemoOrder">
    administrationDetails?: JsonWithAggregatesFilter<"ChemoOrder">
    drugPreparationDetails?: JsonWithAggregatesFilter<"ChemoOrder">
    nurseVerificationChecklist?: JsonWithAggregatesFilter<"ChemoOrder">
    notes?: StringNullableWithAggregatesFilter<"ChemoOrder"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChemoOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChemoOrder"> | Date | string
  }

  export type TumorBoardCaseWhereInput = {
    AND?: TumorBoardCaseWhereInput | TumorBoardCaseWhereInput[]
    OR?: TumorBoardCaseWhereInput[]
    NOT?: TumorBoardCaseWhereInput | TumorBoardCaseWhereInput[]
    id?: UuidFilter<"TumorBoardCase"> | string
    tenantId?: UuidFilter<"TumorBoardCase"> | string
    patientId?: UuidFilter<"TumorBoardCase"> | string
    cancerDiagnosisId?: UuidFilter<"TumorBoardCase"> | string
    stagingId?: UuidNullableFilter<"TumorBoardCase"> | string | null
    meetingDate?: DateTimeFilter<"TumorBoardCase"> | Date | string
    presentedBy?: UuidFilter<"TumorBoardCase"> | string
    attendees?: JsonFilter<"TumorBoardCase">
    clinicalSummary?: StringNullableFilter<"TumorBoardCase"> | string | null
    imagingFindings?: StringNullableFilter<"TumorBoardCase"> | string | null
    pathologyReport?: StringNullableFilter<"TumorBoardCase"> | string | null
    molecularProfile?: StringNullableFilter<"TumorBoardCase"> | string | null
    mdtRecommendation?: StringNullableFilter<"TumorBoardCase"> | string | null
    treatmentIntent?: StringNullableFilter<"TumorBoardCase"> | string | null
    recommendedPathway?: JsonFilter<"TumorBoardCase">
    treatmentPlan?: JsonFilter<"TumorBoardCase">
    decision?: StringNullableFilter<"TumorBoardCase"> | string | null
    reviewOutcome?: StringNullableFilter<"TumorBoardCase"> | string | null
    followUpActions?: JsonFilter<"TumorBoardCase">
    status?: StringFilter<"TumorBoardCase"> | string
    createdAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
    updatedAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }

  export type TumorBoardCaseOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    stagingId?: SortOrderInput | SortOrder
    meetingDate?: SortOrder
    presentedBy?: SortOrder
    attendees?: SortOrder
    clinicalSummary?: SortOrderInput | SortOrder
    imagingFindings?: SortOrderInput | SortOrder
    pathologyReport?: SortOrderInput | SortOrder
    molecularProfile?: SortOrderInput | SortOrder
    mdtRecommendation?: SortOrderInput | SortOrder
    treatmentIntent?: SortOrderInput | SortOrder
    recommendedPathway?: SortOrder
    treatmentPlan?: SortOrder
    decision?: SortOrderInput | SortOrder
    reviewOutcome?: SortOrderInput | SortOrder
    followUpActions?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cancerDiagnosis?: CancerDiagnosisOrderByWithRelationInput
  }

  export type TumorBoardCaseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TumorBoardCaseWhereInput | TumorBoardCaseWhereInput[]
    OR?: TumorBoardCaseWhereInput[]
    NOT?: TumorBoardCaseWhereInput | TumorBoardCaseWhereInput[]
    tenantId?: UuidFilter<"TumorBoardCase"> | string
    patientId?: UuidFilter<"TumorBoardCase"> | string
    cancerDiagnosisId?: UuidFilter<"TumorBoardCase"> | string
    stagingId?: UuidNullableFilter<"TumorBoardCase"> | string | null
    meetingDate?: DateTimeFilter<"TumorBoardCase"> | Date | string
    presentedBy?: UuidFilter<"TumorBoardCase"> | string
    attendees?: JsonFilter<"TumorBoardCase">
    clinicalSummary?: StringNullableFilter<"TumorBoardCase"> | string | null
    imagingFindings?: StringNullableFilter<"TumorBoardCase"> | string | null
    pathologyReport?: StringNullableFilter<"TumorBoardCase"> | string | null
    molecularProfile?: StringNullableFilter<"TumorBoardCase"> | string | null
    mdtRecommendation?: StringNullableFilter<"TumorBoardCase"> | string | null
    treatmentIntent?: StringNullableFilter<"TumorBoardCase"> | string | null
    recommendedPathway?: JsonFilter<"TumorBoardCase">
    treatmentPlan?: JsonFilter<"TumorBoardCase">
    decision?: StringNullableFilter<"TumorBoardCase"> | string | null
    reviewOutcome?: StringNullableFilter<"TumorBoardCase"> | string | null
    followUpActions?: JsonFilter<"TumorBoardCase">
    status?: StringFilter<"TumorBoardCase"> | string
    createdAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
    updatedAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }, "id">

  export type TumorBoardCaseOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    stagingId?: SortOrderInput | SortOrder
    meetingDate?: SortOrder
    presentedBy?: SortOrder
    attendees?: SortOrder
    clinicalSummary?: SortOrderInput | SortOrder
    imagingFindings?: SortOrderInput | SortOrder
    pathologyReport?: SortOrderInput | SortOrder
    molecularProfile?: SortOrderInput | SortOrder
    mdtRecommendation?: SortOrderInput | SortOrder
    treatmentIntent?: SortOrderInput | SortOrder
    recommendedPathway?: SortOrder
    treatmentPlan?: SortOrder
    decision?: SortOrderInput | SortOrder
    reviewOutcome?: SortOrderInput | SortOrder
    followUpActions?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TumorBoardCaseCountOrderByAggregateInput
    _max?: TumorBoardCaseMaxOrderByAggregateInput
    _min?: TumorBoardCaseMinOrderByAggregateInput
  }

  export type TumorBoardCaseScalarWhereWithAggregatesInput = {
    AND?: TumorBoardCaseScalarWhereWithAggregatesInput | TumorBoardCaseScalarWhereWithAggregatesInput[]
    OR?: TumorBoardCaseScalarWhereWithAggregatesInput[]
    NOT?: TumorBoardCaseScalarWhereWithAggregatesInput | TumorBoardCaseScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TumorBoardCase"> | string
    tenantId?: UuidWithAggregatesFilter<"TumorBoardCase"> | string
    patientId?: UuidWithAggregatesFilter<"TumorBoardCase"> | string
    cancerDiagnosisId?: UuidWithAggregatesFilter<"TumorBoardCase"> | string
    stagingId?: UuidNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    meetingDate?: DateTimeWithAggregatesFilter<"TumorBoardCase"> | Date | string
    presentedBy?: UuidWithAggregatesFilter<"TumorBoardCase"> | string
    attendees?: JsonWithAggregatesFilter<"TumorBoardCase">
    clinicalSummary?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    imagingFindings?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    pathologyReport?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    molecularProfile?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    mdtRecommendation?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    treatmentIntent?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    recommendedPathway?: JsonWithAggregatesFilter<"TumorBoardCase">
    treatmentPlan?: JsonWithAggregatesFilter<"TumorBoardCase">
    decision?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    reviewOutcome?: StringNullableWithAggregatesFilter<"TumorBoardCase"> | string | null
    followUpActions?: JsonWithAggregatesFilter<"TumorBoardCase">
    status?: StringWithAggregatesFilter<"TumorBoardCase"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TumorBoardCase"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TumorBoardCase"> | Date | string
  }

  export type OncologyCancerTypeMasterWhereInput = {
    AND?: OncologyCancerTypeMasterWhereInput | OncologyCancerTypeMasterWhereInput[]
    OR?: OncologyCancerTypeMasterWhereInput[]
    NOT?: OncologyCancerTypeMasterWhereInput | OncologyCancerTypeMasterWhereInput[]
    id?: UuidFilter<"OncologyCancerTypeMaster"> | string
    tenantId?: UuidFilter<"OncologyCancerTypeMaster"> | string
    code?: StringFilter<"OncologyCancerTypeMaster"> | string
    name?: StringFilter<"OncologyCancerTypeMaster"> | string
    category?: StringNullableFilter<"OncologyCancerTypeMaster"> | string | null
    description?: StringNullableFilter<"OncologyCancerTypeMaster"> | string | null
    active?: BoolFilter<"OncologyCancerTypeMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyCancerTypeMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCancerTypeMaster"> | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingListRelationFilter
  }

  export type OncologyCancerTypeMasterOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    siteMappings?: OncologyCancerTypeSiteMappingOrderByRelationAggregateInput
  }

  export type OncologyCancerTypeMasterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_code?: OncologyCancerTypeMasterTenantIdCodeCompoundUniqueInput
    AND?: OncologyCancerTypeMasterWhereInput | OncologyCancerTypeMasterWhereInput[]
    OR?: OncologyCancerTypeMasterWhereInput[]
    NOT?: OncologyCancerTypeMasterWhereInput | OncologyCancerTypeMasterWhereInput[]
    tenantId?: UuidFilter<"OncologyCancerTypeMaster"> | string
    code?: StringFilter<"OncologyCancerTypeMaster"> | string
    name?: StringFilter<"OncologyCancerTypeMaster"> | string
    category?: StringNullableFilter<"OncologyCancerTypeMaster"> | string | null
    description?: StringNullableFilter<"OncologyCancerTypeMaster"> | string | null
    active?: BoolFilter<"OncologyCancerTypeMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyCancerTypeMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCancerTypeMaster"> | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingListRelationFilter
  }, "id" | "tenantId_code">

  export type OncologyCancerTypeMasterOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OncologyCancerTypeMasterCountOrderByAggregateInput
    _max?: OncologyCancerTypeMasterMaxOrderByAggregateInput
    _min?: OncologyCancerTypeMasterMinOrderByAggregateInput
  }

  export type OncologyCancerTypeMasterScalarWhereWithAggregatesInput = {
    AND?: OncologyCancerTypeMasterScalarWhereWithAggregatesInput | OncologyCancerTypeMasterScalarWhereWithAggregatesInput[]
    OR?: OncologyCancerTypeMasterScalarWhereWithAggregatesInput[]
    NOT?: OncologyCancerTypeMasterScalarWhereWithAggregatesInput | OncologyCancerTypeMasterScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OncologyCancerTypeMaster"> | string
    tenantId?: UuidWithAggregatesFilter<"OncologyCancerTypeMaster"> | string
    code?: StringWithAggregatesFilter<"OncologyCancerTypeMaster"> | string
    name?: StringWithAggregatesFilter<"OncologyCancerTypeMaster"> | string
    category?: StringNullableWithAggregatesFilter<"OncologyCancerTypeMaster"> | string | null
    description?: StringNullableWithAggregatesFilter<"OncologyCancerTypeMaster"> | string | null
    active?: BoolWithAggregatesFilter<"OncologyCancerTypeMaster"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OncologyCancerTypeMaster"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OncologyCancerTypeMaster"> | Date | string
  }

  export type OncologyPrimarySiteMasterWhereInput = {
    AND?: OncologyPrimarySiteMasterWhereInput | OncologyPrimarySiteMasterWhereInput[]
    OR?: OncologyPrimarySiteMasterWhereInput[]
    NOT?: OncologyPrimarySiteMasterWhereInput | OncologyPrimarySiteMasterWhereInput[]
    id?: UuidFilter<"OncologyPrimarySiteMaster"> | string
    tenantId?: UuidFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteCode?: StringFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteName?: StringFilter<"OncologyPrimarySiteMaster"> | string
    bodySystem?: StringNullableFilter<"OncologyPrimarySiteMaster"> | string | null
    lateralityApplicable?: BoolFilter<"OncologyPrimarySiteMaster"> | boolean
    mappingType?: StringNullableFilter<"OncologyPrimarySiteMaster"> | string | null
    active?: BoolFilter<"OncologyPrimarySiteMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyPrimarySiteMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyPrimarySiteMaster"> | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingListRelationFilter
  }

  export type OncologyPrimarySiteMasterOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    icdoSiteCode?: SortOrder
    icdoSiteName?: SortOrder
    bodySystem?: SortOrderInput | SortOrder
    lateralityApplicable?: SortOrder
    mappingType?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    siteMappings?: OncologyCancerTypeSiteMappingOrderByRelationAggregateInput
  }

  export type OncologyPrimarySiteMasterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_icdoSiteCode?: OncologyPrimarySiteMasterTenantIdIcdoSiteCodeCompoundUniqueInput
    AND?: OncologyPrimarySiteMasterWhereInput | OncologyPrimarySiteMasterWhereInput[]
    OR?: OncologyPrimarySiteMasterWhereInput[]
    NOT?: OncologyPrimarySiteMasterWhereInput | OncologyPrimarySiteMasterWhereInput[]
    tenantId?: UuidFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteCode?: StringFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteName?: StringFilter<"OncologyPrimarySiteMaster"> | string
    bodySystem?: StringNullableFilter<"OncologyPrimarySiteMaster"> | string | null
    lateralityApplicable?: BoolFilter<"OncologyPrimarySiteMaster"> | boolean
    mappingType?: StringNullableFilter<"OncologyPrimarySiteMaster"> | string | null
    active?: BoolFilter<"OncologyPrimarySiteMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyPrimarySiteMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyPrimarySiteMaster"> | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingListRelationFilter
  }, "id" | "tenantId_icdoSiteCode">

  export type OncologyPrimarySiteMasterOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    icdoSiteCode?: SortOrder
    icdoSiteName?: SortOrder
    bodySystem?: SortOrderInput | SortOrder
    lateralityApplicable?: SortOrder
    mappingType?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OncologyPrimarySiteMasterCountOrderByAggregateInput
    _max?: OncologyPrimarySiteMasterMaxOrderByAggregateInput
    _min?: OncologyPrimarySiteMasterMinOrderByAggregateInput
  }

  export type OncologyPrimarySiteMasterScalarWhereWithAggregatesInput = {
    AND?: OncologyPrimarySiteMasterScalarWhereWithAggregatesInput | OncologyPrimarySiteMasterScalarWhereWithAggregatesInput[]
    OR?: OncologyPrimarySiteMasterScalarWhereWithAggregatesInput[]
    NOT?: OncologyPrimarySiteMasterScalarWhereWithAggregatesInput | OncologyPrimarySiteMasterScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string
    tenantId?: UuidWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteCode?: StringWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string
    icdoSiteName?: StringWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string
    bodySystem?: StringNullableWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string | null
    lateralityApplicable?: BoolWithAggregatesFilter<"OncologyPrimarySiteMaster"> | boolean
    mappingType?: StringNullableWithAggregatesFilter<"OncologyPrimarySiteMaster"> | string | null
    active?: BoolWithAggregatesFilter<"OncologyPrimarySiteMaster"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OncologyPrimarySiteMaster"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OncologyPrimarySiteMaster"> | Date | string
  }

  export type OncologyCancerTypeSiteMappingWhereInput = {
    AND?: OncologyCancerTypeSiteMappingWhereInput | OncologyCancerTypeSiteMappingWhereInput[]
    OR?: OncologyCancerTypeSiteMappingWhereInput[]
    NOT?: OncologyCancerTypeSiteMappingWhereInput | OncologyCancerTypeSiteMappingWhereInput[]
    id?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    tenantId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    cancerTypeId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    primarySiteId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    isDefault?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    active?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    createdAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    cancerType?: XOR<OncologyCancerTypeMasterScalarRelationFilter, OncologyCancerTypeMasterWhereInput>
    primarySite?: XOR<OncologyPrimarySiteMasterScalarRelationFilter, OncologyPrimarySiteMasterWhereInput>
  }

  export type OncologyCancerTypeSiteMappingOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerTypeId?: SortOrder
    primarySiteId?: SortOrder
    isDefault?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cancerType?: OncologyCancerTypeMasterOrderByWithRelationInput
    primarySite?: OncologyPrimarySiteMasterOrderByWithRelationInput
  }

  export type OncologyCancerTypeSiteMappingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_cancerTypeId_primarySiteId?: OncologyCancerTypeSiteMappingTenantIdCancerTypeIdPrimarySiteIdCompoundUniqueInput
    AND?: OncologyCancerTypeSiteMappingWhereInput | OncologyCancerTypeSiteMappingWhereInput[]
    OR?: OncologyCancerTypeSiteMappingWhereInput[]
    NOT?: OncologyCancerTypeSiteMappingWhereInput | OncologyCancerTypeSiteMappingWhereInput[]
    tenantId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    cancerTypeId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    primarySiteId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    isDefault?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    active?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    createdAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    cancerType?: XOR<OncologyCancerTypeMasterScalarRelationFilter, OncologyCancerTypeMasterWhereInput>
    primarySite?: XOR<OncologyPrimarySiteMasterScalarRelationFilter, OncologyPrimarySiteMasterWhereInput>
  }, "id" | "tenantId_cancerTypeId_primarySiteId">

  export type OncologyCancerTypeSiteMappingOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerTypeId?: SortOrder
    primarySiteId?: SortOrder
    isDefault?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OncologyCancerTypeSiteMappingCountOrderByAggregateInput
    _max?: OncologyCancerTypeSiteMappingMaxOrderByAggregateInput
    _min?: OncologyCancerTypeSiteMappingMinOrderByAggregateInput
  }

  export type OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput = {
    AND?: OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput | OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput[]
    OR?: OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput[]
    NOT?: OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput | OncologyCancerTypeSiteMappingScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | string
    tenantId?: UuidWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | string
    cancerTypeId?: UuidWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | string
    primarySiteId?: UuidWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | string
    isDefault?: BoolWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | boolean
    active?: BoolWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OncologyCancerTypeSiteMapping"> | Date | string
  }

  export type OncologyHistologyMasterWhereInput = {
    AND?: OncologyHistologyMasterWhereInput | OncologyHistologyMasterWhereInput[]
    OR?: OncologyHistologyMasterWhereInput[]
    NOT?: OncologyHistologyMasterWhereInput | OncologyHistologyMasterWhereInput[]
    id?: UuidFilter<"OncologyHistologyMaster"> | string
    tenantId?: UuidFilter<"OncologyHistologyMaster"> | string
    morphologyCode?: StringFilter<"OncologyHistologyMaster"> | string
    morphologyName?: StringFilter<"OncologyHistologyMaster"> | string
    behaviorCode?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    behaviorName?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    description?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    active?: BoolFilter<"OncologyHistologyMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyHistologyMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyHistologyMaster"> | Date | string
  }

  export type OncologyHistologyMasterOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    morphologyCode?: SortOrder
    morphologyName?: SortOrder
    behaviorCode?: SortOrderInput | SortOrder
    behaviorName?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyHistologyMasterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_morphologyCode?: OncologyHistologyMasterTenantIdMorphologyCodeCompoundUniqueInput
    AND?: OncologyHistologyMasterWhereInput | OncologyHistologyMasterWhereInput[]
    OR?: OncologyHistologyMasterWhereInput[]
    NOT?: OncologyHistologyMasterWhereInput | OncologyHistologyMasterWhereInput[]
    tenantId?: UuidFilter<"OncologyHistologyMaster"> | string
    morphologyCode?: StringFilter<"OncologyHistologyMaster"> | string
    morphologyName?: StringFilter<"OncologyHistologyMaster"> | string
    behaviorCode?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    behaviorName?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    description?: StringNullableFilter<"OncologyHistologyMaster"> | string | null
    active?: BoolFilter<"OncologyHistologyMaster"> | boolean
    createdAt?: DateTimeFilter<"OncologyHistologyMaster"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyHistologyMaster"> | Date | string
  }, "id" | "tenantId_morphologyCode">

  export type OncologyHistologyMasterOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    morphologyCode?: SortOrder
    morphologyName?: SortOrder
    behaviorCode?: SortOrderInput | SortOrder
    behaviorName?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OncologyHistologyMasterCountOrderByAggregateInput
    _max?: OncologyHistologyMasterMaxOrderByAggregateInput
    _min?: OncologyHistologyMasterMinOrderByAggregateInput
  }

  export type OncologyHistologyMasterScalarWhereWithAggregatesInput = {
    AND?: OncologyHistologyMasterScalarWhereWithAggregatesInput | OncologyHistologyMasterScalarWhereWithAggregatesInput[]
    OR?: OncologyHistologyMasterScalarWhereWithAggregatesInput[]
    NOT?: OncologyHistologyMasterScalarWhereWithAggregatesInput | OncologyHistologyMasterScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OncologyHistologyMaster"> | string
    tenantId?: UuidWithAggregatesFilter<"OncologyHistologyMaster"> | string
    morphologyCode?: StringWithAggregatesFilter<"OncologyHistologyMaster"> | string
    morphologyName?: StringWithAggregatesFilter<"OncologyHistologyMaster"> | string
    behaviorCode?: StringNullableWithAggregatesFilter<"OncologyHistologyMaster"> | string | null
    behaviorName?: StringNullableWithAggregatesFilter<"OncologyHistologyMaster"> | string | null
    description?: StringNullableWithAggregatesFilter<"OncologyHistologyMaster"> | string | null
    active?: BoolWithAggregatesFilter<"OncologyHistologyMaster"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OncologyHistologyMaster"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OncologyHistologyMaster"> | Date | string
  }

  export type OncologyCarePlanWhereInput = {
    AND?: OncologyCarePlanWhereInput | OncologyCarePlanWhereInput[]
    OR?: OncologyCarePlanWhereInput[]
    NOT?: OncologyCarePlanWhereInput | OncologyCarePlanWhereInput[]
    id?: UuidFilter<"OncologyCarePlan"> | string
    tenantId?: UuidFilter<"OncologyCarePlan"> | string
    patientId?: UuidFilter<"OncologyCarePlan"> | string
    cancerDiagnosisId?: UuidFilter<"OncologyCarePlan"> | string
    tumorBoardCaseId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    planNumber?: StringFilter<"OncologyCarePlan"> | string
    version?: IntFilter<"OncologyCarePlan"> | number
    parentPlanId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    treatmentIntent?: StringFilter<"OncologyCarePlan"> | string
    oncologySubspecialty?: StringNullableFilter<"OncologyCarePlan"> | string | null
    plannedModalities?: JsonFilter<"OncologyCarePlan">
    plannedCycles?: IntNullableFilter<"OncologyCarePlan"> | number | null
    cycleDurationDays?: IntNullableFilter<"OncologyCarePlan"> | number | null
    milestones?: JsonFilter<"OncologyCarePlan">
    followUpSchedule?: JsonFilter<"OncologyCarePlan">
    status?: StringFilter<"OncologyCarePlan"> | string
    startDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    endDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    createdBy?: UuidFilter<"OncologyCarePlan"> | string
    approvedBy?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    approvedAt?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    notes?: StringNullableFilter<"OncologyCarePlan"> | string | null
    createdAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }

  export type OncologyCarePlanOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    tumorBoardCaseId?: SortOrderInput | SortOrder
    planNumber?: SortOrder
    version?: SortOrder
    parentPlanId?: SortOrderInput | SortOrder
    treatmentIntent?: SortOrder
    oncologySubspecialty?: SortOrderInput | SortOrder
    plannedModalities?: SortOrder
    plannedCycles?: SortOrderInput | SortOrder
    cycleDurationDays?: SortOrderInput | SortOrder
    milestones?: SortOrder
    followUpSchedule?: SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cancerDiagnosis?: CancerDiagnosisOrderByWithRelationInput
  }

  export type OncologyCarePlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OncologyCarePlanWhereInput | OncologyCarePlanWhereInput[]
    OR?: OncologyCarePlanWhereInput[]
    NOT?: OncologyCarePlanWhereInput | OncologyCarePlanWhereInput[]
    tenantId?: UuidFilter<"OncologyCarePlan"> | string
    patientId?: UuidFilter<"OncologyCarePlan"> | string
    cancerDiagnosisId?: UuidFilter<"OncologyCarePlan"> | string
    tumorBoardCaseId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    planNumber?: StringFilter<"OncologyCarePlan"> | string
    version?: IntFilter<"OncologyCarePlan"> | number
    parentPlanId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    treatmentIntent?: StringFilter<"OncologyCarePlan"> | string
    oncologySubspecialty?: StringNullableFilter<"OncologyCarePlan"> | string | null
    plannedModalities?: JsonFilter<"OncologyCarePlan">
    plannedCycles?: IntNullableFilter<"OncologyCarePlan"> | number | null
    cycleDurationDays?: IntNullableFilter<"OncologyCarePlan"> | number | null
    milestones?: JsonFilter<"OncologyCarePlan">
    followUpSchedule?: JsonFilter<"OncologyCarePlan">
    status?: StringFilter<"OncologyCarePlan"> | string
    startDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    endDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    createdBy?: UuidFilter<"OncologyCarePlan"> | string
    approvedBy?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    approvedAt?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    notes?: StringNullableFilter<"OncologyCarePlan"> | string | null
    createdAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
    cancerDiagnosis?: XOR<CancerDiagnosisScalarRelationFilter, CancerDiagnosisWhereInput>
  }, "id">

  export type OncologyCarePlanOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    tumorBoardCaseId?: SortOrderInput | SortOrder
    planNumber?: SortOrder
    version?: SortOrder
    parentPlanId?: SortOrderInput | SortOrder
    treatmentIntent?: SortOrder
    oncologySubspecialty?: SortOrderInput | SortOrder
    plannedModalities?: SortOrder
    plannedCycles?: SortOrderInput | SortOrder
    cycleDurationDays?: SortOrderInput | SortOrder
    milestones?: SortOrder
    followUpSchedule?: SortOrder
    status?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OncologyCarePlanCountOrderByAggregateInput
    _avg?: OncologyCarePlanAvgOrderByAggregateInput
    _max?: OncologyCarePlanMaxOrderByAggregateInput
    _min?: OncologyCarePlanMinOrderByAggregateInput
    _sum?: OncologyCarePlanSumOrderByAggregateInput
  }

  export type OncologyCarePlanScalarWhereWithAggregatesInput = {
    AND?: OncologyCarePlanScalarWhereWithAggregatesInput | OncologyCarePlanScalarWhereWithAggregatesInput[]
    OR?: OncologyCarePlanScalarWhereWithAggregatesInput[]
    NOT?: OncologyCarePlanScalarWhereWithAggregatesInput | OncologyCarePlanScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OncologyCarePlan"> | string
    tenantId?: UuidWithAggregatesFilter<"OncologyCarePlan"> | string
    patientId?: UuidWithAggregatesFilter<"OncologyCarePlan"> | string
    cancerDiagnosisId?: UuidWithAggregatesFilter<"OncologyCarePlan"> | string
    tumorBoardCaseId?: UuidNullableWithAggregatesFilter<"OncologyCarePlan"> | string | null
    planNumber?: StringWithAggregatesFilter<"OncologyCarePlan"> | string
    version?: IntWithAggregatesFilter<"OncologyCarePlan"> | number
    parentPlanId?: UuidNullableWithAggregatesFilter<"OncologyCarePlan"> | string | null
    treatmentIntent?: StringWithAggregatesFilter<"OncologyCarePlan"> | string
    oncologySubspecialty?: StringNullableWithAggregatesFilter<"OncologyCarePlan"> | string | null
    plannedModalities?: JsonWithAggregatesFilter<"OncologyCarePlan">
    plannedCycles?: IntNullableWithAggregatesFilter<"OncologyCarePlan"> | number | null
    cycleDurationDays?: IntNullableWithAggregatesFilter<"OncologyCarePlan"> | number | null
    milestones?: JsonWithAggregatesFilter<"OncologyCarePlan">
    followUpSchedule?: JsonWithAggregatesFilter<"OncologyCarePlan">
    status?: StringWithAggregatesFilter<"OncologyCarePlan"> | string
    startDate?: DateTimeNullableWithAggregatesFilter<"OncologyCarePlan"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"OncologyCarePlan"> | Date | string | null
    createdBy?: UuidWithAggregatesFilter<"OncologyCarePlan"> | string
    approvedBy?: UuidNullableWithAggregatesFilter<"OncologyCarePlan"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"OncologyCarePlan"> | Date | string | null
    notes?: StringNullableWithAggregatesFilter<"OncologyCarePlan"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OncologyCarePlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OncologyCarePlan"> | Date | string
  }

  export type CancerDiagnosisCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingCreateNestedManyWithoutCancerDiagnosisInput
    tumorBoardCases?: TumorBoardCaseCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingUncheckedCreateNestedManyWithoutCancerDiagnosisInput
    tumorBoardCases?: TumorBoardCaseUncheckedCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanUncheckedCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUpdateManyWithoutCancerDiagnosisNestedInput
    tumorBoardCases?: TumorBoardCaseUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type CancerDiagnosisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
    tumorBoardCases?: TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type CancerDiagnosisCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CancerDiagnosisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancerDiagnosisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorStagingCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cancerDiagnosis: CancerDiagnosisCreateNestedOneWithoutStagingsInput
  }

  export type TumorStagingUncheckedCreateInput = {
    id?: string
    tenantId: string
    cancerDiagnosisId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorStagingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancerDiagnosis?: CancerDiagnosisUpdateOneRequiredWithoutStagingsNestedInput
  }

  export type TumorStagingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorStagingCreateManyInput = {
    id?: string
    tenantId: string
    cancerDiagnosisId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorStagingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorStagingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoProtocolCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    cancerType: string
    intent: string
    regimen: JsonNullValueInput | InputJsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: string | null
    doseFormula?: string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    orders?: ChemoOrderCreateNestedManyWithoutProtocolInput
  }

  export type ChemoProtocolUncheckedCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    cancerType: string
    intent: string
    regimen: JsonNullValueInput | InputJsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: string | null
    doseFormula?: string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
    orders?: ChemoOrderUncheckedCreateNestedManyWithoutProtocolInput
  }

  export type ChemoProtocolUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: ChemoOrderUpdateManyWithoutProtocolNestedInput
  }

  export type ChemoProtocolUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: ChemoOrderUncheckedUpdateManyWithoutProtocolNestedInput
  }

  export type ChemoProtocolCreateManyInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    cancerType: string
    intent: string
    regimen: JsonNullValueInput | InputJsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: string | null
    doseFormula?: string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
  }

  export type ChemoProtocolUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChemoProtocolUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChemoOrderCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    protocol: ChemoProtocolCreateNestedOneWithoutOrdersInput
  }

  export type ChemoOrderUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    protocolId: string
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChemoOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    protocol?: ChemoProtocolUpdateOneRequiredWithoutOrdersNestedInput
  }

  export type ChemoOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    protocolId?: StringFieldUpdateOperationsInput | string
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoOrderCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    protocolId: string
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChemoOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    protocolId?: StringFieldUpdateOperationsInput | string
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cancerDiagnosis: CancerDiagnosisCreateNestedOneWithoutTumorBoardCasesInput
  }

  export type TumorBoardCaseUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorBoardCaseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancerDiagnosis?: CancerDiagnosisUpdateOneRequiredWithoutTumorBoardCasesNestedInput
  }

  export type TumorBoardCaseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorBoardCaseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeMasterCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    category?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    siteMappings?: OncologyCancerTypeSiteMappingCreateNestedManyWithoutCancerTypeInput
  }

  export type OncologyCancerTypeMasterUncheckedCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    category?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUncheckedCreateNestedManyWithoutCancerTypeInput
  }

  export type OncologyCancerTypeMasterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUpdateManyWithoutCancerTypeNestedInput
  }

  export type OncologyCancerTypeMasterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutCancerTypeNestedInput
  }

  export type OncologyCancerTypeMasterCreateManyInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    category?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeMasterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeMasterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyPrimarySiteMasterCreateInput = {
    id?: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem?: string | null
    lateralityApplicable?: boolean
    mappingType?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    siteMappings?: OncologyCancerTypeSiteMappingCreateNestedManyWithoutPrimarySiteInput
  }

  export type OncologyPrimarySiteMasterUncheckedCreateInput = {
    id?: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem?: string | null
    lateralityApplicable?: boolean
    mappingType?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUncheckedCreateNestedManyWithoutPrimarySiteInput
  }

  export type OncologyPrimarySiteMasterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUpdateManyWithoutPrimarySiteNestedInput
  }

  export type OncologyPrimarySiteMasterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    siteMappings?: OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutPrimarySiteNestedInput
  }

  export type OncologyPrimarySiteMasterCreateManyInput = {
    id?: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem?: string | null
    lateralityApplicable?: boolean
    mappingType?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyPrimarySiteMasterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyPrimarySiteMasterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateInput = {
    id?: string
    tenantId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    cancerType: OncologyCancerTypeMasterCreateNestedOneWithoutSiteMappingsInput
    primarySite: OncologyPrimarySiteMasterCreateNestedOneWithoutSiteMappingsInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedCreateInput = {
    id?: string
    tenantId: string
    cancerTypeId: string
    primarySiteId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancerType?: OncologyCancerTypeMasterUpdateOneRequiredWithoutSiteMappingsNestedInput
    primarySite?: OncologyPrimarySiteMasterUpdateOneRequiredWithoutSiteMappingsNestedInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerTypeId?: StringFieldUpdateOperationsInput | string
    primarySiteId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateManyInput = {
    id?: string
    tenantId: string
    cancerTypeId: string
    primarySiteId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerTypeId?: StringFieldUpdateOperationsInput | string
    primarySiteId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyHistologyMasterCreateInput = {
    id?: string
    tenantId: string
    morphologyCode: string
    morphologyName: string
    behaviorCode?: string | null
    behaviorName?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyHistologyMasterUncheckedCreateInput = {
    id?: string
    tenantId: string
    morphologyCode: string
    morphologyName: string
    behaviorCode?: string | null
    behaviorName?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyHistologyMasterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    morphologyCode?: StringFieldUpdateOperationsInput | string
    morphologyName?: StringFieldUpdateOperationsInput | string
    behaviorCode?: NullableStringFieldUpdateOperationsInput | string | null
    behaviorName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyHistologyMasterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    morphologyCode?: StringFieldUpdateOperationsInput | string
    morphologyName?: StringFieldUpdateOperationsInput | string
    behaviorCode?: NullableStringFieldUpdateOperationsInput | string | null
    behaviorName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyHistologyMasterCreateManyInput = {
    id?: string
    tenantId: string
    morphologyCode: string
    morphologyName: string
    behaviorCode?: string | null
    behaviorName?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyHistologyMasterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    morphologyCode?: StringFieldUpdateOperationsInput | string
    morphologyName?: StringFieldUpdateOperationsInput | string
    behaviorCode?: NullableStringFieldUpdateOperationsInput | string | null
    behaviorName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyHistologyMasterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    morphologyCode?: StringFieldUpdateOperationsInput | string
    morphologyName?: StringFieldUpdateOperationsInput | string
    behaviorCode?: NullableStringFieldUpdateOperationsInput | string | null
    behaviorName?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cancerDiagnosis: CancerDiagnosisCreateNestedOneWithoutCarePlansInput
  }

  export type OncologyCarePlanUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCarePlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancerDiagnosis?: CancerDiagnosisUpdateOneRequiredWithoutCarePlansNestedInput
  }

  export type OncologyCarePlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    cancerDiagnosisId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCarePlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    cancerDiagnosisId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type TumorStagingListRelationFilter = {
    every?: TumorStagingWhereInput
    some?: TumorStagingWhereInput
    none?: TumorStagingWhereInput
  }

  export type TumorBoardCaseListRelationFilter = {
    every?: TumorBoardCaseWhereInput
    some?: TumorBoardCaseWhereInput
    none?: TumorBoardCaseWhereInput
  }

  export type OncologyCarePlanListRelationFilter = {
    every?: OncologyCarePlanWhereInput
    some?: OncologyCarePlanWhereInput
    none?: OncologyCarePlanWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TumorStagingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TumorBoardCaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OncologyCarePlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CancerDiagnosisCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    encounterDiagnosisId?: SortOrder
    cancerType?: SortOrder
    primarySite?: SortOrder
    primarySiteCode?: SortOrder
    laterality?: SortOrder
    histologyMorphology?: SortOrder
    morphologyCode?: SortOrder
    icdCode?: SortOrder
    snomedCode?: SortOrder
    diagnosisDate?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    grade?: SortOrder
    metastaticStatus?: SortOrder
    isRecurrence?: SortOrder
    biomarkers?: SortOrder
    ecogAtDiagnosis?: SortOrder
    diagnosedBy?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CancerDiagnosisAvgOrderByAggregateInput = {
    ecogAtDiagnosis?: SortOrder
  }

  export type CancerDiagnosisMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    encounterDiagnosisId?: SortOrder
    cancerType?: SortOrder
    primarySite?: SortOrder
    primarySiteCode?: SortOrder
    laterality?: SortOrder
    histologyMorphology?: SortOrder
    morphologyCode?: SortOrder
    icdCode?: SortOrder
    snomedCode?: SortOrder
    diagnosisDate?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    grade?: SortOrder
    metastaticStatus?: SortOrder
    isRecurrence?: SortOrder
    ecogAtDiagnosis?: SortOrder
    diagnosedBy?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CancerDiagnosisMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    encounterDiagnosisId?: SortOrder
    cancerType?: SortOrder
    primarySite?: SortOrder
    primarySiteCode?: SortOrder
    laterality?: SortOrder
    histologyMorphology?: SortOrder
    morphologyCode?: SortOrder
    icdCode?: SortOrder
    snomedCode?: SortOrder
    diagnosisDate?: SortOrder
    clinicalStatus?: SortOrder
    verificationStatus?: SortOrder
    grade?: SortOrder
    metastaticStatus?: SortOrder
    isRecurrence?: SortOrder
    ecogAtDiagnosis?: SortOrder
    diagnosedBy?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CancerDiagnosisSumOrderByAggregateInput = {
    ecogAtDiagnosis?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type CancerDiagnosisScalarRelationFilter = {
    is?: CancerDiagnosisWhereInput
    isNot?: CancerDiagnosisWhereInput
  }

  export type TumorStagingCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerDiagnosisId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    providerId?: SortOrder
    stagingSystem?: SortOrder
    stagingEdition?: SortOrder
    stagingType?: SortOrder
    stageGroup?: SortOrder
    tCategory?: SortOrder
    nCategory?: SortOrder
    mCategory?: SortOrder
    bodySite?: SortOrder
    grade?: SortOrder
    histology?: SortOrder
    stagingDate?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumorStagingMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerDiagnosisId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    providerId?: SortOrder
    stagingSystem?: SortOrder
    stagingEdition?: SortOrder
    stagingType?: SortOrder
    stageGroup?: SortOrder
    tCategory?: SortOrder
    nCategory?: SortOrder
    mCategory?: SortOrder
    bodySite?: SortOrder
    grade?: SortOrder
    histology?: SortOrder
    stagingDate?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumorStagingMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerDiagnosisId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    providerId?: SortOrder
    stagingSystem?: SortOrder
    stagingEdition?: SortOrder
    stagingType?: SortOrder
    stageGroup?: SortOrder
    tCategory?: SortOrder
    nCategory?: SortOrder
    mCategory?: SortOrder
    bodySite?: SortOrder
    grade?: SortOrder
    histology?: SortOrder
    stagingDate?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type ChemoOrderListRelationFilter = {
    every?: ChemoOrderWhereInput
    some?: ChemoOrderWhereInput
    none?: ChemoOrderWhereInput
  }

  export type ChemoOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChemoProtocolTenantIdCodeCompoundUniqueInput = {
    tenantId: string
    code: string
  }

  export type ChemoProtocolCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    cancerType?: SortOrder
    intent?: SortOrder
    regimen?: SortOrder
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
    premedications?: SortOrder
    supportiveCare?: SortOrder
    emetogenicRisk?: SortOrder
    doseFormula?: SortOrder
    labPrerequisites?: SortOrder
    hydration?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type ChemoProtocolAvgOrderByAggregateInput = {
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
  }

  export type ChemoProtocolMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    cancerType?: SortOrder
    intent?: SortOrder
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
    emetogenicRisk?: SortOrder
    doseFormula?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type ChemoProtocolMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    cancerType?: SortOrder
    intent?: SortOrder
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
    emetogenicRisk?: SortOrder
    doseFormula?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
  }

  export type ChemoProtocolSumOrderByAggregateInput = {
    totalCycles?: SortOrder
    cycleDurationDays?: SortOrder
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

  export type ChemoProtocolScalarRelationFilter = {
    is?: ChemoProtocolWhereInput
    isNot?: ChemoProtocolWhereInput
  }

  export type ChemoOrderCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    protocolId?: SortOrder
    orderingProvider?: SortOrder
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    scheduledDate?: SortOrder
    administeredAt?: SortOrder
    bsa?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    creatinineClearance?: SortOrder
    cancerDiagnosisId?: SortOrder
    oncologyCarePlanId?: SortOrder
    hepaticAdjustmentGrade?: SortOrder
    renalAdjustmentGrade?: SortOrder
    doseAdjustments?: SortOrder
    preChemoChecklist?: SortOrder
    status?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    secondVerifiedBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    administeredBy?: SortOrder
    adverseReactions?: SortOrder
    administrationDetails?: SortOrder
    drugPreparationDetails?: SortOrder
    nurseVerificationChecklist?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChemoOrderAvgOrderByAggregateInput = {
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    bsa?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    creatinineClearance?: SortOrder
  }

  export type ChemoOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    protocolId?: SortOrder
    orderingProvider?: SortOrder
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    scheduledDate?: SortOrder
    administeredAt?: SortOrder
    bsa?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    creatinineClearance?: SortOrder
    cancerDiagnosisId?: SortOrder
    oncologyCarePlanId?: SortOrder
    hepaticAdjustmentGrade?: SortOrder
    renalAdjustmentGrade?: SortOrder
    status?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    secondVerifiedBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    administeredBy?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChemoOrderMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    encounterId?: SortOrder
    protocolId?: SortOrder
    orderingProvider?: SortOrder
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    scheduledDate?: SortOrder
    administeredAt?: SortOrder
    bsa?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    creatinineClearance?: SortOrder
    cancerDiagnosisId?: SortOrder
    oncologyCarePlanId?: SortOrder
    hepaticAdjustmentGrade?: SortOrder
    renalAdjustmentGrade?: SortOrder
    status?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    secondVerifiedBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    administeredBy?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChemoOrderSumOrderByAggregateInput = {
    cycleNumber?: SortOrder
    dayNumber?: SortOrder
    bsa?: SortOrder
    weight?: SortOrder
    height?: SortOrder
    creatinineClearance?: SortOrder
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

  export type TumorBoardCaseCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    stagingId?: SortOrder
    meetingDate?: SortOrder
    presentedBy?: SortOrder
    attendees?: SortOrder
    clinicalSummary?: SortOrder
    imagingFindings?: SortOrder
    pathologyReport?: SortOrder
    molecularProfile?: SortOrder
    mdtRecommendation?: SortOrder
    treatmentIntent?: SortOrder
    recommendedPathway?: SortOrder
    treatmentPlan?: SortOrder
    decision?: SortOrder
    reviewOutcome?: SortOrder
    followUpActions?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumorBoardCaseMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    stagingId?: SortOrder
    meetingDate?: SortOrder
    presentedBy?: SortOrder
    clinicalSummary?: SortOrder
    imagingFindings?: SortOrder
    pathologyReport?: SortOrder
    molecularProfile?: SortOrder
    mdtRecommendation?: SortOrder
    treatmentIntent?: SortOrder
    decision?: SortOrder
    reviewOutcome?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TumorBoardCaseMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    stagingId?: SortOrder
    meetingDate?: SortOrder
    presentedBy?: SortOrder
    clinicalSummary?: SortOrder
    imagingFindings?: SortOrder
    pathologyReport?: SortOrder
    molecularProfile?: SortOrder
    mdtRecommendation?: SortOrder
    treatmentIntent?: SortOrder
    decision?: SortOrder
    reviewOutcome?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeSiteMappingListRelationFilter = {
    every?: OncologyCancerTypeSiteMappingWhereInput
    some?: OncologyCancerTypeSiteMappingWhereInput
    none?: OncologyCancerTypeSiteMappingWhereInput
  }

  export type OncologyCancerTypeSiteMappingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OncologyCancerTypeMasterTenantIdCodeCompoundUniqueInput = {
    tenantId: string
    code: string
  }

  export type OncologyCancerTypeMasterCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeMasterMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeMasterMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    category?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyPrimarySiteMasterTenantIdIcdoSiteCodeCompoundUniqueInput = {
    tenantId: string
    icdoSiteCode: string
  }

  export type OncologyPrimarySiteMasterCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    icdoSiteCode?: SortOrder
    icdoSiteName?: SortOrder
    bodySystem?: SortOrder
    lateralityApplicable?: SortOrder
    mappingType?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyPrimarySiteMasterMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    icdoSiteCode?: SortOrder
    icdoSiteName?: SortOrder
    bodySystem?: SortOrder
    lateralityApplicable?: SortOrder
    mappingType?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyPrimarySiteMasterMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    icdoSiteCode?: SortOrder
    icdoSiteName?: SortOrder
    bodySystem?: SortOrder
    lateralityApplicable?: SortOrder
    mappingType?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeMasterScalarRelationFilter = {
    is?: OncologyCancerTypeMasterWhereInput
    isNot?: OncologyCancerTypeMasterWhereInput
  }

  export type OncologyPrimarySiteMasterScalarRelationFilter = {
    is?: OncologyPrimarySiteMasterWhereInput
    isNot?: OncologyPrimarySiteMasterWhereInput
  }

  export type OncologyCancerTypeSiteMappingTenantIdCancerTypeIdPrimarySiteIdCompoundUniqueInput = {
    tenantId: string
    cancerTypeId: string
    primarySiteId: string
  }

  export type OncologyCancerTypeSiteMappingCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerTypeId?: SortOrder
    primarySiteId?: SortOrder
    isDefault?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeSiteMappingMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerTypeId?: SortOrder
    primarySiteId?: SortOrder
    isDefault?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCancerTypeSiteMappingMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    cancerTypeId?: SortOrder
    primarySiteId?: SortOrder
    isDefault?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyHistologyMasterTenantIdMorphologyCodeCompoundUniqueInput = {
    tenantId: string
    morphologyCode: string
  }

  export type OncologyHistologyMasterCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    morphologyCode?: SortOrder
    morphologyName?: SortOrder
    behaviorCode?: SortOrder
    behaviorName?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyHistologyMasterMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    morphologyCode?: SortOrder
    morphologyName?: SortOrder
    behaviorCode?: SortOrder
    behaviorName?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyHistologyMasterMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    morphologyCode?: SortOrder
    morphologyName?: SortOrder
    behaviorCode?: SortOrder
    behaviorName?: SortOrder
    description?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCarePlanCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    tumorBoardCaseId?: SortOrder
    planNumber?: SortOrder
    version?: SortOrder
    parentPlanId?: SortOrder
    treatmentIntent?: SortOrder
    oncologySubspecialty?: SortOrder
    plannedModalities?: SortOrder
    plannedCycles?: SortOrder
    cycleDurationDays?: SortOrder
    milestones?: SortOrder
    followUpSchedule?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCarePlanAvgOrderByAggregateInput = {
    version?: SortOrder
    plannedCycles?: SortOrder
    cycleDurationDays?: SortOrder
  }

  export type OncologyCarePlanMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    tumorBoardCaseId?: SortOrder
    planNumber?: SortOrder
    version?: SortOrder
    parentPlanId?: SortOrder
    treatmentIntent?: SortOrder
    oncologySubspecialty?: SortOrder
    plannedCycles?: SortOrder
    cycleDurationDays?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCarePlanMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    cancerDiagnosisId?: SortOrder
    tumorBoardCaseId?: SortOrder
    planNumber?: SortOrder
    version?: SortOrder
    parentPlanId?: SortOrder
    treatmentIntent?: SortOrder
    oncologySubspecialty?: SortOrder
    plannedCycles?: SortOrder
    cycleDurationDays?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdBy?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OncologyCarePlanSumOrderByAggregateInput = {
    version?: SortOrder
    plannedCycles?: SortOrder
    cycleDurationDays?: SortOrder
  }

  export type TumorStagingCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput> | TumorStagingCreateWithoutCancerDiagnosisInput[] | TumorStagingUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorStagingCreateOrConnectWithoutCancerDiagnosisInput | TumorStagingCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: TumorStagingCreateManyCancerDiagnosisInputEnvelope
    connect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
  }

  export type TumorBoardCaseCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput> | TumorBoardCaseCreateWithoutCancerDiagnosisInput[] | TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput | TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: TumorBoardCaseCreateManyCancerDiagnosisInputEnvelope
    connect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
  }

  export type OncologyCarePlanCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput> | OncologyCarePlanCreateWithoutCancerDiagnosisInput[] | OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput | OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: OncologyCarePlanCreateManyCancerDiagnosisInputEnvelope
    connect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
  }

  export type TumorStagingUncheckedCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput> | TumorStagingCreateWithoutCancerDiagnosisInput[] | TumorStagingUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorStagingCreateOrConnectWithoutCancerDiagnosisInput | TumorStagingCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: TumorStagingCreateManyCancerDiagnosisInputEnvelope
    connect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
  }

  export type TumorBoardCaseUncheckedCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput> | TumorBoardCaseCreateWithoutCancerDiagnosisInput[] | TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput | TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: TumorBoardCaseCreateManyCancerDiagnosisInputEnvelope
    connect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
  }

  export type OncologyCarePlanUncheckedCreateNestedManyWithoutCancerDiagnosisInput = {
    create?: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput> | OncologyCarePlanCreateWithoutCancerDiagnosisInput[] | OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput | OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput[]
    createMany?: OncologyCarePlanCreateManyCancerDiagnosisInputEnvelope
    connect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
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

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TumorStagingUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput> | TumorStagingCreateWithoutCancerDiagnosisInput[] | TumorStagingUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorStagingCreateOrConnectWithoutCancerDiagnosisInput | TumorStagingCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: TumorStagingUpsertWithWhereUniqueWithoutCancerDiagnosisInput | TumorStagingUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: TumorStagingCreateManyCancerDiagnosisInputEnvelope
    set?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    disconnect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    delete?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    connect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    update?: TumorStagingUpdateWithWhereUniqueWithoutCancerDiagnosisInput | TumorStagingUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: TumorStagingUpdateManyWithWhereWithoutCancerDiagnosisInput | TumorStagingUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: TumorStagingScalarWhereInput | TumorStagingScalarWhereInput[]
  }

  export type TumorBoardCaseUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput> | TumorBoardCaseCreateWithoutCancerDiagnosisInput[] | TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput | TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: TumorBoardCaseUpsertWithWhereUniqueWithoutCancerDiagnosisInput | TumorBoardCaseUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: TumorBoardCaseCreateManyCancerDiagnosisInputEnvelope
    set?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    disconnect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    delete?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    connect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    update?: TumorBoardCaseUpdateWithWhereUniqueWithoutCancerDiagnosisInput | TumorBoardCaseUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: TumorBoardCaseUpdateManyWithWhereWithoutCancerDiagnosisInput | TumorBoardCaseUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: TumorBoardCaseScalarWhereInput | TumorBoardCaseScalarWhereInput[]
  }

  export type OncologyCarePlanUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput> | OncologyCarePlanCreateWithoutCancerDiagnosisInput[] | OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput | OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: OncologyCarePlanUpsertWithWhereUniqueWithoutCancerDiagnosisInput | OncologyCarePlanUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: OncologyCarePlanCreateManyCancerDiagnosisInputEnvelope
    set?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    disconnect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    delete?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    connect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    update?: OncologyCarePlanUpdateWithWhereUniqueWithoutCancerDiagnosisInput | OncologyCarePlanUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: OncologyCarePlanUpdateManyWithWhereWithoutCancerDiagnosisInput | OncologyCarePlanUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: OncologyCarePlanScalarWhereInput | OncologyCarePlanScalarWhereInput[]
  }

  export type TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput> | TumorStagingCreateWithoutCancerDiagnosisInput[] | TumorStagingUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorStagingCreateOrConnectWithoutCancerDiagnosisInput | TumorStagingCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: TumorStagingUpsertWithWhereUniqueWithoutCancerDiagnosisInput | TumorStagingUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: TumorStagingCreateManyCancerDiagnosisInputEnvelope
    set?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    disconnect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    delete?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    connect?: TumorStagingWhereUniqueInput | TumorStagingWhereUniqueInput[]
    update?: TumorStagingUpdateWithWhereUniqueWithoutCancerDiagnosisInput | TumorStagingUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: TumorStagingUpdateManyWithWhereWithoutCancerDiagnosisInput | TumorStagingUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: TumorStagingScalarWhereInput | TumorStagingScalarWhereInput[]
  }

  export type TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput> | TumorBoardCaseCreateWithoutCancerDiagnosisInput[] | TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput | TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: TumorBoardCaseUpsertWithWhereUniqueWithoutCancerDiagnosisInput | TumorBoardCaseUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: TumorBoardCaseCreateManyCancerDiagnosisInputEnvelope
    set?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    disconnect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    delete?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    connect?: TumorBoardCaseWhereUniqueInput | TumorBoardCaseWhereUniqueInput[]
    update?: TumorBoardCaseUpdateWithWhereUniqueWithoutCancerDiagnosisInput | TumorBoardCaseUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: TumorBoardCaseUpdateManyWithWhereWithoutCancerDiagnosisInput | TumorBoardCaseUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: TumorBoardCaseScalarWhereInput | TumorBoardCaseScalarWhereInput[]
  }

  export type OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisNestedInput = {
    create?: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput> | OncologyCarePlanCreateWithoutCancerDiagnosisInput[] | OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput[]
    connectOrCreate?: OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput | OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput[]
    upsert?: OncologyCarePlanUpsertWithWhereUniqueWithoutCancerDiagnosisInput | OncologyCarePlanUpsertWithWhereUniqueWithoutCancerDiagnosisInput[]
    createMany?: OncologyCarePlanCreateManyCancerDiagnosisInputEnvelope
    set?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    disconnect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    delete?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    connect?: OncologyCarePlanWhereUniqueInput | OncologyCarePlanWhereUniqueInput[]
    update?: OncologyCarePlanUpdateWithWhereUniqueWithoutCancerDiagnosisInput | OncologyCarePlanUpdateWithWhereUniqueWithoutCancerDiagnosisInput[]
    updateMany?: OncologyCarePlanUpdateManyWithWhereWithoutCancerDiagnosisInput | OncologyCarePlanUpdateManyWithWhereWithoutCancerDiagnosisInput[]
    deleteMany?: OncologyCarePlanScalarWhereInput | OncologyCarePlanScalarWhereInput[]
  }

  export type CancerDiagnosisCreateNestedOneWithoutStagingsInput = {
    create?: XOR<CancerDiagnosisCreateWithoutStagingsInput, CancerDiagnosisUncheckedCreateWithoutStagingsInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutStagingsInput
    connect?: CancerDiagnosisWhereUniqueInput
  }

  export type CancerDiagnosisUpdateOneRequiredWithoutStagingsNestedInput = {
    create?: XOR<CancerDiagnosisCreateWithoutStagingsInput, CancerDiagnosisUncheckedCreateWithoutStagingsInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutStagingsInput
    upsert?: CancerDiagnosisUpsertWithoutStagingsInput
    connect?: CancerDiagnosisWhereUniqueInput
    update?: XOR<XOR<CancerDiagnosisUpdateToOneWithWhereWithoutStagingsInput, CancerDiagnosisUpdateWithoutStagingsInput>, CancerDiagnosisUncheckedUpdateWithoutStagingsInput>
  }

  export type ChemoOrderCreateNestedManyWithoutProtocolInput = {
    create?: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput> | ChemoOrderCreateWithoutProtocolInput[] | ChemoOrderUncheckedCreateWithoutProtocolInput[]
    connectOrCreate?: ChemoOrderCreateOrConnectWithoutProtocolInput | ChemoOrderCreateOrConnectWithoutProtocolInput[]
    createMany?: ChemoOrderCreateManyProtocolInputEnvelope
    connect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
  }

  export type ChemoOrderUncheckedCreateNestedManyWithoutProtocolInput = {
    create?: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput> | ChemoOrderCreateWithoutProtocolInput[] | ChemoOrderUncheckedCreateWithoutProtocolInput[]
    connectOrCreate?: ChemoOrderCreateOrConnectWithoutProtocolInput | ChemoOrderCreateOrConnectWithoutProtocolInput[]
    createMany?: ChemoOrderCreateManyProtocolInputEnvelope
    connect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ChemoOrderUpdateManyWithoutProtocolNestedInput = {
    create?: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput> | ChemoOrderCreateWithoutProtocolInput[] | ChemoOrderUncheckedCreateWithoutProtocolInput[]
    connectOrCreate?: ChemoOrderCreateOrConnectWithoutProtocolInput | ChemoOrderCreateOrConnectWithoutProtocolInput[]
    upsert?: ChemoOrderUpsertWithWhereUniqueWithoutProtocolInput | ChemoOrderUpsertWithWhereUniqueWithoutProtocolInput[]
    createMany?: ChemoOrderCreateManyProtocolInputEnvelope
    set?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    disconnect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    delete?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    connect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    update?: ChemoOrderUpdateWithWhereUniqueWithoutProtocolInput | ChemoOrderUpdateWithWhereUniqueWithoutProtocolInput[]
    updateMany?: ChemoOrderUpdateManyWithWhereWithoutProtocolInput | ChemoOrderUpdateManyWithWhereWithoutProtocolInput[]
    deleteMany?: ChemoOrderScalarWhereInput | ChemoOrderScalarWhereInput[]
  }

  export type ChemoOrderUncheckedUpdateManyWithoutProtocolNestedInput = {
    create?: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput> | ChemoOrderCreateWithoutProtocolInput[] | ChemoOrderUncheckedCreateWithoutProtocolInput[]
    connectOrCreate?: ChemoOrderCreateOrConnectWithoutProtocolInput | ChemoOrderCreateOrConnectWithoutProtocolInput[]
    upsert?: ChemoOrderUpsertWithWhereUniqueWithoutProtocolInput | ChemoOrderUpsertWithWhereUniqueWithoutProtocolInput[]
    createMany?: ChemoOrderCreateManyProtocolInputEnvelope
    set?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    disconnect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    delete?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    connect?: ChemoOrderWhereUniqueInput | ChemoOrderWhereUniqueInput[]
    update?: ChemoOrderUpdateWithWhereUniqueWithoutProtocolInput | ChemoOrderUpdateWithWhereUniqueWithoutProtocolInput[]
    updateMany?: ChemoOrderUpdateManyWithWhereWithoutProtocolInput | ChemoOrderUpdateManyWithWhereWithoutProtocolInput[]
    deleteMany?: ChemoOrderScalarWhereInput | ChemoOrderScalarWhereInput[]
  }

  export type ChemoProtocolCreateNestedOneWithoutOrdersInput = {
    create?: XOR<ChemoProtocolCreateWithoutOrdersInput, ChemoProtocolUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: ChemoProtocolCreateOrConnectWithoutOrdersInput
    connect?: ChemoProtocolWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ChemoProtocolUpdateOneRequiredWithoutOrdersNestedInput = {
    create?: XOR<ChemoProtocolCreateWithoutOrdersInput, ChemoProtocolUncheckedCreateWithoutOrdersInput>
    connectOrCreate?: ChemoProtocolCreateOrConnectWithoutOrdersInput
    upsert?: ChemoProtocolUpsertWithoutOrdersInput
    connect?: ChemoProtocolWhereUniqueInput
    update?: XOR<XOR<ChemoProtocolUpdateToOneWithWhereWithoutOrdersInput, ChemoProtocolUpdateWithoutOrdersInput>, ChemoProtocolUncheckedUpdateWithoutOrdersInput>
  }

  export type CancerDiagnosisCreateNestedOneWithoutTumorBoardCasesInput = {
    create?: XOR<CancerDiagnosisCreateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedCreateWithoutTumorBoardCasesInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutTumorBoardCasesInput
    connect?: CancerDiagnosisWhereUniqueInput
  }

  export type CancerDiagnosisUpdateOneRequiredWithoutTumorBoardCasesNestedInput = {
    create?: XOR<CancerDiagnosisCreateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedCreateWithoutTumorBoardCasesInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutTumorBoardCasesInput
    upsert?: CancerDiagnosisUpsertWithoutTumorBoardCasesInput
    connect?: CancerDiagnosisWhereUniqueInput
    update?: XOR<XOR<CancerDiagnosisUpdateToOneWithWhereWithoutTumorBoardCasesInput, CancerDiagnosisUpdateWithoutTumorBoardCasesInput>, CancerDiagnosisUncheckedUpdateWithoutTumorBoardCasesInput>
  }

  export type OncologyCancerTypeSiteMappingCreateNestedManyWithoutCancerTypeInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput> | OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyCancerTypeInputEnvelope
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
  }

  export type OncologyCancerTypeSiteMappingUncheckedCreateNestedManyWithoutCancerTypeInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput> | OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyCancerTypeInputEnvelope
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
  }

  export type OncologyCancerTypeSiteMappingUpdateManyWithoutCancerTypeNestedInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput> | OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput[]
    upsert?: OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutCancerTypeInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyCancerTypeInputEnvelope
    set?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    disconnect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    delete?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    update?: OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutCancerTypeInput[]
    updateMany?: OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutCancerTypeInput[]
    deleteMany?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutCancerTypeNestedInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput> | OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput[]
    upsert?: OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutCancerTypeInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyCancerTypeInputEnvelope
    set?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    disconnect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    delete?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    update?: OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutCancerTypeInput[]
    updateMany?: OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutCancerTypeInput | OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutCancerTypeInput[]
    deleteMany?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
  }

  export type OncologyCancerTypeSiteMappingCreateNestedManyWithoutPrimarySiteInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput> | OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyPrimarySiteInputEnvelope
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
  }

  export type OncologyCancerTypeSiteMappingUncheckedCreateNestedManyWithoutPrimarySiteInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput> | OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyPrimarySiteInputEnvelope
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
  }

  export type OncologyCancerTypeSiteMappingUpdateManyWithoutPrimarySiteNestedInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput> | OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput[]
    upsert?: OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutPrimarySiteInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyPrimarySiteInputEnvelope
    set?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    disconnect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    delete?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    update?: OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutPrimarySiteInput[]
    updateMany?: OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutPrimarySiteInput[]
    deleteMany?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutPrimarySiteNestedInput = {
    create?: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput> | OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput[] | OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput[]
    connectOrCreate?: OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput[]
    upsert?: OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutPrimarySiteInput[]
    createMany?: OncologyCancerTypeSiteMappingCreateManyPrimarySiteInputEnvelope
    set?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    disconnect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    delete?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    connect?: OncologyCancerTypeSiteMappingWhereUniqueInput | OncologyCancerTypeSiteMappingWhereUniqueInput[]
    update?: OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutPrimarySiteInput[]
    updateMany?: OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutPrimarySiteInput | OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutPrimarySiteInput[]
    deleteMany?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
  }

  export type OncologyCancerTypeMasterCreateNestedOneWithoutSiteMappingsInput = {
    create?: XOR<OncologyCancerTypeMasterCreateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedCreateWithoutSiteMappingsInput>
    connectOrCreate?: OncologyCancerTypeMasterCreateOrConnectWithoutSiteMappingsInput
    connect?: OncologyCancerTypeMasterWhereUniqueInput
  }

  export type OncologyPrimarySiteMasterCreateNestedOneWithoutSiteMappingsInput = {
    create?: XOR<OncologyPrimarySiteMasterCreateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedCreateWithoutSiteMappingsInput>
    connectOrCreate?: OncologyPrimarySiteMasterCreateOrConnectWithoutSiteMappingsInput
    connect?: OncologyPrimarySiteMasterWhereUniqueInput
  }

  export type OncologyCancerTypeMasterUpdateOneRequiredWithoutSiteMappingsNestedInput = {
    create?: XOR<OncologyCancerTypeMasterCreateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedCreateWithoutSiteMappingsInput>
    connectOrCreate?: OncologyCancerTypeMasterCreateOrConnectWithoutSiteMappingsInput
    upsert?: OncologyCancerTypeMasterUpsertWithoutSiteMappingsInput
    connect?: OncologyCancerTypeMasterWhereUniqueInput
    update?: XOR<XOR<OncologyCancerTypeMasterUpdateToOneWithWhereWithoutSiteMappingsInput, OncologyCancerTypeMasterUpdateWithoutSiteMappingsInput>, OncologyCancerTypeMasterUncheckedUpdateWithoutSiteMappingsInput>
  }

  export type OncologyPrimarySiteMasterUpdateOneRequiredWithoutSiteMappingsNestedInput = {
    create?: XOR<OncologyPrimarySiteMasterCreateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedCreateWithoutSiteMappingsInput>
    connectOrCreate?: OncologyPrimarySiteMasterCreateOrConnectWithoutSiteMappingsInput
    upsert?: OncologyPrimarySiteMasterUpsertWithoutSiteMappingsInput
    connect?: OncologyPrimarySiteMasterWhereUniqueInput
    update?: XOR<XOR<OncologyPrimarySiteMasterUpdateToOneWithWhereWithoutSiteMappingsInput, OncologyPrimarySiteMasterUpdateWithoutSiteMappingsInput>, OncologyPrimarySiteMasterUncheckedUpdateWithoutSiteMappingsInput>
  }

  export type CancerDiagnosisCreateNestedOneWithoutCarePlansInput = {
    create?: XOR<CancerDiagnosisCreateWithoutCarePlansInput, CancerDiagnosisUncheckedCreateWithoutCarePlansInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutCarePlansInput
    connect?: CancerDiagnosisWhereUniqueInput
  }

  export type CancerDiagnosisUpdateOneRequiredWithoutCarePlansNestedInput = {
    create?: XOR<CancerDiagnosisCreateWithoutCarePlansInput, CancerDiagnosisUncheckedCreateWithoutCarePlansInput>
    connectOrCreate?: CancerDiagnosisCreateOrConnectWithoutCarePlansInput
    upsert?: CancerDiagnosisUpsertWithoutCarePlansInput
    connect?: CancerDiagnosisWhereUniqueInput
    update?: XOR<XOR<CancerDiagnosisUpdateToOneWithWhereWithoutCarePlansInput, CancerDiagnosisUpdateWithoutCarePlansInput>, CancerDiagnosisUncheckedUpdateWithoutCarePlansInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type TumorStagingCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorStagingUncheckedCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorStagingCreateOrConnectWithoutCancerDiagnosisInput = {
    where: TumorStagingWhereUniqueInput
    create: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type TumorStagingCreateManyCancerDiagnosisInputEnvelope = {
    data: TumorStagingCreateManyCancerDiagnosisInput | TumorStagingCreateManyCancerDiagnosisInput[]
    skipDuplicates?: boolean
  }

  export type TumorBoardCaseCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorBoardCaseCreateOrConnectWithoutCancerDiagnosisInput = {
    where: TumorBoardCaseWhereUniqueInput
    create: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type TumorBoardCaseCreateManyCancerDiagnosisInputEnvelope = {
    data: TumorBoardCaseCreateManyCancerDiagnosisInput | TumorBoardCaseCreateManyCancerDiagnosisInput[]
    skipDuplicates?: boolean
  }

  export type OncologyCarePlanCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCarePlanCreateOrConnectWithoutCancerDiagnosisInput = {
    where: OncologyCarePlanWhereUniqueInput
    create: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type OncologyCarePlanCreateManyCancerDiagnosisInputEnvelope = {
    data: OncologyCarePlanCreateManyCancerDiagnosisInput | OncologyCarePlanCreateManyCancerDiagnosisInput[]
    skipDuplicates?: boolean
  }

  export type TumorStagingUpsertWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: TumorStagingWhereUniqueInput
    update: XOR<TumorStagingUpdateWithoutCancerDiagnosisInput, TumorStagingUncheckedUpdateWithoutCancerDiagnosisInput>
    create: XOR<TumorStagingCreateWithoutCancerDiagnosisInput, TumorStagingUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type TumorStagingUpdateWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: TumorStagingWhereUniqueInput
    data: XOR<TumorStagingUpdateWithoutCancerDiagnosisInput, TumorStagingUncheckedUpdateWithoutCancerDiagnosisInput>
  }

  export type TumorStagingUpdateManyWithWhereWithoutCancerDiagnosisInput = {
    where: TumorStagingScalarWhereInput
    data: XOR<TumorStagingUpdateManyMutationInput, TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisInput>
  }

  export type TumorStagingScalarWhereInput = {
    AND?: TumorStagingScalarWhereInput | TumorStagingScalarWhereInput[]
    OR?: TumorStagingScalarWhereInput[]
    NOT?: TumorStagingScalarWhereInput | TumorStagingScalarWhereInput[]
    id?: UuidFilter<"TumorStaging"> | string
    tenantId?: UuidFilter<"TumorStaging"> | string
    cancerDiagnosisId?: UuidFilter<"TumorStaging"> | string
    patientId?: UuidFilter<"TumorStaging"> | string
    encounterId?: UuidNullableFilter<"TumorStaging"> | string | null
    providerId?: UuidNullableFilter<"TumorStaging"> | string | null
    stagingSystem?: StringFilter<"TumorStaging"> | string
    stagingEdition?: StringNullableFilter<"TumorStaging"> | string | null
    stagingType?: StringFilter<"TumorStaging"> | string
    stageGroup?: StringNullableFilter<"TumorStaging"> | string | null
    tCategory?: StringNullableFilter<"TumorStaging"> | string | null
    nCategory?: StringNullableFilter<"TumorStaging"> | string | null
    mCategory?: StringNullableFilter<"TumorStaging"> | string | null
    bodySite?: StringNullableFilter<"TumorStaging"> | string | null
    grade?: StringNullableFilter<"TumorStaging"> | string | null
    histology?: StringNullableFilter<"TumorStaging"> | string | null
    stagingDate?: DateTimeFilter<"TumorStaging"> | Date | string
    status?: StringFilter<"TumorStaging"> | string
    notes?: StringNullableFilter<"TumorStaging"> | string | null
    createdAt?: DateTimeFilter<"TumorStaging"> | Date | string
    updatedAt?: DateTimeFilter<"TumorStaging"> | Date | string
  }

  export type TumorBoardCaseUpsertWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: TumorBoardCaseWhereUniqueInput
    update: XOR<TumorBoardCaseUpdateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedUpdateWithoutCancerDiagnosisInput>
    create: XOR<TumorBoardCaseCreateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type TumorBoardCaseUpdateWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: TumorBoardCaseWhereUniqueInput
    data: XOR<TumorBoardCaseUpdateWithoutCancerDiagnosisInput, TumorBoardCaseUncheckedUpdateWithoutCancerDiagnosisInput>
  }

  export type TumorBoardCaseUpdateManyWithWhereWithoutCancerDiagnosisInput = {
    where: TumorBoardCaseScalarWhereInput
    data: XOR<TumorBoardCaseUpdateManyMutationInput, TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisInput>
  }

  export type TumorBoardCaseScalarWhereInput = {
    AND?: TumorBoardCaseScalarWhereInput | TumorBoardCaseScalarWhereInput[]
    OR?: TumorBoardCaseScalarWhereInput[]
    NOT?: TumorBoardCaseScalarWhereInput | TumorBoardCaseScalarWhereInput[]
    id?: UuidFilter<"TumorBoardCase"> | string
    tenantId?: UuidFilter<"TumorBoardCase"> | string
    patientId?: UuidFilter<"TumorBoardCase"> | string
    cancerDiagnosisId?: UuidFilter<"TumorBoardCase"> | string
    stagingId?: UuidNullableFilter<"TumorBoardCase"> | string | null
    meetingDate?: DateTimeFilter<"TumorBoardCase"> | Date | string
    presentedBy?: UuidFilter<"TumorBoardCase"> | string
    attendees?: JsonFilter<"TumorBoardCase">
    clinicalSummary?: StringNullableFilter<"TumorBoardCase"> | string | null
    imagingFindings?: StringNullableFilter<"TumorBoardCase"> | string | null
    pathologyReport?: StringNullableFilter<"TumorBoardCase"> | string | null
    molecularProfile?: StringNullableFilter<"TumorBoardCase"> | string | null
    mdtRecommendation?: StringNullableFilter<"TumorBoardCase"> | string | null
    treatmentIntent?: StringNullableFilter<"TumorBoardCase"> | string | null
    recommendedPathway?: JsonFilter<"TumorBoardCase">
    treatmentPlan?: JsonFilter<"TumorBoardCase">
    decision?: StringNullableFilter<"TumorBoardCase"> | string | null
    reviewOutcome?: StringNullableFilter<"TumorBoardCase"> | string | null
    followUpActions?: JsonFilter<"TumorBoardCase">
    status?: StringFilter<"TumorBoardCase"> | string
    createdAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
    updatedAt?: DateTimeFilter<"TumorBoardCase"> | Date | string
  }

  export type OncologyCarePlanUpsertWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: OncologyCarePlanWhereUniqueInput
    update: XOR<OncologyCarePlanUpdateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedUpdateWithoutCancerDiagnosisInput>
    create: XOR<OncologyCarePlanCreateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedCreateWithoutCancerDiagnosisInput>
  }

  export type OncologyCarePlanUpdateWithWhereUniqueWithoutCancerDiagnosisInput = {
    where: OncologyCarePlanWhereUniqueInput
    data: XOR<OncologyCarePlanUpdateWithoutCancerDiagnosisInput, OncologyCarePlanUncheckedUpdateWithoutCancerDiagnosisInput>
  }

  export type OncologyCarePlanUpdateManyWithWhereWithoutCancerDiagnosisInput = {
    where: OncologyCarePlanScalarWhereInput
    data: XOR<OncologyCarePlanUpdateManyMutationInput, OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisInput>
  }

  export type OncologyCarePlanScalarWhereInput = {
    AND?: OncologyCarePlanScalarWhereInput | OncologyCarePlanScalarWhereInput[]
    OR?: OncologyCarePlanScalarWhereInput[]
    NOT?: OncologyCarePlanScalarWhereInput | OncologyCarePlanScalarWhereInput[]
    id?: UuidFilter<"OncologyCarePlan"> | string
    tenantId?: UuidFilter<"OncologyCarePlan"> | string
    patientId?: UuidFilter<"OncologyCarePlan"> | string
    cancerDiagnosisId?: UuidFilter<"OncologyCarePlan"> | string
    tumorBoardCaseId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    planNumber?: StringFilter<"OncologyCarePlan"> | string
    version?: IntFilter<"OncologyCarePlan"> | number
    parentPlanId?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    treatmentIntent?: StringFilter<"OncologyCarePlan"> | string
    oncologySubspecialty?: StringNullableFilter<"OncologyCarePlan"> | string | null
    plannedModalities?: JsonFilter<"OncologyCarePlan">
    plannedCycles?: IntNullableFilter<"OncologyCarePlan"> | number | null
    cycleDurationDays?: IntNullableFilter<"OncologyCarePlan"> | number | null
    milestones?: JsonFilter<"OncologyCarePlan">
    followUpSchedule?: JsonFilter<"OncologyCarePlan">
    status?: StringFilter<"OncologyCarePlan"> | string
    startDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    endDate?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    createdBy?: UuidFilter<"OncologyCarePlan"> | string
    approvedBy?: UuidNullableFilter<"OncologyCarePlan"> | string | null
    approvedAt?: DateTimeNullableFilter<"OncologyCarePlan"> | Date | string | null
    notes?: StringNullableFilter<"OncologyCarePlan"> | string | null
    createdAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCarePlan"> | Date | string
  }

  export type CancerDiagnosisCreateWithoutStagingsInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tumorBoardCases?: TumorBoardCaseCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisUncheckedCreateWithoutStagingsInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tumorBoardCases?: TumorBoardCaseUncheckedCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanUncheckedCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisCreateOrConnectWithoutStagingsInput = {
    where: CancerDiagnosisWhereUniqueInput
    create: XOR<CancerDiagnosisCreateWithoutStagingsInput, CancerDiagnosisUncheckedCreateWithoutStagingsInput>
  }

  export type CancerDiagnosisUpsertWithoutStagingsInput = {
    update: XOR<CancerDiagnosisUpdateWithoutStagingsInput, CancerDiagnosisUncheckedUpdateWithoutStagingsInput>
    create: XOR<CancerDiagnosisCreateWithoutStagingsInput, CancerDiagnosisUncheckedCreateWithoutStagingsInput>
    where?: CancerDiagnosisWhereInput
  }

  export type CancerDiagnosisUpdateToOneWithWhereWithoutStagingsInput = {
    where?: CancerDiagnosisWhereInput
    data: XOR<CancerDiagnosisUpdateWithoutStagingsInput, CancerDiagnosisUncheckedUpdateWithoutStagingsInput>
  }

  export type CancerDiagnosisUpdateWithoutStagingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tumorBoardCases?: TumorBoardCaseUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type CancerDiagnosisUncheckedUpdateWithoutStagingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tumorBoardCases?: TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type ChemoOrderCreateWithoutProtocolInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChemoOrderUncheckedCreateWithoutProtocolInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChemoOrderCreateOrConnectWithoutProtocolInput = {
    where: ChemoOrderWhereUniqueInput
    create: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput>
  }

  export type ChemoOrderCreateManyProtocolInputEnvelope = {
    data: ChemoOrderCreateManyProtocolInput | ChemoOrderCreateManyProtocolInput[]
    skipDuplicates?: boolean
  }

  export type ChemoOrderUpsertWithWhereUniqueWithoutProtocolInput = {
    where: ChemoOrderWhereUniqueInput
    update: XOR<ChemoOrderUpdateWithoutProtocolInput, ChemoOrderUncheckedUpdateWithoutProtocolInput>
    create: XOR<ChemoOrderCreateWithoutProtocolInput, ChemoOrderUncheckedCreateWithoutProtocolInput>
  }

  export type ChemoOrderUpdateWithWhereUniqueWithoutProtocolInput = {
    where: ChemoOrderWhereUniqueInput
    data: XOR<ChemoOrderUpdateWithoutProtocolInput, ChemoOrderUncheckedUpdateWithoutProtocolInput>
  }

  export type ChemoOrderUpdateManyWithWhereWithoutProtocolInput = {
    where: ChemoOrderScalarWhereInput
    data: XOR<ChemoOrderUpdateManyMutationInput, ChemoOrderUncheckedUpdateManyWithoutProtocolInput>
  }

  export type ChemoOrderScalarWhereInput = {
    AND?: ChemoOrderScalarWhereInput | ChemoOrderScalarWhereInput[]
    OR?: ChemoOrderScalarWhereInput[]
    NOT?: ChemoOrderScalarWhereInput | ChemoOrderScalarWhereInput[]
    id?: UuidFilter<"ChemoOrder"> | string
    tenantId?: UuidFilter<"ChemoOrder"> | string
    patientId?: UuidFilter<"ChemoOrder"> | string
    encounterId?: UuidNullableFilter<"ChemoOrder"> | string | null
    protocolId?: UuidFilter<"ChemoOrder"> | string
    orderingProvider?: UuidFilter<"ChemoOrder"> | string
    cycleNumber?: IntFilter<"ChemoOrder"> | number
    dayNumber?: IntFilter<"ChemoOrder"> | number
    scheduledDate?: DateTimeFilter<"ChemoOrder"> | Date | string
    administeredAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    bsa?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    weight?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    height?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: DecimalNullableFilter<"ChemoOrder"> | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: UuidNullableFilter<"ChemoOrder"> | string | null
    oncologyCarePlanId?: UuidNullableFilter<"ChemoOrder"> | string | null
    hepaticAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    renalAdjustmentGrade?: StringNullableFilter<"ChemoOrder"> | string | null
    doseAdjustments?: JsonFilter<"ChemoOrder">
    preChemoChecklist?: JsonFilter<"ChemoOrder">
    status?: StringFilter<"ChemoOrder"> | string
    verifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    verifiedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    secondVerifiedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    approvedAt?: DateTimeNullableFilter<"ChemoOrder"> | Date | string | null
    administeredBy?: UuidNullableFilter<"ChemoOrder"> | string | null
    adverseReactions?: JsonFilter<"ChemoOrder">
    administrationDetails?: JsonFilter<"ChemoOrder">
    drugPreparationDetails?: JsonFilter<"ChemoOrder">
    nurseVerificationChecklist?: JsonFilter<"ChemoOrder">
    notes?: StringNullableFilter<"ChemoOrder"> | string | null
    createdAt?: DateTimeFilter<"ChemoOrder"> | Date | string
    updatedAt?: DateTimeFilter<"ChemoOrder"> | Date | string
  }

  export type ChemoProtocolCreateWithoutOrdersInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    cancerType: string
    intent: string
    regimen: JsonNullValueInput | InputJsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: string | null
    doseFormula?: string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
  }

  export type ChemoProtocolUncheckedCreateWithoutOrdersInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    cancerType: string
    intent: string
    regimen: JsonNullValueInput | InputJsonValue
    totalCycles: number
    cycleDurationDays: number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: string | null
    doseFormula?: string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: string | null
  }

  export type ChemoProtocolCreateOrConnectWithoutOrdersInput = {
    where: ChemoProtocolWhereUniqueInput
    create: XOR<ChemoProtocolCreateWithoutOrdersInput, ChemoProtocolUncheckedCreateWithoutOrdersInput>
  }

  export type ChemoProtocolUpsertWithoutOrdersInput = {
    update: XOR<ChemoProtocolUpdateWithoutOrdersInput, ChemoProtocolUncheckedUpdateWithoutOrdersInput>
    create: XOR<ChemoProtocolCreateWithoutOrdersInput, ChemoProtocolUncheckedCreateWithoutOrdersInput>
    where?: ChemoProtocolWhereInput
  }

  export type ChemoProtocolUpdateToOneWithWhereWithoutOrdersInput = {
    where?: ChemoProtocolWhereInput
    data: XOR<ChemoProtocolUpdateWithoutOrdersInput, ChemoProtocolUncheckedUpdateWithoutOrdersInput>
  }

  export type ChemoProtocolUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChemoProtocolUncheckedUpdateWithoutOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    intent?: StringFieldUpdateOperationsInput | string
    regimen?: JsonNullValueInput | InputJsonValue
    totalCycles?: IntFieldUpdateOperationsInput | number
    cycleDurationDays?: IntFieldUpdateOperationsInput | number
    premedications?: JsonNullValueInput | InputJsonValue
    supportiveCare?: JsonNullValueInput | InputJsonValue
    emetogenicRisk?: NullableStringFieldUpdateOperationsInput | string | null
    doseFormula?: StringFieldUpdateOperationsInput | string
    labPrerequisites?: JsonNullValueInput | InputJsonValue
    hydration?: JsonNullValueInput | InputJsonValue
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CancerDiagnosisCreateWithoutTumorBoardCasesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisUncheckedCreateWithoutTumorBoardCasesInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingUncheckedCreateNestedManyWithoutCancerDiagnosisInput
    carePlans?: OncologyCarePlanUncheckedCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisCreateOrConnectWithoutTumorBoardCasesInput = {
    where: CancerDiagnosisWhereUniqueInput
    create: XOR<CancerDiagnosisCreateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedCreateWithoutTumorBoardCasesInput>
  }

  export type CancerDiagnosisUpsertWithoutTumorBoardCasesInput = {
    update: XOR<CancerDiagnosisUpdateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedUpdateWithoutTumorBoardCasesInput>
    create: XOR<CancerDiagnosisCreateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedCreateWithoutTumorBoardCasesInput>
    where?: CancerDiagnosisWhereInput
  }

  export type CancerDiagnosisUpdateToOneWithWhereWithoutTumorBoardCasesInput = {
    where?: CancerDiagnosisWhereInput
    data: XOR<CancerDiagnosisUpdateWithoutTumorBoardCasesInput, CancerDiagnosisUncheckedUpdateWithoutTumorBoardCasesInput>
  }

  export type CancerDiagnosisUpdateWithoutTumorBoardCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type CancerDiagnosisUncheckedUpdateWithoutTumorBoardCasesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
    carePlans?: OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput = {
    id?: string
    tenantId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    primarySite: OncologyPrimarySiteMasterCreateNestedOneWithoutSiteMappingsInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput = {
    id?: string
    tenantId: string
    primarySiteId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateOrConnectWithoutCancerTypeInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    create: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput>
  }

  export type OncologyCancerTypeSiteMappingCreateManyCancerTypeInputEnvelope = {
    data: OncologyCancerTypeSiteMappingCreateManyCancerTypeInput | OncologyCancerTypeSiteMappingCreateManyCancerTypeInput[]
    skipDuplicates?: boolean
  }

  export type OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutCancerTypeInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    update: XOR<OncologyCancerTypeSiteMappingUpdateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedUpdateWithoutCancerTypeInput>
    create: XOR<OncologyCancerTypeSiteMappingCreateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutCancerTypeInput>
  }

  export type OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutCancerTypeInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    data: XOR<OncologyCancerTypeSiteMappingUpdateWithoutCancerTypeInput, OncologyCancerTypeSiteMappingUncheckedUpdateWithoutCancerTypeInput>
  }

  export type OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutCancerTypeInput = {
    where: OncologyCancerTypeSiteMappingScalarWhereInput
    data: XOR<OncologyCancerTypeSiteMappingUpdateManyMutationInput, OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutCancerTypeInput>
  }

  export type OncologyCancerTypeSiteMappingScalarWhereInput = {
    AND?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
    OR?: OncologyCancerTypeSiteMappingScalarWhereInput[]
    NOT?: OncologyCancerTypeSiteMappingScalarWhereInput | OncologyCancerTypeSiteMappingScalarWhereInput[]
    id?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    tenantId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    cancerTypeId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    primarySiteId?: UuidFilter<"OncologyCancerTypeSiteMapping"> | string
    isDefault?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    active?: BoolFilter<"OncologyCancerTypeSiteMapping"> | boolean
    createdAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
    updatedAt?: DateTimeFilter<"OncologyCancerTypeSiteMapping"> | Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput = {
    id?: string
    tenantId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    cancerType: OncologyCancerTypeMasterCreateNestedOneWithoutSiteMappingsInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput = {
    id?: string
    tenantId: string
    cancerTypeId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateOrConnectWithoutPrimarySiteInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    create: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput>
  }

  export type OncologyCancerTypeSiteMappingCreateManyPrimarySiteInputEnvelope = {
    data: OncologyCancerTypeSiteMappingCreateManyPrimarySiteInput | OncologyCancerTypeSiteMappingCreateManyPrimarySiteInput[]
    skipDuplicates?: boolean
  }

  export type OncologyCancerTypeSiteMappingUpsertWithWhereUniqueWithoutPrimarySiteInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    update: XOR<OncologyCancerTypeSiteMappingUpdateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedUpdateWithoutPrimarySiteInput>
    create: XOR<OncologyCancerTypeSiteMappingCreateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedCreateWithoutPrimarySiteInput>
  }

  export type OncologyCancerTypeSiteMappingUpdateWithWhereUniqueWithoutPrimarySiteInput = {
    where: OncologyCancerTypeSiteMappingWhereUniqueInput
    data: XOR<OncologyCancerTypeSiteMappingUpdateWithoutPrimarySiteInput, OncologyCancerTypeSiteMappingUncheckedUpdateWithoutPrimarySiteInput>
  }

  export type OncologyCancerTypeSiteMappingUpdateManyWithWhereWithoutPrimarySiteInput = {
    where: OncologyCancerTypeSiteMappingScalarWhereInput
    data: XOR<OncologyCancerTypeSiteMappingUpdateManyMutationInput, OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutPrimarySiteInput>
  }

  export type OncologyCancerTypeMasterCreateWithoutSiteMappingsInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    category?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeMasterUncheckedCreateWithoutSiteMappingsInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    category?: string | null
    description?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeMasterCreateOrConnectWithoutSiteMappingsInput = {
    where: OncologyCancerTypeMasterWhereUniqueInput
    create: XOR<OncologyCancerTypeMasterCreateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedCreateWithoutSiteMappingsInput>
  }

  export type OncologyPrimarySiteMasterCreateWithoutSiteMappingsInput = {
    id?: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem?: string | null
    lateralityApplicable?: boolean
    mappingType?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyPrimarySiteMasterUncheckedCreateWithoutSiteMappingsInput = {
    id?: string
    tenantId: string
    icdoSiteCode: string
    icdoSiteName: string
    bodySystem?: string | null
    lateralityApplicable?: boolean
    mappingType?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyPrimarySiteMasterCreateOrConnectWithoutSiteMappingsInput = {
    where: OncologyPrimarySiteMasterWhereUniqueInput
    create: XOR<OncologyPrimarySiteMasterCreateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedCreateWithoutSiteMappingsInput>
  }

  export type OncologyCancerTypeMasterUpsertWithoutSiteMappingsInput = {
    update: XOR<OncologyCancerTypeMasterUpdateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedUpdateWithoutSiteMappingsInput>
    create: XOR<OncologyCancerTypeMasterCreateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedCreateWithoutSiteMappingsInput>
    where?: OncologyCancerTypeMasterWhereInput
  }

  export type OncologyCancerTypeMasterUpdateToOneWithWhereWithoutSiteMappingsInput = {
    where?: OncologyCancerTypeMasterWhereInput
    data: XOR<OncologyCancerTypeMasterUpdateWithoutSiteMappingsInput, OncologyCancerTypeMasterUncheckedUpdateWithoutSiteMappingsInput>
  }

  export type OncologyCancerTypeMasterUpdateWithoutSiteMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeMasterUncheckedUpdateWithoutSiteMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyPrimarySiteMasterUpsertWithoutSiteMappingsInput = {
    update: XOR<OncologyPrimarySiteMasterUpdateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedUpdateWithoutSiteMappingsInput>
    create: XOR<OncologyPrimarySiteMasterCreateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedCreateWithoutSiteMappingsInput>
    where?: OncologyPrimarySiteMasterWhereInput
  }

  export type OncologyPrimarySiteMasterUpdateToOneWithWhereWithoutSiteMappingsInput = {
    where?: OncologyPrimarySiteMasterWhereInput
    data: XOR<OncologyPrimarySiteMasterUpdateWithoutSiteMappingsInput, OncologyPrimarySiteMasterUncheckedUpdateWithoutSiteMappingsInput>
  }

  export type OncologyPrimarySiteMasterUpdateWithoutSiteMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyPrimarySiteMasterUncheckedUpdateWithoutSiteMappingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    icdoSiteCode?: StringFieldUpdateOperationsInput | string
    icdoSiteName?: StringFieldUpdateOperationsInput | string
    bodySystem?: NullableStringFieldUpdateOperationsInput | string | null
    lateralityApplicable?: BoolFieldUpdateOperationsInput | boolean
    mappingType?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CancerDiagnosisCreateWithoutCarePlansInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingCreateNestedManyWithoutCancerDiagnosisInput
    tumorBoardCases?: TumorBoardCaseCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisUncheckedCreateWithoutCarePlansInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    encounterDiagnosisId?: string | null
    cancerType: string
    primarySite: string
    primarySiteCode?: string | null
    laterality?: string | null
    histologyMorphology?: string | null
    morphologyCode?: string | null
    icdCode?: string | null
    snomedCode?: string | null
    diagnosisDate: Date | string
    clinicalStatus?: string
    verificationStatus?: string
    grade?: string | null
    metastaticStatus?: string
    isRecurrence?: boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: number | null
    diagnosedBy: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    stagings?: TumorStagingUncheckedCreateNestedManyWithoutCancerDiagnosisInput
    tumorBoardCases?: TumorBoardCaseUncheckedCreateNestedManyWithoutCancerDiagnosisInput
  }

  export type CancerDiagnosisCreateOrConnectWithoutCarePlansInput = {
    where: CancerDiagnosisWhereUniqueInput
    create: XOR<CancerDiagnosisCreateWithoutCarePlansInput, CancerDiagnosisUncheckedCreateWithoutCarePlansInput>
  }

  export type CancerDiagnosisUpsertWithoutCarePlansInput = {
    update: XOR<CancerDiagnosisUpdateWithoutCarePlansInput, CancerDiagnosisUncheckedUpdateWithoutCarePlansInput>
    create: XOR<CancerDiagnosisCreateWithoutCarePlansInput, CancerDiagnosisUncheckedCreateWithoutCarePlansInput>
    where?: CancerDiagnosisWhereInput
  }

  export type CancerDiagnosisUpdateToOneWithWhereWithoutCarePlansInput = {
    where?: CancerDiagnosisWhereInput
    data: XOR<CancerDiagnosisUpdateWithoutCarePlansInput, CancerDiagnosisUncheckedUpdateWithoutCarePlansInput>
  }

  export type CancerDiagnosisUpdateWithoutCarePlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUpdateManyWithoutCancerDiagnosisNestedInput
    tumorBoardCases?: TumorBoardCaseUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type CancerDiagnosisUncheckedUpdateWithoutCarePlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    encounterDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    cancerType?: StringFieldUpdateOperationsInput | string
    primarySite?: StringFieldUpdateOperationsInput | string
    primarySiteCode?: NullableStringFieldUpdateOperationsInput | string | null
    laterality?: NullableStringFieldUpdateOperationsInput | string | null
    histologyMorphology?: NullableStringFieldUpdateOperationsInput | string | null
    morphologyCode?: NullableStringFieldUpdateOperationsInput | string | null
    icdCode?: NullableStringFieldUpdateOperationsInput | string | null
    snomedCode?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosisDate?: DateTimeFieldUpdateOperationsInput | Date | string
    clinicalStatus?: StringFieldUpdateOperationsInput | string
    verificationStatus?: StringFieldUpdateOperationsInput | string
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    metastaticStatus?: StringFieldUpdateOperationsInput | string
    isRecurrence?: BoolFieldUpdateOperationsInput | boolean
    biomarkers?: JsonNullValueInput | InputJsonValue
    ecogAtDiagnosis?: NullableIntFieldUpdateOperationsInput | number | null
    diagnosedBy?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stagings?: TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
    tumorBoardCases?: TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisNestedInput
  }

  export type TumorStagingCreateManyCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    providerId?: string | null
    stagingSystem: string
    stagingEdition?: string | null
    stagingType?: string
    stageGroup?: string | null
    tCategory?: string | null
    nCategory?: string | null
    mCategory?: string | null
    bodySite?: string | null
    grade?: string | null
    histology?: string | null
    stagingDate: Date | string
    status?: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorBoardCaseCreateManyCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    stagingId?: string | null
    meetingDate: Date | string
    presentedBy: string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: string | null
    imagingFindings?: string | null
    pathologyReport?: string | null
    molecularProfile?: string | null
    mdtRecommendation?: string | null
    treatmentIntent?: string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: string | null
    reviewOutcome?: string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCarePlanCreateManyCancerDiagnosisInput = {
    id?: string
    tenantId: string
    patientId: string
    tumorBoardCaseId?: string | null
    planNumber: string
    version?: number
    parentPlanId?: string | null
    treatmentIntent: string
    oncologySubspecialty?: string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: number | null
    cycleDurationDays?: number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdBy: string
    approvedBy?: string | null
    approvedAt?: Date | string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TumorStagingUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorStagingUncheckedUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorStagingUncheckedUpdateManyWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    providerId?: NullableStringFieldUpdateOperationsInput | string | null
    stagingSystem?: StringFieldUpdateOperationsInput | string
    stagingEdition?: NullableStringFieldUpdateOperationsInput | string | null
    stagingType?: StringFieldUpdateOperationsInput | string
    stageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    tCategory?: NullableStringFieldUpdateOperationsInput | string | null
    nCategory?: NullableStringFieldUpdateOperationsInput | string | null
    mCategory?: NullableStringFieldUpdateOperationsInput | string | null
    bodySite?: NullableStringFieldUpdateOperationsInput | string | null
    grade?: NullableStringFieldUpdateOperationsInput | string | null
    histology?: NullableStringFieldUpdateOperationsInput | string | null
    stagingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseUncheckedUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TumorBoardCaseUncheckedUpdateManyWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    stagingId?: NullableStringFieldUpdateOperationsInput | string | null
    meetingDate?: DateTimeFieldUpdateOperationsInput | Date | string
    presentedBy?: StringFieldUpdateOperationsInput | string
    attendees?: JsonNullValueInput | InputJsonValue
    clinicalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    imagingFindings?: NullableStringFieldUpdateOperationsInput | string | null
    pathologyReport?: NullableStringFieldUpdateOperationsInput | string | null
    molecularProfile?: NullableStringFieldUpdateOperationsInput | string | null
    mdtRecommendation?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: NullableStringFieldUpdateOperationsInput | string | null
    recommendedPathway?: JsonNullValueInput | InputJsonValue
    treatmentPlan?: JsonNullValueInput | InputJsonValue
    decision?: NullableStringFieldUpdateOperationsInput | string | null
    reviewOutcome?: NullableStringFieldUpdateOperationsInput | string | null
    followUpActions?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanUncheckedUpdateWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCarePlanUncheckedUpdateManyWithoutCancerDiagnosisInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    tumorBoardCaseId?: NullableStringFieldUpdateOperationsInput | string | null
    planNumber?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    parentPlanId?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentIntent?: StringFieldUpdateOperationsInput | string
    oncologySubspecialty?: NullableStringFieldUpdateOperationsInput | string | null
    plannedModalities?: JsonNullValueInput | InputJsonValue
    plannedCycles?: NullableIntFieldUpdateOperationsInput | number | null
    cycleDurationDays?: NullableIntFieldUpdateOperationsInput | number | null
    milestones?: JsonNullValueInput | InputJsonValue
    followUpSchedule?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoOrderCreateManyProtocolInput = {
    id?: string
    tenantId: string
    patientId: string
    encounterId?: string | null
    orderingProvider: string
    cycleNumber: number
    dayNumber: number
    scheduledDate: Date | string
    administeredAt?: Date | string | null
    bsa?: Decimal | DecimalJsLike | number | string | null
    weight?: Decimal | DecimalJsLike | number | string | null
    height?: Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: string | null
    oncologyCarePlanId?: string | null
    hepaticAdjustmentGrade?: string | null
    renalAdjustmentGrade?: string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    secondVerifiedBy?: string | null
    approvedBy?: string | null
    approvedAt?: Date | string | null
    administeredBy?: string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChemoOrderUpdateWithoutProtocolInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoOrderUncheckedUpdateWithoutProtocolInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChemoOrderUncheckedUpdateManyWithoutProtocolInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    encounterId?: NullableStringFieldUpdateOperationsInput | string | null
    orderingProvider?: StringFieldUpdateOperationsInput | string
    cycleNumber?: IntFieldUpdateOperationsInput | number
    dayNumber?: IntFieldUpdateOperationsInput | number
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    administeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bsa?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    weight?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    height?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    creatinineClearance?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    cancerDiagnosisId?: NullableStringFieldUpdateOperationsInput | string | null
    oncologyCarePlanId?: NullableStringFieldUpdateOperationsInput | string | null
    hepaticAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    renalAdjustmentGrade?: NullableStringFieldUpdateOperationsInput | string | null
    doseAdjustments?: JsonNullValueInput | InputJsonValue
    preChemoChecklist?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    secondVerifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    administeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    adverseReactions?: JsonNullValueInput | InputJsonValue
    administrationDetails?: JsonNullValueInput | InputJsonValue
    drugPreparationDetails?: JsonNullValueInput | InputJsonValue
    nurseVerificationChecklist?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateManyCancerTypeInput = {
    id?: string
    tenantId: string
    primarySiteId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingUpdateWithoutCancerTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    primarySite?: OncologyPrimarySiteMasterUpdateOneRequiredWithoutSiteMappingsNestedInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateWithoutCancerTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    primarySiteId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutCancerTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    primarySiteId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingCreateManyPrimarySiteInput = {
    id?: string
    tenantId: string
    cancerTypeId: string
    isDefault?: boolean
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OncologyCancerTypeSiteMappingUpdateWithoutPrimarySiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cancerType?: OncologyCancerTypeMasterUpdateOneRequiredWithoutSiteMappingsNestedInput
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateWithoutPrimarySiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerTypeId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OncologyCancerTypeSiteMappingUncheckedUpdateManyWithoutPrimarySiteInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    cancerTypeId?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
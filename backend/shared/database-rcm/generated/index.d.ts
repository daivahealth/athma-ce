
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
    EncounterCoverage: 'EncounterCoverage'
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
      modelProps: "payer" | "policy" | "claim" | "encounterCoverage"
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
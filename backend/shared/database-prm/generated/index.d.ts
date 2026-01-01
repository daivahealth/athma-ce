
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
 * Model PatientEngagementEvent
 * 
 */
export type PatientEngagementEvent = $Result.DefaultSelection<Prisma.$PatientEngagementEventPayload>
/**
 * Model EngagementRule
 * 
 */
export type EngagementRule = $Result.DefaultSelection<Prisma.$EngagementRulePayload>
/**
 * Model CommunicationTemplate
 * 
 */
export type CommunicationTemplate = $Result.DefaultSelection<Prisma.$CommunicationTemplatePayload>
/**
 * Model PatientPreference
 * 
 */
export type PatientPreference = $Result.DefaultSelection<Prisma.$PatientPreferencePayload>
/**
 * Model PatientMessage
 * 
 */
export type PatientMessage = $Result.DefaultSelection<Prisma.$PatientMessagePayload>
/**
 * Model PatientTask
 * 
 */
export type PatientTask = $Result.DefaultSelection<Prisma.$PatientTaskPayload>
/**
 * Model EngagementRuleRun
 * 
 */
export type EngagementRuleRun = $Result.DefaultSelection<Prisma.$EngagementRuleRunPayload>
/**
 * Model PrmJob
 * 
 */
export type PrmJob = $Result.DefaultSelection<Prisma.$PrmJobPayload>
/**
 * Model ProviderCallback
 * 
 */
export type ProviderCallback = $Result.DefaultSelection<Prisma.$ProviderCallbackPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PatientEngagementEvents
 * const patientEngagementEvents = await prisma.patientEngagementEvent.findMany()
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
   * // Fetch zero or more PatientEngagementEvents
   * const patientEngagementEvents = await prisma.patientEngagementEvent.findMany()
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
   * `prisma.patientEngagementEvent`: Exposes CRUD operations for the **PatientEngagementEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientEngagementEvents
    * const patientEngagementEvents = await prisma.patientEngagementEvent.findMany()
    * ```
    */
  get patientEngagementEvent(): Prisma.PatientEngagementEventDelegate<ExtArgs>;

  /**
   * `prisma.engagementRule`: Exposes CRUD operations for the **EngagementRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EngagementRules
    * const engagementRules = await prisma.engagementRule.findMany()
    * ```
    */
  get engagementRule(): Prisma.EngagementRuleDelegate<ExtArgs>;

  /**
   * `prisma.communicationTemplate`: Exposes CRUD operations for the **CommunicationTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CommunicationTemplates
    * const communicationTemplates = await prisma.communicationTemplate.findMany()
    * ```
    */
  get communicationTemplate(): Prisma.CommunicationTemplateDelegate<ExtArgs>;

  /**
   * `prisma.patientPreference`: Exposes CRUD operations for the **PatientPreference** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientPreferences
    * const patientPreferences = await prisma.patientPreference.findMany()
    * ```
    */
  get patientPreference(): Prisma.PatientPreferenceDelegate<ExtArgs>;

  /**
   * `prisma.patientMessage`: Exposes CRUD operations for the **PatientMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientMessages
    * const patientMessages = await prisma.patientMessage.findMany()
    * ```
    */
  get patientMessage(): Prisma.PatientMessageDelegate<ExtArgs>;

  /**
   * `prisma.patientTask`: Exposes CRUD operations for the **PatientTask** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientTasks
    * const patientTasks = await prisma.patientTask.findMany()
    * ```
    */
  get patientTask(): Prisma.PatientTaskDelegate<ExtArgs>;

  /**
   * `prisma.engagementRuleRun`: Exposes CRUD operations for the **EngagementRuleRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EngagementRuleRuns
    * const engagementRuleRuns = await prisma.engagementRuleRun.findMany()
    * ```
    */
  get engagementRuleRun(): Prisma.EngagementRuleRunDelegate<ExtArgs>;

  /**
   * `prisma.prmJob`: Exposes CRUD operations for the **PrmJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrmJobs
    * const prmJobs = await prisma.prmJob.findMany()
    * ```
    */
  get prmJob(): Prisma.PrmJobDelegate<ExtArgs>;

  /**
   * `prisma.providerCallback`: Exposes CRUD operations for the **ProviderCallback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProviderCallbacks
    * const providerCallbacks = await prisma.providerCallback.findMany()
    * ```
    */
  get providerCallback(): Prisma.ProviderCallbackDelegate<ExtArgs>;
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
    PatientEngagementEvent: 'PatientEngagementEvent',
    EngagementRule: 'EngagementRule',
    CommunicationTemplate: 'CommunicationTemplate',
    PatientPreference: 'PatientPreference',
    PatientMessage: 'PatientMessage',
    PatientTask: 'PatientTask',
    EngagementRuleRun: 'EngagementRuleRun',
    PrmJob: 'PrmJob',
    ProviderCallback: 'ProviderCallback'
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
      modelProps: "patientEngagementEvent" | "engagementRule" | "communicationTemplate" | "patientPreference" | "patientMessage" | "patientTask" | "engagementRuleRun" | "prmJob" | "providerCallback"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PatientEngagementEvent: {
        payload: Prisma.$PatientEngagementEventPayload<ExtArgs>
        fields: Prisma.PatientEngagementEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientEngagementEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientEngagementEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          findFirst: {
            args: Prisma.PatientEngagementEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientEngagementEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          findMany: {
            args: Prisma.PatientEngagementEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>[]
          }
          create: {
            args: Prisma.PatientEngagementEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          createMany: {
            args: Prisma.PatientEngagementEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientEngagementEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>[]
          }
          delete: {
            args: Prisma.PatientEngagementEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          update: {
            args: Prisma.PatientEngagementEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          deleteMany: {
            args: Prisma.PatientEngagementEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientEngagementEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientEngagementEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientEngagementEventPayload>
          }
          aggregate: {
            args: Prisma.PatientEngagementEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientEngagementEvent>
          }
          groupBy: {
            args: Prisma.PatientEngagementEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientEngagementEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientEngagementEventCountArgs<ExtArgs>
            result: $Utils.Optional<PatientEngagementEventCountAggregateOutputType> | number
          }
        }
      }
      EngagementRule: {
        payload: Prisma.$EngagementRulePayload<ExtArgs>
        fields: Prisma.EngagementRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EngagementRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EngagementRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          findFirst: {
            args: Prisma.EngagementRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EngagementRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          findMany: {
            args: Prisma.EngagementRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>[]
          }
          create: {
            args: Prisma.EngagementRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          createMany: {
            args: Prisma.EngagementRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EngagementRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>[]
          }
          delete: {
            args: Prisma.EngagementRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          update: {
            args: Prisma.EngagementRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          deleteMany: {
            args: Prisma.EngagementRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EngagementRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EngagementRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRulePayload>
          }
          aggregate: {
            args: Prisma.EngagementRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEngagementRule>
          }
          groupBy: {
            args: Prisma.EngagementRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<EngagementRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.EngagementRuleCountArgs<ExtArgs>
            result: $Utils.Optional<EngagementRuleCountAggregateOutputType> | number
          }
        }
      }
      CommunicationTemplate: {
        payload: Prisma.$CommunicationTemplatePayload<ExtArgs>
        fields: Prisma.CommunicationTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommunicationTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommunicationTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          findFirst: {
            args: Prisma.CommunicationTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommunicationTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          findMany: {
            args: Prisma.CommunicationTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>[]
          }
          create: {
            args: Prisma.CommunicationTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          createMany: {
            args: Prisma.CommunicationTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommunicationTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>[]
          }
          delete: {
            args: Prisma.CommunicationTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          update: {
            args: Prisma.CommunicationTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          deleteMany: {
            args: Prisma.CommunicationTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommunicationTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommunicationTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommunicationTemplatePayload>
          }
          aggregate: {
            args: Prisma.CommunicationTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommunicationTemplate>
          }
          groupBy: {
            args: Prisma.CommunicationTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommunicationTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommunicationTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<CommunicationTemplateCountAggregateOutputType> | number
          }
        }
      }
      PatientPreference: {
        payload: Prisma.$PatientPreferencePayload<ExtArgs>
        fields: Prisma.PatientPreferenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientPreferenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientPreferenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          findFirst: {
            args: Prisma.PatientPreferenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientPreferenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          findMany: {
            args: Prisma.PatientPreferenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>[]
          }
          create: {
            args: Prisma.PatientPreferenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          createMany: {
            args: Prisma.PatientPreferenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientPreferenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>[]
          }
          delete: {
            args: Prisma.PatientPreferenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          update: {
            args: Prisma.PatientPreferenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          deleteMany: {
            args: Prisma.PatientPreferenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientPreferenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientPreferenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPreferencePayload>
          }
          aggregate: {
            args: Prisma.PatientPreferenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientPreference>
          }
          groupBy: {
            args: Prisma.PatientPreferenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientPreferenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientPreferenceCountArgs<ExtArgs>
            result: $Utils.Optional<PatientPreferenceCountAggregateOutputType> | number
          }
        }
      }
      PatientMessage: {
        payload: Prisma.$PatientMessagePayload<ExtArgs>
        fields: Prisma.PatientMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          findFirst: {
            args: Prisma.PatientMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          findMany: {
            args: Prisma.PatientMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>[]
          }
          create: {
            args: Prisma.PatientMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          createMany: {
            args: Prisma.PatientMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>[]
          }
          delete: {
            args: Prisma.PatientMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          update: {
            args: Prisma.PatientMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          deleteMany: {
            args: Prisma.PatientMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientMessagePayload>
          }
          aggregate: {
            args: Prisma.PatientMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientMessage>
          }
          groupBy: {
            args: Prisma.PatientMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientMessageCountArgs<ExtArgs>
            result: $Utils.Optional<PatientMessageCountAggregateOutputType> | number
          }
        }
      }
      PatientTask: {
        payload: Prisma.$PatientTaskPayload<ExtArgs>
        fields: Prisma.PatientTaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientTaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientTaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          findFirst: {
            args: Prisma.PatientTaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientTaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          findMany: {
            args: Prisma.PatientTaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>[]
          }
          create: {
            args: Prisma.PatientTaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          createMany: {
            args: Prisma.PatientTaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientTaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>[]
          }
          delete: {
            args: Prisma.PatientTaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          update: {
            args: Prisma.PatientTaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          deleteMany: {
            args: Prisma.PatientTaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientTaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientTaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTaskPayload>
          }
          aggregate: {
            args: Prisma.PatientTaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientTask>
          }
          groupBy: {
            args: Prisma.PatientTaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientTaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientTaskCountArgs<ExtArgs>
            result: $Utils.Optional<PatientTaskCountAggregateOutputType> | number
          }
        }
      }
      EngagementRuleRun: {
        payload: Prisma.$EngagementRuleRunPayload<ExtArgs>
        fields: Prisma.EngagementRuleRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EngagementRuleRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EngagementRuleRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          findFirst: {
            args: Prisma.EngagementRuleRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EngagementRuleRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          findMany: {
            args: Prisma.EngagementRuleRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>[]
          }
          create: {
            args: Prisma.EngagementRuleRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          createMany: {
            args: Prisma.EngagementRuleRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EngagementRuleRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>[]
          }
          delete: {
            args: Prisma.EngagementRuleRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          update: {
            args: Prisma.EngagementRuleRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          deleteMany: {
            args: Prisma.EngagementRuleRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EngagementRuleRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EngagementRuleRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EngagementRuleRunPayload>
          }
          aggregate: {
            args: Prisma.EngagementRuleRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEngagementRuleRun>
          }
          groupBy: {
            args: Prisma.EngagementRuleRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<EngagementRuleRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.EngagementRuleRunCountArgs<ExtArgs>
            result: $Utils.Optional<EngagementRuleRunCountAggregateOutputType> | number
          }
        }
      }
      PrmJob: {
        payload: Prisma.$PrmJobPayload<ExtArgs>
        fields: Prisma.PrmJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrmJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrmJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          findFirst: {
            args: Prisma.PrmJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrmJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          findMany: {
            args: Prisma.PrmJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>[]
          }
          create: {
            args: Prisma.PrmJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          createMany: {
            args: Prisma.PrmJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrmJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>[]
          }
          delete: {
            args: Prisma.PrmJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          update: {
            args: Prisma.PrmJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          deleteMany: {
            args: Prisma.PrmJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrmJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PrmJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrmJobPayload>
          }
          aggregate: {
            args: Prisma.PrmJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrmJob>
          }
          groupBy: {
            args: Prisma.PrmJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrmJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrmJobCountArgs<ExtArgs>
            result: $Utils.Optional<PrmJobCountAggregateOutputType> | number
          }
        }
      }
      ProviderCallback: {
        payload: Prisma.$ProviderCallbackPayload<ExtArgs>
        fields: Prisma.ProviderCallbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProviderCallbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProviderCallbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          findFirst: {
            args: Prisma.ProviderCallbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProviderCallbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          findMany: {
            args: Prisma.ProviderCallbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>[]
          }
          create: {
            args: Prisma.ProviderCallbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          createMany: {
            args: Prisma.ProviderCallbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProviderCallbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>[]
          }
          delete: {
            args: Prisma.ProviderCallbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          update: {
            args: Prisma.ProviderCallbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          deleteMany: {
            args: Prisma.ProviderCallbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProviderCallbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProviderCallbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProviderCallbackPayload>
          }
          aggregate: {
            args: Prisma.ProviderCallbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProviderCallback>
          }
          groupBy: {
            args: Prisma.ProviderCallbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProviderCallbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProviderCallbackCountArgs<ExtArgs>
            result: $Utils.Optional<ProviderCallbackCountAggregateOutputType> | number
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
   * Count Type PatientEngagementEventCountOutputType
   */

  export type PatientEngagementEventCountOutputType = {
    ruleRuns: number
    relatedMessages: number
    relatedTasks: number
  }

  export type PatientEngagementEventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ruleRuns?: boolean | PatientEngagementEventCountOutputTypeCountRuleRunsArgs
    relatedMessages?: boolean | PatientEngagementEventCountOutputTypeCountRelatedMessagesArgs
    relatedTasks?: boolean | PatientEngagementEventCountOutputTypeCountRelatedTasksArgs
  }

  // Custom InputTypes
  /**
   * PatientEngagementEventCountOutputType without action
   */
  export type PatientEngagementEventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEventCountOutputType
     */
    select?: PatientEngagementEventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientEngagementEventCountOutputType without action
   */
  export type PatientEngagementEventCountOutputTypeCountRuleRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EngagementRuleRunWhereInput
  }

  /**
   * PatientEngagementEventCountOutputType without action
   */
  export type PatientEngagementEventCountOutputTypeCountRelatedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientMessageWhereInput
  }

  /**
   * PatientEngagementEventCountOutputType without action
   */
  export type PatientEngagementEventCountOutputTypeCountRelatedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientTaskWhereInput
  }


  /**
   * Count Type EngagementRuleCountOutputType
   */

  export type EngagementRuleCountOutputType = {
    ruleRuns: number
  }

  export type EngagementRuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ruleRuns?: boolean | EngagementRuleCountOutputTypeCountRuleRunsArgs
  }

  // Custom InputTypes
  /**
   * EngagementRuleCountOutputType without action
   */
  export type EngagementRuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleCountOutputType
     */
    select?: EngagementRuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EngagementRuleCountOutputType without action
   */
  export type EngagementRuleCountOutputTypeCountRuleRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EngagementRuleRunWhereInput
  }


  /**
   * Count Type CommunicationTemplateCountOutputType
   */

  export type CommunicationTemplateCountOutputType = {
    messages: number
  }

  export type CommunicationTemplateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | CommunicationTemplateCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * CommunicationTemplateCountOutputType without action
   */
  export type CommunicationTemplateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplateCountOutputType
     */
    select?: CommunicationTemplateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommunicationTemplateCountOutputType without action
   */
  export type CommunicationTemplateCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PatientEngagementEvent
   */

  export type AggregatePatientEngagementEvent = {
    _count: PatientEngagementEventCountAggregateOutputType | null
    _avg: PatientEngagementEventAvgAggregateOutputType | null
    _sum: PatientEngagementEventSumAggregateOutputType | null
    _min: PatientEngagementEventMinAggregateOutputType | null
    _max: PatientEngagementEventMaxAggregateOutputType | null
  }

  export type PatientEngagementEventAvgAggregateOutputType = {
    patientAgeYearsAtEvent: number | null
    severity: number | null
  }

  export type PatientEngagementEventSumAggregateOutputType = {
    patientAgeYearsAtEvent: number | null
    severity: number | null
  }

  export type PatientEngagementEventMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientDob: Date | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    patientMobileMasked: string | null
    sourceSystem: string | null
    sourceModule: string | null
    eventType: string | null
    eventSubtype: string | null
    severity: number | null
    occurredAt: Date | null
    entityType: string | null
    entityId: string | null
    correlationId: string | null
    dedupeKey: string | null
    createdAt: Date | null
    createdBy: string | null
  }

  export type PatientEngagementEventMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientDob: Date | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    patientMobileMasked: string | null
    sourceSystem: string | null
    sourceModule: string | null
    eventType: string | null
    eventSubtype: string | null
    severity: number | null
    occurredAt: Date | null
    entityType: string | null
    entityId: string | null
    correlationId: string | null
    dedupeKey: string | null
    createdAt: Date | null
    createdBy: string | null
  }

  export type PatientEngagementEventCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    patientDisplayName: number
    patientGender: number
    patientDob: number
    patientAgeYearsAtEvent: number
    patientRef: number
    patientMobileMasked: number
    sourceSystem: number
    sourceModule: number
    eventType: number
    eventSubtype: number
    severity: number
    occurredAt: number
    entityType: number
    entityId: number
    payload: number
    correlationId: number
    dedupeKey: number
    createdAt: number
    createdBy: number
    _all: number
  }


  export type PatientEngagementEventAvgAggregateInputType = {
    patientAgeYearsAtEvent?: true
    severity?: true
  }

  export type PatientEngagementEventSumAggregateInputType = {
    patientAgeYearsAtEvent?: true
    severity?: true
  }

  export type PatientEngagementEventMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientDob?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    patientMobileMasked?: true
    sourceSystem?: true
    sourceModule?: true
    eventType?: true
    eventSubtype?: true
    severity?: true
    occurredAt?: true
    entityType?: true
    entityId?: true
    correlationId?: true
    dedupeKey?: true
    createdAt?: true
    createdBy?: true
  }

  export type PatientEngagementEventMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientDob?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    patientMobileMasked?: true
    sourceSystem?: true
    sourceModule?: true
    eventType?: true
    eventSubtype?: true
    severity?: true
    occurredAt?: true
    entityType?: true
    entityId?: true
    correlationId?: true
    dedupeKey?: true
    createdAt?: true
    createdBy?: true
  }

  export type PatientEngagementEventCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientDob?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    patientMobileMasked?: true
    sourceSystem?: true
    sourceModule?: true
    eventType?: true
    eventSubtype?: true
    severity?: true
    occurredAt?: true
    entityType?: true
    entityId?: true
    payload?: true
    correlationId?: true
    dedupeKey?: true
    createdAt?: true
    createdBy?: true
    _all?: true
  }

  export type PatientEngagementEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientEngagementEvent to aggregate.
     */
    where?: PatientEngagementEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagementEvents to fetch.
     */
    orderBy?: PatientEngagementEventOrderByWithRelationInput | PatientEngagementEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientEngagementEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagementEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagementEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientEngagementEvents
    **/
    _count?: true | PatientEngagementEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientEngagementEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientEngagementEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientEngagementEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientEngagementEventMaxAggregateInputType
  }

  export type GetPatientEngagementEventAggregateType<T extends PatientEngagementEventAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientEngagementEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientEngagementEvent[P]>
      : GetScalarType<T[P], AggregatePatientEngagementEvent[P]>
  }




  export type PatientEngagementEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientEngagementEventWhereInput
    orderBy?: PatientEngagementEventOrderByWithAggregationInput | PatientEngagementEventOrderByWithAggregationInput[]
    by: PatientEngagementEventScalarFieldEnum[] | PatientEngagementEventScalarFieldEnum
    having?: PatientEngagementEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientEngagementEventCountAggregateInputType | true
    _avg?: PatientEngagementEventAvgAggregateInputType
    _sum?: PatientEngagementEventSumAggregateInputType
    _min?: PatientEngagementEventMinAggregateInputType
    _max?: PatientEngagementEventMaxAggregateInputType
  }

  export type PatientEngagementEventGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    patientDisplayName: string | null
    patientGender: string | null
    patientDob: Date | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    patientMobileMasked: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype: string | null
    severity: number
    occurredAt: Date
    entityType: string
    entityId: string
    payload: JsonValue
    correlationId: string | null
    dedupeKey: string
    createdAt: Date
    createdBy: string | null
    _count: PatientEngagementEventCountAggregateOutputType | null
    _avg: PatientEngagementEventAvgAggregateOutputType | null
    _sum: PatientEngagementEventSumAggregateOutputType | null
    _min: PatientEngagementEventMinAggregateOutputType | null
    _max: PatientEngagementEventMaxAggregateOutputType | null
  }

  type GetPatientEngagementEventGroupByPayload<T extends PatientEngagementEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientEngagementEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientEngagementEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientEngagementEventGroupByOutputType[P]>
            : GetScalarType<T[P], PatientEngagementEventGroupByOutputType[P]>
        }
      >
    >


  export type PatientEngagementEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientDob?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    patientMobileMasked?: boolean
    sourceSystem?: boolean
    sourceModule?: boolean
    eventType?: boolean
    eventSubtype?: boolean
    severity?: boolean
    occurredAt?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    correlationId?: boolean
    dedupeKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
    ruleRuns?: boolean | PatientEngagementEvent$ruleRunsArgs<ExtArgs>
    relatedMessages?: boolean | PatientEngagementEvent$relatedMessagesArgs<ExtArgs>
    relatedTasks?: boolean | PatientEngagementEvent$relatedTasksArgs<ExtArgs>
    _count?: boolean | PatientEngagementEventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientEngagementEvent"]>

  export type PatientEngagementEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientDob?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    patientMobileMasked?: boolean
    sourceSystem?: boolean
    sourceModule?: boolean
    eventType?: boolean
    eventSubtype?: boolean
    severity?: boolean
    occurredAt?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    correlationId?: boolean
    dedupeKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
  }, ExtArgs["result"]["patientEngagementEvent"]>

  export type PatientEngagementEventSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientDob?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    patientMobileMasked?: boolean
    sourceSystem?: boolean
    sourceModule?: boolean
    eventType?: boolean
    eventSubtype?: boolean
    severity?: boolean
    occurredAt?: boolean
    entityType?: boolean
    entityId?: boolean
    payload?: boolean
    correlationId?: boolean
    dedupeKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
  }

  export type PatientEngagementEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ruleRuns?: boolean | PatientEngagementEvent$ruleRunsArgs<ExtArgs>
    relatedMessages?: boolean | PatientEngagementEvent$relatedMessagesArgs<ExtArgs>
    relatedTasks?: boolean | PatientEngagementEvent$relatedTasksArgs<ExtArgs>
    _count?: boolean | PatientEngagementEventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientEngagementEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PatientEngagementEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientEngagementEvent"
    objects: {
      ruleRuns: Prisma.$EngagementRuleRunPayload<ExtArgs>[]
      relatedMessages: Prisma.$PatientMessagePayload<ExtArgs>[]
      relatedTasks: Prisma.$PatientTaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      patientDisplayName: string | null
      patientGender: string | null
      patientDob: Date | null
      patientAgeYearsAtEvent: number | null
      patientRef: string | null
      patientMobileMasked: string | null
      sourceSystem: string
      sourceModule: string
      eventType: string
      eventSubtype: string | null
      severity: number
      occurredAt: Date
      entityType: string
      entityId: string
      payload: Prisma.JsonValue
      correlationId: string | null
      dedupeKey: string
      createdAt: Date
      createdBy: string | null
    }, ExtArgs["result"]["patientEngagementEvent"]>
    composites: {}
  }

  type PatientEngagementEventGetPayload<S extends boolean | null | undefined | PatientEngagementEventDefaultArgs> = $Result.GetResult<Prisma.$PatientEngagementEventPayload, S>

  type PatientEngagementEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientEngagementEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientEngagementEventCountAggregateInputType | true
    }

  export interface PatientEngagementEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientEngagementEvent'], meta: { name: 'PatientEngagementEvent' } }
    /**
     * Find zero or one PatientEngagementEvent that matches the filter.
     * @param {PatientEngagementEventFindUniqueArgs} args - Arguments to find a PatientEngagementEvent
     * @example
     * // Get one PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientEngagementEventFindUniqueArgs>(args: SelectSubset<T, PatientEngagementEventFindUniqueArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientEngagementEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientEngagementEventFindUniqueOrThrowArgs} args - Arguments to find a PatientEngagementEvent
     * @example
     * // Get one PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientEngagementEventFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientEngagementEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientEngagementEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventFindFirstArgs} args - Arguments to find a PatientEngagementEvent
     * @example
     * // Get one PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientEngagementEventFindFirstArgs>(args?: SelectSubset<T, PatientEngagementEventFindFirstArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientEngagementEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventFindFirstOrThrowArgs} args - Arguments to find a PatientEngagementEvent
     * @example
     * // Get one PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientEngagementEventFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientEngagementEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientEngagementEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientEngagementEvents
     * const patientEngagementEvents = await prisma.patientEngagementEvent.findMany()
     * 
     * // Get first 10 PatientEngagementEvents
     * const patientEngagementEvents = await prisma.patientEngagementEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientEngagementEventWithIdOnly = await prisma.patientEngagementEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientEngagementEventFindManyArgs>(args?: SelectSubset<T, PatientEngagementEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientEngagementEvent.
     * @param {PatientEngagementEventCreateArgs} args - Arguments to create a PatientEngagementEvent.
     * @example
     * // Create one PatientEngagementEvent
     * const PatientEngagementEvent = await prisma.patientEngagementEvent.create({
     *   data: {
     *     // ... data to create a PatientEngagementEvent
     *   }
     * })
     * 
     */
    create<T extends PatientEngagementEventCreateArgs>(args: SelectSubset<T, PatientEngagementEventCreateArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientEngagementEvents.
     * @param {PatientEngagementEventCreateManyArgs} args - Arguments to create many PatientEngagementEvents.
     * @example
     * // Create many PatientEngagementEvents
     * const patientEngagementEvent = await prisma.patientEngagementEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientEngagementEventCreateManyArgs>(args?: SelectSubset<T, PatientEngagementEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientEngagementEvents and returns the data saved in the database.
     * @param {PatientEngagementEventCreateManyAndReturnArgs} args - Arguments to create many PatientEngagementEvents.
     * @example
     * // Create many PatientEngagementEvents
     * const patientEngagementEvent = await prisma.patientEngagementEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientEngagementEvents and only return the `id`
     * const patientEngagementEventWithIdOnly = await prisma.patientEngagementEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientEngagementEventCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientEngagementEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientEngagementEvent.
     * @param {PatientEngagementEventDeleteArgs} args - Arguments to delete one PatientEngagementEvent.
     * @example
     * // Delete one PatientEngagementEvent
     * const PatientEngagementEvent = await prisma.patientEngagementEvent.delete({
     *   where: {
     *     // ... filter to delete one PatientEngagementEvent
     *   }
     * })
     * 
     */
    delete<T extends PatientEngagementEventDeleteArgs>(args: SelectSubset<T, PatientEngagementEventDeleteArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientEngagementEvent.
     * @param {PatientEngagementEventUpdateArgs} args - Arguments to update one PatientEngagementEvent.
     * @example
     * // Update one PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientEngagementEventUpdateArgs>(args: SelectSubset<T, PatientEngagementEventUpdateArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientEngagementEvents.
     * @param {PatientEngagementEventDeleteManyArgs} args - Arguments to filter PatientEngagementEvents to delete.
     * @example
     * // Delete a few PatientEngagementEvents
     * const { count } = await prisma.patientEngagementEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientEngagementEventDeleteManyArgs>(args?: SelectSubset<T, PatientEngagementEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientEngagementEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientEngagementEvents
     * const patientEngagementEvent = await prisma.patientEngagementEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientEngagementEventUpdateManyArgs>(args: SelectSubset<T, PatientEngagementEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientEngagementEvent.
     * @param {PatientEngagementEventUpsertArgs} args - Arguments to update or create a PatientEngagementEvent.
     * @example
     * // Update or create a PatientEngagementEvent
     * const patientEngagementEvent = await prisma.patientEngagementEvent.upsert({
     *   create: {
     *     // ... data to create a PatientEngagementEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientEngagementEvent we want to update
     *   }
     * })
     */
    upsert<T extends PatientEngagementEventUpsertArgs>(args: SelectSubset<T, PatientEngagementEventUpsertArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientEngagementEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventCountArgs} args - Arguments to filter PatientEngagementEvents to count.
     * @example
     * // Count the number of PatientEngagementEvents
     * const count = await prisma.patientEngagementEvent.count({
     *   where: {
     *     // ... the filter for the PatientEngagementEvents we want to count
     *   }
     * })
    **/
    count<T extends PatientEngagementEventCountArgs>(
      args?: Subset<T, PatientEngagementEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientEngagementEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientEngagementEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientEngagementEventAggregateArgs>(args: Subset<T, PatientEngagementEventAggregateArgs>): Prisma.PrismaPromise<GetPatientEngagementEventAggregateType<T>>

    /**
     * Group by PatientEngagementEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientEngagementEventGroupByArgs} args - Group by arguments.
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
      T extends PatientEngagementEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientEngagementEventGroupByArgs['orderBy'] }
        : { orderBy?: PatientEngagementEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientEngagementEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientEngagementEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientEngagementEvent model
   */
  readonly fields: PatientEngagementEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientEngagementEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientEngagementEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ruleRuns<T extends PatientEngagementEvent$ruleRunsArgs<ExtArgs> = {}>(args?: Subset<T, PatientEngagementEvent$ruleRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findMany"> | Null>
    relatedMessages<T extends PatientEngagementEvent$relatedMessagesArgs<ExtArgs> = {}>(args?: Subset<T, PatientEngagementEvent$relatedMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findMany"> | Null>
    relatedTasks<T extends PatientEngagementEvent$relatedTasksArgs<ExtArgs> = {}>(args?: Subset<T, PatientEngagementEvent$relatedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the PatientEngagementEvent model
   */ 
  interface PatientEngagementEventFieldRefs {
    readonly id: FieldRef<"PatientEngagementEvent", 'String'>
    readonly tenantId: FieldRef<"PatientEngagementEvent", 'String'>
    readonly patientId: FieldRef<"PatientEngagementEvent", 'String'>
    readonly patientDisplayName: FieldRef<"PatientEngagementEvent", 'String'>
    readonly patientGender: FieldRef<"PatientEngagementEvent", 'String'>
    readonly patientDob: FieldRef<"PatientEngagementEvent", 'DateTime'>
    readonly patientAgeYearsAtEvent: FieldRef<"PatientEngagementEvent", 'Int'>
    readonly patientRef: FieldRef<"PatientEngagementEvent", 'String'>
    readonly patientMobileMasked: FieldRef<"PatientEngagementEvent", 'String'>
    readonly sourceSystem: FieldRef<"PatientEngagementEvent", 'String'>
    readonly sourceModule: FieldRef<"PatientEngagementEvent", 'String'>
    readonly eventType: FieldRef<"PatientEngagementEvent", 'String'>
    readonly eventSubtype: FieldRef<"PatientEngagementEvent", 'String'>
    readonly severity: FieldRef<"PatientEngagementEvent", 'Int'>
    readonly occurredAt: FieldRef<"PatientEngagementEvent", 'DateTime'>
    readonly entityType: FieldRef<"PatientEngagementEvent", 'String'>
    readonly entityId: FieldRef<"PatientEngagementEvent", 'String'>
    readonly payload: FieldRef<"PatientEngagementEvent", 'Json'>
    readonly correlationId: FieldRef<"PatientEngagementEvent", 'String'>
    readonly dedupeKey: FieldRef<"PatientEngagementEvent", 'String'>
    readonly createdAt: FieldRef<"PatientEngagementEvent", 'DateTime'>
    readonly createdBy: FieldRef<"PatientEngagementEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientEngagementEvent findUnique
   */
  export type PatientEngagementEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter, which PatientEngagementEvent to fetch.
     */
    where: PatientEngagementEventWhereUniqueInput
  }

  /**
   * PatientEngagementEvent findUniqueOrThrow
   */
  export type PatientEngagementEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter, which PatientEngagementEvent to fetch.
     */
    where: PatientEngagementEventWhereUniqueInput
  }

  /**
   * PatientEngagementEvent findFirst
   */
  export type PatientEngagementEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter, which PatientEngagementEvent to fetch.
     */
    where?: PatientEngagementEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagementEvents to fetch.
     */
    orderBy?: PatientEngagementEventOrderByWithRelationInput | PatientEngagementEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientEngagementEvents.
     */
    cursor?: PatientEngagementEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagementEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagementEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientEngagementEvents.
     */
    distinct?: PatientEngagementEventScalarFieldEnum | PatientEngagementEventScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent findFirstOrThrow
   */
  export type PatientEngagementEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter, which PatientEngagementEvent to fetch.
     */
    where?: PatientEngagementEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagementEvents to fetch.
     */
    orderBy?: PatientEngagementEventOrderByWithRelationInput | PatientEngagementEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientEngagementEvents.
     */
    cursor?: PatientEngagementEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagementEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagementEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientEngagementEvents.
     */
    distinct?: PatientEngagementEventScalarFieldEnum | PatientEngagementEventScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent findMany
   */
  export type PatientEngagementEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter, which PatientEngagementEvents to fetch.
     */
    where?: PatientEngagementEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientEngagementEvents to fetch.
     */
    orderBy?: PatientEngagementEventOrderByWithRelationInput | PatientEngagementEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientEngagementEvents.
     */
    cursor?: PatientEngagementEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientEngagementEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientEngagementEvents.
     */
    skip?: number
    distinct?: PatientEngagementEventScalarFieldEnum | PatientEngagementEventScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent create
   */
  export type PatientEngagementEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientEngagementEvent.
     */
    data: XOR<PatientEngagementEventCreateInput, PatientEngagementEventUncheckedCreateInput>
  }

  /**
   * PatientEngagementEvent createMany
   */
  export type PatientEngagementEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientEngagementEvents.
     */
    data: PatientEngagementEventCreateManyInput | PatientEngagementEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientEngagementEvent createManyAndReturn
   */
  export type PatientEngagementEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientEngagementEvents.
     */
    data: PatientEngagementEventCreateManyInput | PatientEngagementEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientEngagementEvent update
   */
  export type PatientEngagementEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientEngagementEvent.
     */
    data: XOR<PatientEngagementEventUpdateInput, PatientEngagementEventUncheckedUpdateInput>
    /**
     * Choose, which PatientEngagementEvent to update.
     */
    where: PatientEngagementEventWhereUniqueInput
  }

  /**
   * PatientEngagementEvent updateMany
   */
  export type PatientEngagementEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientEngagementEvents.
     */
    data: XOR<PatientEngagementEventUpdateManyMutationInput, PatientEngagementEventUncheckedUpdateManyInput>
    /**
     * Filter which PatientEngagementEvents to update
     */
    where?: PatientEngagementEventWhereInput
  }

  /**
   * PatientEngagementEvent upsert
   */
  export type PatientEngagementEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientEngagementEvent to update in case it exists.
     */
    where: PatientEngagementEventWhereUniqueInput
    /**
     * In case the PatientEngagementEvent found by the `where` argument doesn't exist, create a new PatientEngagementEvent with this data.
     */
    create: XOR<PatientEngagementEventCreateInput, PatientEngagementEventUncheckedCreateInput>
    /**
     * In case the PatientEngagementEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientEngagementEventUpdateInput, PatientEngagementEventUncheckedUpdateInput>
  }

  /**
   * PatientEngagementEvent delete
   */
  export type PatientEngagementEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    /**
     * Filter which PatientEngagementEvent to delete.
     */
    where: PatientEngagementEventWhereUniqueInput
  }

  /**
   * PatientEngagementEvent deleteMany
   */
  export type PatientEngagementEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientEngagementEvents to delete
     */
    where?: PatientEngagementEventWhereInput
  }

  /**
   * PatientEngagementEvent.ruleRuns
   */
  export type PatientEngagementEvent$ruleRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    where?: EngagementRuleRunWhereInput
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    cursor?: EngagementRuleRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EngagementRuleRunScalarFieldEnum | EngagementRuleRunScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent.relatedMessages
   */
  export type PatientEngagementEvent$relatedMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    where?: PatientMessageWhereInput
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    cursor?: PatientMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientMessageScalarFieldEnum | PatientMessageScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent.relatedTasks
   */
  export type PatientEngagementEvent$relatedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    where?: PatientTaskWhereInput
    orderBy?: PatientTaskOrderByWithRelationInput | PatientTaskOrderByWithRelationInput[]
    cursor?: PatientTaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientTaskScalarFieldEnum | PatientTaskScalarFieldEnum[]
  }

  /**
   * PatientEngagementEvent without action
   */
  export type PatientEngagementEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
  }


  /**
   * Model EngagementRule
   */

  export type AggregateEngagementRule = {
    _count: EngagementRuleCountAggregateOutputType | null
    _avg: EngagementRuleAvgAggregateOutputType | null
    _sum: EngagementRuleSumAggregateOutputType | null
    _min: EngagementRuleMinAggregateOutputType | null
    _max: EngagementRuleMaxAggregateOutputType | null
  }

  export type EngagementRuleAvgAggregateOutputType = {
    delaySeconds: number | null
    priority: number | null
    cooldownSeconds: number | null
    idempotencyWindow: number | null
    maxExecutionsPerDay: number | null
  }

  export type EngagementRuleSumAggregateOutputType = {
    delaySeconds: number | null
    priority: number | null
    cooldownSeconds: number | null
    idempotencyWindow: number | null
    maxExecutionsPerDay: number | null
  }

  export type EngagementRuleMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    category: string | null
    triggerEventType: string | null
    triggerEventSubtype: string | null
    scheduleMode: string | null
    delaySeconds: number | null
    actionType: string | null
    priority: number | null
    cooldownSeconds: number | null
    idempotencyWindow: number | null
    maxExecutionsPerDay: number | null
    effectiveFrom: Date | null
    effectiveTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type EngagementRuleMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    category: string | null
    triggerEventType: string | null
    triggerEventSubtype: string | null
    scheduleMode: string | null
    delaySeconds: number | null
    actionType: string | null
    priority: number | null
    cooldownSeconds: number | null
    idempotencyWindow: number | null
    maxExecutionsPerDay: number | null
    effectiveFrom: Date | null
    effectiveTo: Date | null
    isActive: boolean | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type EngagementRuleCountAggregateOutputType = {
    id: number
    tenantId: number
    code: number
    name: number
    description: number
    category: number
    triggerEventType: number
    triggerEventSubtype: number
    conditionExpr: number
    scheduleMode: number
    delaySeconds: number
    actionType: number
    actionPayload: number
    priority: number
    cooldownSeconds: number
    idempotencyWindow: number
    maxExecutionsPerDay: number
    effectiveFrom: number
    effectiveTo: number
    isActive: number
    createdAt: number
    createdBy: number
    updatedAt: number
    updatedBy: number
    deletedAt: number
    deletedBy: number
    _all: number
  }


  export type EngagementRuleAvgAggregateInputType = {
    delaySeconds?: true
    priority?: true
    cooldownSeconds?: true
    idempotencyWindow?: true
    maxExecutionsPerDay?: true
  }

  export type EngagementRuleSumAggregateInputType = {
    delaySeconds?: true
    priority?: true
    cooldownSeconds?: true
    idempotencyWindow?: true
    maxExecutionsPerDay?: true
  }

  export type EngagementRuleMinAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    triggerEventType?: true
    triggerEventSubtype?: true
    scheduleMode?: true
    delaySeconds?: true
    actionType?: true
    priority?: true
    cooldownSeconds?: true
    idempotencyWindow?: true
    maxExecutionsPerDay?: true
    effectiveFrom?: true
    effectiveTo?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type EngagementRuleMaxAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    triggerEventType?: true
    triggerEventSubtype?: true
    scheduleMode?: true
    delaySeconds?: true
    actionType?: true
    priority?: true
    cooldownSeconds?: true
    idempotencyWindow?: true
    maxExecutionsPerDay?: true
    effectiveFrom?: true
    effectiveTo?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type EngagementRuleCountAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    triggerEventType?: true
    triggerEventSubtype?: true
    conditionExpr?: true
    scheduleMode?: true
    delaySeconds?: true
    actionType?: true
    actionPayload?: true
    priority?: true
    cooldownSeconds?: true
    idempotencyWindow?: true
    maxExecutionsPerDay?: true
    effectiveFrom?: true
    effectiveTo?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
    _all?: true
  }

  export type EngagementRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EngagementRule to aggregate.
     */
    where?: EngagementRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRules to fetch.
     */
    orderBy?: EngagementRuleOrderByWithRelationInput | EngagementRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EngagementRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EngagementRules
    **/
    _count?: true | EngagementRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EngagementRuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EngagementRuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EngagementRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EngagementRuleMaxAggregateInputType
  }

  export type GetEngagementRuleAggregateType<T extends EngagementRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateEngagementRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEngagementRule[P]>
      : GetScalarType<T[P], AggregateEngagementRule[P]>
  }




  export type EngagementRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EngagementRuleWhereInput
    orderBy?: EngagementRuleOrderByWithAggregationInput | EngagementRuleOrderByWithAggregationInput[]
    by: EngagementRuleScalarFieldEnum[] | EngagementRuleScalarFieldEnum
    having?: EngagementRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EngagementRuleCountAggregateInputType | true
    _avg?: EngagementRuleAvgAggregateInputType
    _sum?: EngagementRuleSumAggregateInputType
    _min?: EngagementRuleMinAggregateInputType
    _max?: EngagementRuleMaxAggregateInputType
  }

  export type EngagementRuleGroupByOutputType = {
    id: string
    tenantId: string
    code: string
    name: string
    description: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype: string | null
    conditionExpr: JsonValue
    scheduleMode: string
    delaySeconds: number | null
    actionType: string
    actionPayload: JsonValue
    priority: number
    cooldownSeconds: number | null
    idempotencyWindow: number | null
    maxExecutionsPerDay: number | null
    effectiveFrom: Date | null
    effectiveTo: Date | null
    isActive: boolean
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
    _count: EngagementRuleCountAggregateOutputType | null
    _avg: EngagementRuleAvgAggregateOutputType | null
    _sum: EngagementRuleSumAggregateOutputType | null
    _min: EngagementRuleMinAggregateOutputType | null
    _max: EngagementRuleMaxAggregateOutputType | null
  }

  type GetEngagementRuleGroupByPayload<T extends EngagementRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EngagementRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EngagementRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EngagementRuleGroupByOutputType[P]>
            : GetScalarType<T[P], EngagementRuleGroupByOutputType[P]>
        }
      >
    >


  export type EngagementRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    triggerEventType?: boolean
    triggerEventSubtype?: boolean
    conditionExpr?: boolean
    scheduleMode?: boolean
    delaySeconds?: boolean
    actionType?: boolean
    actionPayload?: boolean
    priority?: boolean
    cooldownSeconds?: boolean
    idempotencyWindow?: boolean
    maxExecutionsPerDay?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
    ruleRuns?: boolean | EngagementRule$ruleRunsArgs<ExtArgs>
    _count?: boolean | EngagementRuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["engagementRule"]>

  export type EngagementRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    triggerEventType?: boolean
    triggerEventSubtype?: boolean
    conditionExpr?: boolean
    scheduleMode?: boolean
    delaySeconds?: boolean
    actionType?: boolean
    actionPayload?: boolean
    priority?: boolean
    cooldownSeconds?: boolean
    idempotencyWindow?: boolean
    maxExecutionsPerDay?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["engagementRule"]>

  export type EngagementRuleSelectScalar = {
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    triggerEventType?: boolean
    triggerEventSubtype?: boolean
    conditionExpr?: boolean
    scheduleMode?: boolean
    delaySeconds?: boolean
    actionType?: boolean
    actionPayload?: boolean
    priority?: boolean
    cooldownSeconds?: boolean
    idempotencyWindow?: boolean
    maxExecutionsPerDay?: boolean
    effectiveFrom?: boolean
    effectiveTo?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }

  export type EngagementRuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ruleRuns?: boolean | EngagementRule$ruleRunsArgs<ExtArgs>
    _count?: boolean | EngagementRuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EngagementRuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EngagementRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EngagementRule"
    objects: {
      ruleRuns: Prisma.$EngagementRuleRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      code: string
      name: string
      description: string | null
      category: string
      triggerEventType: string
      triggerEventSubtype: string | null
      conditionExpr: Prisma.JsonValue
      scheduleMode: string
      delaySeconds: number | null
      actionType: string
      actionPayload: Prisma.JsonValue
      priority: number
      cooldownSeconds: number | null
      idempotencyWindow: number | null
      maxExecutionsPerDay: number | null
      effectiveFrom: Date | null
      effectiveTo: Date | null
      isActive: boolean
      createdAt: Date
      createdBy: string
      updatedAt: Date
      updatedBy: string | null
      deletedAt: Date | null
      deletedBy: string | null
    }, ExtArgs["result"]["engagementRule"]>
    composites: {}
  }

  type EngagementRuleGetPayload<S extends boolean | null | undefined | EngagementRuleDefaultArgs> = $Result.GetResult<Prisma.$EngagementRulePayload, S>

  type EngagementRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EngagementRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EngagementRuleCountAggregateInputType | true
    }

  export interface EngagementRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EngagementRule'], meta: { name: 'EngagementRule' } }
    /**
     * Find zero or one EngagementRule that matches the filter.
     * @param {EngagementRuleFindUniqueArgs} args - Arguments to find a EngagementRule
     * @example
     * // Get one EngagementRule
     * const engagementRule = await prisma.engagementRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EngagementRuleFindUniqueArgs>(args: SelectSubset<T, EngagementRuleFindUniqueArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EngagementRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EngagementRuleFindUniqueOrThrowArgs} args - Arguments to find a EngagementRule
     * @example
     * // Get one EngagementRule
     * const engagementRule = await prisma.engagementRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EngagementRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, EngagementRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EngagementRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleFindFirstArgs} args - Arguments to find a EngagementRule
     * @example
     * // Get one EngagementRule
     * const engagementRule = await prisma.engagementRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EngagementRuleFindFirstArgs>(args?: SelectSubset<T, EngagementRuleFindFirstArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EngagementRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleFindFirstOrThrowArgs} args - Arguments to find a EngagementRule
     * @example
     * // Get one EngagementRule
     * const engagementRule = await prisma.engagementRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EngagementRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, EngagementRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EngagementRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EngagementRules
     * const engagementRules = await prisma.engagementRule.findMany()
     * 
     * // Get first 10 EngagementRules
     * const engagementRules = await prisma.engagementRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const engagementRuleWithIdOnly = await prisma.engagementRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EngagementRuleFindManyArgs>(args?: SelectSubset<T, EngagementRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EngagementRule.
     * @param {EngagementRuleCreateArgs} args - Arguments to create a EngagementRule.
     * @example
     * // Create one EngagementRule
     * const EngagementRule = await prisma.engagementRule.create({
     *   data: {
     *     // ... data to create a EngagementRule
     *   }
     * })
     * 
     */
    create<T extends EngagementRuleCreateArgs>(args: SelectSubset<T, EngagementRuleCreateArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EngagementRules.
     * @param {EngagementRuleCreateManyArgs} args - Arguments to create many EngagementRules.
     * @example
     * // Create many EngagementRules
     * const engagementRule = await prisma.engagementRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EngagementRuleCreateManyArgs>(args?: SelectSubset<T, EngagementRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EngagementRules and returns the data saved in the database.
     * @param {EngagementRuleCreateManyAndReturnArgs} args - Arguments to create many EngagementRules.
     * @example
     * // Create many EngagementRules
     * const engagementRule = await prisma.engagementRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EngagementRules and only return the `id`
     * const engagementRuleWithIdOnly = await prisma.engagementRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EngagementRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, EngagementRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EngagementRule.
     * @param {EngagementRuleDeleteArgs} args - Arguments to delete one EngagementRule.
     * @example
     * // Delete one EngagementRule
     * const EngagementRule = await prisma.engagementRule.delete({
     *   where: {
     *     // ... filter to delete one EngagementRule
     *   }
     * })
     * 
     */
    delete<T extends EngagementRuleDeleteArgs>(args: SelectSubset<T, EngagementRuleDeleteArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EngagementRule.
     * @param {EngagementRuleUpdateArgs} args - Arguments to update one EngagementRule.
     * @example
     * // Update one EngagementRule
     * const engagementRule = await prisma.engagementRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EngagementRuleUpdateArgs>(args: SelectSubset<T, EngagementRuleUpdateArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EngagementRules.
     * @param {EngagementRuleDeleteManyArgs} args - Arguments to filter EngagementRules to delete.
     * @example
     * // Delete a few EngagementRules
     * const { count } = await prisma.engagementRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EngagementRuleDeleteManyArgs>(args?: SelectSubset<T, EngagementRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EngagementRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EngagementRules
     * const engagementRule = await prisma.engagementRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EngagementRuleUpdateManyArgs>(args: SelectSubset<T, EngagementRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EngagementRule.
     * @param {EngagementRuleUpsertArgs} args - Arguments to update or create a EngagementRule.
     * @example
     * // Update or create a EngagementRule
     * const engagementRule = await prisma.engagementRule.upsert({
     *   create: {
     *     // ... data to create a EngagementRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EngagementRule we want to update
     *   }
     * })
     */
    upsert<T extends EngagementRuleUpsertArgs>(args: SelectSubset<T, EngagementRuleUpsertArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EngagementRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleCountArgs} args - Arguments to filter EngagementRules to count.
     * @example
     * // Count the number of EngagementRules
     * const count = await prisma.engagementRule.count({
     *   where: {
     *     // ... the filter for the EngagementRules we want to count
     *   }
     * })
    **/
    count<T extends EngagementRuleCountArgs>(
      args?: Subset<T, EngagementRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EngagementRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EngagementRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EngagementRuleAggregateArgs>(args: Subset<T, EngagementRuleAggregateArgs>): Prisma.PrismaPromise<GetEngagementRuleAggregateType<T>>

    /**
     * Group by EngagementRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleGroupByArgs} args - Group by arguments.
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
      T extends EngagementRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EngagementRuleGroupByArgs['orderBy'] }
        : { orderBy?: EngagementRuleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EngagementRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEngagementRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EngagementRule model
   */
  readonly fields: EngagementRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EngagementRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EngagementRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ruleRuns<T extends EngagementRule$ruleRunsArgs<ExtArgs> = {}>(args?: Subset<T, EngagementRule$ruleRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the EngagementRule model
   */ 
  interface EngagementRuleFieldRefs {
    readonly id: FieldRef<"EngagementRule", 'String'>
    readonly tenantId: FieldRef<"EngagementRule", 'String'>
    readonly code: FieldRef<"EngagementRule", 'String'>
    readonly name: FieldRef<"EngagementRule", 'String'>
    readonly description: FieldRef<"EngagementRule", 'String'>
    readonly category: FieldRef<"EngagementRule", 'String'>
    readonly triggerEventType: FieldRef<"EngagementRule", 'String'>
    readonly triggerEventSubtype: FieldRef<"EngagementRule", 'String'>
    readonly conditionExpr: FieldRef<"EngagementRule", 'Json'>
    readonly scheduleMode: FieldRef<"EngagementRule", 'String'>
    readonly delaySeconds: FieldRef<"EngagementRule", 'Int'>
    readonly actionType: FieldRef<"EngagementRule", 'String'>
    readonly actionPayload: FieldRef<"EngagementRule", 'Json'>
    readonly priority: FieldRef<"EngagementRule", 'Int'>
    readonly cooldownSeconds: FieldRef<"EngagementRule", 'Int'>
    readonly idempotencyWindow: FieldRef<"EngagementRule", 'Int'>
    readonly maxExecutionsPerDay: FieldRef<"EngagementRule", 'Int'>
    readonly effectiveFrom: FieldRef<"EngagementRule", 'DateTime'>
    readonly effectiveTo: FieldRef<"EngagementRule", 'DateTime'>
    readonly isActive: FieldRef<"EngagementRule", 'Boolean'>
    readonly createdAt: FieldRef<"EngagementRule", 'DateTime'>
    readonly createdBy: FieldRef<"EngagementRule", 'String'>
    readonly updatedAt: FieldRef<"EngagementRule", 'DateTime'>
    readonly updatedBy: FieldRef<"EngagementRule", 'String'>
    readonly deletedAt: FieldRef<"EngagementRule", 'DateTime'>
    readonly deletedBy: FieldRef<"EngagementRule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EngagementRule findUnique
   */
  export type EngagementRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRule to fetch.
     */
    where: EngagementRuleWhereUniqueInput
  }

  /**
   * EngagementRule findUniqueOrThrow
   */
  export type EngagementRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRule to fetch.
     */
    where: EngagementRuleWhereUniqueInput
  }

  /**
   * EngagementRule findFirst
   */
  export type EngagementRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRule to fetch.
     */
    where?: EngagementRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRules to fetch.
     */
    orderBy?: EngagementRuleOrderByWithRelationInput | EngagementRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EngagementRules.
     */
    cursor?: EngagementRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EngagementRules.
     */
    distinct?: EngagementRuleScalarFieldEnum | EngagementRuleScalarFieldEnum[]
  }

  /**
   * EngagementRule findFirstOrThrow
   */
  export type EngagementRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRule to fetch.
     */
    where?: EngagementRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRules to fetch.
     */
    orderBy?: EngagementRuleOrderByWithRelationInput | EngagementRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EngagementRules.
     */
    cursor?: EngagementRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EngagementRules.
     */
    distinct?: EngagementRuleScalarFieldEnum | EngagementRuleScalarFieldEnum[]
  }

  /**
   * EngagementRule findMany
   */
  export type EngagementRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRules to fetch.
     */
    where?: EngagementRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRules to fetch.
     */
    orderBy?: EngagementRuleOrderByWithRelationInput | EngagementRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EngagementRules.
     */
    cursor?: EngagementRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRules.
     */
    skip?: number
    distinct?: EngagementRuleScalarFieldEnum | EngagementRuleScalarFieldEnum[]
  }

  /**
   * EngagementRule create
   */
  export type EngagementRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * The data needed to create a EngagementRule.
     */
    data: XOR<EngagementRuleCreateInput, EngagementRuleUncheckedCreateInput>
  }

  /**
   * EngagementRule createMany
   */
  export type EngagementRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EngagementRules.
     */
    data: EngagementRuleCreateManyInput | EngagementRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EngagementRule createManyAndReturn
   */
  export type EngagementRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EngagementRules.
     */
    data: EngagementRuleCreateManyInput | EngagementRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EngagementRule update
   */
  export type EngagementRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * The data needed to update a EngagementRule.
     */
    data: XOR<EngagementRuleUpdateInput, EngagementRuleUncheckedUpdateInput>
    /**
     * Choose, which EngagementRule to update.
     */
    where: EngagementRuleWhereUniqueInput
  }

  /**
   * EngagementRule updateMany
   */
  export type EngagementRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EngagementRules.
     */
    data: XOR<EngagementRuleUpdateManyMutationInput, EngagementRuleUncheckedUpdateManyInput>
    /**
     * Filter which EngagementRules to update
     */
    where?: EngagementRuleWhereInput
  }

  /**
   * EngagementRule upsert
   */
  export type EngagementRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * The filter to search for the EngagementRule to update in case it exists.
     */
    where: EngagementRuleWhereUniqueInput
    /**
     * In case the EngagementRule found by the `where` argument doesn't exist, create a new EngagementRule with this data.
     */
    create: XOR<EngagementRuleCreateInput, EngagementRuleUncheckedCreateInput>
    /**
     * In case the EngagementRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EngagementRuleUpdateInput, EngagementRuleUncheckedUpdateInput>
  }

  /**
   * EngagementRule delete
   */
  export type EngagementRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
    /**
     * Filter which EngagementRule to delete.
     */
    where: EngagementRuleWhereUniqueInput
  }

  /**
   * EngagementRule deleteMany
   */
  export type EngagementRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EngagementRules to delete
     */
    where?: EngagementRuleWhereInput
  }

  /**
   * EngagementRule.ruleRuns
   */
  export type EngagementRule$ruleRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    where?: EngagementRuleRunWhereInput
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    cursor?: EngagementRuleRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EngagementRuleRunScalarFieldEnum | EngagementRuleRunScalarFieldEnum[]
  }

  /**
   * EngagementRule without action
   */
  export type EngagementRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRule
     */
    select?: EngagementRuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleInclude<ExtArgs> | null
  }


  /**
   * Model CommunicationTemplate
   */

  export type AggregateCommunicationTemplate = {
    _count: CommunicationTemplateCountAggregateOutputType | null
    _avg: CommunicationTemplateAvgAggregateOutputType | null
    _sum: CommunicationTemplateSumAggregateOutputType | null
    _min: CommunicationTemplateMinAggregateOutputType | null
    _max: CommunicationTemplateMaxAggregateOutputType | null
  }

  export type CommunicationTemplateAvgAggregateOutputType = {
    version: number | null
  }

  export type CommunicationTemplateSumAggregateOutputType = {
    version: number | null
  }

  export type CommunicationTemplateMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    category: string | null
    channel: string | null
    language: string | null
    subject: string | null
    body: string | null
    approvalStatus: string | null
    approvedAt: Date | null
    approvedBy: string | null
    rejectionReason: string | null
    version: number | null
    contentHash: string | null
    isActive: boolean | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type CommunicationTemplateMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    code: string | null
    name: string | null
    description: string | null
    category: string | null
    channel: string | null
    language: string | null
    subject: string | null
    body: string | null
    approvalStatus: string | null
    approvedAt: Date | null
    approvedBy: string | null
    rejectionReason: string | null
    version: number | null
    contentHash: string | null
    isActive: boolean | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
  }

  export type CommunicationTemplateCountAggregateOutputType = {
    id: number
    tenantId: number
    code: number
    name: number
    description: number
    category: number
    channel: number
    language: number
    subject: number
    body: number
    variablesSchema: number
    approvalStatus: number
    approvedAt: number
    approvedBy: number
    rejectionReason: number
    version: number
    contentHash: number
    isActive: number
    createdAt: number
    createdBy: number
    updatedAt: number
    updatedBy: number
    deletedAt: number
    deletedBy: number
    _all: number
  }


  export type CommunicationTemplateAvgAggregateInputType = {
    version?: true
  }

  export type CommunicationTemplateSumAggregateInputType = {
    version?: true
  }

  export type CommunicationTemplateMinAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    channel?: true
    language?: true
    subject?: true
    body?: true
    approvalStatus?: true
    approvedAt?: true
    approvedBy?: true
    rejectionReason?: true
    version?: true
    contentHash?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type CommunicationTemplateMaxAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    channel?: true
    language?: true
    subject?: true
    body?: true
    approvalStatus?: true
    approvedAt?: true
    approvedBy?: true
    rejectionReason?: true
    version?: true
    contentHash?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
  }

  export type CommunicationTemplateCountAggregateInputType = {
    id?: true
    tenantId?: true
    code?: true
    name?: true
    description?: true
    category?: true
    channel?: true
    language?: true
    subject?: true
    body?: true
    variablesSchema?: true
    approvalStatus?: true
    approvedAt?: true
    approvedBy?: true
    rejectionReason?: true
    version?: true
    contentHash?: true
    isActive?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    deletedAt?: true
    deletedBy?: true
    _all?: true
  }

  export type CommunicationTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunicationTemplate to aggregate.
     */
    where?: CommunicationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationTemplates to fetch.
     */
    orderBy?: CommunicationTemplateOrderByWithRelationInput | CommunicationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommunicationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CommunicationTemplates
    **/
    _count?: true | CommunicationTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommunicationTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommunicationTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommunicationTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommunicationTemplateMaxAggregateInputType
  }

  export type GetCommunicationTemplateAggregateType<T extends CommunicationTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateCommunicationTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommunicationTemplate[P]>
      : GetScalarType<T[P], AggregateCommunicationTemplate[P]>
  }




  export type CommunicationTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommunicationTemplateWhereInput
    orderBy?: CommunicationTemplateOrderByWithAggregationInput | CommunicationTemplateOrderByWithAggregationInput[]
    by: CommunicationTemplateScalarFieldEnum[] | CommunicationTemplateScalarFieldEnum
    having?: CommunicationTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommunicationTemplateCountAggregateInputType | true
    _avg?: CommunicationTemplateAvgAggregateInputType
    _sum?: CommunicationTemplateSumAggregateInputType
    _min?: CommunicationTemplateMinAggregateInputType
    _max?: CommunicationTemplateMaxAggregateInputType
  }

  export type CommunicationTemplateGroupByOutputType = {
    id: string
    tenantId: string
    code: string
    name: string
    description: string | null
    category: string
    channel: string
    language: string
    subject: string | null
    body: string
    variablesSchema: JsonValue
    approvalStatus: string
    approvedAt: Date | null
    approvedBy: string | null
    rejectionReason: string | null
    version: number
    contentHash: string
    isActive: boolean
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string | null
    deletedAt: Date | null
    deletedBy: string | null
    _count: CommunicationTemplateCountAggregateOutputType | null
    _avg: CommunicationTemplateAvgAggregateOutputType | null
    _sum: CommunicationTemplateSumAggregateOutputType | null
    _min: CommunicationTemplateMinAggregateOutputType | null
    _max: CommunicationTemplateMaxAggregateOutputType | null
  }

  type GetCommunicationTemplateGroupByPayload<T extends CommunicationTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommunicationTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommunicationTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommunicationTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], CommunicationTemplateGroupByOutputType[P]>
        }
      >
    >


  export type CommunicationTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channel?: boolean
    language?: boolean
    subject?: boolean
    body?: boolean
    variablesSchema?: boolean
    approvalStatus?: boolean
    approvedAt?: boolean
    approvedBy?: boolean
    rejectionReason?: boolean
    version?: boolean
    contentHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
    messages?: boolean | CommunicationTemplate$messagesArgs<ExtArgs>
    _count?: boolean | CommunicationTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["communicationTemplate"]>

  export type CommunicationTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channel?: boolean
    language?: boolean
    subject?: boolean
    body?: boolean
    variablesSchema?: boolean
    approvalStatus?: boolean
    approvedAt?: boolean
    approvedBy?: boolean
    rejectionReason?: boolean
    version?: boolean
    contentHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }, ExtArgs["result"]["communicationTemplate"]>

  export type CommunicationTemplateSelectScalar = {
    id?: boolean
    tenantId?: boolean
    code?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    channel?: boolean
    language?: boolean
    subject?: boolean
    body?: boolean
    variablesSchema?: boolean
    approvalStatus?: boolean
    approvedAt?: boolean
    approvedBy?: boolean
    rejectionReason?: boolean
    version?: boolean
    contentHash?: boolean
    isActive?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    deletedAt?: boolean
    deletedBy?: boolean
  }

  export type CommunicationTemplateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | CommunicationTemplate$messagesArgs<ExtArgs>
    _count?: boolean | CommunicationTemplateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommunicationTemplateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CommunicationTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CommunicationTemplate"
    objects: {
      messages: Prisma.$PatientMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      code: string
      name: string
      description: string | null
      category: string
      channel: string
      language: string
      subject: string | null
      body: string
      variablesSchema: Prisma.JsonValue
      approvalStatus: string
      approvedAt: Date | null
      approvedBy: string | null
      rejectionReason: string | null
      version: number
      contentHash: string
      isActive: boolean
      createdAt: Date
      createdBy: string
      updatedAt: Date
      updatedBy: string | null
      deletedAt: Date | null
      deletedBy: string | null
    }, ExtArgs["result"]["communicationTemplate"]>
    composites: {}
  }

  type CommunicationTemplateGetPayload<S extends boolean | null | undefined | CommunicationTemplateDefaultArgs> = $Result.GetResult<Prisma.$CommunicationTemplatePayload, S>

  type CommunicationTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommunicationTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommunicationTemplateCountAggregateInputType | true
    }

  export interface CommunicationTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CommunicationTemplate'], meta: { name: 'CommunicationTemplate' } }
    /**
     * Find zero or one CommunicationTemplate that matches the filter.
     * @param {CommunicationTemplateFindUniqueArgs} args - Arguments to find a CommunicationTemplate
     * @example
     * // Get one CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommunicationTemplateFindUniqueArgs>(args: SelectSubset<T, CommunicationTemplateFindUniqueArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CommunicationTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommunicationTemplateFindUniqueOrThrowArgs} args - Arguments to find a CommunicationTemplate
     * @example
     * // Get one CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommunicationTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, CommunicationTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CommunicationTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateFindFirstArgs} args - Arguments to find a CommunicationTemplate
     * @example
     * // Get one CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommunicationTemplateFindFirstArgs>(args?: SelectSubset<T, CommunicationTemplateFindFirstArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CommunicationTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateFindFirstOrThrowArgs} args - Arguments to find a CommunicationTemplate
     * @example
     * // Get one CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommunicationTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, CommunicationTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CommunicationTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CommunicationTemplates
     * const communicationTemplates = await prisma.communicationTemplate.findMany()
     * 
     * // Get first 10 CommunicationTemplates
     * const communicationTemplates = await prisma.communicationTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const communicationTemplateWithIdOnly = await prisma.communicationTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommunicationTemplateFindManyArgs>(args?: SelectSubset<T, CommunicationTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CommunicationTemplate.
     * @param {CommunicationTemplateCreateArgs} args - Arguments to create a CommunicationTemplate.
     * @example
     * // Create one CommunicationTemplate
     * const CommunicationTemplate = await prisma.communicationTemplate.create({
     *   data: {
     *     // ... data to create a CommunicationTemplate
     *   }
     * })
     * 
     */
    create<T extends CommunicationTemplateCreateArgs>(args: SelectSubset<T, CommunicationTemplateCreateArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CommunicationTemplates.
     * @param {CommunicationTemplateCreateManyArgs} args - Arguments to create many CommunicationTemplates.
     * @example
     * // Create many CommunicationTemplates
     * const communicationTemplate = await prisma.communicationTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommunicationTemplateCreateManyArgs>(args?: SelectSubset<T, CommunicationTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CommunicationTemplates and returns the data saved in the database.
     * @param {CommunicationTemplateCreateManyAndReturnArgs} args - Arguments to create many CommunicationTemplates.
     * @example
     * // Create many CommunicationTemplates
     * const communicationTemplate = await prisma.communicationTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CommunicationTemplates and only return the `id`
     * const communicationTemplateWithIdOnly = await prisma.communicationTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommunicationTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, CommunicationTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CommunicationTemplate.
     * @param {CommunicationTemplateDeleteArgs} args - Arguments to delete one CommunicationTemplate.
     * @example
     * // Delete one CommunicationTemplate
     * const CommunicationTemplate = await prisma.communicationTemplate.delete({
     *   where: {
     *     // ... filter to delete one CommunicationTemplate
     *   }
     * })
     * 
     */
    delete<T extends CommunicationTemplateDeleteArgs>(args: SelectSubset<T, CommunicationTemplateDeleteArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CommunicationTemplate.
     * @param {CommunicationTemplateUpdateArgs} args - Arguments to update one CommunicationTemplate.
     * @example
     * // Update one CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommunicationTemplateUpdateArgs>(args: SelectSubset<T, CommunicationTemplateUpdateArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CommunicationTemplates.
     * @param {CommunicationTemplateDeleteManyArgs} args - Arguments to filter CommunicationTemplates to delete.
     * @example
     * // Delete a few CommunicationTemplates
     * const { count } = await prisma.communicationTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommunicationTemplateDeleteManyArgs>(args?: SelectSubset<T, CommunicationTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CommunicationTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CommunicationTemplates
     * const communicationTemplate = await prisma.communicationTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommunicationTemplateUpdateManyArgs>(args: SelectSubset<T, CommunicationTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CommunicationTemplate.
     * @param {CommunicationTemplateUpsertArgs} args - Arguments to update or create a CommunicationTemplate.
     * @example
     * // Update or create a CommunicationTemplate
     * const communicationTemplate = await prisma.communicationTemplate.upsert({
     *   create: {
     *     // ... data to create a CommunicationTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CommunicationTemplate we want to update
     *   }
     * })
     */
    upsert<T extends CommunicationTemplateUpsertArgs>(args: SelectSubset<T, CommunicationTemplateUpsertArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CommunicationTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateCountArgs} args - Arguments to filter CommunicationTemplates to count.
     * @example
     * // Count the number of CommunicationTemplates
     * const count = await prisma.communicationTemplate.count({
     *   where: {
     *     // ... the filter for the CommunicationTemplates we want to count
     *   }
     * })
    **/
    count<T extends CommunicationTemplateCountArgs>(
      args?: Subset<T, CommunicationTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommunicationTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CommunicationTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CommunicationTemplateAggregateArgs>(args: Subset<T, CommunicationTemplateAggregateArgs>): Prisma.PrismaPromise<GetCommunicationTemplateAggregateType<T>>

    /**
     * Group by CommunicationTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommunicationTemplateGroupByArgs} args - Group by arguments.
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
      T extends CommunicationTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommunicationTemplateGroupByArgs['orderBy'] }
        : { orderBy?: CommunicationTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CommunicationTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommunicationTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CommunicationTemplate model
   */
  readonly fields: CommunicationTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CommunicationTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommunicationTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends CommunicationTemplate$messagesArgs<ExtArgs> = {}>(args?: Subset<T, CommunicationTemplate$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the CommunicationTemplate model
   */ 
  interface CommunicationTemplateFieldRefs {
    readonly id: FieldRef<"CommunicationTemplate", 'String'>
    readonly tenantId: FieldRef<"CommunicationTemplate", 'String'>
    readonly code: FieldRef<"CommunicationTemplate", 'String'>
    readonly name: FieldRef<"CommunicationTemplate", 'String'>
    readonly description: FieldRef<"CommunicationTemplate", 'String'>
    readonly category: FieldRef<"CommunicationTemplate", 'String'>
    readonly channel: FieldRef<"CommunicationTemplate", 'String'>
    readonly language: FieldRef<"CommunicationTemplate", 'String'>
    readonly subject: FieldRef<"CommunicationTemplate", 'String'>
    readonly body: FieldRef<"CommunicationTemplate", 'String'>
    readonly variablesSchema: FieldRef<"CommunicationTemplate", 'Json'>
    readonly approvalStatus: FieldRef<"CommunicationTemplate", 'String'>
    readonly approvedAt: FieldRef<"CommunicationTemplate", 'DateTime'>
    readonly approvedBy: FieldRef<"CommunicationTemplate", 'String'>
    readonly rejectionReason: FieldRef<"CommunicationTemplate", 'String'>
    readonly version: FieldRef<"CommunicationTemplate", 'Int'>
    readonly contentHash: FieldRef<"CommunicationTemplate", 'String'>
    readonly isActive: FieldRef<"CommunicationTemplate", 'Boolean'>
    readonly createdAt: FieldRef<"CommunicationTemplate", 'DateTime'>
    readonly createdBy: FieldRef<"CommunicationTemplate", 'String'>
    readonly updatedAt: FieldRef<"CommunicationTemplate", 'DateTime'>
    readonly updatedBy: FieldRef<"CommunicationTemplate", 'String'>
    readonly deletedAt: FieldRef<"CommunicationTemplate", 'DateTime'>
    readonly deletedBy: FieldRef<"CommunicationTemplate", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CommunicationTemplate findUnique
   */
  export type CommunicationTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CommunicationTemplate to fetch.
     */
    where: CommunicationTemplateWhereUniqueInput
  }

  /**
   * CommunicationTemplate findUniqueOrThrow
   */
  export type CommunicationTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CommunicationTemplate to fetch.
     */
    where: CommunicationTemplateWhereUniqueInput
  }

  /**
   * CommunicationTemplate findFirst
   */
  export type CommunicationTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CommunicationTemplate to fetch.
     */
    where?: CommunicationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationTemplates to fetch.
     */
    orderBy?: CommunicationTemplateOrderByWithRelationInput | CommunicationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunicationTemplates.
     */
    cursor?: CommunicationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunicationTemplates.
     */
    distinct?: CommunicationTemplateScalarFieldEnum | CommunicationTemplateScalarFieldEnum[]
  }

  /**
   * CommunicationTemplate findFirstOrThrow
   */
  export type CommunicationTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CommunicationTemplate to fetch.
     */
    where?: CommunicationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationTemplates to fetch.
     */
    orderBy?: CommunicationTemplateOrderByWithRelationInput | CommunicationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CommunicationTemplates.
     */
    cursor?: CommunicationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CommunicationTemplates.
     */
    distinct?: CommunicationTemplateScalarFieldEnum | CommunicationTemplateScalarFieldEnum[]
  }

  /**
   * CommunicationTemplate findMany
   */
  export type CommunicationTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter, which CommunicationTemplates to fetch.
     */
    where?: CommunicationTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CommunicationTemplates to fetch.
     */
    orderBy?: CommunicationTemplateOrderByWithRelationInput | CommunicationTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CommunicationTemplates.
     */
    cursor?: CommunicationTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CommunicationTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CommunicationTemplates.
     */
    skip?: number
    distinct?: CommunicationTemplateScalarFieldEnum | CommunicationTemplateScalarFieldEnum[]
  }

  /**
   * CommunicationTemplate create
   */
  export type CommunicationTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * The data needed to create a CommunicationTemplate.
     */
    data: XOR<CommunicationTemplateCreateInput, CommunicationTemplateUncheckedCreateInput>
  }

  /**
   * CommunicationTemplate createMany
   */
  export type CommunicationTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CommunicationTemplates.
     */
    data: CommunicationTemplateCreateManyInput | CommunicationTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunicationTemplate createManyAndReturn
   */
  export type CommunicationTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CommunicationTemplates.
     */
    data: CommunicationTemplateCreateManyInput | CommunicationTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CommunicationTemplate update
   */
  export type CommunicationTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * The data needed to update a CommunicationTemplate.
     */
    data: XOR<CommunicationTemplateUpdateInput, CommunicationTemplateUncheckedUpdateInput>
    /**
     * Choose, which CommunicationTemplate to update.
     */
    where: CommunicationTemplateWhereUniqueInput
  }

  /**
   * CommunicationTemplate updateMany
   */
  export type CommunicationTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CommunicationTemplates.
     */
    data: XOR<CommunicationTemplateUpdateManyMutationInput, CommunicationTemplateUncheckedUpdateManyInput>
    /**
     * Filter which CommunicationTemplates to update
     */
    where?: CommunicationTemplateWhereInput
  }

  /**
   * CommunicationTemplate upsert
   */
  export type CommunicationTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * The filter to search for the CommunicationTemplate to update in case it exists.
     */
    where: CommunicationTemplateWhereUniqueInput
    /**
     * In case the CommunicationTemplate found by the `where` argument doesn't exist, create a new CommunicationTemplate with this data.
     */
    create: XOR<CommunicationTemplateCreateInput, CommunicationTemplateUncheckedCreateInput>
    /**
     * In case the CommunicationTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommunicationTemplateUpdateInput, CommunicationTemplateUncheckedUpdateInput>
  }

  /**
   * CommunicationTemplate delete
   */
  export type CommunicationTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    /**
     * Filter which CommunicationTemplate to delete.
     */
    where: CommunicationTemplateWhereUniqueInput
  }

  /**
   * CommunicationTemplate deleteMany
   */
  export type CommunicationTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CommunicationTemplates to delete
     */
    where?: CommunicationTemplateWhereInput
  }

  /**
   * CommunicationTemplate.messages
   */
  export type CommunicationTemplate$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    where?: PatientMessageWhereInput
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    cursor?: PatientMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientMessageScalarFieldEnum | PatientMessageScalarFieldEnum[]
  }

  /**
   * CommunicationTemplate without action
   */
  export type CommunicationTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
  }


  /**
   * Model PatientPreference
   */

  export type AggregatePatientPreference = {
    _count: PatientPreferenceCountAggregateOutputType | null
    _min: PatientPreferenceMinAggregateOutputType | null
    _max: PatientPreferenceMaxAggregateOutputType | null
  }

  export type PatientPreferenceMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    preferredLanguage: string | null
    quietHoursStart: string | null
    quietHoursEnd: string | null
    timezone: string | null
    dndEnabled: boolean | null
    dndUntil: Date | null
    smsOptOut: boolean | null
    emailOptOut: boolean | null
    whatsappOptOut: boolean | null
    guardianName: string | null
    guardianContact: string | null
    guardianRef: string | null
    notes: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientPreferenceMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    preferredLanguage: string | null
    quietHoursStart: string | null
    quietHoursEnd: string | null
    timezone: string | null
    dndEnabled: boolean | null
    dndUntil: Date | null
    smsOptOut: boolean | null
    emailOptOut: boolean | null
    whatsappOptOut: boolean | null
    guardianName: string | null
    guardianContact: string | null
    guardianRef: string | null
    notes: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientPreferenceCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    preferredLanguage: number
    channelOrder: number
    quietHoursStart: number
    quietHoursEnd: number
    timezone: number
    dndEnabled: number
    dndUntil: number
    smsOptOut: number
    emailOptOut: number
    whatsappOptOut: number
    guardianName: number
    guardianContact: number
    guardianRef: number
    notes: number
    createdAt: number
    createdBy: number
    updatedAt: number
    updatedBy: number
    _all: number
  }


  export type PatientPreferenceMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    preferredLanguage?: true
    quietHoursStart?: true
    quietHoursEnd?: true
    timezone?: true
    dndEnabled?: true
    dndUntil?: true
    smsOptOut?: true
    emailOptOut?: true
    whatsappOptOut?: true
    guardianName?: true
    guardianContact?: true
    guardianRef?: true
    notes?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientPreferenceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    preferredLanguage?: true
    quietHoursStart?: true
    quietHoursEnd?: true
    timezone?: true
    dndEnabled?: true
    dndUntil?: true
    smsOptOut?: true
    emailOptOut?: true
    whatsappOptOut?: true
    guardianName?: true
    guardianContact?: true
    guardianRef?: true
    notes?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientPreferenceCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    preferredLanguage?: true
    channelOrder?: true
    quietHoursStart?: true
    quietHoursEnd?: true
    timezone?: true
    dndEnabled?: true
    dndUntil?: true
    smsOptOut?: true
    emailOptOut?: true
    whatsappOptOut?: true
    guardianName?: true
    guardianContact?: true
    guardianRef?: true
    notes?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    _all?: true
  }

  export type PatientPreferenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientPreference to aggregate.
     */
    where?: PatientPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientPreferences to fetch.
     */
    orderBy?: PatientPreferenceOrderByWithRelationInput | PatientPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientPreferences
    **/
    _count?: true | PatientPreferenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientPreferenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientPreferenceMaxAggregateInputType
  }

  export type GetPatientPreferenceAggregateType<T extends PatientPreferenceAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientPreference]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientPreference[P]>
      : GetScalarType<T[P], AggregatePatientPreference[P]>
  }




  export type PatientPreferenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientPreferenceWhereInput
    orderBy?: PatientPreferenceOrderByWithAggregationInput | PatientPreferenceOrderByWithAggregationInput[]
    by: PatientPreferenceScalarFieldEnum[] | PatientPreferenceScalarFieldEnum
    having?: PatientPreferenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientPreferenceCountAggregateInputType | true
    _min?: PatientPreferenceMinAggregateInputType
    _max?: PatientPreferenceMaxAggregateInputType
  }

  export type PatientPreferenceGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    preferredLanguage: string
    channelOrder: JsonValue
    quietHoursStart: string | null
    quietHoursEnd: string | null
    timezone: string
    dndEnabled: boolean
    dndUntil: Date | null
    smsOptOut: boolean
    emailOptOut: boolean
    whatsappOptOut: boolean
    guardianName: string | null
    guardianContact: string | null
    guardianRef: string | null
    notes: string | null
    createdAt: Date
    createdBy: string | null
    updatedAt: Date
    updatedBy: string | null
    _count: PatientPreferenceCountAggregateOutputType | null
    _min: PatientPreferenceMinAggregateOutputType | null
    _max: PatientPreferenceMaxAggregateOutputType | null
  }

  type GetPatientPreferenceGroupByPayload<T extends PatientPreferenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientPreferenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientPreferenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientPreferenceGroupByOutputType[P]>
            : GetScalarType<T[P], PatientPreferenceGroupByOutputType[P]>
        }
      >
    >


  export type PatientPreferenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    preferredLanguage?: boolean
    channelOrder?: boolean
    quietHoursStart?: boolean
    quietHoursEnd?: boolean
    timezone?: boolean
    dndEnabled?: boolean
    dndUntil?: boolean
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: boolean
    guardianContact?: boolean
    guardianRef?: boolean
    notes?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["patientPreference"]>

  export type PatientPreferenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    preferredLanguage?: boolean
    channelOrder?: boolean
    quietHoursStart?: boolean
    quietHoursEnd?: boolean
    timezone?: boolean
    dndEnabled?: boolean
    dndUntil?: boolean
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: boolean
    guardianContact?: boolean
    guardianRef?: boolean
    notes?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["patientPreference"]>

  export type PatientPreferenceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    preferredLanguage?: boolean
    channelOrder?: boolean
    quietHoursStart?: boolean
    quietHoursEnd?: boolean
    timezone?: boolean
    dndEnabled?: boolean
    dndUntil?: boolean
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: boolean
    guardianContact?: boolean
    guardianRef?: boolean
    notes?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }


  export type $PatientPreferencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientPreference"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      preferredLanguage: string
      channelOrder: Prisma.JsonValue
      quietHoursStart: string | null
      quietHoursEnd: string | null
      timezone: string
      dndEnabled: boolean
      dndUntil: Date | null
      smsOptOut: boolean
      emailOptOut: boolean
      whatsappOptOut: boolean
      guardianName: string | null
      guardianContact: string | null
      guardianRef: string | null
      notes: string | null
      createdAt: Date
      createdBy: string | null
      updatedAt: Date
      updatedBy: string | null
    }, ExtArgs["result"]["patientPreference"]>
    composites: {}
  }

  type PatientPreferenceGetPayload<S extends boolean | null | undefined | PatientPreferenceDefaultArgs> = $Result.GetResult<Prisma.$PatientPreferencePayload, S>

  type PatientPreferenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientPreferenceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientPreferenceCountAggregateInputType | true
    }

  export interface PatientPreferenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientPreference'], meta: { name: 'PatientPreference' } }
    /**
     * Find zero or one PatientPreference that matches the filter.
     * @param {PatientPreferenceFindUniqueArgs} args - Arguments to find a PatientPreference
     * @example
     * // Get one PatientPreference
     * const patientPreference = await prisma.patientPreference.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientPreferenceFindUniqueArgs>(args: SelectSubset<T, PatientPreferenceFindUniqueArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientPreference that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientPreferenceFindUniqueOrThrowArgs} args - Arguments to find a PatientPreference
     * @example
     * // Get one PatientPreference
     * const patientPreference = await prisma.patientPreference.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientPreferenceFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientPreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientPreference that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceFindFirstArgs} args - Arguments to find a PatientPreference
     * @example
     * // Get one PatientPreference
     * const patientPreference = await prisma.patientPreference.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientPreferenceFindFirstArgs>(args?: SelectSubset<T, PatientPreferenceFindFirstArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientPreference that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceFindFirstOrThrowArgs} args - Arguments to find a PatientPreference
     * @example
     * // Get one PatientPreference
     * const patientPreference = await prisma.patientPreference.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientPreferenceFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientPreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientPreferences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientPreferences
     * const patientPreferences = await prisma.patientPreference.findMany()
     * 
     * // Get first 10 PatientPreferences
     * const patientPreferences = await prisma.patientPreference.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientPreferenceWithIdOnly = await prisma.patientPreference.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientPreferenceFindManyArgs>(args?: SelectSubset<T, PatientPreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientPreference.
     * @param {PatientPreferenceCreateArgs} args - Arguments to create a PatientPreference.
     * @example
     * // Create one PatientPreference
     * const PatientPreference = await prisma.patientPreference.create({
     *   data: {
     *     // ... data to create a PatientPreference
     *   }
     * })
     * 
     */
    create<T extends PatientPreferenceCreateArgs>(args: SelectSubset<T, PatientPreferenceCreateArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientPreferences.
     * @param {PatientPreferenceCreateManyArgs} args - Arguments to create many PatientPreferences.
     * @example
     * // Create many PatientPreferences
     * const patientPreference = await prisma.patientPreference.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientPreferenceCreateManyArgs>(args?: SelectSubset<T, PatientPreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientPreferences and returns the data saved in the database.
     * @param {PatientPreferenceCreateManyAndReturnArgs} args - Arguments to create many PatientPreferences.
     * @example
     * // Create many PatientPreferences
     * const patientPreference = await prisma.patientPreference.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientPreferences and only return the `id`
     * const patientPreferenceWithIdOnly = await prisma.patientPreference.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientPreferenceCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientPreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientPreference.
     * @param {PatientPreferenceDeleteArgs} args - Arguments to delete one PatientPreference.
     * @example
     * // Delete one PatientPreference
     * const PatientPreference = await prisma.patientPreference.delete({
     *   where: {
     *     // ... filter to delete one PatientPreference
     *   }
     * })
     * 
     */
    delete<T extends PatientPreferenceDeleteArgs>(args: SelectSubset<T, PatientPreferenceDeleteArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientPreference.
     * @param {PatientPreferenceUpdateArgs} args - Arguments to update one PatientPreference.
     * @example
     * // Update one PatientPreference
     * const patientPreference = await prisma.patientPreference.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientPreferenceUpdateArgs>(args: SelectSubset<T, PatientPreferenceUpdateArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientPreferences.
     * @param {PatientPreferenceDeleteManyArgs} args - Arguments to filter PatientPreferences to delete.
     * @example
     * // Delete a few PatientPreferences
     * const { count } = await prisma.patientPreference.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientPreferenceDeleteManyArgs>(args?: SelectSubset<T, PatientPreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientPreferences
     * const patientPreference = await prisma.patientPreference.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientPreferenceUpdateManyArgs>(args: SelectSubset<T, PatientPreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientPreference.
     * @param {PatientPreferenceUpsertArgs} args - Arguments to update or create a PatientPreference.
     * @example
     * // Update or create a PatientPreference
     * const patientPreference = await prisma.patientPreference.upsert({
     *   create: {
     *     // ... data to create a PatientPreference
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientPreference we want to update
     *   }
     * })
     */
    upsert<T extends PatientPreferenceUpsertArgs>(args: SelectSubset<T, PatientPreferenceUpsertArgs<ExtArgs>>): Prisma__PatientPreferenceClient<$Result.GetResult<Prisma.$PatientPreferencePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientPreferences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceCountArgs} args - Arguments to filter PatientPreferences to count.
     * @example
     * // Count the number of PatientPreferences
     * const count = await prisma.patientPreference.count({
     *   where: {
     *     // ... the filter for the PatientPreferences we want to count
     *   }
     * })
    **/
    count<T extends PatientPreferenceCountArgs>(
      args?: Subset<T, PatientPreferenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientPreferenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientPreferenceAggregateArgs>(args: Subset<T, PatientPreferenceAggregateArgs>): Prisma.PrismaPromise<GetPatientPreferenceAggregateType<T>>

    /**
     * Group by PatientPreference.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientPreferenceGroupByArgs} args - Group by arguments.
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
      T extends PatientPreferenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientPreferenceGroupByArgs['orderBy'] }
        : { orderBy?: PatientPreferenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientPreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientPreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientPreference model
   */
  readonly fields: PatientPreferenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientPreference.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientPreferenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PatientPreference model
   */ 
  interface PatientPreferenceFieldRefs {
    readonly id: FieldRef<"PatientPreference", 'String'>
    readonly tenantId: FieldRef<"PatientPreference", 'String'>
    readonly patientId: FieldRef<"PatientPreference", 'String'>
    readonly preferredLanguage: FieldRef<"PatientPreference", 'String'>
    readonly channelOrder: FieldRef<"PatientPreference", 'Json'>
    readonly quietHoursStart: FieldRef<"PatientPreference", 'String'>
    readonly quietHoursEnd: FieldRef<"PatientPreference", 'String'>
    readonly timezone: FieldRef<"PatientPreference", 'String'>
    readonly dndEnabled: FieldRef<"PatientPreference", 'Boolean'>
    readonly dndUntil: FieldRef<"PatientPreference", 'DateTime'>
    readonly smsOptOut: FieldRef<"PatientPreference", 'Boolean'>
    readonly emailOptOut: FieldRef<"PatientPreference", 'Boolean'>
    readonly whatsappOptOut: FieldRef<"PatientPreference", 'Boolean'>
    readonly guardianName: FieldRef<"PatientPreference", 'String'>
    readonly guardianContact: FieldRef<"PatientPreference", 'String'>
    readonly guardianRef: FieldRef<"PatientPreference", 'String'>
    readonly notes: FieldRef<"PatientPreference", 'String'>
    readonly createdAt: FieldRef<"PatientPreference", 'DateTime'>
    readonly createdBy: FieldRef<"PatientPreference", 'String'>
    readonly updatedAt: FieldRef<"PatientPreference", 'DateTime'>
    readonly updatedBy: FieldRef<"PatientPreference", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientPreference findUnique
   */
  export type PatientPreferenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which PatientPreference to fetch.
     */
    where: PatientPreferenceWhereUniqueInput
  }

  /**
   * PatientPreference findUniqueOrThrow
   */
  export type PatientPreferenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which PatientPreference to fetch.
     */
    where: PatientPreferenceWhereUniqueInput
  }

  /**
   * PatientPreference findFirst
   */
  export type PatientPreferenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which PatientPreference to fetch.
     */
    where?: PatientPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientPreferences to fetch.
     */
    orderBy?: PatientPreferenceOrderByWithRelationInput | PatientPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientPreferences.
     */
    cursor?: PatientPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientPreferences.
     */
    distinct?: PatientPreferenceScalarFieldEnum | PatientPreferenceScalarFieldEnum[]
  }

  /**
   * PatientPreference findFirstOrThrow
   */
  export type PatientPreferenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which PatientPreference to fetch.
     */
    where?: PatientPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientPreferences to fetch.
     */
    orderBy?: PatientPreferenceOrderByWithRelationInput | PatientPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientPreferences.
     */
    cursor?: PatientPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientPreferences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientPreferences.
     */
    distinct?: PatientPreferenceScalarFieldEnum | PatientPreferenceScalarFieldEnum[]
  }

  /**
   * PatientPreference findMany
   */
  export type PatientPreferenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter, which PatientPreferences to fetch.
     */
    where?: PatientPreferenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientPreferences to fetch.
     */
    orderBy?: PatientPreferenceOrderByWithRelationInput | PatientPreferenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientPreferences.
     */
    cursor?: PatientPreferenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientPreferences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientPreferences.
     */
    skip?: number
    distinct?: PatientPreferenceScalarFieldEnum | PatientPreferenceScalarFieldEnum[]
  }

  /**
   * PatientPreference create
   */
  export type PatientPreferenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * The data needed to create a PatientPreference.
     */
    data: XOR<PatientPreferenceCreateInput, PatientPreferenceUncheckedCreateInput>
  }

  /**
   * PatientPreference createMany
   */
  export type PatientPreferenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientPreferences.
     */
    data: PatientPreferenceCreateManyInput | PatientPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientPreference createManyAndReturn
   */
  export type PatientPreferenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientPreferences.
     */
    data: PatientPreferenceCreateManyInput | PatientPreferenceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientPreference update
   */
  export type PatientPreferenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * The data needed to update a PatientPreference.
     */
    data: XOR<PatientPreferenceUpdateInput, PatientPreferenceUncheckedUpdateInput>
    /**
     * Choose, which PatientPreference to update.
     */
    where: PatientPreferenceWhereUniqueInput
  }

  /**
   * PatientPreference updateMany
   */
  export type PatientPreferenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientPreferences.
     */
    data: XOR<PatientPreferenceUpdateManyMutationInput, PatientPreferenceUncheckedUpdateManyInput>
    /**
     * Filter which PatientPreferences to update
     */
    where?: PatientPreferenceWhereInput
  }

  /**
   * PatientPreference upsert
   */
  export type PatientPreferenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * The filter to search for the PatientPreference to update in case it exists.
     */
    where: PatientPreferenceWhereUniqueInput
    /**
     * In case the PatientPreference found by the `where` argument doesn't exist, create a new PatientPreference with this data.
     */
    create: XOR<PatientPreferenceCreateInput, PatientPreferenceUncheckedCreateInput>
    /**
     * In case the PatientPreference was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientPreferenceUpdateInput, PatientPreferenceUncheckedUpdateInput>
  }

  /**
   * PatientPreference delete
   */
  export type PatientPreferenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
    /**
     * Filter which PatientPreference to delete.
     */
    where: PatientPreferenceWhereUniqueInput
  }

  /**
   * PatientPreference deleteMany
   */
  export type PatientPreferenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientPreferences to delete
     */
    where?: PatientPreferenceWhereInput
  }

  /**
   * PatientPreference without action
   */
  export type PatientPreferenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientPreference
     */
    select?: PatientPreferenceSelect<ExtArgs> | null
  }


  /**
   * Model PatientMessage
   */

  export type AggregatePatientMessage = {
    _count: PatientMessageCountAggregateOutputType | null
    _avg: PatientMessageAvgAggregateOutputType | null
    _sum: PatientMessageSumAggregateOutputType | null
    _min: PatientMessageMinAggregateOutputType | null
    _max: PatientMessageMaxAggregateOutputType | null
  }

  export type PatientMessageAvgAggregateOutputType = {
    templateVersion: number | null
    retryCount: number | null
  }

  export type PatientMessageSumAggregateOutputType = {
    templateVersion: number | null
    retryCount: number | null
  }

  export type PatientMessageMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientRef: string | null
    direction: string | null
    channel: string | null
    toAddress: string | null
    fromAddress: string | null
    templateId: string | null
    templateVersion: number | null
    subject: string | null
    bodyRendered: string | null
    purpose: string | null
    consentReferenceId: string | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    providerMessageId: string | null
    status: string | null
    statusReason: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    failedAt: Date | null
    retryCount: number | null
    idempotencyKey: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientMessageMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientRef: string | null
    direction: string | null
    channel: string | null
    toAddress: string | null
    fromAddress: string | null
    templateId: string | null
    templateVersion: number | null
    subject: string | null
    bodyRendered: string | null
    purpose: string | null
    consentReferenceId: string | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    providerMessageId: string | null
    status: string | null
    statusReason: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    failedAt: Date | null
    retryCount: number | null
    idempotencyKey: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientMessageCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    patientDisplayName: number
    patientGender: number
    patientRef: number
    direction: number
    channel: number
    toAddress: number
    fromAddress: number
    templateId: number
    templateVersion: number
    subject: number
    bodyRendered: number
    variablesUsed: number
    purpose: number
    consentReferenceId: number
    relatedEventId: number
    relatedEntityType: number
    relatedEntityId: number
    providerMessageId: number
    status: number
    statusReason: number
    sentAt: number
    deliveredAt: number
    readAt: number
    failedAt: number
    retryCount: number
    idempotencyKey: number
    createdAt: number
    createdBy: number
    updatedAt: number
    updatedBy: number
    _all: number
  }


  export type PatientMessageAvgAggregateInputType = {
    templateVersion?: true
    retryCount?: true
  }

  export type PatientMessageSumAggregateInputType = {
    templateVersion?: true
    retryCount?: true
  }

  export type PatientMessageMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientRef?: true
    direction?: true
    channel?: true
    toAddress?: true
    fromAddress?: true
    templateId?: true
    templateVersion?: true
    subject?: true
    bodyRendered?: true
    purpose?: true
    consentReferenceId?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    providerMessageId?: true
    status?: true
    statusReason?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    failedAt?: true
    retryCount?: true
    idempotencyKey?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientMessageMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientRef?: true
    direction?: true
    channel?: true
    toAddress?: true
    fromAddress?: true
    templateId?: true
    templateVersion?: true
    subject?: true
    bodyRendered?: true
    purpose?: true
    consentReferenceId?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    providerMessageId?: true
    status?: true
    statusReason?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    failedAt?: true
    retryCount?: true
    idempotencyKey?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientMessageCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientRef?: true
    direction?: true
    channel?: true
    toAddress?: true
    fromAddress?: true
    templateId?: true
    templateVersion?: true
    subject?: true
    bodyRendered?: true
    variablesUsed?: true
    purpose?: true
    consentReferenceId?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    providerMessageId?: true
    status?: true
    statusReason?: true
    sentAt?: true
    deliveredAt?: true
    readAt?: true
    failedAt?: true
    retryCount?: true
    idempotencyKey?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    _all?: true
  }

  export type PatientMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientMessage to aggregate.
     */
    where?: PatientMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMessages to fetch.
     */
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientMessages
    **/
    _count?: true | PatientMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMessageMaxAggregateInputType
  }

  export type GetPatientMessageAggregateType<T extends PatientMessageAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientMessage[P]>
      : GetScalarType<T[P], AggregatePatientMessage[P]>
  }




  export type PatientMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientMessageWhereInput
    orderBy?: PatientMessageOrderByWithAggregationInput | PatientMessageOrderByWithAggregationInput[]
    by: PatientMessageScalarFieldEnum[] | PatientMessageScalarFieldEnum
    having?: PatientMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientMessageCountAggregateInputType | true
    _avg?: PatientMessageAvgAggregateInputType
    _sum?: PatientMessageSumAggregateInputType
    _min?: PatientMessageMinAggregateInputType
    _max?: PatientMessageMaxAggregateInputType
  }

  export type PatientMessageGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    patientDisplayName: string | null
    patientGender: string | null
    patientRef: string | null
    direction: string
    channel: string
    toAddress: string | null
    fromAddress: string | null
    templateId: string | null
    templateVersion: number | null
    subject: string | null
    bodyRendered: string
    variablesUsed: JsonValue | null
    purpose: string
    consentReferenceId: string | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    providerMessageId: string | null
    status: string
    statusReason: string | null
    sentAt: Date | null
    deliveredAt: Date | null
    readAt: Date | null
    failedAt: Date | null
    retryCount: number
    idempotencyKey: string
    createdAt: Date
    createdBy: string | null
    updatedAt: Date
    updatedBy: string | null
    _count: PatientMessageCountAggregateOutputType | null
    _avg: PatientMessageAvgAggregateOutputType | null
    _sum: PatientMessageSumAggregateOutputType | null
    _min: PatientMessageMinAggregateOutputType | null
    _max: PatientMessageMaxAggregateOutputType | null
  }

  type GetPatientMessageGroupByPayload<T extends PatientMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientMessageGroupByOutputType[P]>
            : GetScalarType<T[P], PatientMessageGroupByOutputType[P]>
        }
      >
    >


  export type PatientMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientRef?: boolean
    direction?: boolean
    channel?: boolean
    toAddress?: boolean
    fromAddress?: boolean
    templateId?: boolean
    templateVersion?: boolean
    subject?: boolean
    bodyRendered?: boolean
    variablesUsed?: boolean
    purpose?: boolean
    consentReferenceId?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    providerMessageId?: boolean
    status?: boolean
    statusReason?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    failedAt?: boolean
    retryCount?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    template?: boolean | PatientMessage$templateArgs<ExtArgs>
    relatedEvent?: boolean | PatientMessage$relatedEventArgs<ExtArgs>
  }, ExtArgs["result"]["patientMessage"]>

  export type PatientMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientRef?: boolean
    direction?: boolean
    channel?: boolean
    toAddress?: boolean
    fromAddress?: boolean
    templateId?: boolean
    templateVersion?: boolean
    subject?: boolean
    bodyRendered?: boolean
    variablesUsed?: boolean
    purpose?: boolean
    consentReferenceId?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    providerMessageId?: boolean
    status?: boolean
    statusReason?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    failedAt?: boolean
    retryCount?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    template?: boolean | PatientMessage$templateArgs<ExtArgs>
    relatedEvent?: boolean | PatientMessage$relatedEventArgs<ExtArgs>
  }, ExtArgs["result"]["patientMessage"]>

  export type PatientMessageSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientRef?: boolean
    direction?: boolean
    channel?: boolean
    toAddress?: boolean
    fromAddress?: boolean
    templateId?: boolean
    templateVersion?: boolean
    subject?: boolean
    bodyRendered?: boolean
    variablesUsed?: boolean
    purpose?: boolean
    consentReferenceId?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    providerMessageId?: boolean
    status?: boolean
    statusReason?: boolean
    sentAt?: boolean
    deliveredAt?: boolean
    readAt?: boolean
    failedAt?: boolean
    retryCount?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }

  export type PatientMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | PatientMessage$templateArgs<ExtArgs>
    relatedEvent?: boolean | PatientMessage$relatedEventArgs<ExtArgs>
  }
  export type PatientMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    template?: boolean | PatientMessage$templateArgs<ExtArgs>
    relatedEvent?: boolean | PatientMessage$relatedEventArgs<ExtArgs>
  }

  export type $PatientMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientMessage"
    objects: {
      template: Prisma.$CommunicationTemplatePayload<ExtArgs> | null
      relatedEvent: Prisma.$PatientEngagementEventPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      patientDisplayName: string | null
      patientGender: string | null
      patientRef: string | null
      direction: string
      channel: string
      toAddress: string | null
      fromAddress: string | null
      templateId: string | null
      templateVersion: number | null
      subject: string | null
      bodyRendered: string
      variablesUsed: Prisma.JsonValue | null
      purpose: string
      consentReferenceId: string | null
      relatedEventId: string | null
      relatedEntityType: string | null
      relatedEntityId: string | null
      providerMessageId: string | null
      status: string
      statusReason: string | null
      sentAt: Date | null
      deliveredAt: Date | null
      readAt: Date | null
      failedAt: Date | null
      retryCount: number
      idempotencyKey: string
      createdAt: Date
      createdBy: string | null
      updatedAt: Date
      updatedBy: string | null
    }, ExtArgs["result"]["patientMessage"]>
    composites: {}
  }

  type PatientMessageGetPayload<S extends boolean | null | undefined | PatientMessageDefaultArgs> = $Result.GetResult<Prisma.$PatientMessagePayload, S>

  type PatientMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientMessageCountAggregateInputType | true
    }

  export interface PatientMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientMessage'], meta: { name: 'PatientMessage' } }
    /**
     * Find zero or one PatientMessage that matches the filter.
     * @param {PatientMessageFindUniqueArgs} args - Arguments to find a PatientMessage
     * @example
     * // Get one PatientMessage
     * const patientMessage = await prisma.patientMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientMessageFindUniqueArgs>(args: SelectSubset<T, PatientMessageFindUniqueArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientMessageFindUniqueOrThrowArgs} args - Arguments to find a PatientMessage
     * @example
     * // Get one PatientMessage
     * const patientMessage = await prisma.patientMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageFindFirstArgs} args - Arguments to find a PatientMessage
     * @example
     * // Get one PatientMessage
     * const patientMessage = await prisma.patientMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientMessageFindFirstArgs>(args?: SelectSubset<T, PatientMessageFindFirstArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageFindFirstOrThrowArgs} args - Arguments to find a PatientMessage
     * @example
     * // Get one PatientMessage
     * const patientMessage = await prisma.patientMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientMessages
     * const patientMessages = await prisma.patientMessage.findMany()
     * 
     * // Get first 10 PatientMessages
     * const patientMessages = await prisma.patientMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientMessageWithIdOnly = await prisma.patientMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientMessageFindManyArgs>(args?: SelectSubset<T, PatientMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientMessage.
     * @param {PatientMessageCreateArgs} args - Arguments to create a PatientMessage.
     * @example
     * // Create one PatientMessage
     * const PatientMessage = await prisma.patientMessage.create({
     *   data: {
     *     // ... data to create a PatientMessage
     *   }
     * })
     * 
     */
    create<T extends PatientMessageCreateArgs>(args: SelectSubset<T, PatientMessageCreateArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientMessages.
     * @param {PatientMessageCreateManyArgs} args - Arguments to create many PatientMessages.
     * @example
     * // Create many PatientMessages
     * const patientMessage = await prisma.patientMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientMessageCreateManyArgs>(args?: SelectSubset<T, PatientMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientMessages and returns the data saved in the database.
     * @param {PatientMessageCreateManyAndReturnArgs} args - Arguments to create many PatientMessages.
     * @example
     * // Create many PatientMessages
     * const patientMessage = await prisma.patientMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientMessages and only return the `id`
     * const patientMessageWithIdOnly = await prisma.patientMessage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientMessage.
     * @param {PatientMessageDeleteArgs} args - Arguments to delete one PatientMessage.
     * @example
     * // Delete one PatientMessage
     * const PatientMessage = await prisma.patientMessage.delete({
     *   where: {
     *     // ... filter to delete one PatientMessage
     *   }
     * })
     * 
     */
    delete<T extends PatientMessageDeleteArgs>(args: SelectSubset<T, PatientMessageDeleteArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientMessage.
     * @param {PatientMessageUpdateArgs} args - Arguments to update one PatientMessage.
     * @example
     * // Update one PatientMessage
     * const patientMessage = await prisma.patientMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientMessageUpdateArgs>(args: SelectSubset<T, PatientMessageUpdateArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientMessages.
     * @param {PatientMessageDeleteManyArgs} args - Arguments to filter PatientMessages to delete.
     * @example
     * // Delete a few PatientMessages
     * const { count } = await prisma.patientMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientMessageDeleteManyArgs>(args?: SelectSubset<T, PatientMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientMessages
     * const patientMessage = await prisma.patientMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientMessageUpdateManyArgs>(args: SelectSubset<T, PatientMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientMessage.
     * @param {PatientMessageUpsertArgs} args - Arguments to update or create a PatientMessage.
     * @example
     * // Update or create a PatientMessage
     * const patientMessage = await prisma.patientMessage.upsert({
     *   create: {
     *     // ... data to create a PatientMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientMessage we want to update
     *   }
     * })
     */
    upsert<T extends PatientMessageUpsertArgs>(args: SelectSubset<T, PatientMessageUpsertArgs<ExtArgs>>): Prisma__PatientMessageClient<$Result.GetResult<Prisma.$PatientMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageCountArgs} args - Arguments to filter PatientMessages to count.
     * @example
     * // Count the number of PatientMessages
     * const count = await prisma.patientMessage.count({
     *   where: {
     *     // ... the filter for the PatientMessages we want to count
     *   }
     * })
    **/
    count<T extends PatientMessageCountArgs>(
      args?: Subset<T, PatientMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientMessageAggregateArgs>(args: Subset<T, PatientMessageAggregateArgs>): Prisma.PrismaPromise<GetPatientMessageAggregateType<T>>

    /**
     * Group by PatientMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientMessageGroupByArgs} args - Group by arguments.
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
      T extends PatientMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientMessageGroupByArgs['orderBy'] }
        : { orderBy?: PatientMessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientMessage model
   */
  readonly fields: PatientMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    template<T extends PatientMessage$templateArgs<ExtArgs> = {}>(args?: Subset<T, PatientMessage$templateArgs<ExtArgs>>): Prisma__CommunicationTemplateClient<$Result.GetResult<Prisma.$CommunicationTemplatePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    relatedEvent<T extends PatientMessage$relatedEventArgs<ExtArgs> = {}>(args?: Subset<T, PatientMessage$relatedEventArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the PatientMessage model
   */ 
  interface PatientMessageFieldRefs {
    readonly id: FieldRef<"PatientMessage", 'String'>
    readonly tenantId: FieldRef<"PatientMessage", 'String'>
    readonly patientId: FieldRef<"PatientMessage", 'String'>
    readonly patientDisplayName: FieldRef<"PatientMessage", 'String'>
    readonly patientGender: FieldRef<"PatientMessage", 'String'>
    readonly patientRef: FieldRef<"PatientMessage", 'String'>
    readonly direction: FieldRef<"PatientMessage", 'String'>
    readonly channel: FieldRef<"PatientMessage", 'String'>
    readonly toAddress: FieldRef<"PatientMessage", 'String'>
    readonly fromAddress: FieldRef<"PatientMessage", 'String'>
    readonly templateId: FieldRef<"PatientMessage", 'String'>
    readonly templateVersion: FieldRef<"PatientMessage", 'Int'>
    readonly subject: FieldRef<"PatientMessage", 'String'>
    readonly bodyRendered: FieldRef<"PatientMessage", 'String'>
    readonly variablesUsed: FieldRef<"PatientMessage", 'Json'>
    readonly purpose: FieldRef<"PatientMessage", 'String'>
    readonly consentReferenceId: FieldRef<"PatientMessage", 'String'>
    readonly relatedEventId: FieldRef<"PatientMessage", 'String'>
    readonly relatedEntityType: FieldRef<"PatientMessage", 'String'>
    readonly relatedEntityId: FieldRef<"PatientMessage", 'String'>
    readonly providerMessageId: FieldRef<"PatientMessage", 'String'>
    readonly status: FieldRef<"PatientMessage", 'String'>
    readonly statusReason: FieldRef<"PatientMessage", 'String'>
    readonly sentAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly deliveredAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly readAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly failedAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly retryCount: FieldRef<"PatientMessage", 'Int'>
    readonly idempotencyKey: FieldRef<"PatientMessage", 'String'>
    readonly createdAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly createdBy: FieldRef<"PatientMessage", 'String'>
    readonly updatedAt: FieldRef<"PatientMessage", 'DateTime'>
    readonly updatedBy: FieldRef<"PatientMessage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientMessage findUnique
   */
  export type PatientMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter, which PatientMessage to fetch.
     */
    where: PatientMessageWhereUniqueInput
  }

  /**
   * PatientMessage findUniqueOrThrow
   */
  export type PatientMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter, which PatientMessage to fetch.
     */
    where: PatientMessageWhereUniqueInput
  }

  /**
   * PatientMessage findFirst
   */
  export type PatientMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter, which PatientMessage to fetch.
     */
    where?: PatientMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMessages to fetch.
     */
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientMessages.
     */
    cursor?: PatientMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientMessages.
     */
    distinct?: PatientMessageScalarFieldEnum | PatientMessageScalarFieldEnum[]
  }

  /**
   * PatientMessage findFirstOrThrow
   */
  export type PatientMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter, which PatientMessage to fetch.
     */
    where?: PatientMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMessages to fetch.
     */
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientMessages.
     */
    cursor?: PatientMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientMessages.
     */
    distinct?: PatientMessageScalarFieldEnum | PatientMessageScalarFieldEnum[]
  }

  /**
   * PatientMessage findMany
   */
  export type PatientMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter, which PatientMessages to fetch.
     */
    where?: PatientMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientMessages to fetch.
     */
    orderBy?: PatientMessageOrderByWithRelationInput | PatientMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientMessages.
     */
    cursor?: PatientMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientMessages.
     */
    skip?: number
    distinct?: PatientMessageScalarFieldEnum | PatientMessageScalarFieldEnum[]
  }

  /**
   * PatientMessage create
   */
  export type PatientMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientMessage.
     */
    data: XOR<PatientMessageCreateInput, PatientMessageUncheckedCreateInput>
  }

  /**
   * PatientMessage createMany
   */
  export type PatientMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientMessages.
     */
    data: PatientMessageCreateManyInput | PatientMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientMessage createManyAndReturn
   */
  export type PatientMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientMessages.
     */
    data: PatientMessageCreateManyInput | PatientMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientMessage update
   */
  export type PatientMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientMessage.
     */
    data: XOR<PatientMessageUpdateInput, PatientMessageUncheckedUpdateInput>
    /**
     * Choose, which PatientMessage to update.
     */
    where: PatientMessageWhereUniqueInput
  }

  /**
   * PatientMessage updateMany
   */
  export type PatientMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientMessages.
     */
    data: XOR<PatientMessageUpdateManyMutationInput, PatientMessageUncheckedUpdateManyInput>
    /**
     * Filter which PatientMessages to update
     */
    where?: PatientMessageWhereInput
  }

  /**
   * PatientMessage upsert
   */
  export type PatientMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientMessage to update in case it exists.
     */
    where: PatientMessageWhereUniqueInput
    /**
     * In case the PatientMessage found by the `where` argument doesn't exist, create a new PatientMessage with this data.
     */
    create: XOR<PatientMessageCreateInput, PatientMessageUncheckedCreateInput>
    /**
     * In case the PatientMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientMessageUpdateInput, PatientMessageUncheckedUpdateInput>
  }

  /**
   * PatientMessage delete
   */
  export type PatientMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
    /**
     * Filter which PatientMessage to delete.
     */
    where: PatientMessageWhereUniqueInput
  }

  /**
   * PatientMessage deleteMany
   */
  export type PatientMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientMessages to delete
     */
    where?: PatientMessageWhereInput
  }

  /**
   * PatientMessage.template
   */
  export type PatientMessage$templateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommunicationTemplate
     */
    select?: CommunicationTemplateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommunicationTemplateInclude<ExtArgs> | null
    where?: CommunicationTemplateWhereInput
  }

  /**
   * PatientMessage.relatedEvent
   */
  export type PatientMessage$relatedEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    where?: PatientEngagementEventWhereInput
  }

  /**
   * PatientMessage without action
   */
  export type PatientMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientMessage
     */
    select?: PatientMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientMessageInclude<ExtArgs> | null
  }


  /**
   * Model PatientTask
   */

  export type AggregatePatientTask = {
    _count: PatientTaskCountAggregateOutputType | null
    _avg: PatientTaskAvgAggregateOutputType | null
    _sum: PatientTaskSumAggregateOutputType | null
    _min: PatientTaskMinAggregateOutputType | null
    _max: PatientTaskMaxAggregateOutputType | null
  }

  export type PatientTaskAvgAggregateOutputType = {
    patientAgeYearsAtEvent: number | null
    priority: number | null
  }

  export type PatientTaskSumAggregateOutputType = {
    patientAgeYearsAtEvent: number | null
    priority: number | null
  }

  export type PatientTaskMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    taskType: string | null
    title: string | null
    description: string | null
    priority: number | null
    assignedToUserId: string | null
    assignedToRole: string | null
    status: string | null
    dueAt: Date | null
    completedAt: Date | null
    cancelledAt: Date | null
    outcome: string | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientTaskMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    patientDisplayName: string | null
    patientGender: string | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    taskType: string | null
    title: string | null
    description: string | null
    priority: number | null
    assignedToUserId: string | null
    assignedToRole: string | null
    status: string | null
    dueAt: Date | null
    completedAt: Date | null
    cancelledAt: Date | null
    outcome: string | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    createdAt: Date | null
    createdBy: string | null
    updatedAt: Date | null
    updatedBy: string | null
  }

  export type PatientTaskCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    patientDisplayName: number
    patientGender: number
    patientAgeYearsAtEvent: number
    patientRef: number
    taskType: number
    title: number
    description: number
    priority: number
    assignedToUserId: number
    assignedToRole: number
    status: number
    dueAt: number
    completedAt: number
    cancelledAt: number
    outcome: number
    outcomeDetails: number
    relatedEventId: number
    relatedEntityType: number
    relatedEntityId: number
    createdAt: number
    createdBy: number
    updatedAt: number
    updatedBy: number
    _all: number
  }


  export type PatientTaskAvgAggregateInputType = {
    patientAgeYearsAtEvent?: true
    priority?: true
  }

  export type PatientTaskSumAggregateInputType = {
    patientAgeYearsAtEvent?: true
    priority?: true
  }

  export type PatientTaskMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    taskType?: true
    title?: true
    description?: true
    priority?: true
    assignedToUserId?: true
    assignedToRole?: true
    status?: true
    dueAt?: true
    completedAt?: true
    cancelledAt?: true
    outcome?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientTaskMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    taskType?: true
    title?: true
    description?: true
    priority?: true
    assignedToUserId?: true
    assignedToRole?: true
    status?: true
    dueAt?: true
    completedAt?: true
    cancelledAt?: true
    outcome?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
  }

  export type PatientTaskCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    patientDisplayName?: true
    patientGender?: true
    patientAgeYearsAtEvent?: true
    patientRef?: true
    taskType?: true
    title?: true
    description?: true
    priority?: true
    assignedToUserId?: true
    assignedToRole?: true
    status?: true
    dueAt?: true
    completedAt?: true
    cancelledAt?: true
    outcome?: true
    outcomeDetails?: true
    relatedEventId?: true
    relatedEntityType?: true
    relatedEntityId?: true
    createdAt?: true
    createdBy?: true
    updatedAt?: true
    updatedBy?: true
    _all?: true
  }

  export type PatientTaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientTask to aggregate.
     */
    where?: PatientTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTasks to fetch.
     */
    orderBy?: PatientTaskOrderByWithRelationInput | PatientTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientTasks
    **/
    _count?: true | PatientTaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientTaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientTaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientTaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientTaskMaxAggregateInputType
  }

  export type GetPatientTaskAggregateType<T extends PatientTaskAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientTask[P]>
      : GetScalarType<T[P], AggregatePatientTask[P]>
  }




  export type PatientTaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientTaskWhereInput
    orderBy?: PatientTaskOrderByWithAggregationInput | PatientTaskOrderByWithAggregationInput[]
    by: PatientTaskScalarFieldEnum[] | PatientTaskScalarFieldEnum
    having?: PatientTaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientTaskCountAggregateInputType | true
    _avg?: PatientTaskAvgAggregateInputType
    _sum?: PatientTaskSumAggregateInputType
    _min?: PatientTaskMinAggregateInputType
    _max?: PatientTaskMaxAggregateInputType
  }

  export type PatientTaskGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    patientDisplayName: string | null
    patientGender: string | null
    patientAgeYearsAtEvent: number | null
    patientRef: string | null
    taskType: string
    title: string
    description: string | null
    priority: number
    assignedToUserId: string | null
    assignedToRole: string | null
    status: string
    dueAt: Date | null
    completedAt: Date | null
    cancelledAt: Date | null
    outcome: string | null
    outcomeDetails: JsonValue | null
    relatedEventId: string | null
    relatedEntityType: string | null
    relatedEntityId: string | null
    createdAt: Date
    createdBy: string | null
    updatedAt: Date
    updatedBy: string | null
    _count: PatientTaskCountAggregateOutputType | null
    _avg: PatientTaskAvgAggregateOutputType | null
    _sum: PatientTaskSumAggregateOutputType | null
    _min: PatientTaskMinAggregateOutputType | null
    _max: PatientTaskMaxAggregateOutputType | null
  }

  type GetPatientTaskGroupByPayload<T extends PatientTaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientTaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientTaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientTaskGroupByOutputType[P]>
            : GetScalarType<T[P], PatientTaskGroupByOutputType[P]>
        }
      >
    >


  export type PatientTaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    taskType?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    assignedToUserId?: boolean
    assignedToRole?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    cancelledAt?: boolean
    outcome?: boolean
    outcomeDetails?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    relatedEvent?: boolean | PatientTask$relatedEventArgs<ExtArgs>
  }, ExtArgs["result"]["patientTask"]>

  export type PatientTaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    taskType?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    assignedToUserId?: boolean
    assignedToRole?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    cancelledAt?: boolean
    outcome?: boolean
    outcomeDetails?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
    relatedEvent?: boolean | PatientTask$relatedEventArgs<ExtArgs>
  }, ExtArgs["result"]["patientTask"]>

  export type PatientTaskSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    patientDisplayName?: boolean
    patientGender?: boolean
    patientAgeYearsAtEvent?: boolean
    patientRef?: boolean
    taskType?: boolean
    title?: boolean
    description?: boolean
    priority?: boolean
    assignedToUserId?: boolean
    assignedToRole?: boolean
    status?: boolean
    dueAt?: boolean
    completedAt?: boolean
    cancelledAt?: boolean
    outcome?: boolean
    outcomeDetails?: boolean
    relatedEventId?: boolean
    relatedEntityType?: boolean
    relatedEntityId?: boolean
    createdAt?: boolean
    createdBy?: boolean
    updatedAt?: boolean
    updatedBy?: boolean
  }

  export type PatientTaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relatedEvent?: boolean | PatientTask$relatedEventArgs<ExtArgs>
  }
  export type PatientTaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relatedEvent?: boolean | PatientTask$relatedEventArgs<ExtArgs>
  }

  export type $PatientTaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientTask"
    objects: {
      relatedEvent: Prisma.$PatientEngagementEventPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      patientDisplayName: string | null
      patientGender: string | null
      patientAgeYearsAtEvent: number | null
      patientRef: string | null
      taskType: string
      title: string
      description: string | null
      priority: number
      assignedToUserId: string | null
      assignedToRole: string | null
      status: string
      dueAt: Date | null
      completedAt: Date | null
      cancelledAt: Date | null
      outcome: string | null
      outcomeDetails: Prisma.JsonValue | null
      relatedEventId: string | null
      relatedEntityType: string | null
      relatedEntityId: string | null
      createdAt: Date
      createdBy: string | null
      updatedAt: Date
      updatedBy: string | null
    }, ExtArgs["result"]["patientTask"]>
    composites: {}
  }

  type PatientTaskGetPayload<S extends boolean | null | undefined | PatientTaskDefaultArgs> = $Result.GetResult<Prisma.$PatientTaskPayload, S>

  type PatientTaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientTaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientTaskCountAggregateInputType | true
    }

  export interface PatientTaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientTask'], meta: { name: 'PatientTask' } }
    /**
     * Find zero or one PatientTask that matches the filter.
     * @param {PatientTaskFindUniqueArgs} args - Arguments to find a PatientTask
     * @example
     * // Get one PatientTask
     * const patientTask = await prisma.patientTask.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientTaskFindUniqueArgs>(args: SelectSubset<T, PatientTaskFindUniqueArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientTask that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientTaskFindUniqueOrThrowArgs} args - Arguments to find a PatientTask
     * @example
     * // Get one PatientTask
     * const patientTask = await prisma.patientTask.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientTaskFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientTask that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskFindFirstArgs} args - Arguments to find a PatientTask
     * @example
     * // Get one PatientTask
     * const patientTask = await prisma.patientTask.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientTaskFindFirstArgs>(args?: SelectSubset<T, PatientTaskFindFirstArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientTask that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskFindFirstOrThrowArgs} args - Arguments to find a PatientTask
     * @example
     * // Get one PatientTask
     * const patientTask = await prisma.patientTask.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientTaskFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientTasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientTasks
     * const patientTasks = await prisma.patientTask.findMany()
     * 
     * // Get first 10 PatientTasks
     * const patientTasks = await prisma.patientTask.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientTaskWithIdOnly = await prisma.patientTask.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientTaskFindManyArgs>(args?: SelectSubset<T, PatientTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientTask.
     * @param {PatientTaskCreateArgs} args - Arguments to create a PatientTask.
     * @example
     * // Create one PatientTask
     * const PatientTask = await prisma.patientTask.create({
     *   data: {
     *     // ... data to create a PatientTask
     *   }
     * })
     * 
     */
    create<T extends PatientTaskCreateArgs>(args: SelectSubset<T, PatientTaskCreateArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientTasks.
     * @param {PatientTaskCreateManyArgs} args - Arguments to create many PatientTasks.
     * @example
     * // Create many PatientTasks
     * const patientTask = await prisma.patientTask.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientTaskCreateManyArgs>(args?: SelectSubset<T, PatientTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientTasks and returns the data saved in the database.
     * @param {PatientTaskCreateManyAndReturnArgs} args - Arguments to create many PatientTasks.
     * @example
     * // Create many PatientTasks
     * const patientTask = await prisma.patientTask.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientTasks and only return the `id`
     * const patientTaskWithIdOnly = await prisma.patientTask.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientTaskCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientTask.
     * @param {PatientTaskDeleteArgs} args - Arguments to delete one PatientTask.
     * @example
     * // Delete one PatientTask
     * const PatientTask = await prisma.patientTask.delete({
     *   where: {
     *     // ... filter to delete one PatientTask
     *   }
     * })
     * 
     */
    delete<T extends PatientTaskDeleteArgs>(args: SelectSubset<T, PatientTaskDeleteArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientTask.
     * @param {PatientTaskUpdateArgs} args - Arguments to update one PatientTask.
     * @example
     * // Update one PatientTask
     * const patientTask = await prisma.patientTask.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientTaskUpdateArgs>(args: SelectSubset<T, PatientTaskUpdateArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientTasks.
     * @param {PatientTaskDeleteManyArgs} args - Arguments to filter PatientTasks to delete.
     * @example
     * // Delete a few PatientTasks
     * const { count } = await prisma.patientTask.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientTaskDeleteManyArgs>(args?: SelectSubset<T, PatientTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientTasks
     * const patientTask = await prisma.patientTask.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientTaskUpdateManyArgs>(args: SelectSubset<T, PatientTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientTask.
     * @param {PatientTaskUpsertArgs} args - Arguments to update or create a PatientTask.
     * @example
     * // Update or create a PatientTask
     * const patientTask = await prisma.patientTask.upsert({
     *   create: {
     *     // ... data to create a PatientTask
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientTask we want to update
     *   }
     * })
     */
    upsert<T extends PatientTaskUpsertArgs>(args: SelectSubset<T, PatientTaskUpsertArgs<ExtArgs>>): Prisma__PatientTaskClient<$Result.GetResult<Prisma.$PatientTaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientTasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskCountArgs} args - Arguments to filter PatientTasks to count.
     * @example
     * // Count the number of PatientTasks
     * const count = await prisma.patientTask.count({
     *   where: {
     *     // ... the filter for the PatientTasks we want to count
     *   }
     * })
    **/
    count<T extends PatientTaskCountArgs>(
      args?: Subset<T, PatientTaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientTaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientTaskAggregateArgs>(args: Subset<T, PatientTaskAggregateArgs>): Prisma.PrismaPromise<GetPatientTaskAggregateType<T>>

    /**
     * Group by PatientTask.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTaskGroupByArgs} args - Group by arguments.
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
      T extends PatientTaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientTaskGroupByArgs['orderBy'] }
        : { orderBy?: PatientTaskGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientTask model
   */
  readonly fields: PatientTaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientTask.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientTaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    relatedEvent<T extends PatientTask$relatedEventArgs<ExtArgs> = {}>(args?: Subset<T, PatientTask$relatedEventArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the PatientTask model
   */ 
  interface PatientTaskFieldRefs {
    readonly id: FieldRef<"PatientTask", 'String'>
    readonly tenantId: FieldRef<"PatientTask", 'String'>
    readonly patientId: FieldRef<"PatientTask", 'String'>
    readonly patientDisplayName: FieldRef<"PatientTask", 'String'>
    readonly patientGender: FieldRef<"PatientTask", 'String'>
    readonly patientAgeYearsAtEvent: FieldRef<"PatientTask", 'Int'>
    readonly patientRef: FieldRef<"PatientTask", 'String'>
    readonly taskType: FieldRef<"PatientTask", 'String'>
    readonly title: FieldRef<"PatientTask", 'String'>
    readonly description: FieldRef<"PatientTask", 'String'>
    readonly priority: FieldRef<"PatientTask", 'Int'>
    readonly assignedToUserId: FieldRef<"PatientTask", 'String'>
    readonly assignedToRole: FieldRef<"PatientTask", 'String'>
    readonly status: FieldRef<"PatientTask", 'String'>
    readonly dueAt: FieldRef<"PatientTask", 'DateTime'>
    readonly completedAt: FieldRef<"PatientTask", 'DateTime'>
    readonly cancelledAt: FieldRef<"PatientTask", 'DateTime'>
    readonly outcome: FieldRef<"PatientTask", 'String'>
    readonly outcomeDetails: FieldRef<"PatientTask", 'Json'>
    readonly relatedEventId: FieldRef<"PatientTask", 'String'>
    readonly relatedEntityType: FieldRef<"PatientTask", 'String'>
    readonly relatedEntityId: FieldRef<"PatientTask", 'String'>
    readonly createdAt: FieldRef<"PatientTask", 'DateTime'>
    readonly createdBy: FieldRef<"PatientTask", 'String'>
    readonly updatedAt: FieldRef<"PatientTask", 'DateTime'>
    readonly updatedBy: FieldRef<"PatientTask", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientTask findUnique
   */
  export type PatientTaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter, which PatientTask to fetch.
     */
    where: PatientTaskWhereUniqueInput
  }

  /**
   * PatientTask findUniqueOrThrow
   */
  export type PatientTaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter, which PatientTask to fetch.
     */
    where: PatientTaskWhereUniqueInput
  }

  /**
   * PatientTask findFirst
   */
  export type PatientTaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter, which PatientTask to fetch.
     */
    where?: PatientTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTasks to fetch.
     */
    orderBy?: PatientTaskOrderByWithRelationInput | PatientTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientTasks.
     */
    cursor?: PatientTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientTasks.
     */
    distinct?: PatientTaskScalarFieldEnum | PatientTaskScalarFieldEnum[]
  }

  /**
   * PatientTask findFirstOrThrow
   */
  export type PatientTaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter, which PatientTask to fetch.
     */
    where?: PatientTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTasks to fetch.
     */
    orderBy?: PatientTaskOrderByWithRelationInput | PatientTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientTasks.
     */
    cursor?: PatientTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientTasks.
     */
    distinct?: PatientTaskScalarFieldEnum | PatientTaskScalarFieldEnum[]
  }

  /**
   * PatientTask findMany
   */
  export type PatientTaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter, which PatientTasks to fetch.
     */
    where?: PatientTaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTasks to fetch.
     */
    orderBy?: PatientTaskOrderByWithRelationInput | PatientTaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientTasks.
     */
    cursor?: PatientTaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTasks.
     */
    skip?: number
    distinct?: PatientTaskScalarFieldEnum | PatientTaskScalarFieldEnum[]
  }

  /**
   * PatientTask create
   */
  export type PatientTaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientTask.
     */
    data: XOR<PatientTaskCreateInput, PatientTaskUncheckedCreateInput>
  }

  /**
   * PatientTask createMany
   */
  export type PatientTaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientTasks.
     */
    data: PatientTaskCreateManyInput | PatientTaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientTask createManyAndReturn
   */
  export type PatientTaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientTasks.
     */
    data: PatientTaskCreateManyInput | PatientTaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientTask update
   */
  export type PatientTaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientTask.
     */
    data: XOR<PatientTaskUpdateInput, PatientTaskUncheckedUpdateInput>
    /**
     * Choose, which PatientTask to update.
     */
    where: PatientTaskWhereUniqueInput
  }

  /**
   * PatientTask updateMany
   */
  export type PatientTaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientTasks.
     */
    data: XOR<PatientTaskUpdateManyMutationInput, PatientTaskUncheckedUpdateManyInput>
    /**
     * Filter which PatientTasks to update
     */
    where?: PatientTaskWhereInput
  }

  /**
   * PatientTask upsert
   */
  export type PatientTaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientTask to update in case it exists.
     */
    where: PatientTaskWhereUniqueInput
    /**
     * In case the PatientTask found by the `where` argument doesn't exist, create a new PatientTask with this data.
     */
    create: XOR<PatientTaskCreateInput, PatientTaskUncheckedCreateInput>
    /**
     * In case the PatientTask was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientTaskUpdateInput, PatientTaskUncheckedUpdateInput>
  }

  /**
   * PatientTask delete
   */
  export type PatientTaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
    /**
     * Filter which PatientTask to delete.
     */
    where: PatientTaskWhereUniqueInput
  }

  /**
   * PatientTask deleteMany
   */
  export type PatientTaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientTasks to delete
     */
    where?: PatientTaskWhereInput
  }

  /**
   * PatientTask.relatedEvent
   */
  export type PatientTask$relatedEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientEngagementEvent
     */
    select?: PatientEngagementEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientEngagementEventInclude<ExtArgs> | null
    where?: PatientEngagementEventWhereInput
  }

  /**
   * PatientTask without action
   */
  export type PatientTaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTask
     */
    select?: PatientTaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTaskInclude<ExtArgs> | null
  }


  /**
   * Model EngagementRuleRun
   */

  export type AggregateEngagementRuleRun = {
    _count: EngagementRuleRunCountAggregateOutputType | null
    _min: EngagementRuleRunMinAggregateOutputType | null
    _max: EngagementRuleRunMaxAggregateOutputType | null
  }

  export type EngagementRuleRunMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ruleId: string | null
    eventId: string | null
    decision: string | null
    skipReason: string | null
    correlationId: string | null
    evaluatedAt: Date | null
  }

  export type EngagementRuleRunMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    ruleId: string | null
    eventId: string | null
    decision: string | null
    skipReason: string | null
    correlationId: string | null
    evaluatedAt: Date | null
  }

  export type EngagementRuleRunCountAggregateOutputType = {
    id: number
    tenantId: number
    ruleId: number
    eventId: number
    decision: number
    skipReason: number
    actionResult: number
    correlationId: number
    evaluatedAt: number
    _all: number
  }


  export type EngagementRuleRunMinAggregateInputType = {
    id?: true
    tenantId?: true
    ruleId?: true
    eventId?: true
    decision?: true
    skipReason?: true
    correlationId?: true
    evaluatedAt?: true
  }

  export type EngagementRuleRunMaxAggregateInputType = {
    id?: true
    tenantId?: true
    ruleId?: true
    eventId?: true
    decision?: true
    skipReason?: true
    correlationId?: true
    evaluatedAt?: true
  }

  export type EngagementRuleRunCountAggregateInputType = {
    id?: true
    tenantId?: true
    ruleId?: true
    eventId?: true
    decision?: true
    skipReason?: true
    actionResult?: true
    correlationId?: true
    evaluatedAt?: true
    _all?: true
  }

  export type EngagementRuleRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EngagementRuleRun to aggregate.
     */
    where?: EngagementRuleRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRuleRuns to fetch.
     */
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EngagementRuleRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRuleRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRuleRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EngagementRuleRuns
    **/
    _count?: true | EngagementRuleRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EngagementRuleRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EngagementRuleRunMaxAggregateInputType
  }

  export type GetEngagementRuleRunAggregateType<T extends EngagementRuleRunAggregateArgs> = {
        [P in keyof T & keyof AggregateEngagementRuleRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEngagementRuleRun[P]>
      : GetScalarType<T[P], AggregateEngagementRuleRun[P]>
  }




  export type EngagementRuleRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EngagementRuleRunWhereInput
    orderBy?: EngagementRuleRunOrderByWithAggregationInput | EngagementRuleRunOrderByWithAggregationInput[]
    by: EngagementRuleRunScalarFieldEnum[] | EngagementRuleRunScalarFieldEnum
    having?: EngagementRuleRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EngagementRuleRunCountAggregateInputType | true
    _min?: EngagementRuleRunMinAggregateInputType
    _max?: EngagementRuleRunMaxAggregateInputType
  }

  export type EngagementRuleRunGroupByOutputType = {
    id: string
    tenantId: string
    ruleId: string
    eventId: string
    decision: string
    skipReason: string | null
    actionResult: JsonValue | null
    correlationId: string | null
    evaluatedAt: Date
    _count: EngagementRuleRunCountAggregateOutputType | null
    _min: EngagementRuleRunMinAggregateOutputType | null
    _max: EngagementRuleRunMaxAggregateOutputType | null
  }

  type GetEngagementRuleRunGroupByPayload<T extends EngagementRuleRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EngagementRuleRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EngagementRuleRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EngagementRuleRunGroupByOutputType[P]>
            : GetScalarType<T[P], EngagementRuleRunGroupByOutputType[P]>
        }
      >
    >


  export type EngagementRuleRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ruleId?: boolean
    eventId?: boolean
    decision?: boolean
    skipReason?: boolean
    actionResult?: boolean
    correlationId?: boolean
    evaluatedAt?: boolean
    rule?: boolean | EngagementRuleDefaultArgs<ExtArgs>
    event?: boolean | PatientEngagementEventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["engagementRuleRun"]>

  export type EngagementRuleRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    ruleId?: boolean
    eventId?: boolean
    decision?: boolean
    skipReason?: boolean
    actionResult?: boolean
    correlationId?: boolean
    evaluatedAt?: boolean
    rule?: boolean | EngagementRuleDefaultArgs<ExtArgs>
    event?: boolean | PatientEngagementEventDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["engagementRuleRun"]>

  export type EngagementRuleRunSelectScalar = {
    id?: boolean
    tenantId?: boolean
    ruleId?: boolean
    eventId?: boolean
    decision?: boolean
    skipReason?: boolean
    actionResult?: boolean
    correlationId?: boolean
    evaluatedAt?: boolean
  }

  export type EngagementRuleRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rule?: boolean | EngagementRuleDefaultArgs<ExtArgs>
    event?: boolean | PatientEngagementEventDefaultArgs<ExtArgs>
  }
  export type EngagementRuleRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rule?: boolean | EngagementRuleDefaultArgs<ExtArgs>
    event?: boolean | PatientEngagementEventDefaultArgs<ExtArgs>
  }

  export type $EngagementRuleRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EngagementRuleRun"
    objects: {
      rule: Prisma.$EngagementRulePayload<ExtArgs>
      event: Prisma.$PatientEngagementEventPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      ruleId: string
      eventId: string
      decision: string
      skipReason: string | null
      actionResult: Prisma.JsonValue | null
      correlationId: string | null
      evaluatedAt: Date
    }, ExtArgs["result"]["engagementRuleRun"]>
    composites: {}
  }

  type EngagementRuleRunGetPayload<S extends boolean | null | undefined | EngagementRuleRunDefaultArgs> = $Result.GetResult<Prisma.$EngagementRuleRunPayload, S>

  type EngagementRuleRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EngagementRuleRunFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EngagementRuleRunCountAggregateInputType | true
    }

  export interface EngagementRuleRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EngagementRuleRun'], meta: { name: 'EngagementRuleRun' } }
    /**
     * Find zero or one EngagementRuleRun that matches the filter.
     * @param {EngagementRuleRunFindUniqueArgs} args - Arguments to find a EngagementRuleRun
     * @example
     * // Get one EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EngagementRuleRunFindUniqueArgs>(args: SelectSubset<T, EngagementRuleRunFindUniqueArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EngagementRuleRun that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EngagementRuleRunFindUniqueOrThrowArgs} args - Arguments to find a EngagementRuleRun
     * @example
     * // Get one EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EngagementRuleRunFindUniqueOrThrowArgs>(args: SelectSubset<T, EngagementRuleRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EngagementRuleRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunFindFirstArgs} args - Arguments to find a EngagementRuleRun
     * @example
     * // Get one EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EngagementRuleRunFindFirstArgs>(args?: SelectSubset<T, EngagementRuleRunFindFirstArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EngagementRuleRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunFindFirstOrThrowArgs} args - Arguments to find a EngagementRuleRun
     * @example
     * // Get one EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EngagementRuleRunFindFirstOrThrowArgs>(args?: SelectSubset<T, EngagementRuleRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EngagementRuleRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EngagementRuleRuns
     * const engagementRuleRuns = await prisma.engagementRuleRun.findMany()
     * 
     * // Get first 10 EngagementRuleRuns
     * const engagementRuleRuns = await prisma.engagementRuleRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const engagementRuleRunWithIdOnly = await prisma.engagementRuleRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EngagementRuleRunFindManyArgs>(args?: SelectSubset<T, EngagementRuleRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EngagementRuleRun.
     * @param {EngagementRuleRunCreateArgs} args - Arguments to create a EngagementRuleRun.
     * @example
     * // Create one EngagementRuleRun
     * const EngagementRuleRun = await prisma.engagementRuleRun.create({
     *   data: {
     *     // ... data to create a EngagementRuleRun
     *   }
     * })
     * 
     */
    create<T extends EngagementRuleRunCreateArgs>(args: SelectSubset<T, EngagementRuleRunCreateArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EngagementRuleRuns.
     * @param {EngagementRuleRunCreateManyArgs} args - Arguments to create many EngagementRuleRuns.
     * @example
     * // Create many EngagementRuleRuns
     * const engagementRuleRun = await prisma.engagementRuleRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EngagementRuleRunCreateManyArgs>(args?: SelectSubset<T, EngagementRuleRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EngagementRuleRuns and returns the data saved in the database.
     * @param {EngagementRuleRunCreateManyAndReturnArgs} args - Arguments to create many EngagementRuleRuns.
     * @example
     * // Create many EngagementRuleRuns
     * const engagementRuleRun = await prisma.engagementRuleRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EngagementRuleRuns and only return the `id`
     * const engagementRuleRunWithIdOnly = await prisma.engagementRuleRun.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EngagementRuleRunCreateManyAndReturnArgs>(args?: SelectSubset<T, EngagementRuleRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EngagementRuleRun.
     * @param {EngagementRuleRunDeleteArgs} args - Arguments to delete one EngagementRuleRun.
     * @example
     * // Delete one EngagementRuleRun
     * const EngagementRuleRun = await prisma.engagementRuleRun.delete({
     *   where: {
     *     // ... filter to delete one EngagementRuleRun
     *   }
     * })
     * 
     */
    delete<T extends EngagementRuleRunDeleteArgs>(args: SelectSubset<T, EngagementRuleRunDeleteArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EngagementRuleRun.
     * @param {EngagementRuleRunUpdateArgs} args - Arguments to update one EngagementRuleRun.
     * @example
     * // Update one EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EngagementRuleRunUpdateArgs>(args: SelectSubset<T, EngagementRuleRunUpdateArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EngagementRuleRuns.
     * @param {EngagementRuleRunDeleteManyArgs} args - Arguments to filter EngagementRuleRuns to delete.
     * @example
     * // Delete a few EngagementRuleRuns
     * const { count } = await prisma.engagementRuleRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EngagementRuleRunDeleteManyArgs>(args?: SelectSubset<T, EngagementRuleRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EngagementRuleRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EngagementRuleRuns
     * const engagementRuleRun = await prisma.engagementRuleRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EngagementRuleRunUpdateManyArgs>(args: SelectSubset<T, EngagementRuleRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EngagementRuleRun.
     * @param {EngagementRuleRunUpsertArgs} args - Arguments to update or create a EngagementRuleRun.
     * @example
     * // Update or create a EngagementRuleRun
     * const engagementRuleRun = await prisma.engagementRuleRun.upsert({
     *   create: {
     *     // ... data to create a EngagementRuleRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EngagementRuleRun we want to update
     *   }
     * })
     */
    upsert<T extends EngagementRuleRunUpsertArgs>(args: SelectSubset<T, EngagementRuleRunUpsertArgs<ExtArgs>>): Prisma__EngagementRuleRunClient<$Result.GetResult<Prisma.$EngagementRuleRunPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EngagementRuleRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunCountArgs} args - Arguments to filter EngagementRuleRuns to count.
     * @example
     * // Count the number of EngagementRuleRuns
     * const count = await prisma.engagementRuleRun.count({
     *   where: {
     *     // ... the filter for the EngagementRuleRuns we want to count
     *   }
     * })
    **/
    count<T extends EngagementRuleRunCountArgs>(
      args?: Subset<T, EngagementRuleRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EngagementRuleRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EngagementRuleRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EngagementRuleRunAggregateArgs>(args: Subset<T, EngagementRuleRunAggregateArgs>): Prisma.PrismaPromise<GetEngagementRuleRunAggregateType<T>>

    /**
     * Group by EngagementRuleRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EngagementRuleRunGroupByArgs} args - Group by arguments.
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
      T extends EngagementRuleRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EngagementRuleRunGroupByArgs['orderBy'] }
        : { orderBy?: EngagementRuleRunGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EngagementRuleRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEngagementRuleRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EngagementRuleRun model
   */
  readonly fields: EngagementRuleRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EngagementRuleRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EngagementRuleRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rule<T extends EngagementRuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EngagementRuleDefaultArgs<ExtArgs>>): Prisma__EngagementRuleClient<$Result.GetResult<Prisma.$EngagementRulePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    event<T extends PatientEngagementEventDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientEngagementEventDefaultArgs<ExtArgs>>): Prisma__PatientEngagementEventClient<$Result.GetResult<Prisma.$PatientEngagementEventPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the EngagementRuleRun model
   */ 
  interface EngagementRuleRunFieldRefs {
    readonly id: FieldRef<"EngagementRuleRun", 'String'>
    readonly tenantId: FieldRef<"EngagementRuleRun", 'String'>
    readonly ruleId: FieldRef<"EngagementRuleRun", 'String'>
    readonly eventId: FieldRef<"EngagementRuleRun", 'String'>
    readonly decision: FieldRef<"EngagementRuleRun", 'String'>
    readonly skipReason: FieldRef<"EngagementRuleRun", 'String'>
    readonly actionResult: FieldRef<"EngagementRuleRun", 'Json'>
    readonly correlationId: FieldRef<"EngagementRuleRun", 'String'>
    readonly evaluatedAt: FieldRef<"EngagementRuleRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EngagementRuleRun findUnique
   */
  export type EngagementRuleRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRuleRun to fetch.
     */
    where: EngagementRuleRunWhereUniqueInput
  }

  /**
   * EngagementRuleRun findUniqueOrThrow
   */
  export type EngagementRuleRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRuleRun to fetch.
     */
    where: EngagementRuleRunWhereUniqueInput
  }

  /**
   * EngagementRuleRun findFirst
   */
  export type EngagementRuleRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRuleRun to fetch.
     */
    where?: EngagementRuleRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRuleRuns to fetch.
     */
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EngagementRuleRuns.
     */
    cursor?: EngagementRuleRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRuleRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRuleRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EngagementRuleRuns.
     */
    distinct?: EngagementRuleRunScalarFieldEnum | EngagementRuleRunScalarFieldEnum[]
  }

  /**
   * EngagementRuleRun findFirstOrThrow
   */
  export type EngagementRuleRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRuleRun to fetch.
     */
    where?: EngagementRuleRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRuleRuns to fetch.
     */
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EngagementRuleRuns.
     */
    cursor?: EngagementRuleRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRuleRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRuleRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EngagementRuleRuns.
     */
    distinct?: EngagementRuleRunScalarFieldEnum | EngagementRuleRunScalarFieldEnum[]
  }

  /**
   * EngagementRuleRun findMany
   */
  export type EngagementRuleRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter, which EngagementRuleRuns to fetch.
     */
    where?: EngagementRuleRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EngagementRuleRuns to fetch.
     */
    orderBy?: EngagementRuleRunOrderByWithRelationInput | EngagementRuleRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EngagementRuleRuns.
     */
    cursor?: EngagementRuleRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EngagementRuleRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EngagementRuleRuns.
     */
    skip?: number
    distinct?: EngagementRuleRunScalarFieldEnum | EngagementRuleRunScalarFieldEnum[]
  }

  /**
   * EngagementRuleRun create
   */
  export type EngagementRuleRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * The data needed to create a EngagementRuleRun.
     */
    data: XOR<EngagementRuleRunCreateInput, EngagementRuleRunUncheckedCreateInput>
  }

  /**
   * EngagementRuleRun createMany
   */
  export type EngagementRuleRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EngagementRuleRuns.
     */
    data: EngagementRuleRunCreateManyInput | EngagementRuleRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EngagementRuleRun createManyAndReturn
   */
  export type EngagementRuleRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EngagementRuleRuns.
     */
    data: EngagementRuleRunCreateManyInput | EngagementRuleRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EngagementRuleRun update
   */
  export type EngagementRuleRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * The data needed to update a EngagementRuleRun.
     */
    data: XOR<EngagementRuleRunUpdateInput, EngagementRuleRunUncheckedUpdateInput>
    /**
     * Choose, which EngagementRuleRun to update.
     */
    where: EngagementRuleRunWhereUniqueInput
  }

  /**
   * EngagementRuleRun updateMany
   */
  export type EngagementRuleRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EngagementRuleRuns.
     */
    data: XOR<EngagementRuleRunUpdateManyMutationInput, EngagementRuleRunUncheckedUpdateManyInput>
    /**
     * Filter which EngagementRuleRuns to update
     */
    where?: EngagementRuleRunWhereInput
  }

  /**
   * EngagementRuleRun upsert
   */
  export type EngagementRuleRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * The filter to search for the EngagementRuleRun to update in case it exists.
     */
    where: EngagementRuleRunWhereUniqueInput
    /**
     * In case the EngagementRuleRun found by the `where` argument doesn't exist, create a new EngagementRuleRun with this data.
     */
    create: XOR<EngagementRuleRunCreateInput, EngagementRuleRunUncheckedCreateInput>
    /**
     * In case the EngagementRuleRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EngagementRuleRunUpdateInput, EngagementRuleRunUncheckedUpdateInput>
  }

  /**
   * EngagementRuleRun delete
   */
  export type EngagementRuleRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
    /**
     * Filter which EngagementRuleRun to delete.
     */
    where: EngagementRuleRunWhereUniqueInput
  }

  /**
   * EngagementRuleRun deleteMany
   */
  export type EngagementRuleRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EngagementRuleRuns to delete
     */
    where?: EngagementRuleRunWhereInput
  }

  /**
   * EngagementRuleRun without action
   */
  export type EngagementRuleRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EngagementRuleRun
     */
    select?: EngagementRuleRunSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EngagementRuleRunInclude<ExtArgs> | null
  }


  /**
   * Model PrmJob
   */

  export type AggregatePrmJob = {
    _count: PrmJobCountAggregateOutputType | null
    _avg: PrmJobAvgAggregateOutputType | null
    _sum: PrmJobSumAggregateOutputType | null
    _min: PrmJobMinAggregateOutputType | null
    _max: PrmJobMaxAggregateOutputType | null
  }

  export type PrmJobAvgAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PrmJobSumAggregateOutputType = {
    attempts: number | null
    maxAttempts: number | null
  }

  export type PrmJobMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    jobType: string | null
    runAt: Date | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    lockedAt: Date | null
    lockedBy: string | null
    lastError: string | null
    idempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrmJobMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    jobType: string | null
    runAt: Date | null
    status: string | null
    attempts: number | null
    maxAttempts: number | null
    lockedAt: Date | null
    lockedBy: string | null
    lastError: string | null
    idempotencyKey: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PrmJobCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    jobType: number
    payload: number
    runAt: number
    status: number
    attempts: number
    maxAttempts: number
    lockedAt: number
    lockedBy: number
    lastError: number
    idempotencyKey: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PrmJobAvgAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PrmJobSumAggregateInputType = {
    attempts?: true
    maxAttempts?: true
  }

  export type PrmJobMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    jobType?: true
    runAt?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    lockedAt?: true
    lockedBy?: true
    lastError?: true
    idempotencyKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrmJobMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    jobType?: true
    runAt?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    lockedAt?: true
    lockedBy?: true
    lastError?: true
    idempotencyKey?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PrmJobCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    jobType?: true
    payload?: true
    runAt?: true
    status?: true
    attempts?: true
    maxAttempts?: true
    lockedAt?: true
    lockedBy?: true
    lastError?: true
    idempotencyKey?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PrmJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrmJob to aggregate.
     */
    where?: PrmJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrmJobs to fetch.
     */
    orderBy?: PrmJobOrderByWithRelationInput | PrmJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrmJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrmJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrmJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrmJobs
    **/
    _count?: true | PrmJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PrmJobAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PrmJobSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrmJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrmJobMaxAggregateInputType
  }

  export type GetPrmJobAggregateType<T extends PrmJobAggregateArgs> = {
        [P in keyof T & keyof AggregatePrmJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrmJob[P]>
      : GetScalarType<T[P], AggregatePrmJob[P]>
  }




  export type PrmJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrmJobWhereInput
    orderBy?: PrmJobOrderByWithAggregationInput | PrmJobOrderByWithAggregationInput[]
    by: PrmJobScalarFieldEnum[] | PrmJobScalarFieldEnum
    having?: PrmJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrmJobCountAggregateInputType | true
    _avg?: PrmJobAvgAggregateInputType
    _sum?: PrmJobSumAggregateInputType
    _min?: PrmJobMinAggregateInputType
    _max?: PrmJobMaxAggregateInputType
  }

  export type PrmJobGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    jobType: string
    payload: JsonValue
    runAt: Date
    status: string
    attempts: number
    maxAttempts: number
    lockedAt: Date | null
    lockedBy: string | null
    lastError: string | null
    idempotencyKey: string
    createdAt: Date
    updatedAt: Date
    _count: PrmJobCountAggregateOutputType | null
    _avg: PrmJobAvgAggregateOutputType | null
    _sum: PrmJobSumAggregateOutputType | null
    _min: PrmJobMinAggregateOutputType | null
    _max: PrmJobMaxAggregateOutputType | null
  }

  type GetPrmJobGroupByPayload<T extends PrmJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrmJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrmJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrmJobGroupByOutputType[P]>
            : GetScalarType<T[P], PrmJobGroupByOutputType[P]>
        }
      >
    >


  export type PrmJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    jobType?: boolean
    payload?: boolean
    runAt?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    lockedAt?: boolean
    lockedBy?: boolean
    lastError?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["prmJob"]>

  export type PrmJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    jobType?: boolean
    payload?: boolean
    runAt?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    lockedAt?: boolean
    lockedBy?: boolean
    lastError?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["prmJob"]>

  export type PrmJobSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    jobType?: boolean
    payload?: boolean
    runAt?: boolean
    status?: boolean
    attempts?: boolean
    maxAttempts?: boolean
    lockedAt?: boolean
    lockedBy?: boolean
    lastError?: boolean
    idempotencyKey?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $PrmJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrmJob"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      jobType: string
      payload: Prisma.JsonValue
      runAt: Date
      status: string
      attempts: number
      maxAttempts: number
      lockedAt: Date | null
      lockedBy: string | null
      lastError: string | null
      idempotencyKey: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["prmJob"]>
    composites: {}
  }

  type PrmJobGetPayload<S extends boolean | null | undefined | PrmJobDefaultArgs> = $Result.GetResult<Prisma.$PrmJobPayload, S>

  type PrmJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PrmJobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PrmJobCountAggregateInputType | true
    }

  export interface PrmJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrmJob'], meta: { name: 'PrmJob' } }
    /**
     * Find zero or one PrmJob that matches the filter.
     * @param {PrmJobFindUniqueArgs} args - Arguments to find a PrmJob
     * @example
     * // Get one PrmJob
     * const prmJob = await prisma.prmJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrmJobFindUniqueArgs>(args: SelectSubset<T, PrmJobFindUniqueArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PrmJob that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PrmJobFindUniqueOrThrowArgs} args - Arguments to find a PrmJob
     * @example
     * // Get one PrmJob
     * const prmJob = await prisma.prmJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrmJobFindUniqueOrThrowArgs>(args: SelectSubset<T, PrmJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PrmJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobFindFirstArgs} args - Arguments to find a PrmJob
     * @example
     * // Get one PrmJob
     * const prmJob = await prisma.prmJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrmJobFindFirstArgs>(args?: SelectSubset<T, PrmJobFindFirstArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PrmJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobFindFirstOrThrowArgs} args - Arguments to find a PrmJob
     * @example
     * // Get one PrmJob
     * const prmJob = await prisma.prmJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrmJobFindFirstOrThrowArgs>(args?: SelectSubset<T, PrmJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PrmJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrmJobs
     * const prmJobs = await prisma.prmJob.findMany()
     * 
     * // Get first 10 PrmJobs
     * const prmJobs = await prisma.prmJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const prmJobWithIdOnly = await prisma.prmJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PrmJobFindManyArgs>(args?: SelectSubset<T, PrmJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PrmJob.
     * @param {PrmJobCreateArgs} args - Arguments to create a PrmJob.
     * @example
     * // Create one PrmJob
     * const PrmJob = await prisma.prmJob.create({
     *   data: {
     *     // ... data to create a PrmJob
     *   }
     * })
     * 
     */
    create<T extends PrmJobCreateArgs>(args: SelectSubset<T, PrmJobCreateArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PrmJobs.
     * @param {PrmJobCreateManyArgs} args - Arguments to create many PrmJobs.
     * @example
     * // Create many PrmJobs
     * const prmJob = await prisma.prmJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrmJobCreateManyArgs>(args?: SelectSubset<T, PrmJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrmJobs and returns the data saved in the database.
     * @param {PrmJobCreateManyAndReturnArgs} args - Arguments to create many PrmJobs.
     * @example
     * // Create many PrmJobs
     * const prmJob = await prisma.prmJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrmJobs and only return the `id`
     * const prmJobWithIdOnly = await prisma.prmJob.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrmJobCreateManyAndReturnArgs>(args?: SelectSubset<T, PrmJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PrmJob.
     * @param {PrmJobDeleteArgs} args - Arguments to delete one PrmJob.
     * @example
     * // Delete one PrmJob
     * const PrmJob = await prisma.prmJob.delete({
     *   where: {
     *     // ... filter to delete one PrmJob
     *   }
     * })
     * 
     */
    delete<T extends PrmJobDeleteArgs>(args: SelectSubset<T, PrmJobDeleteArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PrmJob.
     * @param {PrmJobUpdateArgs} args - Arguments to update one PrmJob.
     * @example
     * // Update one PrmJob
     * const prmJob = await prisma.prmJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrmJobUpdateArgs>(args: SelectSubset<T, PrmJobUpdateArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PrmJobs.
     * @param {PrmJobDeleteManyArgs} args - Arguments to filter PrmJobs to delete.
     * @example
     * // Delete a few PrmJobs
     * const { count } = await prisma.prmJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrmJobDeleteManyArgs>(args?: SelectSubset<T, PrmJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrmJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrmJobs
     * const prmJob = await prisma.prmJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrmJobUpdateManyArgs>(args: SelectSubset<T, PrmJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PrmJob.
     * @param {PrmJobUpsertArgs} args - Arguments to update or create a PrmJob.
     * @example
     * // Update or create a PrmJob
     * const prmJob = await prisma.prmJob.upsert({
     *   create: {
     *     // ... data to create a PrmJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrmJob we want to update
     *   }
     * })
     */
    upsert<T extends PrmJobUpsertArgs>(args: SelectSubset<T, PrmJobUpsertArgs<ExtArgs>>): Prisma__PrmJobClient<$Result.GetResult<Prisma.$PrmJobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PrmJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobCountArgs} args - Arguments to filter PrmJobs to count.
     * @example
     * // Count the number of PrmJobs
     * const count = await prisma.prmJob.count({
     *   where: {
     *     // ... the filter for the PrmJobs we want to count
     *   }
     * })
    **/
    count<T extends PrmJobCountArgs>(
      args?: Subset<T, PrmJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrmJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrmJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PrmJobAggregateArgs>(args: Subset<T, PrmJobAggregateArgs>): Prisma.PrismaPromise<GetPrmJobAggregateType<T>>

    /**
     * Group by PrmJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrmJobGroupByArgs} args - Group by arguments.
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
      T extends PrmJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrmJobGroupByArgs['orderBy'] }
        : { orderBy?: PrmJobGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PrmJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrmJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrmJob model
   */
  readonly fields: PrmJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrmJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrmJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PrmJob model
   */ 
  interface PrmJobFieldRefs {
    readonly id: FieldRef<"PrmJob", 'String'>
    readonly tenantId: FieldRef<"PrmJob", 'String'>
    readonly patientId: FieldRef<"PrmJob", 'String'>
    readonly jobType: FieldRef<"PrmJob", 'String'>
    readonly payload: FieldRef<"PrmJob", 'Json'>
    readonly runAt: FieldRef<"PrmJob", 'DateTime'>
    readonly status: FieldRef<"PrmJob", 'String'>
    readonly attempts: FieldRef<"PrmJob", 'Int'>
    readonly maxAttempts: FieldRef<"PrmJob", 'Int'>
    readonly lockedAt: FieldRef<"PrmJob", 'DateTime'>
    readonly lockedBy: FieldRef<"PrmJob", 'String'>
    readonly lastError: FieldRef<"PrmJob", 'String'>
    readonly idempotencyKey: FieldRef<"PrmJob", 'String'>
    readonly createdAt: FieldRef<"PrmJob", 'DateTime'>
    readonly updatedAt: FieldRef<"PrmJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PrmJob findUnique
   */
  export type PrmJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter, which PrmJob to fetch.
     */
    where: PrmJobWhereUniqueInput
  }

  /**
   * PrmJob findUniqueOrThrow
   */
  export type PrmJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter, which PrmJob to fetch.
     */
    where: PrmJobWhereUniqueInput
  }

  /**
   * PrmJob findFirst
   */
  export type PrmJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter, which PrmJob to fetch.
     */
    where?: PrmJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrmJobs to fetch.
     */
    orderBy?: PrmJobOrderByWithRelationInput | PrmJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrmJobs.
     */
    cursor?: PrmJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrmJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrmJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrmJobs.
     */
    distinct?: PrmJobScalarFieldEnum | PrmJobScalarFieldEnum[]
  }

  /**
   * PrmJob findFirstOrThrow
   */
  export type PrmJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter, which PrmJob to fetch.
     */
    where?: PrmJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrmJobs to fetch.
     */
    orderBy?: PrmJobOrderByWithRelationInput | PrmJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrmJobs.
     */
    cursor?: PrmJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrmJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrmJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrmJobs.
     */
    distinct?: PrmJobScalarFieldEnum | PrmJobScalarFieldEnum[]
  }

  /**
   * PrmJob findMany
   */
  export type PrmJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter, which PrmJobs to fetch.
     */
    where?: PrmJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrmJobs to fetch.
     */
    orderBy?: PrmJobOrderByWithRelationInput | PrmJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrmJobs.
     */
    cursor?: PrmJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrmJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrmJobs.
     */
    skip?: number
    distinct?: PrmJobScalarFieldEnum | PrmJobScalarFieldEnum[]
  }

  /**
   * PrmJob create
   */
  export type PrmJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * The data needed to create a PrmJob.
     */
    data: XOR<PrmJobCreateInput, PrmJobUncheckedCreateInput>
  }

  /**
   * PrmJob createMany
   */
  export type PrmJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrmJobs.
     */
    data: PrmJobCreateManyInput | PrmJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PrmJob createManyAndReturn
   */
  export type PrmJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PrmJobs.
     */
    data: PrmJobCreateManyInput | PrmJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PrmJob update
   */
  export type PrmJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * The data needed to update a PrmJob.
     */
    data: XOR<PrmJobUpdateInput, PrmJobUncheckedUpdateInput>
    /**
     * Choose, which PrmJob to update.
     */
    where: PrmJobWhereUniqueInput
  }

  /**
   * PrmJob updateMany
   */
  export type PrmJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrmJobs.
     */
    data: XOR<PrmJobUpdateManyMutationInput, PrmJobUncheckedUpdateManyInput>
    /**
     * Filter which PrmJobs to update
     */
    where?: PrmJobWhereInput
  }

  /**
   * PrmJob upsert
   */
  export type PrmJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * The filter to search for the PrmJob to update in case it exists.
     */
    where: PrmJobWhereUniqueInput
    /**
     * In case the PrmJob found by the `where` argument doesn't exist, create a new PrmJob with this data.
     */
    create: XOR<PrmJobCreateInput, PrmJobUncheckedCreateInput>
    /**
     * In case the PrmJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrmJobUpdateInput, PrmJobUncheckedUpdateInput>
  }

  /**
   * PrmJob delete
   */
  export type PrmJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
    /**
     * Filter which PrmJob to delete.
     */
    where: PrmJobWhereUniqueInput
  }

  /**
   * PrmJob deleteMany
   */
  export type PrmJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrmJobs to delete
     */
    where?: PrmJobWhereInput
  }

  /**
   * PrmJob without action
   */
  export type PrmJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrmJob
     */
    select?: PrmJobSelect<ExtArgs> | null
  }


  /**
   * Model ProviderCallback
   */

  export type AggregateProviderCallback = {
    _count: ProviderCallbackCountAggregateOutputType | null
    _min: ProviderCallbackMinAggregateOutputType | null
    _max: ProviderCallbackMaxAggregateOutputType | null
  }

  export type ProviderCallbackMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    channel: string | null
    providerMessageId: string | null
    receivedAt: Date | null
    processed: boolean | null
    processedAt: Date | null
  }

  export type ProviderCallbackMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    channel: string | null
    providerMessageId: string | null
    receivedAt: Date | null
    processed: boolean | null
    processedAt: Date | null
  }

  export type ProviderCallbackCountAggregateOutputType = {
    id: number
    tenantId: number
    channel: number
    providerMessageId: number
    receivedAt: number
    payload: number
    processed: number
    processedAt: number
    _all: number
  }


  export type ProviderCallbackMinAggregateInputType = {
    id?: true
    tenantId?: true
    channel?: true
    providerMessageId?: true
    receivedAt?: true
    processed?: true
    processedAt?: true
  }

  export type ProviderCallbackMaxAggregateInputType = {
    id?: true
    tenantId?: true
    channel?: true
    providerMessageId?: true
    receivedAt?: true
    processed?: true
    processedAt?: true
  }

  export type ProviderCallbackCountAggregateInputType = {
    id?: true
    tenantId?: true
    channel?: true
    providerMessageId?: true
    receivedAt?: true
    payload?: true
    processed?: true
    processedAt?: true
    _all?: true
  }

  export type ProviderCallbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderCallback to aggregate.
     */
    where?: ProviderCallbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCallbacks to fetch.
     */
    orderBy?: ProviderCallbackOrderByWithRelationInput | ProviderCallbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProviderCallbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCallbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCallbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProviderCallbacks
    **/
    _count?: true | ProviderCallbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProviderCallbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProviderCallbackMaxAggregateInputType
  }

  export type GetProviderCallbackAggregateType<T extends ProviderCallbackAggregateArgs> = {
        [P in keyof T & keyof AggregateProviderCallback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProviderCallback[P]>
      : GetScalarType<T[P], AggregateProviderCallback[P]>
  }




  export type ProviderCallbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProviderCallbackWhereInput
    orderBy?: ProviderCallbackOrderByWithAggregationInput | ProviderCallbackOrderByWithAggregationInput[]
    by: ProviderCallbackScalarFieldEnum[] | ProviderCallbackScalarFieldEnum
    having?: ProviderCallbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProviderCallbackCountAggregateInputType | true
    _min?: ProviderCallbackMinAggregateInputType
    _max?: ProviderCallbackMaxAggregateInputType
  }

  export type ProviderCallbackGroupByOutputType = {
    id: string
    tenantId: string
    channel: string
    providerMessageId: string
    receivedAt: Date
    payload: JsonValue
    processed: boolean
    processedAt: Date | null
    _count: ProviderCallbackCountAggregateOutputType | null
    _min: ProviderCallbackMinAggregateOutputType | null
    _max: ProviderCallbackMaxAggregateOutputType | null
  }

  type GetProviderCallbackGroupByPayload<T extends ProviderCallbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProviderCallbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProviderCallbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProviderCallbackGroupByOutputType[P]>
            : GetScalarType<T[P], ProviderCallbackGroupByOutputType[P]>
        }
      >
    >


  export type ProviderCallbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    channel?: boolean
    providerMessageId?: boolean
    receivedAt?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["providerCallback"]>

  export type ProviderCallbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    channel?: boolean
    providerMessageId?: boolean
    receivedAt?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
  }, ExtArgs["result"]["providerCallback"]>

  export type ProviderCallbackSelectScalar = {
    id?: boolean
    tenantId?: boolean
    channel?: boolean
    providerMessageId?: boolean
    receivedAt?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
  }


  export type $ProviderCallbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProviderCallback"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      channel: string
      providerMessageId: string
      receivedAt: Date
      payload: Prisma.JsonValue
      processed: boolean
      processedAt: Date | null
    }, ExtArgs["result"]["providerCallback"]>
    composites: {}
  }

  type ProviderCallbackGetPayload<S extends boolean | null | undefined | ProviderCallbackDefaultArgs> = $Result.GetResult<Prisma.$ProviderCallbackPayload, S>

  type ProviderCallbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProviderCallbackFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProviderCallbackCountAggregateInputType | true
    }

  export interface ProviderCallbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProviderCallback'], meta: { name: 'ProviderCallback' } }
    /**
     * Find zero or one ProviderCallback that matches the filter.
     * @param {ProviderCallbackFindUniqueArgs} args - Arguments to find a ProviderCallback
     * @example
     * // Get one ProviderCallback
     * const providerCallback = await prisma.providerCallback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProviderCallbackFindUniqueArgs>(args: SelectSubset<T, ProviderCallbackFindUniqueArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProviderCallback that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProviderCallbackFindUniqueOrThrowArgs} args - Arguments to find a ProviderCallback
     * @example
     * // Get one ProviderCallback
     * const providerCallback = await prisma.providerCallback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProviderCallbackFindUniqueOrThrowArgs>(args: SelectSubset<T, ProviderCallbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProviderCallback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackFindFirstArgs} args - Arguments to find a ProviderCallback
     * @example
     * // Get one ProviderCallback
     * const providerCallback = await prisma.providerCallback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProviderCallbackFindFirstArgs>(args?: SelectSubset<T, ProviderCallbackFindFirstArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProviderCallback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackFindFirstOrThrowArgs} args - Arguments to find a ProviderCallback
     * @example
     * // Get one ProviderCallback
     * const providerCallback = await prisma.providerCallback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProviderCallbackFindFirstOrThrowArgs>(args?: SelectSubset<T, ProviderCallbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProviderCallbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProviderCallbacks
     * const providerCallbacks = await prisma.providerCallback.findMany()
     * 
     * // Get first 10 ProviderCallbacks
     * const providerCallbacks = await prisma.providerCallback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const providerCallbackWithIdOnly = await prisma.providerCallback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProviderCallbackFindManyArgs>(args?: SelectSubset<T, ProviderCallbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProviderCallback.
     * @param {ProviderCallbackCreateArgs} args - Arguments to create a ProviderCallback.
     * @example
     * // Create one ProviderCallback
     * const ProviderCallback = await prisma.providerCallback.create({
     *   data: {
     *     // ... data to create a ProviderCallback
     *   }
     * })
     * 
     */
    create<T extends ProviderCallbackCreateArgs>(args: SelectSubset<T, ProviderCallbackCreateArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProviderCallbacks.
     * @param {ProviderCallbackCreateManyArgs} args - Arguments to create many ProviderCallbacks.
     * @example
     * // Create many ProviderCallbacks
     * const providerCallback = await prisma.providerCallback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProviderCallbackCreateManyArgs>(args?: SelectSubset<T, ProviderCallbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProviderCallbacks and returns the data saved in the database.
     * @param {ProviderCallbackCreateManyAndReturnArgs} args - Arguments to create many ProviderCallbacks.
     * @example
     * // Create many ProviderCallbacks
     * const providerCallback = await prisma.providerCallback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProviderCallbacks and only return the `id`
     * const providerCallbackWithIdOnly = await prisma.providerCallback.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProviderCallbackCreateManyAndReturnArgs>(args?: SelectSubset<T, ProviderCallbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProviderCallback.
     * @param {ProviderCallbackDeleteArgs} args - Arguments to delete one ProviderCallback.
     * @example
     * // Delete one ProviderCallback
     * const ProviderCallback = await prisma.providerCallback.delete({
     *   where: {
     *     // ... filter to delete one ProviderCallback
     *   }
     * })
     * 
     */
    delete<T extends ProviderCallbackDeleteArgs>(args: SelectSubset<T, ProviderCallbackDeleteArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProviderCallback.
     * @param {ProviderCallbackUpdateArgs} args - Arguments to update one ProviderCallback.
     * @example
     * // Update one ProviderCallback
     * const providerCallback = await prisma.providerCallback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProviderCallbackUpdateArgs>(args: SelectSubset<T, ProviderCallbackUpdateArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProviderCallbacks.
     * @param {ProviderCallbackDeleteManyArgs} args - Arguments to filter ProviderCallbacks to delete.
     * @example
     * // Delete a few ProviderCallbacks
     * const { count } = await prisma.providerCallback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProviderCallbackDeleteManyArgs>(args?: SelectSubset<T, ProviderCallbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProviderCallbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProviderCallbacks
     * const providerCallback = await prisma.providerCallback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProviderCallbackUpdateManyArgs>(args: SelectSubset<T, ProviderCallbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProviderCallback.
     * @param {ProviderCallbackUpsertArgs} args - Arguments to update or create a ProviderCallback.
     * @example
     * // Update or create a ProviderCallback
     * const providerCallback = await prisma.providerCallback.upsert({
     *   create: {
     *     // ... data to create a ProviderCallback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProviderCallback we want to update
     *   }
     * })
     */
    upsert<T extends ProviderCallbackUpsertArgs>(args: SelectSubset<T, ProviderCallbackUpsertArgs<ExtArgs>>): Prisma__ProviderCallbackClient<$Result.GetResult<Prisma.$ProviderCallbackPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProviderCallbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackCountArgs} args - Arguments to filter ProviderCallbacks to count.
     * @example
     * // Count the number of ProviderCallbacks
     * const count = await prisma.providerCallback.count({
     *   where: {
     *     // ... the filter for the ProviderCallbacks we want to count
     *   }
     * })
    **/
    count<T extends ProviderCallbackCountArgs>(
      args?: Subset<T, ProviderCallbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProviderCallbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProviderCallback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProviderCallbackAggregateArgs>(args: Subset<T, ProviderCallbackAggregateArgs>): Prisma.PrismaPromise<GetProviderCallbackAggregateType<T>>

    /**
     * Group by ProviderCallback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProviderCallbackGroupByArgs} args - Group by arguments.
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
      T extends ProviderCallbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProviderCallbackGroupByArgs['orderBy'] }
        : { orderBy?: ProviderCallbackGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProviderCallbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProviderCallbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProviderCallback model
   */
  readonly fields: ProviderCallbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProviderCallback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProviderCallbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ProviderCallback model
   */ 
  interface ProviderCallbackFieldRefs {
    readonly id: FieldRef<"ProviderCallback", 'String'>
    readonly tenantId: FieldRef<"ProviderCallback", 'String'>
    readonly channel: FieldRef<"ProviderCallback", 'String'>
    readonly providerMessageId: FieldRef<"ProviderCallback", 'String'>
    readonly receivedAt: FieldRef<"ProviderCallback", 'DateTime'>
    readonly payload: FieldRef<"ProviderCallback", 'Json'>
    readonly processed: FieldRef<"ProviderCallback", 'Boolean'>
    readonly processedAt: FieldRef<"ProviderCallback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProviderCallback findUnique
   */
  export type ProviderCallbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter, which ProviderCallback to fetch.
     */
    where: ProviderCallbackWhereUniqueInput
  }

  /**
   * ProviderCallback findUniqueOrThrow
   */
  export type ProviderCallbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter, which ProviderCallback to fetch.
     */
    where: ProviderCallbackWhereUniqueInput
  }

  /**
   * ProviderCallback findFirst
   */
  export type ProviderCallbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter, which ProviderCallback to fetch.
     */
    where?: ProviderCallbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCallbacks to fetch.
     */
    orderBy?: ProviderCallbackOrderByWithRelationInput | ProviderCallbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderCallbacks.
     */
    cursor?: ProviderCallbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCallbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCallbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderCallbacks.
     */
    distinct?: ProviderCallbackScalarFieldEnum | ProviderCallbackScalarFieldEnum[]
  }

  /**
   * ProviderCallback findFirstOrThrow
   */
  export type ProviderCallbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter, which ProviderCallback to fetch.
     */
    where?: ProviderCallbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCallbacks to fetch.
     */
    orderBy?: ProviderCallbackOrderByWithRelationInput | ProviderCallbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProviderCallbacks.
     */
    cursor?: ProviderCallbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCallbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCallbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProviderCallbacks.
     */
    distinct?: ProviderCallbackScalarFieldEnum | ProviderCallbackScalarFieldEnum[]
  }

  /**
   * ProviderCallback findMany
   */
  export type ProviderCallbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter, which ProviderCallbacks to fetch.
     */
    where?: ProviderCallbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProviderCallbacks to fetch.
     */
    orderBy?: ProviderCallbackOrderByWithRelationInput | ProviderCallbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProviderCallbacks.
     */
    cursor?: ProviderCallbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProviderCallbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProviderCallbacks.
     */
    skip?: number
    distinct?: ProviderCallbackScalarFieldEnum | ProviderCallbackScalarFieldEnum[]
  }

  /**
   * ProviderCallback create
   */
  export type ProviderCallbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * The data needed to create a ProviderCallback.
     */
    data: XOR<ProviderCallbackCreateInput, ProviderCallbackUncheckedCreateInput>
  }

  /**
   * ProviderCallback createMany
   */
  export type ProviderCallbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProviderCallbacks.
     */
    data: ProviderCallbackCreateManyInput | ProviderCallbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderCallback createManyAndReturn
   */
  export type ProviderCallbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProviderCallbacks.
     */
    data: ProviderCallbackCreateManyInput | ProviderCallbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProviderCallback update
   */
  export type ProviderCallbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * The data needed to update a ProviderCallback.
     */
    data: XOR<ProviderCallbackUpdateInput, ProviderCallbackUncheckedUpdateInput>
    /**
     * Choose, which ProviderCallback to update.
     */
    where: ProviderCallbackWhereUniqueInput
  }

  /**
   * ProviderCallback updateMany
   */
  export type ProviderCallbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProviderCallbacks.
     */
    data: XOR<ProviderCallbackUpdateManyMutationInput, ProviderCallbackUncheckedUpdateManyInput>
    /**
     * Filter which ProviderCallbacks to update
     */
    where?: ProviderCallbackWhereInput
  }

  /**
   * ProviderCallback upsert
   */
  export type ProviderCallbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * The filter to search for the ProviderCallback to update in case it exists.
     */
    where: ProviderCallbackWhereUniqueInput
    /**
     * In case the ProviderCallback found by the `where` argument doesn't exist, create a new ProviderCallback with this data.
     */
    create: XOR<ProviderCallbackCreateInput, ProviderCallbackUncheckedCreateInput>
    /**
     * In case the ProviderCallback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProviderCallbackUpdateInput, ProviderCallbackUncheckedUpdateInput>
  }

  /**
   * ProviderCallback delete
   */
  export type ProviderCallbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
    /**
     * Filter which ProviderCallback to delete.
     */
    where: ProviderCallbackWhereUniqueInput
  }

  /**
   * ProviderCallback deleteMany
   */
  export type ProviderCallbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProviderCallbacks to delete
     */
    where?: ProviderCallbackWhereInput
  }

  /**
   * ProviderCallback without action
   */
  export type ProviderCallbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProviderCallback
     */
    select?: ProviderCallbackSelect<ExtArgs> | null
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


  export const PatientEngagementEventScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    patientDisplayName: 'patientDisplayName',
    patientGender: 'patientGender',
    patientDob: 'patientDob',
    patientAgeYearsAtEvent: 'patientAgeYearsAtEvent',
    patientRef: 'patientRef',
    patientMobileMasked: 'patientMobileMasked',
    sourceSystem: 'sourceSystem',
    sourceModule: 'sourceModule',
    eventType: 'eventType',
    eventSubtype: 'eventSubtype',
    severity: 'severity',
    occurredAt: 'occurredAt',
    entityType: 'entityType',
    entityId: 'entityId',
    payload: 'payload',
    correlationId: 'correlationId',
    dedupeKey: 'dedupeKey',
    createdAt: 'createdAt',
    createdBy: 'createdBy'
  };

  export type PatientEngagementEventScalarFieldEnum = (typeof PatientEngagementEventScalarFieldEnum)[keyof typeof PatientEngagementEventScalarFieldEnum]


  export const EngagementRuleScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    code: 'code',
    name: 'name',
    description: 'description',
    category: 'category',
    triggerEventType: 'triggerEventType',
    triggerEventSubtype: 'triggerEventSubtype',
    conditionExpr: 'conditionExpr',
    scheduleMode: 'scheduleMode',
    delaySeconds: 'delaySeconds',
    actionType: 'actionType',
    actionPayload: 'actionPayload',
    priority: 'priority',
    cooldownSeconds: 'cooldownSeconds',
    idempotencyWindow: 'idempotencyWindow',
    maxExecutionsPerDay: 'maxExecutionsPerDay',
    effectiveFrom: 'effectiveFrom',
    effectiveTo: 'effectiveTo',
    isActive: 'isActive',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
  };

  export type EngagementRuleScalarFieldEnum = (typeof EngagementRuleScalarFieldEnum)[keyof typeof EngagementRuleScalarFieldEnum]


  export const CommunicationTemplateScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    code: 'code',
    name: 'name',
    description: 'description',
    category: 'category',
    channel: 'channel',
    language: 'language',
    subject: 'subject',
    body: 'body',
    variablesSchema: 'variablesSchema',
    approvalStatus: 'approvalStatus',
    approvedAt: 'approvedAt',
    approvedBy: 'approvedBy',
    rejectionReason: 'rejectionReason',
    version: 'version',
    contentHash: 'contentHash',
    isActive: 'isActive',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    deletedAt: 'deletedAt',
    deletedBy: 'deletedBy'
  };

  export type CommunicationTemplateScalarFieldEnum = (typeof CommunicationTemplateScalarFieldEnum)[keyof typeof CommunicationTemplateScalarFieldEnum]


  export const PatientPreferenceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    preferredLanguage: 'preferredLanguage',
    channelOrder: 'channelOrder',
    quietHoursStart: 'quietHoursStart',
    quietHoursEnd: 'quietHoursEnd',
    timezone: 'timezone',
    dndEnabled: 'dndEnabled',
    dndUntil: 'dndUntil',
    smsOptOut: 'smsOptOut',
    emailOptOut: 'emailOptOut',
    whatsappOptOut: 'whatsappOptOut',
    guardianName: 'guardianName',
    guardianContact: 'guardianContact',
    guardianRef: 'guardianRef',
    notes: 'notes',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy'
  };

  export type PatientPreferenceScalarFieldEnum = (typeof PatientPreferenceScalarFieldEnum)[keyof typeof PatientPreferenceScalarFieldEnum]


  export const PatientMessageScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    patientDisplayName: 'patientDisplayName',
    patientGender: 'patientGender',
    patientRef: 'patientRef',
    direction: 'direction',
    channel: 'channel',
    toAddress: 'toAddress',
    fromAddress: 'fromAddress',
    templateId: 'templateId',
    templateVersion: 'templateVersion',
    subject: 'subject',
    bodyRendered: 'bodyRendered',
    variablesUsed: 'variablesUsed',
    purpose: 'purpose',
    consentReferenceId: 'consentReferenceId',
    relatedEventId: 'relatedEventId',
    relatedEntityType: 'relatedEntityType',
    relatedEntityId: 'relatedEntityId',
    providerMessageId: 'providerMessageId',
    status: 'status',
    statusReason: 'statusReason',
    sentAt: 'sentAt',
    deliveredAt: 'deliveredAt',
    readAt: 'readAt',
    failedAt: 'failedAt',
    retryCount: 'retryCount',
    idempotencyKey: 'idempotencyKey',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy'
  };

  export type PatientMessageScalarFieldEnum = (typeof PatientMessageScalarFieldEnum)[keyof typeof PatientMessageScalarFieldEnum]


  export const PatientTaskScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    patientDisplayName: 'patientDisplayName',
    patientGender: 'patientGender',
    patientAgeYearsAtEvent: 'patientAgeYearsAtEvent',
    patientRef: 'patientRef',
    taskType: 'taskType',
    title: 'title',
    description: 'description',
    priority: 'priority',
    assignedToUserId: 'assignedToUserId',
    assignedToRole: 'assignedToRole',
    status: 'status',
    dueAt: 'dueAt',
    completedAt: 'completedAt',
    cancelledAt: 'cancelledAt',
    outcome: 'outcome',
    outcomeDetails: 'outcomeDetails',
    relatedEventId: 'relatedEventId',
    relatedEntityType: 'relatedEntityType',
    relatedEntityId: 'relatedEntityId',
    createdAt: 'createdAt',
    createdBy: 'createdBy',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy'
  };

  export type PatientTaskScalarFieldEnum = (typeof PatientTaskScalarFieldEnum)[keyof typeof PatientTaskScalarFieldEnum]


  export const EngagementRuleRunScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    ruleId: 'ruleId',
    eventId: 'eventId',
    decision: 'decision',
    skipReason: 'skipReason',
    actionResult: 'actionResult',
    correlationId: 'correlationId',
    evaluatedAt: 'evaluatedAt'
  };

  export type EngagementRuleRunScalarFieldEnum = (typeof EngagementRuleRunScalarFieldEnum)[keyof typeof EngagementRuleRunScalarFieldEnum]


  export const PrmJobScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    jobType: 'jobType',
    payload: 'payload',
    runAt: 'runAt',
    status: 'status',
    attempts: 'attempts',
    maxAttempts: 'maxAttempts',
    lockedAt: 'lockedAt',
    lockedBy: 'lockedBy',
    lastError: 'lastError',
    idempotencyKey: 'idempotencyKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PrmJobScalarFieldEnum = (typeof PrmJobScalarFieldEnum)[keyof typeof PrmJobScalarFieldEnum]


  export const ProviderCallbackScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    channel: 'channel',
    providerMessageId: 'providerMessageId',
    receivedAt: 'receivedAt',
    payload: 'payload',
    processed: 'processed',
    processedAt: 'processedAt'
  };

  export type ProviderCallbackScalarFieldEnum = (typeof ProviderCallbackScalarFieldEnum)[keyof typeof ProviderCallbackScalarFieldEnum]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


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


  export type PatientEngagementEventWhereInput = {
    AND?: PatientEngagementEventWhereInput | PatientEngagementEventWhereInput[]
    OR?: PatientEngagementEventWhereInput[]
    NOT?: PatientEngagementEventWhereInput | PatientEngagementEventWhereInput[]
    id?: UuidFilter<"PatientEngagementEvent"> | string
    tenantId?: UuidFilter<"PatientEngagementEvent"> | string
    patientId?: UuidFilter<"PatientEngagementEvent"> | string
    patientDisplayName?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientGender?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientDob?: DateTimeNullableFilter<"PatientEngagementEvent"> | Date | string | null
    patientAgeYearsAtEvent?: IntNullableFilter<"PatientEngagementEvent"> | number | null
    patientRef?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientMobileMasked?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    sourceSystem?: StringFilter<"PatientEngagementEvent"> | string
    sourceModule?: StringFilter<"PatientEngagementEvent"> | string
    eventType?: StringFilter<"PatientEngagementEvent"> | string
    eventSubtype?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    severity?: IntFilter<"PatientEngagementEvent"> | number
    occurredAt?: DateTimeFilter<"PatientEngagementEvent"> | Date | string
    entityType?: StringFilter<"PatientEngagementEvent"> | string
    entityId?: UuidFilter<"PatientEngagementEvent"> | string
    payload?: JsonFilter<"PatientEngagementEvent">
    correlationId?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    dedupeKey?: StringFilter<"PatientEngagementEvent"> | string
    createdAt?: DateTimeFilter<"PatientEngagementEvent"> | Date | string
    createdBy?: UuidNullableFilter<"PatientEngagementEvent"> | string | null
    ruleRuns?: EngagementRuleRunListRelationFilter
    relatedMessages?: PatientMessageListRelationFilter
    relatedTasks?: PatientTaskListRelationFilter
  }

  export type PatientEngagementEventOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientDob?: SortOrderInput | SortOrder
    patientAgeYearsAtEvent?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    patientMobileMasked?: SortOrderInput | SortOrder
    sourceSystem?: SortOrder
    sourceModule?: SortOrder
    eventType?: SortOrder
    eventSubtype?: SortOrderInput | SortOrder
    severity?: SortOrder
    occurredAt?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    payload?: SortOrder
    correlationId?: SortOrderInput | SortOrder
    dedupeKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    ruleRuns?: EngagementRuleRunOrderByRelationAggregateInput
    relatedMessages?: PatientMessageOrderByRelationAggregateInput
    relatedTasks?: PatientTaskOrderByRelationAggregateInput
  }

  export type PatientEngagementEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idx_events_tenant_dedupe?: PatientEngagementEventIdx_events_tenant_dedupeCompoundUniqueInput
    AND?: PatientEngagementEventWhereInput | PatientEngagementEventWhereInput[]
    OR?: PatientEngagementEventWhereInput[]
    NOT?: PatientEngagementEventWhereInput | PatientEngagementEventWhereInput[]
    tenantId?: UuidFilter<"PatientEngagementEvent"> | string
    patientId?: UuidFilter<"PatientEngagementEvent"> | string
    patientDisplayName?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientGender?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientDob?: DateTimeNullableFilter<"PatientEngagementEvent"> | Date | string | null
    patientAgeYearsAtEvent?: IntNullableFilter<"PatientEngagementEvent"> | number | null
    patientRef?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    patientMobileMasked?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    sourceSystem?: StringFilter<"PatientEngagementEvent"> | string
    sourceModule?: StringFilter<"PatientEngagementEvent"> | string
    eventType?: StringFilter<"PatientEngagementEvent"> | string
    eventSubtype?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    severity?: IntFilter<"PatientEngagementEvent"> | number
    occurredAt?: DateTimeFilter<"PatientEngagementEvent"> | Date | string
    entityType?: StringFilter<"PatientEngagementEvent"> | string
    entityId?: UuidFilter<"PatientEngagementEvent"> | string
    payload?: JsonFilter<"PatientEngagementEvent">
    correlationId?: StringNullableFilter<"PatientEngagementEvent"> | string | null
    dedupeKey?: StringFilter<"PatientEngagementEvent"> | string
    createdAt?: DateTimeFilter<"PatientEngagementEvent"> | Date | string
    createdBy?: UuidNullableFilter<"PatientEngagementEvent"> | string | null
    ruleRuns?: EngagementRuleRunListRelationFilter
    relatedMessages?: PatientMessageListRelationFilter
    relatedTasks?: PatientTaskListRelationFilter
  }, "id" | "idx_events_tenant_dedupe">

  export type PatientEngagementEventOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientDob?: SortOrderInput | SortOrder
    patientAgeYearsAtEvent?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    patientMobileMasked?: SortOrderInput | SortOrder
    sourceSystem?: SortOrder
    sourceModule?: SortOrder
    eventType?: SortOrder
    eventSubtype?: SortOrderInput | SortOrder
    severity?: SortOrder
    occurredAt?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    payload?: SortOrder
    correlationId?: SortOrderInput | SortOrder
    dedupeKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    _count?: PatientEngagementEventCountOrderByAggregateInput
    _avg?: PatientEngagementEventAvgOrderByAggregateInput
    _max?: PatientEngagementEventMaxOrderByAggregateInput
    _min?: PatientEngagementEventMinOrderByAggregateInput
    _sum?: PatientEngagementEventSumOrderByAggregateInput
  }

  export type PatientEngagementEventScalarWhereWithAggregatesInput = {
    AND?: PatientEngagementEventScalarWhereWithAggregatesInput | PatientEngagementEventScalarWhereWithAggregatesInput[]
    OR?: PatientEngagementEventScalarWhereWithAggregatesInput[]
    NOT?: PatientEngagementEventScalarWhereWithAggregatesInput | PatientEngagementEventScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientEngagementEvent"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientEngagementEvent"> | string
    patientId?: UuidWithAggregatesFilter<"PatientEngagementEvent"> | string
    patientDisplayName?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    patientGender?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    patientDob?: DateTimeNullableWithAggregatesFilter<"PatientEngagementEvent"> | Date | string | null
    patientAgeYearsAtEvent?: IntNullableWithAggregatesFilter<"PatientEngagementEvent"> | number | null
    patientRef?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    patientMobileMasked?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    sourceSystem?: StringWithAggregatesFilter<"PatientEngagementEvent"> | string
    sourceModule?: StringWithAggregatesFilter<"PatientEngagementEvent"> | string
    eventType?: StringWithAggregatesFilter<"PatientEngagementEvent"> | string
    eventSubtype?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    severity?: IntWithAggregatesFilter<"PatientEngagementEvent"> | number
    occurredAt?: DateTimeWithAggregatesFilter<"PatientEngagementEvent"> | Date | string
    entityType?: StringWithAggregatesFilter<"PatientEngagementEvent"> | string
    entityId?: UuidWithAggregatesFilter<"PatientEngagementEvent"> | string
    payload?: JsonWithAggregatesFilter<"PatientEngagementEvent">
    correlationId?: StringNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
    dedupeKey?: StringWithAggregatesFilter<"PatientEngagementEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PatientEngagementEvent"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"PatientEngagementEvent"> | string | null
  }

  export type EngagementRuleWhereInput = {
    AND?: EngagementRuleWhereInput | EngagementRuleWhereInput[]
    OR?: EngagementRuleWhereInput[]
    NOT?: EngagementRuleWhereInput | EngagementRuleWhereInput[]
    id?: UuidFilter<"EngagementRule"> | string
    tenantId?: UuidFilter<"EngagementRule"> | string
    code?: StringFilter<"EngagementRule"> | string
    name?: StringFilter<"EngagementRule"> | string
    description?: StringNullableFilter<"EngagementRule"> | string | null
    category?: StringFilter<"EngagementRule"> | string
    triggerEventType?: StringFilter<"EngagementRule"> | string
    triggerEventSubtype?: StringNullableFilter<"EngagementRule"> | string | null
    conditionExpr?: JsonFilter<"EngagementRule">
    scheduleMode?: StringFilter<"EngagementRule"> | string
    delaySeconds?: IntNullableFilter<"EngagementRule"> | number | null
    actionType?: StringFilter<"EngagementRule"> | string
    actionPayload?: JsonFilter<"EngagementRule">
    priority?: IntFilter<"EngagementRule"> | number
    cooldownSeconds?: IntNullableFilter<"EngagementRule"> | number | null
    idempotencyWindow?: IntNullableFilter<"EngagementRule"> | number | null
    maxExecutionsPerDay?: IntNullableFilter<"EngagementRule"> | number | null
    effectiveFrom?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    effectiveTo?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    isActive?: BoolFilter<"EngagementRule"> | boolean
    createdAt?: DateTimeFilter<"EngagementRule"> | Date | string
    createdBy?: UuidFilter<"EngagementRule"> | string
    updatedAt?: DateTimeFilter<"EngagementRule"> | Date | string
    updatedBy?: UuidNullableFilter<"EngagementRule"> | string | null
    deletedAt?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    deletedBy?: UuidNullableFilter<"EngagementRule"> | string | null
    ruleRuns?: EngagementRuleRunListRelationFilter
  }

  export type EngagementRuleOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    triggerEventType?: SortOrder
    triggerEventSubtype?: SortOrderInput | SortOrder
    conditionExpr?: SortOrder
    scheduleMode?: SortOrder
    delaySeconds?: SortOrderInput | SortOrder
    actionType?: SortOrder
    actionPayload?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrderInput | SortOrder
    idempotencyWindow?: SortOrderInput | SortOrder
    maxExecutionsPerDay?: SortOrderInput | SortOrder
    effectiveFrom?: SortOrderInput | SortOrder
    effectiveTo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    ruleRuns?: EngagementRuleRunOrderByRelationAggregateInput
  }

  export type EngagementRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idx_rules_tenant_code?: EngagementRuleIdx_rules_tenant_codeCompoundUniqueInput
    AND?: EngagementRuleWhereInput | EngagementRuleWhereInput[]
    OR?: EngagementRuleWhereInput[]
    NOT?: EngagementRuleWhereInput | EngagementRuleWhereInput[]
    tenantId?: UuidFilter<"EngagementRule"> | string
    code?: StringFilter<"EngagementRule"> | string
    name?: StringFilter<"EngagementRule"> | string
    description?: StringNullableFilter<"EngagementRule"> | string | null
    category?: StringFilter<"EngagementRule"> | string
    triggerEventType?: StringFilter<"EngagementRule"> | string
    triggerEventSubtype?: StringNullableFilter<"EngagementRule"> | string | null
    conditionExpr?: JsonFilter<"EngagementRule">
    scheduleMode?: StringFilter<"EngagementRule"> | string
    delaySeconds?: IntNullableFilter<"EngagementRule"> | number | null
    actionType?: StringFilter<"EngagementRule"> | string
    actionPayload?: JsonFilter<"EngagementRule">
    priority?: IntFilter<"EngagementRule"> | number
    cooldownSeconds?: IntNullableFilter<"EngagementRule"> | number | null
    idempotencyWindow?: IntNullableFilter<"EngagementRule"> | number | null
    maxExecutionsPerDay?: IntNullableFilter<"EngagementRule"> | number | null
    effectiveFrom?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    effectiveTo?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    isActive?: BoolFilter<"EngagementRule"> | boolean
    createdAt?: DateTimeFilter<"EngagementRule"> | Date | string
    createdBy?: UuidFilter<"EngagementRule"> | string
    updatedAt?: DateTimeFilter<"EngagementRule"> | Date | string
    updatedBy?: UuidNullableFilter<"EngagementRule"> | string | null
    deletedAt?: DateTimeNullableFilter<"EngagementRule"> | Date | string | null
    deletedBy?: UuidNullableFilter<"EngagementRule"> | string | null
    ruleRuns?: EngagementRuleRunListRelationFilter
  }, "id" | "idx_rules_tenant_code">

  export type EngagementRuleOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    triggerEventType?: SortOrder
    triggerEventSubtype?: SortOrderInput | SortOrder
    conditionExpr?: SortOrder
    scheduleMode?: SortOrder
    delaySeconds?: SortOrderInput | SortOrder
    actionType?: SortOrder
    actionPayload?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrderInput | SortOrder
    idempotencyWindow?: SortOrderInput | SortOrder
    maxExecutionsPerDay?: SortOrderInput | SortOrder
    effectiveFrom?: SortOrderInput | SortOrder
    effectiveTo?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    _count?: EngagementRuleCountOrderByAggregateInput
    _avg?: EngagementRuleAvgOrderByAggregateInput
    _max?: EngagementRuleMaxOrderByAggregateInput
    _min?: EngagementRuleMinOrderByAggregateInput
    _sum?: EngagementRuleSumOrderByAggregateInput
  }

  export type EngagementRuleScalarWhereWithAggregatesInput = {
    AND?: EngagementRuleScalarWhereWithAggregatesInput | EngagementRuleScalarWhereWithAggregatesInput[]
    OR?: EngagementRuleScalarWhereWithAggregatesInput[]
    NOT?: EngagementRuleScalarWhereWithAggregatesInput | EngagementRuleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EngagementRule"> | string
    tenantId?: UuidWithAggregatesFilter<"EngagementRule"> | string
    code?: StringWithAggregatesFilter<"EngagementRule"> | string
    name?: StringWithAggregatesFilter<"EngagementRule"> | string
    description?: StringNullableWithAggregatesFilter<"EngagementRule"> | string | null
    category?: StringWithAggregatesFilter<"EngagementRule"> | string
    triggerEventType?: StringWithAggregatesFilter<"EngagementRule"> | string
    triggerEventSubtype?: StringNullableWithAggregatesFilter<"EngagementRule"> | string | null
    conditionExpr?: JsonWithAggregatesFilter<"EngagementRule">
    scheduleMode?: StringWithAggregatesFilter<"EngagementRule"> | string
    delaySeconds?: IntNullableWithAggregatesFilter<"EngagementRule"> | number | null
    actionType?: StringWithAggregatesFilter<"EngagementRule"> | string
    actionPayload?: JsonWithAggregatesFilter<"EngagementRule">
    priority?: IntWithAggregatesFilter<"EngagementRule"> | number
    cooldownSeconds?: IntNullableWithAggregatesFilter<"EngagementRule"> | number | null
    idempotencyWindow?: IntNullableWithAggregatesFilter<"EngagementRule"> | number | null
    maxExecutionsPerDay?: IntNullableWithAggregatesFilter<"EngagementRule"> | number | null
    effectiveFrom?: DateTimeNullableWithAggregatesFilter<"EngagementRule"> | Date | string | null
    effectiveTo?: DateTimeNullableWithAggregatesFilter<"EngagementRule"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"EngagementRule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"EngagementRule"> | Date | string
    createdBy?: UuidWithAggregatesFilter<"EngagementRule"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"EngagementRule"> | Date | string
    updatedBy?: UuidNullableWithAggregatesFilter<"EngagementRule"> | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"EngagementRule"> | Date | string | null
    deletedBy?: UuidNullableWithAggregatesFilter<"EngagementRule"> | string | null
  }

  export type CommunicationTemplateWhereInput = {
    AND?: CommunicationTemplateWhereInput | CommunicationTemplateWhereInput[]
    OR?: CommunicationTemplateWhereInput[]
    NOT?: CommunicationTemplateWhereInput | CommunicationTemplateWhereInput[]
    id?: UuidFilter<"CommunicationTemplate"> | string
    tenantId?: UuidFilter<"CommunicationTemplate"> | string
    code?: StringFilter<"CommunicationTemplate"> | string
    name?: StringFilter<"CommunicationTemplate"> | string
    description?: StringNullableFilter<"CommunicationTemplate"> | string | null
    category?: StringFilter<"CommunicationTemplate"> | string
    channel?: StringFilter<"CommunicationTemplate"> | string
    language?: StringFilter<"CommunicationTemplate"> | string
    subject?: StringNullableFilter<"CommunicationTemplate"> | string | null
    body?: StringFilter<"CommunicationTemplate"> | string
    variablesSchema?: JsonFilter<"CommunicationTemplate">
    approvalStatus?: StringFilter<"CommunicationTemplate"> | string
    approvedAt?: DateTimeNullableFilter<"CommunicationTemplate"> | Date | string | null
    approvedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    rejectionReason?: StringNullableFilter<"CommunicationTemplate"> | string | null
    version?: IntFilter<"CommunicationTemplate"> | number
    contentHash?: StringFilter<"CommunicationTemplate"> | string
    isActive?: BoolFilter<"CommunicationTemplate"> | boolean
    createdAt?: DateTimeFilter<"CommunicationTemplate"> | Date | string
    createdBy?: UuidFilter<"CommunicationTemplate"> | string
    updatedAt?: DateTimeFilter<"CommunicationTemplate"> | Date | string
    updatedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    deletedAt?: DateTimeNullableFilter<"CommunicationTemplate"> | Date | string | null
    deletedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    messages?: PatientMessageListRelationFilter
  }

  export type CommunicationTemplateOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    channel?: SortOrder
    language?: SortOrder
    subject?: SortOrderInput | SortOrder
    body?: SortOrder
    variablesSchema?: SortOrder
    approvalStatus?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    version?: SortOrder
    contentHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    messages?: PatientMessageOrderByRelationAggregateInput
  }

  export type CommunicationTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idx_templates_unique?: CommunicationTemplateIdx_templates_uniqueCompoundUniqueInput
    AND?: CommunicationTemplateWhereInput | CommunicationTemplateWhereInput[]
    OR?: CommunicationTemplateWhereInput[]
    NOT?: CommunicationTemplateWhereInput | CommunicationTemplateWhereInput[]
    tenantId?: UuidFilter<"CommunicationTemplate"> | string
    code?: StringFilter<"CommunicationTemplate"> | string
    name?: StringFilter<"CommunicationTemplate"> | string
    description?: StringNullableFilter<"CommunicationTemplate"> | string | null
    category?: StringFilter<"CommunicationTemplate"> | string
    channel?: StringFilter<"CommunicationTemplate"> | string
    language?: StringFilter<"CommunicationTemplate"> | string
    subject?: StringNullableFilter<"CommunicationTemplate"> | string | null
    body?: StringFilter<"CommunicationTemplate"> | string
    variablesSchema?: JsonFilter<"CommunicationTemplate">
    approvalStatus?: StringFilter<"CommunicationTemplate"> | string
    approvedAt?: DateTimeNullableFilter<"CommunicationTemplate"> | Date | string | null
    approvedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    rejectionReason?: StringNullableFilter<"CommunicationTemplate"> | string | null
    version?: IntFilter<"CommunicationTemplate"> | number
    contentHash?: StringFilter<"CommunicationTemplate"> | string
    isActive?: BoolFilter<"CommunicationTemplate"> | boolean
    createdAt?: DateTimeFilter<"CommunicationTemplate"> | Date | string
    createdBy?: UuidFilter<"CommunicationTemplate"> | string
    updatedAt?: DateTimeFilter<"CommunicationTemplate"> | Date | string
    updatedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    deletedAt?: DateTimeNullableFilter<"CommunicationTemplate"> | Date | string | null
    deletedBy?: UuidNullableFilter<"CommunicationTemplate"> | string | null
    messages?: PatientMessageListRelationFilter
  }, "id" | "idx_templates_unique">

  export type CommunicationTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrder
    channel?: SortOrder
    language?: SortOrder
    subject?: SortOrderInput | SortOrder
    body?: SortOrder
    variablesSchema?: SortOrder
    approvalStatus?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    approvedBy?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    version?: SortOrder
    contentHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    deletedAt?: SortOrderInput | SortOrder
    deletedBy?: SortOrderInput | SortOrder
    _count?: CommunicationTemplateCountOrderByAggregateInput
    _avg?: CommunicationTemplateAvgOrderByAggregateInput
    _max?: CommunicationTemplateMaxOrderByAggregateInput
    _min?: CommunicationTemplateMinOrderByAggregateInput
    _sum?: CommunicationTemplateSumOrderByAggregateInput
  }

  export type CommunicationTemplateScalarWhereWithAggregatesInput = {
    AND?: CommunicationTemplateScalarWhereWithAggregatesInput | CommunicationTemplateScalarWhereWithAggregatesInput[]
    OR?: CommunicationTemplateScalarWhereWithAggregatesInput[]
    NOT?: CommunicationTemplateScalarWhereWithAggregatesInput | CommunicationTemplateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CommunicationTemplate"> | string
    tenantId?: UuidWithAggregatesFilter<"CommunicationTemplate"> | string
    code?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    name?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    description?: StringNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
    category?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    channel?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    language?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    subject?: StringNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
    body?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    variablesSchema?: JsonWithAggregatesFilter<"CommunicationTemplate">
    approvalStatus?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    approvedAt?: DateTimeNullableWithAggregatesFilter<"CommunicationTemplate"> | Date | string | null
    approvedBy?: UuidNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
    version?: IntWithAggregatesFilter<"CommunicationTemplate"> | number
    contentHash?: StringWithAggregatesFilter<"CommunicationTemplate"> | string
    isActive?: BoolWithAggregatesFilter<"CommunicationTemplate"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CommunicationTemplate"> | Date | string
    createdBy?: UuidWithAggregatesFilter<"CommunicationTemplate"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"CommunicationTemplate"> | Date | string
    updatedBy?: UuidNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
    deletedAt?: DateTimeNullableWithAggregatesFilter<"CommunicationTemplate"> | Date | string | null
    deletedBy?: UuidNullableWithAggregatesFilter<"CommunicationTemplate"> | string | null
  }

  export type PatientPreferenceWhereInput = {
    AND?: PatientPreferenceWhereInput | PatientPreferenceWhereInput[]
    OR?: PatientPreferenceWhereInput[]
    NOT?: PatientPreferenceWhereInput | PatientPreferenceWhereInput[]
    id?: UuidFilter<"PatientPreference"> | string
    tenantId?: UuidFilter<"PatientPreference"> | string
    patientId?: UuidFilter<"PatientPreference"> | string
    preferredLanguage?: StringFilter<"PatientPreference"> | string
    channelOrder?: JsonFilter<"PatientPreference">
    quietHoursStart?: StringNullableFilter<"PatientPreference"> | string | null
    quietHoursEnd?: StringNullableFilter<"PatientPreference"> | string | null
    timezone?: StringFilter<"PatientPreference"> | string
    dndEnabled?: BoolFilter<"PatientPreference"> | boolean
    dndUntil?: DateTimeNullableFilter<"PatientPreference"> | Date | string | null
    smsOptOut?: BoolFilter<"PatientPreference"> | boolean
    emailOptOut?: BoolFilter<"PatientPreference"> | boolean
    whatsappOptOut?: BoolFilter<"PatientPreference"> | boolean
    guardianName?: StringNullableFilter<"PatientPreference"> | string | null
    guardianContact?: StringNullableFilter<"PatientPreference"> | string | null
    guardianRef?: UuidNullableFilter<"PatientPreference"> | string | null
    notes?: StringNullableFilter<"PatientPreference"> | string | null
    createdAt?: DateTimeFilter<"PatientPreference"> | Date | string
    createdBy?: UuidNullableFilter<"PatientPreference"> | string | null
    updatedAt?: DateTimeFilter<"PatientPreference"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientPreference"> | string | null
  }

  export type PatientPreferenceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    preferredLanguage?: SortOrder
    channelOrder?: SortOrder
    quietHoursStart?: SortOrderInput | SortOrder
    quietHoursEnd?: SortOrderInput | SortOrder
    timezone?: SortOrder
    dndEnabled?: SortOrder
    dndUntil?: SortOrderInput | SortOrder
    smsOptOut?: SortOrder
    emailOptOut?: SortOrder
    whatsappOptOut?: SortOrder
    guardianName?: SortOrderInput | SortOrder
    guardianContact?: SortOrderInput | SortOrder
    guardianRef?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
  }

  export type PatientPreferenceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idx_prefs_tenant_patient?: PatientPreferenceIdx_prefs_tenant_patientCompoundUniqueInput
    AND?: PatientPreferenceWhereInput | PatientPreferenceWhereInput[]
    OR?: PatientPreferenceWhereInput[]
    NOT?: PatientPreferenceWhereInput | PatientPreferenceWhereInput[]
    tenantId?: UuidFilter<"PatientPreference"> | string
    patientId?: UuidFilter<"PatientPreference"> | string
    preferredLanguage?: StringFilter<"PatientPreference"> | string
    channelOrder?: JsonFilter<"PatientPreference">
    quietHoursStart?: StringNullableFilter<"PatientPreference"> | string | null
    quietHoursEnd?: StringNullableFilter<"PatientPreference"> | string | null
    timezone?: StringFilter<"PatientPreference"> | string
    dndEnabled?: BoolFilter<"PatientPreference"> | boolean
    dndUntil?: DateTimeNullableFilter<"PatientPreference"> | Date | string | null
    smsOptOut?: BoolFilter<"PatientPreference"> | boolean
    emailOptOut?: BoolFilter<"PatientPreference"> | boolean
    whatsappOptOut?: BoolFilter<"PatientPreference"> | boolean
    guardianName?: StringNullableFilter<"PatientPreference"> | string | null
    guardianContact?: StringNullableFilter<"PatientPreference"> | string | null
    guardianRef?: UuidNullableFilter<"PatientPreference"> | string | null
    notes?: StringNullableFilter<"PatientPreference"> | string | null
    createdAt?: DateTimeFilter<"PatientPreference"> | Date | string
    createdBy?: UuidNullableFilter<"PatientPreference"> | string | null
    updatedAt?: DateTimeFilter<"PatientPreference"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientPreference"> | string | null
  }, "id" | "idx_prefs_tenant_patient">

  export type PatientPreferenceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    preferredLanguage?: SortOrder
    channelOrder?: SortOrder
    quietHoursStart?: SortOrderInput | SortOrder
    quietHoursEnd?: SortOrderInput | SortOrder
    timezone?: SortOrder
    dndEnabled?: SortOrder
    dndUntil?: SortOrderInput | SortOrder
    smsOptOut?: SortOrder
    emailOptOut?: SortOrder
    whatsappOptOut?: SortOrder
    guardianName?: SortOrderInput | SortOrder
    guardianContact?: SortOrderInput | SortOrder
    guardianRef?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: PatientPreferenceCountOrderByAggregateInput
    _max?: PatientPreferenceMaxOrderByAggregateInput
    _min?: PatientPreferenceMinOrderByAggregateInput
  }

  export type PatientPreferenceScalarWhereWithAggregatesInput = {
    AND?: PatientPreferenceScalarWhereWithAggregatesInput | PatientPreferenceScalarWhereWithAggregatesInput[]
    OR?: PatientPreferenceScalarWhereWithAggregatesInput[]
    NOT?: PatientPreferenceScalarWhereWithAggregatesInput | PatientPreferenceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientPreference"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientPreference"> | string
    patientId?: UuidWithAggregatesFilter<"PatientPreference"> | string
    preferredLanguage?: StringWithAggregatesFilter<"PatientPreference"> | string
    channelOrder?: JsonWithAggregatesFilter<"PatientPreference">
    quietHoursStart?: StringNullableWithAggregatesFilter<"PatientPreference"> | string | null
    quietHoursEnd?: StringNullableWithAggregatesFilter<"PatientPreference"> | string | null
    timezone?: StringWithAggregatesFilter<"PatientPreference"> | string
    dndEnabled?: BoolWithAggregatesFilter<"PatientPreference"> | boolean
    dndUntil?: DateTimeNullableWithAggregatesFilter<"PatientPreference"> | Date | string | null
    smsOptOut?: BoolWithAggregatesFilter<"PatientPreference"> | boolean
    emailOptOut?: BoolWithAggregatesFilter<"PatientPreference"> | boolean
    whatsappOptOut?: BoolWithAggregatesFilter<"PatientPreference"> | boolean
    guardianName?: StringNullableWithAggregatesFilter<"PatientPreference"> | string | null
    guardianContact?: StringNullableWithAggregatesFilter<"PatientPreference"> | string | null
    guardianRef?: UuidNullableWithAggregatesFilter<"PatientPreference"> | string | null
    notes?: StringNullableWithAggregatesFilter<"PatientPreference"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PatientPreference"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"PatientPreference"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PatientPreference"> | Date | string
    updatedBy?: UuidNullableWithAggregatesFilter<"PatientPreference"> | string | null
  }

  export type PatientMessageWhereInput = {
    AND?: PatientMessageWhereInput | PatientMessageWhereInput[]
    OR?: PatientMessageWhereInput[]
    NOT?: PatientMessageWhereInput | PatientMessageWhereInput[]
    id?: UuidFilter<"PatientMessage"> | string
    tenantId?: UuidFilter<"PatientMessage"> | string
    patientId?: UuidFilter<"PatientMessage"> | string
    patientDisplayName?: StringNullableFilter<"PatientMessage"> | string | null
    patientGender?: StringNullableFilter<"PatientMessage"> | string | null
    patientRef?: StringNullableFilter<"PatientMessage"> | string | null
    direction?: StringFilter<"PatientMessage"> | string
    channel?: StringFilter<"PatientMessage"> | string
    toAddress?: StringNullableFilter<"PatientMessage"> | string | null
    fromAddress?: StringNullableFilter<"PatientMessage"> | string | null
    templateId?: UuidNullableFilter<"PatientMessage"> | string | null
    templateVersion?: IntNullableFilter<"PatientMessage"> | number | null
    subject?: StringNullableFilter<"PatientMessage"> | string | null
    bodyRendered?: StringFilter<"PatientMessage"> | string
    variablesUsed?: JsonNullableFilter<"PatientMessage">
    purpose?: StringFilter<"PatientMessage"> | string
    consentReferenceId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEventId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientMessage"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientMessage"> | string | null
    providerMessageId?: StringNullableFilter<"PatientMessage"> | string | null
    status?: StringFilter<"PatientMessage"> | string
    statusReason?: StringNullableFilter<"PatientMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    retryCount?: IntFilter<"PatientMessage"> | number
    idempotencyKey?: StringFilter<"PatientMessage"> | string
    createdAt?: DateTimeFilter<"PatientMessage"> | Date | string
    createdBy?: UuidNullableFilter<"PatientMessage"> | string | null
    updatedAt?: DateTimeFilter<"PatientMessage"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientMessage"> | string | null
    template?: XOR<CommunicationTemplateNullableRelationFilter, CommunicationTemplateWhereInput> | null
    relatedEvent?: XOR<PatientEngagementEventNullableRelationFilter, PatientEngagementEventWhereInput> | null
  }

  export type PatientMessageOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    direction?: SortOrder
    channel?: SortOrder
    toAddress?: SortOrderInput | SortOrder
    fromAddress?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    templateVersion?: SortOrderInput | SortOrder
    subject?: SortOrderInput | SortOrder
    bodyRendered?: SortOrder
    variablesUsed?: SortOrderInput | SortOrder
    purpose?: SortOrder
    consentReferenceId?: SortOrderInput | SortOrder
    relatedEventId?: SortOrderInput | SortOrder
    relatedEntityType?: SortOrderInput | SortOrder
    relatedEntityId?: SortOrderInput | SortOrder
    providerMessageId?: SortOrderInput | SortOrder
    status?: SortOrder
    statusReason?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    failedAt?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    template?: CommunicationTemplateOrderByWithRelationInput
    relatedEvent?: PatientEngagementEventOrderByWithRelationInput
  }

  export type PatientMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    providerMessageId?: string
    idx_messages_tenant_idempotency?: PatientMessageIdx_messages_tenant_idempotencyCompoundUniqueInput
    AND?: PatientMessageWhereInput | PatientMessageWhereInput[]
    OR?: PatientMessageWhereInput[]
    NOT?: PatientMessageWhereInput | PatientMessageWhereInput[]
    tenantId?: UuidFilter<"PatientMessage"> | string
    patientId?: UuidFilter<"PatientMessage"> | string
    patientDisplayName?: StringNullableFilter<"PatientMessage"> | string | null
    patientGender?: StringNullableFilter<"PatientMessage"> | string | null
    patientRef?: StringNullableFilter<"PatientMessage"> | string | null
    direction?: StringFilter<"PatientMessage"> | string
    channel?: StringFilter<"PatientMessage"> | string
    toAddress?: StringNullableFilter<"PatientMessage"> | string | null
    fromAddress?: StringNullableFilter<"PatientMessage"> | string | null
    templateId?: UuidNullableFilter<"PatientMessage"> | string | null
    templateVersion?: IntNullableFilter<"PatientMessage"> | number | null
    subject?: StringNullableFilter<"PatientMessage"> | string | null
    bodyRendered?: StringFilter<"PatientMessage"> | string
    variablesUsed?: JsonNullableFilter<"PatientMessage">
    purpose?: StringFilter<"PatientMessage"> | string
    consentReferenceId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEventId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientMessage"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientMessage"> | string | null
    status?: StringFilter<"PatientMessage"> | string
    statusReason?: StringNullableFilter<"PatientMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    retryCount?: IntFilter<"PatientMessage"> | number
    idempotencyKey?: StringFilter<"PatientMessage"> | string
    createdAt?: DateTimeFilter<"PatientMessage"> | Date | string
    createdBy?: UuidNullableFilter<"PatientMessage"> | string | null
    updatedAt?: DateTimeFilter<"PatientMessage"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientMessage"> | string | null
    template?: XOR<CommunicationTemplateNullableRelationFilter, CommunicationTemplateWhereInput> | null
    relatedEvent?: XOR<PatientEngagementEventNullableRelationFilter, PatientEngagementEventWhereInput> | null
  }, "id" | "providerMessageId" | "idx_messages_tenant_idempotency">

  export type PatientMessageOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    direction?: SortOrder
    channel?: SortOrder
    toAddress?: SortOrderInput | SortOrder
    fromAddress?: SortOrderInput | SortOrder
    templateId?: SortOrderInput | SortOrder
    templateVersion?: SortOrderInput | SortOrder
    subject?: SortOrderInput | SortOrder
    bodyRendered?: SortOrder
    variablesUsed?: SortOrderInput | SortOrder
    purpose?: SortOrder
    consentReferenceId?: SortOrderInput | SortOrder
    relatedEventId?: SortOrderInput | SortOrder
    relatedEntityType?: SortOrderInput | SortOrder
    relatedEntityId?: SortOrderInput | SortOrder
    providerMessageId?: SortOrderInput | SortOrder
    status?: SortOrder
    statusReason?: SortOrderInput | SortOrder
    sentAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    readAt?: SortOrderInput | SortOrder
    failedAt?: SortOrderInput | SortOrder
    retryCount?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: PatientMessageCountOrderByAggregateInput
    _avg?: PatientMessageAvgOrderByAggregateInput
    _max?: PatientMessageMaxOrderByAggregateInput
    _min?: PatientMessageMinOrderByAggregateInput
    _sum?: PatientMessageSumOrderByAggregateInput
  }

  export type PatientMessageScalarWhereWithAggregatesInput = {
    AND?: PatientMessageScalarWhereWithAggregatesInput | PatientMessageScalarWhereWithAggregatesInput[]
    OR?: PatientMessageScalarWhereWithAggregatesInput[]
    NOT?: PatientMessageScalarWhereWithAggregatesInput | PatientMessageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientMessage"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientMessage"> | string
    patientId?: UuidWithAggregatesFilter<"PatientMessage"> | string
    patientDisplayName?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    patientGender?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    patientRef?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    direction?: StringWithAggregatesFilter<"PatientMessage"> | string
    channel?: StringWithAggregatesFilter<"PatientMessage"> | string
    toAddress?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    fromAddress?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    templateId?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
    templateVersion?: IntNullableWithAggregatesFilter<"PatientMessage"> | number | null
    subject?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    bodyRendered?: StringWithAggregatesFilter<"PatientMessage"> | string
    variablesUsed?: JsonNullableWithAggregatesFilter<"PatientMessage">
    purpose?: StringWithAggregatesFilter<"PatientMessage"> | string
    consentReferenceId?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
    relatedEventId?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
    relatedEntityType?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    relatedEntityId?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
    providerMessageId?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    status?: StringWithAggregatesFilter<"PatientMessage"> | string
    statusReason?: StringNullableWithAggregatesFilter<"PatientMessage"> | string | null
    sentAt?: DateTimeNullableWithAggregatesFilter<"PatientMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"PatientMessage"> | Date | string | null
    readAt?: DateTimeNullableWithAggregatesFilter<"PatientMessage"> | Date | string | null
    failedAt?: DateTimeNullableWithAggregatesFilter<"PatientMessage"> | Date | string | null
    retryCount?: IntWithAggregatesFilter<"PatientMessage"> | number
    idempotencyKey?: StringWithAggregatesFilter<"PatientMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PatientMessage"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PatientMessage"> | Date | string
    updatedBy?: UuidNullableWithAggregatesFilter<"PatientMessage"> | string | null
  }

  export type PatientTaskWhereInput = {
    AND?: PatientTaskWhereInput | PatientTaskWhereInput[]
    OR?: PatientTaskWhereInput[]
    NOT?: PatientTaskWhereInput | PatientTaskWhereInput[]
    id?: UuidFilter<"PatientTask"> | string
    tenantId?: UuidFilter<"PatientTask"> | string
    patientId?: UuidFilter<"PatientTask"> | string
    patientDisplayName?: StringNullableFilter<"PatientTask"> | string | null
    patientGender?: StringNullableFilter<"PatientTask"> | string | null
    patientAgeYearsAtEvent?: IntNullableFilter<"PatientTask"> | number | null
    patientRef?: StringNullableFilter<"PatientTask"> | string | null
    taskType?: StringFilter<"PatientTask"> | string
    title?: StringFilter<"PatientTask"> | string
    description?: StringNullableFilter<"PatientTask"> | string | null
    priority?: IntFilter<"PatientTask"> | number
    assignedToUserId?: UuidNullableFilter<"PatientTask"> | string | null
    assignedToRole?: StringNullableFilter<"PatientTask"> | string | null
    status?: StringFilter<"PatientTask"> | string
    dueAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    outcome?: StringNullableFilter<"PatientTask"> | string | null
    outcomeDetails?: JsonNullableFilter<"PatientTask">
    relatedEventId?: UuidNullableFilter<"PatientTask"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientTask"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientTask"> | string | null
    createdAt?: DateTimeFilter<"PatientTask"> | Date | string
    createdBy?: UuidNullableFilter<"PatientTask"> | string | null
    updatedAt?: DateTimeFilter<"PatientTask"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientTask"> | string | null
    relatedEvent?: XOR<PatientEngagementEventNullableRelationFilter, PatientEngagementEventWhereInput> | null
  }

  export type PatientTaskOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientAgeYearsAtEvent?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    taskType?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    priority?: SortOrder
    assignedToUserId?: SortOrderInput | SortOrder
    assignedToRole?: SortOrderInput | SortOrder
    status?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    outcomeDetails?: SortOrderInput | SortOrder
    relatedEventId?: SortOrderInput | SortOrder
    relatedEntityType?: SortOrderInput | SortOrder
    relatedEntityId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    relatedEvent?: PatientEngagementEventOrderByWithRelationInput
  }

  export type PatientTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientTaskWhereInput | PatientTaskWhereInput[]
    OR?: PatientTaskWhereInput[]
    NOT?: PatientTaskWhereInput | PatientTaskWhereInput[]
    tenantId?: UuidFilter<"PatientTask"> | string
    patientId?: UuidFilter<"PatientTask"> | string
    patientDisplayName?: StringNullableFilter<"PatientTask"> | string | null
    patientGender?: StringNullableFilter<"PatientTask"> | string | null
    patientAgeYearsAtEvent?: IntNullableFilter<"PatientTask"> | number | null
    patientRef?: StringNullableFilter<"PatientTask"> | string | null
    taskType?: StringFilter<"PatientTask"> | string
    title?: StringFilter<"PatientTask"> | string
    description?: StringNullableFilter<"PatientTask"> | string | null
    priority?: IntFilter<"PatientTask"> | number
    assignedToUserId?: UuidNullableFilter<"PatientTask"> | string | null
    assignedToRole?: StringNullableFilter<"PatientTask"> | string | null
    status?: StringFilter<"PatientTask"> | string
    dueAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    outcome?: StringNullableFilter<"PatientTask"> | string | null
    outcomeDetails?: JsonNullableFilter<"PatientTask">
    relatedEventId?: UuidNullableFilter<"PatientTask"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientTask"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientTask"> | string | null
    createdAt?: DateTimeFilter<"PatientTask"> | Date | string
    createdBy?: UuidNullableFilter<"PatientTask"> | string | null
    updatedAt?: DateTimeFilter<"PatientTask"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientTask"> | string | null
    relatedEvent?: XOR<PatientEngagementEventNullableRelationFilter, PatientEngagementEventWhereInput> | null
  }, "id">

  export type PatientTaskOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrderInput | SortOrder
    patientGender?: SortOrderInput | SortOrder
    patientAgeYearsAtEvent?: SortOrderInput | SortOrder
    patientRef?: SortOrderInput | SortOrder
    taskType?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    priority?: SortOrder
    assignedToUserId?: SortOrderInput | SortOrder
    assignedToRole?: SortOrderInput | SortOrder
    status?: SortOrder
    dueAt?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    cancelledAt?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    outcomeDetails?: SortOrderInput | SortOrder
    relatedEventId?: SortOrderInput | SortOrder
    relatedEntityType?: SortOrderInput | SortOrder
    relatedEntityId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: PatientTaskCountOrderByAggregateInput
    _avg?: PatientTaskAvgOrderByAggregateInput
    _max?: PatientTaskMaxOrderByAggregateInput
    _min?: PatientTaskMinOrderByAggregateInput
    _sum?: PatientTaskSumOrderByAggregateInput
  }

  export type PatientTaskScalarWhereWithAggregatesInput = {
    AND?: PatientTaskScalarWhereWithAggregatesInput | PatientTaskScalarWhereWithAggregatesInput[]
    OR?: PatientTaskScalarWhereWithAggregatesInput[]
    NOT?: PatientTaskScalarWhereWithAggregatesInput | PatientTaskScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientTask"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientTask"> | string
    patientId?: UuidWithAggregatesFilter<"PatientTask"> | string
    patientDisplayName?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    patientGender?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    patientAgeYearsAtEvent?: IntNullableWithAggregatesFilter<"PatientTask"> | number | null
    patientRef?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    taskType?: StringWithAggregatesFilter<"PatientTask"> | string
    title?: StringWithAggregatesFilter<"PatientTask"> | string
    description?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    priority?: IntWithAggregatesFilter<"PatientTask"> | number
    assignedToUserId?: UuidNullableWithAggregatesFilter<"PatientTask"> | string | null
    assignedToRole?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    status?: StringWithAggregatesFilter<"PatientTask"> | string
    dueAt?: DateTimeNullableWithAggregatesFilter<"PatientTask"> | Date | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"PatientTask"> | Date | string | null
    cancelledAt?: DateTimeNullableWithAggregatesFilter<"PatientTask"> | Date | string | null
    outcome?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    outcomeDetails?: JsonNullableWithAggregatesFilter<"PatientTask">
    relatedEventId?: UuidNullableWithAggregatesFilter<"PatientTask"> | string | null
    relatedEntityType?: StringNullableWithAggregatesFilter<"PatientTask"> | string | null
    relatedEntityId?: UuidNullableWithAggregatesFilter<"PatientTask"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PatientTask"> | Date | string
    createdBy?: UuidNullableWithAggregatesFilter<"PatientTask"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"PatientTask"> | Date | string
    updatedBy?: UuidNullableWithAggregatesFilter<"PatientTask"> | string | null
  }

  export type EngagementRuleRunWhereInput = {
    AND?: EngagementRuleRunWhereInput | EngagementRuleRunWhereInput[]
    OR?: EngagementRuleRunWhereInput[]
    NOT?: EngagementRuleRunWhereInput | EngagementRuleRunWhereInput[]
    id?: UuidFilter<"EngagementRuleRun"> | string
    tenantId?: UuidFilter<"EngagementRuleRun"> | string
    ruleId?: UuidFilter<"EngagementRuleRun"> | string
    eventId?: UuidFilter<"EngagementRuleRun"> | string
    decision?: StringFilter<"EngagementRuleRun"> | string
    skipReason?: StringNullableFilter<"EngagementRuleRun"> | string | null
    actionResult?: JsonNullableFilter<"EngagementRuleRun">
    correlationId?: StringNullableFilter<"EngagementRuleRun"> | string | null
    evaluatedAt?: DateTimeFilter<"EngagementRuleRun"> | Date | string
    rule?: XOR<EngagementRuleRelationFilter, EngagementRuleWhereInput>
    event?: XOR<PatientEngagementEventRelationFilter, PatientEngagementEventWhereInput>
  }

  export type EngagementRuleRunOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleId?: SortOrder
    eventId?: SortOrder
    decision?: SortOrder
    skipReason?: SortOrderInput | SortOrder
    actionResult?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    evaluatedAt?: SortOrder
    rule?: EngagementRuleOrderByWithRelationInput
    event?: PatientEngagementEventOrderByWithRelationInput
  }

  export type EngagementRuleRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EngagementRuleRunWhereInput | EngagementRuleRunWhereInput[]
    OR?: EngagementRuleRunWhereInput[]
    NOT?: EngagementRuleRunWhereInput | EngagementRuleRunWhereInput[]
    tenantId?: UuidFilter<"EngagementRuleRun"> | string
    ruleId?: UuidFilter<"EngagementRuleRun"> | string
    eventId?: UuidFilter<"EngagementRuleRun"> | string
    decision?: StringFilter<"EngagementRuleRun"> | string
    skipReason?: StringNullableFilter<"EngagementRuleRun"> | string | null
    actionResult?: JsonNullableFilter<"EngagementRuleRun">
    correlationId?: StringNullableFilter<"EngagementRuleRun"> | string | null
    evaluatedAt?: DateTimeFilter<"EngagementRuleRun"> | Date | string
    rule?: XOR<EngagementRuleRelationFilter, EngagementRuleWhereInput>
    event?: XOR<PatientEngagementEventRelationFilter, PatientEngagementEventWhereInput>
  }, "id">

  export type EngagementRuleRunOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleId?: SortOrder
    eventId?: SortOrder
    decision?: SortOrder
    skipReason?: SortOrderInput | SortOrder
    actionResult?: SortOrderInput | SortOrder
    correlationId?: SortOrderInput | SortOrder
    evaluatedAt?: SortOrder
    _count?: EngagementRuleRunCountOrderByAggregateInput
    _max?: EngagementRuleRunMaxOrderByAggregateInput
    _min?: EngagementRuleRunMinOrderByAggregateInput
  }

  export type EngagementRuleRunScalarWhereWithAggregatesInput = {
    AND?: EngagementRuleRunScalarWhereWithAggregatesInput | EngagementRuleRunScalarWhereWithAggregatesInput[]
    OR?: EngagementRuleRunScalarWhereWithAggregatesInput[]
    NOT?: EngagementRuleRunScalarWhereWithAggregatesInput | EngagementRuleRunScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EngagementRuleRun"> | string
    tenantId?: UuidWithAggregatesFilter<"EngagementRuleRun"> | string
    ruleId?: UuidWithAggregatesFilter<"EngagementRuleRun"> | string
    eventId?: UuidWithAggregatesFilter<"EngagementRuleRun"> | string
    decision?: StringWithAggregatesFilter<"EngagementRuleRun"> | string
    skipReason?: StringNullableWithAggregatesFilter<"EngagementRuleRun"> | string | null
    actionResult?: JsonNullableWithAggregatesFilter<"EngagementRuleRun">
    correlationId?: StringNullableWithAggregatesFilter<"EngagementRuleRun"> | string | null
    evaluatedAt?: DateTimeWithAggregatesFilter<"EngagementRuleRun"> | Date | string
  }

  export type PrmJobWhereInput = {
    AND?: PrmJobWhereInput | PrmJobWhereInput[]
    OR?: PrmJobWhereInput[]
    NOT?: PrmJobWhereInput | PrmJobWhereInput[]
    id?: UuidFilter<"PrmJob"> | string
    tenantId?: UuidFilter<"PrmJob"> | string
    patientId?: UuidFilter<"PrmJob"> | string
    jobType?: StringFilter<"PrmJob"> | string
    payload?: JsonFilter<"PrmJob">
    runAt?: DateTimeFilter<"PrmJob"> | Date | string
    status?: StringFilter<"PrmJob"> | string
    attempts?: IntFilter<"PrmJob"> | number
    maxAttempts?: IntFilter<"PrmJob"> | number
    lockedAt?: DateTimeNullableFilter<"PrmJob"> | Date | string | null
    lockedBy?: StringNullableFilter<"PrmJob"> | string | null
    lastError?: StringNullableFilter<"PrmJob"> | string | null
    idempotencyKey?: StringFilter<"PrmJob"> | string
    createdAt?: DateTimeFilter<"PrmJob"> | Date | string
    updatedAt?: DateTimeFilter<"PrmJob"> | Date | string
  }

  export type PrmJobOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    jobType?: SortOrder
    payload?: SortOrder
    runAt?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    lockedBy?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrmJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    idx_jobs_tenant_idempotency?: PrmJobIdx_jobs_tenant_idempotencyCompoundUniqueInput
    AND?: PrmJobWhereInput | PrmJobWhereInput[]
    OR?: PrmJobWhereInput[]
    NOT?: PrmJobWhereInput | PrmJobWhereInput[]
    tenantId?: UuidFilter<"PrmJob"> | string
    patientId?: UuidFilter<"PrmJob"> | string
    jobType?: StringFilter<"PrmJob"> | string
    payload?: JsonFilter<"PrmJob">
    runAt?: DateTimeFilter<"PrmJob"> | Date | string
    status?: StringFilter<"PrmJob"> | string
    attempts?: IntFilter<"PrmJob"> | number
    maxAttempts?: IntFilter<"PrmJob"> | number
    lockedAt?: DateTimeNullableFilter<"PrmJob"> | Date | string | null
    lockedBy?: StringNullableFilter<"PrmJob"> | string | null
    lastError?: StringNullableFilter<"PrmJob"> | string | null
    idempotencyKey?: StringFilter<"PrmJob"> | string
    createdAt?: DateTimeFilter<"PrmJob"> | Date | string
    updatedAt?: DateTimeFilter<"PrmJob"> | Date | string
  }, "id" | "idx_jobs_tenant_idempotency">

  export type PrmJobOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    jobType?: SortOrder
    payload?: SortOrder
    runAt?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    lockedBy?: SortOrderInput | SortOrder
    lastError?: SortOrderInput | SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PrmJobCountOrderByAggregateInput
    _avg?: PrmJobAvgOrderByAggregateInput
    _max?: PrmJobMaxOrderByAggregateInput
    _min?: PrmJobMinOrderByAggregateInput
    _sum?: PrmJobSumOrderByAggregateInput
  }

  export type PrmJobScalarWhereWithAggregatesInput = {
    AND?: PrmJobScalarWhereWithAggregatesInput | PrmJobScalarWhereWithAggregatesInput[]
    OR?: PrmJobScalarWhereWithAggregatesInput[]
    NOT?: PrmJobScalarWhereWithAggregatesInput | PrmJobScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PrmJob"> | string
    tenantId?: UuidWithAggregatesFilter<"PrmJob"> | string
    patientId?: UuidWithAggregatesFilter<"PrmJob"> | string
    jobType?: StringWithAggregatesFilter<"PrmJob"> | string
    payload?: JsonWithAggregatesFilter<"PrmJob">
    runAt?: DateTimeWithAggregatesFilter<"PrmJob"> | Date | string
    status?: StringWithAggregatesFilter<"PrmJob"> | string
    attempts?: IntWithAggregatesFilter<"PrmJob"> | number
    maxAttempts?: IntWithAggregatesFilter<"PrmJob"> | number
    lockedAt?: DateTimeNullableWithAggregatesFilter<"PrmJob"> | Date | string | null
    lockedBy?: StringNullableWithAggregatesFilter<"PrmJob"> | string | null
    lastError?: StringNullableWithAggregatesFilter<"PrmJob"> | string | null
    idempotencyKey?: StringWithAggregatesFilter<"PrmJob"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PrmJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PrmJob"> | Date | string
  }

  export type ProviderCallbackWhereInput = {
    AND?: ProviderCallbackWhereInput | ProviderCallbackWhereInput[]
    OR?: ProviderCallbackWhereInput[]
    NOT?: ProviderCallbackWhereInput | ProviderCallbackWhereInput[]
    id?: UuidFilter<"ProviderCallback"> | string
    tenantId?: UuidFilter<"ProviderCallback"> | string
    channel?: StringFilter<"ProviderCallback"> | string
    providerMessageId?: StringFilter<"ProviderCallback"> | string
    receivedAt?: DateTimeFilter<"ProviderCallback"> | Date | string
    payload?: JsonFilter<"ProviderCallback">
    processed?: BoolFilter<"ProviderCallback"> | boolean
    processedAt?: DateTimeNullableFilter<"ProviderCallback"> | Date | string | null
  }

  export type ProviderCallbackOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    channel?: SortOrder
    providerMessageId?: SortOrder
    receivedAt?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
  }

  export type ProviderCallbackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProviderCallbackWhereInput | ProviderCallbackWhereInput[]
    OR?: ProviderCallbackWhereInput[]
    NOT?: ProviderCallbackWhereInput | ProviderCallbackWhereInput[]
    tenantId?: UuidFilter<"ProviderCallback"> | string
    channel?: StringFilter<"ProviderCallback"> | string
    providerMessageId?: StringFilter<"ProviderCallback"> | string
    receivedAt?: DateTimeFilter<"ProviderCallback"> | Date | string
    payload?: JsonFilter<"ProviderCallback">
    processed?: BoolFilter<"ProviderCallback"> | boolean
    processedAt?: DateTimeNullableFilter<"ProviderCallback"> | Date | string | null
  }, "id">

  export type ProviderCallbackOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    channel?: SortOrder
    providerMessageId?: SortOrder
    receivedAt?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    _count?: ProviderCallbackCountOrderByAggregateInput
    _max?: ProviderCallbackMaxOrderByAggregateInput
    _min?: ProviderCallbackMinOrderByAggregateInput
  }

  export type ProviderCallbackScalarWhereWithAggregatesInput = {
    AND?: ProviderCallbackScalarWhereWithAggregatesInput | ProviderCallbackScalarWhereWithAggregatesInput[]
    OR?: ProviderCallbackScalarWhereWithAggregatesInput[]
    NOT?: ProviderCallbackScalarWhereWithAggregatesInput | ProviderCallbackScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ProviderCallback"> | string
    tenantId?: UuidWithAggregatesFilter<"ProviderCallback"> | string
    channel?: StringWithAggregatesFilter<"ProviderCallback"> | string
    providerMessageId?: StringWithAggregatesFilter<"ProviderCallback"> | string
    receivedAt?: DateTimeWithAggregatesFilter<"ProviderCallback"> | Date | string
    payload?: JsonWithAggregatesFilter<"ProviderCallback">
    processed?: BoolWithAggregatesFilter<"ProviderCallback"> | boolean
    processedAt?: DateTimeNullableWithAggregatesFilter<"ProviderCallback"> | Date | string | null
  }

  export type PatientEngagementEventCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunCreateNestedManyWithoutEventInput
    relatedMessages?: PatientMessageCreateNestedManyWithoutRelatedEventInput
    relatedTasks?: PatientTaskCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunUncheckedCreateNestedManyWithoutEventInput
    relatedMessages?: PatientMessageUncheckedCreateNestedManyWithoutRelatedEventInput
    relatedTasks?: PatientTaskUncheckedCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUpdateManyWithoutEventNestedInput
    relatedMessages?: PatientMessageUpdateManyWithoutRelatedEventNestedInput
    relatedTasks?: PatientTaskUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUncheckedUpdateManyWithoutEventNestedInput
    relatedMessages?: PatientMessageUncheckedUpdateManyWithoutRelatedEventNestedInput
    relatedTasks?: PatientTaskUncheckedUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
  }

  export type PatientEngagementEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientEngagementEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EngagementRuleCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype?: string | null
    conditionExpr: JsonNullValueInput | InputJsonValue
    scheduleMode: string
    delaySeconds?: number | null
    actionType: string
    actionPayload: JsonNullValueInput | InputJsonValue
    priority?: number
    cooldownSeconds?: number | null
    idempotencyWindow?: number | null
    maxExecutionsPerDay?: number | null
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
    ruleRuns?: EngagementRuleRunCreateNestedManyWithoutRuleInput
  }

  export type EngagementRuleUncheckedCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype?: string | null
    conditionExpr: JsonNullValueInput | InputJsonValue
    scheduleMode: string
    delaySeconds?: number | null
    actionType: string
    actionPayload: JsonNullValueInput | InputJsonValue
    priority?: number
    cooldownSeconds?: number | null
    idempotencyWindow?: number | null
    maxExecutionsPerDay?: number | null
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
    ruleRuns?: EngagementRuleRunUncheckedCreateNestedManyWithoutRuleInput
  }

  export type EngagementRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUpdateManyWithoutRuleNestedInput
  }

  export type EngagementRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUncheckedUpdateManyWithoutRuleNestedInput
  }

  export type EngagementRuleCreateManyInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype?: string | null
    conditionExpr: JsonNullValueInput | InputJsonValue
    scheduleMode: string
    delaySeconds?: number | null
    actionType: string
    actionPayload: JsonNullValueInput | InputJsonValue
    priority?: number
    cooldownSeconds?: number | null
    idempotencyWindow?: number | null
    maxExecutionsPerDay?: number | null
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type EngagementRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EngagementRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommunicationTemplateCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    channel: string
    language?: string
    subject?: string | null
    body: string
    variablesSchema: JsonNullValueInput | InputJsonValue
    approvalStatus?: string
    approvedAt?: Date | string | null
    approvedBy?: string | null
    rejectionReason?: string | null
    version?: number
    contentHash: string
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
    messages?: PatientMessageCreateNestedManyWithoutTemplateInput
  }

  export type CommunicationTemplateUncheckedCreateInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    channel: string
    language?: string
    subject?: string | null
    body: string
    variablesSchema: JsonNullValueInput | InputJsonValue
    approvalStatus?: string
    approvedAt?: Date | string | null
    approvedBy?: string | null
    rejectionReason?: string | null
    version?: number
    contentHash: string
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
    messages?: PatientMessageUncheckedCreateNestedManyWithoutTemplateInput
  }

  export type CommunicationTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: PatientMessageUpdateManyWithoutTemplateNestedInput
  }

  export type CommunicationTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
    messages?: PatientMessageUncheckedUpdateManyWithoutTemplateNestedInput
  }

  export type CommunicationTemplateCreateManyInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    channel: string
    language?: string
    subject?: string | null
    body: string
    variablesSchema: JsonNullValueInput | InputJsonValue
    approvalStatus?: string
    approvedAt?: Date | string | null
    approvedBy?: string | null
    rejectionReason?: string | null
    version?: number
    contentHash: string
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type CommunicationTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommunicationTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientPreferenceCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    preferredLanguage?: string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: string | null
    quietHoursEnd?: string | null
    timezone?: string
    dndEnabled?: boolean
    dndUntil?: Date | string | null
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: string | null
    guardianContact?: string | null
    guardianRef?: string | null
    notes?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientPreferenceUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    preferredLanguage?: string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: string | null
    quietHoursEnd?: string | null
    timezone?: string
    dndEnabled?: boolean
    dndUntil?: Date | string | null
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: string | null
    guardianContact?: string | null
    guardianRef?: string | null
    notes?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientPreferenceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: NullableStringFieldUpdateOperationsInput | string | null
    quietHoursEnd?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    dndEnabled?: BoolFieldUpdateOperationsInput | boolean
    dndUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsOptOut?: BoolFieldUpdateOperationsInput | boolean
    emailOptOut?: BoolFieldUpdateOperationsInput | boolean
    whatsappOptOut?: BoolFieldUpdateOperationsInput | boolean
    guardianName?: NullableStringFieldUpdateOperationsInput | string | null
    guardianContact?: NullableStringFieldUpdateOperationsInput | string | null
    guardianRef?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientPreferenceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: NullableStringFieldUpdateOperationsInput | string | null
    quietHoursEnd?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    dndEnabled?: BoolFieldUpdateOperationsInput | boolean
    dndUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsOptOut?: BoolFieldUpdateOperationsInput | boolean
    emailOptOut?: BoolFieldUpdateOperationsInput | boolean
    whatsappOptOut?: BoolFieldUpdateOperationsInput | boolean
    guardianName?: NullableStringFieldUpdateOperationsInput | string | null
    guardianContact?: NullableStringFieldUpdateOperationsInput | string | null
    guardianRef?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientPreferenceCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    preferredLanguage?: string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: string | null
    quietHoursEnd?: string | null
    timezone?: string
    dndEnabled?: boolean
    dndUntil?: Date | string | null
    smsOptOut?: boolean
    emailOptOut?: boolean
    whatsappOptOut?: boolean
    guardianName?: string | null
    guardianContact?: string | null
    guardianRef?: string | null
    notes?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientPreferenceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: NullableStringFieldUpdateOperationsInput | string | null
    quietHoursEnd?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    dndEnabled?: BoolFieldUpdateOperationsInput | boolean
    dndUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsOptOut?: BoolFieldUpdateOperationsInput | boolean
    emailOptOut?: BoolFieldUpdateOperationsInput | boolean
    whatsappOptOut?: BoolFieldUpdateOperationsInput | boolean
    guardianName?: NullableStringFieldUpdateOperationsInput | string | null
    guardianContact?: NullableStringFieldUpdateOperationsInput | string | null
    guardianRef?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientPreferenceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    channelOrder?: JsonNullValueInput | InputJsonValue
    quietHoursStart?: NullableStringFieldUpdateOperationsInput | string | null
    quietHoursEnd?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    dndEnabled?: BoolFieldUpdateOperationsInput | boolean
    dndUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    smsOptOut?: BoolFieldUpdateOperationsInput | boolean
    emailOptOut?: BoolFieldUpdateOperationsInput | boolean
    whatsappOptOut?: BoolFieldUpdateOperationsInput | boolean
    guardianName?: NullableStringFieldUpdateOperationsInput | string | null
    guardianContact?: NullableStringFieldUpdateOperationsInput | string | null
    guardianRef?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientMessageCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
    template?: CommunicationTemplateCreateNestedOneWithoutMessagesInput
    relatedEvent?: PatientEngagementEventCreateNestedOneWithoutRelatedMessagesInput
  }

  export type PatientMessageUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateId?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    template?: CommunicationTemplateUpdateOneWithoutMessagesNestedInput
    relatedEvent?: PatientEngagementEventUpdateOneWithoutRelatedMessagesNestedInput
  }

  export type PatientMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientMessageCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateId?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
    relatedEvent?: PatientEngagementEventCreateNestedOneWithoutRelatedTasksInput
  }

  export type PatientTaskUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientTaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEvent?: PatientEngagementEventUpdateOneWithoutRelatedTasksNestedInput
  }

  export type PatientTaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientTaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EngagementRuleRunCreateInput = {
    id?: string
    tenantId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
    rule: EngagementRuleCreateNestedOneWithoutRuleRunsInput
    event: PatientEngagementEventCreateNestedOneWithoutRuleRunsInput
  }

  export type EngagementRuleRunUncheckedCreateInput = {
    id?: string
    tenantId: string
    ruleId: string
    eventId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type EngagementRuleRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rule?: EngagementRuleUpdateOneRequiredWithoutRuleRunsNestedInput
    event?: PatientEngagementEventUpdateOneRequiredWithoutRuleRunsNestedInput
  }

  export type EngagementRuleRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EngagementRuleRunCreateManyInput = {
    id?: string
    tenantId: string
    ruleId: string
    eventId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type EngagementRuleRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EngagementRuleRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrmJobCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    jobType: string
    payload: JsonNullValueInput | InputJsonValue
    runAt: Date | string
    status?: string
    attempts?: number
    maxAttempts?: number
    lockedAt?: Date | string | null
    lockedBy?: string | null
    lastError?: string | null
    idempotencyKey: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrmJobUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    jobType: string
    payload: JsonNullValueInput | InputJsonValue
    runAt: Date | string
    status?: string
    attempts?: number
    maxAttempts?: number
    lockedAt?: Date | string | null
    lockedBy?: string | null
    lastError?: string | null
    idempotencyKey: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrmJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrmJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrmJobCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    jobType: string
    payload: JsonNullValueInput | InputJsonValue
    runAt: Date | string
    status?: string
    attempts?: number
    maxAttempts?: number
    lockedAt?: Date | string | null
    lockedBy?: string | null
    lastError?: string | null
    idempotencyKey: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PrmJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrmJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    runAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    maxAttempts?: IntFieldUpdateOperationsInput | number
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedBy?: NullableStringFieldUpdateOperationsInput | string | null
    lastError?: NullableStringFieldUpdateOperationsInput | string | null
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProviderCallbackCreateInput = {
    id?: string
    tenantId: string
    channel: string
    providerMessageId: string
    receivedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
  }

  export type ProviderCallbackUncheckedCreateInput = {
    id?: string
    tenantId: string
    channel: string
    providerMessageId: string
    receivedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
  }

  export type ProviderCallbackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    providerMessageId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProviderCallbackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    providerMessageId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProviderCallbackCreateManyInput = {
    id?: string
    tenantId: string
    channel: string
    providerMessageId: string
    receivedAt?: Date | string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
  }

  export type ProviderCallbackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    providerMessageId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProviderCallbackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    providerMessageId?: StringFieldUpdateOperationsInput | string
    receivedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type EngagementRuleRunListRelationFilter = {
    every?: EngagementRuleRunWhereInput
    some?: EngagementRuleRunWhereInput
    none?: EngagementRuleRunWhereInput
  }

  export type PatientMessageListRelationFilter = {
    every?: PatientMessageWhereInput
    some?: PatientMessageWhereInput
    none?: PatientMessageWhereInput
  }

  export type PatientTaskListRelationFilter = {
    every?: PatientTaskWhereInput
    some?: PatientTaskWhereInput
    none?: PatientTaskWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EngagementRuleRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientTaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientEngagementEventIdx_events_tenant_dedupeCompoundUniqueInput = {
    tenantId: string
    dedupeKey: string
  }

  export type PatientEngagementEventCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientDob?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    patientMobileMasked?: SortOrder
    sourceSystem?: SortOrder
    sourceModule?: SortOrder
    eventType?: SortOrder
    eventSubtype?: SortOrder
    severity?: SortOrder
    occurredAt?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    payload?: SortOrder
    correlationId?: SortOrder
    dedupeKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
  }

  export type PatientEngagementEventAvgOrderByAggregateInput = {
    patientAgeYearsAtEvent?: SortOrder
    severity?: SortOrder
  }

  export type PatientEngagementEventMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientDob?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    patientMobileMasked?: SortOrder
    sourceSystem?: SortOrder
    sourceModule?: SortOrder
    eventType?: SortOrder
    eventSubtype?: SortOrder
    severity?: SortOrder
    occurredAt?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    correlationId?: SortOrder
    dedupeKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
  }

  export type PatientEngagementEventMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientDob?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    patientMobileMasked?: SortOrder
    sourceSystem?: SortOrder
    sourceModule?: SortOrder
    eventType?: SortOrder
    eventSubtype?: SortOrder
    severity?: SortOrder
    occurredAt?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    correlationId?: SortOrder
    dedupeKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
  }

  export type PatientEngagementEventSumOrderByAggregateInput = {
    patientAgeYearsAtEvent?: SortOrder
    severity?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EngagementRuleIdx_rules_tenant_codeCompoundUniqueInput = {
    tenantId: string
    code: string
  }

  export type EngagementRuleCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    triggerEventType?: SortOrder
    triggerEventSubtype?: SortOrder
    conditionExpr?: SortOrder
    scheduleMode?: SortOrder
    delaySeconds?: SortOrder
    actionType?: SortOrder
    actionPayload?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrder
    idempotencyWindow?: SortOrder
    maxExecutionsPerDay?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type EngagementRuleAvgOrderByAggregateInput = {
    delaySeconds?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrder
    idempotencyWindow?: SortOrder
    maxExecutionsPerDay?: SortOrder
  }

  export type EngagementRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    triggerEventType?: SortOrder
    triggerEventSubtype?: SortOrder
    scheduleMode?: SortOrder
    delaySeconds?: SortOrder
    actionType?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrder
    idempotencyWindow?: SortOrder
    maxExecutionsPerDay?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type EngagementRuleMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    triggerEventType?: SortOrder
    triggerEventSubtype?: SortOrder
    scheduleMode?: SortOrder
    delaySeconds?: SortOrder
    actionType?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrder
    idempotencyWindow?: SortOrder
    maxExecutionsPerDay?: SortOrder
    effectiveFrom?: SortOrder
    effectiveTo?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type EngagementRuleSumOrderByAggregateInput = {
    delaySeconds?: SortOrder
    priority?: SortOrder
    cooldownSeconds?: SortOrder
    idempotencyWindow?: SortOrder
    maxExecutionsPerDay?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CommunicationTemplateIdx_templates_uniqueCompoundUniqueInput = {
    tenantId: string
    code: string
    language: string
    channel: string
    version: number
  }

  export type CommunicationTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    channel?: SortOrder
    language?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    variablesSchema?: SortOrder
    approvalStatus?: SortOrder
    approvedAt?: SortOrder
    approvedBy?: SortOrder
    rejectionReason?: SortOrder
    version?: SortOrder
    contentHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type CommunicationTemplateAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type CommunicationTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    channel?: SortOrder
    language?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    approvalStatus?: SortOrder
    approvedAt?: SortOrder
    approvedBy?: SortOrder
    rejectionReason?: SortOrder
    version?: SortOrder
    contentHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type CommunicationTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    code?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    channel?: SortOrder
    language?: SortOrder
    subject?: SortOrder
    body?: SortOrder
    approvalStatus?: SortOrder
    approvedAt?: SortOrder
    approvedBy?: SortOrder
    rejectionReason?: SortOrder
    version?: SortOrder
    contentHash?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
    deletedAt?: SortOrder
    deletedBy?: SortOrder
  }

  export type CommunicationTemplateSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type PatientPreferenceIdx_prefs_tenant_patientCompoundUniqueInput = {
    tenantId: string
    patientId: string
  }

  export type PatientPreferenceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    preferredLanguage?: SortOrder
    channelOrder?: SortOrder
    quietHoursStart?: SortOrder
    quietHoursEnd?: SortOrder
    timezone?: SortOrder
    dndEnabled?: SortOrder
    dndUntil?: SortOrder
    smsOptOut?: SortOrder
    emailOptOut?: SortOrder
    whatsappOptOut?: SortOrder
    guardianName?: SortOrder
    guardianContact?: SortOrder
    guardianRef?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientPreferenceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    preferredLanguage?: SortOrder
    quietHoursStart?: SortOrder
    quietHoursEnd?: SortOrder
    timezone?: SortOrder
    dndEnabled?: SortOrder
    dndUntil?: SortOrder
    smsOptOut?: SortOrder
    emailOptOut?: SortOrder
    whatsappOptOut?: SortOrder
    guardianName?: SortOrder
    guardianContact?: SortOrder
    guardianRef?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientPreferenceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    preferredLanguage?: SortOrder
    quietHoursStart?: SortOrder
    quietHoursEnd?: SortOrder
    timezone?: SortOrder
    dndEnabled?: SortOrder
    dndUntil?: SortOrder
    smsOptOut?: SortOrder
    emailOptOut?: SortOrder
    whatsappOptOut?: SortOrder
    guardianName?: SortOrder
    guardianContact?: SortOrder
    guardianRef?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
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

  export type CommunicationTemplateNullableRelationFilter = {
    is?: CommunicationTemplateWhereInput | null
    isNot?: CommunicationTemplateWhereInput | null
  }

  export type PatientEngagementEventNullableRelationFilter = {
    is?: PatientEngagementEventWhereInput | null
    isNot?: PatientEngagementEventWhereInput | null
  }

  export type PatientMessageIdx_messages_tenant_idempotencyCompoundUniqueInput = {
    tenantId: string
    idempotencyKey: string
  }

  export type PatientMessageCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientRef?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    toAddress?: SortOrder
    fromAddress?: SortOrder
    templateId?: SortOrder
    templateVersion?: SortOrder
    subject?: SortOrder
    bodyRendered?: SortOrder
    variablesUsed?: SortOrder
    purpose?: SortOrder
    consentReferenceId?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    providerMessageId?: SortOrder
    status?: SortOrder
    statusReason?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    failedAt?: SortOrder
    retryCount?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientMessageAvgOrderByAggregateInput = {
    templateVersion?: SortOrder
    retryCount?: SortOrder
  }

  export type PatientMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientRef?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    toAddress?: SortOrder
    fromAddress?: SortOrder
    templateId?: SortOrder
    templateVersion?: SortOrder
    subject?: SortOrder
    bodyRendered?: SortOrder
    purpose?: SortOrder
    consentReferenceId?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    providerMessageId?: SortOrder
    status?: SortOrder
    statusReason?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    failedAt?: SortOrder
    retryCount?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientMessageMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientRef?: SortOrder
    direction?: SortOrder
    channel?: SortOrder
    toAddress?: SortOrder
    fromAddress?: SortOrder
    templateId?: SortOrder
    templateVersion?: SortOrder
    subject?: SortOrder
    bodyRendered?: SortOrder
    purpose?: SortOrder
    consentReferenceId?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    providerMessageId?: SortOrder
    status?: SortOrder
    statusReason?: SortOrder
    sentAt?: SortOrder
    deliveredAt?: SortOrder
    readAt?: SortOrder
    failedAt?: SortOrder
    retryCount?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientMessageSumOrderByAggregateInput = {
    templateVersion?: SortOrder
    retryCount?: SortOrder
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

  export type PatientTaskCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    taskType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    assignedToUserId?: SortOrder
    assignedToRole?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    cancelledAt?: SortOrder
    outcome?: SortOrder
    outcomeDetails?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientTaskAvgOrderByAggregateInput = {
    patientAgeYearsAtEvent?: SortOrder
    priority?: SortOrder
  }

  export type PatientTaskMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    taskType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    assignedToUserId?: SortOrder
    assignedToRole?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    cancelledAt?: SortOrder
    outcome?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientTaskMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    patientDisplayName?: SortOrder
    patientGender?: SortOrder
    patientAgeYearsAtEvent?: SortOrder
    patientRef?: SortOrder
    taskType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    priority?: SortOrder
    assignedToUserId?: SortOrder
    assignedToRole?: SortOrder
    status?: SortOrder
    dueAt?: SortOrder
    completedAt?: SortOrder
    cancelledAt?: SortOrder
    outcome?: SortOrder
    relatedEventId?: SortOrder
    relatedEntityType?: SortOrder
    relatedEntityId?: SortOrder
    createdAt?: SortOrder
    createdBy?: SortOrder
    updatedAt?: SortOrder
    updatedBy?: SortOrder
  }

  export type PatientTaskSumOrderByAggregateInput = {
    patientAgeYearsAtEvent?: SortOrder
    priority?: SortOrder
  }

  export type EngagementRuleRelationFilter = {
    is?: EngagementRuleWhereInput
    isNot?: EngagementRuleWhereInput
  }

  export type PatientEngagementEventRelationFilter = {
    is?: PatientEngagementEventWhereInput
    isNot?: PatientEngagementEventWhereInput
  }

  export type EngagementRuleRunCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleId?: SortOrder
    eventId?: SortOrder
    decision?: SortOrder
    skipReason?: SortOrder
    actionResult?: SortOrder
    correlationId?: SortOrder
    evaluatedAt?: SortOrder
  }

  export type EngagementRuleRunMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleId?: SortOrder
    eventId?: SortOrder
    decision?: SortOrder
    skipReason?: SortOrder
    correlationId?: SortOrder
    evaluatedAt?: SortOrder
  }

  export type EngagementRuleRunMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    ruleId?: SortOrder
    eventId?: SortOrder
    decision?: SortOrder
    skipReason?: SortOrder
    correlationId?: SortOrder
    evaluatedAt?: SortOrder
  }

  export type PrmJobIdx_jobs_tenant_idempotencyCompoundUniqueInput = {
    tenantId: string
    idempotencyKey: string
  }

  export type PrmJobCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    jobType?: SortOrder
    payload?: SortOrder
    runAt?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    lockedAt?: SortOrder
    lockedBy?: SortOrder
    lastError?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrmJobAvgOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type PrmJobMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    jobType?: SortOrder
    runAt?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    lockedAt?: SortOrder
    lockedBy?: SortOrder
    lastError?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrmJobMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    jobType?: SortOrder
    runAt?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    maxAttempts?: SortOrder
    lockedAt?: SortOrder
    lockedBy?: SortOrder
    lastError?: SortOrder
    idempotencyKey?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PrmJobSumOrderByAggregateInput = {
    attempts?: SortOrder
    maxAttempts?: SortOrder
  }

  export type ProviderCallbackCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    channel?: SortOrder
    providerMessageId?: SortOrder
    receivedAt?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
  }

  export type ProviderCallbackMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    channel?: SortOrder
    providerMessageId?: SortOrder
    receivedAt?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
  }

  export type ProviderCallbackMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    channel?: SortOrder
    providerMessageId?: SortOrder
    receivedAt?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
  }

  export type EngagementRuleRunCreateNestedManyWithoutEventInput = {
    create?: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput> | EngagementRuleRunCreateWithoutEventInput[] | EngagementRuleRunUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutEventInput | EngagementRuleRunCreateOrConnectWithoutEventInput[]
    createMany?: EngagementRuleRunCreateManyEventInputEnvelope
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
  }

  export type PatientMessageCreateNestedManyWithoutRelatedEventInput = {
    create?: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput> | PatientMessageCreateWithoutRelatedEventInput[] | PatientMessageUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutRelatedEventInput | PatientMessageCreateOrConnectWithoutRelatedEventInput[]
    createMany?: PatientMessageCreateManyRelatedEventInputEnvelope
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
  }

  export type PatientTaskCreateNestedManyWithoutRelatedEventInput = {
    create?: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput> | PatientTaskCreateWithoutRelatedEventInput[] | PatientTaskUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientTaskCreateOrConnectWithoutRelatedEventInput | PatientTaskCreateOrConnectWithoutRelatedEventInput[]
    createMany?: PatientTaskCreateManyRelatedEventInputEnvelope
    connect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
  }

  export type EngagementRuleRunUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput> | EngagementRuleRunCreateWithoutEventInput[] | EngagementRuleRunUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutEventInput | EngagementRuleRunCreateOrConnectWithoutEventInput[]
    createMany?: EngagementRuleRunCreateManyEventInputEnvelope
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
  }

  export type PatientMessageUncheckedCreateNestedManyWithoutRelatedEventInput = {
    create?: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput> | PatientMessageCreateWithoutRelatedEventInput[] | PatientMessageUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutRelatedEventInput | PatientMessageCreateOrConnectWithoutRelatedEventInput[]
    createMany?: PatientMessageCreateManyRelatedEventInputEnvelope
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
  }

  export type PatientTaskUncheckedCreateNestedManyWithoutRelatedEventInput = {
    create?: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput> | PatientTaskCreateWithoutRelatedEventInput[] | PatientTaskUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientTaskCreateOrConnectWithoutRelatedEventInput | PatientTaskCreateOrConnectWithoutRelatedEventInput[]
    createMany?: PatientTaskCreateManyRelatedEventInputEnvelope
    connect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EngagementRuleRunUpdateManyWithoutEventNestedInput = {
    create?: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput> | EngagementRuleRunCreateWithoutEventInput[] | EngagementRuleRunUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutEventInput | EngagementRuleRunCreateOrConnectWithoutEventInput[]
    upsert?: EngagementRuleRunUpsertWithWhereUniqueWithoutEventInput | EngagementRuleRunUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EngagementRuleRunCreateManyEventInputEnvelope
    set?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    disconnect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    delete?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    update?: EngagementRuleRunUpdateWithWhereUniqueWithoutEventInput | EngagementRuleRunUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EngagementRuleRunUpdateManyWithWhereWithoutEventInput | EngagementRuleRunUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
  }

  export type PatientMessageUpdateManyWithoutRelatedEventNestedInput = {
    create?: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput> | PatientMessageCreateWithoutRelatedEventInput[] | PatientMessageUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutRelatedEventInput | PatientMessageCreateOrConnectWithoutRelatedEventInput[]
    upsert?: PatientMessageUpsertWithWhereUniqueWithoutRelatedEventInput | PatientMessageUpsertWithWhereUniqueWithoutRelatedEventInput[]
    createMany?: PatientMessageCreateManyRelatedEventInputEnvelope
    set?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    disconnect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    delete?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    update?: PatientMessageUpdateWithWhereUniqueWithoutRelatedEventInput | PatientMessageUpdateWithWhereUniqueWithoutRelatedEventInput[]
    updateMany?: PatientMessageUpdateManyWithWhereWithoutRelatedEventInput | PatientMessageUpdateManyWithWhereWithoutRelatedEventInput[]
    deleteMany?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
  }

  export type PatientTaskUpdateManyWithoutRelatedEventNestedInput = {
    create?: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput> | PatientTaskCreateWithoutRelatedEventInput[] | PatientTaskUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientTaskCreateOrConnectWithoutRelatedEventInput | PatientTaskCreateOrConnectWithoutRelatedEventInput[]
    upsert?: PatientTaskUpsertWithWhereUniqueWithoutRelatedEventInput | PatientTaskUpsertWithWhereUniqueWithoutRelatedEventInput[]
    createMany?: PatientTaskCreateManyRelatedEventInputEnvelope
    set?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    disconnect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    delete?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    connect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    update?: PatientTaskUpdateWithWhereUniqueWithoutRelatedEventInput | PatientTaskUpdateWithWhereUniqueWithoutRelatedEventInput[]
    updateMany?: PatientTaskUpdateManyWithWhereWithoutRelatedEventInput | PatientTaskUpdateManyWithWhereWithoutRelatedEventInput[]
    deleteMany?: PatientTaskScalarWhereInput | PatientTaskScalarWhereInput[]
  }

  export type EngagementRuleRunUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput> | EngagementRuleRunCreateWithoutEventInput[] | EngagementRuleRunUncheckedCreateWithoutEventInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutEventInput | EngagementRuleRunCreateOrConnectWithoutEventInput[]
    upsert?: EngagementRuleRunUpsertWithWhereUniqueWithoutEventInput | EngagementRuleRunUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: EngagementRuleRunCreateManyEventInputEnvelope
    set?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    disconnect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    delete?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    update?: EngagementRuleRunUpdateWithWhereUniqueWithoutEventInput | EngagementRuleRunUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: EngagementRuleRunUpdateManyWithWhereWithoutEventInput | EngagementRuleRunUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
  }

  export type PatientMessageUncheckedUpdateManyWithoutRelatedEventNestedInput = {
    create?: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput> | PatientMessageCreateWithoutRelatedEventInput[] | PatientMessageUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutRelatedEventInput | PatientMessageCreateOrConnectWithoutRelatedEventInput[]
    upsert?: PatientMessageUpsertWithWhereUniqueWithoutRelatedEventInput | PatientMessageUpsertWithWhereUniqueWithoutRelatedEventInput[]
    createMany?: PatientMessageCreateManyRelatedEventInputEnvelope
    set?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    disconnect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    delete?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    update?: PatientMessageUpdateWithWhereUniqueWithoutRelatedEventInput | PatientMessageUpdateWithWhereUniqueWithoutRelatedEventInput[]
    updateMany?: PatientMessageUpdateManyWithWhereWithoutRelatedEventInput | PatientMessageUpdateManyWithWhereWithoutRelatedEventInput[]
    deleteMany?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
  }

  export type PatientTaskUncheckedUpdateManyWithoutRelatedEventNestedInput = {
    create?: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput> | PatientTaskCreateWithoutRelatedEventInput[] | PatientTaskUncheckedCreateWithoutRelatedEventInput[]
    connectOrCreate?: PatientTaskCreateOrConnectWithoutRelatedEventInput | PatientTaskCreateOrConnectWithoutRelatedEventInput[]
    upsert?: PatientTaskUpsertWithWhereUniqueWithoutRelatedEventInput | PatientTaskUpsertWithWhereUniqueWithoutRelatedEventInput[]
    createMany?: PatientTaskCreateManyRelatedEventInputEnvelope
    set?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    disconnect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    delete?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    connect?: PatientTaskWhereUniqueInput | PatientTaskWhereUniqueInput[]
    update?: PatientTaskUpdateWithWhereUniqueWithoutRelatedEventInput | PatientTaskUpdateWithWhereUniqueWithoutRelatedEventInput[]
    updateMany?: PatientTaskUpdateManyWithWhereWithoutRelatedEventInput | PatientTaskUpdateManyWithWhereWithoutRelatedEventInput[]
    deleteMany?: PatientTaskScalarWhereInput | PatientTaskScalarWhereInput[]
  }

  export type EngagementRuleRunCreateNestedManyWithoutRuleInput = {
    create?: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput> | EngagementRuleRunCreateWithoutRuleInput[] | EngagementRuleRunUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutRuleInput | EngagementRuleRunCreateOrConnectWithoutRuleInput[]
    createMany?: EngagementRuleRunCreateManyRuleInputEnvelope
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
  }

  export type EngagementRuleRunUncheckedCreateNestedManyWithoutRuleInput = {
    create?: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput> | EngagementRuleRunCreateWithoutRuleInput[] | EngagementRuleRunUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutRuleInput | EngagementRuleRunCreateOrConnectWithoutRuleInput[]
    createMany?: EngagementRuleRunCreateManyRuleInputEnvelope
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EngagementRuleRunUpdateManyWithoutRuleNestedInput = {
    create?: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput> | EngagementRuleRunCreateWithoutRuleInput[] | EngagementRuleRunUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutRuleInput | EngagementRuleRunCreateOrConnectWithoutRuleInput[]
    upsert?: EngagementRuleRunUpsertWithWhereUniqueWithoutRuleInput | EngagementRuleRunUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: EngagementRuleRunCreateManyRuleInputEnvelope
    set?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    disconnect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    delete?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    update?: EngagementRuleRunUpdateWithWhereUniqueWithoutRuleInput | EngagementRuleRunUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: EngagementRuleRunUpdateManyWithWhereWithoutRuleInput | EngagementRuleRunUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
  }

  export type EngagementRuleRunUncheckedUpdateManyWithoutRuleNestedInput = {
    create?: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput> | EngagementRuleRunCreateWithoutRuleInput[] | EngagementRuleRunUncheckedCreateWithoutRuleInput[]
    connectOrCreate?: EngagementRuleRunCreateOrConnectWithoutRuleInput | EngagementRuleRunCreateOrConnectWithoutRuleInput[]
    upsert?: EngagementRuleRunUpsertWithWhereUniqueWithoutRuleInput | EngagementRuleRunUpsertWithWhereUniqueWithoutRuleInput[]
    createMany?: EngagementRuleRunCreateManyRuleInputEnvelope
    set?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    disconnect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    delete?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    connect?: EngagementRuleRunWhereUniqueInput | EngagementRuleRunWhereUniqueInput[]
    update?: EngagementRuleRunUpdateWithWhereUniqueWithoutRuleInput | EngagementRuleRunUpdateWithWhereUniqueWithoutRuleInput[]
    updateMany?: EngagementRuleRunUpdateManyWithWhereWithoutRuleInput | EngagementRuleRunUpdateManyWithWhereWithoutRuleInput[]
    deleteMany?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
  }

  export type PatientMessageCreateNestedManyWithoutTemplateInput = {
    create?: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput> | PatientMessageCreateWithoutTemplateInput[] | PatientMessageUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutTemplateInput | PatientMessageCreateOrConnectWithoutTemplateInput[]
    createMany?: PatientMessageCreateManyTemplateInputEnvelope
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
  }

  export type PatientMessageUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput> | PatientMessageCreateWithoutTemplateInput[] | PatientMessageUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutTemplateInput | PatientMessageCreateOrConnectWithoutTemplateInput[]
    createMany?: PatientMessageCreateManyTemplateInputEnvelope
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
  }

  export type PatientMessageUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput> | PatientMessageCreateWithoutTemplateInput[] | PatientMessageUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutTemplateInput | PatientMessageCreateOrConnectWithoutTemplateInput[]
    upsert?: PatientMessageUpsertWithWhereUniqueWithoutTemplateInput | PatientMessageUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: PatientMessageCreateManyTemplateInputEnvelope
    set?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    disconnect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    delete?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    update?: PatientMessageUpdateWithWhereUniqueWithoutTemplateInput | PatientMessageUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: PatientMessageUpdateManyWithWhereWithoutTemplateInput | PatientMessageUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
  }

  export type PatientMessageUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput> | PatientMessageCreateWithoutTemplateInput[] | PatientMessageUncheckedCreateWithoutTemplateInput[]
    connectOrCreate?: PatientMessageCreateOrConnectWithoutTemplateInput | PatientMessageCreateOrConnectWithoutTemplateInput[]
    upsert?: PatientMessageUpsertWithWhereUniqueWithoutTemplateInput | PatientMessageUpsertWithWhereUniqueWithoutTemplateInput[]
    createMany?: PatientMessageCreateManyTemplateInputEnvelope
    set?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    disconnect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    delete?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    connect?: PatientMessageWhereUniqueInput | PatientMessageWhereUniqueInput[]
    update?: PatientMessageUpdateWithWhereUniqueWithoutTemplateInput | PatientMessageUpdateWithWhereUniqueWithoutTemplateInput[]
    updateMany?: PatientMessageUpdateManyWithWhereWithoutTemplateInput | PatientMessageUpdateManyWithWhereWithoutTemplateInput[]
    deleteMany?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
  }

  export type CommunicationTemplateCreateNestedOneWithoutMessagesInput = {
    create?: XOR<CommunicationTemplateCreateWithoutMessagesInput, CommunicationTemplateUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: CommunicationTemplateCreateOrConnectWithoutMessagesInput
    connect?: CommunicationTemplateWhereUniqueInput
  }

  export type PatientEngagementEventCreateNestedOneWithoutRelatedMessagesInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedCreateWithoutRelatedMessagesInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRelatedMessagesInput
    connect?: PatientEngagementEventWhereUniqueInput
  }

  export type CommunicationTemplateUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<CommunicationTemplateCreateWithoutMessagesInput, CommunicationTemplateUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: CommunicationTemplateCreateOrConnectWithoutMessagesInput
    upsert?: CommunicationTemplateUpsertWithoutMessagesInput
    disconnect?: CommunicationTemplateWhereInput | boolean
    delete?: CommunicationTemplateWhereInput | boolean
    connect?: CommunicationTemplateWhereUniqueInput
    update?: XOR<XOR<CommunicationTemplateUpdateToOneWithWhereWithoutMessagesInput, CommunicationTemplateUpdateWithoutMessagesInput>, CommunicationTemplateUncheckedUpdateWithoutMessagesInput>
  }

  export type PatientEngagementEventUpdateOneWithoutRelatedMessagesNestedInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedCreateWithoutRelatedMessagesInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRelatedMessagesInput
    upsert?: PatientEngagementEventUpsertWithoutRelatedMessagesInput
    disconnect?: PatientEngagementEventWhereInput | boolean
    delete?: PatientEngagementEventWhereInput | boolean
    connect?: PatientEngagementEventWhereUniqueInput
    update?: XOR<XOR<PatientEngagementEventUpdateToOneWithWhereWithoutRelatedMessagesInput, PatientEngagementEventUpdateWithoutRelatedMessagesInput>, PatientEngagementEventUncheckedUpdateWithoutRelatedMessagesInput>
  }

  export type PatientEngagementEventCreateNestedOneWithoutRelatedTasksInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRelatedTasksInput, PatientEngagementEventUncheckedCreateWithoutRelatedTasksInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRelatedTasksInput
    connect?: PatientEngagementEventWhereUniqueInput
  }

  export type PatientEngagementEventUpdateOneWithoutRelatedTasksNestedInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRelatedTasksInput, PatientEngagementEventUncheckedCreateWithoutRelatedTasksInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRelatedTasksInput
    upsert?: PatientEngagementEventUpsertWithoutRelatedTasksInput
    disconnect?: PatientEngagementEventWhereInput | boolean
    delete?: PatientEngagementEventWhereInput | boolean
    connect?: PatientEngagementEventWhereUniqueInput
    update?: XOR<XOR<PatientEngagementEventUpdateToOneWithWhereWithoutRelatedTasksInput, PatientEngagementEventUpdateWithoutRelatedTasksInput>, PatientEngagementEventUncheckedUpdateWithoutRelatedTasksInput>
  }

  export type EngagementRuleCreateNestedOneWithoutRuleRunsInput = {
    create?: XOR<EngagementRuleCreateWithoutRuleRunsInput, EngagementRuleUncheckedCreateWithoutRuleRunsInput>
    connectOrCreate?: EngagementRuleCreateOrConnectWithoutRuleRunsInput
    connect?: EngagementRuleWhereUniqueInput
  }

  export type PatientEngagementEventCreateNestedOneWithoutRuleRunsInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRuleRunsInput, PatientEngagementEventUncheckedCreateWithoutRuleRunsInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRuleRunsInput
    connect?: PatientEngagementEventWhereUniqueInput
  }

  export type EngagementRuleUpdateOneRequiredWithoutRuleRunsNestedInput = {
    create?: XOR<EngagementRuleCreateWithoutRuleRunsInput, EngagementRuleUncheckedCreateWithoutRuleRunsInput>
    connectOrCreate?: EngagementRuleCreateOrConnectWithoutRuleRunsInput
    upsert?: EngagementRuleUpsertWithoutRuleRunsInput
    connect?: EngagementRuleWhereUniqueInput
    update?: XOR<XOR<EngagementRuleUpdateToOneWithWhereWithoutRuleRunsInput, EngagementRuleUpdateWithoutRuleRunsInput>, EngagementRuleUncheckedUpdateWithoutRuleRunsInput>
  }

  export type PatientEngagementEventUpdateOneRequiredWithoutRuleRunsNestedInput = {
    create?: XOR<PatientEngagementEventCreateWithoutRuleRunsInput, PatientEngagementEventUncheckedCreateWithoutRuleRunsInput>
    connectOrCreate?: PatientEngagementEventCreateOrConnectWithoutRuleRunsInput
    upsert?: PatientEngagementEventUpsertWithoutRuleRunsInput
    connect?: PatientEngagementEventWhereUniqueInput
    update?: XOR<XOR<PatientEngagementEventUpdateToOneWithWhereWithoutRuleRunsInput, PatientEngagementEventUpdateWithoutRuleRunsInput>, PatientEngagementEventUncheckedUpdateWithoutRuleRunsInput>
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

  export type EngagementRuleRunCreateWithoutEventInput = {
    id?: string
    tenantId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
    rule: EngagementRuleCreateNestedOneWithoutRuleRunsInput
  }

  export type EngagementRuleRunUncheckedCreateWithoutEventInput = {
    id?: string
    tenantId: string
    ruleId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type EngagementRuleRunCreateOrConnectWithoutEventInput = {
    where: EngagementRuleRunWhereUniqueInput
    create: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput>
  }

  export type EngagementRuleRunCreateManyEventInputEnvelope = {
    data: EngagementRuleRunCreateManyEventInput | EngagementRuleRunCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type PatientMessageCreateWithoutRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
    template?: CommunicationTemplateCreateNestedOneWithoutMessagesInput
  }

  export type PatientMessageUncheckedCreateWithoutRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateId?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientMessageCreateOrConnectWithoutRelatedEventInput = {
    where: PatientMessageWhereUniqueInput
    create: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput>
  }

  export type PatientMessageCreateManyRelatedEventInputEnvelope = {
    data: PatientMessageCreateManyRelatedEventInput | PatientMessageCreateManyRelatedEventInput[]
    skipDuplicates?: boolean
  }

  export type PatientTaskCreateWithoutRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientTaskUncheckedCreateWithoutRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientTaskCreateOrConnectWithoutRelatedEventInput = {
    where: PatientTaskWhereUniqueInput
    create: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput>
  }

  export type PatientTaskCreateManyRelatedEventInputEnvelope = {
    data: PatientTaskCreateManyRelatedEventInput | PatientTaskCreateManyRelatedEventInput[]
    skipDuplicates?: boolean
  }

  export type EngagementRuleRunUpsertWithWhereUniqueWithoutEventInput = {
    where: EngagementRuleRunWhereUniqueInput
    update: XOR<EngagementRuleRunUpdateWithoutEventInput, EngagementRuleRunUncheckedUpdateWithoutEventInput>
    create: XOR<EngagementRuleRunCreateWithoutEventInput, EngagementRuleRunUncheckedCreateWithoutEventInput>
  }

  export type EngagementRuleRunUpdateWithWhereUniqueWithoutEventInput = {
    where: EngagementRuleRunWhereUniqueInput
    data: XOR<EngagementRuleRunUpdateWithoutEventInput, EngagementRuleRunUncheckedUpdateWithoutEventInput>
  }

  export type EngagementRuleRunUpdateManyWithWhereWithoutEventInput = {
    where: EngagementRuleRunScalarWhereInput
    data: XOR<EngagementRuleRunUpdateManyMutationInput, EngagementRuleRunUncheckedUpdateManyWithoutEventInput>
  }

  export type EngagementRuleRunScalarWhereInput = {
    AND?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
    OR?: EngagementRuleRunScalarWhereInput[]
    NOT?: EngagementRuleRunScalarWhereInput | EngagementRuleRunScalarWhereInput[]
    id?: UuidFilter<"EngagementRuleRun"> | string
    tenantId?: UuidFilter<"EngagementRuleRun"> | string
    ruleId?: UuidFilter<"EngagementRuleRun"> | string
    eventId?: UuidFilter<"EngagementRuleRun"> | string
    decision?: StringFilter<"EngagementRuleRun"> | string
    skipReason?: StringNullableFilter<"EngagementRuleRun"> | string | null
    actionResult?: JsonNullableFilter<"EngagementRuleRun">
    correlationId?: StringNullableFilter<"EngagementRuleRun"> | string | null
    evaluatedAt?: DateTimeFilter<"EngagementRuleRun"> | Date | string
  }

  export type PatientMessageUpsertWithWhereUniqueWithoutRelatedEventInput = {
    where: PatientMessageWhereUniqueInput
    update: XOR<PatientMessageUpdateWithoutRelatedEventInput, PatientMessageUncheckedUpdateWithoutRelatedEventInput>
    create: XOR<PatientMessageCreateWithoutRelatedEventInput, PatientMessageUncheckedCreateWithoutRelatedEventInput>
  }

  export type PatientMessageUpdateWithWhereUniqueWithoutRelatedEventInput = {
    where: PatientMessageWhereUniqueInput
    data: XOR<PatientMessageUpdateWithoutRelatedEventInput, PatientMessageUncheckedUpdateWithoutRelatedEventInput>
  }

  export type PatientMessageUpdateManyWithWhereWithoutRelatedEventInput = {
    where: PatientMessageScalarWhereInput
    data: XOR<PatientMessageUpdateManyMutationInput, PatientMessageUncheckedUpdateManyWithoutRelatedEventInput>
  }

  export type PatientMessageScalarWhereInput = {
    AND?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
    OR?: PatientMessageScalarWhereInput[]
    NOT?: PatientMessageScalarWhereInput | PatientMessageScalarWhereInput[]
    id?: UuidFilter<"PatientMessage"> | string
    tenantId?: UuidFilter<"PatientMessage"> | string
    patientId?: UuidFilter<"PatientMessage"> | string
    patientDisplayName?: StringNullableFilter<"PatientMessage"> | string | null
    patientGender?: StringNullableFilter<"PatientMessage"> | string | null
    patientRef?: StringNullableFilter<"PatientMessage"> | string | null
    direction?: StringFilter<"PatientMessage"> | string
    channel?: StringFilter<"PatientMessage"> | string
    toAddress?: StringNullableFilter<"PatientMessage"> | string | null
    fromAddress?: StringNullableFilter<"PatientMessage"> | string | null
    templateId?: UuidNullableFilter<"PatientMessage"> | string | null
    templateVersion?: IntNullableFilter<"PatientMessage"> | number | null
    subject?: StringNullableFilter<"PatientMessage"> | string | null
    bodyRendered?: StringFilter<"PatientMessage"> | string
    variablesUsed?: JsonNullableFilter<"PatientMessage">
    purpose?: StringFilter<"PatientMessage"> | string
    consentReferenceId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEventId?: UuidNullableFilter<"PatientMessage"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientMessage"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientMessage"> | string | null
    providerMessageId?: StringNullableFilter<"PatientMessage"> | string | null
    status?: StringFilter<"PatientMessage"> | string
    statusReason?: StringNullableFilter<"PatientMessage"> | string | null
    sentAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    readAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"PatientMessage"> | Date | string | null
    retryCount?: IntFilter<"PatientMessage"> | number
    idempotencyKey?: StringFilter<"PatientMessage"> | string
    createdAt?: DateTimeFilter<"PatientMessage"> | Date | string
    createdBy?: UuidNullableFilter<"PatientMessage"> | string | null
    updatedAt?: DateTimeFilter<"PatientMessage"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientMessage"> | string | null
  }

  export type PatientTaskUpsertWithWhereUniqueWithoutRelatedEventInput = {
    where: PatientTaskWhereUniqueInput
    update: XOR<PatientTaskUpdateWithoutRelatedEventInput, PatientTaskUncheckedUpdateWithoutRelatedEventInput>
    create: XOR<PatientTaskCreateWithoutRelatedEventInput, PatientTaskUncheckedCreateWithoutRelatedEventInput>
  }

  export type PatientTaskUpdateWithWhereUniqueWithoutRelatedEventInput = {
    where: PatientTaskWhereUniqueInput
    data: XOR<PatientTaskUpdateWithoutRelatedEventInput, PatientTaskUncheckedUpdateWithoutRelatedEventInput>
  }

  export type PatientTaskUpdateManyWithWhereWithoutRelatedEventInput = {
    where: PatientTaskScalarWhereInput
    data: XOR<PatientTaskUpdateManyMutationInput, PatientTaskUncheckedUpdateManyWithoutRelatedEventInput>
  }

  export type PatientTaskScalarWhereInput = {
    AND?: PatientTaskScalarWhereInput | PatientTaskScalarWhereInput[]
    OR?: PatientTaskScalarWhereInput[]
    NOT?: PatientTaskScalarWhereInput | PatientTaskScalarWhereInput[]
    id?: UuidFilter<"PatientTask"> | string
    tenantId?: UuidFilter<"PatientTask"> | string
    patientId?: UuidFilter<"PatientTask"> | string
    patientDisplayName?: StringNullableFilter<"PatientTask"> | string | null
    patientGender?: StringNullableFilter<"PatientTask"> | string | null
    patientAgeYearsAtEvent?: IntNullableFilter<"PatientTask"> | number | null
    patientRef?: StringNullableFilter<"PatientTask"> | string | null
    taskType?: StringFilter<"PatientTask"> | string
    title?: StringFilter<"PatientTask"> | string
    description?: StringNullableFilter<"PatientTask"> | string | null
    priority?: IntFilter<"PatientTask"> | number
    assignedToUserId?: UuidNullableFilter<"PatientTask"> | string | null
    assignedToRole?: StringNullableFilter<"PatientTask"> | string | null
    status?: StringFilter<"PatientTask"> | string
    dueAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    completedAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    cancelledAt?: DateTimeNullableFilter<"PatientTask"> | Date | string | null
    outcome?: StringNullableFilter<"PatientTask"> | string | null
    outcomeDetails?: JsonNullableFilter<"PatientTask">
    relatedEventId?: UuidNullableFilter<"PatientTask"> | string | null
    relatedEntityType?: StringNullableFilter<"PatientTask"> | string | null
    relatedEntityId?: UuidNullableFilter<"PatientTask"> | string | null
    createdAt?: DateTimeFilter<"PatientTask"> | Date | string
    createdBy?: UuidNullableFilter<"PatientTask"> | string | null
    updatedAt?: DateTimeFilter<"PatientTask"> | Date | string
    updatedBy?: UuidNullableFilter<"PatientTask"> | string | null
  }

  export type EngagementRuleRunCreateWithoutRuleInput = {
    id?: string
    tenantId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
    event: PatientEngagementEventCreateNestedOneWithoutRuleRunsInput
  }

  export type EngagementRuleRunUncheckedCreateWithoutRuleInput = {
    id?: string
    tenantId: string
    eventId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type EngagementRuleRunCreateOrConnectWithoutRuleInput = {
    where: EngagementRuleRunWhereUniqueInput
    create: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput>
  }

  export type EngagementRuleRunCreateManyRuleInputEnvelope = {
    data: EngagementRuleRunCreateManyRuleInput | EngagementRuleRunCreateManyRuleInput[]
    skipDuplicates?: boolean
  }

  export type EngagementRuleRunUpsertWithWhereUniqueWithoutRuleInput = {
    where: EngagementRuleRunWhereUniqueInput
    update: XOR<EngagementRuleRunUpdateWithoutRuleInput, EngagementRuleRunUncheckedUpdateWithoutRuleInput>
    create: XOR<EngagementRuleRunCreateWithoutRuleInput, EngagementRuleRunUncheckedCreateWithoutRuleInput>
  }

  export type EngagementRuleRunUpdateWithWhereUniqueWithoutRuleInput = {
    where: EngagementRuleRunWhereUniqueInput
    data: XOR<EngagementRuleRunUpdateWithoutRuleInput, EngagementRuleRunUncheckedUpdateWithoutRuleInput>
  }

  export type EngagementRuleRunUpdateManyWithWhereWithoutRuleInput = {
    where: EngagementRuleRunScalarWhereInput
    data: XOR<EngagementRuleRunUpdateManyMutationInput, EngagementRuleRunUncheckedUpdateManyWithoutRuleInput>
  }

  export type PatientMessageCreateWithoutTemplateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
    relatedEvent?: PatientEngagementEventCreateNestedOneWithoutRelatedMessagesInput
  }

  export type PatientMessageUncheckedCreateWithoutTemplateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientMessageCreateOrConnectWithoutTemplateInput = {
    where: PatientMessageWhereUniqueInput
    create: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput>
  }

  export type PatientMessageCreateManyTemplateInputEnvelope = {
    data: PatientMessageCreateManyTemplateInput | PatientMessageCreateManyTemplateInput[]
    skipDuplicates?: boolean
  }

  export type PatientMessageUpsertWithWhereUniqueWithoutTemplateInput = {
    where: PatientMessageWhereUniqueInput
    update: XOR<PatientMessageUpdateWithoutTemplateInput, PatientMessageUncheckedUpdateWithoutTemplateInput>
    create: XOR<PatientMessageCreateWithoutTemplateInput, PatientMessageUncheckedCreateWithoutTemplateInput>
  }

  export type PatientMessageUpdateWithWhereUniqueWithoutTemplateInput = {
    where: PatientMessageWhereUniqueInput
    data: XOR<PatientMessageUpdateWithoutTemplateInput, PatientMessageUncheckedUpdateWithoutTemplateInput>
  }

  export type PatientMessageUpdateManyWithWhereWithoutTemplateInput = {
    where: PatientMessageScalarWhereInput
    data: XOR<PatientMessageUpdateManyMutationInput, PatientMessageUncheckedUpdateManyWithoutTemplateInput>
  }

  export type CommunicationTemplateCreateWithoutMessagesInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    channel: string
    language?: string
    subject?: string | null
    body: string
    variablesSchema: JsonNullValueInput | InputJsonValue
    approvalStatus?: string
    approvedAt?: Date | string | null
    approvedBy?: string | null
    rejectionReason?: string | null
    version?: number
    contentHash: string
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type CommunicationTemplateUncheckedCreateWithoutMessagesInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    channel: string
    language?: string
    subject?: string | null
    body: string
    variablesSchema: JsonNullValueInput | InputJsonValue
    approvalStatus?: string
    approvedAt?: Date | string | null
    approvedBy?: string | null
    rejectionReason?: string | null
    version?: number
    contentHash: string
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type CommunicationTemplateCreateOrConnectWithoutMessagesInput = {
    where: CommunicationTemplateWhereUniqueInput
    create: XOR<CommunicationTemplateCreateWithoutMessagesInput, CommunicationTemplateUncheckedCreateWithoutMessagesInput>
  }

  export type PatientEngagementEventCreateWithoutRelatedMessagesInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunCreateNestedManyWithoutEventInput
    relatedTasks?: PatientTaskCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventUncheckedCreateWithoutRelatedMessagesInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunUncheckedCreateNestedManyWithoutEventInput
    relatedTasks?: PatientTaskUncheckedCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventCreateOrConnectWithoutRelatedMessagesInput = {
    where: PatientEngagementEventWhereUniqueInput
    create: XOR<PatientEngagementEventCreateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedCreateWithoutRelatedMessagesInput>
  }

  export type CommunicationTemplateUpsertWithoutMessagesInput = {
    update: XOR<CommunicationTemplateUpdateWithoutMessagesInput, CommunicationTemplateUncheckedUpdateWithoutMessagesInput>
    create: XOR<CommunicationTemplateCreateWithoutMessagesInput, CommunicationTemplateUncheckedCreateWithoutMessagesInput>
    where?: CommunicationTemplateWhereInput
  }

  export type CommunicationTemplateUpdateToOneWithWhereWithoutMessagesInput = {
    where?: CommunicationTemplateWhereInput
    data: XOR<CommunicationTemplateUpdateWithoutMessagesInput, CommunicationTemplateUncheckedUpdateWithoutMessagesInput>
  }

  export type CommunicationTemplateUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommunicationTemplateUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    body?: StringFieldUpdateOperationsInput | string
    variablesSchema?: JsonNullValueInput | InputJsonValue
    approvalStatus?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    contentHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientEngagementEventUpsertWithoutRelatedMessagesInput = {
    update: XOR<PatientEngagementEventUpdateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedUpdateWithoutRelatedMessagesInput>
    create: XOR<PatientEngagementEventCreateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedCreateWithoutRelatedMessagesInput>
    where?: PatientEngagementEventWhereInput
  }

  export type PatientEngagementEventUpdateToOneWithWhereWithoutRelatedMessagesInput = {
    where?: PatientEngagementEventWhereInput
    data: XOR<PatientEngagementEventUpdateWithoutRelatedMessagesInput, PatientEngagementEventUncheckedUpdateWithoutRelatedMessagesInput>
  }

  export type PatientEngagementEventUpdateWithoutRelatedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUpdateManyWithoutEventNestedInput
    relatedTasks?: PatientTaskUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventUncheckedUpdateWithoutRelatedMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUncheckedUpdateManyWithoutEventNestedInput
    relatedTasks?: PatientTaskUncheckedUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventCreateWithoutRelatedTasksInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunCreateNestedManyWithoutEventInput
    relatedMessages?: PatientMessageCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventUncheckedCreateWithoutRelatedTasksInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    ruleRuns?: EngagementRuleRunUncheckedCreateNestedManyWithoutEventInput
    relatedMessages?: PatientMessageUncheckedCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventCreateOrConnectWithoutRelatedTasksInput = {
    where: PatientEngagementEventWhereUniqueInput
    create: XOR<PatientEngagementEventCreateWithoutRelatedTasksInput, PatientEngagementEventUncheckedCreateWithoutRelatedTasksInput>
  }

  export type PatientEngagementEventUpsertWithoutRelatedTasksInput = {
    update: XOR<PatientEngagementEventUpdateWithoutRelatedTasksInput, PatientEngagementEventUncheckedUpdateWithoutRelatedTasksInput>
    create: XOR<PatientEngagementEventCreateWithoutRelatedTasksInput, PatientEngagementEventUncheckedCreateWithoutRelatedTasksInput>
    where?: PatientEngagementEventWhereInput
  }

  export type PatientEngagementEventUpdateToOneWithWhereWithoutRelatedTasksInput = {
    where?: PatientEngagementEventWhereInput
    data: XOR<PatientEngagementEventUpdateWithoutRelatedTasksInput, PatientEngagementEventUncheckedUpdateWithoutRelatedTasksInput>
  }

  export type PatientEngagementEventUpdateWithoutRelatedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUpdateManyWithoutEventNestedInput
    relatedMessages?: PatientMessageUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventUncheckedUpdateWithoutRelatedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    ruleRuns?: EngagementRuleRunUncheckedUpdateManyWithoutEventNestedInput
    relatedMessages?: PatientMessageUncheckedUpdateManyWithoutRelatedEventNestedInput
  }

  export type EngagementRuleCreateWithoutRuleRunsInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype?: string | null
    conditionExpr: JsonNullValueInput | InputJsonValue
    scheduleMode: string
    delaySeconds?: number | null
    actionType: string
    actionPayload: JsonNullValueInput | InputJsonValue
    priority?: number
    cooldownSeconds?: number | null
    idempotencyWindow?: number | null
    maxExecutionsPerDay?: number | null
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type EngagementRuleUncheckedCreateWithoutRuleRunsInput = {
    id?: string
    tenantId: string
    code: string
    name: string
    description?: string | null
    category: string
    triggerEventType: string
    triggerEventSubtype?: string | null
    conditionExpr: JsonNullValueInput | InputJsonValue
    scheduleMode: string
    delaySeconds?: number | null
    actionType: string
    actionPayload: JsonNullValueInput | InputJsonValue
    priority?: number
    cooldownSeconds?: number | null
    idempotencyWindow?: number | null
    maxExecutionsPerDay?: number | null
    effectiveFrom?: Date | string | null
    effectiveTo?: Date | string | null
    isActive?: boolean
    createdAt?: Date | string
    createdBy: string
    updatedAt?: Date | string
    updatedBy?: string | null
    deletedAt?: Date | string | null
    deletedBy?: string | null
  }

  export type EngagementRuleCreateOrConnectWithoutRuleRunsInput = {
    where: EngagementRuleWhereUniqueInput
    create: XOR<EngagementRuleCreateWithoutRuleRunsInput, EngagementRuleUncheckedCreateWithoutRuleRunsInput>
  }

  export type PatientEngagementEventCreateWithoutRuleRunsInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    relatedMessages?: PatientMessageCreateNestedManyWithoutRelatedEventInput
    relatedTasks?: PatientTaskCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventUncheckedCreateWithoutRuleRunsInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientDob?: Date | string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    patientMobileMasked?: string | null
    sourceSystem: string
    sourceModule: string
    eventType: string
    eventSubtype?: string | null
    severity?: number
    occurredAt: Date | string
    entityType: string
    entityId: string
    payload: JsonNullValueInput | InputJsonValue
    correlationId?: string | null
    dedupeKey: string
    createdAt?: Date | string
    createdBy?: string | null
    relatedMessages?: PatientMessageUncheckedCreateNestedManyWithoutRelatedEventInput
    relatedTasks?: PatientTaskUncheckedCreateNestedManyWithoutRelatedEventInput
  }

  export type PatientEngagementEventCreateOrConnectWithoutRuleRunsInput = {
    where: PatientEngagementEventWhereUniqueInput
    create: XOR<PatientEngagementEventCreateWithoutRuleRunsInput, PatientEngagementEventUncheckedCreateWithoutRuleRunsInput>
  }

  export type EngagementRuleUpsertWithoutRuleRunsInput = {
    update: XOR<EngagementRuleUpdateWithoutRuleRunsInput, EngagementRuleUncheckedUpdateWithoutRuleRunsInput>
    create: XOR<EngagementRuleCreateWithoutRuleRunsInput, EngagementRuleUncheckedCreateWithoutRuleRunsInput>
    where?: EngagementRuleWhereInput
  }

  export type EngagementRuleUpdateToOneWithWhereWithoutRuleRunsInput = {
    where?: EngagementRuleWhereInput
    data: XOR<EngagementRuleUpdateWithoutRuleRunsInput, EngagementRuleUncheckedUpdateWithoutRuleRunsInput>
  }

  export type EngagementRuleUpdateWithoutRuleRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EngagementRuleUncheckedUpdateWithoutRuleRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    triggerEventType?: StringFieldUpdateOperationsInput | string
    triggerEventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    conditionExpr?: JsonNullValueInput | InputJsonValue
    scheduleMode?: StringFieldUpdateOperationsInput | string
    delaySeconds?: NullableIntFieldUpdateOperationsInput | number | null
    actionType?: StringFieldUpdateOperationsInput | string
    actionPayload?: JsonNullValueInput | InputJsonValue
    priority?: IntFieldUpdateOperationsInput | number
    cooldownSeconds?: NullableIntFieldUpdateOperationsInput | number | null
    idempotencyWindow?: NullableIntFieldUpdateOperationsInput | number | null
    maxExecutionsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    effectiveFrom?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effectiveTo?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deletedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientEngagementEventUpsertWithoutRuleRunsInput = {
    update: XOR<PatientEngagementEventUpdateWithoutRuleRunsInput, PatientEngagementEventUncheckedUpdateWithoutRuleRunsInput>
    create: XOR<PatientEngagementEventCreateWithoutRuleRunsInput, PatientEngagementEventUncheckedCreateWithoutRuleRunsInput>
    where?: PatientEngagementEventWhereInput
  }

  export type PatientEngagementEventUpdateToOneWithWhereWithoutRuleRunsInput = {
    where?: PatientEngagementEventWhereInput
    data: XOR<PatientEngagementEventUpdateWithoutRuleRunsInput, PatientEngagementEventUncheckedUpdateWithoutRuleRunsInput>
  }

  export type PatientEngagementEventUpdateWithoutRuleRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    relatedMessages?: PatientMessageUpdateManyWithoutRelatedEventNestedInput
    relatedTasks?: PatientTaskUpdateManyWithoutRelatedEventNestedInput
  }

  export type PatientEngagementEventUncheckedUpdateWithoutRuleRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    patientMobileMasked?: NullableStringFieldUpdateOperationsInput | string | null
    sourceSystem?: StringFieldUpdateOperationsInput | string
    sourceModule?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    eventSubtype?: NullableStringFieldUpdateOperationsInput | string | null
    severity?: IntFieldUpdateOperationsInput | number
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    relatedMessages?: PatientMessageUncheckedUpdateManyWithoutRelatedEventNestedInput
    relatedTasks?: PatientTaskUncheckedUpdateManyWithoutRelatedEventNestedInput
  }

  export type EngagementRuleRunCreateManyEventInput = {
    id?: string
    tenantId: string
    ruleId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type PatientMessageCreateManyRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateId?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientTaskCreateManyRelatedEventInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientAgeYearsAtEvent?: number | null
    patientRef?: string | null
    taskType: string
    title: string
    description?: string | null
    priority?: number
    assignedToUserId?: string | null
    assignedToRole?: string | null
    status?: string
    dueAt?: Date | string | null
    completedAt?: Date | string | null
    cancelledAt?: Date | string | null
    outcome?: string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type EngagementRuleRunUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rule?: EngagementRuleUpdateOneRequiredWithoutRuleRunsNestedInput
  }

  export type EngagementRuleRunUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EngagementRuleRunUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    ruleId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMessageUpdateWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    template?: CommunicationTemplateUpdateOneWithoutMessagesNestedInput
  }

  export type PatientMessageUncheckedUpdateWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientMessageUncheckedUpdateManyWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateId?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskUpdateWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskUncheckedUpdateWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientTaskUncheckedUpdateManyWithoutRelatedEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientAgeYearsAtEvent?: NullableIntFieldUpdateOperationsInput | number | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    taskType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: IntFieldUpdateOperationsInput | number
    assignedToUserId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedToRole?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    dueAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    outcomeDetails?: NullableJsonNullValueInput | InputJsonValue
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EngagementRuleRunCreateManyRuleInput = {
    id?: string
    tenantId: string
    eventId: string
    decision?: string
    skipReason?: string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: string | null
    evaluatedAt?: Date | string
  }

  export type EngagementRuleRunUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    event?: PatientEngagementEventUpdateOneRequiredWithoutRuleRunsNestedInput
  }

  export type EngagementRuleRunUncheckedUpdateWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EngagementRuleRunUncheckedUpdateManyWithoutRuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    eventId?: StringFieldUpdateOperationsInput | string
    decision?: StringFieldUpdateOperationsInput | string
    skipReason?: NullableStringFieldUpdateOperationsInput | string | null
    actionResult?: NullableJsonNullValueInput | InputJsonValue
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    evaluatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientMessageCreateManyTemplateInput = {
    id?: string
    tenantId: string
    patientId: string
    patientDisplayName?: string | null
    patientGender?: string | null
    patientRef?: string | null
    direction?: string
    channel: string
    toAddress?: string | null
    fromAddress?: string | null
    templateVersion?: number | null
    subject?: string | null
    bodyRendered: string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose: string
    consentReferenceId?: string | null
    relatedEventId?: string | null
    relatedEntityType?: string | null
    relatedEntityId?: string | null
    providerMessageId?: string | null
    status?: string
    statusReason?: string | null
    sentAt?: Date | string | null
    deliveredAt?: Date | string | null
    readAt?: Date | string | null
    failedAt?: Date | string | null
    retryCount?: number
    idempotencyKey: string
    createdAt?: Date | string
    createdBy?: string | null
    updatedAt?: Date | string
    updatedBy?: string | null
  }

  export type PatientMessageUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEvent?: PatientEngagementEventUpdateOneWithoutRelatedMessagesNestedInput
  }

  export type PatientMessageUncheckedUpdateWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientMessageUncheckedUpdateManyWithoutTemplateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    patientDisplayName?: NullableStringFieldUpdateOperationsInput | string | null
    patientGender?: NullableStringFieldUpdateOperationsInput | string | null
    patientRef?: NullableStringFieldUpdateOperationsInput | string | null
    direction?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    toAddress?: NullableStringFieldUpdateOperationsInput | string | null
    fromAddress?: NullableStringFieldUpdateOperationsInput | string | null
    templateVersion?: NullableIntFieldUpdateOperationsInput | number | null
    subject?: NullableStringFieldUpdateOperationsInput | string | null
    bodyRendered?: StringFieldUpdateOperationsInput | string
    variablesUsed?: NullableJsonNullValueInput | InputJsonValue
    purpose?: StringFieldUpdateOperationsInput | string
    consentReferenceId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEventId?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    relatedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    providerMessageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    statusReason?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    retryCount?: IntFieldUpdateOperationsInput | number
    idempotencyKey?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PatientEngagementEventCountOutputTypeDefaultArgs instead
     */
    export type PatientEngagementEventCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientEngagementEventCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EngagementRuleCountOutputTypeDefaultArgs instead
     */
    export type EngagementRuleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EngagementRuleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunicationTemplateCountOutputTypeDefaultArgs instead
     */
    export type CommunicationTemplateCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunicationTemplateCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientEngagementEventDefaultArgs instead
     */
    export type PatientEngagementEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientEngagementEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EngagementRuleDefaultArgs instead
     */
    export type EngagementRuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EngagementRuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommunicationTemplateDefaultArgs instead
     */
    export type CommunicationTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommunicationTemplateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientPreferenceDefaultArgs instead
     */
    export type PatientPreferenceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientPreferenceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientMessageDefaultArgs instead
     */
    export type PatientMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientMessageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientTaskDefaultArgs instead
     */
    export type PatientTaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientTaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EngagementRuleRunDefaultArgs instead
     */
    export type EngagementRuleRunArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EngagementRuleRunDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PrmJobDefaultArgs instead
     */
    export type PrmJobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PrmJobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProviderCallbackDefaultArgs instead
     */
    export type ProviderCallbackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProviderCallbackDefaultArgs<ExtArgs>

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
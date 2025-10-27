
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
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model Encounter
 * 
 */
export type Encounter = $Result.DefaultSelection<Prisma.$EncounterPayload>
/**
 * Model PatientDocument
 * 
 */
export type PatientDocument = $Result.DefaultSelection<Prisma.$PatientDocumentPayload>
/**
 * Model PatientHistory
 * 
 */
export type PatientHistory = $Result.DefaultSelection<Prisma.$PatientHistoryPayload>
/**
 * Model PatientConsent
 * 
 */
export type PatientConsent = $Result.DefaultSelection<Prisma.$PatientConsentPayload>
/**
 * Model ConsentTemplate
 * 
 */
export type ConsentTemplate = $Result.DefaultSelection<Prisma.$ConsentTemplatePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Patients
 * const patients = await prisma.patient.findMany()
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
   * // Fetch zero or more Patients
   * const patients = await prisma.patient.findMany()
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
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs>;

  /**
   * `prisma.encounter`: Exposes CRUD operations for the **Encounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Encounters
    * const encounters = await prisma.encounter.findMany()
    * ```
    */
  get encounter(): Prisma.EncounterDelegate<ExtArgs>;

  /**
   * `prisma.patientDocument`: Exposes CRUD operations for the **PatientDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientDocuments
    * const patientDocuments = await prisma.patientDocument.findMany()
    * ```
    */
  get patientDocument(): Prisma.PatientDocumentDelegate<ExtArgs>;

  /**
   * `prisma.patientHistory`: Exposes CRUD operations for the **PatientHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientHistories
    * const patientHistories = await prisma.patientHistory.findMany()
    * ```
    */
  get patientHistory(): Prisma.PatientHistoryDelegate<ExtArgs>;

  /**
   * `prisma.patientConsent`: Exposes CRUD operations for the **PatientConsent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientConsents
    * const patientConsents = await prisma.patientConsent.findMany()
    * ```
    */
  get patientConsent(): Prisma.PatientConsentDelegate<ExtArgs>;

  /**
   * `prisma.consentTemplate`: Exposes CRUD operations for the **ConsentTemplate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsentTemplates
    * const consentTemplates = await prisma.consentTemplate.findMany()
    * ```
    */
  get consentTemplate(): Prisma.ConsentTemplateDelegate<ExtArgs>;
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
    Patient: 'Patient',
    Appointment: 'Appointment',
    Encounter: 'Encounter',
    PatientDocument: 'PatientDocument',
    PatientHistory: 'PatientHistory',
    PatientConsent: 'PatientConsent',
    ConsentTemplate: 'ConsentTemplate'
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
      modelProps: "patient" | "appointment" | "encounter" | "patientDocument" | "patientHistory" | "patientConsent" | "consentTemplate"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      Encounter: {
        payload: Prisma.$EncounterPayload<ExtArgs>
        fields: Prisma.EncounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EncounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EncounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findFirst: {
            args: Prisma.EncounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EncounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          findMany: {
            args: Prisma.EncounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          create: {
            args: Prisma.EncounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          createMany: {
            args: Prisma.EncounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EncounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>[]
          }
          delete: {
            args: Prisma.EncounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          update: {
            args: Prisma.EncounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          deleteMany: {
            args: Prisma.EncounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EncounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EncounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EncounterPayload>
          }
          aggregate: {
            args: Prisma.EncounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEncounter>
          }
          groupBy: {
            args: Prisma.EncounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<EncounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.EncounterCountArgs<ExtArgs>
            result: $Utils.Optional<EncounterCountAggregateOutputType> | number
          }
        }
      }
      PatientDocument: {
        payload: Prisma.$PatientDocumentPayload<ExtArgs>
        fields: Prisma.PatientDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          findFirst: {
            args: Prisma.PatientDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          findMany: {
            args: Prisma.PatientDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>[]
          }
          create: {
            args: Prisma.PatientDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          createMany: {
            args: Prisma.PatientDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>[]
          }
          delete: {
            args: Prisma.PatientDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          update: {
            args: Prisma.PatientDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          deleteMany: {
            args: Prisma.PatientDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientDocumentPayload>
          }
          aggregate: {
            args: Prisma.PatientDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientDocument>
          }
          groupBy: {
            args: Prisma.PatientDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<PatientDocumentCountAggregateOutputType> | number
          }
        }
      }
      PatientHistory: {
        payload: Prisma.$PatientHistoryPayload<ExtArgs>
        fields: Prisma.PatientHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          findFirst: {
            args: Prisma.PatientHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          findMany: {
            args: Prisma.PatientHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>[]
          }
          create: {
            args: Prisma.PatientHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          createMany: {
            args: Prisma.PatientHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>[]
          }
          delete: {
            args: Prisma.PatientHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          update: {
            args: Prisma.PatientHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PatientHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientHistoryPayload>
          }
          aggregate: {
            args: Prisma.PatientHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientHistory>
          }
          groupBy: {
            args: Prisma.PatientHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PatientHistoryCountAggregateOutputType> | number
          }
        }
      }
      PatientConsent: {
        payload: Prisma.$PatientConsentPayload<ExtArgs>
        fields: Prisma.PatientConsentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientConsentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientConsentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          findFirst: {
            args: Prisma.PatientConsentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientConsentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          findMany: {
            args: Prisma.PatientConsentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>[]
          }
          create: {
            args: Prisma.PatientConsentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          createMany: {
            args: Prisma.PatientConsentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientConsentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>[]
          }
          delete: {
            args: Prisma.PatientConsentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          update: {
            args: Prisma.PatientConsentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          deleteMany: {
            args: Prisma.PatientConsentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientConsentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PatientConsentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientConsentPayload>
          }
          aggregate: {
            args: Prisma.PatientConsentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientConsent>
          }
          groupBy: {
            args: Prisma.PatientConsentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientConsentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientConsentCountArgs<ExtArgs>
            result: $Utils.Optional<PatientConsentCountAggregateOutputType> | number
          }
        }
      }
      ConsentTemplate: {
        payload: Prisma.$ConsentTemplatePayload<ExtArgs>
        fields: Prisma.ConsentTemplateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsentTemplateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsentTemplateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          findFirst: {
            args: Prisma.ConsentTemplateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsentTemplateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          findMany: {
            args: Prisma.ConsentTemplateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>[]
          }
          create: {
            args: Prisma.ConsentTemplateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          createMany: {
            args: Prisma.ConsentTemplateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsentTemplateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>[]
          }
          delete: {
            args: Prisma.ConsentTemplateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          update: {
            args: Prisma.ConsentTemplateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          deleteMany: {
            args: Prisma.ConsentTemplateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsentTemplateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConsentTemplateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsentTemplatePayload>
          }
          aggregate: {
            args: Prisma.ConsentTemplateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsentTemplate>
          }
          groupBy: {
            args: Prisma.ConsentTemplateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsentTemplateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsentTemplateCountArgs<ExtArgs>
            result: $Utils.Optional<ConsentTemplateCountAggregateOutputType> | number
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
   * Count Type PatientCountOutputType
   */

  export type PatientCountOutputType = {
    appointments: number
    encounters: number
    documents: number
    history: number
    consents: number
  }

  export type PatientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | PatientCountOutputTypeCountAppointmentsArgs
    encounters?: boolean | PatientCountOutputTypeCountEncountersArgs
    documents?: boolean | PatientCountOutputTypeCountDocumentsArgs
    history?: boolean | PatientCountOutputTypeCountHistoryArgs
    consents?: boolean | PatientCountOutputTypeCountConsentsArgs
  }

  // Custom InputTypes
  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientCountOutputType
     */
    select?: PatientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientDocumentWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientHistoryWhereInput
  }

  /**
   * PatientCountOutputType without action
   */
  export type PatientCountOutputTypeCountConsentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientConsentWhereInput
  }


  /**
   * Count Type AppointmentCountOutputType
   */

  export type AppointmentCountOutputType = {
    encounters: number
  }

  export type AppointmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    encounters?: boolean | AppointmentCountOutputTypeCountEncountersArgs
  }

  // Custom InputTypes
  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentCountOutputType
     */
    select?: AppointmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeCountEncountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientMinAggregateOutputType = {
    id: string | null
    mrn: string | null
    tenantId: string | null
    nationalId: string | null
    nationalIdType: string | null
    issuingCountry: string | null
    firstName: string | null
    lastName: string | null
    middleName: string | null
    dateOfBirth: Date | null
    gender: string | null
    maritalStatus: string | null
    nationality: string | null
    preferredLanguage: string | null
    phoneNumber: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    bloodGroup: string | null
    createdBy: string | null
    createdAtFacility: string | null
    registrationSource: string | null
    registrationNotes: string | null
    updatedBy: string | null
    updatedAtFacility: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: string | null
    mrn: string | null
    tenantId: string | null
    nationalId: string | null
    nationalIdType: string | null
    issuingCountry: string | null
    firstName: string | null
    lastName: string | null
    middleName: string | null
    dateOfBirth: Date | null
    gender: string | null
    maritalStatus: string | null
    nationality: string | null
    preferredLanguage: string | null
    phoneNumber: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    bloodGroup: string | null
    createdBy: string | null
    createdAtFacility: string | null
    registrationSource: string | null
    registrationNotes: string | null
    updatedBy: string | null
    updatedAtFacility: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    mrn: number
    tenantId: number
    nationalId: number
    nationalIdType: number
    issuingCountry: number
    firstName: number
    lastName: number
    middleName: number
    dateOfBirth: number
    gender: number
    maritalStatus: number
    nationality: number
    preferredLanguage: number
    phoneNumber: number
    email: number
    addressLine1: number
    addressLine2: number
    city: number
    state: number
    postalCode: number
    country: number
    bloodGroup: number
    emergencyContact: number
    insuranceInfo: number
    createdBy: number
    createdAtFacility: number
    registrationSource: number
    registrationNotes: number
    updatedBy: number
    updatedAtFacility: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientMinAggregateInputType = {
    id?: true
    mrn?: true
    tenantId?: true
    nationalId?: true
    nationalIdType?: true
    issuingCountry?: true
    firstName?: true
    lastName?: true
    middleName?: true
    dateOfBirth?: true
    gender?: true
    maritalStatus?: true
    nationality?: true
    preferredLanguage?: true
    phoneNumber?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    bloodGroup?: true
    createdBy?: true
    createdAtFacility?: true
    registrationSource?: true
    registrationNotes?: true
    updatedBy?: true
    updatedAtFacility?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    mrn?: true
    tenantId?: true
    nationalId?: true
    nationalIdType?: true
    issuingCountry?: true
    firstName?: true
    lastName?: true
    middleName?: true
    dateOfBirth?: true
    gender?: true
    maritalStatus?: true
    nationality?: true
    preferredLanguage?: true
    phoneNumber?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    bloodGroup?: true
    createdBy?: true
    createdAtFacility?: true
    registrationSource?: true
    registrationNotes?: true
    updatedBy?: true
    updatedAtFacility?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    mrn?: true
    tenantId?: true
    nationalId?: true
    nationalIdType?: true
    issuingCountry?: true
    firstName?: true
    lastName?: true
    middleName?: true
    dateOfBirth?: true
    gender?: true
    maritalStatus?: true
    nationality?: true
    preferredLanguage?: true
    phoneNumber?: true
    email?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    postalCode?: true
    country?: true
    bloodGroup?: true
    emergencyContact?: true
    insuranceInfo?: true
    createdBy?: true
    createdAtFacility?: true
    registrationSource?: true
    registrationNotes?: true
    updatedBy?: true
    updatedAtFacility?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: string
    mrn: string
    tenantId: string
    nationalId: string | null
    nationalIdType: string | null
    issuingCountry: string | null
    firstName: string
    lastName: string
    middleName: string | null
    dateOfBirth: Date
    gender: string
    maritalStatus: string | null
    nationality: string | null
    preferredLanguage: string | null
    phoneNumber: string | null
    email: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    bloodGroup: string | null
    emergencyContact: JsonValue | null
    insuranceInfo: JsonValue | null
    createdBy: string
    createdAtFacility: string
    registrationSource: string
    registrationNotes: string | null
    updatedBy: string | null
    updatedAtFacility: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    _count: PatientCountAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mrn?: boolean
    tenantId?: boolean
    nationalId?: boolean
    nationalIdType?: boolean
    issuingCountry?: boolean
    firstName?: boolean
    lastName?: boolean
    middleName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    maritalStatus?: boolean
    nationality?: boolean
    preferredLanguage?: boolean
    phoneNumber?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    bloodGroup?: boolean
    emergencyContact?: boolean
    insuranceInfo?: boolean
    createdBy?: boolean
    createdAtFacility?: boolean
    registrationSource?: boolean
    registrationNotes?: boolean
    updatedBy?: boolean
    updatedAtFacility?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    documents?: boolean | Patient$documentsArgs<ExtArgs>
    history?: boolean | Patient$historyArgs<ExtArgs>
    consents?: boolean | Patient$consentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mrn?: boolean
    tenantId?: boolean
    nationalId?: boolean
    nationalIdType?: boolean
    issuingCountry?: boolean
    firstName?: boolean
    lastName?: boolean
    middleName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    maritalStatus?: boolean
    nationality?: boolean
    preferredLanguage?: boolean
    phoneNumber?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    bloodGroup?: boolean
    emergencyContact?: boolean
    insuranceInfo?: boolean
    createdBy?: boolean
    createdAtFacility?: boolean
    registrationSource?: boolean
    registrationNotes?: boolean
    updatedBy?: boolean
    updatedAtFacility?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    mrn?: boolean
    tenantId?: boolean
    nationalId?: boolean
    nationalIdType?: boolean
    issuingCountry?: boolean
    firstName?: boolean
    lastName?: boolean
    middleName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    maritalStatus?: boolean
    nationality?: boolean
    preferredLanguage?: boolean
    phoneNumber?: boolean
    email?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    postalCode?: boolean
    country?: boolean
    bloodGroup?: boolean
    emergencyContact?: boolean
    insuranceInfo?: boolean
    createdBy?: boolean
    createdAtFacility?: boolean
    registrationSource?: boolean
    registrationNotes?: boolean
    updatedBy?: boolean
    updatedAtFacility?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Patient$appointmentsArgs<ExtArgs>
    encounters?: boolean | Patient$encountersArgs<ExtArgs>
    documents?: boolean | Patient$documentsArgs<ExtArgs>
    history?: boolean | Patient$historyArgs<ExtArgs>
    consents?: boolean | Patient$consentsArgs<ExtArgs>
    _count?: boolean | PatientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
      documents: Prisma.$PatientDocumentPayload<ExtArgs>[]
      history: Prisma.$PatientHistoryPayload<ExtArgs>[]
      consents: Prisma.$PatientConsentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mrn: string
      tenantId: string
      nationalId: string | null
      nationalIdType: string | null
      issuingCountry: string | null
      firstName: string
      lastName: string
      middleName: string | null
      dateOfBirth: Date
      gender: string
      maritalStatus: string | null
      nationality: string | null
      preferredLanguage: string | null
      phoneNumber: string | null
      email: string | null
      addressLine1: string | null
      addressLine2: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
      bloodGroup: string | null
      emergencyContact: Prisma.JsonValue | null
      insuranceInfo: Prisma.JsonValue | null
      createdBy: string
      createdAtFacility: string
      registrationSource: string
      registrationNotes: string | null
      updatedBy: string | null
      updatedAtFacility: string | null
      status: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
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
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Patient$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    encounters<T extends Patient$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Patient$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany"> | Null>
    documents<T extends Patient$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findMany"> | Null>
    history<T extends Patient$historyArgs<ExtArgs> = {}>(args?: Subset<T, Patient$historyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    consents<T extends Patient$consentsArgs<ExtArgs> = {}>(args?: Subset<T, Patient$consentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Patient model
   */ 
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'String'>
    readonly mrn: FieldRef<"Patient", 'String'>
    readonly tenantId: FieldRef<"Patient", 'String'>
    readonly nationalId: FieldRef<"Patient", 'String'>
    readonly nationalIdType: FieldRef<"Patient", 'String'>
    readonly issuingCountry: FieldRef<"Patient", 'String'>
    readonly firstName: FieldRef<"Patient", 'String'>
    readonly lastName: FieldRef<"Patient", 'String'>
    readonly middleName: FieldRef<"Patient", 'String'>
    readonly dateOfBirth: FieldRef<"Patient", 'DateTime'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly maritalStatus: FieldRef<"Patient", 'String'>
    readonly nationality: FieldRef<"Patient", 'String'>
    readonly preferredLanguage: FieldRef<"Patient", 'String'>
    readonly phoneNumber: FieldRef<"Patient", 'String'>
    readonly email: FieldRef<"Patient", 'String'>
    readonly addressLine1: FieldRef<"Patient", 'String'>
    readonly addressLine2: FieldRef<"Patient", 'String'>
    readonly city: FieldRef<"Patient", 'String'>
    readonly state: FieldRef<"Patient", 'String'>
    readonly postalCode: FieldRef<"Patient", 'String'>
    readonly country: FieldRef<"Patient", 'String'>
    readonly bloodGroup: FieldRef<"Patient", 'String'>
    readonly emergencyContact: FieldRef<"Patient", 'Json'>
    readonly insuranceInfo: FieldRef<"Patient", 'Json'>
    readonly createdBy: FieldRef<"Patient", 'String'>
    readonly createdAtFacility: FieldRef<"Patient", 'String'>
    readonly registrationSource: FieldRef<"Patient", 'String'>
    readonly registrationNotes: FieldRef<"Patient", 'String'>
    readonly updatedBy: FieldRef<"Patient", 'String'>
    readonly updatedAtFacility: FieldRef<"Patient", 'String'>
    readonly status: FieldRef<"Patient", 'String'>
    readonly createdAt: FieldRef<"Patient", 'DateTime'>
    readonly updatedAt: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
  }

  /**
   * Patient.appointments
   */
  export type Patient$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Patient.encounters
   */
  export type Patient$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Patient.documents
   */
  export type Patient$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    where?: PatientDocumentWhereInput
    orderBy?: PatientDocumentOrderByWithRelationInput | PatientDocumentOrderByWithRelationInput[]
    cursor?: PatientDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientDocumentScalarFieldEnum | PatientDocumentScalarFieldEnum[]
  }

  /**
   * Patient.history
   */
  export type Patient$historyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    where?: PatientHistoryWhereInput
    orderBy?: PatientHistoryOrderByWithRelationInput | PatientHistoryOrderByWithRelationInput[]
    cursor?: PatientHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientHistoryScalarFieldEnum | PatientHistoryScalarFieldEnum[]
  }

  /**
   * Patient.consents
   */
  export type Patient$consentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    where?: PatientConsentWhereInput
    orderBy?: PatientConsentOrderByWithRelationInput | PatientConsentOrderByWithRelationInput[]
    cursor?: PatientConsentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientConsentScalarFieldEnum | PatientConsentScalarFieldEnum[]
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentAvgAggregateOutputType = {
    duration: number | null
  }

  export type AppointmentSumAggregateOutputType = {
    duration: number | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    facilityId: string | null
    spaceId: string | null
    staffId: string | null
    appointmentType: string | null
    status: string | null
    startTime: Date | null
    endTime: Date | null
    duration: number | null
    notes: string | null
    visitType: string | null
    linkedEncounterId: string | null
    seriesId: string | null
    cancellationReason: string | null
    rescheduleReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    facilityId: string | null
    spaceId: string | null
    staffId: string | null
    appointmentType: string | null
    status: string | null
    startTime: Date | null
    endTime: Date | null
    duration: number | null
    notes: string | null
    visitType: string | null
    linkedEncounterId: string | null
    seriesId: string | null
    cancellationReason: string | null
    rescheduleReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    facilityId: number
    spaceId: number
    staffId: number
    appointmentType: number
    status: number
    startTime: number
    endTime: number
    duration: number
    notes: number
    visitType: number
    linkedEncounterId: number
    seriesId: number
    cancellationReason: number
    rescheduleReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppointmentAvgAggregateInputType = {
    duration?: true
  }

  export type AppointmentSumAggregateInputType = {
    duration?: true
  }

  export type AppointmentMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    spaceId?: true
    staffId?: true
    appointmentType?: true
    status?: true
    startTime?: true
    endTime?: true
    duration?: true
    notes?: true
    visitType?: true
    linkedEncounterId?: true
    seriesId?: true
    cancellationReason?: true
    rescheduleReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    spaceId?: true
    staffId?: true
    appointmentType?: true
    status?: true
    startTime?: true
    endTime?: true
    duration?: true
    notes?: true
    visitType?: true
    linkedEncounterId?: true
    seriesId?: true
    cancellationReason?: true
    rescheduleReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    spaceId?: true
    staffId?: true
    appointmentType?: true
    status?: true
    startTime?: true
    endTime?: true
    duration?: true
    notes?: true
    visitType?: true
    linkedEncounterId?: true
    seriesId?: true
    cancellationReason?: true
    rescheduleReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _avg?: AppointmentAvgAggregateInputType
    _sum?: AppointmentSumAggregateInputType
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    facilityId: string
    spaceId: string | null
    staffId: string | null
    appointmentType: string
    status: string
    startTime: Date
    endTime: Date
    duration: number
    notes: string | null
    visitType: string | null
    linkedEncounterId: string | null
    seriesId: string | null
    cancellationReason: string | null
    rescheduleReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    spaceId?: boolean
    staffId?: boolean
    appointmentType?: boolean
    status?: boolean
    startTime?: boolean
    endTime?: boolean
    duration?: boolean
    notes?: boolean
    visitType?: boolean
    linkedEncounterId?: boolean
    seriesId?: boolean
    cancellationReason?: boolean
    rescheduleReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounters?: boolean | Appointment$encountersArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    spaceId?: boolean
    staffId?: boolean
    appointmentType?: boolean
    status?: boolean
    startTime?: boolean
    endTime?: boolean
    duration?: boolean
    notes?: boolean
    visitType?: boolean
    linkedEncounterId?: boolean
    seriesId?: boolean
    cancellationReason?: boolean
    rescheduleReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    spaceId?: boolean
    staffId?: boolean
    appointmentType?: boolean
    status?: boolean
    startTime?: boolean
    endTime?: boolean
    duration?: boolean
    notes?: boolean
    visitType?: boolean
    linkedEncounterId?: boolean
    seriesId?: boolean
    cancellationReason?: boolean
    rescheduleReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
    encounters?: boolean | Appointment$encountersArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
      encounters: Prisma.$EncounterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      facilityId: string
      spaceId: string | null
      staffId: string | null
      appointmentType: string
      status: string
      startTime: Date
      endTime: Date
      duration: number
      notes: string | null
      visitType: string | null
      linkedEncounterId: string | null
      seriesId: string | null
      cancellationReason: string | null
      rescheduleReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
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
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    encounters<T extends Appointment$encountersArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$encountersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Appointment model
   */ 
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly tenantId: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly facilityId: FieldRef<"Appointment", 'String'>
    readonly spaceId: FieldRef<"Appointment", 'String'>
    readonly staffId: FieldRef<"Appointment", 'String'>
    readonly appointmentType: FieldRef<"Appointment", 'String'>
    readonly status: FieldRef<"Appointment", 'String'>
    readonly startTime: FieldRef<"Appointment", 'DateTime'>
    readonly endTime: FieldRef<"Appointment", 'DateTime'>
    readonly duration: FieldRef<"Appointment", 'Int'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly visitType: FieldRef<"Appointment", 'String'>
    readonly linkedEncounterId: FieldRef<"Appointment", 'String'>
    readonly seriesId: FieldRef<"Appointment", 'String'>
    readonly cancellationReason: FieldRef<"Appointment", 'String'>
    readonly rescheduleReason: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment.encounters
   */
  export type Appointment$encountersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    cursor?: EncounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model Encounter
   */

  export type AggregateEncounter = {
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  export type EncounterMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    facilityId: string | null
    appointmentId: string | null
    primaryStaffId: string | null
    encounterClass: string | null
    status: string | null
    priority: string | null
    startTime: Date | null
    endTime: Date | null
    encounterSource: string | null
    chiefComplaint: string | null
    presentingSymptoms: string | null
    medicalHistory: string | null
    socialHistory: string | null
    familyHistory: string | null
    notes: string | null
    dischargeDisposition: string | null
    followUpInstructions: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    facilityId: string | null
    appointmentId: string | null
    primaryStaffId: string | null
    encounterClass: string | null
    status: string | null
    priority: string | null
    startTime: Date | null
    endTime: Date | null
    encounterSource: string | null
    chiefComplaint: string | null
    presentingSymptoms: string | null
    medicalHistory: string | null
    socialHistory: string | null
    familyHistory: string | null
    notes: string | null
    dischargeDisposition: string | null
    followUpInstructions: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EncounterCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    facilityId: number
    appointmentId: number
    primaryStaffId: number
    encounterClass: number
    status: number
    priority: number
    startTime: number
    endTime: number
    encounterSource: number
    walkInDetails: number
    chiefComplaint: number
    presentingSymptoms: number
    vitalSigns: number
    allergies: number
    currentMedications: number
    medicalHistory: number
    socialHistory: number
    familyHistory: number
    notes: number
    dischargeDisposition: number
    followUpInstructions: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EncounterMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    appointmentId?: true
    primaryStaffId?: true
    encounterClass?: true
    status?: true
    priority?: true
    startTime?: true
    endTime?: true
    encounterSource?: true
    chiefComplaint?: true
    presentingSymptoms?: true
    medicalHistory?: true
    socialHistory?: true
    familyHistory?: true
    notes?: true
    dischargeDisposition?: true
    followUpInstructions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    appointmentId?: true
    primaryStaffId?: true
    encounterClass?: true
    status?: true
    priority?: true
    startTime?: true
    endTime?: true
    encounterSource?: true
    chiefComplaint?: true
    presentingSymptoms?: true
    medicalHistory?: true
    socialHistory?: true
    familyHistory?: true
    notes?: true
    dischargeDisposition?: true
    followUpInstructions?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EncounterCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    facilityId?: true
    appointmentId?: true
    primaryStaffId?: true
    encounterClass?: true
    status?: true
    priority?: true
    startTime?: true
    endTime?: true
    encounterSource?: true
    walkInDetails?: true
    chiefComplaint?: true
    presentingSymptoms?: true
    vitalSigns?: true
    allergies?: true
    currentMedications?: true
    medicalHistory?: true
    socialHistory?: true
    familyHistory?: true
    notes?: true
    dischargeDisposition?: true
    followUpInstructions?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EncounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounter to aggregate.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Encounters
    **/
    _count?: true | EncounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EncounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EncounterMaxAggregateInputType
  }

  export type GetEncounterAggregateType<T extends EncounterAggregateArgs> = {
        [P in keyof T & keyof AggregateEncounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEncounter[P]>
      : GetScalarType<T[P], AggregateEncounter[P]>
  }




  export type EncounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EncounterWhereInput
    orderBy?: EncounterOrderByWithAggregationInput | EncounterOrderByWithAggregationInput[]
    by: EncounterScalarFieldEnum[] | EncounterScalarFieldEnum
    having?: EncounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EncounterCountAggregateInputType | true
    _min?: EncounterMinAggregateInputType
    _max?: EncounterMaxAggregateInputType
  }

  export type EncounterGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    facilityId: string
    appointmentId: string | null
    primaryStaffId: string
    encounterClass: string
    status: string
    priority: string
    startTime: Date
    endTime: Date | null
    encounterSource: string
    walkInDetails: JsonValue | null
    chiefComplaint: string | null
    presentingSymptoms: string | null
    vitalSigns: JsonValue | null
    allergies: JsonValue | null
    currentMedications: JsonValue | null
    medicalHistory: string | null
    socialHistory: string | null
    familyHistory: string | null
    notes: string | null
    dischargeDisposition: string | null
    followUpInstructions: string | null
    createdAt: Date
    updatedAt: Date
    _count: EncounterCountAggregateOutputType | null
    _min: EncounterMinAggregateOutputType | null
    _max: EncounterMaxAggregateOutputType | null
  }

  type GetEncounterGroupByPayload<T extends EncounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EncounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EncounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EncounterGroupByOutputType[P]>
            : GetScalarType<T[P], EncounterGroupByOutputType[P]>
        }
      >
    >


  export type EncounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    appointmentId?: boolean
    primaryStaffId?: boolean
    encounterClass?: boolean
    status?: boolean
    priority?: boolean
    startTime?: boolean
    endTime?: boolean
    encounterSource?: boolean
    walkInDetails?: boolean
    chiefComplaint?: boolean
    presentingSymptoms?: boolean
    vitalSigns?: boolean
    allergies?: boolean
    currentMedications?: boolean
    medicalHistory?: boolean
    socialHistory?: boolean
    familyHistory?: boolean
    notes?: boolean
    dischargeDisposition?: boolean
    followUpInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | Encounter$appointmentArgs<ExtArgs>
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    appointmentId?: boolean
    primaryStaffId?: boolean
    encounterClass?: boolean
    status?: boolean
    priority?: boolean
    startTime?: boolean
    endTime?: boolean
    encounterSource?: boolean
    walkInDetails?: boolean
    chiefComplaint?: boolean
    presentingSymptoms?: boolean
    vitalSigns?: boolean
    allergies?: boolean
    currentMedications?: boolean
    medicalHistory?: boolean
    socialHistory?: boolean
    familyHistory?: boolean
    notes?: boolean
    dischargeDisposition?: boolean
    followUpInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | Encounter$appointmentArgs<ExtArgs>
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["encounter"]>

  export type EncounterSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    facilityId?: boolean
    appointmentId?: boolean
    primaryStaffId?: boolean
    encounterClass?: boolean
    status?: boolean
    priority?: boolean
    startTime?: boolean
    endTime?: boolean
    encounterSource?: boolean
    walkInDetails?: boolean
    chiefComplaint?: boolean
    presentingSymptoms?: boolean
    vitalSigns?: boolean
    allergies?: boolean
    currentMedications?: boolean
    medicalHistory?: boolean
    socialHistory?: boolean
    familyHistory?: boolean
    notes?: boolean
    dischargeDisposition?: boolean
    followUpInstructions?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EncounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | Encounter$appointmentArgs<ExtArgs>
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type EncounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | Encounter$appointmentArgs<ExtArgs>
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $EncounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Encounter"
    objects: {
      appointment: Prisma.$AppointmentPayload<ExtArgs> | null
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      facilityId: string
      appointmentId: string | null
      primaryStaffId: string
      encounterClass: string
      status: string
      priority: string
      startTime: Date
      endTime: Date | null
      encounterSource: string
      walkInDetails: Prisma.JsonValue | null
      chiefComplaint: string | null
      presentingSymptoms: string | null
      vitalSigns: Prisma.JsonValue | null
      allergies: Prisma.JsonValue | null
      currentMedications: Prisma.JsonValue | null
      medicalHistory: string | null
      socialHistory: string | null
      familyHistory: string | null
      notes: string | null
      dischargeDisposition: string | null
      followUpInstructions: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["encounter"]>
    composites: {}
  }

  type EncounterGetPayload<S extends boolean | null | undefined | EncounterDefaultArgs> = $Result.GetResult<Prisma.$EncounterPayload, S>

  type EncounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EncounterFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EncounterCountAggregateInputType | true
    }

  export interface EncounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Encounter'], meta: { name: 'Encounter' } }
    /**
     * Find zero or one Encounter that matches the filter.
     * @param {EncounterFindUniqueArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EncounterFindUniqueArgs>(args: SelectSubset<T, EncounterFindUniqueArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Encounter that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EncounterFindUniqueOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EncounterFindUniqueOrThrowArgs>(args: SelectSubset<T, EncounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Encounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EncounterFindFirstArgs>(args?: SelectSubset<T, EncounterFindFirstArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Encounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindFirstOrThrowArgs} args - Arguments to find a Encounter
     * @example
     * // Get one Encounter
     * const encounter = await prisma.encounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EncounterFindFirstOrThrowArgs>(args?: SelectSubset<T, EncounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Encounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Encounters
     * const encounters = await prisma.encounter.findMany()
     * 
     * // Get first 10 Encounters
     * const encounters = await prisma.encounter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const encounterWithIdOnly = await prisma.encounter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EncounterFindManyArgs>(args?: SelectSubset<T, EncounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Encounter.
     * @param {EncounterCreateArgs} args - Arguments to create a Encounter.
     * @example
     * // Create one Encounter
     * const Encounter = await prisma.encounter.create({
     *   data: {
     *     // ... data to create a Encounter
     *   }
     * })
     * 
     */
    create<T extends EncounterCreateArgs>(args: SelectSubset<T, EncounterCreateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Encounters.
     * @param {EncounterCreateManyArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EncounterCreateManyArgs>(args?: SelectSubset<T, EncounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Encounters and returns the data saved in the database.
     * @param {EncounterCreateManyAndReturnArgs} args - Arguments to create many Encounters.
     * @example
     * // Create many Encounters
     * const encounter = await prisma.encounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Encounters and only return the `id`
     * const encounterWithIdOnly = await prisma.encounter.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EncounterCreateManyAndReturnArgs>(args?: SelectSubset<T, EncounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Encounter.
     * @param {EncounterDeleteArgs} args - Arguments to delete one Encounter.
     * @example
     * // Delete one Encounter
     * const Encounter = await prisma.encounter.delete({
     *   where: {
     *     // ... filter to delete one Encounter
     *   }
     * })
     * 
     */
    delete<T extends EncounterDeleteArgs>(args: SelectSubset<T, EncounterDeleteArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Encounter.
     * @param {EncounterUpdateArgs} args - Arguments to update one Encounter.
     * @example
     * // Update one Encounter
     * const encounter = await prisma.encounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EncounterUpdateArgs>(args: SelectSubset<T, EncounterUpdateArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Encounters.
     * @param {EncounterDeleteManyArgs} args - Arguments to filter Encounters to delete.
     * @example
     * // Delete a few Encounters
     * const { count } = await prisma.encounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EncounterDeleteManyArgs>(args?: SelectSubset<T, EncounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Encounters
     * const encounter = await prisma.encounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EncounterUpdateManyArgs>(args: SelectSubset<T, EncounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Encounter.
     * @param {EncounterUpsertArgs} args - Arguments to update or create a Encounter.
     * @example
     * // Update or create a Encounter
     * const encounter = await prisma.encounter.upsert({
     *   create: {
     *     // ... data to create a Encounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Encounter we want to update
     *   }
     * })
     */
    upsert<T extends EncounterUpsertArgs>(args: SelectSubset<T, EncounterUpsertArgs<ExtArgs>>): Prisma__EncounterClient<$Result.GetResult<Prisma.$EncounterPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Encounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterCountArgs} args - Arguments to filter Encounters to count.
     * @example
     * // Count the number of Encounters
     * const count = await prisma.encounter.count({
     *   where: {
     *     // ... the filter for the Encounters we want to count
     *   }
     * })
    **/
    count<T extends EncounterCountArgs>(
      args?: Subset<T, EncounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EncounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EncounterAggregateArgs>(args: Subset<T, EncounterAggregateArgs>): Prisma.PrismaPromise<GetEncounterAggregateType<T>>

    /**
     * Group by Encounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EncounterGroupByArgs} args - Group by arguments.
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
      T extends EncounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EncounterGroupByArgs['orderBy'] }
        : { orderBy?: EncounterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EncounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEncounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Encounter model
   */
  readonly fields: EncounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Encounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EncounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointment<T extends Encounter$appointmentArgs<ExtArgs> = {}>(args?: Subset<T, Encounter$appointmentArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Encounter model
   */ 
  interface EncounterFieldRefs {
    readonly id: FieldRef<"Encounter", 'String'>
    readonly tenantId: FieldRef<"Encounter", 'String'>
    readonly patientId: FieldRef<"Encounter", 'String'>
    readonly facilityId: FieldRef<"Encounter", 'String'>
    readonly appointmentId: FieldRef<"Encounter", 'String'>
    readonly primaryStaffId: FieldRef<"Encounter", 'String'>
    readonly encounterClass: FieldRef<"Encounter", 'String'>
    readonly status: FieldRef<"Encounter", 'String'>
    readonly priority: FieldRef<"Encounter", 'String'>
    readonly startTime: FieldRef<"Encounter", 'DateTime'>
    readonly endTime: FieldRef<"Encounter", 'DateTime'>
    readonly encounterSource: FieldRef<"Encounter", 'String'>
    readonly walkInDetails: FieldRef<"Encounter", 'Json'>
    readonly chiefComplaint: FieldRef<"Encounter", 'String'>
    readonly presentingSymptoms: FieldRef<"Encounter", 'String'>
    readonly vitalSigns: FieldRef<"Encounter", 'Json'>
    readonly allergies: FieldRef<"Encounter", 'Json'>
    readonly currentMedications: FieldRef<"Encounter", 'Json'>
    readonly medicalHistory: FieldRef<"Encounter", 'String'>
    readonly socialHistory: FieldRef<"Encounter", 'String'>
    readonly familyHistory: FieldRef<"Encounter", 'String'>
    readonly notes: FieldRef<"Encounter", 'String'>
    readonly dischargeDisposition: FieldRef<"Encounter", 'String'>
    readonly followUpInstructions: FieldRef<"Encounter", 'String'>
    readonly createdAt: FieldRef<"Encounter", 'DateTime'>
    readonly updatedAt: FieldRef<"Encounter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Encounter findUnique
   */
  export type EncounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findUniqueOrThrow
   */
  export type EncounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter findFirst
   */
  export type EncounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findFirstOrThrow
   */
  export type EncounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounter to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Encounters.
     */
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter findMany
   */
  export type EncounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter, which Encounters to fetch.
     */
    where?: EncounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Encounters to fetch.
     */
    orderBy?: EncounterOrderByWithRelationInput | EncounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Encounters.
     */
    cursor?: EncounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Encounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Encounters.
     */
    skip?: number
    distinct?: EncounterScalarFieldEnum | EncounterScalarFieldEnum[]
  }

  /**
   * Encounter create
   */
  export type EncounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to create a Encounter.
     */
    data: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
  }

  /**
   * Encounter createMany
   */
  export type EncounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Encounter createManyAndReturn
   */
  export type EncounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Encounters.
     */
    data: EncounterCreateManyInput | EncounterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Encounter update
   */
  export type EncounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The data needed to update a Encounter.
     */
    data: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
    /**
     * Choose, which Encounter to update.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter updateMany
   */
  export type EncounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Encounters.
     */
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyInput>
    /**
     * Filter which Encounters to update
     */
    where?: EncounterWhereInput
  }

  /**
   * Encounter upsert
   */
  export type EncounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * The filter to search for the Encounter to update in case it exists.
     */
    where: EncounterWhereUniqueInput
    /**
     * In case the Encounter found by the `where` argument doesn't exist, create a new Encounter with this data.
     */
    create: XOR<EncounterCreateInput, EncounterUncheckedCreateInput>
    /**
     * In case the Encounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EncounterUpdateInput, EncounterUncheckedUpdateInput>
  }

  /**
   * Encounter delete
   */
  export type EncounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
    /**
     * Filter which Encounter to delete.
     */
    where: EncounterWhereUniqueInput
  }

  /**
   * Encounter deleteMany
   */
  export type EncounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Encounters to delete
     */
    where?: EncounterWhereInput
  }

  /**
   * Encounter.appointment
   */
  export type Encounter$appointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
  }

  /**
   * Encounter without action
   */
  export type EncounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Encounter
     */
    select?: EncounterSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EncounterInclude<ExtArgs> | null
  }


  /**
   * Model PatientDocument
   */

  export type AggregatePatientDocument = {
    _count: PatientDocumentCountAggregateOutputType | null
    _min: PatientDocumentMinAggregateOutputType | null
    _max: PatientDocumentMaxAggregateOutputType | null
  }

  export type PatientDocumentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    documentType: string | null
    documentNumber: string | null
    issuingCountry: string | null
    issuingAuthority: string | null
    issueDate: Date | null
    expiryDate: Date | null
    isPrimaryIdentity: boolean | null
    documentUrl: string | null
    verificationStatus: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    verificationNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientDocumentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    documentType: string | null
    documentNumber: string | null
    issuingCountry: string | null
    issuingAuthority: string | null
    issueDate: Date | null
    expiryDate: Date | null
    isPrimaryIdentity: boolean | null
    documentUrl: string | null
    verificationStatus: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    verificationNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientDocumentCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    documentType: number
    documentNumber: number
    issuingCountry: number
    issuingAuthority: number
    issueDate: number
    expiryDate: number
    isPrimaryIdentity: number
    documentUrl: number
    verificationStatus: number
    verifiedBy: number
    verifiedAt: number
    verificationNotes: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientDocumentMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    documentType?: true
    documentNumber?: true
    issuingCountry?: true
    issuingAuthority?: true
    issueDate?: true
    expiryDate?: true
    isPrimaryIdentity?: true
    documentUrl?: true
    verificationStatus?: true
    verifiedBy?: true
    verifiedAt?: true
    verificationNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientDocumentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    documentType?: true
    documentNumber?: true
    issuingCountry?: true
    issuingAuthority?: true
    issueDate?: true
    expiryDate?: true
    isPrimaryIdentity?: true
    documentUrl?: true
    verificationStatus?: true
    verifiedBy?: true
    verifiedAt?: true
    verificationNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientDocumentCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    documentType?: true
    documentNumber?: true
    issuingCountry?: true
    issuingAuthority?: true
    issueDate?: true
    expiryDate?: true
    isPrimaryIdentity?: true
    documentUrl?: true
    verificationStatus?: true
    verifiedBy?: true
    verifiedAt?: true
    verificationNotes?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientDocument to aggregate.
     */
    where?: PatientDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientDocuments to fetch.
     */
    orderBy?: PatientDocumentOrderByWithRelationInput | PatientDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientDocuments
    **/
    _count?: true | PatientDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientDocumentMaxAggregateInputType
  }

  export type GetPatientDocumentAggregateType<T extends PatientDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientDocument[P]>
      : GetScalarType<T[P], AggregatePatientDocument[P]>
  }




  export type PatientDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientDocumentWhereInput
    orderBy?: PatientDocumentOrderByWithAggregationInput | PatientDocumentOrderByWithAggregationInput[]
    by: PatientDocumentScalarFieldEnum[] | PatientDocumentScalarFieldEnum
    having?: PatientDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientDocumentCountAggregateInputType | true
    _min?: PatientDocumentMinAggregateInputType
    _max?: PatientDocumentMaxAggregateInputType
  }

  export type PatientDocumentGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority: string | null
    issueDate: Date | null
    expiryDate: Date | null
    isPrimaryIdentity: boolean
    documentUrl: string | null
    verificationStatus: string
    verifiedBy: string | null
    verifiedAt: Date | null
    verificationNotes: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: PatientDocumentCountAggregateOutputType | null
    _min: PatientDocumentMinAggregateOutputType | null
    _max: PatientDocumentMaxAggregateOutputType | null
  }

  type GetPatientDocumentGroupByPayload<T extends PatientDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], PatientDocumentGroupByOutputType[P]>
        }
      >
    >


  export type PatientDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    issuingCountry?: boolean
    issuingAuthority?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    isPrimaryIdentity?: boolean
    documentUrl?: boolean
    verificationStatus?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    verificationNotes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientDocument"]>

  export type PatientDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    issuingCountry?: boolean
    issuingAuthority?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    isPrimaryIdentity?: boolean
    documentUrl?: boolean
    verificationStatus?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    verificationNotes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientDocument"]>

  export type PatientDocumentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    documentType?: boolean
    documentNumber?: boolean
    issuingCountry?: boolean
    issuingAuthority?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    isPrimaryIdentity?: boolean
    documentUrl?: boolean
    verificationStatus?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    verificationNotes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type PatientDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $PatientDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientDocument"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      documentType: string
      documentNumber: string
      issuingCountry: string
      issuingAuthority: string | null
      issueDate: Date | null
      expiryDate: Date | null
      isPrimaryIdentity: boolean
      documentUrl: string | null
      verificationStatus: string
      verifiedBy: string | null
      verifiedAt: Date | null
      verificationNotes: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patientDocument"]>
    composites: {}
  }

  type PatientDocumentGetPayload<S extends boolean | null | undefined | PatientDocumentDefaultArgs> = $Result.GetResult<Prisma.$PatientDocumentPayload, S>

  type PatientDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientDocumentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientDocumentCountAggregateInputType | true
    }

  export interface PatientDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientDocument'], meta: { name: 'PatientDocument' } }
    /**
     * Find zero or one PatientDocument that matches the filter.
     * @param {PatientDocumentFindUniqueArgs} args - Arguments to find a PatientDocument
     * @example
     * // Get one PatientDocument
     * const patientDocument = await prisma.patientDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientDocumentFindUniqueArgs>(args: SelectSubset<T, PatientDocumentFindUniqueArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientDocument that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientDocumentFindUniqueOrThrowArgs} args - Arguments to find a PatientDocument
     * @example
     * // Get one PatientDocument
     * const patientDocument = await prisma.patientDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentFindFirstArgs} args - Arguments to find a PatientDocument
     * @example
     * // Get one PatientDocument
     * const patientDocument = await prisma.patientDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientDocumentFindFirstArgs>(args?: SelectSubset<T, PatientDocumentFindFirstArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentFindFirstOrThrowArgs} args - Arguments to find a PatientDocument
     * @example
     * // Get one PatientDocument
     * const patientDocument = await prisma.patientDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientDocuments
     * const patientDocuments = await prisma.patientDocument.findMany()
     * 
     * // Get first 10 PatientDocuments
     * const patientDocuments = await prisma.patientDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientDocumentWithIdOnly = await prisma.patientDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientDocumentFindManyArgs>(args?: SelectSubset<T, PatientDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientDocument.
     * @param {PatientDocumentCreateArgs} args - Arguments to create a PatientDocument.
     * @example
     * // Create one PatientDocument
     * const PatientDocument = await prisma.patientDocument.create({
     *   data: {
     *     // ... data to create a PatientDocument
     *   }
     * })
     * 
     */
    create<T extends PatientDocumentCreateArgs>(args: SelectSubset<T, PatientDocumentCreateArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientDocuments.
     * @param {PatientDocumentCreateManyArgs} args - Arguments to create many PatientDocuments.
     * @example
     * // Create many PatientDocuments
     * const patientDocument = await prisma.patientDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientDocumentCreateManyArgs>(args?: SelectSubset<T, PatientDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientDocuments and returns the data saved in the database.
     * @param {PatientDocumentCreateManyAndReturnArgs} args - Arguments to create many PatientDocuments.
     * @example
     * // Create many PatientDocuments
     * const patientDocument = await prisma.patientDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientDocuments and only return the `id`
     * const patientDocumentWithIdOnly = await prisma.patientDocument.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientDocument.
     * @param {PatientDocumentDeleteArgs} args - Arguments to delete one PatientDocument.
     * @example
     * // Delete one PatientDocument
     * const PatientDocument = await prisma.patientDocument.delete({
     *   where: {
     *     // ... filter to delete one PatientDocument
     *   }
     * })
     * 
     */
    delete<T extends PatientDocumentDeleteArgs>(args: SelectSubset<T, PatientDocumentDeleteArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientDocument.
     * @param {PatientDocumentUpdateArgs} args - Arguments to update one PatientDocument.
     * @example
     * // Update one PatientDocument
     * const patientDocument = await prisma.patientDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientDocumentUpdateArgs>(args: SelectSubset<T, PatientDocumentUpdateArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientDocuments.
     * @param {PatientDocumentDeleteManyArgs} args - Arguments to filter PatientDocuments to delete.
     * @example
     * // Delete a few PatientDocuments
     * const { count } = await prisma.patientDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDocumentDeleteManyArgs>(args?: SelectSubset<T, PatientDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientDocuments
     * const patientDocument = await prisma.patientDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientDocumentUpdateManyArgs>(args: SelectSubset<T, PatientDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientDocument.
     * @param {PatientDocumentUpsertArgs} args - Arguments to update or create a PatientDocument.
     * @example
     * // Update or create a PatientDocument
     * const patientDocument = await prisma.patientDocument.upsert({
     *   create: {
     *     // ... data to create a PatientDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientDocument we want to update
     *   }
     * })
     */
    upsert<T extends PatientDocumentUpsertArgs>(args: SelectSubset<T, PatientDocumentUpsertArgs<ExtArgs>>): Prisma__PatientDocumentClient<$Result.GetResult<Prisma.$PatientDocumentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentCountArgs} args - Arguments to filter PatientDocuments to count.
     * @example
     * // Count the number of PatientDocuments
     * const count = await prisma.patientDocument.count({
     *   where: {
     *     // ... the filter for the PatientDocuments we want to count
     *   }
     * })
    **/
    count<T extends PatientDocumentCountArgs>(
      args?: Subset<T, PatientDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientDocumentAggregateArgs>(args: Subset<T, PatientDocumentAggregateArgs>): Prisma.PrismaPromise<GetPatientDocumentAggregateType<T>>

    /**
     * Group by PatientDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientDocumentGroupByArgs} args - Group by arguments.
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
      T extends PatientDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientDocumentGroupByArgs['orderBy'] }
        : { orderBy?: PatientDocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientDocument model
   */
  readonly fields: PatientDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PatientDocument model
   */ 
  interface PatientDocumentFieldRefs {
    readonly id: FieldRef<"PatientDocument", 'String'>
    readonly tenantId: FieldRef<"PatientDocument", 'String'>
    readonly patientId: FieldRef<"PatientDocument", 'String'>
    readonly documentType: FieldRef<"PatientDocument", 'String'>
    readonly documentNumber: FieldRef<"PatientDocument", 'String'>
    readonly issuingCountry: FieldRef<"PatientDocument", 'String'>
    readonly issuingAuthority: FieldRef<"PatientDocument", 'String'>
    readonly issueDate: FieldRef<"PatientDocument", 'DateTime'>
    readonly expiryDate: FieldRef<"PatientDocument", 'DateTime'>
    readonly isPrimaryIdentity: FieldRef<"PatientDocument", 'Boolean'>
    readonly documentUrl: FieldRef<"PatientDocument", 'String'>
    readonly verificationStatus: FieldRef<"PatientDocument", 'String'>
    readonly verifiedBy: FieldRef<"PatientDocument", 'String'>
    readonly verifiedAt: FieldRef<"PatientDocument", 'DateTime'>
    readonly verificationNotes: FieldRef<"PatientDocument", 'String'>
    readonly metadata: FieldRef<"PatientDocument", 'Json'>
    readonly createdAt: FieldRef<"PatientDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"PatientDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientDocument findUnique
   */
  export type PatientDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter, which PatientDocument to fetch.
     */
    where: PatientDocumentWhereUniqueInput
  }

  /**
   * PatientDocument findUniqueOrThrow
   */
  export type PatientDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter, which PatientDocument to fetch.
     */
    where: PatientDocumentWhereUniqueInput
  }

  /**
   * PatientDocument findFirst
   */
  export type PatientDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter, which PatientDocument to fetch.
     */
    where?: PatientDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientDocuments to fetch.
     */
    orderBy?: PatientDocumentOrderByWithRelationInput | PatientDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientDocuments.
     */
    cursor?: PatientDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientDocuments.
     */
    distinct?: PatientDocumentScalarFieldEnum | PatientDocumentScalarFieldEnum[]
  }

  /**
   * PatientDocument findFirstOrThrow
   */
  export type PatientDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter, which PatientDocument to fetch.
     */
    where?: PatientDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientDocuments to fetch.
     */
    orderBy?: PatientDocumentOrderByWithRelationInput | PatientDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientDocuments.
     */
    cursor?: PatientDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientDocuments.
     */
    distinct?: PatientDocumentScalarFieldEnum | PatientDocumentScalarFieldEnum[]
  }

  /**
   * PatientDocument findMany
   */
  export type PatientDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter, which PatientDocuments to fetch.
     */
    where?: PatientDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientDocuments to fetch.
     */
    orderBy?: PatientDocumentOrderByWithRelationInput | PatientDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientDocuments.
     */
    cursor?: PatientDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientDocuments.
     */
    skip?: number
    distinct?: PatientDocumentScalarFieldEnum | PatientDocumentScalarFieldEnum[]
  }

  /**
   * PatientDocument create
   */
  export type PatientDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientDocument.
     */
    data: XOR<PatientDocumentCreateInput, PatientDocumentUncheckedCreateInput>
  }

  /**
   * PatientDocument createMany
   */
  export type PatientDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientDocuments.
     */
    data: PatientDocumentCreateManyInput | PatientDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientDocument createManyAndReturn
   */
  export type PatientDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientDocuments.
     */
    data: PatientDocumentCreateManyInput | PatientDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientDocument update
   */
  export type PatientDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientDocument.
     */
    data: XOR<PatientDocumentUpdateInput, PatientDocumentUncheckedUpdateInput>
    /**
     * Choose, which PatientDocument to update.
     */
    where: PatientDocumentWhereUniqueInput
  }

  /**
   * PatientDocument updateMany
   */
  export type PatientDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientDocuments.
     */
    data: XOR<PatientDocumentUpdateManyMutationInput, PatientDocumentUncheckedUpdateManyInput>
    /**
     * Filter which PatientDocuments to update
     */
    where?: PatientDocumentWhereInput
  }

  /**
   * PatientDocument upsert
   */
  export type PatientDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientDocument to update in case it exists.
     */
    where: PatientDocumentWhereUniqueInput
    /**
     * In case the PatientDocument found by the `where` argument doesn't exist, create a new PatientDocument with this data.
     */
    create: XOR<PatientDocumentCreateInput, PatientDocumentUncheckedCreateInput>
    /**
     * In case the PatientDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientDocumentUpdateInput, PatientDocumentUncheckedUpdateInput>
  }

  /**
   * PatientDocument delete
   */
  export type PatientDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
    /**
     * Filter which PatientDocument to delete.
     */
    where: PatientDocumentWhereUniqueInput
  }

  /**
   * PatientDocument deleteMany
   */
  export type PatientDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientDocuments to delete
     */
    where?: PatientDocumentWhereInput
  }

  /**
   * PatientDocument without action
   */
  export type PatientDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientDocument
     */
    select?: PatientDocumentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientDocumentInclude<ExtArgs> | null
  }


  /**
   * Model PatientHistory
   */

  export type AggregatePatientHistory = {
    _count: PatientHistoryCountAggregateOutputType | null
    _min: PatientHistoryMinAggregateOutputType | null
    _max: PatientHistoryMaxAggregateOutputType | null
  }

  export type PatientHistoryMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    fieldName: string | null
    oldValue: string | null
    newValue: string | null
    changeType: string | null
    changeReason: string | null
    supportingDocUrl: string | null
    changedBy: string | null
    approvedBy: string | null
    changedAtFacility: string | null
    changedAt: Date | null
    patientConsent: boolean | null
    consentDocUrl: string | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type PatientHistoryMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    fieldName: string | null
    oldValue: string | null
    newValue: string | null
    changeType: string | null
    changeReason: string | null
    supportingDocUrl: string | null
    changedBy: string | null
    approvedBy: string | null
    changedAtFacility: string | null
    changedAt: Date | null
    patientConsent: boolean | null
    consentDocUrl: string | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type PatientHistoryCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    fieldName: number
    oldValue: number
    newValue: number
    changeType: number
    changeReason: number
    supportingDocUrl: number
    changedBy: number
    approvedBy: number
    changedAtFacility: number
    changedAt: number
    patientConsent: number
    consentDocUrl: number
    ipAddress: number
    userAgent: number
    _all: number
  }


  export type PatientHistoryMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    fieldName?: true
    oldValue?: true
    newValue?: true
    changeType?: true
    changeReason?: true
    supportingDocUrl?: true
    changedBy?: true
    approvedBy?: true
    changedAtFacility?: true
    changedAt?: true
    patientConsent?: true
    consentDocUrl?: true
    ipAddress?: true
    userAgent?: true
  }

  export type PatientHistoryMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    fieldName?: true
    oldValue?: true
    newValue?: true
    changeType?: true
    changeReason?: true
    supportingDocUrl?: true
    changedBy?: true
    approvedBy?: true
    changedAtFacility?: true
    changedAt?: true
    patientConsent?: true
    consentDocUrl?: true
    ipAddress?: true
    userAgent?: true
  }

  export type PatientHistoryCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    fieldName?: true
    oldValue?: true
    newValue?: true
    changeType?: true
    changeReason?: true
    supportingDocUrl?: true
    changedBy?: true
    approvedBy?: true
    changedAtFacility?: true
    changedAt?: true
    patientConsent?: true
    consentDocUrl?: true
    ipAddress?: true
    userAgent?: true
    _all?: true
  }

  export type PatientHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientHistory to aggregate.
     */
    where?: PatientHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientHistories to fetch.
     */
    orderBy?: PatientHistoryOrderByWithRelationInput | PatientHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientHistories
    **/
    _count?: true | PatientHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientHistoryMaxAggregateInputType
  }

  export type GetPatientHistoryAggregateType<T extends PatientHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientHistory[P]>
      : GetScalarType<T[P], AggregatePatientHistory[P]>
  }




  export type PatientHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientHistoryWhereInput
    orderBy?: PatientHistoryOrderByWithAggregationInput | PatientHistoryOrderByWithAggregationInput[]
    by: PatientHistoryScalarFieldEnum[] | PatientHistoryScalarFieldEnum
    having?: PatientHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientHistoryCountAggregateInputType | true
    _min?: PatientHistoryMinAggregateInputType
    _max?: PatientHistoryMaxAggregateInputType
  }

  export type PatientHistoryGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    fieldName: string
    oldValue: string | null
    newValue: string | null
    changeType: string
    changeReason: string | null
    supportingDocUrl: string | null
    changedBy: string
    approvedBy: string | null
    changedAtFacility: string | null
    changedAt: Date
    patientConsent: boolean
    consentDocUrl: string | null
    ipAddress: string | null
    userAgent: string | null
    _count: PatientHistoryCountAggregateOutputType | null
    _min: PatientHistoryMinAggregateOutputType | null
    _max: PatientHistoryMaxAggregateOutputType | null
  }

  type GetPatientHistoryGroupByPayload<T extends PatientHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PatientHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PatientHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    fieldName?: boolean
    oldValue?: boolean
    newValue?: boolean
    changeType?: boolean
    changeReason?: boolean
    supportingDocUrl?: boolean
    changedBy?: boolean
    approvedBy?: boolean
    changedAtFacility?: boolean
    changedAt?: boolean
    patientConsent?: boolean
    consentDocUrl?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientHistory"]>

  export type PatientHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    fieldName?: boolean
    oldValue?: boolean
    newValue?: boolean
    changeType?: boolean
    changeReason?: boolean
    supportingDocUrl?: boolean
    changedBy?: boolean
    approvedBy?: boolean
    changedAtFacility?: boolean
    changedAt?: boolean
    patientConsent?: boolean
    consentDocUrl?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientHistory"]>

  export type PatientHistorySelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    fieldName?: boolean
    oldValue?: boolean
    newValue?: boolean
    changeType?: boolean
    changeReason?: boolean
    supportingDocUrl?: boolean
    changedBy?: boolean
    approvedBy?: boolean
    changedAtFacility?: boolean
    changedAt?: boolean
    patientConsent?: boolean
    consentDocUrl?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }

  export type PatientHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type PatientHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $PatientHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientHistory"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      fieldName: string
      oldValue: string | null
      newValue: string | null
      changeType: string
      changeReason: string | null
      supportingDocUrl: string | null
      changedBy: string
      approvedBy: string | null
      changedAtFacility: string | null
      changedAt: Date
      patientConsent: boolean
      consentDocUrl: string | null
      ipAddress: string | null
      userAgent: string | null
    }, ExtArgs["result"]["patientHistory"]>
    composites: {}
  }

  type PatientHistoryGetPayload<S extends boolean | null | undefined | PatientHistoryDefaultArgs> = $Result.GetResult<Prisma.$PatientHistoryPayload, S>

  type PatientHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientHistoryCountAggregateInputType | true
    }

  export interface PatientHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientHistory'], meta: { name: 'PatientHistory' } }
    /**
     * Find zero or one PatientHistory that matches the filter.
     * @param {PatientHistoryFindUniqueArgs} args - Arguments to find a PatientHistory
     * @example
     * // Get one PatientHistory
     * const patientHistory = await prisma.patientHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientHistoryFindUniqueArgs>(args: SelectSubset<T, PatientHistoryFindUniqueArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientHistoryFindUniqueOrThrowArgs} args - Arguments to find a PatientHistory
     * @example
     * // Get one PatientHistory
     * const patientHistory = await prisma.patientHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryFindFirstArgs} args - Arguments to find a PatientHistory
     * @example
     * // Get one PatientHistory
     * const patientHistory = await prisma.patientHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientHistoryFindFirstArgs>(args?: SelectSubset<T, PatientHistoryFindFirstArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryFindFirstOrThrowArgs} args - Arguments to find a PatientHistory
     * @example
     * // Get one PatientHistory
     * const patientHistory = await prisma.patientHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientHistories
     * const patientHistories = await prisma.patientHistory.findMany()
     * 
     * // Get first 10 PatientHistories
     * const patientHistories = await prisma.patientHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientHistoryWithIdOnly = await prisma.patientHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientHistoryFindManyArgs>(args?: SelectSubset<T, PatientHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientHistory.
     * @param {PatientHistoryCreateArgs} args - Arguments to create a PatientHistory.
     * @example
     * // Create one PatientHistory
     * const PatientHistory = await prisma.patientHistory.create({
     *   data: {
     *     // ... data to create a PatientHistory
     *   }
     * })
     * 
     */
    create<T extends PatientHistoryCreateArgs>(args: SelectSubset<T, PatientHistoryCreateArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientHistories.
     * @param {PatientHistoryCreateManyArgs} args - Arguments to create many PatientHistories.
     * @example
     * // Create many PatientHistories
     * const patientHistory = await prisma.patientHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientHistoryCreateManyArgs>(args?: SelectSubset<T, PatientHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientHistories and returns the data saved in the database.
     * @param {PatientHistoryCreateManyAndReturnArgs} args - Arguments to create many PatientHistories.
     * @example
     * // Create many PatientHistories
     * const patientHistory = await prisma.patientHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientHistories and only return the `id`
     * const patientHistoryWithIdOnly = await prisma.patientHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientHistory.
     * @param {PatientHistoryDeleteArgs} args - Arguments to delete one PatientHistory.
     * @example
     * // Delete one PatientHistory
     * const PatientHistory = await prisma.patientHistory.delete({
     *   where: {
     *     // ... filter to delete one PatientHistory
     *   }
     * })
     * 
     */
    delete<T extends PatientHistoryDeleteArgs>(args: SelectSubset<T, PatientHistoryDeleteArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientHistory.
     * @param {PatientHistoryUpdateArgs} args - Arguments to update one PatientHistory.
     * @example
     * // Update one PatientHistory
     * const patientHistory = await prisma.patientHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientHistoryUpdateArgs>(args: SelectSubset<T, PatientHistoryUpdateArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientHistories.
     * @param {PatientHistoryDeleteManyArgs} args - Arguments to filter PatientHistories to delete.
     * @example
     * // Delete a few PatientHistories
     * const { count } = await prisma.patientHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientHistoryDeleteManyArgs>(args?: SelectSubset<T, PatientHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientHistories
     * const patientHistory = await prisma.patientHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientHistoryUpdateManyArgs>(args: SelectSubset<T, PatientHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientHistory.
     * @param {PatientHistoryUpsertArgs} args - Arguments to update or create a PatientHistory.
     * @example
     * // Update or create a PatientHistory
     * const patientHistory = await prisma.patientHistory.upsert({
     *   create: {
     *     // ... data to create a PatientHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientHistory we want to update
     *   }
     * })
     */
    upsert<T extends PatientHistoryUpsertArgs>(args: SelectSubset<T, PatientHistoryUpsertArgs<ExtArgs>>): Prisma__PatientHistoryClient<$Result.GetResult<Prisma.$PatientHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryCountArgs} args - Arguments to filter PatientHistories to count.
     * @example
     * // Count the number of PatientHistories
     * const count = await prisma.patientHistory.count({
     *   where: {
     *     // ... the filter for the PatientHistories we want to count
     *   }
     * })
    **/
    count<T extends PatientHistoryCountArgs>(
      args?: Subset<T, PatientHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientHistoryAggregateArgs>(args: Subset<T, PatientHistoryAggregateArgs>): Prisma.PrismaPromise<GetPatientHistoryAggregateType<T>>

    /**
     * Group by PatientHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientHistoryGroupByArgs} args - Group by arguments.
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
      T extends PatientHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PatientHistoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientHistory model
   */
  readonly fields: PatientHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PatientHistory model
   */ 
  interface PatientHistoryFieldRefs {
    readonly id: FieldRef<"PatientHistory", 'String'>
    readonly tenantId: FieldRef<"PatientHistory", 'String'>
    readonly patientId: FieldRef<"PatientHistory", 'String'>
    readonly fieldName: FieldRef<"PatientHistory", 'String'>
    readonly oldValue: FieldRef<"PatientHistory", 'String'>
    readonly newValue: FieldRef<"PatientHistory", 'String'>
    readonly changeType: FieldRef<"PatientHistory", 'String'>
    readonly changeReason: FieldRef<"PatientHistory", 'String'>
    readonly supportingDocUrl: FieldRef<"PatientHistory", 'String'>
    readonly changedBy: FieldRef<"PatientHistory", 'String'>
    readonly approvedBy: FieldRef<"PatientHistory", 'String'>
    readonly changedAtFacility: FieldRef<"PatientHistory", 'String'>
    readonly changedAt: FieldRef<"PatientHistory", 'DateTime'>
    readonly patientConsent: FieldRef<"PatientHistory", 'Boolean'>
    readonly consentDocUrl: FieldRef<"PatientHistory", 'String'>
    readonly ipAddress: FieldRef<"PatientHistory", 'String'>
    readonly userAgent: FieldRef<"PatientHistory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PatientHistory findUnique
   */
  export type PatientHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PatientHistory to fetch.
     */
    where: PatientHistoryWhereUniqueInput
  }

  /**
   * PatientHistory findUniqueOrThrow
   */
  export type PatientHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PatientHistory to fetch.
     */
    where: PatientHistoryWhereUniqueInput
  }

  /**
   * PatientHistory findFirst
   */
  export type PatientHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PatientHistory to fetch.
     */
    where?: PatientHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientHistories to fetch.
     */
    orderBy?: PatientHistoryOrderByWithRelationInput | PatientHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientHistories.
     */
    cursor?: PatientHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientHistories.
     */
    distinct?: PatientHistoryScalarFieldEnum | PatientHistoryScalarFieldEnum[]
  }

  /**
   * PatientHistory findFirstOrThrow
   */
  export type PatientHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PatientHistory to fetch.
     */
    where?: PatientHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientHistories to fetch.
     */
    orderBy?: PatientHistoryOrderByWithRelationInput | PatientHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientHistories.
     */
    cursor?: PatientHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientHistories.
     */
    distinct?: PatientHistoryScalarFieldEnum | PatientHistoryScalarFieldEnum[]
  }

  /**
   * PatientHistory findMany
   */
  export type PatientHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PatientHistories to fetch.
     */
    where?: PatientHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientHistories to fetch.
     */
    orderBy?: PatientHistoryOrderByWithRelationInput | PatientHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientHistories.
     */
    cursor?: PatientHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientHistories.
     */
    skip?: number
    distinct?: PatientHistoryScalarFieldEnum | PatientHistoryScalarFieldEnum[]
  }

  /**
   * PatientHistory create
   */
  export type PatientHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientHistory.
     */
    data: XOR<PatientHistoryCreateInput, PatientHistoryUncheckedCreateInput>
  }

  /**
   * PatientHistory createMany
   */
  export type PatientHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientHistories.
     */
    data: PatientHistoryCreateManyInput | PatientHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientHistory createManyAndReturn
   */
  export type PatientHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientHistories.
     */
    data: PatientHistoryCreateManyInput | PatientHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientHistory update
   */
  export type PatientHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientHistory.
     */
    data: XOR<PatientHistoryUpdateInput, PatientHistoryUncheckedUpdateInput>
    /**
     * Choose, which PatientHistory to update.
     */
    where: PatientHistoryWhereUniqueInput
  }

  /**
   * PatientHistory updateMany
   */
  export type PatientHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientHistories.
     */
    data: XOR<PatientHistoryUpdateManyMutationInput, PatientHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PatientHistories to update
     */
    where?: PatientHistoryWhereInput
  }

  /**
   * PatientHistory upsert
   */
  export type PatientHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientHistory to update in case it exists.
     */
    where: PatientHistoryWhereUniqueInput
    /**
     * In case the PatientHistory found by the `where` argument doesn't exist, create a new PatientHistory with this data.
     */
    create: XOR<PatientHistoryCreateInput, PatientHistoryUncheckedCreateInput>
    /**
     * In case the PatientHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientHistoryUpdateInput, PatientHistoryUncheckedUpdateInput>
  }

  /**
   * PatientHistory delete
   */
  export type PatientHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
    /**
     * Filter which PatientHistory to delete.
     */
    where: PatientHistoryWhereUniqueInput
  }

  /**
   * PatientHistory deleteMany
   */
  export type PatientHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientHistories to delete
     */
    where?: PatientHistoryWhereInput
  }

  /**
   * PatientHistory without action
   */
  export type PatientHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientHistory
     */
    select?: PatientHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientHistoryInclude<ExtArgs> | null
  }


  /**
   * Model PatientConsent
   */

  export type AggregatePatientConsent = {
    _count: PatientConsentCountAggregateOutputType | null
    _avg: PatientConsentAvgAggregateOutputType | null
    _sum: PatientConsentSumAggregateOutputType | null
    _min: PatientConsentMinAggregateOutputType | null
    _max: PatientConsentMaxAggregateOutputType | null
  }

  export type PatientConsentAvgAggregateOutputType = {
    version: number | null
  }

  export type PatientConsentSumAggregateOutputType = {
    version: number | null
  }

  export type PatientConsentMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    consentType: string | null
    consentCategory: string | null
    consentStatus: string | null
    consentScope: string | null
    purpose: string | null
    description: string | null
    legalBasis: string | null
    effectiveFrom: Date | null
    effectiveUntil: Date | null
    isActive: boolean | null
    captureMethod: string | null
    capturedBy: string | null
    capturedAt: Date | null
    capturedAtFacility: string | null
    signatureUrl: string | null
    documentUrl: string | null
    witnessedBy: string | null
    witnessSignatureUrl: string | null
    revokedAt: Date | null
    revokedBy: string | null
    revocationReason: string | null
    revocationMethod: string | null
    version: number | null
    parentConsentId: string | null
    linkedEntityType: string | null
    linkedEntityId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientConsentMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    patientId: string | null
    consentType: string | null
    consentCategory: string | null
    consentStatus: string | null
    consentScope: string | null
    purpose: string | null
    description: string | null
    legalBasis: string | null
    effectiveFrom: Date | null
    effectiveUntil: Date | null
    isActive: boolean | null
    captureMethod: string | null
    capturedBy: string | null
    capturedAt: Date | null
    capturedAtFacility: string | null
    signatureUrl: string | null
    documentUrl: string | null
    witnessedBy: string | null
    witnessSignatureUrl: string | null
    revokedAt: Date | null
    revokedBy: string | null
    revocationReason: string | null
    revocationMethod: string | null
    version: number | null
    parentConsentId: string | null
    linkedEntityType: string | null
    linkedEntityId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PatientConsentCountAggregateOutputType = {
    id: number
    tenantId: number
    patientId: number
    consentType: number
    consentCategory: number
    consentStatus: number
    consentScope: number
    purpose: number
    description: number
    legalBasis: number
    effectiveFrom: number
    effectiveUntil: number
    isActive: number
    captureMethod: number
    capturedBy: number
    capturedAt: number
    capturedAtFacility: number
    signatureUrl: number
    documentUrl: number
    witnessedBy: number
    witnessSignatureUrl: number
    revokedAt: number
    revokedBy: number
    revocationReason: number
    revocationMethod: number
    metadata: number
    version: number
    parentConsentId: number
    linkedEntityType: number
    linkedEntityId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PatientConsentAvgAggregateInputType = {
    version?: true
  }

  export type PatientConsentSumAggregateInputType = {
    version?: true
  }

  export type PatientConsentMinAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    consentType?: true
    consentCategory?: true
    consentStatus?: true
    consentScope?: true
    purpose?: true
    description?: true
    legalBasis?: true
    effectiveFrom?: true
    effectiveUntil?: true
    isActive?: true
    captureMethod?: true
    capturedBy?: true
    capturedAt?: true
    capturedAtFacility?: true
    signatureUrl?: true
    documentUrl?: true
    witnessedBy?: true
    witnessSignatureUrl?: true
    revokedAt?: true
    revokedBy?: true
    revocationReason?: true
    revocationMethod?: true
    version?: true
    parentConsentId?: true
    linkedEntityType?: true
    linkedEntityId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientConsentMaxAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    consentType?: true
    consentCategory?: true
    consentStatus?: true
    consentScope?: true
    purpose?: true
    description?: true
    legalBasis?: true
    effectiveFrom?: true
    effectiveUntil?: true
    isActive?: true
    captureMethod?: true
    capturedBy?: true
    capturedAt?: true
    capturedAtFacility?: true
    signatureUrl?: true
    documentUrl?: true
    witnessedBy?: true
    witnessSignatureUrl?: true
    revokedAt?: true
    revokedBy?: true
    revocationReason?: true
    revocationMethod?: true
    version?: true
    parentConsentId?: true
    linkedEntityType?: true
    linkedEntityId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PatientConsentCountAggregateInputType = {
    id?: true
    tenantId?: true
    patientId?: true
    consentType?: true
    consentCategory?: true
    consentStatus?: true
    consentScope?: true
    purpose?: true
    description?: true
    legalBasis?: true
    effectiveFrom?: true
    effectiveUntil?: true
    isActive?: true
    captureMethod?: true
    capturedBy?: true
    capturedAt?: true
    capturedAtFacility?: true
    signatureUrl?: true
    documentUrl?: true
    witnessedBy?: true
    witnessSignatureUrl?: true
    revokedAt?: true
    revokedBy?: true
    revocationReason?: true
    revocationMethod?: true
    metadata?: true
    version?: true
    parentConsentId?: true
    linkedEntityType?: true
    linkedEntityId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientConsentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientConsent to aggregate.
     */
    where?: PatientConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientConsents to fetch.
     */
    orderBy?: PatientConsentOrderByWithRelationInput | PatientConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientConsents
    **/
    _count?: true | PatientConsentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientConsentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientConsentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientConsentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientConsentMaxAggregateInputType
  }

  export type GetPatientConsentAggregateType<T extends PatientConsentAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientConsent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientConsent[P]>
      : GetScalarType<T[P], AggregatePatientConsent[P]>
  }




  export type PatientConsentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientConsentWhereInput
    orderBy?: PatientConsentOrderByWithAggregationInput | PatientConsentOrderByWithAggregationInput[]
    by: PatientConsentScalarFieldEnum[] | PatientConsentScalarFieldEnum
    having?: PatientConsentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientConsentCountAggregateInputType | true
    _avg?: PatientConsentAvgAggregateInputType
    _sum?: PatientConsentSumAggregateInputType
    _min?: PatientConsentMinAggregateInputType
    _max?: PatientConsentMaxAggregateInputType
  }

  export type PatientConsentGroupByOutputType = {
    id: string
    tenantId: string
    patientId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope: string | null
    purpose: string
    description: string | null
    legalBasis: string | null
    effectiveFrom: Date
    effectiveUntil: Date | null
    isActive: boolean
    captureMethod: string
    capturedBy: string | null
    capturedAt: Date
    capturedAtFacility: string | null
    signatureUrl: string | null
    documentUrl: string | null
    witnessedBy: string | null
    witnessSignatureUrl: string | null
    revokedAt: Date | null
    revokedBy: string | null
    revocationReason: string | null
    revocationMethod: string | null
    metadata: JsonValue | null
    version: number
    parentConsentId: string | null
    linkedEntityType: string | null
    linkedEntityId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PatientConsentCountAggregateOutputType | null
    _avg: PatientConsentAvgAggregateOutputType | null
    _sum: PatientConsentSumAggregateOutputType | null
    _min: PatientConsentMinAggregateOutputType | null
    _max: PatientConsentMaxAggregateOutputType | null
  }

  type GetPatientConsentGroupByPayload<T extends PatientConsentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientConsentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientConsentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientConsentGroupByOutputType[P]>
            : GetScalarType<T[P], PatientConsentGroupByOutputType[P]>
        }
      >
    >


  export type PatientConsentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    consentType?: boolean
    consentCategory?: boolean
    consentStatus?: boolean
    consentScope?: boolean
    purpose?: boolean
    description?: boolean
    legalBasis?: boolean
    effectiveFrom?: boolean
    effectiveUntil?: boolean
    isActive?: boolean
    captureMethod?: boolean
    capturedBy?: boolean
    capturedAt?: boolean
    capturedAtFacility?: boolean
    signatureUrl?: boolean
    documentUrl?: boolean
    witnessedBy?: boolean
    witnessSignatureUrl?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    revocationReason?: boolean
    revocationMethod?: boolean
    metadata?: boolean
    version?: boolean
    parentConsentId?: boolean
    linkedEntityType?: boolean
    linkedEntityId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientConsent"]>

  export type PatientConsentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    consentType?: boolean
    consentCategory?: boolean
    consentStatus?: boolean
    consentScope?: boolean
    purpose?: boolean
    description?: boolean
    legalBasis?: boolean
    effectiveFrom?: boolean
    effectiveUntil?: boolean
    isActive?: boolean
    captureMethod?: boolean
    capturedBy?: boolean
    capturedAt?: boolean
    capturedAtFacility?: boolean
    signatureUrl?: boolean
    documentUrl?: boolean
    witnessedBy?: boolean
    witnessSignatureUrl?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    revocationReason?: boolean
    revocationMethod?: boolean
    metadata?: boolean
    version?: boolean
    parentConsentId?: boolean
    linkedEntityType?: boolean
    linkedEntityId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientConsent"]>

  export type PatientConsentSelectScalar = {
    id?: boolean
    tenantId?: boolean
    patientId?: boolean
    consentType?: boolean
    consentCategory?: boolean
    consentStatus?: boolean
    consentScope?: boolean
    purpose?: boolean
    description?: boolean
    legalBasis?: boolean
    effectiveFrom?: boolean
    effectiveUntil?: boolean
    isActive?: boolean
    captureMethod?: boolean
    capturedBy?: boolean
    capturedAt?: boolean
    capturedAtFacility?: boolean
    signatureUrl?: boolean
    documentUrl?: boolean
    witnessedBy?: boolean
    witnessSignatureUrl?: boolean
    revokedAt?: boolean
    revokedBy?: boolean
    revocationReason?: boolean
    revocationMethod?: boolean
    metadata?: boolean
    version?: boolean
    parentConsentId?: boolean
    linkedEntityType?: boolean
    linkedEntityId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PatientConsentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }
  export type PatientConsentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | PatientDefaultArgs<ExtArgs>
  }

  export type $PatientConsentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientConsent"
    objects: {
      patient: Prisma.$PatientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      patientId: string
      consentType: string
      consentCategory: string
      consentStatus: string
      consentScope: string | null
      purpose: string
      description: string | null
      legalBasis: string | null
      effectiveFrom: Date
      effectiveUntil: Date | null
      isActive: boolean
      captureMethod: string
      capturedBy: string | null
      capturedAt: Date
      capturedAtFacility: string | null
      signatureUrl: string | null
      documentUrl: string | null
      witnessedBy: string | null
      witnessSignatureUrl: string | null
      revokedAt: Date | null
      revokedBy: string | null
      revocationReason: string | null
      revocationMethod: string | null
      metadata: Prisma.JsonValue | null
      version: number
      parentConsentId: string | null
      linkedEntityType: string | null
      linkedEntityId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["patientConsent"]>
    composites: {}
  }

  type PatientConsentGetPayload<S extends boolean | null | undefined | PatientConsentDefaultArgs> = $Result.GetResult<Prisma.$PatientConsentPayload, S>

  type PatientConsentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PatientConsentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PatientConsentCountAggregateInputType | true
    }

  export interface PatientConsentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientConsent'], meta: { name: 'PatientConsent' } }
    /**
     * Find zero or one PatientConsent that matches the filter.
     * @param {PatientConsentFindUniqueArgs} args - Arguments to find a PatientConsent
     * @example
     * // Get one PatientConsent
     * const patientConsent = await prisma.patientConsent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientConsentFindUniqueArgs>(args: SelectSubset<T, PatientConsentFindUniqueArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PatientConsent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PatientConsentFindUniqueOrThrowArgs} args - Arguments to find a PatientConsent
     * @example
     * // Get one PatientConsent
     * const patientConsent = await prisma.patientConsent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientConsentFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientConsentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PatientConsent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentFindFirstArgs} args - Arguments to find a PatientConsent
     * @example
     * // Get one PatientConsent
     * const patientConsent = await prisma.patientConsent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientConsentFindFirstArgs>(args?: SelectSubset<T, PatientConsentFindFirstArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PatientConsent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentFindFirstOrThrowArgs} args - Arguments to find a PatientConsent
     * @example
     * // Get one PatientConsent
     * const patientConsent = await prisma.patientConsent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientConsentFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientConsentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PatientConsents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientConsents
     * const patientConsents = await prisma.patientConsent.findMany()
     * 
     * // Get first 10 PatientConsents
     * const patientConsents = await prisma.patientConsent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientConsentWithIdOnly = await prisma.patientConsent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientConsentFindManyArgs>(args?: SelectSubset<T, PatientConsentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PatientConsent.
     * @param {PatientConsentCreateArgs} args - Arguments to create a PatientConsent.
     * @example
     * // Create one PatientConsent
     * const PatientConsent = await prisma.patientConsent.create({
     *   data: {
     *     // ... data to create a PatientConsent
     *   }
     * })
     * 
     */
    create<T extends PatientConsentCreateArgs>(args: SelectSubset<T, PatientConsentCreateArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PatientConsents.
     * @param {PatientConsentCreateManyArgs} args - Arguments to create many PatientConsents.
     * @example
     * // Create many PatientConsents
     * const patientConsent = await prisma.patientConsent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientConsentCreateManyArgs>(args?: SelectSubset<T, PatientConsentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientConsents and returns the data saved in the database.
     * @param {PatientConsentCreateManyAndReturnArgs} args - Arguments to create many PatientConsents.
     * @example
     * // Create many PatientConsents
     * const patientConsent = await prisma.patientConsent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientConsents and only return the `id`
     * const patientConsentWithIdOnly = await prisma.patientConsent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientConsentCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientConsentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PatientConsent.
     * @param {PatientConsentDeleteArgs} args - Arguments to delete one PatientConsent.
     * @example
     * // Delete one PatientConsent
     * const PatientConsent = await prisma.patientConsent.delete({
     *   where: {
     *     // ... filter to delete one PatientConsent
     *   }
     * })
     * 
     */
    delete<T extends PatientConsentDeleteArgs>(args: SelectSubset<T, PatientConsentDeleteArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PatientConsent.
     * @param {PatientConsentUpdateArgs} args - Arguments to update one PatientConsent.
     * @example
     * // Update one PatientConsent
     * const patientConsent = await prisma.patientConsent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientConsentUpdateArgs>(args: SelectSubset<T, PatientConsentUpdateArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PatientConsents.
     * @param {PatientConsentDeleteManyArgs} args - Arguments to filter PatientConsents to delete.
     * @example
     * // Delete a few PatientConsents
     * const { count } = await prisma.patientConsent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientConsentDeleteManyArgs>(args?: SelectSubset<T, PatientConsentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientConsents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientConsents
     * const patientConsent = await prisma.patientConsent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientConsentUpdateManyArgs>(args: SelectSubset<T, PatientConsentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PatientConsent.
     * @param {PatientConsentUpsertArgs} args - Arguments to update or create a PatientConsent.
     * @example
     * // Update or create a PatientConsent
     * const patientConsent = await prisma.patientConsent.upsert({
     *   create: {
     *     // ... data to create a PatientConsent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientConsent we want to update
     *   }
     * })
     */
    upsert<T extends PatientConsentUpsertArgs>(args: SelectSubset<T, PatientConsentUpsertArgs<ExtArgs>>): Prisma__PatientConsentClient<$Result.GetResult<Prisma.$PatientConsentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PatientConsents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentCountArgs} args - Arguments to filter PatientConsents to count.
     * @example
     * // Count the number of PatientConsents
     * const count = await prisma.patientConsent.count({
     *   where: {
     *     // ... the filter for the PatientConsents we want to count
     *   }
     * })
    **/
    count<T extends PatientConsentCountArgs>(
      args?: Subset<T, PatientConsentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientConsentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientConsent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PatientConsentAggregateArgs>(args: Subset<T, PatientConsentAggregateArgs>): Prisma.PrismaPromise<GetPatientConsentAggregateType<T>>

    /**
     * Group by PatientConsent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientConsentGroupByArgs} args - Group by arguments.
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
      T extends PatientConsentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientConsentGroupByArgs['orderBy'] }
        : { orderBy?: PatientConsentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PatientConsentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientConsentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientConsent model
   */
  readonly fields: PatientConsentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientConsent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientConsentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends PatientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientDefaultArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the PatientConsent model
   */ 
  interface PatientConsentFieldRefs {
    readonly id: FieldRef<"PatientConsent", 'String'>
    readonly tenantId: FieldRef<"PatientConsent", 'String'>
    readonly patientId: FieldRef<"PatientConsent", 'String'>
    readonly consentType: FieldRef<"PatientConsent", 'String'>
    readonly consentCategory: FieldRef<"PatientConsent", 'String'>
    readonly consentStatus: FieldRef<"PatientConsent", 'String'>
    readonly consentScope: FieldRef<"PatientConsent", 'String'>
    readonly purpose: FieldRef<"PatientConsent", 'String'>
    readonly description: FieldRef<"PatientConsent", 'String'>
    readonly legalBasis: FieldRef<"PatientConsent", 'String'>
    readonly effectiveFrom: FieldRef<"PatientConsent", 'DateTime'>
    readonly effectiveUntil: FieldRef<"PatientConsent", 'DateTime'>
    readonly isActive: FieldRef<"PatientConsent", 'Boolean'>
    readonly captureMethod: FieldRef<"PatientConsent", 'String'>
    readonly capturedBy: FieldRef<"PatientConsent", 'String'>
    readonly capturedAt: FieldRef<"PatientConsent", 'DateTime'>
    readonly capturedAtFacility: FieldRef<"PatientConsent", 'String'>
    readonly signatureUrl: FieldRef<"PatientConsent", 'String'>
    readonly documentUrl: FieldRef<"PatientConsent", 'String'>
    readonly witnessedBy: FieldRef<"PatientConsent", 'String'>
    readonly witnessSignatureUrl: FieldRef<"PatientConsent", 'String'>
    readonly revokedAt: FieldRef<"PatientConsent", 'DateTime'>
    readonly revokedBy: FieldRef<"PatientConsent", 'String'>
    readonly revocationReason: FieldRef<"PatientConsent", 'String'>
    readonly revocationMethod: FieldRef<"PatientConsent", 'String'>
    readonly metadata: FieldRef<"PatientConsent", 'Json'>
    readonly version: FieldRef<"PatientConsent", 'Int'>
    readonly parentConsentId: FieldRef<"PatientConsent", 'String'>
    readonly linkedEntityType: FieldRef<"PatientConsent", 'String'>
    readonly linkedEntityId: FieldRef<"PatientConsent", 'String'>
    readonly createdAt: FieldRef<"PatientConsent", 'DateTime'>
    readonly updatedAt: FieldRef<"PatientConsent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientConsent findUnique
   */
  export type PatientConsentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter, which PatientConsent to fetch.
     */
    where: PatientConsentWhereUniqueInput
  }

  /**
   * PatientConsent findUniqueOrThrow
   */
  export type PatientConsentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter, which PatientConsent to fetch.
     */
    where: PatientConsentWhereUniqueInput
  }

  /**
   * PatientConsent findFirst
   */
  export type PatientConsentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter, which PatientConsent to fetch.
     */
    where?: PatientConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientConsents to fetch.
     */
    orderBy?: PatientConsentOrderByWithRelationInput | PatientConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientConsents.
     */
    cursor?: PatientConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientConsents.
     */
    distinct?: PatientConsentScalarFieldEnum | PatientConsentScalarFieldEnum[]
  }

  /**
   * PatientConsent findFirstOrThrow
   */
  export type PatientConsentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter, which PatientConsent to fetch.
     */
    where?: PatientConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientConsents to fetch.
     */
    orderBy?: PatientConsentOrderByWithRelationInput | PatientConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientConsents.
     */
    cursor?: PatientConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientConsents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientConsents.
     */
    distinct?: PatientConsentScalarFieldEnum | PatientConsentScalarFieldEnum[]
  }

  /**
   * PatientConsent findMany
   */
  export type PatientConsentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter, which PatientConsents to fetch.
     */
    where?: PatientConsentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientConsents to fetch.
     */
    orderBy?: PatientConsentOrderByWithRelationInput | PatientConsentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientConsents.
     */
    cursor?: PatientConsentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientConsents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientConsents.
     */
    skip?: number
    distinct?: PatientConsentScalarFieldEnum | PatientConsentScalarFieldEnum[]
  }

  /**
   * PatientConsent create
   */
  export type PatientConsentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientConsent.
     */
    data: XOR<PatientConsentCreateInput, PatientConsentUncheckedCreateInput>
  }

  /**
   * PatientConsent createMany
   */
  export type PatientConsentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientConsents.
     */
    data: PatientConsentCreateManyInput | PatientConsentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientConsent createManyAndReturn
   */
  export type PatientConsentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PatientConsents.
     */
    data: PatientConsentCreateManyInput | PatientConsentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientConsent update
   */
  export type PatientConsentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientConsent.
     */
    data: XOR<PatientConsentUpdateInput, PatientConsentUncheckedUpdateInput>
    /**
     * Choose, which PatientConsent to update.
     */
    where: PatientConsentWhereUniqueInput
  }

  /**
   * PatientConsent updateMany
   */
  export type PatientConsentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientConsents.
     */
    data: XOR<PatientConsentUpdateManyMutationInput, PatientConsentUncheckedUpdateManyInput>
    /**
     * Filter which PatientConsents to update
     */
    where?: PatientConsentWhereInput
  }

  /**
   * PatientConsent upsert
   */
  export type PatientConsentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientConsent to update in case it exists.
     */
    where: PatientConsentWhereUniqueInput
    /**
     * In case the PatientConsent found by the `where` argument doesn't exist, create a new PatientConsent with this data.
     */
    create: XOR<PatientConsentCreateInput, PatientConsentUncheckedCreateInput>
    /**
     * In case the PatientConsent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientConsentUpdateInput, PatientConsentUncheckedUpdateInput>
  }

  /**
   * PatientConsent delete
   */
  export type PatientConsentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
    /**
     * Filter which PatientConsent to delete.
     */
    where: PatientConsentWhereUniqueInput
  }

  /**
   * PatientConsent deleteMany
   */
  export type PatientConsentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientConsents to delete
     */
    where?: PatientConsentWhereInput
  }

  /**
   * PatientConsent without action
   */
  export type PatientConsentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientConsent
     */
    select?: PatientConsentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientConsentInclude<ExtArgs> | null
  }


  /**
   * Model ConsentTemplate
   */

  export type AggregateConsentTemplate = {
    _count: ConsentTemplateCountAggregateOutputType | null
    _avg: ConsentTemplateAvgAggregateOutputType | null
    _sum: ConsentTemplateSumAggregateOutputType | null
    _min: ConsentTemplateMinAggregateOutputType | null
    _max: ConsentTemplateMaxAggregateOutputType | null
  }

  export type ConsentTemplateAvgAggregateOutputType = {
    validityDays: number | null
    version: number | null
  }

  export type ConsentTemplateSumAggregateOutputType = {
    validityDays: number | null
    version: number | null
  }

  export type ConsentTemplateMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    templateCode: string | null
    consentType: string | null
    consentCategory: string | null
    isRequired: boolean | null
    requiresWitness: boolean | null
    validityDays: number | null
    autoRenew: boolean | null
    version: number | null
    status: string | null
    supersedes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentTemplateMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    templateCode: string | null
    consentType: string | null
    consentCategory: string | null
    isRequired: boolean | null
    requiresWitness: boolean | null
    validityDays: number | null
    autoRenew: boolean | null
    version: number | null
    status: string | null
    supersedes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConsentTemplateCountAggregateOutputType = {
    id: number
    tenantId: number
    templateCode: number
    consentType: number
    consentCategory: number
    title: number
    description: number
    content: number
    legalText: number
    isRequired: number
    requiresWitness: number
    validityDays: number
    autoRenew: number
    version: number
    status: number
    supersedes: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConsentTemplateAvgAggregateInputType = {
    validityDays?: true
    version?: true
  }

  export type ConsentTemplateSumAggregateInputType = {
    validityDays?: true
    version?: true
  }

  export type ConsentTemplateMinAggregateInputType = {
    id?: true
    tenantId?: true
    templateCode?: true
    consentType?: true
    consentCategory?: true
    isRequired?: true
    requiresWitness?: true
    validityDays?: true
    autoRenew?: true
    version?: true
    status?: true
    supersedes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentTemplateMaxAggregateInputType = {
    id?: true
    tenantId?: true
    templateCode?: true
    consentType?: true
    consentCategory?: true
    isRequired?: true
    requiresWitness?: true
    validityDays?: true
    autoRenew?: true
    version?: true
    status?: true
    supersedes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConsentTemplateCountAggregateInputType = {
    id?: true
    tenantId?: true
    templateCode?: true
    consentType?: true
    consentCategory?: true
    title?: true
    description?: true
    content?: true
    legalText?: true
    isRequired?: true
    requiresWitness?: true
    validityDays?: true
    autoRenew?: true
    version?: true
    status?: true
    supersedes?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConsentTemplateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentTemplate to aggregate.
     */
    where?: ConsentTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentTemplates to fetch.
     */
    orderBy?: ConsentTemplateOrderByWithRelationInput | ConsentTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsentTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsentTemplates
    **/
    _count?: true | ConsentTemplateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConsentTemplateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConsentTemplateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsentTemplateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsentTemplateMaxAggregateInputType
  }

  export type GetConsentTemplateAggregateType<T extends ConsentTemplateAggregateArgs> = {
        [P in keyof T & keyof AggregateConsentTemplate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsentTemplate[P]>
      : GetScalarType<T[P], AggregateConsentTemplate[P]>
  }




  export type ConsentTemplateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsentTemplateWhereInput
    orderBy?: ConsentTemplateOrderByWithAggregationInput | ConsentTemplateOrderByWithAggregationInput[]
    by: ConsentTemplateScalarFieldEnum[] | ConsentTemplateScalarFieldEnum
    having?: ConsentTemplateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsentTemplateCountAggregateInputType | true
    _avg?: ConsentTemplateAvgAggregateInputType
    _sum?: ConsentTemplateSumAggregateInputType
    _min?: ConsentTemplateMinAggregateInputType
    _max?: ConsentTemplateMaxAggregateInputType
  }

  export type ConsentTemplateGroupByOutputType = {
    id: string
    tenantId: string
    templateCode: string
    consentType: string
    consentCategory: string
    title: JsonValue
    description: JsonValue
    content: JsonValue
    legalText: JsonValue | null
    isRequired: boolean
    requiresWitness: boolean
    validityDays: number | null
    autoRenew: boolean
    version: number
    status: string
    supersedes: string | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ConsentTemplateCountAggregateOutputType | null
    _avg: ConsentTemplateAvgAggregateOutputType | null
    _sum: ConsentTemplateSumAggregateOutputType | null
    _min: ConsentTemplateMinAggregateOutputType | null
    _max: ConsentTemplateMaxAggregateOutputType | null
  }

  type GetConsentTemplateGroupByPayload<T extends ConsentTemplateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsentTemplateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsentTemplateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsentTemplateGroupByOutputType[P]>
            : GetScalarType<T[P], ConsentTemplateGroupByOutputType[P]>
        }
      >
    >


  export type ConsentTemplateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    templateCode?: boolean
    consentType?: boolean
    consentCategory?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    legalText?: boolean
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: boolean
    autoRenew?: boolean
    version?: boolean
    status?: boolean
    supersedes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["consentTemplate"]>

  export type ConsentTemplateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    templateCode?: boolean
    consentType?: boolean
    consentCategory?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    legalText?: boolean
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: boolean
    autoRenew?: boolean
    version?: boolean
    status?: boolean
    supersedes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["consentTemplate"]>

  export type ConsentTemplateSelectScalar = {
    id?: boolean
    tenantId?: boolean
    templateCode?: boolean
    consentType?: boolean
    consentCategory?: boolean
    title?: boolean
    description?: boolean
    content?: boolean
    legalText?: boolean
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: boolean
    autoRenew?: boolean
    version?: boolean
    status?: boolean
    supersedes?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ConsentTemplatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsentTemplate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      templateCode: string
      consentType: string
      consentCategory: string
      title: Prisma.JsonValue
      description: Prisma.JsonValue
      content: Prisma.JsonValue
      legalText: Prisma.JsonValue | null
      isRequired: boolean
      requiresWitness: boolean
      validityDays: number | null
      autoRenew: boolean
      version: number
      status: string
      supersedes: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["consentTemplate"]>
    composites: {}
  }

  type ConsentTemplateGetPayload<S extends boolean | null | undefined | ConsentTemplateDefaultArgs> = $Result.GetResult<Prisma.$ConsentTemplatePayload, S>

  type ConsentTemplateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConsentTemplateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConsentTemplateCountAggregateInputType | true
    }

  export interface ConsentTemplateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsentTemplate'], meta: { name: 'ConsentTemplate' } }
    /**
     * Find zero or one ConsentTemplate that matches the filter.
     * @param {ConsentTemplateFindUniqueArgs} args - Arguments to find a ConsentTemplate
     * @example
     * // Get one ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsentTemplateFindUniqueArgs>(args: SelectSubset<T, ConsentTemplateFindUniqueArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConsentTemplate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConsentTemplateFindUniqueOrThrowArgs} args - Arguments to find a ConsentTemplate
     * @example
     * // Get one ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsentTemplateFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsentTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConsentTemplate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateFindFirstArgs} args - Arguments to find a ConsentTemplate
     * @example
     * // Get one ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsentTemplateFindFirstArgs>(args?: SelectSubset<T, ConsentTemplateFindFirstArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConsentTemplate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateFindFirstOrThrowArgs} args - Arguments to find a ConsentTemplate
     * @example
     * // Get one ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsentTemplateFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsentTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConsentTemplates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsentTemplates
     * const consentTemplates = await prisma.consentTemplate.findMany()
     * 
     * // Get first 10 ConsentTemplates
     * const consentTemplates = await prisma.consentTemplate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consentTemplateWithIdOnly = await prisma.consentTemplate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsentTemplateFindManyArgs>(args?: SelectSubset<T, ConsentTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConsentTemplate.
     * @param {ConsentTemplateCreateArgs} args - Arguments to create a ConsentTemplate.
     * @example
     * // Create one ConsentTemplate
     * const ConsentTemplate = await prisma.consentTemplate.create({
     *   data: {
     *     // ... data to create a ConsentTemplate
     *   }
     * })
     * 
     */
    create<T extends ConsentTemplateCreateArgs>(args: SelectSubset<T, ConsentTemplateCreateArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConsentTemplates.
     * @param {ConsentTemplateCreateManyArgs} args - Arguments to create many ConsentTemplates.
     * @example
     * // Create many ConsentTemplates
     * const consentTemplate = await prisma.consentTemplate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsentTemplateCreateManyArgs>(args?: SelectSubset<T, ConsentTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsentTemplates and returns the data saved in the database.
     * @param {ConsentTemplateCreateManyAndReturnArgs} args - Arguments to create many ConsentTemplates.
     * @example
     * // Create many ConsentTemplates
     * const consentTemplate = await prisma.consentTemplate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsentTemplates and only return the `id`
     * const consentTemplateWithIdOnly = await prisma.consentTemplate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsentTemplateCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsentTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConsentTemplate.
     * @param {ConsentTemplateDeleteArgs} args - Arguments to delete one ConsentTemplate.
     * @example
     * // Delete one ConsentTemplate
     * const ConsentTemplate = await prisma.consentTemplate.delete({
     *   where: {
     *     // ... filter to delete one ConsentTemplate
     *   }
     * })
     * 
     */
    delete<T extends ConsentTemplateDeleteArgs>(args: SelectSubset<T, ConsentTemplateDeleteArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConsentTemplate.
     * @param {ConsentTemplateUpdateArgs} args - Arguments to update one ConsentTemplate.
     * @example
     * // Update one ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsentTemplateUpdateArgs>(args: SelectSubset<T, ConsentTemplateUpdateArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConsentTemplates.
     * @param {ConsentTemplateDeleteManyArgs} args - Arguments to filter ConsentTemplates to delete.
     * @example
     * // Delete a few ConsentTemplates
     * const { count } = await prisma.consentTemplate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsentTemplateDeleteManyArgs>(args?: SelectSubset<T, ConsentTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsentTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsentTemplates
     * const consentTemplate = await prisma.consentTemplate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsentTemplateUpdateManyArgs>(args: SelectSubset<T, ConsentTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConsentTemplate.
     * @param {ConsentTemplateUpsertArgs} args - Arguments to update or create a ConsentTemplate.
     * @example
     * // Update or create a ConsentTemplate
     * const consentTemplate = await prisma.consentTemplate.upsert({
     *   create: {
     *     // ... data to create a ConsentTemplate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsentTemplate we want to update
     *   }
     * })
     */
    upsert<T extends ConsentTemplateUpsertArgs>(args: SelectSubset<T, ConsentTemplateUpsertArgs<ExtArgs>>): Prisma__ConsentTemplateClient<$Result.GetResult<Prisma.$ConsentTemplatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConsentTemplates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateCountArgs} args - Arguments to filter ConsentTemplates to count.
     * @example
     * // Count the number of ConsentTemplates
     * const count = await prisma.consentTemplate.count({
     *   where: {
     *     // ... the filter for the ConsentTemplates we want to count
     *   }
     * })
    **/
    count<T extends ConsentTemplateCountArgs>(
      args?: Subset<T, ConsentTemplateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsentTemplateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsentTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConsentTemplateAggregateArgs>(args: Subset<T, ConsentTemplateAggregateArgs>): Prisma.PrismaPromise<GetConsentTemplateAggregateType<T>>

    /**
     * Group by ConsentTemplate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsentTemplateGroupByArgs} args - Group by arguments.
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
      T extends ConsentTemplateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsentTemplateGroupByArgs['orderBy'] }
        : { orderBy?: ConsentTemplateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConsentTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsentTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsentTemplate model
   */
  readonly fields: ConsentTemplateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsentTemplate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsentTemplateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ConsentTemplate model
   */ 
  interface ConsentTemplateFieldRefs {
    readonly id: FieldRef<"ConsentTemplate", 'String'>
    readonly tenantId: FieldRef<"ConsentTemplate", 'String'>
    readonly templateCode: FieldRef<"ConsentTemplate", 'String'>
    readonly consentType: FieldRef<"ConsentTemplate", 'String'>
    readonly consentCategory: FieldRef<"ConsentTemplate", 'String'>
    readonly title: FieldRef<"ConsentTemplate", 'Json'>
    readonly description: FieldRef<"ConsentTemplate", 'Json'>
    readonly content: FieldRef<"ConsentTemplate", 'Json'>
    readonly legalText: FieldRef<"ConsentTemplate", 'Json'>
    readonly isRequired: FieldRef<"ConsentTemplate", 'Boolean'>
    readonly requiresWitness: FieldRef<"ConsentTemplate", 'Boolean'>
    readonly validityDays: FieldRef<"ConsentTemplate", 'Int'>
    readonly autoRenew: FieldRef<"ConsentTemplate", 'Boolean'>
    readonly version: FieldRef<"ConsentTemplate", 'Int'>
    readonly status: FieldRef<"ConsentTemplate", 'String'>
    readonly supersedes: FieldRef<"ConsentTemplate", 'String'>
    readonly metadata: FieldRef<"ConsentTemplate", 'Json'>
    readonly createdAt: FieldRef<"ConsentTemplate", 'DateTime'>
    readonly updatedAt: FieldRef<"ConsentTemplate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConsentTemplate findUnique
   */
  export type ConsentTemplateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter, which ConsentTemplate to fetch.
     */
    where: ConsentTemplateWhereUniqueInput
  }

  /**
   * ConsentTemplate findUniqueOrThrow
   */
  export type ConsentTemplateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter, which ConsentTemplate to fetch.
     */
    where: ConsentTemplateWhereUniqueInput
  }

  /**
   * ConsentTemplate findFirst
   */
  export type ConsentTemplateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter, which ConsentTemplate to fetch.
     */
    where?: ConsentTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentTemplates to fetch.
     */
    orderBy?: ConsentTemplateOrderByWithRelationInput | ConsentTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentTemplates.
     */
    cursor?: ConsentTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentTemplates.
     */
    distinct?: ConsentTemplateScalarFieldEnum | ConsentTemplateScalarFieldEnum[]
  }

  /**
   * ConsentTemplate findFirstOrThrow
   */
  export type ConsentTemplateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter, which ConsentTemplate to fetch.
     */
    where?: ConsentTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentTemplates to fetch.
     */
    orderBy?: ConsentTemplateOrderByWithRelationInput | ConsentTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsentTemplates.
     */
    cursor?: ConsentTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentTemplates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsentTemplates.
     */
    distinct?: ConsentTemplateScalarFieldEnum | ConsentTemplateScalarFieldEnum[]
  }

  /**
   * ConsentTemplate findMany
   */
  export type ConsentTemplateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter, which ConsentTemplates to fetch.
     */
    where?: ConsentTemplateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsentTemplates to fetch.
     */
    orderBy?: ConsentTemplateOrderByWithRelationInput | ConsentTemplateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsentTemplates.
     */
    cursor?: ConsentTemplateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsentTemplates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsentTemplates.
     */
    skip?: number
    distinct?: ConsentTemplateScalarFieldEnum | ConsentTemplateScalarFieldEnum[]
  }

  /**
   * ConsentTemplate create
   */
  export type ConsentTemplateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * The data needed to create a ConsentTemplate.
     */
    data: XOR<ConsentTemplateCreateInput, ConsentTemplateUncheckedCreateInput>
  }

  /**
   * ConsentTemplate createMany
   */
  export type ConsentTemplateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsentTemplates.
     */
    data: ConsentTemplateCreateManyInput | ConsentTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentTemplate createManyAndReturn
   */
  export type ConsentTemplateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConsentTemplates.
     */
    data: ConsentTemplateCreateManyInput | ConsentTemplateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsentTemplate update
   */
  export type ConsentTemplateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * The data needed to update a ConsentTemplate.
     */
    data: XOR<ConsentTemplateUpdateInput, ConsentTemplateUncheckedUpdateInput>
    /**
     * Choose, which ConsentTemplate to update.
     */
    where: ConsentTemplateWhereUniqueInput
  }

  /**
   * ConsentTemplate updateMany
   */
  export type ConsentTemplateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsentTemplates.
     */
    data: XOR<ConsentTemplateUpdateManyMutationInput, ConsentTemplateUncheckedUpdateManyInput>
    /**
     * Filter which ConsentTemplates to update
     */
    where?: ConsentTemplateWhereInput
  }

  /**
   * ConsentTemplate upsert
   */
  export type ConsentTemplateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * The filter to search for the ConsentTemplate to update in case it exists.
     */
    where: ConsentTemplateWhereUniqueInput
    /**
     * In case the ConsentTemplate found by the `where` argument doesn't exist, create a new ConsentTemplate with this data.
     */
    create: XOR<ConsentTemplateCreateInput, ConsentTemplateUncheckedCreateInput>
    /**
     * In case the ConsentTemplate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsentTemplateUpdateInput, ConsentTemplateUncheckedUpdateInput>
  }

  /**
   * ConsentTemplate delete
   */
  export type ConsentTemplateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
    /**
     * Filter which ConsentTemplate to delete.
     */
    where: ConsentTemplateWhereUniqueInput
  }

  /**
   * ConsentTemplate deleteMany
   */
  export type ConsentTemplateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsentTemplates to delete
     */
    where?: ConsentTemplateWhereInput
  }

  /**
   * ConsentTemplate without action
   */
  export type ConsentTemplateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsentTemplate
     */
    select?: ConsentTemplateSelect<ExtArgs> | null
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


  export const PatientScalarFieldEnum: {
    id: 'id',
    mrn: 'mrn',
    tenantId: 'tenantId',
    nationalId: 'nationalId',
    nationalIdType: 'nationalIdType',
    issuingCountry: 'issuingCountry',
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    maritalStatus: 'maritalStatus',
    nationality: 'nationality',
    preferredLanguage: 'preferredLanguage',
    phoneNumber: 'phoneNumber',
    email: 'email',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    bloodGroup: 'bloodGroup',
    emergencyContact: 'emergencyContact',
    insuranceInfo: 'insuranceInfo',
    createdBy: 'createdBy',
    createdAtFacility: 'createdAtFacility',
    registrationSource: 'registrationSource',
    registrationNotes: 'registrationNotes',
    updatedBy: 'updatedBy',
    updatedAtFacility: 'updatedAtFacility',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    facilityId: 'facilityId',
    spaceId: 'spaceId',
    staffId: 'staffId',
    appointmentType: 'appointmentType',
    status: 'status',
    startTime: 'startTime',
    endTime: 'endTime',
    duration: 'duration',
    notes: 'notes',
    visitType: 'visitType',
    linkedEncounterId: 'linkedEncounterId',
    seriesId: 'seriesId',
    cancellationReason: 'cancellationReason',
    rescheduleReason: 'rescheduleReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const EncounterScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    facilityId: 'facilityId',
    appointmentId: 'appointmentId',
    primaryStaffId: 'primaryStaffId',
    encounterClass: 'encounterClass',
    status: 'status',
    priority: 'priority',
    startTime: 'startTime',
    endTime: 'endTime',
    encounterSource: 'encounterSource',
    walkInDetails: 'walkInDetails',
    chiefComplaint: 'chiefComplaint',
    presentingSymptoms: 'presentingSymptoms',
    vitalSigns: 'vitalSigns',
    allergies: 'allergies',
    currentMedications: 'currentMedications',
    medicalHistory: 'medicalHistory',
    socialHistory: 'socialHistory',
    familyHistory: 'familyHistory',
    notes: 'notes',
    dischargeDisposition: 'dischargeDisposition',
    followUpInstructions: 'followUpInstructions',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EncounterScalarFieldEnum = (typeof EncounterScalarFieldEnum)[keyof typeof EncounterScalarFieldEnum]


  export const PatientDocumentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    documentType: 'documentType',
    documentNumber: 'documentNumber',
    issuingCountry: 'issuingCountry',
    issuingAuthority: 'issuingAuthority',
    issueDate: 'issueDate',
    expiryDate: 'expiryDate',
    isPrimaryIdentity: 'isPrimaryIdentity',
    documentUrl: 'documentUrl',
    verificationStatus: 'verificationStatus',
    verifiedBy: 'verifiedBy',
    verifiedAt: 'verifiedAt',
    verificationNotes: 'verificationNotes',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientDocumentScalarFieldEnum = (typeof PatientDocumentScalarFieldEnum)[keyof typeof PatientDocumentScalarFieldEnum]


  export const PatientHistoryScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    fieldName: 'fieldName',
    oldValue: 'oldValue',
    newValue: 'newValue',
    changeType: 'changeType',
    changeReason: 'changeReason',
    supportingDocUrl: 'supportingDocUrl',
    changedBy: 'changedBy',
    approvedBy: 'approvedBy',
    changedAtFacility: 'changedAtFacility',
    changedAt: 'changedAt',
    patientConsent: 'patientConsent',
    consentDocUrl: 'consentDocUrl',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type PatientHistoryScalarFieldEnum = (typeof PatientHistoryScalarFieldEnum)[keyof typeof PatientHistoryScalarFieldEnum]


  export const PatientConsentScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    patientId: 'patientId',
    consentType: 'consentType',
    consentCategory: 'consentCategory',
    consentStatus: 'consentStatus',
    consentScope: 'consentScope',
    purpose: 'purpose',
    description: 'description',
    legalBasis: 'legalBasis',
    effectiveFrom: 'effectiveFrom',
    effectiveUntil: 'effectiveUntil',
    isActive: 'isActive',
    captureMethod: 'captureMethod',
    capturedBy: 'capturedBy',
    capturedAt: 'capturedAt',
    capturedAtFacility: 'capturedAtFacility',
    signatureUrl: 'signatureUrl',
    documentUrl: 'documentUrl',
    witnessedBy: 'witnessedBy',
    witnessSignatureUrl: 'witnessSignatureUrl',
    revokedAt: 'revokedAt',
    revokedBy: 'revokedBy',
    revocationReason: 'revocationReason',
    revocationMethod: 'revocationMethod',
    metadata: 'metadata',
    version: 'version',
    parentConsentId: 'parentConsentId',
    linkedEntityType: 'linkedEntityType',
    linkedEntityId: 'linkedEntityId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PatientConsentScalarFieldEnum = (typeof PatientConsentScalarFieldEnum)[keyof typeof PatientConsentScalarFieldEnum]


  export const ConsentTemplateScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    templateCode: 'templateCode',
    consentType: 'consentType',
    consentCategory: 'consentCategory',
    title: 'title',
    description: 'description',
    content: 'content',
    legalText: 'legalText',
    isRequired: 'isRequired',
    requiresWitness: 'requiresWitness',
    validityDays: 'validityDays',
    autoRenew: 'autoRenew',
    version: 'version',
    status: 'status',
    supersedes: 'supersedes',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConsentTemplateScalarFieldEnum = (typeof ConsentTemplateScalarFieldEnum)[keyof typeof ConsentTemplateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: UuidFilter<"Patient"> | string
    mrn?: StringFilter<"Patient"> | string
    tenantId?: UuidFilter<"Patient"> | string
    nationalId?: StringNullableFilter<"Patient"> | string | null
    nationalIdType?: StringNullableFilter<"Patient"> | string | null
    issuingCountry?: StringNullableFilter<"Patient"> | string | null
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    middleName?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    maritalStatus?: StringNullableFilter<"Patient"> | string | null
    nationality?: StringNullableFilter<"Patient"> | string | null
    preferredLanguage?: StringNullableFilter<"Patient"> | string | null
    phoneNumber?: StringNullableFilter<"Patient"> | string | null
    email?: StringNullableFilter<"Patient"> | string | null
    addressLine1?: StringNullableFilter<"Patient"> | string | null
    addressLine2?: StringNullableFilter<"Patient"> | string | null
    city?: StringNullableFilter<"Patient"> | string | null
    state?: StringNullableFilter<"Patient"> | string | null
    postalCode?: StringNullableFilter<"Patient"> | string | null
    country?: StringNullableFilter<"Patient"> | string | null
    bloodGroup?: StringNullableFilter<"Patient"> | string | null
    emergencyContact?: JsonNullableFilter<"Patient">
    insuranceInfo?: JsonNullableFilter<"Patient">
    createdBy?: UuidFilter<"Patient"> | string
    createdAtFacility?: UuidFilter<"Patient"> | string
    registrationSource?: StringFilter<"Patient"> | string
    registrationNotes?: StringNullableFilter<"Patient"> | string | null
    updatedBy?: UuidNullableFilter<"Patient"> | string | null
    updatedAtFacility?: UuidNullableFilter<"Patient"> | string | null
    status?: StringFilter<"Patient"> | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    appointments?: AppointmentListRelationFilter
    encounters?: EncounterListRelationFilter
    documents?: PatientDocumentListRelationFilter
    history?: PatientHistoryListRelationFilter
    consents?: PatientConsentListRelationFilter
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    mrn?: SortOrder
    tenantId?: SortOrder
    nationalId?: SortOrderInput | SortOrder
    nationalIdType?: SortOrderInput | SortOrder
    issuingCountry?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    maritalStatus?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    bloodGroup?: SortOrderInput | SortOrder
    emergencyContact?: SortOrderInput | SortOrder
    insuranceInfo?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAtFacility?: SortOrder
    registrationSource?: SortOrder
    registrationNotes?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAtFacility?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    encounters?: EncounterOrderByRelationAggregateInput
    documents?: PatientDocumentOrderByRelationAggregateInput
    history?: PatientHistoryOrderByRelationAggregateInput
    consents?: PatientConsentOrderByRelationAggregateInput
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mrn?: string
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    tenantId?: UuidFilter<"Patient"> | string
    nationalId?: StringNullableFilter<"Patient"> | string | null
    nationalIdType?: StringNullableFilter<"Patient"> | string | null
    issuingCountry?: StringNullableFilter<"Patient"> | string | null
    firstName?: StringFilter<"Patient"> | string
    lastName?: StringFilter<"Patient"> | string
    middleName?: StringNullableFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeFilter<"Patient"> | Date | string
    gender?: StringFilter<"Patient"> | string
    maritalStatus?: StringNullableFilter<"Patient"> | string | null
    nationality?: StringNullableFilter<"Patient"> | string | null
    preferredLanguage?: StringNullableFilter<"Patient"> | string | null
    phoneNumber?: StringNullableFilter<"Patient"> | string | null
    email?: StringNullableFilter<"Patient"> | string | null
    addressLine1?: StringNullableFilter<"Patient"> | string | null
    addressLine2?: StringNullableFilter<"Patient"> | string | null
    city?: StringNullableFilter<"Patient"> | string | null
    state?: StringNullableFilter<"Patient"> | string | null
    postalCode?: StringNullableFilter<"Patient"> | string | null
    country?: StringNullableFilter<"Patient"> | string | null
    bloodGroup?: StringNullableFilter<"Patient"> | string | null
    emergencyContact?: JsonNullableFilter<"Patient">
    insuranceInfo?: JsonNullableFilter<"Patient">
    createdBy?: UuidFilter<"Patient"> | string
    createdAtFacility?: UuidFilter<"Patient"> | string
    registrationSource?: StringFilter<"Patient"> | string
    registrationNotes?: StringNullableFilter<"Patient"> | string | null
    updatedBy?: UuidNullableFilter<"Patient"> | string | null
    updatedAtFacility?: UuidNullableFilter<"Patient"> | string | null
    status?: StringFilter<"Patient"> | string
    createdAt?: DateTimeFilter<"Patient"> | Date | string
    updatedAt?: DateTimeFilter<"Patient"> | Date | string
    appointments?: AppointmentListRelationFilter
    encounters?: EncounterListRelationFilter
    documents?: PatientDocumentListRelationFilter
    history?: PatientHistoryListRelationFilter
    consents?: PatientConsentListRelationFilter
  }, "id" | "mrn">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    mrn?: SortOrder
    tenantId?: SortOrder
    nationalId?: SortOrderInput | SortOrder
    nationalIdType?: SortOrderInput | SortOrder
    issuingCountry?: SortOrderInput | SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    maritalStatus?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    preferredLanguage?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    addressLine1?: SortOrderInput | SortOrder
    addressLine2?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    postalCode?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    bloodGroup?: SortOrderInput | SortOrder
    emergencyContact?: SortOrderInput | SortOrder
    insuranceInfo?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAtFacility?: SortOrder
    registrationSource?: SortOrder
    registrationNotes?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    updatedAtFacility?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Patient"> | string
    mrn?: StringWithAggregatesFilter<"Patient"> | string
    tenantId?: UuidWithAggregatesFilter<"Patient"> | string
    nationalId?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    nationalIdType?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    issuingCountry?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    firstName?: StringWithAggregatesFilter<"Patient"> | string
    lastName?: StringWithAggregatesFilter<"Patient"> | string
    middleName?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    dateOfBirth?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    gender?: StringWithAggregatesFilter<"Patient"> | string
    maritalStatus?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    nationality?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    preferredLanguage?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    email?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    addressLine1?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    addressLine2?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    city?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    state?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    postalCode?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    country?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    bloodGroup?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    emergencyContact?: JsonNullableWithAggregatesFilter<"Patient">
    insuranceInfo?: JsonNullableWithAggregatesFilter<"Patient">
    createdBy?: UuidWithAggregatesFilter<"Patient"> | string
    createdAtFacility?: UuidWithAggregatesFilter<"Patient"> | string
    registrationSource?: StringWithAggregatesFilter<"Patient"> | string
    registrationNotes?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    updatedBy?: UuidNullableWithAggregatesFilter<"Patient"> | string | null
    updatedAtFacility?: UuidNullableWithAggregatesFilter<"Patient"> | string | null
    status?: StringWithAggregatesFilter<"Patient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: UuidFilter<"Appointment"> | string
    tenantId?: UuidFilter<"Appointment"> | string
    patientId?: UuidFilter<"Appointment"> | string
    facilityId?: UuidFilter<"Appointment"> | string
    spaceId?: UuidNullableFilter<"Appointment"> | string | null
    staffId?: UuidNullableFilter<"Appointment"> | string | null
    appointmentType?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    duration?: IntFilter<"Appointment"> | number
    notes?: StringNullableFilter<"Appointment"> | string | null
    visitType?: StringNullableFilter<"Appointment"> | string | null
    linkedEncounterId?: UuidNullableFilter<"Appointment"> | string | null
    seriesId?: StringNullableFilter<"Appointment"> | string | null
    cancellationReason?: StringNullableFilter<"Appointment"> | string | null
    rescheduleReason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounters?: EncounterListRelationFilter
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    spaceId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    appointmentType?: SortOrder
    status?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    duration?: SortOrder
    notes?: SortOrderInput | SortOrder
    visitType?: SortOrderInput | SortOrder
    linkedEncounterId?: SortOrderInput | SortOrder
    seriesId?: SortOrderInput | SortOrder
    cancellationReason?: SortOrderInput | SortOrder
    rescheduleReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
    encounters?: EncounterOrderByRelationAggregateInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    tenantId?: UuidFilter<"Appointment"> | string
    patientId?: UuidFilter<"Appointment"> | string
    facilityId?: UuidFilter<"Appointment"> | string
    spaceId?: UuidNullableFilter<"Appointment"> | string | null
    staffId?: UuidNullableFilter<"Appointment"> | string | null
    appointmentType?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    duration?: IntFilter<"Appointment"> | number
    notes?: StringNullableFilter<"Appointment"> | string | null
    visitType?: StringNullableFilter<"Appointment"> | string | null
    linkedEncounterId?: UuidNullableFilter<"Appointment"> | string | null
    seriesId?: StringNullableFilter<"Appointment"> | string | null
    cancellationReason?: StringNullableFilter<"Appointment"> | string | null
    rescheduleReason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
    encounters?: EncounterListRelationFilter
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    spaceId?: SortOrderInput | SortOrder
    staffId?: SortOrderInput | SortOrder
    appointmentType?: SortOrder
    status?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    duration?: SortOrder
    notes?: SortOrderInput | SortOrder
    visitType?: SortOrderInput | SortOrder
    linkedEncounterId?: SortOrderInput | SortOrder
    seriesId?: SortOrderInput | SortOrder
    cancellationReason?: SortOrderInput | SortOrder
    rescheduleReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _avg?: AppointmentAvgOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
    _sum?: AppointmentSumOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Appointment"> | string
    tenantId?: UuidWithAggregatesFilter<"Appointment"> | string
    patientId?: UuidWithAggregatesFilter<"Appointment"> | string
    facilityId?: UuidWithAggregatesFilter<"Appointment"> | string
    spaceId?: UuidNullableWithAggregatesFilter<"Appointment"> | string | null
    staffId?: UuidNullableWithAggregatesFilter<"Appointment"> | string | null
    appointmentType?: StringWithAggregatesFilter<"Appointment"> | string
    status?: StringWithAggregatesFilter<"Appointment"> | string
    startTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    duration?: IntWithAggregatesFilter<"Appointment"> | number
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    visitType?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    linkedEncounterId?: UuidNullableWithAggregatesFilter<"Appointment"> | string | null
    seriesId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    cancellationReason?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    rescheduleReason?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
  }

  export type EncounterWhereInput = {
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    id?: UuidFilter<"Encounter"> | string
    tenantId?: UuidFilter<"Encounter"> | string
    patientId?: UuidFilter<"Encounter"> | string
    facilityId?: UuidFilter<"Encounter"> | string
    appointmentId?: UuidNullableFilter<"Encounter"> | string | null
    primaryStaffId?: UuidFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    priority?: StringFilter<"Encounter"> | string
    startTime?: DateTimeFilter<"Encounter"> | Date | string
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    encounterSource?: StringFilter<"Encounter"> | string
    walkInDetails?: JsonNullableFilter<"Encounter">
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    presentingSymptoms?: StringNullableFilter<"Encounter"> | string | null
    vitalSigns?: JsonNullableFilter<"Encounter">
    allergies?: JsonNullableFilter<"Encounter">
    currentMedications?: JsonNullableFilter<"Encounter">
    medicalHistory?: StringNullableFilter<"Encounter"> | string | null
    socialHistory?: StringNullableFilter<"Encounter"> | string | null
    familyHistory?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    dischargeDisposition?: StringNullableFilter<"Encounter"> | string | null
    followUpInstructions?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    appointment?: XOR<AppointmentNullableRelationFilter, AppointmentWhereInput> | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type EncounterOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    appointmentId?: SortOrderInput | SortOrder
    primaryStaffId?: SortOrder
    encounterClass?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrderInput | SortOrder
    encounterSource?: SortOrder
    walkInDetails?: SortOrderInput | SortOrder
    chiefComplaint?: SortOrderInput | SortOrder
    presentingSymptoms?: SortOrderInput | SortOrder
    vitalSigns?: SortOrderInput | SortOrder
    allergies?: SortOrderInput | SortOrder
    currentMedications?: SortOrderInput | SortOrder
    medicalHistory?: SortOrderInput | SortOrder
    socialHistory?: SortOrderInput | SortOrder
    familyHistory?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    dischargeDisposition?: SortOrderInput | SortOrder
    followUpInstructions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointment?: AppointmentOrderByWithRelationInput
    patient?: PatientOrderByWithRelationInput
  }

  export type EncounterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EncounterWhereInput | EncounterWhereInput[]
    OR?: EncounterWhereInput[]
    NOT?: EncounterWhereInput | EncounterWhereInput[]
    tenantId?: UuidFilter<"Encounter"> | string
    patientId?: UuidFilter<"Encounter"> | string
    facilityId?: UuidFilter<"Encounter"> | string
    appointmentId?: UuidNullableFilter<"Encounter"> | string | null
    primaryStaffId?: UuidFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    priority?: StringFilter<"Encounter"> | string
    startTime?: DateTimeFilter<"Encounter"> | Date | string
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    encounterSource?: StringFilter<"Encounter"> | string
    walkInDetails?: JsonNullableFilter<"Encounter">
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    presentingSymptoms?: StringNullableFilter<"Encounter"> | string | null
    vitalSigns?: JsonNullableFilter<"Encounter">
    allergies?: JsonNullableFilter<"Encounter">
    currentMedications?: JsonNullableFilter<"Encounter">
    medicalHistory?: StringNullableFilter<"Encounter"> | string | null
    socialHistory?: StringNullableFilter<"Encounter"> | string | null
    familyHistory?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    dischargeDisposition?: StringNullableFilter<"Encounter"> | string | null
    followUpInstructions?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
    appointment?: XOR<AppointmentNullableRelationFilter, AppointmentWhereInput> | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type EncounterOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    appointmentId?: SortOrderInput | SortOrder
    primaryStaffId?: SortOrder
    encounterClass?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrderInput | SortOrder
    encounterSource?: SortOrder
    walkInDetails?: SortOrderInput | SortOrder
    chiefComplaint?: SortOrderInput | SortOrder
    presentingSymptoms?: SortOrderInput | SortOrder
    vitalSigns?: SortOrderInput | SortOrder
    allergies?: SortOrderInput | SortOrder
    currentMedications?: SortOrderInput | SortOrder
    medicalHistory?: SortOrderInput | SortOrder
    socialHistory?: SortOrderInput | SortOrder
    familyHistory?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    dischargeDisposition?: SortOrderInput | SortOrder
    followUpInstructions?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EncounterCountOrderByAggregateInput
    _max?: EncounterMaxOrderByAggregateInput
    _min?: EncounterMinOrderByAggregateInput
  }

  export type EncounterScalarWhereWithAggregatesInput = {
    AND?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    OR?: EncounterScalarWhereWithAggregatesInput[]
    NOT?: EncounterScalarWhereWithAggregatesInput | EncounterScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Encounter"> | string
    tenantId?: UuidWithAggregatesFilter<"Encounter"> | string
    patientId?: UuidWithAggregatesFilter<"Encounter"> | string
    facilityId?: UuidWithAggregatesFilter<"Encounter"> | string
    appointmentId?: UuidNullableWithAggregatesFilter<"Encounter"> | string | null
    primaryStaffId?: UuidWithAggregatesFilter<"Encounter"> | string
    encounterClass?: StringWithAggregatesFilter<"Encounter"> | string
    status?: StringWithAggregatesFilter<"Encounter"> | string
    priority?: StringWithAggregatesFilter<"Encounter"> | string
    startTime?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
    endTime?: DateTimeNullableWithAggregatesFilter<"Encounter"> | Date | string | null
    encounterSource?: StringWithAggregatesFilter<"Encounter"> | string
    walkInDetails?: JsonNullableWithAggregatesFilter<"Encounter">
    chiefComplaint?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    presentingSymptoms?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    vitalSigns?: JsonNullableWithAggregatesFilter<"Encounter">
    allergies?: JsonNullableWithAggregatesFilter<"Encounter">
    currentMedications?: JsonNullableWithAggregatesFilter<"Encounter">
    medicalHistory?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    socialHistory?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    familyHistory?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    dischargeDisposition?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    followUpInstructions?: StringNullableWithAggregatesFilter<"Encounter"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Encounter"> | Date | string
  }

  export type PatientDocumentWhereInput = {
    AND?: PatientDocumentWhereInput | PatientDocumentWhereInput[]
    OR?: PatientDocumentWhereInput[]
    NOT?: PatientDocumentWhereInput | PatientDocumentWhereInput[]
    id?: UuidFilter<"PatientDocument"> | string
    tenantId?: UuidFilter<"PatientDocument"> | string
    patientId?: UuidFilter<"PatientDocument"> | string
    documentType?: StringFilter<"PatientDocument"> | string
    documentNumber?: StringFilter<"PatientDocument"> | string
    issuingCountry?: StringFilter<"PatientDocument"> | string
    issuingAuthority?: StringNullableFilter<"PatientDocument"> | string | null
    issueDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    isPrimaryIdentity?: BoolFilter<"PatientDocument"> | boolean
    documentUrl?: StringNullableFilter<"PatientDocument"> | string | null
    verificationStatus?: StringFilter<"PatientDocument"> | string
    verifiedBy?: UuidNullableFilter<"PatientDocument"> | string | null
    verifiedAt?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    verificationNotes?: StringNullableFilter<"PatientDocument"> | string | null
    metadata?: JsonNullableFilter<"PatientDocument">
    createdAt?: DateTimeFilter<"PatientDocument"> | Date | string
    updatedAt?: DateTimeFilter<"PatientDocument"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type PatientDocumentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    issuingCountry?: SortOrder
    issuingAuthority?: SortOrderInput | SortOrder
    issueDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    isPrimaryIdentity?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    verificationStatus?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    verificationNotes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type PatientDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientDocumentWhereInput | PatientDocumentWhereInput[]
    OR?: PatientDocumentWhereInput[]
    NOT?: PatientDocumentWhereInput | PatientDocumentWhereInput[]
    tenantId?: UuidFilter<"PatientDocument"> | string
    patientId?: UuidFilter<"PatientDocument"> | string
    documentType?: StringFilter<"PatientDocument"> | string
    documentNumber?: StringFilter<"PatientDocument"> | string
    issuingCountry?: StringFilter<"PatientDocument"> | string
    issuingAuthority?: StringNullableFilter<"PatientDocument"> | string | null
    issueDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    isPrimaryIdentity?: BoolFilter<"PatientDocument"> | boolean
    documentUrl?: StringNullableFilter<"PatientDocument"> | string | null
    verificationStatus?: StringFilter<"PatientDocument"> | string
    verifiedBy?: UuidNullableFilter<"PatientDocument"> | string | null
    verifiedAt?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    verificationNotes?: StringNullableFilter<"PatientDocument"> | string | null
    metadata?: JsonNullableFilter<"PatientDocument">
    createdAt?: DateTimeFilter<"PatientDocument"> | Date | string
    updatedAt?: DateTimeFilter<"PatientDocument"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type PatientDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    issuingCountry?: SortOrder
    issuingAuthority?: SortOrderInput | SortOrder
    issueDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    isPrimaryIdentity?: SortOrder
    documentUrl?: SortOrderInput | SortOrder
    verificationStatus?: SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    verificationNotes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientDocumentCountOrderByAggregateInput
    _max?: PatientDocumentMaxOrderByAggregateInput
    _min?: PatientDocumentMinOrderByAggregateInput
  }

  export type PatientDocumentScalarWhereWithAggregatesInput = {
    AND?: PatientDocumentScalarWhereWithAggregatesInput | PatientDocumentScalarWhereWithAggregatesInput[]
    OR?: PatientDocumentScalarWhereWithAggregatesInput[]
    NOT?: PatientDocumentScalarWhereWithAggregatesInput | PatientDocumentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientDocument"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientDocument"> | string
    patientId?: UuidWithAggregatesFilter<"PatientDocument"> | string
    documentType?: StringWithAggregatesFilter<"PatientDocument"> | string
    documentNumber?: StringWithAggregatesFilter<"PatientDocument"> | string
    issuingCountry?: StringWithAggregatesFilter<"PatientDocument"> | string
    issuingAuthority?: StringNullableWithAggregatesFilter<"PatientDocument"> | string | null
    issueDate?: DateTimeNullableWithAggregatesFilter<"PatientDocument"> | Date | string | null
    expiryDate?: DateTimeNullableWithAggregatesFilter<"PatientDocument"> | Date | string | null
    isPrimaryIdentity?: BoolWithAggregatesFilter<"PatientDocument"> | boolean
    documentUrl?: StringNullableWithAggregatesFilter<"PatientDocument"> | string | null
    verificationStatus?: StringWithAggregatesFilter<"PatientDocument"> | string
    verifiedBy?: UuidNullableWithAggregatesFilter<"PatientDocument"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"PatientDocument"> | Date | string | null
    verificationNotes?: StringNullableWithAggregatesFilter<"PatientDocument"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"PatientDocument">
    createdAt?: DateTimeWithAggregatesFilter<"PatientDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PatientDocument"> | Date | string
  }

  export type PatientHistoryWhereInput = {
    AND?: PatientHistoryWhereInput | PatientHistoryWhereInput[]
    OR?: PatientHistoryWhereInput[]
    NOT?: PatientHistoryWhereInput | PatientHistoryWhereInput[]
    id?: UuidFilter<"PatientHistory"> | string
    tenantId?: UuidFilter<"PatientHistory"> | string
    patientId?: UuidFilter<"PatientHistory"> | string
    fieldName?: StringFilter<"PatientHistory"> | string
    oldValue?: StringNullableFilter<"PatientHistory"> | string | null
    newValue?: StringNullableFilter<"PatientHistory"> | string | null
    changeType?: StringFilter<"PatientHistory"> | string
    changeReason?: StringNullableFilter<"PatientHistory"> | string | null
    supportingDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    changedBy?: UuidFilter<"PatientHistory"> | string
    approvedBy?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAtFacility?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAt?: DateTimeFilter<"PatientHistory"> | Date | string
    patientConsent?: BoolFilter<"PatientHistory"> | boolean
    consentDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    ipAddress?: StringNullableFilter<"PatientHistory"> | string | null
    userAgent?: StringNullableFilter<"PatientHistory"> | string | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type PatientHistoryOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    fieldName?: SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    changeType?: SortOrder
    changeReason?: SortOrderInput | SortOrder
    supportingDocUrl?: SortOrderInput | SortOrder
    changedBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    changedAtFacility?: SortOrderInput | SortOrder
    changedAt?: SortOrder
    patientConsent?: SortOrder
    consentDocUrl?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type PatientHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientHistoryWhereInput | PatientHistoryWhereInput[]
    OR?: PatientHistoryWhereInput[]
    NOT?: PatientHistoryWhereInput | PatientHistoryWhereInput[]
    tenantId?: UuidFilter<"PatientHistory"> | string
    patientId?: UuidFilter<"PatientHistory"> | string
    fieldName?: StringFilter<"PatientHistory"> | string
    oldValue?: StringNullableFilter<"PatientHistory"> | string | null
    newValue?: StringNullableFilter<"PatientHistory"> | string | null
    changeType?: StringFilter<"PatientHistory"> | string
    changeReason?: StringNullableFilter<"PatientHistory"> | string | null
    supportingDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    changedBy?: UuidFilter<"PatientHistory"> | string
    approvedBy?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAtFacility?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAt?: DateTimeFilter<"PatientHistory"> | Date | string
    patientConsent?: BoolFilter<"PatientHistory"> | boolean
    consentDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    ipAddress?: StringNullableFilter<"PatientHistory"> | string | null
    userAgent?: StringNullableFilter<"PatientHistory"> | string | null
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type PatientHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    fieldName?: SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    changeType?: SortOrder
    changeReason?: SortOrderInput | SortOrder
    supportingDocUrl?: SortOrderInput | SortOrder
    changedBy?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    changedAtFacility?: SortOrderInput | SortOrder
    changedAt?: SortOrder
    patientConsent?: SortOrder
    consentDocUrl?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    _count?: PatientHistoryCountOrderByAggregateInput
    _max?: PatientHistoryMaxOrderByAggregateInput
    _min?: PatientHistoryMinOrderByAggregateInput
  }

  export type PatientHistoryScalarWhereWithAggregatesInput = {
    AND?: PatientHistoryScalarWhereWithAggregatesInput | PatientHistoryScalarWhereWithAggregatesInput[]
    OR?: PatientHistoryScalarWhereWithAggregatesInput[]
    NOT?: PatientHistoryScalarWhereWithAggregatesInput | PatientHistoryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientHistory"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientHistory"> | string
    patientId?: UuidWithAggregatesFilter<"PatientHistory"> | string
    fieldName?: StringWithAggregatesFilter<"PatientHistory"> | string
    oldValue?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    newValue?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    changeType?: StringWithAggregatesFilter<"PatientHistory"> | string
    changeReason?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    supportingDocUrl?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    changedBy?: UuidWithAggregatesFilter<"PatientHistory"> | string
    approvedBy?: UuidNullableWithAggregatesFilter<"PatientHistory"> | string | null
    changedAtFacility?: UuidNullableWithAggregatesFilter<"PatientHistory"> | string | null
    changedAt?: DateTimeWithAggregatesFilter<"PatientHistory"> | Date | string
    patientConsent?: BoolWithAggregatesFilter<"PatientHistory"> | boolean
    consentDocUrl?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"PatientHistory"> | string | null
  }

  export type PatientConsentWhereInput = {
    AND?: PatientConsentWhereInput | PatientConsentWhereInput[]
    OR?: PatientConsentWhereInput[]
    NOT?: PatientConsentWhereInput | PatientConsentWhereInput[]
    id?: UuidFilter<"PatientConsent"> | string
    tenantId?: UuidFilter<"PatientConsent"> | string
    patientId?: UuidFilter<"PatientConsent"> | string
    consentType?: StringFilter<"PatientConsent"> | string
    consentCategory?: StringFilter<"PatientConsent"> | string
    consentStatus?: StringFilter<"PatientConsent"> | string
    consentScope?: StringNullableFilter<"PatientConsent"> | string | null
    purpose?: StringFilter<"PatientConsent"> | string
    description?: StringNullableFilter<"PatientConsent"> | string | null
    legalBasis?: StringNullableFilter<"PatientConsent"> | string | null
    effectiveFrom?: DateTimeFilter<"PatientConsent"> | Date | string
    effectiveUntil?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    isActive?: BoolFilter<"PatientConsent"> | boolean
    captureMethod?: StringFilter<"PatientConsent"> | string
    capturedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    capturedAt?: DateTimeFilter<"PatientConsent"> | Date | string
    capturedAtFacility?: UuidNullableFilter<"PatientConsent"> | string | null
    signatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    documentUrl?: StringNullableFilter<"PatientConsent"> | string | null
    witnessedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    witnessSignatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    revokedAt?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    revokedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    revocationReason?: StringNullableFilter<"PatientConsent"> | string | null
    revocationMethod?: StringNullableFilter<"PatientConsent"> | string | null
    metadata?: JsonNullableFilter<"PatientConsent">
    version?: IntFilter<"PatientConsent"> | number
    parentConsentId?: UuidNullableFilter<"PatientConsent"> | string | null
    linkedEntityType?: StringNullableFilter<"PatientConsent"> | string | null
    linkedEntityId?: UuidNullableFilter<"PatientConsent"> | string | null
    createdAt?: DateTimeFilter<"PatientConsent"> | Date | string
    updatedAt?: DateTimeFilter<"PatientConsent"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }

  export type PatientConsentOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    consentStatus?: SortOrder
    consentScope?: SortOrderInput | SortOrder
    purpose?: SortOrder
    description?: SortOrderInput | SortOrder
    legalBasis?: SortOrderInput | SortOrder
    effectiveFrom?: SortOrder
    effectiveUntil?: SortOrderInput | SortOrder
    isActive?: SortOrder
    captureMethod?: SortOrder
    capturedBy?: SortOrderInput | SortOrder
    capturedAt?: SortOrder
    capturedAtFacility?: SortOrderInput | SortOrder
    signatureUrl?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    witnessedBy?: SortOrderInput | SortOrder
    witnessSignatureUrl?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedBy?: SortOrderInput | SortOrder
    revocationReason?: SortOrderInput | SortOrder
    revocationMethod?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    version?: SortOrder
    parentConsentId?: SortOrderInput | SortOrder
    linkedEntityType?: SortOrderInput | SortOrder
    linkedEntityId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    patient?: PatientOrderByWithRelationInput
  }

  export type PatientConsentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientConsentWhereInput | PatientConsentWhereInput[]
    OR?: PatientConsentWhereInput[]
    NOT?: PatientConsentWhereInput | PatientConsentWhereInput[]
    tenantId?: UuidFilter<"PatientConsent"> | string
    patientId?: UuidFilter<"PatientConsent"> | string
    consentType?: StringFilter<"PatientConsent"> | string
    consentCategory?: StringFilter<"PatientConsent"> | string
    consentStatus?: StringFilter<"PatientConsent"> | string
    consentScope?: StringNullableFilter<"PatientConsent"> | string | null
    purpose?: StringFilter<"PatientConsent"> | string
    description?: StringNullableFilter<"PatientConsent"> | string | null
    legalBasis?: StringNullableFilter<"PatientConsent"> | string | null
    effectiveFrom?: DateTimeFilter<"PatientConsent"> | Date | string
    effectiveUntil?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    isActive?: BoolFilter<"PatientConsent"> | boolean
    captureMethod?: StringFilter<"PatientConsent"> | string
    capturedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    capturedAt?: DateTimeFilter<"PatientConsent"> | Date | string
    capturedAtFacility?: UuidNullableFilter<"PatientConsent"> | string | null
    signatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    documentUrl?: StringNullableFilter<"PatientConsent"> | string | null
    witnessedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    witnessSignatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    revokedAt?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    revokedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    revocationReason?: StringNullableFilter<"PatientConsent"> | string | null
    revocationMethod?: StringNullableFilter<"PatientConsent"> | string | null
    metadata?: JsonNullableFilter<"PatientConsent">
    version?: IntFilter<"PatientConsent"> | number
    parentConsentId?: UuidNullableFilter<"PatientConsent"> | string | null
    linkedEntityType?: StringNullableFilter<"PatientConsent"> | string | null
    linkedEntityId?: UuidNullableFilter<"PatientConsent"> | string | null
    createdAt?: DateTimeFilter<"PatientConsent"> | Date | string
    updatedAt?: DateTimeFilter<"PatientConsent"> | Date | string
    patient?: XOR<PatientRelationFilter, PatientWhereInput>
  }, "id">

  export type PatientConsentOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    consentStatus?: SortOrder
    consentScope?: SortOrderInput | SortOrder
    purpose?: SortOrder
    description?: SortOrderInput | SortOrder
    legalBasis?: SortOrderInput | SortOrder
    effectiveFrom?: SortOrder
    effectiveUntil?: SortOrderInput | SortOrder
    isActive?: SortOrder
    captureMethod?: SortOrder
    capturedBy?: SortOrderInput | SortOrder
    capturedAt?: SortOrder
    capturedAtFacility?: SortOrderInput | SortOrder
    signatureUrl?: SortOrderInput | SortOrder
    documentUrl?: SortOrderInput | SortOrder
    witnessedBy?: SortOrderInput | SortOrder
    witnessSignatureUrl?: SortOrderInput | SortOrder
    revokedAt?: SortOrderInput | SortOrder
    revokedBy?: SortOrderInput | SortOrder
    revocationReason?: SortOrderInput | SortOrder
    revocationMethod?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    version?: SortOrder
    parentConsentId?: SortOrderInput | SortOrder
    linkedEntityType?: SortOrderInput | SortOrder
    linkedEntityId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientConsentCountOrderByAggregateInput
    _avg?: PatientConsentAvgOrderByAggregateInput
    _max?: PatientConsentMaxOrderByAggregateInput
    _min?: PatientConsentMinOrderByAggregateInput
    _sum?: PatientConsentSumOrderByAggregateInput
  }

  export type PatientConsentScalarWhereWithAggregatesInput = {
    AND?: PatientConsentScalarWhereWithAggregatesInput | PatientConsentScalarWhereWithAggregatesInput[]
    OR?: PatientConsentScalarWhereWithAggregatesInput[]
    NOT?: PatientConsentScalarWhereWithAggregatesInput | PatientConsentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PatientConsent"> | string
    tenantId?: UuidWithAggregatesFilter<"PatientConsent"> | string
    patientId?: UuidWithAggregatesFilter<"PatientConsent"> | string
    consentType?: StringWithAggregatesFilter<"PatientConsent"> | string
    consentCategory?: StringWithAggregatesFilter<"PatientConsent"> | string
    consentStatus?: StringWithAggregatesFilter<"PatientConsent"> | string
    consentScope?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    purpose?: StringWithAggregatesFilter<"PatientConsent"> | string
    description?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    legalBasis?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    effectiveFrom?: DateTimeWithAggregatesFilter<"PatientConsent"> | Date | string
    effectiveUntil?: DateTimeNullableWithAggregatesFilter<"PatientConsent"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"PatientConsent"> | boolean
    captureMethod?: StringWithAggregatesFilter<"PatientConsent"> | string
    capturedBy?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    capturedAt?: DateTimeWithAggregatesFilter<"PatientConsent"> | Date | string
    capturedAtFacility?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    signatureUrl?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    documentUrl?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    witnessedBy?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    witnessSignatureUrl?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    revokedAt?: DateTimeNullableWithAggregatesFilter<"PatientConsent"> | Date | string | null
    revokedBy?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    revocationReason?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    revocationMethod?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"PatientConsent">
    version?: IntWithAggregatesFilter<"PatientConsent"> | number
    parentConsentId?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    linkedEntityType?: StringNullableWithAggregatesFilter<"PatientConsent"> | string | null
    linkedEntityId?: UuidNullableWithAggregatesFilter<"PatientConsent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PatientConsent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PatientConsent"> | Date | string
  }

  export type ConsentTemplateWhereInput = {
    AND?: ConsentTemplateWhereInput | ConsentTemplateWhereInput[]
    OR?: ConsentTemplateWhereInput[]
    NOT?: ConsentTemplateWhereInput | ConsentTemplateWhereInput[]
    id?: UuidFilter<"ConsentTemplate"> | string
    tenantId?: UuidFilter<"ConsentTemplate"> | string
    templateCode?: StringFilter<"ConsentTemplate"> | string
    consentType?: StringFilter<"ConsentTemplate"> | string
    consentCategory?: StringFilter<"ConsentTemplate"> | string
    title?: JsonFilter<"ConsentTemplate">
    description?: JsonFilter<"ConsentTemplate">
    content?: JsonFilter<"ConsentTemplate">
    legalText?: JsonNullableFilter<"ConsentTemplate">
    isRequired?: BoolFilter<"ConsentTemplate"> | boolean
    requiresWitness?: BoolFilter<"ConsentTemplate"> | boolean
    validityDays?: IntNullableFilter<"ConsentTemplate"> | number | null
    autoRenew?: BoolFilter<"ConsentTemplate"> | boolean
    version?: IntFilter<"ConsentTemplate"> | number
    status?: StringFilter<"ConsentTemplate"> | string
    supersedes?: UuidNullableFilter<"ConsentTemplate"> | string | null
    metadata?: JsonNullableFilter<"ConsentTemplate">
    createdAt?: DateTimeFilter<"ConsentTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentTemplate"> | Date | string
  }

  export type ConsentTemplateOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    templateCode?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    legalText?: SortOrderInput | SortOrder
    isRequired?: SortOrder
    requiresWitness?: SortOrder
    validityDays?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    version?: SortOrder
    status?: SortOrder
    supersedes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    templateCode?: string
    AND?: ConsentTemplateWhereInput | ConsentTemplateWhereInput[]
    OR?: ConsentTemplateWhereInput[]
    NOT?: ConsentTemplateWhereInput | ConsentTemplateWhereInput[]
    tenantId?: UuidFilter<"ConsentTemplate"> | string
    consentType?: StringFilter<"ConsentTemplate"> | string
    consentCategory?: StringFilter<"ConsentTemplate"> | string
    title?: JsonFilter<"ConsentTemplate">
    description?: JsonFilter<"ConsentTemplate">
    content?: JsonFilter<"ConsentTemplate">
    legalText?: JsonNullableFilter<"ConsentTemplate">
    isRequired?: BoolFilter<"ConsentTemplate"> | boolean
    requiresWitness?: BoolFilter<"ConsentTemplate"> | boolean
    validityDays?: IntNullableFilter<"ConsentTemplate"> | number | null
    autoRenew?: BoolFilter<"ConsentTemplate"> | boolean
    version?: IntFilter<"ConsentTemplate"> | number
    status?: StringFilter<"ConsentTemplate"> | string
    supersedes?: UuidNullableFilter<"ConsentTemplate"> | string | null
    metadata?: JsonNullableFilter<"ConsentTemplate">
    createdAt?: DateTimeFilter<"ConsentTemplate"> | Date | string
    updatedAt?: DateTimeFilter<"ConsentTemplate"> | Date | string
  }, "id" | "templateCode">

  export type ConsentTemplateOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    templateCode?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    legalText?: SortOrderInput | SortOrder
    isRequired?: SortOrder
    requiresWitness?: SortOrder
    validityDays?: SortOrderInput | SortOrder
    autoRenew?: SortOrder
    version?: SortOrder
    status?: SortOrder
    supersedes?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConsentTemplateCountOrderByAggregateInput
    _avg?: ConsentTemplateAvgOrderByAggregateInput
    _max?: ConsentTemplateMaxOrderByAggregateInput
    _min?: ConsentTemplateMinOrderByAggregateInput
    _sum?: ConsentTemplateSumOrderByAggregateInput
  }

  export type ConsentTemplateScalarWhereWithAggregatesInput = {
    AND?: ConsentTemplateScalarWhereWithAggregatesInput | ConsentTemplateScalarWhereWithAggregatesInput[]
    OR?: ConsentTemplateScalarWhereWithAggregatesInput[]
    NOT?: ConsentTemplateScalarWhereWithAggregatesInput | ConsentTemplateScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ConsentTemplate"> | string
    tenantId?: UuidWithAggregatesFilter<"ConsentTemplate"> | string
    templateCode?: StringWithAggregatesFilter<"ConsentTemplate"> | string
    consentType?: StringWithAggregatesFilter<"ConsentTemplate"> | string
    consentCategory?: StringWithAggregatesFilter<"ConsentTemplate"> | string
    title?: JsonWithAggregatesFilter<"ConsentTemplate">
    description?: JsonWithAggregatesFilter<"ConsentTemplate">
    content?: JsonWithAggregatesFilter<"ConsentTemplate">
    legalText?: JsonNullableWithAggregatesFilter<"ConsentTemplate">
    isRequired?: BoolWithAggregatesFilter<"ConsentTemplate"> | boolean
    requiresWitness?: BoolWithAggregatesFilter<"ConsentTemplate"> | boolean
    validityDays?: IntNullableWithAggregatesFilter<"ConsentTemplate"> | number | null
    autoRenew?: BoolWithAggregatesFilter<"ConsentTemplate"> | boolean
    version?: IntWithAggregatesFilter<"ConsentTemplate"> | number
    status?: StringWithAggregatesFilter<"ConsentTemplate"> | string
    supersedes?: UuidNullableWithAggregatesFilter<"ConsentTemplate"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"ConsentTemplate">
    createdAt?: DateTimeWithAggregatesFilter<"ConsentTemplate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ConsentTemplate"> | Date | string
  }

  export type PatientCreateInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentCreateNestedManyWithoutPatientInput
    history?: PatientHistoryCreateNestedManyWithoutPatientInput
    consents?: PatientConsentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentUncheckedCreateNestedManyWithoutPatientInput
    history?: PatientHistoryUncheckedCreateNestedManyWithoutPatientInput
    consents?: PatientConsentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateManyInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateInput = {
    id?: string
    tenantId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
    encounters?: EncounterCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
    encounters?: EncounterUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateInput = {
    id?: string
    tenantId: string
    facilityId: string
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment?: AppointmentCreateNestedOneWithoutEncountersInput
    patient: PatientCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    appointmentId?: string | null
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneWithoutEncountersNestedInput
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    appointmentId?: string | null
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentCreateInput = {
    id?: string
    tenantId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutDocumentsInput
  }

  export type PatientDocumentUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type PatientDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientHistoryCreateInput = {
    id?: string
    tenantId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    patient: PatientCreateNestedOneWithoutHistoryInput
  }

  export type PatientHistoryUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type PatientHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    patient?: PatientUpdateOneRequiredWithoutHistoryNestedInput
  }

  export type PatientHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientHistoryCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type PatientHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientConsentCreateInput = {
    id?: string
    tenantId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutConsentsInput
  }

  export type PatientConsentUncheckedCreateInput = {
    id?: string
    tenantId: string
    patientId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientConsentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutConsentsNestedInput
  }

  export type PatientConsentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientConsentCreateManyInput = {
    id?: string
    tenantId: string
    patientId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientConsentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientConsentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentTemplateCreateInput = {
    id?: string
    tenantId: string
    templateCode: string
    consentType: string
    consentCategory: string
    title: JsonNullValueInput | InputJsonValue
    description: JsonNullValueInput | InputJsonValue
    content: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: number | null
    autoRenew?: boolean
    version?: number
    status?: string
    supersedes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentTemplateUncheckedCreateInput = {
    id?: string
    tenantId: string
    templateCode: string
    consentType: string
    consentCategory: string
    title: JsonNullValueInput | InputJsonValue
    description: JsonNullValueInput | InputJsonValue
    content: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: number | null
    autoRenew?: boolean
    version?: number
    status?: string
    supersedes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentTemplateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    templateCode?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    title?: JsonNullValueInput | InputJsonValue
    description?: JsonNullValueInput | InputJsonValue
    content?: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    requiresWitness?: BoolFieldUpdateOperationsInput | boolean
    validityDays?: NullableIntFieldUpdateOperationsInput | number | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    supersedes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentTemplateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    templateCode?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    title?: JsonNullValueInput | InputJsonValue
    description?: JsonNullValueInput | InputJsonValue
    content?: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    requiresWitness?: BoolFieldUpdateOperationsInput | boolean
    validityDays?: NullableIntFieldUpdateOperationsInput | number | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    supersedes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentTemplateCreateManyInput = {
    id?: string
    tenantId: string
    templateCode: string
    consentType: string
    consentCategory: string
    title: JsonNullValueInput | InputJsonValue
    description: JsonNullValueInput | InputJsonValue
    content: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: boolean
    requiresWitness?: boolean
    validityDays?: number | null
    autoRenew?: boolean
    version?: number
    status?: string
    supersedes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConsentTemplateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    templateCode?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    title?: JsonNullValueInput | InputJsonValue
    description?: JsonNullValueInput | InputJsonValue
    content?: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    requiresWitness?: BoolFieldUpdateOperationsInput | boolean
    validityDays?: NullableIntFieldUpdateOperationsInput | number | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    supersedes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsentTemplateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    templateCode?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    title?: JsonNullValueInput | InputJsonValue
    description?: JsonNullValueInput | InputJsonValue
    content?: JsonNullValueInput | InputJsonValue
    legalText?: NullableJsonNullValueInput | InputJsonValue
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    requiresWitness?: BoolFieldUpdateOperationsInput | boolean
    validityDays?: NullableIntFieldUpdateOperationsInput | number | null
    autoRenew?: BoolFieldUpdateOperationsInput | boolean
    version?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    supersedes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
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

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type EncounterListRelationFilter = {
    every?: EncounterWhereInput
    some?: EncounterWhereInput
    none?: EncounterWhereInput
  }

  export type PatientDocumentListRelationFilter = {
    every?: PatientDocumentWhereInput
    some?: PatientDocumentWhereInput
    none?: PatientDocumentWhereInput
  }

  export type PatientHistoryListRelationFilter = {
    every?: PatientHistoryWhereInput
    some?: PatientHistoryWhereInput
    none?: PatientHistoryWhereInput
  }

  export type PatientConsentListRelationFilter = {
    every?: PatientConsentWhereInput
    some?: PatientConsentWhereInput
    none?: PatientConsentWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EncounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientConsentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    tenantId?: SortOrder
    nationalId?: SortOrder
    nationalIdType?: SortOrder
    issuingCountry?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    maritalStatus?: SortOrder
    nationality?: SortOrder
    preferredLanguage?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    bloodGroup?: SortOrder
    emergencyContact?: SortOrder
    insuranceInfo?: SortOrder
    createdBy?: SortOrder
    createdAtFacility?: SortOrder
    registrationSource?: SortOrder
    registrationNotes?: SortOrder
    updatedBy?: SortOrder
    updatedAtFacility?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    tenantId?: SortOrder
    nationalId?: SortOrder
    nationalIdType?: SortOrder
    issuingCountry?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    maritalStatus?: SortOrder
    nationality?: SortOrder
    preferredLanguage?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    bloodGroup?: SortOrder
    createdBy?: SortOrder
    createdAtFacility?: SortOrder
    registrationSource?: SortOrder
    registrationNotes?: SortOrder
    updatedBy?: SortOrder
    updatedAtFacility?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    mrn?: SortOrder
    tenantId?: SortOrder
    nationalId?: SortOrder
    nationalIdType?: SortOrder
    issuingCountry?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    middleName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    maritalStatus?: SortOrder
    nationality?: SortOrder
    preferredLanguage?: SortOrder
    phoneNumber?: SortOrder
    email?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    postalCode?: SortOrder
    country?: SortOrder
    bloodGroup?: SortOrder
    createdBy?: SortOrder
    createdAtFacility?: SortOrder
    registrationSource?: SortOrder
    registrationNotes?: SortOrder
    updatedBy?: SortOrder
    updatedAtFacility?: SortOrder
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

  export type PatientRelationFilter = {
    is?: PatientWhereInput
    isNot?: PatientWhereInput
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    spaceId?: SortOrder
    staffId?: SortOrder
    appointmentType?: SortOrder
    status?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    visitType?: SortOrder
    linkedEncounterId?: SortOrder
    seriesId?: SortOrder
    cancellationReason?: SortOrder
    rescheduleReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    spaceId?: SortOrder
    staffId?: SortOrder
    appointmentType?: SortOrder
    status?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    visitType?: SortOrder
    linkedEncounterId?: SortOrder
    seriesId?: SortOrder
    cancellationReason?: SortOrder
    rescheduleReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    spaceId?: SortOrder
    staffId?: SortOrder
    appointmentType?: SortOrder
    status?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    duration?: SortOrder
    notes?: SortOrder
    visitType?: SortOrder
    linkedEncounterId?: SortOrder
    seriesId?: SortOrder
    cancellationReason?: SortOrder
    rescheduleReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppointmentSumOrderByAggregateInput = {
    duration?: SortOrder
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

  export type AppointmentNullableRelationFilter = {
    is?: AppointmentWhereInput | null
    isNot?: AppointmentWhereInput | null
  }

  export type EncounterCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    appointmentId?: SortOrder
    primaryStaffId?: SortOrder
    encounterClass?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    encounterSource?: SortOrder
    walkInDetails?: SortOrder
    chiefComplaint?: SortOrder
    presentingSymptoms?: SortOrder
    vitalSigns?: SortOrder
    allergies?: SortOrder
    currentMedications?: SortOrder
    medicalHistory?: SortOrder
    socialHistory?: SortOrder
    familyHistory?: SortOrder
    notes?: SortOrder
    dischargeDisposition?: SortOrder
    followUpInstructions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    appointmentId?: SortOrder
    primaryStaffId?: SortOrder
    encounterClass?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    encounterSource?: SortOrder
    chiefComplaint?: SortOrder
    presentingSymptoms?: SortOrder
    medicalHistory?: SortOrder
    socialHistory?: SortOrder
    familyHistory?: SortOrder
    notes?: SortOrder
    dischargeDisposition?: SortOrder
    followUpInstructions?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EncounterMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    facilityId?: SortOrder
    appointmentId?: SortOrder
    primaryStaffId?: SortOrder
    encounterClass?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    encounterSource?: SortOrder
    chiefComplaint?: SortOrder
    presentingSymptoms?: SortOrder
    medicalHistory?: SortOrder
    socialHistory?: SortOrder
    familyHistory?: SortOrder
    notes?: SortOrder
    dischargeDisposition?: SortOrder
    followUpInstructions?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PatientDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    issuingCountry?: SortOrder
    issuingAuthority?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    isPrimaryIdentity?: SortOrder
    documentUrl?: SortOrder
    verificationStatus?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    verificationNotes?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    issuingCountry?: SortOrder
    issuingAuthority?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    isPrimaryIdentity?: SortOrder
    documentUrl?: SortOrder
    verificationStatus?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    verificationNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    documentType?: SortOrder
    documentNumber?: SortOrder
    issuingCountry?: SortOrder
    issuingAuthority?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    isPrimaryIdentity?: SortOrder
    documentUrl?: SortOrder
    verificationStatus?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    verificationNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PatientHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    fieldName?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    changeType?: SortOrder
    changeReason?: SortOrder
    supportingDocUrl?: SortOrder
    changedBy?: SortOrder
    approvedBy?: SortOrder
    changedAtFacility?: SortOrder
    changedAt?: SortOrder
    patientConsent?: SortOrder
    consentDocUrl?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type PatientHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    fieldName?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    changeType?: SortOrder
    changeReason?: SortOrder
    supportingDocUrl?: SortOrder
    changedBy?: SortOrder
    approvedBy?: SortOrder
    changedAtFacility?: SortOrder
    changedAt?: SortOrder
    patientConsent?: SortOrder
    consentDocUrl?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type PatientHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    fieldName?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    changeType?: SortOrder
    changeReason?: SortOrder
    supportingDocUrl?: SortOrder
    changedBy?: SortOrder
    approvedBy?: SortOrder
    changedAtFacility?: SortOrder
    changedAt?: SortOrder
    patientConsent?: SortOrder
    consentDocUrl?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type PatientConsentCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    consentStatus?: SortOrder
    consentScope?: SortOrder
    purpose?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    effectiveFrom?: SortOrder
    effectiveUntil?: SortOrder
    isActive?: SortOrder
    captureMethod?: SortOrder
    capturedBy?: SortOrder
    capturedAt?: SortOrder
    capturedAtFacility?: SortOrder
    signatureUrl?: SortOrder
    documentUrl?: SortOrder
    witnessedBy?: SortOrder
    witnessSignatureUrl?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    revocationReason?: SortOrder
    revocationMethod?: SortOrder
    metadata?: SortOrder
    version?: SortOrder
    parentConsentId?: SortOrder
    linkedEntityType?: SortOrder
    linkedEntityId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientConsentAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type PatientConsentMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    consentStatus?: SortOrder
    consentScope?: SortOrder
    purpose?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    effectiveFrom?: SortOrder
    effectiveUntil?: SortOrder
    isActive?: SortOrder
    captureMethod?: SortOrder
    capturedBy?: SortOrder
    capturedAt?: SortOrder
    capturedAtFacility?: SortOrder
    signatureUrl?: SortOrder
    documentUrl?: SortOrder
    witnessedBy?: SortOrder
    witnessSignatureUrl?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    revocationReason?: SortOrder
    revocationMethod?: SortOrder
    version?: SortOrder
    parentConsentId?: SortOrder
    linkedEntityType?: SortOrder
    linkedEntityId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientConsentMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    patientId?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    consentStatus?: SortOrder
    consentScope?: SortOrder
    purpose?: SortOrder
    description?: SortOrder
    legalBasis?: SortOrder
    effectiveFrom?: SortOrder
    effectiveUntil?: SortOrder
    isActive?: SortOrder
    captureMethod?: SortOrder
    capturedBy?: SortOrder
    capturedAt?: SortOrder
    capturedAtFacility?: SortOrder
    signatureUrl?: SortOrder
    documentUrl?: SortOrder
    witnessedBy?: SortOrder
    witnessSignatureUrl?: SortOrder
    revokedAt?: SortOrder
    revokedBy?: SortOrder
    revocationReason?: SortOrder
    revocationMethod?: SortOrder
    version?: SortOrder
    parentConsentId?: SortOrder
    linkedEntityType?: SortOrder
    linkedEntityId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientConsentSumOrderByAggregateInput = {
    version?: SortOrder
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

  export type ConsentTemplateCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    templateCode?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    title?: SortOrder
    description?: SortOrder
    content?: SortOrder
    legalText?: SortOrder
    isRequired?: SortOrder
    requiresWitness?: SortOrder
    validityDays?: SortOrder
    autoRenew?: SortOrder
    version?: SortOrder
    status?: SortOrder
    supersedes?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentTemplateAvgOrderByAggregateInput = {
    validityDays?: SortOrder
    version?: SortOrder
  }

  export type ConsentTemplateMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    templateCode?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    isRequired?: SortOrder
    requiresWitness?: SortOrder
    validityDays?: SortOrder
    autoRenew?: SortOrder
    version?: SortOrder
    status?: SortOrder
    supersedes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentTemplateMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    templateCode?: SortOrder
    consentType?: SortOrder
    consentCategory?: SortOrder
    isRequired?: SortOrder
    requiresWitness?: SortOrder
    validityDays?: SortOrder
    autoRenew?: SortOrder
    version?: SortOrder
    status?: SortOrder
    supersedes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConsentTemplateSumOrderByAggregateInput = {
    validityDays?: SortOrder
    version?: SortOrder
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

  export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type EncounterCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type PatientDocumentCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput> | PatientDocumentCreateWithoutPatientInput[] | PatientDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientDocumentCreateOrConnectWithoutPatientInput | PatientDocumentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientDocumentCreateManyPatientInputEnvelope
    connect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
  }

  export type PatientHistoryCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput> | PatientHistoryCreateWithoutPatientInput[] | PatientHistoryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientHistoryCreateOrConnectWithoutPatientInput | PatientHistoryCreateOrConnectWithoutPatientInput[]
    createMany?: PatientHistoryCreateManyPatientInputEnvelope
    connect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
  }

  export type PatientConsentCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput> | PatientConsentCreateWithoutPatientInput[] | PatientConsentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientConsentCreateOrConnectWithoutPatientInput | PatientConsentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientConsentCreateManyPatientInputEnvelope
    connect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type PatientDocumentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput> | PatientDocumentCreateWithoutPatientInput[] | PatientDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientDocumentCreateOrConnectWithoutPatientInput | PatientDocumentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientDocumentCreateManyPatientInputEnvelope
    connect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
  }

  export type PatientHistoryUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput> | PatientHistoryCreateWithoutPatientInput[] | PatientHistoryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientHistoryCreateOrConnectWithoutPatientInput | PatientHistoryCreateOrConnectWithoutPatientInput[]
    createMany?: PatientHistoryCreateManyPatientInputEnvelope
    connect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
  }

  export type PatientConsentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput> | PatientConsentCreateWithoutPatientInput[] | PatientConsentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientConsentCreateOrConnectWithoutPatientInput | PatientConsentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientConsentCreateManyPatientInputEnvelope
    connect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
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

  export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type EncounterUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type PatientDocumentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput> | PatientDocumentCreateWithoutPatientInput[] | PatientDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientDocumentCreateOrConnectWithoutPatientInput | PatientDocumentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientDocumentUpsertWithWhereUniqueWithoutPatientInput | PatientDocumentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientDocumentCreateManyPatientInputEnvelope
    set?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    disconnect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    delete?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    connect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    update?: PatientDocumentUpdateWithWhereUniqueWithoutPatientInput | PatientDocumentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientDocumentUpdateManyWithWhereWithoutPatientInput | PatientDocumentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientDocumentScalarWhereInput | PatientDocumentScalarWhereInput[]
  }

  export type PatientHistoryUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput> | PatientHistoryCreateWithoutPatientInput[] | PatientHistoryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientHistoryCreateOrConnectWithoutPatientInput | PatientHistoryCreateOrConnectWithoutPatientInput[]
    upsert?: PatientHistoryUpsertWithWhereUniqueWithoutPatientInput | PatientHistoryUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientHistoryCreateManyPatientInputEnvelope
    set?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    disconnect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    delete?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    connect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    update?: PatientHistoryUpdateWithWhereUniqueWithoutPatientInput | PatientHistoryUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientHistoryUpdateManyWithWhereWithoutPatientInput | PatientHistoryUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientHistoryScalarWhereInput | PatientHistoryScalarWhereInput[]
  }

  export type PatientConsentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput> | PatientConsentCreateWithoutPatientInput[] | PatientConsentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientConsentCreateOrConnectWithoutPatientInput | PatientConsentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientConsentUpsertWithWhereUniqueWithoutPatientInput | PatientConsentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientConsentCreateManyPatientInputEnvelope
    set?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    disconnect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    delete?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    connect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    update?: PatientConsentUpdateWithWhereUniqueWithoutPatientInput | PatientConsentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientConsentUpdateManyWithWhereWithoutPatientInput | PatientConsentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientConsentScalarWhereInput | PatientConsentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput> | EncounterCreateWithoutPatientInput[] | EncounterUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutPatientInput | EncounterCreateOrConnectWithoutPatientInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutPatientInput | EncounterUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: EncounterCreateManyPatientInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutPatientInput | EncounterUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutPatientInput | EncounterUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput> | PatientDocumentCreateWithoutPatientInput[] | PatientDocumentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientDocumentCreateOrConnectWithoutPatientInput | PatientDocumentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientDocumentUpsertWithWhereUniqueWithoutPatientInput | PatientDocumentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientDocumentCreateManyPatientInputEnvelope
    set?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    disconnect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    delete?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    connect?: PatientDocumentWhereUniqueInput | PatientDocumentWhereUniqueInput[]
    update?: PatientDocumentUpdateWithWhereUniqueWithoutPatientInput | PatientDocumentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientDocumentUpdateManyWithWhereWithoutPatientInput | PatientDocumentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientDocumentScalarWhereInput | PatientDocumentScalarWhereInput[]
  }

  export type PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput> | PatientHistoryCreateWithoutPatientInput[] | PatientHistoryUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientHistoryCreateOrConnectWithoutPatientInput | PatientHistoryCreateOrConnectWithoutPatientInput[]
    upsert?: PatientHistoryUpsertWithWhereUniqueWithoutPatientInput | PatientHistoryUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientHistoryCreateManyPatientInputEnvelope
    set?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    disconnect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    delete?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    connect?: PatientHistoryWhereUniqueInput | PatientHistoryWhereUniqueInput[]
    update?: PatientHistoryUpdateWithWhereUniqueWithoutPatientInput | PatientHistoryUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientHistoryUpdateManyWithWhereWithoutPatientInput | PatientHistoryUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientHistoryScalarWhereInput | PatientHistoryScalarWhereInput[]
  }

  export type PatientConsentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput> | PatientConsentCreateWithoutPatientInput[] | PatientConsentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientConsentCreateOrConnectWithoutPatientInput | PatientConsentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientConsentUpsertWithWhereUniqueWithoutPatientInput | PatientConsentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientConsentCreateManyPatientInputEnvelope
    set?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    disconnect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    delete?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    connect?: PatientConsentWhereUniqueInput | PatientConsentWhereUniqueInput[]
    update?: PatientConsentUpdateWithWhereUniqueWithoutPatientInput | PatientConsentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientConsentUpdateManyWithWhereWithoutPatientInput | PatientConsentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientConsentScalarWhereInput | PatientConsentScalarWhereInput[]
  }

  export type PatientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
  }

  export type EncounterCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput> | EncounterCreateWithoutAppointmentInput[] | EncounterUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutAppointmentInput | EncounterCreateOrConnectWithoutAppointmentInput[]
    createMany?: EncounterCreateManyAppointmentInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type EncounterUncheckedCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput> | EncounterCreateWithoutAppointmentInput[] | EncounterUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutAppointmentInput | EncounterCreateOrConnectWithoutAppointmentInput[]
    createMany?: EncounterCreateManyAppointmentInputEnvelope
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PatientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutAppointmentsInput
    upsert?: PatientUpsertWithoutAppointmentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutAppointmentsInput, PatientUpdateWithoutAppointmentsInput>, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type EncounterUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput> | EncounterCreateWithoutAppointmentInput[] | EncounterUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutAppointmentInput | EncounterCreateOrConnectWithoutAppointmentInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutAppointmentInput | EncounterUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: EncounterCreateManyAppointmentInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutAppointmentInput | EncounterUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutAppointmentInput | EncounterUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type EncounterUncheckedUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput> | EncounterCreateWithoutAppointmentInput[] | EncounterUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: EncounterCreateOrConnectWithoutAppointmentInput | EncounterCreateOrConnectWithoutAppointmentInput[]
    upsert?: EncounterUpsertWithWhereUniqueWithoutAppointmentInput | EncounterUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: EncounterCreateManyAppointmentInputEnvelope
    set?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    disconnect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    delete?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    connect?: EncounterWhereUniqueInput | EncounterWhereUniqueInput[]
    update?: EncounterUpdateWithWhereUniqueWithoutAppointmentInput | EncounterUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: EncounterUpdateManyWithWhereWithoutAppointmentInput | EncounterUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
  }

  export type AppointmentCreateNestedOneWithoutEncountersInput = {
    create?: XOR<AppointmentCreateWithoutEncountersInput, AppointmentUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutEncountersInput
    connect?: AppointmentWhereUniqueInput
  }

  export type PatientCreateNestedOneWithoutEncountersInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    connect?: PatientWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AppointmentUpdateOneWithoutEncountersNestedInput = {
    create?: XOR<AppointmentCreateWithoutEncountersInput, AppointmentUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutEncountersInput
    upsert?: AppointmentUpsertWithoutEncountersInput
    disconnect?: AppointmentWhereInput | boolean
    delete?: AppointmentWhereInput | boolean
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutEncountersInput, AppointmentUpdateWithoutEncountersInput>, AppointmentUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientUpdateOneRequiredWithoutEncountersNestedInput = {
    create?: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    connectOrCreate?: PatientCreateOrConnectWithoutEncountersInput
    upsert?: PatientUpsertWithoutEncountersInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutEncountersInput, PatientUpdateWithoutEncountersInput>, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutDocumentsInput
    connect?: PatientWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PatientUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutDocumentsInput
    upsert?: PatientUpsertWithoutDocumentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutDocumentsInput, PatientUpdateWithoutDocumentsInput>, PatientUncheckedUpdateWithoutDocumentsInput>
  }

  export type PatientCreateNestedOneWithoutHistoryInput = {
    create?: XOR<PatientCreateWithoutHistoryInput, PatientUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: PatientCreateOrConnectWithoutHistoryInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutHistoryNestedInput = {
    create?: XOR<PatientCreateWithoutHistoryInput, PatientUncheckedCreateWithoutHistoryInput>
    connectOrCreate?: PatientCreateOrConnectWithoutHistoryInput
    upsert?: PatientUpsertWithoutHistoryInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutHistoryInput, PatientUpdateWithoutHistoryInput>, PatientUncheckedUpdateWithoutHistoryInput>
  }

  export type PatientCreateNestedOneWithoutConsentsInput = {
    create?: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConsentsInput
    connect?: PatientWhereUniqueInput
  }

  export type PatientUpdateOneRequiredWithoutConsentsNestedInput = {
    create?: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    connectOrCreate?: PatientCreateOrConnectWithoutConsentsInput
    upsert?: PatientUpsertWithoutConsentsInput
    connect?: PatientWhereUniqueInput
    update?: XOR<XOR<PatientUpdateToOneWithWhereWithoutConsentsInput, PatientUpdateWithoutConsentsInput>, PatientUncheckedUpdateWithoutConsentsInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type AppointmentCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateManyPatientInputEnvelope = {
    data: AppointmentCreateManyPatientInput | AppointmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type EncounterCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment?: AppointmentCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    appointmentId?: string | null
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCreateOrConnectWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterCreateManyPatientInputEnvelope = {
    data: EncounterCreateManyPatientInput | EncounterCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientDocumentCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientDocumentUncheckedCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientDocumentCreateOrConnectWithoutPatientInput = {
    where: PatientDocumentWhereUniqueInput
    create: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput>
  }

  export type PatientDocumentCreateManyPatientInputEnvelope = {
    data: PatientDocumentCreateManyPatientInput | PatientDocumentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientHistoryCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type PatientHistoryUncheckedCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type PatientHistoryCreateOrConnectWithoutPatientInput = {
    where: PatientHistoryWhereUniqueInput
    create: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput>
  }

  export type PatientHistoryCreateManyPatientInputEnvelope = {
    data: PatientHistoryCreateManyPatientInput | PatientHistoryCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientConsentCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientConsentUncheckedCreateWithoutPatientInput = {
    id?: string
    tenantId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientConsentCreateOrConnectWithoutPatientInput = {
    where: PatientConsentWhereUniqueInput
    create: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput>
  }

  export type PatientConsentCreateManyPatientInputEnvelope = {
    data: PatientConsentCreateManyPatientInput | PatientConsentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: UuidFilter<"Appointment"> | string
    tenantId?: UuidFilter<"Appointment"> | string
    patientId?: UuidFilter<"Appointment"> | string
    facilityId?: UuidFilter<"Appointment"> | string
    spaceId?: UuidNullableFilter<"Appointment"> | string | null
    staffId?: UuidNullableFilter<"Appointment"> | string | null
    appointmentType?: StringFilter<"Appointment"> | string
    status?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    duration?: IntFilter<"Appointment"> | number
    notes?: StringNullableFilter<"Appointment"> | string | null
    visitType?: StringNullableFilter<"Appointment"> | string | null
    linkedEncounterId?: UuidNullableFilter<"Appointment"> | string | null
    seriesId?: StringNullableFilter<"Appointment"> | string | null
    cancellationReason?: StringNullableFilter<"Appointment"> | string | null
    rescheduleReason?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
  }

  export type EncounterUpsertWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
    create: XOR<EncounterCreateWithoutPatientInput, EncounterUncheckedCreateWithoutPatientInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutPatientInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutPatientInput, EncounterUncheckedUpdateWithoutPatientInput>
  }

  export type EncounterUpdateManyWithWhereWithoutPatientInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutPatientInput>
  }

  export type EncounterScalarWhereInput = {
    AND?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    OR?: EncounterScalarWhereInput[]
    NOT?: EncounterScalarWhereInput | EncounterScalarWhereInput[]
    id?: UuidFilter<"Encounter"> | string
    tenantId?: UuidFilter<"Encounter"> | string
    patientId?: UuidFilter<"Encounter"> | string
    facilityId?: UuidFilter<"Encounter"> | string
    appointmentId?: UuidNullableFilter<"Encounter"> | string | null
    primaryStaffId?: UuidFilter<"Encounter"> | string
    encounterClass?: StringFilter<"Encounter"> | string
    status?: StringFilter<"Encounter"> | string
    priority?: StringFilter<"Encounter"> | string
    startTime?: DateTimeFilter<"Encounter"> | Date | string
    endTime?: DateTimeNullableFilter<"Encounter"> | Date | string | null
    encounterSource?: StringFilter<"Encounter"> | string
    walkInDetails?: JsonNullableFilter<"Encounter">
    chiefComplaint?: StringNullableFilter<"Encounter"> | string | null
    presentingSymptoms?: StringNullableFilter<"Encounter"> | string | null
    vitalSigns?: JsonNullableFilter<"Encounter">
    allergies?: JsonNullableFilter<"Encounter">
    currentMedications?: JsonNullableFilter<"Encounter">
    medicalHistory?: StringNullableFilter<"Encounter"> | string | null
    socialHistory?: StringNullableFilter<"Encounter"> | string | null
    familyHistory?: StringNullableFilter<"Encounter"> | string | null
    notes?: StringNullableFilter<"Encounter"> | string | null
    dischargeDisposition?: StringNullableFilter<"Encounter"> | string | null
    followUpInstructions?: StringNullableFilter<"Encounter"> | string | null
    createdAt?: DateTimeFilter<"Encounter"> | Date | string
    updatedAt?: DateTimeFilter<"Encounter"> | Date | string
  }

  export type PatientDocumentUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientDocumentWhereUniqueInput
    update: XOR<PatientDocumentUpdateWithoutPatientInput, PatientDocumentUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientDocumentCreateWithoutPatientInput, PatientDocumentUncheckedCreateWithoutPatientInput>
  }

  export type PatientDocumentUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientDocumentWhereUniqueInput
    data: XOR<PatientDocumentUpdateWithoutPatientInput, PatientDocumentUncheckedUpdateWithoutPatientInput>
  }

  export type PatientDocumentUpdateManyWithWhereWithoutPatientInput = {
    where: PatientDocumentScalarWhereInput
    data: XOR<PatientDocumentUpdateManyMutationInput, PatientDocumentUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientDocumentScalarWhereInput = {
    AND?: PatientDocumentScalarWhereInput | PatientDocumentScalarWhereInput[]
    OR?: PatientDocumentScalarWhereInput[]
    NOT?: PatientDocumentScalarWhereInput | PatientDocumentScalarWhereInput[]
    id?: UuidFilter<"PatientDocument"> | string
    tenantId?: UuidFilter<"PatientDocument"> | string
    patientId?: UuidFilter<"PatientDocument"> | string
    documentType?: StringFilter<"PatientDocument"> | string
    documentNumber?: StringFilter<"PatientDocument"> | string
    issuingCountry?: StringFilter<"PatientDocument"> | string
    issuingAuthority?: StringNullableFilter<"PatientDocument"> | string | null
    issueDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    isPrimaryIdentity?: BoolFilter<"PatientDocument"> | boolean
    documentUrl?: StringNullableFilter<"PatientDocument"> | string | null
    verificationStatus?: StringFilter<"PatientDocument"> | string
    verifiedBy?: UuidNullableFilter<"PatientDocument"> | string | null
    verifiedAt?: DateTimeNullableFilter<"PatientDocument"> | Date | string | null
    verificationNotes?: StringNullableFilter<"PatientDocument"> | string | null
    metadata?: JsonNullableFilter<"PatientDocument">
    createdAt?: DateTimeFilter<"PatientDocument"> | Date | string
    updatedAt?: DateTimeFilter<"PatientDocument"> | Date | string
  }

  export type PatientHistoryUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientHistoryWhereUniqueInput
    update: XOR<PatientHistoryUpdateWithoutPatientInput, PatientHistoryUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientHistoryCreateWithoutPatientInput, PatientHistoryUncheckedCreateWithoutPatientInput>
  }

  export type PatientHistoryUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientHistoryWhereUniqueInput
    data: XOR<PatientHistoryUpdateWithoutPatientInput, PatientHistoryUncheckedUpdateWithoutPatientInput>
  }

  export type PatientHistoryUpdateManyWithWhereWithoutPatientInput = {
    where: PatientHistoryScalarWhereInput
    data: XOR<PatientHistoryUpdateManyMutationInput, PatientHistoryUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientHistoryScalarWhereInput = {
    AND?: PatientHistoryScalarWhereInput | PatientHistoryScalarWhereInput[]
    OR?: PatientHistoryScalarWhereInput[]
    NOT?: PatientHistoryScalarWhereInput | PatientHistoryScalarWhereInput[]
    id?: UuidFilter<"PatientHistory"> | string
    tenantId?: UuidFilter<"PatientHistory"> | string
    patientId?: UuidFilter<"PatientHistory"> | string
    fieldName?: StringFilter<"PatientHistory"> | string
    oldValue?: StringNullableFilter<"PatientHistory"> | string | null
    newValue?: StringNullableFilter<"PatientHistory"> | string | null
    changeType?: StringFilter<"PatientHistory"> | string
    changeReason?: StringNullableFilter<"PatientHistory"> | string | null
    supportingDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    changedBy?: UuidFilter<"PatientHistory"> | string
    approvedBy?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAtFacility?: UuidNullableFilter<"PatientHistory"> | string | null
    changedAt?: DateTimeFilter<"PatientHistory"> | Date | string
    patientConsent?: BoolFilter<"PatientHistory"> | boolean
    consentDocUrl?: StringNullableFilter<"PatientHistory"> | string | null
    ipAddress?: StringNullableFilter<"PatientHistory"> | string | null
    userAgent?: StringNullableFilter<"PatientHistory"> | string | null
  }

  export type PatientConsentUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientConsentWhereUniqueInput
    update: XOR<PatientConsentUpdateWithoutPatientInput, PatientConsentUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientConsentCreateWithoutPatientInput, PatientConsentUncheckedCreateWithoutPatientInput>
  }

  export type PatientConsentUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientConsentWhereUniqueInput
    data: XOR<PatientConsentUpdateWithoutPatientInput, PatientConsentUncheckedUpdateWithoutPatientInput>
  }

  export type PatientConsentUpdateManyWithWhereWithoutPatientInput = {
    where: PatientConsentScalarWhereInput
    data: XOR<PatientConsentUpdateManyMutationInput, PatientConsentUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientConsentScalarWhereInput = {
    AND?: PatientConsentScalarWhereInput | PatientConsentScalarWhereInput[]
    OR?: PatientConsentScalarWhereInput[]
    NOT?: PatientConsentScalarWhereInput | PatientConsentScalarWhereInput[]
    id?: UuidFilter<"PatientConsent"> | string
    tenantId?: UuidFilter<"PatientConsent"> | string
    patientId?: UuidFilter<"PatientConsent"> | string
    consentType?: StringFilter<"PatientConsent"> | string
    consentCategory?: StringFilter<"PatientConsent"> | string
    consentStatus?: StringFilter<"PatientConsent"> | string
    consentScope?: StringNullableFilter<"PatientConsent"> | string | null
    purpose?: StringFilter<"PatientConsent"> | string
    description?: StringNullableFilter<"PatientConsent"> | string | null
    legalBasis?: StringNullableFilter<"PatientConsent"> | string | null
    effectiveFrom?: DateTimeFilter<"PatientConsent"> | Date | string
    effectiveUntil?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    isActive?: BoolFilter<"PatientConsent"> | boolean
    captureMethod?: StringFilter<"PatientConsent"> | string
    capturedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    capturedAt?: DateTimeFilter<"PatientConsent"> | Date | string
    capturedAtFacility?: UuidNullableFilter<"PatientConsent"> | string | null
    signatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    documentUrl?: StringNullableFilter<"PatientConsent"> | string | null
    witnessedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    witnessSignatureUrl?: StringNullableFilter<"PatientConsent"> | string | null
    revokedAt?: DateTimeNullableFilter<"PatientConsent"> | Date | string | null
    revokedBy?: UuidNullableFilter<"PatientConsent"> | string | null
    revocationReason?: StringNullableFilter<"PatientConsent"> | string | null
    revocationMethod?: StringNullableFilter<"PatientConsent"> | string | null
    metadata?: JsonNullableFilter<"PatientConsent">
    version?: IntFilter<"PatientConsent"> | number
    parentConsentId?: UuidNullableFilter<"PatientConsent"> | string | null
    linkedEntityType?: StringNullableFilter<"PatientConsent"> | string | null
    linkedEntityId?: UuidNullableFilter<"PatientConsent"> | string | null
    createdAt?: DateTimeFilter<"PatientConsent"> | Date | string
    updatedAt?: DateTimeFilter<"PatientConsent"> | Date | string
  }

  export type PatientCreateWithoutAppointmentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentCreateNestedManyWithoutPatientInput
    history?: PatientHistoryCreateNestedManyWithoutPatientInput
    consents?: PatientConsentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentUncheckedCreateNestedManyWithoutPatientInput
    history?: PatientHistoryUncheckedCreateNestedManyWithoutPatientInput
    consents?: PatientConsentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutAppointmentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
  }

  export type EncounterCreateWithoutAppointmentInput = {
    id?: string
    tenantId: string
    facilityId: string
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutEncountersInput
  }

  export type EncounterUncheckedCreateWithoutAppointmentInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCreateOrConnectWithoutAppointmentInput = {
    where: EncounterWhereUniqueInput
    create: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput>
  }

  export type EncounterCreateManyAppointmentInputEnvelope = {
    data: EncounterCreateManyAppointmentInput | EncounterCreateManyAppointmentInput[]
    skipDuplicates?: boolean
  }

  export type PatientUpsertWithoutAppointmentsInput = {
    update: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PatientCreateWithoutAppointmentsInput, PatientUncheckedCreateWithoutAppointmentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutAppointmentsInput, PatientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type EncounterUpsertWithWhereUniqueWithoutAppointmentInput = {
    where: EncounterWhereUniqueInput
    update: XOR<EncounterUpdateWithoutAppointmentInput, EncounterUncheckedUpdateWithoutAppointmentInput>
    create: XOR<EncounterCreateWithoutAppointmentInput, EncounterUncheckedCreateWithoutAppointmentInput>
  }

  export type EncounterUpdateWithWhereUniqueWithoutAppointmentInput = {
    where: EncounterWhereUniqueInput
    data: XOR<EncounterUpdateWithoutAppointmentInput, EncounterUncheckedUpdateWithoutAppointmentInput>
  }

  export type EncounterUpdateManyWithWhereWithoutAppointmentInput = {
    where: EncounterScalarWhereInput
    data: XOR<EncounterUpdateManyMutationInput, EncounterUncheckedUpdateManyWithoutAppointmentInput>
  }

  export type AppointmentCreateWithoutEncountersInput = {
    id?: string
    tenantId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    patient: PatientCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutEncountersInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentCreateOrConnectWithoutEncountersInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutEncountersInput, AppointmentUncheckedCreateWithoutEncountersInput>
  }

  export type PatientCreateWithoutEncountersInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentCreateNestedManyWithoutPatientInput
    history?: PatientHistoryCreateNestedManyWithoutPatientInput
    consents?: PatientConsentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutEncountersInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentUncheckedCreateNestedManyWithoutPatientInput
    history?: PatientHistoryUncheckedCreateNestedManyWithoutPatientInput
    consents?: PatientConsentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutEncountersInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
  }

  export type AppointmentUpsertWithoutEncountersInput = {
    update: XOR<AppointmentUpdateWithoutEncountersInput, AppointmentUncheckedUpdateWithoutEncountersInput>
    create: XOR<AppointmentCreateWithoutEncountersInput, AppointmentUncheckedCreateWithoutEncountersInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutEncountersInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutEncountersInput, AppointmentUncheckedUpdateWithoutEncountersInput>
  }

  export type AppointmentUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUpsertWithoutEncountersInput = {
    update: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
    create: XOR<PatientCreateWithoutEncountersInput, PatientUncheckedCreateWithoutEncountersInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutEncountersInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutEncountersInput, PatientUncheckedUpdateWithoutEncountersInput>
  }

  export type PatientUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutEncountersInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutDocumentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    history?: PatientHistoryCreateNestedManyWithoutPatientInput
    consents?: PatientConsentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutDocumentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    history?: PatientHistoryUncheckedCreateNestedManyWithoutPatientInput
    consents?: PatientConsentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutDocumentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
  }

  export type PatientUpsertWithoutDocumentsInput = {
    update: XOR<PatientUpdateWithoutDocumentsInput, PatientUncheckedUpdateWithoutDocumentsInput>
    create: XOR<PatientCreateWithoutDocumentsInput, PatientUncheckedCreateWithoutDocumentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutDocumentsInput, PatientUncheckedUpdateWithoutDocumentsInput>
  }

  export type PatientUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutHistoryInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentCreateNestedManyWithoutPatientInput
    consents?: PatientConsentCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutHistoryInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentUncheckedCreateNestedManyWithoutPatientInput
    consents?: PatientConsentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutHistoryInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutHistoryInput, PatientUncheckedCreateWithoutHistoryInput>
  }

  export type PatientUpsertWithoutHistoryInput = {
    update: XOR<PatientUpdateWithoutHistoryInput, PatientUncheckedUpdateWithoutHistoryInput>
    create: XOR<PatientCreateWithoutHistoryInput, PatientUncheckedCreateWithoutHistoryInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutHistoryInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutHistoryInput, PatientUncheckedUpdateWithoutHistoryInput>
  }

  export type PatientUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput
    consents?: PatientConsentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientCreateWithoutConsentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    encounters?: EncounterCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentCreateNestedManyWithoutPatientInput
    history?: PatientHistoryCreateNestedManyWithoutPatientInput
  }

  export type PatientUncheckedCreateWithoutConsentsInput = {
    id?: string
    mrn: string
    tenantId: string
    nationalId?: string | null
    nationalIdType?: string | null
    issuingCountry?: string | null
    firstName: string
    lastName: string
    middleName?: string | null
    dateOfBirth: Date | string
    gender: string
    maritalStatus?: string | null
    nationality?: string | null
    preferredLanguage?: string | null
    phoneNumber?: string | null
    email?: string | null
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
    bloodGroup?: string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy: string
    createdAtFacility: string
    registrationSource?: string
    registrationNotes?: string | null
    updatedBy?: string | null
    updatedAtFacility?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    encounters?: EncounterUncheckedCreateNestedManyWithoutPatientInput
    documents?: PatientDocumentUncheckedCreateNestedManyWithoutPatientInput
    history?: PatientHistoryUncheckedCreateNestedManyWithoutPatientInput
  }

  export type PatientCreateOrConnectWithoutConsentsInput = {
    where: PatientWhereUniqueInput
    create: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
  }

  export type PatientUpsertWithoutConsentsInput = {
    update: XOR<PatientUpdateWithoutConsentsInput, PatientUncheckedUpdateWithoutConsentsInput>
    create: XOR<PatientCreateWithoutConsentsInput, PatientUncheckedCreateWithoutConsentsInput>
    where?: PatientWhereInput
  }

  export type PatientUpdateToOneWithWhereWithoutConsentsInput = {
    where?: PatientWhereInput
    data: XOR<PatientUpdateWithoutConsentsInput, PatientUncheckedUpdateWithoutConsentsInput>
  }

  export type PatientUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUpdateManyWithoutPatientNestedInput
  }

  export type PatientUncheckedUpdateWithoutConsentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mrn?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    nationalId?: NullableStringFieldUpdateOperationsInput | string | null
    nationalIdType?: NullableStringFieldUpdateOperationsInput | string | null
    issuingCountry?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    middleName?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    maritalStatus?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLanguage?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine1?: NullableStringFieldUpdateOperationsInput | string | null
    addressLine2?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    postalCode?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    bloodGroup?: NullableStringFieldUpdateOperationsInput | string | null
    emergencyContact?: NullableJsonNullValueInput | InputJsonValue
    insuranceInfo?: NullableJsonNullValueInput | InputJsonValue
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAtFacility?: StringFieldUpdateOperationsInput | string
    registrationSource?: StringFieldUpdateOperationsInput | string
    registrationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    encounters?: EncounterUncheckedUpdateManyWithoutPatientNestedInput
    documents?: PatientDocumentUncheckedUpdateManyWithoutPatientNestedInput
    history?: PatientHistoryUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type AppointmentCreateManyPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    spaceId?: string | null
    staffId?: string | null
    appointmentType: string
    status?: string
    startTime: Date | string
    endTime: Date | string
    duration?: number
    notes?: string | null
    visitType?: string | null
    linkedEncounterId?: string | null
    seriesId?: string | null
    cancellationReason?: string | null
    rescheduleReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterCreateManyPatientInput = {
    id?: string
    tenantId: string
    facilityId: string
    appointmentId?: string | null
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientDocumentCreateManyPatientInput = {
    id?: string
    tenantId: string
    documentType: string
    documentNumber: string
    issuingCountry: string
    issuingAuthority?: string | null
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    isPrimaryIdentity?: boolean
    documentUrl?: string | null
    verificationStatus?: string
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    verificationNotes?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PatientHistoryCreateManyPatientInput = {
    id?: string
    tenantId: string
    fieldName: string
    oldValue?: string | null
    newValue?: string | null
    changeType: string
    changeReason?: string | null
    supportingDocUrl?: string | null
    changedBy: string
    approvedBy?: string | null
    changedAtFacility?: string | null
    changedAt?: Date | string
    patientConsent?: boolean
    consentDocUrl?: string | null
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type PatientConsentCreateManyPatientInput = {
    id?: string
    tenantId: string
    consentType: string
    consentCategory: string
    consentStatus: string
    consentScope?: string | null
    purpose: string
    description?: string | null
    legalBasis?: string | null
    effectiveFrom: Date | string
    effectiveUntil?: Date | string | null
    isActive?: boolean
    captureMethod: string
    capturedBy?: string | null
    capturedAt?: Date | string
    capturedAtFacility?: string | null
    signatureUrl?: string | null
    documentUrl?: string | null
    witnessedBy?: string | null
    witnessSignatureUrl?: string | null
    revokedAt?: Date | string | null
    revokedBy?: string | null
    revocationReason?: string | null
    revocationMethod?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: number
    parentConsentId?: string | null
    linkedEntityType?: string | null
    linkedEntityId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encounters?: EncounterUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    spaceId?: NullableStringFieldUpdateOperationsInput | string | null
    staffId?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentType?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    duration?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    visitType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEncounterId?: NullableStringFieldUpdateOperationsInput | string | null
    seriesId?: NullableStringFieldUpdateOperationsInput | string | null
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    rescheduleReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientDocumentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    documentType?: StringFieldUpdateOperationsInput | string
    documentNumber?: StringFieldUpdateOperationsInput | string
    issuingCountry?: StringFieldUpdateOperationsInput | string
    issuingAuthority?: NullableStringFieldUpdateOperationsInput | string | null
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isPrimaryIdentity?: BoolFieldUpdateOperationsInput | boolean
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    verificationStatus?: StringFieldUpdateOperationsInput | string
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientHistoryUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientHistoryUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientHistoryUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fieldName?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableStringFieldUpdateOperationsInput | string | null
    newValue?: NullableStringFieldUpdateOperationsInput | string | null
    changeType?: StringFieldUpdateOperationsInput | string
    changeReason?: NullableStringFieldUpdateOperationsInput | string | null
    supportingDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    changedBy?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    changedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    changedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientConsent?: BoolFieldUpdateOperationsInput | boolean
    consentDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PatientConsentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientConsentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientConsentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    consentType?: StringFieldUpdateOperationsInput | string
    consentCategory?: StringFieldUpdateOperationsInput | string
    consentStatus?: StringFieldUpdateOperationsInput | string
    consentScope?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    legalBasis?: NullableStringFieldUpdateOperationsInput | string | null
    effectiveFrom?: DateTimeFieldUpdateOperationsInput | Date | string
    effectiveUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    captureMethod?: StringFieldUpdateOperationsInput | string
    capturedBy?: NullableStringFieldUpdateOperationsInput | string | null
    capturedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    capturedAtFacility?: NullableStringFieldUpdateOperationsInput | string | null
    signatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    documentUrl?: NullableStringFieldUpdateOperationsInput | string | null
    witnessedBy?: NullableStringFieldUpdateOperationsInput | string | null
    witnessSignatureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    revokedBy?: NullableStringFieldUpdateOperationsInput | string | null
    revocationReason?: NullableStringFieldUpdateOperationsInput | string | null
    revocationMethod?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    version?: IntFieldUpdateOperationsInput | number
    parentConsentId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityType?: NullableStringFieldUpdateOperationsInput | string | null
    linkedEntityId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterCreateManyAppointmentInput = {
    id?: string
    tenantId: string
    patientId: string
    facilityId: string
    primaryStaffId: string
    encounterClass?: string
    status?: string
    priority?: string
    startTime: Date | string
    endTime?: Date | string | null
    encounterSource?: string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: string | null
    presentingSymptoms?: string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: string | null
    socialHistory?: string | null
    familyHistory?: string | null
    notes?: string | null
    dischargeDisposition?: string | null
    followUpInstructions?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EncounterUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: PatientUpdateOneRequiredWithoutEncountersNestedInput
  }

  export type EncounterUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EncounterUncheckedUpdateManyWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    facilityId?: StringFieldUpdateOperationsInput | string
    primaryStaffId?: StringFieldUpdateOperationsInput | string
    encounterClass?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    encounterSource?: StringFieldUpdateOperationsInput | string
    walkInDetails?: NullableJsonNullValueInput | InputJsonValue
    chiefComplaint?: NullableStringFieldUpdateOperationsInput | string | null
    presentingSymptoms?: NullableStringFieldUpdateOperationsInput | string | null
    vitalSigns?: NullableJsonNullValueInput | InputJsonValue
    allergies?: NullableJsonNullValueInput | InputJsonValue
    currentMedications?: NullableJsonNullValueInput | InputJsonValue
    medicalHistory?: NullableStringFieldUpdateOperationsInput | string | null
    socialHistory?: NullableStringFieldUpdateOperationsInput | string | null
    familyHistory?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    dischargeDisposition?: NullableStringFieldUpdateOperationsInput | string | null
    followUpInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PatientCountOutputTypeDefaultArgs instead
     */
    export type PatientCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppointmentCountOutputTypeDefaultArgs instead
     */
    export type AppointmentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppointmentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientDefaultArgs instead
     */
    export type PatientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppointmentDefaultArgs instead
     */
    export type AppointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppointmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EncounterDefaultArgs instead
     */
    export type EncounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EncounterDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientDocumentDefaultArgs instead
     */
    export type PatientDocumentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientDocumentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientHistoryDefaultArgs instead
     */
    export type PatientHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PatientConsentDefaultArgs instead
     */
    export type PatientConsentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PatientConsentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConsentTemplateDefaultArgs instead
     */
    export type ConsentTemplateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConsentTemplateDefaultArgs<ExtArgs>

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
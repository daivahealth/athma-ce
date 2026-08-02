/**
 * @zeal/validators
 *
 * Shared, framework-free validation primitives. Currently: offline validation
 * of national identity documents (format, length, checksum) used by the
 * clinical service's national-identity module.
 *
 * Offline validation proves a value is *well-formed*. Proving it is *real and
 * belongs to the patient* requires an online provider (e.g. ABHA/ABDM OTP) —
 * see backend/services/clinical/src/modules/national-identity.
 */

export * from './identity';

/**
 * Connector-local provider error. Serialized over the internal API as
 * {code, message, retryable}; the clinical thin client re-raises it as an
 * IdentityProviderError so nothing above the gateway seam changes.
 */
export class AbdmProviderError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = 'AbdmProviderError';
  }
}

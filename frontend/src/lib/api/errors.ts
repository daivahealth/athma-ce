/**
 * Helpers for reading messages off unknown thrown values.
 *
 * These are deliberately duck-typed rather than using axios's `isAxiosError`.
 * The expressions they replaced (`error?.response?.data?.message ?? fallback`)
 * were duck-typed too, and `isAxiosError` proved unreliable inside the Next
 * server runtime, where the bundled axios can be a different module instance
 * from the one imported here - it returned false for genuine axios errors and
 * silently produced the fallback text.
 */

function readApiMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const response = (error as { response?: unknown }).response;
  if (typeof response !== 'object' || response === null) return undefined;
  const data = (response as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) return undefined;
  const message = (data as { message?: unknown }).message;
  return typeof message === 'string' ? message : undefined;
}

/**
 * The API's own error message, else the caller's fallback.
 *
 * Mirrors `error?.response?.data?.message ?? fallback`: it deliberately does NOT
 * fall through to `error.message`, which would surface raw transport text
 * ("Request failed with status code 500") in place of the caller's wording.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return readApiMessage(error) ?? fallback;
}

/**
 * Like {@link getApiErrorMessage}, but falls through to the thrown Error's own
 * message first. Mirrors `error?.response?.data?.message || error.message || fallback`.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const apiMessage = readApiMessage(error);
  if (apiMessage) return apiMessage;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * HTTP status off an unknown thrown value, or undefined when there was no HTTP
 * response (network failure, cancellation, a non-axios throw).
 */
export function getApiErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  const response = (error as { response?: unknown }).response;
  if (typeof response !== 'object' || response === null) return undefined;
  const status = (response as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

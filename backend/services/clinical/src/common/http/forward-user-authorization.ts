import type { AxiosInstance } from 'axios';
import { RequestContextService } from '../context/request-context';

/**
 * Forward the signed-in user's bearer token on calls to another service.
 *
 * Foundation guards its routes with its own JWT and permission checks
 * (global JwtAuthGuard + PermissionsGuard), which the internal API key does not
 * satisfy. Calls that clinical makes while serving a user request (ward and bed
 * master data, staff lookups) must therefore carry that user's token, so
 * foundation authorises them exactly as if the user had called it.
 *
 * The token comes from the request context (RequestContextMiddleware). Outside
 * a request (jobs, startup) nothing is added. An Authorization header set on
 * the individual call wins.
 */
export function forwardUserAuthorization<T extends AxiosInstance>(client: T): T {
  client.interceptors.request.use((config) => {
    const authorization = RequestContextService.getField('authorization');
    if (authorization && !config.headers.has('Authorization')) {
      config.headers.set('Authorization', authorization);
    }
    return config;
  });
  return client;
}

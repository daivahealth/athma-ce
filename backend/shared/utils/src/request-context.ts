import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContextStore {
  tenantId?: string;
  userId?: string;
  userAgent?: string;
}

const storage = new AsyncLocalStorage<RequestContextStore>();

export class RequestContext {
  static run<T>(store: RequestContextStore, callback: () => T): T {
    return storage.run(store, callback);
  }

  static set(values: Partial<RequestContextStore>): void {
    const store = storage.getStore();
    if (!store) {
      return;
    }

    Object.assign(store, values);
  }

  static getStore(): RequestContextStore | undefined {
    return storage.getStore();
  }

  static getTenantId(): string | undefined {
    return storage.getStore()?.tenantId;
  }

  static getUserId(): string | undefined {
    return storage.getStore()?.userId;
  }

  static getUserAgent(): string | undefined {
    return storage.getStore()?.userAgent;
  }
}

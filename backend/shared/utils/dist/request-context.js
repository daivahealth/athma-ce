import { AsyncLocalStorage } from 'async_hooks';
const storage = new AsyncLocalStorage();
export class RequestContext {
    static run(store, callback) {
        return storage.run(store, callback);
    }
    static set(values) {
        const store = storage.getStore();
        if (!store) {
            return;
        }
        Object.assign(store, values);
    }
    static getStore() {
        return storage.getStore();
    }
    static getTenantId() {
        return storage.getStore()?.tenantId;
    }
    static getUserId() {
        return storage.getStore()?.userId;
    }
    static getUserAgent() {
        return storage.getStore()?.userAgent;
    }
}
//# sourceMappingURL=request-context.js.map
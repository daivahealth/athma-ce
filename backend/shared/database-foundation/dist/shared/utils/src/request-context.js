"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
const storage = new async_hooks_1.AsyncLocalStorage();
class RequestContext {
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
exports.RequestContext = RequestContext;
//# sourceMappingURL=request-context.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContextHeaders = exports.RequestContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const request_context_js_1 = require("./request-context.js");
const TENANT_HEADER = 'x-tenant-id';
const USER_HEADER = 'x-user-id';
const toHeaderValue = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
};
let RequestContextMiddleware = class RequestContextMiddleware {
    use(req, _res, next) {
        const userAgentHeader = req.headers['user-agent'];
        const userAgent = Array.isArray(userAgentHeader)
            ? userAgentHeader.join(',')
            : userAgentHeader ?? '';
        const tenantId = toHeaderValue(req.headers[TENANT_HEADER]);
        const userId = toHeaderValue(req.headers[USER_HEADER]);
        const store = { userAgent };
        const normalizedTenant = tenantId?.trim();
        if (normalizedTenant) {
            store.tenantId = normalizedTenant;
        }
        const normalizedUser = userId?.trim();
        if (normalizedUser) {
            store.userId = normalizedUser;
        }
        request_context_js_1.RequestContext.run(store, () => next());
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestContextMiddleware);
exports.requestContextHeaders = {
    tenantId: TENANT_HEADER,
    userId: USER_HEADER,
};
//# sourceMappingURL=request-context.middleware.js.map
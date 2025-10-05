"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextInterceptor = void 0;
const common_1 = require("@nestjs/common");
const request_context_js_1 = require("./request-context.js");
const getClaimUserId = (claims) => {
    if (!claims) {
        return undefined;
    }
    return claims.userId ?? claims.sub;
};
let RequestContextInterceptor = class RequestContextInterceptor {
    intercept(context, next) {
        if (context.getType() === 'http') {
            const store = request_context_js_1.RequestContext.getStore();
            if (store) {
                const req = context.switchToHttp().getRequest();
                const claims = req.user;
                if (claims) {
                    const tenantId = claims.tenantId?.trim();
                    const userId = getClaimUserId(claims)?.trim();
                    const updates = {};
                    if (tenantId) {
                        updates.tenantId = tenantId;
                    }
                    if (userId) {
                        updates.userId = userId;
                    }
                    if (Object.keys(updates).length > 0) {
                        request_context_js_1.RequestContext.set(updates);
                    }
                }
            }
        }
        return next.handle();
    }
};
exports.RequestContextInterceptor = RequestContextInterceptor;
exports.RequestContextInterceptor = RequestContextInterceptor = __decorate([
    (0, common_1.Injectable)()
], RequestContextInterceptor);
//# sourceMappingURL=request-context.interceptor.js.map
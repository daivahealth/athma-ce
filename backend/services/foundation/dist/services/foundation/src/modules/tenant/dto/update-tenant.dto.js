"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTenantDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tenant_dto_1 = require("./create-tenant.dto");
class UpdateTenantDto extends (0, mapped_types_1.PartialType)(create_tenant_dto_1.CreateTenantDto) {
}
exports.UpdateTenantDto = UpdateTenantDto;
//# sourceMappingURL=update-tenant.dto.js.map
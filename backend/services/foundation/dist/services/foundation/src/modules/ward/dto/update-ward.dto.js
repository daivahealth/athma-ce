"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWardDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_ward_dto_1 = require("./create-ward.dto");
class UpdateWardDto extends (0, mapped_types_1.PartialType)(create_ward_dto_1.CreateWardDto) {
}
exports.UpdateWardDto = UpdateWardDto;
//# sourceMappingURL=update-ward.dto.js.map
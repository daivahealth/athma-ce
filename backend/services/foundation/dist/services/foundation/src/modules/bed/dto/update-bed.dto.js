"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBedDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_bed_dto_1 = require("./create-bed.dto");
class UpdateBedDto extends (0, mapped_types_1.PartialType)(create_bed_dto_1.CreateBedDto) {
}
exports.UpdateBedDto = UpdateBedDto;
//# sourceMappingURL=update-bed.dto.js.map
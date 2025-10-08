"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFacilityModule = void 0;
const common_1 = require("@nestjs/common");
const user_facility_controller_1 = require("./user-facility.controller");
const user_facility_service_1 = require("./user-facility.service");
const user_facility_repository_1 = require("./user-facility.repository");
const shared_database_1 = require("@zeal/shared-database");
let UserFacilityModule = class UserFacilityModule {
};
exports.UserFacilityModule = UserFacilityModule;
exports.UserFacilityModule = UserFacilityModule = __decorate([
    (0, common_1.Module)({
        imports: [shared_database_1.DatabaseModule],
        controllers: [user_facility_controller_1.UserFacilityController, user_facility_controller_1.FacilityUsersController],
        providers: [user_facility_service_1.UserFacilityService, user_facility_repository_1.UserFacilityRepository],
        exports: [user_facility_service_1.UserFacilityService, user_facility_repository_1.UserFacilityRepository],
    })
], UserFacilityModule);
//# sourceMappingURL=user-facility.module.js.map
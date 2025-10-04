var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffRepository } from './staff.repository';
import { DatabaseModule } from '@zeal/shared-database';
let StaffModule = class StaffModule {
};
StaffModule = __decorate([
    Module({
        imports: [DatabaseModule],
        controllers: [StaffController],
        providers: [StaffService, StaffRepository],
        exports: [StaffService, StaffRepository],
    })
], StaffModule);
export { StaffModule };
//# sourceMappingURL=staff.module.js.map
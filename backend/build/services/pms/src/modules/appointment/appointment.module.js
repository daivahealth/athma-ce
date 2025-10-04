var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from './appointment.repository';
import { DatabaseModule } from '@zeal/shared-database';
let AppointmentModule = class AppointmentModule {
};
AppointmentModule = __decorate([
    Module({
        imports: [DatabaseModule],
        controllers: [AppointmentController],
        providers: [AppointmentService, AppointmentRepository],
        exports: [AppointmentService, AppointmentRepository],
    })
], AppointmentModule);
export { AppointmentModule };
//# sourceMappingURL=appointment.module.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { EncounterController } from './encounter.controller';
import { EncounterService } from './encounter.service';
import { EncounterRepository } from './encounter.repository';
import { DatabaseModule } from '@zeal/shared-database';
let EncounterModule = class EncounterModule {
};
EncounterModule = __decorate([
    Module({
        imports: [DatabaseModule],
        controllers: [EncounterController],
        providers: [EncounterService, EncounterRepository],
        exports: [EncounterService, EncounterRepository],
    })
], EncounterModule);
export { EncounterModule };
//# sourceMappingURL=encounter.module.js.map
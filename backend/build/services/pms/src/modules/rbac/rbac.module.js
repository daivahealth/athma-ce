var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { DatabaseModule } from '@zeal/shared-database';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
let RbacModule = class RbacModule {
};
RbacModule = __decorate([
    Module({
        imports: [
            DatabaseModule,
            JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRY || '1h',
                },
            }),
        ],
        controllers: [RbacController],
        providers: [RbacService, JwtAuthGuard, PermissionsGuard],
        exports: [RbacService],
    })
], RbacModule);
export { RbacModule };
//# sourceMappingURL=rbac.module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InpatientEventType = exports.InpatientAcuity = exports.InpatientDischargeStatus = exports.InpatientAdmissionStatus = exports.ClinicalDatabaseModule = exports.PrismaService = exports.prisma = exports.ZealPrismaClient = exports.PrismaClient = void 0;
var generated_1 = require("../generated");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return generated_1.PrismaClient; } });
var client_1 = require("./client");
Object.defineProperty(exports, "ZealPrismaClient", { enumerable: true, get: function () { return client_1.ZealPrismaClient; } });
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
var prisma_service_1 = require("./prisma.service");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_1.PrismaService; } });
var database_module_1 = require("./database.module");
Object.defineProperty(exports, "ClinicalDatabaseModule", { enumerable: true, get: function () { return database_module_1.ClinicalDatabaseModule; } });
// Export Inpatient enums
var generated_2 = require("../generated");
Object.defineProperty(exports, "InpatientAdmissionStatus", { enumerable: true, get: function () { return generated_2.InpatientAdmissionStatus; } });
Object.defineProperty(exports, "InpatientDischargeStatus", { enumerable: true, get: function () { return generated_2.InpatientDischargeStatus; } });
Object.defineProperty(exports, "InpatientAcuity", { enumerable: true, get: function () { return generated_2.InpatientAcuity; } });
Object.defineProperty(exports, "InpatientEventType", { enumerable: true, get: function () { return generated_2.InpatientEventType; } });
//# sourceMappingURL=index.js.map
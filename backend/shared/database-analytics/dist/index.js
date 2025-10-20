"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDatabaseModule = exports.PrismaService = exports.prisma = exports.ZealPrismaClient = exports.PrismaClient = void 0;
var generated_1 = require("../generated");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return generated_1.PrismaClient; } });
var client_1 = require("./client");
Object.defineProperty(exports, "ZealPrismaClient", { enumerable: true, get: function () { return client_1.ZealPrismaClient; } });
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return client_1.prisma; } });
var prisma_service_1 = require("./prisma.service");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_1.PrismaService; } });
var database_module_1 = require("./database.module");
Object.defineProperty(exports, "AnalyticsDatabaseModule", { enumerable: true, get: function () { return database_module_1.AnalyticsDatabaseModule; } });
//# sourceMappingURL=index.js.map
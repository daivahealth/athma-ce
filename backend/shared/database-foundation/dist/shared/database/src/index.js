"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.PrismaService = exports.PrismaClient = void 0;
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
var prisma_service_js_1 = require("./prisma.service.js");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_js_1.PrismaService; } });
var database_module_js_1 = require("./database.module.js");
Object.defineProperty(exports, "DatabaseModule", { enumerable: true, get: function () { return database_module_js_1.DatabaseModule; } });
//# sourceMappingURL=index.js.map
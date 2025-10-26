"use strict";
/**
 * Zeal Configuration Client
 * Hierarchical configuration management with caching
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_DEFAULTS = exports.getDefaultValue = exports.createConfigClient = exports.ConfigClient = void 0;
var config_client_1 = require("./config-client");
Object.defineProperty(exports, "ConfigClient", { enumerable: true, get: function () { return config_client_1.ConfigClient; } });
Object.defineProperty(exports, "createConfigClient", { enumerable: true, get: function () { return config_client_1.createConfigClient; } });
var defaults_1 = require("./defaults");
Object.defineProperty(exports, "getDefaultValue", { enumerable: true, get: function () { return defaults_1.getDefaultValue; } });
Object.defineProperty(exports, "CONFIG_DEFAULTS", { enumerable: true, get: function () { return defaults_1.CONFIG_DEFAULTS; } });

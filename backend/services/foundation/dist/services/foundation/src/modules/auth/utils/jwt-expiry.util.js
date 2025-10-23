"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RESET_TOKEN_EXPIRY = exports.DEFAULT_REFRESH_TOKEN_EXPIRY = exports.DEFAULT_ACCESS_TOKEN_EXPIRY = exports.resolveExpiresIn = void 0;
const MS_VALUE_REGEX = /^\d+(?:\.\d+)?\s*(?:years?|year|yrs?|yr|y|weeks?|week|w|days?|day|d|hours?|hour|hrs?|hr|h|minutes?|minute|mins?|min|m|seconds?|second|secs?|sec|s|milliseconds?|millisecond|msecs?|msec|ms)?$/i;
const isMsStringValue = (value) => MS_VALUE_REGEX.test(value);
const resolveExpiresIn = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    if (/^\d+$/u.test(value)) {
        return Number(value);
    }
    if (isMsStringValue(value)) {
        return value;
    }
    return fallback;
};
exports.resolveExpiresIn = resolveExpiresIn;
exports.DEFAULT_ACCESS_TOKEN_EXPIRY = '3600s';
exports.DEFAULT_REFRESH_TOKEN_EXPIRY = '7d';
exports.DEFAULT_RESET_TOKEN_EXPIRY = '1h';
//# sourceMappingURL=jwt-expiry.util.js.map
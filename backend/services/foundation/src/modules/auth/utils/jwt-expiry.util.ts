import type { JwtSignOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

export type ExpiresInValue = NonNullable<JwtSignOptions['expiresIn']>;

const MS_VALUE_REGEX = /^\d+(?:\.\d+)?\s*(?:years?|year|yrs?|yr|y|weeks?|week|w|days?|day|d|hours?|hour|hrs?|hr|h|minutes?|minute|mins?|min|m|seconds?|second|secs?|sec|s|milliseconds?|millisecond|msecs?|msec|ms)?$/i;

const isMsStringValue = (value: string): value is StringValue => MS_VALUE_REGEX.test(value);

export const resolveExpiresIn = (value: string | undefined, fallback: ExpiresInValue): ExpiresInValue => {
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

export const DEFAULT_ACCESS_TOKEN_EXPIRY: ExpiresInValue = '3600s';
export const DEFAULT_REFRESH_TOKEN_EXPIRY: ExpiresInValue = '7d';
export const DEFAULT_RESET_TOKEN_EXPIRY: ExpiresInValue = '1h';

// Per-route rate limits. Keys are per client IP and per route, and override
// the global default (60 requests per minute) set in AppModule.
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export const LOGIN_THROTTLE = { default: { ttl: MINUTE, limit: 5 } };
export const SIGNUP_THROTTLE = { default: { ttl: HOUR, limit: 5 } };
export const SEND_EMAIL_THROTTLE = { default: { ttl: HOUR, limit: 5 } };
export const WRITE_THROTTLE = { default: { ttl: MINUTE, limit: 20 } };

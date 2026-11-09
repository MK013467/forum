import { randomInt } from 'crypto';

// 6-digit code from a cryptographically secure source, zero-padded.
export function generateOTP(length = 6): string {
  return randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
}

import { randomInt } from 'crypto';
import { generateOTP } from './otp';

jest.mock('crypto', () => ({
  ...jest.requireActual<typeof import('crypto')>('crypto'),
  randomInt: jest.fn(),
}));

describe('generateOTP', () => {
  const mockRandomInt = randomInt as unknown as jest.Mock;

  it('Uses crypto.randomInt over the full 6-digit range', () => {
    mockRandomInt.mockReturnValue(123456);

    expect(generateOTP()).toBe('123456');
    expect(mockRandomInt).toHaveBeenCalledWith(0, 1_000_000);
  });

  it('zero-pads small numbers', () => {
    mockRandomInt.mockReturnValue(42);

    expect(generateOTP()).toBe('000042');
  });
});

import { InvalidateTokenRegistrationMiddleware } from './invalidate-token-registration.middleware';

describe('InvalidateTokenRegistrationMiddleware', () => {
  it('should be defined', () => {
    expect(new InvalidateTokenRegistrationMiddleware()).toBeDefined();
  });
});

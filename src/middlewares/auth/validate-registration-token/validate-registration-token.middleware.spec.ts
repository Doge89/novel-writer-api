import { ValidateRegistrationTokenMiddleware } from './validate-registration-token.middleware';

describe('ValidateRegistrationTokenMiddleware', () => {
  it('should be defined', () => {
    expect(new ValidateRegistrationTokenMiddleware()).toBeDefined();
  });
});

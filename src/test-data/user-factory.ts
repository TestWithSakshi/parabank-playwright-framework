import { faker } from '@faker-js/faker';
import { env } from '../config/env.config';
import { RegistrationDetails } from '../types/user.types';
import { buildUsername } from '../utils/username.helper';

export function buildRegistration(overrides: Partial<RegistrationDetails> = {}): RegistrationDetails {
  const password = overrides.password ?? env.defaultPassword;
  const firstName = overrides.firstName ?? faker.person.firstName();
  const lastName = overrides.lastName ?? faker.person.lastName();
  const base: RegistrationDetails = {
    firstName,
    lastName,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode('#####'),
    },
    phoneNumber: faker.string.numeric(10),
    ssn: `${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(4)}`,
    // Firstname_Lastname_xxxx — readable + globally unique on the shared instance.
    username: buildUsername(firstName, lastName),
    password,
    confirmPassword: password,
  };
  return {
    ...base,
    ...overrides,
    address: { ...base.address, ...(overrides.address ?? {}) },
  };
}

import { defaultTestUser } from "../fixtures/users.fixture.js";

export const defaultTestAuthenticatedUserLookup = {
  findByEmail: () =>
    Promise.resolve({
      id: defaultTestUser.id,
      passwordHash: defaultTestUser.passwordHash,
      status: defaultTestUser.status,
    }),
  findById: () =>
    Promise.resolve({
      email: defaultTestUser.email,
      id: defaultTestUser.id,
      status: defaultTestUser.status,
    }),
};

import type { UserEmail, UserId, UserStatus } from "../../users/domain/users.types.js";

export type AuthenticatedUserLookup = {
  findById: (id: UserId) => Promise<{ status: UserStatus } | null>;
  findByEmail: (
    email: UserEmail,
  ) => Promise<{ id: UserId; passwordHash: string; status: UserStatus } | null>;
};

export type PasswordVerifier = (input: {
  password: string;
  passwordHash: string;
}) => Promise<boolean>;

import type { UserId, UserStatus } from "../users/users.types.js";

export type AuthenticatedUserLookup = {
  findById: (id: UserId) => Promise<{ status: UserStatus } | null>;
};

export type VerifyAuthenticatedUserQuery = {
  userId: UserId;
};

export type VerifyAuthenticatedUserResult =
  | {
      status: "verified";
    }
  | {
      status: "invalid";
    };

export class AuthService {
  constructor(private readonly authenticatedUserLookup: AuthenticatedUserLookup) {}

  async verifyAuthenticatedUser(
    query: VerifyAuthenticatedUserQuery,
  ): Promise<VerifyAuthenticatedUserResult> {
    const user = await this.authenticatedUserLookup.findById(query.userId);

    if (user === null || user.status !== "active") {
      return {
        status: "invalid",
      };
    }

    return {
      status: "verified",
    };
  }
}

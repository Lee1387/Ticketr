import { fallbackPasswordHash, verifyPassword } from "./passwordHasher.js";
import type { UserEmail, UserId, UserStatus } from "../users/users.types.js";

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

export type LoginCommand = {
  email: UserEmail;
  password: string;
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

export type LoginResult =
  | {
      status: "authenticated";
      userId: UserId;
    }
  | {
      status: "invalid-credentials";
    };

export class AuthService {
  constructor(
    private readonly authenticatedUserLookup: AuthenticatedUserLookup,
    private readonly passwordVerifier: PasswordVerifier = verifyPassword,
  ) {}

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

  async login(command: LoginCommand): Promise<LoginResult> {
    const user = await this.authenticatedUserLookup.findByEmail(command.email);
    const passwordHash = user?.passwordHash ?? fallbackPasswordHash;
    const passwordMatches = await this.passwordVerifier({
      password: command.password,
      passwordHash,
    });

    if (user === null || user.status !== "active" || !passwordMatches) {
      return {
        status: "invalid-credentials",
      };
    }

    return {
      status: "authenticated",
      userId: user.id,
    };
  }
}

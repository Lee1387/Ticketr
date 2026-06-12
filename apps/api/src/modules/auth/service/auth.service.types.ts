import type { UserEmail, UserId } from "../../users/domain/users.types.js";

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

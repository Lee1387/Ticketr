import { login } from "./login.service.js";
import { verifyPassword } from "./passwordHasher.js";
import type { AuthenticatedUserLookup, PasswordVerifier } from "./auth.service.ports.js";
import type {
  LoginCommand,
  LoginResult,
  VerifyAuthenticatedUserQuery,
  VerifyAuthenticatedUserResult,
} from "./auth.service.types.js";
import { verifyAuthenticatedUser } from "./verifyAuthenticatedUser.service.js";

export class AuthService {
  constructor(
    private readonly authenticatedUserLookup: AuthenticatedUserLookup,
    private readonly passwordVerifier: PasswordVerifier = verifyPassword,
  ) {}

  async verifyAuthenticatedUser(
    query: VerifyAuthenticatedUserQuery,
  ): Promise<VerifyAuthenticatedUserResult> {
    return verifyAuthenticatedUser(query, {
      authenticatedUserLookup: this.authenticatedUserLookup,
    });
  }

  async login(command: LoginCommand): Promise<LoginResult> {
    return login(command, {
      authenticatedUserLookup: this.authenticatedUserLookup,
      passwordVerifier: this.passwordVerifier,
    });
  }
}

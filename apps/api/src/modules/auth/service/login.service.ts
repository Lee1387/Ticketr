import { fallbackPasswordHash } from "./passwordHasher.js";
import type { AuthenticatedUserLookup, PasswordVerifier } from "./auth.service.ports.js";
import type { LoginCommand, LoginResult } from "./auth.service.types.js";

type LoginDependencies = {
  authenticatedUserLookup: AuthenticatedUserLookup;
  passwordVerifier: PasswordVerifier;
};

export async function login(
  command: LoginCommand,
  dependencies: LoginDependencies,
): Promise<LoginResult> {
  const user = await dependencies.authenticatedUserLookup.findByEmail(command.email);
  const passwordHash = user?.passwordHash ?? fallbackPasswordHash;
  const passwordMatches = await dependencies.passwordVerifier({
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

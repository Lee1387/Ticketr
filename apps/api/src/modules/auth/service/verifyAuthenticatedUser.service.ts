import type { AuthenticatedUserLookup } from "./auth.service.ports.js";
import type {
  VerifyAuthenticatedUserQuery,
  VerifyAuthenticatedUserResult,
} from "./auth.service.types.js";

type VerifyAuthenticatedUserDependencies = {
  authenticatedUserLookup: AuthenticatedUserLookup;
};

export async function verifyAuthenticatedUser(
  query: VerifyAuthenticatedUserQuery,
  dependencies: VerifyAuthenticatedUserDependencies,
): Promise<VerifyAuthenticatedUserResult> {
  const user = await dependencies.authenticatedUserLookup.findById(query.userId);

  if (user === null || user.status !== "active") {
    return {
      status: "invalid",
    };
  }

  return {
    status: "verified",
  };
}

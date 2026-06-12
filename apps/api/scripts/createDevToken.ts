import { createDevelopmentToken } from "./helpers/auth/devAuth.js";

const tokenResponse = await createDevelopmentToken();
process.stdout.write(`Authorization: ${tokenResponse.tokenType} ${tokenResponse.accessToken}\n`);

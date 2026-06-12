import { createDevelopmentToken } from "./helpers/devAuth.js";

const tokenResponse = await createDevelopmentToken();
process.stdout.write(`Authorization: ${tokenResponse.tokenType} ${tokenResponse.accessToken}\n`);

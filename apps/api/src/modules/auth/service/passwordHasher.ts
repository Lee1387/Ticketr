import { hash, type Options, verify } from "@node-rs/argon2";

const passwordHashOptions = {
  memoryCost: 19_456,
  parallelism: 1,
  timeCost: 2,
} satisfies Options;

export const fallbackPasswordHash =
  "$argon2id$v=19$m=19456,t=2,p=1$PqLAEPHKXubb2Bhx4VhokA$lW5C2w09mk+PnS0mDdS7tZlcZae9Rb7EiqwqrqYnlbQ";

export function hashPassword(password: string): Promise<string> {
  return hash(password, passwordHashOptions);
}

export function verifyPassword(input: {
  password: string;
  passwordHash: string;
}): Promise<boolean> {
  return verify(input.passwordHash, input.password, passwordHashOptions);
}

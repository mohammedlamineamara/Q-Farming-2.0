import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  if (
    !password ||
    typeof password !== "string" ||
    password.trim().length === 0
  ) {
    throw new Error("Password must be a non-empty string for hashing");
  }
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string | null | undefined,
  hash: string | null | undefined,
): Promise<boolean> {
  if (
    !password ||
    typeof password !== "string" ||
    password.trim().length === 0 ||
    !hash ||
    typeof hash !== "string" ||
    hash.trim().length === 0
  ) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

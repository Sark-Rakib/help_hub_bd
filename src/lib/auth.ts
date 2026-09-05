import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { Role } from "@/types";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "help_hub_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface TokenPayload {
  userId: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    return null;
  }
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Returns the authenticated user document (without password)
 * or null if not authenticated / token invalid / user blocked.
 */
export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await User.findById(payload.userId).lean();
    if (!user || user.blocked) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Server-side role guard. Returns null if authorized,
 * otherwise returns a reason string.
 */
export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) return { authorized: false as const, reason: "unauthenticated" };
  if (!roles.includes(user.role as Role))
    return { authorized: false as const, reason: "forbidden" };
  return { authorized: true as const, user };
}

export async function requireUser() {
  return requireRole(["user", "provider", "admin"]);
}

export async function requireProvider() {
  return requireRole(["provider", "admin"]);
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export function toSafeUser(user: Record<string, unknown>) {
  const safe = { ...user };
  delete safe.password;
  return safe;
}

export { COOKIE_NAME };
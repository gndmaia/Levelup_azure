// Auth utilities and session management

import { User } from "@/types";
import { dataStore } from "./data-store";

// Simple session token storage (in production, use JWT or proper session management)
const sessions = new Map<string, string>(); // token -> userId

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function createSession(userId: string): string {
  const token = generateToken();
  sessions.set(token, userId);
  return token;
}

export function getSessionUser(token: string | null): User | null {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  return dataStore.getUserById(userId) || null;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function sanitizeUser(user: User): Omit<User, "passwordHash"> {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}

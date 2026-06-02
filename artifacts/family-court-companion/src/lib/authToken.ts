const TOKEN_KEY = "fcc:auth_token";
const USER_ID_KEY = "fcc:user_id";

export const authToken = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  set(token: string, userId: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  },

  authHeaders(): Record<string, string> {
    const token = authToken.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export async function loginAndStoreToken(email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const data = (await res.json()) as { token: string; userId: string };
  authToken.set(data.token, data.userId);
}

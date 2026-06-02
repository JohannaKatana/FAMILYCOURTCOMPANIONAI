/**
 * cryptoService — AES-256-GCM encryption for localStorage data.
 *
 * A random 256-bit key is generated once per installation and stored in
 * sessionStorage. It is never written to localStorage, so encrypted blobs
 * in localStorage are unreadable without the key in the active session.
 *
 * Usage:
 *   await cryptoService.init();        // call once at app start / login
 *   const cipher = await cryptoService.encrypt("hello");
 *   const plain  = await cryptoService.decrypt(cipher);
 */

const SESSION_KEY_NAME = "fcc:enc_key";

let cachedKey: CryptoKey | null = null;

async function importRawKey(rawBase64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(rawBase64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, [
    "encrypt",
    "decrypt",
  ]);
}

async function generateAndStoreKey(): Promise<CryptoKey> {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  sessionStorage.setItem(SESSION_KEY_NAME, b64);
  return key;
}

export const cryptoService = {
  /** Load or generate the session encryption key. Must be called before encrypt/decrypt. */
  async init(): Promise<void> {
    if (cachedKey) return;
    const stored = sessionStorage.getItem(SESSION_KEY_NAME);
    cachedKey = stored ? await importRawKey(stored) : await generateAndStoreKey();
  },

  /** Returns true if the key is ready in memory. */
  isReady(): boolean {
    return cachedKey !== null;
  },

  /** Encrypt a plaintext string; returns a base64-encoded "iv:ciphertext" blob. */
  async encrypt(plaintext: string): Promise<string> {
    if (!cachedKey) await cryptoService.init();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const cipherBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cachedKey!,
      encoded,
    );
    const ivB64 = btoa(String.fromCharCode(...iv));
    const ctB64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuf)));
    return `${ivB64}:${ctB64}`;
  },

  /** Decrypt a blob produced by encrypt(). Returns null if decryption fails. */
  async decrypt(blob: string): Promise<string | null> {
    if (!cachedKey) await cryptoService.init();
    try {
      const [ivB64, ctB64] = blob.split(":");
      if (!ivB64 || !ctB64) return null;
      const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
      const ct = Uint8Array.from(atob(ctB64), (c) => c.charCodeAt(0));
      const plainBuf = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cachedKey!,
        ct,
      );
      return new TextDecoder().decode(plainBuf);
    } catch {
      return null;
    }
  },

  /** Wipe the in-memory key and the sessionStorage copy (call on sign-out). */
  clear(): void {
    cachedKey = null;
    sessionStorage.removeItem(SESSION_KEY_NAME);
  },
};

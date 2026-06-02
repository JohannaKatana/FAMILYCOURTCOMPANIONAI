/**
 * Family Court Companion AI — Data Service
 *
 * Persistence layer backed by localStorage with AES-256-GCM encryption via
 * the Web Crypto API. All writes are encrypted; all reads are decrypted. The
 * encryption key lives only in sessionStorage and memory — it is never
 * written to localStorage — so stored blobs are unreadable without an active
 * authenticated session.
 *
 * Security model:
 *  - Data is encrypted with AES-256-GCM before being written to localStorage.
 *  - The encryption key is stored in sessionStorage (cleared on tab close).
 *  - Any JavaScript on a different origin cannot read localStorage.
 *  - Migrating to server-side storage behind the authenticated API is the next
 *    step — these methods are designed to be swapped for API fetch calls.
 */

import type { EvidenceEntry } from "@/data/mockData";
import { cryptoService } from "./cryptoService";

const NS = "fcc:v2";

function key(segment: string) {
  return `${NS}:${segment}`;
}

async function load<T>(segment: string, fallback: T): Promise<T> {
  try {
    const raw = localStorage.getItem(key(segment));
    if (!raw) return fallback;
    const decrypted = await cryptoService.decrypt(raw);
    if (!decrypted) return fallback;
    return JSON.parse(decrypted) as T;
  } catch {
    return fallback;
  }
}

async function store<T>(segment: string, value: T): Promise<void> {
  try {
    const plaintext = JSON.stringify(value);
    const encrypted = await cryptoService.encrypt(plaintext);
    localStorage.setItem(key(segment), encrypted);
  } catch {
    console.warn("[FCC] localStorage write failed — storage may be full or key unavailable.");
  }
}

// ── Evidence ──────────────────────────────────────────────────────────────────

export const evidenceService = {
  async getAll(): Promise<EvidenceEntry[]> {
    return load<EvidenceEntry[]>("evidence", []);
  },

  async save(entries: EvidenceEntry[]): Promise<void> {
    return store("evidence", entries);
  },

  async add(entry: EvidenceEntry): Promise<void> {
    const all = await evidenceService.getAll();
    return evidenceService.save([...all, entry]);
  },

  async update(id: string, patch: Partial<EvidenceEntry>): Promise<void> {
    const all = await evidenceService.getAll();
    return evidenceService.save(all.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  },

  async remove(id: string): Promise<void> {
    const all = await evidenceService.getAll();
    return evidenceService.save(all.filter((e) => e.id !== id));
  },
};

// ── Communication scans ───────────────────────────────────────────────────────

export type StoredScan = {
  id: string;
  date: string;
  summary: string;
  preview: string;
  results: Array<{ date: string; category: string; quote: string; relevance: string }>;
};

export const scanService = {
  async getAll(): Promise<StoredScan[]> {
    return load<StoredScan[]>("scans", []);
  },

  async save(scans: StoredScan[]): Promise<void> {
    return store("scans", scans);
  },

  async add(scan: StoredScan): Promise<void> {
    const all = await scanService.getAll();
    return scanService.save([scan, ...all]);
  },

  async remove(id: string): Promise<void> {
    const all = await scanService.getAll();
    return scanService.save(all.filter((s) => s.id !== id));
  },
};

// ── Case preferences ─────────────────────────────────────────────────────────

export type CasePrefs = {
  nickname: string;
  state: string;
  county: string;
  hearingDate: string;
  userName: string;
  otherPartyName: string;
};

const DEFAULT_PREFS: CasePrefs = {
  nickname: "Martinez v. Thompson",
  state: "FL",
  county: "Hillsborough County",
  hearingDate: "2026-08-14",
  userName: "Maria Martinez",
  otherPartyName: "David Thompson",
};

export const casePrefsService = {
  async get(): Promise<CasePrefs> {
    return load<CasePrefs>("case_prefs", DEFAULT_PREFS);
  },
  async set(prefs: Partial<CasePrefs>): Promise<void> {
    const current = await casePrefsService.get();
    return store("case_prefs", { ...current, ...prefs });
  },
};

// ── Data management ───────────────────────────────────────────────────────────

export const dataManagement = {
  /** Export all stored data as a JSON blob for download. */
  async exportAll(): Promise<string> {
    const [evidence, scans, casePrefs] = await Promise.all([
      evidenceService.getAll(),
      scanService.getAll(),
      casePrefsService.get(),
    ]);
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: "2",
        evidence,
        scans,
        casePrefs,
      },
      null,
      2,
    );
  },

  /** Permanently wipe all local data. */
  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(NS) || k?.startsWith("caseclear:v1")) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },

  /** Approximate storage used in bytes. */
  storageUsedBytes(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(NS) || k?.startsWith("caseclear:v1"))
        total += (localStorage.getItem(k) ?? "").length * 2;
    }
    return total;
  },
};

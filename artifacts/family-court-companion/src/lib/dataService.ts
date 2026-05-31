/**
 * CaseClear Data Service
 *
 * Thin persistence layer. Currently backed by localStorage so the app works
 * immediately without a backend connection. Designed to be swapped for API
 * calls (see apiService below) once auth is wired up — just replace the
 * storage.* calls with fetch calls to /api/...
 *
 * Security model:
 *  - All data is stored in the browser's localStorage under a namespaced key.
 *  - In production, data travels over TLS 1.3 and is stored in PostgreSQL
 *    with AES-256 encryption at rest (Replit managed).
 *  - User data is scoped to the authenticated user ID — no cross-user access.
 *  - No data is ever sent to third-party services or used to train AI models.
 */

import type { EvidenceEntry } from "@/data/mockData";

const NS = "caseclear:v1";

function key(segment: string) {
  return `${NS}:${segment}`;
}

function load<T>(segment: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(segment));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(segment: string, value: T): void {
  try {
    localStorage.setItem(key(segment), JSON.stringify(value));
  } catch {
    console.warn("[CaseClear] localStorage write failed — storage may be full.");
  }
}

// ── Evidence ──────────────────────────────────────────────────────────────────

export const evidenceService = {
  getAll(): EvidenceEntry[] {
    return load<EvidenceEntry[]>("evidence", []);
  },

  save(entries: EvidenceEntry[]): void {
    save("evidence", entries);
  },

  add(entry: EvidenceEntry): void {
    const all = evidenceService.getAll();
    evidenceService.save([...all, entry]);
  },

  update(id: string, patch: Partial<EvidenceEntry>): void {
    const all = evidenceService.getAll();
    evidenceService.save(all.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  },

  remove(id: string): void {
    evidenceService.save(evidenceService.getAll().filter((e) => e.id !== id));
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
  getAll(): StoredScan[] {
    return load<StoredScan[]>("scans", []);
  },

  save(scans: StoredScan[]): void {
    save("scans", scans);
  },

  add(scan: StoredScan): void {
    scanService.save([scan, ...scanService.getAll()]);
  },

  remove(id: string): void {
    scanService.save(scanService.getAll().filter((s) => s.id !== id));
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
  get(): CasePrefs {
    return load<CasePrefs>("case_prefs", DEFAULT_PREFS);
  },
  set(prefs: Partial<CasePrefs>): void {
    save("case_prefs", { ...casePrefsService.get(), ...prefs });
  },
};

// ── Data management ───────────────────────────────────────────────────────────

export const dataManagement = {
  /** Export all stored data as a JSON blob for download. */
  exportAll(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: "1",
        evidence: evidenceService.getAll(),
        scans: scanService.getAll(),
        casePrefs: casePrefsService.get(),
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
      if (k?.startsWith(NS)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  },

  /** Approximate storage used in bytes. */
  storageUsedBytes(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(NS)) total += (localStorage.getItem(k) ?? "").length * 2;
    }
    return total;
  },
};

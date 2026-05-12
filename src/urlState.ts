import type { RingConfig } from "./types";
import { DEFAULT_SPACING, SPACING_LIMITS, newRingId } from "./types";

const HASH_KEY = "s";

export type AppState = {
  rings: RingConfig[];
  spacing: number;
};

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function parseRing(raw: unknown): RingConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (
    !isFiniteNumber(r.imageIndex) ||
    !isFiniteNumber(r.petalScale) ||
    !isFiniteNumber(r.quantity) ||
    !isFiniteNumber(r.spinSpeed)
  ) {
    return null;
  }
  const petalRotZ = isFiniteNumber(r.petalRotZ) ? r.petalRotZ : 0;
  return {
    id: typeof r.id === "string" ? r.id : newRingId(),
    imageIndex: clamp(Math.round(r.imageIndex), 0, 9),
    petalScale: clamp(r.petalScale, 0.1, 2),
    quantity: clamp(Math.round(r.quantity), 3, 32),
    petalRotZ: clamp(petalRotZ, -180, 180),
    spinSpeed: clamp(r.spinSpeed, -1, 1),
  };
}

function getHashParams(): URLSearchParams {
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  return new URLSearchParams(raw);
}

export function loadFromUrl(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const params = getHashParams();
    const encoded = params.get(HASH_KEY);
    if (!encoded) return null;
    const json = atob(encoded);
    const data = JSON.parse(json) as unknown;

    let rawRings: unknown;
    let spacing = DEFAULT_SPACING;
    if (Array.isArray(data)) {
      rawRings = data;
    } else if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      rawRings = obj.rings;
      if (isFiniteNumber(obj.spacing)) {
        spacing = clamp(obj.spacing, SPACING_LIMITS.min, SPACING_LIMITS.max);
      }
    } else {
      return null;
    }

    if (!Array.isArray(rawRings)) return null;
    const rings: RingConfig[] = [];
    for (const item of rawRings) {
      const ring = parseRing(item);
      if (ring) rings.push(ring);
    }
    return rings.length > 0 ? { rings, spacing } : null;
  } catch {
    return null;
  }
}

export function saveToUrl(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(state);
    const encoded = btoa(json);
    const params = getHashParams();
    params.set(HASH_KEY, encoded);
    const newHash = params.toString();
    const target = `#${newHash}`;
    if (target !== window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${target}`);
    }
  } catch {
  }
}

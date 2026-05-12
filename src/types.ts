export type RingConfig = {
  id: string;
  imageIndex: number;
  petalScale: number;
  quantity: number;
  petalRotZ: number;
  spinSpeed: number;
};

export const SYMMETRY_QUANTITIES: readonly number[] = [3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32];

export const RING_LIMITS = {
  petalScale: { min: 0.1, max: 2, step: 0.05 },
  quantity: { min: 3, max: 32, step: 1 },
  petalRotZ: { min: -180, max: 180, step: 1 },
  spinSpeed: { min: -1, max: 1, step: 0.05 },
} as const;

export const SPACING_LIMITS = { min: 2, max: 12, step: 0.5 } as const;
export const DEFAULT_SPACING = 5;

export function radiusForIndex(index: number, total: number, spacing: number): number {
  return (total - index) * spacing;
}

let counter = 0;
export function newRingId(): string {
  counter += 1;
  return `r_${Date.now().toString(36)}_${counter}`;
}

export function snapQuantity(q: number): number {
  let best: number = SYMMETRY_QUANTITIES[0] ?? 12;
  let bestDist = Math.abs(q - best);
  for (const v of SYMMETRY_QUANTITIES) {
    const d = Math.abs(q - v);
    if (d < bestDist) {
      best = v;
      bestDist = d;
    }
  }
  return best;
}

export const DEFAULT_RINGS: RingConfig[] = [
  { id: newRingId(), imageIndex: 2, petalScale: 0.75, quantity: 12, petalRotZ: 0, spinSpeed: 0.05  },
  { id: newRingId(), imageIndex: 0, petalScale: 0.62, quantity: 12, petalRotZ: 0, spinSpeed: -0.04 },
  { id: newRingId(), imageIndex: 1, petalScale: 0.50, quantity: 12, petalRotZ: 0, spinSpeed: 0.06  },
  { id: newRingId(), imageIndex: 5, petalScale: 0.38, quantity: 10, petalRotZ: 0, spinSpeed: -0.05 },
  { id: newRingId(), imageIndex: 9, petalScale: 0.28, quantity: 8,  petalRotZ: 0, spinSpeed: 0.08  },
  { id: newRingId(), imageIndex: 4, petalScale: 0.22, quantity: 6,  petalRotZ: 0, spinSpeed: -0.06 },
  { id: newRingId(), imageIndex: 7, petalScale: 0.18, quantity: 5,  petalRotZ: 0, spinSpeed: 0.10  },
];

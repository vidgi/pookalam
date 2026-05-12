import { useMemo } from "react";
import type { RingConfig } from "./types";
import { RING_LIMITS, snapQuantity } from "./types";
import { IMAGE_LABELS } from "./images";

type Props = {
  rings: RingConfig[];
  spacing: number;
  spacingLimits: { min: number; max: number; step: number };
  activeId: string | null;
  open: boolean;
  snapSymmetry: boolean;
  onSelectRing: (id: string) => void;
  onSpacingChange: (v: number) => void;
  onUpdate: (id: string, patch: Partial<RingConfig>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onReorder: (id: string, dir: -1 | 1) => void;
  onRandomize: () => void;
  onSnapshot: () => void;
  onToggleSymmetry: (v: boolean) => void;
};

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
};

function SliderRow({ label, value, min, max, step, unit, onChange }: SliderRowProps) {
  const formatted = step >= 1 ? value.toFixed(0) : value.toFixed(2);
  return (
    <label className="block">
      <div className="flex items-baseline justify-between text-xs font-medium text-[#2a1d24]">
        <span>{label}</span>
        <span className="tabular-nums text-[#4a3340]">
          {formatted}
          {unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[#4a3340]"
      />
    </label>
  );
}

const fieldClass =
  "rounded-md border border-[#6b4d59] bg-[#f3e9da] text-[#2a1d24] px-2 py-1.5 focus:outline-none focus:border-[#2a1d24]";

const buttonOutline =
  "rounded-md border border-[#6b4d59] bg-[#f3e9da] text-[#2a1d24] hover:bg-[#ede1d2] disabled:opacity-40 transition";

const buttonSolid =
  "rounded-md border border-[#2a1d24] bg-[#4a3340] text-[#f3e9da] hover:bg-[#3b2832] disabled:opacity-40 transition";

export default function ControlsPanel(props: Props) {
  const {
    rings,
    spacing,
    spacingLimits,
    activeId,
    open,
    snapSymmetry,
    onSelectRing,
    onSpacingChange,
    onUpdate,
    onAdd,
    onRemove,
    onReorder,
    onRandomize,
    onSnapshot,
    onToggleSymmetry,
  } = props;

  const activeIndex = useMemo(
    () => (activeId ? rings.findIndex((r) => r.id === activeId) : -1),
    [rings, activeId]
  );
  const active = activeIndex >= 0 ? rings[activeIndex] : undefined;

  const update = (patch: Partial<RingConfig>) => {
    if (!active) return;
    onUpdate(active.id, patch);
  };

  return (
    <aside
      aria-hidden={!open}
      className={[
        "fixed top-4 right-4 z-30 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto",
        "bg-[#6b4d59]/30 backdrop-blur-xl p-4 border border-[#4a3340]",
        "transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "translate-x-[120%]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold tracking-wide text-[#2a1d24]">controls</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onRandomize}
            className={`${buttonSolid} px-2.5 py-1 text-xs`}
          >
            randomize
          </button>
          <button
            type="button"
            onClick={onSnapshot}
            className={`${buttonOutline} px-2.5 py-1 text-xs`}
          >
            snapshot
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-[#2a1d24] mb-1" htmlFor="ring-picker">
          active ring
        </label>
        <div className="flex gap-1">
          <select
            id="ring-picker"
            value={activeId ?? ""}
            onChange={(e) => onSelectRing(e.target.value)}
            className={`flex-1 text-sm ${fieldClass}`}
          >
            {!active && <option value="">— none —</option>}
            {rings.map((r, i) => (
              <option key={r.id} value={r.id}>
                ring {i + 1}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => active && onReorder(active.id, -1)}
            disabled={!active || activeIndex <= 0}
            aria-label="move ring up"
            className={`${buttonOutline} px-2`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => active && onReorder(active.id, 1)}
            disabled={!active || activeIndex === rings.length - 1}
            aria-label="move ring down"
            className={`${buttonOutline} px-2`}
          >
            ↓
          </button>
        </div>
        <div className="flex gap-1 mt-2">
          <button
            type="button"
            onClick={onAdd}
            className={`${buttonSolid} flex-1 text-xs px-2 py-1.5`}
          >
            + add ring
          </button>
          <button
            type="button"
            onClick={() => active && onRemove(active.id)}
            disabled={!active || rings.length <= 1}
            className={`${buttonOutline} flex-1 text-xs px-2 py-1.5`}
          >
            delete
          </button>
        </div>
      </div>

      {active ? (
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-[#2a1d24]">petal image</span>
            <select
              aria-label="petal image"
              value={active.imageIndex}
              onChange={(e) => update({ imageIndex: Number(e.target.value) })}
              className={`mt-1 w-full text-sm ${fieldClass}`}
            >
              {IMAGE_LABELS.map((name, i) => (
                <option key={name} value={i}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <SliderRow
            label="size"
            value={active.petalScale}
            min={RING_LIMITS.petalScale.min}
            max={RING_LIMITS.petalScale.max}
            step={RING_LIMITS.petalScale.step}
            onChange={(v) => update({ petalScale: v })}
          />

          <SliderRow
            label="quantity"
            value={active.quantity}
            min={RING_LIMITS.quantity.min}
            max={RING_LIMITS.quantity.max}
            step={RING_LIMITS.quantity.step}
            onChange={(v) => update({ quantity: snapSymmetry ? snapQuantity(v) : Math.round(v) })}
          />

          <SliderRow
            label="petal rotation"
            value={active.petalRotZ}
            min={RING_LIMITS.petalRotZ.min}
            max={RING_LIMITS.petalRotZ.max}
            step={RING_LIMITS.petalRotZ.step}
            unit="°"
            onChange={(v) => update({ petalRotZ: v })}
          />

          <SliderRow
            label="spin"
            value={active.spinSpeed}
            min={RING_LIMITS.spinSpeed.min}
            max={RING_LIMITS.spinSpeed.max}
            step={RING_LIMITS.spinSpeed.step}
            unit=" rad/s"
            onChange={(v) => update({ spinSpeed: v })}
          />
        </div>
      ) : (
        <p className="text-xs text-[#4a3340] italic">
          click a ring on the canvas, or pick one above, to edit it.
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-[#6b4d59]">
        <SliderRow
          label="ring spacing"
          value={spacing}
          min={spacingLimits.min}
          max={spacingLimits.max}
          step={spacingLimits.step}
          onChange={onSpacingChange}
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs text-[#2a1d24] select-none">
        <input
          type="checkbox"
          checked={snapSymmetry}
          onChange={(e) => onToggleSymmetry(e.target.checked)}
          className="accent-[#4a3340]"
        />
        symmetry snap (3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32)
      </label>
    </aside>
  );
}

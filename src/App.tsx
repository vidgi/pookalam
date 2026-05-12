import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Loader,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import PetalRing from "./PetalRing";
import ControlsPanel from "./ControlsPanel";
import { IMAGES } from "./images";
import {
  DEFAULT_RINGS,
  DEFAULT_SPACING,
  RING_LIMITS,
  SPACING_LIMITS,
  newRingId,
  radiusForIndex,
  type RingConfig,
} from "./types";
import { loadFromUrl, saveToUrl } from "./urlState";
import { useReducedMotion } from "./useReducedMotion";

useTexture.preload(IMAGES as unknown as string[]);

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function randomBetween(min: number, max: number, step: number) {
  const span = max - min;
  const raw = min + Math.random() * span;
  return Math.round(raw / step) * step;
}

type SceneProps = {
  rings: RingConfig[];
  spacing: number;
  activeId: string | null;
  onSelect: (id: string) => void;
  onSaveSnapshotRef: (fn: () => void) => void;
};

function Scene({ rings, spacing, activeId, onSelect, onSaveSnapshotRef }: SceneProps) {
  const textures = useTexture(IMAGES as unknown as string[]) as THREE.Texture[];
  useEffect(() => {
    for (const tex of textures) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
    }
  }, [textures]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(10, 10), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    onSaveSnapshotRef(() => {
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `pookalam-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }, [gl, scene, camera, onSaveSnapshotRef]);

  return (
    <>
      {rings.map((ring, i) => (
        <PetalRing
          key={ring.id}
          texture={textures[ring.imageIndex] ?? textures[0]}
          geometry={geometry}
          quantity={ring.quantity}
          radius={radiusForIndex(i, rings.length, spacing)}
          petalScale={ring.petalScale}
          petalRotZ={ring.petalRotZ}
          spinSpeed={ring.spinSpeed}
          selected={activeId === null || ring.id === activeId}
          onSelect={() => onSelect(ring.id)}
        />
      ))}
    </>
  );
}

function InvalidateOnChange({ deps }: { deps: unknown[] }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, ...deps]);
  return null;
}

export default function App() {
  const initial = useMemo(() => loadFromUrl(), []);
  const [rings, setRings] = useState<RingConfig[]>(() => initial?.rings ?? DEFAULT_RINGS);
  const [spacing, setSpacing] = useState<number>(() => initial?.spacing ?? DEFAULT_SPACING);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [snapSymmetry, setSnapSymmetry] = useState(false);
  const reducedMotion = useReducedMotion();
  const snapshotFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (activeId !== null && !rings.find((r) => r.id === activeId)) {
      setActiveId(null);
    }
  }, [rings, activeId]);

  useEffect(() => {
    const t = window.setTimeout(() => saveToUrl({ rings, spacing }), 200);
    return () => window.clearTimeout(t);
  }, [rings, spacing]);

  const updateRing = useCallback((id: string, patch: Partial<RingConfig>) => {
    setRings((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next: RingConfig = { ...r, ...patch };
        next.petalScale = clamp(next.petalScale, RING_LIMITS.petalScale.min, RING_LIMITS.petalScale.max);
        next.quantity = clamp(Math.round(next.quantity), RING_LIMITS.quantity.min, RING_LIMITS.quantity.max);
        next.petalRotZ = clamp(next.petalRotZ, RING_LIMITS.petalRotZ.min, RING_LIMITS.petalRotZ.max);
        next.spinSpeed = clamp(next.spinSpeed, RING_LIMITS.spinSpeed.min, RING_LIMITS.spinSpeed.max);
        next.imageIndex = clamp(Math.round(next.imageIndex), 0, IMAGES.length - 1);
        return next;
      })
    );
  }, []);

  const addRing = useCallback(() => {
    setRings((prev) => {
      const newRing: RingConfig = {
        id: newRingId(),
        imageIndex: Math.floor(Math.random() * IMAGES.length),
        petalScale: 0.4,
        quantity: 12,
        petalRotZ: 0,
        spinSpeed: 0.05,
      };
      setActiveId(newRing.id);
      return [...prev, newRing];
    });
  }, []);

  const removeRing = useCallback((id: string) => {
    setRings((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((r) => r.id === id);
      const next = prev.filter((r) => r.id !== id);
      if (id === activeId) {
        const fallback = next[Math.max(0, idx - 1)] ?? next[0];
        if (fallback) setActiveId(fallback.id);
      }
      return next;
    });
  }, [activeId]);

  const reorderRing = useCallback((id: string, dir: -1 | 1) => {
    setRings((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return next;
    });
  }, []);

  const randomizeAll = useCallback(() => {
    setRings((prev) =>
      prev.map((r) => ({
        ...r,
        imageIndex: Math.floor(Math.random() * IMAGES.length),
        quantity: randomBetween(RING_LIMITS.quantity.min, RING_LIMITS.quantity.max, 1),
        petalRotZ: randomBetween(-180, 180, 1),
        spinSpeed: randomBetween(-0.2, 0.2, 0.01),
      }))
    );
  }, []);

  const handleSnapshot = useCallback(() => snapshotFnRef.current(), []);

  return (
    <div className="App relative h-full w-full">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
          alpha: true,
        }}
        camera={{ fov: 75, position: [0, 50, 100] }}
        onPointerMissed={() => setActiveId(null)}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight />
        <Suspense fallback={null}>
          <Scene
            rings={rings}
            spacing={spacing}
            activeId={activeId}
            onSelect={setActiveId}
            onSaveSnapshotRef={(fn) => {
              snapshotFnRef.current = fn;
            }}
          />
        </Suspense>
        <InvalidateOnChange deps={[rings, spacing, activeId]} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={500}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.4}
        />
      </Canvas>
      <Loader />

      <ControlsPanel
        rings={rings}
        spacing={spacing}
        spacingLimits={SPACING_LIMITS}
        activeId={activeId}
        open={panelOpen}
        snapSymmetry={snapSymmetry}
        onSelectRing={setActiveId}
        onSpacingChange={setSpacing}
        onUpdate={updateRing}
        onAdd={addRing}
        onRemove={removeRing}
        onReorder={reorderRing}
        onRandomize={randomizeAll}
        onSnapshot={handleSnapshot}
        onToggleSymmetry={setSnapSymmetry}
      />

      <button
        type="button"
        aria-pressed={panelOpen}
        aria-label={panelOpen ? "hide controls" : "show controls"}
        onClick={() => setPanelOpen((v) => !v)}
        className="fixed bottom-4 left-4 z-40 px-4 py-2 rounded-full bg-[#6b4d59]/30 backdrop-blur-xl text-[#2a1d24] text-sm border border-[#4a3340] hover:bg-[#6b4d59]/45 transition focus:outline-none focus:border-[#2a1d24]"
      >
        {panelOpen ? "hide controls" : "show controls"}
      </button>
    </div>
  );
}

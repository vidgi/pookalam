import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "./useReducedMotion";

const MAX_PETALS = 64;

type Props = {
  texture: THREE.Texture;
  geometry: THREE.PlaneGeometry;
  quantity: number;
  radius: number;
  petalScale: number;
  petalRotZ: number;
  spinSpeed: number;
  selected: boolean;
  onSelect: () => void;
};

const DEG = Math.PI / 180;

export default function PetalRing({
  texture,
  geometry,
  quantity,
  radius,
  petalScale,
  petalRotZ,
  spinSpeed,
  selected,
  onSelect,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const reduce = useReducedMotion();
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const count = Math.min(Math.max(1, Math.round(quantity)), MAX_PETALS);
    const rz = petalRotZ * DEG;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      tmp.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      tmp.rotation.set(0, 0, 0);
      tmp.rotateY(-a + Math.PI / 2);
      tmp.rotateZ(rz);
      tmp.scale.setScalar(petalScale);
      tmp.updateMatrix();
      mesh.setMatrixAt(i, tmp.matrix);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
    invalidate();
  }, [quantity, radius, petalScale, petalRotZ, tmp, invalidate]);

  useFrame((_, dt) => {
    if (reduce || spinSpeed === 0) return;
    if (!groupRef.current) return;
    groupRef.current.rotation.y += spinSpeed * dt;
    invalidate();
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, undefined, MAX_PETALS]}
        onClick={handleClick}
        frustumCulled={false}
      >
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={selected ? 1 : 0.6}
          alphaTest={0.02}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}

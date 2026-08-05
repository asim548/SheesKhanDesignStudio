"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/** Soft flowing silk planes — ambient only, never overpower content */
function SilkSheet({
  position,
  rotation,
  color,
  scale = 1,
  speed = 0.35,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.6) * 0.12;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.08;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[3.2, 4.2, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={0.28}
          speed={1.1}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function ThreadOrbs() {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return [
          Math.cos(a) * (1.6 + (i % 3) * 0.35),
          (i % 5) * 0.35 - 0.8,
          Math.sin(a) * (1.2 + (i % 2) * 0.4) - 0.5,
        ] as [number, number, number];
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.035 + (i % 3) * 0.012, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#E8D5D0" : "#3D2B22"}
            transparent
            opacity={0.45}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 3]} intensity={0.55} color="#FAF7F2" />
      <pointLight position={[-3, 2, 2]} intensity={0.35} color="#E8D5D0" />

      <SilkSheet
        position={[-1.8, 0.2, -1]}
        rotation={[0.2, 0.5, -0.35]}
        color="#E8D5D0"
        scale={1.15}
        speed={0.32}
      />
      <SilkSheet
        position={[2.1, -0.3, -1.4]}
        rotation={[-0.15, -0.4, 0.28]}
        color="#D4C4B8"
        scale={0.95}
        speed={0.28}
      />
      <SilkSheet
        position={[0.2, 0.6, -2]}
        rotation={[0.1, 0.15, 0.1]}
        color="#FAF7F2"
        scale={1.4}
        speed={0.22}
      />
      <ThreadOrbs />
    </>
  );
}

/**
 * Subtle couture silk ambient for section backdrops.
 * Uses existing Three.js / R3F stack — lightweight, brand-aligned.
 */
export default function SilkAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0 opacity-70" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

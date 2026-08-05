"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function SilkRibbon({
  position,
  color,
  scale = 1,
  speed = 0.4,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * speed;
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.25;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.55}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1.4, 0.28, 48, 100]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.4}
          roughness={0.35}
          metalness={0.2}
          transparent
          opacity={0.72}
        />
      </mesh>
    </Float>
  );
}

function FabricPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(6, 7, 80, 80), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * 0.45;
    const pos = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 1.1 + t) * 0.18 +
        Math.cos(y * 0.85 + t * 0.9) * 0.14 +
        Math.sin((x + y) * 0.55 + t * 0.6) * 0.1;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
    meshRef.current.rotation.y = Math.sin(t * 0.25) * 0.2;
    meshRef.current.rotation.x = -0.25 + Math.sin(t * 0.18) * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0.3, 0, -0.5]}>
      <meshPhysicalMaterial
        color="#E8D5D0"
        metalness={0.12}
        roughness={0.4}
        transmission={0.15}
        thickness={0.6}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 140;

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    return { positions, speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * 0.008;
      if (y > 4) y = -4;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * 0.0015);
    }
    pos.needsUpdate = true;
    pointsRef.current.rotation.y = t * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#3D2B22"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SoftOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.sin(t * 0.2) * 1.2;
    ref.current.position.y = Math.cos(t * 0.25) * 0.6;
  });

  return (
    <mesh ref={ref} position={[1.5, 0.5, -1.5]}>
      <sphereGeometry args={[0.7, 48, 48]} />
      <meshStandardMaterial
        color="#E8D5D0"
        transparent
        opacity={0.35}
        roughness={0.8}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function SilkDrape() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#FAF7F2"]} />
        <fog attach="fog" args={["#FAF7F2", 7, 16]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 6]} intensity={1.1} color="#FAF7F2" />
        <directionalLight position={[-3, -1, 2]} intensity={0.5} color="#E8D5D0" />
        <pointLight position={[0, 2, 3]} intensity={0.4} color="#E8D5D0" />
        <Suspense fallback={null}>
          <FabricPlane />
          <SilkRibbon position={[-1.6, 0.4, 0.8]} color="#E8D5D0" scale={0.85} speed={0.35} />
          <SilkRibbon position={[1.8, -0.3, 0.2]} color="#3D2B22" scale={0.55} speed={0.5} />
          <SoftOrb />
          <DustParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}

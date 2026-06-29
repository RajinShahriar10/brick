"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

interface BrickModelProps {
  mouseX: number;
  mouseY: number;
  inspecting?: boolean;
  onInspectComplete?: () => void;
}

function createBeveledBrickGeometry() {
  const geo = new RoundedBoxGeometry(2, 0.95, 1.2, 4, 0.08);
  return geo;
}

export function BrickModel({ mouseX, mouseY, inspecting }: BrickModelProps) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const edgeRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useRef(createBeveledBrickGeometry());

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const speed = inspecting ? 0.5 : 1.5;
    const targetRotX = mouseY * 0.12 * speed;
    const targetRotY = mouseX * 0.2 * speed;

    meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * delta * 4;
    meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * delta * 4;

    if (glowRef.current) {
      glowRef.current.rotation.x = meshRef.current.rotation.x;
      glowRef.current.rotation.y = meshRef.current.rotation.y;
    }

    if (edgeRef.current) {
      edgeRef.current.rotation.x = meshRef.current.rotation.x;
      edgeRef.current.rotation.y = meshRef.current.rotation.y;
    }
  });

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main brick body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={geometry.current}
      >
        <meshPhysicalMaterial
          color="#7A2000"
          roughness={0.25}
          metalness={0.2}
          clearcoat={0.7}
          clearcoatRoughness={0.15}
          envMapIntensity={2.0}
          reflectivity={0.9}
          ior={1.5}
          specularIntensity={0.3}
          specularColor="#ff6633"
          side={2}
        />
      </mesh>

      {/* Bevel highlight layer — slightly smaller to catch rim light */}
      <mesh
        ref={glowRef}
        geometry={geometry.current}
        position={[0, 0.005, 0]}
      >
        <meshPhysicalMaterial
          color="#8B3000"
          roughness={0.1}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2.5}
          transparent
          opacity={0.3}
          side={1}
        />
      </mesh>

      {/* Edge wireframe */}
      <mesh ref={edgeRef} geometry={geometry.current}>
        <meshBasicMaterial
          color="#ff4400"
          wireframe
          transparent
          opacity={hovered ? 0.12 : 0.04}
        />
      </mesh>

      {/* Hover emissive glow */}
      {hovered && (
        <mesh geometry={geometry.current} position={[0, 0, 0]}>
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.06}
            side={2}
          />
        </mesh>
      )}

      {/* Inspection label ring */}
      {inspecting && (
        <mesh position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 64]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={0.3} side={2} />
        </mesh>
      )}
    </group>
  );
}

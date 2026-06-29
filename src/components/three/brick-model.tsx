"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

interface BrickModelProps {
  mouseX: number;
  mouseY: number;
  inspecting?: boolean;
  onInspectComplete?: () => void;
}

const BRICK_W = 2.4;
const BRICK_H = 0.7;
const BRICK_D = 1.2;
const BEVEL = 0.06;

function createBrickBody() {
  return new RoundedBoxGeometry(BRICK_W, BRICK_H, BRICK_D, 4, BEVEL);
}

function createFrogIndent() {
  const fw = BRICK_W * 0.55;
  const fd = BRICK_D * 0.55;
  const fh = 0.04;
  return new RoundedBoxGeometry(fw, fh, fd, 4, 0.02);
}

export function BrickModel({ mouseX, mouseY, inspecting }: BrickModelProps) {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);

  const bodyGeo = useMemo(createBrickBody, []);
  const frogGeo = useMemo(createFrogIndent, []);
  const topEdgeGeo = useMemo(
    () => new RoundedBoxGeometry(BRICK_W * 0.85, 0.01, BRICK_D * 0.85, 4, 0.02),
    []
  );
  const bottomEdgeGeo = useMemo(
    () => new RoundedBoxGeometry(BRICK_W * 0.9, 0.01, BRICK_D * 0.9, 4, 0.02),
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = inspecting ? 0.5 : 1.5;
    const targetRotX = mouseY * 0.12 * speed;
    const targetRotY = mouseX * 0.2 * speed;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * delta * 4;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * delta * 4;
  });

  const frogY = BRICK_H / 2 - 0.02;

  return (
    <group ref={groupRef}>
      {/* Main brick body */}
      <mesh ref={bodyRef} castShadow receiveShadow geometry={bodyGeo}>
        <meshPhysicalMaterial
          color="#A04020"
          roughness={0.6}
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          envMapIntensity={0.8}
          ior={1.4}
        />
      </mesh>

      {/* Slightly darker inner tone for depth */}
      <mesh geometry={bodyGeo} position={[0, -0.005, 0]} scale={[0.98, 0.98, 0.98]}>
        <meshPhysicalMaterial
          color="#7A2E10"
          roughness={0.8}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Frog indentations — 3 classic circular depressions */}
      {[
        { x: -BRICK_W * 0.27, z: 0 },
        { x: 0, z: 0 },
        { x: BRICK_W * 0.27, z: 0 },
      ].map((pos, i) => (
        <group key={i} position={[pos.x, frogY, pos.z]}>
          <mesh geometry={frogGeo} position={[0, -0.005, 0]}>
            <meshPhysicalMaterial
              color="#5C2008"
              roughness={0.9}
              metalness={0}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh geometry={frogGeo} position={[0, 0.008, 0]}>
            <meshPhysicalMaterial
              color="#B05028"
              roughness={0.7}
              metalness={0}
              transparent
              opacity={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Top highlight edge */}
      <mesh
        geometry={topEdgeGeo}
        position={[0, BRICK_H / 2 - 0.01, 0]}
      >
        <meshBasicMaterial color="#cc6633" transparent opacity={0.08} />
      </mesh>

      {/* Bottom edge shadow */}
      <mesh
        geometry={bottomEdgeGeo}
        position={[0, -BRICK_H / 2 + 0.01, 0]}
      >
        <meshBasicMaterial color="#3A1500" transparent opacity={0.15} />
      </mesh>

      {/* Inspection ring */}
      {inspecting && (
        <mesh position={[0, BRICK_H / 2 + 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 64]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

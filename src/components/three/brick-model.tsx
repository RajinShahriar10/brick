"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

interface BrickModelProps {
  mouseX: number;
  mouseY: number;
  inspecting?: boolean;
  onInspectComplete?: () => void;
}

const BRICK_W = 2.4;
const BRICK_H = 0.75;
const BRICK_D = 1.2;

function createBody() {
  return new RoundedBoxGeometry(BRICK_W, BRICK_H, BRICK_D, 6, 0.05);
}

function createFrogPocket() {
  return new RoundedBoxGeometry(1.2, 0.06, 0.6, 4, 0.03);
}

function createHole() {
  return new RoundedBoxGeometry(0.2, 0.1, 0.2, 8, 0.02);
}

export function BrickModel({ mouseX, mouseY, inspecting }: BrickModelProps) {
  const groupRef = useRef<Group>(null);

  const bodyGeo = useMemo(createBody, []);
  const pocketGeo = useMemo(createFrogPocket, []);
  const holeGeo = useMemo(createHole, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const speed = inspecting ? 0.5 : 1.5;
    const targetRotX = mouseY * 0.12 * speed;
    const targetRotY = mouseX * 0.2 * speed;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * delta * 4;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * delta * 4;
  });

  const topY = BRICK_H / 2;
  const pocketY = topY - 0.025;

  return (
    <group ref={groupRef}>
      {/* Main brick body */}
      <mesh castShadow receiveShadow geometry={bodyGeo}>
        <meshPhysicalMaterial
          color="#B84A28"
          roughness={0.7}
          metalness={0}
          clearcoat={0.15}
          clearcoatRoughness={0.6}
          envMapIntensity={0.6}
          ior={1.45}
          flatShading={false}
        />
      </mesh>

      {/* Subsurface scattering layer — warm inner glow */}
      <mesh geometry={bodyGeo} position={[0, -0.01, 0]} scale={[0.97, 0.97, 0.97]}>
        <meshPhysicalMaterial
          color="#6B2810"
          roughness={0.9}
          metalness={0}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Core dark tone — deep clay center */}
      <mesh geometry={bodyGeo} position={[0, -0.02, 0]} scale={[0.94, 0.94, 0.94]}>
        <meshPhysicalMaterial
          color="#3A1505"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* === Frog — recessed rectangular panel === */}
      <group position={[0, pocketY, 0]}>
        {/* Pocket shadow (deepest) */}
        <mesh geometry={pocketGeo} position={[0, -0.02, 0]}>
          <meshPhysicalMaterial color="#3A1505" roughness={1} metalness={0} transparent opacity={0.6} />
        </mesh>
        {/* Pocket base */}
        <mesh geometry={pocketGeo}>
          <meshPhysicalMaterial color="#5C1E08" roughness={0.9} metalness={0} />
        </mesh>
        {/* Pocket rim highlight */}
        <mesh geometry={pocketGeo} position={[0, 0.015, 0]} scale={[1.02, 1, 1.02]}>
          <meshPhysicalMaterial color="#7A2E10" roughness={0.8} metalness={0} transparent opacity={0.3} />
        </mesh>
      </group>

      {/* === 3 wire-cut holes inside the frog === */}
      {[-0.35, 0, 0.35].map((x, i) => (
        <group key={i} position={[x, pocketY - 0.01, 0]}>
          <mesh geometry={holeGeo} position={[0, -0.04, 0]}>
            <meshPhysicalMaterial color="#2A0D02" roughness={1} metalness={0} transparent opacity={0.8} />
          </mesh>
          <mesh geometry={holeGeo}>
            <meshPhysicalMaterial color="#4A1605" roughness={0.9} metalness={0} />
          </mesh>
          <mesh geometry={holeGeo} position={[0, 0.015, 0]} scale={[1.1, 1, 1.1]}>
            <meshPhysicalMaterial color="#8A3515" roughness={0.7} metalness={0} transparent opacity={0.2} />
          </mesh>
        </group>
      ))}

      {/* === Edge wear — subtle lighter highlights on top edges === */}
      <mesh
        geometry={new RoundedBoxGeometry(BRICK_W * 0.92, 0.015, BRICK_D * 0.92, 6, 0.04)}
        position={[0, topY - 0.005, 0]}
      >
        <meshBasicMaterial color="#D46030" transparent opacity={0.06} />
      </mesh>

      {/* Bottom edge shadow */}
      <mesh
        geometry={new RoundedBoxGeometry(BRICK_W * 0.92, 0.015, BRICK_D * 0.92, 6, 0.04)}
        position={[0, -topY + 0.005, 0]}
      >
        <meshBasicMaterial color="#2A0D02" transparent opacity={0.15} />
      </mesh>

      {/* Inspection ring */}
      {inspecting && (
        <mesh position={[0, topY + 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 64]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

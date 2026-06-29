"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  Loader,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { BrickModel } from "./brick-model";
import { ParticleField } from "./particle-field";
import * as THREE from "three";

function CameraController({ inspecting }: { inspecting: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.2));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (inspecting) {
      targetPos.current.set(0, 0.2, 2.8);
    } else {
      targetPos.current.set(0, 0, 4.2);
    }
  }, [inspecting]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FloatingParticles() {
  return <ParticleField count={200} color="#ff4400" size={0.012} />;
}

interface InteractiveSceneProps {
  mouseX: number;
  mouseY: number;
}

export function InteractiveScene({ mouseX, mouseY }: InteractiveSceneProps) {
  const controlsRef = useRef<any>(null);
  const [inspecting, setInspecting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDoubleClick = useCallback(() => {
    setInspecting((prev) => !prev);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={handleLoad}
        style={{ background: "transparent" }}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.15} />

        {/* Key light — warm, from upper right */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-5, 5, 5, -5, 0.1, 20]}
          />
        </directionalLight>

        {/* Fill light — cool, from left */}
        <directionalLight
          position={[-3, 2, 2]}
          intensity={0.5}
          color="#8888ff"
        />

        {/* Rim light — red, from behind */}
        <directionalLight
          position={[0, 1, -5]}
          intensity={0.8}
          color="#ff4400"
        />

        {/* Top accent */}
        <pointLight position={[0, 3, 1]} intensity={0.3} color="#ff6633" />

        <CameraController inspecting={inspecting} />

        <FloatingParticles />

        <BrickModel
          mouseX={mouseX}
          mouseY={mouseY}
          inspecting={inspecting}
        />

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.2}
          scale={4.5}
          blur={3.5}
          far={4}
        />

        <Environment
          preset="studio"
          environmentIntensity={1.2}
        />

        {/* Interactive controls */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          zoomSpeed={0.8}
          enablePan={false}
          rotateSpeed={0.8}
          minDistance={2.5}
          maxDistance={7}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          enableDamping
          dampingFactor={0.08}
        />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            intensity={0.3}
            mipmapBlur
          />
          <Vignette
            offset={0.3}
            darkness={0.4}
          />
          <ToneMapping
            mode={THREE.ACESFilmicToneMapping}
            exposure={1.0}
          />
        </EffectComposer>
      </Canvas>

      {/* Interaction hints */}
      <div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        onDoubleClick={handleDoubleClick}
      />

      {/* HUD overlay */}
      {!loading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <span className="text-[9px] tracking-[0.2em] text-white/15 uppercase pointer-events-none">
            Drag to rotate
          </span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[9px] tracking-[0.2em] text-white/15 uppercase pointer-events-none">
            Scroll to zoom
          </span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[9px] tracking-[0.2em] text-white/15 uppercase pointer-events-none">
            Double-click {inspecting ? "to zoom out" : "to inspect"}
          </span>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-5 bg-gradient-to-b from-red-600/30 to-red-800/30 rounded animate-pulse" />
            <p className="text-[10px] text-white/20 tracking-wider">Loading 3D viewer...</p>
          </div>
        </div>
      )}
    </div>
  );
}

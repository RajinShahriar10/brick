"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
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

function Scene({ inspecting }: { inspecting: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.2));

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const inspectingDist = w < 640 ? 2.2 : 2.8;
      const defaultDist = w < 640 ? 5.5 : w < 1024 ? 4.8 : 4.2;
      const dist = inspecting ? inspectingDist : defaultDist;
      targetPos.current.set(0, 0, dist);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [inspecting]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function FloatingParticles() {
  return <ParticleField count={60} color="#ff4400" size={0.012} />;
}

interface InteractiveSceneProps {
  mouseX: number;
  mouseY: number;
}

export function InteractiveScene({ mouseX, mouseY }: InteractiveSceneProps) {
  const controlsRef = useRef<any>(null);
  const [inspecting, setInspecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleDoubleClick = useCallback(() => {
    setInspecting((prev) => !prev);
  }, []);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 25 }}
        dpr={[1, 1.2]}
        frameloop={visible ? "always" : "never"}
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
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
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

        <Scene inspecting={inspecting} />

        <FloatingParticles />

        <BrickModel
          mouseX={mouseX}
          mouseY={mouseY}
          inspecting={inspecting}
        />

        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.15}
          scale={4}
          blur={3}
          far={4}
        />

        <Environment
          preset="studio"
          environmentIntensity={0.8}
        />

        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={0.2}
            mipmapBlur
          />
          <Vignette
            offset={0.4}
            darkness={0.3}
          />
          <ToneMapping
            mode={THREE.ACESFilmicToneMapping}
            exposure={1.0}
          />
        </EffectComposer>
      </Canvas>

      {/* Interaction hints */}
      <div
        className="absolute inset-0 z-10"
      />

      {/* HUD overlay */}
      {!loading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <span className="text-[8px] tracking-[0.2em] text-white/10 uppercase pointer-events-none">
            Experience the craft
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

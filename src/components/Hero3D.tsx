"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Hero3D() {
  return (
    <section className="h-[70vh] relative overflow-hidden flex items-center justify-center">
      <h1 className="absolute top-1/3 text-5xl md:text-6xl font-extrabold text-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
        🚀 Deviens Invincible
      </h1>
      <Canvas className="absolute inset-0">
        <ambientLight intensity={0.6} />
        <OrbitControls enableZoom={false} />
        <Sphere args={[1, 100, 200]} scale={2.6}>
          <MeshDistortMaterial color="#7e22ce" distort={0.5} speed={2} roughness={0} />
        </Sphere>
      </Canvas>
    </section>
  );
}

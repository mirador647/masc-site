"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Hero3D() {
  return (
    <section className="h-screen flex justify-center items-center relative overflow-hidden">
      <h1 className="absolute top-1/3 text-6xl font-bold text-purple-500 drop-shadow-lg animate-pulse">
        ⚡ Libère ta puissance ⚡
      </h1>
      <Canvas className="absolute w-full h-full">
        <ambientLight intensity={0.5} />
        <OrbitControls enableZoom={false} />
        <Sphere args={[1, 100, 200]} scale={2.8}>
          <MeshDistortMaterial color="#7e22ce" distort={0.5} speed={2} roughness={0} />
        </Sphere>
      </Canvas>
    </section>
  );
}

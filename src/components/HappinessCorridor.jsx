import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { useRef } from "react";
import { Html } from "@react-three/drei";

function CameraWalk() {
  const progress = useRef(8);

  useFrame((state) => {
    if (progress.current > 2.5) {
      progress.current -= 0.015;
      state.camera.position.z = progress.current;
    }
  });

  return null;
}

export default function HappinessCorridor({ onGiftClick }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 8], fov: 60 }}>
        {/* Lights */}

        <ambientLight intensity={0.5} />

        <pointLight position={[0, 3, 0]} intensity={12} />

        {/* Red Emergency Light */}

        <pointLight position={[0, 3, -10]} color="red" intensity={10} />

        <CameraWalk />

        {/* Floor */}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1c1c1c" roughness={0.2} />
        </mesh>

        {/* Left Wall */}

        <mesh position={[-4, 1.5, 0]}>
          <boxGeometry args={[0.2, 5, 20]} />
          <meshStandardMaterial color="#313131" />
        </mesh>

        {/* Right Wall */}

        <mesh position={[4, 1.5, 0]}>
          <boxGeometry args={[0.2, 5, 20]} />
          <meshStandardMaterial color="#313131" />
        </mesh>

        {/* Ceiling */}

        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[8, 0.2, 20]} />
          <meshStandardMaterial color="#151515" />
        </mesh>

        {/* Ceiling Lights */}

        <mesh position={[0, 3.8, -4]}>
          <boxGeometry args={[1.5, 0.1, 0.5]} />
          <meshStandardMaterial emissive="white" emissiveIntensity={4} />
        </mesh>

        <mesh position={[0, 3.8, -8]}>
          <boxGeometry args={[1.5, 0.1, 0.5]} />
          <meshStandardMaterial emissive="white" emissiveIntensity={4} />
        </mesh>

        {/* Side Doors */}

        <mesh position={[-3, 1, -6]}>
          <boxGeometry args={[1.5, 3, 0.2]} />
          <meshStandardMaterial color="#4a2d1d" />
        </mesh>

        <mesh position={[3, 1, -6]}>
          <boxGeometry args={[1.5, 3, 0.2]} />
          <meshStandardMaterial color="#4a2d1d" />
        </mesh>

        {/* Main Room 101 */}

        <mesh position={[0, 1, -10]}>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial color="#5b3823" />
        </mesh>
        

        <Text position={[0, 2.8, -9.8]} color="white" fontSize={0.6}>
          101
        </Text>

        {/* Floating Birthday Gift */}

        <Float speed={3} rotationIntensity={2} floatIntensity={3}>
          <group position={[0, 0.8, -8]} onClick={onGiftClick}>
            {/* Gift Box */}
            <mesh>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial
                color="#ff3b5c"
                emissive="#ff3b5c"
                emissiveIntensity={2}
              />
            </mesh>

            {/* Ribbon Vertical */}
            <mesh>
              <boxGeometry args={[0.12, 1, 0.95]} />
              <meshStandardMaterial
                color="gold"
                emissive="gold"
                emissiveIntensity={1}
              />
            </mesh>

            {/* Ribbon Horizontal */}
            <mesh>
              <boxGeometry args={[1, 0.12, 0.95]} />
              <meshStandardMaterial
                color="gold"
                emissive="gold"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        </Float>

        <pointLight position={[0, 0.8, -8]} color="#ff3b5c" intensity={30} />

        <pointLight position={[0, 1.2, -8]} color="gold" intensity={10} />

        {/* Gift Glow */}

        <pointLight position={[0, 0.8, -8]} color="#ff3b5c" intensity={20} />
      </Canvas>
    </div>
  );
}

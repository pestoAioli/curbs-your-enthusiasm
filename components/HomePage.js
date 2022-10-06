import { Center, Cone, PresentationControls, Reflector, SpotLight, Text, useDepthBuffer, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react"
import * as THREE from 'three';
export default function HomePage() {
  return (
    <>
      <div className="globe">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [-2, 2, 8], fov: 75, near: 1, far: 20 }}>
          <color attach="background" args={['#202020']} />
          <fog attach="fog" args={['#202020', 5, 20]} />
          <ambientLight intensity={0.015} />
          <pointLight intensity={0.5} position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Scene position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </div>
    </>
  )

  function Scene() {
    const depthBuffer = useDepthBuffer({ frames: 5 });

    return (
      <>
        <MovingSpot depthBuffer={depthBuffer} color="white" position={[-3, 3, 2]} />

        <Globe />
        <VideoText position={[0, -2, 2]} />
        <Reflector resolution={512} args={[100, 100]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, -3, 0]}>
          {(Material, props) => <Material color="#a0a0a0" metalness={2} {...props} />}
        </Reflector>
      </>
    )
  }

  function Globe() {
    const globeMap = useTexture("/earthTetxureMaybe.jpeg");
    const bumpMap = useTexture("/earthHeightMap.jpeg");

    return (
      <>
        <mesh
          scale={1.8}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            map={globeMap}
            bumpMap={bumpMap}
            bumpScale={0.5}
          />
        </mesh>
      </>
    )
  }

  //thanks to react drei docs for this example of volumetric spotlight
  function MovingSpot({ vec = new THREE.Vector3(), ...props }) {
    const light = useRef();
    const viewport = useThree((state) => state.viewport)
    useFrame((state) => {
      light.current.target.position.lerp(vec.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0), 0.1)
      light.current.target.updateMatrixWorld()
    })
    return <SpotLight castShadow ref={light} penumbra={0.5} distance={8} angle={0.35} attenuation={5} anglePower={4} intensity={5} {...props} />
  }

  //thanks to react drei docs for this example of video text
  function VideoText({ ...props }) {
    const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/skate_vid.mp4', crossOrigin: 'Anonymous', loop: true, muted: true }));
    useEffect(() => void (video.play()), [video])
    return (
      <Text font="/SFCompact.ttf" fontSize={2.2} letterSpacing={-0.06} {...props}>
        curbs
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
        </meshBasicMaterial>
      </Text>
    )
  }
}

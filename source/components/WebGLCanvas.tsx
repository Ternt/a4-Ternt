import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

export function Model({...props}) {
    const { nodes } = useGLTF('/card.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube.geometry}
                material={nodes.Cube.material}
                rotation={[-Math.PI / 2 - Math.PI/10, 0, 0]}
            />
        </group>
    )
}

export default function WebGLCanvas() {
    return (
        <Canvas camera={{ fov: 50, position: [0, 0.5, 5.2] }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />

            <Model/>
            <OrbitControls
                enableDamping={ true }
                dampingFactor={ 0.05 }
                maxPolarAngle={ Math.PI/2 }
                minPolarAngle={ Math.PI/2 }
            />
        </Canvas>
    );
}

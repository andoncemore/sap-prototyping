'use client'

import { Canvas } from '@react-three/fiber'
import RotateMesh from '../../../src/components/RotateMesh'
import { useTexture } from '@react-three/drei'
import handDrawn from '../../../src/assets/Untitled_Artwork.png'

function DrawnEarth(){

    let containerStyle = {
        height: '100%',
        width: '100%',
        position: 'relative',
        background: 'white'
    }

    return (
        <div style={containerStyle}>
            <Canvas camera={{fov: 40, near: 0.1, far: 1000, position: [0,0, 24]}}>
            <ambientLight intensity={0.1} />
            <pointLight position={[0,0,50]} />
            <RotateMesh position={[0,0,0]}>
                <EarthMesh />
            </RotateMesh>
            </Canvas>
        </div>
        
    )
}


function EarthMesh(){
    const texture = useTexture(handDrawn.src)
    return(
        <mesh>
            <sphereBufferGeometry args={[5,15,15]}/>
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

export default DrawnEarth;
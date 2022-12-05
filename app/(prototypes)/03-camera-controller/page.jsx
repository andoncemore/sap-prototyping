'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, a } from "@react-spring/three"
import { useWheel, usePinch } from '@use-gesture/react'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { usePopoverStyles } from '@chakra-ui/react'


const Box = ({position, color, api}) => {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    const { nodes, materials} = useGLTF('/model.gltf');
    console.log(position);
    return(
        <a.mesh 
            onPointerOver={() => api.start({color:'green'})} 
            onPointerOut={() => api.start({color:'gray'})}
            position={[-4,-3,0]}
            geometry={nodes['SUIT-lowpoly005_1'].geometry}
            scale={0.012}
            rotation={position}
            onClick={() => api.start({position: [0, Math.PI/2, 0], rot: [0, -Math.PI/2, 0]})}
        >
            {/* <boxBufferGeometry args={[3,5,1]} /> */}
            <a.meshBasicMaterial color={color} wireframe/>
        </a.mesh>
    )
}

// const Sphere = ({position}) => {
//     return(
//         <a.mesh 
//             onPointerOver={() => api.start({color:'green'})} 
//             onPointerOut={() => api.start({color:'gray'})}
//             position={position}
//         >
//             <boxBufferGeometry args={[3,5,1]} />
//             <a.meshBasicMaterial color={color} wireframe/>
//         </a.mesh>
//     )
// }


function Gestures() {
    const [styles, api] = useSpring(() => ({color: 'gray', position: [0,0,0], rot: [0,0,0]}));
    const bind = useWheel(({movement: [mx,my], last, offset: [ox, oy] }) => {
        api.start({position: [0, Math.min(Math.max(oy,-300),300)/300*Math.PI/2, 0], rot:[0, -Math.min(Math.max(oy,-300),300)/300*Math.PI/2, 0]  });
    },{
        bounds: { top: -300, bottom: 300}
    })

    const bind2 = usePinch(({offset}) => {
        console.log(offset);
    },{
        eventOptions: {passive: false}
    })

    return (
        <Canvas {...bind()} style={{touchAction: 'none'}}>
            <PerspectiveCamera makeDefault fov={85} near={0.1} far={1000} position={[0,0,8]} />
            <a.group rotation={styles.position} >
                <Box color={styles.color} api={api} position={styles.rot} />
                <mesh 
                    position={[3,0,0]}
                    onClick={() => api.start({position: [0, -Math.PI/2, 0], rot: [0, Math.PI/2, 0]})}
                >
                    <sphereGeometry args={[3,8,8]} />
                    <meshBasicMaterial color="gray" wireframe/>
                </mesh>
            </a.group>
            
        </Canvas>
    )
}

export default Gestures;
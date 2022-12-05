import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useSpring } from "@react-spring/three"
import { useDrag } from '@use-gesture/react'


function RotateMesh({axis = new THREE.Vector3(), ...props}){
    const [styles, api] = useSpring(() => ({axis: [0,0,0], magnitude: 0}));
    const mesh = useRef(null);

    const { viewport } = useThree()
    const { width, height, factor } = viewport

    const bind = useDrag(({ delta: [dx,dy] }) => {
        api.start({axis: [dy,dx,0], magnitude: Math.sqrt(dx*dx + dy*dy) });
    },{
        transform: ([x, y]) => [x / factor, y / factor]
    })

    useFrame(() => {
        mesh.current.rotateOnWorldAxis(axis.fromArray(styles.axis.get()).normalize(), styles.magnitude.get());
    })

    return (
        <group {...bind()} ref={mesh} {...props}>
            {props.children}
        </group>
    )
}

export default RotateMesh;
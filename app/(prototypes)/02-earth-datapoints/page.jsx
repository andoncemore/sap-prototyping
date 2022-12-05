'use client'

import {useMemo} from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import RotateMesh from '../../../src/components/RotateMesh'
import handDrawn from '../../../src/assets/Untitled_Artwork.png'

import country from '../../../src/datasets/country.json'
import centroids from '../../../src/datasets/centroids.json'


function EarthDatapoints(){
    const earthRadius = 5.0;

    const marker = useMemo(() => new THREE.SphereGeometry(0.05, 15,15), []);

    let containerStyle = {
        height: '100%',
        width: '100%',
        position: 'relative',
        background: 'white'
    }

    const getCartesianPosition = (countryName) => {
        let centroid = centroids.find(center => center['COUNTRYAFF'].includes(countryName) || center['COUNTRY'].includes(countryName));
        return [
            earthRadius * Math.cos(centroid['longitude']*Math.PI/180) * Math.cos(centroid['latitude']*Math.PI/180),
            earthRadius*Math.sin(centroid['latitude']*Math.PI/180),
            -earthRadius * Math.cos(centroid['latitude']*Math.PI/180) * Math.sin(centroid['longitude']*Math.PI/180),
        ];
    }

    return (
        <div style={containerStyle}>
            <Canvas camera={{fov: 40, near: 0.1, far: 1000, position: [0,0, 24]}}>
                <ambientLight intensity={0.1} />
                <pointLight position={[0,0,50]} />
                <RotateMesh position={[0,0,0]}>
                    <EarthMesh earthRadius={earthRadius} />
                    {country.map(c =>
                        <mesh geometry={marker} position={getCartesianPosition(c['title'])} key={c['title']}>
                            <meshStandardMaterial color="black" />
                        </mesh>
                    )}
                </RotateMesh>
            </Canvas>
        </div>
    )
}

function EarthMesh({earthRadius}){
    const texture = useTexture(handDrawn.src)
    return(
        <mesh>
            <sphereBufferGeometry args={[earthRadius,15,15]}/>
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

export default EarthDatapoints;
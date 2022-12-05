'use client';

import cssStyles from './prototype.module.css'
import {useMemo, useState} from 'react'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import RotateMesh from '../../../src/components/RotateMesh'
import { Points, Point, PointMaterial, useTexture } from '@react-three/drei'
import {useSpring, animated} from '@react-spring/three'

import { 
    Button,
    NumberInput, 
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    ChakraProvider
} from '@chakra-ui/react'


import untitledArtwork from '../../../src/assets/Untitled_Artwork.png'
import spriteTree from '../../../src/assets/sprite_tree.png'
import spriteSpaceship from '../../../src/assets/sprite_spaceship.png'



import country from '../../../src/datasets/country.json'
import centroids from '../../../src/datasets/centroids.json'

const AnimatedPointMaterial = animated(PointMaterial)

export default function EarthCountrySprites() {

  const [spriteSize, setSpriteSize] = useState(15);
  const [styles, api] = useSpring(() => ({size: 15, config: {
    mass: 3,
    tension: 100,
    friction: 12,
    velocity: 0.001
  }}));

  const shipStyles = useSpring({
    from: { angle: 0},
    to: { angle: 2*Math.PI},
    loop: true,
    config: {duration:20000}
  });
  


  const earthRadius = 5.0;
  const testIndex = 20;

  const marker = useMemo(() => new THREE.SphereGeometry(0.05, 15,15), []);

  const getCartesianPosition = (countryName) => {
    let offset = 1.005;
    let centroid = centroids.find(center => center['COUNTRYAFF'].includes(countryName) || center['COUNTRY'].includes(countryName));
    return [
        (earthRadius*offset) * Math.cos(centroid['longitude']*Math.PI/180) * Math.cos(centroid['latitude']*Math.PI/180),
        (earthRadius*offset)*Math.sin(centroid['latitude']*Math.PI/180),
        -(earthRadius*offset) * Math.cos(centroid['latitude']*Math.PI/180) * Math.sin(centroid['longitude']*Math.PI/180),
    ];
  }

  const animateInSprites = () => {
    api.start({ from: 0, to: spriteSize })
  }

  return (
    <ChakraProvider>
      <div className={cssStyles.container}>
        <div className={cssStyles.controls}>
          <p>Sprite Size:</p>
          <NumberInput value={spriteSize} min={5} max={60} step={5} size='sm' onChange={(evt) => {setSpriteSize(parseInt(evt)); api.start({size: parseInt(evt)})}}>
              <NumberInputField />
              <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
              </NumberInputStepper>
          </NumberInput>
          <Button colorScheme='blue' size='sm' onClick={animateInSprites}>Animate in Sprites</Button>
        </div>
        <Canvas camera={{fov: 40, near: 0.1, far: 1000, position: [0,0, 24]}}>
          <InnerCanvas earthRadius={earthRadius} testIndex={testIndex} styles={styles} getCartesianPosition={getCartesianPosition} shipStyles={shipStyles} />
        </Canvas>
      </div>
    </ChakraProvider>
  )
}

function InnerCanvas({earthRadius, testIndex, styles, getCartesianPosition, shipStyles}){
  const texture = useTexture(untitledArtwork.src);
  const spriteMap = useTexture(spriteTree.src)
  const spaceshipMap = useTexture(spriteSpaceship.src);
  return(
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0,0,50]} />
      <animated.sprite 
        position={shipStyles.angle.to(v => [(earthRadius+2)*Math.cos(v),(earthRadius+2)*Math.sin(v), 0])} 
        center={[0.5, 0]} 
        scale={[3.22*0.025,0.025,0]}
      >
        <animated.spriteMaterial map={spaceshipMap} sizeAttenuation={false} depthWrite={false} rotation={shipStyles.angle.to(v => v-Math.PI/2)}/>
      </animated.sprite>
      <RotateMesh position={[0,0,0]}>
        <mesh>
          <sphereBufferGeometry args={[earthRadius,15,15]}/>
          <meshStandardMaterial map={texture} />
        </mesh>
        <sprite position={getCartesianPosition(country[testIndex]['title'])} center={[0.5, 0]} scale={[0.03,0.03,0.03]}>
          <spriteMaterial map={spriteMap} sizeAttenuation={false} depthWrite={false} rotation={0}/>
        </sprite>
        <Points center={[0.5, 0]}>
          {/* <PointMaterial map={spriteMap} size={spriteSize} depthWrite={false} sizeAttenuation={false} transparent /> */}
          {/* <PointMaterial depthWrite={false} size={15} sizeAttenuation={false} transparent  /> */}
          <AnimatedPointMaterial vertexColors depthWrite={false} sizeAttenuation={false} transparent {...styles} />
          {country.map(c =>
              <Point position={getCartesianPosition(c['title'])} key={c['title']} color="blue" />
          )}
        </Points>
      </RotateMesh>
    </>
  )
}

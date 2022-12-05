'use client';

import {useMemo, useEffect, useState} from 'react'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import RotateMesh from '../../../src/components/RotateMesh'

import { Points, Point, PointMaterial, useTexture } from '@react-three/drei'
import {useSpring, animated} from '@react-spring/three'

import { 
  ChakraProvider,
  Button,
  NumberInput, 
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'

import treeMap from './tree_map.png'
import spriteTree from '../../../src/assets/sprite_tree.png'
import gibsVegitation from '../../../src/assets/gibs_vegitation.png'


const AnimatedPointMaterial = animated(PointMaterial)

import cssStyles from './tree-sprites.module.css'

export default function GibsVegitation() {
  const [spriteSize, setSpriteSize] = useState(30);
  const [coverage, setCoverage] = useState(50);
  const [styles, api] = useSpring(() => ({size: 30, config: {
    mass: 3,
    tension: 100,
    friction: 12,
    velocity: 0.001
  }}));
  const [treePositions, setTreePositions] = useState([]);



  const earthRadius = 5.0;
  const testIndex = 20;

  const marker = useMemo(() => new THREE.SphereGeometry(0.05, 15,15), []);

  function latLongToCartesian(long,lat,radius){
    return [
      radius * Math.cos(long*Math.PI/180) * Math.cos(lat*Math.PI/180),
      radius*Math.sin(lat*Math.PI/180),
      -radius * Math.cos(lat*Math.PI/180) * Math.sin(long*Math.PI/180),
    ];
  }


  useEffect(() => {
    let offset = 1.005;
    var treeImage = new Image();
    treeImage.crossOrigin = 'anonymous';
    treeImage.src = treeMap.src;
    const canvas = document.createElement('canvas');

    treeImage.onload = function(){
      console.log("Loaded");
      canvas.width = treeImage.width;
      canvas.height = treeImage.height;
      var context = canvas.getContext('2d');
      context.drawImage(treeImage, 0, 0);
      var pixels = context.getImageData(0,0,treeImage.width, treeImage.height);
      let treePos = [];
      for (let y=0; y<treeImage.height; y+=coverage){
        for (let x=0; x<treeImage.width; x+=coverage){
          let red = y * (treeImage.width * 4) + x * 4;
          let avg = (pixels.data[red]+pixels.data[red+1]+pixels.data[red+2])/3;
          if(avg == 0){
              treePos.push(latLongToCartesian(x/treeImage.width*360-180,(treeImage.height-y)/treeImage.height*180-90,earthRadius*1.005))
              // let angleY = x/treeImage.width*2*Math.PI - Math.PI;
              // let angleX = y/treeImage.height*Math.PI - Math.PI/2;
          }
        }
      }
      console.log(treePos);
      setTreePositions(treePos);
    }
  }, [coverage])

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
          <p>Tree Spacing:</p>
          <NumberInput value={coverage} min={20} max={100} step={5} size='sm' onChange={(evt) => setCoverage(parseInt(evt))}>
              <NumberInputField />
              <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
              </NumberInputStepper>
          </NumberInput>
          <Button colorScheme='blue' size='sm' onClick={animateInSprites}>Animate in Sprites</Button>
        </div>
        <Canvas camera={{fov: 40, near: 0.1, far: 1000, position: [0,0, 24]}}>
          <InnerCanvas earthRadius={earthRadius} treePositions={treePositions} styles={styles} />
        </Canvas>
      </div>
    </ChakraProvider>
  )
}

function InnerCanvas({earthRadius, treePositions, styles}){
  const texture = useTexture(gibsVegitation.src);
  const spriteMap = useTexture(spriteTree.src);

  return(
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0,0,50]} />
      <RotateMesh position={[0,0,0]}>
        <mesh>
          <sphereBufferGeometry args={[earthRadius,15,15]}/>
          <meshStandardMaterial map={texture} />
        </mesh>
        {/* <sprite position={getCartesianPosition(country[testIndex]['title'])} center={[0.5, 0]} scale={[0.03,0.03,0.03]}>
          <spriteMaterial map={spriteMap} sizeAttenuation={false} depthWrite={false} rotation={0}/>
        </sprite> */}
        <Points center={[0.5, 0]} limit={2000} range={2000} >
          <AnimatedPointMaterial  map={spriteMap} depthWrite={false} sizeAttenuation={false} transparent {...styles} />
          {treePositions.map((c, index) =>
              <Point position={c} key={index} />
          )}
        </Points>
      </RotateMesh>
    </>
  )
}

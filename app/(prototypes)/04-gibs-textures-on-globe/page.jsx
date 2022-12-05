'use client';

import cssStyles from './gibs-textures.module.css'
import { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

import * as THREE from 'three'
import RotateMesh from '../../../src/components/RotateMesh'


import handDrawn from '../../../src/assets/gibs_vegitation.png'
import layersColorMap from './concept1_layers_colormap.png'
import halftone from './concept2_halftone_colormap.png'
import precipitation from './GLDAS_Surface_Total_Precipitation_Rate_Monthly.jpg'
import temperature from './MODIS_Aqua_L3_Land_Surface_Temp_Monthly_Day.jpg'
import vegetation from  './MODIS_Aqua_L3_NDVI_Monthly.jpg'


const DataSphere = ({layer}) => {

  const meshRef = useRef(null)
  const date = "2021-06-26";

  useEffect(() => {
    fetch(`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?version=1.3.0&service=WMS&request=GetMap&format=image/png&STYLE=default&bbox=-90,-180,90,180&CRS=EPSG:4326&HEIGHT=2000&WIDTH=4000&TIME=${date}&layers=${layer},MODIS_Water_Mask&transparent=true`)
    .then(response => response.blob())
    .then(blob => new THREE.TextureLoader().loadAsync(URL.createObjectURL(blob)))
    .then(texture => {
      console.log(texture);
      meshRef.current.material = new THREE.MeshBasicMaterial({ map: texture });
    });
  },[])

  return(
    <Suspense fallback={null}>
      <mesh ref={meshRef}>
          <sphereBufferGeometry args={[3,15,15]}/>
          <meshStandardMaterial color="green" />
      </mesh>
    </Suspense>
  )
}

const PhotoshopSphere = ({textures, ...props}) => {
  // const colorMap = useLoader(THREE.TextureLoader, '/Untitled_Artwork.png');
  // Object.keys(textures).forEach((name) => {
  //   textures[name] = useLoader(THREE.TextureLoader, textures[name])
  // });
  // console.log(textures);
  const tex = useTexture(textures);

  return(
    <Suspense fallback={null}>
      <mesh>
        <sphereBufferGeometry args={[3,30,30]}/>
        <meshStandardMaterial map={tex} {...props} />
      </mesh>
    </Suspense>

  )
}


export default function Rotatables() {

  return (
    <div className={cssStyles.container}>
      <Canvas camera={{ fov: 40, near: 0.1, far: 1000, position: [0, 0, 24] }} flat>
        <ambientLight intensity={0.5} />
        <pointLight position={[0,30,50]} />
        <RotateMesh position={[-8,4,0]}>
          {/* <DataSphere layer="GLDAS_Surface_Total_Precipitation_Rate_Monthly" /> */}
          <PhotoshopSphere textures={handDrawn.src}/>
        </RotateMesh>
        <RotateMesh position={[0,4,0]}>
          {/* <DataSphere layer="MODIS_Aqua_L3_Land_Surface_Temp_Monthly_Day" /> */}
          <PhotoshopSphere textures={layersColorMap.src} displacementScale={0.5}/>
        </RotateMesh>
        <RotateMesh position={[8,4,0]}>
          <PhotoshopSphere textures={halftone.src}/>
          {/* <DataSphere layer="MODIS_Aqua_L3_NDVI_Monthly" /> */}
        </RotateMesh>
        <RotateMesh position={[8,-4,0]}>
          {/* <DataSphere layer="IMERG_Precipitation_Rate" /> */}
          <PhotoshopSphere textures={precipitation.src}/>
        </RotateMesh>
        <RotateMesh position={[0,-4,0]}>
          {/* <DataSphere layer="MODIS_Aqua_L3_Land_Surface_Temp_8Day_Day" /> */}
          <PhotoshopSphere textures={temperature.src}/>
        </RotateMesh>
        <RotateMesh position={[-8,-4,0]}>
          {/* <DataSphere layer="IMERG_Precipitation_Rate" /> */}
          <PhotoshopSphere textures={vegetation.src}/>
        </RotateMesh>
      </Canvas>
    </div>
  )
}

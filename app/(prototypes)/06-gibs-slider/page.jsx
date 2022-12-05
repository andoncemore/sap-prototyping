'use client'

import cssStyles from './gibs-slider.module.css'
import {useMemo, useState} from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import RotateMesh from '../../../src/components/RotateMesh'
import handDrawn from '../../../src/assets/Untitled_Artwork.png'
import temperature from '../../../src/assets/MODIS_Aqua_L3_Land_Surface_Temp_Monthly_Day.png'
import vegetation from '../../../src/assets/MODIS_Aqua_L3_NDVI_Monthly.png'
import precipitation from '../../../src/assets/GLDAS_Surface_Total_Precipitation_Rate_Monthly.png'
import * as Slider from '@radix-ui/react-slider';
import centroids from '../../../src/datasets/centroids.json'
import gibs from '../../../src/datasets/gibs_country.json'
import Dropdown from '../../../src/components/Dropdown'

function GibsSlider(){

    const [target,setTarget] = useState(50);
    const [set, setSet] = useState(1);

    const gibsDatasets = [
        {name: 'MODIS_Aqua_L3_Land_Surface_Temp_Monthly_Day', range: [-8,55], units: '°C', step: 1, texture: temperature.src},
        {name: 'MODIS_Aqua_L3_NDVI_Monthly', range: [0,100], units: '%', step: 1, texture: vegetation.src},
        {name: 'GLDAS_Surface_Total_Precipitation_Rate_Monthly', range: [0,12.6], units: ' mm/day', step: 0.1, texture: precipitation.src}
    ];

    const dropdownOptions = [
        {id: 0, name: 'Land Temperature'},
        {id: 1, name: 'Vegetation Index'},
        {id: 2, name: 'Surface Precipitation'}
    ];

    const changeSet = (newSet) => {
        setTarget((gibsDatasets[newSet].range[1] - gibsDatasets[newSet].range[0])/2);
        setSet(newSet);
    }


    const getCountries = () => {
        let dist = (gibsDatasets[set].range[1] - gibsDatasets[set].range[0])*0.02;
        let filtered = Object.keys(gibs).filter(country => 
            gibs[country][gibsDatasets[set].name] > (target-dist)  && gibs[country][gibsDatasets[set].name] < (target+dist)
        );
        return filtered.sort((a,b) => Math.abs(target - gibs[a][gibsDatasets[set].name]) - Math.abs(target - gibs[b][gibsDatasets[set].name]))
            .map((country) => ({...gibs[country], country: country}))
    }

    return(
        <div className={cssStyles.container}>
            <div className={cssStyles.content}>
                <EarthDatapoints country={getCountries()} texture={gibsDatasets[set].texture} />
            </div>
            <div className={cssStyles.sidebar}>
                <Dropdown value={set} options={dropdownOptions} setValue={changeSet} ignorePlaceholder={true}/>
                <div className={cssStyles.SliderLabeled}>
                    <p>{`${gibsDatasets[set].range[0]}${gibsDatasets[set].units}`}</p>
                    <CustomSlider 
                        min={gibsDatasets[set].range[0]} 
                        max={gibsDatasets[set].range[1]} 
                        step={gibsDatasets[set].step} 
                        value={target} 
                        setValue={(val) => setTarget(val[0])} />
                    <p>{`${gibsDatasets[set].range[1]}${gibsDatasets[set].units}`}</p>
                </div>
                <ul>
                    {getCountries().map((country, index) => 
                        <li key={`${country.iso}${index}`}>{`${country.country} - ${country[gibsDatasets[set].name]}${gibsDatasets[set].units}`}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

function EarthDatapoints({country, texture}){
    const earthRadius = 5.0;

    const marker = useMemo(() => new THREE.SphereGeometry(0.1, 20,20), []);


    const getCartesianPosition = (countryName) => {
        let centroid = centroids.find(center => center['COUNTRYAFF'].includes(countryName) || center['COUNTRY'].includes(countryName));
        if (centroid == null) return null;
        return [
            earthRadius * Math.cos(centroid['longitude']*Math.PI/180) * Math.cos(centroid['latitude']*Math.PI/180),
            earthRadius*Math.sin(centroid['latitude']*Math.PI/180),
            -earthRadius * Math.cos(centroid['latitude']*Math.PI/180) * Math.sin(centroid['longitude']*Math.PI/180),
        ];
    }

    return (
        <Canvas camera={{fov: 40, near: 0.1, far: 1000, position: [0,0, 24]}}>
            <ambientLight intensity={0.1} />
            <pointLight position={[0,0,50]} />
            <RotateMesh position={[0,0,0]}>
                <EarthMesh earthRadius={earthRadius} tex={texture} />
                {country.map((c, index) => {
                    let data = getCartesianPosition(c['country']);

                    if(data == null){
                        let data = [0,0,0]
                    }
                    return (<mesh geometry={marker} position={data} key={`${c.iso}${index}`}>
                        <meshStandardMaterial color="black" />
                    </mesh>)
                }

                )}
            </RotateMesh>
        </Canvas>
    )
}

function EarthMesh({earthRadius, tex}){
    const texture = useTexture(tex)
    return(
        <mesh>
            <sphereBufferGeometry args={[earthRadius,15,15]}/>
            <meshStandardMaterial map={texture} color="white" />
        </mesh>
    )
}

function CustomSlider({min, max, step, value, setValue}){
    return(
        <Slider.Root className={cssStyles.SliderRoot} max={max} min={min} step={step} value={[value]} onValueChange={setValue} aria-label="Volume">
            <Slider.Track className={cssStyles.SliderTrack}>
                <Slider.Range className={cssStyles.SliderRange} />
            </Slider.Track>
            <Slider.Thumb className={cssStyles.SliderThumb} />
        </Slider.Root>
    )
}



export default GibsSlider;
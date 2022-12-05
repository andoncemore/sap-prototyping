'use client'

import React, { useState } from 'react';
import './globals.css'
import styles from './layout.module.css'
import { DM_Sans } from '@next/font/google'
import useSWR from 'swr';
import Toggle from '../src/components/Toggle'
import Dropdown from '../src/components/Dropdown'
import { DoubleArrowRightIcon, DoubleArrowLeftIcon, PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { useRouter, usePathname } from 'next/navigation';


const dmsans = DM_Sans({
  weight: ['400', '500','700'],
  style: ['normal'],
  subsets: ['latin']
})

const fetcher = (url) => fetch(url).then(res => res.json());

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [autoPlay, setAutoPlay] = useState(false);
  const { data, error } = useSWR('/api/navigation', fetcher);
  const router = useRouter();

  const switchPrototypes = (id) => {
    router.push(`\\${id}`)
  }

  const nextPage = () => {
    let currentIndex = data.keys.findIndex((elt) => elt == pathname.split('/')[1]);
    let next = (currentIndex+1)%(data.keys.length);
    router.push(`\\${data.keys[next]}`)
  }

  const prevPage = () => {
    let currentIndex = data.keys.findIndex((elt) => elt == pathname.split('/')[1]);
    let next = currentIndex <= 0  ? data.keys.length - 1 : currentIndex - 1;
    router.push(`\\${data.keys[next]}`);
  }

  return (
    <html lang="en" className={dmsans.className}>
      <head />
      <body>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Dropdown 
              className={styles.dropdown} 
              options={data ? data.keys.map(k => ({id: k, name: data.data[k].title})) : []} 
              value={pathname.split('/')[1]}
              setValue={switchPrototypes}
            />
            <p>{pathname.split('/')[1] != '' && data ? data.data[pathname.split('/')[1]].description : ''}</p>
            <div className={styles.controls}>
              <button className={styles.button} onClick={() => prevPage()}><DoubleArrowLeftIcon /></button>
              <Toggle icon1={<PlayIcon />} icon2={<PauseIcon />} pressed={autoPlay} setPressed={setAutoPlay}  />
              <button className={styles.button} onClick={() => nextPage()}><DoubleArrowRightIcon /></button>
            </div>
            <div 
              className={`${styles.loading} ${autoPlay ? styles.start : ''}`}
              onAnimationEnd={(evt) => nextPage()}
              key={Math.random()}
            >
            </div>
          </nav>
          <div className={styles.content}>
            {children}
          </div>
          
        </div>
      </body>
    </html>
  )
}

'use client'

import React from 'react';
import * as PrimitiveToggle from '@radix-ui/react-toggle';
import styles from './Toggle.module.css'

const Toggle = ({icon1, icon2, pressed, setPressed}) => {
    return (
        <PrimitiveToggle.Root className={styles.toggle} pressed={pressed} onPressedChange={(evt) => setPressed(evt)}>
            {pressed ? icon2 : icon1}
        </PrimitiveToggle.Root>
    )
};

export default Toggle;
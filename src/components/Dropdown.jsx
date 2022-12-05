'use client'

import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@radix-ui/react-icons';
import styles from './Dropdown.module.css'

const Dropdown = ({className, options, value, setValue, ignorePlaceholder}) => {
    return (
        <SelectPrimitive.Root value={value} onValueChange={(evt) => setValue(evt)}>

            <SelectPrimitive.Trigger className={`${styles.trigger} ${className}`}>
                <SelectPrimitive.Value />
                <SelectPrimitive.Icon> <ChevronDownIcon /> </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content className={styles.content}>
                    <SelectPrimitive.ScrollUpButton> <ChevronUpIcon /> </SelectPrimitive.ScrollUpButton>
                    <SelectPrimitive.Viewport className={styles.viewport}>
                        {!ignorePlaceholder && <SelectPrimitive.Item value='' className={`${styles.item} ${styles.placeholder}`}>
                            <SelectPrimitive.ItemText>Select Prototype</ SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>}
                        {options.map((option, index) =>
                            <SelectPrimitive.Item key={option.id} value={option.id} className={styles.item}>
                                <SelectPrimitive.ItemIndicator className={styles.itemIndicator}> <CheckIcon /> </SelectPrimitive.ItemIndicator>
                                <SelectPrimitive.ItemText>{option.name}</ SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        )}
                    </SelectPrimitive.Viewport>
                    <SelectPrimitive.ScrollDownButton> <ChevronDownIcon /> </SelectPrimitive.ScrollDownButton>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>

        </SelectPrimitive.Root>
    )
};

export default Dropdown;
import React from 'react';
import styles from './GradientBorderWrapper.module.css';
export default function GradientBorderWrapper({children}) {
    return <div className={styles.gradientWrap}>{children}</div>;
}

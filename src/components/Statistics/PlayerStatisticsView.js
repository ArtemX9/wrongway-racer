import React from 'react';
import styles from './PlayerStatisticsView.module.css';

export default function PlayerStatisticsView() {
    return (
        <div className={styles.container}>
            <div className={styles.recordTimeContainer}>
                <div className={styles.recordTimeResult}>
                    3:44
                </div>
                <div className={styles.recordTimeText}>
                    Your Last record
                </div>
            </div>
            <div>
                <div className={styles.rankRoundContainer}>
                    <div className={styles.rankResult}>
                        #144th
                    </div>
                    <div className={styles.rankResultFrom}>
                        from 15k
                    </div>
                </div>
            </div>
        </div>
    );
}

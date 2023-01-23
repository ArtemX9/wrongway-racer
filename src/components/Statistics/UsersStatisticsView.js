import React from 'react';
import styles from './UsersStatisticsView.module.css'

const getRankEnding = (rank) => {
    switch (rank) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function UsersStatisticsView({playersData}) {
    function renderUserLine(user, index) {
        return (
            <div
                key={`${user.name} - ${index}`}
                className={styles.userLine}
            >
                <div className={styles.userNamePart}>
                    {user.name}
                </div>
                <div className={styles.recordPart}>
                    <div className={styles.recordHeader}>
                        Record
                    </div>
                    <div className={styles.recordResult}>
                        {user.record}
                    </div>
                </div>
                <div className={styles.rankPart}>
                    <div className={styles.rankHeader}>
                        Rank
                    </div>
                    <div className={styles.rankResult}>
                        {user.rank}{getRankEnding(user.rank)}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.container}>
            {playersData.map(renderUserLine)}
        </div>
    );
}

export default React.memo(UsersStatisticsView);

import React, {useState} from 'react';
import PlayerStatisticsView from "./PlayerStatisticsView";
import UsersStatisticsView from "./UsersStatisticsView";
import {listenForPlayers} from "../../socketClient";
import styles from './StatisticsContainer.module.css';

export default function StatisticsContainer() {
    const [playersData, setPlayersData] = useState([]);
    listenForPlayers.addListener(handlePlayerDataUpdate);

    function handlePlayerDataUpdate(players) {
        setPlayersData(players.sort((a, b) => {
            if (a.rank > b.rank) return 1;
            if (a.rank < b.rank) return -1;
            return 0;
        }));
    }

    return <div className={styles.container}>
        <PlayerStatisticsView/>
        <UsersStatisticsView playersData={playersData}/>
    </div>;
}

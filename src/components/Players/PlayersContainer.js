import React, {useState} from 'react';
import {listenForPlayers} from "../../socketClient";
import DefaultAvatar from '../../assets/img/defafult_avatar.png';
import { ReactComponent as SettingsIcon } from './Vector.svg';
import styles from './PlayersContainer.module.css';

export default function PlayersContainer() {
    const [playersData, setPlayersData] = useState([]);
    listenForPlayers.addListener(handlePlayerDataUpdate);
    function handlePlayerDataUpdate(players) {
        setPlayersData(players);
    }

    function renderPlayerLine(playerInfo, index) {
        return (
            <div key={index} className={styles.playerInfoLine}>
                <div className={styles.playerAvatar}>
                    <Avatar src={playerInfo.avatar} size={24} />
                </div>
                <div className={styles.playerName}>
                    {playerInfo.name}
                </div>
            </div>
        )
    }

    function renderSettingsButton() {
        return (
            <div className={styles.settingsButtonOuter}>
                <div className={styles.settingsButtonInner}>
                    <SettingsIcon /> Settings
                </div>
            </div>
        )
    }

    return (
        <div className={styles.playersContainer}>
            <div className={styles.headerContainer}>
                <div>
                    Players
                </div>
                <div>
                    {playersData.length}/12
                </div>
            </div>
            <div className={styles.settingsButtonContainer}>{renderSettingsButton()}</div>
            <div className={styles.playersListContainer}>
                {playersData.map(renderPlayerLine)}
            </div>
        </div>
    )
}

function Avatar({src, size}) {
    const [imgSrc, setImgSrc] = useState(src);
    const handleError = () => {
        setImgSrc(DefaultAvatar);
    }
    return <img style={{width: size, height: size}} src={imgSrc} onError={handleError}/>
}

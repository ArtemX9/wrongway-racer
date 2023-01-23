import React, {useEffect, useRef} from "react";
import { Assets } from 'pixi.js';
import {GameEngine} from "./gameEngine";
import {listenForEnemyAppear} from "../../socketClient";
import styles from './GameView.module.css';

function handleGameEnd(game) {
    setTimeout(() => {
        game.start();
    }, 3000);
}

function GameView() {
    const gameViewRef = useRef(null);

    useEffect(()=> {
        const loadAssetsAndRenderGameView = async () => {
            const [enemyCarBundle, usersCarBundle, backgroundBundle, explosion] = await loadAssets();
            const game = new GameEngine(
                gameViewRef.current,
                [enemyCarBundle, usersCarBundle, backgroundBundle, explosion],
                listenForEnemyAppear,
                handleGameEnd
            );
            game.start();
        }
        loadAssetsAndRenderGameView();


    }, [])
    return <div className={styles.container} ref={gameViewRef}></div>
}

async function loadAssets() {
    Assets.addBundle('enemyCar', {
        enemyCarLeft: '../assets/images/cars/enemy_left.png',
        enemyCarCenter: '../assets/images/cars/enemy_center.png',
        enemyCarRight: '../assets/images/cars/enemy_right.png',
    });
    Assets.addBundle('usersCar', {
        carLeft: '../assets/images/cars/car_right.png',
        carCenter: '../assets/images/cars/car_center.png',
        carRight: '../assets/images/cars/car_left.png',
    });
    Assets.addBundle('background', {
        skyTexture: '../assets/images/sky.png',
        mountainFadeTexture:'../assets/images/mountain_fade.png',
        mountainLeftTexture: '../assets/images/mountain_left.png',
        mountainRightTexture: '../assets/images/mountain_right.png',
        roadTexture: '../assets/images/road.png',
        sideroadLeftTexture: '../assets/images/sideroad_left.png',
        sideroadRightTexture: '../assets/images/sideroad_right.png',
    });
    Assets.add('explosion', '../assets/images/explosion_spritesheet.avif');

    return await Promise.all([
        Assets.loadBundle('enemyCar'),
        Assets.loadBundle('usersCar'),
        Assets.loadBundle('background'),
        Assets.load('explosion')
    ]);
}

export default React.memo(GameView);

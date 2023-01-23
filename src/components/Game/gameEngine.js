import * as PIXI from 'pixi.js';
import {Logger} from "../../utils/logger.js";
import {listenForEnemyAppear} from "../../socketClient";

const logger = new Logger();

const { Application, Sprite, Texture } = PIXI;
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container



// console.log(utils.isMobile);

export class GameEngine {
    #app;
    #stage;

    #sky;
    #road;


    #userCarLeft;
    #userCarCenter;
    #userCarRight;

    #enemyCarLeft;
    #enemyCarCenter;
    #enemyCarRight;

    #userLanes;
    #currentUserLane = 1;

    #enemyLanes;
    #currentEnemyLane = -1;
    #enemyCarMaxTravelDistance;

    #enemyLeftCarShift = 45;
    #enemyCenterCarShift = 20;
    #enemyRightCarShift = 0;

    #stageSize;

    #onGameEnd;
    #backgroundBundle;
    constructor(gameScreenElement, [enemyCarBundle, usersCarBundle, backgroundBundle, explosion], onEnemyCreation, onGameEnd) {
        this.#app = new Application({
            width: 1120,
            height: 649,
        });
        this.#stage = this.#app.stage;

        this.#backgroundBundle = backgroundBundle;

        gameScreenElement.appendChild(this.#app.view);
        this.#renderStaticBackground(backgroundBundle);
        this.#stageSize = {
            width: this.#stage.width,
            height: this.#stage.height,
        }
        logger.log(this.#stageSize);
        this.#userCarLeft = this.#loadUserCar(usersCarBundle.carLeft, 300, explosion);
        this.#userCarCenter = this.#loadUserCar(usersCarBundle.carCenter, 10, explosion);
        this.#userCarRight = this.#loadUserCar(usersCarBundle.carRight, -250, explosion);

        this.#enemyCarMaxTravelDistance = this.#stage.height;
        this.#enemyCarLeft = this.#loadEnemyCar(enemyCarBundle.enemyCarLeft, this.#enemyLeftCarShift);
        this.#enemyCarCenter = this.#loadEnemyCar(enemyCarBundle.enemyCarCenter, this.#enemyCenterCarShift);
        this.#enemyCarRight = this.#loadEnemyCar(enemyCarBundle.enemyCarRight, this.#enemyRightCarShift);


        this.#userLanes = {
            0: this.#userCarLeft,
            1: this.#userCarCenter,
            2: this.#userCarRight,
        };

        this.#enemyLanes = {
            0: this.#enemyCarLeft,
            1: this.#enemyCarCenter,
            2: this.#enemyCarRight,
        };

        this.#onEnemyCreation = onEnemyCreation;
        this.#onGameEnd = onGameEnd;
    }

    #onEnemyCreation
    start() {
        logger.log('New game started');
        document.body.addEventListener('keydown', this.#handleKeyPress);
        this.#currentUserLane = 1;
        this.#stage.addChild(this.#userCarCenter);

        this.#onEnemyCreation.addListener(this.showEnemyCar)

        this.#app.ticker.add(this.#handleGameProcessTick);
        this.#app.ticker.add(this.#handleBackgroundAnimateTick);
        this.#renderMovingBackground(this.#backgroundBundle);
    }

    showEnemyCar = (atLane) => {
        switch (atLane) {
            case 'left':
                this.#stage.addChild(this.#enemyCarLeft);
                this.#currentEnemyLane = 0;
                break;
            case 'center':
                this.#stage.addChild(this.#enemyCarCenter);
                this.#currentEnemyLane = 1;
                break;
            case 'right':
                this.#stage.addChild(this.#enemyCarRight);
                this.#currentEnemyLane = 2;
                break;
        }
        logger.log(`Rendering enemy at lane ${atLane}`);
    }

    #handleBackgroundAnimateTick = (delta) => {
        this.#mountainLeft.x -= 3 * delta;
        this.#mountainLeft.y += 0.5 * delta;
        this.#mountainLeft.scale.set(this.#mountainLeft.scale.x + 0.00089 * delta)

        this.#mountainLeft.alpha += 0.1 * delta

        if (this.#mountainLeft.x < 0) {
            this.#mountainLeft.scale.set(0.025)
            this.#mountainLeft.x = this.#stageSize.width / 2 - 300;
            this.#mountainLeft.y = this.#stageSize.height / 2 - 80;
            this.#mountainLeft.alpha = 0.1
        }

        this.#sideroadLeft.x -= 1.5 * delta;
        this.#sideroadLeft.y += 0.5 * delta;

        if (this.#sideroadLeft.scale.x < 0.3) {
            this.#sideroadLeft.scale.set(this.#sideroadLeft.scale.x + 0.00045 * delta)
        }

        this.#sideroadLeft.alpha += 0.025 * delta;
        if (this.#sideroadLeft.x < 0) {
            this.#sideroadLeft.scale.set(0.025)

            this.#sideroadLeft.x = this.#stageSize.width / 2 - 320;
            this.#sideroadLeft.y = this.#stageSize.height / 2 - 60;
            this.#sideroadLeft.alpha = 0.1
        }

        this.#mountainRight.x += 4 * delta;
        this.#mountainRight.y += 1 * delta;
        this.#mountainRight.scale.set(this.#mountainRight.scale.x + 0.00089)

        this.#mountainRight.alpha += 0.1 * delta;
        if (this.#mountainRight.x > 1120) {
            this.#mountainRight.x = this.#stageSize.width / 2 - 150;
            this.#mountainRight.y = this.#stageSize.height / 2 - 80;
            this.#mountainRight.alpha = 0.1
            this.#mountainRight.scale.set(0.025)
        }

        this.#sideroadRight.x += 3 * delta;
        this.#sideroadRight.y += 0.5 * delta;
        if (this.#sideroadRight.scale.x < 0.3) {
            this.#sideroadRight.scale.set(this.#sideroadRight.scale.x + 0.00045 * delta)
        }
        this.#sideroadRight.alpha += 0.1 * delta;

        if (this.#sideroadRight.x  > 1120) {
            this.#sideroadRight.scale.set(0.025)

            this.#sideroadRight.x = this.#stageSize.width / 2 - 100;
            this.#sideroadRight.y = this.#stageSize.height / 2 - 50;
            this.#sideroadRight.alpha = 0.01
        }
    }

    #handleGameProcessTick = (delta) => {
        if (this.#currentEnemyLane === -1) {
            return;
        }
        const enemyCar = this.#enemyLanes[this.#currentEnemyLane];
        enemyCar.y += 3 * 1.1;

        if (this.#currentEnemyLane === 0) {
            enemyCar.x -= 2 * 1.6;
            enemyCar.scale.set(enemyCar.scale.x + 0.0085 * delta);
        } else if (this.#currentEnemyLane === 1) {
            enemyCar.x += 1;
            enemyCar.scale.set(enemyCar.scale.x + 0.0085 * delta);
        } else {
            enemyCar.x += 2 * 2.5;
            enemyCar.scale.set(enemyCar.scale.x + 0.008 * delta);
        }

        enemyCar.alpha += 0.03

        if (this.#currentUserLane === this.#currentEnemyLane) {
            const userCar = this.#userLanes[this.#currentUserLane];
            const userCarBound = userCar.getBounds();
            const enemyCarBound = enemyCar.getBounds();

            if (
                (enemyCarBound.y + (enemyCarBound.height / 2) * enemyCar.scale.y) >= (userCarBound.y - (userCarBound.height / 2) * userCar.scale.y) &&
                (enemyCarBound.y - (enemyCarBound.height / 2) * enemyCar.scale.y) <= (userCarBound.y + (userCarBound.height / 2) * userCar.scale.y)
            ) {
                logger.log('Car crashed');
                this.end();
            }
        }

        if (enemyCar.y > this.#enemyCarMaxTravelDistance) {
            logger.log('Reloading enemy car');
            enemyCar.alpha = 0.1;

            enemyCar.scale.set(0.15);

            let carShift;
            if (this.#currentEnemyLane === 0) {
                carShift = this.#enemyLeftCarShift;
            } else if (this.#currentEnemyLane === 1) {
                carShift = this.#enemyCenterCarShift;
            } else {
                carShift = this.#enemyRightCarShift;
            }

            enemyCar.x = (this.#app.renderer.width / 2) - (enemyCar.width / 2) - carShift;
            enemyCar.y = this.#app.renderer.height - this.#road.height;

            this.#stage.removeChild(enemyCar);
            this.#currentEnemyLane = -1
        }
    }

    end() {
        logger.log('Game ended');
        document.body.removeEventListener('keydown', this.#handleKeyPress);
        this.#stage.removeChild(this.#userLanes[this.#currentUserLane]);
        this.#stage.removeChild(this.#enemyLanes[this.#currentEnemyLane]);

        this.#stage.removeChild(this.#mountainRight);
        this.#stage.removeChild(this.#mountainLeft);
        this.#stage.removeChild(this.#sideroadRight);
        this.#stage.removeChild(this.#sideroadLeft);

        this.#currentUserLane = -1;
        this.#currentEnemyLane = -1;
        this.#onEnemyCreation.removeListener(this.showEnemyCar);
        this.#app.ticker.remove(this.#handleGameProcessTick);
        this.#app.ticker.remove(this.#handleBackgroundAnimateTick);
        this.#onGameEnd(this);
    }

    #moveUserCar(fromLane, toLane) {
        logger.log(`Moving car from lane ${fromLane} to ${toLane}`);

        this.#stage.addChild(this.#userLanes[toLane]);
        this.#stage.removeChild(this.#userLanes[fromLane]);
    }

    #mountainLeft;
    #sideroadLeft;
    #mountainRight;
    #sideroadRight;

    #renderMovingBackground(backgroundBundle) {
        this.#mountainLeft = new Sprite(backgroundBundle.mountainLeftTexture);
        this.#mountainLeft.anchor.set(0.5);
        this.#mountainLeft.x = this.#stageSize.width / 2 - 300;
        this.#mountainLeft.y = this.#stageSize.height / 2 - 80;
        this.#mountainLeft.width /= 40;
        this.#mountainLeft.height /= 40;
        this.#mountainLeft.alpha = 0.1

        this.#sideroadLeft = new Sprite(backgroundBundle.sideroadLeftTexture);
        this.#sideroadLeft.anchor.set(0.5);
        this.#sideroadLeft.x = this.#stageSize.width / 2 - 320;
        this.#sideroadLeft.y = this.#stageSize.height / 2 - 60;
        this.#sideroadLeft.width /= 40;
        this.#sideroadLeft.height /= 40;
        this.#sideroadLeft.alpha = 0.01;

        this.#mountainRight = new Sprite(backgroundBundle.mountainRightTexture);
        this.#mountainRight.anchor.set(0.5);
        this.#mountainRight.x = this.#stageSize.width / 2 - 150;
        this.#mountainRight.y = this.#stageSize.height / 2 - 80;
        this.#mountainRight.width /= 40;
        this.#mountainRight.height /= 40;
        this.#mountainRight.alpha = 0.1;

        this.#sideroadRight = new Sprite(backgroundBundle.sideroadRightTexture);
        this.#sideroadRight.anchor.set(0.5);
        this.#sideroadRight.x = this.#stageSize.width / 2 - 100;
        this.#sideroadRight.y = this.#stageSize.height / 2 - 50;
        this.#sideroadRight.width /= 40;
        this.#sideroadRight.height /= 40;
        this.#sideroadRight.alpha = 0.1;

        this.#stage.addChild(this.#mountainLeft);
        this.#stage.addChild(this.#sideroadLeft);

        this.#stage.addChild(this.#mountainRight);
        this.#stage.addChild(this.#sideroadRight);

    }

    #renderStaticBackground(backgroundBundle) {
        const roadHeight = 275;

        this.#sky = new Sprite(backgroundBundle.skyTexture);
        this.#sky.anchor.set(0.5);
        this.#sky.x = this.#app.renderer.height / 2 + 200;
        this.#sky.y = 300;
        this.#sky.height = this.#sky.height / 3;
        this.#sky.width = this.#sky.width / 3;

        const mountainFade = new Sprite(backgroundBundle.mountainFadeTexture);
        mountainFade.x = 0;
        mountainFade.y = this.#app.renderer.height / 2 - 200;
        mountainFade.height = this.#app.renderer.height / 2.5;
        mountainFade.width = this.#app.renderer.width * 1.2;

        this.#road = new Sprite(backgroundBundle.roadTexture);
        this.#road.anchor.set(0.5);
        this.#road.height = roadHeight;
        this.#road.width = this.#app.renderer.width * 1.3;
        this.#road.x = this.#app.renderer.width / 2;
        this.#road.y = 515;

        this.#stage.addChild(mountainFade);
        this.#stage.addChild(this.#sky);
        this.#stage.addChild(this.#road);
    }

    #loadUserCar(texture, paddingFromCenter, explosion) {
        const newCar = new Sprite(texture);
        newCar.anchor.set(0.5);
        newCar.scale.set(0.45);
        newCar.zIndex = 9999;

        // Setup the position of the bunny
        newCar.x = this.#app.renderer.width / 2 - paddingFromCenter;
        newCar.y = this.#app.renderer.height - (newCar.height / 2) - 20;
        // const animatedSprite = Texture.from(explosion);
        //
        // animatedSprite.anchor.set(0.5);
        // animatedSprite.loop = false;
        // animatedSprite.animationSpeed = 0.4;
        // animatedSprite.gotoAndPlay(0);
        return newCar;
    }

    #loadEnemyCar(texture, paddingFromCenter) {
        const newCar = new Sprite(texture);

        newCar.anchor.set(0.5);
        newCar.scale.set(0.15);
        newCar.alpha = 0.1;
        newCar.zIndex = 888;
        newCar.x = (this.#app.renderer.width / 2) - (newCar.width / 2) - paddingFromCenter;
        newCar.y = this.#app.renderer.height - this.#road.height;

        return newCar;
    }

    #handleKeyPress = ({key}) => {
        logger.log(`${key} was pressed`);
        const LEFT = 'ArrowLeft';
        const RIGHT = 'ArrowRight';
        const temp = this.#currentUserLane;
        switch (key) {
            case LEFT:
                this.#currentUserLane = Math.max(this.#currentUserLane - 1, 0);
                break;
            case RIGHT:
                this.#currentUserLane = Math.min(this.#currentUserLane + 1, 2);
                break;
            default:
                break;
        }
        if (this.#currentUserLane === temp) {
            return;
        }
        this.#moveUserCar(temp, this.#currentUserLane);
    }
}



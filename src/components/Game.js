import * as React from "react"; 
import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { constants } from "../globals/constants";
import { colors } from "../globals/colors";
import { Direction } from "../utils/direction";  
import { ShipClass } from "../Classes/ShipClass";
import { BulletClass } from "../Classes/BulletClass";
const screenWidth = Dimensions.get('window').width; 
const { 
    SHIP_SPEED, 
    SHIP_BOUNDS, 
    SHIP_Y, 
    alienRows, 
    alienCol, 
    canvasHeight, 
    alienSize,
    spaceBetweenAliens,
    initialAlienY,
    attackPeriod,
    agressionLevel,
    cellSize,
    SHIP_SIZE
} = constants;
export default function Game(){ 
    const [myMap, setMyMap] = useState(new Map([
        ['key1', {x: 10, y: 200}],
        ['key2', 'value2'],
        ['key3', 'value3']
    ]))
    // const [grid, setGrid] = useState([
    //     {xMin: 10, xMax: 100, yMin: 10, yMax: 100, ships: []}
    // ])
    const [ship, setShip] = useState(new ShipClass(100,SHIP_Y, SHIP_SIZE, SHIP_SIZE));
    const [bullets, setBullets] = useState([]); 
    const [aliens, setAliens] = useState([]); 

    const moveShip = (dir) => {
        let temp;
        if(dir === Direction.LEFT){
            if(ship.getX() - SHIP_BOUNDS < 0) return;
            setShip(prev => {
                temp = new ShipClass(prev.getX() - SHIP_SPEED, prev.y, SHIP_SIZE, SHIP_SIZE);
                return temp; 
            })
        }else if(dir === Direction.RIGHT){
            if(ship.getX() + ship.getWidth() + SHIP_BOUNDS > screenWidth) return;
            setShip(prev => {
                temp = new ShipClass(prev.getX() + SHIP_SPEED, prev.y, SHIP_SIZE, SHIP_SIZE);
                return temp; 
            })
        }
    }
    
    const shoot = (shooter,isAlien) => {
        const bullet = {x: shooter.x + (shooter.size / 2), y: shooter.y}; 
        if(isAlien){
            bullet['dir'] = 1; 
            bullet.y += shooter.size;
            bullet['color'] = colors.alienBulletColor; 
        }else{
            bullet['dir'] = -1; 
            bullet.y -= shooter.size;
            bullet['color'] = colors.green;
        }
        setBullets(prev => {
            return [...prev, bullet]
        });
    }
    const moveBullets = () => {
        if(bullets.length < 1) return;
        const temp = [];
        for(let i = 0; i < bullets.length; i++){
            const bullet = bullets[i] 
            bullet.y += 1 * bullet['dir'];
            if(bullet.y > 0 || bullet.y > canvasHeight){
                temp.push(bullet);
            }
        }
        setBullets(temp);
    };
    const initializeGame = () => { 
        // Generate alien spaceships
        const alienArray = [];
        for(let i = 0; i < alienRows; i++){
            const temp = [];
            for(let j = 0; j < alienCol; j++){
                const alienX = SHIP_BOUNDS + (alienSize + spaceBetweenAliens) * j; 
                const alienY = initialAlienY + (alienSize + spaceBetweenAliens) * i;
                const alienObj = new ShipClass(alienX, alienY, alienSize, alienSize);
                temp.push(alienObj);
            }
            alienArray.push(temp);
        }
        setAliens(alienArray);  
        //-------------------------
    }
    const alienAttack = () => {
        for(let i = 0; i  < agressionLevel; i++){
            let index = aliens.length - 1; 
            const randomIndex = Math.floor(Math.random() * alienCol);
            const alien = aliens[index][randomIndex];
            shoot(alien, true);
        }

    }
    useEffect(() => {
        let interval_id;
        if(bullets.length > 0){
            interval_id = setInterval(moveBullets, 10); 
        }
        return () => {
            clearInterval(interval_id);
        }
    }, [bullets]) 
    // useEffect(() => {
    //     let shootingInterval; 
    //     if(aliens.length > 0){
    //         shootingInterval = setInterval(alienAttack, attackPeriod); 
    //     }
    //     return () => clearInterval(shootingInterval);
    // }, [aliens])
    useEffect(() => {
        initializeGame();
    }, [])
    return(
        <SafeAreaView style={styles.container}>
            <Canvas 
            ship={ship}
            bullets={bullets}
            aliens={aliens}
            moveBullets={moveBullets}
            canvasHeight={canvasHeight}/>
            <Controllers shoot={shoot} moveShip={moveShip} shipState={ship}/>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'black'
    },
})
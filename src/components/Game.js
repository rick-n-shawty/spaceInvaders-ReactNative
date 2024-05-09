import * as React from "react"; 
import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { constants } from "../globals/constants";
import { colors } from "../globals/colors";
import { Direction } from "../utils/direction";  
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
    cellSize
} = constants;
export default function Game(){ 
    const [grid, setGrid] = useState(new Map()); 
    const [ship, setShip] = useState({x: 100, y: SHIP_Y, size: 30});
    const [bullets, setBullets] = useState([]); 
    const [aliens, setAliens] = useState([]); 

    const moveShip = (dir) => {
        let temp = {}
        console.log(grid)
        for(let key of grid.keys()){
            console.log(key);
        }
        if(dir === Direction.LEFT){
            if(ship.x - SHIP_BOUNDS < 0) return;
            setShip(prev => {
                temp = {...prev}; 
                temp.x -= SHIP_SPEED; 
                return temp; 
            })
        }else if(dir === Direction.RIGHT){
            if(ship.x + ship.size + SHIP_BOUNDS > screenWidth) return;
            setShip(prev => {
                temp = {...prev}; 
                temp.x += SHIP_SPEED; 
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
        // console.log(grid)
    };
    const generateAliens = () => {
        const alienArray = [];
        for(let i = 0; i < alienRows; i++){
            const temp = [];
            for(let j = 0; j < alienCol; j++){
                const alienX = SHIP_BOUNDS + (alienSize + spaceBetweenAliens) * j; 
                const alienY = initialAlienY + (alienSize + spaceBetweenAliens) * i;
                const alienObj = {x: alienX, y: alienY, size: alienSize}
                temp.push(alienObj);
                const cell = Math.floor(alienX / cellSize) + ',' + Math.floor(alienY / cellSize);           
            }
            alienArray.push(temp);
        }
        setAliens(alienArray); 
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
        generateAliens(); 
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
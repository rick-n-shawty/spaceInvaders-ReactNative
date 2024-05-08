import * as React from "react"; 
import { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { Direction } from "../utils/direction"; 
const screenWidth = Dimensions.get('window').width; 
const CANVAS_SIZE = {
    height: 550,
};   
const SHIP_BOUNDS = 10; 
const SHIP_SPEED = 5; 
const SHIP_Y = 500; 
export default function Game(){
    const [ship, setShip] = useState({x: 100, y: SHIP_Y, size: 30});
    const [bullets, setBullets] = useState([]); 
    const moveShip = (dir) => {
        let temp = {}
        if(dir === Direction.LEFT){
            if(ship.x - SHIP_BOUNDS < 0) return;
            setShip(prev => {
                temp = {...prev}; 
                temp.x -= SHIP_SPEED; 
                return temp; 
            })
        }else if(dir === Direction.RIGHT){
            if(ship.x + ship.size + SHIP_BOUNDS > screenWidth) return
            setShip(prev => {
                temp = {...prev}; 
                temp.x += SHIP_SPEED; 
                return temp; 
            })
        }
    }
    const shoot = () => {
        console.log('PEW PEW PEW')
        setBullets(prev => {
            const bullet = {x: ship.x + (ship.size / 2), y: ship.y};
            return [bullet, ...prev]
        });
    }
    return(
        <SafeAreaView style={styles.container}>
            <Canvas 
            ship={ship}
            bullets={bullets}
            size={CANVAS_SIZE}/>
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
import * as React from "react"; 
import Ship from "./Ship";
import { View, StyleSheet } from "react-native";
import { constants } from "../globals/constants";
import Bullet from "./Bullet";
import Alien from "./Alien";
import GameOver from "./GameOver";
const { alienSize } = constants;
export default function Canvas({canvasHeight, ship, bullets, aliens,isGameOver}){
    const renderAliens = () => {
        const arr =[]
        for(let i = 0; i < aliens.length; i++){
            for(let j = 0; j < aliens[i].length; j++){
                const alien = aliens[i][j]; 
                const uniqueKey = i + ":" + j + ":" + (Math.floor(Math.random() * 100)) + i + j;
                const comp = <Alien key={uniqueKey} alien={alien}/>
                arr.push(comp);
            }
        }
        return arr; 
    }
    if(isGameOver){
        return(
            <View style={[styles.container, {height: canvasHeight}]}>
                <GameOver/>
            </View>
        )
    }else{
        return (
            <View style={[styles.container, {height: canvasHeight}]}>
                <Ship ship={ship}/>
                {bullets.map((bullet, index) => {
                    const randomInt = Math.floor(Math.random() * 100);
                    const uniqueKey = index + ':' + bullet.getX() + ":" + bullet.getY() + ':' + randomInt;  
                    return <Bullet key={uniqueKey} bullet={bullet}/>
                })}
                {renderAliens()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
})
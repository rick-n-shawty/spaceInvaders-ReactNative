import * as React from "react"; 
import Ship from "./Ship";
import { View, StyleSheet } from "react-native";
import Bullet from "./Bullet";
import Alien from "./Alien";
import GameOver from "./GameOver";
export default function Canvas({canvasHeight, ship, bullets, aliens,isGameOver, message}){
    const renderAliens = () => {
        const arr = []; 
        if(aliens.length < 1) return [];
        for(let i = 0; i < aliens.length; i++){
            if(!aliens[i]) continue;
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
                <GameOver message={message}/>
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
import * as React from "react"; 
import Ship from "./Ship";
import { View, StyleSheet } from "react-native";
import { constants } from "../globals/constants";
import Bullet from "./Bullet";
import Alien from "./Alien";
const { alienSize } = constants;
export default function Canvas({canvasHeight, ship, bullets, aliens}){
    const renderAliens = () => {
        const arr =[]
        for(let i = 0; i < aliens.length; i++){
            for(let j = 0; j < aliens[i].length; j++){
                const alien = aliens[i][j]; 
                const comp = <Alien key={`${i},${j}`} x={alien.x} y={alien.y} size={alienSize}/>
                arr.push(comp);
            }
        }
        return arr; 
    }
    return (
        <View style={[styles.container, {height: canvasHeight}]}>
            <Ship shipData={ship}/>
            {bullets.map((bullet, index) => {
                return <Bullet key={index} x={bullet.x} y={bullet.y} color={bullet.color}/>
            })}
            {renderAliens()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
})
import * as React from "react"; 
import Ship from "./Ship";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Bullet from "./Bullet";
export default function Canvas({size, ship, bullets}){
    const renderBullets = () => {
        const bulletArray = []
        for(let i = 0; i < bullets.length; i++){
            const bullet = bullets[i]; 
            bulletArray[i] = <Bullet key={i} x={bullet.x} y={bullet.y}/>
        }
        return bulletArray; 
    }
    

    return (
        <View style={[styles.container, {height: size.height}]}>
            <Ship shipData={ship}/>
            {renderBullets()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
})
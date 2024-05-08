import * as React from "react"; 
import { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { Direction } from "../utils/direction";
const CANVAS_SIZE = {
    height: 550,
    width: 100,
}; 
export default function Game(){
    const [ship, setShip] = useState({x: 100});
    const moveShip = (dir) => {
        console.log(dir);

    }
    return(
        <SafeAreaView style={styles.container}>
            <Canvas 
            ship={ship}
            size={CANVAS_SIZE}/>
            <Controllers moveShip={moveShip}/>
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
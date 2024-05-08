import * as React from "react"; 
import Ship from "./Ship";
import { View, StyleSheet } from "react-native";
export default function Canvas({size, ship}){
    return (
        <View style={[styles.container, {height: size.height}]}>
            <View style={[styles.alienField, {height: size.height * 0.75}]}>

            </View>
            <View style={[styles.barricades, {height: size.height * 0.1}]}>

            </View>
            <View style={[styles.shipField, {height: size.height * 0.15}]}>
                <Ship pos={{x: ship.x, y: 10}}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    alienField: {
        backgroundColor: 'purple'
    },
    barricades: {
        backgroundColor: 'red',
    },
    shipField: {
        backgroundColor: 'black'
    }
})
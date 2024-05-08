import * as React from "react"; 
import Ship from "./Ship";
import { View, StyleSheet } from "react-native";
export default function Canvas({size, ship, bullets}){
    
    return (
        <View style={[styles.container, {height: size.height}]}>
            <Ship shipData={ship}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
})
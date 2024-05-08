import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Bullet({x,y}){
    return(
        <View style={[styles.container, {left: x, top: y}]}>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 10, 
        width: 5,
        backgroundColor: 'red', 
        position: 'absolute'
    }
})
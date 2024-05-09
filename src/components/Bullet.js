import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Bullet({x,y,color}){
    return(
        <View style={[styles.container, {left: x, top: y, backgroundColor: color}]}>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 10, 
        width: 5,
        position: 'absolute'
    }
})
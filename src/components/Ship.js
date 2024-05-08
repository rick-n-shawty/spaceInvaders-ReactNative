import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Ship({pos}){
    const {x,y} = pos; 
    return(
        <View style={[styles.container, {left: x, top: y}]}>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        width: 30,
        height: 30,
        position: 'relative'
    }
})
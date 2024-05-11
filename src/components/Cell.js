import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Cell({cell}){
    const { x,y,width,height,isLit } = cell;
    return(
        <View style={[styles.container, {left: x, top: y, width, height}, isLit && {backgroundColor: 'red'}]}></View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    }
})
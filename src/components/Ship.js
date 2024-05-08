import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Ship({shipData}){
    const {x,y,size} = shipData; 
    return(
        <View style={[styles.container, {left: x, top: y, width: size, height: size}]}>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        position: "absolute"
    }
})
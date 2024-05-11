import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Ship({ship}){
    const {x,y} = ship.getPosition();
    const { width, height } = ship.getSize();
    return(
        <View style={[styles.container, {left: x, top: y, width: width, height: height}]}>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        position: "absolute"
    }
})
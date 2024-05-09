import * as React from 'react'; 
import { View, StyleSheet } from "react-native";
export default function Alien({x,y,size}){
    return(
        <View style={[styles.container, {left: x, top: y, height: size, width: size}]}>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'purple'
    }
})
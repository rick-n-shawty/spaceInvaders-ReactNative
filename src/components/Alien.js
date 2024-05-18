import * as React from 'react'; 
import { View, StyleSheet, Image } from "react-native";
export default function Alien({alien}){
    const {x,y} = alien.getPosition(); 
    const { width, height } = alien.getSize();
    return(
        <View style={[styles.container, {left: x, top: y, height: height, width: width}]}>
            {/* <Image
             source={require('../../assets/images/greenAlienShip.jpg')}
             style={{height: height, width: width}}
            /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'green'
    }
})
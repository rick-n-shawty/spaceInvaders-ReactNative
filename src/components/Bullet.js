import * as React from "react"; 
import { View, StyleSheet, Image } from "react-native";
export default function Bullet({bullet}){
    const {x,y} = bullet.getPosition();
    const { height, width } = bullet.getSize();
    return(
        <View style={
            [
                styles.container, 
                {left: x, top: y, backgroundColor: 'red', height, width}
            ]
        }>
            {/* <Image
            source={require('../../assets/images/poke-ball.jpeg')}
            style={{height: height, width: width}}
            /> */}
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
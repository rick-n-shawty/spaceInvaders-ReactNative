import * as React from "react"; 
import { View, StyleSheet, Image } from "react-native";
export default function Ship({ship}){
    const {x,y} = ship.getPosition();
    const { width, height } = ship.getSize();
    return(
        <View style={[styles.container, {left: x, top: y, width: width, height: height}]}>
            <Image
            source={require('../../assets/images/whiteShip.jpg')}
            style={{height: height + 30, width: width + 30}}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'green',
        position: "absolute"
    }
})
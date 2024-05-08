import * as React from "react"; 
import { View, StyleSheet } from "react-native";
export default function Bullet(){
    return(
        <View style={[styles.container, {}]}>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 10, 
        width: 5,
        backgroundColor: 'red'
    }
})
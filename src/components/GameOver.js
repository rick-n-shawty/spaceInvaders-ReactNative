import * as React from "react"; 
import { View, Text, StyleSheet } from "react-native"; 
export default function GameOver({message}){

    return(
        <View style={styles.container}>
            <Text style={[styles.text, {color: message === 'You lose!' ? 'red' : 'green'}]}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'red',
        fontFamily: 'pixelFontRegular',
        fontSize: 40,
    }
})
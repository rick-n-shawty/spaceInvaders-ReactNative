import * as React from "react"; 
import { View, Text, StyleSheet } from "react-native"; 
export default function GameOver(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Game Over</Text>
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
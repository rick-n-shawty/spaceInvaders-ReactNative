import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Direction } from "../utils/direction";
import LongPressButton from "./LongPressButton"; 
const ICON_SIZE = 70
export default function Controllers({moveShip, shipState, shoot,isGameOver,restartGame}){
    if(isGameOver){
        return(
        <View style={styles.container}>
            <TouchableOpacity onPress={restartGame}>
                <MaterialIcons name="restart-alt" size={ICON_SIZE} color={'white'}/>
            </TouchableOpacity>
        </View>
        )
    }else{
        return(
        <View style={styles.container}>
            <View style={styles.leftRight}>
                <LongPressButton 
                color={'white'}
                iconName = {'caretleft'} 
                iconSize={ICON_SIZE} 
                dir={Direction.LEFT}
                shipState={shipState}
                moveShip={moveShip}/>
                <LongPressButton
                color={'white'} 
                iconName = {'caretright'} 
                iconSize={ICON_SIZE}
                dir={Direction.RIGHT}
                shipState={shipState}
                moveShip={moveShip}/>
            </View>
            <TouchableOpacity onPress={() => shoot(shipState)}>
                <MaterialIcons name="local-fire-department" size={ICON_SIZE} color={'white'}/>
            </TouchableOpacity>
        </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '30%', 
        backgroundColor: 'black',
        justifyContent: 'space-around',
        alignItems: 'center'
    }, 
    leftRight: {
        display: "flex",
        flexDirection: 'row',
    }
})
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Direction } from "../utils/direction";
import LongPressButton from "./LongPressButton"; 
const ICON_SIZE = 70
export default function Controllers({moveShip, shipState, shoot}){
    return (
        <View style={styles.container}>
            <View style={styles.leftRight}>
                <LongPressButton 
                iconName = {'caretleft'} 
                iconSize={ICON_SIZE} 
                dir={Direction.LEFT}
                shipState={shipState}
                moveShip={moveShip}/>
                <LongPressButton 
                iconName = {'caretright'} 
                iconSize={ICON_SIZE}
                dir={Direction.RIGHT}
                shipState={shipState}
                moveShip={moveShip}/>
            </View>
            <TouchableOpacity onPress={shoot}>
                <MaterialIcons name="local-fire-department" size={ICON_SIZE}/>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '30%', 
        backgroundColor: 'salmon',
        justifyContent: 'space-around',
        alignItems: 'center'
    }, 
    leftRight: {
        display: "flex",
        flexDirection: 'row',
    }
})
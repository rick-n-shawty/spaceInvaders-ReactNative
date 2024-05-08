import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Direction } from "../utils/direction";
const ICON_SIZE = 70
export default function Controllers({moveShip}){
    return (
        <View style={styles.container}>
            <View style={styles.leftRight}>
                <TouchableOpacity onFocus={() => moveShip(Direction.LEFT)}>
                    <AntDesign name="caretleft" size={ICON_SIZE}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => moveShip(Direction.RIGHT)}>
                    <AntDesign name="caretright" size={ICON_SIZE}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity>
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
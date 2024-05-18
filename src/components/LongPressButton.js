import { useState, useEffect } from "react"; 
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; 
export default function LongPressButton({iconName, iconSize, dir, moveShip, shipState,color}){
    const [isPressed, setIsPressed] = useState(false); 
    const pressIn = () => {
        setIsPressed(true); 
    }
    const pressOut = () => {
        setIsPressed(false); 
    }
    useEffect(() => {
        let interval_Id;
        if(isPressed){
            interval_Id = setInterval(()=> moveShip(dir), 10); 
        }
        return () => clearInterval(interval_Id);
    }, [isPressed, shipState])
    return(
        <TouchableOpacity onPressIn={pressIn} onPressOut={pressOut}>
            <AntDesign name={iconName} size={iconSize} color={color}/>
        </TouchableOpacity>
    )
}
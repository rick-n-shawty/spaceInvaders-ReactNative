import { useState } from "react"; 
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; 
export default function LongPressButton({iconName, iconSize}){
    const [isPressed, setIsPressed] = useState(false); 
    return(
        <TouchableOpacity onPressIn={() => {}} onPressOut={() => {}}>
            <AntDesign name={iconName} size={iconSize}/>
        </TouchableOpacity>
    )
}
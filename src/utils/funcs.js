import { ShipClass } from "../Classes/ShipClass"; 
import { BulletClass } from "../Classes/BulletClass";
export const checkOverlap = (cell,obj) => {
    if(!(obj instanceof ShipClass) && !(obj instanceof BulletClass )){
        console.log("SECOND ARGUEMENT MUST BE THE PROPER CLASS");
        return false; 
    }
    if(obj.getX() >= cell.x && obj.getX() <= cell.x + cell.width){    
        return true;
    }else if(obj.getX() + obj.getWidth() >= cell.x && obj.getX() + obj.getWidth() <= cell.x + cell.width){
        return true; 
    }else if(obj.getY() >= cell.y && obj.getY() <= cell.y + cell.height){
        return true; 
    }else if(obj.getY() + obj.getHeight() >= cell.y && obj.getY() + obj.getHeight() <= cell.y + cell.height){
        return true; 
    }
    return false; 
}
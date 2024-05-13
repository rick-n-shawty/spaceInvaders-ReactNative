import { ShipClass } from "../Classes/ShipClass"; 
import { BulletClass } from "../Classes/BulletClass";
import { constants } from "../globals/constants";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get('window').width; 
const { GRID_HEIGHT, GRID_WIDTH, CANVAS_HEIGHT } = constants;
const cellHeight = Math.floor((CANVAS_HEIGHT + 50) / GRID_HEIGHT); 
const cellWidth = Math.floor(screenWidth / GRID_WIDTH); 
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

export const checkCollision = (ship,bullet) => {
    if(!(ship instanceof ShipClass) || !(bullet instanceof BulletClass)){
        console.log('INVALID ARGUMENTS AT checkCollision.js'); 
        return false; 
    }
    const xOverlap = (bullet.getX() >= ship.getX() && bullet.getX() <= ship.getX() + ship.getWidth()) ? true : false;
    const yOverlap = (bullet.getY() + bullet.getHeight() >= ship.getY() && bullet.getY() + bullet.getHeight() <= ship.getY() + ship.getHeight()) ? true : false; 
    return xOverlap && yOverlap; 
}

export const detectOverlap = (cell,bullet) => {
    let isX = false; 
    let isY = false; 
    if(bullet.x >= cell.x && bullet.x <= cell.x + cell.width){
        // left side 
        isX = true; 
    }else if(bullet.x + bullet.width <= cell.x + cell.width && bullet.x + bullet.width >= cell.x){
        // right side
        isX = true;  
    }else if(bullet.y <= cell.y + cell.height && bullet.y >= cell.y){
        //top side 
        isY = true; 
    }else if(bullet.y + bullet.height <= cell.y + cell.height && bullet.y + bullet.height >= cell.y){
        isY = true; 
    }
    return isX || isY;
}

export const markCells = (obj, gridCopy, isLit) => {
    const x_key = Math.floor((obj.getX()) / cellWidth) * cellWidth; // !!! IMPORTANT !!!
    const y_key = Math.floor((obj.getY() + obj.getHeight()) / cellHeight) * cellHeight; 

    const leftTop = gridCopy.get(`${x_key},${y_key}`);
    const rightTop = gridCopy.get(`${x_key + cellWidth},${y_key}`);
    const leftBottom = gridCopy.get(`${x_key},${y_key + cellHeight}`);
    const rightBottom = gridCopy.get(`${x_key + cellWidth},${y_key + cellHeight}`); 

    leftTop['isLit'] = isLit;
    rightTop['isLit'] = isLit; 
    leftBottom['isLit'] = isLit; 
    rightBottom['isLit'] = isLit; 
    gridCopy.set(`${x_key},${y_key}`, leftTop);
    gridCopy.set(`${x_key + cellWidth},${y_key}`, rightTop);
    gridCopy.set(`${x_key},${y_key + cellHeight}`, leftBottom);
    gridCopy.set(`${x_key + cellWidth},${y_key + cellHeight}`, rightBottom);
    return gridCopy; 
}
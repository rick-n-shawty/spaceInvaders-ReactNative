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
export const removeObjectFromCells = (obj,gridCopy) => {
    const objX = obj.getX(); 
    const objY = obj.getY();
    const x_key = Math.floor((obj.getX()) / cellWidth) * cellWidth; 
    const y_key = Math.floor((obj.getY() + obj.getHeight()) / cellHeight) * cellHeight; 
    let leftTop,rightTop,leftBottom,rightBottom;
    if(gridCopy.has(`${x_key},${y_key}`)){
        leftTop = gridCopy.get(`${x_key},${y_key}`);
        leftTop['isLit'] = false;
        if(obj instanceof ShipClass){
            delete leftTop['enclosedShips'][`${objX},${objY}`] 
        }else{
            delete leftTop['enclosedBullets'][`${objX},${objY}`] 
        }
        gridCopy.set(`${x_key},${y_key}`, leftTop);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key}`)){
        rightTop = gridCopy.get(`${x_key + cellWidth},${y_key}`);
        if(obj.getX() + obj.getWidth() > rightTop.x){
            rightTop['isLit'] = false; 
            if(obj instanceof ShipClass){
                delete leftTop['enclosedShips'][`${objX},${objY}`];
            }else{
                delete leftTop['enclosedBullets'][`${objX},${objY}`];
            }
        }
        gridCopy.set(`${x_key + cellWidth},${y_key}`, rightTop);
    }
    if(gridCopy.has(`${x_key},${y_key + cellHeight}`)){
        leftBottom = gridCopy.get(`${x_key},${y_key + cellHeight}`);
        if(obj.getY() + obj.getHeight() < leftBottom.y){
            leftBottom['isLit'] = false;
            if(obj instanceof ShipClass){
                delete leftTop['enclosedShips'][`${objX},${objY}`];
            }else{
                delete leftTop['enclosedBullets'][`${objX},${objY}`];
            }
        }
        gridCopy.set(`${x_key},${y_key + cellHeight}`, leftBottom);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key + cellHeight}`)){
        rightBottom = gridCopy.get(`${x_key + cellWidth},${y_key + cellHeight}`); 
        if(obj.getY() + obj.getHeight() < rightBottom.y && obj.getX() + obj.getWidth() > rightTop.x){
            rightBottom['isLit'] = false; 
            if(obj instanceof ShipClass){
                delete leftTop['enclosedShips'][`${objX},${objY}`] ;
            }else{
                delete leftTop['enclosedBullets'][`${objX},${objY}`] ;
            }
        }
        gridCopy.set(`${x_key + cellWidth},${y_key + cellHeight}`, rightBottom);
    }
    return gridCopy;
}
export const pushObjectIntoCells = (obj,gridCopy,link) => {
    const objX = obj.getX(); 
    const objY = obj.getY();
    const x_key = Math.floor((obj.getX()) / cellWidth) * cellWidth; 
    const y_key = Math.floor((obj.getY() + obj.getHeight()) / cellHeight) * cellHeight; 
    let leftTop,rightTop,leftBottom,rightBottom;
    if(gridCopy.has(`${x_key},${y_key}`)){
        leftTop = gridCopy.get(`${x_key},${y_key}`);
        leftTop['isLit'] = true;
        if(obj instanceof ShipClass){
            leftTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
        }else{
            leftTop['enclosedBullets'][`${objX},${objY}`] = {obj,link};
        }
        gridCopy.set(`${x_key},${y_key}`, leftTop);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key}`)){
        rightTop = gridCopy.get(`${x_key + cellWidth},${y_key}`);
        if(obj.getX() + obj.getWidth() > rightTop.x){
            rightTop['isLit'] = true; 
            if(obj instanceof ShipClass){
                leftTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
            }else{
                leftTop['enclosedBullets'][`${objX},${objY}`] = {obj,link};
            }
        }
        gridCopy.set(`${x_key + cellWidth},${y_key}`, rightTop);
    }
    if(gridCopy.has(`${x_key},${y_key + cellHeight}`)){
        leftBottom = gridCopy.get(`${x_key},${y_key + cellHeight}`);
        if(obj.getY() + obj.getHeight() < leftBottom.y){
            leftBottom['isLit'] = true;
            if(obj instanceof ShipClass){
                leftTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
            }else{
                leftTop['enclosedBullets'][`${objX},${objY}`] = {obj,link};
            }
        }
        gridCopy.set(`${x_key},${y_key + cellHeight}`, leftBottom);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key + cellHeight}`)){
        rightBottom = gridCopy.get(`${x_key + cellWidth},${y_key + cellHeight}`); 
        if(obj.getY() + obj.getHeight() < rightBottom.y && obj.getX() + obj.getWidth() > rightTop.x){
            rightBottom['isLit'] = true; 
            if(obj instanceof ShipClass){
                leftTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
            }else{
                leftTop['enclosedBullets'][`${objX},${objY}`] = {obj,link};
            }
        }
        gridCopy.set(`${x_key + cellWidth},${y_key + cellHeight}`, rightBottom);
    }
    return gridCopy;
}
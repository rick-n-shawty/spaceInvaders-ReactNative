import { ShipClass } from "../Classes/ShipClass"; 
import { BulletClass } from "../Classes/BulletClass";
import { constants } from "../globals/constants";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get('window').width; 
const { GRID_HEIGHT, GRID_WIDTH, CANVAS_HEIGHT } = constants;
const cellHeight = Math.floor((CANVAS_HEIGHT + 50) / GRID_HEIGHT); 
const cellWidth = Math.floor(screenWidth / GRID_WIDTH); 

export const removeObjectFromCells = (obj,gridCopy) => {
    const objX = obj.getX(); 
    const objY = obj.getY();
    const x_key = Math.floor((obj.getX()) / cellWidth) * cellWidth; 
    const y_key = Math.floor((obj.getY() + obj.getHeight()) / cellHeight) * cellHeight; 
    let leftTop,rightTop,leftBottom,rightBottom;
    if(gridCopy.has(`${x_key},${y_key}`)){
        leftTop = gridCopy.get(`${x_key},${y_key}`);
        leftTop['isLit'] = false;
        delete leftTop['enclosedShips'][`${objX},${objY}`] 
        gridCopy.set(`${x_key},${y_key}`, leftTop);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key}`)){
        rightTop = gridCopy.get(`${x_key + cellWidth},${y_key}`);
        if(obj.getX() + obj.getWidth() > rightTop.x){
            rightTop['isLit'] = false; 
            delete rightTop['enclosedShips'][`${objX},${objY}`];
        }
        gridCopy.set(`${x_key + cellWidth},${y_key}`, rightTop);
    }
    if(gridCopy.has(`${x_key},${y_key + cellHeight}`)){
        leftBottom = gridCopy.get(`${x_key},${y_key + cellHeight}`);
        if(obj.getY() + obj.getHeight() < leftBottom.y){
            leftBottom['isLit'] = false;
            delete leftBottom['enclosedShips'][`${objX},${objY}`];
        }
        gridCopy.set(`${x_key},${y_key + cellHeight}`, leftBottom);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key + cellHeight}`)){
        rightBottom = gridCopy.get(`${x_key + cellWidth},${y_key + cellHeight}`); 
        if(obj.getY() + obj.getHeight() < rightBottom.y && obj.getX() + obj.getWidth() > rightTop.x){
            rightBottom['isLit'] = false; 
            delete rightBottom['enclosedShips'][`${objX},${objY}`] ;
        }
        gridCopy.set(`${x_key + cellWidth},${y_key + cellHeight}`, rightBottom);
    }
    return gridCopy;
}
export const pushObjectIntoCells = (obj,gridCopy,link) => {
    if(!(obj instanceof ShipClass || obj instanceof BulletClass)){
        console.log('pushObject error');
        return gridCopy; 
    }
    const objX = obj.getX(); 
    const objY = obj.getY();
    const x_key = Math.floor((obj.getX()) / cellWidth) * cellWidth; 
    const y_key = Math.floor((obj.getY() + obj.getHeight()) / cellHeight) * cellHeight; 
    let leftTop,rightTop,leftBottom,rightBottom;
    if(gridCopy.has(`${x_key},${y_key}`)){
        leftTop = gridCopy.get(`${x_key},${y_key}`);
        leftTop['isLit'] = true;    
        leftTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
        gridCopy.set(`${x_key},${y_key}`, leftTop);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key}`)){
        rightTop = gridCopy.get(`${x_key + cellWidth},${y_key}`);
        if(obj.getX() + obj.getWidth() > rightTop.x){
            rightTop['isLit'] = true; 
            rightTop['enclosedShips'][`${objX},${objY}`] = {obj,link};
        }
        gridCopy.set(`${x_key + cellWidth},${y_key}`, rightTop);
    }
    if(gridCopy.has(`${x_key},${y_key + cellHeight}`)){
        leftBottom = gridCopy.get(`${x_key},${y_key + cellHeight}`);
        if(obj.getY() + obj.getHeight() < leftBottom.y){
            leftBottom['isLit'] = true;
            leftBottom['enclosedShips'][`${objX},${objY}`] = {obj,link};
        }
        gridCopy.set(`${x_key},${y_key + cellHeight}`, leftBottom);
    }
    if(gridCopy.has(`${x_key + cellWidth},${y_key + cellHeight}`)){
        rightBottom = gridCopy.get(`${x_key + cellWidth},${y_key + cellHeight}`); 
        if(obj.getY() + obj.getHeight() < rightBottom.y && obj.getX() + obj.getWidth() > rightTop.x){
            rightBottom['isLit'] = true; 
            rightBottom['enclosedShips'][`${objX},${objY}`] = {obj,link};
        }
        gridCopy.set(`${x_key + cellWidth},${y_key + cellHeight}`, rightBottom);
    }
    return gridCopy;
}
export const isShipHit = (bullet, ship) => {
    if(!(bullet instanceof BulletClass && ship instanceof ShipClass)) return false;
    if(bullet.getX() >= ship.getX() && bullet.getX() <= ship.getX() + ship.getWidth() && bullet.getY() <= ship.getY() + ship.getHeight() && bullet.getY() >= ship.getY()){
        // left corner and top of the bullet collided with the bottom of the ship
        return true; 
    }else if(bullet.getX() + bullet.getWidth() >= ship.getX() && bullet.getX() + bullet.getWidth() <= ship.getX() + ship.getWidth() && bullet.getY() <= ship.getY() + ship.getHeight() && bullet.getY() >= ship.getY()){
        // right corner and the top of the bullet collide with the bottom of the ship
        return true; 
    }else if(bullet.getX() >= ship.getX() && bullet.getX() <= ship.getX() + ship.getWidth() && bullet.getY() + bullet.getHeight() >= ship.getY() && bullet.getY() +bullet.getHeight() <= ship.getY() + ship.getHeight()){
        // left corner and top of the ship 
        return true;
    }
    return false;
}




  
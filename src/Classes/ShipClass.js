import { Direction } from "../utils/direction";
import { constants } from "../globals/constants";
const {ALIEN_SHIP_SPEED} = constants;
export class ShipClass{
    constructor(x,y,width, height,isAlien){
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;  
        this.isAlien = isAlien; 
        this.dir = Direction.RIGHT
    }
    move(){
        if(this.dir === Direction.RIGHT){
            this.x += ALIEN_SHIP_SPEED; 
        }else if(this.dir === Direction.LEFT){
            this.x -= ALIEN_SHIP_SPEED; 
        }else if(this.dir === Direction.DOWN){
            this.y += ALIEN_SHIP_SPEED; 
        }
    }
    setDir(dir){
        if(dir in Direction){
            this.dir = dir; 
        }else{
            console.log('IMPROPER DIRECTION'); 
        }
    }
    getWidth(){
        return this.width; 
    }
    getHeight(){
        return this.height;
    }
    getPosition(){
        return {x: this.x, y: this.y}
    }
    getX(){
        return this.x; 
    }
    getY(){
        return this.y;
    }
    getSize(){
        return {width: this.width, height: this.height}; 
    }
    setPosition(newX, newY){
        this.x = newX;
        this.y = newY; 
    }
}
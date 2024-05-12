import { constants } from "../globals/constants";
const { BULLET_SPEED } = constants;
export class BulletClass{
    constructor(x,y,width,height,dir){
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height; 
        this.dir = dir; 
    }
    getY(){
        return this.y;
    }
    getX(){
        return this.x; 
    }
    getHeight(){
        return this.height;
    }
    getWidth(){
        return this.width;
    }
    move(){
        this.y += BULLET_SPEED * this.dir; 
    }
    getPosition(){
        return {x: this.x, y: this.y}; 
    }
    getSize(){
        return {height: this.height, width: this.width}; 
    }
}
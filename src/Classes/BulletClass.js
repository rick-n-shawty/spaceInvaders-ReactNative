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
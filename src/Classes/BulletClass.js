export class BulletClass{
    constructor(x,y,width,height,dir,speed){
        this.speed = speed; 
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height; 
        this.dir = dir; 
    }
    move(){
        this.y += this.speed * this.dir; 
    }
    getPosition(){
        return {x: this.x, y: this.y}; 
    }
    getSize(){
        return {height: this.height, width: this.width}; 
    }
}
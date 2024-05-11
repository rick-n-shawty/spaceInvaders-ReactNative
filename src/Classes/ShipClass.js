export class ShipClass{
    constructor(x,y,width, height,isAlien){
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;  
        this.isAlien = isAlien; 
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
    setX(newX){
        this.x = newX; 
    }
    setY(newY){
        this.y = newY;
    }
    setPosition(newX, newY){
        this.x = newX;
        this.y = newY; 
    }
}
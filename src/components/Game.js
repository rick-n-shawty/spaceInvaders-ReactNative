import * as React from "react"; 
import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Dimensions } from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { constants } from "../globals/constants";
import { colors } from "../globals/colors";
import { Direction } from "../utils/direction";  
import { ShipClass } from "../Classes/ShipClass";
import { BulletClass } from "../Classes/BulletClass";
import Cell from "./Cell";
import { checkOverlap, checkCollision, detectOverlap, markCells } from "../utils/funcs";
const screenWidth = Dimensions.get('window').width; 
const { 
    SHIP_SPEED, 
    SHIP_BOUNDS, 
    SHIP_Y, 
    ALIEN_ROWS, 
    ALIEN_COL, 
    CANVAS_HEIGHT, 
    ALIEN_SIZE,
    SPACE_BETWEEN_ALIENS,
    INITIAL_ALIEN_Y,
    ATTACK_PERIOD,
    AGRESSION,
    CELL_SIZE,
    GRID_WIDTH,
    GRID_HEIGHT,
    SHIP_SIZE,
    BULLET_HEIGHT,
    BULLET_WIDTH,
    ALIENS_MOVE_STEPS
} = constants; 
const cellHeight = Math.floor((CANVAS_HEIGHT + 50) / GRID_HEIGHT); 
const cellWidth = Math.floor(screenWidth / GRID_WIDTH); 
export default function Game(){
    const [alienDir,setAlienDir] = useState(Direction.RIGHT); 
    const [count, setCount] = useState(0);  
    const [grid, setGrid] = useState(new Map());
    const [ship, setShip] = useState(new ShipClass(100,SHIP_Y, SHIP_SIZE, SHIP_SIZE, false));
    const [bullets, setBullets] = useState([]); 
    const [aliens, setAliens] = useState([]);  
    const [isGameOver, setGameOver] = useState(false); 


    const moveShip = (dir) => {
        if(dir === Direction.LEFT && ship.getX() - ship.getWidth() < 0) return;
        else if(dir === Direction.RIGHT && ship.getX() + ship.getWidth() * 2 > screenWidth) return; 
        const tempShip = new ShipClass(ship.x, ship.y, ship.width, ship.height,false); 
        let gridCopy = markCells(tempShip, new Map(grid), false); 
        let temp;

        if(dir === Direction.LEFT){
            tempShip.setDir(Direction.LEFT); 
            tempShip.move(SHIP_SPEED); 
        }else if(dir === Direction.RIGHT){
            tempShip.setDir(Direction.RIGHT); 
            tempShip.move(SHIP_SPEED);
        }
        
        
        // Local in each cell the ship is located adn highlight it
        // const xIndex = Math.floor((ship.x) / cellWidth) * cellWidth; // !!! IMPORTANT !!!
        // const yIndex = Math.floor((ship.y + ship.height) / cellHeight) * cellHeight; // !!! IMPORTANT !!!
        // const cell = gridCopy.get(`${xIndex},${yIndex}`);
        // cell.isLit = true; 
        // gridCopy.set(`${xIndex},${yIndex}`, cell);
        // -------------------------------------
        gridCopy = markCells(tempShip,gridCopy,true);
        setGrid(gridCopy);
        setShip(tempShip)
    }
    
    const shoot = (shooter) => {
        if(!(shooter instanceof ShipClass)){
            console.log('SHOOTER MUST BE THE INSTANCE OF SHIP CLASS!')
            return; 
        }
        const x = shooter.getX() + Math.floor(shooter.getWidth() / 2); 
        const y = shooter.getY(); 
        const dir = shooter.isAlien ? 1 : -1; 
        const bullet = new BulletClass(x,y,BULLET_WIDTH,BULLET_HEIGHT,dir);
        setBullets(prev => {
            return [...prev, bullet]; 
        });
    };
    const moveBullets = () => {
        if(bullets.length < 1) return;
        const tempBullets = []; 
        const tempGrid = [...grid]; 
        for(let i = 0; i < bullets.length; i++){
            const bullet = bullets[i]; 
            bullet.move(); 
            const bulletY = bullet.getY(); 
            const bulletX = bullet.getX();
            if(bulletY >= 0 && bulletY <= CANVAS_HEIGHT){
                tempBullets.push(bullet); 
            }else continue;  
            const rowIndex = Math.round((bullet.getY()) / cellHeight); 
            const colIndex = Math.round((bullet.getX()) / cellWidth); 
        }

        // setGrid(tempGrid);
        setBullets(tempBullets);
    };
    const initializeGame = () => { 
        // Generate alien spaceships
        const alienArray = [];
        // for(let i = 0; i < ALIEN_ROWS; i++){
        //     const temp = [];
        //     for(let j = 0; j < ALIEN_COL; j++){
        //         const alienX = SHIP_BOUNDS + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * j; 
        //         const alienY = INITIAL_ALIEN_Y + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * i;
        //         const alienObj = new ShipClass(alienX, alienY, ALIEN_SIZE, ALIEN_SIZE, true);
        //         temp.push(alienObj);
        //     }
        //     alienArray.push(temp);
        // }
        setAliens(alienArray);  
        //------------------------- 


        // Divide the grid 
        const cells = new Map();
        for(let row = 0; row <  GRID_HEIGHT; row++){
            for(let col = 0; col < GRID_WIDTH; col++){
                const cellX = cellWidth * col ;
                const cellY = cellHeight * row; 
                const cellObj = {
                    x: cellX, 
                    y: cellY, 
                    width: cellWidth, 
                    height: cellHeight,
                    isLit: false,
                    hasBullets: false
                };
                if(!cells.has(`${cellX},${cellY}`)){
                    cells.set(`${cellX},${cellY}`, cellObj);
                }
            }
        }
        setGrid(cells);
        //------------------------- 

    }

    const moveAlienShips = () => {
        if(aliens.length < 1) return; 
        const index = count % aliens.length;
        let dir = alienDir;
        const currentRow = aliens[index];
        let longestRowIndex = 0; 
        for(let i = 0; i < aliens.length; i++){
            if(aliens[i].length > longestRowIndex){
                longestRowIndex = aliens[i].length - 1; 
            }
        }
        const longestRow = aliens[longestRowIndex]; 
        const firstEl = longestRow[0]; 
        const lastEl = longestRow[longestRowIndex]; 

        if(alienDir === Direction.RIGHT && index === 0){
            if(lastEl.getX() + lastEl.getWidth() + 10 > screenWidth){
                dir = Direction.DOWN;
            }
        }else if(alienDir === Direction.LEFT && index === 0){
            if(firstEl.getX() - 10 < 0){
                dir = Direction.DOWN;
            }
        }else if(alienDir === Direction.DOWN && index === 0){
            if(lastEl.getX() + lastEl.getWidth() + 10 > screenWidth){
                dir = Direction.LEFT; 
            }else if(firstEl.getX() - 10 < 0){
                dir = Direction.RIGHT;
            }
        }
        setAlienDir(dir);
        for(let i = 0; i < currentRow.length; i++){
            currentRow[i].setDir(dir); 
            currentRow[i].move(); 
        }
        setAliens(prev => {
            const temp = [...prev]; 
            temp[index] = currentRow; 
            return temp;
        });   
        setCount(prev => prev + 1);
    }

    const alienAttack = () => {

    }
    useEffect(() => {
        initializeGame();
    }, []);

    // movement of the bullets 
    useEffect(() => {
        let interval_id;
        if(!isGameOver && bullets.length > 0){
            interval_id = setInterval(moveBullets, 10); 
        }
        return () => {
            clearInterval(interval_id);
        }
    }, [bullets, isGameOver]) 

    // movement of alien spaceships 
    // useEffect(() => { 
    //     let interval_id; 
    //     if(!isGameOver){
    //         interval_id = setInterval(moveAlienShips, 100); 
    //     }
    //     return () => clearInterval(interval_id);
    // }, [count, aliens, alienDir,isGameOver])

    const showCells = () => {
        if(grid.size === 0) return;
        const comps = [];
        for(const key of grid.keys()){
            const item = grid.get(key); 
            comps.push(<Cell key={item['x'] +','+ item['y']} cell={item}/>);
        }
        return comps;
    }

    return(
        <SafeAreaView style={styles.container}>
            {showCells()}
            <Canvas 
            ship={ship}
            bullets={bullets}
            aliens={aliens}
            moveBullets={moveBullets}
            canvasHeight={CANVAS_HEIGHT}/>
            <Controllers shoot={shoot} moveShip={moveShip} shipState={ship}/>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'black'
    },
})
import * as React from "react"; 
import { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, Dimensions} from "react-native";
import Controllers from "./Controllers";
import Canvas from "./Canvas";
import { constants } from "../globals/constants";
import { Direction } from "../utils/direction";  
import { ShipClass } from "../Classes/ShipClass";
import { BulletClass } from "../Classes/BulletClass";
import Cell from "./Cell";
import { 
    pushObjectIntoCells,
    removeObjectFromCells,
    isShipHit 
} from "../utils/funcs";
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
    ALIEN_SHIP_SPEED,
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
    const [rowIndex,setRowIndex] = useState(0);
    const [grid, setGrid] = useState(new Map());
    const [ship, setShip] = useState(new ShipClass(100,SHIP_Y, SHIP_SIZE, SHIP_SIZE, false));
    const [bullets, setBullets] = useState([]); 
    const [aliens, setAliens] = useState([]);  
    const [isGameOver, setGameOver] = useState(true); 
    const initializeGame = () => { 
        // Divide the grid 
        let cells = new Map();
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
                    enclosedShips: {}
                };
                if(!cells.has(`${cellX},${cellY}`)){
                    cells.set(`${cellX},${cellY}`, cellObj);
                }
            }
        }
        //------------------------- 

        // Generate alien spaceships
        const alienArray = [];
        for(let i = 0; i < ALIEN_ROWS; i++){
            const temp = [];
            for(let j = 0; j < ALIEN_COL; j++){
                const alienX = SHIP_BOUNDS + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * j; 
                const alienY = INITIAL_ALIEN_Y + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * i;
                const alienObj = new ShipClass(alienX, alienY, ALIEN_SIZE, ALIEN_SIZE, true);
                cells = pushObjectIntoCells(alienObj,cells,{ i: i,j: j });
                temp.push(alienObj);
            }
            alienArray.push(temp);
        }
        setGrid(cells);
        setAliens(alienArray);  
        //------------------------- 
    }
    const restartGame = () => {
        setRowIndex(0);
        setAlienDir(Direction.RIGHT); 
        setShip(new ShipClass(100,SHIP_Y, SHIP_SIZE, SHIP_SIZE, false));
        setBullets([]); 
        
        initializeGame(); 
        setGameOver(false); 
    }
    const moveShip = (dir) => {
        if(dir === Direction.LEFT && ship.getX() - ship.getWidth() < 0) return;
        else if(dir === Direction.RIGHT && ship.getX() + ship.getWidth() * 2 > screenWidth) return; 
        const tempShip = new ShipClass(ship.x, ship.y, ship.width, ship.height,false); 
        // let gridCopy = removeObjectFromCells(tempShip, new Map(grid)); 
        if(dir === Direction.LEFT){
            tempShip.setDir(Direction.LEFT); 
            tempShip.move(SHIP_SPEED); 
        }else if(dir === Direction.RIGHT){
            tempShip.setDir(Direction.RIGHT); 
            tempShip.move(SHIP_SPEED);
        }
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
        const color = shooter.isAlien ? 'green' : 'red'; 
        bullet.setColor(color);
        setBullets(prev => {
            return [...prev, bullet]; 
        });
    };
    const findHitShip = (bullet,tempGrid) => {
        const x_key = Math.floor((bullet.getX()) / cellWidth) * cellWidth; 
        const y_key = Math.floor((bullet.getY() + bullet.getHeight()) / cellHeight) * cellHeight; 
        let cell; 
        if(tempGrid.has(`${x_key},${y_key}`)){
            cell = tempGrid.get(`${x_key},${y_key}`); 
            const leftTopShips = Object.values(cell['enclosedShips']);
            for(let value of leftTopShips){
                const ship = value['obj']; 
                if(!ship) continue;
                if(isShipHit(bullet,ship)){
                    tempGrid = removeObjectFromCells(ship,tempGrid);
                    return value['link'];
                }         
            }
        }
        if(tempGrid.has(`${x_key + cellWidth},${y_key}`)){
            cell = tempGrid.get(`${x_key + cellWidth},${y_key}`)
            const rightTopShips = Object.values(cell['enclosedShips'])
            for(let value of rightTopShips){
                const ship = value['obj']; 
                if(!ship) continue;
                if(isShipHit(bullet,ship)){
                    tempGrid = removeObjectFromCells(ship,tempGrid); 
                    return value['link'];
                }
            }
        }
        return null;
    }
    const moveBullets = () => {
        if(bullets.length < 1) return;
        const tempBullets = []; 
        const tempShips = [...aliens];
        const tempGrid = new Map(grid); 
        let isCollided = false;  
        // loop through each bullet in the state 
        for(let i = 0; i < bullets.length; i++){
            isCollided = false
            const bullet = bullets[i]; 
            bullet.move(); 
            const bulletY = bullet.getY();  
            // check if the bullet is out of bounds
            if(!(bulletY >= 0 && bulletY <= CANVAS_HEIGHT)) continue;

            // check for collisions
            if(bullet.getDir() > 0){
                // check collision of alien bullets against the player ship

                // dont check bullets that aren't close to the player's ship 
                if(bullet.getY() < SHIP_Y){
                    tempBullets.push(bullet); 
                    continue;
                };
                if(isShipHit(bullet,ship)){
                    // player's ship is hit, end the game 
                    setGameOver(true); 
                    return; 
                }
            }else{
                // check collision of player bullets against alien ships
                const link = findHitShip(bullet,tempGrid); 
                if(link){
                    const {i, j} = link;
                    isCollided = true; 
                    // remove the ship from the state and the grid
                    const shipRow = tempShips[i]; 
                    shipRow.splice(j,1);
                    tempShips[i] = shipRow;
                }
            }
            // keep the bullet as long as it hasn't collided 
            if(!isCollided){
                tempBullets.push(bullet); 
            }  
        }
        setGrid(tempGrid);
        setAliens(tempShips);
        setBullets(tempBullets);
    };
    useEffect(() => {
        initializeGame();
    }, []);

    // movement of the bullets 
    // useEffect(() => {
    //     let interval_id;
    //     if(!isGameOver && bullets.length > 0){
    //         interval_id = setInterval(moveBullets, 10); 
    //     }
    //     return () => {
    //         clearInterval(interval_id);
    //     }
    // }, [aliens,bullets,isGameOver,grid]) 
    const moveAliens = () => {
        const newShips = [...aliens]; 
        const currentRow = newShips[rowIndex]; 
        let gridCopy = new Map(grid); 
        let newDirection = alienDir; 
        if(alienDir === Direction.RIGHT && rowIndex < newShips.length){
            const lastShip = currentRow[currentRow.length - 1]; 
            // check if the last ship is about to cross the border
            if(lastShip){
                if(lastShip.getX() + lastShip.getWidth() + 10 > screenWidth && rowIndex === 0){
                    setRowIndex(rowIndex + 1); 
                    setAlienDir(Direction.DOWN);
                    setAliens(newShips); 
                    setGrid(gridCopy);  
                    return;      
                }
            } 
        }else if(alienDir === Direction.LEFT && rowIndex < newShips.length){
            const firstShip = currentRow[0];
            
            // check if the first ship is about to hit the border
            if(firstShip){
                if(firstShip.getX() - 10 < 0 && rowIndex === 0){
                    setAliens(newShips); 
                    setGrid(gridCopy); 
                    setAlienDir(Direction.DOWN); 
                    setRowIndex(rowIndex + 1); 
                    return; 
                }
            }
        }else if(alienDir === Direction.DOWN && rowIndex < newShips.length){
            // check if we are approaching the very bottom... 
            //------ 
            const firstShip = newShips[rowIndex][0]; 
            const lastShip = newShips[rowIndex][currentRow.length - 1];
            if(rowIndex === 0 && lastShip.getX() + lastShip.getWidth() + 10 > screenWidth){
                newDirection = Direction.LEFT;
            }else if(rowIndex === 0 && firstShip.getX() - 10 < 0){
                newDirection = Direction.RIGHT; 
            }
        }


        for(let i = 0; i < currentRow.length; i++){
            const alien = currentRow[i]; 
            gridCopy = removeObjectFromCells(alien,gridCopy); 
            alien.setDir(alienDir); 
            alien.move(4); 
            gridCopy = pushObjectIntoCells(alien,gridCopy,{i: rowIndex, j: i}); 
            currentRow[i] = alien; 
        }
        newShips[rowIndex] = currentRow;
        if(rowIndex < newShips.length - 1){
            setRowIndex(rowIndex + 1); 
        }else{
            setRowIndex(0); 
        }
        setAliens(newShips); 
        setAlienDir(newDirection);
        setGrid(gridCopy); 
    }
    const alienAttack = () => {
        const firstRow = aliens[aliens.length - 1]; 
        const randomShooter = firstRow[Math.floor(Math.random() * firstRow.length)]; 
        if(randomShooter){
            shoot(randomShooter);
        }   
    }
    useEffect(() => { 
        let alienAttack_interval; 
        if(!isGameOver){
            alienAttack_interval = setInterval(alienAttack, 1000); 
        }
        return () => clearInterval(alienAttack_interval); 
    }, [isGameOver]); 
    useEffect(() => {
        let alienInterval; 
        if(!isGameOver && aliens.length > 0){
            alienInterval = setInterval(() => moveAliens(),10); 
        }
        return () => clearInterval(alienInterval);
    }, [isGameOver,grid,aliens,rowIndex]);

    useEffect(() => {
        let bulletInterval; 
        if(!isGameOver && bullets.length > 0){
            bulletInterval = setInterval(() => moveBullets(),10); 
        }
        return () => clearInterval(bulletInterval);
    }, [isGameOver,grid,bullets]); 


  
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
            {/* {showCells()} */}
            <Canvas 
            ship={ship}
            bullets={bullets}
            aliens={aliens}
            isGameOver={isGameOver}
            moveBullets={moveBullets}
            canvasHeight={CANVAS_HEIGHT}/>
            <Controllers 
            shoot={shoot} 
            moveShip={moveShip} 
            shipState={ship}
            isGameOver={isGameOver}
            restartGame={restartGame}
            />
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
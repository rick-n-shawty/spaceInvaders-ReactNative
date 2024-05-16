import * as React from "react"; 
import { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Dimensions, Linking } from "react-native";
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
        let gridCopy = removeObjectFromCells(tempShip, new Map(grid)); 

        if(dir === Direction.LEFT){
            tempShip.setDir(Direction.LEFT); 
            tempShip.move(SHIP_SPEED); 
        }else if(dir === Direction.RIGHT){
            tempShip.setDir(Direction.RIGHT); 
            tempShip.move(SHIP_SPEED);
        }

        gridCopy = pushObjectIntoCells(tempShip,gridCopy,{mainShip: true});
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
        for(let i = 0; i < bullets.length; i++){
            console.log(tempBullets[tempBullets.length - 1]);
            isCollided = false
            const bullet = bullets[i]; 
            bullet.move(); 
            const bulletY = bullet.getY(); 
            const bulletX = bullet.getX();
            if(!(bulletY >= 0 && bulletY <= CANVAS_HEIGHT)) continue;


            const link = findHitShip(bullet,tempGrid); 
            if(link){
                const {i, j} = link;
                isCollided = true; 
                const shipRow = tempShips[i];
                shipRow.splice(j,1);
                tempShips[i] = shipRow;
            }
            if(!isCollided){
                tempBullets.push(bullet); 
            }  
        }
        console.log(tempBullets[0]);
        setGrid(tempGrid);
        setAliens(tempShips);
        setBullets(tempBullets);
    };
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
    
    const moveAlienShips = () => {
        if(aliens.length < 1) return;
        const aliensCopy = [...aliens]; 
        const rowIndex = count % aliensCopy.length;
        const currentRow = aliensCopy[rowIndex]; 
        let longestRowIndex = 0; 
        for(let i = 0; i < aliensCopy.length; i++){
            if(aliensCopy[i].length - 1 > longestRowIndex){
                longestRowIndex = aliensCopy[i].length - 1; 
            }
        } 
        const longestRow = aliensCopy[longestRowIndex]; 
        const firstEl = longestRow[0]; 
        const lastEl = longestRow[longestRow.length - 1]; 
        let dir = alienDir 
        if(alienDir === Direction.RIGHT && rowIndex === 0){
            if(lastEl.getX() + lastEl.getWidth() + 10 > screenWidth){
                dir = Direction.DOWN;
            }
        }else if(alienDir === Direction.LEFT && rowIndex === 0){
            if(firstEl.getX() - 10 < 0){
                dir = Direction.DOWN;
            }
        }else if(alienDir === Direction.DOWN && rowIndex === 0){
            if(lastEl.getX() + lastEl.getWidth() + 10 > screenWidth){
                dir = Direction.LEFT; 
            }else if(firstEl.getX() - 10 < 0){
                dir = Direction.RIGHT;
            }
        }
        let cells = new Map(grid); 
        for(let i = 0; i < currentRow.length; i++){
            currentRow[i].setDir(dir);
            cells = removeObjectFromCells(currentRow[i],cells);
            currentRow[i].move(ALIEN_SHIP_SPEED);
            cells = pushObjectIntoCells(currentRow[i],cells,{i: rowIndex, j: i});
        }
        setGrid(cells);
        setAlienDir(dir);
        setCount(prev => prev + 1);
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
    }, [aliens,bullets,isGameOver]) 

    // movement of alien spaceships 
    useEffect(() => { 
        let interval_id; 
        if(!isGameOver){
            interval_id = setInterval(moveAlienShips, 10); 
        }
        return () => clearInterval(interval_id);
    }, [aliens,count,isGameOver,bullets])

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
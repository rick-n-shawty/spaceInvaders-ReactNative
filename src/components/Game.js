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
import { checkOverlap } from "../utils/funcs";
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
    CELL_WIDTH,
    CELL_HEIGHT,
    SHIP_SIZE,
    BULLET_HEIGHT,
    BULLET_WIDTH
} = constants; 
const cellHeight = Math.floor((CANVAS_HEIGHT + SHIP_SIZE ) / CELL_HEIGHT); 
const cellWidth = Math.floor(screenWidth / CELL_WIDTH); 
export default function Game(){ 
    const [grid, setGrid] = useState([]);
    const [ship, setShip] = useState(new ShipClass(100,SHIP_Y, SHIP_SIZE, SHIP_SIZE, false));
    const [bullets, setBullets] = useState([]); 
    const [aliens, setAliens] = useState([]); 
    const checkCollision = () => {

    };
    const moveShip = (dir) => {
        let temp;
        if(dir === Direction.LEFT){
            if(ship.getX() - SHIP_BOUNDS < 0) return;
            setShip(prev => {
                temp = new ShipClass(prev.getX() - SHIP_SPEED, prev.y, SHIP_SIZE, SHIP_SIZE, false);
                return temp; 
            })
        }else if(dir === Direction.RIGHT){
            if(ship.getX() + ship.getWidth() + SHIP_BOUNDS > screenWidth) return;
            setShip(prev => {
                temp = new ShipClass(prev.getX() + SHIP_SPEED, prev.y, SHIP_SIZE, SHIP_SIZE, false);
                return temp; 
            })
        } 


        // Local in each cell the ship is located adn highlight it
        const rowIndex = Math.round((ship.y + ship.height) / cellHeight); // !!! IMPORTANT !!!
        const row = grid[rowIndex]; 
        if(!row) return;
        for(let i = 0; i < row.length; i++){
            const cell = row[i];
            cell.isLit = checkOverlap(cell,ship);  
            row[i] = cell;         
        }
        setGrid(prev => {
            temp = [...prev]; 
            temp[rowIndex] = row;
            return temp; 
        })
        // -------------------------------------
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
        const temp = []; 
        for(let i = 0; i < bullets.length; i++){
            const bullet = bullets[i]; 
            bullet.move(); 
            if(bullet.y >= 0){
                temp.push(bullet); 
            }
        }
        setBullets(temp);
    };
    const initializeGame = () => { 
        // Generate alien spaceships
        const alienArray = [];
        for(let i = 0; i < ALIEN_ROWS; i++){
            const temp = [];
            for(let j = 0; j < ALIEN_COL; j++){
                const alienX = SHIP_BOUNDS + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * j; 
                const alienY = INITIAL_ALIEN_Y + (ALIEN_SIZE + SPACE_BETWEEN_ALIENS) * i;
                const alienObj = new ShipClass(alienX, alienY, ALIEN_SIZE, ALIEN_SIZE, true);
                temp.push(alienObj);
            }
            alienArray.push(temp);
        }
        setAliens(alienArray);  
        //------------------------- 


        // Divide the grid 
        const cells = [];
        for(let row = 0; row < CELL_HEIGHT; row++){
            const temp = [];
            for(let col = 0; col < CELL_WIDTH; col++){
                const cellX = cellWidth * col ;
                const cellY = cellHeight * row; 
                const cellObj = {
                    x: cellX, 
                    y: cellY, 
                    width: cellWidth, 
                    height: cellHeight,
                    isLit: false
                };
                temp.push(cellObj);
            }
            cells.push(temp); 
        }
        setGrid(cells);
        //------------------------- 

    }
    const moveAlienShips = () => {
    
        for(let i = 0; i < aliens.length; i++){
            
        }
    }
    const alienAttack = () => {

    }
    useEffect(() => {
        let interval_id;
        if(bullets.length > 0){
            interval_id = setInterval(moveBullets, 10); 
        }
        return () => {
            clearInterval(interval_id);
        }
    }, [bullets]) 
    useEffect(() => {
        initializeGame();
    }, [])

    const showCells = () => {
        const comps = [];
        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[row].length; col++){ 
                const item = grid[row][col]; 
                comps.push(<Cell key={`${row},${col}`} cell={item}/>);
            }
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
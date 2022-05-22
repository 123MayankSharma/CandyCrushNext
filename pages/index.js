import { useEffect, useState } from 'react';
import ScoreBoard from './components/ScoreBoard.js'
const blueCandy='/blue-candy.png'
const yellowCandy='/yellow-candy.png'
const redCandy='/red-candy.png'
const purpleCandy='/purple-candy.png'
const orangeCandy='/orange-candy.png'
const greenCandy='/green-candy.png'
const blank='/blank.png'



const column = 8;
const candyColors = [
    blueCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy,
    greenCandy
]

const Home = () => {
    const [Board, setBoard] = useState([]);
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [score,setScore]=useState(0)
    const columnOfThreeCheck = () => {
        for (let i = 0; i < 48; i++) {
            //check for three consecutive vertical blocks
            //if they have the same color
            //and if they do then remove them
            const idxOfElementsToBeChecked = [i, i + column, i + (column * 2)];
            const colorToCheck = Board[i];
            const isEmpty=Board[i]===blank
            if (idxOfElementsToBeChecked.every(block => Board[block] === colorToCheck && !isEmpty)) {
                setScore((score)=>score+3);
                idxOfElementsToBeChecked.forEach(block => Board[block] = blank);
                return true;
            }
        }
    }


    const columnOfFourCheck = () => {
        for (let i = 0; i < 40; i++) {
            //check for four consecutive vertical blocks
            //if they have the same color
            //and if they do then remove them
            const idxOfElementsToBeChecked = [i, i + column, i + (column * 2), i + (column * 3)];
            const colorToCheck = Board[i];
           const isEmpty=Board[i]===blank

            if (idxOfElementsToBeChecked.every(block => Board[block] === colorToCheck && !isEmpty)) {
                setScore((score)=>score+4);
                idxOfElementsToBeChecked.forEach(block => Board[block] = blank);
                return true;
            }
        }
    }


    const rowOfThreeCheck = () => {
        for (let i = 0; i < 64; i++) {
            //check for three consecutive horizontal blocks
            //if they have the same color
            //and if they do then remove them
            const idxOfElementsToBeChecked = [i, i + 1, i + 2];
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
            const colorToCheck = Board[i];
            if (notValid.includes(i)) {
                continue;
            }
            const isEmpty=Board[i]===blank
 
            if (idxOfElementsToBeChecked.every(block => Board[block] === colorToCheck && !isEmpty)) {
                setScore((score)=>score+3);
                idxOfElementsToBeChecked.forEach(block => Board[block] = blank);
                return true;
            }
        }
    }
    const rowOfFourCheck = () => {
        for (let i = 0; i < 64; i++) {
            //check for four consecutive horizontal blocks
            //if they have the same color
            //and if they do then remove them
            const idxOfElementsToBeChecked = [i, i + 1, i + 2, i + 3];
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];
            const colorToCheck = Board[i];
            if (notValid.includes(i)) {
                continue;
            }
             const isEmpty=Board[i]===blank
 

            if (idxOfElementsToBeChecked.every(block => Board[block] === colorToCheck && !isEmpty)) {
                setScore((score)=>score+4);
                    
                idxOfElementsToBeChecked.forEach(block => Board[block] = blank);
                return true;
            }
        }
    }

    const moveIntoEmptyBlocksBelow = () => {
        for (let i = 0; i < 64 - column; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const firstRowCheck = firstRow.includes(i)

            if (firstRowCheck && Board[i] === blank) {
                Board[i] = candyColors[Math.floor(Math.random() * candyColors.length)]
            }

            if (Board[i + column] === blank) {
                Board[i + column] = Board[i];
                Board[i] = blank;
            }

        }
    }



    const dragStart = (e) => {
        // console.log("drag start")
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        // console.log("drag drop")
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = squareBeingDragged.getAttribute('data-id')
        const squareBeingReplacedId = squareBeingReplaced.getAttribute('data-id')

        Board[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');
        Board[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');

        const validMoves = [
            squareBeingDraggedId + 1,
            squareBeingDraggedId + column,
            squareBeingDraggedId - 1,
            squareBeingDraggedId - column
        ]

        const isCurrentMoveValid = validMoves.includes(squareBeingReplacedId)

        const rowOfFour = rowOfFourCheck()
        const rowOfThree = rowOfThreeCheck()
        const columnOfFour = columnOfFourCheck();
        const columnOfThree = columnOfThreeCheck();

        if (squareBeingReplacedId && isCurrentMoveValid && (rowOfFour || rowOfThree || columnOfFour || columnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            Board[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            Board[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setBoard([...Board])
        }


    }

    const createBoard = () => {
        //creating a new board on every render
        const randomColorRow = []
        for (let i = 0; i < column * column; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorRow.push(randomColor);
        }
        setBoard(randomColorRow);
    }

    useEffect(() => {
        createBoard()
    }, [])

    //checking for columnOfThree
    //every 100 seconds
    //and using clearInterval to reset the timer.
    //the useEffect is run for every change that happens
    //to the board or when columnOfThreeCheck is run
    useEffect(() => {
        const timer = setInterval(() => {
            columnOfFourCheck();
            rowOfFourCheck();
            columnOfThreeCheck();
            rowOfThreeCheck();
            moveIntoEmptyBlocksBelow();
            setBoard([...Board])
        }, 100)

        return () => clearInterval(timer)

    }, [columnOfFourCheck, rowOfFourCheck, columnOfThreeCheck, rowOfThreeCheck, moveIntoEmptyBlocksBelow, Board])
    return (
        <div className='app' style={{ display: 'flex', padding: "30px", backgroundColor: "#729981", width: "100%", height: "100%", padding: "5.75vh" }} >
            <div className='game' style={{ width: "560px", height: "560px", display: "flex", flexWrap: "wrap" }}>
                {Board.map((currentColor, idx) => {
                    return (
                        <>
                            <img
                                key={idx}
                                src={currentColor}
                                style={{ width: "70px", height: "70px",backgroundColor:"#729981" }}
                                alt=""
                                data-id={idx}
                                draggable={true}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()}
                                onDragLeave={(e) => e.preventDefault()}
                                onDragStart={dragStart}
                                onDrop={dragDrop}
                                onDragEnd={dragEnd}
                            />
                        </>
                    )
                })}
            </div>
            <ScoreBoard score={score}/>
        </div>
    )


}

export default Home;

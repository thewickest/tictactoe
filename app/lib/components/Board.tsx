"use client"
import { useEffect, useState } from "react";
import useBoard from "../hooks/useBoard";
import styles from './Board.module.css';

type Board = {
  _id: string,
  board: string[][],
  status: string,
}

export default function Board() {
  const { board, setBoard, updateBoard, getNextBoard, getNewBoard }: 
  { board: Board | undefined,
    setBoard: any,
    updateBoard: any,
    getNextBoard: any,
    getNewBoard: any,
  }= useBoard();
  const [ hasPlayed, setHasPlayed ] = useState(false);
  const [ isOver, setIsOver ] = useState(false);

  const handleClick = async (row: number, column: number) => {
    if(board?.board[row][column] === '') {
        const newBoard = board && board.board.map((r, rowIndex) =>
          r.map((cell, colIndex) => (rowIndex === row && colIndex === column) ? 'X' : cell)
      );
      const uptBoard = await updateBoard(board?._id, newBoard );
      setBoard(uptBoard)
      if(await uptBoard.status === 'ongoing') {
        setHasPlayed(true);
      } else {
        setIsOver(true);
      }
    }
  }

  const handleNewGame = async () => {
    const newBoard = await getNewBoard();
    setBoard(newBoard);
  }

  useEffect(()=>{
    if(hasPlayed) {
      const fetchData = async () => {
        const genBoard = await getNextBoard(board?._id);
        setBoard(genBoard)
        setHasPlayed(false);
      }
      fetchData();
    }
  }, [hasPlayed])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TicTacToe</h1>
      <div className={styles.grid}>
        {board && board.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid black',
                fontSize: '24px',
              }}
            >
              {cell}
            </div>
          ))
        )}
      <button onClick={()=>handleNewGame()} className={styles.button}>New game</button>
      </div>
      {isOver && (
      <div className={styles.result}>
        { board && board?.status === 'draw' && <h2>Its a draw</h2>}
        { board && board?.status === 'player1_wins' && <h2>Player 1 wins!</h2>}
        { board && board?.status === 'player2_wins' && <h2>Player 2 wins!</h2>}
      </div>)}
    </div>
  );
};
"use client"
import { useEffect, useState } from "react";
import useBoard from "../hooks/useBoard";

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

  const handleClick = async (row: number, column: number) => {
    const newBoard = board && board.board.map((r, rowIndex) =>
      r.map((cell, colIndex) => 
        (rowIndex === row && colIndex === column ? 'X' : cell))
    );
    const updatedBoard = await updateBoard(board?._id, newBoard );
    setBoard(updatedBoard)
    setHasPlayed(true);
  }

  const handleNewGame = async () => {
    const newBoard = await getNewBoard();
    setBoard(newBoard);
  }

  useEffect(()=>{
    if(hasPlayed) {
      const fetchData = async () =>{
        const genBoard = await getNextBoard(board?._id);
        setBoard(genBoard)
        setHasPlayed(false);
      }
      fetchData();
    }
  }, [hasPlayed])

  return (
    <div>
      <h1>TicTacToe</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '10px', justifyContent: 'center' }}>
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
        <button onClick={()=>handleNewGame()}>New game</button>
      </div>
    </div>
  );
};
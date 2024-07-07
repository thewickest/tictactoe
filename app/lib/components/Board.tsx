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
  const { board, setBoard, updateBoard, getNextBoard, getNewBoard, getStats }: 
  { board: Board | undefined,
    setBoard: any,
    updateBoard: any,
    getNextBoard: any,
    getNewBoard: any,
    getStats: any,
  }= useBoard();
  const [ hasPlayed, setHasPlayed ] = useState(false);
  const [ isOver, setIsOver ] = useState(false);
  const [ stats, setStats ] = useState(null)

  const handleClick = async (row: number, column: number) => {
    if(board?.board[row][column] === '') {
        const newBoard = board && board.board.map((r, rowIndex) =>
          r.map((cell, colIndex) => (rowIndex === row && colIndex === column) ? 'X' : cell)
      );
      const uptBoard = await updateBoard(board?._id, newBoard );
      setBoard(uptBoard)
      if(await uptBoard.status !== 'ongoing') {
        setIsOver(true);
      }
      setHasPlayed(true);
    }
  }

  const handleNewGame = async () => {
    const newBoard = await getNewBoard();
    setBoard(newBoard);
    setIsOver(false);
    setHasPlayed(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const stats  = await getStats();
      setStats(stats);
    }
    fetchData();
  }, [isOver])

  useEffect(()=>{
    if(hasPlayed) {
      const fetchData = async () => {
        const genBoard = await getNextBoard(board?._id);
        setBoard(genBoard)
        if(await genBoard.status !== 'ongoing') {
          setIsOver(true);
        }
        setHasPlayed(false);
      }
      fetchData();
    }
  }, [hasPlayed])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TicTacToe 2</h1>
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
      { stats && (
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Player 1 Wins:</div>
            <div className={styles.statValue}>{stats.player1}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Draws:</div>
            <div className={styles.statValue}>{stats.draw}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Player 2 Wins:</div>
            <div className={styles.statValue}>{stats.player2}</div>
          </div>
        </div>
      )}
    </div>
  );
};
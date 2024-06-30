import { useEffect, useState } from "react";

export type Board = {
  _id: string,
  board: string[][],
  status: string,
}

const url = 'http://localhost:3001'
const useBoard = () => {
  const [ board, setBoard ] = useState<Board>();
  const [ gameStatus, setGameStatus ] = useState<string>();

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const response = await fetch(`${url}/board`);
        const data = await response.json();

        setBoard(data);
      } catch (err) {
        console.log('Some error happened!');
      }
    };

    fetchGameStatus();
  }, []);

  const updateBoard = async (id: string, b: any) => {
    try {
      const res = await fetch(`${url}/board/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ board: b }),
      })
      return await res.json();
    } catch (error) {
      console.log('An error happened!');
    }
  }

  const getNewBoard = async () => {
    try {
      const res = await fetch(`${url}/board/new`)
      return await res.json();
    } catch (error) {
      console.log('An error happened!');
    }
  }

  const getNextBoard = async (id: string) => {
    try {
      const res = await fetch(`${url}/board/${id}`)
      return await res.json();
    } catch (error) {
      console.log('An error happened!');
    }
  }

  return { board, setBoard, getNewBoard, updateBoard, getNextBoard }
}

export default useBoard;
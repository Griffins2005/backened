import React, { useState, useEffect } from "react";
import Squares from "./Squares";
import Confetti from "react-confetti";
import axios from "axios";

export default function Board() {
  const [gameId, setGameId] = useState("");
  const [character, setCharacter] = useState(Array(9).fill(""));
  const [isTurn, setIsTurn] = useState(true);
  const [isCellClicked, setIsCellClicked] = useState(false);
  const [loserPlayer, setLoserPlayer] = useState("");
  const [isWinner, setIsWinner] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const drawMessage = "☘Ooops🌵 IT'S A DRAW";

  useEffect(() => {
    createNewGame();
  }, []);

  const createNewGame = () => {
    axios
      .post("http://localhost:5000/game")
      .then((res) => {
        const gameId = res.data._id;
        setGameId(gameId);
      })
      .catch((err) => console.log(err));
  };

  const makeMove = (index) => {
    if (character[index] !== "") {
      alert("Hey you! I've already been clicked!");
      return;
    }

    const copyStateCharacter = [...character];
    copyStateCharacter[index] = isTurn ? "X" : "O";
    setCharacter(copyStateCharacter);
    setIsTurn(!isTurn);
    setIsCellClicked(true);
    setLoserPlayer(isTurn ? "⭕" : "❌");

    const moveData = {
      row: Math.floor(index / 3),
      col: index % 3,
      player: isTurn ? "X" : "O",
    };

    axios
      .post(`http://localhost:5000/game/${gameId}/move`, moveData)
      .then(() => {
        fetchGameData();
      })
      .catch((err) => console.log(err));
  };

  const fetchGameData = () => {
    axios
      .get(`http://localhost:5000/game/${gameId}`)
      .then((res) => {
        const gameData = res.data;
        setCharacter(gameData.board.flat());
        setIsWinner(checkWinner(gameData.board.flat()));
        setIsDraw(gameData.status === "Draw");
      })
      .catch((err) => console.log(err));
  };

  const checkWinner = (board) => {
    const winningPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (let i = 0; i < winningPositions.length; i++) {
      const [a, b, c] = winningPositions[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setIsWinner(board[a]);
        return board[a];
      }
    }
  
    return null;
  };
  

  const handleReset = () => {
    setCharacter(Array(9).fill(""));
    setIsCellClicked(false);
    setIsWinner(false);
    setIsDraw(false);
    createNewGame();
  };

  return (
    <>
      {isWinner && <Confetti />}
      {isWinner ? (
        <div>
          <h1>🎉{isWinner} has won the game🎉</h1>
          <h1>Player{loserPlayer} try next time</h1>
          <div>
            <button onClick={handleReset} className="play">
              Reset Game
            </button>
          </div>
        </div>
      ) : isDraw ? (
        <div>
          <h1 className="Draw">{drawMessage}</h1>
          <div>
            <button onClick={handleReset} className="play">
              Reset Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="header">
            <h1>TIC-TAC-TOE</h1>
            <h3>Player: {isTurn ? "X" : "O"} Make Your Move😎!</h3>
          </div>
          <div className="rows">
            {character.map((cell, index) => (
              <Squares key={index} onClick={() => makeMove(index)} value={cell} />
            ))}
          </div>
          <div className="boardbuttons">
            {isCellClicked && (
              <button onClick={handleReset} className="play">
                Reset Game
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}


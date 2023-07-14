const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    board: {
      type: [[String]],
      required: true,
      default: [['', '', ''], ['', '', ''], ['', '', '']],
    },
    currentPlayer: {
      type: String,
      enum: ['X', 'O'],
      required: true,
      default: 'X',
    },
    status: {
      type: String,
      enum: ['In Progress', 'X Wins', 'O Wins', 'Draw'],
      required: true,
      default: 'In Progress',
    },
  },
  {
    timestamps: true,
  }
);

gameSchema.methods.checkForWin = function () {
  const board = this.board;
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      this.status = `${board[a]} Wins`;
      return board[a];
    }
  }

  if (board.flat().every((cell) => cell !== '')) {
    this.status = 'Draw';
    return 'Draw';
  }

  return null;
};

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;


const router = require('express').Router();
const Game = require('../models/game.model');

router.post('/', async (req, res) => {
  try { 
    const newGame = new Game();
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new game' });
  }
});

router.get('/:id', (req, res) => {
  Game.findById(req.params.id)
    .then((game) => res.json(game))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.post('/:id/move', (req, res) => {
  const { id } = req.params;
  const { row, col, player } = req.body;

  Game.findById(id)
    .then((game) => {
      if (game.status !== 'In Progress') {
        return res.status(400).json('Game is already over');
      }

      if (game.currentPlayer !== player) {
        return res.status(400).json('Invalid player');
      }

      if (
        row < 0 ||
        row > 2 ||
        col < 0 ||
        col > 2 ||
        game.board[row][col] !== ''
      ) {
        return res.status(400).json('Invalid move');
      }

      game.board[row][col] = player;
      game.currentPlayer = player === 'X' ? 'O' : 'X';

      const winner = game.checkForWin();
      if (winner) {
        game.status = winner === 'Draw' ? 'Draw' : `${winner} Wins`;
      }

      game
        .save()
        .then(() => res.json('Move made successfully'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;


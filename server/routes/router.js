const router = require('express').Router();
const {
  newgame,
  getGame,
  gameProgress
} = require('../controllers/controller')
router.post('/',newgame);

router.get('/:id',getGame );

router.post('/:id/move', gameProgress);

module.exports = router;


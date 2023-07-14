const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const gameRouter = require('./routes/router');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("../client/src"));
app.use('/game', gameRouter);
app.use('/game/${gameId}', gameRouter);
app.use('/game/${gameId}/move', gameRouter);
app.use('/game', gameRouter);
mongoose.connect('mongodb+srv://machariacollins79:collins2005@cluster0.jxzzg5i.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});




app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


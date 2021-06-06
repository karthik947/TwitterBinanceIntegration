require('dotenv').config();
const cors = require('cors');
const path = require('path');

const express = require('express');
const app = express();
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);

app.use(cors());
app.use(express.json());
app.use('/items', require('./Routes/items'));
const { ENVIRONMENT } = process.env;
if (ENVIRONMENT === 'PROD') {
  app.use('/', express.static(path.join(__dirname, './build/')));
  // app.use('/', require('./Routes/pages'));
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
}

const stream = require('./Utils/stream');
const processTweet = require('./Utils/processTweet');

stream.eventEmiter.on('TWEET', processTweet);
stream.start();

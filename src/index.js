import 'dotenv/config';
import express from 'express';
import { db } from './config/mongo.js';
const app = express();

const port = process.env.PORT;
db();

app.get('/', (req, res) => {
  res.send('chat app server ');
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';

import { db } from './config/mongo.js';
import authrouter from './routes/auth.route.js';
import messageRouter from './routes/message.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT;
db();

//api endpoints
app.get('/', (req, res) => {
  res.send('chat app server ');
});
app.use('/api/auth/', authrouter);
app.use('/api/message/', messageRouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"

import { db } from './config/mongo.js';
import authrouter from './routes/auth.route.js';
import messageRouter from './routes/message.routes.js';
import { app, server } from './lib/socket.js';

// const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://realtymechatapp.netlify.app/login',
    credentials: true,
  })
);

const port = process.env.PORT;
db();

//api endpoints
app.get('/', (req, res) => {
  res.send('chat app server ');
});
app.use('/api/auth/', authrouter);
app.use('/api/messages/', messageRouter);

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

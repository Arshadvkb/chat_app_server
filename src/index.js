import 'dotenv/config';
import express from 'express';
import { db } from './config/mongo.js';
import authrouter from './routes/auth.route.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;
db();

app.get('/', (req, res) => {
  res.send('chat app server ');
});
app.use('/api/auth/', authrouter);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

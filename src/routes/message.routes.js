import express from 'express';
import {
  getMessages,
  getUser,
  sendMessage,
} from '../controllers/message.controller.js';
import { protectRout } from '../middleware/auth.middleware.js';

const messageRouter = express.Router();

messageRouter.get('/get_user', protectRout, getUser);
messageRouter.get('/:id', protectRout, getMessages);
messageRouter.get('/send/:id', protectRout, sendMessage);

export default messageRouter;

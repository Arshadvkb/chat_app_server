import express from 'express';
import {
  getMessages,
  getUser,
  sendMessage,
} from '../controllers/message.controller.js';
import { protectRout } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';

const messageRouter = express.Router();

messageRouter.get('/get_user', protectRout, getUser);
messageRouter.get('/:id', protectRout, getMessages);
messageRouter.post('/send/:id', protectRout,upload.single('file'), sendMessage);

export default messageRouter;

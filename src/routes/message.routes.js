import express from 'express';
import { getMessages, getUser } from '../controllers/message.controller.js';
import { protectRout } from '../middleware/auth.middleware.js';

const messageRouter = express.Router();

messageRouter.get('/get_user', protectRout, getUser);
messageRouter.get('/:id', protectRout, getMessages);

export default messageRouter;

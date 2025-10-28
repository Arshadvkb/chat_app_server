import express from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import upload from '../middleware/multer.js';
const authrouter = express.Router();

authrouter.post('/register', upload.single('file'), register);
authrouter.post('/login', login);
authrouter.post('/logout', logout);

export default authrouter;

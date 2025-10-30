import express from 'express';
import { checkAuth, login, logout, register, updateProfile } from '../controllers/auth.controller.js';
import { protectRout } from '../middleware/auth.middleware.js';

const authrouter = express.Router();

authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.post('/logout', logout);
authrouter.put('/update-profile', protectRout, updateProfile);
authrouter.get('/check', protectRout, checkAuth);

export default authrouter;

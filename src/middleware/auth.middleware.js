import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protectRout = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: 'unauthorized-No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETE);

    if (!decoded) {
      return res.status(401).json({ message: 'unauthorized-Invalid token ' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'No user found ' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

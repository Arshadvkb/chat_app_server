import { generateToken } from '../lib/utils.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';


const register = async (req, res) => {
  const { email, fullname, password } = req.body;
  console.log(req.body);
  try {
    if (!email || !fullname || !password || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'password must be greater than 6 characters',
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'User with email already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res
        .status(201)
        .json({ success: true, message: 'Register successful', newUser });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: 'No user found' });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
      generateToken(existingUser._id, res);
      return res
        .status(200)
        .json({ success: true, message: 'Login successful' });
    } else {
      return res
        .status(400)
        .json({ success: false, message: 'Wrong password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};




 const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log('error in update profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

 const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth controller', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { register, login, logout, updateProfile, checkAuth };

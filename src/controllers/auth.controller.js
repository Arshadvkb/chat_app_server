import { generateToken } from '../lib/utils.js';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';

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

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'library_books',
    });

    const imageData = {
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      image: imageData,
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

    const isMatch = await bcrypt.compare(password , existingUser.password);

    if (isMatch) {
      generateToken(existingUser._id, res);
      return res
        .status(201)
        .json({ success: true, message: 'Login successful' });
    }
     else {
      return res
        .status(400)
        .json({ success: false, message: 'Wrong password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export { register, login };

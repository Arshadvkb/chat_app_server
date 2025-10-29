import { User } from '../models/user.model.js';

const getUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterduser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');
    return res.status(200).json({ success: true, filterduser });
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getUser };

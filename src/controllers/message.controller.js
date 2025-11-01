import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';
import cloudinary from '../config/cloudinary.js';

const getUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterduser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    console.log(filterduser);
    
    return res.status(200).json({ filterduser });
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderid: myId, recieverid: userToChatId },
        { senderid: userToChatId, recieverid: myId },
      ],
    });
    return res.status(200).json({ messages });
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;
    let imgUrl = '';
    if (image) {
      const uploadResponse = cloudinary.uploader.uploade(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imgUrl,
    });
    await newMessage.save();

    // add realtime application here
    
    const receiverSocketId = getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(200).json({ newMessage });
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getUser, getMessages, sendMessage };

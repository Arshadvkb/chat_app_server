import { User } from '../models/user.model.js';
import { Message } from '../models/message.model.js';
import cloudinary from '../config/cloudinary.js';
import { getReceiverSocketId } from '../lib/socket.js';

const getUser = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterduser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password');

    console.log(filterduser);
    
    return res.status(200).json({ filterduser });
  } catch (error) {
    console.log('error ---' + error.message);
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
    console.log("message===="+messages);
    
    return res.status(200).json({ messages });
  } catch (error) {
    console.log('error --->' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {


    console.log("send message====>"+req.body);
    
    const { text, image } = req.body;
    const { id: recieverid } = req.params;
    const senderid = req.user._id;
    let imgUrl = '';
    if (image) {
      const uploadResponse =await cloudinary.uploader.upload(image);
      imgUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderid,
      recieverid,
      text,
      image: imgUrl,
    });
    await newMessage.save();

    // add realtime application here
    
    const receiverSocketId = getReceiverSocketId(recieverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    console.log("new message"+newMessage);
    
    return res.status(200).json({ newMessage });
  } catch (error) {
  console.error('send message====>' + error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { getUser, getMessages, sendMessage };

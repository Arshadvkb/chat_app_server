import mongoose from 'mongoose';

const mesaageSchema = mongoose.Schema(
  {
    senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recieverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', mesaageSchema);

export { Message };

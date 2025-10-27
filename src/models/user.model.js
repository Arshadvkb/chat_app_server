import mongoose, { Types } from 'mongoose';

const userSchema = mongoose.Schema(
  {
    email: {
      Type: String,
      required: true,
      unique: true,
    },
    fullname: {
      Type: String,
      required: true,
    },
    password: {
      Type: String,
      required: true,
      minlength: 6,
    },
    image: {
      Type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;

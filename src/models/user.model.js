import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    image: {
      public_id: { type: String },
      secure_url: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export {User};

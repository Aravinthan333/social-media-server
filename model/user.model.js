import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

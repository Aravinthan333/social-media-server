import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const emailAlreadyExists = await User.findOne({ email });
    console.log(emailAlreadyExists);

    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "email Already Registered!" });
    }

    const userNameAlreadyExists = await User.findOne({ username });
    console.log(userNameAlreadyExists);

    if (userNameAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Username Already taken!" });
    }

    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password should be at least 8 characters long",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ------------------------------------------------------------------------------------------------------------------------------

export const login = async (req, res) => {
  return res.send("login");
};

export const profile = async (req, res) => {
  return res.send("profile");
};

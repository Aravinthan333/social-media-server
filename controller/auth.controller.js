import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const emailAlreadyExists = await User.findOne({ email });
    // console.log(emailAlreadyExists);

    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "email Already Registered!" });
    }

    const userNameAlreadyExists = await User.findOne({ username });
    // console.log(userNameAlreadyExists);

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
  try {
    const { nameEmail, password } = req.body;

    if (!nameEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both username and password",
      });
    }

    const user = await User.findOne({
      $or: [{ username: nameEmail }, { email: nameEmail }],
    });

    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    const verifyPassword = await bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    console.log(verifyPassword);

    const token = jwt.sign(
      { userId: user._id, userName: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ------------------------------------------------------------------------------------------------------------------------------

export const profile = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error during get profile:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

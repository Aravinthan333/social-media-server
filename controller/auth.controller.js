import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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
    });

    await user.save();

    const token = await jwt.sign(
      { userId: user._id, userName: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    await res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      token,
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

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    const verifyPassword = bcrypt.compareSync(password, user.password);

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid username or password" });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const { password: hashedPassword, ...rest } = user._doc;

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        token,
        // user: {
        //   userId: user._id,
        //   username: user.username,
        //   email: user.email,
        // },
        user: rest,
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

export async function profile(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error during user retrieval:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

export const updateProfile = async (req, res) => {};

// ------------------------------------------------------------------------------------------------------------------------------

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

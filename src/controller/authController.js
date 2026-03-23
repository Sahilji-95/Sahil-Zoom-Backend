import httpStatus from "http-status";
import { User } from "../models/users.model.js";
import { Meeting } from "../models/meeting.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const registerUser = async (req, res) => {
  let { email, username, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.FOUND).json({ message: "User exist" });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPass,
      email: email,
    });
    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (error) {
    res.json({ message: `Something Went Wrong ${error}` });
  }
};

const login = async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username or password Missing" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    let token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    await user.save();
    return res.status(httpStatus.OK).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (error) {
    res.json({ message: `Something Went wrong ${error}` });
  }
};
const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added to history" });
  } catch (error) {
    res.json({ message: `Something went worng ${error}` });
  }
};

export { login, registerUser, getUserHistory, addToHistory };

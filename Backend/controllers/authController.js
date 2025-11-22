import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed
    });

    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FORGOT PASSWORD (Send OTP to Email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendEmail(
      user.email,
      "Your Password Reset OTP",
      `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 10 minutes.</p>`
    );

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

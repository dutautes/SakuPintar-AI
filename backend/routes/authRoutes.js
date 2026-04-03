import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "7d" });
    res.json({
      message: "Register berhasil",
      token,
      user: { id: newUser._id, name, email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email dan password wajib diisi" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
    res.json({
      message: "Login berhasil",
      token,
      user: { id: user._id, name: user.name, email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default router;

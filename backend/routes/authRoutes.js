import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Semua field wajib diisi" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "YOUR_SECRET_KEY", { expiresIn: "7d" });
    const SECRET = "YOUR_SECRET_KEY";
    res.json({ message: "Register berhasil", token, user: { id: newUser._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Input:", password); // 👈 TAMBAHIN DI SINI

  if (!email || !password)
    return res.status(400).json({ message: "Email dan password wajib diisi" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

    console.log("DB:", user.password); // 👈 TAMBAHIN DI SINI

    if (user.password !== password)
      return res.status(400).json({ message: "Password salah" });

    const token = jwt.sign({ id: user._id }, "YOUR_SECRET_KEY", { expiresIn: "7d" });
  
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
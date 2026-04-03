import express from "express";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Profile from "../models/Profile.js";

const router = express.Router();

router.use(authMiddleware);

// GANTI PASSWORD
// PUT /api/settings/password
// Body: { currentPassword, newPassword }
router.put("/password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Semua field wajib diisi" });

  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password baru minimal 6 karakter" });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password lama salah" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// HAPUS AKUN
// DELETE /api/settings/account
// Body: { password } — konfirmasi sebelum hapus
router.delete("/account", async (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ message: "Konfirmasi password diperlukan" });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password salah" });

    // Hapus semua data milik user
    await Transaction.deleteMany({ userId: req.userId });
    await Profile.findOneAndDelete({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);

    res.json({ message: "Akun berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

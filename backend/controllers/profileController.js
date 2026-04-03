import Profile from "../models/Profile.js";
import User from "../models/User.js";

// GET profile milik user yang sedang login
export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.userId });

    // Kalau belum ada profile, buat otomatis dari data user
    if (!profile) {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      profile = await Profile.create({
        userId: req.userId,
        name: user.name,
        email: user.email,
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE profile milik user yang sedang login
export const updateProfile = async (req, res) => {
  try {
    // Jangan izinkan user mengubah userId atau email lewat profile update
    const { userId, email, ...updateData } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ message: "Profile berhasil diupdate", data: profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

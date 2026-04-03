// backend/routes/TransactionRoutes.js
import express from "express";
import Transaction from "../models/Transaction.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET semua transaksi user
router.get("/", async (req, res) => {
  try {
    const data = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST transaksi baru
router.post("/", async (req, res) => {
  try {
    const { category, type, amount, date, desc } = req.body;

    const newTransaction = new Transaction({
      userId: req.userId,
      category,
      type,
      amount,
      date,
      desc,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaksi berhasil ditambahkan", data: newTransaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE transaksi
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    if (transaction.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Akses ditolak" });

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE transaksi
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    if (transaction.userId.toString() !== req.userId)
      return res.status(403).json({ message: "Akses ditolak" });

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Transaksi berhasil diupdate", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

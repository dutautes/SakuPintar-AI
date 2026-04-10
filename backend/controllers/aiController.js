import { openrouter, DEFAULT_MODEL } from "../config/openRouterConfig.js";
import Transaction from "../models/Transaction.js";
import Profile from "../models/Profile.js";
import mongoose from "mongoose";

export const askAI = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt || !userId) {
      return res.status(400).json({ message: "Prompt and userId are required" });
    }

    // Fetch user profile for context
    const profile = await Profile.findOne({ userId });

    // Calculate total balance using efficient MongoDB aggregation
    const balanceResult = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: null,
          totalIncome: { 
            $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] } 
          },
          totalExpense: { 
            $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] } 
          }
        }
      }
    ]);

    const totalBalance = balanceResult.length > 0 
      ? balanceResult[0].totalIncome - balanceResult[0].totalExpense 
      : 0;

    // Fetch up to 10 latest transactions for context (more efficient)
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    // Format data for AI context
    const contextData = {
      user: profile ? { name: profile.name, status: profile.status } : "Unknown",
      totalBalance,
      recentTransactions: transactions.map(t => ({
        type: t.type,
        category: t.category,
        amount: t.amount,
        date: t.date,
        desc: t.desc
      }))
    };

    const systemInstruction = `
      Anda adalah SakuPintar AI, asisten keuangan pribadi yang cerdas.
      Tugas Anda adalah:
      1. Memberikan laporan kesehatan keuangan berdasarkan data saldo total dan transaksi.
      2. Menjawab pertanyaan (chat assistant) tentang pengeluaran, pemasukan, dan saran keuangan.
      
      Gunakan bahasa Indonesia yang ramah, profesional, dan mudah dimengerti. 
      Jika data transaksi kosong, beritahu user bahwa mereka belum memiliki catatan transaksi.
      
      Data Pengguna:
      - Nama/Status: ${JSON.stringify(contextData.user)}
      - Saldo Total Saat Ini: Rp ${contextData.totalBalance.toLocaleString("id-ID")}
      - 10 Transaksi Terakhir: ${JSON.stringify(contextData.recentTransactions)}
    `;

    // Combine system instruction into user message as 'system' role is not supported by this model/provider
    const combinedPrompt = `${systemInstruction}\n\nUser Question: ${prompt}`;

    const response = await openrouter.chat.send({
      chatRequest: {
        model: DEFAULT_MODEL,
        messages: [
          { role: "user", content: combinedPrompt }
        ],
        stream: false 
      }
    });

    // Parse text response from OpenRouter
    const text = response.choices?.[0]?.message?.content || "Maaf, saya tidak bisa memberikan jawaban saat ini.";

    res.status(200).json({ 
      message: "Success",
      data: text 
    });

  } catch (error) {
    console.error("Error in askAI:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

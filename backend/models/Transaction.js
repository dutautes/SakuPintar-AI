import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  desc: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Transaction", transactionSchema);
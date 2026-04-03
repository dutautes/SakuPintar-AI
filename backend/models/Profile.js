import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  avatar: { type: String, default: "" },
  status: { type: String, default: "" },
  location: { type: String, default: "" },
  joined: { type: String, default: "" },
});

export default mongoose.model("Profile", profileSchema);

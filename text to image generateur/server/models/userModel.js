import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  CreditBalance: { type: Number, default: 50 },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

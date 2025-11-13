import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: {tpe:String},
  lastname: {tpe:String},
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

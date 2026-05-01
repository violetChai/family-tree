import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  familyId: { type: String, default: "default" },

  bio: { type: String, default: "" },
  birthYear: { type: String, default: "" },
  deathYear: { type: String, default: "" },
  photo: { type: String, default: "" },

  x: Number,
  y: Number
});

export default mongoose.model("Person", PersonSchema);
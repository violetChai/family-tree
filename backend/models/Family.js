import mongoose from "mongoose";

const FamilySchema = new mongoose.Schema({
    name: String,
    ownerId: String
});

export default mongoose.model("Family", FamilySchema);
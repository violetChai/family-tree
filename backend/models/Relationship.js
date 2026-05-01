import mongoose from "mongoose";

const RelationshipSchema = new mongoose.Schema({
    from: String,
    to: String,
    type: {
        type: String,
        enum: ["parent", "spouse"]
    }
});

export default mongoose.model("Relationship", RelationshipSchema);
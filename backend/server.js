require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- MONGO CONNECT ---------------- */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("Mongo error:", err));

/* ---------------- MODEL ---------------- */
const PersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Person = mongoose.model("Person", PersonSchema);

/* ---------------- ROUTES ---------------- */

// root test
app.get("/", (req, res) => {
    res.send("Family Tree API running");
});

// get people from MongoDB
app.get("/api/people", async (req, res) => {
    const people = await Person.find();
    res.json(people);
});

// add person
app.post("/api/people", async (req, res) => {
    const person = await Person.create(req.body);
    res.json(person);
});

// delete person
app.delete("/api/people/:id", async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

/* ---------------- START SERVER ---------------- */
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
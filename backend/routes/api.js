import express from "express";
import Person from "../models/Person.js";
import Relationship from "../models/Relationship.js";

const router = express.Router();

// GET ALL
router.get("/data", async (req, res) => {
    const nodes = await Person.find();
    const links = await Relationship.find();
    res.json({ nodes, links });
});

// CREATE PERSON
router.post("/person", async (req, res) => {
    const p = await Person.create({ name: req.body.name });
    res.json(p);
});

// UPDATE
router.put("/person/:id", async (req, res) => {
    const p = await Person.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    res.json(p);
});

// DELETE
router.delete("/person/:id", async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    await Relationship.deleteMany({
        $or: [{ from: req.params.id }, { to: req.params.id }]
    });
    res.json({ ok: true });
});

// RELATIONSHIP
router.post("/relationship", async (req, res) => {
    const { from, to, type } = req.body;

    if (type === "child") {
        await Relationship.create({ from: to, to: from, type: "parent" });
    }

    else if (type === "sibling") {
        const parents = await Relationship.find({
            to: from,
            type: "parent"
        });

        for (let p of parents) {
            await Relationship.create({
                from: p.from,
                to,
                type: "parent"
            });
        }
    }

    else {
        await Relationship.create({ from, to, type });
    }

    res.json({ ok: true });
});

export default router;
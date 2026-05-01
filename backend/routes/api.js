import express from "express";
import Person from "../models/Person.js";
import Relationship from "../models/Relationship.js";

const router = express.Router();

/* -----------------------------
   GET ALL DATA
------------------------------*/
router.get("/data", async (req, res) => {
    try {
        const nodes = await Person.find();
        const links = await Relationship.find();
        res.json({ nodes, links });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   CREATE PERSON
------------------------------*/
router.post("/person", async (req, res) => {
    try {
        const p = await Person.create({
            name: req.body.name,
            bio: req.body.bio || "",
            birthYear: req.body.birthYear || "",
            deathYear: req.body.deathYear || "",
            photo: req.body.photo || ""
        });

        res.json(p);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   UPDATE PERSON (FIXED SAFETY)
------------------------------*/
router.put("/person/:id", async (req, res) => {
    try {
        console.log("UPDATE HIT");
        console.log("RAW ID:", req.params.id);
        console.log("BODY:", req.body);

        const updated = await Person.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updated) {
            console.log("NO DOCUMENT FOUND");
            return res.status(404).json({ error: "Person not found" });
        }

        console.log("UPDATED SUCCESS");
        return res.status(200).json(updated);

    } catch (err) {
        console.error("🔥 CRASH:", err);
        return res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   DELETE PERSON
------------------------------*/
router.delete("/person/:id", async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);

        await Relationship.deleteMany({
            $or: [
                { from: req.params.id },
                { to: req.params.id }
            ]
        });

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* -----------------------------
   RELATIONSHIPS (FIXED DIRECTION)
------------------------------*/
router.post("/relationship", async (req, res) => {
    try {
        const { from, to, type } = req.body;

        /* PARENT → CHILD (FIXED DIRECTION) */
        if (type === "parent") {
            await Relationship.create({
                from,
                to,
                type: "parent"
            });
        }

        /* CHILD → PARENT (derived automatically) */
        else if (type === "child") {
            await Relationship.create({
                from: to,
                to: from,
                type: "parent"
            });
        }

        /* SIBLINGS: share parents properly */
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

        /* SPOUSE */
        else if (type === "spouse") {
            await Relationship.create({ from, to, type });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
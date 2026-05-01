import { useState, useEffect } from "react";

export default function Sidebar({
    selected,
    people,
    createPerson,
    updatePerson,
    deletePerson,
    createRelationship
}) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");

    useEffect(() => {
        setName(selected?.name || "");
    }, [selected]);

    const link = (type) => {
        if (!selected || !target) return;
        createRelationship(selected._id, target, type);
        setTarget("");
    };

    return (
        <div style={{
            width: 260,
            padding: 16,
            borderLeft: "1px solid #e5e7eb",
            background: "#f9fafb"
        }}>
            <h3 style={{ marginBottom: 10 }}>People</h3>

            {/* CREATE */}
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name"
                style={{ width: "100%", marginBottom: 8 }}
            />

            <button onClick={() => {
                if (!name.trim()) return;
                createPerson(name);
                setName("");
            }}>
                ➕ Add Person
            </button>

            {/* EDIT */}
            {selected && (
                <>
                    <hr />

                    <h4>Edit</h4>

                    <button onClick={() => updatePerson(selected._id, name)}>
                        💾 Save
                    </button>

                    <button onClick={() => deletePerson(selected._id)}>
                        🗑 Delete
                    </button>

                    <hr />

                    <h4>Relationships</h4>

                    <select
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        style={{ width: "100%", marginBottom: 8 }}
                    >
                        <option value="">Select person</option>
                        {people
                            .filter(p => p._id !== selected._id)
                            .map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                    </select>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <button onClick={() => link("parent")}>⬆ Add Parent</button>
                        <button onClick={() => link("child")}>⬇ Add Child</button>
                        <button onClick={() => link("spouse")}>💍 Add Spouse</button>
                        <button onClick={() => link("sibling")}>👥 Add Sibling</button>
                    </div>
                </>
            )}
        </div>
    );
}
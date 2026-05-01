import { useState, useEffect } from "react";

export default function Sidebar({
    selected,
    people,
    createPerson,
    updatePerson,
    deletePerson,
    createRelationship
}) {
    const [form, setForm] = useState({
        name: "",
        bio: "",
        birthYear: "",
        deathYear: "",
        photo: ""
    });

    const [target, setTarget] = useState("");

    useEffect(() => {
        if (selected) {
            setForm({
                name: selected.name || "",
                bio: selected.bio || "",
                birthYear: selected.birthYear || "",
                deathYear: selected.deathYear || "",
                photo: selected.photo || ""
            });
        }
    }, [selected]);

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const btn = {
        padding: "8px",
        marginTop: "6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "white"
    };

    return (
        <div style={{
            width: 300,
            padding: 16,
            borderLeft: "1px solid #e5e7eb",
            background: "#f9fafb",
            overflowY: "auto"
        }}>
            <h3>👤 Person</h3>

            {/* CREATE */}
            <input
                placeholder="New person name"
                value={form.name}
                onChange={e => updateField("name", e.target.value)}
                style={{ width: "100%", marginBottom: 8 }}
            />

            <button style={btn} onClick={() => {
                if (!form.name.trim()) return;
                createPerson(form.name);
                setForm(prev => ({ ...prev, name: "" }));
            }}>
                ➕ Add Person
            </button>

            {/* PROFILE */}
            {selected && (
                <>
                    <hr />

                    <h4>✏️ Edit Profile</h4>

                    <input
                        value={form.name}
                        onChange={e => updateField("name", e.target.value)}
                        placeholder="Name"
                    />

                    <input
                        value={form.birthYear}
                        onChange={e => updateField("birthYear", e.target.value)}
                        placeholder="Birth Year"
                    />

                    <input
                        value={form.deathYear}
                        onChange={e => updateField("deathYear", e.target.value)}
                        placeholder="Death Year"
                    />

                    <input
                        value={form.photo}
                        onChange={e => updateField("photo", e.target.value)}
                        placeholder="Photo URL"
                    />

                    <textarea
                        value={form.bio}
                        onChange={e => updateField("bio", e.target.value)}
                        placeholder="Biography"
                        style={{ width: "100%", minHeight: 80 }}
                    />

                    <button style={btn} onClick={() => {
                        console.log("SAVE CLICKED", form);
                        updatePerson(selected._id, form)
                    }}
                    >
                        💾 Save Changes
                    </button>

                    <button style={btn} onClick={() => deletePerson(selected._id)}>
                        🗑 Delete Person
                    </button>

                    {/* IMAGE PREVIEW */}
                    {form.photo && (
                        <img
                            src={form.photo}
                            alt=""
                            style={{
                                width: "100%",
                                marginTop: 10,
                                borderRadius: "8px"
                            }}
                        />
                    )}

                    <hr />

                    <h4>🔗 Relationships</h4>

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

                    <button style={btn} onClick={() => createRelationship(selected._id, target, "parent")}>
                        ⬆ Add Parent
                    </button>

                    <button style={btn} onClick={() => createRelationship(selected._id, target, "child")}>
                        ⬇ Add Child
                    </button>

                    <button style={btn} onClick={() => createRelationship(selected._id, target, "spouse")}>
                        💍 Add Spouse
                    </button>

                    <button style={btn} onClick={() => createRelationship(selected._id, target, "sibling")}>
                        👥 Add Sibling
                    </button>
                </>
            )
            }
        </div >
    );
}
import { useEffect, useState } from "react";

function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState("");

  // load people from backend
  const loadPeople = () => {
    fetch("https://family-tree-api-11b3.onrender.com/api/people")
      .then(res => res.json())
      .then(data => setPeople(data));
  };

  useEffect(() => {
    loadPeople();
  }, []);

  // add new person
  const addPerson = async () => {
    if (!name) return;

    await fetch("https://family-tree-api-11b3.onrender.com/api/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    setName("");
    loadPeople();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Family Tree</h1>

      {/* form */}
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={addPerson} style={{ marginLeft: "10px" }}>
        Add
      </button>

      {/* list */}
      <ul>
        {people.map(person => (
          <li key={person._id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
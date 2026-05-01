import { useEffect, useState } from "react";
import FamilyGraph from "./components/FamilyGraph";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function App() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = () => {
    fetch("http://localhost:5000/api/data")
      .then(res => res.json())
      .then(setData);
  };

  useEffect(load, []);

  const createPerson = async (name) => {
    await fetch("http://localhost:5000/api/person", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    load();
  };

  const updatePerson = async (id, name) => {
    await fetch(`http://localhost:5000/api/person/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    load();
  };

  const deletePerson = async (id) => {
    await fetch(`http://localhost:5000/api/person/${id}`, {
      method: "DELETE"
    });
    load();
  };

  const createRelationship = async (from, to, type) => {
    await fetch("http://localhost:5000/api/relationship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, type })
    });
    load();
  };

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <FamilyGraph
            data={data}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        <Sidebar
          selected={selected}
          people={data?.nodes || []}
          createPerson={createPerson}
          updatePerson={updatePerson}
          deletePerson={deletePerson}
          createRelationship={createRelationship}
        />
      </div>
    </div>
  );
}
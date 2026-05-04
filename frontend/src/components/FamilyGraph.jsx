import { useEffect, useState } from "react";

export default function FamilyGraph({ data, selected, onSelect }) {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        if (!data?.nodes?.length) return;

        const allNodes = data.nodes;
        const links = data.links || [];

        const getId = n => n._id;

        // -----------------------------
        // BUILD CHILD MAP
        // -----------------------------
        const children = {};

        links.forEach(l => {
            if (l.type === "parent") {
                if (!children[l.from]) children[l.from] = [];
                children[l.from].push(l.to);
            }
        });

        // -----------------------------
        // ✅ CORRECT ROOT DETECTION
        // -----------------------------
        const hasParent = new Set(
            links
                .filter(l => l.type === "parent")
                .map(l => l.to)
        );

        let roots = allNodes.filter(n => !hasParent.has(getId(n)));

        if (!roots.length) roots = [allNodes[0]];

        // -----------------------------
        // LEVEL ASSIGNMENT
        // -----------------------------
        const levelMap = {};
        const visited = new Set();

        function walk(node, level) {
            if (!node) return;

            const id = getId(node);
            if (visited.has(id)) return;

            visited.add(id);
            levelMap[id] = level;

            (children[id] || []).forEach(childId => {
                const child = allNodes.find(n => getId(n) === childId);
                if (child) walk(child, level + 1);
            });
        }

        roots.forEach(r => walk(r, 0));

        // fallback for disconnected nodes
        allNodes.forEach(n => {
            const id = getId(n);
            if (levelMap[id] === undefined) levelMap[id] = 0;
        });

        // -----------------------------
        // GROUP BY LEVEL
        // -----------------------------
        const layers = {};

        allNodes.forEach(n => {
            const level = levelMap[getId(n)];
            if (!layers[level]) layers[level] = [];
            layers[level].push(n);
        });

        // -----------------------------
        // ✅ POSITIONING (CENTERED + DOWNWARD)
        // -----------------------------
        const layout = [];
        const width = 1100;
        const levelHeight = 160;
        const nodeWidth = 140;

        Object.entries(layers).forEach(([level, group]) => {
            const totalWidth = group.length * nodeWidth;
            const startX = (width - totalWidth) / 2;

            group.forEach((n, i) => {
                layout.push({
                    ...n,
                    x: startX + i * nodeWidth,
                    y: Number(level) * levelHeight + 80 // 👈 DOWNWARD growth
                });
            });
        });

        setNodes(layout);

    }, [data]);

    const pos = {};
    nodes.forEach(n => (pos[n._id] = n));

    const links = data?.links || [];

    return (
        <svg width={1100} height={700} style={{ background: "#f1f5f9" }}>

            {/* PARENT LINKS */}
            {links.filter(l => l.type === "parent").map((l, i) => {
                const a = pos[l.from];
                const b = pos[l.to];
                if (!a || !b) return null;

                return (
                    <line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#3b82f6"
                        strokeWidth="2"
                    />
                );
            })}

            {/* SPOUSE LINKS */}
            {links.filter(l => l.type === "spouse").map((l, i) => {
                const a = pos[l.from];
                const b = pos[l.to];
                if (!a || !b) return null;

                return (
                    <line
                        key={i}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke="#ef4444"
                        strokeWidth="2"
                    />
                );
            })}

            {/* NODES */}
            {nodes.map(n => (
                <g
                    key={n._id}
                    transform={`translate(${n.x},${n.y})`}
                    onClick={() => onSelect(n)}
                    style={{ cursor: "pointer" }}
                >
                    <foreignObject x={-70} y={-40} width={140} height={80}>
                        <div style={{
                            background: "white",
                            borderRadius: "12px",
                            border: "1px solid #1f2937",
                            padding: "6px",
                            textAlign: "center"
                        }}>
                            <img
                                src={n.photo || "https://via.placeholder.com/40"}
                                alt=""
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover"
                                }}
                            />
                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                {n.name}
                            </div>
                        </div>
                    </foreignObject>
                </g>))}

        </svg>
    );
}
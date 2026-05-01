import { useEffect, useState } from "react";

export default function FamilyGraph({ data, selected, onSelect }) {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        if (!data?.nodes?.length) return;

        const allNodes = data.nodes;
        const links = data.links || [];

        const getId = n => n._id;

        // -----------------------------
        // BUILD MAPS
        // -----------------------------
        const children = {};
        const parents = {};

        links.forEach(l => {
            if (l.type === "parent") {
                if (!children[l.from]) children[l.from] = [];
                if (!parents[l.to]) parents[l.to] = [];

                children[l.from].push(l.to);
                parents[l.to].push(l.from);
            }
        });

        // -----------------------------
        // SAFE ROOT DETECTION
        // -----------------------------
        let roots = allNodes.filter(n => !parents[getId(n)]?.length);

        // fallback: ensure tree ALWAYS renders
        if (!roots.length) {
            roots = [allNodes[0]];
        }

        // -----------------------------
        // LEVEL ASSIGNMENT (SAFE DFS)
        // -----------------------------
        const levelMap = {};
        const visited = new Set();

        function walk(node, level) {
            if (!node) return;

            const id = getId(node);
            if (visited.has(id)) return;

            visited.add(id);
            levelMap[id] = level;

            const kids = children[id] || [];

            kids.forEach(childId => {
                const child = allNodes.find(n => getId(n) === childId);
                if (child) walk(child, level + 1);
            });
        }

        roots.forEach(r => walk(r, 0));

        // -----------------------------
        // FORCE UNMAPPED NODES INTO TREE
        // (prevents disappearing nodes)
        // -----------------------------
        allNodes.forEach(n => {
            const id = getId(n);
            if (levelMap[id] === undefined) {
                levelMap[id] = 0; // fallback root level
            }
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
        // POSITIONING (CENTERED)
        // -----------------------------
        const width = 1100;
        const layout = [];

        Object.entries(layers).forEach(([level, group]) => {
            const spacing = width / (group.length + 1);

            group.forEach((n, i) => {
                layout.push({
                    ...n,
                    x: spacing * (i + 1),
                    y: Number(level) * 160 + 100
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
                    <rect
                        x={-65}
                        y={-22}
                        width={130}
                        height={44}
                        rx={12}
                        fill={selected?._id === n._id ? "#fde68a" : "#ffffff"}
                        stroke="#1f2937"
                    />

                    <text
                        textAnchor="middle"
                        dy={5}
                        fontSize="13"
                        fontWeight="500"
                    >
                        {n.name || "(Unnamed)"}
                    </text>
                </g>
            ))}

        </svg>
    );
}
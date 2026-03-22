import React, { memo, useCallback, useState } from "react";
import { ReactFlow, useReactFlow, Handle, Position } from "@xyflow/react";
import { Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";

const EntityNode = memo(({ data, dragging }) => {
  const { name, fields, color = "#3b82f6" } = data;

  return (
    <div
      style={{
        borderColor: color,
        boxShadow: dragging
          ? `0 0 0 2px ${color}55, 0 20px 40px ${color}40, 0 8px 20px rgba(0,0,0,0.2)`
          : `0 2px 8px rgba(0,0,0,0.08)`,
        transform: dragging ? "scale(1.04)" : "scale(1)",
        opacity: dragging ? 0.92 : 1,
        transition: dragging
          ? "box-shadow 0.15s ease, opacity 0.15s ease"
          : "box-shadow 0.3s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
        borderWidth: dragging ? 2 : 2,
        borderStyle: "solid",
        background: dragging ? "#ffffff" : "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        minWidth: "240px",
        fontSize: "14px",
        overflow: "hidden",
        cursor: dragging ? "grabbing" : "grab",
        willChange: "transform, box-shadow",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color, width: 10, height: 10, border: `2px solid white` }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 10, height: 10, border: `2px solid white` }} />

      <div
        style={{
          fontWeight: 700,
          fontSize: "18px",
          paddingBottom: "12px",
          borderBottom: `2px solid ${color}22`,
          marginBottom: "14px",
          textAlign: "center",
          color: color,
          letterSpacing: dragging ? "0.03em" : "0",
          transition: "letter-spacing 0.2s ease",
        }}
      >
        {name}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {fields.map((field) => (
          <div
            key={field.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontWeight: 500, color: "#1e293b" }}>{field.name}</span>
            <span
              style={{
                fontFamily: "monospace",
                color: "#64748b",
                fontSize: "12px",
                background: "#f8fafc",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              {field.type}
            </span>
          </div>
        ))}
      </div>

      {/* Animated color stripe at top when dragging */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: dragging ? "3px" : "0px",
          background: `linear-gradient(90deg, ${color}00, ${color}, ${color}00)`,
          transition: "height 0.2s ease",
          borderRadius: "16px 16px 0 0",
        }}
      />
    </div>
  );
});
EntityNode.displayName = "EntityNode";

const nodeTypes = { entity: EntityNode };

const Toolbar = ({ onLayout }) => {

 const handleExport = useCallback(async () => {
  // Select the React Flow container
  const element = document.querySelector(".react-flow");
  if (!element) return;

  try {
    const dataUrl = await toPng(element, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "database-diagram.png";
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export diagram:", err);
  }
}, []);

  return (
    <div className="absolute top-6 right-6 flex flex-col gap-3 z-50">
      <button
        onClick={onLayout}
        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition flex items-center gap-2"
      >
        🔄 Auto Layout
      </button>
      <button
        onClick={handleExport}
        className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg transition flex items-center gap-2"
      >
        📸 Export PNG
      </button>
    </div>
  );
};

const Diagram = ({ nodes, edges, onNodesChange, onLayout }) => {
  const [draggingId, setDraggingId] = useState(null);

  const nodesWithDragging = nodes.map((n) => ({
    ...n,
    data: { ...n.data, dragging: n.id === draggingId },
  }));

  return (
    <div className="flex-1 h-full relative">
      <style>{`
        .react-flow__node { transition: filter 0.2s ease; }
        .react-flow__node.dragging { filter: drop-shadow(0 12px 24px rgba(0,0,0,0.18)); z-index: 999 !important; }
        .react-flow__edge { transition: opacity 0.2s ease; }
        ${draggingId ? `.react-flow__edge { opacity: 0.4; }` : ""}
        .react-flow__handle { transition: transform 0.2s ease; }
        .react-flow__handle:hover { transform: scale(1.4); }
      `}</style>

      <ReactFlow
        nodes={nodesWithDragging}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
        onNodeDragStart={(_, node) => setDraggingId(node.id)}
        onNodeDragStop={(_, node) => {
          setDraggingId(null);
          onNodesChange([{ type: "position", id: node.id, position: node.position }]);
        }}
        onError={(id, msg) => console.error("[ReactFlow] Error:", id, msg)}
      >
        <Background variant="dots" gap={20} size={1} />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right" />
        <Toolbar onLayout={onLayout} />
      </ReactFlow>
    </div>
  );
};

export default Diagram;
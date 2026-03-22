import React, { memo, useCallback } from "react";
import { ReactFlow, useReactFlow } from "@xyflow/react";
import { Background } from "@xyflow/react";
import { Controls } from "@xyflow/react";
import { MiniMap } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const EntityNode = memo(({ data }) => {
  const { name, fields, color = "#3b82f6" } = data;
  return (
    <div
      className="bg-white border-2 shadow-2xl rounded-2xl p-5 min-w-[240px] text-sm overflow-hidden"
      style={{ borderColor: color }}
    >
      <div className="font-bold text-2xl pb-3 border-b mb-4 text-center" style={{ color }}>
        {name}
      </div>
      <div className="space-y-3 text-sm">
        {fields.map((field) => (
          <div key={field.id} className="flex justify-between items-center border-b last:border-none pb-2">
            <span className="font-medium">{field.name}</span>
            <span className="font-mono text-gray-500">{field.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
EntityNode.displayName = "EntityNode";

const nodeTypes = { entity: EntityNode };

const Diagram = ({ nodes, edges, onNodesChange, onLayout }) => {
  const Toolbar = ({ onLayout }) => {
    const { toPng } = useReactFlow();

    const handleExport = useCallback(async () => {
      const dataUrl = await toPng({ backgroundColor: "#ffffff", pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = "database-diagram.png";
      link.href = dataUrl;
      link.click();
    }, [toPng]);

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

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50"
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
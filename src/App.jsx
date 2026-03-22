import React, { useState, useCallback, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Diagram from "./components/Diagram";
import ModelEditorModal from "./components/ModelEditorModal";
import { getLayoutedElements } from "./utils/getLayoutedElements";
import { MarkerType } from "@reactflow/core";

const initialModels = [
  {
    id: "m1",
    name: "User",
    color: "#3b82f6",
    position: { x: 150, y: 100 },
    fields: [
      { id: "f1", name: "id", type: "Integer" },
      { id: "f2", name: "username", type: "String" },
      { id: "f3", name: "email", type: "String" },
    ],
    relations: [{ id: "r1", targetId: "m2", type: "oneToMany", cardinality: "1..*" }],
  },
  {
    id: "m2",
    name: "Post",
    color: "#10b981",
    position: { x: 550, y: 180 },
    fields: [
      { id: "f4", name: "id", type: "Integer" },
      { id: "f5", name: "title", type: "String" },
    ],
    relations: [],
  },
];

const App = () => {
  const [models, setModels] = useState(initialModels);
  const [showModal, setShowModal] = useState(false);
  const [editingModelId, setEditingModelId] = useState(null);

  const currentEditingModel = editingModelId ? models.find((m) => m.id === editingModelId) : null;

  const nodes = useMemo(
    () =>
      models.map((model) => ({
        id: model.id,
        type: "entity",
        position: model.position,
        data: { name: model.name, fields: model.fields, color: model.color },
      })),
    [models]
  );

  const edges = useMemo(() => {
    const list = [];
    models.forEach((model) => {
      model.relations.forEach((rel) => {
        if (!models.some((m) => m.id === rel.targetId)) return;

        let markerEnd = { type: MarkerType.ArrowClosed };
        let style = { stroke: "#64748b", strokeWidth: 2.5 };
        let label = rel.cardinality || "1:1";

        switch (rel.type) {
          case "inheritance":
            markerEnd = { type: MarkerType.Arrow };
            style = { ...style, strokeDasharray: "8 4" };
            label = "inherits";
            break;
          case "aggregation":
            markerEnd = { type: MarkerType.Arrow };
            label = "◇ " + (rel.cardinality || "");
            break;
          case "composition":
            label = "◆ " + (rel.cardinality || "");
            break;
          case "oneToMany":
            label = "1..*";
            break;
          case "manyToOne":
            label = "*..1";
            break;
          case "manyToMany":
            markerEnd = null;
            label = "*..*";
            break;
        }

        list.push({
          id: `e-${model.id}-${rel.targetId}-${rel.id}`,
          source: model.id,
          target: rel.targetId,
          label,
          markerEnd,
          style,
          type: "smoothstep",
        });
      });
    });
    return list;
  }, [models]);

  const onNodesChange = useCallback((changes) => {
    setModels((prev) =>
      prev.map((model) => {
        const change = changes.find((c) => c.id === model.id);
        if (change?.type === "position" && change.position) {
          return { ...model, position: change.position };
        }
        return model;
      })
    );
  }, []);

  const handleLayout = useCallback(() => {
    const { nodes: layouted } = getLayoutedElements(nodes, edges);
    setModels((prev) =>
      prev.map((model) => {
        const found = layouted.find((n) => n.id === model.id);
        return found ? { ...model, position: found.position } : model;
      })
    );
  }, [nodes, edges]);

  const handleAddModel = () => {
    setEditingModelId(null);
    setShowModal(true);
  };

  const handleEditModel = (id) => {
    setEditingModelId(id);
    setShowModal(true);
  };

  const handleDeleteModel = (id) => {
    if (!confirm("Delete model and all its relations?")) return;
    setModels((prev) =>
      prev
        .filter((m) => m.id !== id)
        .map((m) => ({ ...m, relations: m.relations.filter((r) => r.targetId !== id) }))
    );
  };

  const handleSaveModel = (savedModel) => {
    setModels((prev) => {
      if (prev.find((m) => m.id === savedModel.id)) {
        return prev.map((m) => (m.id === savedModel.id ? savedModel : m));
      }
      return [...prev, savedModel];
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        models={models}
        onAddModel={handleAddModel}
        onEditModel={handleEditModel}
        onDeleteModel={handleDeleteModel}
      />
      <Diagram nodes={nodes} edges={edges} onNodesChange={onNodesChange} onLayout={handleLayout} />
      <ModelEditorModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingModelId(null);
        }}
        onSave={handleSaveModel}
        models={models}
        currentModel={currentEditingModel}
      />
    </div>
  );
};

export default App;
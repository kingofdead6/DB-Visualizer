import React, { useState, useEffect } from "react";

const ModelEditorModal = ({ isOpen, onClose, onSave, models, currentModel }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    fields: [],
    relations: [],
  });

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("String");
  const [newRelTarget, setNewRelTarget] = useState("");
  const [newRelType, setNewRelType] = useState("oneToOne");
  const [newRelCardinality, setNewRelCardinality] = useState("1..1");

  const fieldTypeOptions = ["Integer", "String", "Boolean", "Date", "Decimal"];
  const relationTypeOptions = [
    { value: "oneToOne", label: "One-to-One" },
    { value: "oneToMany", label: "One-to-Many" },
    { value: "manyToOne", label: "Many-to-One" },
    { value: "manyToMany", label: "Many-to-Many" },
    { value: "inheritance", label: "Inheritance" },
    { value: "aggregation", label: "Aggregation" },
    { value: "composition", label: "Composition" },
  ];
  const cardinalityOptions = ["0..1", "1", "0..*", "1..*"];

  const otherModels = models.filter((m) => m.id !== (currentModel?.id || ""));

  useEffect(() => {
    if (currentModel) {
      setFormData({
        name: currentModel.name,
        color: currentModel.color || "#3b82f6",
        fields: [...currentModel.fields],
        relations: [...currentModel.relations],
      });
    } else {
      setFormData({ name: "", color: "#3b82f6", fields: [], relations: [] });
    }
  }, [currentModel]);

  const addField = () => {
    if (!newFieldName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, { id: Date.now().toString(), name: newFieldName.trim(), type: newFieldType }],
    }));
    setNewFieldName("");
  };

  const removeField = (id) => {
    setFormData((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.id !== id) }));
  };

  const addRelation = () => {
    if (!newRelTarget) return;
    setFormData((prev) => ({
      ...prev,
      relations: [
        ...prev.relations,
        {
          id: Date.now().toString(),
          targetId: newRelTarget,
          type: newRelType,
          cardinality: newRelType === "inheritance" ? "" : newRelCardinality,
        },
      ],
    }));
    setNewRelTarget("");
    setNewRelType("oneToOne");
    setNewRelCardinality("1..1");
  };

  const removeRelation = (id) => {
    setFormData((prev) => ({ ...prev, relations: prev.relations.filter((r) => r.id !== id) }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return alert("Model name is required");
    const saved = {
      id: currentModel ? currentModel.id : `m-${Date.now()}`,
      name: formData.name.trim(),
      color: formData.color,
      fields: formData.fields,
      relations: formData.relations,
      position: currentModel?.position || { x: 200, y: 200 },
    };
    onSave(saved);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{currentModel ? "Edit Model" : "Create New Model"}</h2>
          <button onClick={onClose} className="text-4xl text-gray-300 hover:text-gray-600">×</button>
        </div>

        <div className="p-8 overflow-auto max-h-[calc(92vh-180px)] space-y-10">
          {/* Name + Color */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Model Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full border-2 rounded-2xl p-4 text-xl"
                placeholder="User"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Node Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                className="w-16 h-14 border-2 rounded-2xl"
              />
            </div>
          </div>

          {/* Fields Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Fields</h3>
            </div>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name (e.g. email)"
                className="flex-1 border-2 rounded-2xl p-4"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="border-2 rounded-2xl p-4"
              >
                {fieldTypeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button onClick={addField} className="bg-blue-600 text-white px-8 rounded-2xl font-medium hover:bg-blue-700">
                Add
              </button>
            </div>

            <div className="border-2 rounded-3xl p-6 max-h-64 overflow-auto bg-gray-50">
              {formData.fields.length === 0 ? (
                <p className="text-gray-400 italic text-center py-8">No fields yet — add some above</p>
              ) : (
                formData.fields.map((f) => (
                  <div key={f.id} className="flex justify-between py-3 border-b last:border-none">
                    <span className="font-medium">
                      {f.name} <span className="font-mono text-gray-500">({f.type})</span>
                    </span>
                    <button onClick={() => removeField(f.id)} className="text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Relations Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Relations</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={newRelTarget}
                onChange={(e) => setNewRelTarget(e.target.value)}
                className="border-2 rounded-2xl p-4 flex-1"
              >
                <option value="">Target model...</option>
                {otherModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                value={newRelType}
                onChange={(e) => setNewRelType(e.target.value)}
                className="border-2 rounded-2xl p-4"
              >
                {relationTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {newRelType !== "inheritance" && (
                <select
                  value={newRelCardinality}
                  onChange={(e) => setNewRelCardinality(e.target.value)}
                  className="border-2 rounded-2xl p-4"
                >
                  {cardinalityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              <button onClick={addRelation} className="bg-blue-600 text-white px-8 rounded-2xl font-medium hover:bg-blue-700">
                Add Relation
              </button>
            </div>

            <div className="border-2 rounded-3xl p-6 max-h-64 overflow-auto bg-gray-50">
              {formData.relations.length === 0 ? (
                <p className="text-gray-400 italic text-center py-8">No relations yet</p>
              ) : (
                formData.relations.map((rel) => {
                  const target = models.find((m) => m.id === rel.targetId);
                  return (
                    <div key={rel.id} className="flex justify-between py-3 border-b last:border-none">
                      <span>
                        → <strong>{target?.name || "Deleted"}</strong> ({rel.type}) {rel.cardinality && `[${rel.cardinality}]`}
                      </span>
                      <button onClick={() => removeRelation(rel.id)} className="text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-8 border-t flex justify-end gap-4">
          <button onClick={onClose} className="px-10 py-4 text-gray-600 hover:bg-gray-100 rounded-2xl font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg"
          >
            Save Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelEditorModal;
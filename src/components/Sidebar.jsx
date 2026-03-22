import React, { useState } from "react";

const Sidebar = ({ models, onAddModel, onEditModel, onDeleteModel }) => {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle state

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full w-80 bg-white border-r shadow-sm flex flex-col overflow-hidden transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight">DB Visualizer</h1>
          <p className="text-gray-500 text-sm mt-1">Dynamic ER / UML Tool</p>
        </div>

        {/* Add Model Button */}
        <div className="p-6">
          <button
            onClick={onAddModel}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            + New Model
          </button>
        </div>

        {/* Models List */}
        <div className="px-6 text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
          MODELS
        </div>
        <div className="flex-1 overflow-auto px-4 space-y-3">
          {models.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No models yet.<br />
              Click "New Model" to begin.
            </div>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className="group bg-gray-50 border border-gray-200 hover:border-blue-300 rounded-2xl p-4 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full shadow-inner"
                      style={{ backgroundColor: model.color || "#3b82f6" }}
                    />
                    <div>
                      <div className="font-semibold text-lg leading-none">{model.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {model.fields.length} fields • {model.relations.length} relations
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEditModel(model.id)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-xl"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteModel(model.id)}
                      className="text-red-500 hover:bg-red-100 p-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 text-[10px] text-gray-400 border-t text-center">
          SoftWebElevation
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
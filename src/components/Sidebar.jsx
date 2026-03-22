import React, { useState } from "react";

const Sidebar = ({ models, onAddModel, onEditModel, onDeleteModel }) => {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle state

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full shadow-[0_0_10px_rgb(255,0,255)] hover:shadow-[0_0_20px_rgb(0,255,255)] transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 drop-shadow-[0_0_5px_purple] tracking-tight">
            DB Visualizer
          </h1>
          <p className="text-gray-500 text-sm mt-1">Dynamic ER / UML Tool</p>
        </div>

        {/* Add Model Button */}
        <div className="p-6">
          <button
            onClick={onAddModel}
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgb(255,0,255)] transition-all flex items-center justify-center gap-2"
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
                className="group bg-white border border-gray-300 hover:border-pink-500 rounded-2xl p-4 transition-all shadow-[0_0_10px_rgb(255,0,255)] hover:shadow-[0_0_20px_rgb(255,0,255)]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full shadow-inner"
                      style={{ backgroundColor: model.color || "#8b5cf6" }}
                    />
                    <div>
                      <div className="font-semibold text-lg text-purple-600 drop-shadow-[0_0_5px_purple] leading-none">
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {model.fields.length} fields • {model.relations.length} relations
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEditModel(model.id)}
                      className="text-pink-500 hover:text-pink-400 hover:bg-gray-100 p-2 rounded-xl transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteModel(model.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-gray-100 p-2 rounded-xl transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 text-[10px] text-gray-400 border-t border-gray-200 text-center">
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
import React, { useState } from 'react';
import { 
  DndContext, PointerSensor, useSensor, useSensors, 
  useDraggable, useDroppable, DragOverlay 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { 
  Type, Pilcrow, MoveHorizontal, ChevronDown, Tag, 
  CheckSquare, CircleDot, Type as ALargeSmall, Plus, 
  Eye, Layout, Trash2, GripVertical, Settings, ArrowLeft, X 
} from 'lucide-react';

const TOOLBOX_ITEMS = [
  { type: 'header', label: 'Header Text', icon: <Type size={18}/> },
  { type: 'label', label: 'Label', icon: <ALargeSmall size={18}/> },
  { type: 'paragraph', label: 'Paragraph', icon: <Pilcrow size={18}/> },
  { type: 'line-break', label: 'Line Break', icon: <MoveHorizontal size={18}/> },
  { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={18}/>, options: ['Option 1'] },
  { type: 'checkboxes', label: 'Checkboxes', icon: <CheckSquare size={18}/>, options: ['Option 1', 'Option 2'] },
  { type: 'text-input', label: 'Text Input', icon: <ALargeSmall size={18}/> },
  { type: 'number-input', label: 'Number Input', icon: <Plus size={18}/> },
];

const DraggableToolboxItem = ({ item }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `toolbox-${item.type}`,
    data: item
  });

  return (
    <div 
      ref={setNodeRef} {...listeners} {...attributes}
      className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200"
    >
      <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        {item.icon}
      </div>
      <span className="text-[14px] font-semibold text-slate-600 group-hover:text-slate-900">
        {item.label}
      </span>
    </div>
  );
};

const SortableFormElement = ({ field, onDelete, onSelect, isSelected }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} style={style} onClick={() => onSelect(field.id)}
      className={`group relative p-6 rounded-[2rem] border-2 transition-all bg-white flex items-center gap-5 cursor-pointer
        ${isDragging ? 'border-indigo-500 opacity-50 z-50 shadow-2xl' : ''} 
        ${isSelected ? 'border-indigo-500 ring-8 ring-indigo-500/5 shadow-xl shadow-indigo-500/10' : 'border-slate-50 hover:border-indigo-100 shadow-sm'}`}
    >
      <div {...attributes} {...listeners} className="cursor-move text-slate-200 hover:text-indigo-400 transition-colors">
        <GripVertical size={24} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-800 tracking-tight">{field.label}</label>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded-lg tracking-widest">
              {field.type}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
              className="text-slate-200 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {/* İçerik Önizleme (Checkboxlar veya Dropdown) */}
        <div className="space-y-2">
          {field.options ? (
            field.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                {field.type === 'checkboxes' ? <div className="w-3.5 h-3.5 border border-slate-200 rounded-sm" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                {opt}
              </div>
            ))
          ) : (
            <div className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 text-[11px] text-slate-400 italic">
              User will type here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DroppableCanvas = ({ fields, onDelete, onSelect, selectedFieldId }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 p-10 space-y-6 min-h-[600px] transition-all duration-500 rounded-b-[2.5rem] ${isOver ? 'bg-indigo-50/30' : 'bg-white'}`}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.map((field) => (
          <SortableFormElement 
            key={field.id} field={field} 
            onDelete={onDelete} onSelect={onSelect} isSelected={selectedFieldId === field.id}
          />
        ))}
      </SortableContext>

      {fields.length === 0 && (
        <div className="h-full min-h-[450px] border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 gap-4">
          <div className="p-4 bg-slate-50 rounded-full"><Plus size={32} className="opacity-20" /></div>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-40">Drop elements here</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [fields, setFields] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    if (active.id.toString().startsWith('toolbox-') && over.id === 'canvas-droppable') {
      const itemData = active.data.current;
      const newField = {
        id: nanoid(),
        type: itemData.type,
        label: itemData.label,
        options: itemData.options ? [...itemData.options] : null
      };
      setFields((prev) => [...prev, newField]);
      setSelectedFieldId(newField.id);
    } 
    else if (active.id !== over.id && !active.id.toString().startsWith('toolbox-')) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- GÜNCELLEME FONKSİYONLARI ---
  const updateFieldLabel = (id, newLabel) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, label: newLabel } : f));
  };

  const updateOption = (fieldId, optIndex, newValue) => {
    setFields(prev => prev.map(f => {
      if (f.id === fieldId) {
        const newOptions = [...f.options];
        newOptions[optIndex] = newValue;
        return { ...f, options: newOptions };
      }
      return f;
    }));
  };

  const addOption = (fieldId) => {
    setFields(prev => prev.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: [...f.options, `Option ${f.options.length + 1}`] };
      }
      return f;
    }));
  };

  const removeOption = (fieldId, optIndex) => {
    setFields(prev => prev.map(f => {
      if (f.id === fieldId) {
        return { ...f, options: f.options.filter((_, idx) => idx !== optIndex) };
      }
      return f;
    }));
  };

  return (
    <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900">
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 text-white"><Layout size={20} /></div>
              <h1 className="text-xl font-black tracking-tighter text-indigo-950">FORMCRAFT PRO</h1>
            </div>
            <button className="bg-slate-950 text-white px-7 py-3 rounded-full text-sm font-bold shadow-2xl shadow-slate-200 hover:scale-105 transition-transform cursor-pointer">Preview Form</button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[750px] flex flex-col overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-300">Workspace Canvas</span>
              </div>
              <DroppableCanvas fields={fields} onDelete={(id) => setFields(f => f.filter(x => x.id !== id))} onSelect={setSelectedFieldId} selectedFieldId={selectedFieldId} />
            </div>
          </div>

          <aside className="w-full lg:w-96 order-1 lg:order-2">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 sticky top-32 shadow-xl shadow-slate-200/30 min-h-[500px]">
              
              {!selectedField ? (
                <div className="animate-in fade-in duration-500">
                  <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-lg italic tracking-tight underline decoration-indigo-200 underline-offset-8">Toolbox</h3>
                  <div className="grid grid-cols-1 gap-3.5">
                    {TOOLBOX_ITEMS.map((item) => <DraggableToolboxItem key={item.type} item={item} />)}
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <button onClick={() => setSelectedFieldId(null)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-[2px] cursor-pointer">
                      <ArrowLeft size={16} /> Back
                    </button>
                    <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-md shadow-indigo-100">
                      {selectedField.type}
                    </span>
                  </div>

                  <h3 className="font-black text-indigo-950 mb-10 flex items-center gap-3 text-xl tracking-tight">
                    <Settings size={22} className="text-indigo-600" /> Field Settings
                  </h3>

                  <div className="space-y-8">
                    {/* Label Input */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label Name</label>
                      <input 
                        type="text" 
                        value={selectedField.label}
                        onChange={(e) => updateFieldLabel(selectedField.id, e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all font-bold text-slate-700"
                        placeholder="Type label..."
                      />
                    </div>

                    {/* SEÇENEKLER (DÜZENLEME BURASI) */}
                    {selectedField.options && (
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Answers / Options</label>
                        <div className="space-y-3">
                          {selectedField.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-2 group/opt">
                              <input 
                                type="text" 
                                value={opt}
                                onChange={(e) => updateOption(selectedField.id, idx, e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-50 bg-white text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-200 outline-none"
                              />
                              <button 
                                onClick={() => removeOption(selectedField.id, idx)}
                                className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => addOption(selectedField.id)}
                          className="w-full py-3 border-2 border-dashed border-indigo-100 text-indigo-500 rounded-xl hover:bg-indigo-50 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer mt-2"
                        >
                          + Add New Option
                        </button>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => { setFields(f => f.filter(x => x.id !== selectedField.id)); setSelectedFieldId(null); }}
                      className="w-full mt-12 flex items-center justify-center gap-3 p-4 bg-red-50/50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[3px] cursor-pointer group"
                    >
                      <Trash2 size={18} className="group-hover:scale-110 transition-transform" /> Remove Element
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-5 bg-white border-2 border-indigo-600 rounded-[1.5rem] shadow-2xl flex items-center gap-4 scale-110">
            <Layout size={20} className="text-indigo-600" />
            <span className="font-black text-sm text-indigo-950 uppercase tracking-tight italic">Dragging...</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
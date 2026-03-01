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


const PreviewModal = ({ isOpen, onClose, fields }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-indigo-950 tracking-tight italic">Form Preview</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live simulation</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-100 rounded-2xl hover:text-red-500 transition-all shadow-sm cursor-pointer"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white">
          {fields.map((field) => (
            <div key={field.id} className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
              {field.type === 'header' && <h1 className="text-3xl font-black text-slate-900">{field.label}</h1>}
              {field.type === 'paragraph' && <p className="text-slate-500 leading-relaxed font-medium">{field.label}</p>}
              {field.type === 'line-break' && <hr className="border-slate-100" />}
              
              {(field.type === 'text-input' || field.type === 'number-input' || field.type === 'label') && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block ml-1">{field.label}</label>
                  {field.type !== 'label' && (
                    <input 
                      type={field.type === 'number-input' ? 'number' : 'text'} 
                      className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-medium" 
                      placeholder="User input..."
                    />
                  )}
                </div>
              )}

              {field.type === 'dropdown' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block ml-1">{field.label}</label>
                  <div className="relative">
                    <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 appearance-none outline-none focus:ring-4 focus:ring-indigo-100 font-medium">
                      {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  </div>
                </div>
              )}

              {field.type === 'checkboxes' && (
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 block ml-1">{field.label}</label>
                  <div className="flex flex-col gap-2">
                    {field.options?.map((opt, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {fields.length === 0 && <p className="text-center text-slate-300 italic py-10 font-medium tracking-tight">No elements to preview.</p>}
        </div>

        <div className="p-8 border-t border-slate-50 bg-slate-50/30 text-center">
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[4px] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">Submit Form</button>
        </div>
      </div>
    </div>
  );
};


const DraggableToolboxItem = ({ item }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `toolbox-${item.type}`,
    data: item
  });

  return (
    <div 
      ref={setNodeRef} {...listeners} {...attributes}
      className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
    >
      <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        {item.icon}
      </div>
      <span className="text-[14px] font-semibold text-slate-600 group-hover:text-slate-900">{item.label}</span>
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
      <div {...attributes} {...listeners} className="cursor-move text-slate-200 hover:text-indigo-400">
        <GripVertical size={24} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-slate-800 tracking-tight">{field.label}</label>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded-lg tracking-widest">{field.type}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(field.id); }} className="text-slate-200 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
          </div>
        </div>
        <div className="space-y-2">
          {field.options ? (
            field.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                {field.type === 'checkboxes' ? <div className="w-3.5 h-3.5 border border-slate-200 rounded-sm" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                {opt}
              </div>
            ))
          ) : <div className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4 text-[11px] text-slate-400 italic">User will interact here...</div>}
        </div>
      </div>
    </div>
  );
};

const DroppableCanvas = ({ fields, onDelete, onSelect, selectedFieldId }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });

  return (
    <div ref={setNodeRef} className={`flex-1 p-10 space-y-6 min-h-[600px] transition-all duration-500 rounded-b-[2.5rem] ${isOver ? 'bg-indigo-50/30' : 'bg-white'}`}>
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.map((field) => (
          <SortableFormElement key={field.id} field={field} onDelete={onDelete} onSelect={onSelect} isSelected={selectedFieldId === field.id} />
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    } else if (active.id !== over.id && !active.id.toString().startsWith('toolbox-')) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900">
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg text-white"><Layout size={20} /></div>
              <h1 className="text-xl font-black tracking-tighter text-indigo-950">FORMCRAFT PRO</h1>
            </div>
            <button onClick={() => setIsPreviewOpen(true)} className="bg-slate-950 text-white px-7 py-3 rounded-full text-sm font-bold shadow-2xl hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"><Eye size={18} /> Preview Form</button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl min-h-[750px] flex flex-col overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-[3px] text-slate-300">Workspace Canvas</span></div>
              <DroppableCanvas fields={fields} onDelete={(id) => setFields(f => f.filter(x => x.id !== id))} onSelect={setSelectedFieldId} selectedFieldId={selectedFieldId} />
            </div>
          </div>

          <aside className="w-full lg:w-96 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sticky top-32 shadow-xl min-h-[550px]">
              {!selectedField ? (
                <div className="animate-in fade-in duration-500">
                  <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 text-lg italic underline decoration-indigo-200 underline-offset-8">Toolbox</h3>
                  <div className="grid grid-cols-1 gap-3.5">{TOOLBOX_ITEMS.map((item) => <DraggableToolboxItem key={item.type} item={item} />)}</div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <button onClick={() => setSelectedFieldId(null)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all text-[10px] font-black uppercase tracking-[2px] cursor-pointer mb-10"><ArrowLeft size={16} /> Back</button>
                  <h3 className="font-black text-indigo-950 mb-10 flex items-center gap-3 text-xl tracking-tight"><Settings size={22} className="text-indigo-600" /> Field Settings</h3>
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label Name</label>
                      <input type="text" value={selectedField.label} onChange={(e) => setFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, label: e.target.value } : f))} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700" />
                    </div>
                    {selectedField.options && (
                      <div className="space-y-4 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Answers</label>
                        {selectedField.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="text" value={opt} onChange={(e) => setFields(prev => prev.map(f => f.id === selectedField.id ? { ...f, options: f.options.map((o, i) => i === idx ? e.target.value : o) } : f))} className="flex-1 px-4 py-3 rounded-xl border border-slate-50 bg-white text-xs font-semibold text-slate-600 outline-none" />
                            <button onClick={() => setFields(prev => prev.map(f => f.id === selectedField.id ? { ...f, options: f.options.filter((_, i) => i !== idx) } : f))} className="p-2 text-slate-200 hover:text-red-500"><X size={16} /></button>
                          </div>
                        ))}
                        <button onClick={() => setFields(prev => prev.map(f => f.id === selectedField.id ? { ...f, options: [...f.options, `New Option`] } : f))} className="w-full py-3 border-2 border-dashed border-indigo-100 text-indigo-500 rounded-xl hover:bg-indigo-50 transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer">+ Add Option</button>
                      </div>
                    )}
                    <button onClick={() => { setFields(f => f.filter(x => x.id !== selectedField.id)); setSelectedFieldId(null); }} className="w-full mt-12 flex items-center justify-center gap-3 p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[3px] cursor-pointer group"><Trash2 size={18} /></button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>

        <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} fields={fields} />

        <DragOverlay>
          {activeId ? (
            <div className="p-5 bg-white border-2 border-indigo-600 rounded-[1.5rem] shadow-2xl flex items-center gap-4 scale-110 opacity-90 select-none">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg"><Layout size={20} /></div>
              <span className="font-black text-sm text-indigo-950 uppercase tracking-tighter italic">Building...</span>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default App;
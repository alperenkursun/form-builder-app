import React, { useState } from 'react';
import { 
  DndContext, 
  PointerSensor, 
  useSensor, 
  useSensors,
  useDraggable,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { nanoid } from 'nanoid';
import { 
  Type, Pilcrow, MoveHorizontal, ChevronDown, Tag, 
  CheckSquare, CircleDot, Type as ALargeSmall, Plus, Eye, Layout, Trash2, GripVertical
} from 'lucide-react';

const TOOLBOX_ITEMS = [
  { type: 'header', label: 'Header Text', icon: <Type size={18}/> },
  { type: 'label', label: 'Label', icon: <ALargeSmall size={18}/> },
  { type: 'paragraph', label: 'Paragraph', icon: <Pilcrow size={18}/> },
  { type: 'line-break', label: 'Line Break', icon: <MoveHorizontal size={18}/> },
  { type: 'dropdown', label: 'Dropdown', icon: <ChevronDown size={18}/> },
  { type: 'checkboxes', label: 'Checkboxes', icon: <CheckSquare size={18}/> },
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
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-md transition-all"
    >
      <div className="bg-slate-50 p-2 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        {item.icon}
      </div>
      <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900">
        {item.label}
      </span>
    </div>
  );
};

const SortableFormElement = ({ field, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative p-5 rounded-xl border-2 transition-all bg-white flex items-center gap-4 ${isDragging ? 'border-indigo-500 opacity-50 z-50 shadow-2xl' : 'border-slate-100 hover:border-indigo-100 shadow-sm'}`}
    >
      <div {...attributes} {...listeners} className="cursor-move text-slate-300 hover:text-indigo-500 transition-colors">
        <GripVertical size={20} />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-slate-700">{field.label}</label>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded tracking-tighter">
              {field.type}
            </span>
            <button 
              onClick={() => onDelete(field.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-10 bg-slate-50 rounded-lg border border-slate-200 flex items-center px-4 text-xs text-slate-400 italic">
          {field.label} içeriği burada görünecek...
        </div>
      </div>
    </div>
  );
};

const DroppableCanvas = ({ fields, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 p-8 space-y-4 min-h-[500px] transition-colors rounded-b-2xl ${isOver ? 'bg-indigo-50/50' : 'bg-white'}`}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.map((field) => (
          <SortableFormElement key={field.id} field={field} onDelete={onDelete} />
        ))}
      </SortableContext>

      {fields.length === 0 && (
        <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
          <p className="text-sm font-medium">Bileşenleri buraya sürükleyin</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [fields, setFields] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

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
      };
      setFields((prev) => [...prev, newField]);
    } 
    else if (active.id !== over.id && !active.id.toString().startsWith('toolbox-')) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const deleteField = (id) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
                <Layout className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-indigo-600">FormCraft Pro</h1>
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-slate-800 transition-all cursor-pointer">
              Preview Form
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl min-h-[700px] flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Canvas</span>
              </div>

              <DroppableCanvas fields={fields} onDelete={deleteField} />
            </div>
          </div>

          <aside className="w-full lg:w-80 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-24 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Plus size={18} className="text-indigo-600" /> Toolbox
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {TOOLBOX_ITEMS.map((item) => (
                  <DraggableToolboxItem key={item.type} item={item} />
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-4 bg-white border-2 border-indigo-500 rounded-xl shadow-2xl opacity-80 cursor-grabbing flex items-center gap-3">
            <Layout size={18} className="text-indigo-600" />
            <span className="font-semibold text-sm">Bileşeni Bırakın</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
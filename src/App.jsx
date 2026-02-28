import React from 'react';
import { 
  Type, 
  Pilcrow, 
  MoveHorizontal, 
  ChevronDown, 
  Tag, 
  CheckSquare, 
  CircleDot, 
  Type as ALargeSmall,
  Plus, 
  Eye,
  Layout,
  MousePointer2
} from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-indigo-100">
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Layout className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              FormCraft Pro
            </h1>
          </div>
          
          <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-slate-200 active:scale-95 cursor-pointer">
            <Eye size={16} />
            <span>Preview</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Form Builder</h2>
          <p className="mt-2 text-slate-500 text-lg max-w-2xl">
            Modern sürükle-bırak arayüzüyle saniyeler içinde kompleks formlar oluşturun.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[700px] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace Canvas</span>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                <div className="group relative p-6 rounded-xl border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Text Input</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-not-allowed"
                  />
                </div>

                <div className="group relative p-6 rounded-xl border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <label className="text-sm font-semibold text-slate-700">Service Category</label>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">Dropdown</span>
                  </div>
                  <div className="relative">
                    <select disabled className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white shadow-sm appearance-none cursor-not-allowed">
                      <option>Web Development</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-slate-400">
                  <MousePointer2 className="mb-4 opacity-20" size={48} />
                  <p className="text-sm font-medium">Bileşenleri buraya sürükleyin</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 lg:sticky lg:top-24 order-1 lg:order-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                <h3 className="font-bold text-slate-800">Toolbox</h3>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <ToolboxItem icon={<Type size={18}/>} label="Header Text" />
                <ToolboxItem icon={<ALargeSmall size={18}/>} label="Label" />
                <ToolboxItem icon={<Pilcrow size={18}/>} label="Paragraph" />
                <ToolboxItem icon={<MoveHorizontal size={18}/>} label="Line Break" />
                <ToolboxItem icon={<ChevronDown size={18}/>} label="Dropdown" />
                <ToolboxItem icon={<Tag size={18}/>} label="Tags" />
                <ToolboxItem icon={<CheckSquare size={18}/>} label="Checkboxes" />
                <ToolboxItem icon={<CircleDot size={18}/>} label="Multiple Choice" />
                <ToolboxItem icon={<ALargeSmall size={18}/>} label="Text Input" />
                <ToolboxItem icon={<Plus size={18}/>} label="Number Input" />
              </div>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>İpucu:</strong> Eklemek istediğiniz elemanı tutup soldaki beyaz alana bırakın.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

const ToolboxItem = ({ icon, label }) => {
  return (
    <div className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200">
      <div className="bg-slate-50 p-2 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </div>
  );
};

export default App;
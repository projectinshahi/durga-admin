"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Design {
  _id: string;
  name: string;
  image: string;
  description: string;
  isFeatured: boolean;
  category: Category;
}

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [designsRes, categoriesRes] = await Promise.all([
          api.get('/designs'),
          api.get('/categories')
        ]);
        if (isMounted) {
          setDesigns(designsRes.data);
          setCategories(categoriesRes.data);
          if (categoriesRes.data.length > 0 && modalMode === "add" && !categoryId) {
            setCategoryId(categoriesRes.data[0]._id);
          }
        }
      } catch (err) {
        if (isMounted) toast.error("Failed to load contextual data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger, modalMode, categoryId]);

  const openAddModal = () => {
    setModalMode("add");
    setName("");
    setCategoryId(categories.length > 0 ? categories[0]._id : "");
    setDescription("");
    setIsFeatured(false);
    setImageFile(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Design) => {
    setModalMode("edit");
    setName(item.name);
    setCategoryId(item.category?._id || "");
    setDescription(item.description);
    setIsFeatured(item.isFeatured);
    setImageFile(null); 
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "add" && !imageFile) return toast.error("Please select an image file");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", categoryId);
    formData.append("description", description);
    formData.append("isFeatured", String(isFeatured));
    if (imageFile) formData.append("image", imageFile);

    const toastId = toast.loading(modalMode === "add" ? "Uploading primary design..." : "Synchronizing edits...");
    try {
      if (modalMode === "add") {
        await api.post('/designs', formData);
      } else {
        await api.put(`/designs/${editingId}`, formData);
      }
      toast.success("Design catalog updated!", { id: toastId });
      setIsModalOpen(false);
      setRefetchTrigger(prev => prev + 1);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Protocol mismatch or missing keys", { id: toastId });
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this design entirely?")) return;
    try {
      await api.delete(`/designs/${id}`);
      toast.success("Design deleted");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      toast.error("Failed to delete design");
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-serif italic text-lg">Aligning categorical matrices...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 border-l-4 border-[#b8860b] pl-4">Featured Designs Setup</h1>
        <button onClick={openAddModal} className="bg-[#b8860b] text-white w-full sm:w-auto px-5 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-xl shadow-[#b8860b]/20 flex items-center justify-center gap-2.5 text-sm uppercase tracking-widest hover:-translate-y-0.5">
          <Plus size={18} /> Add Design
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {designs.map(d => (
           <div key={d._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-all duration-300">
             <div className="h-[260px] bg-gray-200 relative cursor-pointer overflow-hidden" onClick={() => openEditModal(d)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply" />
                {d.isFeatured && <span className="absolute top-4 left-4 bg-[#c99f2b] text-white text-[10px] tracking-widest font-bold px-3 py-1.5 uppercase rounded shadow-lg">Featured Main</span>}
             </div>

             <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => openEditModal(d)} className="w-9 h-9 rounded-full bg-white/95 text-blue-600 hover:text-white flex items-center justify-center hover:bg-blue-600 shadow-xl backdrop-blur-md transition-all border border-transparent hover:border-blue-500" title="Edit Metadata">
                  <Edit2 size={16} />
                </button>
                <button onClick={(e) => handleDelete(d._id, e)} className="w-9 h-9 rounded-full bg-white/95 text-red-600 hover:text-white flex items-center justify-center hover:bg-red-600 shadow-xl backdrop-blur-md transition-all border border-transparent hover:border-red-500" title="Delete">
                  <Trash2 size={16} />
                </button>
             </div>

             <div className="p-6 flex flex-col flex-1 relative z-0">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-[19px] leading-tight text-gray-900 font-serif">{d.name}</h3>
                   <span className="bg-gray-100 border border-gray-200 text-gray-600 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded shadow-inner whitespace-nowrap">{d.category?.name || 'Unassigned'}</span>
                </div>
                <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 mt-1 font-medium">{d.description || 'No description explicitly provided for this item.'}</p>
             </div>
           </div>
         ))}
         {designs.length === 0 && (
           <div className="col-span-full py-20 px-8 text-center bg-white shadow-sm border-2 border-dashed border-gray-200 text-gray-500 rounded-3xl cursor-pointer hover:bg-gray-50/80 transition-colors" onClick={openAddModal}>
             <span className="block mb-4 font-serif text-3xl italic text-gray-300">Empty Showcase</span>
             <span className="font-bold text-[13px] tracking-widest uppercase text-[#b8860b] bg-[#b8860b]/10 px-6 py-3 rounded-full">Assign new catalog assets</span>
           </div>
         )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "add" ? "Design Origin Setup" : "Re-Hash Lookbook Details"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Display Subject Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-[#c99f2b] outline-none transition-colors bg-gray-50 focus:bg-white text-md font-bold text-black shadow-inner" placeholder="E.g. Royal Silk Lehanga" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Foreign Key Reference</label>
              <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-[#c99f2b] outline-none transition-colors bg-gray-50 focus:bg-white text-md font-bold text-black shadow-inner cursor-pointer">
                <option value="" disabled>Strict selection required</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div>
             <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Public Documentation (Description)</label>
             <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-[#c99f2b] outline-none transition-colors bg-gray-50 focus:bg-white text-[13px] font-medium text-black shadow-inner h-28 resize-none" placeholder="Fabric details, origin, design cues..." />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-xl border border-dashed border-[#b8860b]/40 bg-[#b8860b]/5 shadow-inner">
             <div className="flex-1">
               <label className="block text-[11px] font-bold tracking-widest uppercase text-[#b8860b] mb-2"> {modalMode === "edit" && <span className="text-gray-500">(Ignore to preserve original)</span>}</label>
               <input type={modalMode === "add" ? "file" : "file"} required={modalMode === "add"} accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:tracking-widest file:uppercase file:bg-[#1a1110] file:text-[#c99f2b] hover:file:bg-black file:transition-colors file:shadow-md" />
             </div>
             
             <div className="flex items-center gap-3 pr-2 pl-4 sm:pl-0 border-l border-[#b8860b]/20 sm:ml-4 h-full py-2">
                <input type="checkbox" id="featured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-6 h-6 text-[#b8860b] rounded-md border-gray-300 focus:ring-[#b8860b] shadow-inner cursor-pointer" />
                <label htmlFor="featured" className="text-[12px] font-bold uppercase tracking-widest text-[#1a1110] cursor-pointer select-none">Featured product</label>
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 pt-6 border-t font-serif">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-[11px]">Cancel</button>
            <button type="submit" className="bg-[#1a1110] text-[#c99f2b] px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/20 uppercase tracking-widest text-[11px]">
              {modalMode === "add" ? "Add Design" : "Update Design"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

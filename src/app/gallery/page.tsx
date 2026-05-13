"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface GalleryItem {
  _id: string;
  image: string;
  caption: string;
  order: number;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (isMounted) setItems(res.data);
      } catch (err) {
        if (isMounted) toast.error("Failed to load gallery parameters");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  const openAddModal = () => {
    setModalMode("add");
    setCaption("");
    setOrder(0);
    setImageFile(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setModalMode("edit");
    setCaption(item.caption);
    setOrder(item.order);
    setImageFile(null); // Clear previous files to avoid unintended overwrites natively
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "add" && !imageFile) return toast.error("Please physically select an image file first");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("order", String(order));
    if (imageFile) formData.append("image", imageFile);

    const toastId = toast.loading(modalMode === "add" ? "Deploying binary payload..." : "Updating network states...");
    try {
      if (modalMode === "add") {
        await api.post('/gallery', formData);
      } else {
        await api.put(`/gallery/${editingId}`, formData);
      }
      toast.success("Gallery operation succeeded!", { id: toastId });
      setIsModalOpen(false);
      setRefetchTrigger(prev => prev + 1);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Upload failed permanently, check backend console", { id: toastId });
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Permanently erase image link globally?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Source permanently destroyed");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      toast.error("Network Deletion failed");
    }
  };

  if (loading) return <div className="p-8 italic text-gray-500 font-serif text-lg">Compiling Cloudinary sources...</div>;

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Live External Gallery</h1>
        <button onClick={openAddModal} className="bg-emerald-600 text-white w-full sm:w-auto px-5 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2.5 text-sm uppercase tracking-widest hover:-translate-y-0.5">
          <Plus size={18} /> Add Gallery
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
         {items.map(d => (
           <div key={d._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col group relative transform hover:-translate-y-1 transition-all duration-300">
             <div className="aspect-[4/5] bg-gray-200 relative cursor-pointer overflow-hidden" onClick={() => openEditModal(d)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={d.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out mix-blend-multiply" />
             </div>
             
             {/* Edit / Delete Options floating */}
             <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(d)} className="w-9 h-9 rounded-full bg-white/95 text-blue-600 hover:text-white flex items-center justify-center hover:bg-blue-600 shadow-xl backdrop-blur-md transition-all border border-transparent hover:border-blue-500" title="Edit Properties">
                  <Edit2 size={16} />
                </button>
                <button onClick={(e) => handleDelete(d._id, e)} className="w-9 h-9 rounded-full bg-white/95 text-red-600 hover:text-white flex items-center justify-center hover:bg-red-600 shadow-xl backdrop-blur-md transition-all border border-transparent hover:border-red-500" title="Destroy">
                  <Trash2 size={16} />
                </button>
             </div>
             
             <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pb-6 pt-12 px-6 pointer-events-none">
                <p className="text-white text-[16px] font-bold truncate font-serif drop-shadow-lg">{d.caption || 'Unlabeled Source'}</p>
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase mt-1 block drop-shadow-md">Positional Key: #{d.order}</span>
             </div>
           </div>
         ))}
         {items.length === 0 && (
           <div className="col-span-full py-20 px-8 text-center bg-white shadow-sm border-2 border-dashed border-gray-200 text-gray-500 rounded-3xl cursor-pointer hover:bg-gray-50/80 transition-colors" onClick={openAddModal}>
             <span className="block mb-4 font-serif text-3xl italic text-gray-300">Null Archive Database</span>
             <span className="font-bold text-[13px] tracking-widest uppercase text-emerald-600 bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100">Establish new data source</span>
           </div>
         )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "add" ? "Transmit Cloudinary Media" : "Modify Reference Vector"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          <div>
             <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Display Caption</label>
             <input type="text" value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-black shadow-inner bg-gray-50" placeholder="Brief visual description parameter..." />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Logic Sequence Placement (Index)</label>
            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full p-3.5 border-2 border-gray-100 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-black shadow-inner bg-gray-50" />
          </div>
          
          <div>
             <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Binary Object Mapping {modalMode === "edit" && <span className="text-orange-500">(Leave empty to retain prior image)</span>}</label>
             <div className="p-1 rounded-xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition-colors overflow-hidden">
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full cursor-pointer file:mr-5 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:tracking-widest file:uppercase file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 file:transition-colors file:shadow-md" />
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-[11px]">Ignore Data</button>
            <button type="submit" className="bg-[#1a1110] text-emerald-400 px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/20 uppercase tracking-widest text-[11px]">
              {modalMode === "add" ? "Execute Transmission" : "Re-Hash Properties"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

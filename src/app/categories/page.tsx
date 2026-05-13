"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (isMounted) setCategories(res.data);
      } catch (err) {
        if (isMounted) toast.error("Failed to load categories");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  const openAddModal = () => {
    setModalMode("add");
    setName("");
    setOrder(0);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setModalMode("edit");
    setName(c.name);
    setOrder(c.order);
    setEditingId(c._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await api.post('/categories', { name, order });
        toast.success("Category created!");
      } else {
        await api.put(`/categories/${editingId}`, { name, order });
        toast.success("Category updated!");
      }
      setIsModalOpen(false);
      setRefetchTrigger(prev => prev + 1);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Error saving category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deletion? Designs linked to this category may break.")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      setRefetchTrigger(prev => prev + 1);
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <div className="p-8 text-gray-500 font-serif italic text-lg">Aligning grid tables...</div>;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 border-l-4 border-[#b8860b] pl-4">Manage Categories</h1>
        <button onClick={openAddModal} className="bg-[#b8860b] text-white w-full sm:w-auto px-5 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-xl shadow-[#b8860b]/20 flex items-center justify-center gap-2.5 text-sm uppercase tracking-widest hover:-translate-y-0.5">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-[#1a1110] border-b text-white">
              <tr>
                <th className="p-5 font-bold uppercase tracking-widest text-[10px]">Category Entity Name</th>
                <th className="p-5 font-bold uppercase tracking-widest text-[10px]">Display ID Sequence</th>
                <th className="p-5 font-bold text-right uppercase tracking-widest text-[10px]">Modification Triggers</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c._id} className="border-b last:border-0 hover:bg-gray-50/80 transition-colors">
                  <td className="p-5 font-bold text-gray-800 text-[15px]">{c.name}</td>
                  <td className="p-5 text-gray-500 font-medium">#{c.order}</td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button onClick={() => openEditModal(c)} className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit Metadata">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(c._id)} className="bg-red-50 text-red-600 p-2.5 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Erase Record">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={3} className="p-16 text-center text-gray-400 italic font-serif text-lg bg-gray-50/50">Collection entirely empty. Initiate root parameter configuration.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === "add" ? "Create Category" : "Edit Application Element"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Internal Registration Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-[#c99f2b] outline-none transition-colors bg-gray-50 focus:bg-white text-md font-bold text-black shadow-inner" placeholder="E.g. Mens Wear" />
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">Indexing Logic (Sequence Array)</label>
            <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full p-3.5 border-2 border-gray-100 rounded-xl focus:border-[#c99f2b] outline-none transition-colors bg-gray-50 focus:bg-white text-md font-bold text-black shadow-inner" />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-6 border-t font-serif">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest text-[11px]">Cancel</button>
            <button type="submit" className="bg-[#1a1110] text-[#c99f2b] px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg shadow-black/20 uppercase tracking-widest text-[11px]">
              {modalMode === "add" ? "Add Category" : "Execute Overwrite"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

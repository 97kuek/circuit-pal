"use client";

import Link from "next/link";
import { ArrowLeft, Archive, Plus, Search, Trash2, Edit2, Package, Save, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useInventory, InventoryItem, InventoryCategory, CATEGORY_LABELS } from "@/lib/inventory";

export default function InventoryPage() {
    const { items, addItem, updateItem, deleteItem, isLoaded } = useInventory();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | "all">("all");

    // Form State
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        name: "",
        category: "misc",
        quantity: 0,
        value: "",
        location: "",
        notes: ""
    });

    const uniqueCategories = Array.from(new Set(items.map(i => i.category)));

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                category: "misc",
                quantity: 1,
                value: "",
                location: "",
                notes: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        if (editingItem) {
            updateItem(editingItem.id, formData as any);
        } else {
            addItem(formData as any);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-blue-100">
            <div className="max-w-7xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-blue-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    DASHBOARD
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-200">
                            <Archive className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                                MY <span className="text-zinc-400 font-mono text-xl font-normal">INVENTORY</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">LOCAL STORAGE • PRIVATE • SECURE</p>
                        </div>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all font-bold shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        ADD COMPONENT
                    </button>
                </div>

                {/* Stats / Warnings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-zinc-900">{items.length}</div>
                            <div className="text-xs text-zinc-500 font-bold uppercase">Total Items</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-zinc-900">
                                {items.filter(i => i.quantity < 5).length}
                            </div>
                            <div className="text-xs text-zinc-500 font-bold uppercase">Low Stock</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-zinc-100 text-zinc-500 rounded-lg">
                            <Save className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-green-600 font-bold mb-1">● AUTO-SAVED</div>
                            <div className="text-xs text-zinc-400">Data stored locally</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search parts, values, notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as any)}
                        className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-blue-500 text-sm font-bold text-zinc-700"
                    >
                        <option value="all">ALL CATEGORIES</option>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {/* Inventory List */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden min-h-[400px]">
                    {!isLoaded ? (
                        <div className="p-12 text-center text-zinc-400">Loading inventory...</div>
                    ) : filteredItems.length === 0 ? (
                        <div className="p-12 text-center">
                            <Package className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                            <h3 className="text-zinc-900 font-bold mb-2">No Items Found</h3>
                            <p className="text-zinc-500 text-sm">Add your first component to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 font-mono uppercase">Name / Value</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 font-mono uppercase">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 font-mono uppercase">Location</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 font-mono uppercase text-center">Qty</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-400 font-mono uppercase text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {filteredItems.map(item => (
                                        <tr key={item.id} className="group hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-zinc-900">{item.name}</div>
                                                <div className="text-xs text-zinc-500 font-mono">{item.value}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-600 uppercase tracking-wide">
                                                    {CATEGORY_LABELS[item.category]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-zinc-600 flex items-center gap-2">
                                                    {item.location || <span className="text-zinc-300 italic">--</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className={`font-mono font-bold ${item.quantity < 5 ? 'text-red-500' : 'text-zinc-900'}`}>
                                                    {item.quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(item.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                <h3 className="font-bold text-lg text-zinc-900">
                                    {editingItem ? 'Edit Component' : 'Add Component'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Item Name</label>
                                        <input
                                            required
                                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                                            placeholder="e.g. Ceramic Capacitor"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Value / Spec</label>
                                        <input
                                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-blue-500 font-mono"
                                            placeholder="e.g. 100nF"
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-blue-500 font-mono"
                                            value={formData.quantity}
                                            onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Category</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                                <button
                                                    type="button"
                                                    key={key}
                                                    onClick={() => setFormData({ ...formData, category: key as any })}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${formData.category === key
                                                            ? "bg-zinc-800 text-white border-zinc-800"
                                                            : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Location</label>
                                        <input
                                            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-blue-500"
                                            placeholder="e.g. Cabinet A, Drawer 3"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4"
                                >
                                    {editingItem ? 'UPDATE COMPONENT' : 'ADD TO STOCK'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

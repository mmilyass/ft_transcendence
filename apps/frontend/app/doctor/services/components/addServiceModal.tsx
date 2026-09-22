"use client";

import React, { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
}

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  editingService?: any | null;
  onSave: (serviceData: {
    name: string;
    duration: number;
    price: number;
    category_id: string;
    icon: string;
  }) => void;
}

const AddServiceModal = ({
  open,
  onClose,
  categories,
  editingService,
  onSave,
}: AddServiceModalProps) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const isEditing = Boolean(editingService);

  useEffect(() => {
    if (!open) return;

    if (editingService) {
      setName(editingService.name ?? "");
      setDuration(String(editingService.duration ?? ""));
      setPrice(String(editingService.price ?? ""));
      setCategoryId(
        editingService.category_id ?? editingService.category?.id ?? "",
      );
    } else {
      setName("");
      setDuration("");
      setPrice("");
      setCategoryId("");
    }
  }, [open, editingService]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Please select a category");
      return;
    }
    onSave({
      name,
      duration: Number(duration),
      price: Number(price),
      category_id: categoryId,
      icon: editingService?.icon || "medical_services",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl">
        <div className="border-b border-surface-container p-6">
          <h2 className="text-xl font-bold">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Annual Checkup"
              className="w-full rounded-lg border-0 bg-surface-container-low p-3 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline">
              Category
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border-0 bg-surface-container-low p-3 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline">
                Duration (mins)
              </label>
              <input
                type="number"
                required
                min="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                className="w-full rounded-lg border-0 bg-surface-container-low p-3 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline">
                Price ($)
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                className="w-full rounded-lg border-0 bg-surface-container-low p-3 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 bg-surface-container-low p-6 -mx-6 -mb-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-2 font-semibold text-on-surface hover:bg-surface-container-high"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2 font-bold text-white shadow-lg shadow-primary/10"
            >
              {isEditing ? "Save Changes" : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;

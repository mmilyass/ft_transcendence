'use client';

import React, { useState, useEffect } from 'react';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string;}) => void;
  initialData?: { id?: string; name: string; };
}

const AddCategoryModal = ({ open, onClose, onSave, initialData }: CategoryModalProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
    } else {
      setName('');
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl">
        <div className="border-b border-surface-container p-6">
          <h2 className="text-xl font-bold">{initialData?.id ? 'Edit Category' : 'Add New Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-outline">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cardiology"
              className="w-full rounded-lg border-0 bg-surface-container-low p-3 focus:ring-2 focus:ring-primary/20"
            />
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
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
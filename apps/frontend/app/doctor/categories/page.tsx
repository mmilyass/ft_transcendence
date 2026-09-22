"use client";

import React, { useState, useEffect } from "react";
import DoctorShell from "../components/DoctorShell";
import InformationFooter from "@/components/InformationFooter";
import AddCategoryModal from "./components/addCategoryModal";
import {
  fetchCategories,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "@/lib/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (formData: {
    name: string;
  }) => {
    try {
      if (editingCategory) {
        const updated = await updateCategoryApi(editingCategory.id, formData);
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updated : cat)),
        );
      } else {
        const created = await createCategoryApi(formData);
        setCategories((prev) => [...prev, created]);
      }
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategoryApi(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  return (
    <DoctorShell>
      <main className="flex-1 bg-surface min-h-screen p-4 sm:p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
              Categories Management
            </h1>
            <p className="text-on-surface-variant font-medium">
              Organize your medical services into descriptive categories.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Category
          </button>
        </header>

        {/* Categories Table View */}
        <div className="bg-surface-container-lowest rounded-xl p-2">
          {loading ? (
            <p className="p-6 text-on-surface-variant">Loading categories...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left">
                    <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="group hover:bg-surface-bright transition-colors rounded-xl"
                    >
                      <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent rounded-l-xl font-semibold text-on-surface">
                        {category.name}
                      </td>
                      <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent rounded-r-xl text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setShowModal(true);
                            }}
                            className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-outline">
                        No categories found. Click "Add Category" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <InformationFooter />

        {/* Modal */}
        <AddCategoryModal
          open={showModal}
          initialData={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      </main>
    </DoctorShell>
  );
};

export default CategoriesPage;

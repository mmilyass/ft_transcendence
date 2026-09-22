"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/layout";
import DoctorShell from "../components/DoctorShell";
import TableSection from "./components/tableSection";
import AddServiceModal from "./components/addServiceModal";
import InformationFooter from "@/components/InformationFooter";
import {
  fetchServices,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  apiFetch,
} from "@/lib/api";

const Services = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadData(user.sub);
  }, [authLoading, user, router]);

  const loadData = async (userId: string) => {
    setLoading(true);

    try {
      const servicesData = await fetchServices(userId);
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to load services", error);
      setServices([]);
    }

    try {
      const categoriesRes = await apiFetch("/categories").then((res) =>
        res.json(),
      );
      setCategories(categoriesRes);
    } catch (error) {
      console.error("Failed to load categories", error);
      setCategories([]);
    }

    setLoading(false);
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSaveService = async (serviceData: any) => {
    if (!user) return;

    try {
      if (editingService) {
        const updated = await updateServiceApi(
          user.sub,
          editingService.id,
          serviceData,
        );
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? updated : s)),
        );
      } else {
        const created = await createServiceApi(user.sub, serviceData);
        setServices((prev) => [...prev, created]);
      }
    } catch (error: any) {
      console.error("Failed to save service", error);
      alert(`Error: ${error.message || "Failed to save service"}`);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!user) return;
    try {
      await deleteServiceApi(user.sub, serviceId);
      setServices((prev) => prev.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error("Failed to delete service", error);
    }
  };

  if (authLoading) {
    return (
      <DoctorShell>
        <main className="flex-1 bg-surface min-h-screen p-4 sm:p-8 md:p-12 overflow-y-auto">
          <p className="text-on-surface-variant">Checking session...</p>
        </main>
      </DoctorShell>
    );
  }

  return (
    <DoctorShell>
      <main className="flex-1 bg-surface min-h-screen p-4 sm:p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
              Services Management
            </h1>
            <p className="text-on-surface-variant font-medium">
              Define and manage your clinical offerings and pricing.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Service
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface-container-low p-6 rounded-xl border-0 flex flex-col">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
              Active Services
            </span>
            <span className="text-4xl font-headline font-black text-on-surface">
              {services.length}
            </span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-0 flex flex-col">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
              Average Price
            </span>
            <span className="text-4xl font-headline font-black text-on-surface">
              $
              {services.length
                ? Math.round(
                    services.reduce((acc, curr) => acc + curr.price, 0) /
                      services.length,
                  )
                : 0}
            </span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-0 flex flex-col">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-1">
              Utilization
            </span>
            <span className="text-4xl font-headline font-black text-on-surface">
              88%
            </span>
          </div>
        </div>

        {/* Table Section */}
        <div>
          {loading ? (
            <p className="text-on-surface-variant">Loading services...</p>
          ) : (
            <TableSection
              services={services}
              onDelete={handleDeleteService}
              onEdit={handleOpenEdit}
            />
          )}
        </div>

        <InformationFooter />

        {/* Add/Edit Service Modal */}
        {showModal && (
          <AddServiceModal
            open={showModal}
            categories={categories}
            editingService={editingService}
            onClose={handleCloseModal}
            onSave={handleSaveService}
          />
        )}
      </main>
    </DoctorShell>
  );
};

export default Services;

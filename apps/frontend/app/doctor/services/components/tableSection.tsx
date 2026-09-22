function TableSection({
  services,
  onDelete,
  onEdit,
}: {
  services: any[];
  onDelete: (id: string) => void;
  onEdit: (service: any) => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-2">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left">
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Service Name
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Duration
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Price
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-outline tracking-widest uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="space-y-2">
            {services.map((service) => (
              <tr
                key={service.id}
                className="group hover:bg-surface-bright transition-colors rounded-xl"
              >
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent rounded-l-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">
                        {service.icon || "medical_services"}
                      </span>
                    </div>
                    <span className="font-semibold text-on-surface">
                      {service.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent">
                  <span className="text-on-surface-variant font-medium">
                    {service.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent">
                  <span className="text-on-surface-variant font-medium">
                    {service.duration} Minutes
                  </span>
                </td>
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent">
                  <span className="font-bold text-on-surface">
                    ${Number(service.price).toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      service.status === "active" || !service.status
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-surface-variant text-outline"
                    }`}
                  >
                    {service.status ? service.status : "active"}
                  </span>
                </td>
                <td className="px-6 py-5 bg-surface-container-low/30 group-hover:bg-transparent rounded-r-xl text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableSection;

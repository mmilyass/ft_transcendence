
type AppointmentsFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function AppointmentsFilters({ searchTerm, setSearchTerm }: AppointmentsFiltersProps) {
  return (
        <div className="bg-surface-container-low p-2 rounded-2xl mb-8 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
              <input
                className="w-full bg-surface-container-lowest border-none focus:ring-2 focus:ring-primary/20 rounded-xl pl-12 pr-4 py-3 text-sm placeholder:text-outline"
                placeholder="Search patients, services or IDs..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container-lowest px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 text-on-surface-variant hover:bg-surface-bright transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                <span>Filter</span>
              </button>
            </div>
          </div>
  );
}
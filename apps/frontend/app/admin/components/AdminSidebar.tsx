  'use client';

  import Link from 'next/link';
  import Image from 'next/image';
  import { useAuth } from '@/app/layout';
  import { useRouter } from 'next/navigation';

  type AdminSidebarProps = {
    activePage?: 'dashboard' | 'users' | 'doctors' | 'settings';
    isOpen?: boolean;
    onClose?: () => void;
  };

  export default function AdminSidebar({
    activePage = 'dashboard',
    isOpen = false,
    onClose,
  }: AdminSidebarProps) {
    const router = useRouter();
    const navItems = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard', key: 'dashboard' },
      { name: 'Users', href: '/admin/users', icon: 'group', key: 'users' },
      { name: 'Doctors', href: '/admin/doctors', icon: 'description', key: 'doctors' },
      { name: 'Settings', href: '/admin/settings', icon: 'settings', key: 'settings' },
    ];
    const { user, loading} = useAuth();
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
      <>
        {/* Overlay for mobile */}
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
        )}

        <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-50 p-4 transition-transform duration-300
          ${ isOpen ? 'translate-x-0' : '-translate-x-full' } lg:translate-x-0`}>
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <h2 className="font-['Manrope'] text-xl font-bold text-slate-900">
                  Maou<span className="text-blue-500">3</span>idy
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Clinical Admin</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-200">
              <span className="material-symbols-outlined text-slate-500">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                    ${ isActive ? 'bg-white font-semibold text-blue-600 shadow-sm' : 'font-medium text-slate-500 hover:bg-slate-200/50 hover:text-slate-900' }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Admin Profile */}
          <div className="mt-auto rounded-xl bg-slate-100 p-4">
            <div className="flex items-center gap-3">
              <Image
                src={user?.image || 'https://i.pinimg.com/736x/f7/82/c8/f782c8360e890a8d488eeda004b26bde.jpg'}
                alt="Admin"
                width={48}
                height={48}
                style={{ width: 'auto', height: '40px' }}
                className="rounded-lg object-cover"
              />
              <div className="overflow-hidden flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{user?.name || 'Admin'}</p>
                <p className="truncate text-[10px] text-slate-500">Senior Admin</p>
              </div>
            </div>
            <button
              onClick={() => { router.push('/logout'); }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          </div>
        </aside>
      </>
    );
  }
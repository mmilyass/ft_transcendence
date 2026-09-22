'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/layout';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useEffect, useRef, useState } from 'react';
import ProfileMenu from './components/ProfileMenu';
import NotificationBell from './NotificationBell';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

interface NavbarProps {
  activeLink?: 'doctors' | 'specialties' | 'about' | '';
  showAuthButtons?: boolean;
  logoText?: string;
}

export default function Navbar({
  activeLink = 'doctors',
  showAuthButtons = true,
}: NavbarProps) {
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNotificationsOpen, setMobileNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/notification/unread-count", {
            withCredentials: true,
          });
          setUnreadCount(response.data);
        } catch (error) {
          console.error("Error fetching unread notifications count:", error);
        }
      };

      if (user) {
        fetchUnreadCount();
      }
    }, [user]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;

        if (
          profileRef.current &&
          !profileRef.current.contains(target)
        ) {
          setMenuOpen(false);
        }

        if (
          mobileProfileRef.current &&
          !mobileProfileRef.current.contains(target)
        ) {
          setMobileMenuOpen(false);
        }

        if (
          notificationRef.current &&
          !notificationRef.current.contains(target)
        ) {
          setNotificationsOpen(false);
        }

        if (
          mobileNotificationRef.current &&
          !mobileNotificationRef.current.contains(target)
        ) {
          setMobileNotificationsOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener(
          'mousedown',
          handleClickOutside
        );
      };
    }, []);

  const handleLogout = async () => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_URL + "/auth/logout", {}, {
        withCredentials: true,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout request failed (clearing session locally anyway):", error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen((prev) => {
      if (!prev) setMenuOpen(false);
      return !prev;
    });
  };

  const toggleProfile = () => {
    setMenuOpen((prev) => {
      if (!prev) setNotificationsOpen(false);
      return !prev;
    });
  };

  const [DoctorButton, setDoctorButton] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchHideDoctorButton = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/auth/hide_doctor_button", {
          withCredentials: true,
        });
        setDoctorButton(response.data.hide_doctor_button);
      } catch (error) {
        console.error("Error fetching hide doctor button status:", error);
      }
    };

    if (user) {
      fetchHideDoctorButton();
    }
  }, [user]);

  const handleHideDoctorButtonClick = async () => {
    try {
      await axios.patch(process.env.NEXT_PUBLIC_URL + "/auth/update_hide_doctor_button", {}, {
        withCredentials: true,
      });
      setDoctorButton((prev) => !prev);
      router.refresh();
    } catch (error) {
      console.error("Error updating hide doctor button status:", error);
    }
  };
  if (loading) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-8">
          <span
            onClick={() => router.push('/')}
            className="text-xl font-bold tracking-tighter text-slate-900 cursor-pointer"
          >
            Maou<span className="text-blue-500">3</span>idy
          </span>
          <nav className="hidden md:flex items-center gap-6 font-manrope tracking-tight font-semibold">
          <Link
            href="/"
            className={`transition-colors cursor-pointer py-1 ${
              activeLink === 'doctors'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            {t('nav.findDoctors')}
          </Link>
            <Link
              href={'/specialties'}
              onClick={() => router.push('/specialties')}
              className={`transition-colors cursor-pointer py-1 ${
                activeLink === 'specialties'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {t('nav.specialties')}
            </Link>
            <Link
              href={'/about-us'}
              onClick={() => router.push('/about-us')}
              className={`transition-colors cursor-pointer py-1 ${
                activeLink === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {t('nav.aboutUs')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {showAuthButtons && (
            <div className="hidden md:flex items-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-slate-600 font-semibold px-4 py-2 hover:text-blue-700 active:scale-95 duration-200"
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-95 duration-200 transition-all"
                  >
                    {t('nav.signUp')}
                  </button>
                </>
              ) : (
                <>
                {(user.role === 'ADMIN' || user.role === 'DOCTOR') ? (
                  <button
                    onClick={() =>
                      router.push(
                        user.role === 'ADMIN'
                          ? '/admin/dashboard'
                          : '/doctor/dashboard'
                      )
                    }
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-95 duration-200 transition-all"
                  >
                    {user.role === 'ADMIN' ? t('nav.adminDashboard') : t('nav.doctorDashboard')}
                  </button>
                ) : (
                  DoctorButton === false && (
                    <div className="relative">
                      <button
                        onClick={() => router.push('/doctor-register')}
                        className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-95 duration-200 transition-all"
                      >
                        {t('nav.joinAsDoctor')}
                      </button>
                      <button
                        onClick={handleHideDoctorButtonClick}
                        className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold flex items-center justify-center transition-all"
                        title="Don't show this again"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={toggleNotifications}
                      className="relative w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                    >
                      <span className="material-symbols-outlined">
                        notifications
                      </span>

                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && <NotificationBell onUnreadCountChange={setUnreadCount} /> }
                  </div>
                  <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfile}
                    className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
                  >
                    <span className="material-symbols-outlined">
                      account_circle
                    </span>
                  </button>
                    {menuOpen && 
                        <ProfileMenu user={user} onLogout={handleLogout} />
                    }
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile notification bell */}
          {user && (
            <div className="md:hidden relative" ref={mobileNotificationRef}>
              <button
                onClick={() => setMobileNotificationsOpen((prev) => !prev)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {mobileNotificationsOpen && <NotificationBell onUnreadCountChange={setUnreadCount} />}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {mobileNavOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 px-4 py-4 space-y-2">
          <Link href={'/'} onClick={() => { router.push('/'); setMobileNavOpen(false); }} className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">{t('nav.findDoctors')}</Link>
          <Link href={'/specialties'} onClick={() => { router.push('/specialties'); setMobileNavOpen(false); }} className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">{t('nav.specialties')}</Link>
          <Link href={'about-us'} onClick={() => { router.push('/about-us'); setMobileNavOpen(false); }} className="block px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 cursor-pointer">{t('nav.aboutUs')}</Link>
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
          {showAuthButtons && (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              {!user ? (
                <>
                  <button onClick={() => { router.push('/login'); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100">{t('nav.signIn')}</button>
                  <button onClick={() => { router.push('/doctor-register'); setMobileNavOpen(false); }} className="w-full px-3 py-2 bg-primary text-on-primary rounded-xl font-semibold">{t('nav.joinAsDoctor')}</button>
                </>
              ) : (
                <>
                  {(user.role === 'ADMIN' || user.role === 'DOCTOR') ? (
                    <button
                      onClick={() => { router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/doctor/dashboard'); setMobileNavOpen(false); }}
                      className="w-full px-3 py-2 bg-primary text-on-primary rounded-xl font-semibold"
                    >
                      {user.role === 'ADMIN' ? t('nav.adminDashboard') : t('nav.doctorDashboard')}
                    </button>
                  ) : (
                    DoctorButton === false && (
                      <div className="relative w-full">
                        <button
                          onClick={() => { router.push('/doctor-register'); setMobileNavOpen(false); }}
                          className="w-full px-3 py-2 bg-primary text-on-primary rounded-xl font-semibold"
                        >
                          {t('nav.joinAsDoctor')}
                        </button>
                        <button
                          onClick={handleHideDoctorButtonClick}
                          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold flex items-center justify-center transition-all"
                          title="Don't show this again"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                  <button onClick={() => { handleLogout(); setMobileNavOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-red-600 font-semibold hover:bg-red-50">{t('nav.logout')}</button>
                  <div className="relative" ref={mobileProfileRef}>
                    <button
                      onClick={() => setMobileMenuOpen((prev) => !prev)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
                    >
                      <span className="material-symbols-outlined">account_circle</span>
                    </button>
                    {mobileMenuOpen && <ProfileMenu user={user} onLogout={handleLogout} />}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-slate-200/50 h-px"></div>
    </header>
  );
}

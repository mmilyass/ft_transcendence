'use client';

import axios from 'axios';
import Img from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../layout';
import { useI18n } from '@/lib/i18n/I18nContext';

type FeaturedDoctor = {
  user: {
    name: string;
    image: string;
  };
};

type NextSessionResponse = {
  viewerRole: 'PATIENT' | 'DOCTOR';
  date: string;
  serviceName: string | null;
  with: {
    id: string;
    doctorId?: string;
    name: string;
    email: string;
  };
};

type NextSessionCard = NextSessionResponse & {
  specialty?: string | null;
  image?: string | null;
};

type SessionState =
  | { kind: 'loading' }
  | { kind: 'logged-out' }
  | { kind: 'none' }
  | { kind: 'session'; data: NextSessionCard };

type stats = {
  totalPatients: number;
  totalSpecialists: number;
  featuredDoctors: FeaturedDoctor[];
};

function formatNumber(num: number) {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }

  return num.toString();
}

export default function HeroSection() {
  const router = useRouter();
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set('search', search);
    }

    if (location.trim()) {
      params.set('location', location);
    }
    router.push(`/specialties?${params.toString()}`);
  };

  const [stats, setStats] = useState<stats>({
    totalPatients: 0,
    totalSpecialists: 0,
    featuredDoctors: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingPageData = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_URL + "/users/landing-page"
        , { withCredentials: true });

        setStats(response.data);
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPageData();
  }, []);

  const [sessionState, setSessionState] = useState<SessionState>({ kind: 'loading' });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setSessionState({ kind: 'logged-out' });
      return;
    }

    if (user.role !== 'USER' && user.role !== 'DOCTOR') {
      setSessionState({ kind: 'none' });
      return;
    }

    const fetchNextSession = async () => {
      try {
        const response = await axios.get<NextSessionResponse | null>(
          process.env.NEXT_PUBLIC_URL + '/slots/me/next',
          { withCredentials: true }
        );

        const session = response.data;
        if (!session) {
          setSessionState({ kind: 'none' });
          return;
        }

        if (session.viewerRole === 'PATIENT' && session.with.doctorId) {
          try {
            const doctorRes = await axios.get(
              process.env.NEXT_PUBLIC_URL + `/doctor/${session.with.doctorId}`,
              { withCredentials: true }
            );

            setSessionState({
              kind: 'session',
              data: {
                ...session,
                specialty: doctorRes.data?.speciality ?? null,
                image: doctorRes.data?.profileImage ?? null,
              },
            });
            return;
          } catch (err) {
            console.error('Failed to fetch doctor profile for next session:', err);
          }
        }

        setSessionState({ kind: 'session', data: session });
      } catch (error) {
        console.error('Error fetching next session:', error);
        setSessionState({ kind: 'none' });
      }
    };

    fetchNextSession();
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDu91gZQrxbXr9grN30AUxmG2QMGq6G-oupfmOFWO-sD4szJP0A5uM2V9UxEMWFVbblKPyFMRjylnMhw0nNIPi7iSOTsLFNWxLXufBuBPzGh5OoZ0ATOSQSJa41ChC0GAfOPNDzdF3lHMl1Cn-v4DGEFImeFIo3xB7zHeL2qtuUgrr6M-1dfOqK07EZidGenHvVWypqsgUgesLcl65Eo3dfNm8wsfYcgyQ91SlaDirv57ev3A_E9Dw7qlQqo1aMG4qOZPHKjCQDCU"

  const sessionCard = sessionState.kind === 'session' ? sessionState.data : null;

  const imageSrc =
    sessionCard?.image?.startsWith('http')
      ? sessionCard.image
      : sessionCard?.with?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(sessionCard.with.name)}`
        : '/default-avatar.png';

  return (
<section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold tracking-wider mb-4 sm:mb-6">{formatNumber(stats.totalPatients)}+ {t('hero.trustBadge')}</span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1] mb-4 sm:mb-6">
                {t('hero.title.pre')} <span className="text-primary">{t('hero.title.highlight')}</span> {t('hero.title.post')}
              </h1>
              <p className="text-base sm:text-lg text-on-surface-variant max-w-lg mb-8 sm:mb-10 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Hero Search Bar */}
              <div className="p-2 bg-surface-container-lowest rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 border border-outline-variant/20">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <span className="material-symbols-outlined text-primary">search</span>
                  <input className="w-full py-3 bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline/60" placeholder={t('hero.searchPlaceholder')} type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="hidden md:block w-px h-8 bg-outline-variant/30"></div>
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <input className="w-full py-3 bg-transparent border-none focus:ring-0 text-on-surface placeholder-outline/60" placeholder={t('hero.locationPlaceholder')} type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <button onClick={handleSearch} className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary font-bold rounded-xl transition-transform active:scale-95">{t('hero.searchButton')}</button>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {stats.featuredDoctors.map((doctor, index) => (
                    <Img
                      key={index}
                      width={40}
                      height={40}
                      src={
                        doctor.user.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          doctor.user.name
                        )}`
                      }
                      alt={doctor.user.name}
                      className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                    />
                  ))}
                </div>

                <p className="text-sm text-on-surface-variant font-medium">
                  {loading
                    ? 'Loading...'
                    : `${stats.totalSpecialists}+ specialties • ${stats.totalPatients}+ patients`}
                </p>
              </div>
            </div>

            <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="relative rounded-2xl overflow-hidden aspect-4/5 shadow-2xl">
              <Img
                width={500}
                height={500}
                className="w-full h-full object-cover"
                src={sessionCard ? imageSrc : defaultImage}
                alt="clinic"
                loading="eager"
              />

              <div className="absolute bottom-6 left-6 right-6 p-6 bg-surface/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                {sessionState.kind === 'session' ? (
                  <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary">
                      person
                    </span>
                  </div>

                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {sessionState.data.viewerRole === 'PATIENT'
                          ? `Dr. ${sessionState.data.with.name}`
                          : sessionState.data.with.name}
                      </p>

                      <p className="text-xs text-on-surface-variant">
                        {sessionState.data.viewerRole === 'PATIENT'
                          ? sessionState.data.specialty || sessionState.data.serviceName || 'Consultation'
                          : sessionState.data.serviceName || 'Patient appointment'}
                      </p>

                      <p className="text-xs text-primary font-medium">
                        {new Date(sessionState.data.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : sessionState.kind === 'logged-out' ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-primary">
                        login
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Log in to see your next appointment
                      </p>

                      <button
                        onClick={() => router.push('/login')}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary">
                        video_call
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        No Upcoming Consultation
                      </p>

                      <p className="text-xs text-on-surface-variant">
                        Book an appointment with a specialist
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </section>
  );
}

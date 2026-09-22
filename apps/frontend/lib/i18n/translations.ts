// Translation dictionaries for the i18n system (see I18nContext.tsx).
//
// Coverage note: this covers the global chrome (navbar, footer — present on
// nearly every page) plus the landing page hero and the login/register
// forms, deliberately chosen because they're the highest-traffic, always
// visible surfaces. It is NOT yet a translation of every string across
// every route in the app — see test.md for the honest scope/status of this
// module before relying on it for a "complete" claim.
export type Locale = "en" | "fr" | "ar";

export const locales: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.findDoctors": "Find Doctors",
    "nav.specialties": "Specialties",
    "nav.aboutUs": "About Us",
    "nav.signIn": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.adminDashboard": "Admin Dashboard",
    "nav.doctorDashboard": "Doctor Dashboard",
    "nav.joinAsDoctor": "Join as Doctor",
    "nav.logout": "Logout",

    "footer.rights": "All rights reserved.",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.status": "System Status",

    "hero.trustBadge": "PATIENTS TRUST OUR PLATFORM",
    "hero.title.pre": "Find the right",
    "hero.title.highlight": "doctor",
    "hero.title.post": "easily",
    "hero.subtitle":
      "Access world-class healthcare from the comfort of your home. Book appointments with top specialists in minutes.",
    "hero.searchPlaceholder": "Specialty, name, or condition",
    "hero.locationPlaceholder": "Location",
    "hero.searchButton": "Search",

    "auth.login.title": "Welcome back",
    "auth.login.subtitle": "Sign in to manage your appointments",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.submit": "Sign In",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.forgotPassword": "Forgot password?",
    "auth.login.rememberMe": "Remember me for 30 days",

    "auth.register.title": "Create your account",
    "auth.register.subtitle": "Book your first appointment in minutes",
    "auth.register.name": "Full name",
    "auth.register.email": "Email",
    "auth.register.phone": "Phone number",
    "auth.register.password": "Password",
    "auth.register.confirmPassword": "Confirm Password",
    "auth.register.showPassword": "Show Password",
    "auth.register.submit": "Sign Up",
    "auth.register.haveAccount": "Already have an account?",
  },
  fr: {
    "nav.findDoctors": "Trouver un médecin",
    "nav.specialties": "Spécialités",
    "nav.aboutUs": "À propos",
    "nav.signIn": "Connexion",
    "nav.signUp": "S'inscrire",
    "nav.adminDashboard": "Tableau de bord admin",
    "nav.doctorDashboard": "Tableau de bord médecin",
    "nav.joinAsDoctor": "Rejoindre en tant que médecin",
    "nav.logout": "Déconnexion",

    "footer.rights": "Tous droits réservés.",
    "footer.privacyPolicy": "Politique de confidentialité",
    "footer.termsOfService": "Conditions d'utilisation",
    "footer.status": "État du système",

    "hero.trustBadge": "PATIENTS FONT CONFIANCE À NOTRE PLATEFORME",
    "hero.title.pre": "Trouvez le bon",
    "hero.title.highlight": "médecin",
    "hero.title.post": "facilement",
    "hero.subtitle":
      "Accédez à des soins de santé de classe mondiale depuis chez vous. Prenez rendez-vous avec les meilleurs spécialistes en quelques minutes.",
    "hero.searchPlaceholder": "Spécialité, nom ou pathologie",
    "hero.locationPlaceholder": "Localisation",
    "hero.searchButton": "Rechercher",

    "auth.login.title": "Content de vous revoir",
    "auth.login.subtitle": "Connectez-vous pour gérer vos rendez-vous",
    "auth.login.email": "E-mail",
    "auth.login.password": "Mot de passe",
    "auth.login.submit": "Connexion",
    "auth.login.noAccount": "Vous n'avez pas de compte ?",
    "auth.login.forgotPassword": "Mot de passe oublié ?",
    "auth.login.rememberMe": "Se souvenir de moi pendant 30 jours",

    "auth.register.title": "Créez votre compte",
    "auth.register.subtitle": "Prenez votre premier rendez-vous en quelques minutes",
    "auth.register.name": "Nom complet",
    "auth.register.email": "E-mail",
    "auth.register.phone": "Numéro de téléphone",
    "auth.register.password": "Mot de passe",
    "auth.register.confirmPassword": "Confirmer le mot de passe",
    "auth.register.showPassword": "Afficher le mot de passe",
    "auth.register.submit": "S'inscrire",
    "auth.register.haveAccount": "Vous avez déjà un compte ?",
  },
  ar: {
    "nav.findDoctors": "ابحث عن طبيب",
    "nav.specialties": "التخصصات",
    "nav.aboutUs": "من نحن",
    "nav.signIn": "تسجيل الدخول",
    "nav.signUp": "إنشاء حساب",
    "nav.adminDashboard": "لوحة تحكم المشرف",
    "nav.doctorDashboard": "لوحة تحكم الطبيب",
    "nav.joinAsDoctor": "انضم كطبيب",
    "nav.logout": "تسجيل الخروج",

    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.privacyPolicy": "سياسة الخصوصية",
    "footer.termsOfService": "شروط الخدمة",
    "footer.status": "حالة النظام",

    "hero.trustBadge": "يثق بنا المرضى",
    "hero.title.pre": "اعثر على",
    "hero.title.highlight": "الطبيب",
    "hero.title.post": "المناسب بسهولة",
    "hero.subtitle":
      "احصل على رعاية صحية عالمية المستوى من منزلك. احجز موعدًا مع أفضل الأخصائيين في دقائق.",
    "hero.searchPlaceholder": "التخصص أو الاسم أو الحالة",
    "hero.locationPlaceholder": "الموقع",
    "hero.searchButton": "بحث",

    "auth.login.title": "مرحبًا بعودتك",
    "auth.login.subtitle": "سجّل الدخول لإدارة مواعيدك",
    "auth.login.email": "البريد الإلكتروني",
    "auth.login.password": "كلمة المرور",
    "auth.login.submit": "تسجيل الدخول",
    "auth.login.noAccount": "ليس لديك حساب؟",
    "auth.login.forgotPassword": "نسيت كلمة المرور؟",
    "auth.login.rememberMe": "تذكرني لمدة 30 يومًا",

    "auth.register.title": "أنشئ حسابك",
    "auth.register.subtitle": "احجز موعدك الأول في دقائق",
    "auth.register.name": "الاسم الكامل",
    "auth.register.email": "البريد الإلكتروني",
    "auth.register.phone": "رقم الهاتف",
    "auth.register.password": "كلمة المرور",
    "auth.register.confirmPassword": "تأكيد كلمة المرور",
    "auth.register.showPassword": "إظهار كلمة المرور",
    "auth.register.submit": "إنشاء حساب",
    "auth.register.haveAccount": "لديك حساب بالفعل؟",
  },
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';

const resources = {
  en: { translation: enTranslation },
  ar: { translation: arTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('drogba-language') || 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

// Apply RTL direction for Arabic
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  localStorage.setItem('drogba-language', lng);
});

// Set initial direction
const currentLang = i18n.language;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLang;

export default i18n;

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    deptName: 'Government of Maharashtra',
    subDept: 'Motor Vehicles Department',
    portalTitle: 'Maharashtra Motor Vehicle Citizen Services',
    academicDisclaimer: 'Academic Demonstration System — Third-Year Computer Engineering Viva Capstone. Not an official government portal.',
    navHome: 'Home',
    navAbout: 'About Department',
    navServices: 'Citizen Services',
    navDrivingLicence: 'Driving Licence',
    navVehicleServices: 'Vehicle Services',
    navRtoOffices: 'RTO Offices',
    navSmartQueue: 'Smart Queue',
    navRoadSafety: 'Road Safety & Games',
    navAnnouncements: 'Announcements',
    navMobileApps: 'Mobile Apps',
    navContact: 'Contact',
    btnBook: 'Book RTO Slot',
    btnTrack: 'Track Live Queue',
    btnExplore: 'Explore Services',
    btnPlayGames: 'Play & Learn Road Safety',
    emergencyHelpline: 'Toll-Free Helpline',
    login: 'Sign In',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Log Out',
    demoCitizen: 'Demo Citizen',
    demoAdmin: 'Demo Admin',
    language: 'Language',
    textResize: 'Text Size',
    highContrast: 'High Contrast',
    announcementsTicker: 'Latest Transport Advisories',
  },
  mr: {
    deptName: 'महाराष्ट्र शासन',
    subDept: 'मोटार वाहन विभाग (परिवहन विभाग)',
    portalTitle: 'महाराष्ट्र मोटार वाहन नागरिक सेवा पोर्टल',
    academicDisclaimer: 'शैक्षणिक प्रात्यक्षिक प्रणाली — संगणक अभियांत्रिकी पदवी प्रकल्प. हे अधिकृत सरकारी संकेतस्थळ नाही.',
    navHome: 'मुख्यपृष्ठ',
    navAbout: 'विभागाबद्दल',
    navServices: 'नागरिक सेवा',
    navDrivingLicence: 'चालक परवाना (DL)',
    navVehicleServices: 'वाहन सेवा (RC)',
    navRtoOffices: 'आरटीओ कार्यालये',
    navSmartQueue: 'स्मार्ट रांग (AI)',
    navRoadSafety: 'रस्ता सुरक्षा व खेळ',
    navAnnouncements: 'सूचना व परिपत्रके',
    navMobileApps: 'मोबाईल ॲप्स',
    navContact: 'संपर्क',
    btnBook: 'आरटीओ वेळ बुक करा',
    btnTrack: 'थेट रांग तपासा',
    btnExplore: 'सर्व सेवा पहा',
    btnPlayGames: 'रस्ता सुरक्षा खेळा व शिका',
    emergencyHelpline: 'टोल-फ्री हेल्पलाईन',
    login: 'लॉग इन',
    register: 'नोंदणी करा',
    dashboard: 'डॅशबोर्ड',
    logout: 'बाहेर पडा',
    demoCitizen: 'डेमो नागरिक',
    demoAdmin: 'डेमो ॲडमिन',
    language: 'भाषा',
    textResize: 'अक्षर आकार',
    highContrast: 'उच्च कॉन्ट्रास्ट',
    announcementsTicker: 'ताज्या परिवहन सूचना',
  },
  hi: {
    deptName: 'महाराष्ट्र शासन',
    subDept: 'मोटर वाहन विभाग (परिवहन विभाग)',
    portalTitle: 'महाराष्ट्र मोटर वाहन नागरिक सेवा पोर्टल',
    academicDisclaimer: 'शैक्षणिक प्रदर्शन प्रणाली — कंप्यूटर इंजीनियरिंग प्रोजेक्ट। यह आधिकारिक सरकारी पोर्टल नहीं है।',
    navHome: 'होम',
    navAbout: 'विभाग के बारे में',
    navServices: 'नागरिक सेवाएं',
    navDrivingLicence: 'ड्राइविंग लाइसेंस',
    navVehicleServices: 'वाहन सेवाएं',
    navRtoOffices: 'आरटीओ कार्यालय',
    navSmartQueue: 'स्मार्ट कतार (AI)',
    navRoadSafety: 'सड़क सुरक्षा व खेल',
    navAnnouncements: 'अधिसूचनाएं',
    navMobileApps: 'मोबाइल ऐप्स',
    navContact: 'संपर्क करें',
    btnBook: 'आरटीओ अपॉइंटमेंट बुक करें',
    btnTrack: 'लाइव कतार देखें',
    btnExplore: 'सभी सेवाएं देखें',
    btnPlayGames: 'सड़क सुरक्षा खेलें और सीखें',
    emergencyHelpline: 'टोल-फ्री हेल्पलाइन',
    login: 'लॉग इन',
    register: 'पंजीकरण करें',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉग आउट',
    demoCitizen: 'डेमो नागरिक',
    demoAdmin: 'डेमो एडमिन',
    language: 'भाषा',
    textResize: 'अक्षर आकार',
    highContrast: 'हाई कॉन्ट्रास्ट',
    announcementsTicker: 'नवीनतम परिवहन सूचनाएं',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('rto_lang') || 'en');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('rto_font_size') || 'md');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('rto_high_contrast') === 'true');

  useEffect(() => {
    localStorage.setItem('rto_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('rto_font_size', fontSize);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('rto_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const changeFontSize = (delta) => {
    if (delta === 'sm') setFontSize('sm');
    else if (delta === 'lg') setFontSize('lg');
    else setFontSize('md');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, fontSize, changeFontSize, highContrast, setHighContrast, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      setLang: () => {},
      fontSize: 'md',
      changeFontSize: () => {},
      highContrast: false,
      setHighContrast: () => {},
      t: (key) => TRANSLATIONS.en[key] || key
    };
  }
  return context;
}

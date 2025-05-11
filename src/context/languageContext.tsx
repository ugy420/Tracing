import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageContextType = {
  language: 'Eng' | 'Dzo';
  setLanguage: (lang: 'Eng' | 'Dzo') => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<'Eng' | 'Dzo'>('Eng');

  useEffect(() => {
    // Load the saved language from AsyncStorage
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage === 'Eng' || savedLanguage === 'Dzo') {
        setLanguageState(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: 'Eng' | 'Dzo') => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang); // Save the language persistently
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

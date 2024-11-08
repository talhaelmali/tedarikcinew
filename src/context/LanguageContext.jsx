import React, { createContext, useContext, useState } from 'react';

// Context oluşturma
const LanguageContext = createContext();

// API ile çeviri fonksiyonu
const translateText = async (text, targetLang) => {
  try {
    const response = await fetch('https://us-central1-functions-test-87bf0.cloudfunctions.net/app/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang }),
    });

    const data = await response.json();
    return data.translatedText; // API'den dönen çeviri metni
  } catch (error) {
    console.error('Translation API error:', error);
    return text; // Hata olursa orijinal metni döndür
  }
};

// Sayfa metin düğümlerini alma fonksiyonu
const getTextNodesIn = (el) => {
  let textNodes = [];
  if (el) {
    for (let node of el.childNodes) {
      if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
        textNodes.push(node);
      } else {
        textNodes = textNodes.concat(getTextNodesIn(node));
      }
    }
  }
  return textNodes;
};

// Sayfa dilini değiştirme fonksiyonu
const handleTranslatePage = async (selectedLang) => {
  const bodyElement = document.querySelector('body');
  const textNodes = getTextNodesIn(bodyElement);

  for (let node of textNodes) {
    const originalText = node.nodeValue.trim();
    const translatedText = await translateText(originalText, selectedLang);
    node.nodeValue = translatedText;
  }
};

// Context sağlayıcı bileşeni
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('tr');

  const translate = async (text, targetLang) => {
    return await translateText(text, targetLang);
  };

  return (
    <LanguageContext.Provider value={{ language, translate, handleTranslatePage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Context'i tüketen hook
export const useLanguage = () => useContext(LanguageContext);

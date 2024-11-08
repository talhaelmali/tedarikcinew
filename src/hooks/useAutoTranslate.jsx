// src/hooks/useAutoTranslate.js
import { useEffect } from 'react';
import axios from 'axios';

// Metni hedef dile çeviren fonksiyon
const translateText = async (text, targetLanguage) => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {},
      {
        params: {
          key: 'AIzaSyD74Ue6rK8znHCHCpYljgG8i5goVlYSBEU', // Google Translate API anahtarınızı buraya ekleyin
          q: text,
          target: targetLanguage,
        },
      }
    );
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);

    // Hata mesajını ayrıntılı bir şekilde göstermek için
    if (error.response) {
      console.error('Error Status:', error.response.status); // Hata durumu
      console.error('Error Data:', error.response.data); // Hata mesajı içeriği
    } else if (error.request) {
      console.error('Request made but no response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }

    // Hata durumunda orijinal metni döndür
    return text;
  }
};

// DOM düğümünü ve alt düğümlerini çeviren fonksiyon
const translateNode = async (node, targetLanguage) => {
  if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
    node.nodeValue = await translateText(node.nodeValue, targetLanguage);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    for (const child of node.childNodes) {
      await translateNode(child, targetLanguage);
    }
  }
};

// useAutoTranslate hook'u, dil değiştiğinde DOM'u çevirir
const useAutoTranslate = (targetLanguage) => {
  useEffect(() => {
    // MutationObserver ile DOM değişikliklerini gözlemle
    const observer = new MutationObserver(async (mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          await translateNode(node, targetLanguage);
        }
      }
    });

    // Observer'ı başlat ve tüm body'yi gözlemle
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Mevcut düğümleri çevir
    translateNode(document.body, targetLanguage);

    // Hook sonlandığında observer'ı durdur
    return () => {
      observer.disconnect();
    };
  }, [targetLanguage]);
};

export default useAutoTranslate;

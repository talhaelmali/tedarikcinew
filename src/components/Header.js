import React, { useState, useEffect } from 'react';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import useLogo from '../hooks/useLogo';
import { useLanguage } from '../context/LanguageContext';
import { auth } from '../firebaseConfig';

const Header = () => {
  const location = useLocation();
  const logoUrl = useLogo();
  const { translate } = useLanguage();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'tr');
  const [loading, setLoading] = useState(false);
  const [originalTextNodes, setOriginalTextNodes] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

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

  const saveOriginalTextNodes = () => {
    const bodyElement = document.querySelector('body');
    const textNodes = getTextNodesIn(bodyElement);
    const originalTexts = textNodes.map((node) => ({
      node,
      originalValue: node.nodeValue.trim(),
    }));
    setOriginalTextNodes(originalTexts);
  };

  const handleTranslatePage = async (selectedLang) => {
    if (selectedLang === 'tr') {
      originalTextNodes.forEach(({ node, originalValue }) => {
        node.nodeValue = originalValue;
      });
      setLanguage('tr');
      localStorage.setItem('language', 'tr');
      return;
    }

    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
    setLoading(true);

    const bodyElement = document.querySelector('body');
    const textNodes = getTextNodesIn(bodyElement);

    for (let node of textNodes) {
      const originalText = node.nodeValue.trim();
      const translatedText = await translate(originalText, selectedLang);
      node.nodeValue = translatedText;
    }

    setLoading(false);
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (!originalTextNodes.length && (!storedLanguage || storedLanguage === 'tr')) {
      saveOriginalTextNodes();
    }
    if (storedLanguage && storedLanguage !== 'tr') {
      handleTranslatePage(storedLanguage);
    }
  }, [originalTextNodes]);

  return (
    <Popover className="relative bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4 lg:px-8">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="/">
            <span className="sr-only">ETedarikçi</span>
            {logoUrl ? (
              <img className="h-8 w-auto sm:h-10" src={logoUrl} alt="Company Logo" />
            ) : (
              <span className="text-xl font-bold text-blue-800">eTedarikçi</span>
            )}
          </a>
        </div>

        <PopoverGroup as="nav" className="hidden space-x-8 md:flex">
          <a href="/" className="text-base font-medium text-gray-500 hover:text-gray-900">
            {language === 'tr' ? 'Anasayfa' : 'Home'}
          </a>
          <a href="/aboutus" className="text-base font-medium text-gray-500 hover:text-gray-900">
            {language === 'tr' ? 'Hakkımızda' : 'About Us'}
          </a>
          <a href="/contactus" className="text-base font-medium text-gray-500 hover:text-gray-900">
            {language === 'tr' ? 'İletişim' : 'Contact'}
          </a>
        </PopoverGroup>

        <div className="flex items-center space-x-4 pl-4">
          <Popover className="relative">
            <PopoverButton className="flex items-center text-gray-700 hover:text-gray-900 text-base font-medium space-x-2">
              {language === 'tr' ? (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                    alt="TR"
                    className="h-5 w-5"
                  />
                  <span>TR</span>
                </>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                    alt="EN"
                    className="h-5 w-5"
                  />
                  <span>EN</span>
                </>
              )}
            </PopoverButton>
            <PopoverPanel className="absolute z-10 mt-2 w-28 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md">
              <button
                onClick={() => handleTranslatePage('en')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language === 'en' ? 'text-blue-600' : 'text-gray-500'
                } hover:text-blue-800`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                    alt="EN"
                    className="h-4 w-4"
                  />
                  <span>English</span>
                </div>
              </button>
              <button
                onClick={() => handleTranslatePage('tr')}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language === 'tr' ? 'text-blue-600' : 'text-gray-500'
                } hover:text-blue-800`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                    alt="TR"
                    className="h-4 w-4"
                  />
                  <span>Türkçe</span>
                </div>
              </button>
            </PopoverPanel>
          </Popover>

          {loading && (
            <div className="ml-4">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          )}

          {user ? (
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              {language === 'tr' ? 'Dashboard' : 'Dashboard'}
            </a>
          ) : (
            <>
              <a href="/login" className="text-base font-medium text-gray-500 hover:text-gray-900">
                {language === 'tr' ? 'Giriş Yap' : 'Login'}
              </a>
              <a
                href="/register"
                className="ml-4 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-[#1CB9C8] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
              >
                {language === 'tr' ? 'Kayıt Ol' : 'Register'}
              </a>
            </>
          )}
        </div>
      </div>
    </Popover>
  );
};

export default Header;

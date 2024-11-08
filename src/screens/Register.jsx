import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Firestore için import
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import useLogo from '../hooks/useLogo'; // useLogo hook'unu import edin
import { useLanguage } from '../context/LanguageContext'; // Dil değişimi için LanguageContext
import { Menu, Transition } from '@headlessui/react'; // Dropdown için gerekli import

const db = getFirestore(); // Firestore instance'ı

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Ad Soyad için state
  const [phone, setPhone] = useState(''); // Telefon numarası için state
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook'u
  const logoUrl = useLogo();
  const { language, handleTranslatePage, setLanguage } = useLanguage(); // Dil çeviri fonksiyonları

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        phone: phone,
        userType: 1, // userType olarak default değer 1
      });

      // Send email verification
      await sendEmailVerification(user);

      swal("Kayıt başarılı", "Başarıyla kayıt oldunuz! Lütfen e-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.", "success").then(() => {
        navigate('/createcompany'); // Kayıt başarılı olduğunda yönlendirme
      });
    } catch (error) {
      // Kullanıcıya gösterilecek hata mesajını set et
      setError(error.message);
      swal("Hata", error.message, "error");
    }
  };

  useEffect(() => {
    if (language !== 'tr') {
      // Eğer dil Türkçe değilse sayfayı çevir
      handleTranslatePage(language);
    }
  }, [language]);

  const handleLanguageChange = (selectedLang) => {
    setLanguage(selectedLang);
    if (selectedLang === 'tr') {
      // Eğer dil Türkçe ise çeviriyi iptal et ve orijinal metinleri göster
      const bodyElement = document.querySelector('body');
      const textNodes = getTextNodesIn(bodyElement);
      textNodes.forEach(node => {
        node.nodeValue = node.originalText; // Orijinal metni geri döndür
      });
    }
  };

  const getTextNodesIn = (el) => {
    let textNodes = [];
    if (el) {
      for (let node of el.childNodes) {
        if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
          textNodes.push(node);
          node.originalText = node.nodeValue; // Orijinal metni sakla
        } else {
          textNodes = textNodes.concat(getTextNodesIn(node));
        }
      }
    }
    return textNodes;
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="flex flex-col justify-center items-start w-full md:w-1/2 bg-white p-8 md:p-32 space-y-8 md:space-y-12">
        <div className="mb-8">
          <a href="/">
            {logoUrl ? (
              <img className="h-8 w-auto sm:h-10" src={logoUrl} alt="Company Logo" />
            ) : (
              <span className="text-xl font-bold text-gray-900">ETedarikçi</span>
            )}
          </a>
        </div>

        {/* Dil Değiştirme Alanı */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
              {language === 'tr' ? (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                    alt="TR"
                    className="h-5 w-5 mr-2"
                  />
                  Türkçe
                </>
              ) : (
                <>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                    alt="EN"
                    className="h-5 w-5 mr-2"
                  />
                  English
                </>
              )}
            </Menu.Button>
          </div>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* Dropdown Menüsünü Sola Daha Yakın Yap */}
            <Menu.Items className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  <button
                    onClick={() => handleLanguageChange('tr')}
                    className={`block px-4 py-2 text-sm ${language === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                        alt="TR"
                        className="h-5 w-5 mr-2"
                      />
                      Türkçe
                    </div>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                        alt="EN"
                        className="h-5 w-5 mr-2"
                      />
                      English
                    </div>
                  </button>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <h2 className="text-3xl font-extrabold text-gray-900">{language === 'tr' ? 'Kayıt Ol' : 'Register'}</h2>
        <form className="w-full max-w-md" onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Ad Soyad' : 'Full Name'}</label>
            <input id="full-name" name="full-name" type="text" autoComplete="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder={language === 'tr' ? 'Ad Soyad' : 'Full Name'} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Telefon Numarası' : 'Phone Number'}</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder={language === 'tr' ? '+90 (555) 987-6543' : '+1 (555) 987-6543'} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'E-Posta' : 'Email'}</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder={language === 'tr' ? 'example@yourcompany.com' : 'example@yourcompany.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="mt-2 text-sm text-gray-500">{language === 'tr' ? 'Kurumsal e-posta adresinizle kaydolmalısınız.' : 'You must register with a corporate email address.'}</p>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Şifre' : 'Password'}</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder={language === 'tr' ? 'Şifre' : 'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded" />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                {language === 'tr' ? 'Kişisel verilerimin kullanım amacı, toplandığı yerler, paylaşıldığı kişiler ve haklarımla ilgili ' : 'I have read about how my personal data will be used, collected, shared, and my rights.'}
                <a href="#" className="text-[#2563EB] hover:text-[#2563EB]">{language === 'tr' ? 'bilgilendirmeyi' : 'details'}</a> {language === 'tr' ? 'okudum.' : '.'}
              </label>
            </div>
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]">
            {language === 'tr' ? 'Kayıt Ol' : 'Register'}
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Image.png?alt=media&token=62e9d003-c01f-4e17-a61a-ea915caaef96')" }}></div>
    </div>
  );
}

export default Register;

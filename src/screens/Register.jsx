import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import useLogo from '../hooks/useLogo';
import { useLanguage } from '../context/LanguageContext';
import { Menu, Transition } from '@headlessui/react';

const db = getFirestore();

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();
    const logoUrl = useLogo();
    const { language, handleTranslatePage, setLanguage } = useLanguage();

    const getErrorMessage = (errorCode) => {
        const errorMessages = {
            'auth/invalid-email': 'Geçersiz e-posta adresi.',
            'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
            'auth/weak-password': 'Şifre çok zayıf, lütfen daha güçlü bir şifre kullanın.',
            'auth/operation-not-allowed': 'Bu işlem şu anda izin verilmiyor.',
            'auth/invalid-phone-number': 'Geçersiz telefon numarası.',
            'auth/network-request-failed': 'Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
            'auth/user-disabled': 'Bu kullanıcı hesabı devre dışı bırakılmış.',
            'auth/user-not-found': 'E-posta adresi bulunamadı.',
            'auth/wrong-password': 'E-posta veya şifre yanlış.',
            'auth/too-many-requests': 'Çok fazla giriş denemesi yapıldı. Lütfen bir süre sonra tekrar deneyin.',
            'auth/account-exists-with-different-credential': 'Bu e-posta adresi farklı bir kimlik bilgisiyle zaten kullanılıyor.',
            'auth/credential-already-in-use': 'Bu kimlik bilgisi zaten başka bir hesapta kullanılıyor.',
            'auth/invalid-verification-code': 'Geçersiz doğrulama kodu.',
            'auth/invalid-verification-id': 'Geçersiz doğrulama kimliği.',
            'auth/requires-recent-login': 'Bu işlemi gerçekleştirmek için tekrar giriş yapmanız gerekiyor.',
            'auth/user-token-expired': 'Kullanıcı oturumu süresi doldu, lütfen tekrar giriş yapın.',
            'auth/popup-closed-by-user': 'Giriş penceresi kullanıcı tarafından kapatıldı.',
            'auth/cancelled-popup-request': 'Önceki oturum açma işlemi devam ediyor.',
            'auth/popup-blocked': 'Tarayıcınız açılır pencereyi engelledi.',
            'auth/app-not-authorized': 'Bu uygulama kimlik doğrulama kullanmak için yetkilendirilmemiş.',
            'auth/unauthorized-domain': 'Bu alan adı, kimlik doğrulama işlemi için yetkilendirilmemiş.',
            'auth/invalid-api-key': 'Geçersiz API anahtarı.',
            'auth/app-deleted': 'Uygulama Firebase projesinden silindi.',
            'auth/invalid-user-token': 'Geçersiz kullanıcı oturumu. Lütfen tekrar giriş yapın.',
            'auth/user-mismatch': 'Bu kimlik bilgisi farklı bir kullanıcıya ait.',
            'auth/session-cookie-expired': 'Oturum çerezi süresi doldu. Lütfen tekrar giriş yapın.',
            'auth/invalid-credential': 'Geçersiz kimlik bilgileri.',
            'auth/quota-exceeded': 'Kimlik doğrulama kotası aşıldı. Lütfen daha sonra tekrar deneyin.',
            'auth/unverified-email': 'E-posta doğrulanmadı. Lütfen e-postanızı doğrulayın.',
            'auth/expired-action-code': 'Bu işlem kodunun süresi doldu.',
            'auth/invalid-action-code': 'Geçersiz işlem kodu.',
            'auth/invalid-message-payload': 'Geçersiz mesaj içerik yapısı.',
            'auth/email-change-needs-verification': 'E-posta değişikliği için doğrulama gerekli.',
            'auth/invalid-continue-uri': 'Geçersiz devam bağlantısı URI’si.',
            'auth/missing-continue-uri': 'Devam bağlantısı URI’si eksik.',
            'auth/invalid-provider-id': 'Geçersiz sağlayıcı kimliği.',
            'auth/invalid-recipient-email': 'Geçersiz alıcı e-posta adresi.',
            'auth/invalid-sender': 'Geçersiz gönderici adresi.',
            'auth/missing-android-pkg-name': 'Android paket ismi eksik.',
            'auth/missing-continue-uri': 'Devam URI’si eksik.',
            'auth/missing-ios-bundle-id': 'iOS paket kimliği eksik.',
            'auth/unauthorized-continue-uri': 'Devam bağlantısı yetkili değil.',
            'auth/invalid-tenant-id': 'Geçersiz kiracı kimliği.',
            'auth/multi-factor-auth-required': 'Çok faktörlü kimlik doğrulama gerekli.',
            'auth/maximum-second-factor-count-exceeded': 'İzin verilen en fazla ikinci faktör sayısına ulaşıldı.',
            'auth/unsupported-first-factor': 'Desteklenmeyen birincil faktör.',
            'auth/unsupported-persistence-type': 'Desteklenmeyen devamlılık türü.',
            'auth/timeout': 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
            'auth/missing-multi-factor-info': 'Çok faktörlü kimlik doğrulama bilgisi eksik.',
            'auth/invalid-multi-factor-session': 'Geçersiz çok faktörlü oturum.',
            'auth/missing-multi-factor-session': 'Çok faktörlü oturum eksik.',
            'auth/missing-phone-info': 'Telefon bilgisi eksik.',
            'auth/unverified-application': 'Uygulama doğrulanmadı.',
        };
        return errorMessages[errorCode] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        if (!termsAccepted) {
            setError(language === 'tr' ? 'Lütfen koşulları kabul edin.' : 'Please accept the terms.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: fullName });

            await setDoc(doc(db, "users", user.uid), {
                fullName,
                email,
                phone,
                userType: 1
            });

            await sendEmailVerification(user);

            swal("Kayıt başarılı", "Başarıyla kayıt oldunuz! Lütfen e-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.", "success").then(() => {
                navigate('/createcompany');
            });
        } catch (error) {
            setError(getErrorMessage(error.code));
            swal("Hata", getErrorMessage(error.code), "error");
        }
    };

    useEffect(() => {
        if (language !== 'tr') {
            handleTranslatePage(language);
        }
    }, [language]);

    const handleLanguageChange = (selectedLang) => {
        setLanguage(selectedLang);
        if (selectedLang === 'tr') {
            const bodyElement = document.querySelector('body');
            const textNodes = getTextNodesIn(bodyElement);
            textNodes.forEach(node => {
                node.nodeValue = node.originalText;
            });
        }
    };

    const getTextNodesIn = (el) => {
        let textNodes = [];
        if (el) {
            for (let node of el.childNodes) {
                if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
                    textNodes.push(node);
                    node.originalText = node.nodeValue;
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

                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700">
                            {language === 'tr' ? (
                                <>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" alt="TR" className="h-5 w-5 mr-2" />
                                    Türkçe
                                </>
                            ) : (
                                <>
                                    <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="EN" className="h-5 w-5 mr-2" />
                                    English
                                </>
                            )}
                        </Menu.Button>
                    </div>

                    <Transition as={React.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <Menu.Items className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    <button onClick={() => handleLanguageChange('tr')} className={`block px-4 py-2 text-sm ${language === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                                        <div className="flex items-center">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" alt="TR" className="h-5 w-5 mr-2" />
                                            Türkçe
                                        </div>
                                    </button>
                                </Menu.Item>
                                <Menu.Item>
                                    <button onClick={() => handleLanguageChange('en')} className={`block px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                                        <div className="flex items-center">
                                            <img src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" alt="EN" className="h-5 w-5 mr-2" />
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
                        <input id="full-name" name="full-name" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder={language === 'tr' ? 'Ad Soyad' : 'Full Name'} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Telefon Numarası' : 'Phone Number'}</label>
                        <input id="phone" name="phone" type="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder={language === 'tr' ? '+90 (555) 987-6543' : '+1 (555) 987-6543'} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'E-Posta' : 'Email'}</label>
                        <input id="email-address" name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder={language === 'tr' ? 'example@yourcompany.com' : 'example@yourcompany.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <p className="mt-2 text-sm text-gray-500">{language === 'tr' ? 'Kurumsal e-posta adresinizle kaydolmalısınız.' : 'You must register with a corporate email address.'}</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Şifre' : 'Password'}</label>
                        <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder={language === 'tr' ? 'Şifre' : 'Password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                            <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-[#2563EB] border-gray-300 rounded" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                        </div>
                        <div className="ml-2 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-700">
                                {language === 'tr' ? 'Kişisel verilerimin kullanım amacı, toplandığı yerler, paylaşıldığı kişiler ve haklarımla ilgili ' : 'I have read about how my personal data will be used, collected, shared, and my rights.'}
                                <a href="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/CADERK%20LTD.%20S%CC%A7TI%CC%87.-%20U%CC%88YELI%CC%87K%20SO%CC%88ZLES%CC%A7ME.docx?alt=media&token=a8c54436-3d1a-4da6-80f2-b6be64457732" className="text-[#2563EB] hover:text-[#2563EB]">{language === 'tr' ? 'bilgilendirmeyi' : 'details'}</a> {language === 'tr' ? 'okudum.' : '.'}
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB]">
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

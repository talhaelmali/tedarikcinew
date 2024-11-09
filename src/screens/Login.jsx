import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import useLogo from '../hooks/useLogo';
import { useLanguage } from '../context/LanguageContext';
import { Menu, Transition } from '@headlessui/react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const logoUrl = useLogo();
    const { language, handleTranslatePage, setLanguage } = useLanguage();

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

    // Firebase error message mapping for custom Turkish messages
const getErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/invalid-email': 'Geçersiz e-posta adresi.',
        'auth/user-disabled': 'Bu kullanıcı hesabı devre dışı bırakılmış.',
        'auth/user-not-found': 'E-posta adresi bulunamadı.',
        'auth/wrong-password': 'E-posta veya şifre yanlış.',
        'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
        'auth/operation-not-allowed': 'Bu işlem şu anda izin verilmiyor.',
        'auth/weak-password': 'Şifre çok zayıf, lütfen daha güçlü bir şifre kullanın.',
        'auth/invalid-credential': 'Geçersiz kimlik bilgileri.',
        'auth/account-exists-with-different-credential': 'Bu e-posta adresi farklı bir kimlik bilgisiyle zaten kullanılıyor.',
        'auth/invalid-verification-code': 'Geçersiz doğrulama kodu.',
        'auth/invalid-verification-id': 'Geçersiz doğrulama kimliği.',
        'auth/requires-recent-login': 'Bu işlemi gerçekleştirmek için tekrar giriş yapmanız gerekiyor.',
        'auth/credential-already-in-use': 'Bu kimlik bilgisi zaten başka bir hesapta kullanılıyor.',
        'auth/invalid-password': 'Geçersiz şifre.',
        'auth/user-token-expired': 'Kullanıcı oturumu süresi doldu, lütfen tekrar giriş yapın.',
        'auth/network-request-failed': 'Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
        'auth/too-many-requests': 'Çok fazla giriş denemesi yapıldı. Lütfen bir süre sonra tekrar deneyin.',
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
        'auth/invalid-phone-number': 'Geçersiz telefon numarası.',
        'auth/missing-phone-number': 'Telefon numarası eksik.',
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


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            swal("Giriş başarılı", "Başarıyla giriş yaptınız!", "success");

            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            navigate('/dashboard');
        } catch (error) {
            swal("Hata", getErrorMessage(error.code), "error");
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            swal("Başarılı", "Şifre sıfırlama e-postası gönderildi!", "success");
            setShowModal(false);
        } catch (error) {
            swal("Hata", getErrorMessage(error.code), "error");
        }
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

                {/* Language Switcher */}
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
                        {/* Dropdown Menu */}
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

                <h2 className="text-3xl font-extrabold text-gray-900">{language === 'tr' ? 'Giriş Yap' : 'Login'}</h2>
                <form className="w-full max-w-md" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'E-Posta' : 'Email'}</label>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            autoComplete="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{language === 'tr' ? 'Şifre' : 'Password'}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                {language === 'tr' ? 'Beni hatırla' : 'Remember me'}
                            </label>
                        </div>
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => setShowModal(true)}
                                className="font-medium text-[#2563EB] hover:text-[#2563EB]"
                            >
                                {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot password?'}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
                    >
                        {language === 'tr' ? 'Giriş Yap' : 'Login'}
                    </button>
                    <div className="text-center mt-4">
                        <a
                            href="/register"
                            className="text-sm font-medium text-[#2563EB] hover:text-[#2563EB]"
                        >
                            {language === 'tr' ? 'Henüz üye değil misin? Kayıt Ol' : 'Not a member yet? Register'}
                        </a>
                    </div>
                </form>
            </div>
            <div
                className="hidden md:block md:w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Decorative%20image.png?alt=media&token=67fa7b3c-0e62-4fff-b57e-81bd5b8ecfe6')",
                }}
            ></div>

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password'}
                            </h2>
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                                        {language === 'tr' ? 'E-Posta' : 'Email'}
                                    </label>
                                    <input
                                        id="resetEmail"
                                        name="resetEmail"
                                        type="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="mr-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                        onClick={() => setShowModal(false)}
                                    >
                                        {language === 'tr' ? 'İptal' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]"
                                    >
                                        {language === 'tr' ? 'Şifreyi Sıfırla' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;

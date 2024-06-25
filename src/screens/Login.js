import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import swal from 'sweetalert';
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const Logo = 'Logo.png';

    const handleLogin = async (event) => {
        event.preventDefault();
  
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Giriş başarılı:", userCredential.user);
            swal("Giriş başarılı", "Başarıyla giriş yaptınız!", "success");

            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            // Giriş başarılı ise, kullanıcıyı anasayfaya yönlendir veya başka bir işlem yap
        } catch (error) {
            swal("Hata", error.message, "error");
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            swal("Başarılı", "Şifre sıfırlama e-postası gönderildi!", "success");
            setShowModal(false);
        } catch (error) {
            swal("Hata", error.message, "error");
        }
    };

    return (
        <div className="flex h-screen flex-col md:flex-row">
            <div className="flex flex-col justify-center items-start w-full md:w-1/2 bg-white p-8 md:p-32 space-y-8 md:space-y-12">
                <div className="mb-8">
                    <img src={Logo} alt="Logo" className="w-40 md:w-48" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Giriş Yap</h2>
                <form className="w-full max-w-md" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Posta</label>
                        <input id="email" name="email" type="text" autoComplete="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"  value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm"  value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Beni hatırla</label>
                        </div>
                        <div className="text-sm">
                            <button type="button" onClick={() => setShowModal(true)} className="font-medium text-[#2563EB] hover:text-[#2563EB]">Şifremi Unuttum</button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <ReCAPTCHA
                            sitekey="YOUR_RECAPTCHA_SITE_KEY"  // reCAPTCHA site key'inizi buraya ekleyin
                            onChange={value => setRecaptchaValue(value)}
                        />
                    </div>
                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]">
                        Giriş Yap
                    </button>
                    <div className="text-center mt-4">
                        <a href="/register" className="text-sm font-medium text-[#2563EB] hover:text-[#2563EB]">Henüz üye değil misin? Kayıt Ol</a>
                    </div>
                </form>
            </div>
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Decorative%20image.png?alt=media&token=67fa7b3c-0e62-4fff-b57e-81bd5b8ecfe6')" }}></div>

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
                            <h2 className="text-2xl font-bold mb-4">Şifremi Unuttum</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">E-Posta</label>
                                    <input id="resetEmail" name="resetEmail" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="mr-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" onClick={() => setShowModal(false)}>İptal</button>
                                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]">Şifreyi Sıfırla</button>
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

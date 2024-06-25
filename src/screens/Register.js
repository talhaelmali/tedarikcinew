import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Firestore için import
import swal from 'sweetalert';

const db = getFirestore(); // Firestore instance'ı

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Ad Soyad için state
  const [phone, setPhone] = useState(''); // Telefon numarası için state
  const [error, setError] = useState('');
  const Logo = 'Logo.png';

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

      console.log("Kayıt başarılı, profil güncellendi:", user.displayName);
      swal("Kayıt başarılı", "Başarıyla kayıt oldunuz!", "success");
    } catch (error) {
      // Kullanıcıya gösterilecek hata mesajını set et
      setError(error.message);
      swal("Hata", error.message, "error");
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="flex flex-col justify-center items-start w-full md:w-1/2 bg-white p-8 md:p-32 space-y-8 md:space-y-12">
        <div className="mb-8">
          <img src={Logo} alt="Logo" className="w-40 md:w-48" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Kayıt Ol</h2>
        <form className="w-full max-w-md" onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input id="full-name" name="full-name" type="text" autoComplete="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder="+90 (555) 987-6543" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">E-Posta</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder="example@yourcompany.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="mt-2 text-sm text-gray-500">Kurumsal e-posta adresinizle kaydolmalısınız.</p>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-gray-300 rounded" />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                Kişisel verilerimin kullanım amacı, toplandığı yerler, paylaşıldığı kişiler ve haklarımla ilgili <a href="#" className="text-[#2563EB] hover:text-[#2563EB]">bilgilendirmeyi</a> okudum.
              </label>
            </div>
          </div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563EB] hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]">
            Kayıt Ol
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Image.png?alt=media&token=62e9d003-c01f-4e17-a61a-ea915caaef96')" }}></div>
    </div>
  );
}

export default Register;

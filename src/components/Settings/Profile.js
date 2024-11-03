import React, { useState, useEffect } from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig';
import swal from 'sweetalert';
import { useNavigate, NavLink } from 'react-router-dom';

function Profile() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');

  const navigate = useNavigate();
  const auth = getAuth();

  // Firebase'den kullanıcı bilgilerini çekme
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setFullName(user.displayName || '');
        setEmail(user.email || '');
        setNewEmail(user.email || ''); // newEmail de user.email ile başlatıldı

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPhone(docSnap.data().phone || '');
          } else {
            console.log("Belge bulunamadı!");
          }
        } catch (error) {
          console.error("Telefon numarası alınırken hata oluştu: ", error);
        }

        setLoading(false);
      } else {
        setLoading(false);
        swal("Oturum açılmadı", "Profil sayfasını görüntülemek için giriş yapmalısınız.", "error").then(() => {
          navigate('/login');
        });
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  // Profili kaydetme işlemi
  const handleSave = async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      swal("Hata", "Kullanıcı oturumu bulunamadı.", "error");
      return;
    }

    try {
      // Firebase Authentication'da displayName (ad soyad) güncellemesi
      if (fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName }); // Firebase Authentication'daki displayName güncelleniyor
      }

      // Şifre güncelleme
      if (newPassword && newPassword === confirmPassword) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential); // Yeniden kimlik doğrulama
        await updatePassword(user, newPassword); // Yeni şifreyi güncelle
        swal("Başarılı", "Şifreniz güncellendi.", "success");
      }

      // Firestore'da fullName ve phone güncellemesi
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        fullName: fullName, // Güncellenen isim
        phone: phone        // Güncellenen telefon
      }, { merge: true });   // Mevcut verilerle birleştir

      // Başarılı mesaj göster ve sayfayı yenile
      swal("Başarılı", "Profil bilgileriniz güncellendi!", "success").then(() => {
        window.location.reload(); // Sayfayı yenile
      });

    } catch (error) {
      console.error("Profil güncellenirken hata oluştu: ", error);
      swal("Hata", error.message, "error");
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="pb-8">
      <nav className="flex border-b border-gray-200 mb-6">
        <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Profil
        </NavLink>
        <NavLink to="/my-company" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Firma Bilgileri
        </NavLink>
        <NavLink to="/teammembers" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Ekip Üyeleri
        </NavLink>
      </nav>

      <h2 className="text-2xl font-bold mb-6">Profil</h2>
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input id="full-name" name="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
            <input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Posta</label>
            <input id="email" name="email" type="email" value={email} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed" />
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6 mb-4">Şifre Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700">Eski Şifre</label>
            <input id="old-password" name="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
            <input id="new-password" name="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Yeni Şifre Tekrar</label>
            <input id="confirm-password" name="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Kaydet</button>
        </div>
      </form>
    </div>
  );
}

export default Profile;

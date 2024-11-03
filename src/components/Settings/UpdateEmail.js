import React, { useState } from 'react';
import { getAuth, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';
import swal from 'sweetalert';

const UpdateEmail = () => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      swal("Hata", "Kullanıcı oturumu bulunamadı", "error");
      return;
    }

    try {
      setLoading(true);
      console.log('Kimlik doğrulama işlemi başlatılıyor...');

      // Kullanıcıyı yeniden kimlik doğrulama
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log('Kimlik doğrulama başarılı.');

      // Eski e-posta doğrulaması yapılmamışsa, doğrulama e-postası gönder
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        console.log('Eski e-posta adresine doğrulama gönderildi.');
        swal("E-posta Doğrulaması Gerekiyor", "Eski e-posta adresinize bir doğrulama e-postası gönderildi. Lütfen önce bu e-postayı doğrulayın.", "warning");
        return; // Eski e-posta doğrulaması yapılmadan devam edilmez
      }

      // Yeni e-posta doğrulaması ve güncellemesi
      await updateEmail(user, newEmail);
      console.log('Yeni e-posta başarıyla güncellendi: ', newEmail);

      // Yeni e-posta adresine doğrulama e-postası gönder
      await sendEmailVerification(user);
      console.log('Yeni e-posta adresine doğrulama e-postası gönderildi.');
      
      // Başarı mesajı ve işlem tamamlama
      swal("Başarılı", `E-posta adresi güncellendi! Lütfen ${newEmail} adresine gönderilen doğrulama bağlantısına tıklayın.`, "success");
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        console.error('Kimlik doğrulama gerekli:', error);
        swal("Hata", "Güvenlik nedeniyle tekrar giriş yapmanız gerekiyor.", "error");
      } else if (error.code === 'auth/invalid-email') {
        console.error('Geçersiz e-posta:', error);
        swal("Hata", "Geçersiz bir e-posta adresi girdiniz.", "error");
      } else if (error.code === 'auth/email-already-in-use') {
        console.error('E-posta zaten kullanımda:', error);
        swal("Hata", "Bu e-posta adresi zaten kullanımda.", "error");
      } else if (error.code === 'auth/operation-not-allowed') {
        console.error('E-posta değişikliği yapılamıyor:', error);
        swal("Hata", "Bu işlem şu anda izinli değil. Lütfen admin ile iletişime geçin.", "error");
      } else {
        console.error('E-posta güncellenirken bir hata oluştu:', error);
        swal("Hata", error.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>E-posta Güncelle</h2>
      <form onSubmit={handleEmailUpdate}>
        <div>
          <label htmlFor="newEmail">Yeni E-posta</label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Güncelleniyor...' : 'E-posta Güncelle'}
        </button>
      </form>
    </div>
  );
};

export default UpdateEmail;

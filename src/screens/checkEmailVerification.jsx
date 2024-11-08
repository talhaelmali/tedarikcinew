import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import swal from 'sweetalert';

const CheckEmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const user = auth.currentUser;

      if (user) {
        setUserExists(true);  // User is found
        try {
          // Reload the user data to get the latest verification status
          await user.reload();

          if (user.emailVerified) {
            setIsVerified(true);
            swal("Doğrulama Başarılı", "E-posta adresiniz doğrulandı!", "success");
          } else {
            setIsVerified(false);
            swal("Doğrulama Gerekli", "E-posta adresiniz henüz doğrulanmamış. Lütfen e-posta gelen kutunuzu kontrol edin.", "warning");
          }
        } catch (error) {
          console.error("Error checking verification:", error);
          swal("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.", "error");
        }
      } else {
        setUserExists(false);  // No user found
      }

      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      checkVerification();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!userExists) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-red-600">Kullanıcı oturumu bulunamadı. Lütfen giriş yapın.</h2>
      </div>
    );
  }

  return (
    <div>
      {isVerified ? (
        <h2 className="text-2xl font-bold text-green-600">E-posta adresiniz doğrulandı!</h2>
      ) : (
        <h2 className="text-2xl font-bold text-red-600">E-posta adresiniz henüz doğrulanmadı.</h2>
      )}
    </div>
  );
};

export default CheckEmailVerification;

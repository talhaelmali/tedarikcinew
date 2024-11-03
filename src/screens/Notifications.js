import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useCompany } from '../context/CompanyContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Zaman farkını hesaplayan fonksiyon
const formatTimeDifference = (timestamp) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return '1 dakikadan daha az';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} dakika önce`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} saat önce`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} gün önce`;
  } else {
    return '1 ay veya daha eski';
  }
};

const Notifications = () => {
  const { company, loading } = useCompany(); // Şirket ve yüklenme durumunu alıyoruz
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!company) {
        console.log('Şirket bilgisi henüz yüklenmedi veya mevcut değil.');
        return;
      }

      const db = getFirestore();

      try {
        console.log(`Bildirimler çekiliyor...`);
        console.log(`Şirket ID: ${company.id}`);

        // Bildirimleri sorguluyoruz, okunmamışları öne alıp, zaman sıralaması yapıyoruz
        const q = query(
          collection(db, 'notifications'),
          where('companyId', '==', company.id),
          orderBy('read'), // Okunmamış olanlar önce geliyor
          orderBy('timestamp', 'desc') // Tarih olarak yeniden eskiye sıralıyoruz
        );
        const querySnapshot = await getDocs(q);
        console.log(`Sorgu tamamlandı. ${querySnapshot.size} adet bildirim bulundu.`);

        const fetchedNotifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Bildirimler çekilirken hata oluştu:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    if (!loading && company) {
      fetchNotifications();
    }
  }, [company, loading]);

  if (loading || loadingNotifications) {
    console.log('Yükleniyor: Şirket bilgisi veya bildirimler henüz yüklenmedi...');
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // Bildirimi okundu olarak işaretleme ve rotaya yönlendirme
  const handleNotificationClick = async (notification) => {
    const db = getFirestore();
    const notificationRef = doc(db, 'notifications', notification.id);

    try {
      // Bildirim okundu olarak işaretleniyor
      await updateDoc(notificationRef, { read: true });

      // Lokal durumu güncelle
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notification.id ? { ...notif, read: true } : notif
        )
      );

      // Eğer rotası varsa kullanıcıyı yönlendir
      if (notification.route) {
        navigate(notification.route);
      } else {
        console.log('Bu bildirimin bir yönlendirme rotası yok.');
      }
    } catch (error) {
      console.error('Bildirim işaretlenirken hata oluştu:', error);
      Swal.fire('Hata', 'Bildirim işaretlenirken bir hata oluştu.', 'error');
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Şirket Bildirimleri</h2>
      {unreadCount > 0 ? (
        <p className="text-lg mb-4 text-red-600 font-semibold">{unreadCount} adet okunmamış bildiriminiz var.</p>
      ) : (
        <p className="text-lg mb-4 text-green-600 font-semibold">Tüm bildirimler okundu.</p>
      )}

      {notifications.length === 0 ? (
        <p className="text-gray-600">Hiç bildirim yok.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              onClick={() => handleNotificationClick(notification)} // Bildirime tıklandığında ilgili rotaya git ve okundu işaretle
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border hover:bg-gray-100 transition cursor-pointer" // Tıklanabilirlik için cursor-pointer
            >
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-gray-800">{notification.message}</h4>
                <span className="text-sm text-gray-500">
                  {formatTimeDifference(new Date(notification.timestamp?.seconds * 1000))}
                </span>
              </div>
              <div className="ml-4 text-sm text-gray-500">
                {notification.read ? (
                  <span className="text-green-600">Okundu</span>
                ) : (
                  <span className="text-red-600">Okunmadı</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;

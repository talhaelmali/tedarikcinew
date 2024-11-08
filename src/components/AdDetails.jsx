import React, { useEffect, useState } from 'react';
import { collection, doc, getFirestore, onSnapshot, getDocs, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { useCompany } from '../context/CompanyContext';
import BidList from './BidList'; 
import { StarIcon as FilledStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import EditAdModal from './EditAdModal'; // Düzenleme modal bileşeni

dayjs.extend(relativeTime);
dayjs.extend(duration);
Modal.setAppElement('#root');

const db = getFirestore();
const auth = getAuth();

const AdDetails = () => {
  const { companyId, adId } = useParams();
  const { company } = useCompany();
  const [adData, setAdData] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bidderRatings, setBidderRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [adOwnerCompany, setAdOwnerCompany] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserAdminOrMember, setIsUserAdminOrMember] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Düzenleme modali kontrol state
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      fetchFollowingStatus(); // Şirket yüklendiğinde takip durumu kontrol ediliyor.
    }
  }, [company, adId]);

  useEffect(() => {
    if (!loading && adData) {
      const isExpired = adData.endDate && dayjs().isAfter(dayjs(adData.endDate.seconds * 1000));
      
      if (isExpired && adOwnerCompany?.id !== company?.id) {
        Swal.fire({
          icon: 'info',
          title: 'İlan Süresi Doldu',
          text: 'Bu ilan süresi dolduğu için artık görüntülenemiyor.',
        }).then(() => {
          navigate('/ads');
        });
      }
    }
  }, [adData, loading, adOwnerCompany, company, navigate]);
  
  const fetchFollowingStatus = () => {
    if (company?.FollowedAds && company.FollowedAds.includes(adId)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const adRef = doc(db, 'companies', companyId, 'ads', adId);
    const unsubscribeAd = onSnapshot(adRef, async (doc) => {
      setAdData(doc.exists() ? doc.data() : null);
      setLoading(false);

      if (doc.exists()) {
        const bidsRef = collection(db, 'companies', companyId, 'ads', adId, 'bids');
        const bidsSnapshot = await getDocs(bidsRef);
        const bidsList = bidsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const newBidderRatings = {};
        const mainCompanyRating = await fetchRatings(companyId);
        newBidderRatings[companyId] = mainCompanyRating;

        for (const bid of bidsList) {
          const bidderRating = await fetchRatings(bid.bidderCompanyId);
          newBidderRatings[bid.bidderCompanyId] = bidderRating;
        }

        setBids(bidsList);
        setBidderRatings(newBidderRatings);
      }
    });

    const fetchAdOwnerCompany = async () => {
      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyRef);
      
      if (companyDoc.exists()) {
        setAdOwnerCompany({ id: companyDoc.id, ...companyDoc.data() });
    
        if (currentUser) {
          const isAdmin = companyDoc.data().adminUserId === currentUser.uid;
          setIsUserAdmin(isAdmin);
    
          setIsUserAdminOrMember(companyDoc.data().adminUserId === currentUser.uid || company?.id === companyId);
        }
      }
    };

    fetchAdOwnerCompany();
    fetchFollowingStatus();

    return () => unsubscribeAd();
  }, [adId, companyId, currentUser]);

  const fetchRatings = async (companyId) => {
    const ratingsRef = collection(db, 'companies', companyId, 'ratings');
    const ratingsSnapshot = await getDocs(ratingsRef);

    if (!ratingsSnapshot.empty) {
      let totalRating = 0;
      let ratingCount = 0;

      ratingsSnapshot.forEach((doc) => {
        const data = doc.data();
        const average = (data.communication + data.quality + data.speed) / 3;
        totalRating += average;
        ratingCount++;
      });

      return (totalRating / ratingCount).toFixed(1);
    } else {
      return null;
    }
  };

  const handleBidClick = () => {
    if (!adData || adData.status === 'approved' || (adData.endDate && dayjs().isAfter(dayjs(adData.endDate.seconds * 1000)))) {
      return;
    }
    navigate(`/ad-details/${companyId}/${adId}/bid`);
  };

  const handleAcceptBid = async (bidId, bidderCompanyId, bidderCompanyName) => {
    const confirm = await Swal.fire({
      title: 'Teklifi kabul etmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, kabul et!',
      cancelButtonText: 'Hayır, iptal et'
    });

    if (confirm.isConfirmed) {
      try {
        const bidRef = doc(db, 'companies', companyId, 'ads', adId, 'bids', bidId);
        const adRef = doc(db, 'companies', companyId, 'ads', adId);

        const bidSnap = await getDoc(bidRef);
        const adSnap = await getDoc(adRef);

        if (!bidSnap.exists() || !adSnap.exists()) {
          throw new Error('Teklif veya ilan verisi bulunamadı.');
        }

        const bidData = bidSnap.data();
        const adData = adSnap.data();

        const orderData = {
          ad: { ...adData },
          bid: { ...bidData },
          companyId,
          bidderCompanyId,
          orderDate: new Date()
        };

        // Kabul edilen teklifi orders koleksiyonuna ekle
        await addDoc(collection(db, 'orders'), orderData);

        // İlan ve teklifleri sil
        await deleteDoc(adRef);
        await deleteDoc(bidRef);

        Swal.fire('Başarılı!', 'Teklif kabul edildi ve ilan kapatıldı.', 'success');

        // Başarılı işlem sonrası /myorders rotasına yönlendir
        navigate('/myorders');
      } catch (error) {
        Swal.fire('Hata!', `Teklif kabul edilirken bir hata oluştu: ${error.message}`, 'error');
      }
    }
  };

  // İlanı silme işlemi
  const handleDeleteAd = async () => {
    const confirm = await Swal.fire({
      title: 'İlanı silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'Hayır, iptal et'
    });

    if (confirm.isConfirmed) {
      try {
        const adRef = doc(db, 'companies', companyId, 'ads', adId);
        await deleteDoc(adRef);
        Swal.fire('Başarılı!', 'İlan başarıyla silindi.', 'success');
        navigate('/dashboard');
      } catch (error) {
        Swal.fire('Hata!', `İlan silinirken bir hata oluştu: ${error.message}`, 'error');
      }
    }
  };

  const handleFollowAd = async () => {
    try {
      const companyRef = doc(db, 'companies', company.id);
      await updateDoc(companyRef, {
        FollowedAds: arrayUnion(adId),
      });
      setIsFollowing(true);
      Swal.fire({
        title: 'Başarılı!',
        text: 'İlan takibe alındı!',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Error following ad:', error);
      Swal.fire('Hata!', 'İlan takibe alınamadı.', 'error');
    }
  };

  const handleUnfollowAd = async () => {
    try {
      const companyRef = doc(db, 'companies', company.id);
      await updateDoc(companyRef, {
        FollowedAds: arrayRemove(adId),
      });
      setIsFollowing(false);
      Swal.fire({
        title: 'Başarılı!',
        text: 'İlan takibi kaldırıldı!',
        icon: 'success',
        confirmButtonText: 'Tamam'
      });
    } catch (error) {
      console.error('Error unfollowing ad:', error);
      Swal.fire('Hata!', 'İlan takibi kaldırılamadı.', 'error');
    }
  };

  // Düzenleme modali açma
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const renderImages = (images) => {
    if (!images) return <p className="text-sm text-gray-500">Yüklenen fotoğraf yok.</p>;
  
    if (typeof images === 'string') {
      return <img src={images} alt="Ad Image" className="h-24 w-24 object-cover cursor-pointer" onClick={() => setSelectedImage(images)} />;
    }
  
    if (Array.isArray(images)) {
      return images.map((image, index) => (
        <img key={index} src={image} alt={`Görsel ${index + 1}`} className="h-24 w-24 object-cover cursor-pointer" onClick={() => setSelectedImage(image)} />
      ));
    }
  
    return null;
  };
  

  const closeModal = () => setSelectedImage(null);

  const maskCompanyName = (name) => {
    return name.split(' ').map((word) => (word.length > 1 ? word[0] + '*'.repeat(word.length - 1) : word)).join(' ');
  };

  if (loading || !adData) {
    return <div>Loading...</div>;
  }

  const calculateEndDate = (startDate, duration) => {
    if (!startDate || !duration) return null;
    const date = new Date(startDate.seconds * 1000);
    date.setDate(date.getDate() + parseInt(duration));
    return date;
  };

  const calculateRemainingTime = (endDate) => {
    if (!endDate) return 'Bilinmiyor';
    const now = dayjs();
    const end = dayjs(endDate.seconds ? endDate.seconds * 1000 : endDate);
    const diff = end.diff(now);

    if (diff <= 0) {
      return 'Kapandı';
    }

    const duration = dayjs.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${days} gün ${hours} saat ${minutes} dakika`;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(number);
  };

  const endDate = calculateEndDate(adData?.createdAt, adData?.duration);
  const remainingTime = calculateRemainingTime(adData?.endDate || endDate);

  const maskedCompanyName = adOwnerCompany?.companyName ? maskCompanyName(adOwnerCompany.companyName) : 'Bilinmeyen Şirket';
  const maskedCompanyId = adOwnerCompany?.id ? adOwnerCompany.id.replace(/.(?=.{4})/g, '*') : '****';

  return (
    <div className="mx-auto mb-20 p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg px-4 py-5 sm:px-6">
        <div className="flex gap-5 md:gap-0 items-start flex-col md:flex-row">
          <img
            className="h-10 w-10 rounded-full"
            src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e"
            alt="Profile"
          />
          <div className="md:ml-4">
            <h3 className="text-lg font-bold text-[24px] leading-8 text-gray-900">{maskedCompanyName}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">@{maskedCompanyId}</p>
          </div>
          <div className="flex align-top md:ml-5 px-3 py-1 bg-[#F3F4F6] mb-3">
            {bidderRatings[companyId] ? (
              <div className="flex">
                <FilledStarIcon className="h-5 w-5 text-yellow-500" />
                <span className="ml-2 text-sm text-gray-500">{bidderRatings[companyId]}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Puanlanmadı</span>
            )}
          </div>
        </div>
        {isUserAdmin ? (
          <div className="flex gap-2">
            <button onClick={handleDeleteAd} className="bg-red-500 text-white px-4 py-2 rounded-md">Kaldır</button>
            <button onClick={handleOpenEditModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">İlanı Düzenle</button>
          </div>
        ) : (
          <div className="py-4 sm:px-6">
            {isFollowing ? (
              <button
                onClick={handleUnfollowAd}
                className="bg-red-500 text-white px-4 py-2 rounded-md">
                Bildirimleri Kapat
              </button>
            ) : (
              <button
                onClick={handleFollowAd}
                className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Bildirim Al
              </button>
            )}
          </div>
        )}
      </div>

      {/* Düzenleme Modal */}
      <EditAdModal 
        isOpen={isEditModalOpen}
        onRequestClose={handleCloseEditModal}
        adId={adId}
        companyId={companyId}
        adData={adData}
      />

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 pt-5 sm:px-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col md:flex-row gap-5">
              <div>
                {adData?.sectors?.map((sector, index) => (
                  <span key={index} className="text-xs bg-[#F3F4F6] font-medium rounded-md px-2">
                    {sector}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:ml-auto flex flex-col md:flex-row mt-4 md:mt-0 gap-4">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {adData.adType}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {adData.createdAt ? new Date(adData.createdAt.seconds * 1000).toLocaleDateString() : 'Bilinmiyor'}
              </span>
              <span className="ml-2 text-xs bg-[#FEF2F2] text-[#EF4444] px-3">İlan Süresi: {remainingTime}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-0">
          <dl className="">
            <div className="py-2 sm:grid sm:grid-cols-3 sm:px-6">
              <dt className="text- font-medium text-[#111827] flex items-center gap-1">
                <p>{adData?.title || 'Başlık Bulunamadı'}</p>
              </dt>
            </div>
            <div className="py-4 sm:py-2 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{adData?.content || 'İçerik Bulunamadı'}</dt>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    <div className="flex flex-wrap gap-4">
      {renderImages(adData?.images)}
    </div>
  </dd>
</div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-900">
                Talep Edilen Adet: {adData?.quantity ? formatNumber(adData.quantity) : 'Bilinmiyor'} {adData?.unit ? (adData.unit) : 'Bilinmiyor'}
              </div>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <div className="flex items-center">
                {adData?.requestSample ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <p className="mr-10">Numune Talep Ediliyor</p>
              </div>
              <div className="font-medium justify-self-end text-xs text-black">
                Termin Tarihi: {adData?.dueDate ? new Date(adData.dueDate.seconds * 1000).toLocaleDateString() : 'Bilinmiyor'}
              </div>
            </div>
            <BidList
              bids={bids}
              bidderRatings={bidderRatings}
              isUserAdmin={isUserAdmin}
              adData={adData}
              maskCompanyName={maskCompanyName}
              currentUser={currentUser}
              handleBidClick={handleBidClick}
              handleAcceptBid={handleAcceptBid}
              isUserAdminOrMember={isUserAdminOrMember} 
            />
          </dl>
        </div>
      </div>

      <Modal
        isOpen={!!selectedImage}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-75"
      >
        <div className="bg-white rounded-lg p-6" style={{ width: '50%', height: '50%' }}>
          <img src={selectedImage} alt="Detail View" className="max-w-full max-h-full object-contain" />
          <div className="mt-4 text-right">
            <a href={selectedImage} download className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md">
              İndir
            </a>
            <button onClick={closeModal} className="ml-2 inline-block bg-gray-500 text-white px-4 py-2 rounded-md">
              Kapat
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdDetails;

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
import EditAdModal from './EditAdModal';

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchAdData = async () => {
      const adRef = doc(db, 'companies', companyId, 'ads', adId);
      
      const unsubscribeAd = onSnapshot(adRef, async (doc) => {
        if (!doc.exists()) {
          Swal.fire({
            icon: 'error',
            title: 'İlan Bulunamadı',
            text: 'Görüntülemek istediğiniz ilan bulunamadı.',
          }).then(() => navigate('/ads'));
          return;
        }
        
        const data = doc.data();
        const isExpired = data.endDate && dayjs().isAfter(dayjs(data.endDate.seconds * 1000));
        
        if (isExpired && adOwnerCompany?.id !== company?.id) {
          Swal.fire({
            icon: 'info',
            title: 'İlan Süresi Doldu',
            text: 'Bu ilan süresi dolduğu için artık görüntülenemiyor.',
          }).then(() => navigate('/ads'));
          return;
        }

        setAdData(data);
        setLoading(false);
        
        const bidsRef = collection(db, 'companies', companyId, 'ads', adId, 'bids');
        const bidsSnapshot = await getDocs(bidsRef);
        const bidsList = bidsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBids(bidsList);

        const newBidderRatings = { [companyId]: await fetchRatings(companyId) };
        for (const bid of bidsList) {
          newBidderRatings[bid.bidderCompanyId] = await fetchRatings(bid.bidderCompanyId);
        }
        setBidderRatings(newBidderRatings);
      });

      return () => unsubscribeAd();
    };

    const fetchAdOwnerCompany = async () => {
      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyRef);
      
      if (companyDoc.exists()) {
        setAdOwnerCompany({ id: companyDoc.id, ...companyDoc.data() });
        const isAdmin = companyDoc.data().adminUserId === currentUser?.uid;
        setIsUserAdmin(isAdmin);
      }
    };

    if (company) fetchFollowingStatus();
    fetchAdData();
    fetchAdOwnerCompany();

  }, [adId, companyId, currentUser, company, navigate]);

  const fetchFollowingStatus = () => {
    setIsFollowing(company?.FollowedAds?.includes(adId) || false);
  };

  const fetchRatings = async (companyId) => {
    const ratingsRef = collection(db, 'companies', companyId, 'ratings');
    const ratingsSnapshot = await getDocs(ratingsRef);

    if (!ratingsSnapshot.empty) {
      let totalRating = 0, ratingCount = 0;
      ratingsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalRating += (data.communication + data.quality + data.speed) / 3;
        ratingCount++;
      });
      return (totalRating / ratingCount).toFixed(1);
    } else {
      return null;
    }
  };

  const handleBidClick = () => {
    if (adData && adData.status !== 'approved' && (!adData.endDate || dayjs().isBefore(dayjs(adData.endDate.seconds * 1000)))) {
      navigate(`/ad-details/${companyId}/${adId}/bid`);
    }
  };

  const handleAcceptBid = async (bidId, bidderCompanyId) => {
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
        
        await addDoc(collection(db, 'orders'), {
          ad: { ...adData },
          bid: (await getDoc(bidRef)).data(),
          companyId,
          bidderCompanyId,
          orderDate: new Date()
        });

        await deleteDoc(adRef);
        await deleteDoc(bidRef);

        Swal.fire('Başarılı!', 'Teklif kabul edildi ve ilan kapatıldı.', 'success');
        navigate('/myorders');
      } catch (error) {
        Swal.fire('Hata!', `Teklif kabul edilirken bir hata oluştu: ${error.message}`, 'error');
      }
    }
  };

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
        await deleteDoc(doc(db, 'companies', companyId, 'ads', adId));
        Swal.fire('Başarılı!', 'İlan başarıyla silindi.', 'success');
        navigate('/dashboard');
      } catch (error) {
        Swal.fire('Hata!', `İlan silinirken bir hata oluştu: ${error.message}`, 'error');
      }
    }
  };

  const handleFollowAd = async () => {
    try {
      await updateDoc(doc(db, 'companies', company.id), { FollowedAds: arrayUnion(adId) });
      setIsFollowing(true);
      Swal.fire({ title: 'Başarılı!', text: 'İlan takibe alındı!', icon: 'success' });
    } catch (error) {
      Swal.fire('Hata!', 'İlan takibe alınamadı.', 'error');
    }
  };

  const handleUnfollowAd = async () => {
    try {
      await updateDoc(doc(db, 'companies', company.id), { FollowedAds: arrayRemove(adId) });
      setIsFollowing(false);
      Swal.fire({ title: 'Başarılı!', text: 'İlan takibi kaldırıldı!', icon: 'success' });
    } catch (error) {
      Swal.fire('Hata!', 'İlan takibi kaldırılamadı.', 'error');
    }
  };

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const renderImages = (images) => images ? (
    Array.isArray(images) ? images.map((image, index) => (
      <img key={index} src={image} alt={`Görsel ${index + 1}`} className="h-24 w-24 object-cover cursor-pointer" onClick={() => setSelectedImage(image)} />
    )) : (
      <img src={images} alt="Ad Image" className="h-24 w-24 object-cover cursor-pointer" onClick={() => setSelectedImage(images)} />
    )
  ) : <p className="text-sm text-gray-500">Yüklenen fotoğraf yok.</p>;

  const closeModal = () => setSelectedImage(null);

  const maskCompanyName = (name) => name.split(' ').map(word => word.length > 1 ? word[0] + '*'.repeat(word.length - 1) : word).join(' ');

  if (loading || !adData) return <div>Loading...</div>;

  const endDate = adData.endDate ? new Date(adData.endDate.seconds * 1000) : null;
  const remainingTime = endDate ? dayjs().to(dayjs(endDate), true) : 'Kapandı';

  return (
    <div className="mx-auto mb-20 p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg px-4 py-5 sm:px-6">
        <div className="flex gap-5 md:gap-0 items-start flex-col md:flex-row">
          <img className="h-10 w-10 rounded-full" src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e" alt="Profile" />
          <div className="md:ml-4">
            <h3 className="text-lg font-bold text-[24px] leading-8 text-gray-900">{maskCompanyName(adOwnerCompany?.companyName || 'Bilinmeyen Şirket')}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">@{adOwnerCompany?.id.replace(/.(?=.{4})/g, '*') || '****'}</p>
          </div>
        </div>
        {/* Follow & Admin Actions */}
        {isUserAdmin ? (
          <div className="flex gap-2">
            <button onClick={handleDeleteAd} className="bg-red-500 text-white px-4 py-2 rounded-md">Kaldır</button>
            <button onClick={handleOpenEditModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">İlanı Düzenle</button>
          </div>
        ) : (
          <div className="py-4 sm:px-6">
            {isFollowing ? (
              <button onClick={handleUnfollowAd} className="bg-red-500 text-white px-4 py-2 rounded-md">Bildirimleri Kapat</button>
            ) : (
              <button onClick={handleFollowAd} className="bg-blue-500 text-white px-4 py-2 rounded-md">Bildirim Al</button>
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

      {/* Ad Details */}
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
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{adData.adType}</span>
              <span className="ml-2 text-xs text-gray-500">{new Date(adData.createdAt.seconds * 1000).toLocaleDateString() || 'Bilinmiyor'}</span>
              <span className="ml-2 text-xs bg-[#FEF2F2] text-[#EF4444] px-3">İlan Süresi: {remainingTime}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-0">
          <BidList
            bids={bids}
            bidderRatings={bidderRatings}
            isUserAdmin={isUserAdmin}
            adData={adData}
            maskCompanyName={maskCompanyName}
            currentUser={currentUser}
            handleBidClick={handleBidClick}
            handleAcceptBid={handleAcceptBid}
          />
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
            <a href={selectedImage} download className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md">İndir</a>
            <button onClick={closeModal} className="ml-2 inline-block bg-gray-500 text-white px-4 py-2 rounded-md">Kapat</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdDetails;

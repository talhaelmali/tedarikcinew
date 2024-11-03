import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import durationPlugin from 'dayjs/plugin/duration';

import EditAdModal from './EditAdModal';

dayjs.extend(relativeTime);
dayjs.extend(durationPlugin);

const db = getFirestore();

const BuyerAdCard = React.memo(({ ad }) => {
  const [bidCount, setBidCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchBidCount = async () => {
      try {
        const bidsSnapshot = await getDocs(collection(db, 'companies', ad.companyId, 'ads', ad.id, 'bids'));
        setBidCount(bidsSnapshot.size);
      } catch (error) {
        console.error("Error fetching bid count: ", error);
      }
    };

    fetchBidCount();
  }, [ad.companyId, ad.id]);

  // Function to limit content to a certain length and add ellipsis
  const limitContent = (content, maxLength = 100) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  const createdAt = ad.createdAt && ad.createdAt instanceof Date ? ad.createdAt.toLocaleDateString() : "Tarih yok";
  const adTypeColor = ad.adType === 'Kapalı Usül Teklif' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

  const handleDeleteAd = async () => {
    const confirm = await Swal.fire({
      title: 'İlanı kaldırmak istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, kaldır!',
      cancelButtonText: 'Hayır, iptal et'
    });
  
    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'companies', ad.companyId, 'ads', ad.id));
        Swal.fire('Başarılı!', 'İlan kaldırıldı.', 'success').then(() => {
          window.location.reload(); // Reload the page after successful deletion
        });
      } catch (error) {
        console.error('İlan kaldırılırken hata oluştu:', error);
        Swal.fire('Hata!', 'İlan kaldırılırken bir hata oluştu.', 'error');
      }
    }
  };
  

  const handleEditAdClick = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;

    let date;
    if (createdAt.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else if (createdAt instanceof Date) {
      date = new Date(createdAt.getTime());
    } else if (typeof createdAt === 'string') {
      date = new Date(createdAt);
    } else {
      return null;
    }

    date.setDate(date.getDate() + parseInt(duration));
    return date;
  };

  const calculateRemainingTime = (endDate) => {
    if (!endDate) return 'Bilinmiyor';

    let end;
    if (endDate.seconds) {
      end = dayjs(endDate.seconds * 1000);
    } else if (endDate instanceof Date) {
      end = dayjs(endDate.getTime());
    } else if (typeof endDate === 'string') {
      end = dayjs(endDate);
    } else {
      return 'Bilinmiyor';
    }

    const now = dayjs();
    const diff = end.diff(now);

    if (diff <= 0) {
      return 'İlan Süresi Doldu';
    }

    const duration = dayjs.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${days} gün ${hours} saat ${minutes} dakika`;
  };

  const endDate = ad.endDate || calculateEndDate(ad.createdAt, ad.duration);
  const remainingTime = calculateRemainingTime(endDate);

  return (
    <>
      <li className="py-4">
        <div className="border rounded-lg shadow-sm bg-white">
          {/* Desktop View (Hidden on Mobile) */}
          <div className="hidden md:flex justify-between items-start p-4">
            <div className="flex flex-col space-y-2 w-1/3">
              {/* Sectors */}
              <div className="flex items-center space-x-2">
                {ad.sectors.map((sector, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                    {sector}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="hover:underline">{ad.title}</Link>
                </h3>
                <span className="text-blue-600">#{ad.id}</span>
              </div>
              <p className="text-sm text-gray-500">{limitContent(ad.content)}</p>
              <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="flex items-center bg-blue-800 text-white px-3 py-1 rounded-md text-xs font-medium w-max">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                Gelen Teklifler ({bidCount})
              </Link>
            </div>

            {/* Middle Section: Action Buttons */}
            <div className="flex flex-col items-center justify-start space-y-2 w-1/3">
              <button onClick={handleDeleteAd} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-medium w-1/2">
                Kaldır
              </button>
              <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-medium w-1/2">
                İlan Beklemeye Al
              </button>
              <button onClick={handleEditAdClick} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-medium w-1/2">
                İlanı Düzenle
              </button>
            </div>

            {/* Right Section: Additional Info and Badges */}
            <div className="flex flex-col items-end space-y-2 w-1/3">
              <div className="flex space-x-2 justify-end">
                <span className={`${adTypeColor} px-2 py-1 text-xs font-medium rounded`}>
                  {ad.adType}
                </span>
                <span className="text-gray-500 text-xs">{createdAt}</span>
              </div>

              <div className="space-y-1 text-right">
                {ad.requestSample && (
                  <div className="inline-block bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded-md mr-1">
                    Numune Talep Ediyor
                  </div>
                )}
                {ad.maxBid && (
                  <div className="inline-block bg-[#EE6F2D] text-white text-xs font-medium px-2 py-1 rounded-md">
                    Bütçe: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ad.maxBid)}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                <span className="text-blue-600">İlanın Bitimine:</span> {remainingTime}
              </p>
            </div>
          </div>

          {/* Mobile View (Hidden on Desktop) */}
          <div className="md:hidden p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="hover:underline">
                    {ad.title}
                  </Link>
                  <span className="text-blue-600"> #{ad.id}</span>
                </h3>

                <div className="flex flex-wrap gap-1 mt-1">
                  {ad.sectors && ad.sectors.map((sector, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      {sector}
                    </span>
                  ))}
                </div>

                <div className="mt-2 flex items-start gap-2">
                  {ad.requestSample && (
                    <span className="bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded-md">
                      Numune Talep Ediyor
                    </span>
                  )}
                  {ad.maxBid && (
                    <span className="bg-[#EE6F2D] text-white text-xs font-medium px-2 py-1 rounded-md">
                      Bütçe: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ad.maxBid)}
                    </span>
                  )}
                </div>

                <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="mt-2 inline-block bg-blue-800 text-white px-3 py-1 rounded-md text-xs font-medium">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  Gelen Teklifler ({bidCount})
                </Link>

                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-blue-600">İlanın Bitimine:</span> {remainingTime}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <button onClick={handleDeleteAd} className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-medium">
                  Kaldır
                </button>
                <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-medium">
                  Beklemeye Al
                </button>
                <button onClick={handleEditAdClick} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-medium">
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>

      {isEditModalOpen && (
        <EditAdModal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          adId={ad.id}
          companyId={ad.companyId}
          adData={ad}
        />
      )}
    </>
  );
});

export default BuyerAdCard;

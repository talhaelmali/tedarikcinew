import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import Modal from './Modal';

const db = getFirestore();

const SellerAdCard = ({ ad }) => {
  const [bidCount, setBidCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDeleteAd = async () => {
    try {
      await deleteDoc(doc(db, 'companies', ad.companyId, 'ads', ad.id));
      alert("İlan başarıyla kaldırıldı");
    } catch (error) {
      console.error("Error deleting ad: ", error);
    }
  };

  const createdAt = ad.createdAt && ad.createdAt instanceof Date ? ad.createdAt.toLocaleDateString() : "Tarih yok";
  const adTypeColor = ad.adType === 'Kapalı Usül Teklif' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';

  return (
    <li className="py-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            {ad.sectors.map((sector, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
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
          <p className="text-sm text-gray-500">{ad.content}</p>
        </div>
        <div className="text-right space-y-2">
          <div className="flex space-x-2 justify-end">
            <span className={`${adTypeColor} px-2 py-1 text-xs font-medium rounded`}>
              {ad.adType}
            </span>
            <span className="text-gray-500 text-xs">{createdAt}</span>
          </div>
          <button onClick={handleDeleteAd} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium w-max">
            İlanı Kaldır
          </button>
          {ad.status === 'approved' && (
            <div className="flex space-x-2 justify-end">
              <button onClick={() => setIsModalOpen(true)} className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                Teslimatı Onayla
              </button>
              <Link to={`/chat/${ad.companyId}_${ad.approvedCompanyId}`} className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium w-max">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Firmayla İletişime Geç
              </Link>
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                Faturayı İndir
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <Modal ad={ad} closeModal={() => setIsModalOpen(false)} />}
    </li>
  );
};

export default SellerAdCard;

import React, { useEffect, useState } from 'react';
import { collection, doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';


const db = getFirestore();
const profilePic = '/profilpic.svg'

const AdDetails = () => {
  const { companyId, adId } = useParams();
  const [adData, setAdData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleBidClick = () => {
    navigate(`/ad-details/${companyId}/${adId}/bid`);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const adRef = doc(db, 'companies', companyId, 'ads', adId);
    const unsubscribe = onSnapshot(adRef, (doc) => {
      if (doc.exists()) {
        setAdData(doc.data());
      } else {
        setAdData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [adId, companyId]);

  useEffect(() => {
    if (adData) {
      const companyRef = doc(db, 'companies', companyId);
      const unsubscribe = onSnapshot(companyRef, (doc) => {
        if (doc.exists()) {
          setCompanyData(doc.data());
        } else {
          setCompanyData(null);
        }
      });

      return () => unsubscribe();
    }
  }, [adData, companyId]);

  if (loading || !adData || !companyData) {
    return <div>Loading...</div>;
  }

  const calculateEndDate = (startDate, duration) => {
    const date = new Date(startDate.seconds * 1000);
    date.setDate(date.getDate() + parseInt(duration));
    return date;
  };

  const endDate = calculateEndDate(adData.createdAt, adData.duration);

  const maskedCompanyName = companyData.companyName.replace(/\B\w/g, '*');
  const maskedCompanyId = companyId.replace(/.(?=.{4})/g, '*');

  const isUserAdminOrMember = currentUser && (
    companyData.adminUserId === currentUser.uid ||
    companyData.Users?.includes(currentUser.uid)
  );

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-5 sm:px-6">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={profilePic}
            alt="Profile"
          />
          <div className="ml-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {maskedCompanyName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              @{maskedCompanyId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.89a1 1 0 00.95.69h4.104c.969 0 1.371 1.24.588 1.81l-3.32 2.41a1 1 0 00-.364 1.118l1.262 3.89c.3.921-.755 1.688-1.54 1.118l-3.32-2.41a1 1 0 00-1.176 0l-3.32 2.41c-.784.57-1.84-.197-1.54-1.118l1.262-3.89a1 1 0 00-.364-1.118l-3.32-2.41c-.783-.57-.38-1.81.588-1.81h4.104a1 1 0 00.95-.69l1.262-3.89z" />
            </svg>
            <span className="ml-2 text-sm text-gray-500">4.8</span>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Bildirim Al
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="ml-auto text-right">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {adData.adType}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {new Date(adData.createdAt.seconds * 1000).toLocaleDateString()} İlan Süresi: {adData.duration} Gün
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">İlan Başlığı</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {adData.title}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">İlan İçeriği</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {adData.content}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Sektörler</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {adData.sectors.join(', ')}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Termin Tarihi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(adData.dueDate.seconds * 1000).toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ödeme Yöntemi</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {adData.paymentMethod}
              </dd>
            </div>
            {adData.requestSample && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Numune</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Numune talep ediliyor.
                </dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Görseller</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {adData.images ? (
                  <div className="flex space-x-2">
                    {adData.images.map((image, index) => (
                      <img key={index} src={image} alt={`Görsel ${index + 1}`} className="h-24 w-24 object-cover" />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Yüklenen fotoğraf yok.</p>
                )}
              </dd>
            </div>
          </dl>
        </div>
        {adData.adType === 'Açık Usül İhale' && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Gelen Teklifler</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Henüz teklif yok.</p>
            </div>
          </div>
        )}
{!isUserAdminOrMember && (
      <div className="px-4 py-4 sm:px-6 text-right">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          onClick={handleBidClick}
        >
          Teklif Gönder
        </button>
      </div>
    )}
      </div>
    </div>
  );
};

export default AdDetails;

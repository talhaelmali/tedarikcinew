import React, { useState, useEffect, useMemo } from 'react';
import { useCompany } from '../context/CompanyContext';
import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import BuyerAdCard from './BuyerAdCard';
import AdCard from './AdCard';
import BuyerStats from './BuyerStats';
import SalerStats from './SalerStats';
import dayjs from 'dayjs';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

const db = getFirestore();

const CombinedDashboard = () => {
  const { company, loading: companyLoading } = useCompany();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('ilanlar');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageMyAds, setCurrentPageMyAds] = useState(1);
  const [adsPerPage] = useState(5);
  const [totalAds, setTotalAds] = useState(0);
  const [totalMyAds, setTotalMyAds] = useState(0);

  useEffect(() => {
    if (company) {
      const unsubscribe = onSnapshot(query(collection(db, 'companies')), (snapshot) => {
        const newAds = [];

        snapshot.forEach((companyDoc) => {
          const adsQuery = query(
            collection(db, 'companies', companyDoc.id, 'ads'),
            orderBy('createdAt', 'desc')
          );

          onSnapshot(adsQuery, (adsSnapshot) => {
            adsSnapshot.forEach((adDoc) => {
              const adData = adDoc.data();
              adData.id = adDoc.id;

              // Convert Firestore timestamp to Date
              if (adData.createdAt && adData.createdAt.toDate) {
                adData.createdAt = adData.createdAt.toDate();
              }

              // Calculate ad expiration date and filter out expired ads
              const endDate = calculateEndDate(adData.createdAt, adData.duration);
              if (!isAdActive(endDate)) {
                return; // Skip expired ads
              }

              newAds.push({ id: adDoc.id, ...adData, companyId: companyDoc.id });
            });

            updateAds(newAds);
          });
        });
      });

      return () => unsubscribe();
    }
  }, [company, currentPage, currentPageMyAds]);

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    const date = new Date(createdAt.getTime());
    date.setDate(date.getDate() + parseInt(duration, 10));
    return date;
  };

  const isAdActive = (endDate) => {
    return endDate && dayjs(endDate).isAfter(dayjs());
  };

  const updateAds = (adsData) => {
    const sortedAds = adsData.sort((a, b) => b.createdAt - a.createdAt);
    const otherAds = sortedAds.filter(ad => ad.companyId !== company?.id);
    const myAds = sortedAds.filter(ad => ad.companyId === company?.id);

    setTotalAds(otherAds.length);
    setTotalMyAds(myAds.length);

    setAds({
      otherAds: otherAds.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage),
      myAds: myAds.slice((currentPageMyAds - 1) * adsPerPage, currentPageMyAds * adsPerPage),
    });
    setLoading(false);
  };

  const totalPages = Math.ceil(totalAds / adsPerPage);
  const totalMyAdsPages = Math.ceil(totalMyAds / adsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleMyAdsPageChange = (pageNumber) => {
    setCurrentPageMyAds(pageNumber);
  };

  if (companyLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>No company found for this user.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-base leading-6 text-gray-900">Son 30 Gün</h3>
        <Link to="/createad" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          İlan Oluştur
        </Link>
      </div>
      <div className="mt-6">
        <BuyerStats />
        <SalerStats />
      </div>
      <div className="mt-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab('ilanlar')}
            className={`px-3 py-2 rounded-md ${selectedTab === 'ilanlar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            İlanlar
          </button>
          <button
            onClick={() => setSelectedTab('ilanlarim')}
            className={`px-3 py-2 rounded-md ${selectedTab === 'ilanlarim' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            İlanlarım
          </button>
        </div>

        {selectedTab === 'ilanlar' && (
          <>
            <ul role="list" className="divide-y divide-gray-200 mt-4">
              {ads.otherAds.length > 0 ? (
                ads.otherAds.map(ad => (
                  <AdCard key={`${ad.companyId}-${ad.id}`} ad={ad} />
                ))
              ) : (
                <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
              )}
            </ul>

            {/* Pagination for "İlanlar" */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
                <div className="-mt-px flex w-0 flex-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`inline-flex items-center border-t-2 ${currentPage === i + 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-4 pt-4 text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </button>
                </div>
              </nav>
            )}
          </>
        )}

        {selectedTab === 'ilanlarim' && (
          <>
            <ul role="list" className="divide-y divide-gray-200 mt-4">
              {ads.myAds.length > 0 ? (
                ads.myAds.map(ad => (
                  <BuyerAdCard key={`${ad.companyId}-${ad.id}`} ad={ad} />
                ))
              ) : (
                <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
              )}
            </ul>

            {/* Pagination for "İlanlarım" */}
            {totalMyAdsPages > 1 && (
              <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
                <div className="-mt-px flex w-0 flex-1">
                  <button
                    onClick={() => handleMyAdsPageChange(currentPageMyAds - 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${currentPageMyAds === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    disabled={currentPageMyAds === 1}
                  >
                    Önceki
                  </button>
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {Array.from({ length: totalMyAdsPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handleMyAdsPageChange(i + 1)}
                      className={`inline-flex items-center border-t-2 ${currentPageMyAds === i + 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} px-4 pt-4 text-sm font-medium`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                  <button
                    onClick={() => handleMyAdsPageChange(currentPageMyAds + 1)}
                    className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${currentPageMyAds === totalMyAdsPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                    disabled={currentPageMyAds === totalMyAdsPages}
                  >
                    Sonraki
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CombinedDashboard;

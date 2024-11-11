import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, getFirestore, orderBy, where } from 'firebase/firestore';
import { useCompany } from '../context/CompanyContext'; 
import BuyerStats from './BuyerStats';
import BuyerAdCard from './BuyerAdCard';
import dayjs from 'dayjs';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

const db = getFirestore();

export default function StaticDashboard() {
  const { company, loading: companyLoading } = useCompany(); 
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(3);
  const [totalAds, setTotalAds] = useState(0);

  useEffect(() => {
    if (company && !companyLoading) {
      const unsubscribe = fetchAds();
      return () => unsubscribe(); // Component unmount olduğunda temizleme
    }
  }, [company, searchQuery, currentPage, companyLoading]);

  const fetchAds = () => {
    setLoading(true);
    const adsData = [];

    const companyAdsQuery = searchQuery
      ? query(
          collection(db, 'companies', company.id, 'ads'),
          where('title', '>=', searchQuery),
          where('title', '<=', searchQuery + '\uf8ff'),
          orderBy('title')
        )
      : query(
          collection(db, 'companies', company.id, 'ads'),
          orderBy('createdAt', 'desc')
        );

    // Real-time güncellemeler için dinleme
    return onSnapshot(companyAdsQuery, (adsSnapshot) => {
      let filteredAds = [];
      adsSnapshot.forEach((adDoc) => {
        const adData = adDoc.data();
        if (adData.createdAt && adData.createdAt.toDate) {
          adData.createdAt = adData.createdAt.toDate();
        }

        // İlan bitiş tarihi hesaplama ve süresi geçmiş ilanları filtreleme
        const endDate = calculateEndDate(adData.createdAt, adData.duration);
        if (!isAdActive(endDate)) return;

        filteredAds.push({ id: adDoc.id, ...adData, companyId: company.id });
      });

      filteredAds.sort((a, b) => b.createdAt - a.createdAt);

      setTotalAds(filteredAds.length);
      const indexOfLastAd = currentPage * adsPerPage;
      const indexOfFirstAd = indexOfLastAd - adsPerPage;
      const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

      setAds(currentAds);
      setLoading(false);
    });
  };

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    const date = new Date(createdAt);
    date.setDate(date.getDate() + parseInt(duration, 10));
    return date;
  };

  const isAdActive = (endDate) => endDate && dayjs(endDate).isAfter(dayjs());

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const totalPages = Math.ceil(totalAds / adsPerPage);

  if (companyLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base leading-6 text-gray-900">Son 30 Gün</h3>
        <Link to="/createad" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          İlan Oluştur
        </Link>
      </div>

     

      <div className="mt-6">
        <BuyerStats />
      </div>



      <h2 className="text-xl font-semibold text-gray-900 pt-3">İlanlarım</h2>
      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {ads.length > 0 ? (
          ads.map(ad => (
            <BuyerAdCard key={ad.id} ad={ad} />
          ))
        ) : (
          <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
        )}
      </ul>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
          <div className="-mt-px flex w-0 flex-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
              disabled={currentPage === 1}
            >
              <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Önceki
            </button>
          </div>
          <div className="hidden md:-mt-px md:flex">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${currentPage === i + 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
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
              <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

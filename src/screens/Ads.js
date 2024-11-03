import React, { useState, useEffect } from 'react';
import { collection, getFirestore, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import AdCard from '../components/AdCard';
import dayjs from 'dayjs';
import { useCompany } from '../context/CompanyContext'; // Import CompanyContext

const db = getFirestore();

const Ads = () => {
  const { company, loading: companyLoading } = useCompany(); // Get company data
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(5);
  const [totalAds, setTotalAds] = useState(0);

  useEffect(() => {
    if (company && !companyLoading) {
      const unsubscribe = onSnapshot(query(collection(db, 'companies')), (snapshot) => {
        const newAds = [];
        snapshot.forEach((companyDoc) => {
          if (companyDoc.id === company.id) return; // Skip ads from the user's own company

          const companyAdsQuery = searchQuery
            ? query(
                collection(db, 'companies', companyDoc.id, 'ads'),
                where('title', '>=', searchQuery),
                where('title', '<=', searchQuery + '\uf8ff'),
                orderBy('title'),
                orderBy('createdAt', 'desc')
              )
            : query(
                collection(db, 'companies', companyDoc.id, 'ads'),
                orderBy('createdAt', 'desc')
              );

          onSnapshot(companyAdsQuery, (adsSnapshot) => {
            adsSnapshot.forEach((adDoc) => {
              const adData = adDoc.data();
              adData.id = adDoc.id;
              const endDate = calculateEndDate(adData.createdAt, adData.duration);
              const remainingTime = calculateRemainingTime(endDate);

              if (remainingTime !== 'İlan Süresi Doldu') {
                newAds.push({ id: adDoc.id, ...adData, companyId: companyDoc.id });
              }
            });
            updateAds(newAds);
          });
        });
      });

      return () => unsubscribe();
    }
  }, [company, searchQuery, currentPage, companyLoading]);

  const updateAds = (adsData) => {
    const sortedAds = adsData.sort((a, b) => b.createdAt - a.createdAt);
    setTotalAds(sortedAds.length);
    setAds(sortedAds.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage));
    setLoading(false);
    localStorage.setItem('ads', JSON.stringify(sortedAds));
  };

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    let date = new Date(createdAt.seconds * 1000);
    date.setDate(date.getDate() + parseInt(duration));
    return date;
  };

  const calculateRemainingTime = (endDate) => {
    if (!endDate) return 'Bilinmiyor';
    const end = dayjs(endDate);
    const now = dayjs();
    const diff = end.diff(now);
    return diff <= 0 ? 'İlan Süresi Doldu' : `${Math.floor(diff / (1000 * 60 * 60 * 24))} gün`;
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading || companyLoading) return <div>Loading...</div>;

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const totalPages = Math.ceil(totalAds / adsPerPage);

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-indigo-500"
          placeholder="İlan Ara..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-[#0D408F] text-white rounded-r-lg"
        >
          Ara
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {totalAds} ilan arasından {indexOfFirstAd + 1} - {Math.min(indexOfLastAd, totalAds)} gösteriliyor
      </p>

      <h1 className="text-2xl font-semibold text-gray-900">En Son Eklenen İlanlar</h1>
      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {ads.map((ad) => (
          <AdCard key={`${ad.companyId}-${ad.id}`} ad={ad} />
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
          <div className="-mt-px flex w-0 flex-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
              disabled={currentPage === totalPages}
              className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Sonraki
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Ads;

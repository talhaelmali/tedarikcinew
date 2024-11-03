import React, { useState, useEffect } from 'react';
import { collection, getFirestore, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useCompany } from '../context/CompanyContext';
import AdCard from './AdCard';
import SalerStats from './SalerStats';
import dayjs from 'dayjs';

const db = getFirestore();

export default function SalerDashboard() {
  const { company, loading: companyLoading } = useCompany();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(5);
  const [totalAds, setTotalAds] = useState(0);

  useEffect(() => {
    if (company) {
      const unsubscribe = onSnapshot(query(collection(db, 'companies')), (snapshot) => {
        const adsData = [];

        snapshot.forEach((companyDoc) => {
          const adsQuery = query(
            collection(db, 'companies', companyDoc.id, 'ads'),
            orderBy('createdAt', 'desc')
          );

          onSnapshot(adsQuery, (adsSnapshot) => {
            adsSnapshot.forEach((adDoc) => {
              const adData = adDoc.data();

              // Convert Firestore timestamp to Date for createdAt and endDate
              if (adData.createdAt && adData.createdAt.seconds) {
                adData.createdAt = new Date(adData.createdAt.seconds * 1000);
              }
              if (adData.endDate && adData.endDate.seconds) {
                adData.endDate = new Date(adData.endDate.seconds * 1000);
              }

              // Filter out expired ads
              const endDate = calculateEndDate(adData.createdAt, adData.duration);
              if (isAdActive(endDate)) {
                adsData.push({ id: adDoc.id, ...adData, companyId: companyDoc.id });
              }
            });

            updateAds(adsData);
          });
        });
      });

      return () => unsubscribe();
    }
  }, [company, currentPage]);

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    const endDate = new Date(createdAt);
    endDate.setDate(endDate.getDate() + parseInt(duration, 10));
    return endDate;
  };

  const isAdActive = (endDate) => endDate && dayjs(endDate).isAfter(dayjs());

  const updateAds = (adsData) => {
    const sortedAds = adsData.sort((a, b) => b.createdAt - a.createdAt);
    setTotalAds(sortedAds.length);
    setAds(sortedAds.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage));
    setLoading(false);
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(totalAds / adsPerPage);

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
      </div>
      <SalerStats />

      <h2 className="text-xl font-semibold text-gray-900">İlanlar</h2>
      {ads.length > 0 ? (
        <ul role="list" className="divide-y divide-gray-200 mt-4">
          {ads.map(ad => (
            <AdCard key={`${ad.companyId}-${ad.id}`} ad={ad} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
          <div className="-mt-px flex w-0 flex-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              disabled={currentPage === totalPages}
            >
              Sonraki
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, getFirestore, orderBy } from 'firebase/firestore';
import { useCompany } from '../context/CompanyContext'; 
import BuyerStats from './BuyerStats';
import BuyerAdCard from './BuyerAdCard';
import dayjs from 'dayjs';

const db = getFirestore();

export default function StaticDashboard() {
  const { company, loading: companyLoading } = useCompany(); 
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      const adsQuery = query(
        collection(db, 'companies', company.id, 'ads'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(adsQuery, (adsSnapshot) => {
        const adsData = [];
        
        adsSnapshot.forEach((adDoc) => {
          const adData = adDoc.data();
          adData.id = adDoc.id;

          // Convert Firestore timestamp to Date
          if (adData.createdAt && adData.createdAt.toDate) {
            adData.createdAt = adData.createdAt.toDate();
          }

          const endDate = calculateEndDate(adData.createdAt, adData.duration);

          // Only include active ads
          if (isAdActive(endDate)) {
            adsData.push({ id: adDoc.id, ...adData });
          }
        });

        setAds(adsData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [company]);

  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;
    const date = new Date(createdAt.getTime());
    date.setDate(date.getDate() + parseInt(duration, 10));
    return date;
  };

  const isAdActive = (endDate) => {
    return endDate && dayjs(endDate).isAfter(dayjs());
  };

  const myAds = useMemo(() => ads.filter(ad => ad.userId === company?.adminUserId), [ads, company]);

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
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">İlanlarım</h2>
        <ul role="list" className="divide-y divide-gray-200 mt-4">
          {myAds.length > 0 ? (
            myAds.map(ad => (
              <BuyerAdCard key={`${ad.companyId}-${ad.id}`} ad={ad} />
            ))
          ) : (
            <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

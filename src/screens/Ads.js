// Ads.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, orderBy, startAfter, limit } from 'firebase/firestore';
import AdCard from '../components/AdCard';

const db = getFirestore();

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalAds, setTotalAds] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const adsData = [];
      querySnapshot.forEach((doc) => {
        adsData.push({ id: doc.id, ...doc.data() });
      });
      setAds(adsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const fetchTotalAds = async () => {
      const totalQuerySnapshot = await getDocs(collection(db, 'companies'));
      setTotalAds(totalQuerySnapshot.size);
    };

    fetchTotalAds();
  }, []);

  const handleNextPage = async () => {
    setLoading(true);
    const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(3));
    const querySnapshot = await getDocs(q);
    const adsData = [];
    querySnapshot.forEach((doc) => {
      adsData.push({ id: doc.id, ...doc.data() });
    });
    setAds(adsData);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
    setPage(page + 1);
  };

  const handlePreviousPage = async () => {
    if (page === 1) return;
    setLoading(true);
    const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'), limit(page * 3));
    const querySnapshot = await getDocs(q);
    const adsData = [];
    querySnapshot.forEach((doc, index) => {
      if (index >= (page - 2) * 3) {
        adsData.push({ id: doc.id, ...doc.data() });
      }
    });
    setAds(adsData);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
    setPage(page - 1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <h1 className="text-2xl font-semibold text-gray-900">En Son Eklenen İlanlar</h1>
      <p className="text-sm text-gray-500">İlanlar arasından seçip sürece devam edebilirsiniz.</p>
      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </ul>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ${page === 1 && 'opacity-50 cursor-not-allowed'}`}
          disabled={page === 1}
        >
          Önceki
        </button>
        <div>
          {Array.from({ length: Math.ceil(totalAds / 3) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ${ads.length < 3 && 'opacity-50 cursor-not-allowed'}`}
          disabled={ads.length < 3}
        >
          Sonraki
        </button>
      </div>
    </div>
  );
};

export default Ads;

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

const db = getFirestore();

const CombinedDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [ads, setAds] = useState([]);
  const [selectedTab, setSelectedTab] = useState('ilanlar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCompanyAndAds = async () => {
      if (currentUser) {
        const companyQuery = query(collection(db, 'companies'), where('adminUserId', '==', currentUser.uid));
        const companySnapshot = await getDocs(companyQuery);
        let companyData = null;
        let companyId = null;

        companySnapshot.forEach((doc) => {
          companyData = doc.data();
          companyId = doc.id;
        });

        if (!companyData) {
          const userQuery = query(collection(db, 'companies'), where('Users', 'array-contains', currentUser.uid));
          const userSnapshot = await getDocs(userQuery);

          userSnapshot.forEach((doc) => {
            companyData = doc.data();
            companyId = doc.id;
          });
        }

        if (companyData) {
          setCompany({ ...companyData, id: companyId });
          const adsQuery = query(collection(db, 'companies', companyId, 'ads'));
          const adsSnapshot = await getDocs(adsQuery);
          const adsData = [];
          adsSnapshot.forEach((doc) => {
            adsData.push({ id: doc.id, ...doc.data() });
          });
          setAds(adsData);
        }

        setLoading(false);
      }
    };

    fetchCompanyAndAds();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>No company found for this user.</div>;
  }

  const myAds = ads.filter(ad => ad.userId === currentUser.uid);
  const otherAds = ads.filter(ad => ad.userId !== currentUser.uid);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link to="/create-ad" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          İlan Oluştur
        </Link>
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
          <ul role="list" className="divide-y divide-gray-200 mt-4">
            {otherAds.map(ad => (
              <li key={ad.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link to={`/ad-details/${ad.companyId}/${ad.id}`}>{ad.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500">{ad.content}</p>
                    <div className="mt-2 flex space-x-1 text-sm text-gray-500">
                      {ad.sectors.map((sector, index) => (
                        <span key={index} className="bg-gray-200 rounded-full px-2 py-1">{sector}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`bg-${ad.adType === 'Kapalı Usül Teklif' ? 'yellow' : 'green'}-100 text-${ad.adType === 'Kapalı Usül Teklif' ? 'yellow' : 'green'}-800 rounded-full px-3 py-1 text-xs font-medium`}>
                      {ad.adType}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">{ad.createdAt.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {selectedTab === 'ilanlarim' && (
          <ul role="list" className="divide-y divide-gray-200 mt-4">
            {myAds.map(ad => (
              <li key={ad.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link to={`/ad-details/${ad.companyId}/${ad.id}`}>{ad.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500">{ad.content}</p>
                    <div className="mt-2 flex space-x-1 text-sm text-gray-500">
                      {ad.sectors.map((sector, index) => (
                        <span key={index} className="bg-gray-200 rounded-full px-2 py-1">{sector}</span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        Gelen Teklifler ({ad.offersCount || 0})
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`bg-${ad.adType === 'Kapalı Usül Teklif' ? 'yellow' : 'green'}-100 text-${ad.adType === 'Kapalı Usül Teklif' ? 'yellow' : 'green'}-800 rounded-full px-3 py-1 text-xs font-medium`}>
                      {ad.adType}
                    </span>
                    <p className="mt-2 text-sm text-gray-500">{ad.createdAt.toDate().toLocaleDateString()}</p>
                    <div className="mt-4 flex space-x-2">
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                        Kaldır
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-gray-800 bg-yellow-100 hover:bg-yellow-200">
                        İlanı Beklemeye Al
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600">
                        İlanı Düzenle
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CombinedDashboard;

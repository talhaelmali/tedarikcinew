// SalerDashboard.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AdCard from './AdCard'; // AdCard bileşenini içe aktar

const db = getFirestore();

export default function SalerDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [ads, setAds] = useState([]);
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

          const allCompaniesQuery = query(collection(db, 'companies'));
          const allCompaniesSnapshot = await getDocs(allCompaniesQuery);
          const adsData = [];

          for (const companyDoc of allCompaniesSnapshot.docs) {
            if (companyDoc.id !== companyId) {
              const adsQuery = query(collection(db, 'companies', companyDoc.id, 'ads'));
              const adsSnapshot = await getDocs(adsQuery);

              adsSnapshot.forEach((adDoc) => {
                const adData = adDoc.data();
                if (adData.createdAt) {
                  adData.createdAt = adData.createdAt.toDate(); // Firestore timestamp'i date objesine çeviriyoruz
                }
                adsData.push({ id: adDoc.id, ...adData, companyId: companyDoc.id });
              });
            }
          }
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

  const otherAds = ads.filter(ad => ad.companyId !== company.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900">İlanlar</h2>
        {otherAds.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200 mt-4">
            {otherAds.map(ad => (
              <AdCard key={ad.id} ad={ad} /> // AdCard bileşenini kullan
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">Henüz bir ilan yok.</p>
        )}
      </div>
    </div>
  );
}

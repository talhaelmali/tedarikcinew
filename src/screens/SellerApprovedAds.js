import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, orderBy, limit, startAfter, where, collectionGroup } from 'firebase/firestore';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import SellerAdCard from '../components/SellerAdCard'; // Import the new component

const db = getFirestore();

const SellerApprovedAds = () => {
  const [ads, setAds] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalAds, setTotalAds] = useState(0);
  const [adsPerPage] = useState(3); // Sayfa başına gösterilecek ilan sayısı
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [companyIds, setCompanyIds] = useState([]);

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
    if (currentUser) {
      fetchCompany();
    }
  }, [currentUser]);

  useEffect(() => {
    if (companyIds.length > 0) {
      fetchAds();
      fetchTotalAds();
    }
  }, [companyIds, adsPerPage, searchQuery]);

  const fetchCompany = async () => {
    setLoading(true);
    const userCompanyQuery = query(collection(db, 'companies'), where('adminUserId', '==', currentUser.uid));
    const userCompanySnapshot = await getDocs(userCompanyQuery);

    let userCompanyId = null;

    if (!userCompanySnapshot.empty) {
      userCompanyId = userCompanySnapshot.docs[0].id;
    } else {
      const userQuery = query(collection(db, 'companies'), where('Users', 'array-contains', currentUser.uid));
      const userSnapshot = await getDocs(userQuery);

      if (!userSnapshot.empty) {
        userCompanyId = userSnapshot.docs[0].id;
      }
    }

    if (userCompanyId) {
      setCompanyIds([userCompanyId]);
    }
    setLoading(false);
  };

  const fetchAds = async () => {
    setLoading(true);
    let adsData = [];
    for (const companyId of companyIds) {
      const companyAdsQuery = searchQuery
        ? query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            where('title', '>=', searchQuery),
            where('title', '<=', searchQuery + '\uf8ff'),
            orderBy('title'),
            limit(adsPerPage)
          )
        : query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            orderBy('createdAt', 'desc'),
            limit(adsPerPage)
          );

      const companyAdsSnapshot = await getDocs(companyAdsQuery);

      companyAdsSnapshot.forEach((adDoc) => {
        const adData = adDoc.data();
        if (adData.createdAt && adData.createdAt.toDate) {
          adData.createdAt = adData.createdAt.toDate();
        }
        adsData.push({ id: adDoc.id, ...adData, companyId: adDoc.ref.parent.parent.id });
      });

      if (companyAdsSnapshot.docs.length > 0) {
        setLastVisible(companyAdsSnapshot.docs[companyAdsSnapshot.docs.length - 1]);
      }
    }
    setAds(adsData);
    setLoading(false);
  };

  const fetchTotalAds = async () => {
    let totalCount = 0;
    for (const companyId of companyIds) {
      const companyAdsQuery = searchQuery
        ? query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            where('title', '>=', searchQuery),
            where('title', '<=', searchQuery + '\uf8ff')
          )
        : query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId)
          );

      const companyAdsSnapshot = await getDocs(companyAdsQuery);
      totalCount += companyAdsSnapshot.size;
    }
    setTotalAds(totalCount);
  };

  const handleNextPage = async () => {
    setLoading(true);
    let adsData = [];
    for (const companyId of companyIds) {
      const companyAdsQuery = searchQuery
        ? query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            where('title', '>=', searchQuery),
            where('title', '<=', searchQuery + '\uf8ff'),
            orderBy('title'),
            startAfter(lastVisible),
            limit(adsPerPage)
          )
        : query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(adsPerPage)
          );

      const companyAdsSnapshot = await getDocs(companyAdsQuery);

      companyAdsSnapshot.forEach((adDoc) => {
        const adData = adDoc.data();
        if (adData.createdAt && adData.createdAt.toDate) {
          adData.createdAt = adData.createdAt.toDate();
        }
        adsData.push({ id: adDoc.id, ...adData, companyId: adDoc.ref.parent.parent.id });
      });

      if (companyAdsSnapshot.docs.length > 0) {
        setLastVisible(companyAdsSnapshot.docs[companyAdsSnapshot.docs.length - 1]);
      }
    }
    setAds(adsData);
    setLoading(false);
    setPage(page + 1);
  };

  const handlePreviousPage = async () => {
    if (page === 1) return;
    setLoading(true);
    let adsData = [];
    for (const companyId of companyIds) {
      const companyAdsQuery = searchQuery
        ? query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            where('title', '>=', searchQuery),
            where('title', '<=', searchQuery + '\uf8ff'),
            orderBy('title'),
            limit(page * adsPerPage)
          )
        : query(
            collectionGroup(db, 'ads'),
            where('approvedCompanyId', '==', companyId),
            orderBy('createdAt', 'desc'),
            limit(page * adsPerPage)
          );

      const companyAdsSnapshot = await getDocs(companyAdsQuery);

      companyAdsSnapshot.forEach((adDoc, index) => {
        if (index >= (page - 2) * adsPerPage) {
          const adData = adDoc.data();
          if (adData.createdAt && adData.createdAt.toDate) {
            adData.createdAt = adData.createdAt.toDate();
          }
          adsData.push({ id: adDoc.id, ...adData, companyId: adDoc.ref.parent.parent.id });
        }
      });

      if (companyAdsSnapshot.docs.length > 0) {
        setLastVisible(companyAdsSnapshot.docs[companyAdsSnapshot.docs.length - 1]);
      }
    }
    setAds(adsData);
    setLoading(false);
    setPage(page - 1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="İlan Ara..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-600 text-white rounded-r-md"
        >
          Ara
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">Kazandığınız İlanlar</h1>
      <p className="text-sm text-gray-500">Kazandığınız ilanlar arasından seçip sürece devam edebilirsiniz.</p>
      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {ads.map(ad => (
          <SellerAdCard key={ad.id} ad={ad} />
        ))}
      </ul>
      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
        <div className="-mt-px flex w-0 flex-1">
          <button
            onClick={handlePreviousPage}
            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${page === 1 && 'opacity-50 cursor-not-allowed'}`}
            disabled={page === 1}
          >
            <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Önceki
          </button>
        </div>
        <div className="hidden md:-mt-px md:flex">
          {Array.from({ length: Math.ceil(totalAds / adsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${page === i + 1 ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            onClick={handleNextPage}
            className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${page * adsPerPage >= totalAds && 'opacity-50 cursor-not-allowed'}`}
            disabled={page * adsPerPage >= totalAds}
          >
            Sonraki
            <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SellerApprovedAds;

import React, { useState, useEffect, useRef } from 'react';
import { collectionGroup, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import SellerOrderCard from '../components/SellerOrderCard';
import { useCompany } from '../context/CompanyContext';
import { db } from '../firebaseConfig';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersPerPage] = useState(5); // Sayfa başına gösterilecek sipariş sayısı
  const [totalOrders, setTotalOrders] = useState(0); // Toplam sipariş sayısı
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [lastVisible, setLastVisible] = useState(null); // Pagination için son görünen belge
  const loadMoreRef = useRef(); // DOM öğesi için referans

  const { company } = useCompany(); // CompanyContext'ten şirket bilgisini çekiyoruz

  useEffect(() => {
    if (company) {
      fetchOrders();
      fetchTotalOrders();
    }
  }, [company, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && orders.length < totalOrders) {
          handleNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current); // Unobserve yapmayı unutmayın
      }
    };
  }, [orders, totalOrders, lastVisible, loading]);

  const fetchOrders = async () => {
    setLoading(true);
    const ordersData = [];
    const companyOrdersQuery = searchQuery
      ? query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id),
          where('ad.title', '>=', searchQuery),
          where('ad.title', '<=', searchQuery + '\uf8ff'),
          orderBy('ad.title'),
          orderBy('ad.createdAt', 'desc'),
          limit(ordersPerPage)
        )
      : query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id),
          orderBy('ad.createdAt', 'desc'),
          limit(ordersPerPage)
        );

    const snapshot = await getDocs(companyOrdersQuery);
    snapshot.forEach((doc) => {
      const orderData = doc.data();
      if (orderData.ad.createdAt && orderData.ad.createdAt.toDate) {
        orderData.ad.createdAt = orderData.ad.createdAt.toDate();
      }
      ordersData.push({ id: doc.id, ...orderData });
    });

    setOrders(ordersData);
    setLoading(false);

    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Son belgeyi kaydediyoruz
    }
  };

  const fetchTotalOrders = async () => {
    const companyOrdersQuery = searchQuery
      ? query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id),
          where('ad.title', '>=', searchQuery),
          where('ad.title', '<=', searchQuery + '\uf8ff')
        )
      : query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id)
        );

    const snapshot = await getDocs(companyOrdersQuery);
    setTotalOrders(snapshot.size);
  };

  const handleNextPage = async () => {
    if (!lastVisible) return; // Eğer lastVisible yoksa sayfa ilerletme işlemi yapılmasın
    setLoading(true);
    const ordersData = [];
    const nextOrdersQuery = searchQuery
      ? query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id),
          where('ad.title', '>=', searchQuery),
          where('ad.title', '<=', searchQuery + '\uf8ff'),
          orderBy('ad.title'),
          orderBy('ad.createdAt', 'desc'),
          startAfter(lastVisible),
          limit(ordersPerPage)
        )
      : query(
          collectionGroup(db, 'orders'),
          where('bidderCompanyId', '==', company.id),
          orderBy('ad.createdAt', 'desc'),
          startAfter(lastVisible),
          limit(ordersPerPage)
        );

    const snapshot = await getDocs(nextOrdersQuery);
    snapshot.forEach((doc) => {
      const orderData = doc.data();
      if (orderData.ad.createdAt && orderData.ad.createdAt.toDate) {
        orderData.ad.createdAt = orderData.ad.createdAt.toDate();
      }
      ordersData.push({ id: doc.id, ...orderData });
    });

    setOrders((prevOrders) => [...prevOrders, ...ordersData]); // Yeni siparişleri mevcut siparişlere ekleyelim
    setLoading(false);

    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]); // Son belgeyi kaydediyoruz
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Sipariş Ara..."
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
      <h1 className="text-2xl font-semibold text-gray-900">Kazandığınız Siparişler</h1>
      <p className="text-sm text-gray-500">Toplam {totalOrders} siparişten {orders.length} gösteriliyor.</p>
      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {orders.map(order => (
          <SellerOrderCard key={order.id} order={order} />
        ))}
      </ul>

      {/* Lazy Loading için observer */}
      <div ref={loadMoreRef} className="h-10"></div>

      {loading && <div>Loading more orders...</div>}
    </div>
  );
};

export default SellerOrders;

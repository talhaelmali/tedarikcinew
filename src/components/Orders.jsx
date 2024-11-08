import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, query, orderBy, where } from 'firebase/firestore';
import OrderCard from '../components/OrderCard';
import { useCompany } from '../context/CompanyContext';

const db = getFirestore();

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Şu anki sayfa numarası
  const [ordersPerPage] = useState(5); // Her sayfada 5 sipariş gösterilecek
  const [totalOrders, setTotalOrders] = useState(0); // Toplam sipariş sayısı
  const [nextPageOrders, setNextPageOrders] = useState([]); // Bir sonraki sayfanın verileri

  const { company } = useCompany();

  useEffect(() => {
    if (company) {
      fetchOrders(company.id);
    }
  }, [company, searchQuery, currentPage]);

  const fetchOrders = async (companyId) => {
    setLoading(true);
    const ordersData = [];

    const ordersQuery = searchQuery
      ? query(
          collection(db, 'orders'),
          where('companyId', '==', companyId),
          where('ad.title', '>=', searchQuery),
          where('ad.title', '<=', searchQuery + '\uf8ff'),
          orderBy('ad.title'),
          orderBy('ad.createdAt', 'desc') // En yeni en üstte sıralama
        )
      : query(
          collection(db, 'orders'),
          where('companyId', '==', companyId),
          orderBy('ad.createdAt', 'desc') // En yeni en üstte sıralama
        );

    const ordersSnapshot = await getDocs(ordersQuery);

    ordersSnapshot.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      if (orderData.ad.createdAt && orderData.ad.createdAt.toDate) {
        orderData.ad.createdAt = orderData.ad.createdAt.toDate();
      }
      ordersData.push({ id: orderDoc.id, ...orderData, companyId });
    });

    ordersData.sort((a, b) => b.ad.createdAt - a.ad.createdAt);

    setTotalOrders(ordersData.length); // Toplam sipariş sayısını kaydet
    setOrders(ordersData.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)); // Şu anki sayfadaki siparişleri kaydet

    // Sonraki sayfa için verileri önceden yükleme
    const nextOrdersData = ordersData.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage);
    setNextPageOrders(nextOrdersData);

    setLoading(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Yeni bir arama yapıldığında sayfa sıfırlanacak
  };

  // Şu anki sayfada gösterilecek siparişlerin indeksleri
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const totalPages = Math.ceil(totalOrders / ordersPerPage); // Toplam sayfa sayısı

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-indigo-500"
          placeholder="Sipariş Ara..."
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

      {/* Üst kısımda xxx kadar siparişten xxx kadarı gösteriliyor */}
      <p className="text-sm text-gray-500 mb-4">
        {totalOrders} sipariş arasından {indexOfFirstOrder + 1} - {Math.min(indexOfLastOrder, totalOrders)} gösteriliyor
      </p>

      <h1 className="text-2xl font-semibold text-gray-900">Siparişler</h1>
      <p className="text-sm text-gray-500">Siparişlerinizin listesini görüntüleyebilirsiniz.</p>

      <ul role="list" className="divide-y divide-gray-200 mt-4">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ul>

      {/* Pagination butonları */}
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
};

export default Orders;

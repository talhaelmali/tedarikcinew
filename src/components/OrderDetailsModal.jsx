import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

const OrderDetailsModal = ({ order, closeModal }) => {
  const [buyerData, setBuyerData] = useState(null);
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async (companyId, setCompanyData) => {
      const docRef = doc(db, 'companies', companyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCompanyData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    if (order.companyId) {
      fetchCompanyData(order.companyId, setBuyerData);
    }
    if (order.bid && order.bid.bidderCompanyId) {
      fetchCompanyData(order.bid.bidderCompanyId, setSellerData);
    }
  }, [order.companyId, order.bid]);

  const adImages = Array.isArray(order.ad.images) ? order.ad.images : [];

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Sipariş Detayları" ariaHideApp={false} className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">İlan Detay</h2>

        <div className="flex items-center mb-4">
          <div className="flex-1">
            <div className="flex items-center">
              <img src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e" alt="Alıcı" className="h-10 w-10 rounded-full" />
              <div className="ml-4">
                <h3 className="text-lg font-bold">{buyerData?.companyName || 'Alıcı'}</h3>
                <p className="text-sm text-gray-500">ALICI: {buyerData?.companyName || 'N/A'}</p>
                <p className="text-sm text-gray-500">ID: {order.companyId}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-end">
              <img src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e" alt="Satıcı" className="h-10 w-10 rounded-full" />
              <div className="ml-4 text-right">
                <h3 className="text-lg font-bold">{sellerData?.companyName || 'Satıcı'}</h3>
                <p className="text-sm text-gray-500">SATICI: {sellerData?.companyName || 'N/A'}</p>
                <p className="text-sm text-gray-500">ID: {order.bid?.bidderCompanyId}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold">{order.ad.title}</h3>
            <p className="text-sm text-gray-500">{order.ad.description}</p>
            <div className="flex space-x-2 mt-2">
              {order.ad.sectors.map((sector, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">{sector}</span>
              ))}
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-blue-600 font-bold text-xl">TUTAR: {order.bid.bidAmount} ₺</p>
          </div>
        </div>

        <div className="mb-4">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{order.ad.adType}</span>
          <span className="ml-4 text-gray-500">{new Date(order.ad.createdAt.seconds * 1000).toLocaleDateString()}</span>
          <span className="ml-4 text-gray-500">İlan Süresi: {order.ad.duration}</span>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">{order.ad.content}</p>
          <div className="flex mt-4">
            {adImages.map((image, index) => (
              <img key={index} src={image} alt={`Görsel ${index + 1}`} className="h-24 w-24 object-cover mr-2" />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input type="checkbox" checked={order.ad.requestSample} className="mr-2" readOnly />
            Numune talep ediyor.
          </label>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Termin Tarihi: {new Date(order.ad.dueDate.seconds * 1000).toLocaleDateString()}</span>
          <span className="text-gray-500">İlan Süresi: {order.ad.duration}</span>
        </div>

      </div>
    </Modal>
  );
};

export default OrderDetailsModal;

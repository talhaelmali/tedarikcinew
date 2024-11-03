import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import DeliveryModal from './DeliveryModal';  // If you have this component
import RatingModal from './RatingModal';      // If you have this component
import OrderDetailsModal from './OrderDetailsModal'; // Import the OrderDetails Modal
import Modal from './Modal';  // Import Modal here
import { db, storage } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

const SellerOrderCard = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [invoiceUrl, setInvoiceUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false); // State for order details modal

  const createdAt = order.ad.createdAt && order.ad.createdAt instanceof Date ? order.ad.createdAt.toLocaleDateString() : "Tarih yok";

  // Fetch logistics data from the logistics subcollection
  const fetchLogisticsStatus = async () => {
    try {
      const docRef = doc(db, 'orders', order.id, 'logistics', order.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedDelivery(docSnap.data());
      } else {
        setSelectedDelivery({ description: 'Kargo / Lojistik bilgileri bekleniyor', status: 'pending' });
      }
    } catch (error) {
      console.error('Error fetching logistics data:', error);
      Swal.fire('Hata!', 'Kargo / Lojistik durumu yüklenirken bir hata oluştu.', 'error');
    }
  };

  // Fetch company name based on companyId
  const fetchCompanyName = async () => {
    try {
      const companyRef = doc(db, 'companies', order.companyId);
      const companySnap = await getDoc(companyRef);
      if (companySnap.exists()) {
        setCompanyName(companySnap.data().companyName);
      } else {
        setCompanyName('Firma adı bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching company name:', error);
      Swal.fire('Hata!', 'Firma bilgisi yüklenirken bir hata oluştu.', 'error');
    }
  };

  // Fetch existing invoice if available
  const fetchInvoice = async () => {
    try {
      const orderRef = doc(db, 'orders', order.id);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        setInvoiceUrl(orderSnap.data().invoiceUrl);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      Swal.fire('Hata!', 'Fatura bilgisi yüklenirken bir hata oluştu.', 'error');
    }
  };

  useEffect(() => {
    fetchLogisticsStatus();
    fetchCompanyName();
    fetchInvoice();
  }, []);

  // Handle file upload (PDF or image formats)
  const handleInvoiceUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (fileSizeMB > 20) {
      Swal.fire('Hata!', 'Fatura dosyası maksimum 20MB olmalıdır.', 'error');
      return;
    }
    if (!validFileTypes.includes(file.type)) {
      Swal.fire('Hata!', 'Sadece PDF, JPEG veya PNG formatında dosya yükleyebilirsiniz.', 'error');
      return;
    }

    setUploading(true);
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `invoices/${order.id}/${uniqueFileName}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setInvoiceUrl(downloadURL);

      await updateDoc(doc(db, 'orders', order.id), {
        invoiceUrl: downloadURL,
        invoiceUploadedAt: new Date(),
      });

      Swal.fire('Başarılı!', 'Fatura başarıyla yüklendi.', 'success');
    } catch (error) {
      console.error('Error uploading invoice:', error);
      Swal.fire('Hata!', 'Fatura yüklenirken bir hata oluştu.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Render order status based on logistics data with badges
  const renderOrderStatus = () => {
    if (selectedDelivery) {
      if (selectedDelivery.status === 'accepted') {
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Kabul Edildi</span>;
      } else if (selectedDelivery.status === 'rejected') {
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">Reddedildi</span>;
      } else if (selectedDelivery.description === 'Kargo / Lojistik bilgileri bekleniyor') {
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Kargo / Lojistik Bekleniyor</span>;
      } else if (selectedDelivery.status === 'pending' && selectedDelivery.description !== 'Kargo / Lojistik bilgileri bekleniyor') {
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Bilgiler Güncellendi, İşlem Bekleniyor</span>;
      } else {
        return <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">Beklemede</span>;
      }
    }
    return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Durum Bilinmiyor</span>;
  };

  const handleOpenOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
  };

  return (
    <li className="py-4">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col space-y-2 w-full sm:w-auto">
        <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap">
          {order.ad.sectors.map((sector, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {sector}
            </span>
          ))}
        </div>

          <div className="flex flex-col space-y-1">
            <h3 className="text-sm font-medium text-gray-900">
              {order.ad.title}
            </h3>
            <span className="text-blue-600 text-xs">#{order.id}</span>
          </div>
          <p className="text-sm text-gray-500">{order.ad.content}</p>
          <p className="text-ml text-gray-900">
            <span className="font-semibold">Firma:</span>{' '}
            <span className="text-blue-700 font-bold">{companyName}</span>
          </p>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto"
            >
              Kargo / Lojistik Bilgileri
            </button>

            <Link 
              to={`/chat/${order.id}/${order.companyId}/${order.bidderCompanyId}`} 
              className="flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              Firmayla İletişime Geç
            </Link>

            {invoiceUrl ? (
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto"
              >
                Faturayı Göster
              </a>
            ) : (
              <label className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium cursor-pointer w-full sm:w-auto">
                {uploading ? 'Yükleniyor...' : 'Fatura Yükle'}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf, image/jpeg, image/png"
                  onChange={handleInvoiceUpload}
                  disabled={uploading}
                />
              </label>
            )}

            <button
              onClick={handleOpenOrderDetailsModal}
              className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto"
            >
              Sipariş Detaylarını Görüntüle
            </button>
          </div>
        </div>

        <div className="text-right space-y-2 w-full sm:w-auto">
          <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0 justify-end">
            <span className="text-xs">{renderOrderStatus()}</span> 
            <span className="text-gray-500 text-xs">{createdAt}</span>
          </div>
        </div>
      </div>

      {isOrderDetailsModalOpen && (
        <OrderDetailsModal order={order} closeModal={handleCloseOrderDetailsModal} />
      )}

      {isModalOpen && selectedDelivery && (
        <Modal
          order={order}
          delivery={selectedDelivery}
          readonly={!!selectedDelivery} 
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </li>
  );
};

export default SellerOrderCard;

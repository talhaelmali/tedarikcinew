import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import DeliveryModal from './DeliveryModal';
import RatingModal from './RatingModal';
import OrderDetailsModal from './OrderDetailsModal'; 
import { db, storage } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

const OrderCard = ({ order }) => {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false); 
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null); 
  const [uploading, setUploading] = useState(false); 
  const [largeImageUrl, setLargeImageUrl] = useState(null); 

  const createdAt = order.ad.createdAt && order.ad.createdAt instanceof Date ? order.ad.createdAt.toLocaleDateString() : 'Tarih yok';

  useEffect(() => {
    fetchLogisticsStatus();
    fetchInvoice(); 
  }, []);

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

  const handleConfirmDelivery = async () => {
    const confirm = await Swal.fire({
      title: 'Teslimatı onaylamak istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, onayla!',
      cancelButtonText: 'Hayır, iptal et',
    });

    if (confirm.isConfirmed && selectedDelivery?.id) {
      try {
        const docRef = doc(db, 'orders', order.id, 'logistics', order.id);
        await updateDoc(docRef, {
          isApproved: true,
          status: 'accepted',
          updatedAt: new Date(),
        });

        setSelectedDelivery((prevState) => ({
          ...prevState,
          isApproved: true,
          status: 'accepted',
        }));

        Swal.fire('Başarılı!', 'Teslimat onaylandı.', 'success');

        setIsRatingModalOpen(true);
        setIsDeliveryModalOpen(false);
      } catch (error) {
        console.error('Teslimat onaylanırken hata oluştu:', error);
        Swal.fire('Hata!', 'Teslimat onaylanırken bir hata oluştu.', 'error');
      }
    }
  };

  const renderOrderStatus = () => {
    if (selectedDelivery) {
      if (selectedDelivery.status === 'accepted') {
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Kabul Edildi</span>;
      } else if (selectedDelivery.status === 'rejected') {
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Reddedildi</span>;
      } else if (selectedDelivery.description === 'Kargo / Lojistik bilgileri bekleniyor') {
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Kargo / Lojistik Bekleniyor</span>;
      } else if (selectedDelivery.status === 'pending' && selectedDelivery.description !== 'Kargo / Lojistik bilgileri bekleniyor') {
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Bilgiler Güncellendi</span>;
      } else {
        return <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Beklemede</span>;
      }
    }
    return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded overflow-hidden">Durum Bilinmiyor</span>;
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
                className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded max-w-[150px] overflow-hidden text-ellipsis"
              >
                {sector}
              </span>
            ))}
          </div>
          <div className="flex flex-col space-y-1">
            <h3 className="text-sm font-medium text-gray-900">{order.ad.title}</h3>
            <span className="text-blue-600 text-xs">#{order.id}</span>
          </div>
          <p className="text-sm text-gray-500">{order.ad.content}</p>
          <p className="text-ml text-gray-900">
            <span className="font-semibold">Firma:</span>{' '}
            <span className="text-blue-700 font-bold">{order.bid.bidderCompanyName}</span>
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            {selectedDelivery?.description === 'Kargo / Lojistik bilgileri bekleniyor' ? (
              <button
                disabled
                className="bg-gray-300 text-gray-600 px-2 py-1 rounded-md text-xs font-medium cursor-not-allowed w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px]"
              >
                Kargo / Lojistik Bekleniyor
              </button>
            ) : (
              <button
                onClick={() => setIsDeliveryModalOpen(true)}
                className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px]"
              >
                Kargo / Lojistik Bilgileri
              </button>
            )}

<Link
  to={`/chat/${order.id}/${order.companyId}/${order.bid.bidderCompanyId}`}
  className="flex items-center bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px] leading-tight" // or align-middle
>
  Firmayla İletişime Geç
</Link>

            {invoiceUrl ? (
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px]"
              >
                Faturayı Göster
              </a>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-600 px-2 py-1 rounded-md text-xs font-medium cursor-not-allowed w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px]"
              >
                Fatura Bekleniyor
              </button>
            )}

            <button
              onClick={handleOpenOrderDetailsModal}
              className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium w-full sm:w-auto overflow-hidden text-ellipsis max-w-[150px]"
            >
              Sipariş Detaylarını Görüntüle
            </button>
          </div>
        </div>

        <div className="text-right space-y-2 w-full sm:w-auto">
          <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0 justify-end">
            <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{renderOrderStatus()}</span>
            <span className="text-gray-500 text-xs overflow-hidden text-ellipsis whitespace-nowrap">{createdAt}</span>
          </div>
        </div>
      </div>

      {isDeliveryModalOpen && selectedDelivery && (
        <DeliveryModal
          orderId={order.id}
          delivery={selectedDelivery}
          closeModal={() => setIsDeliveryModalOpen(false)}
          confirmDelivery={selectedDelivery.description !== 'Kargo / Lojistik bilgileri bekleniyor' ? handleConfirmDelivery : null}
          onImageClick={(url) => setLargeImageUrl(url)}
        />
      )}

      {isOrderDetailsModalOpen && (
        <OrderDetailsModal order={order} closeModal={handleCloseOrderDetailsModal} />
      )}

      {isRatingModalOpen && <RatingModal companyId={order.bid.bidderCompanyId} closeModal={() => setIsRatingModalOpen(false)} />}

      {largeImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <img src={largeImageUrl} alt="Large View" className="max-w-full max-h-screen" />
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full"
              onClick={() => setLargeImageUrl(null)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default OrderCard;

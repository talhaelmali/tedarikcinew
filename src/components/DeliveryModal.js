import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Swal from 'sweetalert2';
import ReactStars from 'react-rating-stars-component';

const DeliveryModal = ({ orderId, companyId, closeModal }) => {
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState('pending');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState({ speed: 0, communication: 0, quality: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bidderCompanyId, setBidderCompanyId] = useState(''); // Bidder Company ID'si için state

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        // Önce siparişin genel bilgilerini çekiyoruz
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
    
        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          
          // BidderCompanyId'yi sipariş verisinden alıyoruz
          const bid = orderData.bid;
          if (bid && bid.bidderCompanyId) {
            setBidderCompanyId(bid.bidderCompanyId); // bidderCompanyId'yi buradan alıyoruz
          } else {
            Swal.fire('Hata!', 'Bid verisi veya bidderCompanyId bulunamadı.', 'error');
          }
  
          // Logistics bilgilerini de çekiyoruz
          const logisticsRef = doc(db, 'orders', orderId, 'logistics', orderId);
          const logisticsSnap = await getDoc(logisticsRef);
    
          if (logisticsSnap.exists()) {
            const logisticsData = logisticsSnap.data();
            setLogisticsCompany(logisticsData.logisticsCompany || '');
            setTrackingCode(logisticsData.trackingCode || '');
            setImages(logisticsData.images || []);
            setStatus(logisticsData.status || 'pending');
          } else {
            Swal.fire('Hata!', 'Lojistik verisi bulunamadı.', 'error');
          }
        } else {
          Swal.fire('Hata!', 'Sipariş verisi bulunamadı.', 'error');
        }
      } catch (error) {
        console.error('Error fetching logistics data:', error);
        Swal.fire('Hata!', 'Lojistik verisi alınırken bir hata oluştu.', 'error');
      }
    };
  
    fetchLogisticsData();
  }, [orderId]);
  
  

  const handleConfirmDelivery = async () => {
    const confirm = await Swal.fire({
      title: 'Teslimatı onaylamak istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, onayla!',
      cancelButtonText: 'Hayır, iptal et',
    });

    if (confirm.isConfirmed) {
      try {
        setIsLoading(true);

        await updateDoc(doc(db, 'orders', orderId, 'logistics', orderId), {
          isApproved: true,
          status: 'accepted',
          updatedAt: new Date(),
        });

        setStatus('accepted');
        setIsLoading(false);
        setShowRatingModal(true);

      } catch (error) {
        console.error('Teslimat onaylanırken hata oluştu:', error);
        Swal.fire('Hata!', 'Teslimat onaylanırken bir hata oluştu.', 'error');
        setIsLoading(false);
      }
    }
  };

  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({ ...prevRatings, [category]: value }));
  };

  const handleSubmitRating = async () => {
    if (!bidderCompanyId) {
      Swal.fire('Hata!', 'Geçerli bir şirket ID bulunamadı.', 'error');
      return;
    }

    try {
      // Firestore'a rating verilerini kaydet
      await addDoc(collection(db, 'companies', bidderCompanyId, 'ratings'), ratings);

      setShowRatingModal(false);
      closeModal();

      // Değerlendirme tamamlandıktan sonra Swal göster
      Swal.fire('Başarılı!', 'Teslimat onaylandı ve firma puanlandı.', 'success');
      window.location.reload();

    } catch (error) {
      console.error('Değerlendirme kaydedilirken hata oluştu:', error);
      Swal.fire('Hata!', 'Değerlendirme kaydedilirken bir hata oluştu.', 'error');
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {!showRatingModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Kargo / Lojistik Bilgileri</h3>
              <div className="mt-2">
                {(status === 'accepted' || status === 'pending') ? (
                  <>
                    <p className="text-sm text-gray-500">
                      <strong>Lojistik/Kargo Firması Adı:</strong> {logisticsCompany}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Takip Kodu:</strong> {trackingCode}
                    </p>
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`delivery-${index}`}
                            className="w-full h-auto rounded-md cursor-pointer"
                            onClick={() => handleImageClick(image)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Kargo / Lojistik bilgileri bekleniyor...</p>
                )}
              </div>
              <div className="mt-4 sm:mt-6 sm:flex sm:flex-row-reverse">
                {status === 'pending' && (
                  <button
                    onClick={handleConfirmDelivery}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Teslimatı Onayla
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>

          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative">
                <img src={selectedImage} alt="Selected" className="max-w-full max-h-screen object-contain" />
                <button
                  onClick={handleCloseImageModal}
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white text-lg">Yükleniyor...</div>
        </div>
      )}

      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Firmayı Değerlendir</h2>
            <div className="mb-4">
              {['speed', 'communication', 'quality'].map((category) => (
                <div key={category} className="mb-2">
                  <label className="block text-gray-700 mb-1">{category === 'speed' ? 'Hız' : category === 'communication' ? 'İletişim' : 'Kalite'}</label>
                  <ReactStars
                    count={5}
                    onChange={(value) => handleRatingChange(category, value)}
                    size={24}
                    isHalf={true}
                    value={ratings[category]} // Varsayılan değerleri doğrudan kullanıyoruz
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowRatingModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded-md">Vazgeç</button>
              <button onClick={handleSubmitRating} className="bg-blue-600 text-white px-4 py-2 rounded-md">Değerlendir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeliveryModal;

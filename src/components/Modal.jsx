import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig'; // Firestore and Storage imports
import Swal from 'sweetalert2';

const Modal = ({ order, closeModal }) => {
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // Track if data is being saved
  const [readonly, setReadonly] = useState(false); // Yeni veri yokken düzenleme izni

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        const docRef = doc(db, 'orders', order.id, 'logistics', order.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setLogisticsCompany(data.logisticsCompany || '');
          setTrackingCode(data.trackingCode || '');
          setExistingImages(data.images || []);
          setReadonly(true); // Veri varsa sadece görüntüleme moduna geç
        } else {
          setReadonly(false); // Veri yoksa düzenleme izni ver
        }
      } catch (error) {
        console.error('Lojistik verileri alınırken hata oluştu:', error);
      }
    };

    fetchLogisticsData();
  }, [order.id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  // Fotoğrafı kaldırma fonksiyonu
  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (readonly) return; // Eğer sadece görüntüleme modundaysa veri eklenemez

    setIsSaving(true);

    try {
      const imageUrls = await Promise.all(
        uploadedImages.map(async (image) => {
          const imageRef = ref(storage, `order-images/${order.id}/${image.name}`);
          await uploadBytes(imageRef, image);
          const downloadURL = await getDownloadURL(imageRef);
          return downloadURL;
        })
      );

      const orderRef = doc(db, 'orders', order.id, 'logistics', order.id);
      await setDoc(orderRef, {
        logisticsCompany,
        trackingCode,
        images: [...existingImages, ...imageUrls],
        createdAt: new Date(),
      });

      Swal.fire('Başarılı!', 'Lojistik bilgileri başarıyla kaydedildi.', 'success');
      closeModal(); // Veri kaydedildikten sonra modal kapatılır
    } catch (error) {
      console.error('Lojistik bilgileri kaydedilirken hata oluştu:', error);
      Swal.fire('Hata!', 'Lojistik bilgileri kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Lojistik Bilgileri</h3>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="logisticsCompany" className="block text-sm font-medium text-gray-700">
                Lojistik Şirketi
              </label>
              <input
                type="text"
                id="logisticsCompany"
                placeholder="Lojistik Şirketi Adı"
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                value={logisticsCompany}
                required
                onChange={(e) => setLogisticsCompany(e.target.value)}
                disabled={readonly} // Veri varsa sadece görüntüleme
              />
            </div>

            <div>
              <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700">
                Takip Kodu
              </label>
              <input
                type="text"
                id="trackingCode"
                placeholder="Takip Kodu"
                required
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                disabled={readonly} // Veri varsa sadece görüntüleme
              />
            </div>

            {/* Resim Yükleme Alanı */}
            {!readonly && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Resim Yükle</label>
                <input
                  type="file"
                  multiple
                  required
                  accept="image/*"
                  className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                  onChange={handleImageUpload}
                />
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700">Yüklenen Resimler</h4>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {existingImages.map((image, index) => (
                  <img key={index} src={image} alt={`Mevcut-${index}`} className="w-full h-auto rounded-md" />
                ))}
                {uploadedImages.length > 0 && uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(image)} alt={`Yüklenen-${index}`} className="w-full h-auto rounded-md" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
            {!readonly && (
              <button
                onClick={handleSubmit}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm ${
                  isSaving ? 'cursor-not-allowed' : ''
                }`}
                disabled={isSaving} // Veri kaydediliyorken buton devre dışı
              >
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            )}
            <button
              onClick={closeModal}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

import React, { useState } from 'react';
import Modal from 'react-modal';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReactStars from 'react-rating-stars-component';

const db = getFirestore();

const RatingModal = ({ companyId, closeModal }) => {
  const [ratings, setRatings] = useState({ speed: 0, communication: 0, quality: 0 });

  const handleRatingChange = (category, value) => {
    setRatings((prevRatings) => ({ ...prevRatings, [category]: value }));
  };

  const handleSubmitRating = async () => {
    try {
      await addDoc(collection(db, 'companies', companyId, 'ratings'), ratings);
      Swal.fire('Başarılı!', 'Değerlendirmeniz kaydedildi.', 'success');
      closeModal();
    } catch (error) {
      console.error('Değerlendirme kaydedilirken hata oluştu:', error);
      Swal.fire('Hata!', 'Değerlendirme kaydedilirken bir hata oluştu.', 'error');
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} contentLabel="Firmayı Değerlendir" ariaHideApp={false} className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative z-40">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
          <XMarkIcon className="h-6 w-6" />
        </button>
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
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
                value={ratings[category]}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={closeModal} className="bg-gray-300 text-black px-4 py-2 rounded-md">Vazgeç</button>
          <button onClick={handleSubmitRating} className="bg-blue-600 text-white px-4 py-2 rounded-md">Değerlendir</button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { db, storage } from '../firebaseConfig';
import Swal from 'sweetalert2';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Modal.setAppElement('#root');

const EditAdModal = ({ isOpen, onRequestClose, adId, companyId, adData }) => {
  const [title, setTitle] = useState(adData?.title || '');
  const [content, setContent] = useState(adData?.content || '');
  const [sectors, setSectors] = useState(adData?.sectors || []);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [maxBid, setMaxBid] = useState(adData?.maxBid || '');
  const [dueDate, setDueDate] = useState(adData?.dueDate ? new Date(adData.dueDate.seconds * 1000) : null);
  const [images, setImages] = useState(adData?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [requestSample, setRequestSample] = useState(adData?.requestSample || false);

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const q = query(collection(db, 'sectors'), where('type', '==', 'Alt Sektör'));
      const querySnapshot = await getDocs(q);
      const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
      const uniqueSectors = [...new Set(fetchedSectors)].sort((a, b) => a.localeCompare(b));
      const options = uniqueSectors.map(sector => ({
        value: sector,
        label: sector,
      }));
      setSectorOptions(options);
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
  };

  const handleSectorChange = (selectedOptions) => {
    setSectors(selectedOptions.map(option => option.value));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImageFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewImages([...newImages, ...newImageFiles]);
  };

  const handleRemoveImage = (imageToRemove) => {
    setImages(images.filter((image) => image !== imageToRemove));
    setNewImages(newImages.filter(image => image.preview !== imageToRemove.preview));
  };

  const uploadImageToStorage = async (file) => {
    const storageRef = ref(storage, `ads/${adId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSaveChanges = async () => {
    if (sectors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'En az bir sektör seçmelisiniz.',
      });
      return;
    }

    try {
      let uploadedImageUrls = [];
      for (const image of newImages) {
        const imageUrl = await uploadImageToStorage(image.file);
        uploadedImageUrls.push(imageUrl);
      }

      const allImages = [...images, ...uploadedImageUrls];
      const adRef = doc(db, 'companies', companyId, 'ads', adId);
      await updateDoc(adRef, {
        title,
        content,
        sectors,
        maxBid: parseFloat(maxBid),
        dueDate: dueDate || null,
        requestSample,
        images: allImages,
      });

      Swal.fire({
        icon: 'success',
        title: 'İlan başarıyla güncellendi!',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        onRequestClose();
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İlan güncellenirken bir hata oluştu.',
      });
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      className="relative bg-white rounded-lg shadow-lg max-h-[90vh] w-full max-w-4xl overflow-y-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-4">İlan Düzenle</h2>

      {/* İlan Başlığı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">İlan Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="İlan başlığı girin"
          />
        </div>

        {/* Max Fiyat Teklifi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Fiyat Teklifi</label>
          <input
            type="number"
            value={maxBid}
            onChange={(e) => setMaxBid(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Maksimum fiyat teklifini girin"
          />
        </div>
      </div>

      {/* İlan İçeriği */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">İlan İçeriği</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholder="İlan içeriğini girin"
        />
      </div>

      {/* Sektörler */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Sektörler</label>
        <Select
          isMulti
          name="sectors"
          options={sectorOptions}
          value={sectorOptions.filter((option) => sectors.includes(option.value))}
          onChange={handleSectorChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          classNamePrefix="select"
        />
      </div>

      {/* Termin Tarihi */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Termin Tarihi</label>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="dd/MM/yyyy"
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          placeholderText="Termin tarihi seçin"
        />
      </div>

      {/* Görseller */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Görseller</label>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mt-2" />
        <div className="mt-4 flex flex-wrap gap-2">
          {newImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.preview} alt="Ad" className="h-24 w-24 object-cover rounded" />
              <button
                onClick={() => handleRemoveImage(image)}
                className="absolute top-0 right-0 text-red-500 text-lg"
              >
                &times;
              </button>
            </div>
          ))}
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt="Ad" className="h-24 w-24 object-cover rounded" />
              <button
                onClick={() => handleRemoveImage(image)}
                className="absolute top-0 right-0 text-red-500 text-lg">
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Numune Talep Ediyor Mu? */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Numune Talep Ediyor Mu?</label>
        <div className="mt-1">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={requestSample}
              onChange={(e) => setRequestSample(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Numune Talep Ediyor</span>
          </label>
        </div>
      </div>

      {/* Kaydet ve İptal Butonları */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Kaydet
        </button>
        <button
          onClick={onRequestClose}
          className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          İptal
        </button>
      </div>
    </Modal>
  );
};

export default EditAdModal;

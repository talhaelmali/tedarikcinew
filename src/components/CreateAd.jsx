import React, { useState, useEffect } from 'react';
import { collection, addDoc, getFirestore, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();
const storage = getStorage();

export default function CreateAd() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]); // Yüklenen resimler (URL formatında)
  const [images, setImages] = useState([]); // Yüklenen dosyalar
  const navigate = useNavigate();
  const [formError, setFormError] = useState(''); // Validasyon hatası için state


  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sectors: [],
    dueDate: '',
    duration: '3',
    paymentMethod: '',
    maxBid: '',
    requestSample: false,
    adType: '',
    quantity: '',
    unit: '',
  });

  // Kullanıcıyı takip etme
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

  // Şirket ve sektör bilgilerini getirme
  useEffect(() => {
    const fetchCompanyAndSectors = async () => {
      if (currentUser) {
        const q = query(collection(db, 'companies'), where('adminUserId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        let companyData = null;
        let companyId = null;

        querySnapshot.forEach((doc) => {
          companyData = doc.data();
          companyId = doc.id;
        });

        if (!companyData) {
          const q2 = query(collection(db, 'companies'), where('Users', 'array-contains', currentUser.uid));
          const querySnapshot2 = await getDocs(q2);

          querySnapshot2.forEach((doc) => {
            companyData = doc.data();
            companyId = doc.id;
          });
        }

        if (companyData) {
          setCompany({ ...companyData, id: companyId });
        }

        const sectorQuery = query(collection(db, 'sectors'), where('type', '==', 'Alt Sektör'));
        const sectorSnapshot = await getDocs(sectorQuery);
        const sectors = sectorSnapshot.docs.map((doc) => ({
          value: doc.data().name,
          label: doc.data().name,
        }));
        setSectorOptions(sectors);
        setLoading(false);
      }
    };

    fetchCompanyAndSectors();
  }, [currentUser]);

  const formatNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, ''); // Sadece rakamları bırak
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Binlik ayırıcı ekle
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: formatNumber(value),
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      handleImageUpload(files);
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  // Birden fazla resim yükleme fonksiyonu
  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 5 - uploadedImages.length); // Max 5 resim
    const imagePreviews = newImages.map((file) => URL.createObjectURL(file));

    setUploadedImages([...uploadedImages, ...imagePreviews]); // Resim önizlemeleri
    setImages([...images, ...newImages]); // Yükleme için dosyalar
  };

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    const updatedFiles = images.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setImages(updatedFiles);
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      sectors: selectedOptions.map((option) => option.value),
    });
  };

  const handleUnitChange = (selectedOption) => {
    setFormData({
      ...formData,
      unit: selectedOption.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.adType) {
      setFormError('Lütfen bir teklif tipi seçiniz.');
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Lütfen bir teklif tipi seçiniz.',
      });
      return;
    }
  
    if (!company || !company.isBuyer || company.isBuyerConfirmed !== 'yes') {
      Swal.fire({
        icon: 'error',
        title: 'Erişim Engellendi',
        text: 'İlan oluşturabilmek için alıcı olarak onaylanmış olmalısınız.',
      });
      return;
    }
  
    try {
      const dueDateWithTime = new Date(formData.dueDate);
      dueDateWithTime.setHours(0, 0, 0, 0);
  
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await Promise.all(
          images.map(async (image, index) => {
            const imageRef = ref(storage, `ads/${currentUser.uid}/${index}-${image.name}`);
            await uploadBytes(imageRef, image);
            return await getDownloadURL(imageRef);
          })
        );
      }
  
      const cleanedMaxBid = formData.maxBid.replace(/[.]/g, '');
      const cleanedQuantity = formData.quantity.replace(/[.]/g, '');
  
      // `createdAt`'e `duration` gün ekleyerek `endDate` hesapla
      const createdAt = new Date();
      const duration = parseInt(formData.duration);
      const endDate = new Date(createdAt);
      endDate.setDate(endDate.getDate() + duration);
  
      const adData = {
        ...formData,
        maxBid: cleanedMaxBid,
        quantity: cleanedQuantity,
        images: imageUrls,
        userId: currentUser.uid,
        companyId: company.id,
        dueDate: dueDateWithTime,
        createdAt: serverTimestamp(),
        endDate: endDate, // endDate verisini ekleyin
      };
  
      await addDoc(collection(db, 'companies', company.id, 'ads'), adData);
  
      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'İlan başarıyla oluşturuldu.',
      }).then(() => {
        navigate('/dashboard');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'İlan oluşturulurken bir hata oluştu: ' + error.message,
      });
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company || !company.isBuyer || company.isBuyerConfirmed !== 'yes') {
    return <div>İlan oluşturmak için alıcı olarak onaylanmış olmalısınız.</div>;
  }

  const unitOptions = [
    { value: 'Adet', label: 'Adet' },
    { value: 'Kilo', label: 'Kilo' },
    { value: 'Paket', label: 'Paket' },
  ];

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <h2 className="text-lg font-medium leading-6 text-gray-900">İlan Detayları</h2>
      <p className="mt-1 text-sm text-gray-500">Oluşturmak istediğiniz ilanın detaylarını giriniz.</p>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
          
          {/* İlan Başlığı */}
<div className='sm:col-span-4 grid grid-cols-1 sm:gap-x-6 sm:grid-cols-2'>
  <div className='sm:col-span-1'>
  <div className="">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">İlan Başlığı</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* İlan İçeriği */}
          <div className="">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">İlan İçeriği</label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
  </div>

  <div className="sm:col-span-1">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Görseller (Maksimum 5 adet)</label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <input
                type="file"
                name="images"
                id="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <span>Birden fazla dosya yükleyin veya sürükleyin</span>
              </label>
            </div>

            {/* Yüklenen Resimleri Göster */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Uploaded ${index}`} className="w-full h-auto rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

  

</div>

          {/* Görsel Yükleme */}
    

          {/* Sektör Seçimi */}
          <div className="sm:col-span-4">
            <label htmlFor="sectors" className="block text-sm font-medium text-gray-700">Sektör Seçimi</label>
            <Select
              isMulti
              name="sectors"
              options={sectorOptions}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              classNamePrefix="select"
              required
              onChange={handleSelectChange}
            />
          </div>

          {/* Termin Tarihi */}
          <div className="sm:col-span-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Termin Tarihi</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              min={new Date().toISOString().split('T')[0]}
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* İlan Süresi */}
          <div className="sm:col-span-1">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">İlan Süresi</label>
            <select
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="3">3 gün</option>
              <option value="7">7 gün</option>
              <option value="15">15 gün</option>
              <option value="30">30 gün</option>
            </select>
          </div>

          {/* Max Fiyat Teklifi */}
          <div className="sm:col-span-1">
            <label htmlFor="maxBid" className="block text-sm font-medium text-gray-700">Max Fiyat Teklifi (Opsiyonel)</label>
            <input
              type="text"
              name="maxBid"
              id="maxBid"
              value={formData.maxBid}
              onChange={handleNumberInput}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Adet */}
          <div className="sm:col-span-1">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Adet</label>
            <input
              type="text"
              name="quantity"
              id="quantity"
              required
              value={formData.quantity}
              onChange={handleNumberInput}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* Birim */}
          <div className="sm:col-span-1">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Birim</label>
            <Select
              name="unit"
              options={unitOptions}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              classNamePrefix="select"
              onChange={handleUnitChange}
            />
          </div>

          {/* Numune Talebi */}
          <div className="sm:col-span-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requestSample"
                  name="requestSample"
                  type="checkbox"
                  checked={formData.requestSample}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requestSample" className="font-medium text-gray-700">Numune talep ediyorum.</label>
              </div>
            </div>
          </div>

          {/* Teklif Tipi */}
          <div className="sm:col-span-4">
            <label htmlFor="adType" className="block text-sm font-medium text-gray-700">Teklif Tipi Seç</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="adType1"
                  name="adType"
                  type="radio"
                  value="Kapalı Usül Teklif"
                  checked={formData.adType === 'Kapalı Usül Teklif'}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300"
                />
                <label htmlFor="adType1" className="ml-3 block text-sm font-medium text-gray-700">Kapalı Usül Teklif</label>
              </div>
              <div className="flex items-center">
                <input
                  id="adType2"
                  name="adType"
                  type="radio"
                  value="Açık Usül Teklif"
                  checked={formData.adType === 'Açık Usül Teklif'}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300"
                />
                <label htmlFor="adType2" className="ml-3 block text-sm font-medium text-gray-700">Açık Usül Teklif</label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            Oluştur
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getFirestore, query, where, getDocs, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const db = getFirestore();

export default function CreateAd() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sectors: [],
    dueDate: '',
    duration: '3', // Default duration value
    paymentMethod: '',
    maxBid: '',
    requestSample: false,
    adType: '',
    images: null,
  });

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

  useEffect(() => {
    const fetchCompany = async () => {
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
        setLoading(false);
      }
    };

    fetchCompany();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      sectors: selectedOptions.map((option) => option.value),
    });
  };

  const calculateEndDate = (createdAt, duration) => {
    console.log("calculateEndDate - createdAt:", createdAt);
    console.log("calculateEndDate - duration:", duration);

    if (!duration) {
      throw new Error('Invalid duration value');
    }

    const currentDate = createdAt.toDate();
    console.log("calculateEndDate - currentDate:", currentDate);

    const durationInDays = parseInt(duration, 10);
    if (isNaN(durationInDays)) {
      throw new Error('Invalid duration value');
    }

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + durationInDays);
    console.log("calculateEndDate - endDate:", endDate);

    return endDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company || !company.isBuyer || company.isBuyerConfirmed !== 'yes') {
      Swal.fire({
        icon: 'error',
        title: 'Erişim Engellendi',
        text: 'İlan oluşturabilmek için alıcı olarak onaylanmış olmalısınız.',
      });
      return;
    }

    if (!formData.duration) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Lütfen geçerli bir ilan süresi seçiniz.',
      });
      return;
    }

    try {
      // dueDate'e saat bilgisi ekleme (00:00 olarak ayarlama)
      const dueDateWithTime = new Date(formData.dueDate);
      dueDateWithTime.setHours(0, 0, 0, 0); // Saat 00:00 ayarla

      const adData = {
        ...formData,
        userId: currentUser.uid,
        companyId: company.id,
        dueDate: dueDateWithTime,
        createdAt: serverTimestamp(),
      };

      console.log("handleSubmit - adData:", adData);

      const adRef = await addDoc(collection(db, 'companies', company.id, 'ads'), adData);

      // Ad belgesi oluşturulduktan sonra createdAt alanı güncellenecek
      const adDoc = await getDocs(query(collection(db, 'companies', company.id, 'ads'), where('title', '==', formData.title)));
      let createdAt = null;
      adDoc.forEach(doc => {
        createdAt = doc.data().createdAt;
      });

      console.log("handleSubmit - createdAt:", createdAt);

      if (createdAt) {
        const endDate = calculateEndDate(createdAt, formData.duration);
        console.log("handleSubmit - endDate:", endDate);
        await setDoc(doc(db, 'companies', company.id, 'ads', adRef.id), { endDate }, { merge: true });

        Swal.fire({
          icon: 'success',
          title: 'Başarılı',
          text: 'İlan başarıyla oluşturuldu.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'İlan oluşturulurken bir hata oluştu: createdAt alanı bulunamadı.',
        });
      }
    } catch (error) {
      console.log("handleSubmit - error:", error);
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

  const sectorOptions = company.sectors.map((sector) => ({
    value: sector,
    label: sector,
  }));

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <h2 className="text-lg font-medium leading-6 text-gray-900">İlan Detayları</h2>
      <p className="mt-1 text-sm text-gray-500">Oluşturmak istediğiniz ilanın detaylarını giriniz.</p>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-6">
          <div className="sm:col-span-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              İlan Başlığı
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mt-4">
              İlan İçeriği
            </label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
              Örnek Numune Görselleri (Opsiyonel)
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H20a2 2 0 00-2 2v28a2 2 0 002 2h8a2 2-2V10a2 2 0 00-2-2zm-2 32H22V12h4v28zM12 6h24v4H12V6zm0 32h24v4H12v-4z" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                    <span>Bir dosya yükleyin veya sürükleyin</span>
                    <input
                      type="file"
                      name="images"
                      id="images"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="sectors" className="block text-sm font-medium text-gray-700">
              Sektör Seçimi
            </label>
            <Select
              isMulti
              name="sectors"
              options={sectorOptions}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              classNamePrefix="select"
              onChange={handleSelectChange}
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Termin Tarihi
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              min={new Date().toISOString().split('T')[0]} // Bugünden önceki tarihleri devre dışı bırak
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              İlan Süresi
              <Tooltip id="tooltip-duration" place="top" effect="solid">
                {company.paymentStatus ? '3, 7, 15 veya 30 gün' : 'Abonelik gereklidir'}
              </Tooltip>
              <span data-tooltip-id="tooltip-duration" className="ml-1 text-gray-400 cursor-pointer">
                ?
              </span>
            </label>
            <select
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              {company.paymentStatus ? (
                <>
                  <option value="3">3 gün</option>
                  <option value="7">7 gün</option>
                  <option value="15">15 gün</option>
                  <option value="30">30 gün</option>
                </>
              ) : (
                <option value="3">3 gün</option>
              )}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Ödeme Yöntemi
            </label>
            <select
              name="paymentMethod"
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            >
              <option value="">Seçiniz</option>
              <option value="Eft/Havale">Eft / Havale</option>
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Online Çek">Online Çek</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="maxBid" className="block text-sm font-medium text-gray-700">
              Max Fiyat Teklifi (Opsiyonel)
            </label>
            <input
              type="text"
              name="maxBid"
              id="maxBid"
              value={formData.maxBid}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            />
          </div>
          <div className="sm:col-span-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="requestSample"
                  name="requestSample"
                  type="checkbox"
                  checked={formData.requestSample}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="requestSample" className="font-medium text-gray-700">
                  Numune talep ediyorum.
                </label>
              </div>
            </div>
          </div>
          <div className="sm:col-span-4">
            <label htmlFor="adType" className="block text-sm font-medium text-gray-700">
              Teklif Tipi Seç
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="adType1"
                  name="adType"
                  type="radio"
                  value="Kapalı Usül Teklif"
                  checked={formData.adType === 'Kapalı Usül Teklif'}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                />
                <label htmlFor="adType1" className="ml-3 block text-sm font-medium text-gray-700">
                  Kapalı Usül Teklif
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="adType2"
                  name="adType"
                  type="radio"
                  value="Açık Usül İhale"
                  checked={formData.adType === 'Açık Usül İhale'}
                  onChange={handleChange}
                  className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                />
                <label htmlFor="adType2" className="ml-3 block text-sm font-medium text-gray-700">
                  Açık Usül İhale
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Oluştur
          </button>
        </div>
      </form>
    </div>
  );
}

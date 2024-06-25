import React, { useState, useEffect } from 'react';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { CheckIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore();

export default function CreateCompany() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyTitle: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    isBuyer: false,
    isSeller: false,
    sectors: [], // Empty sectors array
  });

  const steps = [
    { id: '01', name: 'Kullanıcı Bilgileri', href: '#', status: 'complete' },
    { id: '02', name: 'Firma Bilgileri', href: '#', status: 'current' },
    { id: '03', name: 'Sektör Bilgisi', href: '#', status: 'upcoming' },
  ];

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.isBuyer && !formData.isSeller) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Alıcı profili veya satıcı profilinden en az birini seçmelisiniz.',
      });
      return;
    }

    const companyId = uuidv4(); // Generate a unique ID

    try {
      const companyRef = doc(db, 'companies', companyId);
      await setDoc(companyRef, {
        ...formData,
        isBuyerConfirmed: 'pending',
        isSellerConfirmed: 'pending',
        paymentStatus: false, // Default payment status
        adminUserId: currentUser ? currentUser.uid : null,
      });
      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'Firma bilgileri başarıyla kaydedildi.',
      }).then(() => {
        navigate(`/sectors/${companyId}`);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Bilgiler kaydedilirken bir hata oluştu: ' + error.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <nav aria-label="Progress" className="pb-10">
        <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {step.status === 'complete' ? (
                <div className="group flex w-full items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-800">
                      <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                  </span>
                </div>
              ) : step.status === 'current' ? (
                <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-600">
                    <span className="text-blue-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-blue-600">{step.name}</span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <>
                  <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900">Firma Bilgileri</h2>
        <p className="mt-1 text-sm text-gray-500">Firmanızın detaylı bilgilerini aşağıya giriniz.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
          <div className="sm:col-span-3">
            <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-gray-900">Firma Adı</label>
            <input type="text" required name="companyName" id="companyName" autoComplete="organization" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="companyTitle" className="block text-sm font-medium leading-6 text-gray-900">Firma Unvanı</label>
            <input type="text" required name="companyTitle" id="companyTitle" autoComplete="organization-title" value={formData.companyTitle} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-6">
            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Adres</label>
            <input type="text" required name="address" id="address" autoComplete="street-address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">İl</label>
            <input type="text" required name="city" id="city" autoComplete="address-level1" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">İlçe</label>
            <input type="text" required name="district" id="district" autoComplete="address-level2" value={formData.district} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">Posta Kodu</label>
            <input type="text" required name="postalCode" id="postalCode" autoComplete="postal-code" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
          </div>
          <label htmlFor="taxDocument" className="block text-sm font-medium leading-6 text-gray-900">Profil Türü</label>
          <div className="sm:col-span-6 flex items-center space-x-6">
            <div className="flex items-center">
              <input id="buyer" name="isBuyer" type="checkbox" checked={formData.isBuyer} onChange={handleChange} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500 rounded" />
              <label htmlFor="buyer" className="ml-3 block text-sm font-medium text-gray-700">Alıcı Profili Açmak İstiyorum</label>
            </div>
            <div className="flex items-center">
              <input id="seller" name="isSeller" type="checkbox" checked={formData.isSeller} onChange={handleChange} className="h-4 w-4 text-sky-600 border-gray-300 focus:ring-sky-500 rounded" />
              <label htmlFor="seller" className="ml-3 block text-sm font-medium text-gray-700">Satıcı Profili Açmak İstiyorum</label>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="taxDocument" className="block text-sm font-medium leading-6 text-gray-900">Vergi Levhası</label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H20a2 2 0 00-2 2v28a2 2 0 002 2h8a2 2 0 002-2V10a2 2 0 00-2-2zm-2 32H22V12h4v28zM12 6h24v4H12V6zm0 32h24v4H12v-4z" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                  <span>Bir dosya yükleyin veya sürükleyin</span>
                  <input id="file-upload" name="file-upload" required type="file" className="sr-only" />
                </label>
                <p className="pl-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 text-right sm:px-6">
          <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-[#0D408F] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
            Devam Et
          </button>
        </div>
      </form>
    </div>
  );
}

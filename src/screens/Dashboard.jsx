import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

const db = getFirestore();

const navigation = [
  { name: 'Anasayfa', href: '#', current: true },
  { name: 'İlanlar', href: '#', current: false },
  { name: 'Siparişler', href: '#', current: false },
  { name: 'İlanlarım', href: '#', current: false },
];

const userNavigation = [
  { name: 'Profil', href: '#' },
  { name: 'Ayarlar', href: '#' },
  { name: 'Çıkış', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyTitle: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
  });

  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const Logo = 'logowhite.svg';
  const ProfilePhoto = 'profilepic.svg';

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Kullanıcı doğrulaması başarısız.');
      return;
    }
    try {
      const companyRef = doc(db, 'companies', formData.companyName);
      await setDoc(companyRef, {
        ...formData,
        adminUsers: [currentUser.uid],
      });
      console.log('Firma bilgileri başarıyla kaydedildi.');
    } catch (error) {
      setError('Bilgiler kaydedilirken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <div>
      <Disclosure as="div" className="relative overflow-hidden bg-gradient-to-r from-[#1E40AF] to-[#0D1B49] pb-32">
        {({ open }) => (
          <>
            <nav className={classNames(open ? 'bg-sky-900' : 'bg-transparent', 'relative z-10 border-b border-teal-500 border-opacity-25 lg:border-none lg:bg-transparent')}>
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-sky-800">
                  <div className="flex items-center px-2 lg:px-0">
                    <div className="flex-shrink-0">
                      <img className="block h-8 w-auto" src={Logo} alt="Your Company" />
                    </div>
                    <div className="hidden lg:ml-6 lg:block lg:space-x-4">
                      <div className="flex">
                        {navigation.map((item) => (
                          <a key={item.name} href={item.href} className={classNames(item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800', 'rounded-md py-2 px-3 text-sm font-medium text-white')}>
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end"></div>
                  <div className="flex lg:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-sky-200 hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6 flex-shrink-0" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6 flex-shrink-0" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:ml-4 lg:block">
                    <div className="flex items-center">
                      <button type="button" className="relative flex-shrink-0 rounded-full p-1 text-sky-200 hover:bg-sky-800 hover:text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="relative flex rounded-full text-sm text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={ProfilePhoto} alt="" />
                          </Menu.Button>
                        </div>
                        <Transition enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a href={item.href} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="bg-sky-900 lg:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button key={item.name} as="a" href={item.href} className={classNames(item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800', 'block rounded-md py-2 px-3 text-base font-medium text-white')}>
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-sky-800 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={ProfilePhoto} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{currentUser?.displayName}</div>
                      <div className="text-sm font-medium text-sky-200">{currentUser?.email}</div>
                    </div>
                    <button type="button" className="relative ml-auto flex-shrink-0 rounded-full p-1 text-sky-200 hover:bg-sky-800 hover:text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button key={item.name} as="a" href={item.href} className="block rounded-md px-3 py-2 text-base font-medium text-sky-200 hover:bg-sky-800 hover:text-white">
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </nav>
            <header className="relative py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Hoşgeldin, {currentUser?.displayName || 'Kullanıcı'}</h1>
              </div>
            </header>
          </>
        )}
      </Disclosure>

      <main className="relative -mt-32">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <div className="lg:col-span-12 px-4 py-6 sm:p-6 lg:pb-8">
              <nav className="flex justify-between mb-8">
      <ol className="flex items-center w-full space-x-4">
        <li className="flex items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <span className="text-white">✓</span>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-500">Kullanıcı Bilgileri</span>
          </div>
          <div className="h-1 w-full bg-gray-300"></div>
        </li>
        <li className="flex items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-blue-600 rounded-full">
              <span className="text-blue-600">02</span>
            </div>
            <span className="ml-4 text-sm font-medium text-blue-600">Firma Bilgileri</span>
          </div>
          <div className="h-1 w-full bg-gray-300"></div>
        </li>
        <li className="flex items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-full">
              <span className="text-gray-500">03</span>
            </div>
            <span className="ml-4 text-sm font-medium text-gray-500">Sektör Bilgisi</span>
          </div>
        </li>
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
                      <input type="text" name="companyName" id="companyName" autoComplete="organization" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="companyTitle" className="block text-sm font-medium leading-6 text-gray-900">Firma Unvanı</label>
                      <input type="text" name="companyTitle" id="companyTitle" autoComplete="organization-title" value={formData.companyTitle} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-6">
                      <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Adres</label>
                      <input type="text" name="address" id="address" autoComplete="street-address" value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">İl</label>
                      <input type="text" name="city" id="city" autoComplete="address-level1" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">İlçe</label>
                      <input type="text" name="district" id="district" autoComplete="address-level2" value={formData.district} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">Posta Kodu</label>
                      <input type="text" name="postalCode" id="postalCode" autoComplete="postal-code" value={formData.postalCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm" />
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
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-right sm:px-6">
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-[#2563EB] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                      Devam Et
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

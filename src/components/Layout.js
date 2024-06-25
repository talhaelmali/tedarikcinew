import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProfilePhoto = 'profilepic.svg';

export default function Layout({ children, currentItem }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [navigation, setNavigation] = useState([
    { name: 'Anasayfa', href: '#', current: currentItem === 'Anasayfa' },
    { name: 'İlanlar', href: '#', current: currentItem === 'İlanlar' },
    { name: 'Siparişler', href: '#', current: currentItem === 'Siparişler' },
    { name: 'İlanlarım', href: '#', current: currentItem === 'İlanlarım' },
  ]);

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
    setNavigation((prevNavigation) =>
      prevNavigation.map((item) => ({
        ...item,
        current: item.name === currentItem,
      }))
    );
  }, [currentItem]);

  const userNavigation = [
    { name: 'Profil', href: '#' },
    { name: 'Ayarlar', href: '#' },
    { name: 'Çıkış', href: '#' },
  ];

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
                      <img className="block h-8 w-auto" src="logowhite.svg" alt="Your Company" />
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
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

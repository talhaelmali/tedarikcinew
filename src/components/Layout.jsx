import React, { useState, useEffect, useRef } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, getFirestore, doc, updateDoc, limit, onSnapshot, orderBy } from 'firebase/firestore';
import useLogo from '../hooks/useLogo';
import { useCompany } from '../context/CompanyContext';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children, currentItem }) {
  const logoUrl = useLogo();
  const [currentUser, setCurrentUser] = useState(null);
  const { company } = useCompany();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [remainingNotifications, setRemainingNotifications] = useState(0);
  const { translate } = useLanguage();
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'tr');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const originalTextNodes = useRef([]);

  // Language switching functions
  const getTextNodesIn = (el) => {
    let textNodes = [];
    if (el) {
      for (let node of el.childNodes) {
        if (node.nodeType === 3 && node.nodeValue.trim() !== '') {
          textNodes.push(node);
        } else {
          textNodes = textNodes.concat(getTextNodesIn(node));
        }
      }
    }
    return textNodes;
  };

  const saveOriginalTextNodes = () => {
    const bodyElement = document.querySelector('body');
    const textNodes = getTextNodesIn(bodyElement);
    originalTextNodes.current = textNodes.map((node) => ({
      node,
      originalValue: node.nodeValue,
    }));
  };

  const handleTranslatePage = async (selectedLang) => {
    if (selectedLang === 'tr' && originalTextNodes.current.length > 0) {
      originalTextNodes.current.forEach(({ node, originalValue }) => {
        node.nodeValue = originalValue;
      });
      setLanguage('tr');
      localStorage.setItem('language', 'tr');
      return;
    }

    if (originalTextNodes.current.length === 0) {
      saveOriginalTextNodes();
    }

    setLanguage(selectedLang);
    localStorage.setItem('language', selectedLang);
    setLoading(true);

    const bodyElement = document.querySelector('body');
    const textNodes = getTextNodesIn(bodyElement);

    for (let node of textNodes) {
      const originalText = node.nodeValue;
      if (originalText && originalText.trim() !== '') {
        const translatedText = await translate(originalText, selectedLang);
        node.nodeValue = translatedText;
      }
    }

    setLoading(false);
  };

  // Load language on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (!originalTextNodes.current.length && (!storedLanguage || storedLanguage === 'tr')) {
      saveOriginalTextNodes();
    }
    if (storedLanguage && storedLanguage !== 'tr') {
      handleTranslatePage(storedLanguage);
    }
  }, []);

  // Track user state
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
  if (company?.id) {
    const db = getFirestore();

    // Bildirimleri timestamp'e göre en yeni en üstte olacak şekilde sıralayalım
    const q = query(
      collection(db, 'notifications'),
      where('companyId', '==', company.id),
      where('read', '==', false),
      orderBy('timestamp', 'desc'), // Bildirimleri en yeniye göre sıralar
      limit(3) // En fazla 3 bildirim çekiyoruz
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(notificationsData);

      // Toplam okunmamış bildirim sayısını sorgulayan anlık güncelleme
      const allNotificationsQuery = query(
        collection(db, 'notifications'),
        where('companyId', '==', company.id),
        where('read', '==', false)
      );

      onSnapshot(allNotificationsQuery, (allNotificationsSnapshot) => {
        const allNotifications = allNotificationsSnapshot.docs.length;

        // Toplam okunmamış - ilk 3 bildirim = kalan bildirim sayısı
        setRemainingNotifications(allNotifications - notificationsData.length);
        setUnreadCount(allNotifications);
      });
    });

    return () => unsubscribe();
  }
}, [company]);



  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      const db = getFirestore();
      const notificationRef = doc(db, 'notifications', notification.id);

      // Mark as read
      await updateDoc(notificationRef, { read: true });

      // Update state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prevCount) => prevCount - 1);

      // Navigate
      if (notification.route) {
        navigate(notification.route);
      } else {
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  // View all notifications
  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  const navigation = [
    { name: 'Anasayfa', href: '/dashboard', current: currentItem === 'Anasayfa', disabled: false },
    {
      name: 'İlanlar',
      href: '/ads',
      current: currentItem === 'İlanlar',
      disabled: !company?.isSellerConfirmed || company?.isSellerConfirmed !== 'yes',
    },
    {
      name: 'Siparişler',
      href: '/myorders',
      current: currentItem === 'Siparişler',
      disabled: !company?.isBuyerConfirmed || company?.isBuyerConfirmed !== 'yes',
    },
    {
      name: 'Siparişler - Satıcı',
      href: '/sellermyorders',
      current: currentItem === 'Siparişler - Satıcı',
      disabled: !company?.isSellerConfirmed || company?.isSellerConfirmed !== 'yes',
    },
    {
      name: 'İlanlarım',
      href: '/myads',
      current: currentItem === 'İlanlarım',
      disabled: !company?.isBuyerConfirmed || company?.isBuyerConfirmed !== 'yes',
    },
    { name: 'Destek', href: '/support', current: currentItem === 'Destek', disabled: false },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Ayarlar', href: '/profile' },
    { name: 'Çıkış', href: '/logout' },
  ];

  return (
    <div>
      <Disclosure as="div" className="relative overflow-hidden bg-gradient-to-r from-[#1E40AF] to-[#0D1B49] pb-32">
        {({ open }) => (
          <>
            <nav
              className={classNames(
                open ? 'bg-sky-900' : 'bg-transparent',
                'relative z-10 border-b border-teal-500 border-opacity-25 lg:border-none lg:bg-transparent'
              )}
            >
              <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-sky-800">
                  {/* Left side: Logo and Desktop Navigation */}
                  <div className="flex items-center px-2 lg:px-0">
                    <a href="/dashboard">
                      {logoUrl ? (
                        <img className="h-8 w-auto sm:h-10" src={logoUrl} alt="Company Logo" />
                      ) : (
                        <span className="text-xl font-bold text-gray-900">ETedarikçi</span>
                      )}
                    </a>
                    {/* Desktop Navigation */}
                    <div className="hidden lg:ml-6 lg:block lg:space-x-4">
                      <div className="flex">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800',
                              'rounded-md py-2 px-3 text-sm font-medium text-white',
                              item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                            )}
                            onClick={(e) => item.disabled && e.preventDefault()}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center lg:hidden">
                    {/* Mobile Notification Icon */}
                    <a
                      href="/notifications"
                      className="relative flex-shrink-0 p-2 text-white hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400" />
                      )}
                    </a>
                    {/* Mobile Menu Button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-sky-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  {/* Desktop Right Side */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center">
                    <div className="flex items-center">
                      {/* Notification Menu */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <Menu.Button className="relative flex rounded-full text-sm text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                          <span className="sr-only">Open notifications menu</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                          {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400" />
                          )}
                        </Menu.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
  {notifications.length === 0 ? (
    <div className="px-4 py-2 text-sm text-gray-700">
      Yeni bildirim yok
    </div>
  ) : (
    <>
      {notifications.map((notification) => (
     <Menu.Item key={notification.id}>
     {({ active }) => (
       <div
         onClick={() => handleNotificationClick(notification)}
         className={classNames(
           active ? 'bg-gray-100' : '',
           'block px-4 py-2 text-sm text-gray-700 border-b border-gray-200 cursor-pointer truncate'
         )}
         style={{ maxWidth: '100%' }} // Metni bir satırla sınırla
       >
         <div className="truncate">
           {notification.message.length > 50
             ? `${notification.message.slice(0, 50)}...`
             : notification.message}
         </div>
         <div className="text-xs text-gray-500">
           {new Date(notification.timestamp?.seconds * 1000).toLocaleString()}
         </div>
       </div>
     )}
   </Menu.Item>
   
      ))}

      {/* Eğer remainingNotifications varsa "+XXX daha" şeklinde göster */}
      {remainingNotifications > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          +{remainingNotifications} daha
        </div>
      )}

      <Menu.Item>
        <button
          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          onClick={handleViewAllNotifications}
        >
          Tüm bildirimleri görüntüle
        </button>
      </Menu.Item>
    </>
  )}
</Menu.Items>

                        </Transition>
                      </Menu>

                      {/* Language Selector */}
                      <div className="flex items-center space-x-4 pl-4">
                        <Menu as="div" className="relative">
                          <Menu.Button className="flex items-center text-gray-700 hover:text-gray-900 text-base font-medium space-x-2">
                            {language === 'tr' ? (
                              <>
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                                  alt="TR"
                                  className="h-5 w-5"
                                />
                                <span>TR</span>
                              </>
                            ) : (
                              <>
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                                  alt="EN"
                                  className="h-5 w-5"
                                />
                                <span>EN</span>
                              </>
                            )}
                          </Menu.Button>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-28 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md">
                              <Menu.Item>
                                <button
                                  onClick={() => handleTranslatePage('en')}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    language === 'en' ? 'text-blue-600' : 'text-gray-500'
                                  } hover:text-blue-800`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                                      alt="EN"
                                      className="h-4 w-4"
                                    />
                                    <span>English</span>
                                  </div>
                                </button>
                              </Menu.Item>
                              <Menu.Item>
                                <button
                                  onClick={() => handleTranslatePage('tr')}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    language === 'tr' ? 'text-blue-600' : 'text-gray-500'
                                  } hover:text-blue-800`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                                      alt="TR"
                                      className="h-4 w-4"
                                    />
                                    <span>Türkçe</span>
                                  </div>
                                </button>
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>

                        {loading && (
                          <div className="ml-4">
                            <svg
                              className="animate-spin h-5 w-5 text-blue-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* User Menu */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <Menu.Button className="relative flex rounded-full text-sm text-white focus:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900">
                          <span className="sr-only">Open user menu</span>
                          <UserIcon className="h-6 w-6 text-white" />
                        </Menu.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
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

              {/* Mobile Menu */}
              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-sky-900 text-white' : 'text-white hover:bg-sky-700 hover:text-white',
                        'block rounded-md py-2 px-3 text-base font-medium',
                        item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                      )}
                      onClick={(e) => item.disabled && e.preventDefault()}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                {/* Mobile User Menu */}
                <div className="border-t border-gray-700 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{currentUser?.displayName || 'Kullanıcı'}</div>
                      <div className="text-sm font-medium text-gray-400">{currentUser?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-sky-700 hover:text-white"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  {/* Mobile Language Selector */}
                  <div className="mt-3 space-y-1 px-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTranslatePage('tr')}
                        className="flex items-center text-white hover:text-gray-300"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg"
                          alt="TR"
                          className="h-5 w-5 mr-1"
                        />
                        Türkçe
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTranslatePage('en')}
                        className="flex items-center text-white hover:text-gray-300"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg"
                          alt="EN"
                          className="h-5 w-5 mr-1"
                        />
                        English
                      </button>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </nav>
            <header className="relative py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Hoşgeldin, {currentUser?.displayName || 'Kullanıcı'}
                </h1>
              </div>
            </header>
          </>
        )}
      </Disclosure>

      <main className="relative -mt-32">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <div className="lg:col-span-12 px-4 py-6 sm:p-6 lg:pb-8">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

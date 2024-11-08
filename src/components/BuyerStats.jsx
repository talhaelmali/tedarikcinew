import React, { useState, useEffect } from 'react';
import { ShoppingBagIcon, LinkIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useCompany } from '../context/CompanyContext'; // Importing the CompanyContext

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function BuyerStats() {
  const { company } = useCompany(); // Using the company data from the context
  const [adCount, setAdCount] = useState(0);

  useEffect(() => {
    const fetchAdCount = async () => {
      if (company && company.id) {
        try {
          
          const adsQuery = query(
            collectionGroup(db, 'ads'),
            where('companyId', '==', company.id)
          );

          const adsSnapshot = await getDocs(adsQuery);
          setAdCount(adsSnapshot.size); // Get the count of ads
          
          adsSnapshot.forEach((doc) => {
          });

        } catch (error) {
          console.error('Error fetching ad count:', error);
        }
      }
    };

    fetchAdCount();
  }, [company]);

  const stats = [
    { id: 1, name: 'İlanlarım', stat: adCount, icon: NewspaperIcon },
    { id: 2, name: 'Gelen Teklifler', stat: '4', icon: LinkIcon },
    { id: 3, name: 'Alınan Siparişler', stat: '12', icon: ShoppingBagIcon },
  ];

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-5">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

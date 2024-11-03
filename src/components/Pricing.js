import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';

const db = getFirestore();

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getPriceSuffix(duration) {
  if (duration === 1) return '/gün';
  if (duration < 30) return `/${duration} gün`;
  if (duration === 30) return '/ay';
  if (duration < 365) return `/${Math.round(duration / 30)} ay`;
  if (duration === 365) return '/yıl';
  return `/${Math.round(duration / 365)} yıl`;
}

export default function Pricing() {
  const [tiers, setTiers] = useState([]);
  const navigate = useNavigate();  // useNavigate hook'unu kullanıyoruz

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'SubscriptionPlans'));
        const fetchedTiers = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const duration = parseInt(data.duration, 10);

          return {
            name: data.name,
            id: doc.id,
            href: '#',
            price: `₺${data.price}`,
            duration,
            description: 'The essentials to provide your best work.',
            features: [`${duration} days duration`, 'Up to 1,000 subscribers', 'Basic analytics', '48-hour support response time'],
            mostPopular: data.mostPopular || false,
            priceSuffix: getPriceSuffix(duration),
          };
        });
        setTiers(fetchedTiers);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchPricingData();
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');  // '/dashboard' yoluna yönlendiriyoruz
  };

  return (
    <div className="bg-white py-6 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
                'rounded-3xl p-8 xl:p-10',
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={classNames(
                    tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                    'text-lg font-semibold leading-8',
                  )}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">{tier.priceSuffix}</span>
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                )}
              >
                Buy plan
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleContinue}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Devam Et
          </button>
        </div>
      </div>
    </div>
  );
}

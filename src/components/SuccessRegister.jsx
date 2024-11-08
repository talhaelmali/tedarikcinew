import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
  { id: '01', name: 'Kullanıcı Bilgileri', href: '#', status: 'complete' },
  { id: '02', name: 'Firma Bilgileri', href: '#', status: 'complete' },
  { id: '03', name: 'Sektör Bilgisi', href: '#', status: 'complete' },
];

export default function SuccessRegister() {
  return (
    <div className="max-w-4xl mx-auto mb-20">
      <nav aria-label="Progress" className="pb-10">
        <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 group-hover:bg-blue-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              </div>
              {stepIdx !== steps.length - 1 ? (
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
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      <div className="text-center mt-20">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <CheckIcon className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-lg font-medium leading-6 text-gray-900">Başarıyla İletildi!</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bilgileriniz başarıyla iletildi. Hesabınız 24 saat içinde onaylanacaktır.
        </p>
      </div>
    </div>
  );
}

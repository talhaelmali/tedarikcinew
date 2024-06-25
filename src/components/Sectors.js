import React, { useState } from 'react';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { CheckIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

const db = getFirestore();

const exampleSectors = [
  'Automotive', 'Construction', 'Education', 'Energy', 'Finance', 'Healthcare', 
  'Hospitality', 'IT', 'Manufacturing', 'Marketing', 'Retail', 'Telecommunications', 
  'Transportation', 'Agriculture', 'Aerospace', 'Biotechnology', 'Chemical', 
  'Defense', 'Electronics', 'Food & Beverage', 'Insurance', 'Legal', 'Media', 
  'Mining', 'Pharmaceutical', 'Real Estate', 'Tourism', 'Utilities', 'Waste Management',
  // Add more sectors as needed
];

export default function Sectors() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const steps = [
    { id: '01', name: 'Kullanıcı Bilgileri', href: '#', status: 'complete' },
    { id: '02', name: 'Firma Bilgileri', href: '#', status: 'complete' },
    { id: '03', name: 'Sektör Bilgisi', href: '#', status: 'current' },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSectorSelect = (sector) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector));
    } else {
      if (selectedSectors.length >= 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Uyarı',
          text: 'Maksimum 3 tane sektör seçebilirsiniz.',
        });
        return;
      }
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleSave = async () => {
    if (selectedSectors.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Uyarı',
        text: 'En az bir sektör seçmelisiniz.',
      });
      return;
    }

    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, {
        sectors: selectedSectors,
      });
      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'Sektörler başarıyla kaydedildi.',
      }).then(() => {
        navigate(`/success`);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Sektörler kaydedilirken bir hata oluştu: ' + error.message,
      });
    }
  };

  const filteredSectors = exampleSectors.filter((sector) =>
    sector.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Show a maximum of 5 sectors in the dropdown

  return (
    <div className="max-w-4xl mx-auto mb-20">
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
        <h2 className="text-lg font-medium leading-6 text-gray-900">Sektör Seç</h2>
        <p className="mt-1 text-sm text-gray-500">Firmanızın ilanlarla eşleşebilmesi için sektör seçiniz. En fazla <strong>3 sektör</strong> seçilebilir.</p>
      </div>
      <div className="mt-6 relative">
        <input
          type="text"
          placeholder="Sektör ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
        />
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto">
            {filteredSectors.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => handleSectorSelect(sector)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 ${
                  selectedSectors.includes(sector) ? 'bg-blue-300' : ''
                }`}
              >
                <span>{sector}</span>
                {selectedSectors.includes(sector) && (
                  <CheckIcon className="h-5 w-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700">Seçilen Sektörler</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedSectors.map((sector) => (
            <span
              key={sector}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              {sector}
              <button
                type="button"
                onClick={() => handleSectorSelect(sector)}
                className="pl-2 text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
}

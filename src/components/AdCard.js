// AdCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'; // Tarih formatlama için moment.js kullanımı

const AdCard = ({ ad }) => {
  const getAdTypeClass = (adType) => {
    if (adType === 'Kapalı Usül Teklif') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (adType === 'Açık Usül Teklif') {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const timeAgo = moment(ad.createdAt).fromNow(); // Tarih formatlama

  return (
    <li key={ad.id} className="py-4">
      <div className="flex justify-between items-center border rounded-lg p-4 shadow-sm bg-white">
        <div>
          <div className="mt-2 flex space-x-1 text-sm text-gray-500">
            {ad.sectors.map((sector, index) => (
              <span key={index} className="bg-gray-200 rounded-full px-2 py-1">{sector}</span>
            ))}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="hover:underline">{ad.title}</Link>
            <span className="text-sm text-gray-500"> #{ad.id}</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">{ad.content}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getAdTypeClass(ad.adType)}`}>
            {ad.adType}
          </span>
          <p className="mt-2 text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>
    </li>
  );
};

export default AdCard;

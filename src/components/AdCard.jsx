import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(durationPlugin);

const AdCard = React.memo(({ ad }) => {
  
  // Ad Type Badge için fonksiyon
  const getAdTypeClassAndText = (adType) => {
    if (adType === 'Kapalı Usül Teklif') {
      return { className: 'bg-yellow-100 text-yellow-800', text: 'Kapalı Usül Teklif' };
    } else if (adType === 'Açık Usül İhale' || adType === 'Açık Usül Teklif') {
      return { className: 'bg-green-100 text-green-800', text: 'Açık Usül Teklif' };
    } else {
      return { className: 'bg-gray-100 text-gray-800', text: adType };
    }
  };

  // Ilanın bitiş tarihini hesaplayan fonksiyon
  const calculateEndDate = (createdAt, duration) => {
    if (!createdAt || !duration) return null;

    let date;

    if (createdAt.seconds) {
      // Firestore Timestamp
      date = new Date(createdAt.seconds * 1000);
    } else if (createdAt instanceof Date) {
      // JavaScript Date object
      date = new Date(createdAt.getTime());
    } else if (typeof createdAt === 'string') {
      // ISO date string
      date = new Date(createdAt);
    } else {
      return null;
    }

    date.setDate(date.getDate() + parseInt(duration));
    return date;
  };

  
  

  // Kalan süreyi hesaplayan fonksiyon
  const calculateRemainingTime = (endDate) => {
    if (!endDate) return 'Bilinmiyor';

    let end;

    if (endDate.seconds) {
      // Firestore Timestamp
      end = dayjs(endDate.seconds * 1000);
    } else if (endDate instanceof Date) {
      // JavaScript Date object
      end = dayjs(endDate.getTime());
    } else if (typeof endDate === 'string') {
      // ISO date string
      end = dayjs(endDate);
    } else {
      return 'Bilinmiyor';
    }

    const now = dayjs();
    const diff = end.diff(now);

    if (diff <= 0) {
      return 'İlan Süresi Doldu';
    }

    const duration = dayjs.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    return `${days} gün ${hours} saat ${minutes} dakika`;
  };

  // Diğer yardımcı fonksiyonlar
  const limitContent = (content) => {
    const maxLength = 100;
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  };

  const limitTitle = (title) => {
    const maxLength = 30;
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  };

  const limitSectors = (sectors) => {
    const maxSectors = 3;
    if (sectors.length > maxSectors) {
      return [...sectors.slice(0, maxSectors), '...'];
    }
    return sectors;
  };

  const imageUrl = ad.images || 'https://via.placeholder.com/150';

  let createdAt;

  if (ad.createdAt && ad.createdAt.seconds) {
    // Firestore Timestamp
    createdAt = dayjs(ad.createdAt.seconds * 1000);
  } else if (ad.createdAt instanceof Date) {
    // JavaScript Date object
    createdAt = dayjs(ad.createdAt.getTime());
  } else if (typeof ad.createdAt === 'string') {
    // ISO date string
    createdAt = dayjs(ad.createdAt);
  } else {
    createdAt = null;
  }

  const timeAgo = createdAt ? createdAt.fromNow() : 'Bilinmiyor';

  const adType = getAdTypeClassAndText(ad.adType);

  // Ilanın bitiş tarihini hesaplayın
  const endDate = ad.endDate || calculateEndDate(ad.createdAt, ad.duration);
  const remainingTime = calculateRemainingTime(endDate);

  return (
    <li key={ad.id} className="py-4">
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Desktop View (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center p-4">
        {/* Left: Image and Ad Information */}
        <div className="flex">
          {/* Image */}
          <img
            src={imageUrl}
            alt={ad.title}
            className="w-24 h-24 object-cover rounded-lg mr-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
  
          <div>
            {/* Sectors */}
            <div className="flex items-center space-x-2">
              {ad.sectors && limitSectors(ad.sectors).map((sector, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded max-w-[100px] truncate"
                  title={sector}
                >
                  {sector}
                </span>
              ))}
            </div>
            {/* Title and ID */}
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="hover:underline">
                {limitTitle(ad.title)}
              </Link>
              <span className="text-blue-600"> #{ad.id}</span>
            </h3>
            {/* Content */}
            <p className="text-sm text-gray-500 mt-1">{limitContent(ad.content)}</p>
          </div>
        </div>
  
        {/* Right: Badges and Remaining Time */}
        <div className="text-right">
          {/* Ad Type Badge and Time Ago */}
          <div className="flex justify-end items-center gap-2">
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${adType.className}`}>
              {adType.text}
            </span>
            <p className="text-sm text-gray-500">{timeAgo}</p>
          </div>
  
          {/* Additional Badges */}
          <div className="mt-2 space-y-1">
            {ad.requestSample && (
              <div className="inline-block bg-blue-800 text-white text-sm font-medium px-3 py-1 mr-2 rounded-md">
                Numune Talep Ediyor
              </div>
            )}
            {ad.maxBid && (
              <div className="inline-block bg-[#EE6F2D] text-white text-sm font-medium px-3 py-1 rounded-md">
                Bütçe: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ad.maxBid)}
              </div>
            )}
          </div>
  
          {/* Remaining Time */}
          <p className="text-sm text-gray-500 mt-2">
            <span className="text-blue-600">İlanın Bitimine:</span> {remainingTime}
          </p>
        </div>
      </div>
  
      {/* Mobile View (Hidden on Desktop) */}
      <div className="md:hidden p-4">
        <div className="flex items-center space-x-4">
          {/* Image */}
          <img
            src={imageUrl}
            alt={ad.title}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
  
          {/* Ad Information */}
          <div className="flex-1">
            {/* Title and ID */}
            <h3 className="text-sm font-medium text-gray-900">
              <Link to={`/ad-details/${ad.companyId}/${ad.id}`} className="hover:underline">
                {limitTitle(ad.title)}
              </Link>
              <span className="text-blue-600"> #{ad.id}</span>
            </h3>
            {/* Sectors */}
            <div className="flex flex-wrap gap-1 mt-1">
              {ad.sectors && limitSectors(ad.sectors).map((sector, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded truncate"
                  title={sector}
                >
                  {sector}
                </span>
              ))}
            </div>
  
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {ad.requestSample && (
                <span className="bg-blue-800 text-white text-xs font-medium px-2 py-1 rounded-md">
                  Numune Talep Ediyor
                </span>
              )}
              {ad.maxBid && (
                <span className="bg-[#EE6F2D] text-white text-xs font-medium px-2 py-1 rounded-md">
                  Bütçe: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(ad.maxBid)}
                </span>
              )}
            </div>
  
            {/* Remaining Time */}
            <p className="text-xs text-gray-500 mt-2">
              <span className="text-blue-600">İlanın Bitimine:</span> {remainingTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  </li>
  
  );
});

export default AdCard;

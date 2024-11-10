import React from 'react';
import { StarIcon as FilledStarIcon, StarIcon as OutlineStarIcon } from '@heroicons/react/20/solid';
import { useCompany } from '../context/CompanyContext';

const BidList = ({ bids, bidderRatings, handleAcceptBid, adData, maskCompanyName, handleBidClick }) => {
  const { company } = useCompany();

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(filledStars)].map((_, index) => (
          <FilledStarIcon key={index} className="h-5 w-5 text-yellow-500" />
        ))}
        {hasHalfStar && (
          <OutlineStarIcon key="half-star" className="h-5 w-5 text-gray-300" />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <OutlineStarIcon key={index} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
    );
  };

  // En düşük teklifi bul
  const lowestBid = bids.length > 0 ? bids.reduce((min, bid) => (bid.bidAmount < min.bidAmount ? bid : min), bids[0]) : null;

  // Kullanıcı admin veya takım üyesi mi kontrol et
  const isUserAdminOrMember = company && (company.adminUserId === auth.currentUser?.uid || company.teamMembers?.some(member => member.userId === auth.currentUser?.uid));

  const userCompanyBids = company ? bids.filter(bid => bid.bidderCompanyId === company.id) : [];

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        {adData.adType === 'Kapalı Usül Teklif' && !isUserAdminOrMember ? 'Gönderdiğim Teklifler' : adData.adType === 'Kapalı Usül Teklif' ? 'Gelen Teklifler' : 'Gelen En Düşük Teklif'}
      </h3>
      
      <div className="mt-4">
        {adData.adType === "Kapalı Usül Teklif" ? (
          isUserAdminOrMember ? (
            bids.length > 0 && bids.map(bid => (
              <div key={bid.id} className="md:flex max-w-[1162px] box-shadow-md rounded-lg">
                <div className='flex w-full gap-3 p-4'>
                  <img src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Subtract.png?alt=media&token=e4e4bf99-2c0e-4136-952b-2581986ccc74" alt="profile" className='h-12 w-max-[39px]' />
                  <div className='w-full'>
                    <div className='flex justify-between mb-2 md:mb-1'>
                      <div className='flex'>
                        <p className='font-medium text-sm text-[#111827]'>{maskCompanyName(bid.bidderCompanyName)}</p>
                        <div className="flex rounded-[4px] px-[6px] py-1 ml-2 bg-[#F3F4F6]">
                          {bidderRatings[bid.bidderCompanyId] ? (
                            <>
                              {renderStars(bidderRatings[bid.bidderCompanyId])}
                              <span className="ml-2 text-sm text-gray-500">{bidderRatings[bid.bidderCompanyId]}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Puanlanmadı</span>
                          )}
                        </div>
                      </div>
                      <p className='text-sm font-normal text-[#8d8d8e]'>{bid.createdAt ? new Date(bid.createdAt.seconds * 1000).toLocaleDateString() : "Bilinmiyor"}</p>
                    </div>
                    <p className='font-normal text-sm'>{bid.bidDetails || "Detay Yok"}</p>
                    <div className='max-w-[149px] bg-[#D1FAE5] rounded-xl py-[2px] px-[12px] mt-2 text-center'>
                      <p className='font-medium text-sm text-[#065F46]'>Teklifim: {bid.bidAmount} ₺</p>
                    </div>
                  </div>
                </div>
                {isUserAdminOrMember && (
                  <div className='w-full md:w-[133px] text-[#2563EB] text-sm font-medium border-l-2 py-[17px] flex justify-center items-center'>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent py-1 px-2 text-xs font-medium text-[#2563EB] hover:bg-gray-200"
                      onClick={() => handleAcceptBid(bid.id, bid.bidderCompanyId, bid.bidderCompanyName)}
                      disabled={adData.status === 'approved'}
                    >
                      Teklifi Kabul Et
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            userCompanyBids.length > 0 ? userCompanyBids.map(bid => (
              <div key={bid.id} className="md:flex max-w-[1162px] box-shadow-md rounded-lg">
                <div className='flex w-full gap-3 p-4'>
                  <img src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Subtract.png?alt=media&token=e4e4bf99-2c0e-4136-952b-2581986ccc74" alt="profile" className='h-12 w-max-[39px]' />
                  <div className='w-full'>
                    <div className='flex justify-between mb-2 md:mb-1'>
                      <div className='flex'>
                        <p className='font-medium text-sm text-[#111827]'>{maskCompanyName(bid.bidderCompanyName)}</p>
                        <div className="flex rounded-[4px] px-[6px] py-1 ml-2 bg-[#F3F4F6]">
                          {bidderRatings[bid.bidderCompanyId] ? (
                            <>
                              {renderStars(bidderRatings[bid.bidderCompanyId])}
                              <span className="ml-2 text-sm text-gray-500">{bidderRatings[bid.bidderCompanyId]}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Puanlanmadı</span>
                          )}
                        </div>
                      </div>
                      <p className='text-sm font-normal text-[#8d8d8e]'>{bid.createdAt ? new Date(bid.createdAt.seconds * 1000).toLocaleDateString() : "Bilinmiyor"}</p>
                    </div>
                    <p className='font-normal text-sm'>{bid.bidDetails || "Detay Yok"}</p>
                    <div className='max-w-[149px] bg-[#D1FAE5] rounded-xl py-[2px] px-[12px] mt-2 text-center'>
                      <p className='font-medium text-sm text-[#065F46]'>Teklifim: {bid.bidAmount} ₺</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : <p className="text-gray-500">Henüz teklif vermediniz.</p>
          )
        ) : (
          lowestBid && (
            <div key={lowestBid.id} className="md:flex max-w-[1162px] box-shadow-md rounded-lg">
              <div className='flex w-full gap-3 p-4'>
                <img src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/Subtract.png?alt=media&token=e4e4bf99-2c0e-4136-952b-2581986ccc74" alt="profile" className='h-12 w-max-[39px]' />
                <div className='w-full'>
                  <div className='flex justify-between mb-2 md:mb-1'>
                    <div className='flex'>
                      <p className='font-medium text-sm text-[#111827]'>{maskCompanyName(lowestBid.bidderCompanyName)}</p>
                      <div className="flex rounded-[4px] px-[6px] py-1 ml-2 bg-[#F3F4F6]">
                        {bidderRatings[lowestBid.bidderCompanyId] ? (
                          <>
                            {renderStars(bidderRatings[lowestBid.bidderCompanyId])}
                            <span className="ml-2 text-sm text-gray-500">{bidderRatings[lowestBid.bidderCompanyId]}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Puanlanmadı</span>
                        )}
                      </div>
                    </div>
                    <p className='text-sm font-normal text-[#8d8d8e]'>{lowestBid.createdAt ? new Date(lowestBid.createdAt.seconds * 1000).toLocaleDateString() : "Bilinmiyor"}</p>
                  </div>
                  <p className='font-normal text-sm'>{lowestBid.bidDetails || "Detay Yok"}</p>
                  <div className='max-w-[149px] bg-[#D1FAE5] rounded-xl py-[2px] px-[12px] mt-2 text-center'>
                    <p className='font-medium text-sm text-[#065F46]'>Teklifim: {lowestBid.bidAmount} ₺</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {!isUserAdminOrMember && (
          <div className="text-right mt-4">
            <button
              onClick={handleBidClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Teklif Ver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidList;

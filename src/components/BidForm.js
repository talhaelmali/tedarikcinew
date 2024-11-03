import React, { useState, useEffect } from 'react';
import { collection, doc, query, where, getFirestore, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { auth } from '../firebaseConfig';

const db = getFirestore();

const BidForm = () => {
  const { companyId, adId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [adData, setAdData] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDetails, setBidDetails] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState(''); // İkinci opsiyonel input
  const [bids, setBids] = useState([]); 
  const [userBidExists, setUserBidExists] = useState(false); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdAndCompany = async () => {
      try {
        // İlan verilerini çek
        const adDoc = await getDoc(doc(db, 'companies', companyId, 'ads', adId));
        if (adDoc.exists()) {
          setAdData(adDoc.data());
        }

        // Şirket verilerini çek
        const companyDoc = await getDoc(doc(db, 'companies', companyId));
        if (companyDoc.exists()) {
          setCompanyData(companyDoc.data());
        }

        // Teklif verilerini çek
        const bidsSnapshot = await getDocs(collection(db, 'companies', companyId, 'ads', adId, 'bids'));
        const bidsList = bidsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBids(bidsList);

        // Kullanıcının aktif şirketinin bu ilana teklif verip vermediğini kontrol et
        const companyQuery = query(
          collection(db, 'companies'),
          where('adminUserId', '==', currentUser?.uid)
        );
        const companySnapshot = await getDocs(companyQuery);

        let userCompanyData = null;

        companySnapshot.forEach((doc) => {
          userCompanyData = doc.data();
          userCompanyData.id = doc.id;
        });

        if (!userCompanyData) {
          const userQuery = query(
            collection(db, 'companies'),
            where('Users', 'array-contains', currentUser?.uid)
          );
          const userSnapshot = await getDocs(userQuery);

          userSnapshot.forEach((doc) => {
            userCompanyData = doc.data();
            userCompanyData.id = doc.id;
          });
        }

        if (userCompanyData) {
          const userBid = bidsList.find((bid) => bid.bidderCompanyId === userCompanyData.id);
          if (userBid) {
            setUserBidExists(true); // Kullanıcının zaten bir teklifi var
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoading(false);
    };

    fetchAdAndCompany();
  }, [companyId, adId, currentUser]);

  // En düşük teklifi bul
  const getLowestBid = (bids) => {
    if (bids.length > 0) {
      return Math.min(...bids.map(bid => parseFloat(bid.bidAmount)));
    }
    return null; // Eğer teklif yoksa null döner
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const bidValue = parseFloat(bidAmount);
    
    // maxBid değeri varsa en düşük teklifi veya adData'daki maxBid'i kontrol et
    let maxBid = null;
    if (adData?.adType === 'Açık Usül İhale') {
      const lowestBid = getLowestBid(bids);
      maxBid = lowestBid !== null ? lowestBid : adData?.maxBid;
    } else {
      maxBid = adData?.maxBid;
    }
    
    // Eğer maxBid null değilse (boş değilse) ve bidValue maxBid'e eşitse veya daha büyükse hata göster
    if (maxBid !== null && (bidValue >= maxBid || bidValue === maxBid)) {
      Swal.fire({
        title: 'Hata!',
        text: 'Verdiğiniz teklif maksimum teklif ile aynı veya daha fazla olamaz. En az 1 düşük teklif vermelisiniz.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
      return;
    }
    
    // İlk teklifse detayları kontrol et, opsiyonel ikinci teklif için kontrol yapma
    if (!userBidExists && !bidDetails) {
      Swal.fire({
        title: 'Hata!',
        text: 'İlk teklif için detay girmelisiniz.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
      return;
    }
    
    try {
      const companyQuery = query(
        collection(db, 'companies'),
        where('adminUserId', '==', currentUser.uid)
      );
      const companySnapshot = await getDocs(companyQuery);
    
      let userCompanyData = null;
    
      companySnapshot.forEach((doc) => {
        userCompanyData = doc.data();
        userCompanyData.id = doc.id;
      });
    
      if (!userCompanyData) {
        const userQuery = query(
          collection(db, 'companies'),
          where('Users', 'array-contains', currentUser.uid)
        );
        const userSnapshot = await getDocs(userQuery);
    
        userSnapshot.forEach((doc) => {
          userCompanyData = doc.data();
          userCompanyData.id = doc.id;
        });
      }
    
      if (userCompanyData) {
        const bidData = {
          bidderCompanyId: userCompanyData.id,
          bidderCompanyName: userCompanyData.companyName,
          bidAmount: bidValue,
          bidDetails: userBidExists ? additionalDetails : bidDetails,
          createdAt: new Date(),
        };
    
        await addDoc(collection(db, 'companies', companyId, 'ads', adId, 'bids'), bidData);
    
        Swal.fire({
          title: 'Başarılı!',
          text: 'Teklifiniz başarıyla gönderildi.',
          icon: 'success',
          confirmButtonText: 'Tamam'
        }).then(() => {
          navigate(`/ad-details/${companyId}/${adId}`);
        });
      } else {
        console.log("User company does not exist");
      }
    } catch (error) {
      console.error("Error adding document:", error);
      Swal.fire({
        title: 'Hata!',
        text: 'Teklif gönderilirken bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentMaxBid = adData?.adType === 'Açık Usül İhale' ? (getLowestBid(bids) || adData?.maxBid) : adData?.maxBid;

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="bg-white rounded-lg px-4 py-5 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-900">{adData?.title} Fiyat Teklifi</h2>
        <p className="text-sm text-gray-500">Lütfen teklifinizi ve detayları aşağıda belirtin.</p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            {!userBidExists ? (
              <>
                <label className="block text-sm font-medium text-gray-700">İlk Teklif Detayları</label>
                <textarea
                  value={bidDetails}
                  onChange={(e) => setBidDetails(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="Detaylar zorunludur."
                  required
                />
              </>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700">Yeni Detay (Opsiyonel)</label>
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder="Ek detaylar opsiyoneldir."
                />
                <p className="text-sm text-gray-500 mt-2">Daha önce teklif verdiniz, detay girmek opsiyoneldir.</p>
              </>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Teklif Tutarı</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                ₺
              </span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mt-1 block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                required
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                TRY
              </span>
            </div>
            {currentMaxBid !== null && (
              <p className="text-sm text-gray-500 mt-2">Maksimum Teklif: ₺{currentMaxBid}</p>
            )}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidForm;

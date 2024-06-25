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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User logged in:", user);
        setCurrentUser(user);
      } else {
        console.log("No user logged in");
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAdAndCompany = async () => {
      try {
        const adDoc = await getDoc(doc(db, 'companies', companyId, 'ads', adId));
        if (adDoc.exists()) {
          console.log("Ad data:", adDoc.data());
          setAdData(adDoc.data());
        } else {
          console.log("Ad does not exist");
        }

        const companyDoc = await getDoc(doc(db, 'companies', companyId));
        if (companyDoc.exists()) {
          console.log("Company data:", companyDoc.data());
          setCompanyData(companyDoc.data());
        } else {
          console.log("Company does not exist");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoading(false);
    };

    fetchAdAndCompany();
  }, [companyId, adId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (currentUser && bidAmount && bidDetails) {
      try {
        // Kullanıcının şirketini bulmak için sorgu yap
        const companyQuery = query(
          collection(db, 'companies'),
          where('adminUserId', '==', currentUser.uid)
        );
        const companySnapshot = await getDocs(companyQuery);

        let userCompanyData = null;

        // adminUserId ile eşleşen şirketi bul
        companySnapshot.forEach((doc) => {
          userCompanyData = doc.data();
          userCompanyData.id = doc.id;
        });

        // adminUserId ile eşleşmezse Users alanını kontrol et
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
          console.log("User company data:", userCompanyData);

          const bidData = {
            bidderCompanyId: userCompanyData.id,
            bidderCompanyName: userCompanyData.companyName,
            bidAmount,
            bidDetails,
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
    } else {
      Swal.fire({
        title: 'Hata!',
        text: 'Lütfen tüm alanları doldurun.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mb-20">
      <div className="bg-white rounded-lg px-4 py-5 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-900">{adData.title} Fiyat Teklifi</h2>
        <p className="text-sm text-gray-500">Lütfen teklifinizi ve detayları aşağıda belirtin.</p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Detaylar</label>
            <textarea
              value={bidDetails}
              onChange={(e) => setBidDetails(e.target.value)}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              required
            />
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

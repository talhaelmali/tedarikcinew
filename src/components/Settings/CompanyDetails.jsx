import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { getDocs, collection, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import swal from 'sweetalert';
import { useNavigate, NavLink } from 'react-router-dom';

function CompanyDetails() {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyTitle: '',
    city: '',
    district: '',
    postalCode: '',
    address: '',
    signatureCircularVerified: false,
    taxDocumentVerified: false,
    activityCertificateVerified: false,
    taxDocumentURL: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          swal("Oturum açılmadı", "Şirket bilgilerini görüntülemek için giriş yapmalısınız.", "error").then(() => {
            navigate('/login');
          });
          return;
        }

        const userUid = user.uid;

        // Admin sorgusu
        const companiesRef = collection(db, "companies");
        const adminQuery = query(companiesRef, where("adminUserId", "==", userUid));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
          const company = adminSnapshot.docs[0].data();
          setCompanyData({
            companyName: company.companyName || '',
            companyTitle: company.companyTitle || '',
            city: company.city || '',
            district: company.district || '',
            postalCode: company.postalCode || '',
            address: company.address || '',
            signatureCircularVerified: company.signatureCircularVerified ?? false,
            taxDocumentVerified: company.taxDocumentVerified ?? false,
            activityCertificateVerified: company.activityCertificateVerified ?? false,
            taxDocumentURL: company.taxDocumentURL || ''
          });
          setLoading(false);
          return;
        }

        // Üyelik kontrolü
        const membersRef = collection(db, "members");
        const memberQuery = query(membersRef, where("userId", "==", userUid));
        const memberSnapshot = await getDocs(memberQuery);

        if (!memberSnapshot.empty) {
          const companyId = memberSnapshot.docs[0].data().companyId;
          const companyDoc = doc(db, "companies", companyId);
          const companySnapshot = await getDoc(companyDoc);

          if (companySnapshot.exists()) {
            const company = companySnapshot.data();
            setCompanyData({
              companyName: company.companyName || '',
              companyTitle: company.companyTitle || '',
              city: company.city || '',
              district: company.district || '',
              postalCode: company.postalCode || '',
              address: company.address || '',
              signatureCircularVerified: company.signatureCircularVerified ?? false,
              taxDocumentVerified: company.taxDocumentVerified ?? false,
              activityCertificateVerified: company.activityCertificateVerified ?? false,
              taxDocumentURL: company.taxDocumentURL || ''
            });
            setLoading(false);
            return;
          }
        }

        swal("Şirket bulunamadı", "Bu kullanıcı ile ilişkilendirilmiş bir şirket bulunamadı.", "error").then(() => {
          navigate('/dashboard');
        });

      } catch (error) {
        console.error("Şirket bilgileri alınırken hata oluştu: ", error);
        swal("Hata", error.message, "error");
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [navigate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="pb-8">
      {/* Profile sayfasındaki navigasyon menüsü */}
      <nav className="flex border-b border-gray-200 mb-6">
        <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Profil
        </NavLink>
        <NavLink to="/my-company" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Firma Bilgileri
        </NavLink>
        <NavLink to="/teammembers" className={({ isActive }) => isActive ? "text-blue-800 border-b-2 border-blue-800 py-2 px-4" : "text-gray-600 py-2 px-4 hover:text-blue-600"}>
          Ekip Üyeleri
        </NavLink>
      </nav>

      <h2 className="text-2xl font-bold mb-6">Şirket Bilgileri</h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Şirket Adı</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={companyData.companyName}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="companyTitle" className="block text-sm font-medium text-gray-700">Şirket Unvanı</label>
            <input
              id="companyTitle"
              name="companyTitle"
              type="text"
              value={companyData.companyTitle}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">İl</label>
            <input
              id="city"
              name="city"
              type="text"
              value={companyData.city}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">İlçe</label>
            <input
              id="district"
              name="district"
              type="text"
              value={companyData.district}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Posta Kodu</label>
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              value={companyData.postalCode}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adres</label>
            <input
              id="address"
              name="address"
              type="text"
              value={companyData.address}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        <h3 className="text-lg font-medium mt-6 mb-4">Belge Doğrulama Durumları</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="signatureCircularVerified" className="block text-sm font-medium text-gray-700">İmza Sirküleri Doğrulandı mı?</label>
            <input
              id="signatureCircularVerified"
              name="signatureCircularVerified"
              type="text"
              value={companyData.signatureCircularVerified ? 'Evet' : 'Hayır'}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="taxDocumentVerified" className="block text-sm font-medium text-gray-700">Vergi Levhası Doğrulandı mı?</label>
            <input
              id="taxDocumentVerified"
              name="taxDocumentVerified"
              type="text"
              value={companyData.taxDocumentVerified ? 'Evet' : 'Hayır'}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="activityCertificateVerified" className="block text-sm font-medium text-gray-700">Faaliyet Belgesi Doğrulandı mı?</label>
            <input
              id="activityCertificateVerified"
              name="activityCertificateVerified"
              type="text"
              value={companyData.activityCertificateVerified ? 'Evet' : 'Hayır'}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* Belgeyi Görüntüleme ve İndirme */}
        {companyData.taxDocumentURL && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Şirket Belgeleri</label>
            <a
              href={companyData.taxDocumentURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block w-full text-blue-500 hover:underline"
            >
              Şirket Belgelerini Görüntüle / İndir
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

export default CompanyDetails;

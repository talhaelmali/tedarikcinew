import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import { useCompany } from '../../context/CompanyContext'; // useCompany hook'u import edildi

function CompanyDetails() {
  const { company, loading } = useCompany(); // company ve loading değerlerini alıyoruz
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !company) {
      swal("Şirket bulunamadı", "Bu kullanıcı ile ilişkilendirilmiş bir şirket bulunamadı.", "error").then(() => {
        navigate('/dashboard');
      });
    }
  }, [company, loading, navigate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!company) {
    return null;
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
              value={company.companyName || ''}
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
              value={company.companyTitle || ''}
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
              value={company.city || ''}
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
              value={company.district || ''}
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
              value={company.postalCode || ''}
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
              value={company.address || ''}
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
              value={company.signatureCircularVerified ? 'Evet' : 'Hayır'}
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
              value={company.taxDocumentVerified ? 'Evet' : 'Hayır'}
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
              value={company.activityCertificateVerified ? 'Evet' : 'Hayır'}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
        </div>

        {/* Belgeyi Görüntüleme ve İndirme */}
        {company.taxDocumentURL && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Şirket Belgeleri</label>
            <a
              href={company.taxDocumentURL}
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

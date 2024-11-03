import React, { useState, useCallback, useEffect } from 'react';
import { useCompany } from '../context/CompanyContext';
import { useNavigate } from 'react-router-dom';
import StaticDashboard from './StaticDashboard';
import SalerDashboard from './SalerDashboard';
import CombinedDashboard from './CombinedDashboard';

export default function Dashboard() {
  const { company, loading } = useCompany(); 
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();

  // Modal açma işlemi
  const handleOpenModal = useCallback((reason) => {
    setRejectionReason(reason);
    setModalOpen(true);
  }, []);

  // Modal kapama işlemi
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setRejectionReason('');
  }, []);

  // Şirket kaydı yoksa yönlendirme
  useEffect(() => {
    if (loading) return; // Eğer yükleme devam ediyorsa hiçbir şey yapma
    if (!company || Object.keys(company).length === 0) {
      navigate('/createcompany');
    }
  }, [company, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  // Şirket kontrolü sonrası dashboard işlemlerine devam ediyoruz
  if (!company) {
    return null;
  }

  // Şirketin durumlarını kontrol etme
  const isBuyerPending = company?.isBuyer && company?.isBuyerConfirmed === 'pending';
  const isSellerPending = company?.isSeller && company?.isSellerConfirmed === 'pending';
  const isBuyerRejected = company?.isBuyer && company?.isBuyerConfirmed === 'no';
  const isSellerRejected = company?.isSeller && company?.isSellerConfirmed === 'no';

  // Destek sistemine yönlendirme işlemi
  const handleSupportRedirect = () => {
    navigate('/support');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isBuyerPending && (
        <div className="bg-yellow-100 p-4 mb-4 rounded">
          Şirketiniz alıcı olarak onay beklemektedir.
        </div>
      )}
      {isSellerPending && (
        <div className="bg-yellow-100 p-4 mb-4 rounded">
          Şirketiniz satıcı olarak onay beklemektedir.
        </div>
      )}
      {isBuyerRejected && (
        <div className="bg-red-100 p-4 mb-4 rounded">
          Şirketinizin alıcı olarak sistemimize dahil olması red edilmiştir.
          <button 
            onClick={() => handleOpenModal(company.buyerRejectionReason)} 
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded">
            İşlemler
          </button>
        </div>
      )}
      {isSellerRejected && (
        <div className="bg-red-100 p-4 mb-4 rounded">
          Şirketinizin satıcı olarak sistemimize dahil olması red edilmiştir.
          <button 
            onClick={() => handleOpenModal(company.sellerRejectionReason)} 
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded">
            İşlemler
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-4">Red Nedeni</h2>
              <p className="text-gray-700 mb-4">{rejectionReason || 'Red nedeni belirtilmemiş.'}</p>
              
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">Destek Bilgilendirme</h3>
                <p className="text-gray-600 mt-2">
                  Firma bilgilerinizi güncellemek veya itiraz etmek için destek sistemimizi kullanabilirsiniz.
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleCloseModal} 
                  className="bg-gray-400 text-white px-4 py-2 rounded mr-4">
                  Kapat
                </button>
                <button 
                  onClick={handleSupportRedirect} 
                  className="bg-indigo-500 text-white px-4 py-2 rounded">
                  Destek Sistemine Git
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {company.isBuyerConfirmed === 'yes' && company.isSellerConfirmed === 'yes' ? (
        <CombinedDashboard />
      ) : (
        <>
          {company.isBuyerConfirmed === 'yes' && <StaticDashboard />}
          {company.isSellerConfirmed === 'yes' && <SalerDashboard />}
        </>
      )}
    </div>
  );
}

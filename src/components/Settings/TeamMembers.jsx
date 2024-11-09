import React, { useState, useEffect } from 'react';
import { getDoc, doc } from "firebase/firestore";
import { auth } from '../../firebaseConfig';
import swal from 'sweetalert';
import { useNavigate, NavLink } from 'react-router-dom';
import { API_URL } from '../../config';
import { useCompany } from '../../context/CompanyContext'; // useCompany import edildi

function TeamMembers() {
  const { company, loading: companyLoading } = useCompany(); // Company verisi alındı
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
  });
  const ProfilePhoto = 'profilepic.svg';
  const navigate = useNavigate();

  useEffect(() => {
    if (!companyLoading && !company) {
      swal("Şirket bulunamadı", "Bu kullanıcı ile ilişkilendirilmiş bir şirket bulunamadı.", "error").then(() => {
        navigate('/dashboard');
      });
    } else if (company) {
      const fetchTeamMembers = async () => {
        try {
          const teamMembersArray = company.teamMembers || [];
          const teamMembersData = [];

          for (const member of teamMembersArray) {
            const userDoc = await getDoc(doc(db, "users", member.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              teamMembersData.push({
                ...userData,
                role: member.role,
              });
            }
          }
          setTeamMembers(teamMembersData);
        } catch (error) {
          console.error("Ekip üyeleri alınırken hata oluştu: ", error);
          swal("Hata", error.message, "error");
        }
      };

      fetchTeamMembers();
    }
  }, [company, companyLoading, navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/addTeamMember`, { // API URL kullanıldı
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          companyId: company.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        swal("Başarılı!", "Ekip üyesi başarıyla eklendi.", "success");
        closeModal();

        // Yeni eklenen kullanıcıyı mevcut teamMembers listesine ekle
        setTeamMembers((prevMembers) => [...prevMembers, result.user]);
      } else {
        swal("Hata", result.message, "error");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      swal("Hata", "Ekip üyesi eklenirken bir hata oluştu.", "error");
    }
  };

  if (companyLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="">
      {/* Static Tabs */}
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

      {/* Display Company Name */}
      <h2 className="text-2xl font-bold mb-6">Ekip Üyeleri</h2>
      <div className="space-y-4">
        {teamMembers.length > 0 ? (
          teamMembers.map((member, index) => (
            <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <img
                  className="h-12 w-12 rounded-full"
                  src={ProfilePhoto}
                  alt="Profile"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{member.fullName}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-sm text-gray-600">{member.phone}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Bu şirkete ait ekip üyesi bulunmamaktadır.</p>
        )}
      </div>

      {/* Add Member Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={openModal}
        >
          Ekip Üyesi Ekle
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-5 sm:px-10 sm:py-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5" id="modal-title">
                  Ekip Üyesi Ekle
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input 
                      type="text" 
                      name="name" 
                      id="name" 
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Mesleği</label>
                    <input 
                      type="text" 
                      name="role" 
                      id="role" 
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                      value={formData.role}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon Numarası</label>
                    <input 
                      type="text" 
                      name="phone" 
                      id="phone" 
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Posta</label>
                    <input 
                      type="email" 
                      name="email" 
                      id="email" 
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <p className="mt-1 text-sm text-gray-500">Kurumsal e-posta adresini giriniz.</p>
                  </div>
                  <div className="w-full">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input 
                      type="password" 
                      name="password" 
                      id="password" 
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" 
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="bg-gray-50 px-6 py-3 sm:px-10 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Ekle
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Vazgeç
                    </button>
                  </div>
                </form>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamMembers;

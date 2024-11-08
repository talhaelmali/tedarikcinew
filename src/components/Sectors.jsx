import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getFirestore, collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();

export default function Sectors() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        checkUserPermissionAndExistingSectors(user);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Yetkisiz Giriş',
          text: 'Giriş yapmanız gerekiyor.',
        }).then(() => {
          navigate('/pricing');
        });
      }
    });

    return () => unsubscribe();
  }, [companyId, navigate, auth]);

  const checkUserPermissionAndExistingSectors = async (user) => {
    try {
      const userId = user.uid;
      const companyRef = doc(db, 'companies', companyId);
      const companyDoc = await getDoc(companyRef);
  
      if (companyDoc.exists()) {
        const companyData = companyDoc.data();
  
        if (companyData.adminUserId !== userId) {
          Swal.fire({
            icon: 'error',
            title: 'Yetkisiz Giriş',
            text: 'Bu şirketi düzenlemeye yetkiniz yok. Eğer bir hata olduğunu düşünüyorsanız lütfen bir destek talebi oluşturun.',
          }).then(() => {
            navigate('/dashboard');
          });
          return;
        }
  
        if (companyData.sectors && companyData.sectors.length > 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Uyarı',
            text: 'Sektör seçimi daha önce yapılmış, firma ayarlarından sektörleri güncelleyebilirsiniz.',
          }).then(() => {
            navigate('/dashboard');
          });
        } else {
          fetchSectors();
        }
      } else {
        throw new Error('Şirket bilgileri bulunamadı.');
      }
    } catch (error) {
      console.error('Error checking user permissions or existing sectors:', error);
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Kontrol sırasında bir hata oluştu.',
      });
      navigate('/dashboard');
    }
  };

  const fetchSectors = async () => {
    try {
      const q = query(collection(db, 'sectors'), where('type', '==', 'Alt Sektör'));
      const querySnapshot = await getDocs(q);
      const fetchedSectors = querySnapshot.docs.map(doc => doc.data().name);
      
      const uniqueSectors = [...new Set(fetchedSectors)].sort((a, b) => a.localeCompare(b));
      
      const options = uniqueSectors.map(sector => ({
        value: sector,
        label: sector,
      }));
      
      setSectorOptions(options);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      setFetchError('Sektör bilgileri alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedSectors(selectedOptions.map(option => option.value));
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
        navigate('/success');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Sektörler kaydedilirken bir hata oluştu: ' + error.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-20">
      {loading ? (
        <p>Loading...</p>
      ) : fetchError ? (
        <p className="text-red-500">{fetchError}</p>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-medium leading-6 text-gray-900">Sektör Seç</h2>
            <p className="mt-1 text-sm text-gray-500">Firmanızın ilanlarla eşleşebilmesi için sektör seçiniz. En fazla <strong>3 sektör</strong> seçilebilir.</p>
          </div>
          <div className="mt-6">
            <div className="sm:col-span-4">
              <label htmlFor="sectors" className="block text-sm font-medium text-gray-700">
                Sektör Seçimi
              </label>
              <Select
                isMulti
                name="sectors"
                options={sectorOptions}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                classNamePrefix="select"
                onChange={handleSelectChange}
                value={sectorOptions.filter(option => selectedSectors.includes(option.value))}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                menuPosition="fixed"
                maxMenuHeight={150}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </>
      )}
    </div>
  );
}

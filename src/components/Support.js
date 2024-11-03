import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

export default function Support() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState([]); // Multiple files state
  const [currentUser, setCurrentUser] = useState(null);
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          const companiesRef = collection(db, 'companies');
          const q = query(companiesRef, where('adminUserId', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const companyDoc = querySnapshot.docs[0];
            setCompanyId(companyDoc.id); 
          } else {
            console.log('CompanyId bulunamadı!');
          }
        } catch (error) {
          console.error('companyId alınırken hata oluştu: ', error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    const allowedFormats = ['image/png', 'image/jpeg', 'application/pdf'];
    
    // Format ve boyut kontrolü
    const validFiles = selectedFiles.filter((file) => {
      if (!allowedFormats.includes(file.type)) {
        Swal.fire('Hata', `Sadece PNG, JPG ve PDF formatları kabul edilmektedir.`, 'error');
        return false;
      }
      if (file.size > maxFileSize) {
        Swal.fire('Hata', `${file.name} 20 MB'den büyük olamaz.`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length + files.length > 5) {
      Swal.fire('Hata', 'En fazla 5 dosya yükleyebilirsiniz.', 'error');
      return;
    }

    if (totalSize > maxFileSize * validFiles.length) {
      Swal.fire('Hata', 'Toplam dosya boyutu 20 MB\'yi geçemez.', 'error');
      return;
    }

    setFiles([...files, ...validFiles]);
  };

  const handleRemoveFile = (fileIndex) => {
    setFiles(files.filter((_, index) => index !== fileIndex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Konu ve mesaj alanları zorunludur.',
      });
      return;
    }

    const supportId = uuidv4(); // Generate a unique ID for the support request

    try {
      const uploadedFilesURLs = await Promise.all(files.map(async (file) => {
        const storageRef = ref(storage, `supportAttachments/${supportId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      }));

      const supportRef = doc(db, 'supports', supportId);
      await setDoc(supportRef, {
        subject: formData.subject,
        message: formData.message,
        attachmentURLs: uploadedFilesURLs, // Multiple attachment URLs
        userId: currentUser ? currentUser.uid : null,
        companyId,
        createdAt: new Date(),
      });

      Swal.fire({
        icon: 'success',
        title: 'Başarılı',
        text: 'Destek talebiniz başarıyla gönderildi.',
      });

      // Formu temizle
      setFormData({
        subject: '',
        message: '',
      });
      setFiles([]);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Destek talebi gönderilirken bir hata oluştu: ' + error.message,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800">Destek Talebi Gönder</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Konu
          </label>
          <select
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          >
            <option value="" disabled>
              Konu seçin
            </option>
            <option value="Firma Bilgilerimi Güncellemek İstiyorum">Firma Bilgilerimi Güncellemek İstiyorum</option>
            <option value="Uyuşmazlık Çözümü">Uyuşmazlık Çözümü</option>
            <option value="Teknik Destek">Teknik Destek</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mesaj
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Ekler (Opsiyonel)
          </label>
          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H20a2 2 0 00-2 2v28a2 2 0 002 2h8a2 2 0 002-2V10a2 2 0 00-2-2zm-2 32H22V12h4v28zM12 6h24v4H12V6zm0 32h24v4H12v-4z"
                  fill="currentColor"
                />
              </svg>
              {files.length > 0 ? (
                <div className="mt-2 flex flex-col items-center justify-center">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between w-full">
                      <span className="text-sm text-gray-500">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500"
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
                    >
                      <span>Dosya yükleyin veya sürükleyin</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        multiple // Multiple file upload
                      />
                    </label>
                    <p className="pl-1">PNG, JPG, PDF up to 20MB, max 5 files</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Gönder
          </button>
        </div>
      </form>
    </div>
  );
}

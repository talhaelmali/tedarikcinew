import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../screens/Footer';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true); // Başlamadan önce loading'i true yap
    try {
      const querySnapshot = await getDocs(collection(db, 'announcements'));
      const announcementsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Başlıksız',
          coverImageUrl: data.coverImageUrl || '',
          content: truncateContent(stripHtml(data.content || ''), 150),
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString('tr-TR') : 'Tarih bilinmiyor',
        };
      });
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Duyurular alınırken bir hata oluştu:', error);
    } finally {
      setLoading(false); // Veriler alındıktan sonra loading'i false yap
    }
  };

  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  };

  return (
    <>
      <Header />
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Duyurular</h2>
            <p className="mt-3 max-w-2xl text-xl text-gray-500 mx-auto">E-Tedarikçi platformundaki önemli duyuruları inceleyin</p>
          </div>

          {/* Loading Spinner */}
          {loading ? (
            <div className="flex justify-center items-center mt-10">
              <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            </div>
          ) : (
            <div className="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={announcement.coverImageUrl}
                      alt={announcement.title}
                    />
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <Link to={`/announcements/${announcement.id}`} className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{announcement.title}</p>
                        <p className="mt-3 text-base text-gray-500">{announcement.content}</p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="./favicon.png"
                          alt="Duyuru"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={announcement.date}>{announcement.date}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Announcements;

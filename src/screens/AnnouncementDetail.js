import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Header from '../components/Header';
import Footer from './Footer';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const docRef = doc(db, 'announcements', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnnouncement({
          ...data,
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString('tr-TR') : 'Tarih bilinmiyor',
        });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Duyuru verisi alınırken bir hata oluştu:', error);
    }
  };

  if (!announcement) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {announcement.title}
            </h1>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Tarih: <span className="font-medium">{announcement.date}</span>
              </p>
            </div>
            <figure className="mt-8">
              <img
                alt="Kapak Görseli"
                src={announcement.coverImageUrl}
                className="aspect-video rounded-xl bg-gray-50 object-cover"
              />
            </figure>
          </div>

          <div className="mt-6 text-xl leading-8">
            <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AnnouncementDetail;

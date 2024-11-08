import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Header from '../components/Header';
import Footer from './Footer';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlog({
          ...data,
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString('tr-TR') : 'Tarih bilinmiyor',
        });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Blog verisi alınırken bir hata oluştu:', error);
    }
  };

  if (!blog) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <div className="mx-auto max-w-2xl text-center">
            {blog.category && (
              <p className="text-base font-semibold leading-7 text-indigo-600">
                {blog.category}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blog.title}
            </h1>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                Yazar: <span className="font-medium">{blog.author || 'Bilinmeyen Yazar'}</span>
              </p>
              <p>
                Tarih: <span className="font-medium">{blog.date}</span>
              </p>
            </div>
            <figure className="mt-8">
              <img
                alt="Kapak Görseli"
                src={blog.coverImageUrl}
                className="aspect-video rounded-xl bg-gray-50 object-cover"
              />
            </figure>
          </div>

          <div className="mt-6 text-xl leading-8">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';

const FeaturedBlogs = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const Favicon = "./favicon.png";

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  const fetchFeaturedPosts = async () => {
    try {
      // 'isFeatured' alanı true olan blogları getiriyoruz
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, where('isFeatured', '==', true));
      const querySnapshot = await getDocs(q);

      const postsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Başlıksız',
          coverImageUrl: data.coverImageUrl || '',
          content: truncateContent(stripHtml(data.content || ''), 150),
          category: data.category || '',
          date: data.createdAt ? data.createdAt.toDate().toLocaleDateString('tr-TR') : 'Tarih bilinmiyor',
          author: data.author || 'Bilinmeyen Yazar',
        };
      });

      setFeaturedPosts(postsData);
    } catch (error) {
      console.error('Öne çıkan yazılar alınırken bir hata oluştu:', error);
    }
  };

  // HTML etiketlerini temizlemek için
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // İçeriği belirli bir uzunluğa kadar kısaltmak için
  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  };

  return (
    <div className="relative px-6 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="absolute inset-0"></div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Öne Çıkan Yazılar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            E-Tedarikçi yazarlarının sizin için hazırladığı özel içerikler
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <img alt="" src={post.coverImageUrl} className="h-48 w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  {post.category && (
                    <p className="text-sm font-medium text-indigo-600">
                      <span className="">
                        {post.category}
                      </span>
                    </p>
                  )}
                  <Link to={`/blogs/${post.id}`} className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.content}</p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="sr-only">{post.author}</span>
                    <img src={Favicon} alt="Yazar" className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      <span className="hover:underline">
                        {post.author}
                      </span>
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.date}>{post.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBlogs;

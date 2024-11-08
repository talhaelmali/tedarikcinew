import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('logoUrl') || '');

  useEffect(() => {
    const docRef = doc(db, 'cms', 'seo');

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const url = docSnap.data().logoUrl;
        localStorage.setItem('logoUrl', url);
        setLogoUrl(url);
      } else {
        console.error('Logo document not found');
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return logoUrl;
};

export default useLogo;

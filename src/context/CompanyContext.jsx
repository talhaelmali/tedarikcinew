import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = useCallback(async (user) => {
    const db = getFirestore();
    let companyData = null;

    try {
      // 1. AdminUserId sorgusu
      const q1 = query(collection(db, 'companies'), where('adminUserId', '==', user.uid));
      const querySnapshot1 = await getDocs(q1);

      querySnapshot1.forEach((doc) => {
        companyData = { id: doc.id, ...doc.data() };
      });

      // 2. Eğer kullanıcı admin değilse, teamMembers object veya array formatında manuel kontrol yap
      if (!companyData) {
        const q2 = query(collection(db, 'companies'));
        const querySnapshot2 = await getDocs(q2);

        querySnapshot2.forEach((doc) => {
          const teamMembers = doc.data().teamMembers || [];

          // Array formatında teamMembers kontrolü
          if (Array.isArray(teamMembers)) {
            const isUserInTeamArray = teamMembers.some(member => member.userId === user.uid);
            if (isUserInTeamArray) {
              companyData = { id: doc.id, ...doc.data() };
            }
          }

          // Object formatında teamMembers kontrolüs
          if (!Array.isArray(teamMembers)) {
            const isUserInTeamObject = Object.keys(teamMembers).some((memberId) => memberId === user.uid);
            if (isUserInTeamObject) {
              companyData = { id: doc.id, ...doc.data() };
            }
          }
        });
      }

      setCompany(companyData);
    } catch (error) {
      console.error('Şirket sorgulanırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true); // Kullanıcı giriş yaptığında loading'i true yapıyoruz
        fetchCompany(user);
      } else {
        setCompany(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchCompany]);

  return (
    <CompanyContext.Provider value={{ company, loading }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  return useContext(CompanyContext);
};

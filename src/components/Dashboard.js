import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import StaticDashboard from './StaticDashboard';
import SalerDashboard from './SalerDashboard';
import CombinedDashboard from './CombinedDashboard';

const db = getFirestore();

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      if (currentUser) {
        const q = query(collection(db, 'companies'), 
                        where('adminUserId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        let companyData = null;

        querySnapshot.forEach((doc) => {
          companyData = doc.data();
        });

        if (!companyData) {
          const q2 = query(collection(db, 'companies'), 
                           where('Users', 'array-contains', currentUser.uid));
          const querySnapshot2 = await getDocs(q2);

          querySnapshot2.forEach((doc) => {
            companyData = doc.data();
          });
        }

        setCompany(companyData);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!company) {
    return <div>No company found for this user.</div>;
  }

  const isBuyerConfirmed = company.isBuyer && company.isBuyerConfirmed === 'yes';
  const isSellerConfirmed = company.isSeller && company.isSellerConfirmed === 'yes';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mt-6">
        {company.isBuyer && (
          <p><strong>Alıcı Onayı:</strong> {company.isBuyerConfirmed}</p>
        )}
        {company.isSeller && (
          <p><strong>Satıcı Onayı:</strong> {company.isSellerConfirmed}</p>
        )}
      </div>

      {isBuyerConfirmed && isSellerConfirmed ? (
        <CombinedDashboard />
      ) : (
        <>
          {isBuyerConfirmed && <StaticDashboard />}
          {isSellerConfirmed && <SalerDashboard />}
        </>
      )}
    </div>
  );
}

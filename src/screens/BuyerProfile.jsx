import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, setDoc, collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

function BuyerProfile() {
  const { companyId } = useParams();
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const buyerProfileDoc = doc(collection(db, "companies", companyId, "buyerProfiles"));

    try {
      await setDoc(buyerProfileDoc, {
        name: buyerName,
        contact: buyerContact,
        status: "pending"
      });
      alert("Alıcı profili başarıyla oluşturuldu!");
    } catch (error) {
      alert("Alıcı profili oluşturulurken hata oluştu: " + error.message);
    }
  };

  return (
    <div>
      <h1>Alıcı Profili Oluştur</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Alıcı Adı:
          <input type="text" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
        </label>
        <label>
          İletişim Bilgileri:
          <input type="text" value={buyerContact} onChange={e => setBuyerContact(e.target.value)} />
        </label>
        <button type="submit">Profili Kaydet</button>
      </form>
    </div>
  );
}

export default BuyerProfile;

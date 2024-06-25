import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, collection, setDoc, getFirestore } from "firebase/firestore";
import Swal from 'sweetalert2';

const db = getFirestore();

function CreatePurchaseRequest() {
  const { companyId, buyerProfileId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [bidType, setBidType] = useState('closed'); // Default to closed

  // Initialize start date as now and end date as three days from now
  const now = new Date();
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const [startDate, setStartDate] = useState(now.toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm format
  const [endDate, setEndDate] = useState(threeDaysLater.toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm format

  const handleSubmit = async (event) => {
    event.preventDefault();
    const purchaseRequestRef = doc(collection(db, "companies", companyId, "buyerProfiles", buyerProfileId, "purchaseRequests"));

    try {
      await setDoc(purchaseRequestRef, {
        title,
        description,
        coverImage,
        bidType,
        startDate: startDate,
        endDate: bidType === 'open' ? endDate : null
      });
      if (bidType === 'open') {
        Swal.fire({
          title: 'Bilgilendirme',
          text: 'Bu ihale 3 gün için açık kalacaktır ve en düşük teklif otomatik olarak kabul edilecektir.',
          icon: 'info',
          confirmButtonText: 'Tamam'
        });
      }
      alert("Alış talebi başarıyla oluşturuldu!");
    } catch (error) {
      alert("Alış talebi oluşturulurken bir hata oluştu: " + error.message);
    }
  };

  return (
    <div>
      <h1>Alış Talebi Oluştur</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Başlık:
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
        <label>
          Açıklama:
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          Kapak Resmi URL:
          <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
        </label>
        <label>
          İhale Türü:
          <select value={bidType} onChange={e => setBidType(e.target.value)}>
            <option value="closed">Kapalı İhale</option>
            <option value="open">Açık İhale</option>
          </select>
        </label>
        <button type="submit">Alış Talebi Oluştur</button>
      </form>
    </div>
  );
}

export default CreatePurchaseRequest;

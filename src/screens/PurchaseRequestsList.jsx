import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const db = getFirestore();

function PurchaseRequestsList() {
  const [openRequests, setOpenRequests] = useState([]);
  const [closedRequests, setClosedRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const companiesRef = collection(db, "companies");
      const companiesSnap = await getDocs(companiesRef);

      let tempOpenRequests = [];
      let tempClosedRequests = [];
      for (const companyDoc of companiesSnap.docs) {
        const companyName = companyDoc.data().name;
        const buyerProfilesRef = collection(db, "companies", companyDoc.id, "buyerProfiles");
        const buyerProfilesSnap = await getDocs(buyerProfilesRef);

        for (const profileDoc of buyerProfilesSnap.docs) {
          const purchaseRequestsRef = collection(db, "companies", companyDoc.id, "buyerProfiles", profileDoc.id, "purchaseRequests");
          const purchaseRequestsSnap = await getDocs(purchaseRequestsRef);

          for (const requestDoc of purchaseRequestsSnap.docs) {
            const requestData = {
              id: requestDoc.id,
              title: requestDoc.data().title,
              description: requestDoc.data().description,
              coverImage: requestDoc.data().coverImage,
              companyName: companyName,
              bidType: requestDoc.data().bidType,
              endDate: requestDoc.data().endDate
            };

            if (requestData.bidType === 'open') {
              tempOpenRequests.push(requestData);
            } else {
              tempClosedRequests.push(requestData);
            }
          }
        }
      }
      setOpenRequests(tempOpenRequests);
      setClosedRequests(tempClosedRequests);
    };

    fetchRequests();
  }, []);

  function CountdownTimer({ endDate }) {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
      if (!timeLeft[interval]) {
        return;
      }

      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    });

    return (
      <div>{timerComponents.length ? timerComponents : <span>Time's up!</span>}</div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h1>Açık İhaleler</h1>
        {openRequests.map(request => (
          <div key={request.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <img src={request.coverImage} alt="Kapak Resmi" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h2>{request.title}</h2>
            <p>{request.description}</p>
            <p>Şirket: {request.companyName}</p>
            <p>Bitiş Zamanı: <CountdownTimer endDate={request.endDate} /></p>
          </div>
        ))}
      </div>
      <div>
        <h1>Kapalı İhaleler</h1>
        {closedRequests.map(request => (
          <div key={request.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <img src={request.coverImage} alt="Kapak Resmi" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <h2>{request.title}</h2>
            <p>{request.description}</p>
            <p>Şirket: {request.companyName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PurchaseRequestsList;

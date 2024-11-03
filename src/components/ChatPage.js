import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, getFirestore, doc, getDoc, getDocs } from 'firebase/firestore';
import { PaperAirplaneIcon, StarIcon as FilledStarIcon, StarIcon as OutlineStarIcon } from '@heroicons/react/24/solid';
import OrderDetailsModal from './OrderDetailsModal';  // Sipariş Detayları Modal'ını ekliyoruz
import { useCompany } from '../context/CompanyContext'; // Import the context

const db = getFirestore();

const ChatPage = () => {
  const { orderId, companyId1, companyId2 } = useParams();
  const navigate = useNavigate();
  const { company: currentUserCompany } = useCompany(); // Get the current user's company from the context
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [order, setOrder] = useState(null);  // Sipariş bilgileri için state
  const [otherCompanyName, setOtherCompanyName] = useState('');
  const [rating, setRating] = useState(null);  // Rating state
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);  // Modal state

  const chatId = `${orderId}_${companyId1}_${companyId2}`;
  let otherCompanyId = '';

  // Check if the user has access to this chat
  useEffect(() => {
    if (!currentUserCompany) return;

    const checkAuthorization = () => {
      const userCompanyId = currentUserCompany.id;

      // Determine the other company ID
      if (userCompanyId === companyId1) {
        otherCompanyId = companyId2;  // Other company is companyId2
      } else if (userCompanyId === companyId2) {
        otherCompanyId = companyId1;  // Other company is companyId1
      } else {
        navigate('/');  // Redirect if the user is not part of the chat
        return;
      }

      setAuthorized(true);
      fetchCompanyInfo(otherCompanyId);  // Fetch other company's info
    };

    checkAuthorization();
  }, [currentUserCompany, navigate, companyId1, companyId2]);

  // Fetch the other company's info
  const fetchCompanyInfo = async (companyId) => {
    if (!companyId) return;  // Return if companyId is invalid

    const companyDoc = await getDoc(doc(db, 'companies', companyId));
    if (companyDoc.exists()) {
      const companyData = companyDoc.data();
      setOtherCompanyName(companyData.companyName);
      fetchRating(companyId);
    } else {
      console.error('Company not found');
    }
  };

  const fetchRating = async (companyId) => {
    const ratingsRef = collection(db, 'companies', companyId, 'ratings');
    const ratingsSnapshot = await getDocs(ratingsRef);
    if (!ratingsSnapshot.empty) {
      let totalRating = 0;
      let ratingCount = 0;
      ratingsSnapshot.forEach((doc) => {
        const data = doc.data();
        const average = (data.communication + data.quality + data.speed) / 3;
        totalRating += average;
        ratingCount++;
      });
      setRating((totalRating / ratingCount).toFixed(1));
    } else {
      setRating('N/A');  // Set rating as N/A if not available
    }
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setOrder(orderSnap.data());
      } else {
        console.error('Order not found');
      }
    };

    fetchOrder();
  }, [orderId]);

  // Fetch messages from Firestore
  useEffect(() => {
    if (!authorized) return;

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId, authorized]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
  
    // Save the message in Firestore
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      chatId,
      userId: currentUserCompany.id,
      userName: currentUserCompany.companyName,
      message: newMessage,
      createdAt: new Date(),
    });
  
    // Determine the recipient company's ID
    let recipientCompanyId = currentUserCompany.id === companyId1 ? companyId2 : companyId1;
  
    // Send a notification to the recipient company
    const notificationMessage = `Yeni bir mesaj aldınız: ${newMessage.substring(0, 20)}...`;
  
    await addDoc(collection(db, 'notifications'), {
      companyId: recipientCompanyId,
      message: notificationMessage,
      route: `/chat/${orderId}/${companyId1}/${companyId2}`,
      read: false,
      timestamp: new Date(),
      type: "Mesaj"  // Adding the default type as "Mesaj"
    });
  
    setNewMessage('');  // Clear the input field
  };
  

  const handleOpenOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setIsOrderDetailsModalOpen(false);
  };

  // Render the rating stars
  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(filledStars)].map((_, index) => (
          <FilledStarIcon key={index} className="h-5 w-5 text-yellow-500" />
        ))}
        {hasHalfStar && <OutlineStarIcon key="half-star" className="h-5 w-5 text-gray-300" />}
        {[...Array(emptyStars)].map((_, index) => (
          <OutlineStarIcon key={index} className="h-5 w-5 text-gray-300" />
        ))}
      </div>
    );
  };

  if (!authorized) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white border">
      {/* Other Company Info */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/profilepic.svg?alt=media&token=b85d5d31-8627-48b9-9691-335d0d58329e"
            alt="Profile"
          />
          <div className="ml-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900">{otherCompanyName}</h3>
              <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded">
                {rating !== 'N/A' && (
                  <>
                    {renderStars(rating)}
                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                  </>
                )}
                {rating === 'N/A' && <span className="text-sm font-medium text-gray-600">Puanlanmadı</span>}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              @{otherCompanyName.split(' ').map((word) => word[0] + '****').join(' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Order Info */}
      {order && (
        <div className="bg-white shadow p-4 flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900">Sipariş İlan Adı: {order.ad.title}</h3>
              <p className="text-sm text-gray-500">Sipariş İçeriği: {order.ad.content}</p>
              <p className="text-sm text-gray-600">Sipariş ID: {orderId}</p>
            </div>
          </div>
          <button
            onClick={handleOpenOrderDetailsModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Sipariş Detaylarını Göster
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-white shadow p-4 text-lg font-semibold text-gray-900">Mesajlaşma</div>
      <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 my-2 rounded-lg max-w-[45%] ${
              msg.userId === currentUserCompany.id ? 'bg-green-100 self-end ml-auto' : 'bg-gray-100 self-start mr-auto'
            }`}
          >
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(msg.createdAt.seconds * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 shadow flex items-center rounded-full">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="flex-1 p-2 border border-gray-300 rounded-full pl-4 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-4 rounded-full flex items-center justify-center ml-2"
        >
          <PaperAirplaneIcon className="h-5 w-5 transform" />
        </button>
      </div>

      {/* Order Details Modal */}
      {isOrderDetailsModalOpen && order && (
        <OrderDetailsModal order={order} closeModal={handleCloseOrderDetailsModal} />
      )}
    </div>
  );
};

export default ChatPage;

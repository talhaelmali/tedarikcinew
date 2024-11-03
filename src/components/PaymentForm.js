import React, { useEffect, useState } from 'react';

const PaymentForm = ({ onPaymentSuccess, onPaymentCancel }) => {
  const [checkoutFormHtml, setCheckoutFormHtml] = useState('');

  useEffect(() => {
    const fetchPaymentForm = async () => {
      try {
        const response = await fetch('http://localhost:5000/createPayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            totalPrice: 100.00,
            buyer: {
              id: 'BY789',
              firstName: 'Adınız',
              lastName: 'Soyadınız',
              phoneNumber: '5555555555',
              email: 'email@example.com',
              identityNumber: '11111111111',
              address: 'Adresiniz',
              city: 'Şehir',
              country: 'Türkiye',
            },
            basketItems: [
              {
                id: 'item1',
                name: 'Ürün 1',
                category: 'Kategori',
                price: 50.00,
              },
              {
                id: 'item2',
                name: 'Ürün 2',
                category: 'Kategori',
                price: 50.00,
              },
            ],
          }),
        });

        const paymentData = await response.json();

        if (paymentData.success && paymentData.checkoutFormContent) {
          setCheckoutFormHtml(paymentData.checkoutFormContent);
        } else {
          throw new Error('Ödeme formu oluşturulamadı.');
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    };

    fetchPaymentForm();
  }, []);

  const handlePaymentComplete = () => {
    onPaymentSuccess();
  };

  const handlePaymentCancel = () => {
    onPaymentCancel();
  };

  return (
    <div>
      {checkoutFormHtml ? (
        <iframe
          srcDoc={checkoutFormHtml}
          width="100%"
          height="500px"
          frameborder="0"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      ) : (
        <p>Ödeme formu yükleniyor...</p>
      )}
      <button onClick={handlePaymentComplete}>Ödeme Tamamlandı</button>
      <button onClick={handlePaymentCancel}>İptal</button>
    </div>
  );
};

export default PaymentForm;

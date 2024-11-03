const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // Dynamic import for node-fetch

const serviceAccount = require('./ihale-6cb24-firebase-adminsdk-1qgno-0d8e2e2728.json');

// Firebase Admin SDK'yı başlatma (ihale-6cb24 projesine bağlanacak)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ihale-6cb24',
});

// Firestore referansı (ihale-6cb24 projesindeki Firestore)
const db = admin.firestore();

// Express uygulaması
const app = express();

// CORS ayarları: İzin verilen domain'ler listesi
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://e-tedarikci.com',
  'https://admin.e-tedarikci.com',
  'https://www.e-tedarikci.com',
  'https://sigma-celerity-432120-e2.web.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy error: Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// JSON verilerini işlemek için bodyParser
app.use(bodyParser.json());

// SendGrid API anahtarını ayarlama
sgMail.setApiKey('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'); // SendGrid API anahtarınızı buraya ekleyin

// Test endpoint'i
app.get('/test', (req, res) => {
  res.send('Uygulama çalışıyor');
});

// Yeni sendNotificationEmail endpoint'i
app.post('/sendNotificationEmail', async(req, res) => {
  const {recipientEmail, subject, message} = req.body;

  const msg = {
    to: recipientEmail,
    from: 'destek@e-tedarikcim.com', // Kendi e-posta adresinizi buraya ekleyin
    subject,
    text: message,
    html: `<p>${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({success: true});
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({success: false, message: error.message});
  }
});

// Mevcut sendEmail endpoint'i
app.post('/sendEmail', async(req, res) => {
  const {senderEmail, recipientEmail, subject, message} = req.body;

  const msg = {
    to: recipientEmail,
    from: senderEmail,
    subject,
    text: message,
    html: message,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({success: true});
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({success: false, message: error.message});
  }
});

// Yeni admin kullanıcı oluşturma endpoint'i
app.post('/createAdminUser', async(req, res) => {
  const {name, email, password, role} = req.body;

  try {
    // Firebase Authentication ile kullanıcı oluşturma
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Firestore'da kullanıcıyı adminusers koleksiyonuna kaydetme
    const userData = {
      uid: userRecord.uid,
      fullName: name,
      email: email,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('adminusers').doc(userRecord.uid).set(userData);

    res.status(200).json({success: true, message: 'Kullanıcı başarıyla oluşturuldu', user: userData});
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({success: false, message: error.message});
  }
});

// Yeni kullanıcı oluşturma ve şirkete atama endpoint'i
app.post('/addTeamMember', async(req, res) => {
  const {name, email, password, role, companyId, phone} = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const userData = {
      uid: userRecord.uid,
      fullName: name,
      email,
      role,
      phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    if (companyId) {
      const companyRef = db.collection('companies').doc(companyId);
      await companyRef.update({
        teamMembers: admin.firestore.FieldValue.arrayUnion({
          userId: userRecord.uid,
          role,
        }),
      });
    }

    res.status(200).json({success: true, user: userData});
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({success: false, message: error.message});
  }
});

// Yeni translate endpoint'i
const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyDwdCLbDGEXMN6zmHoRcAd8EeIQCSx2sl0'; // Google API anahtarınızı buraya koyun

app.post('/translate', async(req, res) => {
  const {text, targetLang} = req.body;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'text',
        }),
        headers: {'Content-Type': 'application/json'},
      },
    );

    const data = await response.json();

    // Google API'den gelen yanıtı kontrol edin
    if (data && data.data && data.data.translations && data.data.translations.length > 0) {
      const translatedText = data.data.translations[0].translatedText;
      res.json({translatedText});
    } else {
      throw new Error('Invalid response from translation API');
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({error: 'Translation failed'});
  }
});

// Açık usul ihalelerde kazananı otomatik belirleyen fonksiyon
exports.handleAuctionEnd = functions.firestore
  .document('companies/{companyId}/ads/{adId}')
  .onUpdate(async(change, context) => {
    const adData = change.after.data();
    const adId = context.params.adId;
    const companyId = context.params.companyId;

    // İlanın süresinin dolup dolmadığını kontrol edin
    const now = admin.firestore.Timestamp.now();
    const endDate = adData.endDate;

    if (endDate && now.toMillis() > endDate.toMillis()) {
      try {
        // İlan süresi doldu, teklifleri toplayın
        const bidsSnapshot = await db.collection(`companies/${companyId}/ads/${adId}/bids`).get();
        if (!bidsSnapshot.empty) {
          const bids = bidsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
          // Teklifleri en düşük fiyata göre sıralayın
          const lowestBid = bids.reduce((min, bid) => bid.bidAmount < min.bidAmount ? bid : min, bids[0]);

          // Order oluşturun
          const orderData = {
            adId: adId,
            companyId: companyId,
            bid: lowestBid,
            orderDate: admin.firestore.Timestamp.now(),
          };
          await db.collection('orders').add(orderData);

          // Kazanan teklifi alan şirkete bildirim gönderin
          const notificationData = {
            companyId: lowestBid.bidderCompanyId,
            message: `Tebrikler! Teklifiniz kazandı.`,
            timestamp: admin.firestore.Timestamp.now(),
            read: false,
          };
          await db.collection('notifications').add(notificationData);

          console.log(`İlan ${adId} kazananı: ${lowestBid.bidderCompanyId}`);
        }
      } catch (error) {
        console.error('İhale sonuçlandırılırken hata oluştu:', error);
      }
    }
  });

// Firebase Functions olarak Express uygulamasını dışa aktarma
exports.app = functions.https.onRequest(app);

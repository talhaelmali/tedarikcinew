import React, { useState, useEffect, Suspense  } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams} from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2';
import { db } from './firebaseConfig';
import Layout from './components/Layout';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import { API_URL } from './config'; // API URL'yi import ediyoruz
import { LanguageProvider } from './context/LanguageContext'; // Dil sağlayıcısı
import Kvkk from './screens/Kvkk';
import Cookies from './screens/Cookies';
import Privacy from './screens/Privacy';
import Terms from './screens/Terms';
import Blogs from './screens/Blogs';
import Announcements from './components/Announcements';
import { useLocation } from 'react-router-dom';

 // LanguageProvider'ı import et



// Lazy loading components
const CreateCompany = React.lazy(() => import('./components/CreateCompany'));
const UpdateEmail = React.lazy(() => import('./components/Settings/UpdateEmail'));
const Register = React.lazy(() => import('./screens/Register'));
const Login = React.lazy(() => import('./screens/Login'));
const Sectors = React.lazy(() => import('./components/Sectors'));
const SuccessRegister = React.lazy(() => import('./components/SuccessRegister'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const CreateAd = React.lazy(() => import('./components/CreateAd'));
const AdDetails = React.lazy(() => import('./components/AdDetails'));
const Home = React.lazy(() => import('./screens/Home'));
const BidForm = React.lazy(() => import('./components/BidForm'));
const Ads = React.lazy(() => import('./screens/Ads'));
const AboutUs = React.lazy(() => import('./screens/AboutUs'));
const ContactUs = React.lazy(() => import('./screens/ContactUs'));
const BuyerAds = React.lazy(() => import('./screens/BuyerAds'));
const ChatPage = React.lazy(() => import('./components/ChatPage'));
const SellerApprovedAds = React.lazy(() => import('./screens/SellerApprovedAds'));
const BlogDetail = React.lazy(() => import('./screens/BlogDetail'));
const AnnouncementDetail = React.lazy(() => import('./screens/AnnouncementDetail'));
const Orders = React.lazy(() => import('./components/Orders'));
const SellerOrders = React.lazy(() => import('./components/SellerOrders'));
const Profile = React.lazy(() => import('./components/Settings/Profile'));
const Support = React.lazy(() => import('./components/Support'));
const CompanyDetails = React.lazy(() => import('./components/Settings/CompanyDetails'));
const TeamMembers = React.lazy(() => import('./components/Settings/TeamMembers'));
const Notifications = React.lazy(() => import('./screens/Notifications'));

// Logout component
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Başarıyla çıkış yapıldı!',
        }).then(() => {
          localStorage.removeItem('company'); // Company verisini localStorage'dan temizle
          navigate('/');
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Çıkış yapılırken bir hata oluştu.',
        });
      });
  }, [navigate]);

  return null;
};

const PrivateRoute = ({ children, requiredRole, allowNoCompany = true }) => {
  const { company, loading } = useCompany();
  const navigate = useNavigate();
  const location = useLocation(); // Mevcut konumu takip et
  const auth = getAuth();
  const user = auth.currentUser;
  const { companyId: routeCompanyId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Her yönlendirme veya konum değişiminde yetkilendirme durumunu sıfırla
    setIsAuthorized(false);

    if (loading) return;

    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Giriş Gerekli',
        text: 'Bu sayfaya erişmek için lütfen giriş yapın.',
      }).then(() => navigate('/login'));
      return;
    }

    if (!allowNoCompany && (!company || Object.keys(company).length === 0)) {
      Swal.fire({
        icon: 'info',
        title: 'Şirket Bilgisi Gerekli',
        text: 'Lütfen önce şirket bilgilerinizi oluşturun.',
      }).then(() => navigate('/createcompany'));
      return;
    }

    if (requiredRole === 'buyer' && company?.isBuyerConfirmed !== 'yes') {
      Swal.fire({
        icon: 'warning',
        title: 'Erişim Engellendi!',
        text: 'Alıcı profiliniz henüz onaylanmamış.',
      }).then(() => navigate('/dashboard'));
      return;
    }

    if (requiredRole === 'seller' && company?.isSellerConfirmed !== 'yes') {
      Swal.fire({
        icon: 'warning',
        title: 'Erişim Engellendi!',
        text: 'Satıcı profiliniz henüz onaylanmamış.',
      }).then(() => navigate('/dashboard'));
      return;
    }

    if (
      requiredRole === 'ownerOrSeller' &&
      (routeCompanyId !== company?.id && company?.isSellerConfirmed !== 'yes')
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Erişim Engellendi!',
        text: 'Bu sayfaya erişmek için ya ilanın sahibi olmalı ya da satıcı onayına sahip olmalısınız.',
      }).then(() => navigate('/dashboard'));
      return;
    }

    // Tüm şartlar sağlandıysa yetkilendirmeyi true olarak ayarla
    setIsAuthorized(true);
  }, [
    company,
    requiredRole,
    navigate,
    loading,
    user,
    allowNoCompany,
    routeCompanyId,
    location.pathname, // Konum değişikliklerinde tetikle
  ]);

  if (loading || !isAuthorized) {
    return <div>Loading...</div>;
  }

  return children;
};








const App = () => {
  const [seoData, setSeoData] = useState({
  });




  useEffect(() => {
    const savedSeoData = JSON.parse(localStorage.getItem('seoData'));

    if (savedSeoData) {
      setSeoData(savedSeoData);
    } else {
      const fetchSeoData = async () => {
        try {
          const docRef = doc(db, 'cms', 'seo');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const seoInfo = {
              siteTitle: data.siteTitle || 'Default Title',
              siteDescription: data.siteDescription || 'Default Description',
              faviconUrl: data.faviconUrl || '/default-favicon.png',
              logoUrl: data.logoUrl || '',
            };
            setSeoData(seoInfo);
            localStorage.setItem('seoData', JSON.stringify(seoInfo));
          }
        } catch (error) {
          console.error('Error fetching SEO data:', error);
        }
      };
      fetchSeoData();
    }
  }, []);

  return (
    <LanguageProvider>

    <CompanyProvider>
      <Router>
        <Helmet>
          <title>{seoData.siteTitle}</title>
          <meta name="description" content={seoData.siteDescription} />
          <link rel="icon" href={seoData.faviconUrl} />
          <meta property="og:title" content={seoData.siteTitle} />
          <meta property="og:description" content={seoData.siteDescription} />
          <meta property="og:image" content={seoData.logoUrl} />
        </Helmet>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/" element={<Home />} />
            <Route path="/kvkk" element={<Kvkk />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/duyurular" element={<Announcements />} />
            <Route
  path="/ad-details/:companyId/:adId/bid"
  element={
    <PrivateRoute requiredRole="seller">
      <Layout currentItem="Anasayfa">
        <BidForm />
      </Layout>
    </PrivateRoute>
  }
/>  

<Route
  path="/ad-details/:companyId/:adId"
  element={
    <PrivateRoute requiredRole="ownerOrSeller">
      <Layout currentItem="Anasayfa">
        <AdDetails />
      </Layout>
    </PrivateRoute>
  }
/>



            <Route
              path="/myorders"
              element={
                <PrivateRoute requiredRole="buyer">
                  <Layout currentItem="Siparişler">
                    <Orders />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/myads"
              element={
                <PrivateRoute requiredRole="buyer">
                  <Layout currentItem="İlanlarım">
                    <BuyerAds />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Seller-only Protected Routes */}
            <Route
              path="/sellermyorders"
              element={
                <PrivateRoute requiredRole="seller">
                  <Layout currentItem="Siparişler - Satıcı">
                    <SellerOrders />
                  </Layout>
                </PrivateRoute>
              }
            />
     <Route
  path="/createAd"
  element={
    <PrivateRoute requiredRole="buyer">
      <Layout currentItem="Anasayfa">
        <CreateAd />
      </Layout>
    </PrivateRoute>
  }
/>
            <Route
  path="/ads"
  element={
    <PrivateRoute requiredRole="seller">
      <Layout currentItem="İlanlar">
        <Ads />
      </Layout>
    </PrivateRoute>
  }
/><Route
  path="/dashboard"
  element={
    <PrivateRoute allowNoCompany={false}> {/* Şirket bilgisi zorunlu */}
      <Layout currentItem="Anasayfa">
        <Dashboard />
      </Layout>
    </PrivateRoute>
  }
/>  

            <Route path="/support" element={<Layout currentItem="Destek"><Support /></Layout>} />
            <Route path="/logout" element={<Logout />} />
            <Route
  path="/createcompany"
  element={
    <PrivateRoute allowNoCompany>
      <Layout currentItem="Anasayfa">
        <CreateCompany />
      </Layout>
    </PrivateRoute>
  }
/>           



            <Route
  path="/success"
  element={
    <PrivateRoute allowNoCompany={false}> {/* Şirket bilgisi zorunlu */}
      <Layout currentItem="">
        <SuccessRegister />
      </Layout>
    </PrivateRoute>
  }
/>  

<Route
  path="/notifications"
  element={
    <PrivateRoute allowNoCompany={false}> {/* Şirket bilgisi zorunlu */}
      <Layout currentItem="">
        <Notifications />
      </Layout>
    </PrivateRoute>
  }
/>  
<Route path="/sectors/:companyId" element={<Layout><Sectors /></Layout>} />

            <Route path="/chat/:orderId/:companyId1/:companyId2" element={<Layout><ChatPage /></Layout>} />
            <Route path="/profile" element={<Layout currentItem="Siparişler"><Profile /></Layout>} />
            <Route path="/my-company" element={<Layout currentItem="Siparişler"><CompanyDetails /></Layout>} />
            <Route path="/teammembers" element={<Layout currentItem="Siparişler"><TeamMembers /></Layout>} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/announcements/:id" element={<AnnouncementDetail />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </Suspense>
      </Router>
    </CompanyProvider>
    </LanguageProvider>

  );
};

export default App;
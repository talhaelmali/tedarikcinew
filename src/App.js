import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import CreateCompany from './components/CreateCompany';
import Register from './screens/Register';
import Login from './screens/Login';
import Sectors from './components/Sectors';
import SuccessRegister from './components/SuccessRegister';
import Dashboard from './components/Dashboard';
import CreateAd from './components/CreateAd';
import AdDetails from './components/AdDetails';
import Home from './screens/Home';
import BidForm from './components/BidForm';
import Ads from './screens/Ads';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/createcompany" element={<Layout currentItem="Anasayfa"> <CreateCompany /></Layout>}/>
        <Route path="/sectors/:companyId" element={ <Layout currentItem="Anasayfa"> <Sectors /> </Layout>} />
        <Route path="/success" element={ <Layout currentItem="Anasayfa"> <SuccessRegister /> </Layout>} />
        <Route path="/dashboard" element={ <Layout currentItem="Anasayfa"> <Dashboard /> </Layout>} />
        <Route path="/createAd" element={ <Layout currentItem="Anasayfa"> <CreateAd /> </Layout>} />
        <Route path="/ad-details/:companyId/:adId" element={<Layout currentItem="Anasayfa"> <AdDetails /> </Layout>} />
        <Route path="/ads" element={<Layout currentItem="Anasayfa"> <Ads /> </Layout>} />

        <Route path="/register" element={<Register /> }/>
        <Route path="/login" element={<Login /> }/>
        <Route path="/ad-details/:companyId/:adId/bid" element={<Layout currentItem="Anasayfa"> <BidForm /> </Layout> } />
        <Route path="/" element={<Home /> }/>
      </Routes>
    </Router>
  );
}

export default App;

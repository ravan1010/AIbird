import React from 'react';
import Header from './components/Header';
import Game from './components/Game';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Header />
            <div style={{ textAlign: "center", margin: "20px 0" }}>
            <ins className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-XXXX"
              data-ad-slot="YYYY"
              data-ad-format="auto"
              data-full-width-responsive="true">
            </ins>
          </div>

          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

            <main className="main">
              <Game />
            </main>
            <Footer />
          </div>
      } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

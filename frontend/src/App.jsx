import React from 'react';
import Header from './components/Header';
import Game from './components/Game';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdBanner from './components/Banner';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <Header />
            <AdBanner />
            <main className="main">
              <Game />
            </main>
            <AdBanner />
            <Footer />
          </div>
      } />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

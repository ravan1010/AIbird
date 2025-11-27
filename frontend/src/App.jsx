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

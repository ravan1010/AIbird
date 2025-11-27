import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* Left */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Blink-to-Fly AI — All Rights Reserved
        </p>

        {/* Right */}
        <div className="flex space-x-6 mt-4 md:mt-0">

          <Link to="/about">About Us</Link>
          <br />
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

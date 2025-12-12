import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 border-t-4 border-blue-600">
          <div style={{ padding: "15px", textAlign: "center" }}>
  <h2>How to Play</h2>
  <p>
    Blink to Fly is a fast reaction skill game. Tap or blink to rise, avoid the
    obstacles, and survive as long as possible.
  </p>
  <p>
    If you're playing on a laptop, blink your <strong>left eye</strong> to jump.<br />
    If you're playing on a mobile, blink your <strong>right eye</strong> to jump.
  </p>
</div>
      <div className="max-w-6xl mx-auto px-6 border-5 flex flex-col md:flex-row justify-between items-center">

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

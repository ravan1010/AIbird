import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg mb-4">
          Welcome to <span className="font-semibold">Blink-to-Fly</span>, the world's first
          Flappy-Bird-style game fully controlled using real-time AI eye-blinking
          technology. Your eyes become the controller!
        </p>

        <p className="text-lg mb-4">
          Our mission is to make gaming more accessible, creative, and exciting
          by blending artificial intelligence with fun gameplay. With Blink-to-Fly,
          you can fly, dodge obstacles, and control movement — all using simple
          blinks detected by your webcam.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-3">Our Goals</h2>
        <ul className="text-lg mb-6 list-disc list-inside text-left mx-auto max-w-xl">
          <li>Bring AI-powered accessibility tools into gaming</li>
          <li>Create a hands-free, hardware-free control system</li>
          <li>Build a fun, fast, and intuitive experience for all users</li>
          <li>Continuously evolve with community feedback</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Why Blink-to-Fly is Unique</h2>
        <ul className="text-lg mb-6 list-disc list-inside text-left mx-auto max-w-xl">
          <li>Real-time blink and head-movement detection</li>
          <li>No keyboard, mouse, or controller needed</li>
          <li>Lightweight and works in any modern browser</li>
          <li>Designed for accessibility and innovation</li>
        </ul>

        <p className="text-lg">
          Thank you for being part of our journey. We are constantly improving the
          game and exploring new ways to merge AI and everyday fun!
        </p>
      </div>
    </div>
  );
}

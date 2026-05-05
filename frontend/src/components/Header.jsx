import React from 'react';
import AdBanner from './Banner';

export default function Header() {

  return (
    <header className="header">
        <div style={{ padding: "15px", textAlign: "center" }}>
          <h1>hand close to Fly – Play Free Online Game</h1>
          <p>Tap / Click to jump and avoid obstacles. A fun reaction-based skill game.</p>
        </div>
        {/* <AdBanner /> */}
        <div style={{ padding: "5px", textAlign: "center" }}>
          <h2>How to Play</h2>
          <p>hand close to Fly is a fast skill game. Tap to rise, avoid blocks, and survive as long as possible.</p>
          <p>don't play with 2 hand</p>
        </div>
        {/* <h1>blink count : {rightBlinkCount}</h1> */}
    </header>
  );
}

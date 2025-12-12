import React from 'react';
import useRightBlink from '../hooks/eyeblinkcount';

export default function Header() {
    const { rightBlinkCount } = useRightBlink();

  return (
    <header className="header">
        <div style={{ padding: "15px", textAlign: "center" }}>
          <h1>Blink to Fly – Play Free Online Game</h1>
          <p>Tap / Click to jump and avoid obstacles. A fun reaction-based skill game.</p>
        </div>
        <div style={{ padding: "15px", textAlign: "center" }}>
          <h2>How to Play</h2>
          <p>Blink to Fly is a fast skill game. Tap to rise, avoid blocks, and survive as long as possible.</p>
        </div>
        <h1>blink count : {rightBlinkCount}</h1>
    </header>
  );
}

import React from 'react';
import useRightBlink from '../hooks/eyeblinkcount';

export default function Header() {
    const { rightBlinkCount } = useRightBlink();

  return (
    <header className="header">
      <h1 className="title">Flapping Fly Bird</h1>
      <p className="subtitle">Cute cartoon tap-to-fly arcade</p>
      <p className="subtitle">Right Eye Blinks Detected: {rightBlinkCount}</p>
    </header>
  );
}

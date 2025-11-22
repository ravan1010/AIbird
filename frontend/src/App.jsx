import React from 'react';
import Header from './components/Header';
import Game from './components/Game';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Game />
      </main>
    </div>
  );
}

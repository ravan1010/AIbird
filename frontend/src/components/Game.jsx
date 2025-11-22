import React, { useState, useEffect, useRef } from 'react';
import useRightBlink from '../hooks/eyeblinkcount';

export default function Game() {
  const canvasRef = useRef(null);
  const { videoRef, rightBlinkCount } = useRightBlink();

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  const scoreRef = useRef(0);
  const lastBlinkRef = useRef(0);

  useEffect(() => { scoreRef.current = score; }, [score]);

  // ----------------------------------------------------
  //  BLINK EVENT HANDLER: Start + Jump
  // ----------------------------------------------------
  useEffect(() => {
    if (rightBlinkCount === 0) return;

    // Prevent repeating blink on same value
    if (rightBlinkCount === lastBlinkRef.current) return;
    lastBlinkRef.current = rightBlinkCount;

    const canvas = canvasRef.current;

    // 1) If game NOT running → blink to START
    if (!running) {
      setRunning(true);
      return;
    }

    // 2) If running → blink to JUMP
    const evt = new Event("blink");
    canvas.dispatchEvent(evt);
  }, [rightBlinkCount, running]);
  // ----------------------------------------------------


  // -------------------------- GAME ENGINE --------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = 480;      // desktop width
      canvas.height = 640;     // desktop height
    }

    let raf;
    let bird = { x: 100, y: 320, vy: 0 };
    let pipes = [];
    let frames = 0;

    function reset() {
      bird = { x: 100, y: 320, vy: 0 };
      pipes = [];
      frames = 0;
      setScore(0);
    }

    function spawnPipe() {
      const gap = 150;
      const top = Math.random() * (canvas.height - gap - 150) + 40;
      pipes.push({ x: canvas.width, top });
    }

    function jump() {
      bird.vy = -6;
    }

    canvas.addEventListener("blink", jump);

    function update() {
      frames++;

      bird.vy += 0.6;
      bird.y += bird.vy;

      if (frames % 140 === 0) spawnPipe();

      pipes.forEach(p => (p.x -= 2));
      pipes = pipes.filter(p => p.x > -60);

      pipes.forEach(p => {
        if (p.x + 52 < bird.x && !p.passed) {
          p.passed = true;
          setScore(s => s + 1);
        }

        const inX = bird.x + 16 > p.x && bird.x - 16 < p.x + 52;
        const hitTop = bird.y - 18 < p.top;
        const hitBottom = bird.y + 18 > p.top + 150;

        if (inX && (hitTop || hitBottom)) setRunning(false);
      });

      if (bird.y + 18 > canvas.height - 80) setRunning(false);
    }

    function draw() {
      ctx.fillStyle = "#BEE8FF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#6AB04A";
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 52, p.top);
        ctx.fillRect(p.x, p.top + 150, 52, canvas.height - p.top - 150 - 80);
      });

      ctx.beginPath();
      ctx.fillStyle = "#FFB6C1";
      ctx.arc(bird.x, bird.y, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#333";
      ctx.font = "28px sans-serif";
      ctx.fillText(String(scoreRef.current), canvas.width / 2 - 10, 80);
    }

    function loop() {
      if (!running) return cancelAnimationFrame(raf);
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }

    if (running) {
      reset();
      loop();
    } else {
      // Idle screen (waiting for blink)
      ctx.fillStyle = "#BEE8FF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#333";
      ctx.font = "22px sans-serif";
      ctx.fillText("Blink to Start", canvas.width / 2 - 70, canvas.height / 2);

      ctx.beginPath();
      ctx.fillStyle = "#FFB6C1";
      ctx.arc(100, 320, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("blink", jump);
    };
  }, [running]);
  // -------------------------- END ENGINE --------------------------

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      <canvas ref={canvasRef} />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import useRightEyeControl from "../hooks/eyeblinkcount";

export default function EyeBlinkFlappyBird() {
  const { videoRef, isRightEyeClosed } = useRightEyeControl();
  const canvasRef = useRef(null);

  // Responsive game size
  const [gameWidth, setGameWidth] = useState(window.innerWidth * 0.9);
  const [gameHeight, setGameHeight] = useState(window.innerHeight * 0.7);

  useEffect(() => {
    const updateSize = () => {
      setGameWidth(window.innerWidth * 0.9);
      setGameHeight(window.innerHeight * 0.7);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Game constants
  const birdX = gameWidth * 0.2;
  const birdSize = gameHeight * 0.04;
  const pipeWidth = gameWidth * 0.15;
  const pipeGap = gameHeight * 0.28;
  const PIPE_SPEED = gameWidth * 0.004;
  const GRAVITY = gameHeight * 0.0015;
  const JUMP_FORCE = -4.5;

  // Game state
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // First pipe init
  useEffect(() => {
    setPipes([{ x: gameWidth, height: randomHeight(), scored: false }]);
  }, [gameWidth, gameHeight]);

  function randomHeight() {
    return gameHeight * (0.15 + Math.random() * 0.5);
  }

  // 🔥 Blink to START
  useEffect(() => {
    if (!started && isRightEyeClosed) {
      setStarted(true);
      setRunning(true);
    }
  }, [isRightEyeClosed, started]);

  // Game Loop
  useEffect(() => {
    let animation;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawStartText() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${gameHeight * 0.07}px Arial`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 6;

      ctx.textAlign = "center";
      ctx.strokeText("BLINK TO START", gameWidth / 2, gameHeight * 0.45);
      ctx.fillText("BLINK TO START", gameWidth / 2, gameHeight * 0.45);
    }

    function drawBird(ctx, x, y, size) {
      const bodyRadius = size * 0.6;
      const eyeRadius = size * 0.15;

      // Yellow circular body
      ctx.fillStyle = "#FFD93D";
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, bodyRadius, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(x + size * 0.55, y + size * 0.35, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(x + size * 0.6, y + size * 0.35, eyeRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(x + size * 0.9, y + size * 0.45);
      ctx.lineTo(x + size * 1.15, y + size * 0.55);
      ctx.lineTo(x + size * 0.9, y + size * 0.65);
      ctx.closePath();
      ctx.fill();

      // Wing
      ctx.fillStyle = "#F4C534";
      ctx.beginPath();
      ctx.ellipse(
        x + size * 0.35,
        y + size * 0.55,
        size * 0.3,
        size * 0.18,
        -0.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    function gameLoop() {
      // START SCREEN
      if (!started) {
        drawStartText();
        animation = requestAnimationFrame(gameLoop);
        return;
      }

      if (!running) {
        animation = requestAnimationFrame(gameLoop);
        return;
      }

      // Bird physics
      if (isRightEyeClosed) setVelocity(JUMP_FORCE);
      else setVelocity((v) => v + GRAVITY);

      setBirdY((y) => y + velocity);

      // Pipe movement + scoring system
      setPipes((prev) => {
        let updated = prev.map((pipe) => {
          const newX = pipe.x - PIPE_SPEED;

          // 🎯 FIXED SCORE — only once
          if (!pipe.scored && newX + pipeWidth < birdX) {
            setScore((s) => s + 1);
            pipe.scored = true;
          }

          return { ...pipe, x: newX };
        });

        // New pipes generator
        if (updated[updated.length - 1].x < gameWidth * 0.5) {
          updated.push({
            x: gameWidth,
            height: randomHeight(),
            scored: false,
          });
        }

        // Remove old pipes
        return updated.filter((p) => p.x > -pipeWidth);
      });

      // DRAW
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Bird
      drawBird(ctx, birdX, birdY, birdSize);

      // Pipes
      pipes.forEach((pipe) => {
        const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        grad.addColorStop(0, "#2ecc71");
        grad.addColorStop(1, "#27ae60");

        const topH = pipe.height;
        const bottomY = pipe.height + pipeGap;

        ctx.fillStyle = grad;
        ctx.strokeStyle = "#145A32";
        ctx.lineWidth = 3;

        // Top pipe
        ctx.beginPath();
        ctx.rect(pipe.x, 0, pipeWidth, topH);
        ctx.fill();
        ctx.stroke();

        // Bottom pipe
        ctx.beginPath();
        ctx.rect(pipe.x, bottomY, pipeWidth, gameHeight - bottomY);
        ctx.fill();
        ctx.stroke();
      });

      // Score box
      const text = "Score: " + score;
      ctx.font = `${gameHeight * 0.06}px Arial`;
      ctx.textAlign = "left";

      const w = ctx.measureText(text).width;
      const h = gameHeight * 0.06 * 1.4;

      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.roundRect(15, 15, w + 30, h, 12);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.fillText(text, 30, 15 + h * 0.72);

      // Collision detection
      pipes.forEach((pipe) => {
        const insideX =
          birdX < pipe.x + pipeWidth && birdX + birdSize > pipe.x;

        const hitTop = birdY < pipe.height;
        const hitBottom = birdY > pipe.height + pipeGap;

        if (insideX && (hitTop || hitBottom)) {
          setRunning(false);
          setGameOver(true);
          setHighScore((h) => Math.max(h, score));
        }
      });

      // GAME OVER screen
      if (gameOver) {
        ctx.textAlign = "center";

        ctx.font = `${gameHeight * 0.12}px Arial`;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.strokeText("GAME OVER", gameWidth / 2, gameHeight * 0.35);
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER", gameWidth / 2, gameHeight * 0.35);

        ctx.font = `${gameHeight * 0.065}px Arial`;
        ctx.strokeText(
          "BLINK TO RESTART",
          gameWidth / 2,
          gameHeight * 0.7
        );
        ctx.fillText(
          "BLINK TO RESTART",
          gameWidth / 2,
          gameHeight * 0.7
        );

        // Blink to restart
        if (isRightEyeClosed) resetGame();
      }


      // -------- PIPE DRAWING (Pepi Styled) --------
        pipes.forEach(pipe => {

          // Top pipe height
          const topPipeHeight = pipe.height;
          const bottomY = pipe.height + pipeGap;

          // ====== PIPE GRADIENT (3D Candy Look) ======
          const grad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
          grad.addColorStop(0, "#69f269");     // bright green
          grad.addColorStop(0.5, "#37d34d");   // mid green
          grad.addColorStop(1, "#1faa39");     // dark deep green

          ctx.fillStyle = grad;
          ctx.strokeStyle = "#0b4f1f"; // deep border
          ctx.lineWidth = 5;

          // ===== TOP PIPE =====
          ctx.beginPath();
          ctx.roundRect(pipe.x, 0, pipeWidth, topPipeHeight, 18);
          ctx.fill();
          ctx.stroke();

          // --- Top Pipe Cap ---
          const capHeight = gameHeight * 0.025; 
          ctx.fillStyle = "#0f7a2c";
          ctx.strokeStyle = "#063b17";

          ctx.beginPath();
          ctx.roundRect(pipe.x - 6, topPipeHeight - capHeight, pipeWidth + 12, capHeight, 10);
          ctx.fill();
          ctx.stroke();

          // ===== BOTTOM PIPE =====
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(pipe.x, bottomY, pipeWidth, gameHeight - bottomY, 18);
          ctx.fill();
          ctx.stroke();

          // --- Bottom Pipe Cap ---
          ctx.fillStyle = "#0f7a2c";
          ctx.strokeStyle = "#063b17";
          ctx.beginPath();
          ctx.roundRect(pipe.x - 6, bottomY, pipeWidth + 12, capHeight, 10);
          ctx.fill();
          ctx.stroke();

          // ===== Gloss Highlight (Jelly Shine) =====
          const glossWidth = pipeWidth * 0.22;

          const glossGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + glossWidth, 0);
          glossGrad.addColorStop(0, "rgba(255,255,255,0.5)");
          glossGrad.addColorStop(1, "rgba(255,255,255,0)");

          ctx.fillStyle = glossGrad;

          // Gloss for top pipe
          ctx.beginPath();
          ctx.roundRect(pipe.x + 6, 0, glossWidth, topPipeHeight, 15);
          ctx.fill();

          // Gloss for bottom pipe
          ctx.beginPath();
          ctx.roundRect(pipe.x + 6, bottomY, glossWidth, gameHeight - bottomY, 15);
          ctx.fill();

          // ===== Soft Shadow for depth =====
          ctx.shadowColor = "rgba(0,0,0,0.3)";
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 4;

          // Reset shadow after drawing
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
        });



      animation = requestAnimationFrame(gameLoop);
    }

    animation = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animation);
  }, [
    isRightEyeClosed,
    velocity,
    birdY,
    pipes,
    started,
    running,
    gameWidth,
    gameHeight,
    gameOver,
  ]);

  // Reset game
  const resetGame = () => {
    setBirdY(gameHeight * 0.4);
    setVelocity(0);
    setScore(0);
    setPipes([{ x: gameWidth, height: randomHeight(), scored: false }]);
    setStarted(false);
    setRunning(false);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Blink Controlled Flappy Bird</h2>
      <video ref={videoRef} style={{ display: "none" }} />

    <button
    onClick={resetGame}
    style={{
      padding: "12px 30px",
      fontSize: "22px",
      color: "white",
      background: "black",
      border: "2px solid #00e5ff",
      borderRadius: "10px",
      textShadow: "0 0 10px #00e5ff",
      boxShadow: "0 0 15px #00e5ff",
      cursor: "pointer",
      marginTop: "20px",
    }}
  >
    Restart
  </button>

      <canvas
        ref={canvasRef}
        width={gameWidth}
        height={gameHeight}
        style={{
          border: "2px solid black",
          background: "#90caf9",
          marginTop: 10,
          maxWidth: "100%",
        }}
      />
    </div>
  );
}

import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const player = {
      x: 100,
      y: canvas.height - 100,
      width: 30,
      height: 30,
      velocityY: 0,
      gravity: 0.5,
      jumpPower: -12,
      onGround: false,
    };

    const obstacles = [];
    let score = 0;
    let gameRunning = true;
    let animationFrame;

    const jump = () => {
      if (player.onGround) {
        player.velocityY = player.jumpPower;
        player.onGround = false;
      }
    };

    const createObstacle = () => {
      const height = Math.random() * 100 + 50;
      obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 20,
        height,
      });
    };

    const update = () => {
      if (!gameRunning) return;

      player.velocityY += player.gravity;
      player.y += player.velocityY;

      if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 5;

        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
          score += 1;
        }

        if (
          player.x < obstacles[i].x + obstacles[i].width &&
          player.x + player.width > obstacles[i].x &&
          player.y < obstacles[i].y + obstacles[i].height &&
          player.y + player.height > obstacles[i].y
        ) {
          gameRunning = false;
        }
      }

      if (Math.random() < 0.01) {
        createObstacle();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = '#f00';
      obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });

      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + score, 10, 30);

      if (!gameRunning) {
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2 - 80, canvas.height / 2 + 40);
      }
    };

    const gameLoop = () => {
      update();
      draw();
      animationFrame = requestAnimationFrame(gameLoop);
    };

    const handleKeydown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }

      if (e.code === 'KeyR' && !gameRunning) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
        obstacles.length = 0;
        score = 0;
        gameRunning = true;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="page">
      <div className="header">
        <h1>Geometry Dash Clone</h1>
        <p>Press Space to jump and R to restart.</p>
      </div>
      <canvas ref={canvasRef} className="gameCanvas" />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Game } from "@/lib/game/Game";
import { GameHUD } from "./GameHUD";
import { GameOver } from "./GameOver";

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [gameState, setGameState] = useState({
    health: 100,
    ammo: 0,
    weapon: "none",
    score: 0,
    isGameOver: false,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;

    // Initialize game
    const game = new Game(canvas, ctx, (state) => {
      setGameState(state);
    });
    
    gameRef.current = game;
    game.start();

    return () => {
      game.stop();
    };
  }, []);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.restart();
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-game overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-foreground rounded-full animate-pulse-glow"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <canvas
          ref={canvasRef}
          className="border-4 border-primary shadow-glow-primary rounded-lg"
        />
        <GameHUD {...gameState} />
        {gameState.isGameOver && (
          <GameOver score={gameState.score} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
};

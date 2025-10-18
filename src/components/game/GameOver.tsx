import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

export const GameOver = ({ score, onRestart }: GameOverProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-md z-20 animate-fade-in">
      <div className="bg-card border-4 border-primary rounded-2xl p-8 shadow-glow-primary max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <Trophy className="w-20 h-20 mx-auto text-secondary animate-bounce-subtle" />
        </div>
        
        <h2 className="text-5xl font-bold text-foreground mb-2 animate-pulse-glow">
          GAME OVER
        </h2>
        
        <p className="text-muted-foreground mb-6 text-lg">
          You've been eliminated!
        </p>

        <div className="bg-muted/50 rounded-lg p-6 mb-6 border-2 border-primary/30">
          <div className="text-muted-foreground text-sm mb-2">FINAL SCORE</div>
          <div className="text-6xl font-bold text-primary animate-pulse-glow">
            {score}
          </div>
        </div>

        <Button
          onClick={onRestart}
          size="lg"
          className="w-full bg-gradient-arcade hover:opacity-90 transition-opacity text-lg font-bold shadow-glow-primary"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          PLAY AGAIN
        </Button>
      </div>
    </div>
  );
};

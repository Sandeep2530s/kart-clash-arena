import { Heart, Crosshair, Trophy } from "lucide-react";

interface GameHUDProps {
  health: number;
  ammo: number;
  weapon: string;
  score: number;
}

export const GameHUD = ({ health, ammo, weapon, score }: GameHUDProps) => {
  const weaponIcons: Record<string, string> = {
    bullet: "🔫",
    missile: "🚀",
    mine: "💣",
    none: "❌",
  };

  return (
    <div className="absolute top-4 left-0 right-0 px-8 flex justify-between items-start pointer-events-none">
      {/* Health Bar */}
      <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-glow-primary border-2 border-primary/30 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-destructive" />
          <span className="text-foreground font-bold text-sm">HEALTH</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-destructive to-neon-pink transition-all duration-300 shadow-glow-primary"
            style={{ width: `${health}%` }}
          />
        </div>
        <div className="text-right text-foreground text-xs mt-1 font-bold">
          {health}%
        </div>
      </div>

      {/* Weapon & Ammo */}
      <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-glow-accent border-2 border-accent/30 min-w-[150px]">
        <div className="flex items-center gap-2 mb-2">
          <Crosshair className="w-5 h-5 text-accent" />
          <span className="text-foreground font-bold text-sm">WEAPON</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-3xl">{weaponIcons[weapon] || "❌"}</span>
          <div className="text-right">
            <div className="text-foreground font-bold text-xl">{ammo}</div>
            <div className="text-muted-foreground text-xs uppercase">
              {weapon !== "none" ? weapon : "Empty"}
            </div>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-glow-primary border-2 border-secondary/30 min-w-[150px]">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-secondary" />
          <span className="text-foreground font-bold text-sm">SCORE</span>
        </div>
        <div className="text-foreground font-bold text-3xl text-center">
          {score}
        </div>
      </div>
    </div>
  );
};

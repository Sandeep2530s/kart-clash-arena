export class Weapon {
  x: number;
  y: number;
  angle: number;
  type: string;
  speed: number;
  damage: number;
  size: number;
  lifetime: number = 0;
  maxLifetime: number;
  isPlayerWeapon: boolean;

  constructor(
    x: number,
    y: number,
    angle: number,
    type: string,
    isPlayerWeapon: boolean
  ) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.type = type;
    this.isPlayerWeapon = isPlayerWeapon;

    switch (type) {
      case "bullet":
        this.speed = 12;
        this.damage = 10;
        this.size = 5;
        this.maxLifetime = 100;
        break;
      case "missile":
        this.speed = 8;
        this.damage = 25;
        this.size = 8;
        this.maxLifetime = 150;
        break;
      case "mine":
        this.speed = 0;
        this.damage = 30;
        this.size = 12;
        this.maxLifetime = 300;
        break;
      default:
        this.speed = 10;
        this.damage = 10;
        this.size = 5;
        this.maxLifetime = 100;
    }
  }

  update() {
    if (this.type !== "mine") {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    }
    this.lifetime++;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    switch (this.type) {
      case "bullet":
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.strokeStyle = "#fef3c7";
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case "missile":
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
        
        // Flame trail
        ctx.fillStyle = "#fb923c";
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size * 1.5, -this.size / 2);
        ctx.lineTo(-this.size * 1.5, this.size / 2);
        ctx.closePath();
        ctx.fill();
        break;

      case "mine":
        ctx.fillStyle = "#1e1b4b";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Spikes
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          const x1 = this.x + Math.cos(angle) * this.size;
          const y1 = this.y + Math.sin(angle) * this.size;
          const x2 = this.x + Math.cos(angle) * (this.size + 4);
          const y2 = this.y + Math.sin(angle) * (this.size + 4);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        break;
    }

    ctx.restore();
  }

  isExpired(): boolean {
    return this.lifetime > this.maxLifetime;
  }
}

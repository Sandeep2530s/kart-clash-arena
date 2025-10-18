import { Weapon } from "./Weapon";

export class Kart {
  x: number;
  y: number;
  angle: number = 0;
  velocity: number = 0;
  color: string;
  size: number = 20;
  health: number = 100;
  maxHealth: number = 100;
  isPlayer: boolean;
  currentWeapon: string = "none";
  ammo: number = 0;
  lastShotTime: number = 0;
  shootCooldown: number = 500;

  protected acceleration: number = 0.5;
  protected deceleration: number = 0.95;
  protected maxSpeed: number = 8;
  protected turnSpeed: number = 0.08;

  constructor(x: number, y: number, color: string, isPlayer: boolean = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isPlayer = isPlayer;
  }

  update(input: any, canvasWidth: number, canvasHeight: number) {
    // Rotation
    if (input.left) {
      this.angle -= this.turnSpeed;
    }
    if (input.right) {
      this.angle += this.turnSpeed;
    }

    // Acceleration
    if (input.up) {
      this.velocity += this.acceleration;
    }
    if (input.down) {
      this.velocity -= this.acceleration;
    }

    // Apply deceleration
    this.velocity *= this.deceleration;

    // Limit speed
    this.velocity = Math.max(-this.maxSpeed / 2, Math.min(this.maxSpeed, this.velocity));

    // Update position
    this.x += Math.cos(this.angle) * this.velocity;
    this.y += Math.sin(this.angle) * this.velocity;

    // Boundary collision
    const padding = this.size;
    if (this.x < padding) {
      this.x = padding;
      this.velocity *= -0.5;
    }
    if (this.x > canvasWidth - padding) {
      this.x = canvasWidth - padding;
      this.velocity *= -0.5;
    }
    if (this.y < padding) {
      this.y = padding;
      this.velocity *= -0.5;
    }
    if (this.y > canvasHeight - padding) {
      this.y = canvasHeight - padding;
      this.velocity *= -0.5;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Draw kart body
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(this.size, 0);
    ctx.lineTo(-this.size, this.size / 2);
    ctx.lineTo(-this.size, -this.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw direction indicator
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(this.size / 2, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Draw health bar
    if (this.health < this.maxHealth) {
      const barWidth = this.size * 2;
      const barHeight = 4;
      const healthPercent = this.health / this.maxHealth;

      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 10, barWidth, barHeight);

      ctx.fillStyle = healthPercent > 0.5 ? "#10b981" : healthPercent > 0.25 ? "#f59e0b" : "#ef4444";
      ctx.fillRect(this.x - barWidth / 2, this.y - this.size - 10, barWidth * healthPercent, barHeight);
    }
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  addWeapon(weaponType: string) {
    this.currentWeapon = weaponType;
    this.ammo = weaponType === "mine" ? 3 : 10;
  }

  canShoot(): boolean {
    return (
      this.ammo > 0 &&
      this.currentWeapon !== "none" &&
      Date.now() - this.lastShotTime > this.shootCooldown
    );
  }

  shoot(): Weapon | null {
    if (!this.canShoot()) return null;

    this.lastShotTime = Date.now();
    this.ammo--;

    if (this.ammo === 0) {
      this.currentWeapon = "none";
    }

    return new Weapon(
      this.x + Math.cos(this.angle) * this.size,
      this.y + Math.sin(this.angle) * this.size,
      this.angle,
      this.currentWeapon,
      true
    );
  }
}

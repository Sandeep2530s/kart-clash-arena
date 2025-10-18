import { Kart } from "./Kart";
import { Weapon } from "./Weapon";

export class Bot extends Kart {
  private targetAngle: number = 0;
  private changeDirectionTime: number = 0;
  private shootRange: number = 200;

  constructor(x: number, y: number, color: string) {
    super(x, y, color, false);
    this.currentWeapon = "bullet";
    this.ammo = 999; // Infinite ammo for bots
  }

  update(player: Kart, canvasWidth: number, canvasHeight: number) {
    const now = Date.now();

    // Change direction randomly
    if (now - this.changeDirectionTime > 2000) {
      this.targetAngle = Math.random() * Math.PI * 2;
      this.changeDirectionTime = now;
    }

    // Chase player if close enough
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

    if (distanceToPlayer < 300) {
      this.targetAngle = Math.atan2(dy, dx);
    }

    // Smooth rotation towards target
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    this.angle += angleDiff * 0.05;

    // Move forward
    this.velocity += this.acceleration;
    this.velocity = Math.min(this.maxSpeed * 0.7, this.velocity);
    this.velocity *= this.deceleration;

    // Update position
    this.x += Math.cos(this.angle) * this.velocity;
    this.y += Math.sin(this.angle) * this.velocity;

    // Boundary collision
    const padding = this.size;
    if (this.x < padding || this.x > canvasWidth - padding) {
      this.x = Math.max(padding, Math.min(canvasWidth - padding, this.x));
      this.targetAngle += Math.PI;
    }
    if (this.y < padding || this.y > canvasHeight - padding) {
      this.y = Math.max(padding, Math.min(canvasHeight - padding, this.y));
      this.targetAngle += Math.PI;
    }
  }

  canShoot(): boolean {
    return Date.now() - this.lastShotTime > this.shootCooldown * 2;
  }

  shoot(): Weapon | null {
    if (!this.canShoot()) return null;

    this.lastShotTime = Date.now();

    return new Weapon(
      this.x + Math.cos(this.angle) * this.size,
      this.y + Math.sin(this.angle) * this.size,
      this.angle,
      "bullet",
      false
    );
  }
}

import { Kart } from "./Kart";
import { Bot } from "./Bot";
import { MysteryBox } from "./MysteryBox";
import { Obstacle } from "./Obstacle";
import { Weapon } from "./Weapon";
import { InputManager } from "./InputManager";
import { SoundManager } from "./SoundManager";

export interface GameState {
  health: number;
  ammo: number;
  weapon: string;
  score: number;
  isGameOver: boolean;
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Kart;
  private bots: Bot[] = [];
  private mysteryBoxes: MysteryBox[] = [];
  private obstacles: Obstacle[] = [];
  private weapons: Weapon[] = [];
  private inputManager: InputManager;
  private soundManager: SoundManager;
  private animationId: number | null = null;
  private onStateChange: (state: GameState) => void;
  private score = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    onStateChange: (state: GameState) => void
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.onStateChange = onStateChange;
    this.inputManager = new InputManager();
    this.soundManager = new SoundManager();

    // Initialize player
    this.player = new Kart(
      canvas.width / 2,
      canvas.height / 2,
      "#8B5CF6",
      true
    );

    // Initialize bots
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const colors = ["#EC4899", "#10B981", "#F59E0B"];
      this.bots.push(new Bot(x, y, colors[i]));
    }

    // Initialize obstacles
    this.createObstacles();

    // Initialize mystery boxes
    this.spawnMysteryBoxes();
  }

  private createObstacles() {
    const obstaclePositions = [
      { x: 200, y: 200, width: 100, height: 100 },
      { x: 900, y: 200, width: 100, height: 100 },
      { x: 600, y: 400, width: 150, height: 80 },
      { x: 200, y: 600, width: 120, height: 120 },
      { x: 900, y: 600, width: 100, height: 100 },
    ];

    this.obstacles = obstaclePositions.map(
      (pos) => new Obstacle(pos.x, pos.y, pos.width, pos.height)
    );
  }

  private spawnMysteryBoxes() {
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * (this.canvas.width - 100) + 50;
      const y = Math.random() * (this.canvas.height - 100) + 50;
      this.mysteryBoxes.push(new MysteryBox(x, y));
    }
  }

  start() {
    this.gameLoop();
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  restart() {
    this.score = 0;
    this.weapons = [];
    
    // Reset player
    this.player = new Kart(
      this.canvas.width / 2,
      this.canvas.height / 2,
      "#8B5CF6",
      true
    );

    // Reset bots
    this.bots = [];
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const colors = ["#EC4899", "#10B981", "#F59E0B"];
      this.bots.push(new Bot(x, y, colors[i]));
    }

    // Reset mystery boxes
    this.mysteryBoxes = [];
    this.spawnMysteryBoxes();

    this.updateState();
  }

  private gameLoop = () => {
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    if (this.player.health <= 0) {
      this.updateState();
      return;
    }

    // Update player
    const input = this.inputManager.getInput();
    this.player.update(input, this.canvas.width, this.canvas.height);

    // Handle shooting
    if (input.shoot && this.player.canShoot()) {
      const weapon = this.player.shoot();
      if (weapon) {
        this.weapons.push(weapon);
        this.soundManager.playShoot();
      }
    }

    // Update bots
    this.bots.forEach((bot) => {
      bot.update(this.player, this.canvas.width, this.canvas.height);
      
      if (bot.canShoot()) {
        const weapon = bot.shoot();
        if (weapon) {
          this.weapons.push(weapon);
        }
      }
    });

    // Update weapons
    this.weapons = this.weapons.filter((weapon) => {
      weapon.update();

      // Check collision with player
      if (
        !weapon.isPlayerWeapon &&
        this.checkCollision(weapon, this.player) &&
        this.player.health > 0
      ) {
        this.player.takeDamage(weapon.damage);
        this.soundManager.playHit();
        return false;
      }

      // Check collision with bots
      if (weapon.isPlayerWeapon) {
        for (let i = this.bots.length - 1; i >= 0; i--) {
          const bot = this.bots[i];
          if (this.checkCollision(weapon, bot)) {
            bot.takeDamage(weapon.damage);
            this.soundManager.playHit();
            if (bot.health <= 0) {
              this.bots.splice(i, 1);
              this.score += 100;
              this.soundManager.playExplosion();
            }
            return false;
          }
        }
      }

      return !weapon.isExpired();
    });

    // Check mystery box collection
    this.mysteryBoxes = this.mysteryBoxes.filter((box) => {
      if (this.checkCollision(box, this.player)) {
        const weaponType = box.collect();
        this.player.addWeapon(weaponType);
        this.soundManager.playPickup();
        
        // Spawn new box after 3 seconds
        setTimeout(() => {
          const x = Math.random() * (this.canvas.width - 100) + 50;
          const y = Math.random() * (this.canvas.height - 100) + 50;
          this.mysteryBoxes.push(new MysteryBox(x, y));
        }, 3000);
        
        return false;
      }
      return true;
    });

    // Handle collisions with obstacles
    this.handleObstacleCollisions();

    this.updateState();
  }

  private handleObstacleCollisions() {
    // Player vs obstacles
    this.obstacles.forEach((obstacle) => {
      if (this.checkCollision(this.player, obstacle)) {
        this.resolveCollision(this.player, obstacle);
      }
    });

    // Bots vs obstacles
    this.bots.forEach((bot) => {
      this.obstacles.forEach((obstacle) => {
        if (this.checkCollision(bot, obstacle)) {
          this.resolveCollision(bot, obstacle);
        }
      });
    });
  }

  private checkCollision(obj1: any, obj2: any): boolean {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (obj2.width !== undefined) {
      // Rectangle collision
      const radius1 = obj1.size || 20;
      return (
        obj1.x + radius1 > obj2.x &&
        obj1.x - radius1 < obj2.x + obj2.width &&
        obj1.y + radius1 > obj2.y &&
        obj1.y - radius1 < obj2.y + obj2.height
      );
    }
    
    // Circle collision
    const radius1 = obj1.size || 20;
    const radius2 = obj2.size || 20;
    return distance < radius1 + radius2;
  }

  private resolveCollision(kart: Kart | Bot, obstacle: Obstacle) {
    const kartRadius = kart.size || 20;
    
    // Find closest point on rectangle to circle
    const closestX = Math.max(obstacle.x, Math.min(kart.x, obstacle.x + obstacle.width));
    const closestY = Math.max(obstacle.y, Math.min(kart.y, obstacle.y + obstacle.height));
    
    const dx = kart.x - closestX;
    const dy = kart.y - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < kartRadius) {
      const overlap = kartRadius - distance;
      const angle = Math.atan2(dy, dx);
      kart.x += Math.cos(angle) * overlap;
      kart.y += Math.sin(angle) * overlap;
      kart.velocity *= 0.5; // Slow down on collision
    }
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = "#1e1b4b";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw obstacles
    this.obstacles.forEach((obstacle) => obstacle.render(this.ctx));

    // Draw mystery boxes
    this.mysteryBoxes.forEach((box) => box.render(this.ctx));

    // Draw weapons
    this.weapons.forEach((weapon) => weapon.render(this.ctx));

    // Draw bots
    this.bots.forEach((bot) => bot.render(this.ctx));

    // Draw player
    this.player.render(this.ctx);
  }

  private drawGrid() {
    this.ctx.strokeStyle = "#312e81";
    this.ctx.lineWidth = 1;

    for (let x = 0; x < this.canvas.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.canvas.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private updateState() {
    this.onStateChange({
      health: Math.max(0, this.player.health),
      ammo: this.player.ammo,
      weapon: this.player.currentWeapon,
      score: this.score,
      isGameOver: this.player.health <= 0,
    });
  }
}

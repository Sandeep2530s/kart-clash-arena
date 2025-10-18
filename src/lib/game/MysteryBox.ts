export class MysteryBox {
  x: number;
  y: number;
  size: number = 25;
  rotation: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  collect(): string {
    const weapons = ["bullet", "missile", "mine"];
    return weapons[Math.floor(Math.random() * weapons.length)];
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Box body
    ctx.fillStyle = "#fbbf24";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
    ctx.strokeRect(-this.size, -this.size, this.size * 2, this.size * 2);

    // Question mark
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", 0, 0);

    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#fbbf24";
    ctx.strokeRect(-this.size, -this.size, this.size * 2, this.size * 2);

    ctx.restore();

    // Animate rotation
    this.rotation += 0.02;
  }
}

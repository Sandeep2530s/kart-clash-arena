export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  render(ctx: CanvasRenderingContext2D) {
    // Main obstacle
    ctx.fillStyle = "#475569";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Border
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // 3D effect
    ctx.fillStyle = "#64748b";
    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);

    // Highlight
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(this.x + 10, this.y + 10, this.width / 3, 5);
    ctx.fillRect(this.x + 10, this.y + 10, 5, this.height / 3);
  }
}

export class InputManager {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = true;
    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
    this.keys[e.code] = false;
  };

  getInput() {
    return {
      up: this.keys["w"] || this.keys["arrowup"],
      down: this.keys["s"] || this.keys["arrowdown"],
      left: this.keys["a"] || this.keys["arrowleft"],
      right: this.keys["d"] || this.keys["arrowright"],
      shoot: this.keys[" "] || this.keys["space"],
    };
  }

  cleanup() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}

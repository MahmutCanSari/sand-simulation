// How many cells a particle can fall in one step (same for all particles)
const FALL_RATE = 2;

class Particle {
  constructor(x, y, color = null) {
    this.x = x;
    this.y = y;
    this.xP = 0;
    this.yP = 0;

    // Default color for now; child classes can pass their own color later
    if (color) {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
    } else {
      this.r = 250;
      this.g = 250;
      this.b = 50;
    }
  }

  canMoveTo(targetX, targetY) {
    if (targetX < 0 || targetX >= cols || targetY < 0 || targetY >= rows) {
      return false;
    }

    return grids[targetX][targetY].gridEmpty;
  }

  // Looks up to FALL_RATE cells below and returns how many are free
  // before the first block (or the bottom). 0 means it can't fall.
  canMoveDown() {
    let distance = 0;
    while (distance < FALL_RATE && this.canMoveTo(this.x, this.y + distance + 1)) {
      distance++;
    }
    return distance;
  }

  // Gravity: every particle falls at the same rate.
  // Returns true if the particle moved.
  fall() {
    const distance = this.canMoveDown();
    if (distance === 0) {
      return false;
    }

    grids[this.x][this.y].gridEmpty = true;
    this.y += distance;
    grids[this.x][this.y].gridEmpty = false;
    return true;
  }

  move() {
    return this.fall();
  }

  show() {
    this.xP = this.x * size + size / 2;
    this.yP = this.y * size + size / 2;

    rectMode(CENTER);
    noStroke();
    fill(this.r, this.g, this.b);
    rect(this.xP, this.yP, size);
  }
}

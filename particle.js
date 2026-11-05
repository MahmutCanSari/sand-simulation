// How many cells a particle can fall in one step (same for all particles)
const FALL_RATE = 2;

class Particle {
  constructor(x, y, color = null) {
    this.x = x;
    this.y = y;
    this.xP = 0;
    this.yP = 0;

    // How heavy the particle is, from 0 (light) to 1 (heavy).
    // Child classes set their own value.
    this.density = 0.5;

    // What this particle is allowed to do. Child classes can change them.
    this.canFall = true;  // affected by gravity
    this.canMove = true;  // can move sideways (not used yet)
    this.canSink = false; // can sink through lighter particles (not used yet)

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
    if (!this.canFall) {
      return false;
    }

    const distance = this.canMoveDown();
    if (distance === 0) {
      return false;
    }

    this.moveTo(this.x, this.y + distance);
    return true;
  }

  // Sinking: swap places with the particle directly below if
  // - this particle has canSink = true
  // - the particle below also has canSink = true
  // - the particle below is lighter (lower density)
  // Returns true if the particle sank.
  sink() {
    if (!this.canSink) {
      return false;
    }

    const belowY = this.y + 1;
    if (belowY >= rows) {
      return false;
    }

    const below = grids[this.x][belowY].particle;
    if (below === null || !below.canSink || below.density >= this.density) {
      return false;
    }

    this.swapWith(below);
    return true;
  }

  // Swap cells with another particle and keep the grid up to date
  swapWith(other) {
    const otherX = other.x;
    const otherY = other.y;

    other.x = this.x;
    other.y = this.y;
    grids[other.x][other.y].particle = other;

    this.x = otherX;
    this.y = otherY;
    grids[this.x][this.y].particle = this;
  }

  // Move this particle to another cell and keep the grid up to date
  moveTo(newX, newY) {
    grids[this.x][this.y].particle = null;
    this.x = newX;
    this.y = newY;
    grids[this.x][this.y].particle = this;
  }

  move() {
    return this.fall() || this.sink();
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

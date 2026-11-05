class Water extends Particle {
  constructor(x, y, id = null) {
    super(x, y, { r: 50, g: 50, b: 230 });
    this.id = id;
    this.type = 'water';
    this.density = 0.4;
    this.canSink = true;
  }

  move() {
    // Fall into empty space, or sink through a lighter particle
    if (this.fall() || this.sink()) {
      return;
    }

    // Can't fall: move sideways every step (no "just landed" check like sand).
    // Pick left or right at random; if that side is blocked, try the other one.
    const dir = random(100) < 50 ? -1 : 1;
    if (this.moveSide(dir)) {
      return;
    }
    this.moveSide(-dir);
  }

  // Move one cell left (dir = -1) or right (dir = 1) if that cell is empty
  moveSide(dir) {
    const nextX = this.x + dir;

    if (!this.canMoveTo(nextX, this.y)) {
      return false;
    }

    this.moveTo(nextX, this.y);
    return true;
  }
}

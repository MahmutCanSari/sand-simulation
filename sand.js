class Sand extends Particle {
  constructor(x, y, id = null) {
    super(x, y);
    this.id = id;
    this.type = 'sand';
    this.density = 0.7;
    this.canSink = true;

    // True while the grain is moving; used to slide only once after landing
    this.wasFalling = false;
  }

  move() {
    // Fall into empty space, or sink through a lighter particle
    if (this.fall() || this.sink()) {
      this.wasFalling = true;
      return;
    }

    // Only try to slide on the first step after the grain lands
    if (!this.wasFalling) {
      return;
    }
    this.wasFalling = false;

    // 40% left, 40% right, 20% stay
    const roll = random(100);
    let dir = 0;
    if (roll < 40) {
      dir = -1;
    } else if (roll < 80) {
      dir = 1;
    }

    if (dir !== 0) {
      this.slide(dir);
    }
  }

  // Move one cell diagonally down (dir: -1 = left, 1 = right) if that cell is empty
  slide(dir) {
    const nextX = this.x + dir;
    const nextY = this.y + 1;

    if (!this.canMoveTo(nextX, nextY)) {
      return false;
    }

    this.moveTo(nextX, nextY);

    // A slide is still movement, so the grain gets another chance after it lands again
    this.wasFalling = true;
    return true;
  }
}

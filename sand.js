class Sand extends Particle {
  constructor(x, y, id = null) {
    super(x, y);
    this.id = id;
    this.type = 'sand';

    // True while the grain is moving; used to slide only once after landing
    this.wasFalling = false;
  }

  move() {
    if (this.fall()) {
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

    grids[this.x][this.y].gridEmpty = true;
    grids[nextX][nextY].gridEmpty = false;
    this.x = nextX;
    this.y = nextY;

    // A slide is still movement, so the grain gets another chance after it lands again
    this.wasFalling = true;
    return true;
  }
}

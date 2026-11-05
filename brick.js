class Brick extends Particle {
  constructor(x, y, id = null) {
    super(x, y, { r: 170, g: 70, b: 50 });
    this.id = id;
    this.type = 'brick';
    this.density = 1;

    // A brick stays where it is placed
    this.canFall = false;
    this.canMove = false;
    this.canSink = false;
  }

  move() {
    return false;
  }
}

import MovingObject from './moving_object';

class Bullet extends MovingObject {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.bounceCount = 0;
  }

  bounce(direction) {
    if(direction === "horizontal") {
      this.vel[1] *= -1;
    } else {
      this.vel[0] *= -1;
    }
    this.bounceCount++;
  }
}

Bullet.RADIUS = 2;
Bullet.SPEED = 4;
Bullet.LIFESPAN = 1;

export default Bullet;
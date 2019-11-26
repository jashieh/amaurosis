import Util from './util';

class MovingObject {
  constructor(options) {
    this.pos = options.pos || [100,100];
    this.vel = options.vel || [0,0];
    this.radius = options.radius || 10;
    this.game = options.game;
    this.color = options.color || "#00FF00";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  move(timeDelta) {
    const NORMAL_FRAME_TIME_DELTA = 1000 / 60,
      velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  };

  remove() {
    this.game.remove(this);
  };
}

export default MovingObject;
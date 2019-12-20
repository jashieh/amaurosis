import MovingObject from './moving_object';
import Game from './game';

class Bullet extends MovingObject {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.color = "#66ff00";
    this.type = "";
    
    this.bounceCount = options.bounceCount || 0;
    this.trail = [this.pos];
    this.tailColor = "#222";
    this.midColor = "#032cfc";
    this.headColor = "#8403fc";
  }

  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );


    gradient.addColorStop(0, this.headColor);
    gradient.addColorStop(0.5, this.midColor);
    gradient.addColorStop(1,  this.tailColor);

    
    ctx.lineWidth = this.radius;
    ctx.strokeStyle = gradient;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke(); 
  }

  bounce(direction) {
    if(direction === "horizontal") {
      this.vel[1] *= -1;
    } else if (direction === "vertical") {
      this.vel[0] *= -1;
    } else {
      this.vel[0] *= -1;
      this.vel[1] *= -1;
    }

    this.bounceCount++;
    
    this.remove();
    if(this.bounceCount > Bullet.LIFESPAN) {
      return;
    }
    
    const reflection = new Bullet({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
      bounceCount: this.bounceCount
    });
    
    this.game.add(reflection);
    // this.vel = [0, 0];
  }

  move(timeDelta) {
    const NORMAL_FRAME_TIME_DELTA = 1000 / Game.FPS,
      velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    const newX = this.pos[0] + offsetX;
    const newY = this.pos[1] + offsetY;

    const collisionX = this.game.wallCollision([this.pos[0], newY]);
    const collisionY = this.game.wallCollision([newX, this.pos[1]]);
    const collisionXY = this.game.wallCollision([newX, newY]);


    if(this.game.portalCollision([this.pos[0], newY])) {
      if(this.game.portalCollision([this.pos[0], newY]).connectedTo) {
        return this.game.portalCollision([this.pos[0], newY]).teleport(this, [this.pos[0], newY]);
      }
      else {
        return this.bounce("horizontal");
      }
    }

    else if(this.game.portalCollision([newX, this.pos[1]])) {
      if(this.game.portalCollision([newX, this.pos[1]]).connectedTo) {
        return this.game.portalCollision([newX, this.pos[1]]).teleport(this, [newX, this.pos[1]]);
      }
      else {
        return this.bounce("vertical");
      }
    }

    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
      this.pos[1] + (this.vel[1] * velocityScale)];
    this.trail.push(this.pos);

    if(this.trail.length > Bullet.MAX) {
      this.trail.shift();
    }
  }
}

Bullet.RADIUS = 3;
Bullet.SPEED = 10;
Bullet.LIFESPAN = 2;
Bullet.MAX = 15;

export default Bullet;
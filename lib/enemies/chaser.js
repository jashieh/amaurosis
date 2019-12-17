import Enemy from './enemy';
import MovingObject from '../moving_object';
import Game from '../game';
import Util from '../util';


class Chaser extends MovingObject {
  constructor(options) {
    options.radius = 10;
    super(options);

    this.color = "#ff0000";
    this.hive = options.hive;
    this.trail = [this.pos];
    this.maxLength = Chaser.MAX;
    this.lifespan = options.lifespan || 0;
  }

  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );

    if(this.lifespan > Chaser.HALF_LIFE) {
      gradient.addColorStop(0, "#ff0000");
    } 
    else if(this.lifespan > Chaser.HALF_LIFE * (3/2)) {
      gradient.addColorStop(0, "#ff0000");
    }
    else {
      gradient.addColorStop(0, "#ff0000");
    }

    gradient.addColorStop(1,  "#222");

    
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;
    // ctx.strokeStyle = this.color;
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
    
    const reflection = new Chaser({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
      hive: this.hive,
      lifespan: this.lifespan
    });

    this.game.add(reflection);
    this.vel = [0, 0];
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


    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.lifespan++;

    if(this.lifespan > Chaser.LIFESPAN) {
      this.remove();
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
    this.pos[1] + (this.vel[1] * velocityScale)];
    
    this.trail.push(this.pos);

    if(this.trail.length > Chaser.MAX) {
      this.trail.shift();
    }

    if(this.lifespan > Chaser.HALF_LIFE) {
      this.trail.shift();
      this.trail.shift();
    }  

  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    let centerDist2;

    if (this.trail[this.trail.length/2]) {
      centerDist2 = Util.dist(this.trail[0], otherObject.pos);
      const centerDist3 = Util.dist(this.trail[this.trail.length/2], otherObject.pos);
      return centerDist < (this.radius + otherObject.radius) ||
      centerDist2 < (this.radius + otherObject.radius) ||
      centerDist3 < (this.radius + otherObject.radius);
    };

    if (this.trail[0]) {
      centerDist2 = Util.dist(this.trail[0], otherObject.pos);
      return centerDist < (this.radius + otherObject.radius) ||
      centerDist2 < (this.radius + otherObject.radius);
    };


    return centerDist < (this.radius + otherObject.radius);
  };

}

Chaser.LIFESPAN = 100;
Chaser.HALF_LIFE = Chaser.LIFESPAN/2;
Chaser.MAX = 40;

export default Chaser;
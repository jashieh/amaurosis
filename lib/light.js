import MovingObject from './moving_object';
import Game from './game';


class Light extends MovingObject {
  constructor(options) {
    options.radius = 1;
    super(options);
    this.bounceCount = 0;
    this.color = "#ffffff";
    this.trail = [this.pos];

    this.maxLength = Light.MAX;
  }

  drawTail() {

  }
  
  draw(ctx) {
    if(this.trail.length === 0) return;
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke();
    
    // ctx.fillStyle = this.color;
    // ctx.arc(
    //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    // );
    // ctx.fill();
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

    const reflection = new Light({
      pos: this.pos,
      vel: this.vel,
      game: this.game
    });

    this.game.add(reflection);
    this.vel = [0, 0];

    if(this.bounceCount > Light.LIFESPAN) {
      this.remove();
    }
    this.bounceCount++;
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


    // if(this.game.portalCollision([this.pos[0], newY]))
    //   return this.game.portalCollision([this.pos[0], newY]).teleport(this, [this.pos[0], newY]);
    // else if(this.game.portalCollision([newX, this.pos[1]]))
    //   return this.game.portalCollision([newX, this.pos[1]]).teleport(this, [newX, this.pos[1]]);

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

    if(this.trail.length > Light.MAX) {
      this.trail.shift();
    }
  }
}

const cos15 = Math.cos((15/180) * Math.PI);
const sin15 = Math.sin((15/180) * Math.PI);

const cos30 = Math.sqrt(3)/2;
const sin30 = 1/2;


Light.LIFESPAN = 5;
Light.SPEED = 5;
Light.MAX = 40;

Light.DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],

  [sin30, cos30],
  [sin30, -cos30],
  [-sin30, cos30],
  [-sin30, -cos30],

  [cos30, sin30],
  [-cos30, sin30],
  [cos30, -sin30],
  [-cos30, -sin30],

  [cos15, sin15],
  [-cos15, sin15],
  [cos15, -sin15],
  [-cos15, -sin15],

  [sin15, cos15],
  [-sin15, cos15],
  [sin15, -cos15],
  [-sin15, -cos15],

]

export default Light;
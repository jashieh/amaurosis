import MovingObject from './moving_object';
import Game from './game';

class Light extends MovingObject {
  constructor(options) {
    options.radius = 1;
    super(options);
    this.color = "#ffffff";
    this.trail = [this.pos];

    this.maxLength = Light.MAX;

    this.lifespan = options.lifespan || Math.floor(Math.random()*40);
  }
  
  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );

    if(this.lifespan > Light.HALF_LIFE) {
      gradient.addColorStop(0, "#aaa");
    } 
    else if(this.lifespan > Light.HALF_LIFE * (3/2)) {
      gradient.addColorStop(0, "#7f7f7f");
    }
    else {
      gradient.addColorStop(0, "#fff");
    }

    gradient.addColorStop(1,  "#222");

    
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
    
    const reflection = new Light({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
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

    if(this.lifespan > Light.LIFESPAN) {
      this.remove();
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
    this.pos[1] + (this.vel[1] * velocityScale)];
    
    this.trail.push(this.pos);

    if(this.trail.length > Light.MAX) {
      this.trail.shift();
    }

    if(this.lifespan > Light.HALF_LIFE) {
      this.trail.shift();
      this.trail.shift();
    }  
  }
}

const cos15 = Math.cos((15/180) * Math.PI);
const sin15 = Math.sin((15/180) * Math.PI);

const cos30 = Math.sqrt(3)/2;
const sin30 = 1/2;


Light.LIFESPAN = 250;
Light.HALF_LIFE = Light.LIFESPAN/2;
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
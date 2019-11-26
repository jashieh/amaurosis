import MovingObject from "./moving_object";
import Bullet from "./bullet";
import Util from "./util";

const maxSpeed = 3;
const radius = 10;
class Player extends MovingObject {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;


    this.updateCursorPostion();
    this.cursorPostion = [0,0];
  }

  power(delta) {
    if(this.vel[0] > -maxSpeed && this.vel[0] < maxSpeed) {
      this.vel[0] += delta[0];
    }

    if(this.vel[1] > -maxSpeed && this.vel[1] < maxSpeed) {
      this.vel[1] += delta[1];
    }
  }

  move(dir) {
    const newX = this.pos[0] + Player.MOVES[dir][0] * Player.SPEED;
    const newY = this.pos[1] + Player.MOVES[dir][1] * Player.SPEED;

    const pi = Math.PI;
    const radX = Math.cos(45*pi/180)*this.radius;
    const radY = Math.sin(45*pi/180)*this.radius;

    const topLeft = [newX - radX, newY - radY];
    const botLeft = [newX - radX, newY + radY];
    const topRight = [newX + radX, newY - radY];
    const botRight = [newX + radX, newY + radY];

    if(this.game.portalCollision(topLeft))
      return this.game.portalCollision(topLeft).teleport(this, topLeft);
    else if(this.game.portalCollision(botLeft))
      return this.game.portalCollision(botLeft).teleport(this, botLeft);
    else if(this.game.portalCollision(topRight))
      return this.game.portalCollision(topRight).teleport(this, topRight);
    else if(this.game.portalCollision(botRight))
      return this.game.portalCollision(botRight).teleport(this, botRight);

    

    if(this.game.wallCollision(topLeft)
      || this.game.wallCollision(botLeft)
      || this.game.wallCollision(topRight)
      || this.game.wallCollision(botRight)) {
      return;
    }

    this.pos = [newX, newY];
  }

  mouseAngle() {
    let vect = Util.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let x = vect[0];
    let y = vect[1];

    return Math.atan2(y,x);
  }

  renderMouse(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.cursorPostion[0], this.cursorPostion[1]);
    ctx.stroke();
  }


  fireBullet() {
    let angle = this.mouseAngle();
    let relVel = Util.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let pos = this.pos.slice();

    const pi = Math.PI;
    const radX = Math.cos(angle)*this.radius;
    const radY = Math.sin(angle)*this.radius;
    pos[0] += radX;
    pos[1] += radY;


    relVel[0] *= Bullet.SPEED;
    relVel[1] *= Bullet.SPEED;
    const bullet = new Bullet({
      pos: pos,
      vel: relVel,
      game: this.game
    });

    this.game.add(bullet);
  }

  createPortal() {

  }

  shield() {

  }

  updateCursorPostion() {
    window.addEventListener('mousemove', (e) => {
      this.cursorPostion[0] = e.clientX;
      this.cursorPostion[1] = e.clientY;
    });
  }

}

const sideMove = Math.sqrt(2)/2;

Player.SPEED = 3;
Player.MOVES = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
  wa: [-sideMove, -sideMove],
  wd: [sideMove, -sideMove],
  sa: [-sideMove, sideMove],
  sd: [sideMove, sideMove],  
}

export default Player;
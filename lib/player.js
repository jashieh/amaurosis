import MovingObject from "./moving_object";
import Bullet from "./bullet";
import PortalGun from "./portal_gun";
import Light from "./light";
import Util from "./util";

const maxSpeed = 3;
const radius = 8;

class Player extends MovingObject {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;
    this.portals = [];
    this.health = 3;

    this.portalBullets = 0;
    this.lightCooldown = false;
    this.portalCooldown = false;
    this.shielding = false;
    this.shieldHealth = 3;
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

    if(this.portals.length === 2) {
      this.connectPortals();
    }

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
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "#ff0000";
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.cursorPostion[0], this.cursorPostion[1]);
    ctx.stroke();
  }


  fireBullet(type) {
    let angle = this.mouseAngle();
    let relVel = Util.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let pos = this.pos.slice();

    const radX = Math.cos(angle)*this.radius;
    const radY = Math.sin(angle)*this.radius;
    pos[0] += radX;
    pos[1] += radY;


    relVel[0] *= Bullet.SPEED;
    relVel[1] *= Bullet.SPEED;

    if(type === "bullet") {
      const bullet = new Bullet({
        pos: pos,
        vel: relVel,
        game: this.game
      });

      this.game.add(bullet);
    } else if (type === "portal") {
      const portalGun = new PortalGun({
        pos: pos,
        vel: relVel,
        game: this.game,
        player: this
      });
      this.game.add(portalGun);
      this.portalBullets++;

      if(this.portalBullets === 2) {
        this.portalCooldown = true;
        this.portalBullets = 0;
        setTimeout(() => {
          this.portalCooldown = false;
        }, 5000);
      }
    }

  }

  connectPortals() {
    this.portals[0].connect(this.portals[1]);
    this.portals[1].connect(this.portals[0]);

  }

  removePortals() {
    this.portals[0].remove();
    this.portals[1].remove();
    this.portals.shift();
    this.portals.shift();

  }

  drawShield(ctx) {
    if(this.shieldHealth > 0) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#144b9f";
      ctx.setLineDash([5, 1]);
  
      ctx.beginPath();
      ctx.arc(
        this.pos[0], this.pos[1], this.radius + this.shieldHealth * 5, 
        0, 2 * Math.PI, true
      );
  
      ctx.stroke();
    }
  }

  checkShieldHit(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + this.shieldHealth * 5 + otherObject.radius);
  }

  shineLight() {
    for(let i = 0; i < Light.DIRECTIONS.length; i++) {
      let relVel = Light.DIRECTIONS[i].slice();
      relVel[0] *= Light.SPEED;
      relVel[1] *= Light.SPEED;

      let light = new Light({
        pos: this.pos,
        vel: relVel,
        game: this.game
      });

      this.game.add(light);
    }
    this.lightCooldown = true;
    setTimeout(() => {
      this.lightCooldown = false;
    }, 1000);
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

Player.MINSHIELD = 0;
Player.MAXSHIELD = 3;

export default Player;
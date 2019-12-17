import MovingObject from "./moving_object";
import Bullet from "./bullet";
import PortalGun from "./portal_gun";
import Portal from "./portal";
import Light from "./light";
import Util from "./util";
import Game from "./game";

const maxSpeed = 3;
const radius = 25;

class Player extends MovingObject {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;
    this.portals = [];
    this.health = Player.MAX_HEALTH;

    // this.bullets = Player.MAX_BULLETS; 
    // this.reloading = false;

    this.portalBullets = 0;
    this.lightCooldown = false;
    this.portalCooldown = false;

    this.timeStop = false;
    this.timeStopCooldown = false;

    this.shielding = false;
    this.shieldHealth = Player.MAX_SHIELD;
    this.cursorPostion = [0,0];
    
    this.sprite = new Image();
    this.sprite.src = "./sprites/player/cat.png";
    
    this.updateCursorPostion();

    this.moving = false;
    this.frame = 0;
    this.i = 0;
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

    if(this.game.portalCollision(topLeft) && this.game.portalCollision(topLeft).active)
      return this.game.portalCollision(topLeft).teleport(this, topLeft);
    else if(this.game.portalCollision(botLeft) && this.game.portalCollision(botLeft).active)
      return this.game.portalCollision(botLeft).teleport(this, botLeft);
    else if(this.game.portalCollision(topRight) && this.game.portalCollision(topRight).active)
      return this.game.portalCollision(topRight).teleport(this, topRight);
    else if(this.game.portalCollision(botRight) && this.game.portalCollision(botRight).active)
      return this.game.portalCollision(botRight).teleport(this, botRight);

  
    if(this.game.wallCollision(topLeft)
      || this.game.wallCollision(botLeft)
      || this.game.wallCollision(topRight)
      || this.game.wallCollision(botRight)) {
      return;
    }

    this.cursorPostion[0] += newX - this.pos[0];
    this.cursorPostion[1] += newY - this.pos[1];

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
    
    const radX = Math.cos(angle)*this.radius*1.2;
    const radY = Math.sin(angle)*this.radius*1.2;
    pos[0] += radX;
    pos[1] += radY;
    
    if(type === "portal") {
      relVel[0] *= PortalGun.SPEED;
      relVel[1] *= PortalGun.SPEED;
    }
    else {
      relVel[0] *= Bullet.SPEED;
      relVel[1] *= Bullet.SPEED;
    }
    
    if(type === "bullet") {
      const bullet = new Bullet({
        pos: pos,
        vel: relVel,
        game: this.game
      });
      
      this.game.add(bullet);
      // this.bullets--;
      // console.log(`Ammo: ${this.bullets}`);
      
      // if(this.bullets <= 0) {
      //   console.log('reloading...');
      //   this.reloading = true;
      //   this.bullets = Player.MAX_BULLETS;
      //   setTimeout(() => {
      //     this.reloading = false;
      //   }, 1500);
      // }
      
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
    
    this.portals[0].color = Portal.BLUE;
    this.portals[1].color = Portal.BLUE;
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
        this.pos[0], this.pos[1], this.radius + this.shieldHealth * Player.SHIELD_RADIUS, 
        0, 2 * Math.PI, true
      );
  
      ctx.stroke();
    }
  }

  checkShieldHit(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + this.shieldHealth * Player.SHIELD_RADIUS + 
      otherObject.radius);
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
    }, 500);
  }

  stopTime() {
    this.timeStop = true;
    this.timeStopCooldown = true;

    setTimeout(() => {
      this.timeStop = false;
    }, 1000);

    setTimeout(() => {
      this.timeStopCooldown = false;
    }, 5000);
  }

  mouseMove(e) {
    this.cursorPostion[0] = e.clientX + (-Game.VIEW_X/2 + this.pos[0]);
    this.cursorPostion[1] = e.clientY + (-Game.VIEW_Y/2 + this.pos[1]);
  }

  updateCursorPostion() {
    window.addEventListener('mousemove', e => this.mouseMove(e));
  }


  draw(ctx) {

    if (this.frame > 2) {
      this.frame = 0;
    }

    ctx.save();

    ctx.translate(this.pos[0], this.pos[1])

    let angle = this.mouseAngle()*180/Math.PI;
    let sx, sy;

    if(angle > -45 && angle < 45) {
      sx = this.frame*48;
      sy = 2*48;
    }
    else if(angle > 45 && angle < 135) {
      sx = this.frame*48;
      sy = 0;
    }
    else if(angle > 135 || angle < -135) {
      sx = this.frame*48;
      sy = 48;
    }
    else if(angle > -135 && angle < -45) {
      sx = this.frame*48;
      sy = 3*48;
    }

    if(!this.moving) {
      sx = 0;
    }

    // ctx.rotate(this.mouseAngle());

    // ctx.drawImage(this.sprite, 
    //   0,0, 50, 50,
    //   (this.pos[0]-20), (this.pos[1]-25),
    //   50, 50
    // );

    ctx.drawImage(this.sprite, 
      sx,sy, 48, 48,
      -16, -23,
      35, 35
    );

    ctx.restore();


    ctx.lineWidth = 1;
    // ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.strokeStyle = "#b503fc";
    ctx.setLineDash([1,0]);
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );

    ctx.stroke();

    if(this.i % 8 === 0) {
      this.frame++;
    }

    this.i++;
  }
}

const sideMove = Math.sqrt(2)/2;

Player.MAX_BULLETS = 12;
Player.MAX_HEALTH = 10;
Player.MIN_SHIELD = 0;
Player.MAX_SHIELD = 10;
Player.SHIELD_RADIUS = 1;

Player.WIDTH = 48;
Player.HEIGHT = 48;


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
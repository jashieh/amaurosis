import MovingObject from "./moving_object";
import Bullet from "./bullet";
import PortalGun from "./portal_gun";
import Portal from "./portal";
import Light from "./light";
import Util from "./util";
import Game from "./game";

const radius = 25;

class Player extends MovingObject {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;
    this.portals = [];
    this.health = Player.MAX_HEALTH;

    // this.bullets = Player.MAX_BULLETS; 
    this.reloading = false;

    this.portalBullets = 0;

    this.lightCooldown = false;
    this.lightTimer = 0;
    this.lightInt = null;

    this.portalCooldown = false;
    this.portalTimer = 0;
    this.portalInt = null;

    this.timeStop = false;
    this.timeStopCooldown = false;
    this.stopTimer = 0;
    this.stopInt = null;

    this.shielding = false;
    this.shieldHealth = Player.MAX_SHIELD;
    this.cursorPostion = [0,0];
    
    this.sprite = new Image();
    this.sprite.src = "./sprites/player/cat.png";

    this.bulletHUD = new Image();
    this.bulletHUD.src = "./sprites/player/crosshair_test.png";
    this.lightHUD = new Image();
    this.lightHUD.src = "./sprites/player/flashlight.png";
    this.timeHUD = new Image();
    this.timeHUD.src = "./sprites/player/stopwatch.png";
    this.portalHUD = new Image();
    this.portalHUD.src = "./sprites/player/portal.png";
    this.shieldHUD = new Image();
    this.shieldHUD.src = "./sprites/player/shield.png";
    
    this.updateCursorPostion();

    this.moving = false;
    this.frame = 0;
    this.i = 0;
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

    
    if(this.game.finishLevel(topLeft)
      || this.game.finishLevel(botLeft)
      || this.game.finishLevel(topRight)
      || this.game.finishLevel(botRight)) {
        this.game.nextLevel();
    }
  
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
      this.reloading = true;
      setTimeout(() => {
        this.reloading = false;
      }, 200);
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
        this.portalTimer = Player.PORTAL_CD;
        this.portalInt = setInterval(()=>{this.portalTimer -= 0.1}, 100);


        setTimeout(() => {
          this.portalCooldown = false;
        }, Player.PORTAL_CD*1000);
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
    this.lightTimer = Player.LIGHT_CD;
    this.lightInt = setInterval(()=>{this.lightTimer -= 0.1}, 100);

    setTimeout(() => {
      this.lightCooldown = false;
    }, Player.LIGHT_CD*1000);
  }

  stopTime() {
    this.timeStop = true;
    this.timeStopCooldown = true;
    this.stopTimer = Player.TIMESTOP_CD;

    this.stopInt = setInterval(()=>{this.stopTimer -= 0.1}, 100);

    setTimeout(() => {
      this.timeStop = false;
    }, 1000);

    setTimeout(() => {
      this.timeStopCooldown = false;
    }, Player.TIMESTOP_CD*1000);
  }

  mouseMove(e) {
    if(e.clientX <= Game.VIEW_X) {
      this.cursorPostion[0] = e.clientX + (-Game.VIEW_X/2 + this.pos[0]);
      this.cursorPostion[1] = e.clientY + (-Game.VIEW_Y/2 + this.pos[1]);
    }
  }

  updateCursorPostion() {
    window.addEventListener('mousemove', e => this.mouseMove(e));
  }

  drawHUD(ctx) {
    ctx.fillStyle = "#686968";
    let box1 = [this.pos[0] - Game.VIEW_X/2, this.pos[1] + Game.VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box2 = [this.pos[0] - Game.VIEW_X/2 + Player.HUD_ICON_SIZE, this.pos[1] + Game.VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box3 = [this.pos[0] - Game.VIEW_X/2 + Player.HUD_ICON_SIZE*2, this.pos[1] + Game.VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box4 = [this.pos[0] - Game.VIEW_X/2 + Player.HUD_ICON_SIZE*3, this.pos[1] + Game.VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box5 = [this.pos[0] - Game.VIEW_X/2 + Player.HUD_ICON_SIZE*4, this.pos[1] + Game.VIEW_Y/2 - Player.HUD_ICON_SIZE];

    ctx.fillRect(box1[0], box1[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box2[0] + 1, box2[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box3[0] + 2, box3[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box4[0] + 3, box4[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box5[0] + 4, box5[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    
    ctx.drawImage(this.bulletHUD, 0, 0, 500, 500, 
      box1[0] + 20, box1[1] + 20, 60, 60);

    ctx.drawImage(this.lightHUD, 0, 0, 980, 980, 
      box2[0] + 30, box2[1] + 30, 40, 40); 
    
    ctx.drawImage(this.timeHUD, 0, 0, 512, 512, 
      box3[0] + 25, box3[1] + 25, 50, 50); 

    ctx.drawImage(this.portalHUD, 0, 0, 483, 600, 
      box4[0] + 25, box4[1] + 13, 50, 65);

    ctx.drawImage(this.shieldHUD, 0, 0, 512, 512, 
      box5[0] + 27, box5[1] + 25, 50, 50); 

    
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Georgia";
    ctx.fillText("Click", box1[0] + 63, box1[1] + 15);
    ctx.fillText("Space", box2[0] + 60, box2[1] + 15);
    ctx.fillText("R", box3[0] + 87, box3[1] + 15);
    ctx.fillText("E", box4[0] + 88, box4[1] + 15);
    ctx.fillText("F", box5[0] + 89, box5[1] + 15);


    ctx.font = "14px Georgia";
    ctx.fillText("Shoot", box1[0] + 35, box1[1] + 93);
    ctx.fillText("Light", box2[0] + 37, box2[1] + 93);
    ctx.fillText("Time Stop", box3[0] + 24, box3[1] + 93);
    ctx.fillText("Portal Gun", box4[0] + 24, box4[1] + 93);
    ctx.fillText("Shield", box5[0] + 35, box5[1] + 93);
    
    ctx.fillStyle = "red";
    ctx.fillRect(box1[0], box1[1] - 25, 500*this.health/Player.MAX_HEALTH, 20);
      
    ctx.fillStyle = "#ffffff";
    
    ctx.fillText("Health", box1[0], box1[1] - 10);

    ctx.fillStyle = "rgba(222, 222, 222, 0.7)";



    if(this.lightTimer > 0) {
      ctx.fillRect(box2[0], box2[1] + this.lightTimer*100/Player.LIGHT_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
      // ctx.beginPath();
      // ctx.moveTo(box2[0] + Player.HUD_ICON_SIZE/2 + 1, box2[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box2[0] + Player.HUD_ICON_SIZE/2 + 1, box2[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.lightTimer)/Player.LIGHT_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.lightInt) {
        clearInterval(this.lightInt);
      }
    }

    if(this.stopTimer > 0) {
      ctx.fillRect(box3[0] + 2, box3[1] + this.stopTimer*100/Player.TIMESTOP_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
      // ctx.beginPath();
      // ctx.moveTo(box3[0] + Player.HUD_ICON_SIZE/2 + 2, box3[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box3[0] + Player.HUD_ICON_SIZE/2 + 2, box3[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.stopTimer)/Player.TIMESTOP_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.stopInt) {
        clearInterval(this.stopInt);
      }
    }

    if(this.portalTimer > 0 ) {
      ctx.fillRect(box4[0] + 3, box4[1] + this.portalTimer*100/Player.PORTAL_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);

      // ctx.beginPath();
      // ctx.moveTo(box4[0] + Player.HUD_ICON_SIZE/2 + 3, box4[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box4[0] + Player.HUD_ICON_SIZE/2 + 3, box4[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.portalTimer)/Player.PORTAL_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.portalInt) {
        clearInterval(this.portalInt);
      }
    }

    if(this.shielding) {
      ctx.fillRect(box5[0] + 4, box4[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    }
    
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

    this.drawHUD(ctx);

  }
}

const sideMove = Math.sqrt(2)/2;

Player.MAX_BULLETS = 12;
Player.MAX_HEALTH = 6;
Player.MIN_SHIELD = 0;
Player.MAX_SHIELD = 10;
Player.SHIELD_RADIUS = 1;

Player.WIDTH = 48;
Player.HEIGHT = 48;

Player.LIGHT_CD = 1;
Player.PORTAL_CD = 5;
Player.TIMESTOP_CD = 5;

Player.HUD_ICON_SIZE = 100;


Player.SPEED = 10;
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
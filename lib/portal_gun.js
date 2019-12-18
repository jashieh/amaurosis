import Bullet from './bullet';
import Portal from './portal';
import Game from './game';


class PortalGun extends Bullet {
  constructor(options) {
    super(options);
    this.player = options.player;

    this.tailColor = "#222";
    this.midColor = "#fce703";
    this.headColor = "#fc9003";
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


    let portal;
    let color;
    if(this.player.portals.length === 0 || this.player.portals.length === 2) 
      color = Portal.PINK;
    else 
      color = Portal.BLUE;


    if(collisionX && offsetY < 0) {
      this.remove();
      portal = new Portal({
        pos: [this.pos[0], newY + 5],
        color: color,
        game: this.game,
        dir: "down"
      });
      
      this.player.portals.push(portal);
      this.game.add(portal);
    } else if(collisionX && offsetY > 0) {

      this.remove();
      portal = new Portal({
        pos: [newX, this.pos[1]],
        color: color,
        game: this.game,
        dir: "up"
      });

      this.player.portals.push(portal);
      this.game.add(portal);

    } else if (collisionY && offsetX > 0) {
      this.remove();
      portal = new Portal({
        pos: [newX - 5, this.pos[1]],
        color: color,
        game: this.game,
        dir: "left"
      });

      this.player.portals.push(portal);
      this.game.add(portal);

    } else if (collisionY && offsetX < 0) {
      this.remove();
      portal = new Portal({
        pos: [newX + 5, this.pos[1]],
        color: color,
        game: this.game,
        dir: "right"
      });

      this.player.portals.push(portal);
      this.game.add(portal);
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
      this.pos[1] + (this.vel[1] * velocityScale)];
    this.trail.push(this.pos);

    if(this.trail.length > PortalGun.MAX) {
      this.trail.shift();
    }
  }
}

PortalGun.RADIUS = 5;
PortalGun.OFFSET = 5;
PortalGun.SPEED = 5;
PortalGun.MAX = 30;


export default PortalGun;
import MovingObject from "../moving_object";
import Util from "../util";
import Chaser from "./chaser";

class ChaserHive extends MovingObject {
  constructor(options) {
    super(options);
    // this.pos = [350,350];
    // this.radius = options.radius;
    // this.game = options.game;
    this.color = options.color || "#ffffff";
    this.aggro = options.aggro || true;
    this.health = 12;

    this.alive = setInterval(() => { this.releaseChasers() }, 10000);
  }

  releaseChasers() {
    for(let i = 0; i < ChaserHive.DIRECTIONS.length; i++) {
      let relVel = ChaserHive.DIRECTIONS[i].slice();
      relVel[0] *= ChaserHive.SPEED;
      relVel[1] *= ChaserHive.SPEED;

      let chaser = new Chaser({
        pos: this.pos,
        vel: relVel,
        hive: this,
        game: this.game
      });

      this.game.add(chaser);
    }
  }

  path() {
    const x = this.game.players[0].pos[0] - this.pos[0];
    const y = this.game.players[0].pos[1] - this.pos[1];
    const dist = Util.dist(this.game.players[0].pos, this.pos);
    return Util.dir([x, y]);
  }


  move() {
    if(this.aggro) {
      const dir = this.path();
      const newX = this.pos[0] + (dir[0] * 2);
      const newY = this.pos[1] + (dir[1] * 2);
  
      const collisionX = this.game.wallCollision([this.pos[0], newY]);
      const collisionY = this.game.wallCollision([newX, this.pos[1]]);
  
      const copy = this.pos;
  
      if(collisionX) {
        return this.pos = [newX, copy[1]];
      } else if(collisionY) {
        return this.pos = [copy[0], newY];
      }
  
      this.pos = [newX, newY];
    }
  }


}

const cos15 = Math.cos((15/180) * Math.PI);
const sin15 = Math.sin((15/180) * Math.PI);

const cos30 = Math.sqrt(3)/2;
const sin30 = 1/2;

ChaserHive.SPEED = 5;

ChaserHive.DIRECTIONS = [
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

export default ChaserHive;
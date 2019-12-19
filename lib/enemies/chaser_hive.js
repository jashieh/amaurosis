import MovingObject from "../moving_object";
import Util from "../util";
import Chaser from "./chaser";

class ChaserHive extends MovingObject {
  constructor(options) {
    super(options);
    this.color = options.color || "#000000";
    this.aggro = options.aggro || false;
    this.player = options.player;
    this.health = options.health || 20;

    this.minions = [];

    this.alive = null;
  }

  releaseChasers() {
    let vect = Util.dir([this.game.players[0].pos[0] - this.pos[0], 
      this.game.players[0].pos[1]- this.pos[1]]);
    let angle = Math.atan2(vect[1],vect[0])*180/Math.PI;
    
    let directions = ChaserHive.DIRECTIONS.slice();

    if(this.health <= 5) {
      if(angle > -45 && angle < 45) { 
        directions = directions.slice(0,5);
      }
      else if(angle > 45 && angle < 135) {
        directions = directions.slice(5,10);
      }
      else if(angle > 135 || angle < -135) {
        directions = directions.slice(10,15);
      }
      else if(angle < -45 && angle > -135) {
        directions = directions.slice(15,20);
      }
    }  
    else if(this.health <= 10) {
      if(angle > -45 && angle < 45) { 
        directions.splice(10,5);

        if(angle < 0) 
          directions.splice(5,5);
        else
          directions.splice(15,5);
      }
      else if(angle > 45 && angle < 135) {
        directions.splice(15,5);

        if(angle < 90) 
          directions.splice(10,5);
        else
          directions.splice(0,5);
      }
      else if(angle > 135 || angle < -135) {
        directions.splice(0,5);

        if(angle > 0) 
          directions.splice(15,5);
        else 
          directions.splice(0,5);
      }
      else if(angle < -45 && angle > -135) {
        directions.splice(5,5);

        if(angle > -90) 
          directions.splice(5,5);
        else 
          directions.splice(15,5);
      }
    }

    else if(this.health <= 15) {
      if(angle > -45 && angle < 45) { 
        directions.splice(10,5);
      }
      else if(angle > 45 && angle < 135) {
        directions.splice(15,5);
      }
      else if(angle > 135 || angle < -135) { 
        directions.splice(0,5);
      }
      else if(angle < -45 && angle > -135) {
        directions.splice(5,5);
      }
    }
  
    for(let i = 0; i < this.health; i++) {

      let relVel = directions[i].slice();
      relVel[0] *= ChaserHive.SPEED;
      relVel[1] *= ChaserHive.SPEED;

      let chaser = new Chaser({
        pos: this.pos,
        vel: relVel,
        hive: this,
        game: this.game
      });

      this.game.add(chaser);
      this.minions.push(chaser);
    }
  }

  activate() {
    if(!this.aggro) {
      this.aggro = true;
      this.alive = setInterval(() => { this.releaseChasers() }, 1500);
    }
  }

  remove() {
    for(let i = 0; i < this.minions.length; i++) {
      this.game.remove(this.minions[i]);
    }

    clearInterval(this.alive);
    this.game.remove(this);
  }

  path() {
    const x = this.game.players[0].pos[0] - this.pos[0];
    const y = this.game.players[0].pos[1] - this.pos[1];
    // const dist = Util.dist(this.game.players[0].pos, this.pos);
    return Util.dir([x, y]);
  }


  move() {
    // let vect = Util.dir([this.game.players[0].pos[0] - this.pos[0], 
    //   this.game.players[0].pos[0]- this.pos[1]]);
    //   console.log(Math.atan2(vect[1],vect[0])*180/Math.PI)
    if(this.aggro) {
      const dir = this.path();
      const newX = this.pos[0] + (dir[0] * 1);
      const newY = this.pos[1] + (dir[1] * 1);
  
      const collisionX = this.game.wallCollision([this.pos[0], newY]);
      const collisionY = this.game.wallCollision([newX, this.pos[1]]);
  
      const copy = this.pos;


      if(collisionX && collisionY) {
        return;
      } else if(collisionX) {
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

// ChaserHive.DIRECTIONS = [
//   [1, 0],
//   [-1, 0],
//   [0, 1],
//   [0, -1],

//   [sin30, cos30],
//   [sin30, -cos30],
//   [-sin30, cos30],
//   [-sin30, -cos30],

//   [cos30, sin30],
//   [-cos30, sin30],
//   [cos30, -sin30],
//   [-cos30, -sin30],

//   [cos15, sin15],
//   [-cos15, sin15],
//   [cos15, -sin15],
//   [-cos15, -sin15],

//   [sin15, cos15],
//   [-sin15, cos15],
//   [sin15, -cos15],
//   [-sin15, -cos15],
// ]

// ChaserHive.DIRECTIONS = [
//   [1, 0],
//   [cos15, sin15],
//   [cos30, sin30],
//   [sin30, cos30],
//   [sin15, cos15],
  
//   [0, 1],
//   [-cos30, sin30],
//   [-cos15, sin15],
//   [-sin30, cos30],
//   [-sin15, cos15],

//   [-1, 0],
//   [-sin30, -cos30],
//   [-cos30, -sin30],
//   [-cos15, -sin15],
//   [-sin15, -cos15],


//   [0, -1],
//   [sin30, -cos30],
//   [cos30, -sin30],
//   [cos15, -sin15],
//   [sin15, -cos15],
// ]

// right, up, left, down
ChaserHive.DIRECTIONS = [
  [cos15, sin15],
  [cos30, sin30],
  [1, 0],
  [cos15, -sin15],
  [cos30, -sin30],
  

  [sin15, cos15],
  [sin30, cos30],
  [0, 1],
  [-sin15, cos15],
  [-sin30, cos30],
  
  
  [-cos30, sin30],
  [-cos15, sin15],
  [-1, 0],
  [-cos30, -sin30],
  [-cos15, -sin15],
  
  
  [-sin30, -cos30],
  [-sin15, -cos15],
  [0, -1],
  [sin30, -cos30],
  [sin15, -cos15],
]


export default ChaserHive;
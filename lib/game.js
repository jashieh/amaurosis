import Player from './player';
import Bullet from './bullet';
import Wall from './wall';
import Portal from './portal';

class Game {
  constructor() {
    this.players = [];
    this.bullets = [];
    this.walls = [];
    this.portals = [];

    this.addWall();
  }
  

  add(object) {
    if(object instanceof Player) {
      this.players.push(object);
    } else if (object instanceof Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Wall) {
      this.walls.push(object);
    } else if (object instanceof Portal) {
      this.portals.push(object);
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else {
      throw new Error("unknown type of object");
    }
  }

  addPlayer() {
    const player = new Player({
      game: this,
      pos: [400,400]
    });

    this.add(player);
    return player;
  }

  addWall() {
    let wall = new Wall({
      topLeft: [0,0],
      bottomRight: [100,100],
      direction: "vertical",
      game: this
    });
    this.add(wall);
    let wall2 = new Wall({
      topLeft: [100,100],
      bottomRight: [300,300],
      direction: "vertical",
      game: this
    });
    this.add(wall2);
    let portal = new Portal({
      topLeft: [250,290],
      bottomRight: [300,300],
      direction: "horizontal",
      game: this,
      dir: "down"
    });

    let portal2 = new Portal({
      topLeft: [100,100],
      bottomRight: [150,110],
      direction: "horizontal",
      game: this,
      dir: "up"
    });
    
    portal2.connect(portal);
    portal.connect(portal2);

    console.log


    this.add(portal);
    this.add(portal2);

  }

  allMovingObjects() {
    return [].concat(this.players, this.bullets);
  }

  allObjects() {
    return [].concat(this.players, this.bullets, this.walls, this.portals);
  }

  draw(ctx) {
    this.checkBounce();
    // this.wallCollissionCircle(this.players[0]);
    this.wallCollision(this.players[0].pos);
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(object => {
      object.draw(ctx);
    });

    this.players[0].renderMouse(ctx);
  }

  moveObjects(delta) {
    this.allMovingObjects().forEach(object => {
      if(!(object instanceof Wall || object instanceof Player))
        object.move(delta);
    });
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollissions();
  }

  checkBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  checkBounce() {
    for(let i = 0; i < this.bullets.length; i++) {
      if(this.bullets[i].pos[0] < 0 || this.bullets[i].pos[0] > Game.DIM_X) {
        this.bullets[i].bounce("vertical");
      } 
      else if(this.bullets[i].pos[1] < 0 || this.bullets[i].pos[1] > Game.DIM_Y) {
        this.bullets[i].bounce("horizontal");
      } 

      if(this.bullets[i].bounceCount > Bullet.LIFESPAN) {
        let bullet = this.bullets[i];
        this.bullets[i].remove();
      }
    }
  }

  wallCollissionCircle(player) {
    for(let i = 0; i < this.walls.length; i++) {
      let wall = this.walls[i];

      let midpointX = (wall.topLeft[0] + wall.bottomRight[0])/2;
      let midpointY = (wall.topLeft[1] + wall.bottomRight[1])/2;

      let width =  wall.bottomRight[0] - wall.topLeft[0];
      let height = wall.bottomRight[1] - wall.topLeft[1];
      
      let circleDistX = Math.abs(player.pos[0] - midpointX);
      let circleDistY = Math.abs(player.pos[1] - midpointY);

      // if (circleDistX > (width/2 + player.radius)) { return false; }
      // if (circleDistY > (height/2 + player.radius)) { return false; }

      if (circleDistX <= (width/2)) { console.log("hit");return true; } 
      if (circleDistY <= (height/2)) { console.log("hit");return true; }

    }
    return false;
  }

  wallCollision(pos) {
    for(let i = 0; i < this.walls.length; i++) {
      let wall = this.walls[i];
      if( !((pos[0] < wall.topLeft[0]) 
        || (pos[0] > wall.bottomRight[0])
        || (pos[1] < wall.topLeft[1])
        || (pos[1] > wall.bottomRight[1]))) {
          return true;
      } 
    }
  }

  portalCollision(pos) {
    for(let i = 0; i < this.portals.length; i++) {
      let portal = this.portals[i];
      if( !((pos[0] < portal.topLeft[0]) 
        || (pos[0] > portal.bottomRight[0])
        || (pos[1] < portal.topLeft[1])
        || (pos[1] > portal.bottomRight[1]))) {
          return portal;
      } 
    }
    return false;
  }

  checkCollissions() {
    const allObjects = this.allMovingObjects();

    for(let i = 0; i < allObjects.length; i++) {
      for(let j = 0; j < allObjects.length; j++) {
        if(i === j) continue;
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          if(obj1 instanceof Bullet) {
            this.remove(obj1);
            console.log("collision")

          }
          if(obj2 instanceof Bullet) {
            console.log("collision")
            this.remove(obj2);
          }

          if(obj1 instanceof Player && obj2 instanceof Bullet) {
            console.log("hit")
          } else if (obj2 instanceof Player && obj1 instanceof Bullet) {
            console.log("hit")
          }
          // const collision = obj1.collideWith(obj2);
          // if (collision) return;
          
        }
      }
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
  }

}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;

export default Game;
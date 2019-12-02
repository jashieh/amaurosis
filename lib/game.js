import Player from './player';
import Bullet from './bullet';
import Wall from './wall';
import Portal from './portal';
import PortalGun from './portal_gun';
import Light from './light';
import GameView from './game_view';

class Game {
  constructor() {
    this.players = [];
    this.bullets = [];
    this.lights = [];
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
    } else if (object instanceof Light) {
      this.lights.push(object);
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Portal) {
      this.portals.splice(this.portals.indexOf(object), 1);
    } else if (object instanceof Light) {
      this.lights.splice(this.lights.indexOf(object), 1);
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

    let wall2 = new Wall({
      topLeft: [100,100],
      bottomRight: [300,300],
      direction: "vertical",
      game: this
    });

    let wall3 = new Wall({
      topLeft: [0,0],
      bottomRight: [1000,5],
      direction: "vertical",
      game: this
    });
    let wall4 = new Wall({
      topLeft: [0,0],
      bottomRight: [5,600],
      direction: "vertical",
      game: this
    });
    let wall5 = new Wall({
      topLeft: [0,595],
      bottomRight: [1000,600],
      direction: "vertical",
      game: this
    });
    let wall6 = new Wall({
      topLeft: [995,0],
      bottomRight: [1000,600],
      direction: "vertical",
      game: this
    });


    this.add(wall);
    this.add(wall2);
    // this.add(wall3);
    // this.add(wall4);
    // this.add(wall5);
    // this.add(wall6);

    let portal = new Portal({
      pos: [275, 300],
      direction: "horizontal",
      game: this,
      dir: "down"
    });

    let portal2 = new Portal({
      pos: [125, 100],
      direction: "horizontal",
      game: this,
      dir: "up"
    });
    
    portal2.connect(portal);
    portal.connect(portal2);

    this.add(portal);
    this.add(portal2);

  }

  allMovingObjects() {
    return [].concat(this.players, this.bullets);
  }

  allObjects() {
    return [].concat(this.bullets, this.walls, this.portals, this.lights);
  }

  draw(ctx, xView, yView) {
    ctx.save();


    if(this.players[0].portals.length === 2
      && !this.players[0].portals[0].connectedTo
      && !this.players[0].portals[1].connectedTo) {
      this.players[0].connectPortals();
    } else if(this.players[0].portals.length > 2) {
      this.players[0].removePortals();
    }
        
  
    this.wallCollision(this.players[0].pos);
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    
    ctx.fillRect(0, 0, xView, yView);

    ctx.translate((xView/2 - this.players[0].pos[0]), (yView/2 - this.players[0].pos[1]))
    // ctx.clearRect(0, 0, xView, yView);

    ctx.fillStyle = Game.BG_COLOR;
    
    // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    // ctx.translate(-this.players[0].pos[0],-this.players[0].pos[1])
    // ctx.restore();

    
    this.players[0].renderMouse(ctx);

    this.allObjects().forEach(object => {
      object.draw(ctx);
    });

    this.players[0].draw(ctx);

    if(this.players[0].shielding) {
      this.players[0].drawShield(ctx);
    }

    // ctx.rotate(-0.7)
    
    ctx.restore();

  }

  moveObjects(delta) {
    this.allMovingObjects().forEach(object => {
      if(!(object instanceof Wall || object instanceof Player))
        object.move(delta);
    });

    this.lights.forEach(object => {
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
    // for(let i = 0; i < this.bullets.length; i++) {
    //   if(this.bullets[i].pos[0] < 0 || this.bullets[i].pos[0] > Game.DIM_X) {
    //     this.bullets[i].bounce("vertical");
    //   } 
    //   else if(this.bullets[i].pos[1] < 0 || this.bullets[i].pos[1] > Game.DIM_Y) {
    //     this.bullets[i].bounce("horizontal");
    //   } 

    //   if(this.bullets[i].bounceCount > Bullet.LIFESPAN) {
    //     this.bullets[i].remove();
    //   }
    // }
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

        if(obj1 instanceof Player && obj2 instanceof Bullet
          && !(obj2 instanceof PortalGun)) {

          if(obj1.shielding && obj1.shieldHealth > 0 && obj1.checkShieldHit(obj2)) {
            obj1.shieldHealth--;
            this.remove(obj2);
            console.log("shield");
          }
        }

        if (obj1.isCollidedWith(obj2)) {

          // if(obj1 instanceof Bullet && !(obj2 instanceof Bullet)) {
          //   this.remove(obj1);
          // }
          // if(obj2 instanceof Bullet && !(obj1 instanceof Bullet)) {
          //   this.remove(obj2);
          // }
          if(obj1 instanceof Player && obj2 instanceof Bullet
            && !(obj2 instanceof PortalGun)) {
            obj1.health--;
            this.remove(obj2);
            console.log(obj1.health);
            console.log("hit")
          } 
          // else if (obj2 instanceof Player && obj1 instanceof Bullet) {
          //   obj1.health--;
          //   this.remove(obj1);

          //   console.log(obj2.health);

          //   console.log("hit")
          // }
          // const collision = obj1.collideWith(obj2);
          // if (collision) return;
          
        }
      }
    }
  }

}

Game.BG_COLOR = "#000000";
// Game.DIM_X = 1000;
// Game.DIM_Y = 600;
Game.DIM_X = 5000;
Game.DIM_Y = 5000;

Game.VIEW_X = 1000;
Game.VIEW_Y = 600;

Game.FPS = 32;

export default Game;
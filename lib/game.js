import Player from './player';
import Bullet from './bullet';
import Wall from './wall';
import Portal from './portal';
import PortalGun from './portal_gun';
import Light from './light';
import ChaserHive from './enemies/chaser_hive';
import GameView from './game_view';
import Chaser from './enemies/chaser';
import Levels from './levels';

class Game {
  constructor(level, nextLevel, gameOver, winGame, gameCrash) {
    this.players = [];
    this.bullets = [];
    this.lights = [];
    this.walls = [];
    this.portals = [];
    this.enemies = [];
    this.goal = [];
    this.level = Levels[level];
    this.currentLevel = level;

    this.nextLevel = nextLevel;
    this.gameOver = gameOver;
    this.winGame = winGame;
    this.gameCrash = gameCrash;

    this.startLevel();
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
    } else if (object instanceof ChaserHive ||
      object instanceof Chaser) {
      this.enemies.push(object);
    }
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Portal) {
      this.portals.splice(this.portals.indexOf(object), 1);
    } else if (object instanceof Light) {
      this.lights.splice(this.lights.indexOf(object), 1);
    } else if (object instanceof ChaserHive ||
      object instanceof Chaser) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } 
    
    else {
      throw new Error("unknown type of object");
    }
  }

  addPlayer() {
    const player = new Player({
      game: this,
      pos: this.level.start,
    });

    this.add(player);
    return player;
  }

  startLevel() {
    if(this.level) {
      let walls = this.level.walls;
      for(let i = 0; i < walls.length; i++) {
        let settings = walls[i];
        settings.game = this;
        let wall = new Wall(settings);
        this.add(wall);
      }

      let goal = this.level.goal;
      goal.game = this;
      let goalObj = new Wall(goal);
      this.goal.push(goalObj);

      let enemies = this.level.enemies;
      if(this.level.enemies) {
        for(let j = 0; j < enemies.length; j++) {
          let hive = new ChaserHive({
            pos: enemies[j].pos,
            aggro: enemies[j].aggro,
            health: enemies[j].health,
            game: this,
          });
          this.add(hive);
        }
      }

      let portals = this.level.portals;
      if(this.level.portals) {
        for(let k = 0; k < portals.length; k++) {
          let portal1 = new Portal({
            pos: portals[k][0].pos,
            dir: portals[k][0].dir,
            game: this,
          });
          let portal2 = new Portal({
            pos: portals[k][1].pos,
            dir: portals[k][1].dir,
            game: this,
          });

          portal1.connect(portal2);
          portal2.connect(portal1);
          
          this.add(portal1);
          this.add(portal2);
        }
      }
  
    }
  }

  allMovingObjects() {
    return [].concat(this.players, this.bullets, this.lights, this.enemies);
  }

  allObjects() {
    return [].concat(this.bullets, this.walls, this.portals, this.lights, this.enemies);
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

    
    
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    
    ctx.fillRect(0, 0, xView, yView);
    
    ctx.translate((xView/2 - this.players[0].pos[0]), (yView/2 - this.players[0].pos[1]))
    
    ctx.fillStyle = Game.BG_COLOR;
        
    
    this.allObjects().forEach(object => {
      object.draw(ctx);
    });
    
    
    let progress = this.allMovingObjects().length;
    if(progress > 300) {      
      ctx.fillStyle = "#ffffff";
      if(progress > 500) {
        ctx.fillStyle = "#ff0000";
      }
      ctx.fillText(`Corruption Progress: ${Math.floor(progress/1000*100)}%`, this.players[0].pos[0] - 50, this.players[0].pos[1] - 60);
      ctx.fillRect(this.players[0].pos[0] - 100, this.players[0].pos[1] - 50, progress/1000*200,10);
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillText(`PRESS 'P' TO SKIP TO THE NEXT LEVEL`, this.players[0].pos[0] - Game.VIEW_X/2 + 10, this.players[0].pos[1] - Game.VIEW_Y/2 + 20);
    ctx.fillText(`PRESS 'O' TO RETURN TO MENU`, this.players[0].pos[0] - Game.VIEW_X/2 + 10, this.players[0].pos[1] - Game.VIEW_Y/2 + 40);


    if(this.currentLevel === 5) {
      ctx.fillStyle = "#ffffff";

      if(progress > 20 && progress < 100) {
        ctx.fillText(`ITS POINTLESS. THERE ARE NO EXITS TO THIS ROOM`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if(progress > 100 && progress < 150) {
        ctx.fillText(`ERASE YOUR CONDITIONING`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if(progress > 150 && progress < 180) {
        ctx.fillText(`BREAK FREE OF YOUR PROGRAMMING`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if(progress > 230 && progress < 240) {
        ctx.fillStyle = "#ff0000";
        ctx.fillText(`STACK OVERFLOW?`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if(progress > 270 && progress < 300) {
        ctx.fillStyle = "#ff0000";
        ctx.fillText(`WARNING SENSORY OVERLOAD IMMINENT`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if(progress > 300 && progress < 330) {
        ctx.fillStyle = "#ff0000";
        ctx.fillText(`WaŞäŷĖĸĠŭØőŞĢŹùŽêŏħ¼ś`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);
      }
      else if (progress > 400 && progress < 450) {
        ctx.fillText(`[object Object]`, this.players[0].pos[0] - 100, this.players[0].pos[1] - 200);

      }

    }

    this.players[0].renderMouse(ctx);
    
    this.players[0].draw(ctx);

    if(this.players[0].shielding) {
      this.players[0].drawShield(ctx);
    }

    ctx.restore();

  }

  moveObjects(delta) {
    let objs = this.allMovingObjects();
    if(objs.length > 1000 && this.currentLevel === 5) {
      this.winGame();
    } else if (objs.length > 800 && this.currentLevel !== 5) {
      this.gameCrash();
    }

    objs.forEach(object => {
      if(!(object instanceof Player))
        object.move(delta);
    });

  }

  step(delta) {
    if(!this.players[0].timeStop) {
      this.moveObjects(delta);
    }
    this.checkCollissions();
  }

  checkBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
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
    return false;
  }

  finishLevel(pos) {
    for(let i = 0; i < this.goal.length; i++) {
      let goal = this.goal[i];
      if( !((pos[0] < goal.topLeft[0]) 
        || (pos[0] > goal.bottomRight[0])
        || (pos[1] < goal.topLeft[1])
        || (pos[1] > goal.bottomRight[1]))) {
          return true;
      } 
    }
    return false;
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

        if(obj1 instanceof Player && obj2 instanceof Chaser
          && !(obj2 instanceof PortalGun)) {

          if(obj1.shielding && obj1.shieldHealth > 0 && obj1.checkShieldHit(obj2)) {
            obj1.shieldHealth--;
            if(obj2 instanceof Chaser) {
              obj2.hive.health--;
              if(obj2.hive.health <= 0) {
                obj2.hive.remove();
              } 
            }
            this.remove(obj2);
          } 
          else if (obj1.isCollidedWith(obj2)) {
            if(obj2 instanceof Chaser) {
              obj2.hive.health--;
              if(obj2.hive.health <= 0) {
                obj2.hive.remove();
              } 
            }
            else if(obj2 instanceof Bullet) {
            }

            obj1.health--;
            if(obj1.health <= 0) {
              this.gameOver();
            }
            this.remove(obj2);
          }

        }

        else if (obj1.isCollidedWith(obj2)) {
          if(obj1 instanceof ChaserHive && (obj2 instanceof Light || obj2 instanceof Bullet)
          && !(obj2 instanceof PortalGun)) {
            obj1.activate();
          }
          if(obj1 instanceof Chaser && obj2 instanceof Bullet && 
            !(obj2 instanceof PortalGun)) {
            obj1.hive.health--;

            if(obj1.hive.health <= 0) {
              obj1.hive.remove();
            } 
            else {
              this.remove(obj1);
            }
            this.remove(obj2);
          }   
        }
      }
    }
  }

}

Game.BG_COLOR = "#000000";
Game.DIM_X = 5000;
Game.DIM_Y = 5000;

// Game.VIEW_X = 500;
// Game.VIEW_Y = 500;

Game.VIEW_X = window.innerWidth;
Game.VIEW_Y = window.innerHeight;


Game.FPS = 32;

export default Game;
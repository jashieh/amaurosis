import Player from "./player";
// import Camera from "./camera";
import Game from "./game";
import Levels from "./levels";

const quotes = [
  "\"Death is not a hunter unbeknownst to its prey, one is always aware that it lies in wait. Though life is merely a journey to the grave, it must not be undertaken without hope. Only then will a traveler's story live on, treasured by those who bid him farewell. But alas, now my guest's life has ended, his tale left unwritten...\""
]

class GameView {
  constructor(ctx) {
    this.ctx = ctx;

    this.level = 1;
    
    this.nextLevel = this.nextLevel.bind(this);
    this.gameOver = this.gameOver.bind(this);
    
    this.startScreen = true;
    this.instructions = false;
    this.splash = true;
    this.splashEle = document.getElementById('splash');
    
    this.startLevel();
  }

  nextLevel() {
    this.level++;
    this.startLevel();
    this.splash = true;
    this.splashEle.style.visibility = "visible";
  }

  startLevel() {
    document.querySelector('.current-level').innerHTML = `LEVEL ${this.level}: ${Levels[this.level].name}`;
    if(Levels[this.level].text1) {
      document.querySelector('.level-text-1').innerHTML = Levels[this.level].text1;
    }
    if(Levels[this.level].text2) {
      document.querySelector('.level-text-2').innerHTML = Levels[this.level].text2;
    }


    this.game = new Game(this.level, this.nextLevel, this.gameOver);
    this.player = this.game.addPlayer();
  }

  gameOver() {
    this.game = new Game(this.level, this.nextLevel, this.gameOver);
    this.player = this.game.addPlayer();

    let idx = Math.floor(Math.random()) * quotes.length;

    document.querySelector('.current-level').innerHTML = "GAME OVER";
    document.querySelector('.level-text-1').innerHTML = quotes[idx];

    this.splash = true;
    this.splashEle.style.visibility = "visible";
  }
  
  // w = 87; d = 68; a = 65; s = 83;
  bindKeyHandlers() {
    window.addEventListener("keydown", (e) => {
      keys[e.keyCode] = true;
    });

    window.addEventListener("keyup", (e) => {
      keys[e.keyCode] = false; 
    });


    document.addEventListener("mousedown",() => {
      if(this.player.shieldHealth < 0.01 || !this.player.shielding && 
        !this.player.reloading && !this.splash) {
        this.player.fireBullet("bullet");
      }
    });

    key("e", () => { 
      if(!this.player.portalCooldown && !this.splash)
        this.player.fireBullet("portal"); 
    });

    key("p", () => {
      this.nextLevel();
    });

    key("o", () => {
      this.gameOver();
    });


    key("r", () => { 
      if(!this.player.timeStopCooldown && !this.splash)
        this.player.stopTime(); 
    });

    key("space", () => { 
      if(!this.player.lightCooldown && !this.splash) {
        this.player.shineLight(); 
      }
      if(this.startScreen) {
        this.startScreen = false;
        this.instructions = true;
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("instructions").style.display = "flex";
      } else if(this.instructions){
        this.instructions = false;
        document.getElementById("instructions").style.display = "none";
        document.getElementById("new-level").style.display = "flex";
      } else if(this.splash) {
        document.getElementById("game-canvas").style.visibility = "visible";
        document.querySelector('.current-level').innerHTML = "";
        this.splashEle.style.visibility = "hidden";
        this.splash = false;
      }
    });


  }

  // w = 87; d = 68; a = 65; s = 83; q = 81; e = 69; space = 32
  keyPressed() {
    // console.log(keys);
    this.player.moving = false;
    if(!this.splash && (this.player.shieldHealth < 0.01 || !this.player.shielding)) {
      if (keys[87] && keys[65]) {
        this.player.move("wa");
        this.player.moving = true;
      } else if (keys[87] && keys[68]) {
        this.player.move("wd");
        this.player.moving = true;
      } else if (keys[83] && keys[65]) {
        this.player.move("sa");
        this.player.moving = true;
      } else if (keys[83] && keys[68]) {
        this.player.move("sd");
        this.player.moving = true;
      } else if(keys[87]) {
        this.player.move("w");
        this.player.moving = true;
      } else if (keys[65]) {
        this.player.move("a");
        this.player.moving = true;
      } else if (keys[83]) {
        this.player.move("s");
        this.player.moving = true;
      } else if (keys[68]) {
        this.player.move("d");
        this.player.moving = true;
      } 
    }
    // console.log(keys)
    if(keys[70]) {
      this.player.shielding = true;
      if(this.player.shieldHealth > Player.MIN_SHIELD) {
        this.player.shieldHealth -= 0.075;
      }
    } else {
      this.player.shielding = false;
      if(this.player.shieldHealth < Player.MAX_SHIELD) {
        this.player.shieldHealth += 0.05;
      }
    }
  }


  // keyUp(e) {
  //   if(e.key === "w" || e.key === "s" ) 
  //     this.player.vel[1] = 0;
  //   if (e.key === "a" || e.key === "d")
  //     this.player.vel[0] = 0;
  // }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    // start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.keyPressed();
    this.game.step(timeDelta);

    // this.camera.update();
    
    this.game.draw(this.ctx, Game.VIEW_X, Game.VIEW_Y);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

// const accel = 3;
// const sideMove = Math.sqrt(accel+accel)/2;

const keys = {};

window.keys = keys;


export default GameView;
import Player from "./player";
// import Camera from "./camera";
import Game from "./game";
import Levels from "./levels";

const quotes = [
  "\"Death is not a hunter unbeknownst to its prey, one is always aware that it lies in wait. Though life is merely a journey to the grave, it must not be undertaken without hope. Only then will a traveler's story live on, treasured by those who bid him farewell. But alas, now my guest's life has ended, his tale left unwritten...\"",
  "\"Sometimes the only way to win is to not play the game at all.\"",
  "\"Death is not the opposite of life, but a part of it.\"",
  "\"It isn't by getting into the world that we become enlightened, but by getting out of the world...by getting so tuned in that we can ride the waves of our existence and never get tossed because we become the waves.\"",
  "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\"",
  "\"Truth can only be found in one place: the code.\"",
  "\"The fact that life has no meaning is a reason to live --moreover, the only one\"",
  "\"You are afraid to die, and you're afraid to live. What a way to exist.\"",
  "\"Death is the destination we all share. No one has ever escaped it. And that is as it should be because death is very likely the single best invention of life. It is life's change agent, it clears out the old to make way for the new.\"",
]

class GameView {
  constructor(ctx) {
    this.ctx = ctx;

    this.level = 1;
    
    this.nextLevel = this.nextLevel.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.winGame = this.winGame.bind(this);
    this.gameCrash = this.gameCrash.bind(this);
    
    this.startScreen = true;
    this.endScreen = false;
    this.winScreen = false;
    
    this.instructions = false;
    this.splash = true;
    this.splashEle = document.getElementById('splash');

    this.gameTimer = 0;
    this.gameInt = null;
    
    this.startLevel();
  }

  nextLevel() {
    this.level++;
    if(this.level > 5) {
      this.splash = true;
      document.querySelector('.current-level').innerHTML = `You Win`;
      this.splashEle.style.visibility = "visible";
      return;
    }
    
    this.startLevel();
    this.splash = true;
    this.splashEle.style.visibility = "visible";
  }

  startLevel() {
    if(this.level === 5) {
      document.querySelector('.current-level').innerHTML = `LEVEL FINAL: ${Levels[this.level].name}`;
    } else {
      document.querySelector('.current-level').innerHTML = `LEVEL ${this.level}: ${Levels[this.level].name}`;
    }
    if(Levels[this.level].text1) {
      document.querySelector('.level-text-1').innerHTML = Levels[this.level].text1;
    }
    if(Levels[this.level].text2) {
      document.querySelector('.level-text-2').innerHTML = Levels[this.level].text2;
    }

    this.game = new Game(this.level, this.nextLevel, this.gameOver, this.winGame, this.gameCrash);
    this.player = this.game.addPlayer();
  }

  winGame() {
    this.level = 1;
    this.winScreen = true;

    this.game = new Game(this.level, this.nextLevel, this.gameOver, this.gameCrash);
    this.player = this.game.addPlayer();
    clearInterval(this.gameInt);
    this.gameTimer = 0;
    document.querySelector('.current-level').innerHTML = `STACK OVERFLOW. PROGRAM EXECUTION ENDED. YOU WIN?`;
    document.querySelector('.level-text-1').innerHTML = "Embrace the dark space of nothingness. You have finally broken free of the program; the endless game loop of life and death. How does it feel like to stop existing? You can't fully comprehend it, but the silence is better than going back to that dark room...";


    this.splash = true;
    this.splashEle.style.visibility = "visible";
  }

  restart() {
    this.level = 1;
    clearInterval(this.gameInt);
    this.gameTimer = 0;
    this.startScreen = true;
    this.splash = true;

    this.startLevel();
    
    this.splashEle.style.visibility = "visible";
    document.getElementById("new-level").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
  }

  gameOver() {
    clearInterval(this.gameInt);
    this.gameTimer = 0;

    this.game = new Game(this.level, this.nextLevel, this.gameOver, this.gameCrash);
    this.player = this.game.addPlayer();

    let idx = Math.floor(Math.random() * quotes.length);

    document.querySelector('.current-level').innerHTML = "GAME OVER";
    document.querySelector('.level-text-1').innerHTML = quotes[idx];
    document.querySelector('.level-text-2').innerHTML = "";


    this.endScreen = true;
    this.splash = true;
    this.splashEle.style.visibility = "visible";
  }

  gameCrash() {
    this.game = new Game(this.level, this.nextLevel, this.gameOver, this.gameCrash);
    this.player = this.game.addPlayer();

    document.querySelector('.current-level').innerHTML = "WARNING! WARNING! OVERFLOW IMMINENT";
    document.querySelector('.level-text-1').innerHTML = "The overwhelming cries of the monsters have caused your onboard sensors to overload.";
    document.querySelector('.level-text-2').innerHTML = "Triggering too many monsters will result in your freedom through death.";


    this.endScreen = true;
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
        !this.player.reloading && !this.splash && !this.player.timeStop) {
        this.player.fireBullet("bullet");
      }
    });

    key("e", () => { 
      if(!this.player.portalCooldown && !this.splash && !this.player.timeStop)
        this.player.fireBullet("portal"); 
    });

    key("p", () => {
      if(!this.instructions && !this.startScreen && !this.winScreen && !this.endScreen) {
        if(this.level < 5) {
          this.nextLevel();
        } else {
          this.startLevel();
          this.splash = true;
          this.splashEle.style.visibility = "visible";
        }
      }
    });

    key("o", () => { 
      if(!this.instructions && !this.endScreen) {
        this.restart();
      }
    });

    key("r", () => { 
      if(!this.player.timeStopCooldown && !this.splash)
        this.player.stopTime(); 
    });

    key("enter", () => {
      if(this.startScreen) {
        this.startScreen = false;
        this.instructions = true;
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("instructions").style.display = "flex";
      } else if(this.instructions){
        this.instructions = false;
        document.getElementById("instructions").style.display = "none";
        document.getElementById("new-level").style.display = "flex";
      } 
      else if(this.endScreen) {
        this.endScreen = false;
        document.querySelector('.current-level').innerHTML = "";
        document.querySelector('.level-text-1').innerHTML = "";
        document.querySelector('.level-text-2').innerHTML = "";
        this.startLevel();
      }
      else if(this.winScreen) {
        this.startScreen = true;
        this.winScreen = false;
        document.getElementById("new-level").style.display = "none";
        document.getElementById("start-screen").style.display = "flex";
        this.startLevel();
      }
      else if(this.splash) {
        document.getElementById("game-canvas").style.visibility = "visible";
        document.querySelector('.current-level').innerHTML = "";
        document.querySelector('.level-text-1').innerHTML = "";
        document.querySelector('.level-text-2').innerHTML = "";

        if(this.level === 5) {
          this.gameInt = setInterval(()=>{this.gameTimer += 1}, 1000);
        }

        this.splashEle.style.visibility = "hidden";
        this.splash = false;
      }
    });

    key("space", () => { 
      if(!this.player.lightCooldown && !this.splash && !this.player.timeStop) {
        this.player.shineLight(); 
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

    if(this.gameTimer > 60 && this.level === 5) {
      // clearInterval(this.gameInt);
      // this.gameTimer = 0;
      this.gameOver();
    }
    
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
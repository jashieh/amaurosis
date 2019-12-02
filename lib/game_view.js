import Player from "./player";
import Camera from "./camera";
import Game from "./game";

class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();

    const vWidth = 1000;
    const vHeight = 600;
      // this.camera = new Camera(0, 0, vWidth, vHeight, 5000, 5000);

      // this.camera.follow(this.player, vWidth / 2, vHeight / 2);

    this.keyUp = this.keyUp.bind(this);
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
        !this.player.reloading) {
        this.player.fireBullet("bullet");
      }
    });

    key("e", () => { 
      if(!this.player.portalCooldown)
        this.player.fireBullet("portal"); 
    });

    key("f", () => { 
      if(!this.player.lightCooldown) {
        this.player.shineLight(); 
      }
    });


    // Object.keys(GameView.MOVES).forEach((k) => {
    //   const move = GameView.MOVES[k];

    //   key(k, () => { this.player.power(move); });


    //   document.addEventListener("keyup", this.keyUp);
    // });
  }

  // w = 87; d = 68; a = 65; s = 83; q = 81; e = 69; space = 32
  keyPressed() {
    // console.log(keys);
    this.player.moving = false;
    if(this.player.shieldHealth < 0.01 || !this.player.shielding) {
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

    if(keys[32]) {
      this.player.shielding = true;
      if(this.player.shieldHealth > Player.MIN_SHIELD) {
        this.player.shieldHealth -= 0.02;
      }
    } else {
      this.player.shielding = false;
      if(this.player.shieldHealth < Player.MAX_SHIELD) {
        this.player.shieldHealth += 0.01;
      }
    }
  }


  keyUp(e) {
    if(e.key === "w" || e.key === "s" ) 
      this.player.vel[1] = 0;
    if (e.key === "a" || e.key === "d")
      this.player.vel[0] = 0;
  }

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
    
    this.game.draw(this.ctx, 1000, 600);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

const accel = 3;
const sideMove = Math.sqrt(accel+accel)/2;

const keys = {};

window.keys = keys;


export default GameView;
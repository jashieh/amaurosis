class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();

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
      this.player.fireBullet();
    });

    // Object.keys(GameView.MOVES).forEach((k) => {
    //   const move = GameView.MOVES[k];

    //   key(k, () => { this.player.power(move); });


    //   document.addEventListener("keyup", this.keyUp);
    // });
  }

  // w = 87; d = 68; a = 65; s = 83;
  keyPressed() {
    if (keys[87] && keys[65]) {
      this.player.move("wa");
    } else if (keys[87] && keys[68]) {
      this.player.move("wd");
    } else if (keys[83] && keys[65]) {
      this.player.move("sa");
    } else if (keys[83] && keys[68]) {
      this.player.move("sd");
    } else if(keys[87]) {
      this.player.move("w");
    } else if (keys[65]) {
      this.player.move("a");
    } else if (keys[83]) {
      this.player.move("s");
    } else if (keys[68]) {
      this.player.move("d");
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
    this.game.draw(this.ctx);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

const accel = 3;
const sideMove = Math.sqrt(accel+accel)/2;

const keys = {};

GameView.MOVES = {
  w: [0, -accel],
  a: [-accel, 0],
  s: [0, accel],
  d: [accel, 0],
  wa: []
};

export default GameView;
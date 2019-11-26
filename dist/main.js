/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/bullet.js":
/*!***********************!*\
  !*** ./lib/bullet.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moving_object */ "./lib/moving_object.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./lib/game.js");



class Bullet extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options);
    this.bounceCount = 0;
    this.type = "";
  }

  bounce(direction) {
    if(direction === "horizontal") {
      this.vel[1] *= -1;
    } else if (direction === "vertical") {
      this.vel[0] *= -1;
    } else {
      this.vel[0] *= -1;
      this.vel[1] *= -1;
    }
    this.bounceCount++;
  }



  move(timeDelta) {
    const NORMAL_FRAME_TIME_DELTA = 1000 / _game__WEBPACK_IMPORTED_MODULE_1__["default"].FPS,
      velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    const newX = this.pos[0] + offsetX;
    const newY = this.pos[1] + offsetY;

    const collisionX = this.game.wallCollision([this.pos[0], newY]);
    const collisionY = this.game.wallCollision([newX, this.pos[1]]);
    const collisionXY = this.game.wallCollision([newX, newY]);

    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
      this.pos[1] + (this.vel[1] * velocityScale)];
  }
}

Bullet.RADIUS = 2;
Bullet.SPEED = 10;
Bullet.LIFESPAN = 5;

/* harmony default export */ __webpack_exports__["default"] = (Bullet);

/***/ }),

/***/ "./lib/game.js":
/*!*********************!*\
  !*** ./lib/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./lib/player.js");
/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bullet */ "./lib/bullet.js");
/* harmony import */ var _wall__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wall */ "./lib/wall.js");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./portal */ "./lib/portal.js");





class Game {
  constructor() {
    this.players = [];
    this.bullets = [];
    this.walls = [];
    this.portals = [];

    this.addWall();
  }
  

  add(object) {
    if(object instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      this.players.push(object);
    } else if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.bullets.push(object);
    } else if (object instanceof _wall__WEBPACK_IMPORTED_MODULE_2__["default"]) {
      this.walls.push(object);
    } else if (object instanceof _portal__WEBPACK_IMPORTED_MODULE_3__["default"]) {
      this.portals.push(object);
    }
  }

  remove(object) {
    if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else {
      throw new Error("unknown type of object");
    }
  }

  addPlayer() {
    const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]({
      game: this,
      pos: [400,400]
    });

    this.add(player);
    return player;
  }

  addWall() {
    let wall = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [0,0],
      bottomRight: [100,100],
      direction: "vertical",
      game: this
    });
    this.add(wall);
    let wall2 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [100,100],
      bottomRight: [300,300],
      direction: "vertical",
      game: this
    });
    this.add(wall2);
    let portal = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
      topLeft: [250,250],
      bottomRight: [310,310],
      direction: "horizontal",
      game: this,
      dir: "right"
    });

    let portal2 = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
      topLeft: [100,100],
      bottomRight: [150,150],
      direction: "horizontal",
      game: this,
      connectedTo: portal,
      dir: "up"
    });

    portal.connect(portal2);


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
      if(!(object instanceof _wall__WEBPACK_IMPORTED_MODULE_2__["default"] || object instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"]))
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

      if(this.bullets[i].bounceCount > _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].LIFESPAN) {
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
          if(obj1 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            this.remove(obj1);
            console.log("collision")

          }
          if(obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            console.log("collision")
            this.remove(obj2);
          }

          if(obj1 instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"] && obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            console.log("hit")
          } else if (obj2 instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"] && obj1 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            console.log("hit")
          }
          // const collision = obj1.collideWith(obj2);
          // if (collision) return;
          
        }
      }
    }
  }

  remove(object) {
    if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
  }

}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./lib/game_view.js":
/*!**************************!*\
  !*** ./lib/game_view.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (GameView);

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./lib/game.js");
/* harmony import */ var _game_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game_view */ "./lib/game_view.js");
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./moving_object */ "./lib/moving_object.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./player */ "./lib/player.js");






document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  canvasEl.width = _game__WEBPACK_IMPORTED_MODULE_0__["default"].DIM_X;
  canvasEl.height = _game__WEBPACK_IMPORTED_MODULE_0__["default"].DIM_Y;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();
  const game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"]();

  window.game = game;

  new _game_view__WEBPACK_IMPORTED_MODULE_1__["default"](game, ctx).start();

});




/***/ }),

/***/ "./lib/moving_object.js":
/*!******************************!*\
  !*** ./lib/moving_object.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./lib/game.js");



class MovingObject {
  constructor(options) {
    this.pos = options.pos || [100,100];
    this.vel = options.vel || [0,0];
    this.radius = options.radius || 10;
    this.game = options.game;
    this.color = options.color || "#00FF00";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  move(timeDelta) {
    const NORMAL_FRAME_TIME_DELTA = 1000 / _game__WEBPACK_IMPORTED_MODULE_1__["default"].FPS,
      velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  }

  isCollidedWith(otherObject) {
    const centerDist = _util__WEBPACK_IMPORTED_MODULE_0___default.a.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  };

  remove() {
    this.game.remove(this);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (MovingObject);

/***/ }),

/***/ "./lib/player.js":
/*!***********************!*\
  !*** ./lib/player.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moving_object */ "./lib/moving_object.js");
/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bullet */ "./lib/bullet.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_2__);




const maxSpeed = 3;
const radius = 10;
class Player extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;


    this.updateCursorPostion();
    this.cursorPostion = [0,0];
  }

  power(delta) {
    if(this.vel[0] > -maxSpeed && this.vel[0] < maxSpeed) {
      this.vel[0] += delta[0];
    }

    if(this.vel[1] > -maxSpeed && this.vel[1] < maxSpeed) {
      this.vel[1] += delta[1];
    }
  }

  move(dir) {
    const newX = this.pos[0] + Player.MOVES[dir][0] * Player.SPEED;
    const newY = this.pos[1] + Player.MOVES[dir][1] * Player.SPEED;

    const pi = Math.PI;
    const radX = Math.cos(45*pi/180)*this.radius;
    const radY = Math.sin(45*pi/180)*this.radius;

    const topLeft = [newX - radX, newY - radY];
    const botLeft = [newX - radX, newY + radY];
    const topRight = [newX + radX, newY - radY];
    const botRight = [newX + radX, newY + radY];

    if(this.game.portalCollision([this.pos[0], newY]))
      return this.game.portalCollision([this.pos[0], newY]).teleport(this);
    else if(this.game.portalCollision(botLeft))
      return this.game.portalCollision(botLeft).teleport(this);
    else if(this.game.portalCollision(topRight))
      return this.game.portalCollision(topRight).teleport(this);
    else if(this.game.portalCollision(botRight))
      return this.game.portalCollision(botRight).teleport(this);

    

    if(this.game.wallCollision(topLeft)
      || this.game.wallCollision(botLeft)
      || this.game.wallCollision(topRight)
      || this.game.wallCollision(botRight)) {
      return;
    }

    this.pos = [newX, newY];
  }

  mouseAngle() {
    let vect = _util__WEBPACK_IMPORTED_MODULE_2___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let x = vect[0];
    let y = vect[1];

    return Math.atan2(y,x);
  }

  renderMouse(ctx) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.cursorPostion[0], this.cursorPostion[1]);
    ctx.stroke();
  }


  fireBullet() {
    let angle = this.mouseAngle();
    let relVel = _util__WEBPACK_IMPORTED_MODULE_2___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let pos = this.pos.slice();

    const pi = Math.PI;
    const radX = Math.cos(angle)*this.radius;
    const radY = Math.sin(angle)*this.radius;
    pos[0] += radX;
    pos[1] += radY;


    relVel[0] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;
    relVel[1] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;
    const bullet = new _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]({
      pos: pos,
      vel: relVel,
      game: this.game
    });

    this.game.add(bullet);
  }

  createPortal() {

  }

  shield() {

  }

  updateCursorPostion() {
    window.addEventListener('mousemove', (e) => {
      this.cursorPostion[0] = e.clientX;
      this.cursorPostion[1] = e.clientY;
    });
  }

}

const sideMove = Math.sqrt(2)/2;

Player.SPEED = 3;
Player.MOVES = {
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
  wa: [-sideMove, -sideMove],
  wd: [sideMove, -sideMove],
  sa: [-sideMove, sideMove],
  sd: [sideMove, sideMove],  
}

/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),

/***/ "./lib/portal.js":
/*!***********************!*\
  !*** ./lib/portal.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _static_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./static_object */ "./lib/static_object.js");


class Portal extends _static_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.passable = true;
    this.color = "#00FF00";
    this.connectedTo = options.connectedTo;
    this.pos = options.bottomRight;
    this.dir = options.dir;
  }

  teleport(player) {
    if(this.connectedTo.dir === "up") {
      player.pos[0] = this.connectedTo.pos[0];
      player.pos[1] = this.connectedTo.pos[1] - Portal.OFFSET;
    }
    else if(this.connectedTo.dir === "down") {
      player.pos[0] = this.connectedTo.pos[0];
      player.pos[1] = this.connectedTo.pos[1] + Portal.OFFSET;
    }
    else if(this.connectedTo.dir === "left") {
      player.pos[0] = this.connectedTo.pos[0] - Portal.OFFSET;
      player.pos[1] = this.connectedTo.pos[1];
    }

    else if(this.connectedTo.dir === "right") {
      player.pos[0] = this.connectedTo.pos[0] + Portal.OFFSET;
      player.pos[1] = this.connectedTo.pos[1];
    }

  }

  connect(otherPortal) {
    this.connectedTo = otherPortal;
  }

}

Portal.OFFSET = 20;

/* harmony default export */ __webpack_exports__["default"] = (Portal);

/***/ }),

/***/ "./lib/static_object.js":
/*!******************************!*\
  !*** ./lib/static_object.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class StaticObject {

  constructor(options) {
    // this.startPos = options.startPos;
    // this.endPos = options.endPos;
    // this.length = options.length;

    this.topLeft = options.topLeft;
    this.bottomRight = options.bottomRight;
    this.direction = options.direction;
    this.width = this.bottomRight[0] - this.topLeft[0];
    this.height = this.bottomRight[1] - this.topLeft[1];
    this.color =  options.color || "#0000ff";
    this.game = options.game;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.topLeft[0], this.topLeft[1], this.width, this.height);
  }

  collideWith(otherObj) {
    
  }


} 

/* harmony default export */ __webpack_exports__["default"] = (StaticObject);

/***/ }),

/***/ "./lib/util.js":
/*!*********************!*\
  !*** ./lib/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

const Util = {
  // Normalize the length of the vector to 1, maintaining direction.
  dir(vec) {
    const norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },
  // Find distance between two points.
  dist(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },
  // Find the length of the vector.
  norm(vec) {
    return Util.dist([0, 0], vec);
  },
  // Return a randomly oriented vector with the given length.
  randomVec(length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Util;


/***/ }),

/***/ "./lib/wall.js":
/*!*********************!*\
  !*** ./lib/wall.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _static_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./static_object */ "./lib/static_object.js");


class Wall extends _static_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.passable = false;
  }

  // draw(ctx) {
  //   ctx.lineWidth = this.width;
  //   ctx.strokeStyle = this.color;
  //   ctx.beginPath();
  //   ctx.moveTo(this.startPos[0], this.startPos[1]);
  //   ctx.lineTo(this.endPos[0], this.endPos[1]);
  //   ctx.stroke();
  // }

  collideWith(otherObj) {

  }


} 

/* harmony default export */ __webpack_exports__["default"] = (Wall);

/***/ })

/******/ });
//# sourceMappingURL=main.js.map
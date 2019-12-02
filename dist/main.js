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
    this.color = "#66ff00";
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
    if(this.bounceCount > Bullet.LIFESPAN) {
      this.remove();
    }
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


    if(this.game.portalCollision([this.pos[0], newY]))
      return this.game.portalCollision([this.pos[0], newY]).teleport(this, [this.pos[0], newY]);
    else if(this.game.portalCollision([newX, this.pos[1]]))
      return this.game.portalCollision([newX, this.pos[1]]).teleport(this, [newX, this.pos[1]]);

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

Bullet.RADIUS = 3;
Bullet.SPEED = 10;
Bullet.LIFESPAN = 5;

/* harmony default export */ __webpack_exports__["default"] = (Bullet);

/***/ }),

/***/ "./lib/camera.js":
/*!***********************!*\
  !*** ./lib/camera.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rectangle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rectangle */ "./lib/rectangle.js");


class Camera {
  constructor(xView, yView, viewportWidth, 
    viewportHeight, worldWidth, worldHeight) {
    
    this.xView = xView || 0;
	  this.yView = yView || 0;

	  this.xDeadZone = 0; 
	  this.yDeadZone = 0; 

	  this.wView = viewportWidth;
	  this.hView = viewportHeight;

	  this.axis = AXIS.BOTH;

    this.followed = null;
    this.viewportRect = new _rectangle__WEBPACK_IMPORTED_MODULE_0__["default"](this.xView, this.yView, 
      this.wView, this.hView);
    this.worldRect = new _rectangle__WEBPACK_IMPORTED_MODULE_0__["default"](0, 0, worldWidth, worldHeight);
  }

  follow(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }

  update() {
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        if (this.followed.pos[0] - this.xView + this.xDeadZone > this.wView)
          this.xView = this.followed.pos[0] - (this.wView - this.xDeadZone);
        else if (this.followed.pos[0] - this.xDeadZone < this.xView)
          this.xView = this.followed.pos[0] - this.xDeadZone;

      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        if (this.followed.pos[1] - this.yView + this.yDeadZone > this.hView)
          this.yView = this.followed.pos[1] - (this.hView - this.yDeadZone);
        else if (this.followed.pos[1] - this.yDeadZone < this.yView)
          this.yView = this.followed.pos[1] - this.yDeadZone;
      }

    }

    this.viewportRect.set(this.xView, this.yView);

    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.left < this.worldRect.left)
        this.xView = this.worldRect.left;
      if (this.viewportRect.top < this.worldRect.top)
        this.yView = this.worldRect.top;
      if (this.viewportRect.right > this.worldRect.right)
        this.xView = this.worldRect.right - this.wView;
      if (this.viewportRect.bottom > this.worldRect.bottom)
        this.yView = this.worldRect.bottom - this.hView;
    }
  }

}

const AXIS = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3,
  BOTH: 4 
};

/* harmony default export */ __webpack_exports__["default"] = (Camera);

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
/* harmony import */ var _portal_gun__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./portal_gun */ "./lib/portal_gun.js");
/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./light */ "./lib/light.js");







class Game {
  constructor() {
    this.players = [];
    this.bullets = [];
    this.lights = [];
    this.walls = [];
    this.portals = [];

    // this.addWall();
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
    } else if (object instanceof _light__WEBPACK_IMPORTED_MODULE_5__["default"]) {
      this.lights.push(object);
    }
  }

  remove(object) {
    if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof _portal__WEBPACK_IMPORTED_MODULE_3__["default"]) {
      this.portals.splice(this.portals.indexOf(object), 1);
    } else if (object instanceof _light__WEBPACK_IMPORTED_MODULE_5__["default"]) {
      this.lights.splice(this.lights.indexOf(object), 1);
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

    let wall2 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [100,100],
      bottomRight: [300,300],
      direction: "vertical",
      game: this
    });

    let wall3 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [0,0],
      bottomRight: [1000,5],
      direction: "vertical",
      game: this
    });
    let wall4 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [0,0],
      bottomRight: [5,600],
      direction: "vertical",
      game: this
    });
    let wall5 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [0,595],
      bottomRight: [1000,600],
      direction: "vertical",
      game: this
    });
    let wall6 = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"]({
      topLeft: [995,0],
      bottomRight: [1000,600],
      direction: "vertical",
      game: this
    });


    this.add(wall);
    this.add(wall2);
    this.add(wall3);
    this.add(wall4);
    this.add(wall5);
    this.add(wall6);

    let portal = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
      pos: [275, 300],
      direction: "horizontal",
      game: this,
      dir: "down"
    });

    let portal2 = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
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
    return [].concat(this.players, this.bullets, this.walls, this.portals, this.lights);
  }

  draw(ctx, xView, yView) {
    if(this.players[0].portals.length === 2) {
      this.players[0].connectPortals();
    } else if(this.players[0].portals.length > 2) {
      this.players[0].removePortals();
    }

    // this.checkBounce();

    let sx, sy, dx, dy;
	  let sWidth, sHeight, dWidth, dHeight;

	  // offset point to crop the image
	  sx = xView;
	  sy = yView;
    
    this.wallCollision(this.players[0].pos);
    // ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    ctx.clearRect(0, 0, xView, yView);

    ctx.fillStyle = Game.BG_COLOR;
    
    // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillRect(0, 0, xView, yView);
    
    this.allObjects().forEach(object => {
      object.draw(ctx, xView, yView);
    });

    if(this.players[0].shielding) {
      this.players[0].drawShield(ctx);
    }
    
    this.players[0].renderMouse(ctx);
  }

  moveObjects(delta) {
    this.allMovingObjects().forEach(object => {
      if(!(object instanceof _wall__WEBPACK_IMPORTED_MODULE_2__["default"] || object instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"]))
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

        if(obj1 instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"] && obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]
          && !(obj2 instanceof _portal_gun__WEBPACK_IMPORTED_MODULE_4__["default"])) {

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
          if(obj1 instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"] && obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]
            && !(obj2 instanceof _portal_gun__WEBPACK_IMPORTED_MODULE_4__["default"])) {
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
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./lib/player.js");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./camera */ "./lib/camera.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game */ "./lib/game.js");




class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.player = this.game.addPlayer();

    const vWidth = 1000;
    const vHeight = 600;
    this.camera = new _camera__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0, vWidth, vHeight, 5000, 5000);

    this.camera.follow(this.player, vWidth / 2, vHeight / 2);

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
    if(this.player.shieldHealth < 0.01 || !this.player.shielding) {
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

    if(keys[32]) {
      this.player.shielding = true;
      if(this.player.shieldHealth > _player__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_SHIELD) {
        this.player.shieldHealth -= 0.02;
      }
    } else {
      this.player.shielding = false;
      if(this.player.shieldHealth < _player__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_SHIELD) {
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

    this.camera.update();
    
    this.game.draw(this.ctx, 1000, 600);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

const accel = 3;
const sideMove = Math.sqrt(accel+accel)/2;

const keys = {};


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




document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  // canvasEl.width = Game.DIM_X;
  // canvasEl.height = Game.DIM_Y;

  canvasEl.width = 1000;
  canvasEl.height = 600;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();
  const game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"]();

  window.game = game;

  new _game_view__WEBPACK_IMPORTED_MODULE_1__["default"](game, ctx).start();

});




/***/ }),

/***/ "./lib/light.js":
/*!**********************!*\
  !*** ./lib/light.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./moving_object */ "./lib/moving_object.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./lib/game.js");




class Light extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    options.radius = 1;
    super(options);
    // this.bounceCount = 0;
    this.color = "#ffffff";
    this.trail = [this.pos];

    this.maxLength = Light.MAX;
    this.i = 0;
    this.lifespan = options.lifespan || Math.random(100);
  }

  drawTail() {

  }
  
  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );

    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1,  "#222");

    
    ctx.lineWidth = 1;
    ctx.strokeStyle = gradient;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke();
    
    // ctx.fillStyle = this.color;
    // ctx.arc(
    //   this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    // );
    // ctx.fill();
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
    
    // if(this.bounceCount > Light.LIFESPAN) {
    //   this.remove();
    // }
    // this.bounceCount++;

    const reflection = new Light({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
      lifespan: this.lifespan
    });

    this.game.add(reflection);
    this.vel = [0, 0];

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


    // if(this.game.portalCollision([this.pos[0], newY]))
    //   return this.game.portalCollision([this.pos[0], newY]).teleport(this, [this.pos[0], newY]);
    // else if(this.game.portalCollision([newX, this.pos[1]]))
    //   return this.game.portalCollision([newX, this.pos[1]]).teleport(this, [newX, this.pos[1]]);

    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.lifespan++;

    if(this.lifespan > Light.LIFESPAN) {
      this.remove();
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
    this.pos[1] + (this.vel[1] * velocityScale)];
    
    this.trail.push(this.pos);

    if(this.trail.length > Light.MAX) {
        this.trail.shift();
    }

    if(this.lifespan > Light.HALF_LIFE) {
      this.trail.shift();
      this.trail.shift();

    }  
  }
}

const cos15 = Math.cos((15/180) * Math.PI);
const sin15 = Math.sin((15/180) * Math.PI);

const cos30 = Math.sqrt(3)/2;
const sin30 = 1/2;


Light.LIFESPAN = 100;
Light.HALF_LIFE = 70;
Light.SPEED = 5;
Light.MAX = 40;

Light.DIRECTIONS = [
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

/* harmony default export */ __webpack_exports__["default"] = (Light);

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
    this.color = options.color || "#ffffff";
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
/* harmony import */ var _portal_gun__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./portal_gun */ "./lib/portal_gun.js");
/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./light */ "./lib/light.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_4__);






const maxSpeed = 3;
const radius = 8;

class Player extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;
    this.portals = [];
    this.health = Player.MAX_HEALTH;

    this.bullets = Player.MAX_BULLETS; 
    this.reloading = false;

    this.portalBullets = 0;
    this.lightCooldown = false;
    this.portalCooldown = false;
    this.shielding = false;
    this.shieldHealth = Player.MAX_SHIELD;
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

    if(this.portals.length === 2) {
      this.connectPortals();
    }

    if(this.game.portalCollision(topLeft))
      return this.game.portalCollision(topLeft).teleport(this, topLeft);
    else if(this.game.portalCollision(botLeft))
      return this.game.portalCollision(botLeft).teleport(this, botLeft);
    else if(this.game.portalCollision(topRight))
      return this.game.portalCollision(topRight).teleport(this, topRight);
    else if(this.game.portalCollision(botRight))
      return this.game.portalCollision(botRight).teleport(this, botRight);

    

    if(this.game.wallCollision(topLeft)
      || this.game.wallCollision(botLeft)
      || this.game.wallCollision(topRight)
      || this.game.wallCollision(botRight)) {
      return;
    }

    this.pos = [newX, newY];
  }

  mouseAngle() {
    let vect = _util__WEBPACK_IMPORTED_MODULE_4___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let x = vect[0];
    let y = vect[1];

    return Math.atan2(y,x);
  }

  renderMouse(ctx) {
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = "#ff0000";
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.cursorPostion[0], this.cursorPostion[1]);
    ctx.stroke();
  }


  fireBullet(type) {
    let angle = this.mouseAngle();
    let relVel = _util__WEBPACK_IMPORTED_MODULE_4___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let pos = this.pos.slice();

    const radX = Math.cos(angle)*this.radius;
    const radY = Math.sin(angle)*this.radius;
    pos[0] += radX;
    pos[1] += radY;


    relVel[0] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;
    relVel[1] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;

    if(type === "bullet") {
      const bullet = new _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: pos,
        vel: relVel,
        game: this.game
      });

      this.game.add(bullet);
      this.bullets--;
      console.log(`Ammo: ${this.bullets}`);

      if(this.bullets <= 0) {
        console.log('reloading...');
        this.reloading = true;
        this.bullets = Player.MAX_BULLETS;
        setTimeout(() => {
          this.reloading = false;
        }, 1500);
      }

    } else if (type === "portal") {
      const portalGun = new _portal_gun__WEBPACK_IMPORTED_MODULE_2__["default"]({
        pos: pos,
        vel: relVel,
        game: this.game,
        player: this
      });
      this.game.add(portalGun);
      this.portalBullets++;

      if(this.portalBullets === 2) {
        this.portalCooldown = true;
        this.portalBullets = 0;
        setTimeout(() => {
          this.portalCooldown = false;
        }, 5000);
      }

    }

  }

  connectPortals() {
    this.portals[0].connect(this.portals[1]);
    this.portals[1].connect(this.portals[0]);

  }

  removePortals() {
    this.portals[0].remove();
    this.portals[1].remove();
    this.portals.shift();
    this.portals.shift();

  }

  drawShield(ctx) {
    if(this.shieldHealth > 0) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#144b9f";
      ctx.setLineDash([5, 1]);
  
      ctx.beginPath();
      ctx.arc(
        this.pos[0], this.pos[1], this.radius + this.shieldHealth * Player.SHIELD_RADIUS, 
        0, 2 * Math.PI, true
      );
  
      ctx.stroke();
    }
  }

  checkShieldHit(otherObject) {
    const centerDist = _util__WEBPACK_IMPORTED_MODULE_4___default.a.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + this.shieldHealth * Player.SHIELD_RADIUS + 
      otherObject.radius);
  }

  shineLight() {
    for(let i = 0; i < _light__WEBPACK_IMPORTED_MODULE_3__["default"].DIRECTIONS.length; i++) {
      let relVel = _light__WEBPACK_IMPORTED_MODULE_3__["default"].DIRECTIONS[i].slice();
      relVel[0] *= _light__WEBPACK_IMPORTED_MODULE_3__["default"].SPEED;
      relVel[1] *= _light__WEBPACK_IMPORTED_MODULE_3__["default"].SPEED;

      let light = new _light__WEBPACK_IMPORTED_MODULE_3__["default"]({
        pos: this.pos,
        vel: relVel,
        game: this.game
      });

      this.game.add(light);
    }
    this.lightCooldown = true;
    setTimeout(() => {
      this.lightCooldown = false;
    }, 1000);
  }

  updateCursorPostion() {
    window.addEventListener('mousemove', (e) => {
      this.cursorPostion[0] = e.clientX;
      this.cursorPostion[1] = e.clientY;
    });
  }


  draw(ctx, xView, yView) {
    
    // ctx.save();
    ctx.fillStyle = this.color;

    ctx.beginPath();
    console.log(xView, yView)
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
    // ctx.restore();
  }

}

const sideMove = Math.sqrt(2)/2;

Player.MAX_BULLETS = 12;
Player.MAX_HEALTH = 3;
Player.MIN_SHIELD = 0;
Player.MAX_SHIELD = 3;
Player.SHIELD_RADIUS = 4;

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
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./lib/player.js");
/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bullet */ "./lib/bullet.js");
/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./light */ "./lib/light.js");





class Portal extends _static_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    switch(options.dir) {
      case "up":
        options.topLeft = [options.pos[0] - Portal.WIDTH, options.pos[1]];
        options.bottomRight = [options.pos[0] + Portal.WIDTH, options.pos[1] + Portal.HEIGHT];
        break;
      case "down":
        options.topLeft = [options.pos[0] - Portal.WIDTH, options.pos[1] - Portal.HEIGHT];
        options.bottomRight = [options.pos[0] + Portal.WIDTH, options.pos[1]];
        break;
      case "left":
        options.topLeft = [options.pos[0], options.pos[1] - Portal.WIDTH];
        options.bottomRight = [options.pos[0] + Portal.HEIGHT, options.pos[1] + Portal.WIDTH];
        break;
      case "right":
        options.topLeft = [options.pos[0] - Portal.HEIGHT, options.pos[1] - Portal.WIDTH];
        options.bottomRight = [options.pos[0], options.pos[1] + Portal.WIDTH];
        break;
    }

    super(options);
    this.active = true;
    this.color = options.color || "#00FF00";
    this.connectedTo = null;

    this.pos = options.pos;
    this.dir = options.dir;
  }

  teleport(object, pos) {
    if(this.connectedTo && this.active && (object instanceof _player__WEBPACK_IMPORTED_MODULE_1__["default"])) {
      this.toggleActive();
      this.connectedTo.toggleActive();

      // let offsetX = (this.pos[0] - pos[0]);
      // let offsetY = (this.pos[1] - pos[1]);
      let offsetX = 0;
      let offsetY = 0;
  
      if(this.connectedTo.dir === "up") {
        object.pos[0] = this.connectedTo.pos[0] + offsetX;
        object.pos[1] = this.connectedTo.pos[1] - Portal.OFFSET + offsetY;
      }
      else if(this.connectedTo.dir === "down") {
        object.pos[0] = this.connectedTo.pos[0] + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + Portal.OFFSET + offsetY;
      }
      else if(this.connectedTo.dir === "left") {
        object.pos[0] = this.connectedTo.pos[0] - Portal.OFFSET + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + offsetY;
      }
  
      else if(this.connectedTo.dir === "right") {
        object.pos[0] = this.connectedTo.pos[0] + Portal.OFFSET + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + offsetY;
      }
    } else if(this.connectedTo && (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_2__["default"] || object instanceof _light__WEBPACK_IMPORTED_MODULE_3__["default"])) {
      let offsetX = -(this.pos[0] - pos[0]);
      let offsetY = -(this.pos[1] - pos[1]);
  
      if(this.connectedTo.dir === "up") {
        object.pos[0] = this.connectedTo.pos[0] + offsetX;
        object.pos[1] = this.connectedTo.pos[1] - Portal.OFFSET + offsetY;

        if(this.dir === "up") {
          object.vel[1] = -object.vel[1];
        } else if(this.dir === "left") {
          let temp = object.vel[0];
          object.vel[0] = -object.vel[1];
          object.vel[1] = -temp;
        } else if(this.dir === "right") {
          let temp = object.vel[0];
          object.vel[0] = object.vel[1];
          object.vel[1] = temp;
        }
      }
      else if(this.connectedTo.dir === "down") {
        object.pos[0] = this.connectedTo.pos[0] + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + Portal.OFFSET + offsetY;

        if(this.dir === "down") {
          object.vel[1] = -object.vel[1];
        } else if(this.dir === "left") {
          let temp = object.vel[0];
          object.vel[0] = object.vel[1];
          object.vel[1] = temp;
        } else if(this.dir === "right") {
          let temp = object.vel[0];
          object.vel[0] = -object.vel[1];
          object.vel[1] = -temp;
        }
      }
      else if(this.connectedTo.dir === "left") {
        object.pos[0] = this.connectedTo.pos[0] - Portal.OFFSET + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + offsetY;

        if(this.dir === "left") {
          object.vel[0] = -object.vel[0];
        } else if(this.dir === "down") {
          let temp = object.vel[0];
          object.vel[0] = object.vel[1];
          object.vel[1] = temp;
        } else if(this.dir === "up") {
          let temp = object.vel[0];
          object.vel[0] = -object.vel[1];
          object.vel[1] = -temp;
        }
  
      }
  
      else if(this.connectedTo.dir === "right") {
        object.pos[0] = this.connectedTo.pos[0] + Portal.OFFSET + offsetX;
        object.pos[1] = this.connectedTo.pos[1] + offsetY;

        if(this.dir === "right") {
          object.vel[0] = -object.vel[0];
        } else if(this.dir === "down") {
          let temp = object.vel[0];
          object.vel[0] = -object.vel[1];
          object.vel[1] = temp;
        } else if(this.dir === "up") {
          let temp = object.vel[0];
          object.vel[0] = object.vel[1];
          object.vel[1] = -temp;
        }
      }
    }

  }

  connect(otherPortal) {
    this.connectedTo = otherPortal;
  }

  toggleActive() {
    let temp = this.connectedTo.color;
    this.connectedTo.active = false;
    this.connectedTo.color = "#ff0000";
    setTimeout(() => {
      this.connectedTo.active = true;
      this.connectedTo.color = temp;
    }, 500);
  }

}

Portal.OFFSET = 15;
Portal.WIDTH = 25;
Portal.HEIGHT = 5;

/* harmony default export */ __webpack_exports__["default"] = (Portal);

/***/ }),

/***/ "./lib/portal_gun.js":
/*!***************************!*\
  !*** ./lib/portal_gun.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bullet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bullet */ "./lib/bullet.js");
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./portal */ "./lib/portal.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game */ "./lib/game.js");




class PortalGun extends _bullet__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.player = options.player;

    this.color = "#800080";
  }

  move(timeDelta) {
    const NORMAL_FRAME_TIME_DELTA = 1000 / _game__WEBPACK_IMPORTED_MODULE_2__["default"].FPS,
      velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

    const newX = this.pos[0] + offsetX;
    const newY = this.pos[1] + offsetY;

    const collisionX = this.game.wallCollision([this.pos[0], newY]);
    const collisionY = this.game.wallCollision([newX, this.pos[1]]);


    let portal;
    let color;
    if(this.player.portals.length === 0 || this.player.portals.length === 2) 
      color = "#ffa500";
    else 
      color = "#99ccff";

    if(collisionX && offsetY < 0) {
      this.remove();
      portal = new _portal__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: [this.pos[0], newY + 5],
        color: color,
        game: this.game,
        dir: "down"
      });
      
      this.player.portals.push(portal);
      this.game.add(portal);
    } else if(collisionX && offsetY > 0) {

      this.remove();
      portal = new _portal__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: [newX, this.pos[1]],
        color: color,
        game: this.game,
        dir: "up"
      });

      this.player.portals.push(portal);
      this.game.add(portal);

    } else if (collisionY && offsetX > 0) {
      this.remove();
      portal = new _portal__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: [newX - 5, this.pos[1]],
        color: color,
        game: this.game,
        dir: "left"
      });

      this.player.portals.push(portal);
      this.game.add(portal);

    } else if (collisionY && offsetX < 0) {
      this.remove();
      portal = new _portal__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: [newX + 5, this.pos[1]],
        color: color,
        game: this.game,
        dir: "right"
      });

      this.player.portals.push(portal);
      this.game.add(portal);
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
      this.pos[1] + (this.vel[1] * velocityScale)];
  }
}

PortalGun.RADIUS = 5;
PortalGun.OFFSET = 5;


/* harmony default export */ __webpack_exports__["default"] = (PortalGun);

/***/ }),

/***/ "./lib/rectangle.js":
/*!**************************!*\
  !*** ./lib/rectangle.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class Rectangle {
 constructor(left, top, width, height) {
  this.left = left || 0;
  this.top = top || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
 }

 set(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width || this.width;
  this.height = height || this.height
  this.right = (this.left + this.width);
  this.bottom = (this.top + this.height); 
 }

 within(rect) {
  return (rect.left <= this.left &&
    rect.right >= this.right &&
    rect.top <= this.top &&
    rect.bottom >= this.bottom);
 }


}

/* harmony default export */ __webpack_exports__["default"] = (Rectangle);

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
    this.width = this.bottomRight[0] - this.topLeft[0];
    this.height = this.bottomRight[1] - this.topLeft[1];
    this.color =  options.color || "#000000";
    this.game = options.game;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.topLeft[0], this.topLeft[1], this.width, this.height);
  }


  remove() {
    this.game.remove(this);
  };



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


} 

/* harmony default export */ __webpack_exports__["default"] = (Wall);

/***/ })

/******/ });
//# sourceMappingURL=main.js.map
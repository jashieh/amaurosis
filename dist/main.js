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
    this.color = "#66ff00";
    this.type = "";
    
    this.bounceCount = options.bounceCount || 0;
    this.trail = [this.pos];
    this.tailColor = "#222";
    this.midColor = "#032cfc";
    this.headColor = "#8403fc";
  }

  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );


    gradient.addColorStop(0, this.headColor);
    gradient.addColorStop(0.5, this.midColor);
    gradient.addColorStop(1,  this.tailColor);

    
    ctx.lineWidth = this.radius;
    ctx.strokeStyle = gradient;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke(); 
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
    
    this.remove();
    if(this.bounceCount > Bullet.LIFESPAN) {
      return;
    }
    
    const reflection = new Bullet({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
      bounceCount: this.bounceCount
    });
    
    this.game.add(reflection);
    // this.vel = [0, 0];
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


    if(this.game.portalCollision([this.pos[0], newY])) {
      if(this.game.portalCollision([this.pos[0], newY]).connectedTo) {
        return this.game.portalCollision([this.pos[0], newY]).teleport(this, [this.pos[0], newY]);
      }
      else {
        return this.bounce("horizontal");
      }
    }

    else if(this.game.portalCollision([newX, this.pos[1]])) {
      if(this.game.portalCollision([newX, this.pos[1]]).connectedTo) {
        return this.game.portalCollision([newX, this.pos[1]]).teleport(this, [newX, this.pos[1]]);
      }
      else {
        return this.bounce("vertical");
      }
    }

    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
      this.pos[1] + (this.vel[1] * velocityScale)];
    this.trail.push(this.pos);

    if(this.trail.length > Bullet.MAX) {
      this.trail.shift();
    }
  }
}

Bullet.RADIUS = 3;
Bullet.SPEED = 10;
Bullet.LIFESPAN = 2;
Bullet.MAX = 15;

/* harmony default export */ __webpack_exports__["default"] = (Bullet);

/***/ }),

/***/ "./lib/enemies/chaser.js":
/*!*******************************!*\
  !*** ./lib/enemies/chaser.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enemy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enemy */ "./lib/enemies/enemy.js");
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../moving_object */ "./lib/moving_object.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../game */ "./lib/game.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_3__);






class Chaser extends _moving_object__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor(options) {
    options.radius = 10;
    super(options);

    this.color = "#ff0000";
    this.hive = options.hive;
    this.trail = [this.pos];
    this.maxLength = Chaser.MAX;
    this.lifespan = options.lifespan || 0;
  }

  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );

    if(this.lifespan > Chaser.HALF_LIFE) {
      gradient.addColorStop(0, "#ff0000");
    } 
    else if(this.lifespan > Chaser.HALF_LIFE * (3/2)) {
      gradient.addColorStop(0, "#ff0000");
    }
    else {
      gradient.addColorStop(0, "#ff0000");
    }

    gradient.addColorStop(1,  "#222");

    
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;
    // ctx.strokeStyle = this.color;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke(); 
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
    
    const reflection = new Chaser({
      pos: this.pos,
      vel: this.vel,
      game: this.game,
      hive: this.hive,
      lifespan: this.lifespan
    });

    this.game.add(reflection);
    this.vel = [0, 0];
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
    const collisionXY = this.game.wallCollision([newX, newY]);


    if(collisionX) {
      this.bounce("horizontal");
    } else if (collisionY) {
      this.bounce("vertical");
    } else if (collisionXY) {
      this.bounce("both");
    }

    this.lifespan++;

    if(this.lifespan > Chaser.LIFESPAN) {
      this.remove();
    }

    this.pos = [this.pos[0] + (this.vel[0] * velocityScale), 
    this.pos[1] + (this.vel[1] * velocityScale)];
    
    this.trail.push(this.pos);

    if(this.trail.length > Chaser.MAX) {
      this.trail.shift();
    }

    if(this.lifespan > Chaser.HALF_LIFE) {
      this.trail.shift();
      this.trail.shift();
    }  

  }

  isCollidedWith(otherObject) {
    const centerDist = _util__WEBPACK_IMPORTED_MODULE_3___default.a.dist(this.pos, otherObject.pos);
    let centerDist2;

    if (this.trail[this.trail.length/2]) {
      centerDist2 = _util__WEBPACK_IMPORTED_MODULE_3___default.a.dist(this.trail[0], otherObject.pos);
      const centerDist3 = _util__WEBPACK_IMPORTED_MODULE_3___default.a.dist(this.trail[this.trail.length/2], otherObject.pos);
      return centerDist < (this.radius + otherObject.radius) ||
      centerDist2 < (this.radius + otherObject.radius) ||
      centerDist3 < (this.radius + otherObject.radius);
    };

    if (this.trail[0]) {
      centerDist2 = _util__WEBPACK_IMPORTED_MODULE_3___default.a.dist(this.trail[0], otherObject.pos);
      return centerDist < (this.radius + otherObject.radius) ||
      centerDist2 < (this.radius + otherObject.radius);
    };


    return centerDist < (this.radius + otherObject.radius);
  };

}

Chaser.LIFESPAN = 100;
Chaser.HALF_LIFE = Chaser.LIFESPAN/2;
Chaser.MAX = 40;

/* harmony default export */ __webpack_exports__["default"] = (Chaser);

/***/ }),

/***/ "./lib/enemies/chaser_hive.js":
/*!************************************!*\
  !*** ./lib/enemies/chaser_hive.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../moving_object */ "./lib/moving_object.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chaser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chaser */ "./lib/enemies/chaser.js");




class ChaserHive extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
      if(options.aggro) {
        this.activate();
      }
    this.color = options.color || "#000000";
    this.aggro = options.aggro || false;
    this.player = options.player;
    this.health = options.health || 20;

    this.minions = [];

    this.alive = null;
  }

  releaseChasers() {
    let vect = _util__WEBPACK_IMPORTED_MODULE_1___default.a.dir([this.game.players[0].pos[0] - this.pos[0], 
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

      let chaser = new _chaser__WEBPACK_IMPORTED_MODULE_2__["default"]({
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
    return _util__WEBPACK_IMPORTED_MODULE_1___default.a.dir([x, y]);
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


/* harmony default export */ __webpack_exports__["default"] = (ChaserHive);

/***/ }),

/***/ "./lib/enemies/enemy.js":
/*!******************************!*\
  !*** ./lib/enemies/enemy.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _moving_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../moving_object */ "./lib/moving_object.js");


class Enemy extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    options.radius = 3;
    super(options);
    this.color = "#ffffff";
    this.aggro = options.aggro || false;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Enemy);



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
/* harmony import */ var _enemies_chaser_hive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./enemies/chaser_hive */ "./lib/enemies/chaser_hive.js");
/* harmony import */ var _game_view__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./game_view */ "./lib/game_view.js");
/* harmony import */ var _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./enemies/chaser */ "./lib/enemies/chaser.js");
/* harmony import */ var _levels__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./levels */ "./lib/levels.js");











class Game {
  constructor(level, nextLevel, gameOver, winGame, gameCrash) {
    this.players = [];
    this.bullets = [];
    this.lights = [];
    this.walls = [];
    this.portals = [];
    this.enemies = [];
    this.goal = [];
    this.level = _levels__WEBPACK_IMPORTED_MODULE_9__["default"][level];
    this.currentLevel = level;

    this.nextLevel = nextLevel;
    this.gameOver = gameOver;
    this.winGame = winGame;
    this.gameCrash = gameCrash;

    this.startLevel();
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
    } else if (object instanceof _enemies_chaser_hive__WEBPACK_IMPORTED_MODULE_6__["default"] ||
      object instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"]) {
      this.enemies.push(object);
    }
  }

  remove(object) {
    if (object instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof _portal__WEBPACK_IMPORTED_MODULE_3__["default"]) {
      this.portals.splice(this.portals.indexOf(object), 1);
    } else if (object instanceof _light__WEBPACK_IMPORTED_MODULE_5__["default"]) {
      this.lights.splice(this.lights.indexOf(object), 1);
    } else if (object instanceof _enemies_chaser_hive__WEBPACK_IMPORTED_MODULE_6__["default"] ||
      object instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"]) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } 
    
    else {
      throw new Error("unknown type of object");
    }
  }

  addPlayer() {
    const player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]({
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
        let wall = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"](settings);
        this.add(wall);
      }

      let goal = this.level.goal;
      goal.game = this;
      let goalObj = new _wall__WEBPACK_IMPORTED_MODULE_2__["default"](goal);
      this.goal.push(goalObj);

      let enemies = this.level.enemies;
      if(this.level.enemies) {
        for(let j = 0; j < enemies.length; j++) {
          let hive = new _enemies_chaser_hive__WEBPACK_IMPORTED_MODULE_6__["default"]({
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
          let portal1 = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
            pos: portals[k][0].pos,
            dir: portals[k][0].dir,
            game: this,
          });
          let portal2 = new _portal__WEBPACK_IMPORTED_MODULE_3__["default"]({
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
      if(!(object instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"]))
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

        if(obj1 instanceof _player__WEBPACK_IMPORTED_MODULE_0__["default"] && obj2 instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"]
          && !(obj2 instanceof _portal_gun__WEBPACK_IMPORTED_MODULE_4__["default"])) {

          if(obj1.shielding && obj1.shieldHealth > 0 && obj1.checkShieldHit(obj2)) {
            obj1.shieldHealth--;
            if(obj2 instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"]) {
              obj2.hive.health--;
              if(obj2.hive.health <= 0) {
                obj2.hive.remove();
              } 
            }
            this.remove(obj2);
          } 
          else if (obj1.isCollidedWith(obj2)) {
            if(obj2 instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"]) {
              obj2.hive.health--;
              if(obj2.hive.health <= 0) {
                obj2.hive.remove();
              } 
            }
            else if(obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            }

            obj1.health--;
            if(obj1.health <= 0) {
              this.gameOver();
            }
            this.remove(obj2);
          }

        }

        else if (obj1.isCollidedWith(obj2)) {
          if(obj1 instanceof _enemies_chaser_hive__WEBPACK_IMPORTED_MODULE_6__["default"] && (obj2 instanceof _light__WEBPACK_IMPORTED_MODULE_5__["default"] || obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"])
          && !(obj2 instanceof _portal_gun__WEBPACK_IMPORTED_MODULE_4__["default"])) {
            obj1.activate();
          }
          if(obj1 instanceof _enemies_chaser__WEBPACK_IMPORTED_MODULE_8__["default"] && obj2 instanceof _bullet__WEBPACK_IMPORTED_MODULE_1__["default"] && 
            !(obj2 instanceof _portal_gun__WEBPACK_IMPORTED_MODULE_4__["default"])) {
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
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./lib/game.js");
/* harmony import */ var _levels__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./levels */ "./lib/levels.js");

// import Camera from "./camera";



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
      document.querySelector('.current-level').innerHTML = `LEVEL FINAL: ${_levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].name}`;
    } else {
      document.querySelector('.current-level').innerHTML = `LEVEL ${this.level}: ${_levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].name}`;
    }
    if(_levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].text1) {
      document.querySelector('.level-text-1').innerHTML = _levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].text1;
    }
    if(_levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].text2) {
      document.querySelector('.level-text-2').innerHTML = _levels__WEBPACK_IMPORTED_MODULE_2__["default"][this.level].text2;
    }

    this.game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](this.level, this.nextLevel, this.gameOver, this.winGame, this.gameCrash);
    this.player = this.game.addPlayer();
  }

  winGame() {
    this.level = 1;
    this.winScreen = true;

    this.game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](this.level, this.nextLevel, this.gameOver, this.gameCrash);
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

    this.game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](this.level, this.nextLevel, this.gameOver, this.gameCrash);
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
    this.game = new _game__WEBPACK_IMPORTED_MODULE_1__["default"](this.level, this.nextLevel, this.gameOver, this.gameCrash);
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
      if(this.player.shieldHealth > _player__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_SHIELD) {
        this.player.shieldHealth -= 0.075;
      }
    } else {
      this.player.shielding = false;
      if(this.player.shieldHealth < _player__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_SHIELD) {
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
    
    this.game.draw(this.ctx, _game__WEBPACK_IMPORTED_MODULE_1__["default"].VIEW_X, _game__WEBPACK_IMPORTED_MODULE_1__["default"].VIEW_Y);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

// const accel = 3;
// const sideMove = Math.sqrt(accel+accel)/2;

const keys = {};

window.keys = keys;


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



let gameView;

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  // canvasEl.width = Game.DIM_X;
  // canvasEl.height = Game.DIM_Y;

  canvasEl.width = _game__WEBPACK_IMPORTED_MODULE_0__["default"].VIEW_X;
  canvasEl.height = _game__WEBPACK_IMPORTED_MODULE_0__["default"].VIEW_Y;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();

  window.game = new _game_view__WEBPACK_IMPORTED_MODULE_1__["default"](ctx).start();
});





/***/ }),

/***/ "./lib/levels.js":
/*!***********************!*\
  !*** ./lib/levels.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const levels = {
  1: {
    walls: [
      { topLeft: [0, 500],
        bottomRight: [50, 700],
      },
      { topLeft: [0,0],
        bottomRight: [500, 500],
      },
      { topLeft: [0, 700],
        bottomRight: [1000, 1200],
      },
      { topLeft: [600, 0],
        bottomRight: [1000, 1200],
      },
    ],
    goal: { topLeft: [500, 0],
      bottomRight: [600, 20],
    },
    start: [100, 600],
    name: "Into Darkness",
    text1: "\"Where am I...\"",
    text2: "You wake up shrouded in complete darkness. Somehow you feel like you're forgetting something important. The quiet ringing of an alarm can be heard far away, signaling you to get out. Luckily you have your trusty flashlight with you to illuminate the way..."
  },

  2: {
    walls: [
      { topLeft: [0, 500],
        bottomRight: [50, 1000],
      },
      { topLeft: [200, 500],
        bottomRight: [250, 800],
      },
      { topLeft: [0, 950],
        bottomRight: [800, 1000],
      },
      { topLeft: [400, 500],
        bottomRight: [700, 1000],
      },
      { topLeft: [250, 700],
        bottomRight: [325, 750],
      },
      { topLeft: [0,0],
        bottomRight: [700, 500],
      },

      { topLeft: [0,0],
        bottomRight: [700, 500],
      },
      { topLeft: [700, 550],
        bottomRight: [1200, 600],
      },
      { topLeft: [1100, 300],
        bottomRight: [1200, 550],
      },
      { topLeft: [700, 0],
        bottomRight: [1200, 50],
      },
      { topLeft: [900, 0],
        bottomRight: [950, 200],
      },
      { topLeft: [800, 200],
        bottomRight: [1050, 250],
      },
      { topLeft: [1150, 100],
        bottomRight: [1200, 400],
      },

    ],
    goal: { topLeft: [1180, 0],
      bottomRight: [1200, 100],
    },
    portals: [
      { 0: { pos: [400, 550], dir: "left"},
        1: { pos: [1000, 550], dir: "up"}
      }
    ],

    start: [100, 550],
    name: "Connected",
    text1: "You see a glowing blue light at the end of the hallway. It becons you towards it, calling out to you as if you were PROGRAMMED to follow the light",
    text2: "Press the E key to fire your portal gun. Pressing E a second time will connect the two portals together"
  },

  3: {
    walls: [
      { topLeft: [0, 0],
        bottomRight: [450, 50],
      },
      { topLeft: [550, 0],
        bottomRight: [1000, 50],
      },
      { topLeft: [0, 0],
        bottomRight: [50, 1500],
      },
      { topLeft: [0, 500],
        bottomRight: [50, 1000],
      },
      { topLeft: [0, 500],
        bottomRight: [50, 1000],
      },
      { topLeft: [0, 400],
        bottomRight: [600, 450],
      },
      { topLeft: [550, 0],
        bottomRight: [600, 450],
      },
      { topLeft: [0, 700],
        bottomRight: [1000, 750],
      },
      { topLeft: [950, 700],
        bottomRight: [1000, 1500],
      },
      { topLeft: [0, 1450],
        bottomRight: [1000, 1500],
      },
      { topLeft: [950, 0],
        bottomRight: [1000, 800],
      },
      { topLeft: [550, 400],
        bottomRight: [800, 450],
      },
      { topLeft: [700, 200],
        bottomRight: [1000, 250],
      },
    ],
    portals: [
      { 0: { pos: [50, 100], dir: "right"},
        1: { pos: [550, 450], dir: "down"},
      }
    ],
    enemies: [
      { pos: [100, 100], aggro: true},
      { pos: [500, 1000], aggro: true, health: 3},
      { pos: [800, 1300], aggro: true, health: 3},
      { pos: [300, 900], aggro: true, health: 3},

    ],
    start: [100, 500],
    goal: { topLeft: [450, 0],
      bottomRight: [550, 30],
    },
    name: "The Encounter",
    text1: "You hear footsteps creeping towards you in the distance. Something is out there with you in the darkness... Your danger PROTOCOL fires off, screaming at you to run to safety. Best find something to protect yourself with.",
    text2: "Click the Left Mouse Button to Shoot. Bullets will bounce off walls and also travel through portals."
  },

  4: {
    walls: [
      { topLeft: [0, 0],
        bottomRight: [450, 350],
      },
      { topLeft: [0, 0],
        bottomRight: [1000, 50],
      },
      { topLeft: [550, 0],
        bottomRight: [1000, 350],
      },
      { topLeft: [750, 350],
        bottomRight: [1000, 450],
      },
      { topLeft: [300, 450],
        bottomRight: [1000, 550],
      },
      { topLeft: [0, 450],
        bottomRight: [50, 550],
      },
      { topLeft: [0, 350],
        bottomRight: [200, 450],
      },
      { topLeft: [0, 550],
        bottomRight: [200, 800],
      },
      { topLeft: [0, 700],
        bottomRight: [500, 800],
      },
      { topLeft: [450, 900],
        bottomRight: [500, 1500],
      },
      { topLeft: [450, 1250],
        bottomRight: [1200, 1300],
      },
      { topLeft: [1150, 150],
        bottomRight: [1200, 1300],
      },
      { topLeft: [900, 800],
        bottomRight: [925, 1150],
      },

      { topLeft: [700, 650],
        bottomRight: [1500, 700],
      },
      { topLeft: [0, 650],
        bottomRight: [50, 1500],
      },
      { topLeft: [0, 1450],
        bottomRight: [500, 1500],
      },
      { topLeft: [0, 900],
        bottomRight: [300, 950],
      },
      { topLeft: [280, 900],
        bottomRight: [300, 1200],
      },
      { topLeft: [150, 1180],
        bottomRight: [300, 1200],
      },
      { topLeft: [250, 1350],
        bottomRight: [300, 1500],
      },
      { topLeft: [800, 0],
        bottomRight: [1500, 50],
      },
      { topLeft: [1450, 0],
        bottomRight: [1500, 500],
      },
      { topLeft: [1300, 200],
        bottomRight: [1350, 700],
      },
    ],


    enemies: [
      { pos: [ 800, 1100]},
      { pos: [ 1000, 800], health: 15},
      { pos: [ 1000, 600], health: 10},
      { pos: [ 100, 1000]},
      { pos: [ 1400, 200], health: 15}

    ],
    start: [500, 200],
    goal: {
      topLeft: [1480, 500],
      bottomRight: [1500, 700],
    },

    name: "The darkness has eyes",
    text1: "As you wander around the building, everything begins to feel almost nostalgic. \"How many times have I been here?\" You begin to feel hopeless; trapped in an endless LOOP.",
    text2: "The monsters seem to be attracted to the light and the sound of gunfire. Best get used to the blackout and stay as quiet as possible..."
  },

  5: {
    walls: [
      {
        topLeft: [0, 0],
        bottomRight: [50, 2000],
      },
      {
        topLeft: [0, 0],
        bottomRight: [2000, 50],
      },
      {
        topLeft: [1950, 0],
        bottomRight: [2000, 2000],
      },
      {
        topLeft: [0, 1950],
        bottomRight: [2000, 2000],
      },
    ],
    start: [1000, 1000],
    goal:  {
      topLeft: [3000, 3000],
      bottomRight: [3000, 3000],
    },
    enemies: [
      { pos: [ 100, 1900]},
      { pos: [ 100, 100]},
      { pos: [ 1900, 100]},
      { pos: [ 1900, 1900]},

      { pos: [ 1200, 100]},
      { pos: [ 800, 1900]},
      { pos: [ 100, 800]},
      { pos: [ 1900, 1200]},
    ],
    name: "No Escape",
    text1: "As you progress onto the next floor, you cease hearing the echoes of your footsteps. Its as if you've stepped into a massive vaccum in empty space. You feel yourself beginning to suffocate. If you stay for more than 60 seconds, you will CRASH.",
    text2: "[object Object]"
  }
};

/* harmony default export */ __webpack_exports__["default"] = (levels);

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
    this.color = "#ffffff";
    this.trail = [this.pos];

    this.maxLength = Light.MAX;

    this.lifespan = options.lifespan || Math.floor(Math.random()*40);
  }
  
  draw(ctx) {
    if(this.trail.length === 0) return;

    const gradient = ctx.createLinearGradient(
      this.pos[0], this.pos[1],
      this.trail[0][0], this.trail[0][1]
    );

    if(this.lifespan > Light.HALF_LIFE) {
      gradient.addColorStop(0, "#aaa");
    } 
    else if(this.lifespan > Light.HALF_LIFE * (3/2)) {
      gradient.addColorStop(0, "#7f7f7f");
    }
    else {
      gradient.addColorStop(0, "#fff");
    }

    gradient.addColorStop(1,  "#222");

    
    ctx.lineWidth = this.radius;
    ctx.strokeStyle = gradient;
    ctx.setLineDash([1, 0]);
    
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(this.trail[0][0], this.trail[0][1]);
    ctx.stroke(); 
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


Light.LIFESPAN = 250;
Light.HALF_LIFE = Light.LIFESPAN/2;
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
/* harmony import */ var _portal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./portal */ "./lib/portal.js");
/* harmony import */ var _light__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./light */ "./lib/light.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./lib/util.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_util__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game */ "./lib/game.js");








const radius = 25;

class Player extends _moving_object__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(options) {
    super(options);
    this.name = options.name || "player";
    this.radius = radius;
    this.portals = [];
    this.health = Player.MAX_HEALTH;

    // this.bullets = Player.MAX_BULLETS; 
    this.reloading = false;

    this.portalBullets = 0;

    this.lightCooldown = false;
    this.lightTimer = 0;
    this.lightInt = null;

    this.portalCooldown = false;
    this.portalTimer = 0;
    this.portalInt = null;

    this.timeStop = false;
    this.timeStopCooldown = false;
    this.stopTimer = 0;
    this.stopInt = null;

    this.shielding = false;
    this.shieldHealth = Player.MAX_SHIELD;
    this.cursorPostion = [0,0];
    
    this.sprite = new Image();
    this.sprite.src = "./sprites/player/mech3.png";

    this.bulletHUD = new Image();
    this.bulletHUD.src = "./sprites/player/crosshair.png";
    this.lightHUD = new Image();
    this.lightHUD.src = "./sprites/player/flashlight.png";
    this.timeHUD = new Image();
    this.timeHUD.src = "./sprites/player/stopwatch.png";
    this.portalHUD = new Image();
    this.portalHUD.src = "./sprites/player/portal.png";
    this.shieldHUD = new Image();
    this.shieldHUD.src = "./sprites/player/shield.png";
    
    this.collision = false;
    this.updateCursorPostion();

    this.moving = false;
    this.frame = 0;
    this.i = 0;
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

    if(this.game.portalCollision(topLeft) && this.game.portalCollision(topLeft).active)
      return this.game.portalCollision(topLeft).teleport(this, topLeft);
    else if(this.game.portalCollision(botLeft) && this.game.portalCollision(botLeft).active)
      return this.game.portalCollision(botLeft).teleport(this, botLeft);
    else if(this.game.portalCollision(topRight) && this.game.portalCollision(topRight).active)
      return this.game.portalCollision(topRight).teleport(this, topRight);
    else if(this.game.portalCollision(botRight) && this.game.portalCollision(botRight).active)
      return this.game.portalCollision(botRight).teleport(this, botRight);

    
    if(this.game.finishLevel(topLeft)
      || this.game.finishLevel(botLeft)
      || this.game.finishLevel(topRight)
      || this.game.finishLevel(botRight)) {
        this.game.nextLevel();
    }
  
    if(this.game.wallCollision(topLeft)
      || this.game.wallCollision(botLeft)
      || this.game.wallCollision(topRight)
      || this.game.wallCollision(botRight)) {
        this.collision = true;
      return;
    } else {
      this.collision = false;
    }

    this.cursorPostion[0] += newX - this.pos[0];
    this.cursorPostion[1] += newY - this.pos[1];

    this.pos = [newX, newY];

  }

  mouseAngle() {
    let vect = _util__WEBPACK_IMPORTED_MODULE_5___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
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
    let relVel = _util__WEBPACK_IMPORTED_MODULE_5___default.a.dir([(this.cursorPostion[0] - this.pos[0]), 
    this.cursorPostion[1] - this.pos[1]]);
    let pos = this.pos.slice();
    
    const radX = Math.cos(angle)*this.radius*1.2;
    const radY = Math.sin(angle)*this.radius*1.2;
    pos[0] += radX;
    pos[1] += radY;
    
    if(type === "portal") {
      relVel[0] *= _portal_gun__WEBPACK_IMPORTED_MODULE_2__["default"].SPEED;
      relVel[1] *= _portal_gun__WEBPACK_IMPORTED_MODULE_2__["default"].SPEED;
    }
    else {
      relVel[0] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;
      relVel[1] *= _bullet__WEBPACK_IMPORTED_MODULE_1__["default"].SPEED;
    }
    
    if(type === "bullet") {
      const bullet = new _bullet__WEBPACK_IMPORTED_MODULE_1__["default"]({
        pos: pos,
        vel: relVel,
        game: this.game
      });
      
      this.game.add(bullet);
      this.reloading = true;
      setTimeout(() => {
        this.reloading = false;
      }, 200);
      // this.bullets--;
      // console.log(`Ammo: ${this.bullets}`);
      
      // if(this.bullets <= 0) {
      //   console.log('reloading...');
      //   this.reloading = true;
      //   this.bullets = Player.MAX_BULLETS;
      //   setTimeout(() => {
      //     this.reloading = false;
      //   }, 1500);
      // }
      
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
        this.portalTimer = Player.PORTAL_CD;
        this.portalInt = setInterval(()=>{this.portalTimer -= 0.1}, 100);


        setTimeout(() => {
          this.portalCooldown = false;
        }, Player.PORTAL_CD*1000);
      }
      
    }
    
  }

  connectPortals() {
    this.portals[0].connect(this.portals[1]);
    this.portals[1].connect(this.portals[0]);
    
    this.portals[0].color = _portal__WEBPACK_IMPORTED_MODULE_3__["default"].BLUE;
    this.portals[1].color = _portal__WEBPACK_IMPORTED_MODULE_3__["default"].BLUE;
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
    const centerDist = _util__WEBPACK_IMPORTED_MODULE_5___default.a.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + this.shieldHealth * Player.SHIELD_RADIUS + 
      otherObject.radius);
  }

  shineLight() {
    for(let i = 0; i < _light__WEBPACK_IMPORTED_MODULE_4__["default"].DIRECTIONS.length; i++) {
      let relVel = _light__WEBPACK_IMPORTED_MODULE_4__["default"].DIRECTIONS[i].slice();
      relVel[0] *= _light__WEBPACK_IMPORTED_MODULE_4__["default"].SPEED;
      relVel[1] *= _light__WEBPACK_IMPORTED_MODULE_4__["default"].SPEED;

      let light = new _light__WEBPACK_IMPORTED_MODULE_4__["default"]({
        pos: this.pos,
        vel: relVel,
        game: this.game
      });

      this.game.add(light);
    }

    this.lightCooldown = true;
    this.lightTimer = Player.LIGHT_CD;
    this.lightInt = setInterval(()=>{this.lightTimer -= 0.1}, 100);

    setTimeout(() => {
      this.lightCooldown = false;
    }, Player.LIGHT_CD*1000);
  }

  stopTime() {
    this.timeStop = true;
    this.timeStopCooldown = true;
    this.stopTimer = Player.TIMESTOP_CD;

    this.stopInt = setInterval(()=>{this.stopTimer -= 0.1}, 100);

    setTimeout(() => {
      this.timeStop = false;
    }, 1000);

    setTimeout(() => {
      this.timeStopCooldown = false;
    }, Player.TIMESTOP_CD*1000);
  }

  mouseMove(e) {
    if(e.clientX <= _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X) {
      this.cursorPostion[0] = e.clientX + (-_game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2 + this.pos[0]);
      this.cursorPostion[1] = e.clientY + (-_game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 + this.pos[1]);
    }
  }

  updateCursorPostion() {
    window.addEventListener('mousemove', e => this.mouseMove(e));
  }

  drawHUD(ctx) {
    ctx.fillStyle = "#686968";
    let box1 = [this.pos[0] - _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2, this.pos[1] + _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box2 = [this.pos[0] - _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2 + Player.HUD_ICON_SIZE, this.pos[1] + _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box3 = [this.pos[0] - _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2 + Player.HUD_ICON_SIZE*2, this.pos[1] + _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box4 = [this.pos[0] - _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2 + Player.HUD_ICON_SIZE*3, this.pos[1] + _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 - Player.HUD_ICON_SIZE];
    let box5 = [this.pos[0] - _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_X/2 + Player.HUD_ICON_SIZE*4, this.pos[1] + _game__WEBPACK_IMPORTED_MODULE_6__["default"].VIEW_Y/2 - Player.HUD_ICON_SIZE];

    ctx.fillRect(box1[0], box1[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box2[0] + 1, box2[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box3[0] + 2, box3[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box4[0] + 3, box4[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    ctx.fillRect(box5[0] + 4, box5[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    
    ctx.drawImage(this.bulletHUD, 0, 0, 500, 500, 
      box1[0] + 20, box1[1] + 20, 60, 60);

    ctx.drawImage(this.lightHUD, 0, 0, 980, 980, 
      box2[0] + 30, box2[1] + 30, 40, 40); 
    
    ctx.drawImage(this.timeHUD, 0, 0, 512, 512, 
      box3[0] + 25, box3[1] + 25, 50, 50); 

    ctx.drawImage(this.portalHUD, 0, 0, 483, 600, 
      box4[0] + 25, box4[1] + 13, 50, 65);

    ctx.drawImage(this.shieldHUD, 0, 0, 512, 512, 
      box5[0] + 27, box5[1] + 25, 50, 50); 

    
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Georgia";
    ctx.fillText("Click", box1[0] + 63, box1[1] + 15);
    ctx.fillText("Space", box2[0] + 60, box2[1] + 15);
    ctx.fillText("R", box3[0] + 87, box3[1] + 15);
    ctx.fillText("E", box4[0] + 88, box4[1] + 15);
    ctx.fillText("F", box5[0] + 89, box5[1] + 15);


    ctx.font = "14px Georgia";
    ctx.fillText("Shoot", box1[0] + 35, box1[1] + 93);
    ctx.fillText("Light", box2[0] + 37, box2[1] + 93);
    ctx.fillText("Time Stop", box3[0] + 24, box3[1] + 93);
    ctx.fillText("Portal Gun", box4[0] + 24, box4[1] + 93);
    ctx.fillText("Shield", box5[0] + 35, box5[1] + 93);
    
    ctx.fillStyle = "red";
    ctx.fillRect(box1[0], box1[1] - 25, 500*this.health/Player.MAX_HEALTH, 20);
      
    ctx.fillStyle = "#ffffff";
    
    ctx.fillText("Health", box1[0], box1[1] - 10);

    ctx.fillStyle = "rgba(222, 222, 222, 0.7)";



    if(this.lightTimer > 0) {
      ctx.fillRect(box2[0], box2[1] + this.lightTimer*100/Player.LIGHT_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
      // ctx.beginPath();
      // ctx.moveTo(box2[0] + Player.HUD_ICON_SIZE/2 + 1, box2[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box2[0] + Player.HUD_ICON_SIZE/2 + 1, box2[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.lightTimer)/Player.LIGHT_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.lightInt) {
        clearInterval(this.lightInt);
      }
    }

    if(this.stopTimer > 0) {
      ctx.fillRect(box3[0] + 2, box3[1] + this.stopTimer*100/Player.TIMESTOP_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
      // ctx.beginPath();
      // ctx.moveTo(box3[0] + Player.HUD_ICON_SIZE/2 + 2, box3[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box3[0] + Player.HUD_ICON_SIZE/2 + 2, box3[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.stopTimer)/Player.TIMESTOP_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.stopInt) {
        clearInterval(this.stopInt);
      }
    }

    if(this.portalTimer > 0 ) {
      ctx.fillRect(box4[0] + 3, box4[1] + this.portalTimer*100/Player.PORTAL_CD, Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);

      // ctx.beginPath();
      // ctx.moveTo(box4[0] + Player.HUD_ICON_SIZE/2 + 3, box4[1] + Player.HUD_ICON_SIZE/2);
      // ctx.arc(box4[0] + Player.HUD_ICON_SIZE/2 + 3, box4[1] + Player.HUD_ICON_SIZE/2, Player.HUD_ICON_SIZE/2, 0, (2 * Math.PI * this.portalTimer)/Player.PORTAL_CD);
      // ctx.closePath();
      // ctx.fill();
    } else {
      if(this.portalInt) {
        clearInterval(this.portalInt);
      }
    }

    if(this.shielding) {
      ctx.fillRect(box5[0] + 4, box4[1], Player.HUD_ICON_SIZE, Player.HUD_ICON_SIZE);
    }
    
  }


  draw(ctx) {

    if (this.frame > 2) {
      this.frame = 0;
    }

    ctx.save();

    ctx.translate(this.pos[0], this.pos[1])

    let angle = this.mouseAngle()*180/Math.PI;
    let sx, sy;
    let offsetY = 0;

    // if(angle > -45 && angle < 45) {
    //   sx = this.frame*48;
    //   sy = 2*48;
    // }
    // else if(angle > 45 && angle < 135) {
    //   sx = this.frame*48;
    //   sy = 0;
    // }
    // else if(angle > 135 || angle < -135) {
    //   sx = this.frame*48;
    //   sy = 48;
    // }
    // else if(angle > -135 && angle < -45) {
    //   sx = this.frame*48;
    //   sy = 3*48;
    // }

    // if(!this.moving || this.collision) {
    //   sx = 0;
    // }

    // ctx.rotate(this.mouseAngle());
    
    if(angle > -45 && angle < 45) {
      sx = this.frame*123;
      sy = 2*123;
      offsetY = -3;
    }
    else if(angle > 45 && angle < 135) {
      sx = this.frame*123;
      sy = 0;
      offsetY = 5;
    }
    else if(angle > 135 || angle < -135) {
      sx = this.frame*123;
      sy = 123;
      offsetY = 1;
    }
    else if(angle > -135 && angle < -45) {
      sx = this.frame*123;
      sy = 3*123;
      offsetY = -5;
    }

    if(!this.moving || this.collision) {
      sx = 0;
    }


    ctx.drawImage(this.sprite, 
      sx, sy + 40, 123, 123,
      -41, -40 + offsetY,
      80, 80
    );

    // ctx.drawImage(this.sprite, 
    //   sx,sy, 48, 48,
    //   -16, -23,
    //   35, 35
    // );

    ctx.restore();


    ctx.lineWidth = 1;
    // ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    ctx.strokeStyle = "#b503fc";
    ctx.setLineDash([1,0]);
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );

    ctx.stroke();

    if(this.i % 15 === 0) {
      this.frame++;
    }

    this.i++;

    this.drawHUD(ctx);

  }
}

const sideMove = Math.sqrt(2)/2;

Player.MAX_BULLETS = 12;
Player.MAX_HEALTH = 6;
Player.MIN_SHIELD = 0;
Player.MAX_SHIELD = 10;
Player.SHIELD_RADIUS = 1;

Player.WIDTH = 48;
Player.HEIGHT = 48;

Player.LIGHT_CD = 1;
Player.PORTAL_CD = 5;
Player.TIMESTOP_CD = 5;

Player.HUD_ICON_SIZE = 100;


Player.SPEED = 5;
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
    // this.color = options.color || "#00FF00";
    this.color = options.color || Portal.BLUE;

    this.connectedTo = null;

    this.pos = options.pos;
    this.dir = options.dir;

    this.sprite = new Image();
    this.frameCount = 0;
    this.i = 0;
  }

  teleport(object, pos) {
    if(this.connectedTo && this.active && (object instanceof _player__WEBPACK_IMPORTED_MODULE_1__["default"])) {
      this.toggleActive();
      this.connectedTo.toggleActive();


      // let offsetX = (this.pos[0] - pos[0]);
      // let offsetY = (this.pos[1] - pos[1]);
      // let offsetX = -20;
      // let offsetY = -20;

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
    
    if(object instanceof _bullet__WEBPACK_IMPORTED_MODULE_2__["default"]) {
      object.remove();
      object = new _bullet__WEBPACK_IMPORTED_MODULE_2__["default"]({
        pos: object.pos,
        vel: object.vel,
        game: object.game,
        bounceCount: object.bounceCount
      });
      this.game.add(object);
    }

  }

  draw(ctx) {
    if (this.frameCount > 23) {
      this.frameCount = 0;
    }

    this.sprite.src = this.color[this.frameCount];
 
    if(this.dir === "up") {
      ctx.drawImage(this.sprite, 
        0,0, 846, 841,
        this.pos[0] - 50, this.pos[1] - 15,
        100, 40
      )
    } else if(this.dir === "down") {
      ctx.drawImage(this.sprite, 
        0,0, 846, 841,
        this.pos[0] - 50, this.pos[1] - 20,
        100, 40
      )
    } else if(this.dir === "left") {
      ctx.drawImage(this.sprite, 
        0,0, 846, 841,
        this.pos[0] - 20, this.pos[1] - 50,
        40, 100
      )
    } else if(this.dir === "right") {
      ctx.drawImage(this.sprite, 
        0,0, 846, 841,
        this.pos[0] - 20, this.pos[1] - 50,
        40, 100
      )
    }

    if(this.i % 8 === 0) {
      this.frameCount++;
    }

    this.i++;
  }

  connect(otherPortal) {
    this.connectedTo = otherPortal;
  }

  toggleActive() {
    let temp = this.connectedTo.color;
    this.connectedTo.active = false;
    this.connectedTo.color = Portal.PINK;

    setTimeout(() => {
      this.connectedTo.active = true;
      this.connectedTo.color = temp;
    }, 500);
  }

}

Portal.OFFSET = 15;
Portal.WIDTH = 25;
Portal.HEIGHT = 5;

Portal.BLUE = [
  "./sprites/blue/blue0.png",
  "./sprites/blue/blue1.png",
  "./sprites/blue/blue2.png",
  "./sprites/blue/blue3.png",
  "./sprites/blue/blue4.png",
  "./sprites/blue/blue5.png",
  "./sprites/blue/blue6.png",
  "./sprites/blue/blue7.png",
  "./sprites/blue/blue8.png",
  "./sprites/blue/blue9.png",
  "./sprites/blue/blue10.png",
  "./sprites/blue/blue11.png",
  "./sprites/blue/blue12.png",
  "./sprites/blue/blue13.png",
  "./sprites/blue/blue14.png",
  "./sprites/blue/blue15.png",
  "./sprites/blue/blue16.png",
  "./sprites/blue/blue17.png",
  "./sprites/blue/blue18.png",
  "./sprites/blue/blue19.png",
  "./sprites/blue/blue20.png",
  "./sprites/blue/blue21.png",
  "./sprites/blue/blue22.png",
  "./sprites/blue/blue23.png"
];

Portal.PINK = [
  "./sprites/pink/pink0.png",
  "./sprites/pink/pink1.png",
  "./sprites/pink/pink2.png",
  "./sprites/pink/pink3.png",
  "./sprites/pink/pink4.png",
  "./sprites/pink/pink5.png",
  "./sprites/pink/pink6.png",
  "./sprites/pink/pink7.png",
  "./sprites/pink/pink8.png",
  "./sprites/pink/pink9.png",
  "./sprites/pink/pink10.png",
  "./sprites/pink/pink11.png",
  "./sprites/pink/pink12.png",
  "./sprites/pink/pink13.png",
  "./sprites/pink/pink14.png",
  "./sprites/pink/pink15.png",
  "./sprites/pink/pink16.png",
  "./sprites/pink/pink17.png",
  "./sprites/pink/pink18.png",
  "./sprites/pink/pink19.png",
  "./sprites/pink/pink20.png",
  "./sprites/pink/pink21.png",
  "./sprites/pink/pink22.png",
  "./sprites/pink/pink23.png"
];

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

    this.tailColor = "#222";
    this.midColor = "#fce703";
    this.headColor = "#fc9003";
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
      color = _portal__WEBPACK_IMPORTED_MODULE_1__["default"].PINK;
    else 
      color = _portal__WEBPACK_IMPORTED_MODULE_1__["default"].BLUE;


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
    this.trail.push(this.pos);

    if(this.trail.length > PortalGun.MAX) {
      this.trail.shift();
    }
  }
}

PortalGun.RADIUS = 5;
PortalGun.OFFSET = 5;
PortalGun.SPEED = 5;
PortalGun.MAX = 30;


/* harmony default export */ __webpack_exports__["default"] = (PortalGun);

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
    this.topLeft = options.topLeft;
    this.bottomRight = options.bottomRight;
    this.width = this.bottomRight[0] - this.topLeft[0];
    this.height = this.bottomRight[1] - this.topLeft[1];
    this.color =  options.color || "#000000"; // #ffffff
    this.game = options.game;
  }

  draw(ctx) {
    // ctx.fillStyle = "rgba(20, 20, 20, 0.5)";
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
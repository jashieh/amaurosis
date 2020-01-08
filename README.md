# <a href="https://jashieh.github.io/amaurosis" target="_blank">Amaurosis</a>

## Gameplay
Amaurosis minimalist birds-eye view sensory-deprivation experience that challenges players to solve complex puzzles without the traditional use of sight. Built using only JavaScript and HTML5 Canvas, players must navigate through a dark dungeon crawling with hidden enemies. Players may temporarily illuminate their surrounding with a "light", but beware, the monsters are attracted to the light. 

## Technologies Used
* **JavaScript:** JavaScript was used as the primary language to create all of the game logic, including a custom physics engine that supports collision of multiple objects at once and manages player and AI movement patterns as well as vector changes due to objects reflecting off walls or passing through portals.
* **HTML5 Canvas:** HTML5 Canvas was used to render the sprites and animations of the game in the browser.

## Implementation

### Rendering 
The GameView class handles rendering for the game, using requestAnimationFrame to keep the game running smoothly by waiting until the next frame is ready to render to prevent stuttering.

```javascript
animate(time) {
    const timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    
    this.game.draw(this.ctx, Game.VIEW_X, Game.VIEW_Y);
    this.lastTime = time;

    // every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
}
```
The game logic is then delegated to the Game class, which keeps track of the objects in the game. The Game class delegates specific functions to the individual objects themselves, such as players, bullets, monsters, etc.

### Camera
A psuedo camera follows the player around, limiting the range the player can see to their screen size in order to make the game map feel a lot larger and more complex. This also reduces rendering lag as objects outside of the player's field of view don't need to be displayed. This is done by translating the player to the center of the canvas when rendering, such that the visible canvas moves with the player about its center.

```javascript 
draw(ctx, xView, yView) {  
    ctx.save();    
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    
    ctx.translate((xView/2 - this.players[0].pos[0]), (yView/2 - this.players[0].pos[1]))
        
    this.allObjects().forEach(object => {
      object.draw(ctx);
    });

    ctx.restore();
}
```

### Bounce Mechanics 
When a moving object collides with a wall, the direction of the object is inverted depending on the axis of collision. A new object is then created, in order to give a trailing effect to the moving objects that fade over time.

```javascript
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
}
```

### AI Movement
The AI monsters will move towards the player's current position. If it is blocked on one axis, it will attempt to follow the player on an unobstructed axis.

```javascript
path() {
    const x = this.game.players[0].pos[0] - this.pos[0];
    const y = this.game.players[0].pos[1] - this.pos[1];
    return Util.dir([x, y]);
}

move() {
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
```



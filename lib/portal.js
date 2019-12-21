import StaticObject from './static_object';
import Player from './player';
import Bullet from './bullet';
import Light from './light';


class Portal extends StaticObject {
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
    if(this.connectedTo && this.active && (object instanceof Player)) {
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
    } else if(this.connectedTo && (object instanceof Bullet || object instanceof Light)) {
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
    
    if(object instanceof Bullet) {
      object.remove();
      object = new Bullet({
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

export default Portal;
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
  "./sprites/blue_portal/blue_portal_effect_large_000.png",
  "./sprites/blue_portal/blue_portal_effect_large_001.png",
  "./sprites/blue_portal/__blue_portal_effect_large_002.png",
  "./sprites/blue_portal/__blue_portal_effect_large_003.png",
  "./sprites/blue_portal/__blue_portal_effect_large_004.png",
  "./sprites/blue_portal/__blue_portal_effect_large_005.png",
  "./sprites/blue_portal/__blue_portal_effect_large_006.png",
  "./sprites/blue_portal/__blue_portal_effect_large_007.png",
  "./sprites/blue_portal/__blue_portal_effect_large_008.png",
  "./sprites/blue_portal/__blue_portal_effect_large_009.png",
  "./sprites/blue_portal/__blue_portal_effect_large_010.png",
  "./sprites/blue_portal/__blue_portal_effect_large_011.png",
  "./sprites/blue_portal/__blue_portal_effect_large_012.png",
  "./sprites/blue_portal/__blue_portal_effect_large_013.png",
  "./sprites/blue_portal/__blue_portal_effect_large_014.png",
  "./sprites/blue_portal/__blue_portal_effect_large_015.png",
  "./sprites/blue_portal/__blue_portal_effect_large_016.png",
  "./sprites/blue_portal/__blue_portal_effect_large_017.png",
  "./sprites/blue_portal/__blue_portal_effect_large_018.png",
  "./sprites/blue_portal/__blue_portal_effect_large_019.png",
  "./sprites/blue_portal/__blue_portal_effect_large_020.png",
  "./sprites/blue_portal/__blue_portal_effect_large_021.png",
  "./sprites/blue_portal/__blue_portal_effect_large_022.png",
  "./sprites/blue_portal/__blue_portal_effect_large_023.png"
];

Portal.PINK = [
  "./sprites/pink_portal/__pink_portal_effect_large_000.png",
  "./sprites/pink_portal/__pink_portal_effect_large_001.png",
  "./sprites/pink_portal/__pink_portal_effect_large_002.png",
  "./sprites/pink_portal/__pink_portal_effect_large_003.png",
  "./sprites/pink_portal/__pink_portal_effect_large_004.png",
  "./sprites/pink_portal/__pink_portal_effect_large_005.png",
  "./sprites/pink_portal/__pink_portal_effect_large_006.png",
  "./sprites/pink_portal/__pink_portal_effect_large_007.png",
  "./sprites/pink_portal/__pink_portal_effect_large_008.png",
  "./sprites/pink_portal/__pink_portal_effect_large_009.png",
  "./sprites/pink_portal/__pink_portal_effect_large_010.png",
  "./sprites/pink_portal/__pink_portal_effect_large_011.png",
  "./sprites/pink_portal/__pink_portal_effect_large_012.png",
  "./sprites/pink_portal/__pink_portal_effect_large_013.png",
  "./sprites/pink_portal/__pink_portal_effect_large_014.png",
  "./sprites/pink_portal/__pink_portal_effect_large_015.png",
  "./sprites/pink_portal/__pink_portal_effect_large_016.png",
  "./sprites/pink_portal/__pink_portal_effect_large_017.png",
  "./sprites/pink_portal/__pink_portal_effect_large_018.png",
  "./sprites/pink_portal/__pink_portal_effect_large_019.png",
  "./sprites/pink_portal/__pink_portal_effect_large_020.png",
  "./sprites/pink_portal/__pink_portal_effect_large_021.png",
  "./sprites/pink_portal/__pink_portal_effect_large_022.png",
  "./sprites/pink_portal/__pink_portal_effect_large_023.png"
];

export default Portal;
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
    this.color = options.color || "#00FF00";
    this.connectedTo = null;

    this.pos = options.pos;
    this.dir = options.dir;

    this.frameCount = 0;
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

  }

  draw(ctx) {
    const port = new Image();

    if (this.frameCount > 10) {
      this.frameCount = 0;
    }

    if(this.frameCount === 0) {
      port.src = " lib/__blue_portal_effect_large_000.png";
    }
    else if (this.frameCount === 1) {
      port.src = " lib/__blue_portal_effect_large_001.png";
    }
    else if (this.frameCount === 2) {
      port.src = " lib/__blue_portal_effect_large_002.png";
    }
    else if (this.frameCount === 3) {
      port.src = " lib/__blue_portal_effect_large_003.png";
    }
    else if (this.frameCount === 4) {
      port.src = " lib/__blue_portal_effect_large_004.png";
    }
    else if (this.frameCount === 5) {
      port.src = " lib/__blue_portal_effect_large_005.png";
    }
    else if (this.frameCount === 6) {
      port.src = " lib/__blue_portal_effect_large_006.png";
    }
    else if (this.frameCount === 7) {
      port.src = " lib/__blue_portal_effect_large_007.png";
    }
    else if (this.frameCount === 8) {
      port.src = " lib/__blue_portal_effect_large_008.png";
    }
    else if (this.frameCount === 9) {
      port.src = " lib/__blue_portal_effect_large_009.png";
    }
    else if (this.frameCount === 10) {
      port.src = " lib/__blue_portal_effect_large_010.png";
    }


    if(this.dir === "up") {
      ctx.drawImage(port, 
        0,0, 846, 841,
        this.pos[0] - 50, this.pos[1] - 15,
        100, 25
      )
    } else if(this.dir === "down") {
      ctx.drawImage(port, 
        0,0, 846, 841,
        this.pos[0] - 50, this.pos[1] - 10,
        100, 25
      )
    } else if(this.dir === "left") {
      ctx.drawImage(port, 
        0,0, 846, 841,
        this.pos[0] - 10, this.pos[1] - 50,
        25, 100
      )
    } else if(this.dir === "right") {
      ctx.drawImage(port, 
        0,0, 846, 841,
        this.pos[0] - 10, this.pos[1] - 50,
        25, 100
      )
    }

    this.frameCount++;
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

export default Portal;
import StaticObject from './static_object';

class Portal extends StaticObject {
  constructor(options) {
    super(options);
    this.passable = true;
    this.color = "#00FF00";
    this.connectedTo = options.connectedTo;

    const x = (options.bottomRight[0] + options.topLeft[0])/2;
    const y = (options.bottomRight[1] + options.topLeft[1])/2;
    this.pos = [x, y];
    this.dir = options.dir;
  }

  teleport(object, pos) {
    let offsetX = -(this.pos[0] - pos[0]);
    let offsetY = -(this.pos[1] - pos[1]);

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

  }

  connect(otherPortal) {
    this.connectedTo = otherPortal;
  }

}

Portal.OFFSET = 15;

export default Portal;
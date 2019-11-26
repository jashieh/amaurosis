import StaticObject from './static_object';

class Portal extends StaticObject {
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

export default Portal;
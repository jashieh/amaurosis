import MovingObject from "../moving_object";

class Enemy extends MovingObject {
  constructor(options) {
    options.radius = 3;
    super(options);
    this.color = "#ffffff";
    this.aggro = options.aggro || false;
  }
}

export default Enemy;


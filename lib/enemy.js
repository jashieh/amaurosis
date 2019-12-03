class Enemy extends MovingObject {
  constructor(options) {
    options.radius = 3;
    super(options);
    this.color = "#ffffff";
    this.aggro = false;

  }
}

export default Enemy;


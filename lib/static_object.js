class StaticObject {

  constructor(options) {
    this.topLeft = options.topLeft;
    this.bottomRight = options.bottomRight;
    this.width = this.bottomRight[0] - this.topLeft[0];
    this.height = this.bottomRight[1] - this.topLeft[1];
    this.color =  options.color || "#000000";
    this.game = options.game;
  }

  draw(ctx) {
    ctx.fillStyle = "rgba(20, 20, 20, 0.5)";
    ctx.fillRect(this.topLeft[0], this.topLeft[1], this.width, this.height);
  }


  remove() {
    this.game.remove(this);
  };



} 

export default StaticObject;
class StaticObject {

  constructor(options) {
    // this.startPos = options.startPos;
    // this.endPos = options.endPos;
    // this.length = options.length;

    this.topLeft = options.topLeft;
    this.bottomRight = options.bottomRight;
    this.direction = options.direction;
    this.width = this.bottomRight[0] - this.topLeft[0];
    this.height = this.bottomRight[1] - this.topLeft[1];
    this.color =  options.color || "#0000ff";
    this.game = options.game;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.topLeft[0], this.topLeft[1], this.width, this.height);
  }

  collideWith(otherObj) {
    
  }


} 

export default StaticObject;
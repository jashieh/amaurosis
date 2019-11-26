import StaticObject from './static_object';

class Wall extends StaticObject {
  constructor(options) {
    super(options);
    this.passable = false;
  }

  // draw(ctx) {
  //   ctx.lineWidth = this.width;
  //   ctx.strokeStyle = this.color;
  //   ctx.beginPath();
  //   ctx.moveTo(this.startPos[0], this.startPos[1]);
  //   ctx.lineTo(this.endPos[0], this.endPos[1]);
  //   ctx.stroke();
  // }

  collideWith(otherObj) {

  }


} 

export default Wall;
import StaticObject from './static_object';

class Wall extends StaticObject {
  constructor(options) {
    super(options);
    this.passable = false;
  }


} 

export default Wall;
import Rectangle from './rectangle';

class Camera {
  constructor(xView, yView, viewportWidth, 
    viewportHeight, worldWidth, worldHeight) {
    
    this.xView = xView || 0;
	  this.yView = yView || 0;

	  this.xDeadZone = 0; 
	  this.yDeadZone = 0; 

	  this.wView = viewportWidth;
	  this.hView = viewportHeight;

	  this.axis = AXIS.BOTH;

    this.followed = null;
    this.viewportRect = new Rectangle(this.xView, this.yView, 
      this.wView, this.hView);
    this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
  }

  follow(gameObject, xDeadZone, yDeadZone) {
    this.followed = gameObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }

  update() {
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        if (this.followed.pos[0] - this.xView + this.xDeadZone > this.wView)
          this.xView = this.followed.pos[0] - (this.wView - this.xDeadZone);
        else if (this.followed.pos[0] - this.xDeadZone < this.xView)
          this.xView = this.followed.pos[0] - this.xDeadZone;

      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        if (this.followed.pos[1] - this.yView + this.yDeadZone > this.hView)
          this.yView = this.followed.pos[1] - (this.hView - this.yDeadZone);
        else if (this.followed.pos[1] - this.yDeadZone < this.yView)
          this.yView = this.followed.pos[1] - this.yDeadZone;
      }

    }

    this.viewportRect.set(this.xView, this.yView);

    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.left < this.worldRect.left)
        this.xView = this.worldRect.left;
      if (this.viewportRect.top < this.worldRect.top)
        this.yView = this.worldRect.top;
      if (this.viewportRect.right > this.worldRect.right)
        this.xView = this.worldRect.right - this.wView;
      if (this.viewportRect.bottom > this.worldRect.bottom)
        this.yView = this.worldRect.bottom - this.hView;
    }
  }

}

const AXIS = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3,
  BOTH: 4 
};

export default Camera;
class Rectangle {
 constructor(left, top, width, height) {
  this.left = left || 0;
  this.top = top || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
 }

 set(left, top, width, height) {
  this.left = left;
  this.top = top;
  this.width = width || this.width;
  this.height = height || this.height
  this.right = (this.left + this.width);
  this.bottom = (this.top + this.height); 
 }

 within(rect) {
  return (rect.left <= this.left &&
    rect.right >= this.right &&
    rect.top <= this.top &&
    rect.bottom >= this.bottom);
 }


}

export default Rectangle;
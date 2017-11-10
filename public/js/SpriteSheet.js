export default class SpriteSheet {
  constructor(img, w, h) {
    this.img = img;
    this.width = w;
    this.height = h;
    this.tiles = new Map();
  }

  define(name, x, y, w, h) {
    const buffer = document.createElement('canvas');
    buffer.width = w;
    buffer.height = h;
    buffer.getContext('2d')
      .drawImage(
        this.img,
        x,y,
        w,h,
        0,0,
        w, h);
    this.tiles.set(name, buffer);
  }

  defineTile(name, x, y) {
    this.define(name, x*this.width, y*this.height, this.width, this.height);
  }

  draw(name, ctx, x, y) {
    const buffer = this.tiles.get(name);
    ctx.drawImage(buffer, x, y);
  }

  drawTile(name, ctx, x, y) {
    this.draw(name, ctx, x * this.width, y * this.height);
  }
}
export default class SpriteSheet {
  constructor(img, w, h) {
    this.img = img;
    this.width = w;
    this.height = h;
    this.tiles = new Map();
  }

  define(name, x, y, w, h) {
    const buffers = [ false, true ].map(flip => {
      const buffer = document.createElement('canvas');
      buffer.width = w;
      buffer.height = h;

      const ctx = buffer.getContext('2d');

      if (flip) {
        ctx.scale(-1, 1);
        ctx.translate(-w, 0);
      }
      
      ctx.drawImage(
        this.img,
        x,y,
        w,h,
        0,0,
        w, h);
      
      return buffer;
    });
    this.tiles.set(name, buffers);
  }

  defineTile(name, x, y) {
    this.define(name, x*this.width, y*this.height, this.width, this.height);
  }

  draw(name, ctx, x, y, flip = false) {
    const buffer = this.tiles.get(name)[flip ? 1 : 0];
    ctx.drawImage(buffer, x, y);
  }

  drawTile(name, ctx, x, y) {
    this.draw(name, ctx, x * this.width, y * this.height);
  }
}
import SpriteSheet from '../SpriteSheet.js';
import { loadImage } from '../loaders.js';

const CHARS = ` !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstuvwxyz{|}~`;

class Font {
  constructor(sprites, size) {
    this.sprites = sprites;
    this.size = size;
  }

  print(text, ctx, x, y) {
    // eslint-disable-next-line array-bracket-spacing
    [...text].forEach((char, pos) => {
      this.sprites.draw(char, ctx, x + pos * this.size, y);
    });
  }
}

export function loadFont() {
  return loadImage('./img/font.png')
    .then(img => {
      const fontSprite = new SpriteSheet(img);
      const rowLen = img.width;
      const size = 8;

      for (const [ i, char ] of [...CHARS].entries()) {
        const x = i * size % rowLen;
        const y = Math.floor(i * size / rowLen) * size;
        fontSprite.define(char, x,y, size,size);
      }

      return new Font(fontSprite, size);
    });
}
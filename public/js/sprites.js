import { loadImage } from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

export function loadMarioSprite() {
  return loadImage('./img/characters.gif')
    .then(img => {
      const sprites = new SpriteSheet(img, 16,16);
      sprites.define('idle', 276,44, 16,16);
      return sprites;
    });
}
import { createAnim } from './anim.js';
import SpriteSheet from './SpriteSheet.js';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', e => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJson(url) {
  return fetch(url).then(r => r.json());
}

export function loadSpriteSheet(name) {
  return loadJson(`./sprites/${name}.json`)
    .then(sheetSpec => Promise.all([ sheetSpec, loadImage(sheetSpec.imageUrl)]))
    .then(([ sheetSpec, img ]) => {
      const sprites = new SpriteSheet(img, sheetSpec.tileW, sheetSpec.tileH);

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach(tileSpec => {
          const [ x,y ] = tileSpec.index;
          sprites.defineTile(tileSpec.name, x,y);
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach(frameSpec => {
          const { name, rect } = frameSpec;
          sprites.define(name, ...rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach(animSpec => {
          const animation = createAnim(animSpec.frames, animSpec.frameLen);
          sprites.defineAnim(animSpec.name, animation);
        });
      }

      return sprites;
    });
}
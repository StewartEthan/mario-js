import Level from './Level.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import SpriteSheet from './SpriteSheet.js';
import { createAnim } from './anim.js';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', e => {
      resolve(image);
    });
    image.src = url;
  });
}

function loadJson(url) {
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

export function loadLevel(name) {
  return loadJson(`./levels/${name}.json`)
    .then(levelSpec => Promise.all([ levelSpec, loadSpriteSheet(levelSpec.spriteSheet) ]))
    .then(([levelSpec, bkgdSprites]) => {
      const level = new Level();

      createTiles(level, levelSpec.backgrounds, levelSpec.patterns);

      const bkgdLayer = createBackgroundLayer(level, bkgdSprites);
      level.comp.layers.push(bkgdLayer);

      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
}

function createTiles(level, bkgds, patterns, offX = 0, offY = 0) {
  function applyRange(bkgd, xStart,xLen, yStart,yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        const derivedX = x + offX;
        const derivedY = y + offY;

        if (bkgd.pattern) {
          const bkgds = patterns[bkgd.pattern].backgrounds;
          createTiles(level, bkgds, patterns, derivedX, derivedY);
        } else {
          level.tiles.set(derivedX, derivedY, {
            name: bkgd.tile,
            type: bkgd.type
          });
        }
      }
    }
  }

  bkgds.forEach(bkgd => {
    bkgd.ranges.forEach(range => {
      if (range.length === 4) {
        const [ xStart,xLen, yStart,yLen ] = range;
        applyRange(bkgd, xStart,xLen, yStart,yLen);
      } else if (range.length === 3) {
        const [ xStart, xLen, yStart ] = range;
        applyRange(bkgd, xStart,xLen, yStart,1);
      } else if (range.length === 2) {
        const [ xStart, yStart ] = range;
        applyRange(bkgd, xStart,1, yStart,1);
      }
    });
  });
}
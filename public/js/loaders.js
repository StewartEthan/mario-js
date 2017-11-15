import Level from './Level.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';
import { loadBackgroundSprites } from './sprites.js';

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', e => {
      resolve(image);
    });
    image.src = url;
  });
}

function createTiles(level, bkgds) {
  bkgds.forEach(bkgd => {
    bkgd.ranges.forEach(([x1,x2, y1,y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          // sprites.drawTile(bkgd.tile, ctx, x, y);
          level.tiles.set(x,y, {
            name: bkgd.tile
          });
        }
      }
    });
  });
}

export function loadLevel(name) {
  const levelPromise = fetch(`./levels/${name}.json`).then(r => r.json());
  return Promise.all([
    loadBackgroundSprites(),
    levelPromise
  ])
    .then(([bkgdSprites, levelSpec]) => {
      const level = new Level();

      createTiles(level, levelSpec.backgrounds);

      const bkgdLayer = createBackgroundLayer(level, bkgdSprites);
      level.comp.layers.push(bkgdLayer);

      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
}
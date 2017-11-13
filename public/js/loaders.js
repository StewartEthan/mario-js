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

export function loadLevel(name) {
  const levelPromise = fetch(`/levels/${name}.json`).then(r => r.json());
  return Promise.all([
    loadBackgroundSprites(),
    levelPromise
  ])
    .then(([bkgdSprites, levelSpec]) => {
      const level = new Level();

      const bkgdLayer = createBackgroundLayer(levelSpec.backgrounds, bkgdSprites);
      level.comp.layers.push(bkgdLayer);

      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
}
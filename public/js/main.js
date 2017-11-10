import Compositor from './Compositor.js';
import { loadLevel } from './loaders.js';
import { loadBackgroundSprites, loadMarioSprite } from './sprites.js';
import { createBackgroundLayer } from './layers.js';

const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');

function createSpriteLayer(sprite, pos) {
  return function drawSpriteLayer(ctx) {
    const { x, y } = pos;
    sprite.draw('idle', ctx, x,y);
  }
}

Promise.all([
  loadMarioSprite(),
  loadBackgroundSprites(),
  loadLevel('1-1')
])
  .then(([ mario, bkgdSprites, level ]) => {
    const comp = new Compositor();
    const bkgdLayer = createBackgroundLayer(level.backgrounds, bkgdSprites);
    comp.layers.push(bkgdLayer);

    const pos = {
      x: 64,
      y: 64
    };

    const vel = {
      x: 2,
      y: -10
    };

    const spriteLayer = createSpriteLayer(mario, pos);
    comp.layers.push(spriteLayer);

    function update() {
      comp.draw(ctx);
      mario.draw('idle', ctx, pos.x, pos.y);
      pos.x += vel.x;
      pos.y += vel.y;

      requestAnimationFrame(update);
    }

    update();
  });
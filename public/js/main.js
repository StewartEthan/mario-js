import Compositor from './Compositor.js';
import Entity from './Entity.js';
import { Vector } from './math.js';
import { loadLevel } from './loaders.js';
import { loadBackgroundSprites, loadMarioSprite } from './sprites.js';
import { createBackgroundLayer } from './layers.js';

const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');

function createSpriteLayer(entity) {
  return function drawSpriteLayer(ctx) {
    entity.draw(ctx);
  }
}

Promise.all([
  loadMarioSprite(),
  loadBackgroundSprites(),
  loadLevel('1-1')
])
  .then(([ marioSprite, bkgdSprites, level ]) => {
    const comp = new Compositor();
    const bkgdLayer = createBackgroundLayer(level.backgrounds, bkgdSprites);
    comp.layers.push(bkgdLayer);

    const GRAVITY = 0.5;

    const mario = new Entity();
    mario.pos.set(64, 180);
    mario.vel.set(2, -10);

    mario.draw = function drawMario(ctx) {
      const { x, y } = this.pos;
      marioSprite.draw('idle', ctx, x,y);
    }

    mario.update = function updateMario() {
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
    }

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    function update() {
      comp.draw(ctx);
      mario.update();
      mario.vel.y += GRAVITY;
      requestAnimationFrame(update);
    }

    update();
  });
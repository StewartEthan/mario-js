import Compositor from './Compositor.js';
import Timer from './Timer.js';
import Entity from './Entity.js';
import { Vector } from './math.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';
import { loadBackgroundSprites } from './sprites.js';
import { createBackgroundLayer, createSpriteLayer } from './layers.js';

const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadBackgroundSprites(),
  loadLevel('1-1')
])
  .then(([ mario, bkgdSprites, level ]) => {
    const comp = new Compositor();
    const bkgdLayer = createBackgroundLayer(level.backgrounds, bkgdSprites);
    comp.layers.push(bkgdLayer);

    const GRAVITY = 30;
    mario.pos.set(64, 180);
    mario.vel.set(200, -600);

    const spriteLayer = createSpriteLayer(mario);
    comp.layers.push(spriteLayer);

    const timer = new Timer(1/60);

    const DELTA_TIME = 1/60;
    let accTime = 0;
    let lastTime = 0;

    timer.update = function update(time) {
      comp.draw(ctx);
      mario.update(DELTA_TIME);
      mario.vel.y += GRAVITY;
    }

    timer.start();
  });
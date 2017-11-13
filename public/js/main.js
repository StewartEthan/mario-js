import Timer from './Timer.js';
import { loadLevel } from './loaders.js';
import { createMario } from './entities.js';

import KeyboardState from './KeyboardState.js';

const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadLevel('1-1')
])
  .then(([ mario, level ]) => {

    const GRAVITY = 2000;
    mario.pos.set(64, 180);
    
    level.entities.add(mario);

    const SPACE = 32;
    const input = new KeyboardState();
    input.addMapping(SPACE, keyState => {
      if (keyState) {
        mario.jump.start();
      } else {
        mario.jump.cancel();
      }
    });
    input.listenTo(window);

    ['mousdown','mousemove'].forEach(evtName => {
      canvas.addEventListener(evtName, evt => {
        if (evt.buttons === 1) {
          mario.vel.set(0,0);
          mario.pos.set(evt.offsetX, evt.offsetY);
        }
      });
    });

    const timer = new Timer(1/60);

    const DELTA_TIME = 1/60;
    let accTime = 0;
    let lastTime = 0;
    // These next two vars are current hacky workarounds for what I suspect is a computer slowness problem
    // Will remove them, as well as related if/else logic in timer.update if/when that is resolved
    let currentFrames = 0;
    let shouldMarioUpdate = false;

    timer.update = function update(time) {
      // This if/else makes sure mario doesn't update before everything actually renders for the first time
      // Probably an issue with my computer (see nearest comments above) and this hack will be gone once it's not an issue
      // Basically just prevents mario from updating for the first 60 frames
      if (shouldMarioUpdate) {
        level.update(DELTA_TIME);
        mario.vel.y += GRAVITY * DELTA_TIME;
      } else {
        shouldMarioUpdate = currentFrames++ === 60;
      }
      level.comp.draw(ctx);
      // mario.vel.y += GRAVITY * DELTA_TIME;
    }

    timer.start();
  });
import { createCameraLayer, createCollisionLayer } from './layers.js';
import Camera from './Camera.js';
import Timer from './Timer.js';
import { loadEntities } from './entities.js';
import { loadLevel } from './loaders/level.js';
import { setupKeyboard } from './input.js';
// import { setupMouseCtrl } from './debug.js';

const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');

Promise.all([
  loadEntities(),
  loadLevel('1-1')
])
  .then(([ entity, level ]) => {
    const camera = new Camera();
    window.camera = camera;

    const mario = entity.mario();
    mario.pos.set(64, 100);

    const goomba = entity.goomba();
    goomba.pos.x = 220;
    level.entities.add(goomba);

    const koopa = entity.koopa();
    koopa.pos.x = 260;
    level.entities.add(koopa);

    // mario.addTrait({
    //   name: 'hacky',
    //   spawnTimeout: 0,
    //   obstruct() {

    //   },
    //   update(mario, deltaTime) {
    //     if (this.spawnTimeout > 0.1 && mario.vel.y < 0) {
    //       const spawn = createMario();
    //       spawn.pos.x = mario.pos.x;
    //       spawn.pos.y = mario.pos.y;
    //       spawn.vel.y = mario.vel.y - 200;
    //       level.entities.add(spawn);
    //       this.spawnTimeout = 0;
    //     }
    //     this.spawnTimeout += deltaTime;
    //   }
    // });

    // Debug layers
    level.comp.layers.push(
      createCollisionLayer(level),
      // createCameraLayer(camera)
    );

    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    // setupMouseCtrl(canvas, mario, camera);

    const timer = new Timer(1/60);

    const DELTA_TIME = 1/60;
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
        // mario.vel.y += GRAVITY * DELTA_TIME;
      } else {
        shouldMarioUpdate = currentFrames++ === 60;
      }
      if (mario.pos.x > 100) {
        camera.pos.x = mario.pos.x - 100;
      }
      level.comp.draw(ctx, camera);
      // mario.vel.y += GRAVITY * DELTA_TIME;
    };

    timer.start();
  });
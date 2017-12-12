import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import { createDashboardLayer } from './layers/dashboard.js';
import { createLevelLoader } from './loaders/level.js';
import { loadEntities } from './entities.js';
import { loadFont } from './loaders/font.js';
import { setupKeyboard } from './input.js';
// import { setupMouseCtrl } from './debug.js';

function createPlayerEnv(playerEntity) {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64,64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);

  return playerEnv;
}

async function main(canvas) {
  const ctx = canvas.getContext('2d');

  const [ entityFactory, font ] = await Promise.all([ loadEntities(), loadFont() ]);
  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();

  const mario = entityFactory.mario();
  const playerEnv = createPlayerEnv(mario);
  level.entities.add(playerEnv);

  level.comp.layers.push(createDashboardLayer(font, playerEnv));

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
    camera.pos.x = Math.max(0, mario.pos.x - 100);
    level.comp.draw(ctx, camera);
  };

  timer.start();
}

const canvas = document.querySelector('#screen');
main(canvas);
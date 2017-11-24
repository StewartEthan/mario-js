import KeyboardState from './KeyboardState.js';

export function setupKeyboard(mario) {
  const JUMP = 'KeyJ';
  const ACTION = 'KeyK';
  const RIGHT = 'KeyF';
  const LEFT = 'KeyS';
  
  const input = new KeyboardState();
  input.addMapping(JUMP, keyState => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });
  input.addMapping(ACTION, keyState => {
    mario.turbo(keyState);
  });
  input.addMapping(RIGHT, keyState => {
    mario.go.dir += keyState ? 1 : -1;
  });
  input.addMapping(LEFT, keyState => {
    mario.go.dir += keyState ? -1 : 1;
  });

  return input;
}
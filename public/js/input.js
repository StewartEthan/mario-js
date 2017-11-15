import KeyboardState from './KeyboardState.js';

export function setupKeyboard(entity) {
  const SPACE = 'Space';
  const ARROW_RIGHT = 'ArrowRight';
  const ARROW_LEFT = 'ArrowLeft';
  
  const input = new KeyboardState();
  input.addMapping(SPACE, keyState => {
    if (keyState) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });
  input.addMapping(ARROW_RIGHT, keyState => {
    entity.go.dir = keyState;
  });
  input.addMapping(ARROW_LEFT, keyState => {
    entity.go.dir = -keyState;
  });

  return input;
}
import Entity from './Entity.js';
import Jump from './traits/Jump.js';
import Velocity from './traits/Velocity.js';
import { loadMarioSprite } from './sprites.js';

export function createMario() {
  return loadMarioSprite()
    .then(sprite => {
      const mario = new Entity();
      mario.addTrait(new Velocity());
      mario.addTrait(new Jump());

      mario.draw = function drawMario(ctx) {
        const { x, y } = this.pos;
        sprite.draw('idle', ctx, x,y);
      }

      return mario;
    });
}
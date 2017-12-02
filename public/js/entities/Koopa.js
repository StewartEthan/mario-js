import Entity, { Trait } from '../Entity.js';
import Killable from '../traits/Killable.js';
import PendulumMove from '../traits/PendulumMove.js';
import Physics from '../traits/Physics.js';
import Solid from '../traits/Solid.js';
import { loadSpriteSheet } from '../loaders.js';

export function loadKoopa() {
  return loadSpriteSheet('koopa').then(createKoopaFactory);
}

const STATE_WALKING = Symbol('walking');
const STATE_HIDING = Symbol('hiding');
const STATE_PANIC = Symbol('panic');

class Behavior extends Trait {
  constructor() {
    super('behavior');

    this.hideDuration = 5;
    this.hideTime = 0;
    this.panicSpeed = 300;
    this.walkSpeed = null;

    this.state = STATE_WALKING;
  }

  collides(us, them) {
    if (us.killable.dead) return;

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.killable.kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDir = Math.sign(us.vel.x);
      const impactDir = Math.sign(us.pos.x - them.pos.x);

      if (travelDir !== 0 && travelDir !== impactDir) them.killable.kill();
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      us.killable.kill();
      us.vel.set(100, -200);
      us.solid.obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.pendulumMove.enabled = false;
    if (this.walkSpeed === null) this.walkSpeed = us.pendulumMove.speed;

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, deltaTime) {
    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;
      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnim = sprite.animations.get('walk');
  const wakeAnim = sprite.animations.get('wake');

  function routeAnim(koopa) {
    if (koopa.behavior.state === STATE_HIDING) {
      return koopa.behavior.hideTime > 3
        ? wakeAnim(koopa.behavior.hideTime)
        : 'hiding';
    }

    if (koopa.behavior.state === STATE_PANIC) return 'hiding';

    return walkAnim(koopa.lifetime);
  }

  function drawKoopa(ctx) {
    sprite.draw(routeAnim(this), ctx, 0,0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16,16);
    koopa.offset.y = 8;

    koopa.addTrait(new Physics());
    koopa.addTrait(new Solid());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Behavior());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
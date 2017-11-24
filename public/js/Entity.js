import { Vector } from './math.js';

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right')
};

export class Trait {
  constructor(name) {
    this.name = name;
  }

  obstruct() {}

  update() {
    console.warn('Unhandled call to update in Trait instance');
  }
}

export default class Entity {
  constructor() {
    this.pos = new Vector(0,0);
    this.vel = new Vector(0,0);
    this.size = new Vector(0,0);

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });
  }
}
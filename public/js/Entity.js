import { Vector } from './math.js';

export class Trait {
  constructor(name) {
    this.name = name;
  }

  update() {
    console.warn('Unhandled call to update in Trait instance');
  }
}

export default class Entity {
  constructor() {
    this.pos = new Vector(0,0);
    this.vel = new Vector(0,0);

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime);
    });
  }
}
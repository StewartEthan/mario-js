import BoundingBox from './BoundingBox.js';
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
    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach(task => task());
    this.tasks.length = 0;
  }

  queue(task) {
    this.tasks.push(task);
  }

  collides(us, them) {}

  obstruct() {}

  update() {}
}

export default class Entity {
  constructor() {
    this.offset = new Vector(0,0);
    this.pos = new Vector(0,0);
    this.size = new Vector(0,0);
    this.vel = new Vector(0,0);
    
    this.canCollide = true;
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifetime = 0;

    this.traits = [];
  }

  addTrait(trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  collides(candidate) {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  obstruct(side, match) {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  draw() {}

  finalize() {
    this.traits.forEach(trait => trait.finalize());
  }

  update(deltaTime, level) {
    this.traits.forEach(trait => {
      trait.update(this, deltaTime, level);
    });

    this.lifetime += deltaTime;
  }
}
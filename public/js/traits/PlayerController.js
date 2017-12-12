import { Trait } from '../Entity.js';
import { Vector } from '../math.js';

export default class PlayerController extends Trait {
  constructor() {
    super('playerController');

    this.checkpoint = new Vector(0,0);
    this.player = null;
    this.score = 0;
    this.time = 300;
  }

  setPlayer(entity) {
    this.player = entity;

    this.player.stomper.onStomp = (us, them) => {
      this.score += 100;
    };
  }

  update(entity, deltaTime, level) {
    if (!level.entities.has(this.player)) {
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
      this.player.killable.revive();
      level.entities.add(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
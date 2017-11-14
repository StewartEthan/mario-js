import TileResolver from './TileResolver.js';

export default class TileCollider {
  constructor(tileMatrix) {
    this.tiles = new TileResolver(tileMatrix);
  }

  checkY(entity) {
    const { x,y } = entity.pos;
    const match = this.tiles.matchByPosition(x,y);
    if (!match || match.tile.name !== 'ground') return;
    
    if (entity.vel.y > 0 && entity.pos.y > match.y1) {
      entity.pos.y = match.y1;
      entity.vel.y = 0;
    }
  }

  test(entity) {
    this.checkY(entity);
    // const { x,y } = entity.pos;
    // const match = this.tiles.matchByPosition(x,y);
    // if (match) {
      
    // }
  }
}
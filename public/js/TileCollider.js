import TileResolver from './TileResolver.js';

export default class TileCollider {
  constructor(tileMatrix) {
    this.tiles = new TileResolver(tileMatrix);
  }

  test(entity) {
    const { x,y } = entity.pos;
    const match = this.tiles.matchByPosition(x,y);
    if (match) {
      
    }
  }
}
import TileResolver from './TileResolver.js';

export default class TileCollider {
  constructor(tileMatrix) {
    this.tiles = new TileResolver(tileMatrix);
  }

  checkX(entity) {
    let x;
    if (entity.vel.x > 0) {
      x = entity.pos.x + entity.size.x;
    } else if (entity.vel.x < 0) {
      x = entity.pos.x;
    } else {
      return;
    }
    const { y } = entity.pos;
    const matches = this.tiles.searchByRange(x,x, y,y+entity.size.y);

    matches.forEach(match => {
      if (match.tile.name !== 'ground') return;
      
      if (entity.vel.x > 0 && entity.pos.x + entity.size.x > match.x1) {
        entity.pos.x = match.x1 - entity.size.x;
        entity.vel.x = 0;
      } else if (entity.vel.x < 0 && entity.pos.x < match.x2) {
        entity.pos.x = match.x2;
        entity.vel.x = 0;
      }
    });
  }

  checkY(entity) {
    let y;
    if (entity.vel.y > 0) {
      y = entity.pos.y + entity.size.y;
    } else if (entity.vel.y < 0) {
      y = entity.pos.y;
    } else {
      return;
    }

    const { x } = entity.pos;
    const matches = this.tiles.searchByRange(x,x+entity.size.x, y,y);

    matches.forEach(match => {
      if (match.tile.name !== 'ground') return;
      
      if (entity.vel.y > 0 && entity.pos.y + entity.size.y > match.y1) {
        entity.pos.y = match.y1 - entity.size.y;
        entity.vel.y = 0;
      } else if (entity.vel.y < 0 && entity.pos.y < match.y2) {
        entity.pos.y = match.y2;
        entity.vel.y = 0;
      }
    });
  }

  test(entity) {
    this.checkY(entity);
    // const { x,y } = entity.pos;
    // const match = this.tiles.matchByPosition(x,y);
    // if (match) {
      
    // }
  }
}
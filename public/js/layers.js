// function drawBackground(bkgd, ctx, sprites) {
//   bkgd.ranges.forEach(([x1,x2, y1,y2]) => {
//     for (let x = x1; x < x2; ++x) {
//       for (let y = y1; y < y2; ++y) {
//         sprites.drawTile(bkgd.tile, ctx, x, y);
//       }
//     }
//   });
// }

export function createBackgroundLayer(level, sprites) {
  const buffer = document.createElement('canvas');
  buffer.width = 2048;
  buffer.height = 240;

  const ctx = buffer.getContext('2d');

  level.tiles.forEach((tile, x,y) => {
    sprites.drawTile(tile.name, ctx, x,y);
  })

  return function drawBackgroundLayer(ctx, camera) {
    const { x:camX, y:camY } = camera.pos;
    ctx.drawImage(buffer, -camX, -camY);
  }
}

export function createSpriteLayer(entities, w = 64, h = 64) {
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = w;
  spriteBuffer.height = h;
  const spriteBufferCtx = spriteBuffer.getContext('2d');

  return function drawSpriteLayer(ctx, camera) {
    entities.forEach(entity => {
      spriteBufferCtx.clearRect(0,0, w,h);
      entity.draw(spriteBufferCtx);

      const { x,y } = entity.pos;
      const { x:camX, y:camY } = camera.pos;
      ctx.drawImage(spriteBuffer, x-camX, y-camY);
    });
  }
}

export function createCollisionLayer(level) {
  const resolvedTiles = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexDebug(x,y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x,y);
  }

  return function drawCollisions(ctx, camera) {
    ctx.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x,y }) => {
      ctx.beginPath();
      ctx.rect(
        x*tileSize - camera.pos.x,
        y*tileSize - camera.pos.y,
        tileSize, tileSize);
      ctx.stroke();
    });

    level.entities.forEach(entity => {
      const { x,y } = entity.pos;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.rect(
        x-camera.pos.x,
        y-camera.pos.y,
        entity.size.x,entity.size.y);
      ctx.stroke();
    });

    resolvedTiles.length = 0;
  }
}
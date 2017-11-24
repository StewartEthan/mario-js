import TileResolver from './TileResolver.js';

export function createBackgroundLayer(level, tiles, sprites) {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement('canvas');
  buffer.width = 256 + 16;
  buffer.height = 240;

  const ctx = buffer.getContext('2d');

  function redraw(startIdx, endIdx) {
    // if (drawFrom === startIdx && drawTo === endIdx) return;

    ctx.clearRect(0,0, buffer.width,buffer.height);

    for (let x = startIdx; x <= endIdx; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnim(tile.name, ctx, x-startIdx, y, level.totalTime);
          } else {
            sprites.drawTile(tile.name, ctx, x-startIdx, y);
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(ctx, camera) {
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.pos.x);
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo);

    const { x:camX, y:camY } = camera.pos;
    ctx.drawImage(buffer, -camX % 16, -camY % 16);
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

export function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(ctx, fromCamera) {
    ctx.strokeStyle = 'purple';
    ctx.beginPath();
    ctx.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,cameraToDraw.size.y);
    ctx.stroke();
  }
}
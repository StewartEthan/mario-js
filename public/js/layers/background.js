import TileResolver from '../TileResolver.js';

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

    const { x: camX, y: camY } = camera.pos;
    ctx.drawImage(buffer, -camX % 16, -camY % 16);
  };
}
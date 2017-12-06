function createEntityLayer(entities) {
  return function drawBoundingBox(ctx, camera) {
    entities.forEach(entity => {
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.rect(
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x, entity.size.y);
      ctx.stroke();
    });
  };
}

function createTileCandidateLayer(tileCollider) {
  const resolvedTiles = [];
  
  const tileResolver = tileCollider.tiles;
  const tileSize = tileResolver.tileSize;
  
  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexDebug(x,y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x,y);
  };

  return function drawTileCandidates(ctx, camera) {
    ctx.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x,y }) => {
      ctx.beginPath();
      ctx.rect(
        x*tileSize - camera.pos.x,
        y*tileSize - camera.pos.y,
        tileSize, tileSize);
      ctx.stroke();
    });

    resolvedTiles.length = 0;
  }
}

export function createCollisionLayer(level) {
  const drawTileCandidates = createTileCandidateLayer(level.tileCollider);
  const drawBoundingBoxes = createEntityLayer(level.entities);

  return function drawCollisions(ctx, camera) {
    drawTileCandidates(ctx, camera);
    drawBoundingBoxes(ctx, camera);
  };
}
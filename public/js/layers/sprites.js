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
      const { x: camX, y: camY } = camera.pos;
      ctx.drawImage(spriteBuffer, x-camX, y-camY);
    });
  };
}
export function createCameraLayer(cameraToDraw) {
  return function drawCameraRect(ctx, fromCamera) {
    ctx.strokeStyle = 'purple';
    ctx.beginPath();
    ctx.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,cameraToDraw.size.y);
    ctx.stroke();
  };
}
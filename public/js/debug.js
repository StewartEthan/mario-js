export function setupMouseCtrl(canvas, entity, camera) {
  ['mousdown','mousemove'].forEach(evtName => {
    canvas.addEventListener(evtName, evt => {
      if (evt.buttons === 1) {
        entity.vel.set(0,0);
        entity.pos.set(evt.offsetX+camera.pos.x, evt.offsetY+camera.pos.y);
      }
    });
  });
}
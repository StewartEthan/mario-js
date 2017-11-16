export function setupMouseCtrl(canvas, entity, camera) {
  let lastEvent = null;

  ['mousdown','mousemove'].forEach(evtName => {
    canvas.addEventListener(evtName, evt => {
      if (evt.buttons === 1) {
        entity.vel.set(0,0);
        entity.pos.set(evt.offsetX+camera.pos.x, evt.offsetY+camera.pos.y);
      } else if (evt.buttons === 2 && lastEvent && lastEvent.buttons === 2) {
        if (lastEvent.type === 'mousemove') {
          camera.pos.x -= evt.offsetX - lastEvent.offsetX;
        }
      }
      lastEvent = evt;
    });
  });

  canvas.addEventListener('contextmenu', evt => {
    evt.preventDefault();
  });
}
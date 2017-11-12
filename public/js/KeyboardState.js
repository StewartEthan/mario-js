const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    // Contains current state of any given key
    this.keyStates = new Map();

    // Callback for any given key
    this.keyMap = new Map();
  }

  addMapping(keyCode, fn) {
    this.keyMap.set(keyCode, fn);
  }

  handleEvent(evt) {
    const { keyCode } = evt;

    if (!this.keyMap.has(keyCode)) return;

    evt.preventDefault();
    const keyState = evt.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(keyCode) === keyState) return;

    this.keyStates.set(keyCode, keyState);
    this.keyMap.get(keyCode)(keyState);
  }

  listenTo(window) {
    ['keydown','keyup'].forEach(evtName => {
      window.addEventListener(evtName, e => { 
        this.handleEvent(e);
      });
    });
  }
}
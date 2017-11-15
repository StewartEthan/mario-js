const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    // Contains current state of any given key
    this.keyStates = new Map();

    // Callback for any given key
    this.keyMap = new Map();
  }

  addMapping(code, fn) {
    this.keyMap.set(code, fn);
  }

  handleEvent(evt) {
    const { code } = evt;

    if (!this.keyMap.has(code)) return;

    evt.preventDefault();
    const keyState = evt.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keyStates.get(code) === keyState) return;

    this.keyStates.set(code, keyState);
    this.keyMap.get(code)(keyState);
  }

  listenTo(window) {
    ['keydown','keyup'].forEach(evtName => {
      window.addEventListener(evtName, e => { 
        this.handleEvent(e);
      });
    });
  }
}
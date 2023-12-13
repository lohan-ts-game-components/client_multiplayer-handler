export class KeyboardManager {
  // Object to track the state of keys (pressed or not).
  private readonly _keys: { [key: string]: number } = {};

  // Constructor is empty as no initialization is needed.
  constructor() {}

  /**
   * Sets up event listeners for key press and release.
   * Handles keys like KeyW, KeyS, KeyA, KeyD, ArrowUp, ArrowDown, etc.
   */
  watch() {
    this.unwatch(); // Clear any existing listeners before setting new ones.
    window.onkeydown = (event: KeyboardEvent) => {
      event.stopPropagation(); // Prevents event bubbling.
      this._keys[event.code] = 1; // Set key state to 1 (pressed).
    };
    window.onkeyup = (event: KeyboardEvent) => {
      event.stopPropagation(); // Prevents event bubbling.
      this._keys[event.code] = 0; // Set key state to 0 (released).
    };
  }

  // Removes key event listeners.
  unwatch() {
    window.onkeydown = null;
    window.onkeyup = null;
  }

  // Returns the state of a specific key (0 if not pressed, 1 if pressed).
  state(key: string): number {
    return this._keys[key] ?? 0; // If key is not tracked, returns 0.
  }
}

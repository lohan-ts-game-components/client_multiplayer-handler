export class FPS {
  // Variables to keep track of FPS calculations.
  private _fpsCounter: number = 0;
  private _fpsTimer: number = 0;
  private _fpsCount: number = 0;
  private _displayTimer: number = 0; // Timer for when to display FPS.

  constructor() {}

  /**
   * Calculates FPS over a one-second interval.
   */
  private updateFPS() {
    const now = performance.now();
    if (this._fpsTimer === 0) {
      this._fpsTimer = now; // Initialize timer on first call.
    }
    const deltaTime = now - this._fpsTimer;
    this._fpsCounter += 1;

    // Update FPS count every second.
    if (deltaTime >= 1000) {
      this._fpsCount = this._fpsCounter; // Store the count of frames per second.
      this._fpsCounter = 0; // Reset frame counter.
      this._fpsTimer = now; // Reset timer.
    }
  }

  /**
   * Update method to be called in the game loop to continuously update FPS.
   */
  public update() {
    this.updateFPS(); // Call FPS calculation.

    // Display the FPS count once per second.
    const now = performance.now();
    if (now - this._displayTimer >= 1000) {
      document.getElementById("fps").innerText = `${this._fpsCount}`; // Update FPS display.
      this._displayTimer = now; // Reset the display timer.
    }
  }

  /**
   * Returns the current FPS count.
   */
  public getFPS(): number {
    return this._fpsCount;
  }
}

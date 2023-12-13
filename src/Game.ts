import { Draw } from "./Draw";
import { FPS } from "./FPS";
import { KeyboardManager } from "./KeyboardManager";
import { Player } from "./Player";

// Defines the type for Game's constructor arguments.
export type GameProps = {
  readonly draw: Draw;
  readonly keyboard: KeyboardManager;
  readonly websocket: WebSocket;
};

export class Game {
  // Variables for time management and game elements.
  private time: number = -1;
  private deltaTime: number = 1;
  private _player: Player;
  private _fps: FPS;

  /**
   * Constructor initializes the game with drawing, keyboard, and WebSocket instances.
   */
  constructor(
    private readonly _draw: Draw,
    private readonly _keyboard: KeyboardManager,
    private readonly _websocket: WebSocket
  ) {
    this._player = Player.create({ game: this });
    this._fps = new FPS();

    console.log("Game created!");
    this.render(0); // Starts the rendering process.
  }

  /**
   * Method for initializing the game. Currently returns the game instance.
   */
  public async init(): Promise<Game> {
    return this;
  }

  // Getter methods for accessing private properties.
  get draw() {
    return this._draw;
  }
  get websocket() {
    return this._websocket;
  }
  get player() {
    return this._player;
  }
  get keyboard() {
    return this._keyboard;
  }

  /**
   * Updates game state, including time and player position.
   */
  private update(time: number) {
    // Update delta time.
    this.deltaTime = this.time === -1 ? 0 : time - this.time;
    this.time = time;

    // Update player and FPS counter.
    if (this._player) {
      this._player.update(this.deltaTime);
    }
    this._fps.update();
  }

  /**
   * Renders the game frame and schedules the next render.
   */
  private render(time: number) {
    this.update(time); // Updates game state.
    this.draw.clear(); // Clears the canvas.

    // Draw the player.
    if (this._player) {
      this.draw.drawArc(
        this._player.x,
        this._player.y,
        10,
        0,
        Math.PI * 2,
        "red",
        true
      );
    }

    this.draw.syncScreen(); // Finalize drawing.
    requestAnimationFrame(this.render.bind(this)); // Schedule next frame.
  }

  // Factory method to create a Game instance.
  static create(props: GameProps): Game {
    return new Game(props.draw, props.keyboard, props.websocket);
  }

  // Method to create and launch the game.
  static createAndLaunch(props: GameProps): Game | false {
    const game = Game.create(props);
    return game.init() && game;
  }
}

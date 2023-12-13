///<reference lib="dom"/>

// Import necessary modules and classes.
import { pack } from "msgpackr";
import { Game } from "./Game";
import { KeyboardManager } from "./KeyboardManager";

// Type definition for player properties.
export type PlayerProps = {
  readonly game: Game;
};

export class Player {
  // Private properties for the player's position and movement.
  private _x: number = 0; // Current x position.
  private _y: number = 0; // Current y position.
  private targetX: number = 0; // Target x position for interpolation.
  private targetY: number = 0; // Target y position for interpolation.
  private lerpFactor: number = 0.1; // Factor for linear interpolation.
  private kb: KeyboardManager; // Instance of KeyboardManager for input handling.

  // Stores the last direction of the player.
  private lastDirection = { up: 0, right: 0, down: 0, left: 0 };

  // Constructor to initialize the player with a game instance.
  constructor(private readonly game: Game) {
    this.kb = game.keyboard;
    console.log("Player created!");
  }

  // Getter for x position.
  get x() {
    return this._x;
  }

  // Getter for y position.
  get y() {
    return this._y;
  }

  // Handles player movement based on keyboard input.
  private move() {
    // Check the state of each key (WASD).
    const keyUp = this.kb.state("KeyW");
    const keyDown = this.kb.state("KeyS");
    const keyLeft = this.kb.state("KeyA");
    const keyRight = this.kb.state("KeyD");

    // Determine if the direction has changed.
    const directionChanged =
      keyUp !== this.lastDirection.up ||
      keyDown !== this.lastDirection.down ||
      keyLeft !== this.lastDirection.left ||
      keyRight !== this.lastDirection.right;

    // Send new direction to server and update lastDirection if changed.
    if (directionChanged) {
      const direction = {
        up: keyUp,
        right: keyRight,
        down: keyDown,
        left: keyLeft,
      };
      this.game.websocket.send(pack({ clientDirection: direction }));
      this.lastDirection = {
        up: keyUp,
        right: keyRight,
        down: keyDown,
        left: keyLeft,
      };
    }
  }

  // Updates the player's target position based on data from the server.
  private updatePosition(newX: number, newY: number) {
    this.targetX = newX;
    this.targetY = newY;
  }

  // Interpolates the player's position for smooth movement.
  private interpolatePosition() {
    this._x += (this.targetX - this._x) * this.lerpFactor;
    this._y += (this.targetY - this._y) * this.lerpFactor;
  }

  // Update method called every frame to handle movement and interpolation.
  public update(dt: number) {
    this.move();
    this.interpolatePosition();
  }

  // Static method to create a new Player instance.
  static create(props: PlayerProps): Player {
    return new Player(props.game);
  }
}

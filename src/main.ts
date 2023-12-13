// Import necessary classes and the stylesheet.
import { Draw } from "./Draw";
import { Game } from "./Game";
import { KeyboardManager } from "./KeyboardManager";
import "./style.css";

// Variables for game instance and WebSocket.
let game: Game | any;
let ws: WebSocket;

// Function to establish and manage WebSocket connection.
function connectWebSocket() {
  // Initialize WebSocket with the server URL.
  ws = new WebSocket("ws://localhost:8000");

  // When the WebSocket connection opens, set up the game.
  ws.addEventListener("open", () => {
    console.log("WebSocket connection opened.");

    // Set up drawing context and keyboard manager.
    const canvas = document.getElementById("canvas") as HTMLElement;
    const draw = Draw.create({ canvas: canvas, alpha: true });
    const kbm = new KeyboardManager();

    // Create and start the game.
    game = Game.createAndLaunch({ draw, keyboard: kbm, websocket: ws });
    if (game) {
      console.log("Start Game!");
      kbm.watch();
    } else {
      console.error("Game not created!");
    }
  });

  // Handle incoming messages from the server.
  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.clientPosition) {
      game.player.updatePosition(data.clientPosition.x, data.clientPosition.y);
    }
  });

  // Attempt to reconnect if the WebSocket connection closes.
  ws.addEventListener("close", () => {
    console.log("WebSocket connection closed.");
    setTimeout(connectWebSocket, 2000); // Retry connection after 2 seconds.
  });

  // Log WebSocket errors.
  ws.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });
}

// Initiate WebSocket connection.
connectWebSocket();

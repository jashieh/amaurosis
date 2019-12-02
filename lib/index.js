import Game from './game';
import GameView from './game_view';


document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  // canvasEl.width = Game.DIM_X;
  // canvasEl.height = Game.DIM_Y;

  canvasEl.width = 1000;
  canvasEl.height = 600;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();
  const game = new Game();

  window.game = game;

  new GameView(game, ctx).start();

});



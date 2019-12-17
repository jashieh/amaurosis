import Game from './game';
import GameView from './game_view';

let gameView;

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  // canvasEl.width = Game.DIM_X;
  // canvasEl.height = Game.DIM_Y;

  canvasEl.width = Game.VIEW_X;
  canvasEl.height = Game.VIEW_Y;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();

  // window.game = game;

  gameView = new GameView(ctx).start();

});




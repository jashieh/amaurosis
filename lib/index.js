import Game from './game';
import GameView from './game_view';
import MovingObject from './moving_object';
import Player from './player';


document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  const ctx = canvasEl.getContext("2d");

  window.canvas = canvasEl;
  window.rect = canvasEl.getBoundingClientRect();
  const game = new Game();

  window.game = game;

  new GameView(game, ctx).start();

});



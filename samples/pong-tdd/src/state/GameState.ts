import { action, makeAutoObservable, observable } from "mobx";
import {
  BALL_SPEED,
  HALF_HEIGHT,
  HALF_WIDTH,
  HEIGHT,
  MAX_SCORE,
  PAD_HEIGHT,
  PAD_WIDTH,
  PLAYERS_SPEED,
  WIDTH,
} from "../CONSTANTS";

export class GameState {
  paused = false;
  ball = {
    x: HALF_WIDTH,
    y: HALF_HEIGHT,
    velocity: { x: 1, y: 1 },
  };
  score = { player1: 0, player2: 0 };
  lastScored: "player1" | "player2" | null = null;
  player1 = { x: PAD_WIDTH, y: HALF_HEIGHT };
  player2 = { x: WIDTH - PAD_WIDTH, y: HALF_HEIGHT };
  winner: "player1" | "player2" | null = null;

  constructor() {
    makeAutoObservable(this, {
      paused: observable,
      ball: observable,
      score: observable,
      winner: observable,
      lastScored: observable,
      player1: observable,
      player2: observable,
      updateBall: action,
      increaseScore: action,
    });
  }

  increaseScore(player: "player1" | "player2") {
    this.score[player]++;
    this.lastScored = player;
    if (this.score.player1 === MAX_SCORE || this.score.player2 === MAX_SCORE) {
      this.winner =
        this.score.player1 > this.score.player2 ? "player1" : "player2";
    }
  }

  updateBall(delta: number) {
    this.ball.x += this.ball.velocity.x * delta * BALL_SPEED;
    this.ball.y += this.ball.velocity.y * delta * BALL_SPEED;

    if (this.ball.y < 0 || this.ball.y > HEIGHT) {
      this.ball.velocity.y *= -1;
    }

    if (this.ball.x < 0) {
      this.increaseScore("player2");
      this.paused = true;
    }

    if (this.ball.x > WIDTH) {
      this.increaseScore("player1");
      this.paused = true;
    }

    if (this.collidesWith("player1") && this.ball.x < PAD_WIDTH && this.ball.velocity.x < 0) {
      this.bouceAndSpeedUp();
    }

    if (this.collidesWith("player2") && this.ball.x > WIDTH - PAD_WIDTH && this.ball.velocity.x > 0) {
      this.bouceAndSpeedUp();
    }
  }

  bouceAndSpeedUp() {
    this.ball.velocity.x *= -1;
    this.ball.velocity.x *= 1.05;
    this.ball.velocity.y *= 1.05;
  }

  collidesWith(player: "player1" | "player2") {
    return (
      this.ball.y > this[player].y - PAD_HEIGHT * 0.5 &&
      this.ball.y < this[player].y + PAD_HEIGHT * 0.5
    );
  }

  moveUp(target: "player1" | "player2", delta: number) {
    this[target].y -= delta * PLAYERS_SPEED;

    if (this[target].y < PAD_HEIGHT * 0.5) {
      this[target].y = PAD_HEIGHT * 0.5;
    }
  }

  moveDown(target: "player1" | "player2", delta: number) {
    this[target].y += delta * PLAYERS_SPEED;

    if (this[target].y > HEIGHT - PAD_HEIGHT * 0.5) {
      this[target].y = HEIGHT - PAD_HEIGHT * 0.5;
    }
  }

  reset() {
    this.ball = {
      x: HALF_WIDTH,
      y: HALF_HEIGHT,
      velocity: this.lastScored === 'player1' ? { x: -1, y: 1 } : { x: 1, y: 1 },
    };
    this.paused = false;
  }
}

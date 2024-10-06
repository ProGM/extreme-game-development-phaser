import { Scene } from "phaser";
import { HEIGHT, WIDTH } from "../CONSTANTS";
import { Score } from "../objects/score";

type WSKeys = { w: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key };
const BALL_SPEED = 300;
const PLAYERS_SPEED = 600;
const MAX_SCORE = 5;

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  ball: Phaser.GameObjects.Sprite;
  player1: Phaser.GameObjects.Sprite;
  player2: Phaser.GameObjects.Sprite;
  arrows: Phaser.Types.Input.Keyboard.CursorKeys;
  ws: WSKeys;
  score: Score;

  ballPaused = false;
  ballDirection = { x: 1, y: 1 };
  ballSpeed = BALL_SPEED;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.score = new Score(this, WIDTH / 2, 30);

    this.createBall();

    this.player1 = this.add.sprite(10, 300, "bar");
    this.player2 = this.add.sprite(WIDTH - 10, 300, "bar");

    this.arrows = this.input.keyboard?.createCursorKeys()!;
    this.ws = this.input.keyboard!.addKeys("w,s") as WSKeys;
  }

  reset(direction: number) {
    if (
      this.score.player1Score === MAX_SCORE ||
      this.score.player2Score === MAX_SCORE
    ) {
      this.scene.start("GameOver", {
        winner:
          this.score.player1Score > this.score.player2Score
            ? "player1"
            : "player2",
      });
      return;
    }

    this.scene.pause();

    setTimeout(() => {
      this.scene.resume();
      this.ball.setPosition(WIDTH / 2, HEIGHT / 2);
      this.ballSpeed = BALL_SPEED;
      this.ballPaused = true;
      this.ballDirection = { x: direction, y: Math.sign(Math.random() - 0.5) };

      this.player1.setPosition(10, HEIGHT / 2);
      this.player2.setPosition(WIDTH - 10, HEIGHT / 2);

      this.time.delayedCall(1000, () => {
        this.ballPaused = false;
      });
    }, 2000);
  }

  update(_: number, delta: number) {
    this.updatePlayer(this.player1, delta, this.arrows.up.isDown, this.arrows.down.isDown);
    this.updatePlayer(this.player2, delta, this.ws.w.isDown, this.ws.s.isDown);

    if (!this.ballPaused) {
      this.updateBall(delta);
    }
  }

  private createBall() {
    this.ball = this.add.sprite(400, 300, "ball");
  }

  private updateBall(delta: number) {
    if (this.ball.y < this.ball.height / 2 || this.ball.y > HEIGHT - this.ball.height / 2) {
      this.ballDirection.y *= -1;
    }

    if (this.ball.x < this.ball.width / 2) {
      this.score.increasePlayer2Score();
      this.reset(1);
    }

    if (this.ball.x > WIDTH - this.ball.width / 2) {
      this.score.increasePlayer1Score();
      this.reset(-1);
    }

    const ballBounds = this.ball.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(ballBounds, this.player1.getBounds())) {
      this.ballDirection.x = 1;
      this.ballSpeed *= 1.05;
    }

    if (Phaser.Geom.Intersects.RectangleToRectangle(ballBounds, this.player2.getBounds())) {
      this.ballDirection.x = -1;
      this.ballSpeed *= 1.05;
    }

    this.ball.x += this.ballSpeed * delta / 1000 * this.ballDirection.x;
    this.ball.y += this.ballSpeed * delta / 1000 * this.ballDirection.y;
  }

  private updatePlayer(player: Phaser.GameObjects.Sprite, delta: number, isDirectionUp: boolean, isDirectionDown: boolean) {
    if (isDirectionUp) {
      player.y -= PLAYERS_SPEED * delta / 1000;
      player.y = Math.max(player.height / 2, player.y);
    } else if (isDirectionDown) {
      player.y += PLAYERS_SPEED * delta / 1000;
      player.y = Math.min(HEIGHT - player.height / 2, player.y);
    }
  }
}

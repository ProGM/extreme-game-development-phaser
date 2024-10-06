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
  ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  player2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  arrows: Phaser.Types.Input.Keyboard.CursorKeys;
  ws: WSKeys;
  score: Score;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.score = new Score(this, WIDTH / 2, 30);

    this.createBall();

    this.player1 = this.physics.add.sprite(10, 300, "bar");
    this.player1.setCollideWorldBounds(true);
    this.player1.setImmovable(true);

    this.player2 = this.physics.add.sprite(WIDTH - 10, 300, "bar");
    this.player2.setCollideWorldBounds(true);
    this.player2.setImmovable(true);

    this.arrows = this.input.keyboard?.createCursorKeys()!;
    this.ws = this.input.keyboard!.addKeys("w,s") as WSKeys;

    this.setupPhysics();
  }

  private setupPhysics() {
    this.physics.add.collider(
      this.ball,
      this.player1,
      this.handlePaddleBallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.player2,
      this.handlePaddleBallCollision,
      undefined,
      this
    );

    this.physics.world.on("worldbounds", (e: any) => {
      if (e.left === 0) {
        this.score.increasePlayer2Score();
        this.reset(1);
      }
      if (e.right === WIDTH) {
        this.score.increasePlayer1Score();
        this.reset(-1);
      }
    });
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
      this.ball.setVelocity(0, 0);

      this.player1.setPosition(10, HEIGHT / 2);
      this.player2.setPosition(WIDTH - 10, HEIGHT / 2);

      this.time.delayedCall(1000, () => {
        this.ball.setVelocity(
          BALL_SPEED * direction,
          BALL_SPEED * Math.sign(Math.random() - 0.5)
        );
      });
    }, 2000);
  }

  handlePaddleBallCollision() {
    const body = this.ball.body;

    this.fixCollisionIssueWithBorders(body);
    const vel = body.velocity;
    vel.x *= 1.05;
    vel.y *= 1.05;

    body.setVelocity(vel.x, vel.y);
  }

  fixCollisionIssueWithBorders(body: Phaser.Physics.Arcade.Body) {
    if (Math.abs(body.velocity.x) < BALL_SPEED) {
      body.setVelocityX(BALL_SPEED * Math.sign(body.velocity.x));
    }
    if (Math.abs(body.velocity.y) < BALL_SPEED) {
      body.setVelocityY(BALL_SPEED * Math.sign(body.velocity.y));
    }
  }

  update() {
    this.updatePlayer1();
    this.updatePlayer2();
  }

  private createBall() {
    this.ball = this.physics.add.sprite(400, 300, "ball");
    this.ball.body.setCircle(8);
    this.ball.body.setVelocity(BALL_SPEED, BALL_SPEED);
    this.ball.setMaxVelocity(BALL_SPEED * 2);
    this.ball.setCollideWorldBounds(true, 1, 1, true);
    this.ball.setBounce(1, 1);
  }

  private updatePlayer2() {
    if (this.arrows.up.isDown) {
      this.player2.body.setVelocityY(-PLAYERS_SPEED);
    } else if (this.arrows.down.isDown) {
      this.player2.body.setVelocityY(PLAYERS_SPEED);
    } else {
      this.player2.body.setVelocityY(0);
    }
  }

  private updatePlayer1() {
    if (this.ws.w.isDown) {
      this.player1.body.setVelocityY(-PLAYERS_SPEED);
    } else if (this.ws.s.isDown) {
      this.player1.body.setVelocityY(PLAYERS_SPEED);
    } else {
      this.player1.body.setVelocityY(0);
    }
  }
}

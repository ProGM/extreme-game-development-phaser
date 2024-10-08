import { Scene } from "phaser";
import { WIDTH } from "../CONSTANTS";
import { Score } from "../objects/score";
import { GameState } from "../state/GameState";
import { autorun } from "mobx";

type WSKeys = { w: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key };

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  ball: Phaser.GameObjects.Sprite;
  player1: Phaser.GameObjects.Sprite;
  player2: Phaser.GameObjects.Sprite;
  arrows: Phaser.Types.Input.Keyboard.CursorKeys;
  ws: WSKeys;
  score: Score;
  hooks: (() => void)[] = [];

  readonly state = new GameState();

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.score = new Score(this, WIDTH / 2, 30);

    this.ball = this.add.sprite(0, 0, "ball");

    this.player1 = this.add.sprite(0, 300, "bar");
    this.player2 = this.add.sprite(WIDTH, 300, "bar");

    this.arrows = this.input.keyboard?.createCursorKeys()!;
    this.ws = this.input.keyboard!.addKeys("w,s") as WSKeys;

    this.setupStateEvents();
  }

  autorun(fn: () => void) {
    this.hooks.push(autorun(fn));
  }

  setupStateEvents() {
    this.autorun(() => {
      this.ball.setPosition(this.state.ball.x, this.state.ball.y);
    })

    this.autorun(() => {
      this.player1.setPosition(this.state.player1.x, this.state.player1.y);
      this.player2.setPosition(this.state.player2.x, this.state.player2.y);
    })

    this.autorun(() => {
      this.score.updateScore(this.state.score.player1, this.state.score.player2);
    })

    this.autorun(() => {
      if (this.state.paused) {
        this.scene.pause();
        setTimeout(() => {
          this.state.reset();
        }, 2000);
      } else {
        this.scene.resume();
      }
    });

    this.autorun(() => {
      if (this.state.winner) {
        this.scene.start("GameOver", { winner: this.state.winner });
      }
    });

    this.events.on("shutdown", this.stopped, this);
  }

  update(_: number, delta: number) {
    this.state.updateBall(delta / 1000);

    this.updateInputs(delta);
  }

  stopped() {
    this.hooks.forEach((clear) => clear());
  }

  updateInputs(delta: number) {
    if (this.arrows.up.isDown) {
      this.state.moveUp("player2", delta / 1000);
    }

    if (this.arrows.down.isDown) {
      this.state.moveDown("player2", delta / 1000);
    }

    if (this.ws.w.isDown) {
      this.state.moveUp("player1", delta / 1000);
    }

    if (this.ws.s.isDown) {
      this.state.moveDown("player1", delta / 1000);
    }
  }
}

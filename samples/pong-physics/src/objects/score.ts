import { Scene } from "phaser";

export class Score extends Phaser.GameObjects.Text {
  player1Score = 0;
  player2Score = 0;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "0 - 0", {
      fontFamily: "Arial Black",
      fontSize: 38,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });

    scene.add.existing(this);

    this.setOrigin(0.5, 0);
  }

  increasePlayer1Score() {
    this.player1Score++;
    this.updateScore();
  }

  increasePlayer2Score() {
    this.player2Score++;
    this.updateScore();
  }

  updateScore() {
    this.setText(`${this.player1Score} - ${this.player2Score}`);
  }
}

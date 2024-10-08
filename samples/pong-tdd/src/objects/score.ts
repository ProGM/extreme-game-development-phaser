import { Scene } from "phaser";

export class Score extends Phaser.GameObjects.Text {
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

  updateScore(score1: number, score2: number) {
    this.setText(`${score1} - ${score2}`);
  }
}

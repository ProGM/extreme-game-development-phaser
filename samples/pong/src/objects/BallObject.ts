
export class BallObject extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ball');
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
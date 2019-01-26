
export default class extends Phaser.Physics.Matter.Sprite {
    constructor(config) {
        super(config.scene.matter.world, config.x, config.y, 'enemy');
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.path = config.path;
        this.moving = false;

        this.currentPathPointIndex = 0;
        this.alerted = false;

        this.speed = 0.5;
        this.enemyAngle = this.shownAngle = 0;

        this.player = config.player;
        this.spottedPlayer = false;
        
        setTimeout(() => {
            this.spottedPlayer = true;
            this.spotPlayer();
        }, 5000);
    }

    spotPlayer() {
        this.anims.stop('enemy');
        this.anims.play('enemy-shoot');

        let rads = Phaser.Math.Angle.BetweenPoints(
            new Phaser.Geom.Point(this.x, this.y),
            new Phaser.Geom.Point(this.player.x, this.player.y)
        )
        this.enemyAngle = rads * (180 / Math.PI);
    }

    update() {
        // Follow the path
        this.setVelocityX(0);
        this.setVelocityY(0);
        const currentPathPoint = this.path.find((point) => point.id === this.currentPathPointIndex);
        let moving = false;

        this.shownAngle += (((((this.enemyAngle - this.shownAngle) % 360) + 540) % 360) - 180) * 0.1;
        this.setAngle(this.shownAngle);

        if(this.spottedPlayer) return;

        if (currentPathPoint) {
            let rads = Phaser.Math.Angle.BetweenPoints(
                new Phaser.Geom.Point(this.x, this.y),
                new Phaser.Geom.Point(currentPathPoint.x, currentPathPoint.y)
            )
            this.enemyAngle = rads * (180 / Math.PI);

            const distanceToCurrentPoint =
                Phaser.Math.Distance.Between(
                    currentPathPoint.x,
                    currentPathPoint.y,
                    this.x,
                    this.y);

            if (distanceToCurrentPoint > 5) {
                moving = true;
                const speed = this.speed;
                if (currentPathPoint.x < this.x) {
                    this.setVelocityX(-speed);
                } else if (currentPathPoint.x > this.x) {
                    this.setVelocityX(speed);
                }

                if (currentPathPoint.y < this.y) {
                    this.setVelocityY(-speed);
                } else if (currentPathPoint.y > this.y) {
                    this.setVelocityY(speed);
                }
            } else {
                if (currentPathPoint.finalPoint) {
                    this.currentPathPointIndex = 0;
                    moving = false;
                } else {
                    this.currentPathPointIndex++;
                    moving = false;
                }

            }
        }

        if (moving) {
            this.anims.play('enemy', true);
        } else {
            this.anims.stop('enemy');
        }

        if (!this.alerted) {
            // Follow the path
        }
    }
}
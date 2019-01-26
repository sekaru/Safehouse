import Phaser from "phaser";
import MapManager from "../maps/MapManager";
import Player from "../gameplay/Player";

export default class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        this.showPhone = false;
        this.phone = null;
        this.phoneContainer = null;
    }

    preload() {
      this.load.image('player', 'src/assets/sprites/fridge.png');
      this.load.image('phone', 'src/assets/images/phone.png');
      this.load.image('speaker_off', 'src/assets/images/icons/speaker_off.png');
      this.load.image('speaker_on', 'src/assets/images/icons/speaker_on.png');
    }

    create() {
        this.mapManager = new MapManager(1, this);

        const camera = this.cameras.main;
        const cameraBounds = this.mapManager.getCameraBounds();

        // camera.setViewport(0, 0, cameraBounds.width, cameraBounds.height);

        this.add.text(10, 10, 'Welcome to the game', { font: '48px Arial', fill: '#fff' });

        this.player = new Player({
            scene: this,
            x: 40,
            y: 40,
            key: 'player'
        });

        this.phone = this.add.image(0, 0, 'phone');
        this.phone.setScale(0.75);
        const speaker = this.add.image(0, 0, 'speaker_off').setInteractive();
        speaker.setScale(1.25);
        
        this.input.on('gameobjectdown', this.onPhoneClick);

        this.phoneContainer = this.add.container(this.phone.width / 2 + 10, this.sys.game.canvas.height + this.phone.height) 
        this.phoneContainer.add([this.phone, speaker]);

        this.input.keyboard.on('keydown_SPACE', () => {
          this.showPhone = !this.showPhone;
          this.tweens.add({
            targets: this.phoneContainer,
            y: this.showPhone ? this.sys.game.canvas.height - this.phone.height / 2 - 10 : this.sys.game.canvas.height + this.phone.height,
            duration: 400,
            ease: 'Power2'
          });
      }, this);
    }

    onPhoneClick(pointer, gameObject) {
        gameObject.setTexture('speaker_on');
    }

    update() {
        this.player.handleMovement();
    }
}
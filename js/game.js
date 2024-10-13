import Phaser from 'phaser';

// create a new scene named "Game"
const gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  this.words = [{
    key: 'building',
    setXY: {
      x: 100,
      y: 240
    },
    spanish: 'edificio',
  }, {
    key: 'house',
    setXY: {
      x: 240,
      y: 280
    },
    setScale: {
      x: 0.8,
      y: 0.8
    },
    spanish: 'casa',
  }, {
    key: 'car',
    setXY: {
      x: 400,
      y: 300
    },
    setScale: {
      x: 0.8,
      y: 0.8
    },
    spanish: 'automóvil',
  }, {
    key: 'tree',
    setXY: {
      x: 550,
      y: 250
    },
    spanish: 'árbol',
  }]
}

// load asset files for our game
gameScene.preload = function() {
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
  this.load.audio('correct', 'assets/audio/correct.mp3');
  this.load.audio('wrong', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {
  this.items = this.add.group(this.words);

  this.bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  this.items.setDepth(1);

  const items = this.items.getChildren();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    item.setInteractive();

    // creating tween - resize tween
    item.correctTween = this.tweens.add({
      targets: item,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut',
      persist: true
    });

    item.wrongTween = this.tweens.add({
      targets: item,
      alpha: 0.7,
      duration: 200,
      angle: 90,
      paused: true,
      persist: true,
      yoyo: true,
      ease: 'Quad.easeInOut',
    });

    item.on('pointerdown', function(pointer) {
      const result = this.processAnswer(this.words[i].spanish);

      if (result) {
        item.correctTween.play();
      } else {
        item.wrongTween.play();
      }

      this.showNewQuestion();
    }, this);

    // item.on('pointerover', function (pointer) {
    //   item.alphaTween.play();
    // }, this);
    //
    // item.on('pointerout', function (pointer) {
    //   item.alpha = 1;
    // }, this);

    this.words[i].sound = this.sound.add(this.words[i].key + 'Audio');
  }

  this.wordText = this.add.text(30, 20, '', {
    font: '28px Open Sans',
    fill: '#ffffff'
  });

  // correct / wrong sounds
  this.correctSound = this.sound.add('correct');
  this.wrongSound = this.sound.add('wrong');

  // sound functions
  // const soundSample = this.sound.add('correct');
  // soundSample.play();
  // soundSample.stop();
  // soundSample.pause();
  // soundSample.resume();

  // show first question
  this.showNewQuestion();
};

gameScene.showNewQuestion = function () {
  this.nextWord = Phaser.Math.RND.pick(this.words);

  // play a sound for the new word
  this.nextWord.sound.play();

  // show the text of the word in Spanish
  this.wordText.setText(this.nextWord.spanish);
}

// answer processing
gameScene.processAnswer = function (userResponse) {
  if (userResponse === this.nextWord.spanish) {
    this.correctSound.play();

    return true;
  } else {
    this.wrongSound.play();

    return false;
  }
}

// our game's configuration
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
const game = new Phaser.Game(config);

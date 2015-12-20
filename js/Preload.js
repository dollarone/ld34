var PlatformerGame = PlatformerGame || {};


//loading the game assets
PlatformerGame.Preload = function(){};


PlatformerGame.Preload.prototype = {
  preload: function() {

    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', 'assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level3', 'assets/tilemaps/level3.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level4', 'assets/tilemaps/level4.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('mytiles', 'assets/images/tiles.png');
    this.game.load.spritesheet('tiles', 'assets/images/tiles.png', 64, 64);
    this.game.load.spritesheet('mushrooms', 'assets/images/shrooms.png', 28, 33);
    this.game.load.spritesheet('spikes', 'assets/images/spikes.png', 64, 18);
    this.game.load.spritesheet('rock', 'assets/images/rock.png', 20, 20);
    this.game.load.spritesheet('john', 'assets/images/john3.png', 40, 65);

    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.game.load.spritesheet('logo-tiles', 'assets/images/logo-tiles.png', 17, 16);

    this.game.load.audio('theme', 'assets/audio/theme.ogg');
    
    this.game.load.audio('injured1', 'assets/audio/au.ogg');
    this.game.load.audio('injured2', 'assets/audio/auuu.ogg');
    this.game.load.audio('injured3', 'assets/audio/ouf.ogg');

    this.game.load.audio('eat1', 'assets/audio/mmm.ogg');
    this.game.load.audio('eat2', 'assets/audio/nomnom.ogg');
    this.game.load.audio('eat3', 'assets/audio/ohm.ogg');

    this.game.load.audio('shroom1', 'assets/audio/ooh.ogg');
    this.game.load.audio('shroom2', 'assets/audio/laugh.ogg');
    this.game.load.audio('shroom3', 'assets/audio/rotten.ogg');

    this.game.load.audio('random1', 'assets/audio/hmm.ogg');
    this.game.load.audio('random2', 'assets/audio/song.ogg');


  },
  create: function() {
    this.state.start('Game');
  },


};

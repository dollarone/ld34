var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(800, 600, Phaser.AUTO, '', null, false, false);

        //  The Google WebFont Loader will look for this object, so create it before loading the script.
            WebFontConfig = {

      //  'active' means all requested fonts have finished loading
      //  We set a 1 second delay before calling 'createText'.
      //  For some reason if we don't the browser cannot render the text the first time it's created.
      active: function() { PlatformerGame.game.time.events.add(Phaser.Timer.SECOND, PlatformerGame.game.state.states['Game'].createText, PlatformerGame.game.state.states['Game']); },

      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: {
        families: ['Slabo::latin', 'Oswald', 'Rokkitt::latin']
      }

    };

//, '', { preload: preload, create: create, update: update });

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Intro', PlatformerGame.Intro);
PlatformerGame.game.state.add('Story', PlatformerGame.Story);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');
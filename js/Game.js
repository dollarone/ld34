var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //Change the background colour
        this.game.stage.backgroundColor = "#a9f0ff";
     
        // This maps the tiles in your sprite sheet to the phaser ninja tiles to be used
        this.slopeMap = { 
         '1':  0, '2':  1, '3':  2, '4':  3, '5':  4, '6':  5, '7':  6, '8':  7, 
         '9':  8, '10': 9, '11':10, '12':11, '13':12, '14':13, '15':14, '16':15, 
         '17':16, '18':17, '19':18, '20':19, '21':20, '22':21, '23':22, '24':23, 
         '25':24, '26':25, '27':26, '28':27, '29':28, '30':29, '31':30, '32':31, 
         '33':32, '34':33, '35': 1, '36': 1, '37': 1, '38': 1, '39': 0, '40': 0,
// rock:        
         '41': 1, '42': 1, '43': 1, '44': 1, '45': 1, '46': 1, '47': 0, '48': 0,
         '49': 1, '50': 1, '51': 1, '52': 1, '53': 1, '54': 1, '55': 1, '56': 1,

         '57': 0, '58': 1, '59': 2, '60': 3, '61': 4, '62': 5, '63': 6, '64': 7, 
         '65': 8, '66': 9, '67':10, '68':11, '69':12, '70':13, '71':14, '72':15, 
         '73':16, '74':17, '75':18, '76':19, '77':20, '78':21, '79':22, '80':23, 
         '81':24, '82':25, '83':26, '84':27, '85':28, '86':29, '87':30, '88':31, 
         '89':32, '90':33, '91': 1, '92': 1, '93':31, '94':33, '95': 0, '96': 0,
//john:
         '97': 1, '98': 1, '99': 1,'100': 1,'101': 1,'102': 1,'103': 0,'104': 0,
        '105': 1,'106': 1,'107': 1,'108': 1,'109': 0,'110': 0,'111': 0,'112': 0,

        '113': 0,'114': 1,'115': 2,'116': 3,'117': 4,'118': 5,'119': 6,'120': 7, 
        '121': 8,'122': 9,'123':10,'124':11,'125':12,'126':13,'127':14,'128':15, 
        '129':16,'130':17,'131':18,'132':19,'133':20,'134':21,'135':22,'136':23, 
        '137':24,'138':25,'139':26,'140':27,'141':28,'142':29,'143':30,'144':31, 
        '145':32,'146':33,'147': 1,'148': 1,'149': 1,'150': 1,'151':14,'152': 1,
// greens
        '153': 1,'154': 1,'155': 1,'156': 1,'157': 1,'158': 1,'159': 1,'160': 1,
        '161':31,'162':31,'163':31,'164':31,'165':30,'166':30,'167':30,'168':30,
        '169': 1,'170': 1,'171': 1,'172': 1,'173': 1,'174': 1,'175': 1,'176': 0,
        '177':31,'178':33,'179': 1,'180': 1,'181': 1,'182': 1,'183': 1,'184': 1
    }; 

        this.game.physics.ninja.gravity = 0.6;

        this.showDebug = false;

        this.thisLevel = 1;
        this.levelNames = ['level_0_is_secret',  'level1', 'level2', 'level3'];
        this.won = false;
        //  The score
        this.fontStyle = { font: "23px Oswald", fill: "#000", align: "center" };
        this.fontStyleSmall = { font: "14px Arial", fill: "#000000", align: "center" };

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.rkey.onDown.add(this.playerHitReset, this);

        this.pkey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.pkey.onDown.add(this.pause, this);

        this.zkey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.xkey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);

        this.pauseText = PlatformerGame.game.add.text(380, 300, 'Paused', this.fontStyleSmall);
        this.pauseText.fixedToCamera = true;
        this.pauseText.visible = false;      
 
        this.loadLevel(this.levelNames[this.thisLevel]);
        this.resetVars();

        this.resetItemsGroup();
        this.createItems();

        this.goToNextLevel = false;

        this.game.sound.volume = 0.7;


        this.sound_injured1 = this.game.add.audio('injured1');
        this.sound_injured2 = this.game.add.audio('injured2');
        this.sound_injured3 = this.game.add.audio('injured3');

        this.sound_eat1 = this.game.add.audio('eat1');
        this.sound_eat2 = this.game.add.audio('eat2');
        this.sound_eat3 = this.game.add.audio('eat3');
        this.sound_eat1.volume = 0.3;

        this.sound_shroom1 = this.game.add.audio('shroom1');
        this.sound_shroom2 = this.game.add.audio('shroom2');
        this.sound_shroom3 = this.game.add.audio('shroom3');

        this.sound_random1 = this.game.add.audio('random1');
        this.sound_random2 = this.game.add.audio('random2');
        this.sound_random1.volume = 0.5;
        this.sound_random2.volume = 0.25;

        this.music = this.game.add.audio('theme');
        this.music.loop = true;
        this.music.play();

        this.elapsedTime = 0;
        this.scoreText = this.game.add.text(350, 12, '', this.fontStyle);
        this.scoreText.fixedToCamera = true;
        this.scoreText2 = this.game.add.text(32, 12, '', this.fontStyle);
        this.scoreText2.fixedToCamera = true;
        this.timeText = this.game.add.text(562, 12, '', this.fontStyle);
        this.timeText.fixedToCamera = true;

        this.timer = 0;
    
    },

    introMusicStopped: function(event) {
        this.music.play();
    },

    update: function() {
        this.timer++;
        this.elapsedTime = this.game.time.totalElapsedSeconds();
        this.scoreText.text = "Mushrooms eaten:  " + this.mushroomsEaten;
        this.scoreText2.text = "Total mushrooms in this level:  " + this.totalMushrooms;
        this.timeText.text = "Total game time:  " + (this.elapsedTime).toFixed(1);
       // this.scoreText2.text = "JumpSpeed : " + this.jumpUpSpeed + " Speed : " + this.speed;
      //  this.timeText.text = Math.min(this.player.body.maxSpeed, Math.max(-this.player.body.maxSpeed, this.player.body.shape.pos.x - this.player.body.shape.oldpos.x + (-this.speed * this.game.time.physicsElapsed)));
        if (this.playerIsDead) {
            this.playerDied();
        }

        if(this.game.rnd.integerInRange(1, 5000) == 1) {
            this.playRandomSound();
        }

        this.player.animations.currentAnim.speed = this.speed / 2;

        if (this.mushroomsEaten == this.totalMushrooms && this.distanceToExit() < 120) {
            this.exitIsOpening = true;
        }

        if (this.exitIsOpening && !this.exitIsOpen) {
            this.exitIsOpen = true;
            this.exit.animations.play('open');

            this.exit.animations.currentAnim.onComplete.add( function () {   
                this.exit.animations.play('glimmer');
                this.exitIsReady = true;
            }, this);
        }

        if(this.distanceToExit() < 70 && this.exitIsReady) {
            this.goToNextLevel = true;;
        }

        if (this.goToNextLevel) {
            this.goToNextLevel = false;

            this.thisLevel++;
            if (this.thisLevel == this.levelNames.length) {
                this.winGame();
            }
            else {
                this.loadLevel(this.levelNames[this.thisLevel]);
                this.resetVars();
        	this.resetItemsGroup();
        	this.createItems();
            }

        }

        if (this.playerHurtCooldown > 0) {
            this.playerHurtCooldown--;
         
        }

        // Death by leaving map (on top is ok)
        if (this.player.body.y > this.map.height*this.map.tileHeight + this.player.body.height || this.player.body.x < -this.player.body.width || 
            this.player.body.x > this.map.width*this.map.tileWidth + this.player.body.width) {
            this.playerDied();
        }

        if (this.timer % 100 == 0) {
            this.avalancheLaunchers.forEach(function(avalancheLauncher) {
                sprite = this.items.create(avalancheLauncher.x, avalancheLauncher.y, 'rock');
                this.game.physics.ninja.enable(sprite);
                sprite.special = 'rock';
                sprite.body.moveLeft(65);
                sprite.body.collideWorldBounds = false;

                sprite.body.friction = 0.02;
                }, this);
        }


        this.game.physics.ninja.overlap(this.player, this.items, this.collectItem, null, this);

        for (var i = 0; i < this.tiles.length; i++) {
            if (this.player.body.aabb.collideAABBVsTile(this.tiles[i].tile)) {
//            if (this.player.body.circle.collideCircleVsTile(this.tiles[i].tile) ) {
                if (this.player.body.touching.down || this.tiles[i].tile.y + this.tileOffsetY > this.player.y) {
                    this.playerCanJump = true;
                }
                else {
                    this.playerCanJump = false;
                }
            }
            
            this.items.forEach(function(item) {
                item.body.aabb.collideAABBVsTile(this.tiles[i].tile);
                if (item.special == 'rock') {
                        //item.body.moveLeft(30);
                }
            }, this);
       
        }

        this.keyControls();
    },


    keyControls: function() {

        if (this.cursors.left.isDown) {

            if (this.direction != 0) {
                this.direction = (this.direction + 1) % 2;
                this.resetSpeed();
                this.player.scale.setTo(-this.currentSize, this.currentSize);
            }

            if (this.playerCanJump) {
                this.player.body.moveLeft(this.speed);
                this.player.scale.setTo(-this.currentSize, this.currentSize);
                this.player.animations.play('right');
            }
            else {
                this.player.body.moveLeft(this.jumpSpeed);
                this.player.animations.stop(); 
                this.player.frame = 96;  
            }
        }
        else if (this.cursors.right.isDown) {

            if (this.direction != 1) {
                this.direction = (this.direction + 1) % 2;
                this.resetSpeed();
                this.player.scale.setTo(this.currentSize, this.currentSize);
            }

            if (this.playerCanJump) {
                this.player.body.moveRight(this.speed);
                this.player.animations.play('right');
            }
            else {
                this.player.body.moveRight(this.jumpSpeed);
                this.player.animations.stop();
                this.player.frame = 96;  
            }
        }
        else {
                this.player.animations.stop();
                this.player.frame = 96;            
        }

        if (this.zkey.isDown) {

            if (!this.run) {
                this.run = true;
            }

            if (this.playerCanJump) {
                this.speed += this.speedIncrement;
                this.speed = Math.min(this.speed, this.runMaxSpeed);
                this.jumpSpeed += this.speedIncrement;
                this.jumpSpeed = Math.min(this.jumpSpeed, this.jumpMaxSpeed);
            }
        }
        else if (this.run) {
            this.run = false;
            this.resetSpeed();
        }

        if (this.xkey.isDown) {

            if (this.playerCanJump && this.player.body.touching.down) {
                this.player.body.moveUp(390 + (this.jumpUpSpeed + this.speed)*this.playerSize);
                this.playerCanJump = false;
//                this.scoreText.text = Math.min(this.player.body.maxSpeed, Math.max(-this.player.body.maxSpeed, this.player.body.shape.pos.y - this.player.body.shape.oldpos.y + (-this.speed * this.game.time.physicsElapsed)));

            }
        }        
    },
    resetSpeed: function() {
        this.run = false;
        this.speed = this.walkSpeed;
        this.jumpSpeed = this.jumpBaseSpeed;
    },

    createPlayer : function(x, y, size) {
        this.player = this.game.add.sprite(x, y, 'john');
        this.player.scale.setTo(size);
        this.playerSize = size;

        //  We need to enable physics on the player
        this.game.physics.ninja.enable(this.player);
        //this.game.physics.ninja.enableCircle(this.player, this.player.width / 2);
        this.game.camera.follow(this.player);

        this.player.body.bounce.y = 0.0001; //0.2;
        this.player.body.friction = 0.1;
        this.player.body.drag = 0.99;
        this.player.body.collideWorldBounds = false;
        this.player.anchor.setTo(0.5, 0.5);


        this.player.animations.add('right', [0,1,2,3,4,4,5, 0,1,2,3,4,4,5, 6,7,8,9,10,10,11], 10, true);


       // this.jumpUpSpeed += this.jumpUpSpeedLevelIncrement;

        if (this.direction == 0) {
            this.player.scale.setTo(-size, size);
            this.player.animations.play('right');
        }
        else {
            this.player.animations.play('right');
        }

    },

    createItems: function() {
        //this.items = this.game.add.group();
        
        result = this.findObjectsByType('item', this.map, 'ObjectLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },

    createCreatures: function() {
        this.creatures = this.game.add.group();
        
        result = this.findObjectsByType('creature', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.creatures);
        }, this);
    },

    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite;
        var offsetY = 0;
        if ('offsetY' in element.properties) {
            offsetY = parseInt(element.properties.offsetY);
        }

        if ('special' in element.properties) {
            if (element.properties.special == "mushroom" || element.properties.special == "shroom") {
                sprite = group.create(element.x, element.y - 33 + offsetY, 'mushrooms');
                this.totalMushrooms++;
                this.game.physics.ninja.enable(sprite);

            }
            else if (element.properties.special == "spikes") {
                sprite = group.create(element.x, element.y - 18 + offsetY, 'spikes'); // 20?? why?
                this.game.physics.ninja.enable(sprite);
                sprite.body.gravityScale = 0;
            }
            else if (element.properties.special == "avalanche") {
                sprite = group.create(element.x, element.y - 64 + offsetY, 'tiles');
                this.avalancheLaunchers.add(sprite);
                this.game.physics.ninja.enable(sprite);
                sprite.body.gravityScale = 0;  
            }
        }
        else { /// what are these?
            sprite = group.create(element.x, element.y - 64 + offsetY, 'tiles'); // - 64 y??
                 
        }

        sprite.frame = parseInt(element.properties.frame);
        

        if ('scales' in element.properties) {
            sprite.scale.setTo(parseInt(element.properties.scales), parseInt(element.properties.scales));
        }        
        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },

    collectItem : function(player, item) {

        if (item.special == "exit") {
            this.goToNextLevel = true;            
        }
        else if (item.special == "spikes" || item.special == "rock") {
            if (this.playerHurtCooldown == 0) {
                this.playerHurt(player);
            }
            else {
                this.playerCanJump = true;
            }
        }
        else if (item.special == "mushroom") { 
            item.kill();
            this.playRandomEatSound();
            this.mushroomsEaten++;
        }
        else if (item.special == "shroom") { 
            item.kill();
            this.playRandomShroomSound();
            this.mushroomsEaten++; 
            this.currentSize *= this.growthFactor;

            this.createPlayer(player.x - (player.body.width * this.growthFactor / 2), 
                player.y - player.body.height, 
                this.currentSize);
            player.kill();
            
        }

    },    

    playerHurt: function(player) {
        this.playRandomPainSound();

        if (this.currentSize == 1) {
            this.playerIsDead = true;
        }
        else {
            this.playerHurtCooldown = this.playerHurtCooldownBase;

            this.currentSize = 1;
                
            this.createPlayer(player.x - (this.originalWidth * this.growthFactor / 2), 
                player.y - 5*this.currentSize - (this.originalHeight * this.growthFactor / 2), this.currentSize);
            player.kill();
            this.jumpUpSpeed = this.jumpUpBaseSpeed;

            var tween = this.game.add.tween(this.player).to( { alpha: 0.5 }, 50, "Linear", true, 0, 4);
            tween.yoyo(true, 150);
        }

  
    },

    winGame: function() {
        this.pauseText = PlatformerGame.game.add.text(510, 220, 'You cleared all the levels!\n   Well done!\n   Thanks for playing!', this.fontStyle);
        this.pauseText.fixedToCamera = true;
        this.game.paused = true;
        this.won = true;
        this.submitHighscore("anon", this.elapsedTime*100);
    },


    loadLevel : function(levelName) {

        if (this.map) {    
            this.map.destroy();
            this.player.destroy();
            this.backgroundLayer.destroy();
            this.groundLayer.destroy();
            this.textGroup.destroy();
            this.foregroundLayer.destroy();
            this.exit.destroy();
            this.avalancheLaunchers.destroy();            
        }
        this.map = this.game.add.tilemap(levelName);
        
        this.map.addTilesetImage('tiles', 'mytiles');

        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');
        this.tiles = this.game.physics.ninja.convertTilemap(this.map, this.groundLayer, this.slopeMap);

        this.map.setCollisionBetween(1, 10000, true, 'GroundLayer');

        this.groundLayer.resizeWorld();

        var result = this.findObjectsByType('exit', this.map, 'ObjectLayer');

        var offsetY = 0;
        if ('offsetY' in result[0].properties) {
            offsetY = parseInt(result[0].properties.offsetY);
        }
        var scales = 0;
        if ('scales' in result[0].properties) {
            scales = parseInt(result[0].properties.scales);
        }


        this.exit = this.game.add.sprite(result[0].x, result[0].y + offsetY - 64, 'tiles');
        this.exit.frame = 111;
        this.exit.anchor.setTo(0, 0);

        if ('scales' in result[0].properties) {
            var scales = parseInt(result[0].properties.scales);
            this.exit.scale.setTo(scales, scales);
        }

        this.exitEntryX = this.exit.x + this.exit.width/2;
        this.exitEntryY = this.exit.y + this.exit.height/2;
        this.exit.animations.add('open', [168,169,170], 2, false);
        this.exit.animations.add('glimmer', [170,171,172,173], 10, true);


        this.avalancheLaunchers = this.game.add.group();

        this.resetItemsGroup();
        this.totalMushrooms = 0;
        this.createItems();

        var result = this.findObjectsByType('playerStart', this.map, 'ObjectLayer');
        this.createPlayer(result[0].x, result[0].y - 65, 1);
        
        this.textGroup = this.game.add.group();

        this.foregroundLayer = this.map.createLayer('ForegroundLayer');

        if (levelName == 'level1') {
            text = this.game.add.text(32, 416, '', this.fontStyle);
            //text.text = "Grumpy wizards make toxic brew for the evil Queen and Jack." //Press up to jump!"
            text.text = "Ah, perhaps you will want to get up up and away? Press X to jump!";
            this.textGroup.add(text);

            text = this.game.add.text(1509, 416, '', this.fontStyle);
            text.text = "Sometimes you need a bit more speed. Hold Z to run!";
            this.textGroup.add(text);

            text = this.game.add.text(3009, 416, '', this.fontStyle);
            text.text = "Find and eat all the mushrooms in each level!";
            this.textGroup.add(text);

            text = this.game.add.text(4009, 416, '', this.fontStyle);
            text.text = "The exit gate will only open once all mushrooms have been eaten!";
            this.textGroup.add(text);

            text = this.game.add.text(4709, 416, '', this.fontStyle);
            text.text = "Below is your exit!";
            this.textGroup.add(text);
this.submitHighscore("start",this.elapsedTime);
        }
        else if (levelName == 'level2') {
            text = this.game.add.text(932, 416, '', this.fontStyle);
            
            text.text = "Hmmm... that looks like a long jump...";
            this.textGroup.add(text);

            text = this.game.add.text(2932, 416, '', this.fontStyle);
            
            text.text = "Careful - those spikes look painful!";
            this.textGroup.add(text);


            text = this.game.add.text(3632, 416, '', this.fontStyle);
            
            text.text = "Hmmm. How to proceed?";
            this.textGroup.add(text);


        }
    },

    resetItemsGroup: function() {
        if (this.items) {
            this.items.destroy();
        }
        this.items = this.game.add.group();
    },

    resetVars : function() {

        this.playerCanJump = false;
        this.playerJumpTimer = 0;
        this.timer = 0;

        this.currentSize = 1;

        this.jumpUpBaseSpeed = 160;
        this.jumpUpSpeed = this.jumpUpBaseSpeed;
        this.jumpUpSpeedLevelIncrement = 100;

        this.growthFactor = 1.5;
        this.tileOffsetY = this.player.width / 3;

        this.originalWidth = this.player.width;
        this.originalHeight = this.player.height;

        this.direction = 1;
        this.player.animations.play('right');
        this.player.scale.setTo(this.currentSize);
        this.run = false;
        this.shifted = false;

        this.runMaxSpeed = 90;
        this.walkSpeed = 20;
        this.jumpBaseSpeed = 3;
        this.jumpMaxSpeed = 3;
        this.speedIncrement = 3;
        this.speed = this.walkSpeed;
        this.jumpSpeed = this.jumpBaseSpeed;

        this.hasPressedJump = false;
        this.run = false;
        this.finished = false;

        this.playerHurtCooldownBase = 100;
        this.playerHurtCooldown = 0;
        this.playerIsDead = false;

        this.exitIsOpening = false;
        this.exitIsOpen = false;
        this.exitIsReady = false;
        this.mushroomsEaten = 0;
        this.totalMushrooms = 0;
    },

    playerHitReset : function() {
        if (!this.game.paused) {
            this.playerDied();
        }
    },

    playerDied : function() {

        this.player.kill();
        this.resetVars();
        var result = this.findObjectsByType('playerStart', this.map, 'ObjectLayer');
        this.createPlayer(result[0].x, result[0].y - 65, 1);

        this.resetItemsGroup();
        this.createItems();

    },

    pause : function() {
        if (!this.won) {
            this.pauseText.visible = !this.pauseText.visible;
            this.game.paused = !this.game.paused;
        }

    },

    distanceToExit: function() { //, b) {
        var xs = this.exitEntryX - this.player.x;
        xs = xs * xs;

        var ys = this.exitEntryY - this.player.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },

    playRandomPainSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_injured1.play();
                break;
            case 2: 
                this.sound_injured2.play();
                break;
            default:
                this.sound_injured3.play();
                break;
        }
    },


    playRandomEatSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_eat1.play();
                break;
            case 2: 
                this.sound_eat2.play();
                break;
            default:
                this.sound_eat3.play();
                break;
        }
    },

    playRandomShroomSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_shroom1.play();
                break;
            case 2: 
                this.sound_shroom2.play();
                break;
            default:
                this.sound_shroom3.play();
                break;
        }
    },

    playRandomSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_random1.play();
                break;
            case 2: 
                this.sound_random2.play();
                break;
            default:
                this.sound_shroom2.play(); // laugh
                break;
        }
    },

    render : function() {

        if (this.showDebug) {

            this.game.debug.body(this.player);
        }

    },

    createText : function() {
    },

    submitHighscore : function(name,score) {

        var xmlhttp;

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if(xmlhttp.status == 200){
                }
                else if(xmlhttp.status == 400) {
                    console.log('There was an error 400')
                }
                else {
                    console.log('something else other than 200 was returned')
                }
            }
        }

        var data = "name=" + name + "&score=" + score;
        xmlhttp.open("POST", "http://myperfectgame.com/node/ld34/submitHighscore", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send(data);
    },
};

var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  We're going to be using physics, so enable the Arcade Physics system
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Change the background colour
        this.game.stage.backgroundColor = "#a9f0ff";
     
        // This maps the tiles in your sprite sheet to the phaser ninja tiles to be used
        this.slopeMap = { '1':0, '2':1, '3':2, '4':3, '5':4, '6':5, '7':6, '8':7, '9':8, 
        '10': 9, '11':10, '12':11, '13':12, '14':13, '15':14, '16':15, '17':16, '18':17, '19':18, 
        '20':19, '21':20, '22':21, '23':22, '24':23, '25':24 , '26':25, '27':26, '28':27, '29':28,
        '30':29, '31':30, '32':31, '33':32, '34':33, '35':1 , '36':1, '37':1, '38':1, '39':1, '40':1 }; 

        this.game.physics.ninja.gravity = 0.4;

        this.thisLevel = 1;
        this.levelNames = ['level_0_is_secret', 'level1', 'level2', 'level3'];
        this.won = false;
        //  Finally some stars to collect
/*

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(i * 70, 0, 'star');
            this.game.physics.ninja.enable(star);

            //  Let gravity do its thing
            //star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 10.7 + Math.random() * 20;
        }
*/
        //  The score
        this.fontStyle = { font: "23px Oswald", fill: "#000", align: "center" };
        this.fontStyleSmall = { font: "14px Arial", fill: "#000000", align: "center" };

//        this.pausedText = this.game.add.text(this.player.x, this.player.y, "Paused ", this.styleSmall);

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.rkey = this.game.input.keyboard.addKey(Phaser.Keyboard.O);
        this.rkey.onDown.add(this.playerHitReset, this);

        this.pkey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.pkey.onDown.add(this.pause, this);

        this.pauseText = PlatformerGame.game.add.text(380, 300, 'Paused', this.fontStyleSmall);
        this.pauseText.fixedToCamera = true;
        this.pauseText.visible = false;      
        
        this.loadLevel(this.levelNames[this.thisLevel]);
        this.resetVars();
        this.goToNextLevel = false;

    },

    update: function() {
        
        if (this.goToNextLevel) {
            this.goToNextLevel = false;

            this.thisLevel++;
            if (this.thisLevel == this.levelNames.length) {
                this.winGame();
            }
            else {
                this.loadLevel(this.levelNames[this.thisLevel]);
                this.resetVars();
            }

        }

        // Death by leaving map (on top is ok)
        if (this.player.body.y > this.map.height*this.map.tileHeight + this.player.body.height || this.player.body.x < -this.player.body.width || 
            this.player.body.x > this.map.width*this.map.tileWidth + this.player.body.width) {
            this.playerDied();
        }

        this.game.physics.ninja.overlap(this.player, this.stars, this.collectStar, null, this);
        this.game.physics.ninja.overlap(this.player, this.items, this.collectItem, null, this);

        //  Collide the player and the stars with the platforms
        //this.game.physics.ninja.collide(this.stars, this.groundLayer); 
        
//this.game.physics.ninja.collide(this.stars, this.tiles);
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.player.body.aabb.collideAABBVsTile(this.tiles[i].tile)) {
//            if (this.player.body.circle.collideCircleVsTile(this.tiles[i].tile) ) {
                if (this.player.body.touching.down || this.tiles[i].tile.y + this.tileOffsetY > this.player.y) {
                    //&& 
                    //(this.tiles[i].tile.x + 100 < this.player.x || this.tiles[i].tile.x - 100 > this.player.x)) {
                    this.playerCanJump = true;
                }
                else {
                    this.playerCanJump = false;
                }
            }
     
            //if (this..body.aabb.collideAABBVsTile(this.tiles[i].tile)) {
            //for (var j = 0; j < this.stars.length; j++) {
            this.stars.forEach(function(star) {
                star.body.aabb.collideAABBVsTile(this.tiles[i].tile);
           //     this.game.physics.ninja.collide(this.stars, this.tiles[i].tile);//, this.collectStar, null, this);
          //      star.body.aabb.collideAABBVsTile(this.tiles[i].tile);
            }, this);
            
            this.items.forEach(function(item) {
                item.body.aabb.collideAABBVsTile(this.tiles[i].tile);
            }, this);
       
        }

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        //this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        if (this.cursors.down.isDown) {
            if (!this.shifted) {
                this.shifted = true;
                this.direction = (this.direction + 1) % 2;
                this.resetSpeed();
                this.player.animations.stop();
                this.player.frame = 4;
            }
        }
        else {
            if (this.shifted) {
                if (this.direction == 0) {
                    this.player.animations.play('left');    
                }
                else {
                    this.player.animations.play('right');
                }
                this.shifted = false;
            }

            if (this.direction == 0) {
                
                if (this.playerCanJump) {
                    this.player.body.moveLeft(this.speed);
                }
                else {
                    this.player.body.moveLeft(this.jumpSpeed);
                }
            }
            else if (this.direction == 1) {
                //this.player.animations.play('right');
                if (this.playerCanJump) {
                    this.player.body.moveRight(this.speed);
                }
                else {
                    this.player.body.moveRight(this.jumpSpeed);
                }
            }
        }

        if (this.cursors.up.isDown) {
            this.hasPressedJump = true;
            this.run = true;
        }

        
        if (this.playerJumpTimer == 1) {
            this.resetSpeed();
            this.player.body.moveUp(this.jumpUpBaseSpeed + this.jumpSpeed*7);
            this.playerJumpTimer--;
        }
        else if (this.playerJumpTimer > 1) {
            this.player.body.moveUp(this.jumpUpBaseSpeed + this.jumpSpeed*7);
            this.playerJumpTimer--;

        }
        else if (!this.cursors.up.isDown && this.hasPressedJump) {

            if (this.playerCanJump && this.player.body.touching.down) {
                this.player.body.moveUp(this.jumpUpBaseSpeed + this.jumpSpeed*7);
                this.playerCanJump = false;
                this.playerJumpTimer = this.jumpTime;
                
                if (this.jumpMaxSpeed == this.jumpSpeed) {
                    this.playerJumpTimer++;
                }
            }
            this.speed = this.walkSpeed;
            this.run = false;
            this.hasPressedJump = false;
        }

        if (this.run) {
            this.speed += this.speedIncrement;
            this.speed = Math.min(this.speed, this.runMaxSpeed);
            this.jumpSpeed += this.speedIncrement;
            this.jumpSpeed = Math.min(this.jumpSpeed, this.jumpMaxSpeed);
        }
        
    },

    resetSpeed: function() {
        this.run = false;
        this.speed = this.walkSpeed;
        this.jumpSpeed = this.jumpBaseSpeed;
    },


    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {
        
        if (!this.playerCanJump && this.player.body.blocked.down) {
            
            this.sound_land.play(); // sounds horrible
        }
        if (this.player.body.blocked.down) {
            this.playerCanJump = true;
        
        }
    },

    resetJumpUnconditionally: function(player, tile) {

        if (!this.playerCanJump) {
           this.sound_crunch.volume = 0.3;
           this.sound_crunch.play();// sounds horrible
           this.sound_land.play();
        }
        this.playerCanJump = true;
    },

    createPlayer : function(x, y, size) {
        this.player = this.game.add.sprite(x, y, 'dude');
        this.player.scale.setTo(size);

        //  We need to enable physics on the player
        this.game.physics.ninja.enable(this.player);
        //this.game.physics.ninja.enableCircle(this.player, this.player.width / 2);
        this.game.camera.follow(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.friction = 0.1;
        this.player.body.drag = 0.9;
        this.player.body.collideWorldBounds = false;
        //this.player.anchor.setTo(0.5, 0.665);
        this.player.anchor.setTo(0.5, 0.5);

        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.jumpTime += 4;
        this.jumpVelocity += 150;

        if (this.direction == 0) {
            this.player.animations.play('left');
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
/*        result = this.findObjectsByType('boss', this.map, 'objectsLayer');
        this.boss = this.creatures.create(result[0].x, result[0].y, 'objects');
        this.boss.scale.setTo(4, 4);
        this.boss.y -= 48;
        this.boss.frame = 1;
        this.boss['type'] = 'boss';
        */
    },

    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y + 32 , 'diamond');
        sprite.frame = parseInt(element.properties.frame);
        this.game.physics.ninja.enable(sprite);
        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },


    collectStar : function(player, star) {
    
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },
    collectItem : function(player, item) {

        if (item.special == "exit") {
            this.goToNextLevel = true;            
        }
        else {
            // Removes the star from the screen
            item.kill();

            this.currentSize *= this.growthFactor;
            this.createPlayer(player.x - (player.body.width * this.growthFactor / 2), 
                player.y - 5*this.currentSize - (player.body.height * this.growthFactor / 2), this.currentSize);
            

            player.kill();
        }

    },    

    winGame: function() {
        this.pauseText = PlatformerGame.game.add.text(290, 220, 'You cleared all the levels!\n   Well done!\n   Thanks for playing!', this.fontStyle);
        this.pauseText.fixedToCamera = true;
        this.game.paused = true;
        this.won = true;
      
    },


    render : function() {

        if (this.showDebug) {

            this.game.debug.body(this.player);

            //this.creatures.forEach(function(creature) {
                //this.game.debug.bodyInfo(creature, 132, 132);
                
            //}, this);
        }

    },

    loadLevel : function(levelName) {

        if (this.map) {    
            this.map.destroy();
            this.player.destroy();
            this.backgroundLayer.destroy();
            this.groundLayer.destroy();
            this.textGroup.destroy();
            this.stars.destroy();
            this.foregroundLayer.destroy();
            //this.coins.destroy();
        }
        this.map = this.game.add.tilemap(levelName);
        this.map.addTilesetImage('ninja-tiles64', 'mytiles');

        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');
        this.tiles = this.game.physics.ninja.convertTilemap(this.map, this.groundLayer, this.slopeMap);

        this.map.setCollisionBetween(1, 1000, true, 'GroundLayer');

        this.groundLayer.resizeWorld();

        this.resetItemsGroup();
        this.createItems();

        var result = this.findObjectsByType('playerStart', this.map, 'ObjectLayer');
        this.createPlayer(result[0].x, result[0].y, 1);
        this.foregroundLayer = this.map.createLayer('ForegroundLayer');
        
        this.textGroup = this.game.add.group();

        if (levelName == 'level1') {
            text = this.game.add.text(32, 416, '', this.fontStyle);
            //text.text = "Grumpy wizards make toxic brew for the evil Queen and Jack." //Press up to jump!"
            text.text = "Ah, perhaps you will want to get up up and away? Press up to jump!";
            this.textGroup.add(text);

            text = this.game.add.text(1509, 416, '', this.fontStyle);
            text.text = "Sometimes you need a bit more speed. Hold up to run!";
            this.textGroup.add(text);

            text = this.game.add.text(3009, 416, '', this.fontStyle);
            text.text = "Not sure which way you want to go? Press down to change direction!";
            this.textGroup.add(text);

            text = this.game.add.text(4009, 416, '', this.fontStyle);
            text.text = "You can also hold down to stay still.";
            this.textGroup.add(text);

            text = this.game.add.text(5009, 416, '', this.fontStyle);
            text.text = "Below is your exit! Have fun!";
            this.textGroup.add(text);

        }

        this.stars = this.game.add.group();
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
        this.jumpUpBaseSpeed = 80;
        this.jumpTime = 7;
        this.growthFactor = 1.5;
        this.tileOffsetY = this.player.width / 3;

        this.originalWidth = this.player.width;
        this.originalHeight = this.player.height;
        this.showDebug = true;

        this.direction = 1;
        this.player.animations.play('right');
        this.run = false;
        this.shifted = false;

        this.runMaxSpeed = 100;
        this.walkSpeed = 30;
        this.jumpBaseSpeed = 10;
        this.jumpMaxSpeed = 40;
        this.speedIncrement = 1;
        this.speed = this.walkSpeed;
        this.jumpSpeed = this.jumpBaseSpeed;

        this.hasPressedJump = false;
        this.run = false;
        this.finished = false;
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
        this.createPlayer(result[0].x, result[0].y, 1);

        this.resetItemsGroup();
        this.createItems();

    },

    pause : function() {
        if (!this.won) {
            this.pauseText.visible = !this.pauseText.visible;
            this.game.paused = !this.game.paused;
        }

    },

    createText : function() {
        text = PlatformerGame.game.add.text(32, 456, 'score: 0', this.fontStyleSmall);

        text.text = "FFS Jack." //Press up to jump!"
        text.visible = false;
    }

};
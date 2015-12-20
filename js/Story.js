var PlatformerGame = PlatformerGame || {};

//title screen
PlatformerGame.Story = function(){};

PlatformerGame.Story.prototype = {
  create: function() {

    this.game.stage.backgroundColor = "#a9f0ff";

    this.text1 = "You are Crazy John.\n";
    this.text2 = "(That's your real name, by the way)\n";
    this.text3 = "As a matter of fact, you were named after your father ...\n";
    this.text4 = "Crazy John Senior.\n";
    this.text5 = "Anyway:\n";
    this.text6 = "You like mushrooms.\n";
    this.text7 = "You totally dig mushrooms!\n";
    this.text8 = "And you have decided to eat EVERY SINGLE MUSHROOM in the forest!\n";
    this.text9 = "\n\n";
    this.text10 = "Right, off you go then. Nothing further to add!\n";

    this.animationTimer = 0;
    this.fontStyle = { font: "23px Oswald", fill: "#000", align: "center" };
    this.text = this.game.add.text(132, 100, 'hallo', this.fontStyle);
    this.text.style.align = "left";
    this.textVar = "";

    this.game.input.keyboard.addCallbacks(this, this.skip, null, null);
    this.pressed = false;


  },

  
  update: function() {
    this.animationTimer++;

    if (this.animationTimer == 1500 && !this.pressed) {
        this.pressed = true;   
        this.state.start('Game');
    }
    else if (this.animationTimer >= 1200) {
        this.graduallyDisplayText(1200, this.text10);
    }
    else if (this.animationTimer >= 900) {
        this.graduallyDisplayText(900, this.text9);
    }
    else if (this.animationTimer >= 800) {
        this.graduallyDisplayText(800, this.text8);
    }
    else if (this.animationTimer >= 700) {
        this.graduallyDisplayText(700, this.text7);
    }
    else if (this.animationTimer >= 600) {
        this.graduallyDisplayText(600, this.text6);
    }
    else if (this.animationTimer >= 500) {
        this.graduallyDisplayText(500, this.text5);
    }
    else if (this.animationTimer >= 400) {
        this.graduallyDisplayText(400, this.text4);
    }
    else if (this.animationTimer >= 300) {
        this.graduallyDisplayText(300, this.text3);
    }
    else if (this.animationTimer >= 200) {
        this.graduallyDisplayText(200, this.text2);
    }
    else if (this.animationTimer >= 100) {
        this.graduallyDisplayText(100, this.text1);
    }
    this.text.text = this.textVar;

  },

  graduallyDisplayText: function(start, textPart) {
    if (textPart.length > (this.animationTimer - start)) {
        this.textVar = this.textVar + textPart[this.animationTimer - start];
    }
  },

  skip : function() {
    if (!this.pressed && this.animationTimer > 100) {
        this.pressed = true;
        this.state.start('Game');
    }
  },

};

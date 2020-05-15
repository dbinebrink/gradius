var easyStart;
var start_sound;

var mainMenu = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('startButton', 'img/startbutton.png');
        game.load.image('controls', 'img/controls.png');       
        game.load.image('controlkey', 'img/controlkey-1.png');
        game.load.image('backButton', 'img/backButton.png');
        mainMenu.load.audio('start_sound', 'audio/start_sound.mp3')
    },

    create : function() {
    	var image = game.add.image(0,0,'Wall_paper');
        game.stage.background = image;
        game.add.button(game.world.centerX-110,250,'startButton', this.startGame, this);
        game.add.button(game.world.centerX-110,350,'controls', this.ViewControls, this);
        easyStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        music = game.add.audio('start_sound');
        music.play();
    },


    update : function() {
        music.pauseOnBlur = false;
        if (easyStart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        music.stop();
        this.state.start('Game');
    },

    ViewControls : function() {
       game.add.button(220,360,'controlkey', this.ViewControls, this);
       game.add.button(600,360,'backButton', this.create, this);
    },
}

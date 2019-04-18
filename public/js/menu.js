var mainMenu = {

    preload : function() {
        game.load.image('startButton', 'img/startbutton.png');
    },

    create : function() {
        game.stage.backgroundColor = '#fff';
        //game.add.button(500,200,'startButton', this.startGame, this);
        game.add.button(350,270,'startButton', this.startGame, this);
    },

    startGame : function() {
        this.state.start('Game');
    },

}

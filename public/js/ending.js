var Ending = {

    preload : function() {
        game.load.image('restartButton', 'img/restartbutton.png');
        game.load.image('menuButton', 'img/menubutton.png');
    },

    create : function() {
        game.stage.backgroundColor = '#FFF';
        game.add.button(350,300,'restartButton', this.startGame, this);
        game.add.button(350,400,'menuButton', this.goMenu, this);

        totalScore = game.add.text(300, 100, score, { font: '124px Arial', fill: '#000' });
    },

    startGame : function() {
        game.state.start('Game');
    },

    goMenu : function() {
        game.state.start('mainMenu');
    },

}
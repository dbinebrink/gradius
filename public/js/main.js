var game = new Phaser.Game(900, 600, Phaser.AUTO, '', { preload: preload, create: create });

function preload()
{
	game.load.image('wall_paper' , 'img/space_debris_1.jpg');
}

function create()
{
	var image = game.add.image(900,600,'wall_paper');
}

game.state.add('mainMenu', mainMenu);
game.state.add('Game', Game);
game.state.add('ending', Ending);

game.state.start('mainMenu');
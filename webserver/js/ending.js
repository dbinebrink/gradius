var easyRestart;
var ending_sound;
var ending_music;
var restartButton;
var menuButton;
var ranking_init;

var Ending = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('restartButton', 'img/restartbutton.png');
        game.load.image('reset_ranking', 'img/reset_ranking.png');
        game.load.image('menuButton', 'img/menubutton.png');
        Ending.load.audio('ending_sound', 'audio/ending_sound.mp3')
    },

    create : function() {
        var image = game.add.image(0,0,'Wall_paper');
        game.stage.background = image;
        restartButton = game.add.button(game.world.centerX-110,320,'restartButton', this.startGame, this);
        restartButton.inputEnabled=true;
        menuButton = game.add.button(game.world.centerX-110,420,'menuButton', this.goMenu, this);
        menuButton.inputEnabled=true;
        if(!ending_music) ending_music = game.add.audio('ending_sound');
        ending_music.play();
        youDied = game.add.text(game.world.centerX + 10, 100, "YOU DIED", { font: '124px Arial', fill: '#f00'}); 
        totalScore = game.add.text(game.world.centerX, 237, score, { font: '124px Arial', fill: '#00f' });
        youDied.anchor.setTo(0.5);
        totalScore.anchor.setTo(0.5);
        ranking_init = game.add.button(game.world.centerX-20,520,'reset_ranking', this.ranking_clear, this);
        ranking_init.inputEnabled = true;
        easyRestart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.ShowRankingBox();
        
        
    },
    
    ranking_clear : function() {
        fetch('http://tallbin98.dothome.co.kr/ranking__develop.php')
        .then(() => alert("Ranking Clear"));
    },
    
    ShowRankingBox : function() {
        // load DB setting
        var msgBox2 = game.add.group();
        var back1 = game.add.sprite(0,0,'settingBack');
        var close_button = game.add.text(0, 0, 'X', { fontsize: 20 });
        var Ranking_text = game.add.text(0, 0, 'Ranking', { fontsize: 25 });
        var rank_name = "";
        var rank_score = "";

        msgBox2.enabledBody=false;
        menuButton.inputEnabled=false;
        restartButton.inputEnabled=false;

        i = 1;
        fetch('http://tallbin98.dothome.co.kr/ranking_write.php?Name=player&Score=' + score)
            .then(send => send.json())
            .then(send => {
                ranking=send;
                ranking.forEach(element => {
                    rank_name += i + '. ' + element.Name + "\n";
                    if(element.Score == score) {
                        rank_score += element.Score + " <-\n";
                    } else {
                        rank_score += element.Score + "\n";
                    }
                    i++;
                });
                var rank_1st = game.add.text(0, 0, rank_name, { fontsize : 25 });
                var rank_2nd = game.add.text(0, 0, rank_score, { fontsize : 25 });

                msgBox2.add(back1);
                msgBox2.add(Ranking_text);
                msgBox2.add(close_button);

                msgBox2.x = game.width / 2 - msgBox2.width / 2;
                msgBox2.y = game.height / 2 - msgBox2.height / 2;

                Ranking_text.wordWrapWidth = back1 * 0.8;
                Ranking_text.addColor("#ffffff", 0);
                Ranking_text.x = 120;
                Ranking_text.y = 20;

                close_button.wordWrapWidth = back1 * 0.8;
                close_button.addColor("#ffffff", 0);
                close_button.x = 330;
                close_button.y = 0;
                close_button.inputEnabled = true;
                close_button.events.onInputDown.add(this.closeRanking, this);
        
        
                msgBox2.add(rank_1st);
                msgBox2.add(rank_2nd);

                rank_1st.wordWrapWidth = back1 * 0.8;
                rank_1st.addColor("#ffffff", 0);
                rank_1st.x = Ranking_text.x - 100;
                rank_1st.y = 60;

                rank_2nd.wordWrapWidth = back1 * 0.8;
                rank_2nd.addColor("#ffffff", 0);
                rank_2nd.x = Ranking_text.x + 100;
                rank_2nd.y = 60;
        
                this.msgBox2 = msgBox2;
            });
        msgBox2.enabledBody=true;
    },

    closeRanking : function() {
        menuButton.inputEnabled=true;
        restartButton.inputEnabled=true;
        this.msgBox2.destroy();
    },

    update : function() {
        if (easyRestart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        music.destroy();
        game.state.start('Game');
        minutes = 0;
        seconds = 0;
    },

    goMenu : function() {
        game.state.start('mainMenu');
        minutes = 0;
        seconds = 0;
    }
}

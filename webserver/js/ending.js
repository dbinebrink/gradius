var easyRestart;
var ending_sound;
var ending_music;
var restartButton;
var menuButton;
var ranking_init;
var twitterButton;
var facebookButton;
var exitButton;

var Ending = {

    preload : function() {
    	game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('restartButton', 'img/restartbutton.png');
        game.load.image('reset_ranking', 'img/reset_ranking.png');
        game.load.image('menuButton', 'img/menubutton.png');
        game.load.image('twitterButton', 'img/twitterIcon.png');
        game.load.image('facebookButton', 'img/facebookIcon.png');
        game.load.image('eixtButton', 'img/exit.png');
        game.load.image('award', 'img/zero.png');
        Ending.load.audio('ending_sound', 'audio/ending_sound.mp3')
    },

    create : function() {
        var image = game.add.image(0,0,'Wall_paper');
        game.stage.background = image;
        restartButton = game.add.button(game.world.centerX-110,280,'restartButton', this.startGame, this);
        restartButton.inputEnabled=true;
        exitButton = game.add.button(game.world.centerX-85,430,'eixtButton', this.real, this);
        exitButton.inputEnabled = true;
        menuButton = game.add.button(game.world.centerX-110,350,'menuButton', this.goMenu, this);
        menuButton.inputEnabled=true;
        twitterButton = game.add.button(828,520,'twitterButton',this.shareTwitter, this);
        facebookButton = game.add.button(775,520,'facebookButton',this.shareFacebook, this);
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
        if(score == 0) this.showAward();

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

        check = 0;
        i = 1;
        fetch('http://tallbin98.dothome.co.kr/ranking_write.php?Name=player&Score=' + score)
            .then(send => send.json())
            .then(send => {
                ranking=send;
                ranking.forEach(element => {
                    rank_name += i + '. ' + element.Name + "\n";
                    if(element.Score == score && check == 0) {
                        rank_score += element.Score + " <-\n";
                        check ++;
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
    },

    real : function(){
        restartButton.inputEnabled=false;
        menuButton.inputEnabled=false;
        exitButton.inputEnabled = false;
        var msgBox = game.add.group();
        var back = game.add.sprite(270,220,'settingBack');
        back.scale.setTo(1,0.3);
        var real_exit = game.add.text(310,250,'Do you want to exit Gradios?',{ fontSize: 19 });
        var yes = game.add.text(370,310,'yes',{ fontSize: 19 });
        var no = game.add.text(500,310,'no',{ fontSize: 19 });
        msgBox.add(back);
        msgBox.add(real_exit);
        msgBox.add(yes);
        msgBox.add(no);
        real_exit.wordWrapWidth = back;
        real_exit.addColor("#ffffff", 0);
        yes.wordWrapWidth = back;
        yes.addColor("#ffffff", 0);
        no.wordWrapWidth = back;
        no.addColor("#ffffff", 0);
        no.inputEnabled = true;
        yes.inputEnabled = true;
        yes.events.onInputDown.add(this.exit,this);
        no.events.onInputDown.add(this.hideBox,this);
        this.msgBox = msgBox;
    },

    hideBox : function(){
        restartButton.inputEnabled=true;
        menuButton.inputEnabled=true;
        exitButton.inputEnabled = true;
        this.msgBox.destroy();
    },

    exit : function(){
      window.open('about:blank', '_self').close();
    },

    endGame : function(){
        window.open('about:blank', '_self').close();
    },

    shareTwitter : function() {
        var twitterLink = 'https://twitter.com/intent/tweet?text=What is my score? ' + score + '! join the grdios! &url=https://github.com/inureyes/gradios';
        window.open(twitterLink, '_blank');
    },

    shareFacebook : function() {
        var facebookLink = 'https://www.facebook.com/sharer/sharer.php?u=https://github.com/inureyes/gradios&quote=what is my score? ' + score + '! join the gradios!';
        window.open(facebookLink, '_blank');
    },

    showAward : function() {
        var AwardImg = game.add.image(268,58,'award');
        var closeButton = game.add.text(300, 60, 'X', { fontsize: 20 });
        closeButton.inputEnabled = true;
        closeButton.events.onInputDown.add(function(){
            AwardImg.destroy();closeButton.destroy();
        });
    }

}

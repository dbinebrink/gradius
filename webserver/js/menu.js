var easyStart;
var rankingView
var start_sound;
var start_music;
var startButton;
var controls;
var version;
var exit;

var mainMenu = {

    preload : function() {
        game.load.image('Wall_paper' , 'img/space.jpg');
        game.load.image('gradius' , 'img/gradius.png');
        game.load.image('startButton', 'img/startbutton.png');
        game.load.image('controls', 'img/controls.png');
        game.load.image('backButton', 'img/backButton.png');
        game.load.image('exit' , 'img/exit.png');
        game.load.image('credit' , 'img/credit.png');
        game.load.image('new help' , 'img/new help.png');
        game.load.image('creditList' , 'img/credit_list.png');
        game.load.image('settingBack', 'img/settingBackground.png');
        game.load.image('githubButton', 'img/githubIcon.png');
        mainMenu.load.audio('start_sound', 'audio/start_sound.mp3')
    },

    create : function() {
        var image = game.add.image(0,0,'Wall_paper');
        var image1 = game.add.image(30,20,'gradius');
        game.stage.background = image;
        startButton=game.add.button(game.world.centerX-220,280,'startButton', this.startGame, this);
        controls=game.add.button(game.world.centerX+20,280,'controls', this.ViewControls, this);
        exit=game.add.button(game.world.centerX-85,380,'exit', this.real, this);
        credit=game.add.button(game.world.centerX-85,470,'credit', this.ViewCredit, this);
        version = game.add.text(game.world.centerX-85,570, "v1.0.0", { font: '30px Arial', fill: '#fff' });
        easyStart = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        if (!start_music) start_music = game.add.audio('start_sound');
        start_music.loop = true;

        rankingView = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        rankingView.onDown.add(this.ShowRankingBox, this);

        start_music.play();
    },


    update : function() {
        if (music) music.pauseOnBlur = false;
        if (easyStart.isDown) {
            this.startGame();
        }
    },

    startGame : function() {
        if(music) music.destroy();
        start_music.stop();
        this.state.start('Game');
    },

    ViewControls : function() {
        var image2 = game.add.image(0,0,'new help');
        var image3 = game.add.button(750,40,'backButton');
        credit.inputEnabled = false;
        image3.inputEnabled = true;
        startButton.inputEnabled=false;
        controls.inputEnabled=false;
        exit.inputEnabled=false;
        image3.events.onInputDown.add(function(){
            image2.destroy();image3.destroy();
            startButton.inputEnabled=true;
            controls.inputEnabled=true;
            exit.inputEnabled=true;
            credit.inputEnabled = true;
        });
    },

    ViewCredit : function() {
        var image2 = game.add.image(0,0,'creditList');
        var image3 = game.add.button(700,40,'backButton');
        var image4 = game.add.button(630,40,'githubButton');
        credit.inputEnabled = false;
        image3.inputEnabled = true;
        startButton.inputEnabled=false;
        controls.inputEnabled=false;
        exit.inputEnabled=false;
        image3.events.onInputDown.add(function(){
            image2.destroy();image3.destroy();image4.destroy();
            startButton.inputEnabled=true;
            controls.inputEnabled=true;
            exit.inputEnabled=true;
            credit.inputEnabled = true;
        });
        image4.events.onInputDown.add(function(){
            window.open('https://github.com/inureyes/gradios', '_blank');
        });
    },

    ShowRankingBox : function() {
        rankingView.reset();

        // load DB setting
        var msgBox2 = game.add.group();
        var back1 = game.add.sprite(0,0,'settingBack');
        var close_button = game.add.text(0, 0, 'X', { fontsize: 20 });
        var Ranking_text = game.add.text(0, 0, 'Ranking', { fontsize: 25 });
        var rank_name = "";
        var rank_score = "";

        msgBox2.enabledBody=false;

        i = 1;
        fetch('http://tallbin98.dothome.co.kr/ranking_write.php?Name=player&Score=0')
            .then(send => send.json())
            .then(send => {
                ranking=send;
                ranking.forEach(element => {
                    rank_name += i + '. ' + element.Name + "\n";
                    if(element.Score == score) {
                        rank_score += element.Score + "\n";
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
        rankingView = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        rankingView.onDown.add(this.ShowRankingBox, this);
        this.msgBox2.destroy();
    },
    real : function(){
        startButton.inputEnabled = false;
        controls.inputEnabled = false;
        credit.inputEnabled = false;
        exit.inputEnabled = false;
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
        startButton.inputEnabled = true;
        controls.inputEnabled = true;
        credit.inputEnabled = true;
        exit.inputEnabled = true;
        this.msgBox.destroy();
    },

    exit : function(){
      window.open('about:blank', '_self').close();
    }
}

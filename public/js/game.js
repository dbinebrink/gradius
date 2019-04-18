var player;
var aliens;
var bullets;
var bulletTime = 0;
var invincibleTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var music;
var sfx_fire;
var sfx_enemy_die;

var Game = {

    preload : function() {

        // load all sprites
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemyBullet', 'img/enemy-bullet.png');
        game.load.spritesheet('invader', 'img/invader32x32x4.png', 32, 32);
        game.load.spritesheet('ship', 'img/ship64x64x5.png', 64, 64, 5);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        game.load.image('starfield', 'img/starfield.png');
        // load all sfx and music
        game.load.audio('music1', 'audio/gradius.mp3');
        game.load.audio('sfx_enemy_die', 'audio/enemy-die.wav');
        game.load.audio('sfx_fire', 'audio/fire.wav');
        game.load.audio('sfx_player_hit', 'audio/player-hit.wav');

    },

    create  : function() {

        // reset
        bulletTime = 0;
        invincibleTime = 0;
        score = 0;
        scoreString = ''
        firingTimer = 0;
        livingEnemies = [];

        game.physics.startSystem(Phaser.Physics.ARCADE);

        music = game.add.audio('music1');
        music.volume = 0.4;
        music.play();
    
        //	Here we set-up our audio sprites
        sfx_fire = game.add.audio('sfx_fire');
        sfx_fire.allowMultiple = false;
    
        sfx_player_hit = game.add.audio('sfx_player_hit');
        sfx_player_hit.allowMultiple = true;
    
        sfx_enemy_die = game.add.audio('sfx_enemy_die');
        sfx_enemy_die.allowMultiple = true;
    
        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 900, 600, 'starfield');
    
        //  The starship
        player = game.add.sprite(150, 300, 'ship');
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
    
        //  Our two animations, moving up and down.
        player.animations.add('up', [3, 4], 2, false);
        player.animations.add('down', [0, 1], 2, false);
    
        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    
        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);
    
        //  The bad guys
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;
    
        this.createAliens();
    
        //  The score
        scoreString = 'Score: ';
        scoreText = game.add.text(10, 10, scoreString + score, { font: '124px Arial', fill: '#fff' });
    
        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });
    
        for (var i = 0; i < 3; i++) {
            var ship = lives.create(game.world.width - 150 + (60 * i), 60, 'ship');
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
    
        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(this.setupInvader, this);
    
        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },

    update : function() {

        //  Scroll the background
        starfield.tilePosition.x -= 3;

        if (player.alive) {
            //  Reset the player, then check for movement keys
            player.body.velocity.setTo(0, 0);

            if (cursors.left.isDown && (40 < player.x)) {
                player.body.velocity.x = -200;
            }
            else if (cursors.right.isDown && (player.x < 860)) {
                player.body.velocity.x = 200;
            }

            // keyboard up/down
            if (cursors.up.isDown && (40 < player.y)) {
                player.body.velocity.y = -200;
                player.animations.play('up');
            }
            else if (cursors.down.isDown && (player.y < 560)) {
                player.body.velocity.y = 200;
                player.animations.play('down');
            }
            else {  // stand still
                player.animations.stop();
                player.frame = 2;
            }


            //  Firing?
            if (fireButton.isDown) {
                this.fireBullet();
            }

            if (game.time.now > firingTimer) {
                this.enemyFires();
            }

            //  Run collision
            game.physics.arcade.overlap(bullets, aliens, this.collisionHandler, null, this);
            game.physics.arcade.overlap(player, aliens, this.enemyHitsPlayer, null, this);
            game.physics.arcade.overlap(player, enemyBullets, this.enemyHitsPlayer, null, this);
        }

    },

    createAliens : function() {

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 5; x++) {
                var alien = aliens.create(x * 48, y * 50, 'invader');
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
        }
    
        aliens.x = 600;
        aliens.y = 250;
    
    
        //  Start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(aliens).to( { x: 400 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    
        //  When the tween loops it calls descend
        tween.onLoop.add(this.descend, this);

    },

    setupInvader : function(invader) {
        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    },

    descend : function() {
        aliens.x -= 10;
    },

    render : function() {

    },

    fireBullet : function() {
        game.add.audio('sfx_fire');
        sfx_fire.volume = 0.2;
    
    
        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime) {
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);
    
            if (bullet) {
                sfx_fire.play();
                //  And fire it
                bullet.reset(player.x+8, player.y);
                bullet.body.velocity.x = 400;
                bulletTime = game.time.now + 200;
            }
        }
    },

    collisionHandler : function(bullet, alien) {
        //  When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();

        game.add.audio('sfx_enemy_die');
        sfx_enemy_die.volume = 0.6;
        sfx_enemy_die.play();

        //  Increase the score
        score += 20*lives.countLiving();
        scoreText.text = scoreString + score;

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);
        /*setTimeout(function() { explosion.kill(); }, 750);*/

        if (aliens.countLiving() == 0) {
            this.createAliens();
            
        }
    },

    enemyHitsPlayer : function(player, object) {
        if ((game.time.now < player.invincibleTime) || !aliens.countLiving()) return;
        game.add.audio('sfx_player_hit');
        sfx_player_hit.volume = 0.6;
        sfx_player_hit.play();
    
        object.kill();
    
        live = lives.getFirstAlive();
    
        if (live) {
            live.kill();
        }
      
        player.invincibleTime = game.time.now + 1000;
      
        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);
    
        // ?”Œ? ˆ?´?–´ê°? ì£½ê±°?‚˜ ? ?´ ?‹¤ ì£½ì„ ?•Œ
        if (lives.countLiving() < 1) {
            this.finishGame();
        }
    },

    finishGame : function() {
        if (lives.countLiving() < 1) {
            player.kill();
        }

        music.stop();

        game.time.events.add(Phaser.Timer.SECOND, function() {
            enemyBullets.callAll('kill');
            //aliens.removeAll();
            this.state.start('ending');
        }, this);
    },

    enemyFires : function() {
        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length = 0;

        aliens.forEachAlive(function(alien) {

            // put every living enemy in an array
            livingEnemies.push(alien);
        });


        if (enemyBullet && livingEnemies.length > 0) {

            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 2000;
        }
    },

    resetBullet : function(bullet) {
        //  Called if the bullet goes out of the screen
        bullet.kill();
    },

}

var Player = {
    basicParamList : ["playerMaxHealth", "playerEvasion", "playerSpeed"],
    basicMethodList : ["playerAnimation"],
    activatePositionList : ["always", "colideEnemy", "moving"],
    info : {
        always : [],
        colideEnemy : [],
        moving : []
    },

    initalize : function( game ) {
        this.info.playerImage = 'ship';
        this.info.playerSpeed = 200;
        this.info.playerMaxHealth = 3;
        this.info.playerEvasion = 0; // 0~100까지의 숫자로 풀레이어의 총알 회피 확률을 나타냄
        this.info.playerAnimation = function(obj){
            obj.animations.add('up', [3, 4], 2, false);
            obj.animations.add('down', [0, 1], 2, false);
        }

        this.healthGroup = game.add.group();
        for (var i = this.info.playerMaxHealth-1; i >= 0; i--) {
            var ship = this.healthGroup.create(game.world.width - 150 + (60 * i), 60, this.info.playerImage);
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        this.sprite = game.add.sprite(150, 300, this.info.playerImage);
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.setPlayerSprite();
        this.sprite.setHealth(this.info.playerMaxHealth);
    },
    
    setPlayerSprite : function(){
        this.sprite.maxHealth = this.info.playerMaxHealth;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.body.setSize(64,32,0,16);
        this.info.playerAnimation(this.sprite);
    },

    damage : function(getDamage) {
        this.sprite.damage(getDamage);
        live = this.healthGroup.getChildAt(this.info.playerMaxHealth-this.sprite.health);
        live.alpha = 0;
    },

    move : function(cursors) {
        if(cursors.left.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = -this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }

        else if(cursors.left.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = -this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }
        else if(cursors.right.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }
        else if(cursors.right.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.playerSpeed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }

        else if (cursors.left.isDown) {
            this.sprite.body.velocity.x = -this.info.playerSpeed
        }
        else if (cursors.right.isDown) {
            this.sprite.body.velocity.x = this.info.playerSpeed
        }
        else if (cursors.up.isDown) {
            this.sprite.body.velocity.y = -this.info.playerSpeed
            this.sprite.animations.play('up');
        }
        else if (cursors.down.isDown) {
            this.sprite.body.velocity.y = this.info.playerSpeed
            this.sprite.animations.play('down');
        }

        else {  // stand still
            this.sprite.animations.stop();
            this.sprite.frame = 2;
        }
    }
}
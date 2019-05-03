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

        this.sprite = game.add.sprite(150, 300, this.info.playerImage);
        this.sprite.anchor.setTo(0.5, 0.5);
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        this.sprite.body.setSize(64,32,0,16);
        this.info.playerAnimation(this.sprite);
    },

    damage : function(getDamage) {
        this.sprite.damage(getDamage);
        live = lives.getChildAt(this.info.playerMaxHealth-live_count);
        live.alpha = 0;
        live_count--;
    },

    move : function(cursors) {
        if(cursors.left.isDown && (40 < this.sprite.x) && cursors.up.isDown && (40 < this.sprite.y)){
            this.sprite.body.velocity.x = -this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.body.velocity.y = -this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.animations.play('up');
        }

        else if(cursors.left.isDown && (40 < this.sprite.x) && cursors.down.isDown && (this.sprite.y < 560)){
            this.sprite.body.velocity.x = -this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.body.velocity.y = this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.animations.play('down');
        }
        else if(cursors.right.isDown && (this.sprite.x < 860) && cursors.up.isDown && (40 < this.sprite.y)){
            this.sprite.body.velocity.x = this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.body.velocity.y = -this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.animations.play('up');
        }
        else if(cursors.right.isDown && (this.sprite.x < 860) && cursors.down.isDown && (this.sprite.y) < 560){
            this.sprite.body.velocity.x = this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.body.velocity.y = this.info.playerSpeed * Math.sqrt(2) / 2;
            this.sprite.animations.play('down');
        }

        else if (cursors.left.isDown && (40 < this.sprite.x)) {
            this.sprite.body.velocity.x = -this.info.playerSpeed
        }
        else if (cursors.right.isDown && (this.sprite.x < 860)) {
            this.sprite.body.velocity.x = this.info.playerSpeed
        }

        // keyboard up/down
        else if (cursors.up.isDown && (40 < this.sprite.y)) {
            this.sprite.body.velocity.y = -this.info.playerSpeed
            this.sprite.animations.play('up');
        }
        else if (cursors.down.isDown && (this.sprite.y < 560)) {
            this.sprite.body.velocity.y = this.info.playerSpeed
            this.sprite.animations.play('down');
        }
        else {  // stand still
            this.sprite.animations.stop();
            this.sprite.frame = 2;
        }
    }
}
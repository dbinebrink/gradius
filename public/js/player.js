var Player = {
    basicParamList : ["maxHealth", "evasion", "speed", "image"],
    basicMethodList : ["animation"],
    activatePositionList : ["always", "colideEnemy", "moving"],
    info : {
        always : [],
        colideEnemy : [],
        moving : []
    },

    initalize : function( game ) {
        this.info.image = 'ship';
        this.info.speed = 200;
        this.info.maxHealth = 3;
        this.info.evasion = 0; // 0~100까지의 숫자로 풀레이어의 총알 회피 확률을 나타냄
        this.info.animation = function(obj){
            obj.animations.add('up', [3, 4], 2, false);
            obj.animations.add('down', [0, 1], 2, false);
        }

        this.healthGroup = game.add.group();
        for (var i = this.info.maxHealth-1; i >= 0; i--) {
            var ship = this.healthGroup.create(game.world.width - 150 + (60 * i), 60, this.info.image);
            ship.anchor.setTo(0.5, 0.5);
            ship.angle = 0;
            ship.alpha = 0.4;
        }
        game.add.text(game.world.width - 100, 10, 'Health: ', { font: '24px Arial', fill: '#fff' });

        this.sprite = game.add.sprite(150, 300, this.info.image);
        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.setPlayerSprite();
        this.sprite.setHealth(this.info.maxHealth);
    },
    
    setPlayerSprite : function(){
        // Todo 아직 maxHealth가 늘어나지 않음 수정 필요
        this.sprite.maxHealth = this.info.maxHealth;
        this.sprite.body.setSize(64,32,0,16);
        this.info.animation(this.sprite);
    },

    addItem : function(getItem){
        console.log(getItem)
        let itemAbilites = getItem.abilities.Player;
        for( [key, value] of Object.entries(itemAbilites) ) {
            console.log(key, value[0]);
            if( this.basicParamList.includes(key) ) {
                this.info[key] = value[0](this.info[key]);
            }
            else if( this.basicMethodList.includes(key) ) {
                this.info[key] = value[0];
            }
            else if( this.activatePositionList.includes(key)) {
                for(var i=0; i<value.length; i++){
                    this.info[key].push(value[i]);
                } 
            }
        }

        this.setPlayerSprite();
    },

    damage : function(getDamage) {
        live = this.healthGroup.getChildAt(this.info.maxHealth-this.sprite.health);
        live.alpha = 0;
        this.sprite.damage(getDamage);
    },

    heal : function(getHeal){
        if(this.sprite.maxHealth > this.sprite.health){
            this.sprite.heal(getHeal);
            live = this.healthGroup.getChildAt(this.info.maxHealth-this.sprite.health);
            live.alpha = 0.4;
        }
    },

    move : function(cursors) {
        this.sprite.body.velocity.setTo(0, 0);

        if(cursors.left.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }

        else if(cursors.left.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }
        else if(cursors.right.isDown && cursors.up.isDown) {
            this.sprite.body.velocity.x = this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = -this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('up');
        }
        else if(cursors.right.isDown && cursors.down.isDown) {
            this.sprite.body.velocity.x = this.info.speed * Math.SQRT2 / 2;
            this.sprite.body.velocity.y = this.info.speed * Math.SQRT2 / 2;
            this.sprite.animations.play('down');
        }

        else if (cursors.left.isDown) {
            this.sprite.body.velocity.x = -this.info.speed
        }
        else if (cursors.right.isDown) {
            this.sprite.body.velocity.x = this.info.speed
        }
        else if (cursors.up.isDown) {
            this.sprite.body.velocity.y = -this.info.speed
            this.sprite.animations.play('up');
        }
        else if (cursors.down.isDown) {
            this.sprite.body.velocity.y = this.info.speed
            this.sprite.animations.play('down');
        }

        else {  // stand still
            this.sprite.animations.stop();
            this.sprite.frame = 2;
        }
    }
}
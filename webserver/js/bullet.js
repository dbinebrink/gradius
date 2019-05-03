var Bullets = {
    bulletTypeList : ['bullet', 'laser', 'rocket'],
    basicParamList : [
        "damage", "speed", "fireRate", "type", "image", "piercing", "fireAtOnce", "fireSound",
        "maxBulletCount", "collideEnemyBullet", 'outOfBoundsKill', 'checkWorldBounds'],
    basicMethodList : ["animation"],
    activatePositionList : ["beforeFire", "firing", "afterFire", "always", "hitEnemy"],

    info : {
        /*
        if collect item, item's ability function is stored in this list
        and activate function when it's position
        */
        "beforeFire":[],
        "firing":[],
        "afterFire":[],
        "always":[],
    },
    
    initalize : function( game ){
        this.bulletTime = 0;
        this.currentShotCount = 0;

        this.info.type = 'bullet';
        this.info.damage = 1;
        this.info.fireRate = 0.6;
        this.info.piercing = 1;
        this.info.maxBulletCount = 100;
        this.info.speed = 6;
        this.info.fireAtOnce = 1;
        this.info.collideEnemyBullet = true;
        this.info.outOfBoundsKill = true;
        this.info.checkWorldBounds = true;
        this.info.initValue = {
            position : {x : 40, y : 0},
            velocity : {x : this.info.speed*100, y : 0}
        }
        
        this.info.fireSound = game.add.audio('sfx_fire');
        this.info.fireSound.volume = 0.2;
        
        this.info.animation = null;
        
        for([index, activatePosition] of Object.entries(this.activatePositionList)){
            this.info[activatePosition] = [];
        }
        
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 1);
        this.setBulletGroup();
    },
    
    setBulletGroup : function(){
        this.bulletGroup.removeAll(true, true, false);
        this.bulletGroup.createMultiple(this.info.maxBulletCount, this.info.type, 100);
        this.bulletGroup.setAll('outOfBoundsKill', this.info.outOfBoundsKill);
        this.bulletGroup.setAll('checkWorldBounds', this.info.checkWorldBounds);
        Bullets.bulletGroup.forEach((x, y) => {x.piercing = y;}, this, false, this.info.piercing);
        return this.bulletGroup;
    },

    addItem : function(getItem){
        let itemAbilites = getItem.abilities.Bullets;
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
        
        this.setBulletGroup();
    },

    fire : function(player, currentTime){
        if (currentTime > this.bulletTime) {
            for(this.currentShotCount = 0; this.currentShotCount < this.info.fireAtOnce; this.currentShotCount++){
                bullet = this.bulletGroup.getFirstExists(false);
                for( functionPriority in this.info.beforeFire ){
                    this.info.beforeFire[functionPriority](this, bullet);
                }
                
                if (bullet) {
                    this.info.fireSound.play();
                    bullet.reset(
                        player.x + this.info.initValue.position.x,
                        player.y + this.info.initValue.position.y
                    );
                    bullet.anchor.setTo(0, 0.5);
                    
                    if(this.info.animation != null){
                        var animationName = this.info.animation(bullet);
                        bullet.play(animationName, 120, false, true);
                    }
    
                    //  And fire it
                    bullet.body.velocity.x = this.info.initValue.velocity.x;
                    bullet.body.velocity.y = this.info.initValue.velocity.y;

                    var BM = this.info.bulletMovement;
                    bullet.update = function(){
                        for( functionPriority in Bullets.info.firing ){
                            Bullets.info.firing[functionPriority](Bullets, this);
                        }
                    }
                    this.bulletTime = currentTime + this.info.fireRate*1000;
                }
            }
        }
    },

    killBullet : function(bullet){
        if(bullet.piercing > 0){
            bullet.piercing--;
            if(bullet.piercing == 0){
                bullet.piercing = this.info.piercing;
                bullet.kill();
            }
        }
    }
}
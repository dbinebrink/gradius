var Bullets = {
    bulletTypeList : ['bullet', 'laser', 'rocket'],
    basicParamList : [
        "damage", "bulletSpeed", "fireRate", "bulletType", "piercing", "fireAtOnce",
        "maxBulletCount", "bulletCollision", 'outOfBoundsKill', 'checkWorldBounds'],
    basicMethodList : ["bulletAnimation"],
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

        this.info.bulletType = 'bullet';
        this.info.damage = 1;
        this.info.fireRate = 0.6;
        this.info.piercing = 1;
        this.info.maxBulletCount = 100;
        this.info.bulletSpeed = 6;
        this.info.fireAtOnce = 1;
        this.info.bulletsCollision = true;
        this.info.outOfBoundsKill = true;
        this.info.checkWorldBounds = true;
        this.info.initValue = {
            position : {x : 20, y : 0},
            velocity : {x : this.info.bulletSpeed*100, y : 0}
        }
        // this.info.bulletInitialVel = function(object){ return {x : object.info.bulletSpeed*100, y : 0}; };
        // this.info.bulletInitialPos = function(){ return {x : 20, y : 0}; };
        
        this.info.bulletFireSound = game.add.audio('sfx_fire');
        this.info.bulletFireSound.volume = 0.2;
        
        this.info.bulletAnimation = null;
        this.info.bulletMovement = function(object){return {x : object.body.velocity.x, y : 0}};
        
        for([index, activatePosition] of Object.entries(this.activatePositionList)){
            this.info[activatePosition] = [];
        }
        
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.setBulletGroup();
    },
    
    setBulletGroup : function(){
        this.bulletGroup.removeAll(true, true, false);
        this.bulletGroup.createMultiple(this.info.maxBulletCount, this.info.bulletType, 100);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 1);
        this.bulletGroup.setAll('outOfBoundsKill', this.info.outOfBoundsKill);
        this.bulletGroup.setAll('checkWorldBounds', this.info.checkWorldBounds);
        Bullets.bulletGroup.forEach((x, y) => {x.piercing = y;}, this, false, this.info.piercing);
        return this.bulletGroup;
    },

    addItem : function(getItem){
        for( [key, value] of Object.entries(getItem.abilities) ) {
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
            // console.log(this.info[key]);
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
                    this.info.bulletFireSound.play();
                    bullet.reset(
                        player.x + this.info.initValue.position.x,
                        player.y + this.info.initValue.position.y
                    );
                    bullet.anchor.setTo(0, 0.5);
                    
                    if(this.info.bulletAnimation != null){
                        var animationName = this.info.bulletAnimation(bullet);
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
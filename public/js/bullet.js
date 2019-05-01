var Bullets = {
    bulletTypeList : ['bullet', 'laser', 'rocket'],
    basicParamList : ["damage", "bulletSpeed", "fireRate", "bulletType", "pierceing", "maxBulletCount"],
    basicMethodList : ["bulletAnimation", "bulletMovement"],
    activatePositionList : ["beforeFire", "firing", "afterFire", "always", "hitEnemy"],

    info : {
        // "damage" : 1,
        // "bulletSpeed" : 5,
        // "fireRate" : 0.6,
        // "bulletType" : 'bullet',
        // "bulletFireSound" : game.add.audio('sfx_fire'),
        
        "bulletAnimation" : null,
        "bulletMovement" : function(x, y){
            return {
                "x" : x,
                "y" : 0
            }
        },  

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
        this.info.bulletType = 'bullet';
        this.info.damage = 1;
        this.info.bulletSpeed = 5;
        this.info.fireRate = 0.6;
        this.info.pierceing = 1;
        this.info.maxBulletCount = 100;
        this.bulletTime = 0;
        
        this.info.bulletFireSound = game.add.audio('sfx_fire');
        this.info.bulletFireSound.volume = 0.2;
        
        this.info.bulletAnimation = null;
        this.info.bulletMovement = function(object){return {x : object.body.velocity.x, y : 0}};
        
        for([index, activatePosition] of Object.entries(this.activatePositionList)){
            this.info.activatePosition = [];
        }
        
        this.bulletGroup = this.makeBulletGroup();
    },
    
    makeBulletGroup : function(){
        var bulletGroup = game.add.group();
        bulletGroup.enableBody = true;
        bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        bulletGroup.createMultiple(this.info.maxBulletCount, this.info.bulletType, 100);
        bulletGroup.setAll('anchor.x', 0.5);
        bulletGroup.setAll('anchor.y', 1);
        bulletGroup.setAll('outOfBoundsKill', true);
        bulletGroup.setAll('checkWorldBounds', true);
        if( this.info.pierceing != -1 ) bulletGroup.setAll('health', this.info.pierceing);

        return bulletGroup;
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
            console.log(this.info[key]);
        }
        
        this.bulletGroup = game.add.group();
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(100, this.info.bulletType, 100, false);
        this.bulletGroup.setAll('anchor.x', 0.5);
        this.bulletGroup.setAll('anchor.y', 1);
        this.bulletGroup.setAll('outOfBoundsKill', true);
        this.bulletGroup.setAll('checkWorldBounds', true);
    },

    fire : function(player, currentTime){
        if (currentTime > this.bulletTime) {
            console.log("relly fire");
            bullet = this.bulletGroup.getFirstExists(false);
            
            if (bullet) {
                this.info.bulletFireSound.play();
                bullet.reset(player.x+20, player.y);
                bullet.anchor.setTo(0, 0.5);
                
                if(this.info.bulletAnimation != null){
                    var animationName = this.info.bulletAnimation(bullet);
                    bullet.play(animationName, 120, false, true);
                }

                //  And fire it
                bullet.body.velocity.x = this.info.bulletSpeed*100;
                bullet.body.velocity.y = 0;
                var BM = this.info.bulletMovement;
                bullet.update = function(){
                    var velocity = BM(this);
                    
                    this.body.velocity.x = velocity.x;
                    this.body.velocity.y = velocity.y;
                }
                this.bulletTime = currentTime + this.info.fireRate*1000;
            }
        }
    },

    killBullet : function(bullet){
        if(this.info.pierceing != -1){
            bullet.health--;
            if(bullet.health == 0) bullet.kill();
        }
    }
}
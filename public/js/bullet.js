game.load.image('bullet', 'img/bullet.png');
game.load.image('laser', 'bullet_img/blue_beam_ani.png');

var Bullets = {
    
    bulletTypeList : ['default', 'laser', 'rocket'],
    bulletType : typeList[0],
    bulletDamage : 1,
    bulletSpeed : 1,
    fireRate : 1,
    
    bulletGroup : game.add.group(),

    abilities : {"beforeFire":[], "firing":[], "afterFire":[], "always":[]},
    
    initalize : function(){
        this.bulletType = this.typeList[0];
        this.bulletDamage = 1;
        this.bulletSpeed = 1;
        this.fireRate = 1;
        this.abilities = {"beforeFire":[], "firing":[], "afterFire":[], "always":[]};
        this.bulletGroup.createMultiple(30, bulletType, 100, false);
    },

    bulletMovement : function(){
        var current_valocity_x = this.body.valocity.x;
        var current_valocity_y = this.body.valocity.y;
        var current_fps = game.time.fps;

        this.body.valocity.x = current_valocity_x;
        this.body.valocity.y = 0;
    },
    /*
    other example of bulletMovement
    bulletMovement : function(){
        var current_valocity_x = this.body.valocity.x;
        var current_valocity_y = this.body.valocity.y;
        var current_fps = game.time.fps;
        var dt = 1/current_fps;
        
        this.body.valocity.x = current;
        this.body.valocity.y = 0;
    }
    */

    /*
    if collect item, item's ability function is stored in this list
    and activate all functions when bullet fired
    */

    setBulletType : function(bulletType){
        this.bulletType = bulletType;
    },

    setAbility : function(itemAbility, triggeredPosition){
        abilities[triggeredPosition].push(itemAbility);
    }, 

    setBulletMovement : function(movementFunction){
        this.bulletMovement = movementFunction;

    }

}
// Create an object type UserException
class UndefinedTypeError {
    constructor(message) {
        this.message = message;
        this.name = "UndefinedTypeError";
    }

    toString() { return this.name + ': "' + this.message + '"'; }
}

class item {
    constructor(name, rarity, isActive = false) {
        this.name = name;
        this.rarity = rarity;
        this.isActive = isActive;
        this.abilities = {};
    }
    
    static getAbilityList() {
        return [
            "damage", "bulletSpeed", "fireRate", "playerSpeed", "fireAtOnce",
            "evasion", "piercing", "bulletInitialVel", "bulletInitialPos",
            "bulletType", "bulletMovement", "beforeFire",
            "firing", "afterFire", "bulletCollision",
            "hitEnemy", "always", "using", "playerImage",
            "bulletAnimation", "bulletFireSound"
        ];
    }

    addAbility(type, value) {
        if(!item.getAbilityList().includes(type)) throw UndefinedTypeError("undefined ability type!");
        if(!this.abilities[type]) this.abilities[type] = [];
        this.abilities[type].push(value);
    }
}

// 웹브라우저 콘솔에서 게임을 실행시킨 후 Bullets.addItem(laser_item);
// 를 입력하면 공격이 레이저로 바뀝니다.
// make laser item
var laser_item = new item("laser", "uncommon");
laser_item.addAbility("damage", x => x+3);
laser_item.addAbility("fireRate", x => x*3);
laser_item.addAbility("bulletType", x => "laser");
laser_item.addAbility("piercing", x => 0);
laser_item.addAbility("bulletMovement", (obj) => {
    return {
        "x" : player.body.velocity.x,
        "y" : player.body.velocity.y
    }
});
laser_item.addAbility("bulletAnimation", obj => {
    obj.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});

// make pierce item
var pierce_item = new item("pierce", "common");
pierce_item.addAbility("piercing", x => {
    if(x > 0) return x+1;
    else return x;
});

// make bullet tracking item
var tracking_item = new item("tracking", "uncommon");
// tracking_item.addAbility("bulletSpeed", x => x)
tracking_item.addAbility("bulletMovement", (obj) => {
    let enemy = aliens.getClosestTo({x:obj.x - aliens.x,y:obj.y-30});
    // console.log(this.Bullets.info.bulletSpeed);
    let trackingPerformance = 0.03;
    let x = obj.body.velocity.x+(enemy.body.x-obj.x)*trackingPerformance;
    let y = obj.body.velocity.y+(enemy.body.y-obj.y)*trackingPerformance;

    let currentBulletSpeed = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );
    let expectedBulletSpeed = Bullets.info.bulletSpeed*100;
    if ( currentBulletSpeed > expectedBulletSpeed ){
        let reduceAmount = expectedBulletSpeed/currentBulletSpeed;
        x = x*reduceAmount;
        y = y*reduceAmount;
    }

    if(x == 0){
        if(y > 0) obj.rotation = Math.PI/2;
        else obj.rotation = -Math.PI/2;
    }
    else obj.rotation = Math.atan(y/x);

    return {
        "x" : x, 
        "y" : y
    }
});

// make double bullet fire item
var addBullet_item = new item("addBullet", "common");
addBullet_item.addAbility("fireAtOnce", x => x+1);
addBullet_item.addAbility("bulletInitialPos", (sequence) => {
    // console.log(Bullets.info);
    return{
        "x" : 20,
        "y" : (sequence - (Bullets.info.fireAtOnce-1)/2)*20
    };
});


var fireRateUp_item = new item("fireRateUp", "common");
fireRateUp_item.addAbility("fireRate", x => x-0.1);
// var Shotgun_item = new item("Shotgun", "uncommon");


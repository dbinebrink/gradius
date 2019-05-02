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
            "evasion", "piercing", "bulletType", "beforeFire",
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
laser_item.addAbility("damage", x => x/3);
laser_item.addAbility("fireRate", x => x*3);
laser_item.addAbility("bulletType", x => "laser");
laser_item.addAbility("piercing", x => 0);
laser_item.addAbility("firing", (bulletObj, currentBullet) => {
    currentBullet.body.velocity.x = player.body.velocity.x;
    currentBullet.body.velocity.y = player.body.velocity.y;
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
tracking_item.addAbility("firing", (bulletObj, currentBullet) => {
    let enemy = aliens.getClosestTo({x:currentBullet.x - aliens.x,y:currentBullet.y-30});
    // console.log(this.Bullets.info.bulletSpeed);
    let trackingPerformance = 10;
    let x = currentBullet.body.velocity.x+(enemy.body.x-currentBullet.x)*trackingPerformance;
    let y = currentBullet.body.velocity.y+(enemy.body.y-currentBullet.y)*trackingPerformance;

    let currentBulletSpeed = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );
    let expectedBulletSpeed = bulletObj.info.bulletSpeed*100;
    if ( currentBulletSpeed > expectedBulletSpeed ){
        let reduceAmount = expectedBulletSpeed/currentBulletSpeed;
        x = x*reduceAmount;
        y = y*reduceAmount;
    }

    if(x == 0){
        if(y > 0) currentBullet.rotation = Math.PI/2;
        else currentBullet.rotation = -Math.PI/2;
    }
    else currentBullet.rotation = Math.atan(y/x);

    currentBullet.body.velocity.x = x;
    currentBullet.body.velocity.y = y;
});

// make double bullet fire item
var addBullet_item = new item("addBullet", "common");
addBullet_item.addAbility("fireAtOnce", x => x+1);
addBullet_item.addAbility("beforeFire", (bulletObj, currentBullet) => {
    // console.log(this);
    bulletObj.info.initValue.position.x = 20;
    bulletObj.info.initValue.position.y = (bulletObj.currentShotCount - (bulletObj.info.fireAtOnce-1)/2)*20;
});


var fireRateUp_item = new item("fireRateUp", "common");
fireRateUp_item.addAbility("fireRate", x => x-0.1);


// var Shotgun_item = new item("Shotgun", "uncommon");


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
        this.abilities = {"Bullets" : {}, "Player" : {}};
    }
    
    static getAbilityList(appliedObj) {
        if(appliedObj == "Bullets") {
            return [
                "damage", "speed", "fireRate", "fireAtOnce", "piercing",
                "type", "collideEnemyBullet", "image", "animation", "fireSound",
                'outOfBoundsKill', 'checkWorldBounds', "maxBulletCount",
                "beforeFire", "firing", "afterFire", "hitEnemy", "always",
            ];
        }
        else if(appliedObj == "Player") {
            return [
                "maxHealth", "evasion", "speed", "image", "animation",
                "always", "colideEnemy", "moving", "invincible"
            ];
        }
    }

    addAbility(type, appliedObj, value) {
        if(!item.getAbilityList(appliedObj).includes(type)) throw new UndefinedTypeError("undefined ability type!");
        if(!this.abilities[appliedObj][type]) this.abilities[appliedObj][type] = [];
        this.abilities[appliedObj][type].push(value);
    }
}

// 웹브라우저 콘솔에서 게임을 실행시킨 후 Bullets.addItem(laser_item);
// 를 입력하면 공격이 레이저로 바뀝니다.
// make laser item
var laser_item = new item("laser", "uncommon");

laser_item.addAbility("damage", "Bullets", x => x/3);
laser_item.addAbility("fireRate", "Bullets", x => x*3);
laser_item.addAbility("type", "Bullets", x => "laser");
laser_item.addAbility("piercing", "Bullets", x => 0);
laser_item.addAbility("firing", "Bullets", (bulletObj, currentBullet) => {
    currentBullet.body.velocity.x = Player.sprite.body.velocity.x;
    currentBullet.body.velocity.y = Player.sprite.body.velocity.y;
});
laser_item.addAbility("animation", "Bullets", obj => {
    obj.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});

// make pierce item
var pierce_item = new item("pierce", "common");

pierce_item.addAbility("piercing", "Bullets", x => {
    if(x > 0) return x+1;
    else return x;
});

// make bullet tracking item
var tracking_item = new item("tracking", "uncommon");

tracking_item.addAbility("firing", "Bullets", (bulletObj, currentBullet) => {
    let enemy = aliens.getClosestTo({x:currentBullet.x - aliens.x,y:currentBullet.y-30});
    // console.log(this.Bullets.info.bulletSpeed);
    let trackingPerformance = 0.03;
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

addBullet_item.addAbility("fireAtOnce", "Bullets", x => x+1);
addBullet_item.addAbility("beforeFire", "Bullets", (bulletObj, currentBullet) => {
    // console.log(this);
    bulletObj.info.initValue.position.x = 20;
    bulletObj.info.initValue.position.y = (bulletObj.currentShotCount - (bulletObj.info.fireAtOnce-1)/2)*20;
});


var fireRateUp_item = new item("fireRateUp", "common");

fireRateUp_item.addAbility("fireRate", "Bullets", x => x-0.1);
var playerSpeedUp_item = new item("speedUp", "common");
playerSpeedUp_item.addAbility("speed", "Player", x => x+10);

var superArmer_item = new item("superArmer", "common");

superArmer_item.addAbility("invincibleTime", "Player", x => game.time.now + 15000);





// var Shotgun_item = new item("Shotgun", "uncommon");
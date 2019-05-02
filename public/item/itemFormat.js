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
        return ["damage", "bulletSpeed", "fireRate", "playerSpeed", "evasion", "pierceing",
        "bulletType", "bulletMovement", "beforeFire", "firing", "afterFire", "bulletCollision",
        "hitEnemy", "always", "using", "playerImage", "bulletAnimation", "bulletFireSound"];
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
laser_item.addAbility("pierceing", x => -1);
laser_item.addAbility("bulletMovement", (object) => {
    return {
        x : player.body.velocity.x,
        y : player.body.velocity.y
    }
});
laser_item.addAbility("bulletAnimation", object => {
    object.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});

var pierce_item = new item("pierce", "common");
pierce_item.addAbility("pierceing", x => x+1);

var tracking_item = new item("tracking", "common");
// tracking_item.addAbility("bulletSpeed", x => x)
tracking_item.addAbility("bulletMovement", (object) => {
    let enemy = aliens.getClosestTo({x:object.x - aliens.x,y:object.y-30});
    // console.log(this.Bullets.info.bulletSpeed);
    let trackingPerformance = 0.03;
    let x = object.body.velocity.x+(enemy.body.x-object.x)*trackingPerformance;
    let y = object.body.velocity.y+(enemy.body.y-object.y)*trackingPerformance;

    let currentBulletSpeed = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );
    let expectedBulletSpeed = this.Bullets.info.bulletSpeed*100;
    if ( currentBulletSpeed > expectedBulletSpeed ){
        let reduceAmount = expectedBulletSpeed/currentBulletSpeed;
        x = x*reduceAmount;
        y = y*reduceAmount;
    }

    if(x == 0){
        if(y > 0) object.rotation = Math.PI/2;
        else object.rotation = -Math.PI/2;
    }
    else object.rotation = Math.atan(y/x);

    return {
        x : x, 
        y : y
    }
});

// var missile_item = new item("missile", "uncommon");


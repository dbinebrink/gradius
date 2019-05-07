// Create an object type UserException
class UndefinedTypeError {
    constructor(message) {
        this.message = message;
        this.name = "UndefinedTypeError";
    }

    toString() { return this.name + ': "' + this.message + '"'; }
}

itemAbilityTags = {
    "Player" : {
        "changeParameter" : [
            "maxHealth", "evasion", "speed", "image", "invincibleTime", "healthUp"
        ],
        "changeFunction" : [
            "animation"
        ],
        "addFunction" : [
            "always", "colideEnemy", "moving"
        ]
    },
    
    "Bullets" : {
        "changeParameter" : [
            "damage", "speed", "fireRate", "fireAtOnce",
            "penetration", "image", "fireSound",
            "outOfBoundsKill", "collideEnemyBullet",
            "checkWorldBounds", "maxBulletCount"
        ],
        "changeFunction" : [
            "animation"
        ],
        "addFunction" : [
            "beforeFire", "firing", "afterFire", "hitEnemy", "always"
        ]
    }
}

itemList = [];
dropTable = {common:[], uncommon:[]};
uncommonDropTime = 0;


class item {
    constructor(name, rarity, isActive = false) {
        this.name = name;
        this.rarity = rarity;
        this.isActive = isActive;
        this.abilities = {
            "Bullets" : {
                "changeParameter" : {},
                "changeFunction" : {},
                "addFunction" : {}
            },
            "Player" : {
                "changeParameter" : {},
                "changeFunction" : {},
                "addFunction" : {}
            }
        };

        this.addToItemList();
    }

    addToItemList(){
        dropTable[this.rarity].push(itemList.length);
        itemList.push(this);
    }

    addAbility(appliedObj, type, tag, value, priority = 5) {
        if(!itemAbilityTags[appliedObj][type].includes(tag)) throw new UndefinedTypeError("undefined ability type!");

        if(type == "addFunction"){
            if(!this.abilities[appliedObj][type][tag]) this.abilities[appliedObj][type][tag] = []
            this.abilities[appliedObj][type][tag].push({
                "priority" : priority,
                "function" : value
            });
        }
        else{
            this.abilities[appliedObj][type][tag] = value;
        }
    }
}

// 웹브라우저 콘솔에서 게임을 실행시킨 후 Bullets.addItem(laser_item);
// 를 입력하면 공격이 레이저로 바뀝니다.
// make laser item
let laser_item = new item("laser-bullet", "uncommon");

laser_item.addAbility("Bullets", "changeParameter", "damage", x => x/3);
laser_item.addAbility("Bullets", "changeParameter", "fireRate", x => x*3);
laser_item.addAbility("Bullets", "changeParameter", "image", x => 'laser');
laser_item.addAbility("Bullets", "changeParameter", "penetration", x => 0);
laser_item.addAbility("Bullets", "changeFunction", "animation", obj => {
    obj.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});
laser_item.addAbility("Bullets", "addFunction", "firing", (bulletObj, currentBullet) => {
    currentBullet.body.x = Player.sprite.body.x + bulletObj.info.initValue.position.x;
    currentBullet.body.y = Player.sprite.body.y;
});

// make pierce item
let pierce_item = new item("addPenetration", "common");

pierce_item.addAbility("Bullets", "changeParameter", "penetration", x => {
    if(x > 0) return x+1;
    else return x;
});

// make double bullet fire item
let addBullet_item = new item("addBullet", "common");

addBullet_item.addAbility("Bullets", "changeParameter", "fireAtOnce", x => x+1);
addBullet_item.addAbility("Bullets", "addFunction", "beforeFire", (bulletObj, currentBullet) => {
    bulletObj.info.initValue.position.x = 20;
    bulletObj.info.initValue.position.y = (bulletObj.currentShotCount - (bulletObj.info.fireAtOnce-1)/2)*20;
});

// make bullet tracking item
let tracking_item = new item("tracking", "uncommon");

tracking_item.addAbility("Bullets", "addFunction", "firing", (bulletObj, currentBullet) => {
    let enemy = aliens.getClosestTo({x:currentBullet.x - aliens.x,y:currentBullet.y-30});
    let trackingPerformance = 0.03;
    let x = currentBullet.body.velocity.x+(enemy.body.x-currentBullet.x)*trackingPerformance;
    let y = currentBullet.body.velocity.y+(enemy.body.y-currentBullet.y)*trackingPerformance;

    let currentBulletSpeed = Math.sqrt( Math.pow(x,2)+Math.pow(y,2) );
    let expectedBulletSpeed = bulletObj.info.bulletSpeed*100;

    if( currentBulletSpeed > expectedBulletSpeed ){
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
}, 2);


let fireRateUp_item = new item("fireRateUp", "common");
fireRateUp_item.addAbility("Bullets", "changeParameter", "fireRate", x => x-0.1);

let playerSpeedUp_item = new item("speedUp", "common");
playerSpeedUp_item.addAbility("Player", "changeParameter", "speed", x => x+10);

let superArmer_item = new item("superArmor", "common");
superArmer_item.addAbility("Player", "changeParameter", "invincibleTime", x => game.time.now + 5000);

let damageUP_item = new item("damageUp", "common");
damageUP_item.addAbility("Bullets", "changeParameter", "damage", x => x+1);

let Heart_item = new item("heart", "common");
Heart_item.addAbility("Player", "changeParameter", "healthUp", x => Player.heal(1));

// var Shotgun_item = new item("Shotgun", "uncommon");
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
        "bulletType", "bulletMovement", "beforeFire", "firing", "afterFire",
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
laser_item.addAbility("damage", function(x){return x+3});
laser_item.addAbility("fireRate", function(x){return x*3});
laser_item.addAbility("bulletType", function(x){return "laser"});
laser_item.addAbility("pierceing", function(x){return true});
laser_item.addAbility("bulletMovement", function(x,y){
    return {
        "x":player.body.velocity.x,
        "y":player.body.velocity.y
    }
});
laser_item.addAbility("bulletAnimation", function(object){
    object.animations.add('shootBeam', [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,4]);
    return 'shootBeam';
});
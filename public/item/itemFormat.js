// Create an object type UserException
class UndefinedTypeError {
    constructor(message) {
        this.message = message;
        this.name = "UndefinedTypeError";
    }

    toString(){
        return this.name + ': "' + this.message + '"';
    }
}

class item {
    constructor(name, rarity, isActive = false) {
        this.name = name;
        this.rarity = rarity;
        this.isActive = isActive;
        this.abilities = {};
    }
    
    static getAbilityList(){
        return ["damage", "bulletSpeed", "shotSpeed", "playerSpeed", "evasion", "bulletType", "bulletTrace", "beforeFire", "firing", "afterFire", "always", "using"];
    }

    addAbility(type, value) {
        if(!item.getAbilityList().includes(type)) throw UndefinedTypeError("undefined ability type!");
        if(!this.abilities[type]) this.abilities[type] = [];
        this.abilities[type].push(value);
    }
}

itemPools = [];

var items = {
    McDonalds: function () // increase health by 1 heart
    {

    },
    Crumped_Paper: function () // shoot paper shots
    {

    },
    Korean_Flag: function () // increase intelligence by 20% (multiplier applied last)
    {

    },
    Glasses: function () // 20/20; shoot 2 tears at a time
    {

    },
    Boba: function () // + 200% stamina (overflow into stamina shield)
    {

    },
    Senioritis: function () // - 50% max stamina
    {

    },

}

class Item {
    constructor(array) {
        this.damageIncrease = 0; // in CB per second
        this.damageMultiplier = 0; // in CB per second

        this.shotSpeedIncrease = 0; // in CB per second
        this.shotSpeedMultiplier = 0; // in CB per second

        this.shotDelayDown = 0; // in milliseconds
        this.shotDelayMinimunDown = 0; // in milliseconds

        this.speedIncrease = 0; // in CB per second
        this.speedMultiplier = 0; // in CB per second

        this.rangeIncrease = 0; // in milliseconds
        this.rangeMultiplier = 0; // in milliseconds

        this.intelligenceIncrease = 0; // in IQ points
        this.intelligenceMultiplier = 0; // in IQ points

        this.healthIncrease = 0; // in hearts
        this.heartContainerIncrease = 0;
        if (array === undefined) {
            array = itemPools//WIP
        }
        if (array instanceof Array) {
            array.push(this);
        }
        else if (array instanceof Player) {
            player.items.push(this);
        }
    }
}

class Glasses extends Item {
    constructor(array) {
        super(array);
        this.intelligenceIncrease = 10;
    }
}
class EE_Redflag extends Item {
    constructor(array) {
        super(array);
        this.heartContainerIncrease = - 1;
    }
}
class Korean_Flag extends Item {
    constructor(array) {
        super(array);
        this.intelligenceMultiplier = .2;
    }
}
class McDonalds extends Item {
    constructor(array) {
        super(array);
        this.heartContainerIncrease = 1;
    }
}
class Impending_Deadline extends Item {
    constructor(array) {
        super(array);
        this.speedIncrease = 2;
    }
}
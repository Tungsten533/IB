var items = {
    McDonalds : function() // increase health by 1 heart
    {

    },
    Crumped_Paper : function() // shoot paper shots
    {

    },
    Korean_Flag : function() // increase intelligence by 20% (multiplier applied last)
    {

    },
    Glasses : function() // 20/20; shoot 2 tears at a time
    {

    },
    Boba : function() // + 200% stamina (overflow into stamina shield)
    {

    },
    Senioritis : function() // - 50% max stamina
    {
        
    },

}

class Item
{
    constructor()
    {
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

       this.healthIncrease = []; // in hearts
    }
}

class Glasses extends Item
{
    constructor()
    {
        super();
        
    }
}
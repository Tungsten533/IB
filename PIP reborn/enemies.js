let allEnemies = [];
class Enemy extends Entity
{
    constructor(c, r, hitBoxRadiusCB, health)
    {
        super(c, r, hitBoxRadiusCB, health);
        this.hurtPlayer = true;//default
        
    }
    /*
    hitBoxUpdate()
    {
        super.hitBoxUpdate();
    }
    collisionDetection()
    {
        super.collisionDetection();
    }
    convertCB()
    {
        super.convertCB();
    }*/
    update()
    {
        super.update();
        this.colliders = allPlayers.slice();
    }
}
class Turret extends Enemy
{
    constructor(c, r)
    {
        let hitBoxRadiusCB = 5.5;//in CB
        super(c, r, hitBoxRadiusCB);
        this.colliders = [];
        this.colliders = allPlayers.slice();
        for(let b of allBlocks)
        {
            if(b.type === blockType.wall)
                this.colliders.push(b)
        }
        this.movementSpeed = 40;//in CB per sec
        this.xFacing = 1;
        this.yFacing = 1;
    }
    update()
    {
        super.collisionDetection();
        super.hitBoxUpdate();
        super.convertCB();
        if (this.collidingLeft && this.xFacing < 0)
        {
            this.xFacing *= -1;
        }
        else if (this.collidingRight && this.xFacing > 0)
        {
            this.xFacing *= -1;
        }
        if (this.collidingTop && this.yFacing < 0)
        {
            this.yFacing *= -1;
        }
        else if (this.collidingBottom && this.yFacing > 0)
        {
            this.yFacing *= -1;            
        }
        this.xCB +=  this.movementSpeed * this.xFacing / fps;
        this.yCB += this.movementSpeed * this.yFacing / fps;
        fill(240);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}
function newTurret(c, r, hitBoxRadiusCB, health)
{
    var nT = new Turret(c + 2, r + 2, hitBoxRadiusCB, health);
    allEnemies.push(nT);
    allEntities.push(nT);
}
class PunchingBag extends Enemy
{
    constructor(c, r, health)
    {
        health = Infinity;
        let hitBoxRadiusCB = 5;
        super(c, r, hitBoxRadiusCB, health);
    }
    update()
    {
        super.update();
        fill(0, 0, 150);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}

function newPunchingBag(c, r, health, colliders)
{
    var n = new PunchingBag(c + 2, r + 2, health, colliders);
    allEnemies.push(n);
    allEntities.push(n);
}
class Fly extends Enemy
{
    constructor(c, r, hitBoxRadiusCB, health, colliders)
    {
        super(c, r, hitBoxRadiusCB, health, colliders);

    }
}
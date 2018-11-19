let allTears = [];

class Tear extends Entity
{
    constructor(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, owner, range, damage, health)
    {
        super(null, null, size, health);
        this.xCB = xCB;//in CB
        this.yCB = yCB;// in CB
        this.shotAngle = shotAngle;// in radians
        this.movementSpeed = shotSpeed;//in CB
        this.range = range;
        this.birthTime = millis();
        this.damage = damage;
        this.owner = owner;

        this.inertialXSpeed = referenceXSpeed;
        this.inertialYSpeed = -referenceYSpeed;

        this.xShotSpeed = this.movementSpeed * Math.cos(this.shotAngle);
        this.yShotSpeed = -this.movementSpeed * Math.sin(this.shotAngle);

        this.xSpeedCB = this.inertialXSpeed * .2 + this.xShotSpeed;
        this.ySpeedCB = this.inertialYSpeed * .2 + this.yShotSpeed;
        
        this.facingMovement = atan2(this.ySpeedCB, this.ySpeedCB);// in radians
        this.speed = Math.sqrt(Math.pow(this.xSpeedCB, 2) + Math.pow(this.ySpeedCB, 2));
        if (this.speed < this.shotspeed)
        {
            this.speed = this.shotSpeed;
            this.xSpeedCB = this.speed * Math.cos(this.facingMovement);
            this.ySpeedCB = this.speed * Math.sin(this.facingMovement);
        }
    }
    selfDestructDetection()
    {
        for(let c of this.collidingEntities)
        {
            if(c instanceof Block)
            {
                if(c.isSolid)
                {
                    this.selfDestruct = true;
                }
            }/*
            if(c instanceof Enemy)
            {
                if(!this.piercing)
                {
                    this.selfDestruct = true;
                }
            }*/
        }
    }
    update()
    {

        if(this.owner instanceof Player)
        {
            this.colliders = this.originalColliders.concat(allEnemies, allObstacles);
        }
        
        this.lifeTime = millis() - this.birthTime;
        if (this.lifeTime >= this.range)
        {
            this.selfDestruct = true;
        }
        super.collisionDetection();
        this.selfDestructDetection();
        this.xCB += this.xSpeedCB / fps;
        this.yCB += this.ySpeedCB / fps;
        super.convertCB();
        
        fill(200, 200, 255);
        stroke(255, 100)
        strokeWeight(4)
        if (this.collidingEntities.length > 0)
        {
            ellipse(this.x, this.y, this.hitBoxRadius * 100, this.hitBoxRadius * 100);
        }
        else
            ellipse(this.x, this.y, this.hitBoxRadius, this.hitBoxRadius);
    }

}
function newTear(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, targets, range)
{
    let t = new Tear(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, targets, range);
    allTears.push(t);
    allEntities.push(t);
}
let allPlayers = [];
class Player extends Entity
{
    constructor(collumn, row)
    {
        if(collumn === null)
            collumn = 7 + 2;
        if(row === null)
            row = 4 + 2;
        let health = 6;
        super(collumn, row, 7, health);
        this.movementSpeed = 50;// in centiblocks per sec
        this.shotSpeed = 55;// in centiblocks per sec
        this.shotDelay = 500;// in milliseconds
        this.shotDelayMinimun = 50;// in milliseconds
        this.shootReady = true;
        this.shotCooldown = 0;
        this.oldTime = 0;
        this.eye = 0;
        this.range = 1200;// in milliseconds

        this.hitBoxRadiusCB = 4;// in centiblocks
        //this.facingMovement = 90;// in degrees
        //this.facingShooting = 90;// in degrees
        this.referenceXSpeed = 0;// in CB / s
        this.referenceYSpeed = 0;// in CB / s
        this.hitBoxRadius;//in pixels
        this.tearSizeCB = 3;// in CB
        this.tearHealth = 1;// how many entities it can hit
    }
    findMovementFacing()
    {
        let xS = 0;
        let yS = 0;

        if(keyIsDown(87))//w for up
        {
            yS += 1;
        }
        if (keyIsDown(83))// s for down
        {
            yS += -1;
        }
        if (keyIsDown(65))//a for left 
        {
            xS += -1;
        }
        if (keyIsDown(68))// d for right
        {
            xS += 1;
        }
        if (!(yS == 0 && xS == 0))
        {
            this.facingMovement = Math.atan2(yS, xS);
            let movementAngle = Math.atan2(yS, xS);
            this.referenceXSpeed = this.movementSpeed * Math.cos(movementAngle)
            this.referenceYSpeed = this.movementSpeed * Math.sin(movementAngle)
            if((this.referenceXSpeed < 0 && !this.collidingLeft) || (this.referenceXSpeed > 0 && !this.collidingRight))
                this.xCB += this.referenceXSpeed / fps;
            if((this.referenceYSpeed > 0 && !this.collidingTop) || (this.referenceYSpeed < 0 && !this.collidingBottom))
                this.yCB -= this.referenceYSpeed / fps;
        }
        else
        {
            this.referenceXSpeed = 0
            this.referenceYSpeed = 0
        }
    }
    findShootingFacing()
    {

        let xS = 0;
        let yS = 0;
        let shoot = false;

        if(keyIsDown(38))//up arrow for up
        {
            yS += 1;
        }
        else if (keyIsDown(40))// down arrow for down
        {
            yS += -1;
        }
        else if (keyIsDown(37))//left arrow for left 
        {
            xS += -1;
        }
        else if (keyIsDown(39))// right arrow for right
        {
            xS += 1;
        }
        if (!(yS == 0 && xS == 0))
        {
            this.facingShooting = Math.atan2(yS, xS);
            shoot = true;
        }
        else
        {
            this.facingShooting = Math.PI / 2;
            shoot = false;
        }
        if(this.shotCooldown <= 0)
        {
            this.shootReady = true;
        }
        else
        {
            this.shootReady = false;
        }
        if (shoot && this.shootReady)
        {
            let tearXCB = this.xCB;
            let tearYCB = this.yCB;
            let shiftAngle = this.facingShooting;
            if (this.eye % 2 === 0)
            {
                shiftAngle -= Math.PI / 2;
                tearXCB += Math.cos(shiftAngle) * this.hitBoxRadiusCB / 3;
                tearYCB += Math.sin(shiftAngle) * this.hitBoxRadiusCB / 3;
            }
            else if (this.eye % 2 !== 0)
            {
                shiftAngle += Math.PI / 2;
                tearXCB += Math.cos(shiftAngle) * this.hitBoxRadiusCB / 3;
                tearYCB += Math.sin(shiftAngle) * this.hitBoxRadiusCB / 3;
            }
            newTear(tearXCB, tearYCB, this.tearSizeCB, this.facingShooting, this.shotSpeed, this.referenceXSpeed, this.referenceYSpeed, this, this.range, this.tearHealth);
            this.shotCooldown = this.shotDelay;
            this.eye++;
        }
        this.shotCooldown -= millis() - this.oldTime;
        this.oldTime = millis()
    }
    update()
    {/*
        if(this.colliders.length !== this.originalColliders.length + allEnemies.length + allObstacles.length)
        {
            this.colliders = this.originalColliders.slice();
            for(let e of allEnemies)
            {

            }
        }*/
        this.hitBoxRadius = this.hitBoxRadiusCB * centiBlock;
        this.xCB = (mouseX - xBorder) / centiBlock;
        this.yCB = (mouseY - yBorder) / centiBlock;
        this.colliders = this.originalColliders.concat(allEnemies, allObstacles)
        this.findMovementFacing();
        this.findShootingFacing();
        super.collisionDetection();
        super.convertCB();
        if(this.collidingEntities.length !== 0)
            fill(0);
        else
            fill(255, 100, 100)
        stroke(0)
        strokeWeight(1)
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);

    }
}
function newPlayer(c, r)
{/*
    if (c < 0)
        c = 0;
    else if (c > 13)
        c = 13;
    if (r < 0)
        r = 0;
    else if (r > 7)
        r = 7;*/
    var p = new Player(c + 2, r + 2);
    allPlayers.push(p);
    allEntities.push(p);
}
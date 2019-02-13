//let allPlayers = [];
var Character = {
    default: {
        health: 6,
        movementSpeed: 50,// in centiblocks per sec
        shotSpeed: 55,// in centiblocks per sec
        shotDelay: 500,// in milliseconds
        shotDelayMinimun: 50,// in milliseconds
        range: 1200,// in milliseconds
        damage: 20,

        hitBoxRadiusCB: 4,// in centiblocks
        referenceXSpeed: 0,// in CB / s
        referenceYSpeed: 0,// in CB / s
        tearSizeCB: 1.5,// in CB
        tearHealth: 1,// how many entities it can hit
        items: [],
    },
    William_III: {

    },

    Alex_in_IB: {
        health: 0
    }

}
let playerCharacter = Character.default;

class Player extends Entity {
    constructor(column, row, character) {
        if (column === null)
            column = 7 + 2;
        if (row === null)
            row = 4 + 2;
        super(column, row, 7, null);
        this.character = character;
        if (this.character === undefined) {
            this.character = Character.default;
        }
        this.health = this.character.health;
        this.movementSpeed = this.character.movementSpeed;// in centiblocks per sec
        this.shotSpeed = this.character.shotSpeed;// in centiblocks per sec
        this.shotDelay = this.character.shotDelay;// in milliseconds
        this.shotDelayMinimun = this.character.shotDelayMinimun;// in milliseconds
        this.range = this.character.range;// in milliseconds
        this.damage = this.character.damage;

        this.collidingEntities = [];

        this.hitBoxRadiusCB = this.character.hitBoxRadiusCB;// in centiblocks
        //this.facingMovement = 90;// in degrees
        //this.facingShooting = 90;// in degrees
        this.tearSizeCB = this.character.tearSizeCB;// in CB
        this.tearHealth = this.character.tearHealth;// how many entities it can hit
        this.items = this.character.items;
        this.invincible = true;

        this.referenceXSpeed = 0;// in CB / s
        this.referenceYSpeed = 0;// in CB / s
        this.currentMovementSpeed = this.movementSpeed;
        this.hitBoxRadius;//in pixels
        this.shootReady = true;
        this.shotCooldown = 0;
        this.oldTime = 0;
        this.eye = 0;
        this.ownerRoom.allPlayers.push(this);
    }
    findMovementFacing() {
        if(fps == 0) {
            return;
        }
        let xS = 0;
        let yS = 0;

        if (keyIsDown(87))//w for up
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
        if (!(yS == 0 && xS == 0)) {
            //this.facingMovement = Math.atan2(yS, xS);
            let movementAngle = Math.atan2(yS, xS);
            this.referenceXSpeed = this.movementSpeed * Math.cos(movementAngle)
            this.referenceYSpeed = this.movementSpeed * Math.sin(movementAngle)
            //if ((this.referenceXSpeed < 0 && !this.collidingLeft) || (this.referenceXSpeed > 0 && !this.collidingRight))
                this.xCB += this.referenceXSpeed / fps;
            //if ((this.referenceYSpeed > 0 && !this.collidingTop) || (this.referenceYSpeed < 0 && !this.collidingBottom))
                this.yCB -= this.referenceYSpeed / fps;
            this.invincible = false;
        } /*else if (!(yS == 0 && xS == 0)) {

            for(let entity of this.collidingEntities) {
                if(!(entity instanceof Tear)) {
                    let angleBetween = Math.atan2(this.yCB - entity.yCB, this.xCB - entity.xCB) % (2 * Math.PI);
                    let intendedMovementAngle = Math.atan2(yS, xS);
                    // if you want to move within 45º of the entity
                    if(Math.abs(intendedMovementAngle - angleBetween) <= Math.PI / 4) {
                        if(Math.cos(angleBetween) > 0) {
                            this.currentMovementSpeed = this.movementSpeed * Math.sin(angleBetween + Math.PI / 2);
                        } else if(Math.cos(angleBetween < 0)) {
                            this.currentMovementSpeed = this.movementSpeed * Math.sin(angleBetween - Math.PI / 2);
                        }
                        this.referenceXSpeed = this.movementSpeed * Math.cos(this.currentMovementSpeed);
                        this.referenceYSpeed = this.movementSpeed * Math.sin(this.currentMovementSpeed);
                        this.xCB += this.referenceXSpeed / fps;
                        this.yCB -= this.referenceYSpeed / fps;
                    }
                }
            }
        }*/
        else {
            this.referenceXSpeed = 0
            this.referenceYSpeed = 0
        }
    }
    findShootingFacing() {

        let xS = 0;
        let yS = 0;
        let shoot = false;

        if (keyIsDown(38))//up arrow for up
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
        if (!(yS == 0 && xS == 0)) {
            this.facingShooting = Math.atan2(yS, xS);
            shoot = true;
        }
        else {
            this.facingShooting = Math.PI / 2;
            shoot = false;
        }
        if (this.shotCooldown <= 0) {
            this.shootReady = true;
        }
        else {
            this.shootReady = false;
        }
        if (shoot && this.shootReady) {
            let tearXCB = this.xCB;
            let tearYCB = this.yCB;
            let shiftAngle = this.facingShooting;
            if (this.eye % 2 === 0) {
                shiftAngle -= Math.PI / 2;
                tearXCB += Math.cos(shiftAngle) * this.hitBoxRadiusCB / 3;
                tearYCB += Math.sin(shiftAngle) * this.hitBoxRadiusCB / 3;
            }
            else if (this.eye % 2 !== 0) {
                shiftAngle += Math.PI / 2;
                tearXCB += Math.cos(shiftAngle) * this.hitBoxRadiusCB / 3;
                tearYCB += Math.sin(shiftAngle) * this.hitBoxRadiusCB / 3;
            }
            new Tear(tearXCB, tearYCB, this.tearSizeCB, this.facingShooting, this.shotSpeed, this.referenceXSpeed, this.referenceYSpeed, this, this.range, this.damage, this.tearHealth);

            this.shotCooldown = this.shotDelay;
            this.eye++;
        }
        this.shotCooldown -= millis() - this.oldTime;
        this.oldTime = millis()
    }
    update() {
        this.currentMovementSpeed = this.movementSpeed;
        /*
        if(this.colliders.length !== this.originalColliders.length + allEnemies.length + allObstacles.length)
        {
            this.colliders = this.originalColliders.slice();
            for(let e of allEnemies)
            {

            }
        }*/
        this.hitBoxRadius = this.hitBoxRadiusCB * centiBlock;
        //this.xCB = (mouseX - xBorder) / centiBlock;
        //this.yCB = (mouseY - yBorder) / centiBlock;
        this.colliders = this.originalColliders.concat(this.ownerRoom.allEnemies, this.ownerRoom.allObstacles)
        this.findMovementFacing();
        this.findShootingFacing();
        super.collisionDetection();
        super.convertCB();
        if (this.collidingEntities.length !== 0)
            fill(0);
        else
            fill(255, 100, 100);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
        fill(255);
        textAlign(CENTER, CENTER);
        text(this.health, this.x, this.y);

    }
}

class Heart {
    constructor(array, health) {
        if (health === null) {
            health = 2;//in half hearts
        }

        this.health = health;
        array.push(this);
    }
}

/*
function newPlayer(c, r) {
    if (c < 0)
        c = 0;
    else if (c > 13)
        c = 13;
    if (r < 0)
        r = 0;
    else if (r > 7)
        r = 7;
    var p = new Player(c + 2, r + 2);
    allPlayers.push(p);
    allEntities.push(p);
}*/

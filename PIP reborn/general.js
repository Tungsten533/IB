
//relative coords for creating a "draggable field"
var xGlobal;
var yGlobal;

//global values that depend on the size of the window
var blockSize;
var xUsable;
var yUsable;
var xBorder;
var yBorder;
var blockSizeMax = 120;
var resize = false;
//var allBlocks = [];
var centiBlock;

//var allObstacles = [];
//var allEntities = [];

//sizes
var roomType = {
    normal: 666000001,

}
Object.freeze(roomType);

//entities information
class Entity {
    constructor(collumn, row, hitBoxRadiusCB, health, owner) {
        this.owner = currentRoom;
        if (owner instanceof Room) {
            this.owner = owner;
        }
        this.xCB = (collumn + 2 - .5) * 10;// in centiblocks
        this.yCB = (row + 2 - .5) * 10;// in centiblocks
        this.hitBoxRadiusCB = hitBoxRadiusCB;//in centiblocks
        this.health = health;//in half hearts integers for players and in large numbers for enemies
        this.collidingLeft = false;
        this.collidingRight = false;
        this.collidingTop = false;
        this.collidingBottom = false;
        this.colliders = [];
        this.oldObstacleNum = this.owner.allObstacles.length;
        this.selfDestruct = false;
        this.originalColliders = [];
        this.blacklistedEntities = [];
        this.damage = 1;
        this.playerCanPassThrough = false;
        this.entitiesHit = [];
        this.cantTouchThis = false;
        this.invincible = false;
        this.isMovable = true;

        /*
        for(let i of allObstacles)
        {
            this.colliders.push(i);
        }*/

        for (let i of this.owner.allObstacles) {
            if (i.type !== blockType.floor) {
                this.originalColliders.push(i);
                this.colliders.push(i);
            }
        }
        this.hitBoxUpdate();
    }
    hitBoxUpdate() {
        this.hitBoxLeftCB = this.xCB - this.hitBoxRadiusCB;
        this.hitBoxRightCB = this.xCB + this.hitBoxRadiusCB;
        this.hitBoxTopCB = this.yCB - this.hitBoxRadiusCB;
        this.hitBoxBottomCB = this.yCB + this.hitBoxRadiusCB;
    }
    collisionDetection() {
        this.collidingLeft = false;
        this.collidingRight = false;
        this.collidingTop = false;
        this.collidingBottom = false;
        this.hitBoxUpdate();
        this.collidingEntities = [];
        //let collisionLeft = false;
        //let collisionRight = false;
        //let collisionTop = false;
        //let collisionBottom = false;
        for (let entity of this.colliders) {
            if (entity.playerCanPassThrough && this instanceof Player)
                continue
            /*
            if(this.hitBoxLeftCB <= entity.hitBoxRightCB)
            {
                collisionLeft = true;
            }
            if(this.hitBoxRightCB >= entity.hitBoxLeftCB)
            {
                collisionRight = true;

            }
            if(this.hitBoxTopCB <= entity.hitBoxBottomCB)
            {
                collisionTop = true;
            }
            if(this.hitBoxBottomCB >= entity.hitBoxTopCB)
            {
                collisionBottom = true;
            }
            if(collisionLeft && collisionRight && collisionTop && collisionBottom)
            {
                this.collidingEntities.push(entity);

            }
            else
            {
                this.collidingLeft = false;
                this.collidingTop = false;
                this.collidingBottom = false;
                this.collidingBottom = false;
            }*/
            let distanceBetween = Math.sqrt(Math.pow(this.xCB - entity.xCB, 2) + Math.pow(this.yCB - entity.yCB, 2));
            //let angleBetween = Math.atan2(this.yCB - entity.yCB, this.xCB - entity.xCB);
            if (entity instanceof Block)// 1 / cos
            {
                if (entity.isWalkable)
                    continue
                let collisionLeft = false;
                let collisionRight = false;
                let collisionTop = false;
                let collisionBottom = false;
                let maxPossibleCollision = this.hitBoxRadiusCB + Math.SQRT2 * 5;
                if (distanceBetween <= maxPossibleCollision) {
                    if (this.hitBoxLeftCB <= entity.hitBoxRightCB) {
                        collisionLeft = true;
                    }
                    if (this.hitBoxRightCB >= entity.hitBoxLeftCB) {
                        collisionRight = true;
                    }
                    if (this.hitBoxTopCB <= entity.hitBoxBottomCB) {
                        collisionTop = true;
                    }
                    if (this.hitBoxBottomCB >= entity.hitBoxTopCB) {
                        collisionBottom = true;
                    }
                    if (collisionLeft && collisionRight && collisionTop && collisionBottom) {
                        this.collidingEntities.push(entity);
                        //this.collidingLeft = collisionLeft;
                        //this.collidingRight = collisionRight;
                        //this.collidingTop = collisionTop;
                        //this.collidingBottom = collisionBottom;
                    }

                    /*
                    let properDist = Math.abs((5 + this.hitBoxRadiusCB) / Math.cos(angleBetween));
                    let moveDist = properDist - distanceBetween;
                    if(this.xCB > entity.xCB)
                    {
                        this.xCB += moveDist * Math.cos(angleBetween);
                    }
                    else
                    {
                        this.xCB -= moveDist * Math.cos(angleBetween);
                    }
                    if(this.xCB > entity.xCB)
                    {
                        this.yCB += moveDist * Math.sin(angleBetween);
                    }
                    else 
                    {
                        this.yCB -= moveDist * Math.sin(angleBetween);
                    }
                    */
                }
            }
            else if (entity instanceof Entity && entity !== this) {
                if (this instanceof Tear && entity === this.shooter)
                    continue
                if (distanceBetween < this.hitBoxRadiusCB + entity.hitBoxRadiusCB) {
                    this.collidingEntities.push(entity);
                    entity.health - this.damage;
                    this.health - entity.damage;
                    this.blacklistedEntities.push(entity);
                }
            }
        }
        for (let e = this.blacklistedEntities.length - 1; e >= 0; e--) {
            let entity = this.blacklistedEntities[e];
            let distanceBetween = Math.sqrt(Math.pow(this.xCB - entity.xCB, 2) + Math.pow(this.yCB - entity.yCB, 2));
            if (distanceBetween >= this.hitBoxRadiusCB + entity.hitBoxRadiusCB) {
                this.blacklistedEntities.splice(e, 1)
            }
        }
        if (this.collidingEntities.length > 0) {
            for (let entity of this.collidingEntities) {
                //let angleBetween = Math.atan2(this.yCB - entity.yCB, this.xCB - entity.xCB) % (2 * Math.PI);
                let xDiff = this.xCB - entity.xCB;// from the perspective of this
                let yDiff = this.yCB - entity.yCB;
                let xIsMajor = false;
                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    xIsMajor = true;
                }
                if (xIsMajor) {
                    //console.log("x")
                    if (xDiff > 0) {
                        this.collidingLeft = true;
                    }
                    else if (xDiff < 0) {
                        this.collidingRight = true;
                    }
                }
                else {
                    //console.log("y")
                    if (yDiff > 0) {
                        this.collidingTop = true;
                    }
                    else if (yDiff < 0) {
                        this.collidingBottom = true;
                    }
                }
            }
            this.collisionRepulsion();
        }
    }
    collisionRepulsion() {
        for(let entity of this.collidingEntities) {
            if((entity instanceof Entity) && !(entity instanceof Tear) && (entity.isMovable) && !(this.playerCanPassThrough && entity instanceof Player)) {
                let angleBetween = Math.atan2(-this.yCB + entity.yCB, -this.xCB + entity.xCB) % (2 * Math.PI);
                let distanceBetweenDesired = entity.hitBoxRadiusCB + this.hitBoxRadiusCB;
                entity.yCB = this.yCB + distanceBetweenDesired * Math.sin(angleBetween);
                entity.xCB = this.xCB + distanceBetweenDesired * Math.cos(angleBetween);
                
            }else if(entity instanceof Block && this.isMovable) {
                if((this.xCB <= entity.hitBoxRightCB) && (this.xCB >= entity.hitBoxLeftCB)) {
                    //if the entity is hitting top or bottom
                    if(this.yCB < entity.hitBoxTopCB) {
                        this.yCB = entity.hitBoxTopCB - this.hitBoxRadiusCB;
                    } else {
                        this.yCB = entity.hitBoxBottomCB + this.hitBoxRadiusCB;
                    }
                } else if((this.yCB <= entity.hitBoxBottomCB) && (this.yCB >= entity.hitBoxTopCB)) {
                    //if the entity is hitting let or right
                    if(this.xCB < entity.hitBoxLeftCB) {
                        this.xCB = entity.hitBoxLeftCB - this.hitBoxRadiusCB;
                    } else {
                        this.xCB = entity.hitBoxRightCB + this.hitBoxRadiusCB;
                    }

                }else {
                    //if the entity is hitting a corner

                    if(this.xCB < entity.hitBoxLeftCB && this.yCB < entity.hitBoxTopCB) {
                        //top left corner
                        //angle must bein quadrant 3
                        let angleBetween = Math.atan2(this.yCB - entity.hitBoxTopCB, this.xCB - entity.hitBoxLeftCB) % (2 * Math.PI);
                        let distanceBetweenDesiredFromCorner = this.hitBoxRadiusCB;
                        this.yCB = entity.hitBoxTopCB + distanceBetweenDesiredFromCorner * Math.sin(angleBetween);
                        this.xCB = entity.hitBoxLeftCB + distanceBetweenDesiredFromCorner * Math.cos(angleBetween);


                    } else if(this.xCB > entity.hitBoxRightCB && this.yCB < entity.hitBoxTopCB) {
                        //top right corner
                        //angle must bein quadrant 4
                        let angleBetween = Math.atan2(this.yCB - entity.hitBoxTopCB, this.xCB - entity.hitBoxRightCB) % (2 * Math.PI);
                        let distanceBetweenDesiredFromCorner = this.hitBoxRadiusCB;
                        this.yCB = entity.hitBoxTopCB + distanceBetweenDesiredFromCorner * Math.sin(angleBetween);
                        this.xCB = entity.hitBoxRightCB + distanceBetweenDesiredFromCorner * Math.cos(angleBetween);

                    } else if(this.xCB < entity.hitBoxLeftCB && this.yCB > entity.hitBoxBottomCB) {
                        //bottom left corner
                        //angle must bein quadrant 1
                        let angleBetween = Math.atan2(this.yCB - entity.hitBoxBottomCB, this.xCB - entity.hitBoxLeftCB) % (2 * Math.PI);
                        let distanceBetweenDesiredFromCorner = this.hitBoxRadiusCB;
                        this.yCB = entity.hitBoxBottomCB + distanceBetweenDesiredFromCorner * Math.sin(angleBetween);
                        this.xCB = entity.hitBoxLeftCB + distanceBetweenDesiredFromCorner * Math.cos(angleBetween);

                    } else if(this.xCB > entity.hitBoxRightCB && this.yCB > entity.hitBoxBottomCB) {
                        //bottom right corner
                        //angle must bein quadrant 2
                        let angleBetween = Math.atan2(this.yCB - entity.hitBoxBottomCB, this.xCB - entity.hitBoxRightCB) % (2 * Math.PI);
                        let distanceBetweenDesiredFromCorner = this.hitBoxRadiusCB;
                        this.yCB = entity.hitBoxBottomCB + distanceBetweenDesiredFromCorner * Math.sin(angleBetween);
                        this.xCB = entity.hitBoxRightCB + distanceBetweenDesiredFromCorner * Math.cos(angleBetween);

                    }
                }
            }
        }
    }
    damaging() {
        if (this.collidingEntities.length === 0 || this.invincible) {
            return
        }

        for (let entity of this.collidingEntities) {
            let ignore = false;
            for (let eh of this.entitiesHit) {
                if ((eh === entity || entity.cantTouchThis) && !ignore) {
                    ignore = true;
                }
            }
            if (ignore)
                continue
            if (this instanceof Tear) {
                if (entity === this.owner)
                    continue
                if (entity instanceof Enemy || entity instanceof Player)//!!!! will not work. don't want enemies or players hurting each other
                {
                    if (!entity.invincible)
                        entity.health -= this.damage;
                    this.health -= entity.damage;
                    this.entitiesHit.push(entity);
                    entity.entitiesHit.push(this);
                }
            }
            else if (this instanceof Button)//?? what why would a button get or be damaged
            {

            }
        }
        for (let eh in this.entitiesHit) {
            let stillColliding = false;
            for (let entity of this.collidingEntities) {
                if (this.entitiesHit[eh] === entity)
                    stillColliding = true;
            }
            if (stillColliding === false)
                this.entitiesHit.splice(eh, 1);
        }
        if (this.health <= 0) {
            this.selfDestruct = true;
        }
    }
    convertCB() {
        this.x = this.xCB * centiBlock + xBorder;// + blockSize * 2;
        this.y = this.yCB * centiBlock + yBorder;// + blockSize * 2;
        this.hitBoxRadius = this.hitBoxRadiusCB * centiBlock;
    }
    baseUpdate() {
        this.convertCB();
        this.collisionDetection();
        this.damaging();
    }
}

function recalibrate() {
    resizeCanvas(windowWidth, windowHeight);

    //if wider use height as boundary
    if (width >= height * 17 / 11) {
        blockSize = height / 11;
    } //else if taller use width as boundary
    else if (height >= width * 11 / 17) {
        blockSize = width / 17;
    }
    // to create a maximum resolution
    if (blockSize > blockSizeMax) {
        blockSize = blockSizeMax;
    }
    centiBlock = blockSize / 10;
    xUsable = blockSize * 17;
    yUsable = blockSize * 11;
    xBorder = (width - xUsable) / 2;
    yBorder = (height - yUsable) / 2;
    xGlobal = xBorder;
    yGlobal = yBorder;
    resize = true;
}



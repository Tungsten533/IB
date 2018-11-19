
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
var allBlocks = [];
var centiBlock;

var allObstacles = [];
var allEntities = [];

//sizes
var roomType = {
    normal: 666000001,

}
Object.freeze(roomType);

//entities information
class Entity
{
    constructor(collumn, row, hitBoxRadiusCB, health)
    {
        this.xCB = (collumn - .5) * 10;// in centiblocks
        this.yCB = (row - .5) * 10;// in centiblocks
        this.hitBoxRadiusCB = hitBoxRadiusCB;//in centiblocks
        this.health = health;//in half hearts integers for players and in large numbers for enemies
        this.collidingLeft = false;
        this.collidingRight = false;
        this.collidingTop = false;
        this.collidingBottom = false;
        this.colliders = [];
        this.oldObstacleNum = allObstacles.length;
        this.selfDestruct = false;
        this.originalColliders = [];
        this.blacklistedEntities = [];
        this.damage = 1;
        /*
        for(let i of allObstacles)
        {
            this.colliders.push(i);
        }*/
        for(let i of allBlocks)
        {
            if(i.type !== blockType.floor)
            {
                this.originalColliders.push(i);
                this.colliders.push(i);
            }
        }
        this.hitBoxUpdate();
    }
    hitBoxUpdate()
    {
        this.hitBoxLeftCB = this.xCB - this.hitBoxRadiusCB;
        this.hitBoxRightCB = this.xCB + this.hitBoxRadiusCB;
        this.hitBoxTopCB = this.yCB - this.hitBoxRadiusCB;
        this.hitBoxBottomCB = this.yCB + this.hitBoxRadiusCB;
    }
    collisionDetection()
    {
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
        for(let entity of this.colliders)
        {
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
            let angleBetween = Math.atan2(this.yCB - entity.yCB, this.xCB - entity.xCB);
            if (entity instanceof Block)// 1 / cos
            {
                
                let collisionLeft = false;
                let collisionRight = false;
                let collisionTop = false;
                let collisionBottom = false;
                let maxPossibleCollision = this.hitBoxRadiusCB + Math.SQRT2 * 5;
                if (distanceBetween <= maxPossibleCollision)
                {
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

                /*
                let BlockDistToEdge;
                if(angleBetween >= 7 * Math.PI / 4 || angleBetween <= Math.PI / 4 || (angleBetween >= 3 * Math.PI / 4 && angleBetween <= 5 * Math.PI / 4))
                {    
                    BlockDistToEdge = 1 / Math.cos(angleBetween);
                }
                else 
                {
                    BlockDistToEdge = 1 / Math.sin(angleBetween);
                }
                if (this.hitBoxRadiusCB + BlockDistToEdge <= distanceBetween)
                {
                    this.collidingEntities.push(entity);
                console.log("touchy feely")
                }*/
            }
            else if(entity instanceof Entity && entity !== this)
            {
                if (distanceBetween <= this.hitBoxRadiusCB + entity.hitBoxRadiusCB)
                {
                    this.collidingEntities.push(entity);
                    entity.health - this.damage;
                    this.health - entity.damage;
                    this.blacklistedEntities.push(entity);
                }
            }
        }
        for(let e = this.blacklistedEntities.length - 1; e >= 0; e--)
        {
            let entity = this.blacklistedEntities[e];
            let distanceBetween = Math.sqrt(Math.pow(this.xCB - entity.xCB, 2) + Math.pow(this.yCB - entity.yCB, 2));
            if (distanceBetween >= this.hitBoxRadiusCB + entity.hitBoxRadiusCB)
            {
                this.blacklistedEntities.splice(e, 1)
            }           
        }
        if(this.collidingEntities.length > 0)
        {
            for(let entity of this.collidingEntities)
            {
                //let angleBetween = Math.atan2(this.yCB - entity.yCB, this.xCB - entity.xCB) % (2 * Math.PI);
                let xDiff = this.xCB - entity.xCB;// from the perspective of this
                let yDiff = this.yCB - entity.yCB;
                let xIsMajor = false;
                if (Math.abs(xDiff) > Math.abs(yDiff))
                {
                    xIsMajor = true;
                }
                if(xIsMajor)
                {
                    //console.log("x")
                    if (xDiff > 0)
                    {
                        this.collidingLeft = true;
                    }
                    else if (xDiff < 0)
                    {
                        this.collidingRight = true;
                    }
                }
                else
                {
                    //console.log("y")
                    if (yDiff > 0)
                    {
                        this.collidingTop = true;
                    }
                    else if (yDiff < 0)
                    {
                        this.collidingBottom = true;
                    }
                }
            }
        }
    }
    convertCB()
    {
        this.x = this.xCB * centiBlock + xBorder;// + blockSize * 2;
        this.y = this.yCB * centiBlock + yBorder;// + blockSize * 2;
        this.hitBoxRadius = this.hitBoxRadiusCB * centiBlock;
    }
    update()
    {
        this.hitBoxUpdate();
        this.convertCB();
        this.collisionDetection();
    }
}

function recalibrate()
{
    resizeCanvas(windowWidth, windowHeight);

    //if wider use height as boundary
    if (width >= height * 17 / 11)
    {
        blockSize = height / 11;
    } //else if taller use width as boundary
    else if (height >= width * 11 / 17)
    {
        blockSize = width / 17;
    }
    // to create a maximum resolution
    if (blockSize > blockSizeMax)
    {
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



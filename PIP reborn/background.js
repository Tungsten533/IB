var collumnsTotal = 17;
var rowsTotal = 11;
var collumnsInner = 13;
var rowsInner = 7;

var blockType = {
    floor: "floor",
    void: "void",
    wall: "wall",
}
Object.freeze(blockType);


var obstacleType = {
    rock: "rock",
    poop: "poop",

}
 Object.freeze(obstacleType)

class Block
{
    constructor(collumn, row)
    {
        this.row = row;
        this.collumn = collumn;
        this.isWalkable = true;
        this.isSolid = false;
        this.xCB = (this.collumn - .5) * 10;
        this.yCB = (this.row - .5) * 10;

        this.type = blockType.floor;
        if (this.row <= 2 || this.row >= 10 || this.collumn <= 2 || this.collumn >= 16)
        {
            this.changeBlockType(blockType.wall)
        }
        this.hitBoxUpdate();
    }
    hitBoxUpdate()
    {
        this.hitBoxLeftCB = this.xCB - 5;
        this.hitBoxRightCB = this.xCB + 5;
        this.hitBoxTopCB = this.yCB - 5;
        this.hitBoxBottomCB = this.yCB + 5;
    }
    changeBlockType(type)
    {   
        if (type === blockType.wall)
        {
            this.isWalkable = false;
            this.isSolid = true;
        }
        this.type = type;
    }
    resize()
    {
        this.xRelative = (this.collumn - 1) * blockSize; 
        this.yRelative = (this.row - 1) * blockSize;
        this.x = xGlobal + this.xRelative;
        this.y = yGlobal + this.yRelative;
        this.left = this.x;
        this.right = this.left + blockSize;
        this.top = this.y;
        this.bottom = this.top + blockSize;
    }
    update()
    {
        if(resize)
            this.resize();

        this.printing();
    }
    printing()
    {
        if (this.type === blockType.wall)
        {
            fill(0);
        }
        else
        {
            fill(100, 100, 0);
        }
        stroke(0)
        strokeWeight(1);
        rect(this.x, this.y, blockSize, blockSize);
        //fill(200);
        //text(this.type, this.x + blockSize / 2, this.y+ blockSize / 2)

    }
}


class Obstacle extends Block
{
    constructor(c, r, type)
    {
        super(c, r);
        this.type = obstacleType.rock;//default is rock
        this.isSolid = true;
        if (type === obstacleType.poop)
        {
            this.type = obstacleType.poop;
        }

    }
    printing()
    {
        fill(40, 60, 200);
        rect(this.x, this.y, blockSize, blockSize);
    }
}
function newObstacle(collumn, row, type)
{
    let c = collumn + 2;
    let r = row + 2;
    let Obs = new Obstacle(c, r, type);
    allObstacles.push(Obs);
    Obs.resize();

}
function makeBlocks()
{
    for(let r = 1; r <= 11; r++)
    {
        for(let c = 1; c <= 17; c++)
        {
            let newBlock = new Block(c, r);
            allBlocks.push(newBlock);
        }
    }
}
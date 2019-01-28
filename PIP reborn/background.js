var collumnsTotal = 17;
var rowsTotal = 11;
var collumnsInner = 13;
var rowsInner = 7;
var showGrid = true;

var blockType = {//isSolid is currently unused
    floor: {
        isWalkable: true,
        isSolid: true,
        name: "floor",
    },
    void: {
        isWalkable: false,
        isSolid: false,
        name: "void",
    },
    wall: {
        isWalkable: false,
        isSolid: true,
        name: "wall",
    },
    door: {
        isWalkable: true,
        isSolid: false,
        name: "door",
    }
}
Object.freeze(blockType);


var obstacleType = {
    rock: {
        isWalkable: false,
        isSolid: true,
        breakableBy: [],
    },
    poop: "poop",

}
Object.freeze(obstacleType);

class Block {
    constructor(collumn, row, type) {
        this.row = row;
        this.collumn = collumn;
        this.changeBlockType(type);
        this.oldType = this.type;
        //if(type instanceof blockType)
        this.xCB = (this.collumn - .5) * 10;
        this.yCB = (this.row - .5) * 10;

        this.hitBoxUpdate();
        this.owner = currentRoom;
        if (this instanceof Obstacle)
            return
        this.owner.allObstacles.push(this);
        this.resize();
        /*
        if (this.row <= 2 || this.row >= 10 || this.collumn <= 2 || this.collumn >= 16)
        {
            this.changeBlockType(blockType.wall);
            allBlocks.push(this);
        }
        else if(showGrid)
        {
            allBlocks.push(this);
        }*/
    }
    hitBoxUpdate() {
        this.hitBoxLeftCB = this.xCB - 5;
        this.hitBoxRightCB = this.xCB + 5;
        this.hitBoxTopCB = this.yCB - 5;
        this.hitBoxBottomCB = this.yCB + 5;
    }
    changeBlockType(type) {
        this.type = type;
        this.isWalkable = this.type.isWalkable;
        this.isSolid = this.type.isSolid;
        if (this.type === blockType.door) {
            this.isOpen = false;
            this.roomChangeVert = - (this.row - 6) / 7;
            if (this.roomChangeVert > 0) {
                this.roomChangeVert = 1;
            }
            if (!Number.isInteger(this.roomChangeVert)) {
                this.roomChangeVert = - (this.row - 3) / 7;
            }
            /*
            else if(this.roomChangeVert < -1) {
                this.roomChangeVert = -2;
            }*/
            this.roomChangeHori = (this.collumn - 9) / 13;
            if (this.roomChangeHori < 0) {
                this.roomChangeHori = -1;
            }
            if (!Number.isInteger(this.roomChangeHori)) {
                this.roomChangeHori = (this.collumn - 3) / 13;
            }
            /*
            else if(this.roomChangeHori > 1) {
                this.roomChangeHori = 2;
            }*/
        }
    }
    resize() {
        this.xRelative = (this.collumn - 1) * blockSize;
        this.yRelative = (this.row - 1) * blockSize;
        this.x = xGlobal + this.xRelative;
        this.y = yGlobal + this.yRelative;
        this.left = this.x;
        this.right = this.left + blockSize;
        this.top = this.y;
        this.bottom = this.top + blockSize;
    }
    walkedInto() {
        //console.log(this.roomChangeHori, this.roomChangeVert)
        this.owner.roomChangeHori = this.roomChangeHori;
        if (this.roomChangeHori > 0) {
            this.owner.rightDoorTriggered = true;
        } else if (this.roomChangeHori < 0) {
            this.owner.leftDoorTriggered = true;
        }
        this.owner.roomChangeVert = this.roomChangeVert;
        if (this.roomChangeVert > 0) {
            this.owner.topDoorTriggered = true;
        } else if (this.roomChangeVert < 0) {
            this.owner.bottomDoorTriggered = true;
        }

    }
    update() {
        if (this.oldType !== this.type)
            this.changeBlockType(this.type);
        if (resize)
            this.resize();
        if (this.type === blockType.door) {
            fill(0);
            //text((this.roomChangeHori + ", " + this.roomChangeVert), this.x + blockSize, this.y)
            if (this.owner.cleared === false && this.isOpen === false) {
                this.isWalkable = false;
            }
            else {
                this.isWalkable = true;
                for (let player of this.owner.allPlayers) {
                    //console.log("i ran")
                    if (Math.pow((Math.pow((this.xCB - player.xCB), 2) + Math.pow((this.yCB - player.yCB), 2)), 1 / 2) <= 3) {
                        this.walkedInto();
                    }
                }
            }

        }
        this.printing();

        text((this.owner.horizontalRoomSpot + ", " + this.owner.verticalRoomSpot), this.x + blockSize, this.y)
        this.oldType = this.type;
    }
    printing() {
        if (this.type === blockType.wall) {
            fill(30, 90, 47);
            stroke(10);
            strokeWeight(1);
            rect(this.x, this.y, blockSize, blockSize);
        }
        else if (this.type === blockType.door) {
            if (!this.isWalkable) {
                fill(0);
                stroke(10);
                strokeWeight(1);
                rect(this.x, this.y, blockSize, blockSize);
            }
        }
        else {
            fill(70, 70, 50);
        }
        //for debugging
        /*
        let distanceFromMouse = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2))
        if(distanceFromMouse <= centiBlock * 10)
        {
            fill(30, 90, 47);
            stroke(0);
            strokeWeight(1);
            rect(this.x, this.y, blockSize, blockSize);
        }*/

        //fill(200);
        //text(this.type, this.x + blockSize / 2, this.y+ blockSize / 2)

    }
}


class Obstacle extends Block {
    constructor(c, r, type) {
        if (type === undefined)
            type = obstacleType.rock;//default is rock
        super(c + 2, r + 2, type);
        this.owner.allObstacles.unshift(this);
        this.resize();
    }
    printing() {
        fill(40, 60, 200);
        rect(this.x, this.y, blockSize, blockSize);
    }
}
function newObstacle(collumn, row, type) {
    let c = collumn + 2;
    let r = row + 2;
    let Obs = new Obstacle(c, r, type);
    Obs.resize();

}
function makeBlocks() {
    for (let r = 1; r <= 11; r++) {
        for (let c = 1; c <= 17; c++) {
            new Block(c, r);
        }
    }
}
function makeWalls(roomSize) {
    for (let row = 1; row <= roomSize.rowsTotal; row++) {
        new Block(1, row, blockType.wall);
        new Block(2, row, blockType.wall);
        new Block(roomSize.collumnsTotal, row, blockType.wall);
        new Block(roomSize.collumnsTotal - 1, row, blockType.wall);
    }
    for (let collumn = 1 + 2; collumn <= roomSize.collumnsTotal - 2; collumn++) {
        new Block(collumn, 1, blockType.wall);
        new Block(collumn, 2, blockType.wall);
        new Block(collumn, roomSize.rowsTotal, blockType.wall);
        new Block(collumn, roomSize.rowsTotal - 1, blockType.wall);
    }
    for (block of currentRoom.allObstacles) {
        for (doorSpot of roomSize.doorLocations) {
            if (block.collumn === doorSpot[0] && block.row === doorSpot[1]) {
                block.type = blockType.door;
            }
        }
    }
}
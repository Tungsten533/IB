//var r = Math.floor(Math.random*300)
let useResetButton = false;
var currentRoom;
var roomLayouts = {
    startingRoom: function () {
        new Player(7, 4, playerCharacter, currentRoom);
    },
    crissCrossTurretTesting: function () {
        new CrissCrossTurret(7, 4);
        new Button(1, 1);
    },
    dummyRoom: function () {
        new PunchingBag(7, 4, 50)
    },
    testRoom: function () {
        for (let c = 1; c <= columnsInner; c += 2) {
            for (let r = 1; r <= rowsInner; r += 2) {
                new Obstacle(c, r);
            }
        }

    },
    testTurrets: function () {
        for (let c = 2; c <= columnsInner; c += 3) {
            for (let r = 2; r <= rowsInner; r += 3) {
                new Turret(c, r);
            }
        }
    },
    testBrainless_Turrets: function () {
        for (let c = 3; c <= columnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
    },
    MVPPuzzleRoom1: function () {
        for (let c = 3; c <= columnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
        for (let r = 2; r <= rowsInner; r += 4) {
            new Button(7, r);
        }
    },
    MVPPuzzleRoom2: function () {

        for (let c = 3; c <= columnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= columnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }

    },
    MVPPuzzleRoom3: function () {

        for (let c = 3; c <= columnsInner; c += 8) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new DiagonalCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= columnsInner; c += 12) {
            for (let r = 3; r <= rowsInner - 1; r += 2) {
                new DiagonalCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= columnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }
        //new Button(7, 4);

    },
    MVPPuzzleRoom4: function () {
        for (let r = 1; r <= rowsInner; r += 2) {
            new Obstacle(2, r);
            new Obstacle(columnsInner - 1, r);
        }
        for (let r = 2; r <= rowsInner; r += 4) {
            new ShootingTurret(2, r, Math.PI);
            new ShootingTurret(columnsInner - 1, r, 0);
        }
        for (let c = 5; c < 10; c += 4) {
            new CrissCrossTurret(c, 2);
            new CrissCrossTurret(c, 6);
        }
        for (let c = 1; c <= columnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }
    },
    MVPPuzzleRoom5: function () {
        new ShootingTurret(3, 1, 0);
        new ShootingTurret(columnsInner - 2, 1, Math.PI * 3 / 2);
        new ShootingTurret(3, rowsInner, Math.PI / 2);
        new ShootingTurret(columnsInner - 2, rowsInner, Math.PI);
        new Obstacle(4, 2);
        new Obstacle(4, rowsInner - 1);
        new Obstacle(columnsInner - 3, 2);
        new Obstacle(columnsInner - 3, rowsInner - 1);
        new ShootingTurret(5, 2, Math.PI * 3 / 2);
        new ShootingTurret(4, rowsInner - 2, 0);
        new ShootingTurret(columnsInner - 3, 3, Math.PI);
        new ShootingTurret(columnsInner - 4, rowsInner - 1, Math.PI / 2);
        for (let i = 0; i < 3; i++) {
            new Obstacle(6 + i, 2);
            new Obstacle(6 + i, rowsInner - 1);
        }
        for (let c = 1; c <= 4; c++) {
            new Obstacle(2 * c + 2, 4);
        }
        for (let c = 1; c <= columnsInner; c += 6 * 2) {
            new Button(c, 4);
        }
    },
}

var roomSize = {
    normal: {
        columnsTotal: 17,
        columnsInner: 13,
        rowsTotal: 11,
        rowsInner: 7,
        doorLocations: [
            [9, 2],
            [9, 10],
            [2, 6],
            [16, 6]
        ],
    },
    XL_2_By_2: {
        columnsTotal: 30,
        columnsInner: 26,
        rowsTotal: 18,
        rowsInner: 14,
    },
}
//rooms will have to be objects once different rooms
//    start being a thing as of now having just one
//    room for mpv will have to do
class Room {
    constructor(roomSize, layout, owner, horizontalRoomSpot, verticalRoomSpot) {
        this.horizontalRoomSpot = horizontalRoomSpot;
        this.verticalRoomSpot = verticalRoomSpot;
        this.roomChangeVert = 0;
        this.roomChangeHori = 0;
        //this.owner = floor;
        this.layout = layout;
        this.roomSize = roomSize.normal;
        this.cleared = false;
        this.enemiesNotPartOfCap = 0;
        if (roomSize !== undefined) {
            this.roomSize = roomSize;
        }
        if (roomSize === undefined) {
            throw new Error("roomsize is not defined")
        }
        if (layout === undefined) {
            console.log(layout)
            throw new Error("room layout is not defined")
        }
        //this.owner.rooms.push(this);
        this.allObstacles = [];
        this.allEnemies = [];
        this.allPlayers = [];
        this.allTears = [];
        this.owner = owner;
        this.owner.rooms.push(this);
        //currentRoom = this;
        //new Player(7, 4, playerCharacter);
        this.initialized = false;
        if (useResetButton) {
            this.resetRoom = false;
            this.resetRoomButtonExists = false;
        }
    }
    initializeNewRoom() {
        this.owner.currentRoom.isCurrentRoom();
        this.owner.currentRoom.allPlayers = this.allPlayers.slice();
        for (let player of this.owner.currentRoom.allPlayers) {
            player.owner = this.owner.currentRoom;
            player.originalColliders = [];
            player.colliders = [];
            for (let i of player.owner.allObstacles) {
                if (i.type !== blockType.floor) {
                    player.originalColliders.push(i);
                    player.colliders.push(i);
                }
            }
        }
    }
    currentRoomHandOff() {
        let myRoomGrid = this.owner.roomGrid;
        if (this.topDoorTriggered) {
            console.log("going up");
            if (this.verticalRoomSpot < this.owner.roomGridBiggestY) {
                //console.log(this.horizontalRoomSpot - this.owner.roomGridSmallestX, this.owner.roomGridBiggestY - this.verticalRoomSpot - 1);
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)][this.owner.roomGridBiggestY - this.verticalRoomSpot - 1];
            }
            else if (this.verticalRoomSpot === this.owner.roomGridBiggestY) {
                this.owner.roomGridExpandUp();
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)][0];
            }
            this.initializeNewRoom();
            for (let somePlayer of this.owner.currentRoom.allPlayers) {
                somePlayer.xCB = 85;
                somePlayer.yCB = 85;
            }
        }
        else if (this.bottomDoorTriggered) {
            console.log("going down");
            if (this.verticalRoomSpot > this.owner.roomGridSmallestY) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)][this.owner.roomGridBiggestY - this.verticalRoomSpot + 1];
            }
            else if (this.verticalRoomSpot === this.owner.roomGridSmallestY) {
                this.owner.roomGridExpandDown();
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)][myRoomGrid[0].length - 1];
            }
            this.initializeNewRoom();
            for (let somePlayer of this.owner.currentRoom.allPlayers) {
                somePlayer.xCB = 85;
                somePlayer.yCB = 25;
            }

        }
        else if (this.leftDoorTriggered) {
            console.log("going left");
            if (this.horizontalRoomSpot > this.owner.roomGridSmallestX) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX - 1)][this.owner.roomGridBiggestY - this.verticalRoomSpot];
            }
            else if (this.horizontalRoomSpot === this.owner.roomGridSmallestX) {
                this.owner.roomGridExpandLeft();
                this.owner.currentRoom = myRoomGrid[(0)][this.owner.roomGridBiggestY - this.verticalRoomSpot];
            }
            this.initializeNewRoom();
            for (let somePlayer of this.owner.currentRoom.allPlayers) {
                somePlayer.xCB = 145;
                somePlayer.yCB = 55;
            }
        }
        else if (this.rightDoorTriggered) {
            console.log("going right");
            if (this.horizontalRoomSpot < this.owner.roomGridBiggestX) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX + 1)][this.owner.roomGridBiggestY - this.verticalRoomSpot];
            }
            else if (this.horizontalRoomSpot === this.owner.roomGridBiggestX) {
                this.owner.roomGridExpandRight();
                this.owner.currentRoom = myRoomGrid[(myRoomGrid.length - 1)][this.owner.roomGridBiggestY - this.verticalRoomSpot];
            }
            this.initializeNewRoom();
            for (let somePlayer of this.owner.currentRoom.allPlayers) {
                somePlayer.xCB = 25;
                somePlayer.yCB = 55;
            }
        }
    }
    isCurrentRoom() {
        if (this.cleared === false) {
            this.initialized = false;
        }
        this.enemiesNotPartOfCap = 0;
        currentRoom = this;
        this.allEnemies = [];
        //this.allObstacles = [];
        this.allTears = [];
        if (this.initialized === false) {
            makeWalls(this.roomSize);
            this.layout();
            this.initialized = true;

            this.initialized = true;
        }
        if (useResetButton) {
            let room = Math.floor(Math.random() * MVPRooms.length);
            MVPRooms[room]();
            this.resetRoom = false;
            this.resetRoomButtonExists = false;
        }
        //this.cleared = false;
        console.log("SKICK")
    }
    update() {
        this.roomChangeHori = 0;
        this.roomChangeVert = 0;
        this.topDoorTriggered = false;
        this.bottomDoorTriggered = false;
        this.leftDoorTriggered = false;
        this.rightDoorTriggered = false;
        for (let i = this.allObstacles.length - 1; i >= 0; i--) {
            let obstacle = this.allObstacles[i];
            if (obstacle.selfDestruct) {
                console.log("an obstacle died... \n F")
                this.allObstacles.splice(i, 1);
            }
            else {
                obstacle.update();
            }
        }
        for (let i = this.allEnemies.length - 1; i >= 0; i--) {
            let enemy = this.allEnemies[i];
            if (enemy.selfDestruct) {
                this.allEnemies.splice(i, 1);
            }
            else {
                enemy.update();
            }
        }
        for (let i = this.allPlayers.length - 1; i >= 0; i--) {
            let player = this.allPlayers[i];
            if (player.selfDestruct) {
                this.allPlayers.splice(i, 1);
                throw new alert("a player has died by self destruction... loong live the player")
            }
            else {
                player.update();
            }
        }
        for (let i = this.allTears.length - 1; i >= 0; i--) {
            let tear = this.allTears[i];
            if (tear.selfDestruct) {
                this.allTears.splice(i, 1);
            }
            else {
                tear.update();
            }
        }
        if (this.allEnemies.length <= this.enemiesNotPartOfCap) {
            this.cleared = true;
            if (!this.resetRoomButtonExists && useResetButton) {
                new RoomResetButton(7, 4);
                this.resetRoomButtonExists = true;
            }
        }
        else {
            this.cleared = false;
        }
        /*
        if(keyIsDown(37))
        {
            this.leftDoorTriggered = true;
        }
        else if(keyIsDown(39))
        {
            this.rightDoorTriggered = true;
        }
        else if(keyIsDown(38))
        {
            this.topDoorTriggered = true;
        }
        else if(keyIsDown(40))
        {
            this.bottomDoorTriggered = true;
        }
        */
        this.currentRoomHandOff();
        if (this.resetRoom && useResetButton) {
            console.log("resetmedaddy")
            this.isCurrentRoom();
        }
    }
}

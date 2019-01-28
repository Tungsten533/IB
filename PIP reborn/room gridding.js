let allFloors = [];
let currentRoom;
class Floor {
    constructor() {
        this.roomGrid = [];// x then y, room grid is an array column arrays
        this.roomGridSmallestX = 0;
        this.roomGridBiggestX = 0;
        this.roomGridSmallestY = 0;
        this.roomGridBiggestY = 0;




        this.rooms = [];
        this.currentRoom;
        allFloors.push(this);
        new Room(roomSize.normal, roomLayouts.MVPPuzzleRoom1, this, 0, 0);
        this.currentRoom = this.rooms[0];
        this.currentRoom.isCurrentRoom();
    }
    roomGridExpandUp() {
        for (index in roomGrid) {
            let column = roomGrid[index];
            let columnNumber = index + roomGridSmallestX;
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random()) * this.roomLayoutPool.length], this, columnNumber, roomGridBiggestY + 1);
            column.unshift(newRoom);
        }
        roomGridBiggestY++;
    }
    roomGridExpandDown() {
        for (index in roomGrid) {
            let column = roomGrid[index];
            let columnNumber = index + roomGridSmallestX;
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random()) * this.roomLayoutPool.length], this, columnNumber, roomGridSmallestX - 1);
            column.push(newRoom);
        }
        roomGridSmallestY--;
    }
    roomGridExpandLeft() {
        let newColumn = [];
        let columnNumber = roomGridSmallestX - 1;
        for (let i = roomGridBiggestY; i >= roomGridSmallestY; i--) {
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random()) * this.roomLayoutPool.length], this, columnNumber, i);
            newColumn.push(newRoom);
        }
        roomGrid.unshift(newColumn);
        roomGridSmallestX--;
    }
    roomGridExpandRight() {
        let newColumn = [];
        let columnNumber = roomGridBiggestX + 1;
        for (let i = roomGridBiggestY; i >= roomGridSmallestY; i--) {
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random()) * this.roomLayoutPool.length], this, columnNumber, i);
            newColumn.push(newRoom);
        }
        roomGrid.push(newColumn);
        roomGridBiggestX++;

    }
    update() {
        currentRoom = this.currentRoom;
        this.currentRoom.update();
    }

}

var roomSize = {
    normal: {
        collumnsTotal: 17,
        collumnsInner: 13,
        rowsTotal: 11,
        rowsInner: 7,
    },
    XL_2_By_2: {
        collumnsTotal: 30,
        collumnsInner: 26,
        rowsTotal: 18,
        rowsInner: 14,
    },
}

var roomLayouts = {
    startingRoom: function (owner) {
        new Player(7, 4, playerCharacter, owner);
    },
    crissCrossTurretTesting: function () {
        new CrissCrossTurret(7, 4);
        new Button(1, 1);
    },
    dummyRoom: function () {
        new PunchingBag(7, 4, 50)
    },
    testRoom: function () {
        for (let c = 1; c <= collumnsInner; c += 2) {
            for (let r = 1; r <= rowsInner; r += 2) {
                new Obstacle(c, r);
            }
        }

    },
    testTurrets: function () {
        for (let c = 2; c <= collumnsInner; c += 3) {
            for (let r = 2; r <= rowsInner; r += 3) {
                new Turret(c, r);
            }
        }
    },
    testBrainless_Turrets: function () {
        for (let c = 3; c <= collumnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
    },
    MVPPuzzleRoom1: function () {
        for (let c = 3; c <= collumnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
        for (let r = 2; r <= rowsInner; r += 4) {
            new Button(7, r);
        }
    },
    MVPPuzzleRoom2: function () {

        for (let c = 3; c <= collumnsInner; c += 8) {
            for (let r = 2; r <= rowsInner; r += 4) {
                new CrissCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= collumnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }

    },
    MVPPuzzleRoom3: function () {

        for (let c = 3; c <= collumnsInner; c += 8) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new DiagonalCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= collumnsInner; c += 12) {
            for (let r = 3; r <= rowsInner - 1; r += 2) {
                new DiagonalCrossTurret(c, r);
            }
        }
        for (let c = 1; c <= collumnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }
        //new Button(7, 4);

    },
    MVPPuzzleRoom4: function () {
        for (let r = 1; r <= rowsInner; r += 2) {
            new Obstacle(2, r);
            new Obstacle(collumnsInner - 1, r);
        }
        for (let r = 2; r <= rowsInner; r += 4) {
            new ShootingTurret(2, r, Math.PI);
            new ShootingTurret(collumnsInner - 1, r, 0);
        }
        for (let c = 5; c < 10; c += 4) {
            new CrissCrossTurret(c, 2);
            new CrissCrossTurret(c, 6);
        }
        for (let c = 1; c <= collumnsInner; c += 12) {
            for (let r = 1; r <= rowsInner; r += 6) {
                new Button(c, r);
            }
        }
    },
    MVPPuzzleRoom5: function () {
        new ShootingTurret(3, 1, 0);
        new ShootingTurret(collumnsInner - 2, 1, Math.PI * 3 / 2);
        new ShootingTurret(3, rowsInner, Math.PI / 2);
        new ShootingTurret(collumnsInner - 2, rowsInner, Math.PI);
        new Obstacle(4, 2);
        new Obstacle(4, rowsInner - 1);
        new Obstacle(collumnsInner - 3, 2);
        new Obstacle(collumnsInner - 3, rowsInner - 1);
        new ShootingTurret(5, 2, Math.PI * 3 / 2);
        new ShootingTurret(4, rowsInner - 2, 0);
        new ShootingTurret(collumnsInner - 3, 3, Math.PI);
        new ShootingTurret(collumnsInner - 4, rowsInner - 1, Math.PI / 2);
        for (let i = 0; i < 3; i++) {
            new Obstacle(6 + i, 2);
            new Obstacle(6 + i, rowsInner - 1);
        }
        for (let c = 1; c <= 4; c++) {
            new Obstacle(2 * c + 2, 4);
        }
        for (let c = 1; c <= collumnsInner; c += 6 * 2) {
            new Button(c, 4);
        }
    },
}

class Room {
    constructor(roomSize, layout, owner, horizontalRoomSpot, verticalRoomSpot) {
        this.horizontalRoomSpot = horizontalRoomSpot;
        this.verticalRoomSpot = verticalRoomSpot;
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
        this.resetRoom = false;
        this.resetRoomButtonExists = false;
        this.topDoorTriggered = false;
        this.bottomDoorTriggered = false;
        this.leftDoorTriggered = false;
        this.rightDoorTriggered = false;
    }
    isCurrentRoom() {
        this.enemiesNotPartOfCap = 0;
        currentRoom = this;
        this.allEnemies = [];
        this.allObstacles = [];
        this.allTears = [];
        makeWalls(this.roomSize);
        if (this.initialized === false) {
            /*
            makeWalls(this.roomSize);
            this.layout();
            this.initialized = true;
            */
            this.initialized = true;
        }
        let room = Math.floor(Math.random() * MVPRooms.length);
        MVPRooms[room]();
        this.resetRoom = false;
        this.resetRoomButtonExists = false;
        this.cleared = false;
        console.log("SKICK")
    }
    currentRoomHandOff() {
        let myRoomGrid = this.owner.roomGrid;
        if (this.topDoorTriggered) {
            if (this.verticalRoomSpot < this.owner.RoomGridBiggestY) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.RoomGridSmallestX)[this.owner.RoomGridBiggestY - this.verticalRoomSpot - 1]];
            }
            else if (this.verticalRoomSpot === this.owner.RoomGridBiggestY) {
                this.owner.roomGridExpandUp();
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)[0]];
            }
        }
        else if (this.bottomDoorTriggered) {
            if (this.verticalRoomSpot > this.owner.roomGridSmallestY) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)[this.owner.roomGridBiggestY - this.verticalRoomSpot + 1]];
            }
            else if (this.verticalRoomSpot === this.owner.roomGridSmallestY) {
                this.owner.roomGridExpandDown();
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.roomGridSmallestX)[myRoomGrid[0].length - 1]];
            }

        }
        else if (this.leftDoorTriggered) {
            if (this.horizontalRoomSpot > this.owner.roomGridSmallestX) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.RoomGridSmallestX - 1)[this.owner.RoomGridBiggestY - this.verticalRoomSpot]];
            }
            else if (this.horizontalRoomSpot === this.owner.RoomGridSmallestX) {
                this.owner.roomGridExpandLeft();
                this.owner.currentRoom = myRoomGrid[(0)[this.owner.RoomGridBiggestY - this.verticalRoomSpot]];
            }
        }
        else if (this.rightDoorTriggered) {
            if (this.horizontalRoomSpot < this.owner.RoomGridBiggestX) {
                this.owner.currentRoom = myRoomGrid[(this.horizontalRoomSpot - this.owner.RoomGridSmallestX + 1)[this.owner.RoomGridBiggestY - this.verticalRoomSpot]];
            }
            else if (this.horizontalRoomSpot === this.owner.RoomGridBiggestX) {
                this.owner.roomGridExpandRight();
                this.owner.currentRoom = myRoomGrid[(myRoomGrid.length - 1)[this.owner.RoomGridBiggestY - this.verticalRoomSpot]];
            }

        }
    }
    update() {
        this.topDoorTriggered = false;
        this.bottomDoorTriggered = false;
        this.leftDoorTriggered = false;
        this.rightDoorTriggered = false;
        for (let i = this.allObstacles.length - 1; i >= 0; i--) {
            let obstacle = this.allObstacles[i];
            if (obstacle.selfDestruct) {
                console.log("you die now")
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
            if (!this.resetRoomButtonExists) {
                new RoomResetButton(7, 4);
                this.resetRoomButtonExists = true;
            }
        }
        else {
            this.cleared = false;
        }
        if (keyIsDown(37)) {
            this.leftDoorTriggered = true;
        }
        else if (keyIsDown(39)) {
            this.rightDoorTriggered = true;
        }
        else if (keyIsDown(38)) {
            this.topDoorTriggered = true;
        }
        else if (keyIsDown(40)) {
            this.bottomDoorTriggered = true;
        }
        this.currentRoomHandOff();

        if (this.resetRoom) {
            console.log("resetmedaddy")
            this.isCurrentRoom();
        }
    }
}
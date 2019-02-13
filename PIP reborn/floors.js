let allFloors = [];
let currentFloor;
class Floor {
    constructor(ownerGame) {
      this.ownerGame = ownerGame;
      this.ownerGame.floors.push(this);
        this.roomGrid = [[]];// x then y, roomGrid is an array column arrays
        this.roomGridSmallestX = 0;
        this.roomGridBiggestX = 0;
        this.roomGridSmallestY = 0;
        this.roomGridBiggestY = 0;
        this.rooms = [];
        this.currentRoom;
        allFloors.push(this);
        var newRoom = new Room(roomSize.normal, roomLayouts.startingRoom, this, 0, 0);
        this.roomGrid[0].push(newRoom);
        this.currentRoom = this.rooms[0];
        this.roomLayoutPool = [
            roomLayouts.MVPPuzzleRoom1,
            roomLayouts.MVPPuzzleRoom2,
            roomLayouts.MVPPuzzleRoom3,
            roomLayouts.MVPPuzzleRoom4,
            roomLayouts.MVPPuzzleRoom5,
            roomLayouts.dummyRoom,
            //roomLayouts.crissCrossTurretTesting
        ];
        this.currentRoom.isCurrentRoom();
    }
    roomGridExpandUp() {
        for (let index in this.roomGrid) {
            let column = this.roomGrid[index];
            let columnNumber = parseInt(index) + this.roomGridSmallestX;
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random() * this.roomLayoutPool.length)], this, columnNumber, this.roomGridBiggestY + 1);
            column.unshift(newRoom);
        }
        this.roomGridBiggestY++;
    }
    roomGridExpandDown() {
        for (let index in this.roomGrid) {
            let column = this.roomGrid[index];
            let columnNumber = parseInt(index) + this.roomGridSmallestX;
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random() * this.roomLayoutPool.length)], this, columnNumber, this.roomGridSmallestY - 1);
            column.push(newRoom);
        }
        this.roomGridSmallestY--;
    }
    roomGridExpandLeft() {
        let newColumn = [];
        let columnNumber = this.roomGridSmallestX - 1;
        for (let i = this.roomGridBiggestY; i >= this.roomGridSmallestY; i--) {
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random() * this.roomLayoutPool.length)], this, columnNumber, i);
            newColumn.push(newRoom);
        }
        this.roomGrid.unshift(newColumn);
        this.roomGridSmallestX--;
    }
    roomGridExpandRight() {
        let newColumn = [];
        let columnNumber = this.roomGridBiggestX + 1;
        for (let i = this.roomGridBiggestY; i >= this.roomGridSmallestY; i--) {
            let newRoom = new Room(roomSize.normal, this.roomLayoutPool[Math.floor(Math.random() * this.roomLayoutPool.length)], this, columnNumber, i);
            newColumn.push(newRoom);
        }
        this.roomGrid.push(newColumn);
        this.roomGridBiggestX++;

    }
    update() {
        currentRoom = this.currentRoom;
        this.currentRoom.update();
    }
}
/*
class Game
{
    constructor()
    {
        this.
    }
}*/

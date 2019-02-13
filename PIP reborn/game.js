class Game {
  constructor() {
    this.floors = [];
    new Floor(this);
    this.currentFloor = this.floors[0];

  }
  progressPlayerFloor() {
    new Floor(this);
    this.currentFloor = this.allFloors[this.allFloors.length - 1];
  }
  update() {
    let floorVerified = false;
    for(someFloor of this.floors) {
      if(someFloor === this.currentFloor) {
        floorVerified = true;
      }
    }
    currentFloor = this.currentFloor;
    this.currentFloor.update();
  }
}

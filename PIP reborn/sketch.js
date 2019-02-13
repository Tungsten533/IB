let fps = 0
let fpsEngine = {
    oldTime: 0, // Time at which the previous frame is updated
    fpsCooldown: 0, // When fpsCooldown <= 0, set displayFPS = fps
    displayFPS: 0, // fps displayed on screen, updated every second
    fps: 0,
    // Functions related to FPS
    // Usage: insert them at the end of the draw() function
    updateFPS: function () {
        let currentTime = millis()
        let fpsDelta = currentTime - this.oldTime

        // Update fps
        this.fps = frameRate() // function provided by p5.js API

        // Update displayFPS
        this.fpsCooldown -= fpsDelta
        if (this.fpsCooldown <= 0) {
            this.displayFPS = this.fps
            this.fpsCooldown = 1000
        }

        this.oldTime = currentTime
        fps = this.fps;
    },
    showFPS: function (r, g, b) {
        fill(r, g, b)
        textAlign(RIGHT, TOP) // Text alignment of the fps label
        textSize(24)
        text(`${Math.floor(this.displayFPS)} fps`, width - 16, 16) // Position of the fps label
    }
}

let setupRan = false;
function setup() {
    // setup() runs once. Put your setup code here.
    createCanvas(windowWidth, windowHeight);
    recalibrate();
    //makeBlocks();
    new Game();
    setupRan = true;
}

function draw() {
    if (millis() < 1000 || !setupRan) {
        return
    }
    if (currentRoom.cleared) {
        background(0, 200, 0);
    } else {
        background(200, 0, 0);
    }

    //background(200);
    // draw() runs every time before a new frame is rendered.
    //rect(xGlobal, yGlobal, xUsable, yUsable);
    /*for(let block of allBlocks)
    {
        block.update();
    }
    for(let ob of allObstacles)
    {
        ob.update();
    }*/
    if (!showGrid) {
        rectMode(CORNER)
        fill(70, 70, 50);
        rect(xBorder, yBorder, blockSize * 17, blockSize * 11)
    }
    //MVP();
    /*
    for(let i = allBlocks.length - 1; i >= 0; i--)
    {
        let block = allBlocks[i];
        if(block.selfDestruct)
        {
            allBlocks.splice(i, 1);
        }
        else
        {
            block.update();
        }
    }
    for(let ob = allObstacles.length - 1; ob >= 0; ob--)
    {
        let o = allObstacles[ob];
        if(o.selfDestruct)
        {
            allObstacles.splice(ob, 1);
        }
        else
        {
            o.update();
        }
    }
    for(let e = allEntities.length - 1; e >= 0; e--)
    {
        if(allEntities[e].selfDestruct)
        {
            allEntities.splice(e, 1);
        }
        else
        {
            allEntities[e].update();
        }
    }
    if(allEnemies.length === 0)
    {
        roomCleared = true;
    }*/
    currentFloor = allFloors[0];
    if(fps > 0) {
      currentFloor.update()
    }
    resize = false;
    fpsEngine.updateFPS();
    fpsEngine.showFPS(50, 50, 50);
}

function windowResized() {
    recalibrate();
}
/*
MVPRooms = [
    roomLayouts.MVPPuzzleRoom1,
    roomLayouts.MVPPuzzleRoom2,
    roomLayouts.MVPPuzzleRoom3,
    roomLayouts.MVPPuzzleRoom4,
    roomLayouts.MVPPuzzleRoom5,
    roomLayouts.dummyRoom,
    //roomLayouts.crissCrossTurretTesting
]
function MVP() {
    if (millis() < 1000)
        return
    if (roomCleared) {
        allObstacles = [];
        for (let e of allEntities) {
            if (e instanceof Player) {
                continue
            }
            e.selfDestruct = true;
        }
        allEnemies = [];
        enemiesNotPartOfCap = 0;
        background(0, 50, 0);
        let room = Math.floor(Math.random() * MVPRooms.length);
        MVPRooms[room]();
        allPlayers[0].invincible = true;
    }
    else {
        background(100);
    }
}*/

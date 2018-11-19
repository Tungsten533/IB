// P5 Template with fps Display
// Variables used for fps
var frameTimes = [] // Time recordings corresponding to each frame
let oldTime = 0 // Time at which the previous frame is updated
let fpsCooldown = 0 // When fpsCooldown <= 0, set displayFPS = fps
let displayFPS = 0 // fps displayed on screen, updated every second
let fps;

function fpsCounter() 
{

    var currentTime = millis()
    frameTimes.push(currentTime)
    while (frameTimes.length > 0 && frameTimes[0] < currentTime - 1000) {
        frameTimes.splice(0, 1)
    }
    
    fps = frameTimes.length;
    fpsCooldown -= currentTime - oldTime
    if (fpsCooldown <= 0) {
        displayFPS = fps
        fpsCooldown = 1000
    }

    fill(0, 0, 0)
    textAlign(RIGHT, TOP) // Text alignment of the fps label
    textSize(24)
    text(`${Math.floor(displayFPS)} fps`, width - 16, 16) // Position of the fps label

    oldTime = currentTime
}

function setup()
{
    // setup() runs once. Put your setup code here.
    createCanvas(windowWidth, windowHeight);
    recalibrate();
    makeBlocks();
    newPlayer(7, 4);
}

function draw()
{
    // draw() runs every time before a new frame is rendered. 
    fill(100, 0, 0);
    background(100);
    //rect(xGlobal, yGlobal, xUsable, yUsable);
    for(let block of allBlocks)
    {
        block.update();
    }
    for(let ob of allObstacles)
    {
        ob.update();
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

    fpsCounter();
    resize = false;
}

function windowResized() {
    recalibrate();
}
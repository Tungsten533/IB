//let allEnemies = [];
//let enemiesNotPartOfCap = 0;
class Enemy extends Entity {
    constructor(c, r, hitBoxRadiusCB, health) {
        super(c, r, hitBoxRadiusCB, health);
        this.hurtPlayer = true;//default hurts Players
        this.contactDamage = 1;
        this.tearDamage = 1;
        this.owner.allEnemies.push(this);
    }
    /*
    hitBoxUpdate()
    {
        super.hitBoxUpdate();
    }
    collisionDetection()
    {
        super.collisionDetection();
    }
    convertCB()
    {
        super.convertCB();
    }*/
    selfDestruct()//BROKEN
    {
        for (let e in this.owner.allEnemies) {
            if (this.owner.allEnemies[e] === this)
                this.owner.allEnemies.splice(e, 1);
        }

    }
    baseUpdate() {
        super.baseUpdate();
        this.colliders = this.originalColliders.concat(this.owner.allPlayers);
        //if(this.selfDestruct)
        //    this.selfDestruct()
    }
}

class MovingEnemy extends Enemy {
  constructor(c, r, hitBoxRadiusCB, health, orientation/*init*/) {
    super(c, r, hitBoxRadiusCB, health);
    this.hurtPlayer = true;
    this.contactDamage = 1;
    this.owner.allEnemies.push(this);
  }

  /** TODO:
   * translate to proper js lol
   * add entity collision interactions
   * add map collision interactions
   * add simple pathing algorithm
   * define movement speeds, since they're based on direction and not angle
   */

/* Pseudo-code

this.orientation = {

  var xDiff = (Entity.Player.xCB - Entity.MovingEnemy.xCB);
  var yDiff = (Entity.Player.yCB - Entity.MovingEnemy.yCB);

  var angle = 0; //init
  if (yDiff/xDiff > 0) {
    var angle = Math.atan2(yDiff, xDiff);
  } else if (yDiff/xDiff < 0) {

  }
};

// horizontal movement
if (Entity.Player.xCB > MovingEnemy.xCB) {
  MovingEnemy.xCB++;
  MovingEnemy.shoot(orientation);
} else {
  MovingEnemy.xCB--;
  MovingEnemy.shoot(orientation);
}

// horizontal movement
if (Entity.Player.yCB > MovingEnemy.yCB) {
  MovingEnemy.yCB++;
  MovingEnemy.shoot(orientation);
} else {
  MovingEnemy.yCB--;
  MovingEnemy.shoot(orientation);
}

*/


}

class Turret extends Enemy {
    constructor(c, r) {
        let hitBoxRadiusCB = 5.5;//in CB
        super(c, r, hitBoxRadiusCB, Infinity);
        this.health = Infinity;
        this.colliders = [];
        this.colliders = this.owner.allPlayers.slice();
        for (let b of this.owner.allObstacles) {
            if (b.type === blockType.wall)
                this.colliders.push(b)
        }
        this.movementSpeed = 10;//in CB per sec
        this.xFacing = Math.random() * 2 - 1;
        if (this.xFacing < 0)
            this.xFacing = -1;
        else
            this.xFacing = 1;
        this.yFacing = Math.random() * 2 - 1;
        if (this.yFacing < 0)
            this.yFacing = -1;
        else
            this.yFacing = 1;
        this.owner.enemiesNotPartOfCap++;
    }
    baseUpdate() {
        super.baseUpdate();
        if (this.owner.cleared) {
            this.selfDestruct = true;
            this.owner.enemiesNotPartOfCap--;
        }
    }
    update() {
        super.baseUpdate();
        if (this.collidingLeft && this.xFacing < 0) {
            this.xFacing *= -1;
        }
        else if (this.collidingRight && this.xFacing > 0) {
            this.xFacing *= -1;
        }
        if (this.collidingTop && this.yFacing < 0) {
            this.yFacing *= -1;
        }
        else if (this.collidingBottom && this.yFacing > 0) {
            this.yFacing *= -1;
        }
        this.xCB += this.movementSpeed * this.xFacing / fps;
        this.yCB += this.movementSpeed * this.yFacing / fps;
        fill(240);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}

class ShootingTurret extends Entity {
    constructor(c, r, direction) {
        let hitBoxRadiusCB = 5.5
        super(c, r, hitBoxRadiusCB, Infinity);
        this.isMovable = false;
        this.tearSizeCB = 1.5;
        this.shotSpeed = 30;
        this.referenceXSpeed = 0;
        this.referenceYSpeed = 0;
        this.range = 1500;
        this.tearHealth = 1;
        this.tearMode = 0;
        this.shotDelay = 1000;
        this.shootReady = false;
        this.shotCooldown = 0;
        this.oldTime = millis();
        this.direction = direction;
        this.tearModes = [
            tearMode.Single_Shot
        ];
        this.owner.allObstacles.push(this);
        this.invincible = true;
        this.activated = true;
        //this.owner.allObstacles.push(this);
    }
    baseUpdate() {
        super.baseUpdate();
        this.colliders = this.originalColliders.concat(this.owner.allPlayers);
        if (this.selfDestruct)
            this.selfDestruct()
    }
    shooting() {
        if (this.owner.cleared)
            this.activated = false;
        if (!this.activated)
            return
        if (this.shotCooldown <= 0) {
            this.shootReady = true;
        }
        else {
            this.shootReady = false;
        }
        if (this.shootReady) {
            this.tearModes[this.tearMode](this.xCB, this.yCB, this.tearSizeCB, this.direction, this.shotSpeed, this.referenceXSpeed, this.referenceYSpeed, this, this.range, 1, this.tearHealth);

            this.shotCooldown = this.shotDelay;
            if (this.tearMode === this.tearModes.length - 1) {
                this.tearMode = 0;
            }
            else {
                this.tearMode++;
            }
        }
        this.shotCooldown -= millis() - this.oldTime;
        this.oldTime = millis()
    }
    update() {
        this.baseUpdate();
        this.shooting();
        fill(0);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }

}

class PlusCrossTurret extends ShootingTurret {
    constructor(c, r) {
        super(c, r);
        this.direction = 0;
        this.tearModes = [
            tearMode.Four_Shot_Plus_Sign,
        ]
    }
    update() {
        super.baseUpdate();
        this.shooting();
        fill(0, 150, 100);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}

class DiagonalCrossTurret extends ShootingTurret {
    constructor(c, r) {
        super(c, r);
        this.direction = 0;
        this.tearModes = [
            tearMode.Four_Shot_X,
        ]
    }
    update() {
        super.baseUpdate();
        this.shooting();
        fill(150, 0, 200);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}

class CrissCrossTurret extends ShootingTurret {
    constructor(c, r) {
        super(c, r);
        this.direction = 0;
        this.tearModes = [
            tearMode.Four_Shot_Plus_Sign,
            tearMode.Four_Shot_X,
        ];
    }

    update() {
        super.baseUpdate();
        this.shooting();
        fill(150);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}

class PunchingBag extends Enemy {
    constructor(c, r, health) {
        if (health === undefined)
            health = 20;
        let hitBoxRadiusCB = 5;
        super(c, r, hitBoxRadiusCB, health);
        this.isMovable = false;
    }
    update() {
        if (this.health <= 0) {
            this.cantTouchThis = true;
            fill(120);
        }
        else {
            this.cantTouchThis = false;
            fill(0, 0, 150);
        }
        super.baseUpdate();
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }
}


class Fly extends Enemy {
    constructor(c, r, hitBoxRadiusCB, health) {
        super(c, r, hitBoxRadiusCB, health);

    }
}


class Button extends Entity {
    constructor(c, r) {
        super(c, r, 2);
        this.isMovable = false;
        this.triggered = false;
        this.playerCanPassThrough = true;
        this.owner.enemiesNotPartOfCap--;
        this.owner.allObstacles.unshift(this);
        this.ignoring = true;
    }
    update() {
        this.colliders = this.originalColliders.concat(this.owner.allPlayers);
        super.baseUpdate();
        if (this.collidingEntities.length === 0) {
            this.ignoring = false;
        }
        if (this.collidingEntities.length > 0 && !this.ignoring) {
            if (!this.triggered && !this.forRoomRestart)
                this.owner.enemiesNotPartOfCap++;

            this.triggered = true;
        }
        if (!this.triggered) {
            this.owner.cleared = false;
            fill(200, 0, 0);
        }
        else {
            fill(0, 200, 0);
        }
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 4, this.hitBoxRadius * 4);

    }
}

class RoomResetButton extends Button {
    constructor(c, r) {
        super(c, r);
        this.owner.enemiesNotPartOfCap++;// for undoing what the base button does
    }
    update() {
        this.colliders = this.owner.allPlayers.slice();//only players can trigger this
        super.baseUpdate();
        if (this.triggered) {
            console.log("triggered boi")
            this.owner.resetRoom = true;
        }
        if (this.collidingEntities.length > 0) {
            this.triggered = true;
        }
        fill(0);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x, this.y, this.hitBoxRadius * 4, this.hitBoxRadius * 4);
    }
}

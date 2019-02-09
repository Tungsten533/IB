//let allTears = [];
class Tear extends Entity {
    /**
     * Tear is the basic projectile for the game
     *
     * @method Tear
     * @param  {Number} xCB
     * @param  {Number} yCB
     * @param  {Number} size
     * @param  {Number} shotAngle
     * @param  {Number} shotSpeed
     * @param  {Number} referenceXSpeed
     * @param  {Number} referenceYSpeed
     * @param  {Entity} shooter
     * @param  {Number} range
     * @param  {Number} damage
     * @param  {Number} health
     * @chainable
     */
    constructor(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health) {
      if(size === null || size === undefined) {
        throw new Error("tear size is undefined in creation");
      }

      if(health === null || health === undefined) {
        throw new Error("health is undefined for tear in creation");
      }

      if(shooter === null || shooter === undefined) {
        throw new Error("shooter is undefined for tear in creation");
      }
        super(null, null, size, health, shooter.owner);

      if(xCB === null || xCB === undefined) {
        throw new Error("x value is undefined for tear in creation");
      }
      if(yCB === null || yCB === undefined) {
        throw new Error("y value is undefined for tear in creation");
      }
      this.xCB = xCB;//in CB
      this.yCB = yCB;// in CB
      if(shotAngle === null || shotAngle === undefined) {
        throw new Error("angle shot is undefined tear in creation");
      }
      this.shotAngle = shotAngle;// in radians

      if(shotSpeed === null || shotSpeed === undefined) {
        throw new Error("shot speed is undefined for tear in creation");
      }
      this.movementSpeed = shotSpeed;//in CB

      if(range === null || range === undefined) {
        throw new Error("range is undefined for tear in creation");
      }
      this.range = range;
      this.birthTime = millis();

      if(damage === null || damage === undefined) {
        throw new Error("damage is undefined for tear in creation");
      }
      this.damage = damage;
      if (this.shooter instanceof Enemy) {
          this.damage = 1;
      }
      if(!(shooter instanceof Object)) {
        throw new Error("shooter for tear is not an object in creation");
      }
      this.shooter = shooter;
      this.owner = this.shooter.owner;
      this.owner.allTears.push(this);
      this.collidingEntities = [];

      if(referenceXSpeed === null || referenceXSpeed === undefined) {
        throw new Error("referenceXSpeed is undefined for tear in creation");
      }
      this.inertialXSpeed = referenceXSpeed;
      if(referenceYSpeed === null || referenceYSpeed === undefined) {
        throw new Error("referenceYSpeed is undefined for tear in creation");
      }
      this.inertialYSpeed = -referenceYSpeed;

      this.xShotSpeed = this.movementSpeed * Math.cos(this.shotAngle);
      this.yShotSpeed = -this.movementSpeed * Math.sin(this.shotAngle);

      this.xSpeedCB = this.inertialXSpeed * .2 + this.xShotSpeed;
      this.ySpeedCB = this.inertialYSpeed * .2 + this.yShotSpeed;

      this.facingMovement = atan2(this.ySpeedCB, this.ySpeedCB);// in radians
      this.speed = Math.sqrt(Math.pow(this.xSpeedCB, 2) + Math.pow(this.ySpeedCB, 2));
      if (this.speed < this.shotspeed) {
          this.speed = this.shotSpeed;
          this.xSpeedCB = this.speed * Math.cos(this.facingMovement);
          this.ySpeedCB = this.speed * Math.sin(this.facingMovement);
      }
    }
    selfDestructDetection() {
        for (let c of this.collidingEntities) {
            if (c instanceof Block) {
                if (c.isSolid) {
                    this.selfDestruct = true;
                }
            }/*
            if(c instanceof Enemy)
            {
                if(!this.piercing)
                {
                    this.selfDestruct = true;
                }
            }*/
        }
        if (this.selfDestruct) {
            for (let t in this.owner.allTears) {
                if (this.owner.allTears[t] === this)
                    this.owner.allTears.slice(t, 1);
            }
        }
    }
    update() {
        //if(this.collidingEntities.length > 0)
        if (this.shooter instanceof Player) {
            this.colliders = this.originalColliders.concat(this.owner.allEnemies, this.owner.allObstacles);
        }
        else if (this.shooter instanceof Enemy || this.shooter instanceof ShootingTurret) {
            this.colliders = this.originalColliders.concat(this.owner.allPlayers, this.owner.allObstacles);
        }

        this.lifeTime = millis() - this.birthTime;
        if (this.lifeTime >= this.range) {
            this.selfDestruct = true;
        }
        this.xCB += this.xSpeedCB / fps;
        this.yCB += this.ySpeedCB / fps;
        super.baseUpdate();
        this.selfDestructDetection();
        if (this.shooter instanceof Player) {
            fill(200, 200, 255);
            stroke(255, 100)
            strokeWeight(4)
        }
        else if (this.shooter instanceof Enemy || this.shooter instanceof ShootingTurret) {
            if (this.selfDestruct)
                fill(0, 0, 255);
            else
                fill(255, 0, 0);
            stroke(255, 170, 170, 80)
            strokeWeight(4);

        }
        if (this.collidingEntities.length > 0) {
            fill(0);
        }
        ellipse(this.x, this.y, this.hitBoxRadius * 2, this.hitBoxRadius * 2);
    }

}

/*
function newTear(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, targets, range) {
    let t = new Tear(xCB, yCB, size, shotAngle, shotSpeed, referenceXSpeed, referenceYSpeed, targets, range);
    allTears.push(t);
    allEntities.push(t);
}*/

var tearMode = {
    Four_Shot_Plus_Sign: function (xCB, yCB, size, angle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health) {
        new Tear(xCB, yCB, size, angle + 0, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI / 2, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI * 3 / 2, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
    },
    Four_Shot_X: function (xCB, yCB, size, angle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health) {
        new Tear(xCB, yCB, size, angle + Math.PI / 4, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI / 2 + Math.PI / 4, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI + Math.PI / 4, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
        new Tear(xCB, yCB, size, angle + Math.PI * 3 / 2 + Math.PI / 4, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
    },
    Single_Shot: function (xCB, yCB, size, angle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health) {
        new Tear(xCB, yCB, size, angle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
    },
    Backwards_Single_Shot: function (xCB, yCB, size, angle, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health) {
        new Tear(xCB, yCB, size, angle + Math.PI, shotSpeed, referenceXSpeed, referenceYSpeed, shooter, range, damage, health)
    },
}

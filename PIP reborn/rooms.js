//var r = Math.floor(Math.random*300)
var rooms = {
    testRoom : function() {
        for(let c = 1; c <= collumnsInner; c += 2)
        {
            for(let r = 1; r <= rowsInner; r += 2)
            {
                newObstacle(c, r);
            }
        }

    },
    testTurrets : function() {
            for(let c = 2; c <= collumnsInner; c += 3)
            {
                for(let r = 2; r <= rowsInner; r += 3)
                {
                    newTurret(c, r);
                }
            }
    }
}

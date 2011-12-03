function Attack(player) {
    this.player = player;
    this.getPlayerPosition = function() {
        return this.player.getPosition();
    };
    this.getMousePosition = function() {
        return this.player.getMousePosition();
    };
    this.getOrientation = function() {
        return normalize2(sub2(this.getMousePosition(), this.getPlayerPosition()));
    };
    this.draw = drawArc;
}

function initializeAttacks() {
    var ringAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;
        ret.outerRadius = 300;
        ret.innerRadius = 250;
        ret.arcAngle = Math.PI;
        return ret;
    };

    var circleAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getMousePosition;
        ret.outerRadius = 300;
        ret.innerRadius = 250;
        ret.arcAngle = Math.PI;
        return ret;
    };

    var arcAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getMousePosition;
        ret.outerRadius = 150;
        ret.innerRadius = 80;
        ret.arcAngle = Math.PI / 2;
        return ret;
    };

    var meleeAttack = function(player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;
        ret.outerRadius = 80;
        ret.innerRadius = 0;
        ret.arcAngle = Math.PI / 4;
        return ret;
    };

    attacks = [ringAttack, circleAttack, arcAttack, meleeAttack];
}

var attacks = [];
var currentAttack = 3;
function getLocalAttack() {
    return attacks[currentAttack](getLocalPlayer());
}

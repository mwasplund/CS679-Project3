function getAttackOrientation() {
	return normalize2(sub2(getMouse().getWorldPosition(), getPlayer().position));
}

var ringAttack = {
    getCenter: function() { return getPlayer().position; },
    getOrientation: getAttackOrientation,
    outerRadius: 300,
    innerRadius: 250,
    arcAngle: Math.PI,
    draw: drawArc,
};

var circleAttack = {
    getCenter: function() { return getMouse().getWorldPosition(); },
    getOrientation: getAttackOrientation,
    outerRadius: 300,
    innerRadius: 250,
    arcAngle: Math.PI,
    draw: drawArc,
};

var arcAttack = {
    getCenter: function() { return getMouse().getWorldPosition(); },
    getOrientation: getAttackOrientation,
    outerRadius: 150,
    innerRadius: 80,
    arcAngle: Math.PI / 2,
    draw: drawArc,
};

var meleeAttack = {
    getCenter: function() { return getPlayer().position; },
    getOrientation: getAttackOrientation,
    outerRadius: 80,
    innerRadius: 0,
    arcAngle: Math.PI / 6,
    draw: drawArc,
};

var attacks = [ringAttack, circleAttack, arcAttack, meleeAttack];
var currentAttack = 3;
function getAttackArc() {
    return attacks[currentAttack];
}

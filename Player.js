var player = {
    position: [0, 0],
    velocity: 0.1,
    direction: [0, 1],
    radius: 20,
    fillStyle: "#00FF44",
    move: function() { 
        this.position = add2(this.position, scale2(this.velocity, this.direction));
    },
    getHealth: function() { return 0.7; },
    draw: drawCircle,
};
function getPlayer() {
    return player;
}

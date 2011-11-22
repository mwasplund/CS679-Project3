function setup() {
    for (var i = 0; i < 1; i += 0.05) {
        pushEnemy(makeEnemy(i));
    }
}

function pushEnemy(e) {
    enemies.push(e);
}

function getOptions() {
    return {
        playerVelocity: 0.8,
        keyUpWaitMax: 30,
    };
}

function makeEnemy(v) {
    return {
        v: v,
        radius: 4,
        position: [0, 0],
        move: function() {
            this.v += 0.00005;
            this.updatePosition();
        },
        updatePosition: function() {
            var d = 250;
            this.position = [
                d * Math.cos(Math.PI * 2 * this.v),
                d * Math.sin(Math.PI * 2 * this.v),
            ];
        },
        draw: drawCircle,
        fillStyle: "#111166",
        drawSelected: function() {
            var ctx = target.context;
            ctx.strokeStyle = "#888888";
            ctx.translate(this.position[0], this.position[1]);
			ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 3, 0, Math.PI*2, false); 
            ctx.closePath();
            ctx.stroke();
			//ctx.fill();
        },
    };
}

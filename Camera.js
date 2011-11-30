function getCamera() {
    return {
		move: function() { },
		position: [0, 0],
        getPosition: function() {
            return getLocalPlayer().getPosition();
        },
        preDraw: function (ctx) {
            var pos = this.getPosition();
            ctx.translate(-pos[0], -pos[1]);
        },
    };
}


const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.13

class Sprite {
    constructor({ position, velocity, height, color, lastPressedkey = null }) {
        this.position = position;
        this.velocity = velocity;
        this.height = height;
        this.color = color;
        this.lastPressedkey = lastPressedkey;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            10,
            20
        );
    };

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height >= canvas.height) {
            this.velocity.y = 0;
        } else { this.velocity.y += GRAVITY };

    };

};

const player = new Sprite({
    position: {
        x: 10,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    height: 20,
    color: "blue"
});

const enemy = new Sprite({
    position: {
        x: 600,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    height: 20,
    color: "red",
});

const keyMap = {
    player: {
        w: {
            pressed: false
        },
        s: {
            pressed: false
        },
        a: {
            pressed: false
        },
        d: {
            pressed: false
        }
    },
    enemy: {
        ArrowUp: {
            pressed: false
        },
        ArrowDown: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        }
    }
}


function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.velocity.x = 0;
    if (keyMap.player.w.pressed && player.lastPressedkey === "w") {
        player.velocity.y -= 1;

    } else if (keyMap.player.s.pressed && player.lastPressedkey === "s") {
        player.velocity.y += 1;

    } else if (keyMap.player.a.pressed && player.lastPressedkey === "a") {
        player.velocity.x -= 5;

    } else if (keyMap.player.d.pressed && player.lastPressedkey === "d") {
        player.velocity.x += 5;

    }

    enemy.velocity.x = 0;
    if (keyMap.enemy.ArrowUp.pressed && enemy.lastPressedkey === "ArrowUp") {
        enemy.velocity.y -= 1;

    } else if (keyMap.enemy.ArrowDown.pressed && enemy.lastPressedkey === "ArrowDown") {
        enemy.velocity.y += 1;

    } else if (keyMap.enemy.ArrowLeft.pressed && enemy.lastPressedkey === "ArrowLeft") {
        enemy.velocity.x -= 5;

    } else if (keyMap.enemy.ArrowRight.pressed && enemy.lastPressedkey === "ArrowRight") {
        enemy.velocity.x += 5;

    }
};

animate()

window.addEventListener("keydown", (e) => {
    // player
    if (e.key === "w") {
        keyMap.player.w.pressed = true;
        player.lastPressedkey = "w";

    } else if (e.key === "s") {
        keyMap.player.s.pressed = true;
        player.lastPressedkey = "s";

    } else if (e.key === "a") {
        keyMap.player.a.pressed = true;
        player.lastPressedkey = "a";

    } else if (e.key === "d") {
        keyMap.player.d.pressed = true;
        player.lastPressedkey = "d";

    };

    // enemy
    if (e.key === "ArrowUp") {
        keyMap.enemy.ArrowUp.pressed = true;
        enemy.lastPressedkey = "ArrowUp";

    } else if (e.key === "ArrowDown") {
        keyMap.enemy.ArrowDown.pressed = true;
        enemy.lastPressedkey = "ArrowDown";

    } else if (e.key === "ArrowLeft") {
        keyMap.enemy.ArrowLeft.pressed = true;
        enemy.lastPressedkey = "ArrowLeft";

    } else if (e.key === "ArrowRight") {
        keyMap.enemy.ArrowRight.pressed = true;
        enemy.lastPressedkey = "ArrowRight";

    };

});


window.addEventListener("keyup", (e) => {
    // player
    if (e.key === "w") {
        keyMap.player.w.pressed = false;

    } else if (e.key === "s") {
        keyMap.player.s.pressed = false;

    } else if (e.key === "a") {
        keyMap.player.a.pressed = false;
    }
    else if (e.key === "d") {
        keyMap.player.d.pressed = false;
    };

    // enemy
    if (e.key === "ArrowUp") {
        keyMap.enemy.ArrowUp.pressed = false;

    } else if (e.key === "ArrowDown") {
        keyMap.enemy.ArrowDown.pressed = false;

    } else if (e.key === "ArrowLeft") {
        keyMap.enemy.ArrowLeft.pressed = false;

    } else if (e.key === "ArrowRight") {
        keyMap.enemy.ArrowRight.pressed = false;

    };

});
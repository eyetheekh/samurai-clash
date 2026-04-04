const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.6;

class Sprite {
    constructor({ position, velocity, width, height, color, lastPressedkey = null }) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lastPressedkey = lastPressedkey;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    };

    update() {
        this.draw();

        // actual movement of the sprite
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // update y velocity for gravity to keep increasing until hit canvas bottom
        if (this.position.y + this.height >= canvas.height) {
            this.velocity.y = 0;
        } else { this.velocity.y += GRAVITY };


        // clamp to boundaries
        if (this.position.x < 0) {
            this.position.x = 0;
        };
        if (this.position.x + this.width > canvas.width) {
            this.position.x = canvas.width - this.width;
        };

        if (this.position.y < 0) {
            this.position.y = 0;
        };
        if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
        }

    };

    isOnGround() {
        // returns a boolen if charector is touching the ground (canvas bottom)
        return this.position.y + this.height === canvas.height
    }

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
    width: 20,
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
    width: 20,
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
    // completely wipe the canvas 
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ///////////////////////////////////////////////////// PLAYER
    // reset player's x velocity for each frame
    player.velocity.x = 0;

    // calculate player movement based on keyinput & update velocity for each frame
    if (keyMap.player.w.pressed && player.lastPressedkey === "w") {
        if (player.isOnGround()) player.velocity.y -= 12;

    } else if (keyMap.player.s.pressed && player.lastPressedkey === "s") {
        if (!player.isOnGround()) player.velocity.y += 12;

    } else if (keyMap.player.a.pressed && player.lastPressedkey === "a") {
        player.velocity.x -= 5;

    } else if (keyMap.player.d.pressed && player.lastPressedkey === "d") {
        player.velocity.x += 5;

    };
    
    ///////////////////////////////////////////////////// ENEMY
    // reset enemy's x velocity for each frame
    enemy.velocity.x = 0;
    
    // calculate enemy movement based on keyinput & update velocity for each frame
    if (keyMap.enemy.ArrowUp.pressed && enemy.lastPressedkey === "ArrowUp") {
        if (enemy.isOnGround()) enemy.velocity.y -= 12;

    } else if (keyMap.enemy.ArrowDown.pressed && enemy.lastPressedkey === "ArrowDown") {
        if (!enemy.isOnGround()) enemy.velocity.y += 12;

    } else if (keyMap.enemy.ArrowLeft.pressed && enemy.lastPressedkey === "ArrowLeft") {
        enemy.velocity.x -= 5;

    } else if (keyMap.enemy.ArrowRight.pressed && enemy.lastPressedkey === "ArrowRight") {
        enemy.velocity.x += 5;

    };

    // update the position of the charectors 
    player.update();
    enemy.update();
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
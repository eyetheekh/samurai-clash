const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.6;
const FLOOR_LEVEL = 56;


class Sprite {
    constructor({ position, width, height, imageSrc }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    };

    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, canvas.width, canvas.height)
    };

    update() {
        this.draw();
    };

};

class Warrior {
    constructor({ position, velocity, width, height, color, attackColor, attackWidth, attackHeight, attackOffsetX, attackOffsetY }) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lastPressedkey = null;
        this.isAttacking = false;
        this.attackBox = {
            color: attackColor,
            width: attackWidth,
            height: attackHeight,
            x: this.position.x,
            y: this.position.y,
            x_offset: attackOffsetX,
            y_offset: attackOffsetY,
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        // draw attack box when attacking is true
        if (this.isAttacking) {
            ctx.fillStyle = this.attackBox.color;
            ctx.fillRect(
                this.attackBox.x,
                this.attackBox.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    };

    update() {
        this.draw();

        // actual movement of the sprite
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // this.attackBox values are populated onlu once at object creation and are not updated dynamically;
        // manually update the attackBox x,y with that of the charector
        // offest the attackbox for right side charector
        this.attackBox.x = this.position.x + this.attackBox.x_offset;
        this.attackBox.y = this.position.y + this.attackBox.y_offset;

        // update y velocity for gravity to keep increasing until hit canvas bottom
        if (this.position.y + this.height >= canvas.height - FLOOR_LEVEL) {
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
        if (this.position.y + this.height > canvas.height - FLOOR_LEVEL) {
            this.position.y = canvas.height - this.height - FLOOR_LEVEL;
        };

    };

    isOnGround() {
        // returns a boolen if charector is touching the ground (canvas bottom)
        return this.position.y + this.height === canvas.height - FLOOR_LEVEL
    };

    attack() {
        /* 
        attack based on boolean: isAttacking
        checks if isAttacking is true & immediately returns
        else set attacking to true and a settimeout to negate back to false
        */
        if (this.isAttacking) {
            return;
        }
        else {
            this.isAttacking = true;
            setTimeout(() => {
                this.isAttacking = false;
            }, 250);
        }
    };


};

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'assets/background/background.jpeg'
});

const player = new Warrior({
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
    color: "blue",
    attackColor: "green",
    attackWidth: 40,
    attackHeight: 10,
    attackOffsetX: 0,
    attackOffsetY: 0
});

const enemy = new Warrior({
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
    attackColor: "yellow",
    attackWidth: 40,
    attackHeight: 10,
    attackOffsetX: -20,
    attackOffsetY: 0
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
        },
        space: {
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
        },
        Control: {
            pressed: false
        }
    }
};

function detectCollision(
    player1,
    player2,
) {
    // compare the players attackboxxes and checks for overlapping between them
    return (
        player1.attackBox.x + player1.attackBox.width >= player2.position.x &&
        player1.attackBox.x <= player2.position.x + player2.width &&
        player1.attackBox.y + player1.attackBox.height >= player2.position.y &&
        player1.attackBox.y <= player2.position.y + player2.height
    );
};

function animate() {
    window.requestAnimationFrame(animate);
    // completely wipe the canvas 
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // background image
    background.update();

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

    //////////////////////////////////////////////////// check for collisions
    // player hits enemy
    if (player.isAttacking && detectCollision(player, enemy)) {
        console.log("player hit enemy");
        // player.isAttacking = false;
    };

    // enemy hits player 
    if (enemy.isAttacking && detectCollision(enemy, player)) {
        console.log("enemy hit player");
        // enemy.isAttacking = false;
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
    } else if (e.key === " ") {
        /*  
        browser handles spacekey as one of controlkeys and fires repeated keydown events,
        which causes repeated keydown events if pressed & hold.
        */

        // check if the key is pressed, then only attack
        // forces a keyup (resets to false) to attack again
        if (!keyMap.player.space.pressed) {
            player.attack();
        }
        keyMap.player.space.pressed = true;
        player.lastPressedkey = " ";
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

    } else if (e.key === "Control") {
        keyMap.enemy.Control.pressed = true;
        enemy.lastPressedkey = "Control";
        enemy.attack()
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
    }
    else if (e.key === " ") {
        keyMap.player.space.pressed = false;
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

    } else if (e.key === "Control") {
        keyMap.enemy.Control.pressed = false;

    };

});
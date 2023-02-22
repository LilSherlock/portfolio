const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.width = window.innerWidth
canvas.height = window.innerHeight

// c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7;

class Sprite {
    constructor ({position, velocity, offSet}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.attackHitBox = {
            position: {
                x: this.position.x,
                y: this.position.y 
            },
            offSet,
            width: 100,
            height: 50
        }
        this.isAttack = false,
        this.playerHealth = 100
    }

    draw() {
        c.fillStyle = this.position.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if(this.isAttack) {
            c.fillStyle = 'white'
            c.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.width, this.attackHitBox.height)
        }
    }

    update() {
        this.draw()
        //velocity gravity
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.attackHitBox.position.x = this.position.x + this.attackHitBox.offSet.x
        this.attackHitBox.position.y = this.position.y

        
        //vertical limit
        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }else this.velocity.y += gravity

        //horizontal limit
        if(this.position.x + this.width + this.velocity.x >= canvas.width) {
            this.position.x = canvas.width - this.width
            keys.right.pressed = false
        } else if(this.position.x <= 0) keys.left.pressed = false

        //horizontal limit
    }
    attack() {
        console.log('pene')
        this.isAttack = true

        setTimeout(() => {
            this.isAttack = false
        }, 100)
    }
}

let enemies = []

class Enemy {
    constructor ({position, velocity, offSet}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.attackHitBox = {
            position: {
                x: this.position.x,
                y: this.position.y 
            },
            offSet,
            width: 100,
            height: 50,
            width_attack: 150,
            attack_position: {
                x: this.position.x,
                y: this.position.y
            }
        }
        this.attackDetection = false,
        this.isAttack = false
        this.attackTime = 100
        this.enemyHealth = 100

    }

    draw() {
        c.fillStyle = this.position.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if(this.attackDetection) {

            c.fillStyle = 'white'
            c.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.width, this.attackHitBox.height)
        }

        c.fillStyle = 'green'
        c.fillRect(this.attackHitBox.attack_position.x, this.attackHitBox.attack_position.y + 50, this.attackHitBox.width_attack, this.attackHitBox.height)
    }

    followPlayer() {
        if (this.position.x > player.position.x + this.width + 10) {
            this.position.x -= 3
            this.attackHitBox.position.x = this.position.x - this.attackHitBox.offSet.defaultOffset
            this.attackHitBox.attack_position.x = this.position.x - this.attackHitBox.width_attack
        }else if(this.position.x < player.position.x - this.width - 10) {
            this.position.x += 3
            this.attackHitBox.position.x = this.position.x
            this.attackHitBox.attack_position.x = this.position.x + this.width

        }

    }

    update() {
        this.draw()

        if (this.enemyHealth <= 0) {
            enemies.splice(enemies.indexOf(this), 1);

            createEnemy()
            return;
        }
        //velocity gravity
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // this.attackHitBox.position.x = this.position.x - this.attackHitBox.offSet.defaultOffset
        this.attackHitBox.position.y = this.position.y
        this.attackHitBox.attack_position.y = this.position.y
        // this.attackHitBox.attack_position.x = this.position.x
        
        //vertical limit
        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }else this.velocity.y += gravity

        //horizontal limit
        if(this.position.x + this.width + this.velocity.x >= canvas.width) {
            this.position.x = canvas.width - this.width
            keys.right.pressed = false
        } else if(this.position.x <= 0) keys.left.pressed = false

        this.followPlayer()
    }
}

const player = new Sprite({
    position:{
        x: canvas.width / 2,
        y: 0,
        color: 'yellow'
    },
    velocity: {
        x: 0,
        y: 10
    },
    offSet: {
        defaultOffset: 50,
        x: 50,
        y: 0,
    }
})

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false,
        alreadyPress: true
    },
}

 // function section
let requestAnimation
function attackCollider() {

    return player.attackHitBox.position.x + player.attackHitBox.width >= enemies[0].position.x &&
    player.attackHitBox.position.x <= enemies[0].position.x + enemies[0].width &&
    player.attackHitBox.position.y + player.attackHitBox.height >= enemies[0].position.y &&
    player.attackHitBox.position.y <= enemies[0].position.y + enemies[0].height && 
    player.isAttack
}

function enemyDetectkHitbox() {
    return enemies[0].attackHitBox.attack_position.x + enemies[0].attackHitBox.width_attack >= player.position.x &&
    enemies[0].attackHitBox.attack_position.x <= player.position.x + player.width &&
    enemies[0].attackHitBox.attack_position.y + enemies[0].attackHitBox.height >= player.position.y &&
    enemies[0].attackHitBox.attack_position.y <= player.position.y + player.height
}

function enemyCollider() {
    return enemies[0].attackHitBox.position.x + enemies[0].attackHitBox.width >= player.position.x &&
    enemies[0].attackHitBox.position.x <= player.position.x + player.width &&
    enemies[0].attackHitBox.position.y + enemies[0].attackHitBox.height >= player.position.y &&
    enemies[0].attackHitBox.position.y <= player.position.y + player.height && 
    enemies[0].isAttack
}

function createEnemy() {

    let x, y;
    let border = Math.random();
    if (border < 0.5) {
        // Spawn on the left border
        x = 0;
        y = canvas.height - 150;
    } else {
        // Spawn on the right border
        x = canvas.width;
        y = canvas.height - 150;
    }
    const enemy = new Enemy({
        position:{
            x: x,
            y: y,
            color: 'red'
        },
        velocity: {
            x: 0,
            y: 1
        },
        offSet: {
            defaultOffset: 50,
            x: 50,
            y: 0,
        }
        
    })
    enemies.push(enemy)
}


function animate() {
    requestAnimation = window.requestAnimationFrame(animate)
    //background

    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }

    player.velocity.x = 0

    if(keys.right.pressed) {
        player.velocity.x = 10
        player.attackHitBox.offSet.x = player.attackHitBox.offSet.defaultOffset
    } else if(keys.left.pressed) {
        player.attackHitBox.offSet.x = -player.attackHitBox.offSet.defaultOffset * 2

        player.velocity.x = -10
    }

    if (keys.up.pressed && keys.up.alreadyPress && canvas.height - player.height == Math.trunc(player.position.y)) {
        player.velocity.y = -20
        keys.up.alreadyPress = false
    }
    //player attack
    console.log(enemies.length)
    if (enemies.length != 0) {

        if (attackCollider(player)) {
            player.isAttack = false
            enemies[0].enemyHealth -= 50
            console.log('Jerman es gay', enemies[0].enemyHealth)
        }
        //enemy attack
    
        if (enemies[0].attackTime != 100) {
            enemies[0].attackTime += 1
            // console.log(enemies[0].attackTime)
        }
    
        if(enemyDetectkHitbox()) {
            // console.log('detect')
            enemies[0].attackDetection = true
            enemies[0].isAttack = true
            if (enemyCollider() && enemies[0].attackTime == 100) {
                enemies[0].attackTime = 0
                enemies[0].isAttack = false
                enemies[0].attackDetection = false
                player.playerHealth -= 20
                document.querySelector('#healthBar').style.width = player.playerHealth + '%'
                console.log('attack', enemies[0])
            }
        }else enemies[0].attackDetection = false
    }else {
        createEnemy()
    }
}

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
            keys.right.pressed = true
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            break
        case 'ArrowUp':
            keys.up.pressed = true
            break
        case 'ArrowDown':
            player.attack()
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'ArrowRight':
            keys.right.pressed = false
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'ArrowUp':
            keys.up.pressed = false
            keys.up.alreadyPress = true
    }
})


animate()
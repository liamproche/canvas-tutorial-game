window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1280
    canvas.height = 720

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    
    class Player{
        constructor(game){
            this.game = game
            //calculates where we drop image into window
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.5;
            this.collisionRadius = 30
            this.speedX = 0
            this.speedY = 0
            this.dx = 0
            this.dy = 0
            this.speedModifier = 3
            this.spriteWidth = 255
            this.spriteHeight = 256
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            //calculates spritesheet frame image
            this.spriteX
            this.spriteY
            this.frameX = 0 
            this.frameY = 5
            this.image = document.getElementById('bull')
        }
        draw(context){
            //draws player from spritesheet... params defined above
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context.save()
                context.globalAlpha = 0.5
                context.fill()
                context.restore()
                context.stroke()
                context.beginPath()
                context.moveTo(this.collisionX, this.collisionY)
                context.lineTo(this.game.mouse.x, this.game.mouse.y)
                context.stroke()
            }
            

        }
        update(){
            this.dx = this.game.mouse.x - this.collisionX
            this.dy = this.game.mouse.y - this.collisionY
            //player sprite animation (atan2 lets us capture angle of mouse direction)
            const angle = Math.atan2(this.dy, this.dx)
            if(angle < -2.74 || angle > 2.74) this.frameY = 6
            else if(angle < -1.96) this.frameY = 7
            else if(angle < -1.17) this.frameY = 0
            else if(angle < -0.39) this.frameY = 1
            else if(angle < 0.39) this.frameY = 2
            else if(angle < 1.17) this.frameY = 3
            else if(angle < 1.96) this.frameY = 4
            else if(angle < 2.74) this.frameY = 5
            const distance = Math.hypot(this.dy, this.dx)
            if(distance > this.speedModifier){
                this.speedX = this.dx / distance || 0
                this.speedY = this.dy / distance || 0
            }
            else{
                this.speedX = 0
                this.speedY = 0
            }
            this.collisionX += this.speedX * this.speedModifier
            this.collisionY += this.speedY * this.speedModifier
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 100

            //horizontal boundaries
            if(this.collisionX < this.collisionRadius)
            this.collisionX = this.collisionRadius
            else if (this.collisionX > this.game.width - this.collisionRadius) 
            this.collisionX = this.game.width - this.collisionRadius
            //vertical boundaries
            if(this.collisionY < this.game.topMargin + this.collisionRadius)
            this.collisionY = this.game.topMargin + this.collisionRadius
            else if (this.collisionY > this.game.height - this.collisionRadius)
            this.collisionY = this.game.height - this.collisionRadius

            //check collision with obstacles
            this.game.obstacles.forEach(obstacle => {
                //[(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
                //Note- destructured syntax allows values to be unpacked from arrays at index position without having to unpack separate variables
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle)
                // let collision1 = game.checkCollision(this, obstacle)[0]
                // let distance1 = game.checkCollision(this, obstacle)[1]
                if(collision){
                    const unit_x = dx / distance
                    const unit_y = dy / distance
                    //this is the math that pushes a player back when they collide
                    this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x
                    this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y
                }
            })
        }
    }

    class Obstacle{
        constructor(game){
            this.game = game
            //randomly positions obstacles along X-axis
            this.collisionX = Math.random() * this.game.width
            //randomly positions obstacles along Y-axis
            this.collisionY = Math.random() * this.game.height
            this.collisionRadius = 60
            this.image = document.getElementById('obstacles')
            this.spriteWidth = 250
            this.spriteHeight = 250
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 50
            //sets which selected image along columns of spritesheet to random
            this.frameX = Math.floor(Math.random() * 4)
            //sets which selected image along rows of spritesheet to random
            this.frameY = Math.floor(Math.random() * 3)
        }
        draw(context){
            //draws images from spritesheet using above variables
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context.save()
                context.globalAlpha = 0.5
                context.fill()
                context.restore()
                context.stroke()
        }}
    }   

    class Egg {
        constructor(game){
            this.game = game
            this.collisionRadius = 40
            this.margin = this.collisionRadius * 2
            this.collisionX = this.margin + (Math.random() * (this.game.width - this.margin * 2))
            this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin))
            this.image = document.getElementById('egg')
            this.spriteWidth = 110
            this.spriteHeight = 135
            this.width = this.spriteWidth
            this.height = this.spriteHeight
            this.spriteX
            this.spriteY
        }
        draw(context){
            context.drawImage(this.image, this.spriteX, this.spriteY)
            if(this.game.debug){
                context.beginPath()
                context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2)
                context.save()
                context.globalAlpha = 0.5
                context.fill()
                context.restore()
                context.stroke()
            }
        }
        update(){
            this.spriteX = this.collisionX - this.width * 0.5
            this.spriteY = this.collisionY - this.height * 0.5 - 26
            let collisionObjects = [this.game.player, ...this.game.obstacles]
            collisionObjects.forEach(object =>{
                let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object)
                if(collision){
                    const unit_x = dx / distance
                    const unit_y = dy / distance
                    this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x
                    this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y

                }
            })
        }
    }
    
    class Game{
        constructor(canvas){
            this.canvas = canvas
            this.width = this.canvas.width
            this.height = this.canvas.height
            //draws objects on the Y-axis below background 
            this.topMargin = 260
            this.debug = true
            this.player = new Player(this)
            this.fps = 70
            this.timer = 0
            this.interval = 1000/this.fps
            this.eggTimer = 0
            this.eggInterval = 500
            this.numberOfObstacles = 10
            this.obstacles = []
            this.eggs = []
            this.maxEggs = 10
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            //event listeners
            window.addEventListener('mousedown', (e)=>{
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                this.mouse.pressed = true
            })
            window.addEventListener('mouseup', (e)=>{
                this.mouse.x = e.offsetX
                this.mouse.y = e.offsetY
                this.mouse.pressed = false
            })
            window.addEventListener('mousemove', (e)=>{
                if(this.mouse.pressed){
                    this.mouse.x = e.offsetX
                    this.mouse.y = e.offsetY
                }
            })
            window.addEventListener('keydown', (e)=>{
                if(e.key == 'd') this.debug = !this.debug
            })
        }
        render(context, deltaTime){
            if(this.timer > this.interval){
                //animate the next frame
                context.clearRect(0, 0, this.width, this.height)
                this.timer = 0
                this.obstacles.forEach(obstacle => obstacle.draw(context))
                this.eggs.forEach(egg => {
                    egg.draw(context)
                    egg.update()
                })

                this.player.draw(context)
                this.player.update()
            }
            this.timer += deltaTime

            //add eggs periodically (uses delta time)
            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs){
                this.addEgg()
                this.eggTimer = 0
                console.log(this.eggs)
            } else{
                this.eggTimer += deltaTime
            }
        }
        checkCollision(a, b){
            const dx = a.collisionX - b.collisionX
            const dy = a.collisionY - b.collisionY
            const distance = Math.hypot(dy, dx)
            const sumOfRadii = a.collisionRadius + b.collisionRadius
            //returns boolean first to check collision, then returns other values for player physics ORDER IMPORTANT!!!
            return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]
        }
        addEgg(){
            this.eggs.push(new Egg(this))
        }
        init(){
            let attempts = 0
            //while loop to populate obstacle array (hardcoded 500 max as fail-safe)
            while(this.obstacles.length < this.numberOfObstacles && attempts < 500){
                let testObstacle = new Obstacle(this)
                let overlap = false
                //forEach to check for object collision
                this.obstacles.forEach(obstacle =>{
                    const dx = testObstacle.collisionX - obstacle.collisionX
                    const dy = testObstacle.collisionY - obstacle.collisionY
                    const distance = Math.hypot(dy,dx)
                    //variable to create buffer around obstacles
                    const distanceBuffer = 150
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer
                    if (distance < sumOfRadii){
                        overlap = true
                    }
                })
                const margin = testObstacle.collisionRadius * 3
                //actually pushes non-collided obstacles into obstacle array
                if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin){
                    this.obstacles.push(testObstacle)
                }
                attempts++  
            }
        }
    }


    const game = new Game(canvas)
    game.init()
    console.log(game)

    let lastTime = 0
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        game.render(ctx, deltaTime)
        //timestamp auto-passed to function via requestAnimationFrame()
        requestAnimationFrame(animate)
    }
    animate(0)
})
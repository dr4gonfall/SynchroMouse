class Game {
    constructor(canvas, socket, room){
        this.canvas = canvas;
        this.socket = socket;
        this.room = room;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = this.canvas.getContext('2d')
        this.score = 0;
        this.player = new Player(this);
        this.agent = new Agent(this, this.player)
        // this.agentTargetX = targetX;
        // this.agentTargetY = targetY;
        this.mouse = {
            x: this.width * 0.5,
            y: this.height *0.5,
            pressed:false
        }
        // Event Listeners
        // canvas.addEventListener('mousedown', (e) => {
        //     this.mouse.x = e.offsetX;
        //     this.mouse.y = e.offsetY;
        //     this.mouse.pressed = true;
        // })

        // canvas.addEventListener('mouseup', (e) => {
        //     this.mouse.x = e.offsetX;
        //     this.mouse.y = e.offsetY;
        //     this.mouse.pressed = false;
        // })
        canvas.addEventListener('mousemove', (e) => {
            // this.mouse.x = e.offsetX;
            // this.mouse.y = e.offsetY;
            this.mouse.x = e.movementX;
            this.mouse.y = e.movementY;

        })
        // canvas.addEventListener('click', async () => {
        //     if (!document.pointerLockElement) {
        //         await canvas.requestPointerLock({
        //             unadjustedMovement: true,
        //         })
        //     }
        // })
        // document.addEventListener("pointerlockchange", lockChangeAlert, false);
    }

    

    render(context,random, targetX, targetY, slider){
        this.player.draw(context);
        this.player.update(this.mouse.x, this.mouse.y);
        this.agent.draw(context, targetX, targetY);
        this.agent.update(random,targetX,targetY, this.socket, this.room, slider);
        // console.log(`The target of the agent is: ${targetX} and ${targetY}`)

    } 
}
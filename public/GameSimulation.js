class GameSimulation {
    constructor(canvas, socket, room){
        this.canvas = canvas;
        this.socket = socket;
        this.room = room;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = this.canvas.getContext('2d')
        this.score = 0;
        this.agent1 = new Agent(this, this.agent2, true);
        this.agent2 = new Agent(this, this.agent1, false);
        this.gameRound = 0;
        this.frameRate = 30;
        this.currentRound = 0;
        // this.agentTargetX = targetX;
        // this.agentTargetY = targetY;
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
        // canvas.addEventListener('mousemove', (e) => {
        //     // this.mouse.x = e.offsetX;
        //     // this.mouse.y = e.offsetY;
        //     this.mouse.x = e.movementX;
        //     this.mouse.y = e.movementY;

        // })
        // canvas.addEventListener('click', async () => {
        //     if (!document.pointerLockElement) {
        //         await canvas.requestPointerLock({
        //             unadjustedMovement: true,
        //         })
        //     }
        // })
        // document.addEventListener("pointerlockchange", lockChangeAlert, false);
    }

    

    render(context, random, targetX, targetY){
        // this.player.draw(context);
        // this.canvas.addEventListener('mousemove', (e) => {
            // this.player.update(e.movementX, e.movementY, dt)
        // })
        // this.player.update(moveMouseX, moveMouseY);
        // console.log(`The movement of the mouse is: ${moveMouseX} and ${moveMouseY }`)
        // console.log(`The target of the agent is: ${targetX} and ${targetY}`)
        this.agent1.draw(context, targetX, targetY);
        this.agent2.draw(context, targetX, targetY);

        this.agent1.update(random, targetX, targetY, this.socket, this.room);
        this.agent2.update(random, targetX, targetY, this.socket, this.room);
        
        // this.agent.draw(context, targetX, targetY);
        // this.agent.update(random,targetX,targetY, this.socket, this.room);
        
    } 
}
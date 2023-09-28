class Tutorial {
    constructor(canvas, socket, room){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context = this.canvas.getContext('2d')
        this.score = 0;
        this.player = new Player(this);
        this.agent = new TutorialBot(this, this.player)
        this.gameRound = 0;
        this.frameRate = 30;
        this.currentRound = 0;
        this.mouse = {
            x: this.width * 0.5,
            y: this.height *0.5,
            pressed:false
        }
        
    }

    

    render(context, random, targetX, targetY, moveMouseX, moveMouseY){
        this.mouse.x = moveMouseX
        this.mouse.y = moveMouseY
        this.player.draw(context);
        this.player.update(moveMouseX, moveMouseY);
        this.agent.draw(context, targetX, targetY);
        this.agent.update(random,targetX,targetY, this.socket, this.room);
        
    } 
}
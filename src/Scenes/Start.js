class Start extends Phaser.Scene {
    constructor() {
        super("startScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        //Create constants for the diver location
        this.bodyX = 50;
        this.bodyY = 400;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("diver", "alienBeige_swim1.png");
        this.load.image("spike", "spike_top.png");
        this.load.image("terrain", "terrain_dirt_top_a_outline.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.bitmapFont("kenneySquare", "KenneySquare_0.png", "KenneySquare.fnt");
        this.load.audio("spikeThrow", "bong_001.ogg");
        
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        //scene variables
        this.upperBound = 75;
        this.lowerBound = game.config.height - 175;

        this.speed = 200; //player speed in pixels/sec
        this.spikeSpeed = 500;

        //sound effects
        this.spikeThrowSound = this.sound.add("spikeThrow");

        //create keys
        this.up = this.input.keyboard.addKey('W');
        this.down = this.input.keyboard.addKey('S');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //draw terrain
        my.sprite.terrain = this.add.tileSprite(50, game.config.height - 30, game.config.width*2, 60, "terrain");
        my.sprite.terrain.setDepth(-1);

        //make spike group
        my.sprite.spikeGroup = this.add.group({
            defaultKey: "spike",
            maxSize: 3,
            }
        );

        //create members for the spike group, initialize as inactive
        my.sprite.spikeGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.spikeGroup.defaultKey,
            repeat: my.sprite.spikeGroup.maxSize-1
        });

        //set spike angle and scale
        my.sprite.spikeGroup.scaleXY(-0.75, -0.75);
        my.sprite.spikeGroup.angle(90);

        
        // Create the player sprite
        my.sprite.player = this.add.sprite(this.bodyX, this.bodyY, "diver");
        my.sprite.player.setScale(0.75);

        //create text
        my.text.title = this.add.bitmapText(game.config.width/2,game.config.height/2,"kenneySquare", "DEEPopulate!", 64).setOrigin(0.5);

        my.text.play = this.add.bitmapText(game.config.width/2,game.config.height/2 + 64,"kenneySquare", "Play", 28).setOrigin(0.5);
        my.text.play.setInteractive();
        my.text.credits = this.add.bitmapText(game.config.width/2,game.config.height/2 + 96,"kenneySquare", "Credits", 28).setOrigin(0.5);
        my.text.credits.setInteractive();

        my.text.controls = this.add.bitmapText(10,this.lowerBound + 50,"kenneySquare", "W - Move up\nS - Move Down\nSPACE - Throw Spike", 20).setOrigin(0);

        //set blend mode for all texts
        for(let text in my.text){
            my.text[text].setBlendMode(Phaser.BlendModes.ADD);
        }

        //mouse input
        //on click, go to scene
        my.text.play.on('pointerup', (pointer) =>{
            this.scene.start("levelScene");
        });
        my.text.credits.on('pointerup', (pointer) =>{
            this.scene.start("creditsScene");
        });
        //on hover, change text
        my.text.play.on('pointerover', (pointer) => {
            my.text.play.setAlpha(0.25);
        });
        my.text.credits.on('pointerover', (pointer) => {
            my.text.credits.setAlpha(0.25);
        });
        //on unhover, undo text changes
        my.text.play.on('pointerout', (pointer) => {
            my.text.play.clearAlpha();
        });
        my.text.credits.on('pointerout', (pointer) => {
            my.text.credits.clearAlpha();
        });
 
        this.counter = 0;

    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        this.counter++;

        //move up
            if(this.up.isDown){
                //move player sprite up
                if(my.sprite.player.y > this.upperBound){
                    this.my.sprite.player.y -= this.speed * dt;
                }
            }

            //move down
            if(this.down.isDown){
                //move player sprite down
                if(my.sprite.player.y < this.lowerBound){
                        this.my.sprite.player.y += this.speed * dt;
                }
            }

            //shoot spike
            if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
                //fire spike
                // Get the first inactive spike, and make it active
                let spike = my.sprite.spikeGroup.getFirstDead();
                // spike will be null if there are no inactive (available) bullets
                if (spike != null) {
                    spike.active = true;
                    spike.visible = true;
                    spike.x = my.sprite.player.x;
                    spike.y = my.sprite.player.y;
                    this.spikeThrowSound.play();
                }
            }

            //make offscreen spikes inactive
            for (let spike of my.sprite.spikeGroup.getChildren()) {
                if (spike.x > game.config.width + spike.displayWidth/2) {
                    spike.active = false;
                    spike.visible = false;
                }
            }

            my.sprite.spikeGroup.incX(this.spikeSpeed*dt);
            
            /*
            //blinking text
            if(my.text.play.visible && this.counter > 1/dt){ // if visible for 3 seconds
                //make invisible
                my.text.play.visible = false;
                this.counter = 0; //reset counter
            }
            else if (!my.text.play.visible && this.counter > 0.5/dt){ //if invisible, after 1 second, make visible
                my.text.play.visible = true;
                this.counter = 0; //reset counter
            }
                */
    }
    
}
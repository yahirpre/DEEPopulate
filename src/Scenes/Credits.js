class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
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
        this.load.image("greenFish", "fishGreen.png");
        this.load.image("pinkFish", "fishPink.png");
        this.load.image("bubble", "bubble_b.png");
        this.load.image("terrain", "terrain_dirt_top_a_outline.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        this.load.bitmapFont("kenneySquare", "KenneySquare_0.png", "KenneySquare.fnt");
        this.load.audio("pop", "pop2.ogg");
        this.load.audio("spit", "spit.ogg");
        this.load.audio("waveDone", "confirmation_002.ogg");
        this.load.audio("FLG", "question_004.ogg");
        this.load.audio("gameOver", "spaceTrash2.ogg");
        this.load.audio("fishHit", "drop_004.ogg");
        this.load.audio("spikeThrow", "bong_001.ogg");
        
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        this.running = true; //game running boolean

        this.graphics = this.add.graphics();

        //scene variables
        this.upperBound = 75;
        this.lowerBound = game.config.height - 175;

        this.speed = 200; //player speed in pixels/sec
        this.spikeSpeed = 500;

        //wave variables
        this.waveNum = 1;
        this.waveMaxFish = 3; //max fish to spawn for each color
        this.activeGreenFish = 0; //the current amount sent in a wave (INCLUDES OFF SCREEN FISH)
        this.activePinkFish = 0;
        this.fishLetGo = {
            green: 0,
            pink: 0
        };

        //sound effects
        this.popSound = this.sound.add("pop");
        this.spitSound = this.sound.add("spit");
        this.waveDownSound = this.sound.add("waveDone");
        this.FLGSound = this.sound.add("FLG");
        this.gameOverSound = this.sound.add("gameOver");
        this.fishHitSound = this.sound.add("fishHit");
        this.spikeThrowSound = this.sound.add("spikeThrow");

        //create keys
        this.up = this.input.keyboard.addKey('W');
        this.down = this.input.keyboard.addKey('S');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //draw terrain
        my.sprite.terrain = this.add.tileSprite(50, game.config.height - 30, game.config.width*2, 60, "terrain");
        my.sprite.terrain.setDepth(-1);

        //create text
        let credits = "Developer\nYahir Prenger\n\nAssets\n"
        my.text.credits = this.add.bitmapText(game.config.width/2,game.config.height/2,"kenneySquare", "DEEPopulate!", 64).setOrigin(0.5);
        my.text.pressAnywhere = this.add.bitmapText(game.config.width/2,game.config.height/2 + 64,"kenneySquare", "Click anywhere to go back", 28).setOrigin(0.5);


        //set blend mode for all texts
        for(let text in my.text){
            my.text[text].setBlendMode(Phaser.BlendModes.ADD);
        }

        //mouse input
        this.input.on('pointerup', (pointer) =>{
            this.scene.start("startScene");
        }, this);

        this.counter = 0;

    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        this.counter++;
            
        //blinking text
        if(my.text.pressAnywhere.visible && this.counter > 1/dt){ // if visible for 3 seconds
            //make invisible
            my.text.pressAnywhere.visible = false;
            this.counter = 0; //reset counter
        }
        else if (!my.text.pressAnywhere.visible && this.counter > 0.5/dt){ //if invisible, after 1 second, make visible
            my.text.pressAnywhere.visible = true;
            this.counter = 0; //reset counter
        }
    }
    
}
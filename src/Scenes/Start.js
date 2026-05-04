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
        this.load.audio("bgMusic", "bgMusic.mp3");
        
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        this.running = true; //game running boolean

        this.graphics = this.add.graphics();

        //scene variables
        this.upperBound = 75;
        this.lowerBound = game.config.height - 115;

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
        this.rKey = this.input.keyboard.addKey('R');
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

        my.text.gameOver = this.add.bitmapText(0,0,"kenneySquare", "Game Over!");

        //set blend mode for all texts
        for(let text in my.text){
            my.text[text].setBlendMode(Phaser.BlendModes.ADD);
        }

    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        
    }
}
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
        this.load.setPath("assets/");
        this.load.image("terrain", "terrain_dirt_top_a_outline.png");
        this.load.bitmapFont("kenneySquare", "KenneySquare_0.png", "KenneySquare.fnt");
        
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        

        //create keys
        this.up = this.input.keyboard.addKey('W');
        this.down = this.input.keyboard.addKey('S');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //draw terrain
        my.sprite.terrain = this.add.tileSprite(50, game.config.height - 30, game.config.width*2, 60, "terrain");
        my.sprite.terrain.setDepth(-1);

        //create text
        let credits = "Developer\nYahir Prenger\n\nSprite and Sound Assets\nKenney\n\nMusic\nToiletPlungerStudios"
        my.text.credits = this.add.bitmapText(game.config.width/2,game.config.height/2-200,"kenneySquare", "Credits", 64).setOrigin(0.5);
        my.text.body = this.add.bitmapText(game.config.width/2,game.config.height/2,"kenneySquare", credits, 32).setOrigin(0.5);
        my.text.body.setCenterAlign();

        my.text.pressAnywhere = this.add.bitmapText(game.config.width/2,game.config.height/2 + 196,"kenneySquare", "Click anywhere to go back", 24).setOrigin(0.5);


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
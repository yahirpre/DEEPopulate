class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 50;
        this.bodyY = 500;

        this.speed = 200; //in pixels/sec
        this.spikeSpeed = 500;
        
    }

    // Use preload to load art and sound assets bwefore the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("diver", "alienBeige_swim1.png");
        this.load.image("spike", "spike_top.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        //create keys
        this.up = this.input.keyboard.addKey('W');
        this.down = this.input.keyboard.addKey('S');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //make spike group
        my.sprite.spikeGroup = this.add.group({
            defaultKey: "spike",
            maxSize: 5,
            }
        )

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
        
    }
w 
    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        //move up
        if(this.up.isDown){
            //move player sprite up
            if(my.sprite.player.y > 0){
                this.my.sprite.player.y -= this.speed * dt;
            }
        }

        //move down
        if(this.down.isDown){
            //move player sprite down
            if(my.sprite.player.y < game.config.height){
                    this.my.sprite.player.y += this.speed * dt;
            }
        }

        //shoot a spike
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            console.log("Space just down!");
            //fire spike
            // Get the first inactive spike, and make it active
            let spike = my.sprite.spikeGroup.getFirstDead();
            // spike will be null if there are no inactive (w  available) bullets
            if (spike != null) {
                spike.active = true;
                spike.visible = true;
                spike.x = my.sprite.player.x;
                spike.y = my.sprite.player.y;
            }
        }

        //make offscreen spikes inactive
        for (let spike of my.sprite.spikeGroup.getChildren()) {
            if (spike.x > game.config.width + spike.displayWidth/2) {
                spike.active = false;
                spike.visible = false;
            }
        }

        //move all spikes forward
        my.sprite.spikeGroup.incX(this.spikeSpeed*dt);

    }

}
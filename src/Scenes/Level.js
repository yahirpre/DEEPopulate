class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 50;
        this.bodyY = 500;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("diver", "alienBeige_swim1.png");
        this.load.image("spike", "spike_top.png");
        this.load.image("greenFish", "fishGreen.png");
        
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        //scene variables
        this.speed = 200; //in pixels/sec
        this.spikeSpeed = 500;
        this.fishSpeed = 50;

        this.spawnCooldown = 2; //in seconds
        this.spawnCooldownCounter = 0;

        this.score = 0;
        this.scoreBoost = 1;

        //wave variables
        this.waveMaxFish = 5; //max fish to spawn for each color
        this.activeGreenFish = 0; //the current amount sent in a wave (INCLUDES OFF SCREEN FISH)

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

        //make green fish group
        my.sprite.greenFishGroup = this.add.group({
            defaultKey: "greenFish",
            maxSize: 100,
            }
        )

        my.sprite.greenFishGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenFishGroup.defaultKey,
            repeat: my.sprite.greenFishGroup.maxSize-1
        });


        // Create the player sprite
        my.sprite.player = this.add.sprite(this.bodyX, this.bodyY, "diver");
        my.sprite.player.setScale(0.75);
        
    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        this.spawnCooldownCounter++;

        //check if spawnCooldown is finished
        if(this.spawnCooldownCounter > this.spawnCooldown / dt){

            //spawn fish unless all are active
            if(this.activeGreenFish < this.waveMaxFish){
                let greenFish = my.sprite.greenFishGroup.getFirstDead();
                if(greenFish != null){ //if all are active, greenFish will be null
                    greenFish.active = true;
                    greenFish.visible = true;
                    greenFish.x = game.config.width + greenFish.displayWidth/2; //set offscreen
                    greenFish.y = Math.random() * game.config.height;
                    this.activeGreenFish++;
                }
            }
            
            this.spawnCooldownCounter = 0;
        }

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
            //fire spike
            // Get the first inactive spike, and make it active
            let spike = my.sprite.spikeGroup.getFirstDead();
            // spike will be null if there are no inactive (available) bullets
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

        //make offscreen fish inactive
        for (let fish of my.sprite.greenFishGroup.getChildren()){
            if (fish.x < -(fish.displayWidth/2)){
                fish.active = false;
                fish.visible = false;
                //TODO: add to Fish Let Go
            }
        }

        //check fish-spike collision (naive approach)
        for(let spike of my.sprite.spikeGroup.getChildren()){
           for(let fish of my.sprite.greenFishGroup.getChildren()){
                if(fish.active && spike.active && this.collides(fish,spike)){
                    //set to inactive
                    spike.active = false;
                    spike.visible = false;
                    fish.active = false;
                    fish.visible = false;

                    //increase score
                    this.score += Math.floor((fish.x/10) * this.scoreBoost); //the further the fish is, the more points scored
                    console.log("Score: " + this.score);
                }
            }
        }

        //if all fish are inactive, new wave
        if(my.sprite.greenFishGroup.countActive(true) == 0
            && this.activeGreenFish == this.waveMaxFish){
            this.newWave();
        }

        //increment movement of groups
        my.sprite.spikeGroup.incX(this.spikeSpeed*dt);
        my.sprite.greenFishGroup.incX(-(this.fishSpeed*dt));

    }

    newWave(){
        console.log("New Wave!");
        //increase fish speed
        this.fishSpeed += 10;
        //increase scoreBoost
        this.scoreBoost += 0.1;
        //increase waveMaxFish
        this.waveMaxFish += 2;
        //reset active variables
        this.activeGreenFish = 0;

    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

}

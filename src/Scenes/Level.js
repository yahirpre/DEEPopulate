class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        //Create constants for the diver location
        this.bodyX = 50;
        this.bodyY = 400;
        
    }

    // Use preload to load art and sound assets before the wscene starts running.
    preload() {
        this.load.setPath("./assets/");
        this.load.image("diver", "alienBeige_swim1.png");
        this.load.image("spike", "spike_top.png");
        this.load.image("greenFish", "fishGreen.png");
        this.load.image("pinkFish", "fishPink.png");
        this.load.image("bubble", "bubble_b.png");
        this.load.image("terrain", "terrain_dirt_top_a_outline.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        
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
        this.fishSpeed = 50;

        this.spawnCooldown = 2; //in seconds
        this.spawnCooldownCounter = 0;
        this.bubbleCooldown = 5;
        this.bubbleCooldownCounter = 0;
        this.bubbleDamage = 20;

        this.health = 100;
        this.score = 0;
        this.scoreBoost = 1;

        //wave variables
        this.waveNum = 1;
        this.waveMaxFish = 3; //max fish to spawn for each color
        this.activeGreenFish = 0; //the current amount sent in a wave (INCLUDES OFF SCREEN FISH)
        this.activePinkFish = 0;
        this.fishLetGo = {
            green: 0,
            pink: 0
        };

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

        //make green fish group
        my.sprite.greenFishGroup = this.add.group({
            defaultKey: "greenFish",
            maxSize: 50,
            }
        );

        my.sprite.greenFishGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.greenFishGroup.defaultKey,
            repeat: my.sprite.greenFishGroup.maxSize-1
        });

        //make greenFish bubble group
        my.sprite.bubbleGroup = this.add.group({
            defaultKey: "bubble",
            maxSize: 50,
            }
        );

        my.sprite.bubbleGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.bubbleGroup.defaultKey,
            repeat: my.sprite.bubbleGroup.maxSize-1
        });

        //make pink fish group
        my.sprite.pinkFishGroup = this.add.group({
            defaultKey: "pinkFish",
            maxSize: 50,
            });

        my.sprite.pinkFishGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.pinkFishGroup.defaultKey,
            repeat: my.sprite.pinkFishGroup.maxSize-1
        });
        
        // Create the player sprite
        my.sprite.player = this.add.sprite(this.bodyX, this.bodyY, "diver");
        my.sprite.player.setScale(0.75);

        //create texts
        my.text.score = this.add.bitmapText(10,0,"rocketSquare", "SCORE: " + this.score);
        my.text.wave = this.add.bitmapText(10,25,"rocketSquare", "WAVE: " + this.waveNum);
        my.text.wave.setFontSize(20);
        my.text.FLG = this.add.bitmapText(10, game.config.height - 80 ,"rocketSquare", "Fish Let Go:");
        my.text.FLG.setFontSize(20);
        //create fishLetGo array to hold visual feedback of the current FLG
        my.sprite.FLGArray = [];
        //first two sprites are green fish
        my.sprite.FLGArray[0] = this.add.sprite(25, game.config.height - 50, "greenFish");
        my.sprite.FLGArray[1] = this.add.sprite(75, game.config.height - 50, "greenFish");
        //next two are pink fish
        my.sprite.FLGArray[2] = this.add.sprite(125, game.config.height - 50, "pinkFish");
        my.sprite.FLGArray[3] = this.add.sprite(175, game.config.height - 50, "pinkFish");

        //set scale, visibility, and flipX and all the sprite in FLGArray
        for(let sprite of my.sprite.FLGArray){
            sprite.scale = 0.5;
            sprite.flipX = true;
            sprite.visible = false;
        }

    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability
        let dt = delta/1000;

        if(this.running){
            this.spawnCooldownCounter++;
            this.bubbleCooldownCounter++;

            //check if spawnCooldown is finished
            if(this.spawnCooldownCounter > this.spawnCooldown / dt){
                //spawn fish unless all are active
                if(this.activeGreenFish < this.waveMaxFish){
                    let greenFish = my.sprite.greenFishGroup.getFirstDead();
                    if(greenFish != null){ //if all are active, greenFish will be null
                        console.log("send green fish");
                        greenFish.active = true;
                        greenFish.visible = true;
                        greenFish.x = game.config.width + greenFish.displayWidth/2; //set offscreen
                        greenFish.y = Phaser.Math.Between(this.upperBound, this.lowerBound);
                        this.activeGreenFish++;
                    }
                }
                if(this.activePinkFish < this.waveMaxFish){
                    let pinkFish = my.sprite.pinkFishGroup.getFirstDead();  
                    if(pinkFish != null){ //if all are active, Fish will be null
                        console.log("send pink fish");
                        pinkFish.active = true;
                        pinkFish.visible = true;
                        pinkFish.x = game.config.width + pinkFish.displayWidth/2; //set offscreen
                        pinkFish.y = Phaser.Math.Between(this.upperBound, this.lowerBound - 125);
                        this.activePinkFish++;
                        //add bobbing tweens
                        this.pinkFishTween = this.tweens.add({
                            targets: pinkFish,
                            ease: 'Sine.easeInOut',
                            y: '+=100',
                            duration: 2000,
                            repeat: -1,
                            delay: this.tweens.stagger(500),
                            yoyo: true
                        });                
                    }
                }
                
                this.spawnCooldownCounter = 0;
            }

            //shoot bubbles if cooldown is up
            if(this.bubbleCooldownCounter > this.bubbleCooldown/dt){
                console.log("shoot bubbles!");
                //send bubbles from each active green fish
                for(let fish of my.sprite.greenFishGroup.getChildren().filter(child => child.active)){
                    let bubble = my.sprite.bubbleGroup.getFirstDead();
                    if(bubble != null){
                        bubble.active = true;
                        bubble.visible = true;
                        bubble.x = fish.x - fish.displayWidth/2;
                        bubble.y = fish.y;
                    }
                }
                this.bubbleCooldownCounter = 0;
            }

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

            //make offscreen bubbles inactive
            for (let bubble of my.sprite.bubbleGroup.getChildren()) {
                if (bubble.x > game.config.width + bubble.displayWidth/2) {
                    bubble.active = false;
                    bubble.visible = false;
                }
            }

            //make offscreen fish inactive
            for (let fish of my.sprite.greenFishGroup.getChildren()){
                if (fish.active && fish.x < -(fish.displayWidth/2)){
                    fish.active = false;
                    fish.visible = false;
                    //add to Fish Let Go
                    this.fishLetGo.green++;
                    //display new FLG
                    my.sprite.FLGArray[this.fishLetGo.green - 1].visible = true;
                }
            }
            for (let fish of my.sprite.pinkFishGroup.getChildren()){
                if (fish.active && fish.x < -(fish.displayWidth/2)){
                    fish.active = false;
                    fish.visible = false;
                    //add to Fish Let Go
                    this.fishLetGo.pink++;
                    my.sprite.FLGArray[2 + this.fishLetGo.green - 1].visible = true;
                }
            }

            //check fish-spike and bubble-spike collision (naive approach)
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
                        }
                    }
                for(let fish of my.sprite.pinkFishGroup.getChildren()){
                    if(fish.active && spike.active && this.collides(fish,spike)){
                        //set to inactive
                        spike.active = false;
                        spike.visible = false;
                        fish.active = false;
                        fish.visible = false;


                        //increase score
                        this.score += Math.floor((fish.x/10) * this.scoreBoost); //the further the fish is, the more points scored
                    }
                }
                for(let bubble of my.sprite.bubbleGroup.getChildren()){
                    if(spike.active && bubble.active && this.collides(spike,bubble)){
                        //set to inactive
                        bubble.active = false;
                        bubble.visible = false;
                        spike.active = false;
                        spike.visible = false;
                    }
                }
            }

            //check player-bubble collision
            for(let bubble of my.sprite.bubbleGroup.getChildren()){
                if(bubble.active && this.collides(my.sprite.player, bubble)){
                    //decrease healthw
                    console.log("Player damaged!");
                    this.health -= this.bubbleDamage;

                    //make bubble inactive
                    bubble.active = false;
                    bubble.visible = false;
                }
            }

            //increment movement of groups
            my.sprite.spikeGroup.incX(this.spikeSpeed*dt);
            my.sprite.greenFishGroup.incX(-(this.fishSpeed*dt));
            my.sprite.pinkFishGroup.incX(-(this.fishSpeed*dt));
            my.sprite.bubbleGroup.incX(-(this.fishSpeed*3*dt));

            //draw score text
            my.text.score.setText("Score: " + this.score);

            //draw health bar
            this.drawHealthBar();
    
            //if all fish are inactive, new wave
            if(this.waveComplete()){
                this.newWave();
            }

            //if more than 2 fishLetGo of one specie OR player health <= 0, end game
            for(let fishKey in this.fishLetGo){
                if(this.fishLetGo[fishKey] >= 2 || this.health <= 0){
                    //end game
                    console.log("Game Over!");
                    this.running = false;
                    this.scene.restart();
                }
            }

        }
    }

    newWave(){
        console.log("New Wave!");
        //update waveNum + text
        this.waveNum++;
        this.my.text.wave.setText("WAVE: " + this.waveNum);
        //increase fish speed
        this.fishSpeed *= 1.01;
        //increase scoreBoost
        this.scoreBoost += 0.1;
        //increase waveMaxFish
        this.waveMaxFish += 1;
        //decrease spawnCooldown
        this.spawnCooldown *= 0.99;
        //reset variables
        this.activeGreenFish = 0;
        this.activePinkFish = 0;
        this.playerHealth = 100;
        //make FLGArray sprites invisible
        for(let sprite of this.my.sprite.FLGArray) sprite.visible = false;
        //reset fishLetGo
        for(let fishKey in this.fishLetGo) this.fishLetGo[fishKey] = 0;
        //stop the tweening of the active fish
        this.tweens.killTweensOf(this.my.sprite.pinkFishGroup.getChildren());

    }

    waveComplete(){
        //wave is complete if all fish group members are inactive and active fish match waveMaxFish
        let my = this.my;
        return my.sprite.greenFishGroup.countActive(true) == 0
            && my.sprite.pinkFishGroup.countActive(true) == 0
            && this.activeGreenFish == this.waveMaxFish
            && this.activePinkFish == this.waveMaxFish;
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    drawHealthBar(){
        this.graphics.clear();

        this.graphics.fillStyle(0x00FF00, 1); //fill color
        this.graphics.lineStyle(3, 0x000000, 1);  //stroke color

        let rectWidth = 200;
        let rectHeight = 20;

        this.graphics.fillRectShape({
            x: 10,
            y: game.config.height - rectHeight - 10,
            width: rectWidth * (this.health/100),
            height: rectHeight
        });
        this.graphics.strokeRectShape({
            x: 10,
            y: game.config.height - rectHeight - 10,
            width: rectWidth,
            height: rectHeight
        });
    }

}

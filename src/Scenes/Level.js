class Level extends Phaser.Scene {
    constructor() {
        super("levelScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 50;
        this.bodyY = 500;

        this.speed = 200; //in pixels/sec
        this.projSpeed = 800;
        
    }

    // Use preload to load art and sound assets before the scene starts running.
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

        //create background color

        // Create the player sprite
        my.sprite.player = this.add.sprite(this.bodyX, this.bodyY, "diver");

        //create projectile sprite
        my.sprite.projectile = this.add.sprite(this.bodyX, this.bodyY, "spike");
        my.sprite.projectile.rotation = 90;
        my.sprite.projectile.visible = false;
        
    }

    update(time, delta) {
        let my = this.my;    // create an alias to this.my for readability

        //polling
        if(this.up.isDown){
            //move all player sprites left
            if(my.sprite.player.y > 0){
                this.my.sprite.player.y -= this.speed * (delta/1000);
            }
        }
        if(this.down.isDown){
            //move all player sprites right
            if(my.sprite.player.y < game.config.height){
                    this.my.sprite.player.y += this.speed * (delta/1000);
            }
        }
        if(Phaser.Input.Keyboard.JustDown(this.spaceKey)){
            //fire spike
            my.sprite.projectile.x = my.sprite.player.x;
            my.sprite.projectile.y = my.sprite.player.y;
            my.sprite.projectile.visible = true;
        }

        my.sprite.projectile.x += this.projSpeed * (delta/1000);

    }

}
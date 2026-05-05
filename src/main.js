
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [Start,Credits,Level],
    backgroundColor: 'rgb(138, 184, 219)',
}

const game = new Phaser.Game(config);
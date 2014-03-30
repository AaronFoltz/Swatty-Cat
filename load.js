var load_state = {
    preload: function() {
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('bird', 'assets/bird.png');
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.audio('jump', 'assets/jump.wav');
        this.game.load.image('cat', 'assets/cat.png');
        this.game.load.image('paw', 'assets/paw.png');
        this.game.load.image('grumpycat', 'assets/grumpycat.png');

    },

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        this.game.state.start('play');
    }
};
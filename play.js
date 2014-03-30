// Creates a new 'main' state that wil contain the game
var play_state = {
    create: function() {
        // Cat
        this.cat = this.game.add.sprite(100, 235, 'cat');

        // Cat's Paw
        this.paw = this.game.add.sprite(310, 350, 'paw');
        this.paw.angle = 20;

        // Add gravity to the bird to make it fall
        // this.bird.body.gravity.y = 1000;

        // Anchor point for the animation
        // this.bird.anchor.setTo(-0.2, 0.5);

        // this.birds = game.add.group();
        // this.birds.createMultiple(20, 'bird');

        // Call the 'jump' function when the spacekey is hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.swat, this);

        // timer for the birds
        this.timer = this.game.time.events.loop(1500, this.send_bird, this);

        // score
        score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);
    },

    update: function() {
		// Function called 60 times per second

        this.game.physics.overlap(this.paw, this.birds, this.hit_bird, null, this);

        // if (this.bird.angle < 20)
        //     this.bird.angle += 1;
    },

    // Swat the flappy birds
    swat: function() {
        if (this.bird.alive == false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;

        // Rotate upward when jumping
        this.game.add.tween(this.bird).to({angle: -20}, 100).start();

    },

    // Restart the game
    restart_game: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    add_one_bird: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Kill the pipe when it's no longer visible
        pipe.outOfBoundsKill = true;
    },

    send_bird: function() {
        // Random entry point for the bird
        var entryY = return Math.random() * (300 - 100) + 100;

        score += 1;
        this.label_score.content = score;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.add_one_bird(400, i*60+10);
    },

    hit_bird: function() {
        // If the bird has already hit a pipe, we have nothing to do
        if (this.bird.alive == false)
            return;

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        this.game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },
};
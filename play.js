// Creates a new 'main' state that wil contain the game
var play_state = {
    create: function() {
        // Cat
        this.cat = this.game.add.sprite(100, 235, 'cat');

        // Cat's Paw
        this.paw = this.game.add.sprite(310, 350, 'paw');
        this.paw.angle = 20;

        this.birds = game.add.group();
        this.birds.createMultiple(20, 'bird');

        this.birds.forEach(function(bird){
            bird.body.totalY = 0;
        });

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

        console.log("ALIVE: " + this.birds.countLiving());
        this.birds.forEachAlive(function(bird) {
            console.log(bird.body.deltaY());
            console.log(bird.body.totalY);

            // Capture movement since last step
            bird.body.totalY += bird.body.deltaY();

            // It hasn't started falling
            if (bird.body.totalY == 0)
            {
                if (bird.body.x > Math.random() * (200 - 0) + 0)
                {
                        bird.body.gravity.y = 1000;
                }
            }
            // It has started falling, should we make it jump back up?
            else
            {
                if (bird.body.deltaY() > Math.random() * (10 - 5) + 5)
                {
                        bird.body.velocity.y = -350;
                }
            }

        }, this);



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
        // Get the first dead bird of our group
        var bird = this.birds.getFirstDead();

        // Set the new position of the pipe
        bird.reset(x, y);

        if (bird.angle < 20)
            bird.angle += 1;

        // Add velocity to the pipe to make it move left
        bird.body.velocity.x = 200;

        // Add gravity to the bird to make it fall
        //

        // Anchor point for the animation
        bird.anchor.setTo(-0.2, 0.5);

        // Kill the pipe when it's no longer visible
        bird.outOfBoundsKill = true;
    },

    send_bird: function() {
        this.add_one_bird(0, Math.random() * (250 - 100) + 100);
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
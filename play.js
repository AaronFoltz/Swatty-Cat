// Creates a new 'main' state that wil contain the game
var play_state = {
    create: function() {
        // Cat
        this.grumpycat = this.game.add.sprite((game.width / 2), 0, 'grumpycat');

        this.birds = game.add.group();
        this.birds.createMultiple(20, 'bird');

        this.birds.forEach(function(bird){
            bird.body.totalY = 0;
        });

        // Bullets
        this.bullets = game.add.group();
        this.bullets.createMultiple(500, "bullet");

        // Call the 'jump' function when the spacekey is hit
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.fire, this);

        // timer for the birds
        this.timer = this.game.time.events.loop(1500, this.sendBird, this);

        // score
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);
    },

    update: function() {
		// Function called 60 times per second

        this.game.physics.overlap(this.bullets, this.birds, this.hitBird, null, this);

        // Handle updates to the birds
        this.updateBirds();

    },

    // Swat the flappy birds
    swat: function() {
        if (this.bird.alive == false)
            return;

        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {
        // Remove the timer
        this.game.time.events.remove(this.timer);

        // Start the 'main' state, which restarts the game
        this.game.state.start('menu');
    },

    addOneBird: function(x, y) {
        // Get the first dead bird of our group
        var bird = this.birds.getFirstDead();

        // Set the new position of the bird
        bird.reset(x, y);

        if (bird.angle < 20)
            bird.angle += 1;

        // Add velocity to the pipe to make it move left
        bird.body.velocity.x = 200;

        // Add gravity to the bird to make it fall

        // Anchor point for the animation
        bird.anchor.setTo(-0.2, 0.5);

        // Kill the pipe when it's no longer visible
        bird.outOfBoundsKill = true;
    },

    sendBird: function() {
        this.addOneBird(0, Math.random() * (250 - 125) + 125);
    },

    hitBird: function(bullet, bird) {
        // If the bird has already hit a pipe, we have nothing to do
        if (bird.alive == false)
            return;

        // Set the alive property of the bird to false
        bird.alive = false;

        // Kill the bullet, don't let it keep going.
        bullet.kill();
        bullet.alive = false;

        // Stop horizontal movement
        bird.body.velocity.x = 0;

        // Make it fall
        bird.body.velocity.y = 1000;

        // Increment score
        this.score += 1;
        this.label_score.content = this.score;
    },

    updateBirds: function() {
        this.birds.forEachAlive(function(bird) {
            // Capture movement since last step
            bird.body.totalY += bird.body.deltaY();

            if (bird.angle < 20)
            {
                bird.angle += 1;
            }

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

                        // Rotate upward when jumping
                        this.game.add.tween(bird).to({angle: -20}, 100).start();
                }
            }

        }, this);
    },

    fire: function() {
        // increase the shotDelayTime based on the game's time delta
        // shotDelayTime += game.time.elapsed;

        // If the delay is greater than 200 create a bullet
        // if(shotDelayTime > shotDelay) {
        this.createBullet();
            // reset the shotDelayTime
            // shotDelayTime = 0;
        // }
    },

    createBullet: function() {
        // Get new instance from the bullet group via recycle
        var bullet1 = this.bullets.getRandom(),
            bullet2 = this.bullets.getRandom();

        bullet1.reset(this.grumpycat.x + (this.grumpycat.width / 2.5), this.grumpycat.y + 25);
        bullet2.reset(this.grumpycat.x + (this.grumpycat.width / 1.5), this.grumpycat.y + 25);
        bullet1.body.velocity.y = 200;
        bullet2.body.velocity.y = 200;

        // Kill the pipe when it's no longer visible
        bullet1.outOfBoundsKill = true;
        bullet2.outOfBoundsKill = true;
    }
};
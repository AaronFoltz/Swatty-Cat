var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;

// Initialize Phaser
var game = new Phaser.Game(w, h, Phaser.AUTO, 'game_div');

// Stage
game.stage = new Phaser.Stage(game, w, h);
game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
game.stage.scale.setShowAll();

// Our 'score' global variable
var score = 0,
    shotDelayTime = 0,
    shotDelay = 200;

// Define all the states
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);

// Start with the 'load' state
game.state.start('load');
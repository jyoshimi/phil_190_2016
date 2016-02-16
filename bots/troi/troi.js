var troi = new Bot(250, 250, 'troi', 'bots/troi/umbreon_2.0.png');
troi.increment.angle = 50;
troi.body.speed = 100;



troi.init = function() {
    this.body = this.sprite.body; // Todo:  a way to automate this?
    troi.body.rotation = 100; // Initial Angle
    troi.body.speed = 100; // Initial Speed
    // Do something every n seconds.
    // game.time.events.loop(Phaser.Timer.SECOND * 1, troi.timedEvend, this);
}
troi.update = function() {
        if (Math.random() < .1) {
            troi.increment.angle += .5;
        } else {
            troi.increment.angle -= 2;
        }
        if (Math.random() < 0.1) {
            if (Math.random() < 0.05) {
                troi.body.speed = 10;
            } else {
                troi.body.speed = 100;
            }
            troi.basicUpdate();

        };

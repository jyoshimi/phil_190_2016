//
// INIT
//

var sharAI = new Bot(2950, 75, 'sharAI', 'js/bots/sharAI/sharAI.png');
sharAI.THRESHOLD_MULT = 1.5;
sharAI.DRIVE_CAP = 600;
sharAI.angleFromTarget = 0;
sharAI.inputEnabled = true;
sharAI.botRandom = -1;
sharAI.ear = "";

/**
 * Initializes sharAI
 * @return {void}
 */
sharAI.init = function() {
    this.body = this.sprite.body;
    sharAI.body.rotation = 100;
    sharAI.body.speed = 100;

    game.time.events.loop(Phaser.Timer.SECOND * 1, sharAI.updatePerSec, this);

    sharAI.giggle = game.add.audio('doozer');
}

/**
 * A customized version of Bot.pursue
 * @param  {Game Object} target The target to pursue
 * @param  {Number} speed The speed to chase the target at
 * @return {void}
 */
sharAI.pursue = function(target, speed) {
    sharAI.angleFromTarget = game.physics.arcade.angleBetween(sharAI.sprite, target.sprite);
    sharAI.sprite.rotation = sharAI.angleFromTarget;
    game.physics.arcade.velocityFromRotation(
        sharAI.angleFromTarget,
        speed,
        sharAI.sprite.body.velocity);
}

//
// DRIVES
//

sharAI.lethargy = {
    value: 0,
    threshold: 420,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    /**
     * Prints lethargy value to string
     * @return {void}
     */
    toString: function() {
        let lethargyBar = "Lethargy:\t\t";
        let lethargyAmount = Math.floor(sharAI.lethargy.value / 60);
        let iCount = 0;
        for (i = 0; i < lethargyAmount; i++) {
            lethargyBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            lethargyBar += "░"
        }
        return lethargyBar;
    },
    /**
     * Returns current need status to sharAI.emotions.adjustTransitions()
     * @return {string}
     */
    getMood: function() {
        if (this.value < this.satedPoint) {
            return "Calm"
        } else if (this.value > this.criticalPoint) {
            return "Anxious"
        } else {
            return "Content"
        }
    }
}

sharAI.exhaustion = {
    value: 0,
    threshold: 480,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    /**
     * Prints exhaustion value to string
     * @return {void}
     */
    toString: function() {
        let exhaustionBar = "Exhaustion:\t";
        let exhaustionAmount = Math.floor(sharAI.exhaustion.value / 60);
        let iCount = 0;
        for (i = 0; i < exhaustionAmount; i++) {
            exhaustionBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - exhaustionAmount); i++) {
            exhaustionBar += "░"
        }
        return exhaustionBar;
    },
    /**
     * Returns current need status to sharAI.emotions.adjustTransitions()
     * @return {string}
     */
    getMood: function() {
        if (this.value < this.satedPoint) {
            return "Calm"
        } else if (this.value > this.criticalPoint) {
            return "Anxious"
        } else {
            return "Content"
        }
    }
}

sharAI.hunger = {
    value: 0,
    threshold: 300,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold / sharAI.THRESHOLD_MULT,
    /**
     * Prints hunger value to string
     * @return {void}
     */
    toString: function() {
        let hungerBar = "Hunger:\t\t";
        let hungerAmount = Math.floor(sharAI.hunger.value / 60);
        let iCount = 0;
        for (i = 0; i < hungerAmount; i++) {
            hungerBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            hungerBar += "░"
        }
        return hungerBar;
    },
    /**
     * Returns current need status to sharAI.emotions.adjusTransitions()
     * @return {string}
     */
    getMood: function() {
        if (this.value < this.satedPoint) {
            return "Calm"
        } else if (this.value > this.criticalPoint) {
            return "Anxious"
        } else {
            return "Content"
        }
    }
}

sharAI.boredom = {
    value: 0,
    threshold: 180,
    criticalPoint: this.threshold * sharAI.THRESHOLD_MULT,
    satedPoint: this.threshold * sharAI.THRESHOLD_MULT,
    /**
     * Runs when sharAI is clicked on (in the future, that is)
     * @return {void}
     */
    tickle: function() {
        sharAI.boredom.value -= 100;
        sharAI.giggle.play();
    },
    /**
     * Prints boredom value to string
     * @return {void}
     */
    toString: function() {
        let boredomBar = "Boredom:\t\t";
        let boredomAmount = Math.floor(sharAI.boredom.value / 60);
        let iCount = 0;
        for (i = 0; i < boredomAmount; i++) {
            boredomBar += "▓"
            iCount++;
        }
        for (i = 0; i < (10 - iCount); i++) {
            boredomBar += "░"
        }
        return boredomBar;
    },
    /**
     * Returns current need status to sharAI.emotions.adjustTransitions()
     * @return {string}
     */
    getMood: function() {
        if (this.value < this.satedPoint) {
            return "Calm"
        } else if (this.value > this.criticalPoint) {
            return "Anxious"
        } else {
            return "Content"
        }
    }
}

sharAI.needArray = [sharAI.lethargy, sharAI.exhaustion, sharAI.hunger, sharAI.boredom]

//
// MOVEMENT STATES
//

sharAI.walk = {
    name: "Walk",
    stateText: "sharAI is moving around",
    /**
     * Runs during update when walk is current movement state
     * @return {void}
     */
    update: function() {
        Motions.walking.apply(sharAI);
    },
    /**
     * Runs every second when walk is current movement state
     * @return {void}
     */
    adjustNeeds: function() {
        if (sharAI.lethargy.value < sharAI.DRIVE_CAP) {
            sharAI.lethargy.value++;
        }
        if (sharAI.exhaustion.value < sharAI.DRIVE_CAP) {
            sharAI.exhaustion.value++;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value < sharAI.DRIVE_CAP) {
            sharAI.boredom.value++;
        }
    }
}

sharAI.stop = {
    name: "Stop",
    stateText: "sharAI is looking around.",
    /**
     * Runs during update when stop is current movement state
     * @return {void}
     */
    update: function() {
        Motions.stop.apply(sharAI);
    },
    /**
     * Runs every second when stop is current movement state
     * @return {void}
     */
    adjustNeeds: function() {
        if (sharAI.lethargy.value < sharAI.DRIVE_CAP) {
            sharAI.lethargy.value++;
        }
        if (sharAI.exhaustion.value > 0) {
            sharAI.exhaustion.value--;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value < sharAI.DRIVE_CAP) {
            sharAI.boredom.value++;
        }
    }
}

sharAI.nap = {
    name: "Nap",
    stateText: "sharAI is napping",
    /**
     * Runs during update when nap is current movement state
     * @return {void}
     */
    update: function() {
        Motions.still.apply(sharAI);
    },
    /**
     * Runs every second when nap is current movement state
     * @return {void}
     */
    adjustNeeds: function() {
        if (sharAI.lethargy.value > 0) {
            sharAI.lethargy.value--;
        }
        if (sharAI.exhaustion.value > 0) {
            sharAI.exhaustion.value--;
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value > 0) {
            sharAI.boredom.value--;
        }
    }
}

sharAI.hunt = {
    name: "Hunt",
    stateText: "sharAI is hunting ",
    gotTarget: false,
    /**
     * Runs during update when hunt is current movement state
     * @return {void}
     */
    update: function() {
        // Get a bot to target
        if (sharAI.hunt.gotTarget == false) {
            do {
                sharAI.botRandom = Math.floor(sharAI.getRandom(0, bots.length - 1)); // Get random bot
            } while (sharAI.botRandom == 1) // The while statement prevents sharAI from hunting themself

            sharAI.hunt.stateText = "sharAI is hunting " + bots[sharAI.botRandom].name;
            sharAI.hunt.gotTarget = true;
        }

        // Then pursue the target
        sharAI.pursue(bots[sharAI.botRandom], 200);
    },
    /**
     * Runs every second when hunt is current movement state
     * @return {void}
     */
    adjustNeeds: function() {
        if (sharAI.lethargy.value < sharAI.DRIVE_CAP) {
            sharAI.lethargy.value++;
        }
        if (sharAI.exhaustion.value < sharAI.DRIVE_CAP) {
            sharAI.exhaustion.value += 2;
            sharAI.exhaustion.value = Math.min(sharAI.exhaustion.value, sharAI.DRIVE_CAP);
        }
        if (sharAI.hunger.value < sharAI.DRIVE_CAP) {
            sharAI.hunger.value++;
        }
        if (sharAI.boredom.value > 0) {
            sharAI.boredom.value--;
        }
    }
}

sharAI.movement = sharAI.walk;

//
// NEED STATES
//

sharAI.satisfied = {
    name: "Satisfied",
    /**
     * Controls the current need state
     * @return {void}
     */
    getNeedMode: function() {
        if (sharAI.lethargy.value > sharAI.lethargy.threshold) { // First checks to see if sharAI is sleepy
            return sharAI.sleepy;
        } else if (sharAI.hunger.value > sharAI.hunger.threshold) {
            return sharAI.hungry
        } else if (sharAI.exhaustion.value > sharAI.exhaustion.threshold) { // Then checks to see if sharAI is tired
            return sharAI.tired;
        } else { // If sharAI is none of the above, then they are fine
            return sharAI.satisfied;
        }
    },
    /**
     * Sets the current movement mode to walk while need state is satisfied
     * @return {void}
     */
    getMovementMode: function() {
        return sharAI.walk;
    },
}

sharAI.sleepy = {
    name: "Sleepy",
    /**
     * Controls the current need state
     * @return {void}
     */
    getNeedMode: function() {
        if (sharAI.lethargy.value < sharAI.lethargy.satedPoint) { // If sharAI is not sleepy anymore and ...
            if (sharAI.exhaustion.value >= sharAI.exhaustion.threshold) { // ...sharAI is tired, switch to the tired state
                return sharAI.tired;
            }
            return sharAI.satisfied; //...sharAI is not tired, then sharAI is satisfied
        } else { // Else, sharAI is still sleepy
            return sharAI.sleepy;
        }
    },
    /**
     * Sets the current movement mode to nap while need state is sleepy
     * @return {void}
     */
    getMovementMode: function() {
        return sharAI.nap;
    }
}

sharAI.tired = {
    name: "Tired",
    /**
     * Controls the current need state
     * @return {void}
     */
    getNeedMode: function() {
        if (sharAI.lethargy.value >= sharAI.lethargy.criticalPoint) { // If sharAI is going to pass out from drowsiness, let them sleep
            return sharAI.sleepy;
        } else if (sharAI.exhaustion.value < sharAI.exhaustion.satedPoint) { // If sharAI is not feeling tired anymore, then they feel fine
            return sharAI.satisfied;
        } else { // Otherwise, sharAI still feels tired.
            return sharAI.tired
        }
    },
    /**
     * Sets the current movement mode to stop while need state is tired
     * @return {void}
     */
    getMovementMode: function() {
        return sharAI.stop;
    }
}

sharAI.hungry = {
    name: "Hungry",
    /**
     * Controls the current need state
     * @return {void}
     */
    getNeedMode: function() {
        if (sharAI.lethargy.value >= sharAI.lethargy.criticalPoint) {
            return sharAI.sleepy
        } else if (sharAI.exhaustion.value >= sharAI.exhaustion.criticalPoint) {
            return sharAI.tired;
        } else if (sharAI.hunger.value < sharAI.hunger.satedPoint) {
            return sharAI.satisfied;
        } else {
            return sharAI.hungry;
        }
    },
    /**
     * Sets the current movement mode to hunt while need state is hungry
     * @return {void}
     */
    getMovementMode: function() {
        return sharAI.hunt;
    }
}

sharAI.need = sharAI.satisfied;

//
// EMOTIONS
//

sharAI.emotions = new MarkovProcess("calm");
sharAI.emotions.add("calm", [
    ["content", "anxious", "calm"],
    [.1, .1, .8]
]);
sharAI.emotions.add("content", [
    ["content", "anxious", "calm"],
    [.8, .1, .1]
]);
sharAI.emotions.add("anxious", [
    ["content", "anxious", "calm"],
    [.1, .8, .1]
]);
sharAI.emotions.stateText = " and is feeling " + sharAI.emotions.current

/**
 * Changes transitions according to what sharAI's current needs are.
 * @param  {String Array} needArray An array of needs
 * @return {void}
 */
sharAI.emotions.adjustTransitions = function(needArray) {
    let currentNeedsArray = [];

    for (i = 0; i < needArray.length; i++) {
        currentNeedsArray[i] = needArray[i].getMood();
    }

    let fraction = .5 / needArray.length;
    let calmCount = 0;
    let contentCount = 0;
    let anxiousCount = 0;

    for (i = 0; i < currentNeedsArray.length; i++) {
        if (currentNeedsArray[i] == "Calm") {
            calmCount += fraction;
        } else if (currentNeedsArray[i] == "Content") {
            contentCount += fraction;
        } else {
            anxiousCount += fraction;
        }
    }

    this.changeTransitions("calm", [contentCount + .1, anxiousCount + .1, calmCount + .3]);
    this.changeTransitions("content", [contentCount + .3, anxiousCount + .1, calmCount + .1]);
    this.changeTransitions("anxious", [contentCount + .1, anxiousCount + .3, calmCount + .1]);
}

//
// THE OTHER STUFF
//

/**
 * Compiles all of the toStrings and other assorted things together
 * @return {String}
 */
sharAI.getStatus = function() {
    sharAI.textBox = sharAI.hunger.toString() + "\n" + sharAI.lethargy.toString() + "\n" + sharAI.exhaustion.toString() + "\n" + sharAI.boredom.toString() + "\n\n" + sharAI.movement.stateText + sharAI.emotions.stateText + "\n" + sharAI.ear;
    return sharAI.textBox;
}

/**
 * Override of basicUpdate
 * @return {void}
 */
sharAI.basicUpdate = function() {
    if (sharAI.movement != sharAI.hunt) {
        game.physics.arcade.velocityFromRotation(
            sharAI.sprite.rotation,
            sharAI.sprite.body.speed,
            sharAI.sprite.body.velocity);
    }
}

/**
 * main() equivalent
 * @return {void}
 */
sharAI.update = function() {
    sharAI.movement = sharAI.need.getMovementMode();
    sharAI.movement.update();
    sharAI.basicUpdate();
    sharAI.genericUpdate();
}

/**
 * Runs these methods every second
 * @return {void}
 */
sharAI.updatePerSec = function() {
    sharAI.movement.adjustNeeds();
    sharAI.need = sharAI.need.getNeedMode();

    sharAI.emotions.adjustTransitions(sharAI.needArray);
    sharAI.emotions.update();
    sharAI.emotions.stateText = " and is feeling " + sharAI.emotions.current
}

/**
 * Override of Bot.collision. sharAI will bite any objects they run into that are bots
 * @param  {Game Object} object An object in the world
 * @return {void}
 */
sharAI.collision = function(object) {
    if (object instanceof Bot && object != sharAI) {
        if (sharAI.hunger.value > sharAI.hunger.satedPoint) {
            sharAI.hunt.bite(object, 25);
        }
        else if (sharAI.boredom.value > sharAI.boredom.satedPoint) {
            sharAI.highFive(object);
            sharAI.speak(object, "How's it hanging, " + object.name + "?");
        }
        else {
        	sharAI.speak(object, "Hello lunch");
        }
    }
}

/**
 * Override of Bot.highFived
 * @param  {Bot} botWhoHighFivedMe The bot that high-fived sharAI
 * @return {void}
 */
sharAI.highFived = function(botWhoHighFivedMe) {
    sharAI.boredom.value -= 5;
}

/**
 * Override of Bot.gotBit
 * @param  {Bot} botWhoAttackedMe The bot that attacked sharAI
 * @param  {Number} damage The amount of damage dealt to sharAI
 * @return {void}
 */
sharAI.gotBit = function(botWhoAttackedMe, damage) {
    sharAI.speak(botWhoAttackedMe, "Ow! You'll pay for that, " + botWhoAttackedMe.name + "!");
    sharAI.bite(botWhoAttackedMe, 25, 25);
}

/**
 * Override of Bot.hear
 * @param  {Bot} botWhoSpokeToMe The bot who spoke to sharAI
 * @param  {String} whatTheySaid What the bot said to sharAI
 * @return {void}
 */
sharAI.hear = function(botWhoSpokeToMe, whatTheySaid) {
    sharAI.ear = botWhoSpokeToMe.name + " says: " + whatTheySaid;
}

/**
 * Override of Bot.bite
 * @param  {Bot} botToAttack The bot to bite
 * @param  {Number} damage      Strength of bite
 * @return {void}
 */
sharAI.bite = function(botToAttack, damage) {
    if (botToAttack instanceof Bot) {
        if (game.physics.arcade.distanceBetween(sharAI.sprite, botToAttack.sprite) < 100) {
            sharAI.hunger.value -= 300;
        	sharAI.hunger.value = Math.max(0, sharAI.hunger.value)
        	sounds.chomp.play();
        	botToAttack.gotBit(this, damage);
        	sharAI.speak(botToAttack, "Thanks for the meal, " + botToAttack.name + "!");
        	sharAI.hunt.gotTarget = false;
    	}
	}
};

/**
 * Override of Bot.antler_caressed
 * @param  {Bot} botWhoCaressedMe The bot that caressed me
 * @param  {String} message          The message sent by the 
 * @return {void}                  
 */
sharAI.antler_caressed = function(botWhoCaressedMe, message) {
    sharAI.speak(botWhoCaressedMe, "Hey! Don't rub your horns on me, " + botWhoCaressedMe.name + "!");
    sharAI.hear(botWhoCaressedMe, message);
}

/**
 * Override of Bot.gotBow
 * @param  {Bot} botWhoBowed The bot that bowed to me
 * @return {void}             
 */
sharAI.gotBow = function(botWhoBowed) {
    sharAI.speak(botWhoBowed, "What are you bending your body for, " + botWhoBowed.name + "?");
}

/**
 * Override of Bot.gotLicked
 * @param  {Bot} botWhoLickedMe The bot that licked me
 * @return {void}                
 */
sharAI.gotLicked = function(botWhoLickedMe) {
    sharAI.speak(botWhoLickedMe, "Haha! My turn, " + botWhoLickedMe.name + "!");
    sharAI.lick(botWhoLickedMe);
}

/**
 * Override of Bot.gotIgnored
 * @param  {Bot} botWhoIgnoredMe The bot that's ignoring me
 * @return {void}                 
 */
sharAI.gotIgnored = function(botWhoIgnoredMe) {
    sharAI.speak(botWhoIgnoredMe, "Hey, pay attention to me, " + botWhoIgnoredMe.name + "!");
}

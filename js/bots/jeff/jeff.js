/**
 * Jeff's bot
 */
var jeff = new Bot(570, 570, 'jeff', 'js/bots/jeff/person.png');

/**
 * State variables
 */
jeff.currentlyPursuing = "Nothing";
jeff.currentMotion = Motions.still;

/**
 * Initialize bot
 *
 * @override
 */
jeff.init = function() {
    this.body = this.sprite.body; // Todo:  a way to do this at a higher level?
    this.body.rotation = 100; // Initial Angle
    this.body.speed = 0; // Initial Speed

    // Initialize Timed Updates
    game.time.events.loop(Phaser.Timer.SECOND * 1, jeff.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 10, jeff.updateTenSecs, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, jeff.update2min, this);

    // Make productions
    this.makeProductions();

    // Initialize edibility function
    jeff.canEat = function(object) {
        if (object.name == "jerry_can") {
            return false;
        } else {
            return object.isEdible;
        }
    }

    // Initialize utility function
    jeff.utilityFunction = function(object) {
        if (object instanceof Bot) {
            return 10;
        } else if (object.name == "jerry_can") {
            return -70;
        } else if (object.isEdible) {
            // TODO: Introduce a function that scales calories to utilities 
            return object.calories;
        } else {
            return 1;
        }
    }

}

/**
 * Create the list of productions for this agent.
 */
jeff.makeProductions = function() {

    var foodSeeking = new Production("find food when hungry");
    foodSeeking.priority = Production.priority.High;
    foodSeeking.condition = function() {
        return (jeff.hunger.value > 50);
    };
    foodSeeking.action = function() {
        // jeff.currentMotion = Motions.tantrum;
        jeff.findFood(500, jeff.canEat);
        jeff.addMemory("Looked for food");
        jeff.makeSpeechBubble("Ok I'm hunting!", 400);
    };

    var admireCar = new Production("admiring car");
    admireCar.priority = Production.priority.Medium;
    admireCar.condition = function() {
        let d = jeff.getDistanceTo(dylan);
        if ((d > 100) && (d < 300)) {
            return true;
        };
        return false;
    };
    admireCar.action = function() {
        jeff.speak(dylan, "Nice car!", 2000);
        jeff.addMemory("Said Nice Car");
        jeff.orientTowards(dylan);
    };

    var fight = new Production("pick a fight when grumpy");
    fight.priority = Production.priority.Low;
    fight.condition = function() {
        return true; // (jeff.emotions.current === "Angry");
    };
    fight.action = function() {
        jeff.makeSpeechBubble("Attack!", 2000);
        jeff.addMemory("Attack mode");
        jeff.attackNearbyBots();
        jeff.play(sounds.attack1);
    };
    fight.probNotFiring = .7;

    var irritable = new Production("irritable when hungry");
    irritable.priority = Production.priority.Medium;
    irritable.condition = function() {
        return (jeff.hunger.value > 40);
    };
    irritable.action = function() {
        jeff.addMemory("Got angry");
        jeff.emotions.current = "Angry";
        jeff.makeSpeechBubble("Need food!", 1000);
    };
    irritable.probNotFiring = .5;

    var chatty = new Production("talk to people when bored");
    chatty.priority = Production.priority.Medium;
    chatty.condition = function() {
        return (jeff.emotions.current === "Calm" || jeff.emotions.current == "Sad");
    };
    chatty.action = function() {
        var nearbyBots = jeff.getNearbyBots(800);
        jeff.addMemory("Was bored");
        if (nearbyBots.length > 0) {
            jeff.pursue(nearbyBots[0], 500);
            jeff.speak(nearbyBots[0], "I'm bored " + nearbyBots[0].name, 2000);
        }
    };
    chatty.probNotFiring = .95;

    var commentOnGoodStuff = new Production("Comment on high utility items");
    commentOnGoodStuff.priority = Production.priority.High;
    commentOnGoodStuff.condition = function() {
        var nearbyObjects = jeff.getNearbyObjects(800);
        if (nearbyObjects.length > 0) {
            if (jeff.utilityFunction(nearbyObjects[0]) > 30) {
                return true;
            } else {
                return false;
            }
        }
    };
    commentOnGoodStuff.action = function() {
        jeff.addMemory("Noticed good stuff");
        jeff.makeSpeechBubble("Something good around here...!");
    };
    commentOnGoodStuff.probNotFiring = .9;

    var findNewFriends = new Production("Talk to random people when happy");
    findNewFriends.priority = Production.priority.Low;
    findNewFriends.condition = function() {
        // jeff.addMemory("Looking for friends");
        return (jeff.emotions.current === "Happy");
    };
    findNewFriends.action = function() {
        jeff.addMemory("Looked for friends");
        var randBot = jeff.getRandomBot();
        jeff.pursue(randBot, 700);
        jeff.speak(randBot, "Hey " + randBot.name + ", let's talk!", 2000);
    };
    findNewFriends.probNotFiring = .8;

    var randStrings = ["Philosophy is good for the heart", 
        "Please don't buy food during class", 
        "I can tell you are checking social media",
        "Happy spouse happy house"];
    var sayRandomStuffWhenCalm = new Production("Say random stuff when calm");
    sayRandomStuffWhenCalm.priority = Production.priority.High;
    sayRandomStuffWhenCalm.condition = function() {
        return jeff.emotions.current == "Calm";
    };
    sayRandomStuffWhenCalm.action = function() {
        jeff.addMemory("Said random thing");
        jeff.makeSpeechBubble(randStrings.randItem());
    };
    sayRandomStuffWhenCalm.probNotFiring = .9;

    // Populate production list
    this.productions = [foodSeeking, admireCar, fight,
        irritable, chatty, findNewFriends, commentOnGoodStuff, 
        sayRandomStuffWhenCalm];
}

/**
 * Markov process controlling emotions
 */
jeff.emotions = new MarkovProcess("Calm");
jeff.emotions.add("Calm", [
    ["Calm", "Happy", "Angry", "Sad"],
    [.8, .1, .05, .05]
]);
jeff.emotions.add("Sad", [
    ["Sad", "Calm"],
    [.7, .3]
]);
jeff.emotions.add("Angry", [
    ["Angry", "Calm"],
    [.7, .3]
]);
jeff.emotions.add("Happy", [
    ["Happy", "Calm"],
    [.7, .3]
]);

/**
 * Hunger Variable
 */
jeff.hunger = new DecayVariable(0, 1, 0, 100);
jeff.hunger.toString = function() {
    var hungerLevel = "";
    if (this.value < 20) {
        hungerLevel = "Not hungry";
    } else if (this.value < 60) {
        hungerLevel = "Hungry";
    } else if (this.value < 80) {
        hungerLevel = "Starving!!";
    } else {
        hungerLevel = "FEED ME!";
    }
    return hungerLevel + " (Hunger = " + this.value + ")";
}

/**
 * Populate the status field
 *
 * @override
 */
jeff.getStatus = function() {
    var statusString = "Emotion: " + jeff.emotions.current;
    statusString += "\nMotion: " + (jeff.motionOverride ? "Override" : jeff.currentMotion.description);
    statusString += "\n" + jeff.hunger.toString();
    return statusString;
}

/**
 * Set the current motion state.  Currently updated every second.
 */
jeff.setMotion = function() {

    // Default markov chain movement patterns
    // TODO: Add conditions that involve hunger, etc.
    if (jeff.emotions.current === "Sad") {
        jeff.currentMotion = Motions.moping;
    } else if (jeff.emotions.current === "Happy") {
        jeff.currentMotion = Motions.walking;
    } else if (jeff.emotions.current === "Calm") {
        let rnd = Math.random();
        if (rnd < .5) {
            jeff.currentMotion = Motions.still;
        } else {
            jeff.currentMotion = Motions.walking;
        }
    } else if (jeff.emotions.current === "Angry") {
        jeff.currentMotion = Motions.spazzing;
    }
}

//////////////////////
// Update Functions //
//////////////////////

/**
 * Main update called by the phaser game object (about 40 times / sec. on my machine).
 *
 * @override
 */
jeff.update = function() {
    this.currentMotion.apply(jeff);
    jeff.genericUpdate();
};

/**
 * Called every second
 */
jeff.update1Sec = function() {
    jeff.updateNetwork();
    // TODO: Depending on power output of motions increment hunger in different degrees
    jeff.hunger.increment();
    jeff.emotions.update();
    jeff.setMotion();
    fireProductions(jeff.productions);
}

/**
 * Called every ten seconds
 */
jeff.updateTenSecs = function() {}

/**
 *  Called every two minutes
 *  @memberOf Jeff
 */
jeff.update2min = function() {
    // jeff.hunger.setValue(0);
}

///////////////////////////
// Interaction Functions //
///////////////////////////

/**
 * React to a collision.
 *
 * @override
 */
jeff.collision = function(object) {
    jeff.addMemory("Saw " + object.name);
    jeff.moveAwayFrom(object);
    if (jeff.canEat(object)  && (jeff.hunger.value > 50)) {
        jeff.eatObject(object);
    }

}

/**
 * Call this when eating something.  
 *
 * @param {Entity} objectToEat what to eat
 */
jeff.eatObject = function(objectToEat) {
    jeff.addMemory("Ate " + objectToEat.name);
    objectToEat.eat();
    jeff.hunger.subtract(objectToEat.calories);
    jeff.speak(objectToEat, "Yummy " + objectToEat.description + "!");
    jeff.play(sounds.chomp);
}

/**
 * @override
 */
jeff.hear = function(botWhoSpokeToMe, whatTheySaid) {
    jeff.addMemory(botWhoSpokeToMe.name + " said \"" + whatTheySaid + "\"");
    // jeff.speak(botWhoSpokeToMe, "Right on " + botWhoSpokeToMe.name); 
}

/**
 * React when someone high fives me.
 *
 * @override
 */
jeff.highFived = function(botWhoHighFivedMe) {
    jeff.addMemory("High Fived: " + object.name);
    jeff.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}

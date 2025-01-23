var rey = new Bot(1200, 1200, 'rey', 'js/bots/rey/whitedeer.png');


rey.currentMotion = Motions.still;

rey.init = function() {
    this.body = this.sprite.body;
    this.body.rotation = 100;
    this.body.speed = 100;
    rey.stopMotion = false;


    game.time.events.loop(Phaser.Timer.SECOND * 1, rey.update1Sec, this);
    game.time.events.loop(Phaser.Timer.SECOND * 60 * 2, rey.update2min, this);

    this.makeProductions();


//Make goals
    this.goals = new GoalSet();


}

// Initialize edibility function
rey.canEat = function(object) {
    if (object.name == "jerry_can" || object.name == "Devil_Fruit_rubber" || object.name == "diet_pepsi") {
        return false;
    } else {
        return object.isEdible;
    }
}

// Initialize utility function
rey.utilityFunction = function(object) {
    if (object instanceof Bot) {
        return 10;
    } else if (object.name == "jerry_can" || object.name == "Devil_Fruit_rubber" || object.name == "diet_pepsi") {
        return -40;
    } else if (object.isEdible) {
        return object.calories;
    } else {
        return 2;
    }
}

rey.makeProductions = function() {

this.productions = []; // The production array


   var eatingGoal = new Production("eat when starving");
        eatingGoal.priority = Production.priority.Medium;
        eatingGoal.condition = function() {
            return (rey.hunger.value === 40);
     };
        eatingGoal.action = function() {
            rey.addMemory("I'm going to eat the first thing I see!");
            rey.goals.add("Look around for some food!");
            rey.makeSpeechBubble("SOMEONE GET ME FOOD", 1200);
        };
    this.productions.push(eatingGoal);

    var gohometosleepGoal = new Production("I'm going to bed");
        gohometosleepGoal.priority = Production.priority.High;
        gohometosleepGoal.condition = function () {
            return (rey.emotions.current == "Sleepy");
        };
        gohometosleepGoal.action = function() {
            rey.addMemory("I need to go rest now..");
            rey.goals.add("I am going home now");
            rey.makeSpeechBubble("GOOD NIGHT", 1200);
        }
    this.productions.push(gohometosleepGoal);

   var fleeingProduction = new Production("fleeing",
        Production.priority.High,
        function() {
            return (rey.emotions.current == "Not in the mood");
        },
        function() {
            // rey.moveAwayFrom(nearbyBots[0], 500); <-- You need to check that this has elements first.  See your other use below.
            rey.makeSpeechBubble("Get away from meee!");
        });

   var dancingProduction = new Production("dancing",
        Production.priority.High,
        function() {
            return (rey.currentMotion == Motions.dancing);
        },
        function() {
            rey.makeSpeechBubble("Someone come dance with me pls!");
        });

   var lookingforfoodProduction = new Production("scavaging",
        Production.priority.Low,
        function() {
            return (rey.hunger.value > 30 && rey.emotions.current !== "Sleepy");
        },
        function() {
            rey.makeSpeechBubble("I need to find me some food..");
        });

   var playingProduction = new Production("playing",
        Production.priority.Low,
        function() {
            return (rey.emotions.current == "Hyper");
        },
        function() {
            var nearbyBots = rey.getNearbyBots(800);
            rey.pursue(nearbyBots[0], 1000);
            rey.makeSpeechBubble("Play with me!!");
        });
   var sleepingProduction = new Production("sleeping",
        Production.priority.Low,
        function() {
            return (rey.emotions.current == "Sleepy" && rey.hunger.value > 40);
        },
        function() {
            rey.currentMotion = Motions.still;
            rey.makeSpeechBubble("I'm about to take a nap..");
        });

    //five new productions

   var fight = new Production("fighting"); ///this production still needs some work 
    fight.priority = Production.priority.High;
    fight.condition = function() {
        return (rey.emotions.current == "Not in the mood");
    };
    fight.action = function() {
        rey.makeSpeechBubble("I don't want to deal with you right nowww!!", 2000);
        rey.attackNearbyBots();
    };
    fight.probNotFiring = .5;

   var seekFood = new Production("starving",
        Production.priority.High,
        function() {
            return (
                rey.hunger.value > 10);
        },
        function() {
            rey.currentMotion = Motions.moping;
            rey.productionText = "Please feed me";
            rey.getRandomObject;
            rey.getNearbyObjects;
        });

  var goHome = new Production("need to rest at home",
        Production.priority.High,
        function() {
            return (
                rey.emotions.current == "Sleepy");
        },
        function() {
            rey.currentMotion = Motions.sonicSpeed;
            rey.productionText = "goood night";
        });

  var avoidance = new Production("please leave me alone for now",
        Production.priority.Medium,
        function() {
            return (
                rey.emotions.current == "Not in the mood" || rey.emotions.current == "Sleepy");
        },
        function() {
            rey.orientTowards(sharAI);
            rey.makeSpeechBubble("No one will get close to me if I am close to sharAI");
        });


 var social = new Production("talking to other bots");
    social.priority = Production.priority.Medium;
    social.condition = function() {
        let d = rey.getDistanceTo(sharAI);
        if ((d > 0) && (d < 500)) {
            if(rey.containsRecentMemory("Everyone run away!", 1.01)) {
                return false; 
            } else {
                return true;
            }
        };
        return false;
    };
    social.action = function() {
        rey.speak(sharAI, "Get away please!", 2000);
        rey.addMemory("I said get away please!!");
        rey.orientTowards(sharAI);
    };
    social.probNotFiring = .7;
    this.productions.push(social);




   var social = new Production("Does anyone want to talk?",
        Production.priority.High,
        function() {
            return (
                rey.emotions.current == "Hyper" || rey.hunger.value < 20);
        },
        function() {
            var nearbyBots = rey.getNearbyBots(800);
            if (nearbyBots.length > 0) {
                if(rey.containsRecentMemory("What are you doing? ", 1.01)) {
                return false; 
            } else {
                return true;
            }
            }
        });
    // social.action = function() {
    //     rey.speak(nearbyBots, "How's it going?", 2000);
    //     rey.addMemory("Said How's it going?");
    //     rey.orientTowards(nearbyBots.name);
    // };
    // social.probNotFiring = .7;
    // this.productions.push(social);

    this.productions = [fleeingProduction, dancingProduction, lookingforfoodProduction, playingProduction, sleepingProduction, fight, seekFood, goHome, avoidance, social];
}



rey.emotions = new MarkovProcess("Relaxed");
rey.emotions.add("Relaxed", [
    ["Relaxed", "Hyper", "Sleepy", "Not in the mood"],
    [.6, .3, .05, .05],
]);
rey.emotions.add("Not in the mood", [
    ["Not in the mood", "Sleepy"],
    [.6, .4]
]);
rey.emotions.add("Sleepy", [
    ["Sleepy", "Relaxed"],
    [.5, .5]
]);
rey.emotions.add("Hyper", [
    ["Hyper", "Relaxed", "Sleepy"],
    [.7, .25, .05]
]);


rey.hunger = new DecayVariable(0, 1, 0, 50);
rey.hunger.toString = function() {
    var hungerLevel = "";
    if (this.value < 20) {
        hungerLevel = "Eh, not hungry.";
    } else if (this.value < 35) {
        hungerLevel = "Okay, I'm getting hungry.";
    } else if (this.value < 49) {
        hungerLevel = "I'm starving now..";
    } else {
        hungerLevel = "MOVE I NEED TO EAT!";
    }
    return hungerLevel + " (Hunger = " + this.value + ")";
}


rey.getStatus = function() {
    var statusString = "Emotion: " + rey.emotions.current;
    statusString += "\nMotion: " + rey.currentMotion.description;
    statusString += "\n" + rey.hunger.getBar("Hunger");
     statusString += "\n" + rey.hunger.toString();
    statusString += "\n" + rey.goals.toString();
    statusString += "\n" + rey.getActiveMemoryString();
    return statusString;
}


rey.setMotion = function() {

    if (rey.emotions.current === "Not in the mood") {
        rey.currentMotion = Motions.still;
    } else if (rey.emotions.current === "Hyper") {
        rey.currentMotion = Motions.sonicSpeed;
    } else if (rey.emotions.current === "Relaxed") {
        let rnd = Math.random();
        if (rnd < .5) {
            rey.currentMotion = Motions.dancing;
        } else {
            rey.currentMotion = Motions.sonicSpeed;
        }
    } else if (rey.emotions.current === "Sleepy") {
        let rnd = Math.random();
        rey.play(sounds.snore);
        if (rnd < .5) {
            rey.currentMotion = Motions.still;
        } else {
            rey.currentMotion = Motions.moping;
        }
    }
}

rey.update = function() {
 if(!rey.stopMotion) {
        rey.currentMotion.apply(rey);
        rey.genericUpdate();
};
}

rey.update1Sec = function() {
    rey.updateNetwork();
    rey.hunger.increment();
    rey.emotions.update();
    rey.setMotion();
  let firedProductions = fireProductions(rey.productions);
    rey.productionString = getProductionString(firedProductions); 
}



rey.update2min = function() {}


rey.collision = function(object) {
    rey.addMemory("Saw " + object.name);
   // rey.moveAwayFrom(object);
    if (rey.canEat(object)  && (rey.hunger.value > 40)) {
        rey.eatObject(object);

}
    rey.addMemory("Hugged " + object.name);
    if (object.name != "sharAI") {
        //rey.addMemory("Don't eat me!");
    }


rey.eatObject = function(objectToEat) {
    rey.addMemory("Ate " + objectToEat.name);
    objectToEat.eat();
    rey.hunger.subtract(objectToEat.calories);
    rey.speak(objectToEat, "Yum my favorite " + objectToEat.description + "!");
    sounds.chomp.play();
}


rey.hear = function(botWhoSpokeToMe, whatTheySaid) {
    rey.speak(botWhoSpokeToMe, "How are you doing " + botWhoSpokeToMe.name);
}


rey.highFived = function(botWhoHighFivedMe) {
    rey.speak(botWhoHighFivedMe, "Hey what's up " + botWhoHighFivedMe.name + ".");
}
}
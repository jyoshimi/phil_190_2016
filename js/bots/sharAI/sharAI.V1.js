//
// INIT
//

var sharAI = new Bot(750, 750, 'sharAI', 'bots/sharAI/sharAI.png');
sharAI.stateText = "SYSTEMS NORMAL \nsharAI says: Hello!";
sharAI.state = 1;
sharAI.exhaustion = 0; // The higher the number, the more sleepy sharAI is.
sharAI.anger = 0; // The higher the number, the angrier sharAI is.
sharAI.turnRandom = 0;
sharAI.currentStatus = "SYSTEMS NORMAL \n";
sharAI.currentDiscussion = "Hello!";

sharAI.init = function() {
    this.body = this.sprite.body;
    sharAI.body.rotation = 100;
    sharAI.body.speed = 100;
}

sharAI.content = {
	name: "Content"
	//next: function() {

	//}
}

sharAI.sleepy = {
	name: "Sleepy"
	//next: function() {

	//}
}

//
// MOVEMENT
//

sharAI.move = function() {
    sharAI.turnRandom = Math.random();
    if (sharAI.turnRandom < .1) { // Small left turn
        sharAI.incrementAngle(5);
    } else if (sharAI.turnRandom >= .1 && sharAI.turnRandom < .2) { // Small right turn
        sharAI.incrementAngle(-5);
    } else if (sharAI.turnRandom >= .2 && sharAI.turnRandom < .25) { // Modest turn left
        sharAI.incrementAngle(20);
    } else if (sharAI.turnRandom >= .25 && sharAI.turnRandom < .3) { // Modest turn right
        sharAI.incrementAngle(-20);
    }
}

//
// TIMED EVENTS
//

sharAI.timedEvent = function() {
   sharAI.currentDiscussion = sharAI.talk(sharAI.talkStrings);
}

sharAI.talk = function(array) {
    sharAI.string = array[Math.floor(Math.random() * array.length)];
    return sharAI.string;
};

sharAI.stateStrings = ["STATE ERROR FOUND. PLEASE DEBUG! ", "sharAI is doing ok.", "sharAI is taking a nap."];
sharAI.identityStrings = ["am a robot", "am a bot", "have a mind \(maybe?\)", "am a person \(possibly?\)", "am neither a man nor a woman", "am nihilistic"];
sharAI.likeStrings = ["video games", "my family", "my friends", "bugs", "slugs", "snails", "monsters", "robots", "computers", "programming", "sleeping", "food", "ingesting fluids", "swearing"];
sharAI.cursePrefixes = ["God ", "Jesus ", "Ass", "Shit", "Fuck", "Son of a ", "Mother", "Father", "Goat", "Butt", "Anus", "Monkey", "Bull", "Bumble", "Cock", "Dick", "Weasel", "Horse", "Sweet", "Baby", "Christ ", "Holy", "Bitch", "Bastard", "Dip", "Douche", "Dumb", "Fucker", "Suck", "Fudge", "Hacker ", "Jack", "Jerk", "Lame", "Camel", "Piss", "Prick", "Schlong", "Scrote", "Shitty ", "Uncle", "Aunt", "Boob", "Nerd", "Noob", "Beard", "Cauldron", "Banshee", "Dragon", "Rabble", "Broom", "Taint", "Turd", "Unicorn", "Sock", "Nipple", "Goblin", "Crotch", "\*\@\$\#"];
sharAI.curseSuffixes = ["er", "damn", " Christ", "fucker", "hole", "ass", "goat", "gun", "shit", "anus", "hat", "pirate", "bag", "clown", "butt", "face", "goblin", "muncher", "head", "licker", "monkey", "wad", "wipe", "boner", "poop", "cock", "booty", "burger", "master", "nugget", "smith", "waffle", "bubble", "monger", "mongrel", "dick", "weasel", "dong", "dildo", "nerd", "weed", " on a pogo", " on a bike", " on a cracker", " Jesus", "baby", "bitch", "bastard", "tickler", "whisperer", "douche", "butter", "boy", "man", "sucker", "nut", "up", "wit", "fudge", "camel", "piss", "prick", "schlong", "scrote", "shitter", "uncle", "aunt", "vagina", "boob", "wanker", "noob", "beard", "bum", "banshee", "dragon", "bougies", "rouser", "broom", "crack", "taint", "turd", "unicorn", "polisher", "sock", "nipple", "crotch", "\*\@\$\#"];
sharAI.curseStrings = ["Fuck!", "Shit!", "Ass!", "Damn!", "Hell!", "Butt!", "Dick!", "Bastard!", "Fudge!", "Piss!", "Dingleberry!", "\*\@\$\#!", "Gadzooks!", (sharAI.talk(sharAI.cursePrefixes) + sharAI.talk(sharAI.curseSuffixes) + "!")];
sharAI.factStrings = [("I " + sharAI.talk(sharAI.identityStrings) + "?"), "snails. talk. really. slowly?", ("I like " + sharAI.talk(sharAI.likeStrings) + "?"), "nothing matters?"];
sharAI.talkStrings = ["Beep boop!", ("Did you know that " + sharAI.talk(sharAI.factStrings)), ("I like " + sharAI.talk(sharAI.likeStrings) + "!")];


//
// MAIN
//

sharAI.getStatus = function() {
    sharAI.currentStatus = ("" + sharAI.stateStrings[sharAI.state] + "\n");
    sharAI.stateText = ("" + sharAI.currentStatus + "sharAI says: " + sharAI.currentDiscussion);
    return sharAI.stateText;
}

sharAI.update = function() {


    // WARNING: ADD STRING AT sharAI.stateString[5] BEFORE INCREASING sharAI.anger

    //
    // STATUS HANDLER
    //

    switch (sharAI.state) {
        case 1: // NORMAL STATUS
            sharAI.body.speed = 100;
            sharAI.move();
            sharAI.exhaustion++;
            break;

        case 2: // NAP TIME
            sharAI.body.speed = 0;
            sharAI.exhaustion--;

            // Makes sharAI snore, but not too much
            if (sharAI.exhaustion % 10 == 0) {
                sharAI.currentDiscussion = (sharAI.currentDiscussion + "z");
            }

            // Wake sharAI up once they're not tired anymore
            if (sharAI.exhaustion == 0) {
                sharAI.state = 1;
                sharAI.currentDiscussion = "Yawn...";
            }
            break;

            // TODO: Make case 3 & 4 for dealing with hunger and thirst

        case 5: // RAGE MODE
            sharAI.body.speed = 0;
            sharAI.incrementAngle(25); // Tantrum spin!
            currentDiscussion = (sharAI.currentDiscussion + sharAI.talk(sharAI.curseStrings) + " "); // Blow some steam!
            sharAI.anger--;

            // Return sharAI to normal once they've cursed their anger away
            if (sharAI.anger == 0) {
                sharAI.state = 1;
            }
            break;

        default: // ERROR HANDLER
            sharAI.state = 0;
            sharAI.body.speed = 0;
            break;
    }

    //
    // STATUS SWITCHER
    //

    // SLEEP
    if (sharAI.exhaustion >= 1000) { // If sharAI gets too sleepy, put them into sleep mode
        sharAI.state = 2;
        sharAI.currentDiscussion = "Z";
    }

    // ANGER
    else if (sharAI.anger >= 10) { // If sharAI gets too angry, let them blow off some steam
        sharAI.state = 5;
        sharAI.currentDiscussion = "";
    }

    sharAI.basicUpdate();
}

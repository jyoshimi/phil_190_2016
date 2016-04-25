/**
 * Implements a discrete time Markov process, or what is also known as a "Markov chain."" 
 *
 * http://setosa.io/blog/2014/07/26/markov-chains/
 * 
 * @param {String} initialStateName name of initial state
 */
function MarkovProcess(initialStateName) {
    // A collection of states, where each state has a name and a "fan-out array",
    // an array of target states and the probabilities of transitioning to them.
    // A state could be [["happy","sad"],[.4,.6]].
    this.states = {};
    this.current = initialStateName; // the current state name.  TODO: But that is more of a key.
};

/**
 * Add a state to the markov chain
 *
 * @param {String} stateName the name of the state being added 
 * @param {Object} theState  the fan-out array, e.g. [["happy","sad"],[.4,.6]].
 */
MarkovProcess.prototype.add = function(stateName, theState) {
    this.states[stateName] = theState;
};

/**
 * Change transition probabilities for the specified state.
 *
 * E.g. jeff.emotions.changeTransitions("Calm", [0,0,0,1]);
 *
 * @param {String} stateName the name of the state being edited 
 * @param {newTransitions} newTransitions the new transitions
 */
MarkovProcess.prototype.changeTransitions = function(stateName, newTransitions) {
    this.states[stateName][1] = newTransitions;
};

/**
 * Update the markov chain.  From the current state, choose a random
 * number between 0 and 1, and then set the new state based on that.
 */
MarkovProcess.prototype.update = function() {
    let rnd = Math.random(); // Roll a die
    let fanOut = this.states[this.current]; // Get the fan-out array
    let threshold = fanOut[1][0];
    for (let i = 0; i < fanOut[1].length; i++) {
        if (rnd < threshold) {
            this.current = fanOut[0][i];
            return;
        } else {
            threshold += fanOut[1][i + 1];
        }
    };
};

/**
 * A variable that can be incremented or decremented.
 *
 * TODO: Rename?  Decay should be more of a diffeq.  This is a clipped or rectified counter.
 * TODO: Add reset.
 *
 * @param {Number} initialVal initial value for variable
 * @param {Number} incrementAmount how much to increment or decrement
 * @param {Number} minVal the highest possible value
 * @param {Number} maxVal the highest possible value
 */
function DecayVariable(initialVal, incrementAmount, minVal, maxVal) {
    this.value = initialVal;
    this.incrementAmount = incrementAmount;
    this.minVal = minVal;
    this.maxVal = maxVal;
}
DecayVariable.prototype.decrement = function() {
    this.value = Math.max(this.minVal, this.value - this.incrementAmount);
}
DecayVariable.prototype.increment = function() {
    this.value = Math.min(this.maxVal, this.value + this.incrementAmount);
}
DecayVariable.prototype.add = function(amount) {
    if (typeof amount == "undefined" || Number.isNaN(amount)) {
        console.log("You are probably trying to eat something that does not have calories defined!");
        return;
    }
    this.value = Math.min(this.maxVal, this.value + amount);
}
DecayVariable.prototype.subtract = function(amount) {
    if (typeof amount == "undefined" || Number.isNaN(amount)) {
        console.log("You are probably trying to eat something that does not have calories defined!");
        return;
    }
    this.value = Math.max(this.minVal, this.value - amount);
}
DecayVariable.prototype.getBar = function(prefix = "", showVal = false, numTicks = 10, minCharLengthOfMinMaxText = undefined) {
    var string_minVal = this.minVal.toString();
    var string_maxVal = this.maxVal.toString();
    //prettify value string length
    if (typeof minCharLengthOfMinMaxText != "undefined") {
        if (Number.isNaN(minCharLengthOfMinMaxText)) {
            if (this.minVal.toString().length >= this.maxVal.toString().length) {
                minCharLengthOfMinMaxText = this.minVal.toString().length;
            } else {
                minCharLengthOfMinMaxText = this.maxVal.toString().length;
            }
        }
        string_minVal = (" ".repeat(minCharLengthOfMinMaxText) + this.minVal).slice(-minCharLengthOfMinMaxText) + "\t";
        string_maxVal = "\t" + (" ".repeat(minCharLengthOfMinMaxText) + this.maxVal).slice(-minCharLengthOfMinMaxText);
    }
    // Thanks to SharAI for this code idea!
    var bar = "";
    if (showVal) {
        bar = prefix + ": " + this.value + "\t\t" + string_minVal;
    } else {
        bar = prefix + ": " + string_minVal;
    }
    let tick_size = (this.maxVal - this.minVal) / numTicks;
    let tick_location = Math.floor((this.value - this.minVal) / tick_size);
    for (i = 0; i < tick_location; i++) {
        bar += "▓"
    }
    for (i = 0; i < (numTicks - tick_location); i++) {
        bar += "░"
    }
    bar += " " + string_maxVal;
    return bar;
}

/**
 * Creates a simple ascii bargraph using Sharai's basic method
 * @param  {Number}  minVal minimum value in range
 * @param  {Number}  maxVal max val in range
 * @param  {Number}  value the current value to show  as a tick
 * @param  {String}  prefix prefix for the bar graph
 * @param  {Boolean} showVal whether to show the current value separtely
 * @param  {Number}  numTicks how many ticks in the graph
 * @return {String}  the formatted graph representation
 */
function getBarWithTick(minVal, maxVal, value, prefix = "", showVal = false, numTicks = 10) {
    var bar = "";
    if (showVal) {
        bar = prefix + ": " + value + "\t\t" + minVal + " ";
    } else {
        bar = prefix + ": " + minVal + " ";
    }
    let range = maxVal - minVal;
    let rescaledValue = -minVal + value;
    let tick_location = Math.floor((rescaledValue / range) * numTicks);
    for (i = 0; i < numTicks; i++) {
        if (i === tick_location) {
            bar += "▓";
        } else {
            bar += "░";
        }
    }
    bar += " " + maxVal;
    return bar;
}


/**
 * Adding a contains function to String
 */
String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
};

/**
 * Add a food item to the game
 */
function setUpFood() {

    // Add 20 pieces of food in various categories
    for (var i = 0; i < 20; i++) {
        let rnd = game.rnd.integerInRange(1, 13);
        switch (rnd) {
            case 1:
                addFoodItem("food_fruit_veggies", "fruits and veggies", 159);
                break;
            case 2:
                addFoodItem("cupCake", "cupCake", 130);
                break;
            case 3:
                addFoodItem("diet_pepsi", "Diet Pepsi", 0);
                break;
            case 4:
                addFoodItem("jerry_can", "Gasoline", 157500);
                //31,500 cals in a gallon of gasoline, about 5 gallons in a jerry can  
                break;
            case 5:
                addFoodItem("Philoberry", "Organic Philosopher's Stone", 85);
                break;
            case 6:
                addFoodItem("Spicy_Poffin", "A very spicy pastry.", 90);
                //slightly more calories than a madeleine
                break;
            case 7:
                addFoodItem("Cheri_berry", "Pokemon berry #01", 77);
                break;
            case 8:
                addFoodItem("Enigma_berry", "Pokemon berry #60", ((Math.random() - 0.5) * 200)); //different every game
                break;
            case 9:
                addFoodItem("Hondew_berry", "Pokemon berry #24", 64);
                break;
            case 10:
                addFoodItem("Passo_berry", "Pokemon berry #37", 229);
                break;
            case 11:
                addFoodItem("steak", "Fresh meat", 387);
                break;
            case 12:
                addFoodItem("pink_candy", "Yummy candy", 899);
                //a tiny piece of candy barely has any calories <-- 899 is a "lot!"
                break;
            case 13:
                addFoodItem("Cream_Cake", "Ice Cream cake", 1, 860);
                //There is about 310 calories per slice of ice cream cake, so assuming there is roughly six slices, there would be 1,860 calories in the whole cake
                break;
            default:
                // addFoodItem("food_fruit_veggies", "fruits and veggies", 159);
                break;
        }
        // Removed Devil_Fruit_rubber since it was incomplete
        // addFoodItem("Devil_Fruit_rubber", "Its taste is worse than crap; eater becomes hammer for life", -480);
    }
}

/**
 * Add food item at a random empty location.  Forwards to addFood.
 */
function addFoodItem(image_id, description, calories) {
    if (image_id == "") {
        return;
    }
    let location = findEmptyLocation();
    addFood(image_id, description, calories, location);
}


/**
 * Add food at a specified location. Useful to call directly for testing food.
 *
 * Ex:   addFood("cupCake", "Cupcake", 899, [600,600]);
 *
 * @param {string} id id of the food asset
 * @param {string} description description of the food item
 * @param {string} calories how many calories it has
 * @param {location} array with (x,y) position
 */
function addFood(image_id, description, calories, location) {
    if (image_id == "") {
        return;
    }
    food = new Entity(location[0], location[1], image_id);
    food.description = description;
    food.calories = calories;
    food.isEdible = true;
    foods.push(food);
    food.eat = function() {
        if (!this || !this.sprite) {
            console.log("Problem with " + this.name);
            return;
        }
        // console.log("Eating " + this.description + " with " + this.calories + " calories");
        var tempSprite = this.sprite;
        tempSprite.reset(-10, -10);
        tempSprite.visible = false;
        // Respawn food in 5 seconds.
        //  TODO: Note that sprite.kill(), .exists, and body.   all failed...
        //   So I place the sprite off screen then bring it back
        if (!tempSprite.visible) {
            game.time.events.add(Phaser.Timer.SECOND * 1, function() {
                let location = findEmptyLocation();
                tempSprite.reset(location[0], location[1]);
                tempSprite.visible = true;
            });
        }
    }
}


/**
 * A production which, if its conditions are met, fires some actions.
 *
 * TODO: There is currently no mechanism for making sure a production that 
 * is being "fired" isn't triggered again.
 * TODO: Produce some string status of productions and which are firing?
 *
 * @param  {string} name name of this production
 * @param  {Number} priority value from 1 (lowest) to 10 (highest) 
 *                           indicating how important this production is
 * @param  {function} condition if true, fire the production
 * @param  {function} actions function to call when firing this produciton
 */
function Production(name, priorityLevel, condition, action) {
    this.name = name;
    this.priorityLevel = priorityLevel;
    this.condition = condition;
    this.action = action;
    // A probability of _not_ firing the action even if condition is met  
    // 0 is it always fires; 1 is it never fires; .2 is it fires with 20 percent chance.
    this.probNotFiring = 0;

};
Production.priority = {};
// Todo: rename below next time to just Priority.High, etc.  So it's not tied to productions.
Production.priority.High = 10;
Production.priority.Medium = 5;
Production.priority.Low = 1;

/**
 * Find those productions in a list whose condition is met, sort by priority, and fire the
 * highest priority production in the resulting set (in the case of a tie the first
 * production in the list of ties is fired).
 *
 * @param  {Production[]} productions list of productions to check
 * @return {Production[]} list of productions that were fired
 */
function fireProductions(productions) {
    var activeProductions = productions.filter(function(production) {
        return production.condition();
    });
    activeProductions = activeProductions.sort(
        function(a, b) {
            return (a.priorityLevel < b.priorityLevel);
        });
    var retProductions = [];
    if (activeProductions.length > 0) {
        if (Math.random() < activeProductions[0].probNotFiring) {
            return retProductions;
        }
        // Choose randomly among those tied for current priority level
        baselinePriority = activeProductions[0].priorityLevel;
        activeProductions = activeProductions.filter(function(production) {
            return production.priorityLevel === baselinePriority;
        });
        let prod = activeProductions.randItem();
        prod.action();
        retProductions.push(prod);
    }
    return retProductions;
}
/**
 * Returns a string showing whatever prodution fired most recently, if any
 *
 * @param  {Production[]} productions the list of productions to check
 * @return {String} the string deisplay of those productions
 */
function getProductionString(productions) {
    var retString = "Recently fired productions:\n";
    if (Object.keys(productions).length === 0) {
        retString += "\tNo productions fired.\n";
        return retString;
    }
    productions.forEach(function(prod) {
        retString += "\t" + prod.name + "\n";
    });
    return retString;
}

/**
 * Checks if an object is part of a group
 * 
 * @param  {object}  object The object to check
 * @param  {Group}  group  The group to check the object against
 * @return {Boolean}        Is the object part of this group?
 */
function isChild(object, group) {
    if (group instanceof Group) {
        for (i = 0; i < group.children.length; i++) {
            if (group.children[i].name = object) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Get a random member of an array.
 */
Array.prototype.randItem = function() {
    return this[Math.floor((Math.random() * this.length))];
}

/**
 * Check if a given object is in the array
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * Round a number.
 * 
 * @param  {Number} num number to round
 * @param  {Number} dec integer number of decimal places to round to
 * @return {Number} the rounded number
 */
function round(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

/**
 * An object which represents goals and desires, and efforts to satisfy.
 * Simple string ids.  The assumption is that most of the logic of pursuing goals
 * occurs with productions.  
 * 
 * @param {String} id the name / id of the goal.  Also serves as a description now.
 */
function Goal(id) {
    this.id = id;
    this.failedSatisfactionAttempts = 0;
    // Later may add priority system if needed
};
Goal.prototype.toString = function() {
    return this.id + ". Failed attempts to satisfy: " +
        +this.failedSatisfactionAttempts;
}

/**
 * A set of goals and tools for adding and retrieving them.
 */
function GoalSet() {
    this.goals = {};
};
GoalSet.prototype.contains = function(goalId) {
    return this.goals.hasOwnProperty(goalId);
}
GoalSet.prototype.add = function(newGoal_id) {
    if (!this.contains(newGoal_id)) {
        let newGoal = new Goal(newGoal_id);
        this.goals[newGoal_id] = newGoal;
    }
}
GoalSet.prototype.get = function(goalId) {
    return this.goals[goalId];
}
GoalSet.prototype.remove = function(goalId) {
        delete this.goals[goalId];
    }
    /**
     * Check if the goal has been satisfied (if it has been, it should not be in the set).
     * If it has not been satisfied, increment the failed attempts counter.
     */
GoalSet.prototype.checkIfSatisfied = function(goalId) {
    var goal = this.get(goalId);
    if (goal) {
        goal.failedSatisfactionAttempts++;
    }
}
GoalSet.prototype.getArray = function() {
    let retArray = [];
    for (var key in this.goals) {
        retArray.push(this.goals[key])
    }
    return retArray;
}
GoalSet.prototype.toString = function() {
    var retString = "\nGoals:\n";
    if (Object.keys(this.goals).length === 0) {
        retString += "\tNo active goals.\n";
        return retString;
    }
    for (goal_id in this.goals) {
        retString += "\t" + this.goals[goal_id].toString() + "\n";
    }
    return retString;
}

/**
 * Yang's Bot
 * @namespace yang
 * @type {Bot}
 */
var yang = new Bot(2700, 2700, 'yang', 'js/bots/yang/yang.png');

///////////////////////////////////////////////////////////////////////////
//One leve of variable only contains :                                   //
//basic variables and references                                         //
//basic functions that manipulate basic variables and references         //
//objects that has its own basic variables, basic functions and objects  //
//"_" marks objects                                                      //
///////////////////////////////////////////////////////////////////////////
/**
 * combine all debug related stuff.
 * @memberOf yang
 * @type {Object}
 */
yang.test_ = {};
/**
 * combine all debug productions related stuff.
 * @memberOf yang.test_
 * @type {Object}
 */
yang.test_.test_production = [];
/**
 * combine all text related varandfun.
 * @memberOf yang
 * @type {Object}
 */
yang.text_ = {};
/**
 * combine all additional non-initializor functions.
 * @memberOf yang
 * @type {Object}
 */
yang.fun_ = {};
/**
 * stores random number for repeated use.
 * @memberOf yang
 * @type {Object}
 */
yang.chaosmachine_ = {};
/**
 * basic bio states of resources.
 * @memberOf yang
 * @type {Object}
 */
yang.biomachine_ = {};
/**
 * basic mind states of spirit.
 * @memberOf yang
 * @type {Object}
 */
yang.mindmachine_ = {};
/**
 * Pleasure and Pain
 * @memberOf yang
 * @type {Object}
 */
yang.ultility_sum_ = {};
/**
 * A node of nothing.
 * @memberOf yang
 * @type {Object}
 */
yang.void_node = { type: "void" };
/**
 * major node's code storage
 * @memberOf yang
 * @type {Object}
 */
yang.node_ = {};
/**
 * stores sequences of productions
 * @memberOf yang
 * @type {Object}
 */
yang.production_ = {};
/**
 * fire upon collision
 * @memberOf yang.production_
 */
yang.production_.inter_action = [];
yang.production_.inter_reaction = [];
/**
 * fire in every reaction, because flag
 * @memberOf yang.production_
 */
yang.production_.inter_reactivememorization = [];
/**
 * goal related directional adjustment
 * @memberOf yang.production_
 */
yang.production_.direction = [];
/**
 * remembered object and etc
 * @memberOf yang
 * @type {Object}
 */
yang.memory_ = {};
/**
 * yang's goal set
 * @memberOf yang
 * @type {Object}
 */
yang.goal_ = new GoalSet();
/**
 * major node reference, those index names are magic
 * @memberOf yang
 * @type {Object}
 */
yang["mental_task_node"] = yang.void_node;
yang["speed_node"] = yang.void_node;
yang["acceleration_node"] = yang.void_node;
yang["rotation_node"] = yang.void_node;
/**
 * Path for BGM
 * @type {String}
 */
yang.BGM = '';
/**
 * initializor called by system
 * @override
 * @function yang.init
 * @memberOf yang
 */
yang.init = function() {
    //setup body
    this.body = this.sprite.body;
    //Body
    yang.body.rotation = 0;
    yang.body.speed = 0;
    yang.temp_speed = 0;//for special movements
    yang.urgency_multiplier = 1;
    //other basic variables
    yang.control = false; //detect cursor
    yang.basicupdate_disable = false;
    yang.unstable = false;
    yang.watch_time = 0;
    yang.BGM_is_allowed = true;
    //non state machine objects
    yang.init_plus();
    //state machines objects
    yang.init_state();
    //recurrent event
    if (yang.test_.test_ongoing) {
        game.time.events.loop(Phaser.Timer.SECOND * 5, yang.test_.timed_test, yang);
    } else {
        game.time.events.loop(Phaser.Timer.SECOND * 1, yang.onesec_timedEvend, yang);
        game.time.events.loop(Phaser.Timer.SECOND * 60, yang.onemin_timedEvend, yang);
    }
    yang.fun_.makeProductions();
};
/**
 * initializor's helper
 * @function yang.init_plus
 * @memberOf yang
 */
yang.init_plus = function() { //object related initialization
    //Text Feedbacks
    yang.text_.stateText = "No Message";
    yang.text_.rotationText = "No Message";
    yang.text_.motionText = "No Message";
    yang.text_.interactiveText = "";
    yang.text_.testFeedBack = "Everything is FINE.";
    //test related
    yang.test_.ini = 0;
    yang.test_.test_ongoing = false;
    yang.test_.current_testnode = yang.def_node;
    //interaction production setup
    yang.memory_.colliding_obj = undefined;//current collision
    yang.memory_.uneaten_food = [];
    yang.memory_.friendly_bots = [];
    yang.memory_.unfriendly_bots = [];
    yang.memory_.bene_bots = [];
    yang.memory_.antler_caressed_bots = []; //blessed bots
    //collision flags
    yang.collision_bene_flag = false;
    yang.collision_ouch_flag = false;
    yang.collision_nice_flag = false;
    //goal
    yang.goal_.add(new Goal("No Goal")); 
    //berry
    yang.berry = new yang.node_.id_prime_focus.berry_game_obj(); //see node
    //additional possiblity
    //basespeed
    //acceleration
};
/**
 * initializor's helper
 * @function yang.init_state
 * @memberOf yang
 */
yang.init_state = function() {
    //primary state machine that is not implemented using nodes
    //for random
    yang.chaosmachine_.randomness = 0; // stack over time and randomly empty into the bio and mind machines
    yang.chaosmachine_.chance = 0; // this store a random number for temperary use
    //basic bio states of two resources
    yang.biomachine_.metaresources_prime = 100; // deplete through time, replenished by event; 
    yang.biomachine_.metaresources_secondary = 0; // change through emptyness/inspiration, assume dualism causal relationship between mind and physic; 
    //basic mind states of two spirits
    yang.mindmachine_.inspiration = 0; // accumulate through contact event
    yang.mindmachine_.emptyness = 0; // accumulate through time
    //basic mind state
    yang.ultility_sum_.ulti = new DecayVariable(0, 1, -500, 500); // pleasure - pain
    yang.ultility_sum_.pleasure = new DecayVariable(0, 1, 0, 100); //decay variables
    yang.ultility_sum_.pain = new DecayVariable(0, 1, 0, 100); //decay variables
    yang.ultility_sum_.translator = 0.1;
    //state machines that uses nodes
    //mental nodes
    if (yang.test_.test_ongoing) {
        yang["mental_task_node"] = yang.def_node;
        yang["speed_node"] = yang.def_node;
        yang["acceleration_node"] = yang.def_node;
        yang["rotation_node"] = yang.def_node;
    } else {
        yang["mental_task_node"] = yang.node_.id_prime_focus;
        yang["speed_node"] = yang.node_.stop_node;
        yang["acceleration_node"] = yang.def_node;
        yang["rotation_node"] = yang.def_node;
    }
};
/**
 * game system accessors
 * @return {String} Display message in textbox
 * @override
 * @function yang.getStatus
 * @memberOf yang
 */
yang.getStatus = function() {
    if (yang.test_.test_ongoing) {
        yang.text_.stateText =
            "Test Mode" + "\n" +
            yang.text_.testFeedBack + "\n" +
            "Test node Type: " + yang.test_.current_testnode.type + "\n" +
            "Satisfy of Life\t" + yang.ultility_sum_.ulti.getBar(undefined, undefined, undefined, 5) + "\n" +
            "Pleasure\t\t"  + yang.ultility_sum_.pleasure.getBar(undefined, undefined, undefined, 5) + "\n" +
            "Pain\t\t\t" + yang.ultility_sum_.pain.getBar(undefined, undefined, undefined, 5) + "\n" +
            yang.text_.rotationText + "\n" +
            yang.text_.motionText + "\n" +
            "prime resources \t= " + yang.biomachine_.metaresources_prime + "\n" +
            "secondary resources = " + yang.biomachine_.metaresources_secondary + "\n" +
            "emptyness = " + yang.mindmachine_.emptyness + "\n" +
            "inspiration \t= " + yang.mindmachine_.inspiration + "\n" +
            "randomness = " + yang.chaosmachine_.randomness;
    } else {
        yang.text_.stateText =
            yang.text_.testFeedBack + "\n" +
            "Satisfy of Life\t" + yang.ultility_sum_.ulti.getBar(undefined, undefined, undefined, 5) + "\n" +
            "Pleasure\t\t"  + yang.ultility_sum_.pleasure.getBar(undefined, undefined, undefined, 5) + "\n" +
            "Pain\t\t\t" + yang.ultility_sum_.pain.getBar(undefined, undefined, undefined, 5) + "\n" +
            yang["mental_task_node"].description + "\n" +
            yang["speed_node"].description + " " +
            yang["acceleration_node"].description;
    }
    return yang.text_.stateText;
};
/**
 * Check if overlapping an entity.
 * @override
 * @function yang.collisionCheck
 * @memberOf yang
 */
yang.collisionCheck = function() {
    //this function handles whether a collision truely happens
    let overlappingObjects = yang.getOverlappingEntities()
                         .concat(yang.getOverlappingBots())
                         .concat(yang.getOverlappingFoods());
    if (overlappingObjects.length == 0) {
        // currrent collidiont object is either undefined or something
        yang.memory_.colliding_obj = undefined;
    } else {
        if (typeof yang.memory_.colliding_obj != "undefined") {
            //filter out old encounter
            overlappingObjects = overlappingObjects.filter(function(object) {return object != yang.memory_.colliding_obj;});
        }
        if (overlappingObjects.length != 0) {
            //new encounter
            yang.memory_.colliding_obj = overlappingObjects[0];
            //TO DO
            if ((yang.memory_.colliding_obj instanceof Entity) 
                && yang.memory_.colliding_obj.isEdible == false) {
                yang.addMemory("Bumped into " + yang.memory_.colliding_obj.name);
            }
            yang.collision(yang.memory_.colliding_obj);//fire events
        }
    }
}
/**
 * game system manipulator
 * @override
 * @function yang.basicUpdate
 * @memberOf yang
 */
yang.basicUpdate = function() {
    yang.pre_update();    
    //trigger collision events first before doing any calculation
    yang.genericUpdate();//yang.collisionCheck() are included
    //Update Goal here
    //
    //
    //
    // yang.goal_.add(new Goal("No Goal")); 
    // yang.production_.direction = [];
    //
    //
    //
    //
    //update non motion related parts of state machine
    if (!yang.test_.test_ongoing) {
        yang["mental_task_node"].always_fun();
        yang.fun_.AImotion_always_fun();
    }
    //for zeleport
    //TO DO redesign
    if (!yang.basicupdate_disable) {
        if (yang.unstable) {
            yang.body.speed = yang.temp_speed;
            yang.unstable = false;
        }
        game.physics.arcade.velocityFromRotation(
            this.sprite.rotation,
            this.sprite.body.speed,
            this.sprite.body.velocity);
    } else {
        yang.basicupdate_disable = false;
    }
    //music
    if (yang.BGM_is_allowed) {
        //play or pause BGM depend on if bot is selected
        if (typeof yang.memory_.antler_caressed_bots.find(
                function (object) {
                    return object == bots[currentBotIndex]; //condition
                }
            ) != "undefined") {
            yang.fun_.playsound(sounds.rand_BGM, false, true);
        } else {
            yang.fun_.playsound(sounds.rand_BGM, true, true);
        }
    }
    yang.wrapup_update();
    //TO DO:
    //declare death
    //reset bot
};
/**
 * game system manipulator
 * @override
 * @function yang.basicUpdate
 * @memberOf yang
 */
yang.update = function() {
    //update when player is not controlling
    if (yang.test_.test_ongoing) {
        yang.test_.node_test();
    } else {
        yang["mental_task_node"].current_fun();
        yang.fun_.AImotion_current_fun(); //Main Cycle of movement
        //fire production for rotation
    }
    /*
    //TO DO redesign
    //temperory solution before rotation nodes are made
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .10) {
        yang.incrementAngle(4);
    } else if (yang.chaosmachine_.chance >= .90) {
        yang.incrementAngle(-4);
    }
    */
    yang.basicUpdate();
};
/**
 * game system manipulator's helper
 * @function yang.pre_update
 * @memberOf yang
 */
yang.pre_update = function() { // a reoccouring event...
    //sort food
    yang.memory_.uneaten_food.sort(yang.fun_.sort_by_shorter_distance);
    //update text
    yang.text_.rotationText = "Rotation= " + Math.round(yang.body.rotation) +
        " Vs Angle(degree)= " + Math.round(yang.body.angle / Math.PI * 180);
    yang.text_.motionText = "Speed= " + yang.body.speed;
    yang.control = (cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown);
    yang.chaosmachine_.chance = 0;
};

/**
 * game system manipulator's helper
 * used to reset contemporary variables
 * @function yang.wrapup_update
 * @memberOf yang
 */
yang.wrapup_update = function() { // a reoccouring event...

};
/**
 * game system manipulator
 * @function yang.pre_update
 * @memberOf yang
 */
yang.onesec_timedEvend = function() {
    //randomness
    yang.chaosmachine_.randomness += Math.round((Math.random() - 0.2) * 10);
    yang.chaosmachine_.randomness = Math.min(200, yang.chaosmachine_.randomness);
    //prime
    yang.biomachine_.metaresources_prime -= 2 * Math.round(yang.body.speed / 150); //change depend on speed
    yang.biomachine_.metaresources_prime = Math.round(yang.biomachine_.metaresources_prime);
    yang.biomachine_.metaresources_prime = Math.min(200, yang.biomachine_.metaresources_prime);
    yang.biomachine_.metaresources_prime = Math.max(0, yang.biomachine_.metaresources_prime);
    //secondary
    yang.biomachine_.metaresources_secondary -= 1;
    yang.biomachine_.metaresources_secondary = Math.min(200, yang.biomachine_.metaresources_secondary);
    yang.biomachine_.metaresources_secondary = Math.max(0, yang.biomachine_.metaresources_secondary);
    //empty
    yang.mindmachine_.emptyness += 5;
    yang.mindmachine_.emptyness = Math.min(200, yang.mindmachine_.emptyness);
    yang.mindmachine_.emptyness = Math.max(0, yang.mindmachine_.emptyness);
    //inspiration
    yang.mindmachine_.inspiration -= 1;
    yang.mindmachine_.inspiration = Math.min(200, yang.mindmachine_.inspiration);
    yang.mindmachine_.inspiration = Math.max(0, yang.mindmachine_.inspiration);
    //speical markov chain update
    yang.MRGPRB4.update();
    //ultility
    yang.ultility_sum_.ulti.value = yang.ultility_sum_.ulti.value * 0.9;
    yang.ultility_sum_.ulti.add(yang.ultility_sum_.pleasure.value);
    yang.ultility_sum_.ulti.subtract(yang.ultility_sum_.pain.value);
    yang.ultility_sum_.pleasure.value = yang.ultility_sum_.pleasure.value * 0.7;
    yang.ultility_sum_.pain.value = yang.ultility_sum_.pain.value * 0.7;
    //TODO : redesign//Motions.zeleport.apply(yang)
    //clear interactive messages
    yang.text_.interactiveText = "";
    //memory update
    yang.updateNetwork();
};

yang.onemin_timedEvend = function () { //TODO do not setup event here. setup as part of a function / module
    //empty most of memory
    if (yang.memory_.friendly_bots.length > 0) {
        yang.memory_.friendly_bots = [yang.memory_.friendly_bots[yang.memory_.friendly_bots.length-1]];
    }
    if (yang.memory_.unfriendly_bots.length > 0) {
        yang.memory_.unfriendly_bots = [yang.memory_.unfriendly_bots[yang.memory_.unfriendly_bots.length-1]]; 
    }
};
/**
 * remembered object and etc
 * @memberOf yang.fun_
 */
yang.fun_.distance_between_us = function (encounteredobject) {
    if (typeof encounteredobject.sprite != "undefined"
        && encounteredobject.sprite.x > 0
        && encounteredobject.sprite.y > 0) {
        return game.physics.arcade.distanceBetween(encounteredobject.sprite, yang.sprite); 
    }
    return undefined;
};
/**
 * called in every reaction
 * @memberOf yang.fun_
 */
yang.fun_.reactive_wrapup = function () {
    fireProductions(yang.production_.inter_reactivememorization);
    yang.collision_bene_flag = false;
    yang.collision_ouch_flag = false;
    yang.collision_nice_flag = false;
};
/**
 * sort condition
 * @memberOf yang.fun_
 */
yang.fun_.sort_by_shorter_distance = function (a,b) { 
    //a has shorter distance than b, then return a negative number, a will have a smaller index
    return yang.fun_.distance_between_us(a) - yang.fun_.distance_between_us(b);
};
/**
 * sort condition
 * @memberOf yang.fun_
 */
yang.fun_.sort_by_greater_distance = function (a,b) { 
    return yang.fun_.distance_between_us(b) - yang.fun_.distance_between_us(a);
};
/**
 * condition of find
 * @memberOf yang.fun_
 */
yang.fun_.find_colliding_obj = function (object_in_array) {
     return object_in_array == yang.memory_.colliding_obj;
}
/**
 * play sound
 * @function yang.fun_.playsound
 * @param {object} sound object created by game
 * @memberOf yang.fun_
 */
yang.fun_.playsound = function (sound_object, privacy = false, is_continuous = false) {
    if (typeof privacy != "undefined" && privacy 
        && bots[currentBotIndex] != yang) {
        //stop or pause or do not start to play
        if (sound_object.isPlaying 
            && typeof sound_object.is_playing_by_yang != "undefined"
            && sound_object.is_playing_by_yang) {
            if (typeof is_continuous != "undefined"
                && is_continuous) {
                if (sound_object.volume == 1) {
                    sound_object.fadeTo(500, 0.2);
                } else if (sound_object.volume <= 0.2) {
                    sound_object.pause();
                }
            } else {
                sound_object.stop();            
            }
        }     
    } else if (typeof sound_object.is_playing_by_yang == "undefined"
        || !sound_object.is_playing_by_yang) {
        //resume or play
        sound_object.is_playing_by_yang = true;
        if (sound_object.paused) {
            sound_object.resume();
            sound_object.fadeTo(550, 1);
        } else {
            sound_object.play();        
        }
    } else if (!sound_object.isPlaying) {
        //not private, not playing, then definitely not by me
        sound_object.is_playing_by_yang = false;
    }
};
/**
 * pause, play sounds to player, stop after a while
 * @param  {Bot}
 */
yang.fun_.audienceadd_BGM_antlerblessing = function (blessedbot) {
    var whattosay = "I grant you a temporary premission of the spiritual connection. Is it a curse, or a blessing?";
    yang.speak(blessedbot, whattosay);
    if (bots[currentBotIndex] == blessedbot ) {
        yang.memory_.antler_caressed_bots.push(blessedbot);
        //last 1 minute in max
        game.time.events.add(
            Phaser.Timer.SECOND * 10, 
            function() {
                yang.memory_.antler_caressed_bots = 
                yang.memory_.antler_caressed_bots.filter(function (object) {
                    return object !== blessedbot; 
                });//make sure its not there
            }, 
            yang);
    }
};

/**
 * BGM Path
 * @return {String} [path of file]
 */
yang.fun_.generate_BGM_path = function () {
    var list_of_paths = [
        'assets/A Magnificent Sight.mp3',
        'assets/At the End of the Wait.mp3',
        'assets/At the End of the Wait.mp3',
        'assets/Belfast.mp3',
        'assets/coockiecatinstrumental.m4a',
        'assets/Counter-Attack of Light (Shadowy Requiem).mp3',
        'assets/Do not Tease Me.mp3',
        'assets/Friend of solitude and loneliness.mp3',
        'assets/Mischievous Soul.mp3',
        'assets/Nameless Tombstone.mp3',
        'assets/okkusenman.mp3',
        'assets/Old Heros Visage.mp3',
        'assets/Shadow of Early Dawn.mp3',
        'assets/Soul of Freedom.mp3',
        'assets/Tale that was not told.mp3',
        'assets/The Dance of Leaves.mp3',
        'assets/The Final Stand.mp3',
        'assets/The Star above Falias.mp3',
        'assets/The Story of a White Deer.mp3',
        'assets/Unspeakable Evil.mp3',
        'assets/Viridian Emerald.mp3'
    ];
    return  list_of_paths[Math.round(Math.random() * (list_of_paths.length - 1))];
}
yang.BGM = yang.fun_.generate_BGM_path();//must declare befor load
/**
 * collision
 * @param {Object}
 * @memberOf yang
 * @Override
 */
yang.collision = function(object) {//collision
    for (var brakeloop = 0; brakeloop < 2; brakeloop++) {    
        yang.node_.brake.brake();
    }
    //fire interactive productions
    if (yang.test_.test_ongoing) {
        fireProductions(yang.test_.test_production);
    } else {
        fireProductions(yang.production_.inter_action);
        fireProductions(yang.production_.inter_reaction);
    }
    //speak
    if (yang.text_.interactiveText != "")
    {
        yang.speak(object, yang.text_.interactiveText);
    }
};
/**
 * edibility
 * @param  {Object} fun_object [description]
 * @return {Bool}
 */
yang.fun_.edible = function (fun_object) {
    return (fun_object instanceof Entity) 
        && (fun_object.isEdible == true)
        && ((fun_object.name.toLowerCase()).search("berry") > 0
        || (fun_object.name.toLowerCase()).search("fruit") > 0);
};
/**
 * [findFood description]
 * @param  {Number} radius
 * @param  {Function} edibilityFunction
 * @return {Object} Food item
 */
yang.findFood = function(radius = 200, edibilityFunction = yang.fun_.edible) {
    var nearbyFoods = this.getNearbyObjects(radius).filter(
        function(object) {
            return edibilityFunction(object);
        }
    );
    if (nearbyFoods.length > 0) {
        this.pursue(nearbyFoods[0]);
    }
};
/**
 * called by init_plus
 * push actions and reactions into list
 * @param {Object}
 * @memberOf yang.fun_
 */
yang.fun_.makeProductions = function() {
    yang.production_.inter_action.push(
        new Production(
                yang.node_.feast_upon.name,
                yang.node_.feast_upon.priority,
                yang.node_.feast_upon.condition,
                yang.node_.feast_upon.action
        ),
        new Production(
                yang.node_.memorize_uneaten_food.name,
                yang.node_.memorize_uneaten_food.priority,
                yang.node_.memorize_uneaten_food.condition,
                yang.node_.memorize_uneaten_food.action
        ),
        new Production(
                yang.node_.recognization.name,
                yang.node_.recognization.priority,
                yang.node_.recognization.condition,
                yang.node_.recognization.action
        )
    );
    yang.production_.inter_reactivememorization.push(
        new Production(
                yang.node_.memorize_friendly_bot.name,
                yang.node_.memorize_friendly_bot.priority,
                yang.node_.memorize_friendly_bot.condition,
                yang.node_.memorize_friendly_bot.action
        ),
        new Production(
                yang.node_.memorize_unfriendly_bot.name,
                yang.node_.memorize_unfriendly_bot.priority,
                yang.node_.memorize_unfriendly_bot.condition,
                yang.node_.memorize_unfriendly_bot.action
        ),
        new Production(
                yang.node_.memorize_benefactor_bot.name,
                yang.node_.memorize_benefactor_bot.priority,
                yang.node_.memorize_benefactor_bot.condition,
                yang.node_.memorize_benefactor_bot.action
        )
    );
    yang.production_.inter_reaction.push(
        new Production(//example
                yang.def_node.name,
                yang.def_node.priority,
                yang.def_node.condition,
                yang.def_node.action
        )
    );
    yang.production_.direction.push(
        new Production(//example
                yang.def_node.name,
                yang.def_node.priority,
                yang.def_node.condition,
                yang.def_node.action
        )
    );
    yang.test_.test_production.push(
        new Production(//example
                yang.def_node.name,
                yang.def_node.priority,
                yang.def_node.condition,
                yang.def_node.action
        )
    );
};
/**
 * Additional Helper functions - Wrapper
 * @function yang.fun_.AImotion_current_fun
 * @memberOf yang.fun_
 */
yang.fun_.AImotion_current_fun = function() { //this is the current state
    yang["speed_node"].current_fun();
    yang["acceleration_node"].current_fun();
    //yang["rotation_node"].current_fun();
};
/**
 * Additional Helper functions - Wrapper
 * @function yang.fun_.AImotion_always_fun
 * @memberOf yang.fun_
 */
yang.fun_.AImotion_always_fun = function() { //this is the current state
    //wherever in here shouldn't affect control
    yang["speed_node"].always_fun();
    yang["acceleration_node"].always_fun();
    //yang["rotation_node"].always_fun();
};
/**
 * MRGPRB4 is a type of neuron that decide interaction events
 * @memberOf yang
 * @type {MarkovProcess}
 */
yang.MRGPRB4 = new MarkovProcess("wary");
yang.MRGPRB4.add("wary", [
    ["wary", "alert", "demanding", "empathetic", "annoyed"],
    [.995, .0025, .001, .0005, .001]
]);
yang.MRGPRB4.add("empathetic", [
    ["empathetic", "annoyed"],
    [.995, .005]
]);
yang.MRGPRB4.add("demanding", [
    [ "demanding", "empathetic", "wary"],
    [.995, .0025, .0025]
]);
yang.MRGPRB4.add("alert", [
    ["alert", "annoyed"],
    [.995, .005]
]);
yang.MRGPRB4.add("annoyed", [
    ["annoyed", "wary"],
    [.995, .005]
]);
////////////////////////////
//Inter-reaction Override //
////////////////////////////
/**
 * hear
 * @param {Object}
 * @param {String}
 * @memberOf yang
 * @Override
 */
yang.hear = function (botWhoSpokeToMe, whatTheySaid) {
    if (botWhoSpokeToMe != yang) {
        yang.text_.interactiveText = "mimic* " + botWhoSpokeToMe.name + ":" + whatTheySaid;
    }   
};
/**
 * highFived
 * @memberOf yang
 * @Override
 */
yang.highFived = function(botWhoHighFivedMe) {
    yang.biomachine_.metaresources_secondary += 10;
    yang.collision_nice_flag = true;
    yang.addMemory("highFived with" + botWhoHighFivedMe.name);
    yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate(10));
    yang.fun_.reactive_wrapup();
}
/**
 * Override to bitten reaction 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBitedMe The bot that bit me
 * @param {Number} damage The amount of damage done
 */
yang.gotBit = function(botWhoBitedMe, damage) {
    yang.biomachine_.metaresources_prime -= damage * 5;
    yang.collision_ouch_flag = true;
    yang.addMemory("biten by" + botWhoBitedMe.name);
    yang.ultility_sum_.pain.add(yang.fun_.utility_value_calculate(10));
    yang.fun_.reactive_wrapup();
};
/**
 * Override to antler_caressed reaction 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhocaresedMe The bot that bit me
 * @param {String} text message
 */
yang.antler_caressed = function(botWhocaresedMe, message) {
    // whoelse would do this?
    yang.collision_bene_flag = true;
    yang.fun_.reactive_wrapup();
};
/**
 * Override to gotCrushed reaction
 * @memberOf yang
 * @Override 
 * @param {Bot} botWhoCrushMe The bot that bit me
 */
yang.gotCrushed = function(botWhoCrushMe) {
    //lose significant amount of resources
    yang.biomachine_.metaresources_prime -= 100;
    yang.biomachine_.metaresources_secondary -= 100;
    yang.collision_ouch_flag = true;
    yang.addMemory("crushed by" + botWhoCrushMe.name);
    yang.ultility_sum_.pain.add(yang.fun_.utility_value_calculate(200));
    yang.fun_.reactive_wrapup();
};
/**
 * Override to react when bowed down to 
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBowed bot who bowed down to me
 */
yang.gotBow = function(botWhoBowed) {
    //secondary resources++
    yang.collision_bene_flag = true;
    yang.collision_nice_flag = true;
    yang.addMemory("bowed with" + botWhoBowed.name);
    yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate());
    yang.fun_.reactive_wrapup();
};
/**
 * Override to react when got Licked
 * @memberOf yang
 * @Override
 * @param {Bot} botWhoBowed bot who bowed down to me
 */
yang.gotLicked = function(botWhoLickedMe) {
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .50) {
        yang.collision_ouch_flag = true;
        yang.ultility_sum_.pain.add(yang.fun_.utility_value_calculate());
    } else {
        yang.collision_nice_flag = true;
        yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate());
    }
    yang.addMemory("licked by" + botWhoLickedMe.name);
    yang.fun_.reactive_wrapup();
};
/**
 * Override to react when ignored
 * @memberOf yang
 * @Override
 * @param  {Bot} botWhoIgnoredToMe who ignored me
 */
yang.gotIgnored = function(botWhoIgnoredMe) {
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .50) {
        yang.collision_ouch_flag = true;
        yang.ultility_sum_.pain.add(yang.fun_.utility_value_calculate());
    } else {
        yang.collision_nice_flag = true;
        yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate());
    }
    yang.addMemory("ignored by" + botWhoIgnoredMe.name);
    yang.fun_.reactive_wrapup();
};
///////////////
//Nodes Zone //
///////////////
/**
 * Nodes constructor
 * @memberOf yang.fun_
 * @constructor
 * @param  {String} Node Type
 */
//default node constructor
yang.fun_.def_node_construct = function(node_type) { //arguement is string
    if (!new.target) throw "def_node_construct() must be called with new";
    //the methods are attempted to listed in an order of calling by game functions
    this.name = "Blank"; //production name
    this.type = node_type; //used for switch
    this.priority = Production.priority.Low; //for production
    this.description = "Default"; //used to write state text
    this.condition = function () { //for production
        return false; 
    };
    this.action = function () { //for production
    };
    this.init_fun = function() { //only call once
    };
    this.current_fun = function() { //player control sensitive
        //a switch
        if (false) {
            this.switch_to_this_node();
        }
    };
    this.always_fun = function() { //unrelated to player control
        //a switch
        if (false) {
            this.switch_to_this_node();
        }
    };
    //everyone node has a switch to itself, so other nodes can just call node method
    this.switch_to_this_node = function() {
        yang[this.type] = this;
        this.init_fun();
    };
};

/**
 * default node has type "void", and does nothing
 * @memberOf yang
 * @type {yang.fun_.def_node_construct}
 */
yang.def_node = new yang.fun_.def_node_construct("void");
////////////////////////////////////////////////////
//Base Speed Nodes                                //
//Base speed completely depends on meta resources //
////////////////////////////////////////////////////
/**
 * stop
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.stop_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.stop_node.description = "Deer's body doesn't feel energitic.",
yang.node_.stop_node.init_fun = function() {
    yang.node_.brake.switch_to_this_node();
};
yang.node_.stop_node.current_fun = function() { //unrelated to control
    if (yang.biomachine_.metaresources_prime >= 50) {
        yang.node_.slow_node.switch_to_this_node();
    }
};
/**
 * slow
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.slow_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.slow_node.description = "Deer's body still has fuel.";
yang.node_.slow_node.init_fun = function() { //only call once
    yang.node_.wander.switch_to_this_node();
};
yang.node_.slow_node.current_fun = function() { //control sensitive   
    yang.body.speed = Math.max(100, yang.body.speed);
};
yang.node_.slow_node.always_fun = function() {   
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.stop_node.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 50) {
        yang.node_.fast_node.switch_to_this_node();
    }
};
/**
 * fast
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.fast_node = new yang.fun_.def_node_construct("speed_node");
yang.node_.fast_node.description = "Deer's body feels lighter than usual.";
yang.node_.fast_node.init_fun = function() { //only call once
    yang.node_.gallop.switch_to_this_node();
};
yang.node_.fast_node.current_fun = function() { //control sensitive   
    yang.body.speed = Math.max(200, yang.body.speed);
};
yang.node_.fast_node.always_fun = function() {
    if (yang.biomachine_.metaresources_secondary < 10) {
        yang.node_.slow_node.switch_to_this_node();
    }
};
////////////////////////////////////////////////////////////
//Acceleration Nodes                                      //
//switch of acceleration nodes depend on base speed nodes //
////////////////////////////////////////////////////////////
/**
 * TO DO : Production Chain instead
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.lay = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.lay.description = "Deer lays down and eat grass. Tastes terrible!";
yang.node_.lay.current_fun = function() { //control sensitive
    yang.node_.lay.description = "Deer lays down and eat grass. Tastes terrible!";
    yang.biomachine_.metaresources_prime += 0.1;
};
yang.node_.lay.always_fun = function() {
    if (yang.control) {
        this.description = "Deer pushes forward.";
    }
};
/**
 * brake
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.brake = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.brake.description = "";
yang.node_.brake.brake = function () {
    if (yang.body.speed > 0) {
        yang.body.speed = Math.floor(yang.body.speed * 9 / 10);
    }
}
yang.node_.brake.current_fun = function() { //control sensitive
    if (yang.body.speed <= 30) {
        yang.node_.lay.switch_to_this_node();
        yang.body.speed = 0;
    } else {
        yang.node_.lay.description = "Deer slows down.";
        yang.node_.brake.brake();
    }
};
yang.node_.brake.always_fun = function() {
    yang.node_.lay.always_fun();//only change description
};
/**
 * wander
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.wander = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.wander.description = "Deer wanders.";
yang.node_.wander.current_fun = function() { //control sensitive
    yang.chaosmachine_.chance = Math.random();
    if (yang.chaosmachine_.chance <= .50) {
        yang.body.speed += 5;
    } else if (yang.chaosmachine_.chance > .50) {
        yang.body.speed -= 4;
    }
    yang.chaosmachine_.chance = 0;
    //no switches
};
/**
 * gallop
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.gallop = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.gallop.description = "Deer is in motion.";
yang.node_.gallop.current_fun = function() { //control sensitive
    if (yang.mindmachine_.inspiration >= 70 && !yang.node_.leap.leap_loop) {
        yang.node_.leap.switch_to_this_node();
    }
    if (yang.body.speed < 300) {
        yang.chaosmachine_.chance = Math.random();
        if (yang.chaosmachine_.chance <= .50) {
            yang.body.speed += 2;
        } else if (yang.chaosmachine_.chance > .50) {
            yang.body.speed -= 1;
        }
        yang.chaosmachine_.chance = 0;
    }
};
/**
 * leap
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.leap = new yang.fun_.def_node_construct("acceleration_node");
yang.node_.leap.eap_loop = false;
yang.node_.leap.loop_counts = 0;
yang.node_.leap.leap_random = 0;
yang.node_.leap.description = "Berries allude Deer! Majestic!";
yang.node_.leap.init_fun = function() { //only call once   
    yang.node_.leap.leap_loop = true;
    yang.node_.leap.loop_counts = 50;
    yang.node_.leap.leap_random = Math.random();
};
yang.node_.leap.current_fun = function() { //control sensitive
    //continue leap till end
    //Todo: try simplify somehow, maybe use a timed event...watchout control
    if (yang.node_.leap.loop_counts > 41) {
        yang.body.speed += 75;
        yang.node_.leap.loop_counts -= 2;
    } else if (yang.node_.leap.loop_counts > 9) {
        yang.node_.leap.loop_counts -= 1;
    } else if (yang.node_.leap.loop_counts > 0) {
        yang.node_.brake.current_fun();
        yang.node_.leap.loop_counts -= 2;
    } else if (yang.chaosmachine_.chance > 0.5) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.5;
    } else if (yang.chaosmachine_.chance > 0.25) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.25;
    } else if (yang.chaosmachine_.chance > 0.1) {
        yang.node_.leap.loop_counts = 50;
        yang.chaosmachine_.chance -= 0.1;
    } else { //end leap motion
        yang.node_.leap.loop_counts = 0;
        yang.node_.leap.leap_loop = false;
        yang.node_.gallop.switch_to_this_node();
    }
};
////////////////////////////////////////////////////////////////////////
//Mental Task(Id-Ego-Super) Nodes                                     //
//mental task is independent from motions, use always _fun more often //
////////////////////////////////////////////////////////////////////////
/**
 * hunger
 * TO DO : eat production
 * TO DO : new philoberry Sense
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.id_prime_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.id_prime_focus.berry_game_obj = function() {
    this.home = [2700, 2700];
    this.berry_coord = [2700, 2700];
    this.berry_distance = 0; //calculate later
};
yang.node_.id_prime_focus.berry_game_obj_renew = function () {
    if ( yang.berry.berry_coord[0] != yang.memory_.uneaten_food[0].sprite.x 
        && yang.berry.berry_coord[1] != yang.memory_.uneaten_food[0].sprite.y) {
        yang.berry.berry_coord[0] = yang.memory_.uneaten_food[0].sprite.x;
        yang.berry.berry_coord[1] = yang.memory_.uneaten_food[0].sprite.y;
        return true;//return true if some change were made
    } else {
        return false;
    }
};
yang.node_.id_prime_focus.description = ""; //write by functions
yang.node_.id_prime_focus.current_fun = function () {
    yang.findFood(300, yang.fun_.edible);
};
yang.node_.id_prime_focus.always_fun = function() { //ignore control
    //find food from memory
    if (yang.memory_.uneaten_food.length > 0) {
        if (yang.node_.id_prime_focus.berry_game_obj_renew()) {
            yang.text_.interactiveText = "Someone just eat the food!~Quickly head to another one.";
            yang.speak(yang, yang.text_.interactiveText);//speak to myself does nothing
        } else {
            yang.node_.id_prime_focus.description = "Deer recalls a fruit or berry grew at ";
        }
    } else {//otherwise eat at home.
        this.berry_coord = [2700, 2700];
        yang.node_.id_prime_focus.description = "There are pies in the refrigerator. Deer's home is ";
    }
    yang.berry.berry_distance = Math.round(
        game.physics.arcade.distanceToXY(yang.sprite,
            yang.berry.berry_coord[0],
            yang.berry.berry_coord[1])
        );
    yang.node_.id_prime_focus.description += yang.berry.berry_distance + " pixels away.";
    if (this.berry_coord = [2700, 2700] && yang.berry.berry_distance < 50) {
        yang.biomachine_.metaresources_prime += 200;//eat at home
    }
    //switch check
    if (yang.biomachine_.metaresources_prime >= 50) { //belly filled
        if (Math.random() >= 0.5) {
            yang.node_.superego_brood_focus.switch_to_this_node();
        } else {
            yang.node_.superego_drain_focus.switch_to_this_node();
        }
    } else {
        //decrease pleasure
        yang.ultility_sum_.pleasure.subtract((50 - yang.biomachine_.metaresources_prime) * yang.ultility_sum_.translator);
        //increase pain
        yang.ultility_sum_.pain.add((50 - yang.biomachine_.metaresources_prime) * yang.ultility_sum_.translator);
    }
}; 
/**
 * moody
 * uses primary resources to transform emptyness into inspiration
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */ 
yang.node_.superego_brood_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.superego_brood_focus.description = "The life is in general disappointing, but Deer is still appreciating. What are holy and profane?";
yang.node_.superego_brood_focus.init_fun = function() { //only call once 
    yang.biomachine_.metaresources_prime -= yang.chaosmachine_.randomness;
    yang.mindmachine_.emptyness -= yang.chaosmachine_.randomness;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;
};
yang.node_.superego_brood_focus.always_fun = function() { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.biomachine_.metaresources_secondary >= 90) {
        yang.node_.superego_drain_focus.switch_to_this_node();
    } else {//if can't switch
        //decrease pleasure
        yang.ultility_sum_.pleasure.subtract(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
        //also decrease pain
        yang.ultility_sum_.pain.subtract(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
    } 
};
/**
 * drain
 * uses secondary resources for inspiration at high cost
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */ 
yang.node_.superego_drain_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.superego_drain_focus.description = "The life has been fair, but a deer always desires better.";
yang.node_.superego_drain_focus.init_fun = function() { //only call once 
    yang.biomachine_.metaresources_secondary -= yang.chaosmachine_.randomness * 3;
    yang.mindmachine_.inspiration += yang.chaosmachine_.randomness;
    yang.chaosmachine_.randomness = 0;
};
yang.node_.superego_drain_focus.always_fun = function() { //control sensitive
    if (yang.biomachine_.metaresources_prime < 10) {
        yang.node_.id_prime_focus.switch_to_this_node();
    } else if (yang.mindmachine_.emptyness >= 90) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    } else if (yang.mindmachine_.inspiration >= 50) {
        yang.node_.id_secondary_focus.switch_to_this_node();
    } else {
        //increase pleasure
        // yang.ultility_sum_.pleasure.add(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
        //also increase pain
        // yang.ultility_sum_.pain.add(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
    }
};
/**
 * void
 * gain secondary resources from pleasant social event
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.id_secondary_focus = new yang.fun_.def_node_construct("mental_task_node");
yang.node_.id_secondary_focus.description = "No one catches Deer~";
yang.node_.id_secondary_focus.init_fun = function() { //only call once
    yang.node_.id_secondary_focus.new_task = new yang.tag_game_obj();
};
yang.node_.id_secondary_focus.current_fun = function() {
    yang.node_.id_secondary_focus.new_task.run_away_from_it(yang.node_.id_secondary_focus.new_task.it);
    yang.node_.id_secondary_focus.new_task.run_toward_target(yang.node_.id_secondary_focus.new_task.target);
};
yang.node_.id_secondary_focus.always_fun = function() { //control sensitive
    if (yang.fun_.distance_between_us(yang.node_.id_secondary_focus.new_task.target) < 50) {
        yang.biomachine_.metaresources_secondary += yang.chaosmachine_.randomness;
        if (typeof yang.memory_.friendly_bots.find(yang.fun_.find_colliding_obj) != "undefined") {
            //if its a friend, then bonus 50%       
            yang.biomachine_.metaresources_secondary += yang.chaosmachine_.randomness / 2;
        }
        yang.chaosmachine_.randomness = 0;
        yang.node_.id_secondary_focus.init_fun();
    }
    if (yang.fun_.distance_between_us(yang.node_.id_secondary_focus.new_task.it) < 50) {
        yang.biomachine_.metaresources_secondary -= yang.chaosmachine_.randomness;
        yang.chaosmachine_.randomness += 50;
        yang.node_.id_secondary_focus.init_fun();
    }
    //switch check
    if (yang.mindmachine_.emptyness >= 90) {
        yang.node_.superego_brood_focus.switch_to_this_node();
    } else {
        //increase pleasure
        yang.ultility_sum_.pleasure.add(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
        //also decrease pain
        yang.ultility_sum_.pain.subtract(yang.biomachine_.metaresources_secondary * yang.ultility_sum_.translator);
    }
};
//////////////////////////////
//Micro Rotation Production //
//////////////////////////////
/*
yang.node_.go_home
yang.node_.run_away
yang.node_.bumpinto
yang.node_.
*/

//////////////////////////
//Inter-action Override //
//////////////////////////
yang.antler_caress = function (botTocaress, message = "Thou are Caressed by mystical antler, thus blessed by the wisps that lives on them.") {
    yang.fun_.audienceadd_BGM_antlerblessing(botTocaress);    
    botTocaress.antler_caressed();
};


////////////////////////////
//Inter-action Production //
////////////////////////////
/**
 * eat
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.feast_upon = new yang.fun_.def_node_construct("production_node");
yang.node_.feast_upon.name = "fiesta";
yang.node_.feast_upon.priority = Production.priority.High;
yang.node_.feast_upon.condition = function () {
    return yang.fun_.edible(yang.memory_.colliding_obj)
        && yang["mental_task_node"] == yang.node_.id_prime_focus;
};
yang.node_.feast_upon.action = function() {
    for (var brakeloop = 0; brakeloop < 2; brakeloop++) {    
        yang.node_.brake.brake();
    } 
    yang.biomachine_.metaresources_prime += yang.memory_.colliding_obj.calories;
    //increase pleasure
    yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate(10));
    if (yang.memory_.colliding_obj.name = "Philoberry") {
        yang.mindmachine_.inspiration += 50;
        yang.mindmachine_.emptyness -= 50;
    }
    yang.memory_.colliding_obj.eat();//a function of food
};
/**
 * memorize food if not hungry
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.memorize_uneaten_food = new yang.fun_.def_node_construct("production_node");
yang.node_.memorize_uneaten_food.name = "memorize_uneaten_food";
yang.node_.memorize_uneaten_food.priority = Production.priority.High;
yang.node_.memorize_uneaten_food.condition = function () {//I think problem is here
    return yang.fun_.edible(yang.memory_.colliding_obj)
        && yang["mental_task_node"] != yang.node_.id_prime_focus
        && typeof yang.memory_.uneaten_food.find(yang.fun_.find_colliding_obj) == "undefined";
};
yang.node_.memorize_uneaten_food.action = function () {
    yang.memory_.uneaten_food.push(yang.memory_.colliding_obj);
    yang.text_.interactiveText += "I'm not hungry. ";//not a hungry comment
    yang.ultility_sum_.pleasure.add(yang.fun_.utility_value_calculate());  
};
/**
 * memorize bot if friendly
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.memorize_friendly_bot = new yang.fun_.def_node_construct("production_node");
yang.node_.memorize_friendly_bot.name = "add a New Friend to network";
yang.node_.memorize_friendly_bot.priority = Production.priority.Medium;
yang.node_.memorize_friendly_bot.condition = function () {
    return (yang.memory_.colliding_obj instanceof Bot)
        && yang["mental_task_node"] != yang.node_.id_secondary_focus
        && yang.collision_nice_flag == true
        && typeof yang.memory_.friendly_bots.find(yang.fun_.find_colliding_obj) == "undefined"
        && typeof yang.memory_.unfriendly_bots.find(yang.fun_.find_colliding_obj) == "undefined";
};
yang.node_.memorize_friendly_bot.action = function () {
    yang.memory_.friendly_bots.push(yang.memory_.colliding_obj);
    yang.text_.interactiveText += "Good to meet you! ";//friendly comment 
};
/**
 * memorize bot if unfriendly
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.memorize_unfriendly_bot = new yang.fun_.def_node_construct("production_node");
yang.node_.memorize_unfriendly_bot.name = "add a bot to blacklist";
yang.node_.memorize_unfriendly_bot.priority = Production.priority.Low;
yang.node_.memorize_unfriendly_bot.condition = function () {
    return (yang.memory_.colliding_obj instanceof Bot)
        && yang.collision_ouch_flag == true
        && typeof yang.memory_.friendly_bots.find(yang.fun_.find_colliding_obj) == "undefined"
        && typeof yang.memory_.unfriendly_bots.find(yang.fun_.find_colliding_obj) == "undefined";
};
yang.node_.memorize_unfriendly_bot.action = function () {
    yang.memory_.unfriendly_bots.push(yang.memory_.colliding_obj);
    yang.text_.interactiveText += "~~~Ughhh~~ ";//unfriendly comment 
};
/**
 * memorize bot if it is a benefiting relationship
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.memorize_benefactor_bot = new yang.fun_.def_node_construct("production_node");
yang.node_.memorize_benefactor_bot.name = "add a bot to benefitlist";
yang.node_.memorize_benefactor_bot.priority = Production.priority.High;
yang.node_.memorize_benefactor_bot.condition = function () { 
    return (yang.memory_.colliding_obj instanceof Bot)
        && yang.collision_bene_flag == true
        && typeof yang.memory_.bene_bots.find(yang.fun_.find_colliding_obj) == "undefined";
};
yang.node_.memorize_benefactor_bot.action = function () {
    yang.memory_.bene_bots.push(yang.memory_.colliding_obj);
    yang.text_.interactiveText += "Thanks. ";//unfriendly comment 
};
/**
 * Say the Name
 * @memberOf yang.node_
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.recognization = new yang.fun_.def_node_construct("production_node");
yang.node_.recognization.name = "Say the name";
yang.node_.recognization.priority = Production.priority.Low;
yang.node_.recognization.condition = function () {
    return typeof yang.memory_.colliding_obj.name != "undefined";
};
yang.node_.recognization.action = function () {
    yang.text_.interactiveText += yang.memory_.colliding_obj.name + ". ";//unfriendly comment 
};

//////////////////////////////
//Inter-reaction Production //
//////////////////////////////

//primary
//
//recency


/////////////////////////////////////////////////////
//TODO : RECycle   NBGMusic Production             //
/////////////////////////////////////////////////////
/**
 * Play
 * id_prime_focus X wary
 * @type {yang.fun_.def_node_construct}
 */
yang.node_.play_BGM_04 = new yang.fun_.def_node_construct("production_node");
yang.node_.play_BGM_04.name = "Shadowy Requiem";
yang.node_.play_BGM_04.priority = Production.priority.high;
yang.node_.play_BGM_04.condition = function () {
    var condition_bool = yang.MRGPRB4.current == "wary" && yang["mental_task_node"] == yang.node_.id_prime_focus;
    if (!condition_bool) {
        sounds.yang_BGM_04.stop();
    }
    return condition_bool;
};
yang.node_.play_BGM_04.action = function () {
    yang.fun_.playsound(sounds.yang_BGM_04, true, true);
};
//////////////
//Test Zone //
//////////////
/**
 * unfinished tag game
 * @memberOf yang
 */
yang.tag_game_obj = function() {
    this.it = yang.getRandomBot(); //index in the bots
    this.run_away_from_it = function (it_obj) {
        yang.faceAwayFrom(it_obj); 
    };
    this.target = yang.getNearbyBots();
    this.run_toward_target = function (target_obj) {
        yang.orientTowards(target_obj);     
    };
};
/**
 * colliding_obj will return an immediate utility feed back
 * called in collsion events after flags is up
 * @memberOf yang.fun_
 */
yang.fun_.utility_value_calculate = function (u_value = 0) {
    //u_value is always positive, but multiplier isn't
    var multiplier = 1;
    //simulate primary effect
    if (yang.collision_ouch_flag) {
        multiplier ++;
    } else {
        if (yang.collision_bene_flag) {
            multiplier ++;
        }
        if (yang.collision_nice_flag) {
            multiplier ++;
        }
    }
    if (yang.fun_.edible(yang.memory_.colliding_obj)) {
        if (typeof yang.memory_.uneaten_food.find(yang.fun_.find_colliding_obj) == "undefined") {
            //not eaten, then add diminishing values
            var how_many_food_already = 1;
            if (yang.memory_.uneaten_food.length != 0) {
                how_many_food_already = yang.memory_.uneaten_food.length;
            }
            u_value += yang.memory_.colliding_obj.calories / how_many_food_already;
        } else { 
            //eaten
            u_value += yang.memory_.colliding_obj.calories;
        }
    } else if (!(yang.memory_.colliding_obj instanceof Bot)) {
        if (yang.memory_.colliding_obj.name == "Treehouse") {
            u_value += 50; // welcome home bonus
        }
    } else if (yang.memory_.colliding_obj instanceof Bot) {
        if (typeof yang.memory_.bene_bots.find(yang.fun_.find_colliding_obj) == "undefined") {
            u_value += 10;
        } else if (typeof yang.memory_.friendly_bots.find(yang.fun_.find_colliding_obj) == "undefined") {
            u_value += 20;
        } else if (typeof yang.memory_.unfriendly_bots.find(yang.fun_.find_colliding_obj) == "undefined") {
            u_value += 40;
        }
    }
    return u_value * multiplier;
}

/**
 * 
 * @return {Object} not Bot but collidable entities or food
 */
yang.fun_.find_closest_object = function () {
     /* body... */ 
     return;
}
/**
 * Test - Update
 * @function yang.test_.node_test
 * @memberOf yang.test_
 */
yang.test_.node_test = function() { // test with a permanate state

    //single run node test 

    if (yang.test_.ini === 0) {
        yang.chaosmachine_.randomness = 0;
        yang.biomachine_.metaresources_prime = 1;
        yang.biomachine_.metaresources_secondary = 100;
        yang.mindmachine_.emptyness = 0;
        yang.mindmachine_.inspiration = 0;
        //test node
        //yang.test_.current_testnode = yang.node_.play_BGM_00;
        yang.test_.current_testnode.condition();
        yang.test_.current_testnode.action();
        //call function of the tested node here
        yang.test_.ini++;
        yang.watch_time = game.time.totalElapsedSeconds();
    }
    //song is_continuous demostration
    //yang.test_.current_testnode.action();
};
/**
 * Test - timeevent
 * @function yang.test_.timed_test
 * @memberOf yang.test_
 */
yang.test_.timed_test = function() {
};
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var loadingText;

function preload()
{
    this.game.stage.scale.pageAlignHorizontally = true;
    this.game.stage.scale.pageAlignVeritcally = true;
    this.game.stage.scale.refresh();
    
     var lt = "THE PIG THAT WENT TO MARKET \n The aim of the game is to collect all of the jam jars\n Before the wolf catches you. \n Made in 48 hours for BaconGameJam 7 \n by UnacceptableUse and teknogeek\n\n\n\n\n\n"
    loadingText = game.add.text(0 ,0,lt +" Loading Images..", { font: "26px Lithos Pro Regular", fill: '#ffffff', align: "center" });

    game.load.image('bg', 'assets/bg.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('fence', 'assets/fence.png');
    game.load.image('bacon', 'assets/bacon.png');
    game.load.image('platform', 'assets/platform.png');
    game.load.image('floor', 'assets/floor.png');
    
    loadingText.destroy();
    loadingText = game.add.text(0 ,0,lt +" Loading Spritesheets..", { font: "26px Lithos Pro Regular", fill: '#ffffff', align: "center" });
    
    game.load.spritesheet('wolf', 'assets/wolf.png', 20, 28);
    game.load.spritesheet('dude', 'assets/pigout.png', 42, 44);
    game.load.spritesheet('fightkk', 'assets/fight.png', 45, 22);
    game.load.spritesheet('dropper', 'assets/grandma.png', 36, 42);
    game.load.spritesheet('foods', 'assets/foods.png', 50, 23);
    game.load.spritesheet('jamjars','assets/jars.png', 26, 25);
    game.load.spritesheet('icons','assets/icons.png', 32, 32);
    
    loadingText.destroy();
    loadingText = game.add.text(0 ,0,lt +" Loading Sounds..", { font: "26px Lithos Pro Regular", fill: '#ffffff', align: "center" });
    
    game.load.audio('crunch1', ['assets/crunch1.mp3']);
    game.load.audio('crunch2', ['assets/crunch2.mp3']);
    game.load.audio('collect', 'assets/collect.wav');
    
    loadingText.destroy();
     loadingText = game.add.text(0 ,0,lt +" Loading...", { font: "26px Lithos Pro Regular", fill: '#ffffff', align: "center" });
}

//ENTITIES
var player;
var grandma;
var wolf;
var jamJar;
var deathAnimation;

//ENVIRONMENT
var platforms;
var fences;
var bacons;
var grayCover;
var grandmaTween;

//UI ELEMENTS
var UIlives;
var UIlevel;
var UIscore;
var UIjars;


//CONTROL
var cursors;
var spaceKey;
var wKey;
var aKey;
var sKey;
var dKey;
var enterKey;

//TABLES
var baconLevel1;
var baconLevel2;
var baconLevel3;
var baconLevel4;
var baconLevel5;
var calories = 
[
    250,  //BACON
    158,  //BANANA
    34,  //MELON
    23,  //PLANT POT
    66,  //COOKIE
    130,  //CHEESE
    128,  //PORK OR SOMETHING
    8,    //BONE
    50,    //STAWBERRY
    2,    //ICE CUBE
    15,    //APPLE
    210,    //TACO
    32,    //ONE OF THOSE PURPLE THINGS
    5,    //LETTUCE
    129,    //CHEESE AGAIN??
    150     //IDK PANCAKE OR SOMETHING
];


//DEBUG STAT NUMBERS
var touchDown;
var touchX;
var touchY;
var mouseX;
var mouseY;

//SOUNDS
var crunch1;
var crunch2;
var collectJar;

//LEVEL VARS
var levelComplete;
var score = 0;
var totalScore = 0;
var lives = 4;
var lastLives = 4;
var jarsCollected = 0;
var levelScore = 0;
var currentLevel = 1;
var grandmaDropChance = 50;
var wolfSpeed = 150;
var wolfJump = 350;
var gameOver = false;


//TEXT
 var scoreText;
// var playerPos;
// var mousePosText;
var winText;
var levelText
var totalText;

function create()
{
    loadingText.destroy();
    game.stage.backgroundColor = '#84F4FF';
    game.add.sprite(0, 0, 'bg');

    platforms = game.add.group();
    fences = game.add.group();


    var ground = platforms.create(0, 80, '');
    ground.body.immovable = true;
    
    ground = platforms.create(0,568, 'floor');
    ground.body.immovable = true;
    
    crunch1 = game.add.audio('crunch1');
    crunch2 = game.add.audio('crunch2');
    collectJar = game.add.audio('collect');
    
    var shape = game.add.graphics(0, 0);  //init rect
    shape.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    shape.beginFill(0xB20000, 1); // color (0xFFFF0B), alpha (0 -> 1) // required settings
    shape.drawRect(16, 16, 200, 64); // (x, y, w, h)
    
    var shape = game.add.graphics(0, 0);  //init rect
    shape.lineStyle(2, 0xFFFFFF, 1); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    shape.beginFill(0x0078EF, 1); // color (0xFFFF0B), alpha (0 -> 1) // required settings
    shape.drawRect(400, 16, 200, 64); // (x, y, w, h)
    
    scoreText = game.add.text(32, 32, 'Calories: 0', { fontSize: '32px', fill: '#000' });
    totalText = game.add.text(32, 64, 'Total: 0  Lives: 3', { font: '16px Arial', fill: '#000' });
    levelText = game.add.text(432, 32, 'Level: 1', { fontSize: '32px', fill: '#000' });
    
    // touchDown = game.add.text(375, 16, 'Touch Position: (0, 0)', { fontSize: '32px', fill: '#000' });
    // playerPos = game.add.text(375, 48, 'Player Position: (0, 0)', { fontSize: '32px', fill: '#000' });
    // mousePosText = game.add.text(375, 80, 'Mouse Position: (0, 0)', { fontSize: '32px', fill: '#000' });
    
    winText = game.add.text(200, 236, '', { font: 'bold 64px Arial', fill: '#F00' });

    wolf = game.add.sprite(700, game.world.height - 150, 'wolf');
    wolf.body.bounce.y = 0.2;
    wolf.body.gravity.y = 6;
    wolf.body.collideWorldBounds = true;
    
    wolf.animations.add('wolfLeft', [1, 2, 3, 4], 10, true);
    wolf.animations.add('wolfRight', [5, 6, 7, 8], 10, true);
    
    wolf.scale.setTo(2,2);

    player = game.add.sprite(32, game.world.height - 150, 'dude');

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 6;
    player.body.collideWorldBounds = true;
    
    player.animations.add('left', [1, 2, 3, 4], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    grandma = game.add.sprite(0,75, 'dropper', 0);
    grandma.body.gravity.y = 0;
    grandma.body.bounce.y = 0;
    grandma.body.collideWorldBounds = false;

    grandma.animations.add('gright', [0], 1, false);
    grandma.animations.add('gleft', [1], 1, false);
    
    grandmaTween = game.add.tween(grandma)
        .to({ x: 780 }, 4500, Phaser.Easing.Linear.None)
        .to({ x: 0 }, 4500, Phaser.Easing.Linear.None)
        .loop();
    grandmaTween.start();
    
    deathAnimation = game.add.sprite(32, game.world.height - 150, 'fightkk');
    deathAnimation.scale.setTo(2,2);
    deathAnimation.animations.add('die', [0, 1, 2, 3, 4, 5, 6, 7, 8], 20, true);
    deathAnimation.kill();
    
    bacons = game.add.group();
    UIlives = game.add.group();
    
    UIlevel = game.add.sprite(100,0, 'icons', 4);
    
    loadLevel(currentLevel);
    
    cursors = game.input.keyboard.createCursorKeys();
    
    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    
    UIlives.create(0, 1, 'icons', 0);
    UIlives.create(33, 1, 'icons', 0);
    UIlives.create(66, 1, 'icons', 0);
    UIlives.create(99, 1, 'icons', 0);
    
    UIlives.create(-32, -32, 'icons', 0); //dummy life bar keeps retarded group open
    
    var food = bacons.create(-64, -64, 'foods', 0);
    food.body.immovable = true;
    

}

function update()
{
    try{
    game.physics.collide(player, platforms);
    game.physics.collide(bacons, platforms);
    game.physics.collide(jamJar, platforms);
    game.physics.collide(wolf, platforms);
    game.physics.overlap(player, bacons, collectStar, null, this);
    game.physics.overlap(player, wolf, onDeath, null, this);
    game.physics.overlap(player, jamJar, collectJamJar, null, this);

    player.body.velocity.x = 0;

    if(cursors.left.isDown || aKey.isDown)
    {
        player.body.velocity.x = -250;
        score -= 0.1;
        
        player.animations.play('left');
    }
    else if(cursors.right.isDown || dKey.isDown)
    {
        player.body.velocity.x = 250;
        score -= 0.1;
    
        player.animations.play('right');
    }
    else
    {
        player.animations.stop();
        player.frame = 0;
    }
    
    if(cursors.down.isDown || sKey.isDown)
    {
        player.body.velocity.y = 300;
    }
    
    if(this.input.pointer1.x < player.body.x && this.input.pointer1.isDown)
    {
        player.body.velocity.x = -250;
        
        player.animations.play('left');
    }
    else if(this.input.pointer1.x > player.body.x && this.input.pointer1.isDown)
    {
        player.body.velocity.x = 250;
        player.animations.play('right');
    }
    else
    {
        //player.animations.stop();
       //player.frame = 5;
    }
    
    if(this.input.pointer1.y > player.body.y && this.input.pointer1.isDown)
    {
        player.body.velocity.y = 300;
        score -= -0.5;
        player.animations.stop();
        player.frame = 4;
    }
    
    if(this.input.pointer1.y < player.body.y && this.input.pointer1.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
        score -= -0.5;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if((cursors.up.isDown || wKey.isDown || spaceKey.isDown) && player.body.touching.down)
    {
        player.body.velocity.y = -350;
        score -= -0.5;
    }
    
    if(player.body.y >= 556)
    {
        player.body.x = 32;
        player.body.y = (game.world.height - 150);
    }
    
    if(levelComplete && (enterKey.justPressed() || this.input.pointer1.justPressed()))
    {
        winText.content = "";
        
        grayCover.destroy();
        totalScore = score+totalScore+((currentLevel+1)*100);
        score = 0;
        
        currentLevel += 1;
        updateLives();
        loadLevel(currentLevel);
        levelComplete = false;
    }
    
    if(jamJar == null && Math.floor((Math.random()*250)+1) == 1 && jarsCollected < 5)
    {
        var jarPlacement = Math.floor((Math.random()*4)+1);
        jamJar = game.add.sprite(jarPlacement <= 2 ? 130 : 530, jarPlacement == 2 || jarPlacement == 4 ? 295 : 130, 'jamjars', jarsCollected);
        jamJar.body.gravity.y = 6;
    }
    
    touchX = this.input.pointer1.x;
    touchY = this.input.pointer1.y;
    
    mouseX = game.input.x;
    mouseY = game.input.y;
    
    displayCoords();
    updateDropper();
    
    
    }catch(e)
    {
        game.world.removeAll();
        game.stage.backgroundColor = '#0000AA';
        var crashText = game.add.text(0 ,0, "The game has crashed\n\nPlease refresh the page to reset the game\nand report the following message:", { font: "36px Small Fonts", fill: '#ffffff'});
        var crashText2 = game.add.text(0,300, e.message, { font: "36px Small Fonts", fill: '#afafaf'});
        var crashText3 = game.add.text(0,346, "currentLevel:"+currentLevel+" grandmaDropChance: "+grandmaDropChance+" levelScore: "+levelScore, { font: "12px Small Fonts", fill: '#afafaf'});
    }
    
    //WOLF MOVEMENT CODE
    if(player.body.x < wolf.body.x)
    {
        wolf.body.velocity.x = -wolfSpeed;
        wolf.animations.play('wolfLeft');
    }
    else if(player.body.x > wolf.body.x)
    {
        wolf.body.velocity.x = wolfSpeed;
        wolf.animations.play('wolfRight');
    }
    else if(player.body.x === wolf.body.x)
    {
        wolf.animations.stop();
        wolf.frame = 4;
    }
    else
    {
        wolf.animations.stop();
        wolf.frame = 4;
    }
    
    if((player.body.y < wolf.body.y) && wolf.body.touching.down)
    {
        wolf.body.velocity.y = - wolfJump;
    }
    
    if(gameOver && (enterKey.justPressed() || this.input.pointer1.justPressed()))
    {
        winText.content = "";
        
        grayCover.destroy();
        score = 0;
        lives -= 1;
        
        deathAnimation.kill();
        if(jamJar != null)
        {
            jamJar.destroy();
            jamJar = null;
        }
        player.revive();
        wolf.revive();
        
        wolf.body.x = 700;
        wolf.body.y = game.world.height - 150;
        
        player.body.x = 32;
        player.body.y = game.world.height - 150;
        
        if(lives == 0)
        {
            currentLevel = 0;
            totalScore = 0;
            lives = 4;
        }
        updateLives();
        loadLevel(currentLevel);
        gameOver = false;
    }
}

function onDeath()
{
    wolf.kill();
    deathAnimation.revive();
    deathAnimation.body.x = player.body.x;
    deathAnimation.body.y = player.body.y;
    player.kill();
    deathAnimation.animations.play('die');
    
    winText.content = lives < 2 ? "Game Over!\n Press Enter \nto try again":"You died!\nPress Enter\n to continue" ;
        
    grayCover = game.add.graphics(0, 0);  //init rect
    grayCover.lineStyle(0, 0xC0C0C0, .3); // width, color (0x0000FF), alpha (0 -> 1) // required settings
    grayCover.beginFill(0xC0C0C0, .3); // color (0xFFFF0B), alpha (0 -> 1) // required settings
    grayCover.drawRect(0, 0, 800, 600);
    
    gameOver = true;
}

function collectJamJar()
{
    jarsCollected++;
    jamJar.destroy();
    jamJar = null;
    
    collectJar.volume = 0.2;
    collectJar.play('', 0, 1, false);
    if(jarsCollected == 5)
    {
        winText.content = "   Level Complete!\n(Press Enter)";
        
        grayCover = game.add.graphics(0, 0);  //init rect
        grayCover.lineStyle(0, 0xC0C0C0, .3); // width, color (0x0000FF), alpha (0 -> 1) // required settings
        grayCover.beginFill(0xC0C0C0, .3); // color (0xFFFF0B), alpha (0 -> 1) // required settings
        grayCover.drawRect(0, 0, 800, 600);
        
       // score = 0;
        levelComplete = true;
    }
    
    
}

function updateLives()
{
    if(lastLives < lives)
    {
        console.log("lastLives is less than lives ("+lastLives+"<"+lives+")");
        var j = lives-1;
        while(j > lastLives)
        {
            console.log("reviving lifeBar "+j);
            var lifeBar = UIlives.getAt(j);
            lifeBar.revive();
            j--;
        }
    }else
    if(lastLives > lives)
    {
        console.log("lastLives is more than lives ("+lastLives+">"+lives+")");
        var j = lives;
        while(j < lastLives)
        { 
            console.log("killing lifeBar "+j);
            var lifeBar = UIlives.getAt(j);
            lifeBar.kill();
            j++;
        }
    }
    
    lastLives = lives;
}

function updateDropper()
{
   if(Math.floor((Math.random()*grandmaDropChance)+1) == 1)
   {
       createRandomFoodAt(grandma.body.x, grandma.body.y);
   }
   if(grandma.body.x === 0)
   {
         grandma.animations.play('gright');  
   }
   if(grandma.body.x > 760)
   {
       grandma.animations.play('gleft');
   }
}

function displayCoords()
{
    // playerPos.content = 'Player Position: (' + Math.round(player.body.x) + ', ' + Math.round(player.body.y) + ')';
    // touchDown.content = 'Touch Position: (' + Math.round(touchX) + ', ' + Math.round(touchY) + ')';
    // mousePosText.content = 'Mouse Position: (' + Math.round(mouseX) + ', ' + Math.round(mouseY) + ')';
    scoreText.content = 'Calories: ' + Math.floor(score);
    levelText.content = 'Level: '+currentLevel;
    totalText.content = 'Total:'+Math.floor(totalScore)+' Lives:'+lives;
}

function collectStar(player, bacon)
{
    
    var foodType = bacon.group.getIndex(bacon);
    
    // Removes the star from the screen
    bacon.destroy();
    
    playCrunch();

    //  Add and update the score

    //mousePosText.content = "Score += "+calories[foodType];
    if(calories[foodType] !== undefined)
    score += calories[foodType]; 
}

function playCrunch()
{
    var crunchID = parseInt((Math.random() * (1 - 0 + 1)), 10) + 0;
    
    if(crunchID === 0)
    {
        crunch1.volume = 0.6;
        crunch1.play('', 0, 1, false);
    }
    else if(crunchID === 1)
    {
        crunch2.volume = 0.6;
        crunch2.play('', 0, 1, false);
    }
}

function createRandomFoodAt(foodX, foodY)
{
    var food = bacons.create(foodX, foodY, 'foods', Math.floor(Math.random()*16));
    food.body.gravity.y = 20;
}

function addPlatform(platX, platY, platType)
{
    var ground = platforms.create(platX, platY, platType);
    ground.body.immovable = true;
    
    var fence = fences.create(platX, platY-30, 'fence');
    fence.body.immovable = true;
}

function destroyPlatforms()
{
    var i = 0;
    while(platforms.length > 0)
    {
        var obj = platforms.getAt(i);
       // platforms.remove(obj);
        obj.destroy();
        i++;
    }
}

function loadLevel(levelID)
{
    jarsCollected = 0;
    if(levelID === 1)
    {
        player.body.x = 32;
        player.body.y = (game.world.height - 150);
        
        //levelScore = 98712398712398127631982313;

        addPlatform(100, 420, 'ground');
        addPlatform(500, 420, 'ground');
        
        addPlatform(100, 255, 'ground');
        addPlatform(500, 255, 'ground');

         if(lives == 5)
        {
        baconLevel1 = [0, 125, 185, 250, 400, 460, 525]

        baconLevel1.forEach(function(xPos)
        {
            createRandomFoodAt(xPos, 122);
        });
        }
    }
    else if(levelID === 2)
    {
        player.body.x = 32;
        player.body.y = (game.world.height - 150);
        
       // levelScore = 98712398712398127631982313;
        
        grandmaDropChance = 69; //lol
        
       // destroyPlatforms();

        // addPlatform(150, 300, 'ground');
        // addPlatform(450, 300, 'ground');
        
        // addPlatform(150, 255, 'ground');
        // addPlatform(450, 255, 'ground');
        
        if(lives == 5)
        {
             baconLevel1 = [755, 645, 185]
            
            baconLevel1.forEach(function(xPos)
            {
                createRandomFoodAt(xPos, 122);
            });
        }

    }
    else 
    {
        levelScore += Math.log(levelID) * 100;
        wolfSpeed++;
        wolfJump *= 1.02;
        grandmaDropChance = grandmaDropChance * 1.01;
                player.body.x = 32;
        player.body.y = (game.world.height - 150);
        
        //destroyPlatforms();
    }
}
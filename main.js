
//var skullHead = 1;

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;

    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }

    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }


    var locX = x;
    var locY = y - 10;

    var offset = vindex === 0 ? this.startX : 0;

    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy * 2,
                  this.frameHeight * scaleBy * 2);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}

function Unicorn(game, x, y, thePid) {

    Entity.call(this, game, x, y);

    this.pid = thePid;
    this.throwing = false;
    this.snowballTimer = 0;
    this.hold = 20;
    this.speed = 10;

    this.snowmanAnimation = new Animation(ASSET_MANAGER.getAsset("./img/snowman.png"),0, 0, 48, 48,/*frame speed*/ 0.5, /*# of frames*/2, true, false);
    this.throwAnimation = new Animation(ASSET_MANAGER.getAsset("./img/snowman.png"),96, 0, 48, 48, 0.5, 2, true, false);

}

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;



Unicorn.prototype.update = function () {


    if (this.game.up)
    {
        if (this.y > 0)
            this.y -= this.speed;
    }

    if (this.game.down)
    {
        if(this.y <500)
            this.y += this.speed;
    }

    if (this.game.left) {
        console.log(this.x);
        if(this.x > 0)
            this.x -= this.speed;
    }

    if (this.game.right) {
        console.log(this.x);
        if (this.x < 500)
         this.x += this.speed;
    }


    this.direction = {x: 1, y: 0};
    if (this.hold === 0) this.throwing = false;

    if (this.snowballTimer < 0) { //throwing
        console.log("Throwing!!! ");
        this.throwing = true;
        this.hold = 20;
        var snowball = new Snowball(this.game, this.x+70, this.y+20);
        this.game.addEntity(snowball);
        this.snowballTimer = 100;
    }
    if(this.snowballTimer >= 0) {//not throwing
        if (this.throwing){
            this.hold--;
        }
        else{
            this.snowballTimer -= 1;
            this.x += 0.1;
        }

    }
    Entity.prototype.update.call(this);
/*
    //---------------------------
    if(this.game.threeKeys) {
        this.combination = true;
    }

    if (this.combination) {
        if(this.combinationAnimation.isDone()) {
            this.combinationAnimation.elapsedTime = 0;
            this.combination = false;
        }
    }

    if (this.skullHeadCountDown === 100 ) {//&& this.skullHeadNumber !== 2) { //&& this.skullHeadNumber !== 3) {

        var testing = new skullHead(this.game, this.x + 350, this.y , 2);
        this.game.addEntity(testing);
        this.skullHeadCountDown = 0;
        this.skullHeadNumber++;
    } else {
        this.skullHeadCountDown++;
    }

    //------------------------
    if (this.game.enter) {
        this.fighting = true;
    }
    
    if (this.fighting) {
        if (this.fightAnimation.isDone()) {
            //console.log("we get");
            if (this.afterSpecialEffect.isDone()) {
                this.afterSpecialEffect.elapsedTime = 0;
                this.explosion.elapsedTime = 0;
                this.preSpecialEffect.elapsedTime = 0;
                this.fightAnimation.elapsedTime = 0;
                this.fighting = false;
            }
        }
    }

    //for (var i = 0; i < this.game.entities.length; i++) {
    //    var ent = this.game.entities[i];
    //    if (ent !== this && ent !== 1) {
    //        console.log("Type is skullHead");
    //        var cl = Entity.prototype.collide.call(this, ent);
    //        if (cl == COLLIDE_LEFT || cl == COLLIDE_RIGHT) {
    //            this.direction *= -1;
    //        }
    //    }
    //}

    if (this.x >= 400 || this.x <= -300) {        
        this.direction *= -1;
    }
*/


    
}

Unicorn.prototype.draw = function (ctx) {

    if (this.throwing && this.hold > 0){
        this.throwAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    else {
        this.snowmanAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    Entity.prototype.draw.call(this);
}
    /*
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y - 10);
    } else if (this.fighting) {

        console.log("I am fighting");
        if (this.fightAnimation.isDone()) {
            //console.log("here");
            this.preSpecialEffect.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y);
            if (this.preSpecialEffect.isDone())
            {
                this.explosion.drawFrame(this.game.clockTick, ctx, this.x + 235, this.y - 330);
                if (this.explosion.isDone())
                {
                    this.afterSpecialEffect.drawFrame(this.game.clockTick, ctx, this.x + 235, this.y - 330);
                }
            }
        }
        else
        {
            this.fightAnimation.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y);
        }

    } else if (this.combination) {
        this.combinationAnimation.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x + 300, this.y);
    }
*/



// the "main" code begins here



var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/snowman.png");


//ASSET_MANAGER.queueDownload("./music/background.mp3");
ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine, 250, 400, 1);
   // var unicorn2 = new Unicorn(gameEngine, 300, 400, 1);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(unicorn);
    //gameEngine.addEntity(unicorn2);

    gameEngine.init(ctx);
    gameEngine.start();
});

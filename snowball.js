function Snowball(game, x, y,thePid) {

    this.game = game;
    this.pid = thePid;
    Entity.call(this, game, x, y);


    this.setBox(-6, -6, 5, 5);


    this.radius = 100;
    this.direction = {x: 1, y: 0};


    var speed = 2; //this bullet moves 2 pixels every tick

    this.direction.x = this.direction.x * speed;
    this.direction.y = this.direction.y * speed;

    this.elapsed = 1;

    this.shoot = new Animation(ASSET_MANAGER.getAsset("./img/snowman.png"), 194, 2, 11, 11, 0.02, 1, true, false);
}

Snowball.prototype = new Entity();
Snowball.prototype.constructor = Snowball;

Snowball.prototype.update = function () {


    this.x += this.elapsed * this.direction.x;

    Entity.prototype.update.call(this);
}

Snowball.prototype.draw = function (ctx) {
    this.shoot.drawFrame(this.game.clockTick, ctx, this.x, this.y);

    Entity.prototype.draw.call(this);
}
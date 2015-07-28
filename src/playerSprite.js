var playerSprite = monsterSprite.extend({
    is_fire     : false,
    is_fire_end : true,
    bullets     : [],
    ctor: function(role_key, role_name, x, y, direction, space) {
        this._super(role_key, role_name);
        
        this.space = space;

        var contentSize = this.getContentSize();

        //設定物理引擎
        this.body = new cp.Body(1, cp.momentForCircle(1, 0, contentSize.width / 4, cp.v(0, 0))); 
        this.shape = new cp.CircleShape(this.body, contentSize.width / 4, cp.v(0, 0));

        this.shape.setElasticity(1);
        this.shape.setFriction(1);
        this.shape.setCollisionType(ROLE_COLLISION_TYPE);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);
        this.setBody(this.body);

        this.x = x || contentSize.width / 2;
        this.y = y || contentSize.height / 2;

        this.role_key = role_key;
        this.role_name = role_name;

        this.direction = direction;
        this[direction+'Move'](this.x, this.y);
    },
    fire: function() {
        this._super();
        if (this.is_fire_end) {
            this.is_fire_end = false;
            var bullet = new window[role[this.role_key].bullet](this.role_key, this.space);

            bullet.shape.group = this.shape.group;
            bullet.role_sprite = this;
            this.parent.addChild(bullet, 4);

            bullet.fire(this.getPosition(), this.direction);
        }
    },
    onEnter: function() {
        this._super();
        this.action = this.runAction(new cc.Blink(1, 10));

        //定時
        this.schedule(function(){
            if (this.is_fire) {
                this.fire();
            }
        }, 0.1);
    }
});
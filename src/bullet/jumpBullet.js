var jumpBullet = bulletSprite.extend({
    spawn       : null,
    action      : null,
    atk         : 1,
    role_sprite : null,
    ctor: function(role_key, space) {
        this._super(role_key);
        this.space = space;

        var contentSize = this.getContentSize();

        this.body = new cp.Body(1, cp.momentForCircle(20, 0, contentSize.width / 8, cp.v(0, 0))); 
        this.shape = new cp.CircleShape(this.body, contentSize.width / 8, cp.v(0, 0));
        this.shape.setElasticity(1);
        this.shape.setFriction(1);
        this.shape.setCollisionType(BALL_COLLISION_TYPE);
        this.shape.atk = this.atk;

        this.space.addBody(this.body);
        this.space.addShape(this.shape);
        this.setBody(this.body);
    },
    actionEnd: function() {
        this._super();

        if (this.role_sprite) {
            this.role_sprite.is_fire_end = true;
        }

        this.space.removeShape(this.shape);
        this.space.removeBody(this.body);
    },
    leftMove: function(x, y) {
        this.spawn = cc.spawn(cc.jumpTo(this.move_speed, cc.p(x, y), 20, 5), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    upMove: function(x, y) {
        this.spawn = cc.spawn(cc.jumpTo(this.move_speed, cc.p(x, y), 20, 5), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    rightMove: function(x, y) {
        this.spawn = cc.spawn(cc.jumpTo(this.move_speed, cc.p(x, y), 20, 5), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    downMove: function(x, y) {
        this.spawn = cc.spawn(cc.jumpTo(this.move_speed, cc.p(x, y), 20, 5), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    onEnter: function() {
        this._super();
    }
});

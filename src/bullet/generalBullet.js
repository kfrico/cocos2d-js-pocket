var generalBullet = bulletSprite.extend({
    spawn       : null,
    action      : null,
    atk         : 2,
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
    onEnter: function() {
        this._super();
    }
});

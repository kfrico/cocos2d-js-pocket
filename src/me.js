var me = monsterSprite.extend({
    ctor: function(role_key, role_name, space) {
        this._super(role_key, role_name);
        
        this.space = space;

        var contentSize = this.getContentSize();

        this.body = new cp.Body(1, cp.momentForCircle(1, 0, contentSize.width / 4, cp.v(0, 0))); 
        this.shape = new cp.CircleShape(this.body, contentSize.width / 4, cp.v(0, 0));

        this.shape.setElasticity(1);
        this.shape.setFriction(1);
        this.shape.setCollisionType(ROLE_COLLISION_TYPE);
        this.space.addBody(this.body);
        this.space.addShape(this.shape);
        this.setBody(this.body);

        this.x = contentSize.width / 2;
        this.y = contentSize.height / 2;

        this.role_key = role_key;
        this.role_name = role_name;
        //產生子彈
        this.bullet = new window[role[role_key].bullet](role_key, this.space);
    },
    onEnter: function() {
        this._super();
        this.parent.addChild(this.bullet, 4);
        this.action = this.runAction(new cc.Blink(1, 10));
    }
});
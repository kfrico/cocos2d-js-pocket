var bulletSprite = cc.PhysicsSprite.extend({
    spawn      : null,
    sequence   : null,
    action     : null,
    atk        : null,
    move_speed : BULLET_MOVE_SPEED,
    ud_height  : BULLET_UD_HEIGHT,
    lr_width   : BULLET_LR_WIDTH,
    ctor: function(role_key) {
        this._super();

        this.initWithSpriteFrameName(role_key + '_dance_03.png');
        this.scaleX = 0.5;
        this.scaleY = 0.5;

        this.action = this.runAction(cc.rotateBy(this.move_speed, 2880));
    },
    fire: function(position, direction, callback) {
        if (typeof callback === "function") {
            this.actionEnd = callback;
        }

        this.x = position.x;
        this.y = position.y;

        this.setVisible(true);

        switch (direction) {
            case 'left':
                this.leftMove(this.x - this.lr_width, this.y);
                break;
            case 'up':
                this.upMove(this.x, this.y + this.ud_height);
                break;
            case 'right':
                this.rightMove(this.x + this.lr_width, this.y);
                break;
            case 'down':
                this.downMove(this.x, this.y - this.ud_height);
                break;
        }
    },
    actionEnd: function() {
        this.parent.removeChild(this);
    },
    leftMove: function(x, y) {
        this.spawn = cc.spawn(cc.moveTo(this.move_speed, cc.p(x, y)), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    upMove: function(x, y) {
        this.spawn = cc.spawn(cc.moveTo(this.move_speed, cc.p(x, y)), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    rightMove: function(x, y) {
        this.spawn = cc.spawn(cc.moveTo(this.move_speed, cc.p(x, y)), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    downMove: function(x, y) {
        this.spawn = cc.spawn(cc.moveTo(this.move_speed, cc.p(x, y)), cc.rotateBy(this.move_speed, 2880));
        this.sequence = cc.sequence(this.spawn, cc.callFunc(this.actionEnd.bind(this)));
        this.action = this.runAction(this.sequence);
    },
    onEnter: function() {
        this._super();
        this.setVisible(false);
    }
});

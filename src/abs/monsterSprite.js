var monsterSprite = cc.PhysicsSprite.extend({
    spawn     : null,
    action    : null,
    direction : 'down',
    life_val  : 100,
    ctor: function(role_key, role_name) {
        this._super();

        var sprite_frame_cache = cc.spriteFrameCache,
            down_dance_key     = [role_key + '_dance_01', role_key + '_dance_02', role_key + '_dance_03', role_key + '_dance_04'],
            left_dance_key     = [role_key + '_dance_05', role_key + '_dance_06', role_key + '_dance_07', role_key + '_dance_08'],
            right_dance_key    = [role_key + '_dance_09', role_key + '_dance_10', role_key + '_dance_11', role_key + '_dance_12'],
            up_dance_key       = [role_key + '_dance_13', role_key + '_dance_14', role_key + '_dance_15', role_key + '_dance_16'],
            down_frames        = [],
            left_frames        = [],
            right_frames       = [],
            up_frames          = [],
            down_animation,
            left_animation,
            right_animation,
            up_animation;

        sprite_frame_cache.addSpriteFrames(role[role_key].plist, role[role_key].img);

        //產生人物
        this.initWithSpriteFrameName(role_key + '_dance_03.png');

        //人物名稱
        var role_name_label = new cc.LabelTTF(role_name, "", 10);
        role_name_label.x = 0;
        role_name_label.y = this._getHeight();
        this.addChild(role_name_label);

        //動作frame
        for (var i = 0; i < 4; i++) {
            down_frames.push(sprite_frame_cache.getSpriteFrame(down_dance_key[i]));
            left_frames.push(sprite_frame_cache.getSpriteFrame(left_dance_key[i]));
            right_frames.push(sprite_frame_cache.getSpriteFrame(right_dance_key[i]));
            up_frames.push(sprite_frame_cache.getSpriteFrame(up_dance_key[i]));
        }

        this.down_animation = new cc.Animation(down_frames, ROLE_ANIMATION_SPEED);
        this.left_animation = new cc.Animation(left_frames, ROLE_ANIMATION_SPEED);
        this.right_animation = new cc.Animation(right_frames, ROLE_ANIMATION_SPEED);
        this.up_animation = new cc.Animation(up_frames, ROLE_ANIMATION_SPEED);
    },
    move: function(x, y) {
        this.action = this.runAction(cc.moveTo(ROLE_MOVE_SPEED, cc.p(x, y)));
    },
    leftMove: function(x, y) {
        this.direction = 'left';
        this.spawn = cc.spawn(cc.moveTo(ROLE_MOVE_SPEED, cc.p(x, y)), cc.animate(this.left_animation));
        this.action = this.runAction(this.spawn);
    },
    upMove: function(x, y) {
        this.direction = 'up';
        this.spawn = cc.spawn(cc.moveTo(ROLE_MOVE_SPEED, cc.p(x, y)), cc.animate(this.up_animation));
        this.action = this.runAction(this.spawn);
    },
    rightMove: function(x, y) {
        this.direction = 'right';
        this.spawn = cc.spawn(cc.moveTo(ROLE_MOVE_SPEED, cc.p(x, y)), cc.animate(this.right_animation));
        this.action = this.runAction(this.spawn);
    },
    downMove: function(x, y) {
        this.direction = 'down';
        this.spawn = cc.spawn(cc.moveTo(ROLE_MOVE_SPEED, cc.p(x, y)), cc.animate(this.down_animation));
        this.action = this.runAction(this.spawn);
    },
    speak: function(words) {
        
    },
    fire: function() {
        
    },
    addLife: function(life) {
        this.life_val = this.life_val + life;
    },
    onEnter: function() {
        this._super();
    }
});

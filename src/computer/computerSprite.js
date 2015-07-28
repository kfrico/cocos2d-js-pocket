var computerSprite = monsterSprite.extend({
    is_fire     : false,
    is_fire_end : true,
    bullets     : [],
    ctor: function(role_key, role_name, x, y, direction, space, fbcp) {
        this._super(role_key, role_name);
        this.space = space;
        this.fbcp = fbcp;

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

        fbcp.update({
            online : true,
            role_key : role_key,
            role_name : role_name,
            action : 'not_aciton',
            is_fire   : true,
            direction : this.direction,
            x : this.x,
            y : this.y
        });

        //離線處理
        fbcp.onDisconnect().remove();
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

        var directions = ['left', 'right', 'up', 'down'];

        directions[Math.floor(Math.random()*directions.length)]
        //定時
        this.schedule(function(){

            var direction = directions[Math.floor(Math.random()*directions.length)];

            if(this.action.isDone()) {
                switch (direction) {
                   case 'left':
                        this.leftMove(this.x - ROLE_LR_WIDTH, this.y);
                        
                        this.fbcp.update({
                            x           : this.x - ROLE_LR_WIDTH,
                            y           : this.y,
                            move_action : 'left',
                            direction   : direction
                        });
                        break;
                    case 'up':
                        this.upMove(this.x, this.y + ROLE_UD_HEIGHT);

                        this.fbcp.update({
                            x           : this.x,
                            y           : this.y + ROLE_UD_HEIGHT,
                            move_action : 'up',
                            direction   : direction
                        });
                        break;
                    case 'right':
                        this.rightMove(this.x + ROLE_LR_WIDTH, this.y);

                        this.fbcp.update({
                            x           : this.x + ROLE_LR_WIDTH,
                            y           : this.y,
                            move_action : 'right',
                            direction   : direction
                        });
                        break;
                    case 'down':
                        this.downMove(this.x, this.y - ROLE_UD_HEIGHT);

                        this.fbcp.update({
                            x           : this.x,
                            y           : this.y - ROLE_UD_HEIGHT,
                            move_action : 'down',
                            direction   : direction
                        });
                        break;
                    default:
                        this.fbcp.update({
                            move_action :'not_aciton'
                        });
                        break;
                }
            }


        }, 1);
    }
});
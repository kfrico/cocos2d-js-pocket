var playerLayer = cc.Layer.extend({
    space: null,
    ctor: function(fbPlayer, ui_layer) {
        this._super();

        this.map = new cc.TMXTiledMap(resprefix + "map/mapLevel2.tmx");
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        this.addWalls();
        // this.setupDebugNode();

        var _             = this,
            role_key      = cc.sys.localStorage.getItem('role_key') || 'squirtle',
            role_name     = cc.sys.localStorage.getItem('role_name') || 'no_name',
            player_sprite = new playerSprite(role_key, role_name, null, null, 'down', this.space),
            is_fire       = false,
            is_quicken    = false;

        this.player_sprite = player_sprite;

        //設定群組
        player_sprite.shape.group = ME_CHIPMUNK_GROUP;

        //人物跟隨
        var followAction = new cc.Follow(player_sprite, cc.rect(0, 0, this.map._getWidth(), this.map._getHeight()));
        this.runAction(followAction);

        //上線設定
        fbPlayer.update({
            online    : true,
            role_key  : player_sprite.role_key,
            role_name : player_sprite.role_name,
            action    : 'not_aciton',
            is_fire   : false,
            direction : player_sprite.direction,
            x         : player_sprite.x,
            y         : player_sprite.y
        });
        
        //離線處理
        fbPlayer.onDisconnect().remove();

        this.addChild(this.map, 1);
        this.addChild(player_sprite, 2, ME_ROLE_ID);

        var move_action = [];

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event){
                switch (keyCode) {
                    case 37:
                        if (move_action.indexOf('left') == -1) {
                            move_action.push('left');
                        }
                        break;
                    case 38:
                        if (move_action.indexOf('up') == -1) {
                            move_action.push('up');
                        }
                        break;
                    case 39:
                        if (move_action.indexOf('right') == -1) {                        
                            move_action.push('right');
                        }
                        break;
                    case 40:
                        if (move_action.indexOf('down') == -1) {
                            move_action.push('down');
                        }
                        break;
                    case 65:
                        is_fire = true;
                        break;
                    case 83:
                        is_quicken = true;
                        break;
                }

            },
            onKeyReleased: function(keyCode, event){
                switch (keyCode) {
                    case 37:
                        move_action.splice(move_action.indexOf('left'), 1);
                        break;
                    case 38:
                        move_action.splice(move_action.indexOf('up'), 1);
                        break;
                    case 39:
                        move_action.splice(move_action.indexOf('right'), 1);
                        break;
                    case 40:
                        move_action.splice(move_action.indexOf('down'), 1);                    
                        break;  
                    case 65:
                        is_fire = false;
                        break;
                    case 83:
                        is_quicken = false;
                        break;
                }
            }
        }, this);
            
        //定時
        this.schedule(function(){

            if(player_sprite.action.isDone() || is_quicken) {
                switch (move_action[move_action.length-1]) {
                   case 'left':
                        player_sprite.leftMove(player_sprite.x - ROLE_LR_WIDTH, player_sprite.y);
                        
                        fbPlayer.update({
                            x           : player_sprite.x - ROLE_LR_WIDTH,
                            y           : player_sprite.y,
                            move_action : 'left',
                            direction   : player_sprite.direction
                        });
                        break;
                    case 'up':
                        player_sprite.upMove(player_sprite.x, player_sprite.y + ROLE_UD_HEIGHT);

                        fbPlayer.update({
                            x           : player_sprite.x,
                            y           : player_sprite.y + ROLE_UD_HEIGHT,
                            move_action : 'up',
                            direction   : player_sprite.direction
                        });
                        break;
                    case 'right':
                        player_sprite.rightMove(player_sprite.x + ROLE_LR_WIDTH, player_sprite.y);

                        fbPlayer.update({
                            x           : player_sprite.x + ROLE_LR_WIDTH,
                            y           : player_sprite.y,
                            move_action : 'right',
                            direction   : player_sprite.direction
                        });
                        break;
                    case 'down':
                        player_sprite.downMove(player_sprite.x, player_sprite.y - ROLE_UD_HEIGHT);

                        fbPlayer.update({
                            x           : player_sprite.x,
                            y           : player_sprite.y - ROLE_UD_HEIGHT,
                            move_action : 'down',
                            direction   : player_sprite.direction
                        });
                        break;
                    default:
                        fbPlayer.update({
                            move_action :'not_aciton'
                        });
                        break;

                }
            }

            if(is_fire) {
                player_sprite.fire();
            }

            fbPlayer.update({
                is_fire : is_fire,
            });

        }, 0.05);

        this.schedule(function(){
            if(player_sprite.action.isDone()) {
                fbPlayer.update({
                    x : player_sprite.x,
                    y : player_sprite.y
                });
            }

        }, 10);

        //定時
        this.scheduleUpdate();
    },
    update: function (dt) {
        this.space.step(dt);
    },
    addWalls: function() {
        var map_size = {
            width : this.map._getWidth(),
            height :  this.map._getHeight()
        }

        // Walls
        var walls = [ new cp.SegmentShape( this.space.staticBody, cp.v(0,0), cp.v(map_size.width,0), 10),
            new cp.SegmentShape( this.space.staticBody, cp.v(0,map_size.height), cp.v(map_size.width,map_size.height), 10),
            new cp.SegmentShape( this.space.staticBody, cp.v(0,0), cp.v(0,map_size.height), 10),
            new cp.SegmentShape( this.space.staticBody, cp.v(map_size.width,0), cp.v(map_size.width,map_size.height), 10)
        ];

        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this.space.addStaticShape( shape );
        }
    },
    collisionBegin: function ( arbiter, space ) {
        var shapes = arbiter.getShapes();
        var shapeA = shapes[0];
        var shapeB = shapes[1];
         
        var collTypeA = shapeA.collision_type;
        var collTypeB = shapeB.collision_type;

        if (shapeA.group == ME_CHIPMUNK_GROUP) {
            switch(collTypeB){
                case BALL_COLLISION_TYPE:
                    this.space.addPostStepCallback(function () {
                        this.getChildByTag(ME_ROLE_ID).addLife(-shapeB.atk);
                    }.bind(this));
                    break;
            }
        }
        
        return true;
    },
    collisionPre: function ( arbiter, space ) {
        // cc.log('collision pre');
        return true;
    },
    collisionPost: function ( arbiter, space ) {
        // cc.log('collision post');
    },
    collisionSeparate: function ( arbiter, space ) {
        // cc.log('collision separate');
    },
    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode, 20);
    },
    onEnter: function() {
        this._super();

        // this.space.addCollisionHandler(ROLE_COLLISION_TYPE, ROLE_COLLISION_TYPE,
        //     this.collisionBegin.bind(this),
        //     this.collisionPre.bind(this),
        //     this.collisionPost.bind(this),
        //     this.collisionSeparate.bind(this)
        // ); 

        this.space.addCollisionHandler(ROLE_COLLISION_TYPE, BALL_COLLISION_TYPE,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );
    }
});

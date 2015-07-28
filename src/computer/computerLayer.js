var computerLayer = cc.Layer.extend({
    space : null,
    ctor: function(fbcps) {
        this._super();

        var computerlist = {};
        var directions = ['left', 'right', 'up', 'down'];

        this.map = new cc.TMXTiledMap(resprefix + "map/mapLevel2.tmx");
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, 0);
        this.addWalls();
        this.setupDebugNode();
        this.addChild(this.map, 1);

        for (var role_key in role) {
            var role_x = this.map._getWidth() * Math.random();
            var role_y = this.map._getHeight() * Math.random();
            computerlist[role_key] = new computerSprite(role_key, role_key, role_x, role_y, directions[Math.floor(Math.random()*directions.length)], this.space, fbcps.child(role_key));
            this.addChild(computerlist[role_key], 2);
        }
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
    setupDebugNode: function () {
        this._debugNode = new cc.PhysicsDebugNode(this.space);
        this._debugNode.visible = true;
        this.addChild(this._debugNode, 20);
    },
    onEnter: function() {
        this._super();
    }
});

var textInputGetRect = function (node) {
    var rc = cc.rect(node.x, node.y, node.width, node.height);
    rc.x -= rc.width / 2;
    rc.y -= rc.height / 2;
    return rc;
};

var roleMenuLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
 
        var win_size = cc.winSize,
            sprite_frame_cache = cc.spriteFrameCache,
            sprite_batch,
            dance_key,
            frames = [],
            tmp_col = 0,
            tmp_row = 1,
            normal_sprite,
            selected_sprite,
            padding = 18,
            sprite_width,
            sprite_height,
            role_menu = new cc.Menu();

        for (var i in role) {
            frames = [];
            sprite_frame_cache.addSpriteFrames(role[i].plist, role[i].img);
            normal_sprite   = new cc.Sprite('#' + i + '_dance_03.png');
            selected_sprite = new cc.Sprite('#' + i + '_dance_04.png');
            sprite_width    = normal_sprite._getWidth();
            sprite_height   = normal_sprite._getHeight();
            normal_sprite.setAnchorPoint(0,0);
            selected_sprite.setAnchorPoint(0,0);

            dance_key = [
            i + '_dance_01', i + '_dance_02', i + '_dance_03', i + '_dance_04', 
            i + '_dance_05', i + '_dance_06', i + '_dance_07', i + '_dance_08',
            i + '_dance_09', i + '_dance_10', i + '_dance_11', i + '_dance_12',
            i + '_dance_13', i + '_dance_14', i + '_dance_15', i + '_dance_16'];


            for(var k in dance_key) {
                frames.push(sprite_frame_cache.getSpriteFrame(dance_key[k]));
            }

            animation = new cc.Animation(frames, ROLE_ANIMATION_SPEED + 0.05, 600);
            normal_sprite.runAction(cc.animate(animation));

            role_item = new cc.MenuItemSprite(
                normal_sprite,
                selected_sprite, 
                function (index) {
                    if (this._textField.getContentText() == '') {
                        alert('還沒輸入名子');
                        return false;
                    }
                    cc.sys.localStorage.setItem('role_key', index.role_key);
                    cc.sys.localStorage.setItem('role_name', this._textField.getContentText());
                    cc.director.runScene(new cc.TransitionRotoZoom(3, new appScene(), false));
                }, 
                this
            );
            role_item.role_key = i;

            role_menu.addChild(role_item);
        }
        role_menu.alignItemsVertically();
        this.addChild(role_menu);
        role_menu.y = 0;

        this.win_size = win_size
        this.role_menu = role_menu;
        this.sprite_height = sprite_height;
        return true;
    },
    onEnter: function () {
        this._super();

        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function (event) {
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT)
                        event.getCurrentTarget().moveMenu(event.getDelta());
                },
                onMouseScroll: function (event) {
                    var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                    event.getCurrentTarget().moveMenu({y : delta});
                    return true;
                },
                onMouseUp: this.onMouseUp
            }, this);
        }

        this._textField = new cc.TextFieldTTF("輸入名子", "Thonburi", 36);

        this._textField.x = this._textField._getWidth();
        this._textField.y = this.win_size.height - this._textField._getHeight();
        this.addChild(this._textField);
        this._trackNode = this._textField;

        // this._textField.strokeStyle = new cc.color(50, 255, 255, 10);
    },
    //監聽滑鼠是不是有點擊在輸入框裡
    onMouseUp: function (event) {
        var target = event.getCurrentTarget();
        var point = event.getLocation();
        var rect = textInputGetRect(target._trackNode);

        //rectContainsPoint 用來判斷有沒有在焦點裡
        target.onClickTrackNode(cc.rectContainsPoint(rect, point));
    },
    onClickTrackNode: function (clicked) {
        var textField = this._trackNode;
        if (clicked) {
            textField.attachWithIME();
        } else {
            textField.detachWithIME();
        }
    },
    moveMenu: function(delta) {
        var newY = this.role_menu.y + delta.y;
        if (newY < 0) {
            newY = 0;
        }

        if( newY > ((Object.keys(role).length + 2) * this.sprite_height - this.win_size.height)) {
            newY = ((Object.keys(role).length + 2) * this.sprite_height - this.win_size.height);
        }

        this.role_menu.y = newY;
    }
});
 


var roleMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new roleMenuLayer();
        this.addChild(layer);
    }
});
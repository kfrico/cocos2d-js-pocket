var computerScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        //設定除follow黑線
        cc.director.setProjection(cc.Director.PROJECTION_2D); 

        var _this = this;

        /***firebase***/
        var fbcps = new Firebase("https://online-game.firebaseio.com/computer/"),
            fbUsers = new Firebase("https://online-game.firebaseio.com/users/");

        fbcps.authWithCustomToken('Z0VsZrgqznSrtJ4VGjzM0Vq8uxCE2vHZkDLecumU', function(error, authData) {
            if (error) {
                console.log('loging error');
            } else {
                firebase_init(authData);
            }
        });

        function firebase_init(authData) {

            var uid = authData.uid,
                userlist = {},
                computer_layer = new computerLayer(fbcps);

            _this.addChild(computer_layer, 1, COMPUTER_LAYER_TAG);

            fbUsers.on('child_added', function(childSnapshot) {
                var childKey = childSnapshot.key();
                var childVal = childSnapshot.val();

                if (uid !== childKey && childVal.online != false) {
                    userlist[childKey] = {
                        sprite: new playerSprite(childVal.role_key, childVal.role_name, childVal.x, childVal.y, childVal.direction, computer_layer.space),
                        fb: fbUsers.child(childKey)
                    }
                    
                    //設定群組
                    userlist[childKey].sprite.shape.group = OTHER_CHIPMUNK_GROUP;

                    //插入玩家圖層
                    computer_layer.addChild(userlist[childKey].sprite, 2);

                    userlist[childKey].fb.on('value',function(dataSnapshot){
                        var user_key = dataSnapshot.key();
                        var user_val = dataSnapshot.val();

                        if(user_val == null) {
                            if (userlist[user_key]) {
                                userlist[user_key].fb.off();
                                computer_layer.space.removeShape(userlist[user_key].sprite.shape);
                                computer_layer.space.removeBody(userlist[user_key].sprite.body);
                                computer_layer.removeChild(userlist[user_key].sprite);
                                delete userlist[user_key];
                            }
                            return false;
                        }

                        switch (user_val.move_action) {
                            case 'left':
                                userlist[user_key].sprite.leftMove(user_val.x, user_val.y);
                                break;
                            case 'up':
                                userlist[user_key].sprite.upMove(user_val.x, user_val.y);
                                break;
                            case 'right':
                                userlist[user_key].sprite.rightMove(user_val.x, user_val.y);
                                break;
                            case 'down':
                                userlist[user_key].sprite.downMove(user_val.x, user_val.y);
                                break;
                        }

                        userlist[user_key].sprite.is_fire = user_val.is_fire;
                    });
                }
            });
        }

        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: function(event){
                    if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
                        var node = event.getCurrentTarget().getChildByTag(COMPUTER_LAYER_TAG);
                        node.x += event.getDeltaX();
                        node.y += event.getDeltaY();
                    }
                }
            }, this);
        }
    }
});
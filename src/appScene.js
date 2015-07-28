var appScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        //設定除follow黑線
        cc.director.setProjection(cc.Director.PROJECTION_2D); 

        var _this = this;

        /***firebase***/
        var fbcps = new Firebase("https://online-game.firebaseio.com/computer/"),
            fbUsers = new Firebase("https://online-game.firebaseio.com/users/");
        
        var firebase_init = function firebase_init(authData) {
            var uid = authData.uid,
                userlist = {},
                computerlist = {},
                fbPlayer = fbUsers.child(uid),
                player_layer = new playerLayer(fbPlayer),
                ui_layer = new UILayer(player_layer);
                
            _this.addChild(player_layer, 1);
            _this.addChild(ui_layer, 2);

            fbUsers.on('child_added', function(childSnapshot) {
                var childKey = childSnapshot.key();
                var childVal = childSnapshot.val();

                if (uid !== childKey && childVal.online != false) {
                    userlist[childKey] = {
                        sprite: new playerSprite(childVal.role_key, childVal.role_name, childVal.x, childVal.y, childVal.direction, player_layer.space),
                        fb: fbUsers.child(childKey)
                    }
                    
                    //設定群組
                    userlist[childKey].sprite.shape.group = OTHER_CHIPMUNK_GROUP;

                    //插入玩家圖層
                    player_layer.addChild(userlist[childKey].sprite, 2);

                    userlist[childKey].fb.on('value',function(dataSnapshot){
                        var user_key = dataSnapshot.key();
                        var user_val = dataSnapshot.val();

                        if(user_val == null) {
                            if (userlist[user_key]) {
                                userlist[user_key].fb.off();
                                player_layer.space.removeShape(userlist[user_key].sprite.shape);
                                player_layer.space.removeBody(userlist[user_key].sprite.body);
                                player_layer.removeChild(userlist[user_key].sprite);
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
            
            fbcps.on('child_added', function(childSnapshot) {
                var childKey = childSnapshot.key();
                var childVal = childSnapshot.val();

                if (childVal.online != false) {
                    computerlist[childKey] = {
                        sprite: new playerSprite(childVal.role_key, childVal.role_name, childVal.x, childVal.y, childVal.direction, player_layer.space),
                        fb: fbcps.child(childKey)
                    }

                    //設定群組
                    computerlist[childKey].sprite.shape.group = OTHER_CHIPMUNK_GROUP;

                    //插入玩家圖層
                    player_layer.addChild(computerlist[childKey].sprite, 2);

                    computerlist[childKey].fb.on('value',function(dataSnapshot){
                        var computer_key = dataSnapshot.key();
                        var computer_val = dataSnapshot.val();

                        if(computer_val == null) {
                            if (computerlist[computer_key]) {
                                computerlist[computer_key].fb.off();
                                player_layer.space.removeShape(computerlist[computer_key].sprite.shape);
                                player_layer.space.removeBody(computerlist[computer_key].sprite.body);
                                player_layer.removeChild(computerlist[computer_key].sprite);
                                delete computerlist[computer_key];
                            }
                            return false;
                        }

                        switch (computer_val.move_action) {
                            case 'left':
                                computerlist[computer_key].sprite.leftMove(computer_val.x, computer_val.y);
                                break;
                            case 'up':
                                computerlist[computer_key].sprite.upMove(computer_val.x, computer_val.y);
                                break;
                            case 'right':
                                computerlist[computer_key].sprite.rightMove(computer_val.x, computer_val.y);
                                break;
                            case 'down':
                                computerlist[computer_key].sprite.downMove(computer_val.x, computer_val.y);
                                break;
                        }

                        computerlist[computer_key].sprite.is_fire = computer_val.is_fire;
                    });
                }
            });
        }

        fbUsers.authAnonymously(function(error, authData) {
            if (error) {
                console.log('登入失敗');
            } else {
                firebase_init(authData);
            }
        });
    }
});
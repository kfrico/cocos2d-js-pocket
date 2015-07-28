
cc.game.onStart = function(){
    cc.view.enableRetina(false);

    cc.LoaderScene.preload(resources, function () {
        cc.director.runScene(new roleMenuScene());
    }, this);

};
cc.game.run();



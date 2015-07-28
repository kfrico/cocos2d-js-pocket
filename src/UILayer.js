var UILayer = cc.Layer.extend({
    life_val: null,
    ctor: function(player_layer) {
        this._super();
        
        var win_size = cc.winSize;

        this.player_layer = player_layer;
        this.life_val = this.player_layer.player_sprite.life_val;

        this.life_val_label = new cc.LabelTTF(this.life_val+'/100', 'Arial', 20);
        this.life_val_label.x = this.life_val_label.width + 20;
        this.life_val_label.y = win_size.height - 20;
        
        this.addChild(this.life_val_label);
    },
    setLife: function(life) {
        this.life_val_label.setString(life)
    },
    getLifeString: function() {
        return this.life_val_label.getString();
    },
    onEnter: function() {
        this._super();

        this.schedule(function(){
            if (this.life_val != this.player_layer.player_sprite.life_val) {
                this.setLife(this.player_layer.player_sprite.life_val + '/100');
            } 
        }, 1);
    }
});
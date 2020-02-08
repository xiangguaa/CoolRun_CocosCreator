
cc.Class({
    extends: cc.Component,

    properties: {
        isDebug:false,
        gravity:cc.v2(0,-320),
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isDebug = false;
        cc.director.getPhysicsManager().enabled = true;
        if(this.isDebug){
            var bits = cc.PhysicsManager.DrawBits;
            cc.director.getPhysicsManager().debugDrawFlags = bits.e_aabbBit;
        }
        else{
            cc.director.getPhysicsManager().debugDrawFlags = 0;
        }
        cc.director.getPhysicsManager().gravity = this.gravity;
    },

    start () {

    },

    // update (dt) {},
});

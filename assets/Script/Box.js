// const baseViewJS = require("./BaseView")
cc.Class({
    extends: cc.Component,
    properties: {
        pool:null,
    },


    onLoad () {

    },
    init:function(){
        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
        this.node.x = 500;
        this.node.y = -50;
    },
    // 若碰撞障碍物即视为错过障碍物，错过数目加一
    onBeginContact: function (contact, selfCollider, otherCollider) {
        Global.missBarrelCount_g += 1;
        cc.log("MISS BOX COUNT: "+String(Global.missBarrelCount_g));
    },

    unuse:function(){
        // cc.log("unuse");
    },
    reuse:function(pool,that){

        this.pool=pool;
        this.that = that;
    },
    start () {

    },

    update (dt) {
        this.node.x -= 5;
        if(this.node.convertToWorldSpaceAR(this.node.position).x <= -800){
            // cc.log("BOX 资源回收");
            this.pool.put(this.node);
        }
        
    },
});

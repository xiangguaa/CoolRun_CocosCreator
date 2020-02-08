// 未使用的脚本，在BaseView脚本中挂载有一个定时器，小心删除
cc.Class({
    extends: cc.Component,

    properties: {
        pool:null,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
        this.node.x = 500;
    },
    init:function(){
        
        this.node.x = 500;
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        cc.log(otherCollider.node.getComponent(cc.Animation).currentClip.name)
        // 若喷火时与冰墙相撞，则冰墙融化消失
        if(otherCollider.node.getComponent(cc.Animation).currentClip.name == "Jump"){
            this.pool.put(this.node);      
        }
    },
    unuse:function(){
        // cc.log("unuse");
    },
    reuse:function(pool){
        // cc.log("reuse")
        this.pool=pool;
    },

    start () {

    },

    update (dt) {
        // cc.log(this.node.x)
        this.node.x -= 5;
        if(this.node.convertToWorldSpaceAR(this.node.position).x <= -800){
            // cc.log("ICE 资源回收");
            this.pool.put(this.node);
        }
    },
});

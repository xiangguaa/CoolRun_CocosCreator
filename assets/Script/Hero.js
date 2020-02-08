
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
    },
    
/* ***************************************
英雄和障碍物碰撞监听组件，判断英雄是否处于和障碍物碰撞状态
后续使英雄被障碍物拖行后的位置恢复到屏幕中心
* ****************************************/
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag == 2 || otherCollider.tag == 3){
            this.afterCollision = false;
        }
    },
    onEndContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag == 2 || otherCollider.tag == 3){
            this.afterCollision = true;   
        }
    },
    onDestroy:function(){
        cc.log("hero node destroy")
    },

    start () {

    },

    update (dt) {
        // 恢复英雄位置到屏幕中心
        if(this.afterCollision && this.node.x <= 0 && this.node.y <=-148){
            this.node.x += 2;
        }
        
    },
});

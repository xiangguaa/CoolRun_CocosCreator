cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      
    },
    init:function(){
        this.node.getComponent(cc.RigidBody).enabledContactListener = true;
        this.node.x = this.that.node.getChildByName("Enemy").getPosition()["x"];
        this.node.y = this.that.node.getChildByName("Enemy").getPosition()["y"];
        this.BulletStraight();
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {
        // 若敌人处于防守状态且发生碰撞，则攻击子弹消失
        if(otherCollider.node.getChildByName("protection").getComponent(cc.Animation).currentClip.name == "Protection"){
            this.pool.put(this.node);      
            otherCollider.node.getChildByName("protection").getComponent(cc.Animation).stop("Protection");
            otherCollider.node.getChildByName("protection").getComponent(cc.Animation).play("ProtectionOff");
            Global.defendSuccessCount_g += 1;
            cc.log("DEFEND SUCCESS COUNT: "+String(Global.defendSuccessCount_g));
        }
    },
    unuse:function(){
    },
    reuse:function(pool,that,pos){
        this.pool=pool;
        this.that = that;
        this.heroPos = pos;
    },

    start () {

    },
    BulletCurve:function(){
        var x1 = this.that.node.getChildByName("Hero").getPosition()["x"];
        var y1 = this.that.node.getChildByName("Hero").getPosition()["y"]+55;
        var x2 = this.node.getPosition()["x"];
        var y2 = this.node.getPosition()["y"];
        this.b = (y2*x1**2 - y1*x2**2) / (x2*x1**2 - x1*x2**2);
        this.a = y1 / (x1**2) - (y2*x1**2 - y1*x2**2) / (x1**3*x2 - x1**2*x2**2); 
    },
    BulletStraight:function(){
        var x1 = this.heroPos["x"];
        var y1 = this.heroPos["y"]+55;
        var x2 = this.node.getPosition()["x"];
        var y2 = this.node.getPosition()["y"];
        this.a = (y2-y1) / (x2-x1);
        this.b = y1 - (y2*x1 - y1*x1)/(x1*x2 - x1**2);
    },

    update (dt) {
        this.node.x -= 12;
        this.node.y = this.a*this.node.x + this.b;
        if(this.node.x <= -800){
            // cc.log("Bullet 资源回收");
            this.pool.put(this.node);
        }
    },
});

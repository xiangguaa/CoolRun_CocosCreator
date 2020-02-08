// 游戏主界面
cc.Class({
    extends: cc.Component,

    properties: {
        instruction:cc.Node,    // 游戏帮助
        rank:cc.Node,       // 上一次游戏的信息
        rankText:cc.Node,       // 游戏信息
        level:cc.Node,      // 开始游戏按钮节点
        options:cc.Node,    // 选关
        drumUIAudio: {      // UI鼓点
            default: null,
            type: cc.AudioClip
        }
    },


    onLoad () {
        this.level.getChildByName("tip").opacity = 0;   // 未开发游戏提示信息透明度初始化不显示

        // ...ui初始化
        this.instruction.x = 1500;
        this.rank.x = 1500;
        this.level.x=1500;
        this.options.x=185;
        this.options.y=-44;
    },

/* ***************************************
点击开始游戏按钮，加载选关节点
* ****************************************/
    OnClickPlay:function(){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        this.options.x = 1000;
        this.options.y = 1000;
        this.level.x = 0;
        this.level.y = 0;
        
    },

/* ***************************************
点击查看游戏信息按钮，查询数据并生成游戏信息
数据库查询使用到python-flask库开发的API,在assets/DB文件下
* ****************************************/
    OnClickRank:function(){
        this.rank.x = 0;
        this.rank.y = 0;
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        // 远程数据库获取排名信息
        var xhr = new XMLHttpRequest();
        var url = "http://127.0.0.1:5000/users?name="+String(Global.name_g)+"\
            &missBarrelCount="+String(Global.missBarrelCount_g)+"&defendSuccessCount="+String(Global.defendSuccessCount_g)+"&aliveTime="+String(Global.aliveTime_g)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                cc.log(xhr.responseText);
                cc.log(parseInt(xhr.responseText))
                var rankString ="name : "+String(Global.name_g)+"\nrank number："+String(xhr.responseText)+"\
alive time : "+String(Global.aliveTime_g)+"\n                  defend success : "+String(Global.defendSuccessCount_g)+"\
                \nmiss barrel : "+String(Global.missBarrelCount_g)
                this.rankText.getComponent(cc.Label).string = rankString;

            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },

/* ***************************************
点击游戏帮助功能
* ****************************************/
    OnClickHelp:function(){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        this.instruction.x = 0;
        this.instruction.y = 0;
        cc.log(Date());

    },

/* ***************************************
返回按钮
* ****************************************/
    OnClickReturnMain:function(target,data){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        this.instruction.x = 1500;
        this.rank.x = 1500;
        this.level.x = 1500;
        this.options.x = 185;
        this.options.y = -44;
    },
/* ***************************************
点击开始游戏后的选关功能
* ****************************************/
    onClickSpot:function(target,data){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        switch(data){
            case "spot1":
                cc.director.loadScene("Game");
                break;
            case "spot2":
                // 游戏未开发的tip 逐渐消失
                var tip = this.level.getChildByName("tip");
                tip.opacity = 255;
                this.node.getComponent("HallBaseView").schedule(function() {
                    tip.opacity -= 10;
                }.bind(this), 0.05,25);
                break;
            case "spot3": 
                var tip = this.level.getChildByName("tip");
                tip.opacity = 255;
                this.node.getComponent("HallBaseView").schedule(function() {
                    tip.opacity -= 10;
                }.bind(this), 0.05,25);
                break;
        }
    },

    start () {

    },

});

// 大脑天宫游戏场景

cc.Class({
    extends: cc.Component,

    properties: {
        heroSprite:cc.Animation,    // 英雄上的动画组件
        hero:cc.Node,       // 英雄节点
        defendButton:cc.Button,     // 防御按钮
        obstaclesBox:cc.Prefab,     // 障碍物预制体
        obstaclesIce:cc.Prefab,     // 障碍物预制体
        obstaclesBullet:cc.Prefab,      // 小兵攻击预制体
        jumpCount:0,        // 跳跃次数，用于限制连跳
        gainNode:cc.Node,       // 得分显示节点
        gameEndMask:cc.Node,        // 游戏失败节点
        drumUIAudio: {      // UI点击音效
            default: null,
            type: cc.AudioClip
        },
        bgm: {      // 游戏背景音乐
            default: null,
            type: cc.AudioClip
        },
        story1Start:cc.Label,       //  大闹天宫开篇故事标签
        storyNode:cc.Node,      // 大闹天宫开篇文字故事节点
        enemyNode:cc.Node,      // 敌人节点
        bgNode1:cc.Node,        // 背景节点1
        bgNode2:cc.Node,        // 背景节点2
        editBoxNode:cc.EditBox,     // 游戏结束后输入昵称组件
    },



    onLoad () {
        this.defendSuccessCount = 0;        // 防御敌人攻击成功次数
        this.missBarrelCount = 0;       // 未躲避成功障碍物数
        this.drumTime = new Array(8,12,17,18,21,24,26,28,31,36,38,40,42);   // 背景音乐中鼓点所在位置
        this.drumTimeIndex = 0;     // 鼓点下标  
        this.jumpStory = false;     // 是否跳过文字背景介绍
        this.timeCount = 0;     //
        
        // ...游戏ui图位置初始化
        this.bgNode1.x = -480;      
        this.bgNode1.y = -320;
        this.bgNode2.x = 2400;
        this.bgNode2.y = -320;
        this.enemyNode.x = 1000;
        this.storyNode.x=0;
        this.heroSprite.node.x = 1;
        this.heroSprite.node.y = 350;
        this.gameEndMask.x = 1000;
        this.gameEndMask.y = 1000;

        this.StartStory();      // 初始化文字故事介绍
        this.storyStartOver = false;        // 背景故事是否讲述完毕 
        this.heroSprite.node.getChildByName("protection").opacity = 0;  // 防御特效隐藏

        // ...监听英雄控制按钮
        this.defendButton.node.on(cc.Node.EventType.TOUCH_START, this.DefendTouchStart, this);
        this.defendButton.node.on(cc.Node.EventType.TOUCH_END, this.DefendTouchEnd, this);
        this.defendButton.node.on(cc.Node.EventType.TOUCH_CANCEL, this.DefendTouchEnd, this);
        
        this.InitBoxPool();     // 初始化资源池

        this.heroCollider = this.heroSprite.node.getComponent(cc.PhysicsBoxCollider);   // 获取英雄碰撞组件
        this.isFirstJump = true;        // 是否为第一次跳跃，用于控制连跳
        this.score = this.gainNode.getComponent(cc.Label);       // 得分显示label

        // ...定时生成随机数用于显示障碍物
        this.obstaclesIce.data.getComponent("Ice").schedule(function() {
            this.randomTime = Math.floor(Math.random()*3+1);
            this.timer = 0;
        }.bind(this), 4);

        
        
        // 得分逻辑，生存时间越久，得分越高。
        var intvA = setInterval(() => {
            if(this.heroSprite.node != null){
                this.score.string = String(parseInt(this.score.string)+1)
                Global.aliveTime_g=parseInt(this.score.string);
            }
        }, 1000);
    
        
    },

/* ***************************************
将用户游戏结束后输入的名称传递给游戏主界面场景
* ****************************************/
    AfterEnterName:function(){
        Global.name_g = this.editBoxNode.string;
    },

/* ***************************************
开篇的文字背景介绍
* ****************************************/
    StartStory:function(){
        this.story1Start.string = "";
        var s1s = "石猴为天地而生，自有一股戾气在心中积攒\n\
自打在三星洞学了些法术变化便愈发顽固\n\
自恃法术高强，占山为王，自封为齐天大圣\n\n\
引来天庭围剿，几经波折\n\
竟是对高高在上的天庭愈发不满\n\
遂上演了一出大闹天宫的好戏...";
        var i = 0;
        this.storyNode.getComponent("Story").schedule(function() {
            if(this.jumpStory == false){
                if(i >= s1s.length){
                    this.storyNode.opacity -= 25;
                    i += 1;
                }else{
                    this.story1Start.string += s1s[i];
                    i +=1;  
                }
                if(i == (s1s.length+9)){
                    this.storyStartOver = true;
                    this.bgmID = cc.audioEngine.playMusic(this.bgm, false);
                    this.storyNode.destroy();
                }
            }
        }.bind(this), 0.1, s1s.length+9, 0.1);
    },
    
/* ***************************************
跳过文字背景介绍
* ****************************************/
    OnClickJumpStory:function(){
        var i =0;
        this.jumpStory = true;
        this.storyNode.getComponent("Story").schedule(function() {
                this.storyNode.opacity -= 25;
                i += 1;
            if(i == 9){
                this.storyStartOver = true;
                this.bgmID = cc.audioEngine.playMusic(this.bgm, false);
                this.storyNode.destroy();
            }
        }.bind(this), 0.1, 10, 0.1);
    },

/* ***************************************
初始化资源池
* ****************************************/ 
    InitBoxPool:function(){
        this.boxPool = new cc.NodePool("Box");
        this.icePool = new cc.NodePool("Ice");
        this.bulletPool = new cc.NodePool("Bullet");

        let initCount = 5;
        for (let i = 0; i < initCount; ++i) {
            let box = cc.instantiate(this.obstaclesBox); // 创建节点
            this.boxPool.put(box); // 通过 put 接口放入对象池
            let ice = cc.instantiate(this.obstaclesIce); 
            this.icePool.put(ice); 
            let bullet = cc.instantiate(this.obstaclesBullet); 
            this.bulletPool.put(bullet); 
        }
    },

/* ***************************************
创建资源池资源:CreateBox、CreateIce、CreateBullet
本游戏中只使用到了CreateBullet和CreateBox，可在update中手动修改
* ****************************************/
    CreateBox: function (parentNode) {
        let box = null;
        if (this.boxPool.size() > 0) { 
            // 获取资源池资源，并将this.boxPool和this指针传递至挂载在创建的资源上的脚本文件中
            box = this.boxPool.get(this.boxPool,this);  
        } else { 
            box = cc.instantiate(this.boxPrefab);
        }
        box.parent = parentNode; 
        box.getComponent('Box').init(); 
    },
    CreateIce: function (parentNode) {
        let ice = null;
        if (this.icePool.size() > 0) { 
            ice = this.icePool.get(this.icePool);
        } else { 
            ice = cc.instantiate(this.icePrefab);
        }
        ice.parent = parentNode; 
        ice.getComponent('Ice').init(); 
    },
    CreateBullet: function (parentNode) {
        let bullet = null;
        if (this.bulletPool.size() > 0) { 
            bullet = this.bulletPool.get(this.bulletPool,this,this.heroSprite.node.getPosition());
        } else { 
            bullet = cc.instantiate(this.bulletPrefab);
        }
        bullet.parent = parentNode; 
        bullet.getComponent('Bullet').init(); 
    },
    OnBoxDisapper: function (box) {
        this.boxPool.put(box); 
    },

/* ***************************************
跳跃按钮监听，同时通过跳跃次数累加和英雄相对地面位置控制连跳
* ****************************************/
    OnClickJump:function(target,data){
        this.heroBody = this.node.getChildByName("Hero").getComponent(cc.RigidBody);
        var v = this.heroBody.linearVelocity;
        
        //  次数的归零判断条件需根据障碍物的高度，地面的高度改变。
        if(this.heroSprite.node.y <= -148 || (this.heroSprite.node.y >= -50 && this.heroSprite.node.y <= -48)){
            this.afterJump = false
            this.jumpCount = 0;
        }
        if(this.heroSprite.node.x < 0){
            v.y = 300;
            v.x = 100;
            this.heroBody.linearVelocity = v;

        }else{
            if(this.jumpCount != 2 ){
                v.y = 300;
                v.x = 0;
                this.afterJump = true;
                this.heroBody.linearVelocity = v;
                this.jumpCount += 1;
            }
        }
        
        if(this.jumpCount == 2 && this.heroSprite.node.y >= -148){
            return
        }
        
    },

/* ***************************************
...防守按钮监听：展示防守特效
* ****************************************/
    DefendTouchStart:function(){
        this.defendTime = cc.audioEngine.getCurrentTime(this.bgmID);
        this.defendState = true;
        var moveDown = cc.moveBy(0, cc.v2(0, -5));
        this.heroSprite.node.runAction(moveDown);
        this.heroSprite.node.getChildByName("protection").getComponent(cc.Animation).play("Protection");
        this.heroSprite.node.getChildByName("protection").opacity = 255;
        
        this.heroCollider.offset = cc.v2(-96,1100);
        this.heroCollider.size.height = 2099;
        this.heroCollider.size.width = 1628;
        this.heroCollider.apply()
    },
    DefendTouchEnd:function(){
        this.node.getComponent("BaseView").scheduleOnce(function() {
            this.heroSprite.node.getChildByName("protection").getComponent(cc.Animation).stop("Protection");
            this.heroSprite.node.getChildByName("protection").opacity = 0;
            this.defendState = false;
        }, 0.5);
        var moveDown = cc.moveBy(0, cc.v2(0, 5));
        this.heroSprite.node.runAction(moveDown);
        this.heroSprite.play('Run');

        this.heroCollider.offset = cc.v2(-542,684);
        this.heroCollider.size.height = 1267;
        this.heroCollider.size.width = 736;
        this.heroCollider.apply()    
    },

/* ***************************************
...游戏结束后的按钮功能:Return返回主界面、Replay重玩
* ****************************************/
    OnClickReturn:function(target,data){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        cc.director.loadScene("Hall");

    },
    OnClickReplay:function(target,data){
        var audioID = cc.audioEngine.playEffect(this.drumUIAudio, false);
        cc.director.loadScene("Game");

    },


    update (dt) { 
        // ...背景图流动
        if(this.bgNode1.x <= -3360){
            this.bgNode1.x = 2400;
        }
        if(this.bgNode2.x <= -3360){
            this.bgNode2.x = 2400;
        }     
        this.bgNode1.x-=5;
        this.bgNode2.x-=5;

        // 在背景音乐鼓点处显示敌人的子弹
        var timeIntv = this.drumTime[this.drumTimeIndex] - cc.audioEngine.getCurrentTime(this.bgmID);
        if(timeIntv >0 && timeIntv <0.04){
            this.CreateBullet(this.node.getChildByName("obstacles"));
            this.drumTimeIndex += 1;
        }




        // 开篇故事结束后的操作
        if(this.storyStartOver){
            if(this.timer > this.randomTime){
                //  随机生成障碍物
                if(Math.round(Math.random()) == 0){
                }else{
                    this.CreateBox(this.node.getChildByName("obstacles"));
                }
                this.timer = 0;
            }
            this.timer += dt;
            
            // 英雄超出屏幕，则游戏失败
            if(this.heroSprite.node != null){
                if(this.heroSprite.node.x <= -600){
                    this.heroSprite.node.destroy();
                    cc.log("global : "+Global.aliveTime_g)
                    cc.audioEngine.stopMusic();
                    this.gameEndMask.x = 0;
                    this.gameEndMask.y = 0;    
                }
            }
            if(this.enemyNode.x >= 400){
                this.enemyNode.x -= 5;
            }
            
        }

    },
});

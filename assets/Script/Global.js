// 存储全局变量
window.Global = {
    defendSuccessCount_g: 0,//TINYINT 防御成功次数
    missBarrelCount_g: 0,//TINYINT 与障碍物碰撞次数
    perBarrelToggleTime_g:15,// UNUSED
    aliveTime_g:0,//SMALLINT 存活时间
    rankNo_g:0,//TINYINT 排名
    name_g:'default',//CHAR 昵称
    date_g:'',

};
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});

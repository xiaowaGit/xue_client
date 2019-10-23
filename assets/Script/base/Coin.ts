
const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    @property(cc.Sprite)
    spr_tips1: cc.Sprite = null;

    @property(cc.Sprite)
    spr_tips2: cc.Sprite = null;

    @property(cc.Sprite)
    spr_tips3: cc.Sprite = null;


    ///////////////// 金币组件
    @property(cc.Prefab)
    node_coin: cc.Prefab = null;


    // onLoad () {}

    start () {

    }

    play(total_reward:number) {
        let multiple:number = 1;
        if(total_reward < 1000) {
            multiple = 1;
        }else if (total_reward >= 1000 && total_reward < 3000) {
            multiple = 2;
        }else if (total_reward >= 3000) {
            multiple = 3;
        }

        if (multiple == 1) {
            this.spr_tips1.node.active = true;
            this.spr_tips2.node.active = false;
            this.spr_tips3.node.active = false;
        }else if (multiple == 2) {
            this.spr_tips1.node.active = false;
            this.spr_tips2.node.active = true;
            this.spr_tips3.node.active = false;
        }else if (multiple == 3) {
            this.spr_tips1.node.active = false;
            this.spr_tips2.node.active = false;
            this.spr_tips3.node.active = true;
        }

        ///// 有几波金币
        for (let index = 0; index < multiple; index++) {
            let coin_num:number = multiple * 10;
            for (let i = 0; i < coin_num; i++) {
                let node:cc.Node = cc.instantiate(this.node_coin);
                let coin:cc.Animation = node.getComponent(cc.Animation);
                let l:number = 400;
                let angle:number = Math.random() * 360;
                let radian:number = angle * Math.PI / 180;    //计算出弧度
                let x:number = Math.sin(radian) * l;
                let y:number = Math.cos(radian) * l;
                let action = cc.moveBy(1,x,y);
                if (index == 0) {
                    this.node.addChild(node);
                    node.runAction(action);
                }else if (index == 1) {
                    this.node.addChild(node);
                    let action2 = cc.delayTime(0.5);
                    node.runAction(cc.sequence(action2,action));
                }else if (index == 2) {
                    this.node.addChild(node);
                    let action2 = cc.delayTime(1);
                    node.runAction(cc.sequence(action2,action));
                }
                node.scale = 1.33;
                coin.play('coin');
            }
        }
    }

    // update (dt) {}
}

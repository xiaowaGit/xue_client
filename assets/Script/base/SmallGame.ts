
const {ccclass, property} = cc._decorator;

@ccclass
export default class SmallGame extends cc.Component {

    @property(cc.Node)
    node_image_list:cc.Node = null;

    @property(cc.Node)
    node_exp:cc.Node = null;

    @property(cc.Node)
    node_info:cc.Node = null;

    @property(cc.Label)
    lbl_num:cc.Label = null;

    @property(cc.Node)
    node_slot_in:cc.Node = null;

    @property(cc.Node)
    node_slot_out:cc.Node = null;

    @property(cc.SpriteFrame)
    spr_frame_light:cc.SpriteFrame = null;
    
    // 旋转次数
    private slot_num:number = 0;

    private grid_list:number[][] = [[-632,400],[-424,400],[-216,400],[-8,400],[200,400],[408,400],[626,400],
                                    [626,267],[626,134],[626,1],[626,-132],[626,-265],
                                    [626,-400],[408,-400],[200,-400],[-8,-400],[-216,-400],[-424,-400],[-632,-400],
                                    [-626,-265],[-626,-132],[-626,1],[-626,134],[-626,267],
                                ];
    
    start () {

    }

    init(num:number) {
        this.slot_num = num;
        this.lbl_num.string = ""+num;
    }

    start_slot() {
        this.slot_to_index(0);
    }

    slot_to_index(index:number) {
        let length:number = index + this.grid_list.length * 2;
        let action_arr = [];
        for (let i = 0; i <= length; i++) {
            let action = cc.callFunc(function () {
                if (i == length) {
                    this.light_slot(i,false);
                }else{
                    this.light_slot(i,true);
                }
            },this);
            let finished = cc.delayTime(i*0.002+0.01);
            action_arr.push(action);
            action_arr.push(finished);
        }
        let action = cc.sequence(action_arr);
        this.node.runAction(action);
    }

    light_slot(index:number,remove:boolean = false) {
        let node:cc.Node = new cc.Node();
        node.addComponent(cc.Sprite);
        let spr:cc.Sprite = node.getComponent(cc.Sprite);
        spr.spriteFrame = this.spr_frame_light;
        node.scale = 1.33;
        let i:number = index % this.grid_list.length;
        let grid:number[] = this.grid_list[i];
        node.x = grid[0];
        node.y = grid[1];
        let action:cc.ActionInterval = cc.fadeOut(1);
        let finished = cc.callFunc(function(){
            node.removeFromParent(false);
        }, this);
        let fadeOutFinish = cc.sequence(action,finished);
        if (remove == false) {
            let finish = cc.callFunc(function(){
                node.opacity = 255;
            }, this);
            let fadeOut = cc.sequence(action,finish);
            node.runAction(fadeOut);
        }else{
            node.runAction(fadeOutFinish);
        }
        this.node_slot_out.addChild(node);
    }
    // update (dt) {}
}

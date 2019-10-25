import Slot from "./Slot";
import { Image_Slot } from "../utils/tool";
import { GameUtils } from "../utils/GameUtils";
import Alert from "./Alert";

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
    lbl_bet:cc.Label = null;
    @property(cc.Label)
    lbl_reward:cc.Label = null;
    @property(cc.Label)
    lbl_put_bet:cc.Label = null;


    @property(cc.Label)
    lbl_num:cc.Label = null;

    @property(cc.Node)
    node_slot_in:cc.Node = null;

    @property(cc.Node)
    node_slot_out:cc.Node = null;

    @property(cc.SpriteFrame)
    spr_frame_light:cc.SpriteFrame = null;
    
    ///////////////// slot组件
    @property(cc.Prefab)
    slotPrefab: cc.Prefab = null;


    /////////////
    @property(cc.Sprite)
    spr_start: cc.Sprite = null;

    @property(cc.Button)
    btn_start: cc.Button = null;
    
    ///////////////// 弹窗组件
    @property(cc.Prefab)
    alertPrefab: cc.Prefab = null;


    private slot_y:number = -8;
    private slot_move_x:number = -485/2;
    /// slot
    private slot_list:Slot[] = [];

    // 旋转次数
    private slot_num:number = 0;
    /// 总计奖励
    private total_reward:number = 0;

    private grid_list:number[][] = [[-632,400],[-424,400],[-216,400],[-8,400],[200,400],[408,400],[626,400],
                                    [626,267],[626,134],[626,1],[626,-132],[626,-265],
                                    [626,-400],[408,-400],[200,-400],[-8,-400],[-216,-400],[-424,-400],[-632,-400],
                                    [-626,-265],[-626,-132],[-626,1],[-626,134],[-626,267],
                                ];

    /////////// 水果对应格子
    private static image_for_grid:number[][] = [
        [0,6,12,18], // 炸弹
        [1,8,13],    // 香蕉
        [3,7,19],    // 西瓜
        [11,16,22],  // 芒果
        [4,17,23],   // 葡萄
        [5,14,20],   // 菠萝
        [0],          // 
        [2,10,21],   // 樱桃
        [0],
        [9,15],      // Bonus
        [0],
        [0],
    ];
    ////// 主场景 coin lbl
    private lbl_coin: cc.Label;
    
    private alertDialog: cc.Node;
    
    start () {
        let o_x:number = this.slot_move_x * 2 + 120;
        let o_y:number = this.slot_y;
        for (let i = 0; i < 4; i++) {
            let one_slot:cc.Node = cc.instantiate(this.slotPrefab);
            one_slot.x = o_x;
            one_slot.y = o_y;
            o_x -= this.slot_move_x;
            this.node_slot_in.addChild(one_slot);
            let slot:Slot = one_slot.getComponent(Slot);
            slot.init(true);
            this.slot_list.push(slot);
        }
        
        this.alertDialog = cc.instantiate(this.alertPrefab);
        this.alertDialog.x = GameUtils.centre_x;
        this.alertDialog.y = GameUtils.centre_y;
        this.node.addChild(this.alertDialog);

        this.btn_start.node.on("click",this.start_up.bind(this),this);

    }

    init(num:number,current_coin:number,put_bet:number,lbl_coin:cc.Label) {
        this.slot_num = num;
        this.lbl_num.string = "" + num;
        this.lbl_bet.string = "" + current_coin;
        this.lbl_put_bet.string = "" + put_bet;
        this.total_reward = 0;
        this.lbl_reward.string = "" + this.total_reward;
        this.lbl_coin = lbl_coin;
        this.node.active = true;
        this.spr_start.node.active = true;
    }


    start_slot(out_image:Image_Slot,in_images:Image_Slot[]) {
        let arr:number[] = SmallGame.image_for_grid[out_image];
        let rnd:number = Math.floor(Math.random() * arr.length);
        this.slot_to_index(arr[rnd]);
        this.slot_list[0].start_up([in_images[0]],50,2);
        this.slot_list[1].start_up([in_images[1]],50,2.4);
        this.slot_list[2].start_up([in_images[2]],50,2.8);
        this.slot_list[3].start_up([in_images[3]],50,3.2);
    }

    slot_to_index(index:number) {
        this.node_slot_out.removeAllChildren();
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
            let finished = cc.delayTime(i*0.001+0.01);
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
    
    /**
     * 更新 信息
     */
    update_info(total_reward:number,small_game_num:number,current_coin:number) {
        this.total_reward += total_reward;
        this.slot_num = small_game_num;
        
        this.lbl_num.string = "" + this.slot_num;
        this.lbl_bet.string = "" + current_coin;
        this.lbl_reward.string = "" + this.total_reward;
        this.lbl_coin.string = "" + current_coin;
    }

    close_panel() {
        this.node.active = false;
    }

    ///////////////////////////////////////////////// 业务逻辑//////////////////////////////////
    
    start_up() {
        this.spr_start.node.active = false;
        let self = this;
        let alert:Alert = this.alertDialog.getComponent(Alert);
        let pinus = GameUtils.getInstance().pinus;
        function run() {
            ///// 开始slot
            let route = "mary_slot.marySlotHandler.small_put_bet";
            pinus.request(route, {
            }, function(data) {
                if(data.error) {
                    console.log("xiaowa ========= entry fail");
                    return;
                }else{
                    cc.log(data);
                    if (data.code && data.code != 0) {
                        alert.showAlert(data.data, function(){
                        }, false);
                        return;
                    }else{
                        let {out_image,in_images,multiple,is_next,total_reward,small_game_num,current_coin} = data;
                        self.start_slot(out_image,in_images);
                        setTimeout(()=>{
                            self.update_info(total_reward,small_game_num,current_coin);
                            if (self.slot_num > 0) {
                                run();
                            }else{ /// 关闭小游戏面板
                                self.close_panel();
                            }
                        },5000);
                    }
                }
            });
        }

        run();
    }
}
